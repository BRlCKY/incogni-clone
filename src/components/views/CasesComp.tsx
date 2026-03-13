import { useState } from "react";
import ButtonComp from "../ButtonComp";
import ListComp from "../ListComp";

const CasesComp = () => {
    const statusColorMap = {
        rejected: "bg-red-700",
        stalled: "bg-yellow-500",
        done: "bg-green-600",
    } as const;
    const selectedColor = "bg-blue-500";
    const statuses = Object.keys(statusColorMap) as Array<keyof typeof statusColorMap>;
    const [items, setItems] = useState<number[]>([...Array(100)].map((_, i) => i));
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    const handleSelectAll = () => {
        setSelectedItems(new Set(items));
    };

    const handleDeselectAll = () => {
        setSelectedItems(new Set());
    };

    const handleSelectRed = () => {
        setSelectedItems(new Set(items.filter(item => statuses[item % statuses.length] === "rejected")));
    };

    const handleDeleteSelected = () => {
        const newItems = items.filter(item => !selectedItems.has(item));
        setItems(newItems);
        setSelectedItems(new Set());
    };

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
        { label: "Alle auswählen", onClick: handleSelectAll },
        { label: "Alle abwählen", onClick: handleDeselectAll },
        { label: "Rote auswählen", onClick: handleSelectRed },
        { label: "Filtern" },
        { label: "Ausgewählte anschreiben" },
        { label: "Ausgewählte löschen", onClick: handleDeleteSelected },
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
                    {items.map((index) => (
                        <div className="mb-1" key={index}>
                            <ListComp
                                height={50}
                                title={`Broker Number ${index + 1}`}
                                text1="Latest update: Request accepted/stalled/rejected"
                                circleColorClass={selectedItems.has(index) ? selectedColor : statusColorMap[statuses[index % statuses.length]]}
                                onItemClick={() => handleToggleItem(index)} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
};

export default CasesComp;