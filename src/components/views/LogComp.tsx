import SearchbarComp from "../SearchbarComp";
import ListComp from "../ListComp";

const LogComp = () => {
    return (
        <div className="h-full-respect-nav p-4">
            <div className="fixed pl-8 top-4 right-4 z-50 max-w-[425px] w-full"> {/* 425 px is mobile L width */}
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