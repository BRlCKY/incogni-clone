import fs from "node:fs";

const cloneJsonValue = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T;

export const readJsonFile = <T>(path: string): T =>
  JSON.parse(fs.readFileSync(path, "utf8")) as T;

export const writeJsonFile = <T>(path: string, value: T): void => {
  fs.writeFileSync(path, JSON.stringify(value, null, 2));
};

export const ensureJsonFile = <T>(
  path: string,
  fallbackValue: T,
  isValid: (value: unknown) => value is T,
): T => {
  const fallbackCopy = cloneJsonValue(fallbackValue);

  if (!fs.existsSync(path)) {
    writeJsonFile(path, fallbackCopy);
    return fallbackCopy;
  }

  try {
    const rawValue = readJsonFile<unknown>(path);

    if (isValid(rawValue)) {
      return rawValue;
    }
  } catch {
    // If parsing fails we reset to fallback below.
  }

  writeJsonFile(path, fallbackCopy);
  return fallbackCopy;
};
