import fs from "node:fs";
import express from "express";
import cors from "cors";
import type { Broker, MailItem } from "../../shared/types";

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware to enable CORS
const port = 3000;

app.get("/hello", (req: any, res: any) => {
  res.send("Hello World!");
});

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
  const { id: _ignoredId, ...brokerPayload } = req.body ?? {};

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
  const newBroker: Broker = { id: nextId, ...brokerPayload };
  data.push(newBroker);
  fs.writeFileSync("./src/data/brokers.json", JSON.stringify(data, null, 2));
  res.status(201).json(newBroker);
});

app.delete("/brokers/:id", (req: any, res: any) => {
  const data: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  const brokerIndex = data.findIndex((b) => b.id === Number(req.params.id));
  if (brokerIndex !== -1) {
    const deletedBroker = data.splice(brokerIndex, 1)[0];
    fs.writeFileSync("./src/data/brokers.json", JSON.stringify(data, null, 2));
    res.json(deletedBroker);
  } else {
    res.status(404).json({ message: "Broker not found" });
  }
});

// Log endpoints

app.get("/logs", (req: any, res: any) => {
  const data = JSON.parse(fs.readFileSync("./src/data/logs.json", "utf8"));
  res.json(data);
});

app.post("/logs/add", (req: any, res: any) => {
  const data = JSON.parse(fs.readFileSync("./src/data/logs.json", "utf8"));
  const newLogEntry = req.body;
  data.push(newLogEntry);
  fs.writeFileSync("./src/data/logs.json", JSON.stringify(data, null, 2));
  res.status(201).json(newLogEntry);
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
  const { id: _ignoredId, ...mailPayload } = req.body ?? {};

  const nextId = data.length > 0 ? Math.max(...data.map((m) => m.id)) + 1 : 1;
  const newMail = { id: nextId, ...mailPayload };
  data.push(newMail);
  fs.writeFileSync("./src/data/mails.json", JSON.stringify(data, null, 2));
  res.status(201).json(newMail);
});

// Dashboard endpoints

app.get("/dashboard/summary", (req: any, res: any) => {
  const data = {
    brokersMessaged: 42,
    brokersReplied: 27,
    casesOpen: 15,
  }
  res.json(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
