import type { ButtonHTMLAttributes, ReactNode } from "react";
import GlassComp from "./GlassComp";

type ButtonCompProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    label: ReactNode;
    isActive?: boolean;
};

const ButtonComp = ({
    label,
    isActive = false,
    type = "button",
    className = "",
    disabled = false,
    ...buttonProps
}: ButtonCompProps) => {
    const stateClasses = disabled
        ? "border-gray-700 opacity-60"
        : isActive
          ? "border-blue-400/60 bg-blue-900/25"
          : "border-gray-700 hover:bg-gray-800/50";

    return (
        <button
            type={type}
            disabled={disabled}
            className={`mr-4 w-full min-w-0 bg-transparent text-left ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`.trim()}
            {...buttonProps}
        >
            <GlassComp
                width="100%"
                height={50}
                borderRadius={999}
                tintOpacity={0.5}
                className={`rounded-full border px-4 ${stateClasses}`.trim()}
                isHoverable={!disabled}
            >
                <span className="truncate text-sm font-semibold text-white">{label}</span>
            </GlassComp>
        </button>
    );
};

export default ButtonComp;