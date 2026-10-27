import "server-only";
import sharp from "sharp";

// Decode/re-encode on the server too; never trust the browser's crop or MIME label.
export async function normalizedPhoto(bytes: Buffer) {
  return sharp(bytes, { limitInputPixels: 1_048_576, failOn: "warning" })
    .rotate()
    .resize(256, 256, { fit: "cover" })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 85 })
    .toBuffer();
}
