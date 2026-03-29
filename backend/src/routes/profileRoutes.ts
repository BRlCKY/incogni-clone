import { Router, type Request, type Response } from "express";
import { dataPaths } from "../constants/dataPaths";
import { readJsonFile, writeJsonFile } from "../utils/jsonFile";

const router = Router();

router.get("/data", (_req: Request, res: Response) => {
  const profileData = readJsonFile<Record<string, unknown>>(dataPaths.profile);
  res.json(profileData);
});

router.put("/data", (req: Request, res: Response) => {
  const body = req.body as unknown;
  const allowedProfileKeys = [
    "firstName",
    "lastName",
    "email",
    "address",
    "city",
    "zipCode",
    "country",
    "phone",
  ] as const;

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return res.status(400).json({ message: "Invalid profile payload" });
  }

  const profilePayload = body as Record<string, unknown>;
  const payloadKeys = Object.keys(profilePayload);
  const hasOnlyAllowedKeys = payloadKeys.every((key) =>
    allowedProfileKeys.includes(key as (typeof allowedProfileKeys)[number]),
  );

  if (!hasOnlyAllowedKeys) {
    return res.status(400).json({ message: "Invalid profile payload" });
  }

  for (const key of payloadKeys) {
    if (typeof profilePayload[key] !== "string") {
      return res.status(400).json({ message: "Invalid profile payload" });
    }
  }

  writeJsonFile(dataPaths.profile, profilePayload);
  res.json({ success: true, message: "Profile updated successfully" });
});

export default router;
