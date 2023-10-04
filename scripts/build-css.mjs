import fs from "fs/promises";
import { walk } from "node-os-walk";
import path from "path";
import * as sass from "sass";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 *
 * @param {string} filename
 * @returns {boolean}
 */
function isSass(filename) {
  const ext = path.extname(filename);
  return ext === ".sass" || ext === ".scss" || ext === ".css";
}

/**
 *
 * @param {string} filename
 * @returns {boolean}
 */
function isCssModule(filename) {
  const ext = path.extname(filename);
  return filename.endsWith(`.module.${ext}`);
}

async function main() {
  const outFile = path.join(dirname, "../src/app/global.css");
  const srcDir = path.join(dirname, "../src");

  /** @type {string[]} */
  const sassFiles = [];

  for await (const [root, dirs, files] of walk(srcDir)) {
    for (const file of files) {
      const filepath = path.join(root, file.name);
      if (filepath === outFile) continue;
      if (isSass(filepath) && !isCssModule(filepath)) {
        sassFiles.push(path.join(root, file.name));
      }
    }
  }

  const compiledCss = await Promise.all(
    sassFiles.map(async (sassFile) => {
      const compiled = await sass.compileAsync(sassFile, {
        outputStyle: "compressed",
      });

      return `${compiled.css}${
        compiled.map ? "\n/*" + compiled.sourceMap + "*/" : ""
      }`;
    })
  );

  const content = Buffer.from(compiledCss.join("\n\n"), "utf8");

  await fs.writeFile(outFile, content);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
