import { type Settings } from "../../../shared/types";
import { dataPaths } from "../constants/dataPaths";
import { ensureJsonFile, writeJsonFile } from "../utils/jsonFile";

const defaultSettings: Settings = {
  messages: {
    auto_start_new_case: {
      enabled: true,
      interval: 3,
      interval_unit: "days",
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
  },
  user: {
    name: "",
    email: "",
    phone: "",
    birth_date: "",
  },
  security: {
    password_required: true,
    current_password: "",
  },
};

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasExactKeys = (value: Record<string, unknown>, allowedKeys: readonly string[]) => {
  const keys = Object.keys(value);
  return keys.length === allowedKeys.length && keys.every((key) => allowedKeys.includes(key));
};

const isSettingsIntervalUnit = (
  value: unknown,
): value is Settings["messages"]["auto_start_new_case"]["interval_unit"] =>
  value === "days" || value === "weeks" || value === "months";

const isSettingsMailSecurityMode = (
  value: unknown,
): value is Settings["mailserver"]["security"] =>
  value === "STARTTLS" || value === "SSL/TLS" || value === "Keine";

export const isSettings = (value: unknown): value is Settings => {
  if (!isObjectRecord(value) || !hasExactKeys(value, ["messages", "mailserver", "broker", "user", "security"])) {
    return false;
  }

  const messages = value.messages;
  const mailserver = value.mailserver;
  const broker = value.broker;
  const user = value.user;
  const security = value.security;

  if (!isObjectRecord(messages) || !hasExactKeys(messages, ["auto_start_new_case", "notifications", "notification_email"])) {
    return false;
  }

  if (!isObjectRecord(mailserver) || !hasExactKeys(mailserver, ["smtp_host", "port", "security", "username", "password", "sender_name", "sender_email"])) {
    return false;
  }

  if (!isObjectRecord(broker) || !hasExactKeys(broker, ["auto_start_when_added"])) {
    return false;
  }

  if (!isObjectRecord(user) || !hasExactKeys(user, ["name", "email", "phone", "birth_date"])) {
    return false;
  }

  if (!isObjectRecord(security) || !hasExactKeys(security, ["password_required", "current_password"])) {
    return false;
  }

  const autoStart = messages.auto_start_new_case;
  const notifications = messages.notifications;

  if (!isObjectRecord(autoStart) || !hasExactKeys(autoStart, ["enabled", "interval", "interval_unit"])) {
    return false;
  }

  if (!isObjectRecord(notifications) || !hasExactKeys(notifications, ["new_case", "broker_response", "data_deletion"])) {
    return false;
  }

  if (
    typeof autoStart.enabled !== "boolean" ||
    typeof autoStart.interval !== "number" ||
    !Number.isFinite(autoStart.interval) ||
    autoStart.interval < 1 ||
    !isSettingsIntervalUnit(autoStart.interval_unit)
  ) {
    return false;
  }

  if (
    typeof notifications.new_case !== "boolean" ||
    typeof notifications.broker_response !== "boolean" ||
    typeof notifications.data_deletion !== "boolean"
  ) {
    return false;
  }

  if (typeof messages.notification_email !== "string") {
    return false;
  }

  if (
    typeof mailserver.smtp_host !== "string" ||
    typeof mailserver.port !== "number" ||
    !Number.isInteger(mailserver.port) ||
    mailserver.port < 1 ||
    mailserver.port > 65535 ||
    !isSettingsMailSecurityMode(mailserver.security) ||
    typeof mailserver.username !== "string" ||
    typeof mailserver.password !== "string" ||
    typeof mailserver.sender_name !== "string" ||
    typeof mailserver.sender_email !== "string"
  ) {
    return false;
  }

  if (typeof broker.auto_start_when_added !== "boolean") {
    return false;
  }

  if (
    typeof user.name !== "string" ||
    typeof user.email !== "string" ||
    typeof user.phone !== "string" ||
    typeof user.birth_date !== "string"
  ) {
    return false;
  }

  if (typeof security.password_required !== "boolean" || typeof security.current_password !== "string") {
    return false;
  }

  return true;
};

export const readSettings = (): Settings =>
  ensureJsonFile(dataPaths.settings, defaultSettings, isSettings);

export const writeSettings = (settings: Settings) => {
  writeJsonFile(dataPaths.settings, {
    ...settings,
    security: {
      ...settings.security,
      current_password: "",
    },
  });
};
