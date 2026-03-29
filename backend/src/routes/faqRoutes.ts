import { Router, type Request, type Response } from "express";
import { dataPaths } from "../constants/dataPaths";
import { readJsonFile } from "../utils/jsonFile";
import { type Question } from "../../../shared/types";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  const faqData = readJsonFile<Question[]>(dataPaths.faq);
  res.json(faqData);
});

export default router;
