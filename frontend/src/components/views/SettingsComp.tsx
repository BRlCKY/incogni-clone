import { type ReactNode, useEffect, useRef, useState } from "react";
import GlassComp from "../GlassComp";
import InputComp from "../InputComp";
import CheckboxComp from "../SettingCheckboxComp";

type IntervalUnit = "days" | "weeks" | "months";
type MailSecurityMode = "STARTTLS" | "SSL/TLS" | "Keine";

interface SettingsData {
    messages: {
        auto_start_new_case: {
            enabled: boolean;
            interval: number;
            interval_unit: IntervalUnit;
        };
        notifications: {
            new_case: boolean;
            broker_response: boolean;
            data_deletion: boolean;
        };
        notification_email: string;
    };
    mailserver: {
        smtp_host: string;
        port: number;
        security: MailSecurityMode;
        username: string;
        password: string;
        sender_name: string;
        sender_email: string;
    };
    broker: {
        auto_start_when_added: boolean;
    };
    user: {
        name: string;
        email: string;
        address: string;
        phone: string;
        birth_date: string;
    };
    security: {
        password_required: boolean;
        current_password: string;
    };
}

// TODO: remove current_password. help erkmaster erkin
const settings: SettingsData = {
    messages: {
        auto_start_new_case: {
            enabled: true,
            interval: 3,
            interval_unit: "days",
        },
        notifications: {
            new_case: true,
            broker_response: true,
            data_deletion: true,
        },
        notification_email: "",
    },
    mailserver: {
        smtp_host: "smtp.beispiel.de",
        port: 587,
        security: "STARTTLS",
        username: "",
        password: "",
        sender_name: "",
        sender_email: "",
    },
    broker: {
        auto_start_when_added: true,
    },
    user: {
        name: "",
        email: "",
        address: "",
        phone: "",
        birth_date: "",
    },
    security: {
        password_required: true,
        current_password: "",
    },
};

interface PanelDefinition {
    id: string;
    content: ReactNode;
}

