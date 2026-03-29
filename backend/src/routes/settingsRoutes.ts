import { Router, type Request, type Response } from "express";
import { isSettings, readSettings, writeSettings } from "../services/settingsService";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  const settings = readSettings();
  res.status(200).json(settings);
});

router.put("/", (req: Request, res: Response) => {
  const body = req.body as unknown;

  if (!isSettings(body)) {
    return res.status(400).json({ message: "Invalid settings payload" });
  }

  writeSettings(body);
  res.status(200).json({ success: true, message: "Settings updated successfully" });
});

export default router;
