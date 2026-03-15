import { useState } from "react";
import ButtonComp from "../ButtonComp";
import GlassComp from "../GlassComp";
import InputComp from "../InputComp";

const tileClassName = "rounded-3xl border border-gray-700 p-5";

const SettingsComp = () => {
    const [messageFrequency, setMessageFrequency] = useState("1");
    const [messageUnit, setMessageUnit] = useState("Tag");
    const [notifyOnReply, setNotifyOnReply] = useState(true);
    const [notifyOnDeadline, setNotifyOnDeadline] = useState(true);

    const [mailHost, setMailHost] = useState("smtp.example.com");
    const [mailPort, setMailPort] = useState("587");
    const [mailUser, setMailUser] = useState("privacy@mydomain.com");
    const [mailFromName, setMailFromName] = useState("Incogni Team");

    const [presetEmail, setPresetEmail] = useState(
        "Sehr geehrte Damen und Herren,\n\nhiermit fordere ich Sie zur Auskunft und Loeschung meiner personenbezogenen Daten gemaess DSGVO auf.\n\nMit freundlichen Gruessen",
    );
    const [brokerDelayDays, setBrokerDelayDays] = useState("7");

    const [dataEmail, setDataEmail] = useState("max.mustermann@example.com");
    const [dataName, setDataName] = useState("Max Mustermann");
    const [dataAddress, setDataAddress] = useState("Musterstrasse 1, 10115 Berlin");

    return (
        <div className="h-[calc(100vh-70px)] w-full overflow-y-auto p-6">
            <div className="mx-auto w-full max-w-7xl pb-24">
                <div className="mb-4">
                    <h1 className="text-2xl font-semibold text-white">Einstellungen</h1>
                    <p className="text-sm text-gray-400">Nachrichten, Mailserver, Broker-Vorlagen und zu loeschende Daten.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <GlassComp width="100%" height="100%" tintOpacity={0.5} className={tileClassName}>
                        <div className="w-full">
                            <h2 className="mb-4 text-xl font-semibold text-white">Message Settings</h2>
                            <div className="grid grid-cols-[120px_110px_1fr] gap-2">
                                <p className="self-center text-sm text-gray-300">Frequency</p>
                                <InputComp
                                    type="number"
                                    min={1}
                                    value={messageFrequency}
                                    onChange={(event) => setMessageFrequency(event.target.value)}
                                    className="h-[40px] px-3 text-sm"
                                />
                                <InputComp
                                    value={messageUnit}
                                    onChange={(event) => setMessageUnit(event.target.value)}
                                    placeholder="Tag/Woche"
                                    className="h-[40px] px-3 text-sm"
                                />
                            </div>

                            <div className="mt-4 space-y-2">
                                <button
                                    type="button"
                                    className={`w-full rounded-full px-4 py-2 text-left text-sm font-semibold transition-colors ${
                                        notifyOnReply ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                                    }`}
                                    onClick={() => setNotifyOnReply((previous) => !previous)}
                                >
                                    Benachrichtigung bei Antwort {notifyOnReply ? "AN" : "AUS"}
                                </button>
                                <button
                                    type="button"
                                    className={`w-full rounded-full px-4 py-2 text-left text-sm font-semibold transition-colors ${
                                        notifyOnDeadline ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                                    }`}
                                    onClick={() => setNotifyOnDeadline((previous) => !previous)}
                                >
                                    Benachrichtigung bei Fristablauf {notifyOnDeadline ? "AN" : "AUS"}
                                </button>
                            </div>
                        </div>
                    </GlassComp>

                    <GlassComp width="100%" height="100%" tintOpacity={0.5} className={tileClassName}>
                        <div className="w-full">
                            <h2 className="mb-4 text-xl font-semibold text-white">Mailserver Einstellungen</h2>
                            <div className="space-y-2">
                                <InputComp
                                    value={mailHost}
                                    onChange={(event) => setMailHost(event.target.value)}
                                    placeholder="SMTP Host"
                                    className="h-[40px] px-3 text-sm"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <InputComp
                                        value={mailPort}
                                        onChange={(event) => setMailPort(event.target.value)}
                                        placeholder="Port"
                                        className="h-[40px] px-3 text-sm"
                                    />
                                    <InputComp
                                        value={mailUser}
                                        onChange={(event) => setMailUser(event.target.value)}
                                        placeholder="Benutzer / E-Mail"
                                        className="h-[40px] px-3 text-sm"
                                    />
                                </div>
                                <InputComp
                                    value={mailFromName}
                                    onChange={(event) => setMailFromName(event.target.value)}
                                    placeholder="Absendername"
                                    className="h-[40px] px-3 text-sm"
                                />
                            </div>
                        </div>
                    </GlassComp>

                    <GlassComp width="100%" height="100%" tintOpacity={0.5} className={tileClassName}>
                        <div className="w-full">
                            <h2 className="mb-4 text-xl font-semibold text-white">Broker Settings</h2>
                            <p className="mb-2 text-sm text-gray-300">Preset E-Mail</p>
                            <textarea
                                value={presetEmail}
                                onChange={(event) => setPresetEmail(event.target.value)}
                                className="h-[140px] w-full rounded-2xl bg-transparent px-4 py-3 text-sm text-white outline-[1.5px] outline-white focus-visible:outline-[3px] no-scrollbar"
                            />
                            <div className="mt-3 grid grid-cols-[1fr_150px] gap-2">
                                <InputComp
                                    type="number"
                                    min={1}
                                    value={brokerDelayDays}
                                    onChange={(event) => setBrokerDelayDays(event.target.value)}
                                    placeholder="Erinnerung in Tagen"
                                    className="h-[40px] px-3 text-sm"
                                />
                                <ButtonComp label="Konfigurieren" />
                            </div>
                        </div>
                    </GlassComp>

                    <GlassComp width="100%" height="100%" tintOpacity={0.5} className={tileClassName}>
                        <div className="w-full">
                            <h2 className="mb-4 text-xl font-semibold text-white">Deine Daten</h2>
                            <div className="space-y-2">
                                <InputComp
                                    value={dataEmail}
                                    onChange={(event) => setDataEmail(event.target.value)}
                                    placeholder="E-Mail"
                                    className="h-[40px] px-3 text-sm"
                                />
                                <InputComp
                                    value={dataName}
                                    onChange={(event) => setDataName(event.target.value)}
                                    placeholder="Name"
                                    className="h-[40px] px-3 text-sm"
                                />
                                <InputComp
                                    value={dataAddress}
                                    onChange={(event) => setDataAddress(event.target.value)}
                                    placeholder="Adresse"
                                    className="h-[40px] px-3 text-sm"
                                />
                            </div>
                        </div>
                    </GlassComp>
                </div>
            </div>
        </div>
    );
};

export default SettingsComp;
