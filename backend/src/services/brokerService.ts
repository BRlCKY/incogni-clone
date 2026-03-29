import { type Broker } from "../../../shared/types";
import { dataPaths } from "../constants/dataPaths";
import { readJsonFile, writeJsonFile } from "../utils/jsonFile";

export const readBrokers = (): Broker[] =>
  readJsonFile<Broker[]>(dataPaths.brokers);

export const writeBrokers = (brokers: Broker[]) => {
  writeJsonFile(dataPaths.brokers, brokers);
};

export const getBrokerById = (id: number): Broker | null => {
  const brokers = readBrokers();
  return brokers.find((broker) => broker.id === id) || null;
};

export const getBrokerByName = (name: string): Broker | null => {
  const brokers = readBrokers();
  return brokers.find((broker) => broker.name === name) || null;
};

export const updateBrokerStatus = (brokerId: number, newStatus: Broker["status"]) => {
  const brokers = readBrokers();
  const brokerIndex = brokers.findIndex((broker) => broker.id === brokerId);

  if (brokerIndex !== -1) {
    brokers[brokerIndex].status = newStatus;
    writeBrokers(brokers);
  }
};
