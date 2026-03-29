import { dataPaths } from "../constants/dataPaths";
import { ensureJsonFile, writeJsonFile } from "../utils/jsonFile";

export type OnboardingState = {
  completed: boolean;
};

const defaultOnboardingState: OnboardingState = {
  completed: false,
};

const isOnboardingState = (value: unknown): value is OnboardingState => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);

  return keys.length === 1 && keys.includes("completed") && typeof record.completed === "boolean";
};

export const readOnboardingState = (): OnboardingState =>
  ensureJsonFile(dataPaths.onboarding, defaultOnboardingState, isOnboardingState);

export const writeOnboardingState = (state: OnboardingState) => {
  writeJsonFile(dataPaths.onboarding, state);
};
