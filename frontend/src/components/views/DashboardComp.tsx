import { useEffect, useState } from "react";
import GlassComp from "../GlassComp";
import { getAccessibleClickProps } from "../../utils/accessibility";
import { LogEntry } from "../../../../shared/types";

type DashboardSummary = {
    brokersMessaged: number;
    brokersAccepted: number;
    brokersRejected: number;
    brokersPending: number;
    brokersToDo: number;
};

const summaryUiConfig: Array<{
    key: keyof DashboardSummary;
    label: string;
    colorClass: string;
}> = [
    { key: "brokersMessaged", label: "Broker wurden kontaktiert", colorClass: "text-white" },
    { key: "brokersAccepted", label: "Broker haben akzeptiert", colorClass: "text-green-400" },
    { key: "brokersRejected", label: "Broker haben abgelehnt", colorClass: "text-red-400" },
    { key: "brokersPending", label: "Broker sind in Bearbeitung", colorClass: "text-yellow-400" },
    { key: "brokersToDo", label: "Broker sind offen", colorClass: "text-blue-400" },
];

type WaitingTimeItem = {
    name: string;
    waitingTimeMs: number;
};

const WAIT_TIME_GREEN_MAX_MS = 2 * 24 * 60 * 60 * 1000;
const WAIT_TIME_YELLOW_MAX_MS = 7 * 24 * 60 * 60 * 1000;

const relativeTimeFormatter = new Intl.RelativeTimeFormat("de-DE", {
    numeric: "auto",
});

const waitingTimeUnits: Array<{ unit: Intl.RelativeTimeFormatUnit; ms: number }> = [
    { unit: "year", ms: 365 * 24 * 60 * 60 * 1000 },
    { unit: "month", ms: 30 * 24 * 60 * 60 * 1000 },
    { unit: "week", ms: 7 * 24 * 60 * 60 * 1000 },
    { unit: "day", ms: 24 * 60 * 60 * 1000 },
    { unit: "hour", ms: 60 * 60 * 1000 },
    { unit: "minute", ms: 60 * 1000 },
    { unit: "second", ms: 1000 },
];

const formatWaitingTime = (waitingTimeMs: number): string => {
    const absoluteMs = Math.max(0, waitingTimeMs);
    if (absoluteMs < 1000) {
        return "gerade eben";
    }

    for (const { unit, ms } of waitingTimeUnits) {
        if (absoluteMs >= ms) {
            const value = Math.floor(absoluteMs / ms);
            const formatted = relativeTimeFormatter.format(-value, unit);
            return formatted.startsWith("vor ") ? formatted.slice(4) : formatted;
        }
    }

    return "gerade eben";
};

const getWaitingTimeColorClass = (waitingTimeMs: number): string => {
    if (waitingTimeMs <= WAIT_TIME_GREEN_MAX_MS) {
        return "text-green-400";
    }
    if (waitingTimeMs <= WAIT_TIME_YELLOW_MAX_MS) {
        return "text-yellow-400";
    }
    return "text-red-400";
};

const formatLogTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
        return timestamp;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const cardClassName =
    "rounded-3xl border border-gray-700 bg-gray-800 p-6 transition-colors duration-200 hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

type DashboardCompProps = {
    onTileClick: (view: string) => void;
};

const getTileInteractionProps = (onClick: () => void, label: string) => ({
    onClick,
    ...getAccessibleClickProps(onClick, { label }),
});

const DashboardComp = ({ onTileClick }: DashboardCompProps) => {
    const [summary, setSummary] = useState<DashboardSummary>({
        brokersMessaged: 0,
        brokersAccepted: 0,
        brokersRejected: 0,
        brokersPending: 0,
        brokersToDo: 0,
    });
    const [waitingTimes, setWaitingTimes] = useState<WaitingTimeItem[]>([]);
    const [activityLog, setActivityLog] = useState<LogEntry[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/dashboard/summary")
            .then((response) => response.json())
            .then((data: DashboardSummary) => setSummary(data))
            .catch((error) => console.error("Error fetching dashboard summary:", error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:3000/dashboard/waitingtime")
            .then((response) => response.json())
            .then((data: WaitingTimeItem[]) =>
                setWaitingTimes([...data].sort((a, b) => b.waitingTimeMs - a.waitingTimeMs)),
            )
            .catch((error) => console.error("Error fetching dashboard waiting times:", error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:3000/logs")
            .then((response) => response.json())
            .then((data: LogEntry[]) => setActivityLog(data))
            .catch((error) => console.error("Error fetching activity log:", error));
    }, []);

    const summaryData = summaryUiConfig.map((item) => ({
        label: item.label,
        value: summary[item.key],
        colorClass: item.colorClass,
    }));

    return (
        <div className="h-full-respect-nav w-full overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1.5fr] lg:grid-rows-2">
                <GlassComp
                    width="100%"
                    height="auto"
                    tintOpacity={0.5}
                    className={`${cardClassName} min-h-[260px] cursor-pointer md:min-h-[320px] lg:h-full lg:min-h-0`}
                    {...getTileInteractionProps(() => onTileClick("CASES"), "Zur Faelle-Uebersicht wechseln")}
                >
                    <div className="h-full w-full">
                        <div className="mb-5 text-base text-gray-300">Übersicht</div>
                        <div className="flex w-full flex-1 flex-col justify-between lg:justify-start lg:gap-6">
                            {summaryData.map((item) => (
                                <div key={item.label}>
                                    <div className={`text-3xl font-semibold ${item.colorClass}`}>{item.value}</div>
                                    <div className="mt-1 text-sm text-gray-400">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassComp>

                <GlassComp
                    width="100%"
                    height="auto"
                    tintOpacity={0.5}
                    className={`${cardClassName} min-h-[260px] cursor-pointer md:min-h-[320px] lg:col-start-1 lg:row-start-2 lg:h-full lg:min-h-0`}
                    {...getTileInteractionProps(() => onTileClick("MAIL"), "Zur Mail-Uebersicht wechseln")}
                >
                    <div className="h-full w-full">
                        <div className="mb-5 text-base text-gray-300">Keine Antwort seit</div>
                        <div className="flex w-full flex-1 flex-col gap-3 overflow-y-auto pr-1 no-scrollbar">
                            {waitingTimes.map((broker) => (
                                <div key={broker.name} className="flex items-center justify-between text-sm">
                                    <span className="text-white">{broker.name}</span>
                                    <span className={`font-semibold ${getWaitingTimeColorClass(broker.waitingTimeMs)}`}>
                                        {formatWaitingTime(broker.waitingTimeMs)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassComp>

                <GlassComp
                    width="100%"
                    height="auto"
                    tintOpacity={0.5}
                    className={`${cardClassName} min-h-[300px] cursor-pointer md:min-h-[390px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-full lg:min-h-0`}
                    {...getTileInteractionProps(() => onTileClick("LOG"), "Zum Aktivitaetslog wechseln")}
                >
                    <div className="flex h-full w-full flex-col">
                        <div className="mb-5 text-base text-gray-300">Aktuell</div>
                        <div className="flex w-full flex-1 flex-col gap-3 overflow-y-auto pr-1 no-scrollbar">
                            {activityLog.map((log) => (
                                <div key={`${log.timestamp}-${log.description}`} className="flex gap-3 text-sm">
                                    <div className="min-w-fit font-semibold text-purple-primary">{formatLogTimestamp(log.timestamp)}</div>
                                    <div className="text-gray-200">{log.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassComp>
            </div>
        </div>
    );
};

export default DashboardComp;
