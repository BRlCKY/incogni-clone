import { Router, type Request, type Response } from "express";
import { readLogsNewestFirst } from "../services/logService";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json(readLogsNewestFirst());
});

export default router;
