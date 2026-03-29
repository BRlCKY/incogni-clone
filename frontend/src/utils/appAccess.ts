const ONBOARDING_COMPLETED_KEY = "incogni.onboardingCompleted";
const AUTHENTICATED_KEY = "incogni.isAuthenticated";
const ONBOARDING_PASSWORD_STEP_COMPLETED_KEY = "incogni.onboardingPasswordStepCompleted";
const PASSWORD_REQUIRED_KEY = "incogni.passwordRequired";

const readBoolean = (storage: Storage, key: string) => storage.getItem(key) === "true";

const writeBoolean = (storage: Storage, key: string, value: boolean) => {
    if (value) {
        storage.setItem(key, "true");
        return;
    }

    storage.removeItem(key);
};

export const getOnboardingCompleted = () => readBoolean(localStorage, ONBOARDING_COMPLETED_KEY);

export const setOnboardingCompleted = (value: boolean) => {
    writeBoolean(localStorage, ONBOARDING_COMPLETED_KEY, value);
};

export const getAuthenticated = () => readBoolean(sessionStorage, AUTHENTICATED_KEY);

export const setAuthenticated = (value: boolean) => {
    writeBoolean(sessionStorage, AUTHENTICATED_KEY, value);
};

export const getOnboardingPasswordStepCompleted = () =>
    readBoolean(sessionStorage, ONBOARDING_PASSWORD_STEP_COMPLETED_KEY);

export const setOnboardingPasswordStepCompleted = (value: boolean) => {
    writeBoolean(sessionStorage, ONBOARDING_PASSWORD_STEP_COMPLETED_KEY, value);
};

export const getPasswordRequired = () => readBoolean(localStorage, PASSWORD_REQUIRED_KEY);

export const setPasswordRequired = (value: boolean) => {
    writeBoolean(localStorage, PASSWORD_REQUIRED_KEY, value);
};
