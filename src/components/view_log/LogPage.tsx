import ListComp from "./ListComp";

const LogPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col items-center gap-4 mt-6">
                <ListComp text="Broker geantwortet" />
                <ListComp text="Nachricht gesendet" />
                <ListComp text="Wartet auf Antwort" />
            </div>
        </div>
    );
};

export default LogPage;