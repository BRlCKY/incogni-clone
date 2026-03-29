import { Router, type Request, type Response } from "express";
import { BrokerStatus } from "../../../shared/types";
import { readBrokers } from "../services/brokerService";

const router = Router();

router.get("/summary", (_req: Request, res: Response) => {
  const brokers = readBrokers();

  res.json({
    brokersMessaged: brokers.filter((broker) => broker.status !== BrokerStatus.NEW).length,
    brokersPending: brokers.filter((broker) => broker.status === BrokerStatus.PENDING).length,
    brokersAccepted: brokers.filter((broker) => broker.status === BrokerStatus.DONE).length,
    brokersRejected: brokers.filter((broker) => broker.status === BrokerStatus.REJECTED).length,
    brokersToDo: brokers.filter((broker) => broker.status === BrokerStatus.NEW).length,
  });
});

router.get("/waitingtime", (_req: Request, res: Response) => {
  const eligibleBrokers = readBrokers().filter(
    (broker) => broker.status === BrokerStatus.PENDING && broker.latestLogTimestamp,
  );

  const waitingTimes = eligibleBrokers.map((broker) => {
    const waitingTimeMs = new Date().getTime() - new Date(broker.latestLogTimestamp).getTime();

    return {
      name: broker.name,
      waitingTimeMs,
    };
  });

  res.status(200).json(waitingTimes);
});

export default router;
