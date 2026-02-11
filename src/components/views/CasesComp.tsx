import { useState } from "react";
import ListComp from "../ListComp";

const CasesComp = () => {
    const colors = ["bg-red-700", "bg-yellow-500", "bg-green-600"];
    const [items, setItems] = useState<number[]>([...Array(100)].map((_, i) => i));
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    const handleSelectAll = () => {
        setSelectedItems(new Set(items));
    };

    const handleDeselectAll = () => {
        setSelectedItems(new Set());
    };

    const handleSelectRed = () => {
        setSelectedItems(new Set(items.filter(item => colors[item % colors.length] === "bg-red-700")));
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

    return (
        <>
            <div className="fixed flex justify-evenly pl-8 top-4 right-4 z-50 w-full h-[50px] mb-4 overflow-y-hidden"> {/* 425 px is mobile L width */}
                {/* TODO: Make this a component and map through an array of button names and onClick functions */}
                <div className="h-[50px] w-full mr-4 bg-gray-900 rounded-full items-center px-3 justify-center align-middle flex font-bold hover:bg-gray-800 cursor-pointer"
                    onClick={handleSelectAll}>
                    <p className="text-white text-sm">Alle auswählen</p>
                </div>
                <div className="h-[50px] w-full mr-4 bg-gray-900 rounded-full items-center px-3 justify-center align-middle flex font-bold hover:bg-gray-800 cursor-pointer"
                    onClick={handleDeselectAll}>
                    <p className="text-white text-sm">Alle abwählen</p>
                </div>
                <div className="h-[50px] w-full mr-4 bg-gray-900 rounded-full items-center px-3 justify-center align-middle flex font-bold hover:bg-gray-800 cursor-pointer"
                    onClick={handleSelectRed}>
                    <p className="text-white text-sm">Rote auswählen</p>
                </div>
                <div className="h-[50px] w-full mr-4 bg-gray-900 rounded-full items-center px-3 justify-center align-middle flex font-bold hover:bg-gray-800 cursor-pointer">
                    <p className="text-white text-sm">Filtern</p>
                </div>
                <div className="h-[50px] w-full mr-4 bg-gray-900 rounded-full items-center px-3 justify-center align-middle flex font-bold hover:bg-gray-800 cursor-pointer">
                    <p className="text-white text-sm">Ausgewählte anschreiben</p>
                </div>
                <div className="h-[50px] w-full mr-4 bg-gray-900 rounded-full items-center px-3 justify-center align-middle flex font-bold hover:bg-gray-800 cursor-pointer"
                    onClick={handleDeleteSelected}>
                    <p className="text-white text-sm">Ausgewählte löschen</p>
                </div>
            </div>
            <div className="h-full-respect-nav p-4">

                <div className="mt-16"> {/* magic number sorry, @jir pls help me find a formula for this*/}
                    {items.map((index) => (
                        <div className="mb-1" key={index}>
                            <ListComp
                                height={50}
                                title={`Broker Number ${index + 1}`}
                                details="Latest update: Request accepted/stalled/rejected"
                                circleColorClass={selectedItems.has(index) ? "bg-blue-500" : colors[index % colors.length]}
                                onItemClick={() => handleToggleItem(index)} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
};

export default CasesComp;