import { useEffect, useMemo, useState } from "react";
import ButtonComp from "../ButtonComp";
import GlassComp from "../GlassComp";
import { BrokerStatus, type Broker, type CaseItem, type LogEntry, type MailItem } from "../../../../shared/types";

type CaseCompProps = {
    item: CaseItem;
    onBack: () => void;
};

type CaseLogEntry = LogEntry & {
    brokerId?: number;
};

const statusConfig: Record<BrokerStatus, { label: string; dotClassName: string; accentClassName: string }> = {
    [BrokerStatus.NEW]: {
        label: "Neu",
        dotClassName: "bg-blue-400",
        accentClassName: "text-blue-300",
    },
    [BrokerStatus.PENDING]: {
        label: "In Bearbeitung",
        dotClassName: "bg-yellow-400",
        accentClassName: "text-yellow-300",
    },
    [BrokerStatus.DONE]: {
        label: "Abgeschlossen",
        dotClassName: "bg-emerald-400",
        accentClassName: "text-emerald-300",
    },
    [BrokerStatus.REJECTED]: {
        label: "Abgelehnt",
        dotClassName: "bg-red-400",
        accentClassName: "text-red-300",
    },
};

const formatDateTime = (value: string) => {
    if (!value) {
        return "Noch keine Aktivität";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const formatDateOnly = (value: string) => {
    if (!value) {
        return "Offen";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
};

const normalizeUrl = (url: string) => {
    if (!url) {
        return "";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    return `https://${url}`;
};

const parseSortableDate = (value: string) => {
    const directTimestamp = Date.parse(value);

    if (!Number.isNaN(directTimestamp)) {
        return directTimestamp;
    }

    const match = value.match(
        /^(\d{2})\.(\d{2})\.(\d{4})(?:,\s*(\d{2}):(\d{2}))?$/,
    );

    if (!match) {
        return Number.NEGATIVE_INFINITY;
    }

    const [, day, month, year, hours = "00", minutes = "00"] = match;
    return Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes),
    );
};

const buildProtocolExport = (broker: Broker, logs: CaseLogEntry[], mails: MailItem[]) => {
    const sections = [
        `Broker: ${broker.name}`,
        `Status: ${statusConfig[broker.status].label}`,
        `E-Mail: ${broker.email}`,
        `Website: ${broker.website}`,
        `Sprache / Markt: ${broker.locale}`,
        `Letzte Aktivität: ${formatDateTime(broker.latestLogTimestamp)}`,
        "",
        "Aktivitätsverlauf",
        ...logs.map(
            (log) =>
                `- ${formatDateTime(log.timestamp)} | ${log.title}${log.description ? ` | ${log.description}` : ""}`,
        ),
        "",
        "Kommunikation",
        ...mails.map(
            (mail) =>
                `- ${mail.date} | ${mail.folder.toUpperCase()} | ${mail.subject}${mail.body ? ` | ${mail.body}` : ""}`,
        ),
    ];

    return sections.join("\n");
};

const createFallbackBroker = (item: CaseItem): Broker => ({
    id: item.brokerId,
    name: item.brokerName,
    email: item.brokerEmail,
    website: item.brokerWebsite,
    locale: item.brokerLocale,
    status: item.brokerStatus,
    latestLog: item.latestLogDescription,
    latestLogTimestamp: item.latestLogTimestamp,
});

const CaseComp = ({ item, onBack }: CaseCompProps) => {
    const [broker, setBroker] = useState<Broker>(() => createFallbackBroker(item));
    const [logs, setLogs] = useState<CaseLogEntry[]>([]);
    const [mails, setMails] = useState<MailItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadCaseDetails = async () => {
            try {
                const [brokersResponse, logsResponse, mailsResponse] = await Promise.all([
                    fetch("http://localhost:3000/brokers"),
                    fetch("http://localhost:3000/logs"),
                    fetch("http://localhost:3000/mails"),
                ]);

                if (!brokersResponse.ok || !logsResponse.ok || !mailsResponse.ok) {
                    throw new Error("Failed to load case details");
                }

                const [brokersData, logsData, mailsData] = (await Promise.all([
                    brokersResponse.json(),
                    logsResponse.json(),
                    mailsResponse.json(),
                ])) as [Broker[], CaseLogEntry[], MailItem[]];

                if (!isMounted) {
                    return;
                }

                const matchedBroker =
                    brokersData.find((entry) => entry.id === item.brokerId) ??
                    brokersData.find((entry) => entry.name === item.brokerName) ??
                    createFallbackBroker(item);
                const normalizedBrokerName = matchedBroker.name.trim().toLowerCase();

                setBroker(matchedBroker);
                setLogs(
                    [...logsData]
                        .filter((entry) => {
                            if (typeof entry.brokerId === "number") {
                                return entry.brokerId === matchedBroker.id;
                            }

                            const haystack = `${entry.title} ${entry.description}`.toLowerCase();
                            return haystack.includes(normalizedBrokerName);
                        })
                        .sort(
                            (left, right) =>
                                new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
                        ),
                );
                setMails(
                    [...mailsData]
                        .filter((mail) => mail.counterparty === matchedBroker.name)
                        .sort((left, right) => parseSortableDate(right.date) - parseSortableDate(left.date)),
                );
            } catch (error) {
                console.error("Error loading case details:", error);
                if (isMounted) {
                    setBroker(createFallbackBroker(item));
                    setLogs([]);
                    setMails([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadCaseDetails();

        return () => {
            isMounted = false;
        };
    }, [item]);

    const sentMails = useMemo(
        () => mails.filter((mail) => mail.folder === "gesendet").length,
        [mails],
    );
    const inboxMails = useMemo(
        () => mails.filter((mail) => mail.folder === "posteingang").length,
        [mails],
    );
    const nextReviewDate = useMemo(() => {
        const timestamp = new Date(broker.latestLogTimestamp).getTime();

        if (Number.isNaN(timestamp)) {
            return "Offen";
        }

        return formatDateOnly(new Date(timestamp + 7 * 24 * 60 * 60 * 1000).toISOString());
    }, [broker.latestLogTimestamp]);

    const handleExportProtocol = () => {
        const protocol = buildProtocolExport(broker, logs, mails);
        const blob = new Blob([protocol], { type: "text/plain;charset=utf-8" });
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = objectUrl;
        link.download = `${broker.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "broker"}-protokoll.txt`;
        link.click();
        URL.revokeObjectURL(objectUrl);
    };

    const handleCreateMail = () => {
        const subject = `Anfrage zum Fall ${broker.name}`;
        window.location.href = `mailto:${broker.email}?subject=${encodeURIComponent(subject)}`;
    };

    const statusDetails = statusConfig[broker.status];
    const infoRows = [
        { label: "E-Mail", value: broker.email || "Nicht hinterlegt" },
        { label: "Website", value: broker.website || "Nicht hinterlegt", href: normalizeUrl(broker.website) },
        { label: "Sprache / Markt", value: broker.locale || "Nicht hinterlegt" },
        { label: "Letzte Aktivität", value: formatDateTime(broker.latestLogTimestamp) },
        { label: "Nächste Prüfung", value: nextReviewDate },
    ];

    return (
        <div className="relative h-full-respect-nav w-full overflow-hidden p-6">
            <div className="flex h-full w-full min-h-0 flex-col gap-6">
                <div className="flex flex-shrink-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="w-full sm:w-[150px]">
                            <ButtonComp label="Zurück" onClick={onBack} className="mr-0" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-semibold text-white">{broker.name}</h1>
                                <div className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-black/20 px-3 py-1 text-sm text-gray-200">
                                    <span className={`h-2.5 w-2.5 rounded-full ${statusDetails.dotClassName}`} />
                                    <span className={statusDetails.accentClassName}>{statusDetails.label}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 xl:w-[850px]">
                        <GlassComp
                            width="100%"
                            height={88}
                            tintOpacity={0.5}
                            className="rounded-3xl border border-gray-700 px-4"
                        >
                            <div className="flex h-full w-full flex-col justify-between gap-2 py-1">
                                <span className="text-xs uppercase tracking-[0.18em] text-gray-500">Aktivitäten</span>
                                <span className="mt-1 text-3xl font-semibold leading-none text-white">{logs.length}</span>
                            </div>
                        </GlassComp>
                        <GlassComp
                            width="100%"
                            height={88}
                            tintOpacity={0.5}
                            className="rounded-3xl border border-gray-700 px-4"
                        >
                            <div className="flex h-full w-full flex-col justify-between gap-2 py-1">
                                <span className="text-xs uppercase tracking-[0.18em] text-gray-500">Mails gesendet</span>
                                <span className="mt-1 text-3xl font-semibold leading-none text-white">{sentMails}</span>
                            </div>
                        </GlassComp>
                        <GlassComp
                            width="100%"
                            height={88}
                            tintOpacity={0.5}
                            className="rounded-3xl border border-gray-700 px-4"
                        >
                            <div className="flex h-full w-full flex-col justify-between gap-2 py-1">
                                <span className="text-xs uppercase tracking-[0.18em] text-gray-500">Antworten</span>
                                <span className="mt-1 text-3xl font-semibold leading-none text-white">{inboxMails}</span>
                            </div>
                        </GlassComp>
                        <GlassComp
                            width="100%"
                            height={88}
                            tintOpacity={0.5}
                            className="rounded-3xl border border-gray-700 px-4"
                        >
                            <div className="flex h-full w-full flex-col justify-between gap-2 py-1">
                                <span className="text-xs uppercase tracking-[0.18em] text-gray-500">Nächste Prüfung</span>
                                <span className="mt-1 text-base font-semibold leading-tight text-white">{nextReviewDate}</span>
                            </div>
                        </GlassComp>
                    </div>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(260px,0.95fr)_minmax(0,1.05fr)] gap-6 xl:grid-cols-[minmax(320px,360px)_minmax(0,1fr)] xl:grid-rows-none">
                    <div className="grid min-h-0 gap-6 grid-rows-[minmax(0,1fr)_minmax(220px,0.82fr)] xl:grid-rows-[minmax(0,1fr)_minmax(280px,0.9fr)]">
                        <GlassComp
                            width="100%"
                            height="100%"
                            tintOpacity={0.5}
                            className="h-full min-h-0 rounded-3xl border border-gray-700 p-6"
                        >
                            <div className="flex h-full w-full min-h-0 flex-col">
                                <div className="flex-shrink-0">
                                    <p className="text-lg font-semibold text-white">Brokerdetails</p>
                                </div>

                                <div className="mt-6 flex flex-1 flex-col justify-between gap-2">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Letzter Eintrag</p>
                                        <p className="mt-3 text-sm leading-6 text-gray-200">
                                            {broker.latestLog || "Für diesen Broker gibt es noch keinen protokollierten Eintrag."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-[minmax(0,110px)_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm">
                                        {infoRows.map((row) => (
                                            <div key={row.label} className="contents">
                                                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                                                    {row.label}
                                                </p>
                                                {row.href ? (
                                                    <a
                                                        href={row.href}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="break-all font-medium text-white transition-colors hover:text-blue-300"
                                                    >
                                                        {row.value}
                                                    </a>
                                                ) : (
                                                    <p className="break-all font-medium text-white">{row.value}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </GlassComp>

                        <GlassComp
                            width="100%"
                            height="100%"
                            tintOpacity={0.5}
                            className="h-full min-h-0 rounded-3xl border border-gray-700 p-6"
                        >
                            <div className="flex h-full w-full min-h-0 flex-col">
                                <div className="flex-shrink-0">
                                    <p className="text-lg font-semibold text-white">Schnellaktionen</p>
                                </div>

                                <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto pr-1 no-scrollbar sm:grid-cols-2 xl:grid-cols-1">
                                    <div>
                                        <ButtonComp
                                            label="Neue Nachricht senden"
                                            onClick={handleCreateMail}
                                            className="mr-0"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <ButtonComp label="Frist verlängern" disabled className="mr-0" />
                                    </div>
                                    <div>
                                        <ButtonComp
                                            label="Protokoll exportieren"
                                            onClick={handleExportProtocol}
                                            className="mr-0"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </GlassComp>
                    </div>

                    <div className="min-h-0">
                            <GlassComp
                                width="100%"
                                height="100%"
                                tintOpacity={0.5}
                                className="h-full min-h-0 rounded-3xl border border-gray-700 p-6"
                            >
                                <div className="flex h-full w-full min-h-0 flex-col">
                                    <div className="flex-shrink-0">
                                        <p className="text-lg font-semibold text-white">Aktivitätsverlauf</p>
                                    </div>

                                    <div className="mt-6 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1 no-scrollbar">
                                        {logs.length > 0 ? (
                                            logs.map((log) => (
                                                <div
                                                    key={`${log.timestamp}-${log.title}-${log.description}`}
                                                    className="rounded-3xl border border-gray-700 bg-black/20 p-4"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="font-semibold text-white">{log.title}</p>
                                                            <p className="mt-2 text-sm leading-6 text-gray-300">
                                                                {log.description || "Ohne weitere Beschreibung"}
                                                            </p>
                                                        </div>
                                                        <p className="min-w-fit text-xs text-gray-500">
                                                            {formatDateTime(log.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rounded-3xl border border-dashed border-gray-700 bg-black/10 p-4 text-sm text-gray-400">
                                                Für diesen Broker wurden noch keine einzelnen Log-Einträge gefunden.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </GlassComp>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="pointer-events-none absolute inset-x-6 top-6 rounded-3xl border border-gray-700 bg-black/35 px-4 py-3 text-sm text-gray-300 backdrop-blur-sm">
                    Fall wird geladen...
                </div>
            )}
        </div>
    );
};

export default CaseComp;
