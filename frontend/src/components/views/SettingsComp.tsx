import GlassComp from "../GlassComp";
import InputComp from "../InputComp";
import CheckboxComp from "../SettingCheckboxComp";

const SettingsComp = () => {
    const selectClassName =
        "h-[30px] appearance-none rounded-full bg-transparent pl-4 pr-10 text-sm text-white outline outline-[1.5px] outline-white transition-[outline-width] duration-75 focus:outline-[3px] focus:outline-white";

    return (
        <div className="h-full-respect-nav grid w-full grid-cols-1 auto-rows-min items-start gap-4 overflow-y-scroll p-6 no-scrollbar sm:grid-cols-2">
            <GlassComp
              width="100%"
              height="auto"
              tintOpacity={0.5}
              className="self-start">
                <div className="w-full p-4">
                    <p className="mb-2 text-lg font-semibold">Nachrichten</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <p className="whitespace-nowrap">Neuen Fall automatisch starten alle</p>
                        <div className="flex gap-3">
                            <InputComp
                              width={70}
                              height={30}
                              type="number"
                              min={1}
                              className="text-right"/>
                            <div className="relative">
                                <select
                                  aria-label="Intervall fuer neuen Fall"
                                  defaultValue="Tage"
                                  className={selectClassName}>
                                    <option className="bg-black text-white">Tage</option>
                                    <option className="bg-black text-white">Wochen</option>
                                    <option className="bg-black text-white">Monate</option>
                                </select>
                                <svg
                                  className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-white/80"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  aria-hidden="true">
                                    <path
                                      d="M3 4.5L6 7.5L9 4.5"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p>Benachrichtigen wenn...</p>
                        <CheckboxComp text="ein neuer Fall eröffnet wurde" />
                        <CheckboxComp text="ein Broker geantwortet hat" />
                        <CheckboxComp text="Daten erfolgreich gelöscht wurden" />
                    </div>
                    <p className="mt-6">Benachrichtigung senden an:</p>
                    <InputComp
                      width="100%"
                      height={30}
                      className="mt-2"
                      placeholder="mail@beispiel.de" />
                </div>
            </GlassComp>
            <GlassComp
              width="100%"
              height="auto"
              tintOpacity={0.5}
              className="self-start">
                <div className="w-full p-4">
                    <p className="mb-2 text-lg font-semibold">Mailserver</p>
                    <p className="text-sm text-white/70">
                        Hier koennen die SMTP-Zugangsdaten und Absenderinformationen hinterlegt werden.
                    </p>

                    <div className="mt-6 space-y-4">
                        <div>
                            <p className="mb-2 text-sm text-white/80">SMTP-Host</p>
                            <InputComp
                              width="100%"
                              height={30}
                              placeholder="smtp.beispiel.de" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="mb-2 text-sm text-white/80">Port</p>
                                <InputComp
                                  width="100%"
                                  height={30}
                                  type="number"
                                  placeholder="587" />
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-white/80">Sicherheit</p>
                                <div className="relative">
                                    <select
                                      aria-label="Sicherheitsmodus fuer Mailserver"
                                      defaultValue="STARTTLS"
                                      className={`w-full ${selectClassName}`}>
                                        <option className="bg-black text-white">STARTTLS</option>
                                        <option className="bg-black text-white">SSL/TLS</option>
                                        <option className="bg-black text-white">Keine</option>
                                    </select>
                                    <svg
                                      className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-white/80"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      aria-hidden="true">
                                        <path
                                          d="M3 4.5L6 7.5L9 4.5"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="mb-2 text-sm text-white/80">Benutzername</p>
                                <InputComp
                                  width="100%"
                                  height={30}
                                  placeholder="smtp-user" />
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-white/80">Passwort</p>
                                <InputComp
                                  width="100%"
                                  height={30}
                                  type="password"
                                  placeholder="Passwort" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="mb-2 text-sm text-white/80">Absendername</p>
                                <InputComp
                                  width="100%"
                                  height={30}
                                  placeholder="Mein Unternehmen" />
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-white/80">Absender-E-Mail</p>
                                <InputComp
                                  width="100%"
                                  height={30}
                                  type="email"
                                  placeholder="noreply@beispiel.de" />
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-white/80">Antwort-an</p>
                            <InputComp
                              width="100%"
                              height={30}
                              type="email"
                              placeholder="support@beispiel.de" />
                        </div>
                    </div>
                </div>
            </GlassComp>
            <GlassComp
              width="100%"
              height="auto"
              tintOpacity={0.5}
              className="self-start">
                <div className="w-full p-4">
                    <p className="mb-2 text-lg font-semibold">Broker</p>
                    <p>Automatisch an neue Broker senden</p>
                    <p>Mail Preset</p>
                </div>
            </GlassComp>
            <GlassComp
              width="100%"
              height="auto"
              tintOpacity={0.5}
              className="self-start">
                <div className="w-full p-4">
                    <p className="mb-2 text-lg font-semibold">Nutzer</p>
                    <div>
                        <p>Name</p>
                        <p>EMail</p>
                        <p>Adresse</p>
                        <p>Telefonnummer</p>
                        <p>Geburtsdatum</p>
                    </div>
                </div>
            </GlassComp>
            <GlassComp
              width="100%"
              height="auto"
              tintOpacity={0.5}
              className="self-start">
                <div className="w-full p-4">
                    <h1>Sicherheit</h1>
                </div>
            </GlassComp>
        </div>
    )
};

export default SettingsComp;
