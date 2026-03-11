import GlassContainer from "../GlassContainer";

// TODO: API
const summaryData = [
    { label: "Broker angeschrieben", value: 41, colorClass: "text-yellow-400" },
    { label: "Broker haben geantwortet", value: 18, colorClass: "text-green-400" },
    { label: "Cases aktuell offen", value: 12, colorClass: "text-red-400" },
];

// TODO: API
const brokerPerformance = [
    { name: "Broker G", time: "14 Tage", colorClass: "text-red-400" },
    { name: "Broker F", time: "12 Tage", colorClass: "text-red-400" },
    { name: "Broker E", time: "8 Tage", colorClass: "text-yellow-400" },
    { name: "Broker D", time: "6 Tage", colorClass: "text-yellow-400" },
    { name: "Broker C", time: "2 Tage", colorClass: "text-green-400" },
    { name: "Broker B", time: "1 Tag", colorClass: "text-green-400" },
    { name: "Broker A", time: "4 Stunden", colorClass: "text-green-400" },
];

// Maybe add random dates in the API
const activityLog = [
    { time: "14:32", message: "Broker A hat der Datenloeschung zugestimmt" },
    { time: "13:45", message: "Broker B hat um mehr Zeit gebeten" },
    { time: "13:12", message: "Fall mit Broker C abgeschlossen" },
    { time: "12:58", message: "Broker D hat eine Bestaetigung gesendet" },
    { time: "12:20", message: "Neue Anfrage an Broker E" },
    { time: "11:45", message: "Broker F hat mit Rueckfragen geantwortet" },
    { time: "11:00", message: "Erinnerung an Broker G gesendet" },
];

const cardClassName =
    "rounded-3xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors duration-200 p-6";

type DashboardCompProps = {
    onTileClick: (view: string) => void;
};

const getTileInteractionProps = (onClick: () => void) => ({
    onClick,
});

const DashboardComp = ({ onTileClick }: DashboardCompProps) => {
    return (
        <div className="h-full-respect-nav px-4 py-5 md:px-6 md:py-6">
            <div className="mx-auto grid w-full max-w-[80rem] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1.5fr]">
                <GlassContainer
                  width={480}
                  height={300}
                  backgroundOpacity={.5}
                    className={`${cardClassName} min-h-[350px] cursor-pointer md:min-h-[390px]`}
                    {...getTileInteractionProps(() => onTileClick("CASES"))}
                >
                    <div className="mb-5 text-base text-gray-300">Übersicht</div>
                    <div className="flex h-[calc(100%-2rem)] flex-col gap-6">
                        {summaryData.map((item) => (
                            <div key={item.label}>
                                <div className={`text-3xl font-semibold ${item.colorClass}`}>{item.value}</div>
                                <div className="mt-1 text-sm text-gray-400">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </GlassContainer>

                <section
                    className={`${cardClassName} min-h-[350px] cursor-pointer md:min-h-[390px] lg:col-start-1`}
                    {...getTileInteractionProps(() => onTileClick("MAIL"))}
                >
                    <div className="mb-5 text-base text-gray-300">Antwortzeiten</div>
                    <div className="flex max-h-[290px] flex-col gap-3 overflow-y-hidden pr-1">
                        {brokerPerformance.map((broker) => (
                            <div key={broker.name} className="flex items-center justify-between text-sm">
                                <span className="text-white">{broker.name}</span>
                                <span className={`font-semibold ${broker.colorClass}`}>{broker.time}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section
                    className={`${cardClassName} min-h-[350px] cursor-pointer md:min-h-[390px] lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:min-h-[794px]`}
                    {...getTileInteractionProps(() => onTileClick("LOG"))}
                >
                    <div className="mb-5 text-base text-gray-300">Aktuell</div>
                    <div className="flex max-h-[700px] flex-col gap-3 overflow-hidden pr-1">
                        {activityLog.map((log) => (
                            <div key={`${log.time}-${log.message}`} className="flex gap-3 text-sm">
                                <div className="min-w-fit font-semibold text-purple-primary">{log.time}</div>
                                <div className="text-gray-200">{log.message}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>  
        </div>
    );
};

export default DashboardComp;