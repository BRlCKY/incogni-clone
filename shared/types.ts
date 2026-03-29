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

export type ProfileRemovalData = {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    phone: string;
};

export type CaseItem = {
    brokerName: string;
    brokerStatus: BrokerStatus;
    latestLogDescription: string;
    latestLogTimestamp: string;
};
