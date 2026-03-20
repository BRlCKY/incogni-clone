import { useEffect, useMemo, useState } from "react";
import GlassComp from "../GlassComp";
import SearchbarComp from "../SearchbarComp";
import MailViewComp from "./MailViewComp";
import MailMessageComp from "./MailMessageComp";
import { MailFolder, MailItem } from "../../../../shared/types";

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

const MailComp = () => {
    const [mails, setMails] = useState<MailItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFolder, setActiveFolder] = useState<MailFolder>("posteingang");
    const [openedMailId, setOpenedMailId] = useState<number | null>(null);
    const [isComposing, setIsComposing] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/mails")
            .then((response) => response.json())
            .then((data) => setMails(data))
            .catch((error) => console.error("Error fetching mails:", error));
    }, []);

    const filteredItems = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return mails.filter((item) => {
            const matchesFilter = item.folder === activeFolder;
            const matchesSearch = normalizedQuery
                ? `${item.subject} ${item.body} ${item.date}`.toLowerCase().includes(normalizedQuery)
                : true;

            return matchesFilter && matchesSearch;
        });
    }, [activeFolder, searchQuery, mails]);

    const openedMail = useMemo(
        () => mails.find((item) => item.id === openedMailId) ?? null,
        [openedMailId, mails],
    );

    const uniqueContacts = useMemo(() => {
        const allContacts = mails.map((item) => item.counterparty);
        return Array.from(new Set(allContacts));
    }, [mails]);

    if (isComposing) {
        return (
            <MailMessageComp
                contacts={uniqueContacts}
                onBack={() => setIsComposing(false)}
                onSend={(mailData) => {
                    const newMail: MailItem = {
                        id: Date.now(), // Temporary ID, will be replaced by backend-generated ID
                        subject: mailData.subject || "(Kein Betreff)",
                        body: mailData.body,
                        counterparty: mailData.to || "(Unbekannt)",
                        folder: "gesendet",
                        date: new Date().toLocaleString("de-DE", {  day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
                    };
                    
                    fetch("http://localhost:3000/mails/send", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newMail),
                    })
                    .then((response) => response.json())
                    .then((savedMail) => {
                        setMails((prevMails) => [savedMail, ...prevMails]);
                        setIsComposing(false);
                        setActiveFolder("gesendet");
                    })
                    .catch((error) => {
                        console.error("Error sending mail:", error);
                    });
                }}
            />
        );
    }

    if (openedMail) {
        return (
            <MailViewComp
                mail={openedMail}
                onBack={() => setOpenedMailId(null)}
                onReply={() => {
                    setOpenedMailId(null);
                    setIsComposing(true);
                }}
            />
        );
    }

    return (
        <div className="h-[calc(100vh-70px)] w-full overflow-hidden p-6">
            <div className="grid h-full w-full grid-cols-[300px_minmax(0,1fr)] gap-6">
                <div className="flex h-full flex-col">
                    <div className="mb-4 h-[56px]" />
                    <div className="space-y-3">
                        <GlassComp
                            width="100%"
                            height={74}
                            tintOpacity={0.52}
                            borderRadius={999}
                            className="cursor-pointer rounded-full border border-gray-700 px-4 hover:bg-gray-800/50"
                            onClick={() => setIsComposing(true)}
                        >
                            <p className="w-full px-3 text-left text-2xl leading-7 text-white">E-Mail schreiben</p>
                        </GlassComp>

                        <GlassComp
                            width="100%"
                            height={74}
                            tintOpacity={0.52}
                            borderRadius={999}
                            className={`cursor-pointer rounded-full border px-4 transition-colors ${
                                activeFolder === "posteingang"
                                    ? "border-blue-400/70 bg-blue-900/35"
                                    : "border-gray-700 hover:bg-gray-800/50"
                            }`}
                            onClick={() => setActiveFolder("posteingang")}
                            role="button"
                            aria-pressed={activeFolder === "posteingang"}
                        >
                            <div className="flex w-full items-center justify-between px-3">
                                <p className="text-left text-2xl leading-7 text-white">Posteingang</p>
                                {activeFolder === "posteingang" && (
                                    <span className="rounded-full bg-blue-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-200">
                                        Aktiv
                                    </span>
                                )}
                            </div>
                        </GlassComp>

                        <GlassComp
                            width="100%"
                            height={74}
                            tintOpacity={0.52}
                            borderRadius={999}
                            className={`cursor-pointer rounded-full border px-4 transition-colors ${
                                activeFolder === "gesendet"
                                    ? "border-blue-400/70 bg-blue-900/35"
                                    : "border-gray-700 hover:bg-gray-800/50"
                            }`}
                            onClick={() => setActiveFolder("gesendet")}
                            role="button"
                            aria-pressed={activeFolder === "gesendet"}
                        >
                            <div className="flex w-full items-center justify-between px-3">
                                <p className="text-left text-2xl leading-7 text-white">Gesendet</p>
                                {activeFolder === "gesendet" && (
                                    <span className="rounded-full bg-blue-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-200">
                                        Aktiv
                                    </span>
                                )}
                            </div>
                        </GlassComp>
                    </div>
                </div>

                <div className="flex h-full flex-col">
                    <div className="mb-4">
                        <GlassComp
                            width="100%"
                            height={56}
                            tintOpacity={0.52}
                            borderRadius={999}
                            className="border border-gray-700"
                        >
                            <SearchbarComp
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Suche"
                                containerClassName="h-full bg-transparent px-2"
                                inputClassName="bg-transparent"
                            />
                        </GlassComp>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-300">
                        <span>Aktives Postfach:</span>
                        <span className="rounded-full bg-gray-800 px-2 py-0.5 font-semibold text-white">
                            {folderLabel[activeFolder]}
                        </span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-scroll pr-1 no-scrollbar">
                        {filteredItems.map((item) => (
                            <GlassComp
                                key={item.id}
                                width="100%"
                                height={74}
                                tintOpacity={0.52}
                                borderRadius={999}
                                className="cursor-pointer rounded-full border border-gray-700 pl-2 pr-3 transition-colors hover:bg-gray-800/50"
                                onClick={() => setOpenedMailId(item.id)}
                                role="button"
                                aria-label={`E-Mail oeffnen: ${item.subject}`}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div
                                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white ${getAvatarColorClass(item.counterparty)}`}
                                        >
                                            {getAvatarInitial(item.counterparty)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-2xl leading-7 text-white">{item.subject}</p>
                                            <p className="truncate text-xs text-gray-400">
                                                {item.folder === "posteingang" ? "Von" : "An"} {item.counterparty} - {item.body}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400">{item.date}</p>
                                </div>
                            </GlassComp>
                        ))}

                        {filteredItems.length === 0 && (
                            <GlassComp
                                width="100%"
                                height={74}
                                tintOpacity={0.52}
                                borderRadius={999}
                                className="rounded-full border border-gray-700"
                            >
                                <p className="flex h-full items-center justify-center text-sm text-gray-400">Keine Nachrichten gefunden.</p>
                            </GlassComp>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MailComp;