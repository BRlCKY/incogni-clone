export type Broker = {
    id: number;
    name: string;
    email: string;
    website: string;
    locale: string;
    status: BrokerStatus;
    latestLog: string; // for the case overview it's better to save it here rather than looking it up from the logs every time
    latestLogTimestamp: string; // ISO format
};

export enum BrokerStatus {
    NEW = "new",
    REJECTED = "rejected",
    PENDING = "pending",
    DONE = "done",
}

export type LogEntry = {
    title: string;
    description: string;
    timestamp: string; // ISO format
    brokerId: number;
};

export type Question = {
    text: string;
} & (
    | {
          content: string;
          url?: never;
      }
    | {
          url: string;
          content?: never;
      }
);

export type MailFolder = "posteingang" | "gesendet";

export type MailItem = {
    id: number;
    subject: string;
    body: string;
    counterparty: string;
    folder: MailFolder;
    date: string;
};

export type AuthState = {
    password: string | null;
};

export type CaseItem = {
    brokerName: string;
    brokerStatus: BrokerStatus;
    latestLogDescription: string;
    latestLogTimestamp: string;
};

export type SettingsIntervalUnit = "days" | "weeks" | "months";

export type SettingsMailSecurityMode = "STARTTLS" | "SSL/TLS" | "Keine";

export type Settings = {
    messages: {
        auto_start_new_case: {
            enabled: boolean;
            interval: number;
            interval_unit: SettingsIntervalUnit;
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
        security: SettingsMailSecurityMode;
        username: string;
        password: string;
        sender_name: string;
        sender_email: string;
    };
    broker: {
        auto_start_when_added: boolean;
    };
    user: {
        name: string;
        email: string;
        phone: string;
        birth_date: string;
    };
    security: {
        password_required: boolean;
        current_password: string;
    };
};
