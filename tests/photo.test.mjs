import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { normalizedPhoto } from "../src/lib/server/photo.ts";

test("server photo normalization crops and strips metadata", async () => {
  const input = await sharp({ create: { width: 640, height: 320, channels: 3, background: "green" } }).withMetadata({ exif: { IFD0: { Artist: "Private metadata" } } }).jpeg().toBuffer();
  const output = await normalizedPhoto(input);
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.width, 256);
  assert.equal(metadata.height, 256);
  assert.equal(metadata.format, "jpeg");
  assert.equal(metadata.exif, undefined);
  assert.ok(output.length < 150_000);
});

test("corrupt images and excessive decoded sizes are rejected", async () => {
  await assert.rejects(normalizedPhoto(Buffer.from([0xff, 0xd8, 0x01, 0xff, 0xd9])));
  const large = await sharp({ create: { width: 2048, height: 2048, channels: 3, background: "white" } }).jpeg().toBuffer();
  await assert.rejects(normalizedPhoto(large), /pixel limit/);
});
