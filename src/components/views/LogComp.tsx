import ListComp from "../ListComp";

const LogComp = () => {
    return (
        <div className="p-4 h-full-respect-nav overflow-y-scroll">
            {[...Array(100)].map((_, index) => (
                <div className="mb-1">
                    <ListComp 
                      height={30}
                      title={`Log Entry ${index + 2}`} 
                      details="This is a log entry" 
                      date="24.01.2026" 
                      time="13:45" 
                      circleColorClass="bg-blue-500" />
                </div>
            ))}
        </div>
    )
};

export default LogComp;