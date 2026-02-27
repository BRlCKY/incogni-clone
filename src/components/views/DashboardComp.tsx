import MergedShape from "../DashboardShapes";
import MagicBento from "../MagicBento";

const DashboardComp = () => {
    /* we dont like magic bentos. but we like magic bendschus */
    return (
        <div className="flex justify-center items-center h-full-respect-nav">
            <MagicBento
                textAutoHide={true}
                enableStars
                enableSpotlight
                enableBorderGlow={true}
                enableTilt={false}
                enableMagnetism={false}
                clickEffect
                spotlightRadius={400}
                particleCount={12}
                glowColor="132, 0, 255"
                disableAnimations={false}
            />
        </div>
    )
};

export default DashboardComp;