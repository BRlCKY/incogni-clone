export type SummaryItem = {
    label: string;
    value: number;
    colorClass: string;
};

export type PerformanceItem = {
    name: string;
    time: string;
    colorClass: string;
};

export type LogItem = {
    id: number;
    title: string;
    date: string;
    time: string;
    message: string;
    colorClass: string;
};

export type CaseStatus = 'rejected' | 'stalled' | 'done';

export type CaseItem = {
    id: number;
    brokerName: string;
    latestUpdate: string;
    status: CaseStatus;
};

export type SummaryResponse = SummaryItem[];
export type PerformanceResponse = PerformanceItem[];
export type LogResponse = LogItem[];
export type CaseResponse = CaseItem[];
export type HelloResponse = string;
export type HealthResponse = {
    status: 'ok';
};

export type PerformanceQuery = {
    name?: string;
};

export type LogQuery = {
    q?: string;
    limit?: number;
};

export type CaseQuery = {
    status?: CaseStatus;
    q?: string;
};

export type ApiErrorResponse = {
    message: string;
};
