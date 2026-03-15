import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

const app = express();

app.use(express.json());

const readJsonDataFile = async (fileName: string) => {
    const filePath = path.join(__dirname, 'data', fileName);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
};

const createJsonFileRoute = (
    fileName: string,
    transform?: (data: unknown, req: express.Request) => unknown,
) => {
    return async (req: express.Request, res: express.Response) => {
        try {
            const data = await readJsonDataFile(fileName);
            const responseData = transform ? transform(data, req) : data;
            res.json(responseData);
        } catch (error) {
            console.error(`Failed to read ${fileName}:`, error);
            res.status(500).json({ message: `Failed to load ${fileName}` });
        }
    };
};

app.get('/hello', (_req: express.Request, res: express.Response) => {
    res.send('Hello, World!');
});

app.get('/summary', createJsonFileRoute('summary.json'));
app.get('/log', createJsonFileRoute('log.json'));

// might need to change time to int but need to find good way to differentiate between time units
app.get(
    '/performance',
    createJsonFileRoute('performance.json', (data, req) => {
        if (!Array.isArray(data)) {
            return [];
        }

        const nameQuery = typeof req.query.name === 'string' ? req.query.name : undefined;
        if (!nameQuery) {
            return data;
        }

        const normalizedQuery = nameQuery.replace(/^"|"$/g, '').toLowerCase();
        return data.filter((item) => {
            return typeof item?.name === 'string' && item.name.toLowerCase() === normalizedQuery;
        });
    }),
);

app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
});
