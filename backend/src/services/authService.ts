import { type AuthState } from "../../../shared/types";
import { dataPaths } from "../constants/dataPaths";
import { ensureJsonFile, writeJsonFile } from "../utils/jsonFile";

const defaultAuthState: AuthState = {
  password: null,
};

const isAuthState = (value: unknown): value is AuthState => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);

  if (keys.length !== 1 || !keys.includes("password")) {
    return false;
  }

  return record.password === null || typeof record.password === "string";
};

export const readAuthState = (): AuthState =>
  ensureJsonFile(dataPaths.auth, defaultAuthState, isAuthState);

export const writeAuthState = (state: AuthState) => {
  writeJsonFile(dataPaths.auth, state);
};
