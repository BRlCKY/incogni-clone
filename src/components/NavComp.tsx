import { useState } from "react";
import GlassSurface from "./GlassContainer";

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

    return (
        <nav
            className="fixed bottom-0 left-0 w-full h-[110px] flex justify-center items-end p-4 z-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <GlassSurface 
            width={isHovered ? container_width : container_width * .6}
            height={isHovered ? container_height : container_height * .6}
            borderRadius={50}
            >
                <div className="flex justify-around w-full">
                    {isHovered && [...Array(icon_count)].map((_, index) => (
                        <>
                            {placeholder()}
                        </>
                    ))}
                </div>
            </GlassSurface>
        </nav>
    )
}

export default NavComp;