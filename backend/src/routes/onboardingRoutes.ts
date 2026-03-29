import { Router, type Request, type Response } from "express";
import { writeOnboardingState } from "../services/onboardingService";

const router = Router();

router.post("/complete", (_req: Request, res: Response) => {
  writeOnboardingState({ completed: true });

  res.status(200).json({
    message: "Onboarding marked as completed",
  });
});

export default router;
