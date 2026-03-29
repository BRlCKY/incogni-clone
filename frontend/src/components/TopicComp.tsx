import GlassComp from "./GlassComp";

interface TopicProps {
    text: string;
    onClick: () => void;
    isExternal?: boolean;
}

const Topic = ({ text, onClick, isExternal = false }: TopicProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`${isExternal ? "Externe Ressource oeffnen" : "FAQ oeffnen"}: ${text}`}
            className="group w-full min-w-0 bg-transparent text-left"
        >
            <GlassComp
                width="100%"
                height={188}
                borderRadius={28}
                tintOpacity={0.5}
                className="rounded-[28px] border border-gray-700 px-5 py-4 hover:bg-gray-800/40"
                isHoverable={true}
            >
                <div className="flex h-full w-full flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-300">
                            {isExternal ? "Link" : "FAQ"}
                        </span>
                        <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-gray-400 transition-colors group-hover:border-blue-400/40 group-hover:text-blue-200">
                            {isExternal ? "Oeffnen" : "Lesen"}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <p className="line-clamp-4 text-xl font-semibold leading-7 text-white">
                            {text}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-400 transition-colors group-hover:text-gray-200">
                            <span>{isExternal ? "Zur Ressource" : "Antwort anzeigen"}</span>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="transition-transform duration-200 group-hover:translate-x-1"
                                aria-hidden="true"
                            >
                                <path
                                    d="M4.5 9H13.5M13.5 9L9.75 5.25M13.5 9L9.75 12.75"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </GlassComp>
        </button>
    );
};

export default Topic;
