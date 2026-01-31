/**
 * Helper function to create file input and get the selected file
 */
export const selectImageFile = (): Promise<File> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        resolve(file);
      } else {
        reject(new Error("No file selected"));
      }
    };

    input.onerror = () => reject(new Error("File selection failed"));
    input.click();
  });
};

/**
 * Check if the browser supports WebP format
 */
export const checkWebPSupport = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  } catch (e) {
    return false;
  }
};

/**
 * Load image from URL
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Calculate dimensions maintaining aspect ratio
 */
export const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxDimension: number
): { width: number; height: number } => {
  let width = originalWidth;
  let height = originalHeight;

  if (width > height) {
    if (width > maxDimension) {
      height = (height * maxDimension) / width;
      width = maxDimension;
    }
  } else {
    if (height > maxDimension) {
      width = (width * maxDimension) / height;
      height = maxDimension;
    }
  }

  return { width: Math.round(width), height: Math.round(height) };
};

/**
 * Estimate binary size from Base64 string
 */
export const estimateBase64Size = (base64String: string): number => {
  // Base64 overhead is ~33%, so actual binary size is about 3/4 of string length
  return Math.floor((base64String.length * 3) / 4);
};

/**
 * Optimize image to target file size
 */
export const optimizeToTargetSize = (
  canvas: HTMLCanvasElement,
  targetKB: number,
  format: string = "image/webp"
): Promise<string> => {
  return new Promise((resolve) => {
    const targetBytes = targetKB * 1024;
    let minQuality = 0.1;
    let maxQuality = 1.0;
    let bestResult = "";
    let iterations = 0;
    const maxIterations = 10;

    const optimize = () => {
      if (iterations >= maxIterations) {
        resolve(bestResult || canvas.toDataURL(format, 0.7));
        return;
      }

      const midQuality = (minQuality + maxQuality) / 2;
      const imageData = canvas.toDataURL(format, midQuality);
      const currentSize = estimateBase64Size(imageData);

      if (Math.abs(currentSize - targetBytes) < targetBytes * 0.1) {
        // Within 10% of target - good enough
        resolve(imageData);
        return;
      }

      if (currentSize > targetBytes) {
        // Too big, lower quality
        maxQuality = midQuality;
      } else {
        // Too small, increase quality
        bestResult = imageData;
        minQuality = midQuality;
      }

      iterations++;
      requestAnimationFrame(optimize);
    };

    optimize();
  });
};

/**
 * Process image to target size and format
 */
export const processImage = async (
  file: File,
  targetKB: number,
  maxDimension: number,
  onWebPCheck?: (isWebP: boolean) => void
): Promise<string> => {
  // Check if browser supports WebP
  const supportsWebP = checkWebPSupport();
  if (onWebPCheck) {
    onWebPCheck(supportsWebP);
  }
  
  const format = supportsWebP ? "image/webp" : "image/jpeg";

  // Load image
  const img = await loadImage(URL.createObjectURL(file));

  // Create canvas for processing
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Calculate dimensions maintaining aspect ratio
  const { width, height } = calculateDimensions(
    img.width,
    img.height,
    maxDimension
  );
  canvas.width = width;
  canvas.height = height;

  // Draw and compress image
  ctx.drawImage(img, 0, 0, width, height);

  // Get compressed image as Base64
  return optimizeToTargetSize(canvas, targetKB, format);
};
