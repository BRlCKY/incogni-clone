import fs from "node:fs";
import express from "express";
import cors from "cors";
import type { Broker, MailItem } from "../../shared/types";

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware to enable CORS
const port = 3000;
const authDataPath = "./src/data/auth.json";

type AuthState = {
  password: string | null;
};

const respondNotImplemented = (
  res: any,
  endpoint: string,
  todo: string,
  expectedBody: Record<string, unknown> | null = null,
  expectedQuery: Record<string, unknown> | null = null,
) => {
  res.status(501).json({
    message: "Endpoint planned but not implemented yet",
    endpoint,
    todo,
    expectedBody,
    expectedQuery,
  });
};

app.get("/hello", (req: any, res: any) => {
  res.send("Hello World!");
});

const readAuthState = (): AuthState => {
  if (!fs.existsSync(authDataPath)) {
    const initialAuthState: AuthState = { password: null };
    fs.writeFileSync(authDataPath, JSON.stringify(initialAuthState, null, 2));
    return initialAuthState;
  }
  const rawState = JSON.parse(fs.readFileSync(authDataPath, "utf8"));
  return {
    password: rawState.password ?? null,
  };
};

const writeAuthState = (state: AuthState) => {
  fs.writeFileSync(authDataPath, JSON.stringify(state, null, 2));
};

// Broker endpoints

app.get("/brokers", (req: any, res: any) => {
  const data: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  res.json(data);
});

app.get("/brokers/:id", (req: any, res: any) => {
  const data: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  const broker = data.find((b) => b.id === Number(req.params.id));
  if (broker) {
    res.json(broker);
  } else {
    res.status(404).json({ message: "Broker not found" });
  }
});

app.post("/brokers/add", (req: any, res: any) => {
  const data: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  const { id: _ignoredId, ...brokerPayload } = req.body ?? {};

  const duplicateBroker = data.find(
    (broker) =>
      broker.name === brokerPayload.name &&
      broker.email === brokerPayload.email &&
      broker.website === brokerPayload.website &&
      broker.locale === brokerPayload.locale,
  );

  if (duplicateBroker) {
    return res.status(409).json({ message: "Broker already exists" });
  }

  const nextId = data.length > 0 ? Math.max(...data.map((b) => b.id)) + 1 : 1; 
  const newBroker: Broker = { id: nextId, ...brokerPayload };
  data.push(newBroker);
  fs.writeFileSync("./src/data/brokers.json", JSON.stringify(data, null, 2));
  res.status(201).json(newBroker);
});

app.delete("/brokers/:id", (req: any, res: any) => {
  const data: Broker[] = JSON.parse(fs.readFileSync("./src/data/brokers.json", "utf8"));
  const brokerIndex = data.findIndex((b) => b.id === Number(req.params.id));
  if (brokerIndex !== -1) {
    const deletedBroker = data.splice(brokerIndex, 1)[0];
    fs.writeFileSync("./src/data/brokers.json", JSON.stringify(data, null, 2));
    res.json(deletedBroker);
  } else {
    res.status(404).json({ message: "Broker not found" });
  }
});

// Log endpoints

app.get("/logs", (req: any, res: any) => {
  const data = JSON.parse(fs.readFileSync("./src/data/logs.json", "utf8"));
  res.json(data);
});

app.post("/logs/add", (req: any, res: any) => {
  const data = JSON.parse(fs.readFileSync("./src/data/logs.json", "utf8"));
  const newLogEntry = req.body;
  data.push(newLogEntry);
  fs.writeFileSync("./src/data/logs.json", JSON.stringify(data, null, 2));
  res.status(201).json(newLogEntry);
});

// FAQ endpoints

app.get("/faq", (req: any, res: any) => {
  const data = JSON.parse(fs.readFileSync("./src/data/faq.json", "utf8"));
  res.json(data);
});

// Mail endpoints

app.get("/mails", (req: any, res: any) => {
  const data = JSON.parse(fs.readFileSync("./src/data/mails.json", "utf8"));
  res.json(data);
});

app.post("/mails/send", (req: any, res: any) => {
  const data: MailItem[] = JSON.parse(fs.readFileSync("./src/data/mails.json", "utf8"));
  const { id: _ignoredId, ...mailPayload } = req.body ?? {};

  const nextId = data.length > 0 ? Math.max(...data.map((m) => m.id)) + 1 : 1;
  const newMail = { id: nextId, ...mailPayload };
  data.push(newMail);
  fs.writeFileSync("./src/data/mails.json", JSON.stringify(data, null, 2));
  res.status(201).json(newMail);
});

