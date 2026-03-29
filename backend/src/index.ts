import cors from "cors";
import express, { json } from "express";
import fs from "node:fs";
import {
  BrokerStatus,
  type Broker,
  type LogEntry,
  type MailItem,
} from "../../shared/types";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

const getBrokerById = (id: number): Broker | null => {
  const data: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  return data.find((b) => b.id === id) || null;
}

const getBrokerByName = (name: string): Broker | null => {
  const data: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  return data.find((b) => b.name === name) || null;
}

const log = (title: string, description = "", brokerId: number) => {
  const data = JSON.parse(fs.readFileSync("./src/data/logs.json", "utf8"));
  const newLogEntry = { title, description, timestamp: new Date().toISOString(), brokerId };
  data.push(newLogEntry);
  fs.writeFileSync("./src/data/logs.json", JSON.stringify(data, null, 2));

  // update latestLog of broker

  const broker = getBrokerById(brokerId);
  if (broker) {
    const brokers: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
    const brokerIndex = brokers.findIndex((b) => b.id === brokerId);
    if (brokerIndex !== -1) {
      brokers[brokerIndex].latestLog = description;
      brokers[brokerIndex].latestLogTimestamp = newLogEntry.timestamp;
      fs.writeFileSync("./src/data/brokers.json", JSON.stringify(brokers, null, 2));
    }
  }
};

const updateBrokerStatus = (brokerId: number, newStatus: Broker["status"]) => {
  const brokers: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  const brokerIndex = brokers.findIndex((b) => b.id === brokerId);
  if (brokerIndex !== -1) {
    brokers[brokerIndex].status = newStatus;
    fs.writeFileSync("./src/data/brokers.json", JSON.stringify(brokers, null, 2));
  }
};
// Broker endpoints

app.get("/brokers", (req: any, res: any) => {
  const data: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  res.json(data);
});

app.get("/brokers/:id", (req: any, res: any) => {
  const data: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  const broker = data.find((b) => b.id === Number(req.params.id));
  if (broker) {
    res.json(broker);
  } else {
    res.status(404).json({ message: "Broker not found" });
  }
});

app.post("/brokers/add", (req: any, res: any) => {
  const data: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  const body = req.body as unknown;
  const allowedBrokerKeys = ["name", "email", "website", "locale"] as const;

  if (typeof body !== "object" || body === null) {
    return res.status(400).json({ message: "Invalid broker payload" });
  }

  const payloadKeys = Object.keys(body as Record<string, unknown>);
  const hasOnlyAllowedKeys = payloadKeys.every((key) =>
    allowedBrokerKeys.includes(key as (typeof allowedBrokerKeys)[number]),
  );

  if (!hasOnlyAllowedKeys || payloadKeys.length !== allowedBrokerKeys.length) {
    return res.status(400).json({ message: "Invalid broker payload" });
  }

  const { name, email, website, locale } = body as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof website !== "string" ||
    typeof locale !== "string"
  ) {
    return res.status(400).json({ message: "Invalid broker payload" });
  }

  const brokerPayload = { name, email, website, locale };

  const duplicateBroker = data.find(
    (broker) =>
      broker.name === brokerPayload.name &&
      broker.email === brokerPayload.email &&
      broker.website === brokerPayload.website &&
      broker.locale === brokerPayload.locale,
  );

  if (duplicateBroker) {
    return res.status(409).json({ message: "Broker already exists" });
  }

  const nextId = data.length > 0 ? Math.max(...data.map((b) => b.id)) + 1 : 1; 
  const newBroker: Broker = { id: nextId, ...brokerPayload, status: BrokerStatus.NEW, latestLog: "", latestLogTimestamp: new Date(0).toISOString() };
  data.push(newBroker);
  fs.writeFileSync("./src/data/brokers.json", JSON.stringify(data, null, 2));
  res.status(201).json(newBroker);
  log(newBroker.name, "Broker hinzugefügt", newBroker.id);
});

