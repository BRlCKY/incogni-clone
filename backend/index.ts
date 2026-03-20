import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import type {
    ApiErrorResponse,
    CaseItem,
    CaseQuery,
    CaseResponse,
    CaseStatus,
    HealthResponse,
    HelloResponse,
    LogItem,
    LogQuery,
    LogResponse,
    PerformanceQuery,
    PerformanceResponse,
    SummaryResponse,
} from '../shared/types';

const app = express();
const PORT = 8000;
const API_BASE_PATH = '/api/v1';

app.use(express.json());

const readJsonDataFile = async <T>(fileName: string): Promise<T> => {
    const filePath = path.join(__dirname, 'data', fileName);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as T;
};

const sendInternalServerError = (res: express.Response, resourceName: string) => {
    const errorResponse: ApiErrorResponse = {
        message: `Failed to load ${resourceName}.`,
    };

    res.status(500).json(errorResponse);
};

const isCaseStatus = (status: string): status is CaseStatus => {
    return status === 'rejected' || status === 'stalled' || status === 'done';
};

app.get(`${API_BASE_PATH}/health`, (_req: express.Request, res: express.Response<HealthResponse>) => {
    res.json({ status: 'ok' });
});

app.get(`${API_BASE_PATH}/hello`, (_req: express.Request, res: express.Response<HelloResponse>) => {
    res.send('Hello, World!');
});

app.get(
    `${API_BASE_PATH}/dashboard/summary`,
    async (_req: express.Request, res: express.Response<SummaryResponse | ApiErrorResponse>) => {
        try {
            const summary = await readJsonDataFile<SummaryResponse>('summary.json');
            res.json(summary);
        } catch (error) {
            console.error('Failed to read summary.json:', error);
            sendInternalServerError(res, 'dashboard summary');
        }
    },
);

app.get(
    `${API_BASE_PATH}/dashboard/performance`,
    async (
        req: express.Request<unknown, unknown, unknown, PerformanceQuery>,
        res: express.Response<PerformanceResponse | ApiErrorResponse>,
    ) => {
        try {
            const performance = await readJsonDataFile<PerformanceResponse>('performance.json');
            const nameQuery = req.query.name?.trim().toLowerCase();

            if (!nameQuery) {
                res.json(performance);
                return;
            }

            const filtered = performance.filter((item) => item.name.toLowerCase().includes(nameQuery));
            res.json(filtered);
        } catch (error) {
            console.error('Failed to read performance.json:', error);
            sendInternalServerError(res, 'dashboard performance');
        }
    },
);

app.get(
    `${API_BASE_PATH}/logs`,
    async (
        req: express.Request<unknown, unknown, unknown, LogQuery>,
        res: express.Response<LogResponse | ApiErrorResponse>,
    ) => {
        try {
            const logs = await readJsonDataFile<LogResponse>('log.json');
            const searchTerm = req.query.q?.trim().toLowerCase();
            const parsedLimit = req.query.limit ? Number(req.query.limit) : undefined;

            if (
                req.query.limit !== undefined &&
                (!Number.isFinite(parsedLimit) || !Number.isInteger(parsedLimit) || parsedLimit <= 0)
            ) {
                res.status(400).json({ message: 'Query param "limit" must be a positive integer.' });
                return;
            }

            const limit = parsedLimit;

            const filtered = searchTerm
                ? logs.filter(
                      (item: LogItem) =>
                          item.title.toLowerCase().includes(searchTerm) ||
                          item.message.toLowerCase().includes(searchTerm),
                  )
                : logs;

            if (!limit) {
                res.json(filtered);
                return;
            }

            res.json(filtered.slice(0, limit));
        } catch (error) {
            console.error('Failed to read log.json:', error);
            sendInternalServerError(res, 'logs');
        }
    },
);

app.get(
    `${API_BASE_PATH}/cases`,
    async (
        req: express.Request<unknown, unknown, unknown, CaseQuery>,
        res: express.Response<CaseResponse | ApiErrorResponse>,
    ) => {
        try {
            const cases = await readJsonDataFile<CaseResponse>('cases.json');
            const status = req.query.status;
            const searchTerm = req.query.q?.trim().toLowerCase();

            if (status && !isCaseStatus(status)) {
                res.status(400).json({
                    message: 'Query param "status" must be one of: rejected, stalled, done.',
                });
                return;
            }

            const statusFiltered = status && isCaseStatus(status) ? cases.filter((item) => item.status === status) : cases;

            const searchFiltered = searchTerm
                ? statusFiltered.filter(
                      (item: CaseItem) =>
                          item.brokerName.toLowerCase().includes(searchTerm) ||
                          item.latestUpdate.toLowerCase().includes(searchTerm),
                  )
                : statusFiltered;

            res.json(searchFiltered);
        } catch (error) {
            console.error('Failed to read cases.json:', error);
            sendInternalServerError(res, 'cases');
        }
    },
);

app.get(
    `${API_BASE_PATH}/cases/:id`,
    async (
        req: express.Request<{ id: string }>,
        res: express.Response<CaseItem | ApiErrorResponse>,
    ) => {
        const caseId = Number(req.params.id);

        if (!Number.isInteger(caseId) || caseId <= 0) {
            res.status(400).json({ message: 'Case id must be a positive integer.' });
            return;
        }

        try {
            const cases = await readJsonDataFile<CaseResponse>('cases.json');
            const selectedCase = cases.find((item) => item.id === caseId);

            if (!selectedCase) {
                res.status(404).json({ message: `Case with id ${caseId} was not found.` });
                return;
            }

            res.json(selectedCase);
        } catch (error) {
            console.error('Failed to read cases.json:', error);
            sendInternalServerError(res, 'cases');
        }
    },
);

app.get('/', (_req: express.Request, res: express.Response) => {
    res.json({
        message: 'Mock API is running.',
        apiBasePath: API_BASE_PATH,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
