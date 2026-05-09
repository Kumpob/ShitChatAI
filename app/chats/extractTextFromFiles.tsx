"use client";

export type ExtractedFileText = {
  fileName: string;
  fileType: string;
  text: string;
};

const textExtensions = [
  "txt",
  "md",
  "html",
  "htm",
  "json",
  "js",
  "ts",
  "tsx",
  "jsx",
  "css",
  "scss",
  "py",
  "java",
  "c",
  "cpp",
  "cs",
  "go",
  "rs",
  "php",
  "rb",
  "xml",
  "yaml",
  "yml",
  "sql",
  "sh",
];

// Lazily initialised so the module is never evaluated on the server.
let pdfjsLib: typeof import("pdfjs-dist") | null = null;

async function getPdfjs() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

export async function extractTextFromFiles(
  files: FileList | File[],
): Promise<ExtractedFileText[]> {
  const fileArray = Array.from(files);

  const results = await Promise.all(
    fileArray.map(async (file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";

      try {
        // Plain text-like files
        if (textExtensions.includes(extension)) {
          const text = await file.text();

          return {
            fileName: file.name,
            fileType: extension,
            text,
          };
        }

        // PDF
        if (extension === "pdf") {
          const pdfjs = await getPdfjs();
          const buffer = await file.arrayBuffer();

          const pdf = await pdfjs.getDocument({ data: buffer }).promise;

          let text = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item: any) => item.str);
            text += strings.join(" ") + "\n";
          }

          return {
            fileName: file.name,
            fileType: extension,
            text,
          };
        }

        // DOCX
        if (extension === "docx") {
          const { default: mammoth } = await import("mammoth");
          const buffer = await file.arrayBuffer();

          const result = await mammoth.extractRawText({ arrayBuffer: buffer });

          return {
            fileName: file.name,
            fileType: extension,
            text: result.value,
          };
        }

        // Unsupported file
        return {
          fileName: file.name,
          fileType: extension,
          text: "[Unsupported file type]",
        };
      } catch (err) {
        return {
          fileName: file.name,
          fileType: extension,
          text: `[Error reading file: ${
            err instanceof Error ? err.message : "Unknown error"
          }]`,
        };
      }
    }),
  );

  return results;
}
