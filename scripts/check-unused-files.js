import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const directories = [
  "server/src",
  "worker/src",
  "db/src",
  "subscribers/accounting/src",
  "subscribers/shipping/src",
];

const extensions = [".ts", ".js"];

function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (extensions.some((ext) => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function isFileUsed(filePath, allFiles) {
  const fileName = filePath
    .split("/")
    .pop()
    .replace(/\.(ts|js)$/, "");

  for (const file of allFiles) {
    if (file === filePath) continue;

    if (
      file.includes(".test.") ||
      file.includes(".spec.") ||
      file.includes("/test/")
    ) {
      continue;
    }

    try {
      const content = readFileSync(file, "utf8");

      if (
        content.includes(`from '${filePath}'`) ||
        content.includes(`from "${filePath}"`) ||
        content.includes(`from './${fileName}'`) ||
        content.includes(`from "./${fileName}"`) ||
        content.includes(`from '../${fileName}'`) ||
        content.includes(`from "../${fileName}"`) ||
        content.includes(`import '${filePath}'`) ||
        content.includes(`import "${filePath}"`) ||
        content.includes(`import './${fileName}'`) ||
        content.includes(`import "./${fileName}"`) ||
        content.includes(`import '../${fileName}'`) ||
        content.includes(`import "../${fileName}"`)
      ) {
        return true;
      }

      if (content.includes(filePath) || content.includes(fileName)) {
        return true;
      }
    } catch (error) {}
  }

  return false;
}

async function main() {
  console.log("🔍 Checking for unused files...\n");

  let unusedFiles = [];

  for (const dir of directories) {
    const dirPath = join(rootDir, dir);

    try {
      const files = getAllFiles(dirPath);

      const nonTestFiles = files.filter(
        (file) =>
          !file.includes(".test.") &&
          !file.includes(".spec.") &&
          !file.includes("/test/"),
      );

      for (const file of nonTestFiles) {
        const allFiles = getAllFiles(join(rootDir, "server/src"))
          .concat(getAllFiles(join(rootDir, "worker/src")))
          .concat(getAllFiles(join(rootDir, "db/src")))
          .concat(getAllFiles(join(rootDir, "subscribers/accounting/src")))
          .concat(getAllFiles(join(rootDir, "subscribers/shipping/src")));

        if (!isFileUsed(file, allFiles)) {
          unusedFiles.push(file);
        }
      }
    } catch (error) {
      console.log(`⚠️  Could not check directory: ${dir}`);
    }
  }

  if (unusedFiles.length === 0) {
    console.log("✅ No unused files found!");
  } else {
    console.log(`❌ Found ${unusedFiles.length} unused files:\n`);
    unusedFiles.forEach((file) => {
      console.log(`   📄 ${file}`);
    });
    console.log("\n💡 Consider removing these files to clean up your project.");
  }
}

main().catch(console.error);
