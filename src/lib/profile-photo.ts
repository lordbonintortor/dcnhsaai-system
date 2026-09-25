const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_PHOTO_LENGTH = 150_000;
const AVATAR_SIZE = 256;

// Only locally resized JPEGs are stored; older demo profiles may have no photo.
export function isProfilePhoto(value: unknown): value is string {
  return typeof value === "string" && (value === "" || (
    value.length <= MAX_PHOTO_LENGTH && /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value)
  ));
}

export async function prepareProfilePhoto(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Choose a JPG, PNG, or WebP photo.");
  }
  if (file.size > MAX_FILE_BYTES) throw new Error("Choose a photo smaller than 5 MB.");
  if (!file.size) throw new Error("This file is empty. Choose another photo.");

  const url = URL.createObjectURL(file);
  try {
    const source = new Image();
    source.src = url;
    try { await source.decode(); }
    catch { throw new Error("This photo could not be opened. Choose another JPG, PNG, or WebP file."); }
    if (!source.naturalWidth || !source.naturalHeight || source.naturalWidth * source.naturalHeight > 40_000_000) {
      throw new Error("This photo is too large to process. Choose a smaller image.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_SIZE;
    canvas.height = AVATAR_SIZE;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not prepare this photo. Please try again.");
    const side = Math.min(source.naturalWidth, source.naturalHeight);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    context.drawImage(source, (source.naturalWidth - side) / 2, (source.naturalHeight - side) / 2, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
    const photo = canvas.toDataURL("image/jpeg", 0.85);
    if (!isProfilePhoto(photo)) throw new Error("This photo could not be resized. Please choose another image.");
    return photo;
  } finally {
    URL.revokeObjectURL(url);
  }
}
