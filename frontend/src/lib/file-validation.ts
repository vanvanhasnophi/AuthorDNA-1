const ALLOWED_MIMES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_EXTENSIONS = [".doc", ".docx", ".pdf"];
const MAX_FILES = 10;

export type FileValidationResult = {
  valid: File[];
  errors: { file: File; reason: string }[];
};

function hasAllowedExtension(name: string): boolean {
  const ext = "." + name.split(".").pop()?.toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

export function validateFiles(
  fileList: File[],
  currentCount: number,
): FileValidationResult {
  const result: FileValidationResult = { valid: [], errors: [] };

  for (const file of fileList) {
    const extOk = hasAllowedExtension(file.name);
    const mimeOk = ALLOWED_MIMES.has(file.type);

    if (!extOk && !mimeOk) {
      result.errors.push({
        file,
        reason: `"${file.name}" is not a supported format. Only .doc, .docx, and .pdf files are accepted.`,
      });
      continue;
    }

    if (currentCount + result.valid.length >= MAX_FILES) {
      result.errors.push({
        file,
        reason: `Cannot add "${file.name}" — maximum ${MAX_FILES} files.`,
      });
      continue;
    }

    result.valid.push(file);
  }

  return result;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