// Dashboard endpoints

app.get("/dashboard/summary", (req: any, res: any) => {
  const data = {
    brokersMessaged: 42,
    brokersReplied: 27,
    casesOpen: 15,
  }
  res.json(data);
});

app.get("/dashboard/broker-performance", (req: any, res: any) => {
  respondNotImplemented(
    res,
    "GET /dashboard/broker-performance",
    "Return broker response-time ranking for DashboardComp 'Antwortzeiten' card.",
  );
});

app.get("/dashboard/activity", (req: any, res: any) => {
  respondNotImplemented(
    res,
    "GET /dashboard/activity",
    "Return latest timeline entries for DashboardComp 'Aktuell' card.",
  );
});

// Cases endpoints (planned)

app.get("/cases", (req: any, res: any) => {
  respondNotImplemented(
    res,
    "GET /cases",
    "Return case list for CasesComp with optional filters and search.",
    null,
    {
      status: "open | done | rejected | stalled",
      search: "string",
      limit: 50,
      offset: 0,
    },
  );
});

app.delete("/cases/bulk", (req: any, res: any) => {
  respondNotImplemented(
    res,
    "DELETE /cases/bulk",
    "Delete selected cases from CasesComp bulk action.",
    {
      ids: [1, 2, 3],
    },
  );
});

app.post("/cases/bulk-contact", (req: any, res: any) => {
  respondNotImplemented(
    res,
    "POST /cases/bulk-contact",
    "Trigger messaging workflow for selected cases in CasesComp.",
    {
      ids: [1, 2, 3],
      template: "follow-up-1",
    },
  );
});

// Auth and onboarding endpoints (planned)

app.get("/auth/status", (req: any, res: any) => {
  const authState = readAuthState();
  const passwordSet = Boolean(authState.password && authState.password.length > 0);

  res.json({
    passwordSet,
    canProceed: !passwordSet,
  });
});

app.post("/auth/login", (req: any, res: any) => {
  const authState = readAuthState();
  const passwordSet = Boolean(authState.password && authState.password.length > 0);
  const submittedPassword = String(req.body?.password ?? "");

  if (!passwordSet) {
    return res.json({
      success: true,
      message: "No password configured. Login granted.",
      canProceed: true,
    });
  }

  if (submittedPassword !== authState.password) {
    return res.status(401).json({
      success: false,
      message: "Invalid password",
      canProceed: false,
    });
  }

  res.json({
    success: true,
    message: "Login successful",
    canProceed: true,
  });
});

app.post("/auth/setup-password", (req: any, res: any) => {
  const password = String(req.body?.password ?? "");
  const trimmedPassword = password.trim();

  if (!trimmedPassword) {
    return res.status(400).json({ message: "Password is required" });
  }

  const authState = readAuthState();
  authState.password = trimmedPassword;
  writeAuthState(authState);

  res.status(201).json({
    success: true,
    message: "Password saved",
    passwordSet: true,
    canProceed: true,
  });
});

app.get("/profile/removal-data", (req: any, res: any) => {
  respondNotImplemented(
    res,
    "GET /profile/removal-data",
    "Load saved profile/removal-data fields for onboarding and settings forms.",
  );
});

app.put("/profile/removal-data", (req: any, res: any) => {
  respondNotImplemented(
    res,
    "PUT /profile/removal-data",
    "Save or update removal-data profile fields from OnboardingDataComp.",
    {
      firstName: "string",
      lastName: "string",
      email: "string",
      address: "string",
      city: "string",
      zipCode: "string",
      country: "string",
      phone: "string",
    },
  );
});

// Settings endpoints (planned)

app.get("/settings", (req: any, res: any) => {
  respondNotImplemented(
    res,
    "GET /settings",
    "Return settings page values once SettingsComp is implemented.",
  );
});

app.put("/settings", (req: any, res: any) => {
  respondNotImplemented(
    res,
    "PUT /settings",
    "Save settings page updates once SettingsComp is implemented.",
    {
      notificationsEnabled: true,
      preferredLocale: "de-DE",
      timezone: "Europe/Berlin",
    },
  );
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
