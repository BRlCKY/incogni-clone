import { useState } from "react";
import GlassContainer from "./GlassContainer";
import { max } from "three/tsl";

const icon_size = 50;
const icon_padding = 10;

interface NavCompProps {
    onNavClick: (key: string) => void;
    viewData: Record<string, { icon: string; alt: string; text: string }>;
}

const NavComp = ({ onNavClick, viewData }: NavCompProps) => {
    const icon_count = Object.keys(viewData).length;
    const container_width = icon_count * (icon_size + icon_padding) + icon_padding + 25; // 25px extra padding for non round icons
    const container_height = icon_size + icon_padding * 2;
    const icon_constrainer = icon_count * (icon_size + icon_padding) + icon_padding - 16; // 1rem = 16px padding on both sides

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

    const navIcon = (iconSrc: string, alt: string) => {
        return (
            <>
                <img 
                  src={iconSrc}
                  alt={alt}
                  width={icon_size}
                  height={icon_size}
                  className="relative hover:bottom-[3px] filter brightness-50 hover:brightness-100 transition-all"/>
            </>
        )
    }

    return (
        <nav
          className="fixed bottom-0 h-[100px] flex justify-center items-end p-4 z-50"
          style={{width: `${container_width + 100}px`, left: `calc(50% - (${container_width / 2 + 50}px))`}}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave} >
            <GlassContainer 
              width={isHovered ? container_width : container_width * .6}
              height={isHovered ? container_height : container_height * .6}
              borderRadius={50}
              style={{ transition: 'width 0.2s ease-out, height 0.2s ease-out' }} >
                <div 
                  className="flex justify-around w-full"
                  style={{maxWidth: `${icon_constrainer}px`}} >
                    {showIcons && Object.entries(viewData).map(([key, data]) => (
                        <div 
                          key={key}
                          className="animate-in fade-in duration-100"
                          style={{ 
                            animation: isFadingOut ? 'fadeOut 0.2s ease-out' : 'fadeIn 0.2s ease-out'
                          }}
                          onClick={() => onNavClick(key)} >
                            {navIcon(data.icon, data.alt)}
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