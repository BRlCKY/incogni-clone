import { type LogEntry } from "../../../shared/types";
import { dataPaths } from "../constants/dataPaths";
import { getBrokerById, readBrokers, writeBrokers } from "./brokerService";
import { readJsonFile, writeJsonFile } from "../utils/jsonFile";

const readLogEntries = (): LogEntry[] =>
  readJsonFile<LogEntry[]>(dataPaths.logs);

export const readLogsNewestFirst = (): LogEntry[] =>
  readLogEntries().sort(
    (firstLog, secondLog) =>
      new Date(secondLog.timestamp).getTime() - new Date(firstLog.timestamp).getTime(),
  );

export const appendLog = (title: string, description = "", brokerId: number) => {
  const logs = readLogEntries();
  const newLogEntry: LogEntry = {
    title,
    description,
    timestamp: new Date().toISOString(),
    brokerId,
  };

  logs.push(newLogEntry);
  writeJsonFile(dataPaths.logs, logs);

  const broker = getBrokerById(brokerId);

  if (!broker) {
    return;
  }

  const brokers = readBrokers();
  const brokerIndex = brokers.findIndex((currentBroker) => currentBroker.id === brokerId);

  if (brokerIndex !== -1) {
    brokers[brokerIndex].latestLog = description;
    brokers[brokerIndex].latestLogTimestamp = newLogEntry.timestamp;
    writeBrokers(brokers);
  }
};