app.delete("/brokers/:id", (req: any, res: any) => {
  const data: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  const brokerIndex = data.findIndex((b) => b.id === Number(req.params.id));
  if (brokerIndex !== -1) {
    const deletedBroker = data.splice(brokerIndex, 1)[0];
    fs.writeFileSync("./src/data/brokers.json", JSON.stringify(data, null, 2));
    res.json(deletedBroker);
    log(deletedBroker.name, "Broker entfernt", deletedBroker.id);
  } else {
    res.status(404).json({ message: "Broker not found" });
  }
});

// Log endpoints

app.get("/logs", (req: any, res: any) => {
  const data = JSON.parse(fs.readFileSync("./src/data/logs.json", "utf8")).sort((a: LogEntry, b: LogEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(data);
});

// FAQ endpoints

app.get("/faq", (req: any, res: any) => {
  const data = JSON.parse(fs.readFileSync("./src/data/faq.json", "utf8"));
  res.json(data);
});

// Mail endpoints

app.get("/mails", (req: any, res: any) => {
  const data = JSON.parse(fs.readFileSync("./src/data/mails.json", "utf8"));
  res.json(data);
});

app.post("/mails/send", (req: any, res: any) => {
  const data: MailItem[] = JSON.parse(fs.readFileSync("./src/data/mails.json", "utf8"));
  const body = req.body as unknown;
  const allowedMailKeys = ["subject", "body", "counterparty", "folder", "date"] as const;

  if (typeof body !== "object" || body === null) {
    return res.status(400).json({ message: "Invalid mail payload" });
  }

  const payloadKeys = Object.keys(body as Record<string, unknown>);
  const hasOnlyAllowedKeys = payloadKeys.every((key) =>
    allowedMailKeys.includes(key as (typeof allowedMailKeys)[number]),
  );

  if (!hasOnlyAllowedKeys || payloadKeys.length !== allowedMailKeys.length) {
    return res.status(400).json({ message: "Invalid mail payload" });
  }

  const { subject, body: mailBody, counterparty, folder, date } = body as Record<string, unknown>;

  if (
    typeof subject !== "string" ||
    typeof mailBody !== "string" ||
    typeof counterparty !== "string" ||
    typeof folder !== "string" ||
    typeof date !== "string"
  ) {
    return res.status(400).json({ message: "Invalid mail payload" });
  }

  const mailPayload = { subject, body: mailBody, counterparty, folder, date };

  const nextId = data.length > 0 ? Math.max(...data.map((m) => m.id)) + 1 : 1;
  const newMail: MailItem = { id: nextId, ...mailPayload } as MailItem;
  data.push(newMail);
  fs.writeFileSync("./src/data/mails.json", JSON.stringify(data, null, 2));
  log(mailPayload.counterparty, "Mail gesendet: " + mailPayload.subject, getBrokerByName(mailPayload.counterparty)?.id ?? -1);

  updateBrokerStatus(getBrokerByName(mailPayload.counterparty)?.id ?? -1, BrokerStatus.PENDING);

  res.status(201).json(newMail);
});

// Dashboard endpoints

app.get("/dashboard/summary", (req: any, res: any) => {
  const brokers: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  const data = {
    brokersMessaged: brokers.filter((b) => b.status !== BrokerStatus.NEW).length,
    brokersPending: brokers.filter((b) => b.status === BrokerStatus.PENDING).length,
    brokersAccepted: brokers.filter((b) => b.status === BrokerStatus.DONE).length,
    brokersRejected: brokers.filter((b) => b.status === BrokerStatus.REJECTED).length,
    brokersToDo: brokers.filter((b) => b.status === BrokerStatus.NEW).length
  }
  res.json(data);
});

app.get("/dashboard/waitingtime", (req: any, res: any) => {
  const eligibleBrokers: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8")).filter((b: Broker) => b.status === BrokerStatus.PENDING && b.latestLogTimestamp);
  const data = eligibleBrokers.map((b) => {
    const waitingTimeMs = new Date().getTime() - new Date(b.latestLogTimestamp).getTime();
    return {
      name: b.name,
      waitingTimeMs,
    };
  });
  res.status(200).json(data);
});

// Cases endpoints

app.get("/cases", (req: any, res: any) => {
  const brokers: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  const cases = brokers.map((b) => ({
    brokerName: b.name,
    brokerStatus: b.status,
    latestLogDescription: b.latestLog,
    latestLogTimestamp: b.latestLogTimestamp
  })).sort((a, b) => new Date(b.latestLogTimestamp).getTime() - new Date(a.latestLogTimestamp).getTime());

  res.status(200).json(cases);
});

// Auth and onboarding endpoints

app.post("/auth/login", (req: any, res: any) => {
  const body = req.body as unknown;
  const allowedLoginKeys = ["password"] as const;

  if (typeof body !== "object" || body === null) {
    return res.status(400).json({ message: "Invalid login payload" });
  }

  const payloadKeys = Object.keys(body as Record<string, unknown>);
  const hasOnlyAllowedKeys = payloadKeys.every((key) =>
    allowedLoginKeys.includes(key as (typeof allowedLoginKeys)[number]),
  );

  if (!hasOnlyAllowedKeys || payloadKeys.length !== allowedLoginKeys.length) {
    return res.status(400).json({ message: "Invalid login payload" });
  }

  const { password: submittedPassword } = body as Record<string, unknown>;

  if (typeof submittedPassword !== "string") {
    return res.status(400).json({ message: "Invalid login payload" });
  }

  const password = JSON.parse(fs.readFileSync('./src/data/auth.json', "utf8")).password;

  if (!password) {
    res.status(200).json({
      message: "No password configured. Login granted.",
    });
    return;
  }

  if (submittedPassword !== password) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  res.status(200).json({
    message: "Login successful",
  });
});

app.post("/auth/setpassword", (req: any, res: any) => {
  const body = req.body as unknown;
  const allowedSetPasswordKeys = ["password"] as const;

  if (typeof body !== "object" || body === null) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const payloadKeys = Object.keys(body as Record<string, unknown>);
  const hasOnlyAllowedKeys = payloadKeys.every((key) =>
    allowedSetPasswordKeys.includes(key as (typeof allowedSetPasswordKeys)[number]),
  );

  if (!hasOnlyAllowedKeys || payloadKeys.length !== allowedSetPasswordKeys.length) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const { password } = body as Record<string, unknown>;

  if (typeof password !== "string") {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const trimmedPassword = password.trim();

  if (!trimmedPassword) {
    return res.status(400).json({ message: "Password is required" });
  }

  fs.writeFileSync('./src/data/auth.json', JSON.stringify({ password: trimmedPassword }, null, 2));

  res.status(201).json({
    message: "Password saved",
  });
});

// Profile endpoints

app.get("/profile/data", (req: any, res: any) => {
  const profileData = JSON.parse(fs.readFileSync('./src/data/profile.json', "utf8"));
  res.json(profileData);
});

app.put("/profile/data", (req: any, res: any) => {
  const body = req.body as unknown;
  const allowedProfileKeys = ["firstName", "lastName", "email", "address", "city", "zipCode", "country", "phone"] as const;

  if (typeof body !== "object" || body === null) {
    return res.status(400).json({ message: "Invalid profile payload" });
  }

  const payloadKeys = Object.keys(body as Record<string, unknown>);
  const hasOnlyAllowedKeys = payloadKeys.every((key) =>
    allowedProfileKeys.includes(key as (typeof allowedProfileKeys)[number]),
  );

  if (!hasOnlyAllowedKeys) {
    return res.status(400).json({ message: "Invalid profile payload" });
  }

  const profilePayload = body as Record<string, unknown>;

  for (const key of payloadKeys) {
    if (typeof profilePayload[key] !== "string") {
      return res.status(400).json({ message: "Invalid profile payload" });
    }
  }

  fs.writeFileSync('./src/data/profile.json', JSON.stringify(profilePayload, null, 2));
  res.json({ success: true, message: "Profile updated successfully" });
});

// Settings endpoints (planned)

app.get("/settings", (req: any, res: any) => {
});

app.put("/settings", (req: any, res: any) => {
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
