export type Broker = {
    id: number;
    name: string;
    email: string;
    website: string;
    locale: string;
};

export type LogEntry = {
    title: string;
    description: string;
    timestamp: string; // ISO format
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