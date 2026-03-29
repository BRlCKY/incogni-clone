import { useEffect, useMemo, useState } from "react";
import CaseComp from "./CaseComp";
import ButtonComp from "../ButtonComp";
import ListComp from "../ListComp";
import { BrokerStatus, type CaseItem } from "../../../../shared/types";

type CaseFilter = "all" | BrokerStatus;

const CasesComp = () => {
    const statusColorMap: Record<BrokerStatus, string> = {
        [BrokerStatus.REJECTED]: "bg-red-700",
        [BrokerStatus.PENDING]: "bg-yellow-500",
        [BrokerStatus.DONE]: "bg-green-600",
        [BrokerStatus.NEW]: "bg-blue-500",
    };

    const [items, setItems] = useState<CaseItem[]>([]);
    const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
    const [activeFilter, setActiveFilter] = useState<CaseFilter>("all");

    useEffect(() => {
        fetch("http://localhost:3000/cases")
            .then((response) => response.json())
            .then((data) => setItems(data))
            .catch((error) => console.error("Error fetching cases:", error));
    }, []);

    const filteredItems = useMemo(() => {
        if (activeFilter === "all") {
            return items;
        }

        return items.filter((item) => item.brokerStatus === activeFilter);
    }, [activeFilter, items]);

    const buttonActions: Array<{ label: string; filter: CaseFilter }> = [
        { label: "Alle anzeigen", filter: "all" },
        { label: "Abgelehnte anzeigen", filter: BrokerStatus.REJECTED },
        { label: "Bestätigte anzeigen", filter: BrokerStatus.DONE },
        { label: "Offene anzeigen", filter: BrokerStatus.PENDING },
        { label: "Neue anzeigen", filter: BrokerStatus.NEW },
    ];

    if (selectedCase) {
        return <CaseComp item={selectedCase} onBack={() => setSelectedCase(null)} />;
    }

    return (
        <>
            <div className="fixed flex justify-evenly pl-8 top-4 right-4 z-50 w-full h-[50px]">
                {buttonActions.map(({ label, filter }) => (
                    <ButtonComp
                        key={label}
                        label={label}
                        onClick={() => setActiveFilter(filter)}
                        isActive={activeFilter === filter}
                    />
                ))}
            </div>
            <div className="h-full-respect-nav p-4">
                <div className="mt-16">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div className="mb-1" key={item.brokerId}>
                                <ListComp
                                    height={50}
                                    title={item.brokerName}
                                    text1={item.latestLogDescription}
                                    text2={new Date(item.latestLogTimestamp).getDate().toString().padStart(2, "0") + "." + (new Date(item.latestLogTimestamp).getMonth() + 1).toString().padStart(2, "0") + "." + new Date(item.latestLogTimestamp).getFullYear()}
                                    text3={new Date(item.latestLogTimestamp).getHours().toString().padStart(2, "0") + ":" + new Date(item.latestLogTimestamp).getMinutes().toString().padStart(2, "0")}
                                    circleColorClass={statusColorMap[item.brokerStatus]}
                                    onItemClick={() => setSelectedCase(item)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="rounded-3xl border border-dashed border-gray-700 bg-black/10 px-4 py-6 text-sm text-gray-400">
                            Für diesen Filter wurden keine Fälle gefunden.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CasesComp;
