import type { AriaAttributes, HTMLAttributes, KeyboardEventHandler } from "react";

type AccessibleClickOptions = {
    label?: string;
    disabled?: boolean;
    pressed?: boolean;
    expanded?: boolean;
    hasPopup?: AriaAttributes["aria-haspopup"];
};

type AccessibleClickProps = Pick<HTMLAttributes<HTMLElement>, "onKeyDown" | "role" | "tabIndex"> & {
    "aria-disabled"?: boolean;
    "aria-expanded"?: boolean;
    "aria-haspopup"?: AriaAttributes["aria-haspopup"];
    "aria-label"?: string;
    "aria-pressed"?: boolean;
};

export const getAccessibleClickProps = (
    onActivate: (() => void) | undefined,
    {
        label,
        disabled = false,
        pressed,
        expanded,
        hasPopup,
    }: AccessibleClickOptions = {},
): AccessibleClickProps => {
    const onKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
        if (disabled || !onActivate) {
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onActivate();
        }
    };

    return {
        role: "button",
        tabIndex: disabled ? -1 : 0,
        onKeyDown,
        "aria-label": label,
        "aria-disabled": disabled || undefined,
        "aria-pressed": typeof pressed === "boolean" ? pressed : undefined,
        "aria-expanded": typeof expanded === "boolean" ? expanded : undefined,
        "aria-haspopup": hasPopup,
    };
};
