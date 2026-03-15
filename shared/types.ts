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
    time: string;
    message: string;
};

export type SummaryResponse = SummaryItem[];
export type PerformanceResponse = PerformanceItem[];
export type LogResponse = LogItem[];
export type HelloResponse = string;

export type PerformanceQuery = {
    name?: string;
};

export type ApiErrorResponse = {
    message: string;
};
