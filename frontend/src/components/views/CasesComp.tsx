import { useEffect, useState } from "react";
import CaseComp from "./CaseComp";
import ButtonComp from "../ButtonComp";
import ListComp from "../ListComp";
import { BrokerStatus, type CaseItem } from "../../../../shared/types";

const CasesComp = () => {
    const statusColorMap: Record<BrokerStatus, string> = {
        [BrokerStatus.REJECTED]: "bg-red-700",
        [BrokerStatus.PENDING]: "bg-yellow-500",
        [BrokerStatus.DONE]: "bg-green-600",
        [BrokerStatus.NEW]: "bg-blue-500",
    };

    const [items, setItems] = useState<CaseItem[]>([]);
    const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

    useEffect(() => {
        fetch("http://localhost:3000/cases")
            .then((response) => response.json())
            .then((data) => setItems(data))
            .catch((error) => console.error("Error fetching cases:", error));
    }, []);

    const buttonActions: Array<{ label: string; onClick?: () => void }> = [
        { label: "Alle anzeigen" },
        { label: "Abgelehnte anzeigen" },
        { label: "Bestätigte anzeigen" },
        { label: "Offene anzeigen" },
        { label: "Neue anzeigen" }
    ];

    if (selectedCase) {
        return <CaseComp item={selectedCase} onBack={() => setSelectedCase(null)} />;
    }

    return (
        <>
            <div className="fixed flex justify-evenly pl-8 top-4 right-4 z-50 w-full h-[50px]">
                {buttonActions.map(({ label, onClick }) => (
                    <ButtonComp key={label} label={label} onClick={onClick} />
                ))}
            </div>
            <div className="h-full-respect-nav p-4">

                <div className="mt-16"> {/* mt-16, to respect the buttons on top */}
                    {/* on mac buttons are slightly moved. this is a problem on apples side */}
                    {items.map((item) => (
                        <div className="mb-1" key={item.brokerName}>
                            <ListComp
                                height={50}
                                title={item.brokerName}
                                text1={item.latestLogDescription}
                                text2={new Date(item.latestLogTimestamp).getDate().toString().padStart(2, '0') + "." + (new Date(item.latestLogTimestamp).getMonth() + 1).toString().padStart(2, '0') + "." + new Date(item.latestLogTimestamp).getFullYear()}
                                text3={new Date(item.latestLogTimestamp).getHours().toString().padStart(2, '0') + ':' + new Date(item.latestLogTimestamp).getMinutes().toString().padStart(2, '0')}
                                circleColorClass={statusColorMap[item.brokerStatus]}
                                onItemClick={() => setSelectedCase(item)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
};

export default CasesComp;
