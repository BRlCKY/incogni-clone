import { Router, type Request, type Response } from "express";
import { readBrokers } from "../services/brokerService";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  const cases = readBrokers()
    .map((broker) => ({
      brokerName: broker.name,
      brokerStatus: broker.status,
      latestLogDescription: broker.latestLog,
      latestLogTimestamp: broker.latestLogTimestamp,
    }))
    .sort(
      (firstCase, secondCase) =>
        new Date(secondCase.latestLogTimestamp).getTime() -
        new Date(firstCase.latestLogTimestamp).getTime(),
    );

  res.status(200).json(cases);
});

export default router;
