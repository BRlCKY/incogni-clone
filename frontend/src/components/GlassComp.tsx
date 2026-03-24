import {
    type CSSProperties,
    type HTMLAttributes,
    type MouseEvent,
    useEffect,
    useState,
} from "react";

export interface GlassCompProps extends HTMLAttributes<HTMLDivElement> {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    tintOpacity?: number;
    saturation?: number;
    style?: CSSProperties;
    isHoverable?: boolean;
}

const useDarkMode = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => setIsDark(event.matches);
        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    return isDark;
};

const supportsBackdropFilter = () => {
    if (typeof window === "undefined" || typeof window.CSS === "undefined") {
        return false;
    }

    return (
        window.CSS.supports("backdrop-filter", "blur(10px)") ||
        window.CSS.supports("-webkit-backdrop-filter", "blur(10px)")
    );
};

const GlassComp = ({
    children,
    width = 200,
    height = 80,
    borderRadius = 20,
    tintOpacity,
    saturation = 1.8,
    className = "",
    style,
    isHoverable = false,
    onMouseEnter,
    onMouseLeave,
    ...rest
}: GlassCompProps) => {
    const isDarkMode = useDarkMode();
    const [hasBackdropFilter, setHasBackdropFilter] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const normalizedTintOpacity =
        typeof tintOpacity === "number" && Number.isFinite(tintOpacity)
            ? Math.min(1, Math.max(0, tintOpacity))
            : undefined;
    const {
        filter: customFilter,
        transition: customTransition,
        ...styleWithoutHoverEffects
    } = style ?? {};

    useEffect(() => {
        setHasBackdropFilter(supportsBackdropFilter());
    }, []);

    const baseStyles: CSSProperties = {
        ...styleWithoutHoverEffects,
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: `${borderRadius}px`,
    };
    const normalizedCustomFilter =
        typeof customFilter === "string" && customFilter !== "none" ? customFilter : undefined;
    const hoverFilter = [normalizedCustomFilter, "contrast(.8) brightness(1.1)"]
        .filter(Boolean)
        .join(" ");
    const resolvedFilter = isHoverable ? (isHovered ? hoverFilter : customFilter ?? "none") : customFilter;
    const resolvedTransition = isHoverable
        ? [customTransition, "filter 180ms ease-out"].filter(Boolean).join(", ")
        : customTransition;

    const containerStyles: CSSProperties = isDarkMode
        ? hasBackdropFilter
            ? {
                  ...baseStyles,
                  background: `rgba(0, 0, 0, ${normalizedTintOpacity ?? 0.1})`,
                  backdropFilter: `blur(12px) saturate(${saturation}) brightness(1.2)`,
                  WebkitBackdropFilter: `blur(12px) saturate(${saturation}) brightness(1.2)`,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)`,
              }
            : {
                  ...baseStyles,
                  background: `rgba(0, 0, 0, ${normalizedTintOpacity ?? 0.4})`,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)`,
              }
        : hasBackdropFilter
          ? {
                ...baseStyles,
                background: `rgba(255, 255, 255, ${normalizedTintOpacity ?? 0.25})`,
                backdropFilter: `blur(12px) saturate(${saturation}) brightness(1.1)`,
                WebkitBackdropFilter: `blur(12px) saturate(${saturation}) brightness(1.1)`,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.2),
                        0 2px 16px 0 rgba(31, 38, 135, 0.1),
                        inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
                        inset 0 -1px 0 0 rgba(255, 255, 255, 0.2)`,
            }
          : {
                ...baseStyles,
                background: `rgba(255, 255, 255, ${normalizedTintOpacity ?? 0.4})`,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.5),
                        inset 0 -1px 0 0 rgba(255, 255, 255, 0.3)`,
            };
    containerStyles.filter = resolvedFilter;
    containerStyles.transition = resolvedTransition;

    const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
        if (isHoverable) {
            setIsHovered(true);
        }
        onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
        if (isHoverable) {
            setIsHovered(false);
        }
        onMouseLeave?.(event);
    };

    return (
        <div
            className={`relative flex items-center justify-center overflow-hidden transition-opacity duration-[260ms] ease-out ${className}`}
            style={containerStyles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...rest}
        >
            <div className="relative z-10 flex h-full w-full items-center justify-center rounded-[inherit] p-2">
                {children}
            </div>
        </div>
    );
};

export default GlassComp;
