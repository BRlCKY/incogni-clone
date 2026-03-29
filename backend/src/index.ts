import cors from "cors";
import express, { type Request, type Response } from "express";
import brokerRoutes from "./routes/brokerRoutes";
import logRoutes from "./routes/logRoutes";
import faqRoutes from "./routes/faqRoutes";
import mailRoutes from "./routes/mailRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import caseRoutes from "./routes/caseRoutes";
import authRoutes from "./routes/authRoutes";
import onboardingRoutes from "./routes/onboardingRoutes";
import settingsRoutes from "./routes/settingsRoutes";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Incogni clone API" });
});

app.use("/brokers", brokerRoutes);
app.use("/logs", logRoutes);
app.use("/faq", faqRoutes);
app.use("/mails", mailRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/cases", caseRoutes);
app.use("/auth", authRoutes);
app.use("/onboarding", onboardingRoutes);
app.use("/settings", settingsRoutes);

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