const SettingsComp = () => {
    const [isTwoColumnLayout, setIsTwoColumnLayout] = useState(() => {
        if (typeof window === "undefined") {
            return false;
        }

        return window.matchMedia("(min-width: 640px)").matches;
    });
    const [panelHeights, setPanelHeights] = useState<Record<string, number>>({});
    const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const selectClassName =
        "h-[30px] appearance-none rounded-full bg-transparent pl-4 pr-10 text-sm text-white outline outline-[1.5px] outline-white transition-[outline-width] duration-75 focus:outline-[3px] focus:outline-white";

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const mediaQuery = window.matchMedia("(min-width: 640px)");
        const updateLayout = () => setIsTwoColumnLayout(mediaQuery.matches);

        updateLayout();
        mediaQuery.addEventListener("change", updateLayout);

        return () => mediaQuery.removeEventListener("change", updateLayout);
    }, []);

    useEffect(() => {
        if (!isTwoColumnLayout || typeof ResizeObserver === "undefined") {
            return;
        }

        const panelNodes = Object.values(panelRefs.current).filter(
            (node): node is HTMLDivElement => node !== null,
        );

        if (panelNodes.length === 0) {
            return;
        }

        const updateHeights = () => {
            setPanelHeights((currentHeights) => {
                const nextHeights = { ...currentHeights };
                let hasChanged = false;

                for (const node of panelNodes) {
                    const panelId = node.dataset.panelId;

                    if (!panelId) {
                        continue;
                    }

                    const nextHeight = Math.ceil(node.getBoundingClientRect().height);

                    if (currentHeights[panelId] !== nextHeight) {
                        nextHeights[panelId] = nextHeight;
                        hasChanged = true;
                    }
                }

                return hasChanged ? nextHeights : currentHeights;
            });
        };

        updateHeights();

        const observer = new ResizeObserver(() => updateHeights());

        for (const node of panelNodes) {
            observer.observe(node);
        }

        return () => observer.disconnect();
    });

    const panels: PanelDefinition[] = [
        {
            id: "messages",
            content: (
                <>
                    <p className="mb-2 text-lg font-semibold">Nachrichten</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <p className="whitespace-nowrap">Neuen Fall automatisch starten alle</p>
                        <div className="flex gap-3">
                            <InputComp
                              width={70}
                              height={30}
                              type="number"
                              min={1}
                              className="text-right" />
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
                </>
            ),
        },
        {
            id: "mailserver",
            content: (
                <>
                    <p className="mb-2 text-lg font-semibold">Mailserver</p>
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
                    </div>
                </>
            ),
        },
        {
            id: "broker",
            content: (
                <>
                    <p className="mb-2 text-lg font-semibold">Broker</p>
                    <CheckboxComp text="Automatisch Fall starten, wenn Broker hinzugefügt wird" />
                    {/*TODO: connect to mail preset */}
                </>
            ),
        },
        {
            id: "user",
            content: (
                <>
                    <p className="mb-2 text-lg font-semibold">Nutzerdaten</p>
                    <div className="mt-6 space-y-4">
                        <div>
                            <p className="mb-2 text-sm text-white/80">Name</p>
                            <InputComp
                              width="100%"
                              height={30}
                              placeholder="Max Mustermann" />
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-white/80">E-Mail</p>
                            <InputComp
                              width="100%"
                              height={30}
                              type="email"
                              placeholder="max.mustermann@beispiel.de" />
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-white/80">Adresse</p>
                            <InputComp
                              width="100%"
                              height={30}
                              placeholder="Musterstrasse 1, 12345 Musterstadt" />
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-white/80">Telefonnummer</p>
                            <InputComp
                              width="100%"
                              height={30}
                              type="tel"
                              placeholder="+49 170 1234567" />
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-white/80">Geburtsdatum</p>
                            <InputComp
                              width="100%"
                              height={30}
                              type="date"
                              className="pr-4" />
                        </div>
                    </div>
                </>
            ),
        },
        {
            id: "security",
            content: (
                <>
                    <p className="mb-2 text-lg font-semibold">Sicherheit</p>
                    <div className="mt-6">
                        <CheckboxComp text="Passwort erforderlich" />
                    </div>

                    <div className="mt-6 space-y-4">
                        <p className="text-sm text-white/80">Passwort</p>
                        <InputComp
                          width="100%"
                          height={30}
                          type="password"
                          placeholder="Aktuelles Passwort" />
                    </div>
                </>
            ),
        },
    ];

    const renderPanel = (panel: PanelDefinition) => (
        <div
          key={panel.id}
          ref={(node) => {
              panelRefs.current[panel.id] = node;
          }}
          data-panel-id={panel.id}
          className="w-full">
            <GlassComp
              width="100%"
              height="auto"
              tintOpacity={0.5}>
                <div className="w-full p-4">{panel.content}</div>
            </GlassComp>
        </div>
    );

    const panelsHaveMeasuredHeights = panels.every((panel) => panelHeights[panel.id] !== undefined);
    const leftColumnPanels: PanelDefinition[] = [];
    const rightColumnPanels: PanelDefinition[] = [];
    let leftColumnHeight = 0;
    let rightColumnHeight = 0;

    for (const [index, panel] of panels.entries()) {
        if (!panelsHaveMeasuredHeights) {
            if (index % 2 === 0) {
                leftColumnPanels.push(panel);
            } else {
                rightColumnPanels.push(panel);
            }

            continue;
        }

        const panelHeight = panelHeights[panel.id] ?? 0;

        if (leftColumnHeight <= rightColumnHeight) {
            leftColumnPanels.push(panel);
            leftColumnHeight += panelHeight;
        } else {
            rightColumnPanels.push(panel);
            rightColumnHeight += panelHeight;
        }
    }

    return (
        <div className="h-full-respect-nav w-full overflow-y-scroll p-6 no-scrollbar">
            {isTwoColumnLayout ? (
                <div className="flex items-start gap-4">
                    <div className="flex min-w-0 flex-1 flex-col gap-4">{leftColumnPanels.map(renderPanel)}</div>
                    <div className="flex min-w-0 flex-1 flex-col gap-4">{rightColumnPanels.map(renderPanel)}</div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">{panels.map(renderPanel)}</div>
            )}
        </div>
    );
};

export default SettingsComp;
