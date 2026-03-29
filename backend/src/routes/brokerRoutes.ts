import { Router, type Request, type Response } from "express";
import { BrokerStatus, type Broker } from "../../../shared/types";
import { appendLog } from "../services/logService";
import {
  readBrokers,
  writeBrokers,
} from "../services/brokerService";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json(readBrokers());
});

router.get("/:id", (req: Request, res: Response) => {
  const brokerId = Number(req.params.id);
  const broker = readBrokers().find((currentBroker) => currentBroker.id === brokerId);

  if (!broker) {
    return res.status(404).json({ message: "Broker not found" });
  }

  res.json(broker);
});

router.post("/add", (req: Request, res: Response) => {
  const brokers = readBrokers();
  const body = req.body as unknown;
  const allowedBrokerKeys = ["name", "email", "website", "locale"] as const;

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
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

  const duplicateBroker = brokers.find(
    (broker) =>
      broker.name === brokerPayload.name &&
      broker.email === brokerPayload.email &&
      broker.website === brokerPayload.website &&
      broker.locale === brokerPayload.locale,
  );

  if (duplicateBroker) {
    return res.status(409).json({ message: "Broker already exists" });
  }

  const nextId = brokers.length > 0 ? Math.max(...brokers.map((broker) => broker.id)) + 1 : 1;
  const newBroker: Broker = {
    id: nextId,
    ...brokerPayload,
    status: BrokerStatus.NEW,
    latestLog: "",
    latestLogTimestamp: new Date(0).toISOString(),
  };

  brokers.push(newBroker);
  writeBrokers(brokers);
  res.status(201).json(newBroker);
  appendLog(newBroker.name, "Broker hinzugefügt", newBroker.id);
});

router.delete("/:id", (req: Request, res: Response) => {
  const brokers = readBrokers();
  const brokerId = Number(req.params.id);
  const brokerIndex = brokers.findIndex((broker) => broker.id === brokerId);

  if (brokerIndex === -1) {
    return res.status(404).json({ message: "Broker not found" });
  }

  const deletedBroker = brokers.splice(brokerIndex, 1)[0];
  writeBrokers(brokers);
  res.json(deletedBroker);
  appendLog(deletedBroker.name, "Broker entfernt", deletedBroker.id);
});

export default router;
