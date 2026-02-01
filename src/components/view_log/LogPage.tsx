import ListComp from "./ListComp";
import SearchbarComp from "./SearchbarComp";

const LogPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col items-center gap-4 mt-6">

                <div className="flex justify-end w-3/4">
                    <SearchbarComp />
                </div>
                
                <ListComp title="Broker geantwortet" text2="Broker XY hat mit einer Bestätigung geddddddddddddddddddddddddddantwortet. Deine ..." text3="4. Januar 2026, 13:45" circleColor="bg-green-500" />
                <ListComp title="Broker geantwortet" text2="Broker XY hat mit einer Bestätigung geantwortet. Deine ..." text3="4. Januar 2026, 13:45"/>
                <ListComp title="Broker geantwortet" text2="Broker XY hat mit einer Bestätigung geantwortet. Deine ..." text3="4. Januar 2026, 13:45"/>
            </div>
        </div>
    );
};

export default LogPage;