import fs from "fs";

export function convertLogToJSON(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, "utf8").trim();

    const rawObjects = raw.split(/\}\s*\n\s*\{/).map((chunk, i, arr) => {
      if (i === 0) return chunk + "}";
      if (i === arr.length - 1) return "{" + chunk;
      return "{" + chunk + "}";
    });

    const parsed = rawObjects.map((block) => {
      let fixed = block
        .replace(/([{,]\s*)([A-Za-z0-9_.-]+)\s*:/g, '$1"$2":')
        .replace(/'([^']*)'/g, '"$1"');

      return JSON.parse(fixed);
    });

    return parsed;
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
}
