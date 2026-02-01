import ListComp from "./ListComp";
import SearchbarComp from "./SearchbarComp";

const LogPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col items-center gap-4 mt-6">

                <div className="flex justify-end w-3/4">
                    <SearchbarComp />
                </div>
                
                <ListComp text="Broker geantwortet" />
                <ListComp text="Nachricht gesendet" />
                <ListComp text="Wartet auf Antwort" />
            </div>
        </div>
    );
};

export default LogPage;