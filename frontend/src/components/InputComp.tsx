import type { InputHTMLAttributes } from "react";

interface InputCompProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "width" | "height"> {
    width?: number | string;
    height?: number | string;
}

const InputComp = ({
    width = "100%",
    height = "50px",
    type = "text",
    className = "",
    style,
    ...inputProps
}: InputCompProps) => {
    const resolvedWidth = typeof width === "number" ? `${width}px` : width;
    const resolvedHeight = typeof height === "number" ? `${height}px` : height;
    const resolvedAriaLabel =
        inputProps["aria-label"] ??
        (typeof inputProps.placeholder === "string" ? inputProps.placeholder : undefined);

    return (
        <input
          className={`rounded-full bg-transparent px-2 outline outline-[1.5px] outline-white transition-[outline-width] duration-75 focus:outline-[3px] focus:outline-white ${className}`.trim()}
          style={{ ...style, width: resolvedWidth, height: resolvedHeight }}
          type={type}
          aria-label={resolvedAriaLabel}
          {...inputProps} />
    );
};

export default InputComp;
