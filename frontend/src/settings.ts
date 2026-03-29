export type IntervalUnit = "days" | "weeks" | "months";
export type MailSecurityMode = "STARTTLS" | "SSL/TLS" | "Keine";

export interface SettingsData {
    messages: {
        auto_start_new_case: {
            enabled: boolean;
            interval: number;
            interval_unit: IntervalUnit;
        };
        notifications: {
            new_case: boolean;
            broker_response: boolean;
            data_deletion: boolean;
        };
        notification_email: string;
    };
    mailserver: {
        smtp_host: string;
        port: number;
        security: MailSecurityMode;
        username: string;
        password: string;
        sender_name: string;
        sender_email: string;
    };
    broker: {
        auto_start_when_added: boolean;
        response_deadline_days: number;
    };
    user: {
        name: string;
        aliases: string;
        email: string;
        address: string;
        phone: string;
        birth_date: string;
    };
    security: {
        password_required: boolean;
        current_password: string;
    };
}

export const defaultSettings: SettingsData = {
    messages: {
        auto_start_new_case: {
            enabled: true,
            interval: 3,
            interval_unit: "months",
        },
        notifications: {
            new_case: true,
            broker_response: true,
            data_deletion: true,
        },
        notification_email: "",
    },
    mailserver: {
        smtp_host: "smtp.beispiel.de",
        port: 587,
        security: "STARTTLS",
        username: "",
        password: "",
        sender_name: "",
        sender_email: "",
    },
    broker: {
        auto_start_when_added: true,
        response_deadline_days: 14,
    },
    user: {
        name: "",
        aliases: "",
        email: "",
        address: "",
        phone: "",
        birth_date: "",
    },
    security: {
        password_required: true,
        current_password: "",
    },
};

const SETTINGS_STORAGE_KEY = "settings_json";

const cloneSettings = (settings: SettingsData): SettingsData =>
    JSON.parse(JSON.stringify(settings)) as SettingsData;

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const mergeWithDefaults = (storedSettings: Partial<SettingsData>): SettingsData => ({
    ...cloneSettings(defaultSettings),
    ...storedSettings,
    messages: {
        ...defaultSettings.messages,
        ...storedSettings.messages,
        auto_start_new_case: {
            ...defaultSettings.messages.auto_start_new_case,
            ...storedSettings.messages?.auto_start_new_case,
        },
        notifications: {
            ...defaultSettings.messages.notifications,
            ...storedSettings.messages?.notifications,
        },
    },
    mailserver: {
        ...defaultSettings.mailserver,
        ...storedSettings.mailserver,
    },
    broker: {
        ...defaultSettings.broker,
        ...storedSettings.broker,
    },
    user: {
        ...defaultSettings.user,
        ...storedSettings.user,
    },
    security: {
        ...defaultSettings.security,
        ...storedSettings.security,
    },
});

export const loadSettings = async (): Promise<SettingsData> => {
    if (!canUseStorage()) {
        return cloneSettings(defaultSettings);
    }

    const storedValue = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!storedValue) {
        return cloneSettings(defaultSettings);
    }

    try {
        const parsedValue = JSON.parse(storedValue) as Partial<SettingsData>;
        return mergeWithDefaults(parsedValue);
    } catch {
        return cloneSettings(defaultSettings);
    }
};

export const saveSettings = async (settings: SettingsData): Promise<void> => {
    if (!canUseStorage()) {
        return;
    }

    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};
