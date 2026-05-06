import { mkdir, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const contentDir = path.join(root, "src", "content");
const publicDir = path.join(root, "public");
const socialDir = path.join(publicDir, "images", "social");
const outputWidth = 1200;
const outputHeight = 630;
const background = "#f6f0e4";

async function listMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return listMarkdownFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
    })
  );

  return files.flat();
}

function getCoverImage(markdown) {
  return markdown.match(/^coverImage:\s*["']?([^"'\r\n]+)["']?/m)?.[1];
}

function isLocalSvg(imagePath) {
  return imagePath?.startsWith("/") && imagePath.toLowerCase().endsWith(".svg");
}

async function generateSocialImage(imagePath) {
  const sourcePath = path.join(publicDir, imagePath.slice(1));
  const outputName = path.basename(imagePath, ".svg") + ".png";
  const outputPath = path.join(socialDir, outputName);

  await sharp(sourcePath, { density: 192 })
    .resize(outputWidth, outputHeight, {
      fit: "contain",
      background
    })
    .flatten({ background })
    .png()
    .toFile(outputPath);

  return outputName;
}

await mkdir(socialDir, { recursive: true });

const markdownFiles = await listMarkdownFiles(contentDir);
const generated = new Set();

for (const file of markdownFiles) {
  const markdown = await readFile(file, "utf8");
  const coverImage = getCoverImage(markdown);

  if (!isLocalSvg(coverImage)) {
    continue;
  }

  generated.add(await generateSocialImage(coverImage));
}

if (generated.size > 0) {
  console.log(
    `Generated ${generated.size} social preview image${generated.size === 1 ? "" : "s"}.`
  );
}
