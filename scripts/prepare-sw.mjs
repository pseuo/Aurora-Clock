import { readdir, readFile, writeFile } from "node:fs/promises";

const swPath = new URL("../dist/sw.js", import.meta.url);
const assetDirectory = new URL("../dist/assets/", import.meta.url);
const assetNames = await readdir(assetDirectory, { recursive: true });
const precacheAssets = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-192.png",
  "./icon-maskable-512.png",
  ...assetNames
    .filter((name) => !name.endsWith("/"))
    .map((name) => `./assets/${name.replaceAll("\\", "/")}`),
];
const buildVersion =
  process.env.GITHUB_SHA?.slice(0, 12) || Date.now().toString(36);
const source = await readFile(swPath, "utf8");
const prepared = source
  .replace("__BUILD_VERSION__", buildVersion)
  .replace(
    /const PRECACHE_ASSETS = \/\* __PRECACHE_MANIFEST__ \*\/ \[[^;]+\];/,
    `const PRECACHE_ASSETS = ${JSON.stringify(precacheAssets)};`,
  );

await writeFile(swPath, prepared);
