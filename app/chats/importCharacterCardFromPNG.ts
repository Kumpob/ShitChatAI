import {
  selectImageFile,
  processImage,
  checkWebPSupport,
  loadImage,
  calculateDimensions,
  optimizeToTargetSize,
  estimateBase64Size,
} from "./imageUtils";

interface CharacterSetters {
  setNewCharacterName: React.Dispatch<React.SetStateAction<string>>;
  setNewCharacterAlias: React.Dispatch<React.SetStateAction<string>>;
  setNewCharacterFirstMessage: React.Dispatch<React.SetStateAction<string>>;
  setNewCharacterScenario: React.Dispatch<React.SetStateAction<string>>;
  setNewCharacterPersonality: React.Dispatch<React.SetStateAction<string>>;
  setNewCharacterStoryContent: React.Dispatch<React.SetStateAction<string>>;
  setTempCharacterImage: React.Dispatch<
    React.SetStateAction<{ thumbnail?: string; fullImage?: string }>
  >;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const importCharacterCardFromPNGFunc = (
  event: React.ChangeEvent<HTMLInputElement>,
  setters: CharacterSetters,
): void => {
  const {
    setNewCharacterName,
    setNewCharacterAlias,
    setNewCharacterFirstMessage,
    setNewCharacterScenario,
    setNewCharacterPersonality,
    setNewCharacterStoryContent,
    setTempCharacterImage,
    setToastMessage,
  } = setters;

  const file = event.target.files?.[0];
  if (!file || !file.type.includes("png")) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (!arrayBuffer) return;

      // Extract metadata from PNG
      const textDecoder = new TextDecoder("utf-8");
      const latin1Decoder = new TextDecoder("latin1"); // For text content
      const dataView = new DataView(arrayBuffer);

      // PNG signature check (first 8 bytes)
      const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
      for (let i = 0; i < 8; i++) {
        if (dataView.getUint8(i) !== pngSignature[i]) {
          throw new Error("Not a valid PNG file");
        }
      }

      // Look for tEXt chunks that contain character data
      let offset = 8;
      let characterData: any = null;

      while (offset < dataView.byteLength) {
        const length = dataView.getUint32(offset);
        offset += 4;

        const chunkType = textDecoder.decode(
          new Uint8Array(arrayBuffer, offset, 4),
        );
        offset += 4;

        if (chunkType === "tEXt") {
          const keywordData = new Uint8Array(arrayBuffer, offset, 80); // Read first 80 bytes for keyword
          let keywordEnd = 0;
          while (
            keywordEnd < keywordData.length &&
            keywordData[keywordEnd] !== 0
          ) {
            keywordEnd++;
          }

          const keyword = textDecoder.decode(keywordData.slice(0, keywordEnd));

          if (
            keyword === "chara" ||
            keyword === "character" ||
            keyword === "prompt"
          ) {
            const dataStart = offset + keywordEnd + 1; // +1 for null separator
            const textData = new Uint8Array(
              arrayBuffer,
              dataStart,
              length - keywordEnd - 1,
            );
            const textContent = latin1Decoder.decode(textData); // Use Latin1 for text content

            try {
              // First try to decode as base64
              const decoded = atob(textContent);
              // Convert the base64-decoded string to proper UTF-8
              const utf8Bytes = new Uint8Array(decoded.length);
              for (let i = 0; i < decoded.length; i++) {
                utf8Bytes[i] = decoded.charCodeAt(i);
              }
              const utf8Decoder = new TextDecoder("utf-8");
              const utf8String = utf8Decoder.decode(utf8Bytes);
              characterData = JSON.parse(utf8String);
              break;
            } catch (base64Error) {
              // If base64 fails, try parsing directly
              try {
                characterData = JSON.parse(textContent);
                break;
              } catch (parseError) {
                console.log("Could not parse character data:", parseError);
              }
            }
          }
        }

        offset += length + 4; // Skip data and CRC
      }

      if (characterData) {
        // Extract data with fallbacks (different formats)
        console.log("Character data:", characterData);
        const name =
          characterData.name ||
          characterData.data?.name ||
          "Imported Character";
        const firstMessage =
          characterData.first_mes ||
          characterData.firstMessage ||
          characterData.data?.first_mes ||
          "";
        const scenario =
          characterData.scenario || characterData.data?.scenario || "";

        // Combine description and personality
        const description =
          characterData.description || characterData.data?.description || "";
        const personality =
          characterData.personality || characterData.data?.personality || "";

        let combinedPersonality = "";
        let storyContent = "";

        // Check for HTML content in personality
        if (
          personality.trim().startsWith("<") ||
          personality.includes("<p") ||
          personality.includes("<div")
        ) {
          storyContent = personality;
          // If personality is just HTML, leave combinedPersonality empty (or just description)
          combinedPersonality = description;
        } else {
          combinedPersonality = [description, personality]
            .filter((text) => text.trim())
            .join("\n\n")
            .trim();
        }

        // Fill the form fields with imported data
        setNewCharacterName(name);
        setNewCharacterAlias("");
        setNewCharacterFirstMessage(firstMessage);
        setNewCharacterScenario(scenario);
        setNewCharacterPersonality(combinedPersonality);
        setNewCharacterStoryContent(storyContent);

        // Also extract the image itself for use as character image
        const img = new Image();
        img.onload = () => {
          // Create a canvas to process the image
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(img, 0, 0);

            // Create both thumbnail and full image versions
            Promise.all([
              processImage(file, 5, 200), // Thumbnail
              processImage(file, 75, 1200), // Full image
            ]).then(([thumbnail, fullImage]) => {
              setTempCharacterImage({ thumbnail, fullImage });
            });
          }
        };
        img.src = URL.createObjectURL(file);

        setToastMessage("Character data extracted from PNG!");
      } else {
        // No character data found, just use the image
        const img = new Image();
        img.onload = () => {
          // Create a canvas to process the image
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(img, 0, 0);

            // Create both thumbnail and full image versions
            Promise.all([
              processImage(file, 5, 200), // Thumbnail
              processImage(file, 75, 1200), // Full image
            ]).then(([thumbnail, fullImage]) => {
              setTempCharacterImage({ thumbnail, fullImage });
            });
          }
        };
        img.src = URL.createObjectURL(file);

        setToastMessage("PNG imported as image (no character data found)");
      }
    } catch (error) {
      console.error("Error processing PNG file:", error);
      setToastMessage("Error processing PNG file");
    }
  };

  reader.onerror = () => {
    setToastMessage("Error reading file");
  };

  reader.readAsArrayBuffer(file);
};
