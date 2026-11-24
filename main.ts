import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const LINE =
  "I promise to back you up every night, restore you when you crash, and never, ever factory-reset you in a fight.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}
mkdirSync(outDir, { recursive: true });
const path = join(outDir, "entry.txt");
writeFileSync(path, LINE, "utf8");

// Read-back self-check: what was written must be exactly the vow.
const back = readFileSync(path, "utf8");
if (back !== LINE) {
  throw new Error("entry.txt mismatch after write");
}
if (back.length < 1 || back.length > 160) {
  throw new Error(`entry length ${back.length} outside gate 1-160`);
}
if (back.endsWith("\n")) {
  throw new Error("entry.txt has a trailing newline");
}
if (back.includes("\n")) {
  throw new Error("entry.txt is not a single line");
}
const byteLen = Buffer.byteLength(back, "utf8");
if (byteLen !== back.length) {
  throw new Error("entry.txt is not pure ASCII as expected");
}
console.log(
  `entry.txt OK: ${back.length} chars, sha256 ${createHash("sha256").update(back, "utf8").digest("hex")}`,
);
