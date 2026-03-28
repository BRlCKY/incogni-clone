interface SettingCheckboxCompProps {
    text: string;
}

const SettingCheckboxComp = ({ text }: SettingCheckboxCompProps) => {
    return (
        <label className="mt-2 flex gap-2">
            <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                <input
                    type="checkbox"
                    className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full bg-transparent outline outline-[1.5px] outline-white transition-[outline-width,background-color] duration-75 checked:bg-white/15 focus:outline-[3px] focus:outline-white" />
                <svg
                    className="pointer-events-none h-3.5 w-3.5 scale-75 opacity-0 text-white transition-all duration-150 peer-checked:scale-100 peer-checked:opacity-100"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true">
                    <path
                        d="M4 8.5L6.5 11L12 5.5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round" />
                </svg>
            </span>
            <p>{text}</p>
        </label>
    );
};

export default SettingCheckboxComp;