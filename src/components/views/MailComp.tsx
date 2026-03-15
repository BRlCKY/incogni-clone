import { useMemo, useState } from "react";
import GlassComp from "../GlassComp";
import SearchbarComp from "../SearchbarComp";
import MailViewComp from "./MailViewComp";

type MailFolder = "posteingang" | "gesendet";

type MailItem = {
    id: number;
    subject: string;
    body: string;
    counterparty: string;
    folder: MailFolder;
    date: string;
};

const mailboxItems: MailItem[] = [
    {
        id: 1,
        subject: "Rueckfrage zu Identitaetsnachweis",
        body: "Danke fuer Ihre Anfrage. Bitte senden Sie uns einen gueltigen Ausweis zur Verifizierung.",
        counterparty: "Acme Data Brokers",
        folder: "posteingang",
        date: "Heute, 14:10",
    },
    {
        id: 2,
        subject: "Datenauskunft angefordert",
        body: "Wir haben den Broker kontaktiert und um vollstaendige Datenauskunft nach DSGVO gebeten.",
        counterparty: "Nordic Insight",
        folder: "gesendet",
        date: "Heute, 12:32",
    },
    {
        id: 3,
        subject: "Erinnerung zur offenen Anfrage",
        body: "Eine Erinnerung wurde versendet, da innerhalb von 14 Tagen keine Rueckmeldung eingegangen ist.",
        counterparty: "Global Registry Services",
        folder: "gesendet",
        date: "Gestern, 18:05",
    },
    {
        id: 4,
        subject: "Loeschung personenbezogener Daten",
        body: "Der Broker wurde zur vollstaendigen Loeschung aller gespeicherten personenbezogenen Daten aufgefordert.",
        counterparty: "Data Harbor GmbH",
        folder: "gesendet",
        date: "Gestern, 11:48",
    },
    {
        id: 5,
        subject: "Loeschung bestaetigt",
        body: "Der Broker hat die Loeschung bestaetigt. Der Fall kann nun abgeschlossen werden.",
        counterparty: "Blue Point Markets",
        folder: "posteingang",
        date: "14.03.2026",
    },
    {
        id: 6,
        subject: "Follow-up in 7 Tagen geplant",
        body: "Falls keine Antwort erfolgt, wird in sieben Tagen automatisch ein weiteres Follow-up versendet.",
        counterparty: "Arbor Analytics",
        folder: "gesendet",
        date: "13.03.2026",
    },
    {
        id: 7,
        subject: "Finale Mahnung versendet",
        body: "Eine letzte Mahnung mit Fristsetzung wurde versendet, bevor rechtliche Schritte eingeleitet werden.",
        counterparty: "Zenith Audience Labs",
        folder: "gesendet",
        date: "11.03.2026",
    },
];

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
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFolder, setActiveFolder] = useState<MailFolder>("posteingang");
    const [openedMailId, setOpenedMailId] = useState<number | null>(null);

    const filteredItems = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return mailboxItems.filter((item) => {
            const matchesFilter = item.folder === activeFolder;
            const matchesSearch = normalizedQuery
                ? `${item.subject} ${item.body} ${item.date}`.toLowerCase().includes(normalizedQuery)
                : true;

            return matchesFilter && matchesSearch;
        });
    }, [activeFolder, searchQuery]);

    const openedMail = useMemo(
        () => mailboxItems.find((item) => item.id === openedMailId) ?? null,
        [openedMailId],
    );

    if (openedMail) {
        return (
            <MailViewComp
                mail={openedMail}
                onBack={() => setOpenedMailId(null)}
                onReply={() => setOpenedMailId(null)}
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
                            className="cursor-pointer rounded-full border border-blue-400/70 bg-blue-900/40 px-4 shadow-[0_0_0_1px_rgba(96,165,250,0.25)] hover:bg-blue-900/55"
                            onClick={() => setOpenedMailId(null)}
                        >
                            <p className="w-full px-3 text-left text-2xl font-semibold leading-7 text-white">E-Mail schreiben</p>
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
                                <p className="text-sm text-gray-400">Keine Nachrichten gefunden.</p>
                            </GlassComp>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MailComp;
