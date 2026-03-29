import { useRef, useState } from "react";
import GlassContainer from "./GlassContainer";
import { Tooltip } from "react-tooltip";

const icon_size = 50;
const icon_padding = 10;

interface NavCompProps {
    onNavClick: (key: string) => void;
    viewData: Record<string, { icon: string; alt: string; text: string }>;
}

const NavComp = ({ onNavClick, viewData }: NavCompProps) => {
    const icon_count = Object.keys(viewData).length;
    const container_width = icon_count * (icon_size + icon_padding) + icon_padding + 25;
    const container_height = icon_size + icon_padding * 2;
    const icon_constrainer = icon_count * (icon_size + icon_padding) + icon_padding - 16;
    const navRef = useRef<HTMLElement | null>(null);

    const [isHovered, setIsHovered] = useState(false);
    const [showIcons, setShowIcons] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const revealIcons = (immediate = false) => {
        setIsHovered(true);
        setIsFadingOut(false);

        if (immediate) {
            setShowIcons(true);
            return;
        }

        setTimeout(() => setShowIcons(true), 100);
    };

    const hideIcons = () => {
        setIsFadingOut(true);
        setTimeout(() => setShowIcons(false), 100);
        setTimeout(() => {
            setIsHovered(false);
            setIsFadingOut(false);
        }, 100);
    };

    const navIcon = (iconSrc: string, tooltipId: string, text: string) => (
        <>
            <img
              src={iconSrc}
              alt=""
              width={icon_size}
              height={icon_size}
              className="relative filter brightness-50 transition-all hover:bottom-[3px] hover:brightness-100"
              data-tooltip-id={tooltipId}
              data-tooltip-content={text}
              aria-hidden="true"
            />
            <Tooltip id={tooltipId} place="top" />
        </>
    );

    return (
        <nav
          ref={navRef}
          className="fixed bottom-0 z-50 flex h-[100px] items-end justify-center p-4 focus-visible:outline-none"
          style={{ width: `${container_width + 100}px`, left: `calc(50% - (${container_width / 2 + 50}px))` }}
          onMouseEnter={() => revealIcons()}
          onMouseLeave={hideIcons}
          onFocusCapture={() => revealIcons(true)}
          onBlurCapture={(event) => {
              const nextTarget = event.relatedTarget;

              if (nextTarget instanceof Node && navRef.current?.contains(nextTarget)) {
                  return;
              }

              hideIcons();
          }}
          tabIndex={0}
          aria-label="Hauptnavigation"
        >
            <GlassContainer
              width={isHovered ? container_width : container_width * 0.6}
              height={isHovered ? container_height : container_height * 0.6}
              borderRadius={50}
              style={{ transition: "width 0.2s ease-out, height 0.2s ease-out" }}
              className="overflow-visible"
            >
                <div className="flex w-full justify-around" style={{ maxWidth: `${icon_constrainer}px` }}>
                    {showIcons && Object.entries(viewData).map(([key, data]) => {
                        const tooltipId = `tooltip-${key}`;

                        return (
                            <button
                              key={key}
                              type="button"
                              className="animate-in fade-in duration-100 bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                              style={{
                                  animation: isFadingOut ? "fadeOut 0.2s ease-out" : "fadeIn 0.2s ease-out",
                              }}
                              onClick={() => onNavClick(key)}
                              aria-label={data.text}
                            >
                                {navIcon(data.icon, tooltipId, data.text)}
                            </button>
                        );
                    })}
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
    );
};

export default NavComp;
