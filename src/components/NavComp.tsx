import { useState } from "react";
import GlassContainer from "./GlassContainer";

const icon_size = 50;
const icon_count = 7;
const icon_padding = 10;

const container_width = icon_count * (icon_size + icon_padding) + icon_padding;
const container_height = icon_size + icon_padding * 2;

const placeholder = () => {
    return (
        <>
            <div className={`w-[${icon_size}px] h-[${icon_size}px] bg-gray-400 rounded-full`}></div>
        </>
    )
}

const NavComp = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [showIcons, setShowIcons] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        setTimeout(() => setShowIcons(true), 100);
    };

    const handleMouseLeave = () => {
        setIsFadingOut(true);
        setTimeout(() => setShowIcons(false), 100);
        setTimeout(() => {
            setIsHovered(false);
            setIsFadingOut(false);
        }, 100);
    };

    return (
        <nav
            className="fixed bottom-0 left-0 w-full h-[110px] flex justify-center items-end p-4 z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <GlassContainer 
            width={isHovered ? container_width : container_width * .6}
            height={isHovered ? container_height : container_height * .6}
            borderRadius={50}
            style={{ transition: 'width 0.2s ease-out, height 0.2s ease-out' }}
            >
                <div className="flex justify-around w-full">
                    {showIcons && [...Array(icon_count)].map((_, index) => (
                        <div 
                            key={index}
                            className="animate-in fade-in duration-100"
                            style={{ 
                                animation: isFadingOut ? 'fadeOut 0.2s ease-out' : 'fadeIn 0.2s ease-out'
                            }}
                        >
                            {placeholder()}
                        </div>
                    ))}
                </div>
            </GlassContainer>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `}</style>
        </nav>
    )
}

export default NavComp;