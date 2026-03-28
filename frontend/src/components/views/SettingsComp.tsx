import GlassComp from "../GlassComp";
import InputComp from "../InputComp";
import CheckboxComp from "../SettingCheckboxComp";

const SettingsComp = () => {
    return (
        <div className="h-full-respect-nav w-full p-6 overflow-y-scroll no-scrollbar grid grid-cols-1 gap-4 sm:grid-cols-2">
            <GlassComp
              width="100%"
              height="auto"
              tintOpacity={0.5}
              className="min-h-[300px]">
                <div className="w-full h-full p-4">
                    <p className="text-lg font-semibold mb-2">Nachrichten</p>
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
                                  className="h-[30px] appearance-none rounded-full bg-transparent pl-4 pr-10 text-sm text-white outline outline-[1.5px] outline-white transition-[outline-width] duration-75 focus:outline-[3px] focus:outline-white">
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
                    <div>
                        <p className="mt-">Benachrichtigen wenn...</p>
                        <CheckboxComp text="ein neuer Fall eröffnet wurde" />
                        <CheckboxComp text="ein Broker geantwortet hat" />
                        <CheckboxComp text="Daten erfolgreich gelöscht wurden" />
                    </div>
                    <p className="mt-">Benachrichtigung senden an:</p>
                    <InputComp
                      width="100%"
                      height={30} 
                      className="mt-2" />
                </div>
            </GlassComp>
            <GlassComp
              width="100%"
              height="auto"
              tintOpacity={0.5}
              className="min-h-[300px]">
                <div className="w-full h-full p-4">
                    <p className="text-lg font-semibold mb-2">Mailserver</p>
                </div>
            </GlassComp>
            <GlassComp
              width="100%"
              height="auto"
              tintOpacity={0.5}
              className="min-h-[400px]">
                <div className="w-full h-full p-4">
                    <p className="text-lg font-semibold mb-2">Broker</p>
                    <p>Automatisch an neue Broker senden</p>
                    <p>Mail Preset</p>
                </div>
            </GlassComp>
            <GlassComp
              width="100%"
              height="auto"
              tintOpacity={0.5}>
                <div className="w-full h-full p-4">
                    <p className="text-lg font-semibold mb-2">Nutzer</p>
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
              tintOpacity={0.5}>
                <div className="w-full h-full p-4">
                    <h1>Sicherheit</h1>
                </div>
            </GlassComp>
        </div>
    )
};

export default SettingsComp;
