import SearchbarComp from "../SearchbarComp";
import ListComp from "../ListComp";
import { useEffect, useState } from "react";
import { LogEntry } from "../../../../shared/types";

const LogComp = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/logs")
            .then((response) => response.json())
            .then((data) => setLogs(data))
            .catch((error) => console.error("Error fetching logs:", error));
    }, []);

    return (
        <div className="h-full-respect-nav p-4">
            <div className="fixed pl-8 top-4 right-4 z-50 max-w-[425px] w-full"> {/* 425 px is mobile L width */}
                <SearchbarComp 
                height={40} />
            </div>
            <div className="mt-12">
                {logs.map((log, index) => (
                    <div className="mb-1">
                        <ListComp
                            height={30}
                            title={log.title} // SHOULD BE BROKER NAME
                            text1={log.description} 
                            text2={new Date(log.timestamp).getDate().toString().padStart(2, '0') + "." + (new Date(log.timestamp).getMonth() + 1).toString().padStart(2, '0') + "." + new Date(log.timestamp).getFullYear()}
                            text3={new Date(log.timestamp).getHours().toString().padStart(2, '0') + ':' + new Date(log.timestamp).getMinutes().toString().padStart(2, '0')}
                            circleColorClass="bg-blue-500" />
                    </div>
                ))}
            </div>
        </div>

    )
};

export default LogComp;