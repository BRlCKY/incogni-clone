import { useState } from "react";
import GlassComp from "../GlassComp";

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

    const handleSend = () => {
        onSend({ to, subject, body });
    };

    return (
        <div className="h-[calc(100vh-70px)] w-full overflow-hidden p-6">
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4">
                <GlassComp
                    width="100%"
                    height="100%"
                    tintOpacity={0.52}
                    className="rounded-3xl border border-gray-700 p-8"
                >
                    <div className="flex h-full w-full flex-col justify-start">
                        <div className="flex w-full flex-col gap-4">
                            <div className="relative flex items-center gap-4 border-b border-gray-700 pb-2">
                                <span className="text-sm font-semibold text-gray-400">An:</span>
                                <div
                                    className="w-full cursor-pointer bg-transparent text-lg font-semibold text-white outline-none"
                                    onClick={() => setShowContacts(!showContacts)}
                                >
                                    {to ? to : <span className="text-gray-600">Empfänger auswählen...</span>}
                                </div>

                                {showContacts && (
                                    <div className="absolute left-0 top-full z-10 mt-2 w-full max-w-md overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/40 shadow-xl backdrop-blur-md">
                                        <div className="max-h-60 w-full overflow-y-auto py-2 no-scrollbar">
                                            {contacts.map((contact, idx) => (
                                                <div
                                                    key={idx}
                                                    className="cursor-pointer px-5 py-3 text-base font-normal text-white transition-colors hover:bg-white/10"
                                                    onClick={() => {
                                                        setTo(contact);
                                                        setShowContacts(false);
                                                    }}
                                                >
                                                    {contact}
                                                </div>
                                            ))}
                                            {contacts.length === 0 && (
                                                <div className="px-5 py-3 text-base font-normal text-gray-500">Keine Kontakte vorhanden</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 border-b border-gray-700 pb-2">
                                <span className="text-sm font-semibold text-gray-400">Betreff:</span>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Worum geht es?"
                                    className="w-full bg-transparent text-lg font-semibold text-white outline-none placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-1 flex-col rounded-2xl border border-gray-700/50 bg-gray-900/40 p-5 shadow-inner">
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Schreibe deine Nachricht hier..."
                                className="h-full w-full resize-none bg-transparent text-base leading-relaxed text-gray-200 outline-none placeholder:text-gray-600 no-scrollbar"
                            />
                        </div>
                    </div>
                </GlassComp>

                <div className="flex w-full justify-end gap-3">
                    <div className="w-[180px]">
                        <GlassComp
                            width="100%"
                            height={52}
                            tintOpacity={0.52}
                            borderRadius={999}
                            className="cursor-pointer rounded-full border border-gray-700 hover:bg-gray-800/50"
                            onClick={onBack}
                            role="button"
                        >
                            <p className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">Abbrechen</p>
                        </GlassComp>
                    </div>
                    <div className="w-[180px]">
                        <GlassComp
                            width="100%"
                            height={52}
                            tintOpacity={0.52}
                            borderRadius={999}
                            className="cursor-pointer rounded-full border border-blue-400/60 bg-blue-900/25 hover:bg-blue-900/45"
                            onClick={handleSend}
                            role="button"
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