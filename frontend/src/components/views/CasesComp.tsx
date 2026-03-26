import { useEffect, useState } from "react";
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
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetch("http://localhost:3000/cases")
            .then((response) => response.json())
            .then((data) => setItems(data))
            .catch((error) => console.error("Error fetching cases:", error));
    }, []);



    // const handleSelectAll = () => {
    //     setSelectedItems(new Set(items));
    // };

    const handleToggleItem = (index: number) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedItems(newSelected);
    };

    const buttonActions: Array<{ label: string; onClick?: () => void }> = [
        // { label: "Alle anzeigen", handleSelectAll },
        // { label: "Ausgewählte anschreiben" },
        // { label: "Ausgewählte löschen", onClick: handleDeleteSelected },
        { label: "Abgelehnte anzeigen"},
        { label: "Bestätigte anzeigen"},
        { label: "Offene anzeigen"},
        { label: "Neue anzeigen"}
    ];

    return (
        <>
            <div className="fixed flex justify-evenly pl-8 top-4 right-4 z-50 w-full h-[50px]">
                {buttonActions.map(({ label, onClick }) => (
                    <ButtonComp key={label} label={label} onClick={onClick} />
                ))}
            </div>
            <div className="h-full-respect-nav p-4">

                <div className="mt-16"> {/* mt-16, to respect the buttons on top */}
                    {
                    
                    
                    items.map((item) => (
                        <div className="mb-1" key={item.brokerName}>
                            <ListComp
                                height={50}
                                title={item.brokerName}
                                text1={item.latestLogDescription}
                                text2={new Date(item.latestLogTimestamp).getDate().toString().padStart(2, '0') + "." + (new Date(item.latestLogTimestamp).getMonth() + 1).toString().padStart(2, '0') + "." + new Date(item.latestLogTimestamp).getFullYear()}
                                text3={new Date(item.latestLogTimestamp).getHours().toString().padStart(2, '0') + ':' + new Date(item.latestLogTimestamp).getMinutes().toString().padStart(2, '0')}
                                circleColorClass={statusColorMap[item.brokerStatus]}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
};

export default CasesComp;
