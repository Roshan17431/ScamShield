export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg"];
export const ACCEPTED_IMAGE_EXTENSIONS = ".png,.jpg,.jpeg";

export function validateImageFile(file: File): string {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Only PNG, JPG, and JPEG images are supported.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Image must be 10 MB or smaller.";
  }

  return "";
}

export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeInBytes / 1024))} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}
