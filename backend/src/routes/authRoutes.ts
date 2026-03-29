import { Router, type Request, type Response } from "express";
import { readOnboardingState } from "../services/onboardingService";
import { readAuthState, writeAuthState } from "../services/authService";

const router = Router();

router.get("/state", (_req: Request, res: Response) => {
  const authState = readAuthState();
  const onboardingState = readOnboardingState();
  const passwordConfigured =
    typeof authState.password === "string" && authState.password.trim().length > 0;

  res.status(200).json({
    passwordConfigured,
    onboardingCompleted: onboardingState.completed,
  });
});

router.post("/login", (req: Request, res: Response) => {
  const body = req.body as unknown;
  const allowedLoginKeys = ["password"] as const;

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return res.status(400).json({ message: "Invalid login payload" });
  }

  const payloadKeys = Object.keys(body as Record<string, unknown>);
  const hasOnlyAllowedKeys = payloadKeys.every((key) =>
    allowedLoginKeys.includes(key as (typeof allowedLoginKeys)[number]),
  );

  if (!hasOnlyAllowedKeys || payloadKeys.length !== allowedLoginKeys.length) {
    return res.status(400).json({ message: "Invalid login payload" });
  }

  const { password: submittedPassword } = body as Record<string, unknown>;

  if (typeof submittedPassword !== "string") {
    return res.status(400).json({ message: "Invalid login payload" });
  }

  const configuredPassword = readAuthState().password;
  const normalizedConfiguredPassword =
    typeof configuredPassword === "string" ? configuredPassword.trim() : "";

  if (!normalizedConfiguredPassword) {
    return res.status(200).json({
      message: "No password configured. Login granted.",
    });
  }

  if (submittedPassword !== normalizedConfiguredPassword) {
    return res.status(401).json({
      message: "Passwort ist falsch",
    });
  }

  res.status(200).json({
    message: "Login erfolgreich",
  });
});

router.post("/setpassword", (req: Request, res: Response) => {
  const body = req.body as unknown;
  const allowedSetPasswordKeys = ["password"] as const;

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const payloadKeys = Object.keys(body as Record<string, unknown>);
  const hasOnlyAllowedKeys = payloadKeys.every((key) =>
    allowedSetPasswordKeys.includes(key as (typeof allowedSetPasswordKeys)[number]),
  );

  if (!hasOnlyAllowedKeys || payloadKeys.length !== allowedSetPasswordKeys.length) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const { password } = body as Record<string, unknown>;

  if (typeof password !== "string") {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const trimmedPassword = password.trim();

  if (!trimmedPassword) {
    writeAuthState({ password: "" });

    return res.status(200).json({
      message: "Password cleared",
    });
  }

  writeAuthState({ password: trimmedPassword });

  res.status(201).json({
    message: "Password saved",
  });
});

export default router;
