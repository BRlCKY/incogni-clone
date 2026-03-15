import GlassComp from "../GlassComp";

type MailFolder = "posteingang" | "gesendet";

type MailViewItem = {
    subject: string;
    body: string;
    counterparty: string;
    folder: MailFolder;
    date: string;
};

type MailViewCompProps = {
    mail: MailViewItem;
    onBack: () => void;
    onReply: () => void;
};

const folderLabel: Record<MailFolder, string> = {
    posteingang: "Empfangen",
    gesendet: "Gesendet",
};

const avatarColorClasses = [
    "bg-blue-700/80",
    "bg-emerald-700/80",
    "bg-rose-700/80",
    "bg-cyan-700/80",
    "bg-violet-700/80",
];

const getAvatarColorClass = (name: string) =>
    avatarColorClasses[
        name
            .split("")
            .reduce((sum, char) => sum + char.charCodeAt(0), 0) % avatarColorClasses.length
    ];

const getAvatarInitial = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

const MailViewComp = ({ mail, onBack, onReply }: MailViewCompProps) => {
    return (
        <div className="h-[calc(100vh-70px)] w-full overflow-hidden p-6">
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4">
                <div className="grid w-full max-w-[460px] grid-cols-2 gap-3">
                    <div>
                        <GlassComp
                            width="100%"
                            height={52}
                            tintOpacity={0.52}
                            borderRadius={999}
                            className="cursor-pointer rounded-full border border-gray-700 hover:bg-gray-800/50"
                            onClick={onBack}
                            role="button"
                        >
                            <p className="text-sm font-semibold text-white">Zurück zum Postfach</p>
                        </GlassComp>
                    </div>
                    <div>
                        <GlassComp
                            width="100%"
                            height={52}
                            tintOpacity={0.52}
                            borderRadius={999}
                            className="cursor-pointer rounded-full border border-blue-400/60 bg-blue-900/25 hover:bg-blue-900/45"
                            onClick={onReply}
                            role="button"
                        >
                            <p className="text-sm font-semibold text-white">Antworten</p>
                        </GlassComp>
                    </div>
                </div>

                <GlassComp
                    width="100%"
                    height="100%"
                    tintOpacity={0.52}
                    className="rounded-3xl border border-gray-700 p-8"
                >
                    <div className="flex h-full w-full flex-col">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div
                                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-xl font-semibold text-white ${getAvatarColorClass(mail.counterparty)}`}
                                >
                                    {getAvatarInitial(mail.counterparty)}
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-400">{folderLabel[mail.folder]}</p>
                                    <p className="mt-0.5 text-sm text-gray-300">
                                        {mail.folder === "posteingang" ? "Von" : "An"} {mail.counterparty}
                                    </p>
                                    <h1 className="mt-1 text-3xl font-semibold text-white">{mail.subject}</h1>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400">{mail.date}</p>
                        </div>

                        <div className="h-px w-full bg-gray-700" />

                        <div className="mt-6 overflow-y-auto text-base leading-relaxed text-gray-200 no-scrollbar">
                            <p>{mail.body}</p>
                        </div>
                    </div>
                </GlassComp>
            </div>
        </div>
    );
};

export default MailViewComp;
