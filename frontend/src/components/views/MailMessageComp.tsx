import { useId, useState } from "react";
import GlassComp from "../GlassComp";
import { getAccessibleClickProps } from "../../utils/accessibility";

type MailMessageCompProps = {
    contacts: string[];
    onBack: () => void;
    onSend: (mailData: { to: string; subject: string; body: string }) => void;
};

const MailMessageComp = ({ contacts, onBack, onSend }: MailMessageCompProps) => {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [showContacts, setShowContacts] = useState(false);
    const contactListId = useId();

    const handleSend = () => {
        onSend({ to, subject, body });
    };

    return (
        <div className="h-full-respect-nav w-full overflow-hidden p-6">
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4">
                <GlassComp
                    width="100%"
                    height="100%"
                    tintOpacity={0.5}
                    className="rounded-3xl border border-gray-700 p-8"
                >
                    <div className="flex h-full w-full flex-col justify-start">
                        <div className="flex w-full flex-col gap-4">
                            <div className="relative flex items-center gap-4 border-b border-gray-700 pb-2">
                                <span className="text-sm font-semibold text-white">An:</span>
                                <button
                                    type="button"
                                    className="w-full bg-transparent text-left text-lg font-semibold text-white outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                    onClick={() => setShowContacts((current) => !current)}
                                    aria-label="Empfaenger aus Kontakten auswaehlen"
                                    aria-haspopup="listbox"
                                    aria-expanded={showContacts}
                                    aria-controls={contactListId}
                                >
                                    {to ? to : <span className="text-gray-400">Empfänger auswählen...</span>}
                                </button>

                                {showContacts && (
                                    <div
                                        id={contactListId}
                                        role="listbox"
                                        aria-label="Kontaktliste"
                                        className="absolute left-0 top-full z-10 mt-2 w-full max-w-md overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/40 shadow-xl backdrop-blur-md"
                                    >
                                        <div className="max-h-60 w-full overflow-y-auto py-2 no-scrollbar">
                                            {contacts.map((contact, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    className="w-full px-5 py-3 text-left text-base font-normal text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
                                                    onClick={() => {
                                                        setTo(contact);
                                                        setShowContacts(false);
                                                    }}
                                                    aria-label={`Empfaenger waehlen: ${contact}`}
                                                >
                                                    {contact}
                                                </button>
                                            ))}
                                            {contacts.length === 0 && (
                                                <div className="px-5 py-3 text-base font-normal text-gray-300">Keine Kontakte vorhanden</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 border-b border-gray-700 pb-2">
                                <span className="text-sm font-semibold text-white">Betreff:</span>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Worum geht es?"
                                    aria-label="Betreff"
                                    className="w-full bg-transparent text-lg font-semibold text-white outline-none placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-1 flex-col rounded-2xl border border-gray-700/50 bg-gray-900/40 p-5 shadow-inner">
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Schreibe deine Nachricht hier..."
                                aria-label="Nachricht"
                                className="h-full w-full resize-none bg-transparent text-base leading-relaxed text-gray-200 outline-none placeholder:text-gray-300 no-scrollbar"
                            />
                        </div>
                    </div>
                </GlassComp>

                <div className="flex w-full justify-end gap-3">
                    <div className="w-[180px]">
                        <GlassComp
                            width="100%"
                            height={50}
                            tintOpacity={0.5}
                            borderRadius={999}
                            className="cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            onClick={onBack}
                            isHoverable={true}
                            {...getAccessibleClickProps(onBack, { label: "E-Mail-Entwurf abbrechen" })}
                        >
                            <p className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">Abbrechen</p>
                        </GlassComp>
                    </div>
                    <div className="w-[180px]">
                        <GlassComp
                            width="100%"
                            height={50}
                            tintOpacity={0.5}
                            borderRadius={999}
                            className="cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            onClick={handleSend}
                            isHoverable={true}
                            {...getAccessibleClickProps(handleSend, { label: "E-Mail senden" })}
                        >
                            <p className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">Senden</p>
                        </GlassComp>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MailMessageComp;
