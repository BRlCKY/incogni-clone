import SearchbarComp from "../SearchbarComp";
import ListComp from "../ListComp";
import { useEffect, useMemo, useState } from "react";
import { LogEntry } from "../../../../shared/types";

const LogComp = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/logs")
            .then((response) => response.json())
            .then((data) => setLogs(data))
            .catch((error) => console.error("Error fetching logs:", error));
    }, []);

    const filteredLogs = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        if (!normalizedQuery) {
            return logs;
        }

        return logs.filter((log) => {
            const logDate = new Date(log.timestamp);
            const searchableContent = [
                log.title,
                log.description,
                logDate.toLocaleDateString("de-DE"),
                logDate.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
            ]
            .join(" ")
            .toLowerCase();

            return searchableContent.includes(normalizedQuery);
        });
    }, [logs, searchQuery]);

    return (
        <div className="h-full-respect-nav p-4">
            <div className="fixed pl-8 top-4 right-4 z-50 max-w-[425px] w-full">
                <SearchbarComp
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Logs durchsuchen"
                  aria-label="Logs durchsuchen"
                  height={40}
                />
            </div>
            <div className="mt-12">
                {filteredLogs.map((log) => (
                    <div className="mb-1" key={`${log.title}-${log.timestamp}`}>
                        <ListComp
                          height={30}
                          title={log.title}
                          text1={log.description}
                          text2={new Date(log.timestamp).getDate().toString().padStart(2, "0") + "." + (new Date(log.timestamp).getMonth() + 1).toString().padStart(2, "0") + "." + new Date(log.timestamp).getFullYear()}
                          text3={new Date(log.timestamp).getHours().toString().padStart(2, "0") + ":" + new Date(log.timestamp).getMinutes().toString().padStart(2, "0")}
                          circleColorClass="bg-blue-500"
                        />
                    </div>
                ))}

                {filteredLogs.length === 0 && (
                    <p className="mt-4 text-sm text-gray-400">Keine passenden Logs gefunden.</p>
                )}
            </div>
        </div>
    );
};

export default LogComp;
