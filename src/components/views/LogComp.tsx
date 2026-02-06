import SearchbarComp from "../SearchbarComp";
import ListComp from "../ListComp";

const LogComp = () => {
    return (
        <div className="h-full-respect-nav p-4">
            <div className="fixed inset-x-4 flex justify-end">
                <SearchbarComp />
            </div>
            <div className="mt-12">
                {[...Array(100)].map((_, index) => (
                    <div className="mb-1">
                        <ListComp 
                        height={30}
                        title={`Log Entry ${index + 1}`} 
                        details="This is a log entry" 
                        date="24.01.2026" 
                        time="13:45" 
                        circleColorClass="bg-blue-500" />
                    </div>
                ))}
            </div>
        </div>
        
    )
};

export default LogComp;