import { Router, type Request, type Response } from "express";
import { BrokerStatus, type MailItem } from "../../../shared/types";
import { dataPaths } from "../constants/dataPaths";
import { getBrokerByName, updateBrokerStatus } from "../services/brokerService";
import { appendLog } from "../services/logService";
import { readJsonFile, writeJsonFile } from "../utils/jsonFile";

const router = Router();

const parseMailDateToTimestamp = (dateString: string): number => {
  const normalizedDate = dateString.trim();
  const germanDateMatch = normalizedDate.match(/^(\d{2})\.(\d{2})\.(\d{4}),\s*(\d{2}):(\d{2})$/);

  if (germanDateMatch) {
    const [, day, month, year, hour, minute] = germanDateMatch;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
    ).getTime();
  }

  const parsedTimestamp = Date.parse(normalizedDate);
  return Number.isNaN(parsedTimestamp) ? Number.NEGATIVE_INFINITY : parsedTimestamp;
};

const sortMailsNewestFirst = (mails: MailItem[]): MailItem[] =>
  [...mails].sort((firstMail, secondMail) => {
    const secondTimestamp = parseMailDateToTimestamp(secondMail.date);
    const firstTimestamp = parseMailDateToTimestamp(firstMail.date);

    if (secondTimestamp !== firstTimestamp) {
      return secondTimestamp - firstTimestamp;
    }

    return secondMail.id - firstMail.id;
  });

router.get("/", (_req: Request, res: Response) => {
  const mails = readJsonFile<MailItem[]>(dataPaths.mails);
  res.json(sortMailsNewestFirst(mails));
});

router.post("/send", (req: Request, res: Response) => {
  const mails = readJsonFile<MailItem[]>(dataPaths.mails);
  const body = req.body as unknown;
  const requiredMailKeys = ["subject", "body", "counterparty", "folder", "date"] as const;
  const allowedMailKeys = [...requiredMailKeys, "id"] as const;

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return res.status(400).json({ message: "Invalid mail payload" });
  }

  const bodyRecord = body as Record<string, unknown>;
  const payloadKeys = Object.keys(bodyRecord);
  const hasOnlyAllowedKeys = payloadKeys.every((key) =>
    allowedMailKeys.includes(key as (typeof allowedMailKeys)[number]),
  );
  const hasAllRequiredKeys = requiredMailKeys.every((key) => key in bodyRecord);

  if (!hasOnlyAllowedKeys || !hasAllRequiredKeys) {
    return res.status(400).json({ message: "Invalid mail payload" });
  }

  const { id, subject, body: mailBody, counterparty, folder, date } = bodyRecord;

  if (
    (id !== undefined && typeof id !== "number") ||
    typeof subject !== "string" ||
    typeof mailBody !== "string" ||
    typeof counterparty !== "string" ||
    typeof folder !== "string" ||
    typeof date !== "string"
  ) {
    return res.status(400).json({ message: "Invalid mail payload" });
  }

  if (folder !== "posteingang" && folder !== "gesendet") {
    return res.status(400).json({ message: "Invalid mail payload" });
  }

  const mailPayload = { subject, body: mailBody, counterparty, folder: folder as MailItem["folder"], date };
  const nextId = mails.length > 0 ? Math.max(...mails.map((mail) => mail.id)) + 1 : 1;
  const newMail: MailItem = { id: nextId, ...mailPayload };

  mails.push(newMail);
  writeJsonFile(dataPaths.mails, mails);

  const broker = getBrokerByName(mailPayload.counterparty);
  appendLog(mailPayload.counterparty, `Mail gesendet: ${mailPayload.subject}`, broker?.id ?? -1);

  if (broker) {
    updateBrokerStatus(broker.id, BrokerStatus.PENDING);
  }

  res.status(201).json(newMail);
});

export default router;
