import { type ReactNode, useEffect, useRef, useState } from "react";
import GlassComp from "../GlassComp";
import InputComp from "../InputComp";
import CheckboxComp from "../SettingCheckboxComp";
import type { Settings } from "../../../../shared/types";

type IntervalUnit = Settings["messages"]["auto_start_new_case"]["interval_unit"];
type MailSecurityMode = Settings["mailserver"]["security"];
type SettingsData = Settings;

const defaultSettings: SettingsData = {
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
        phone: "",
        birth_date: "",
    },
    security: {
        password_required: true,
        current_password: "",
    },
};

const SETTINGS_ENDPOINT = "http://localhost:3000/settings";
const AUTH_STATE_ENDPOINT = "http://localhost:3000/auth/state";
const AUTH_SET_PASSWORD_ENDPOINT = "http://localhost:3000/auth/setpassword";

type AuthStatePayload = {
    passwordConfigured: boolean;
};

const cloneSettings = (settings: SettingsData): SettingsData =>
    JSON.parse(JSON.stringify(settings)) as SettingsData;

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const mergeWithDefaults = (storedSettings: Partial<SettingsData>): SettingsData => ({
    ...cloneSettings(defaultSettings),
    ...storedSettings,
    messages: {
        ...defaultSettings.messages,
        ...storedSettings.messages,
        auto_start_new_case: {
            ...defaultSettings.messages.auto_start_new_case,
            ...storedSettings.messages?.auto_start_new_case,
        },
        notifications: {
            ...defaultSettings.messages.notifications,
            ...storedSettings.messages?.notifications,
        },
    },
    mailserver: {
        ...defaultSettings.mailserver,
        ...storedSettings.mailserver,
    },
    broker: {
        ...defaultSettings.broker,
        ...storedSettings.broker,
    },
    user: {
        ...defaultSettings.user,
        ...storedSettings.user,
    },
    security: {
        ...defaultSettings.security,
        ...storedSettings.security,
    },
});

const loadSettings = async (): Promise<SettingsData> => {
    try {
        const response = await fetch(SETTINGS_ENDPOINT, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to load settings: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;

        if (!isObjectRecord(payload)) {
            throw new Error("Invalid settings response");
        }

        return mergeWithDefaults(payload as Partial<SettingsData>);
    } catch (error) {
        console.error("Error loading settings:", error);
        return cloneSettings(defaultSettings);
    }
};

const toPersistedSettings = (settings: SettingsData): SettingsData => ({
    ...settings,
    security: {
        ...settings.security,
        current_password: "",
    },
});

const saveSettings = async (settings: SettingsData): Promise<void> => {
    const response = await fetch(SETTINGS_ENDPOINT, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(toPersistedSettings(settings)),
    });

    if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;
        const message = errorPayload?.message ?? `Failed to save settings: ${response.status}`;
        throw new Error(message);
    }
};

const loadAuthPasswordRequired = async (): Promise<boolean | null> => {
    try {
        const response = await fetch(AUTH_STATE_ENDPOINT, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to load auth state: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;

        if (!isObjectRecord(payload) || typeof payload.passwordConfigured !== "boolean") {
            throw new Error("Invalid auth state response");
        }

        return (payload as AuthStatePayload).passwordConfigured;
    } catch (error) {
        console.error("Error loading auth state:", error);
        return null;
    }
};

const setAuthPassword = async (password: string): Promise<void> => {
    const response = await fetch(AUTH_SET_PASSWORD_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
    });

    if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;
        const message = errorPayload?.message ?? `Failed to set password: ${response.status}`;
        throw new Error(message);
    }
};

interface PanelDefinition {
    id: string;
    content: ReactNode;
}

const SettingsComp = () => {
    const [settingsData, setSettingsData] = useState<SettingsData>(defaultSettings);
    const [securityErrorMessage, setSecurityErrorMessage] = useState("");
    const [securitySuccessMessage, setSecuritySuccessMessage] = useState("");
    const [isSecurityActionPending, setIsSecurityActionPending] = useState(false);
    const [isTwoColumnLayout, setIsTwoColumnLayout] = useState(() => {
        if (typeof window === "undefined") {
            return false;
        }

        return window.matchMedia("(min-width: 640px)").matches;
    });
    const [panelHeights, setPanelHeights] = useState<Record<string, number>>({});
    const settingsLoadedRef = useRef(false);
    const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const selectClassName =
        "h-[30px] appearance-none rounded-full bg-transparent pl-4 pr-10 text-sm text-white outline outline-[1.5px] outline-white transition-[outline-width] duration-75 focus:outline-[3px] focus:outline-white";

    useEffect(() => {
        let isMounted = true;

        const hydrateSettings = async () => {
            const [storedSettings, passwordRequiredFromAuth] = await Promise.all([
                loadSettings(),
                loadAuthPasswordRequired(),
            ]);

            if (!isMounted) {
                return;
            }

            setSettingsData({
                ...storedSettings,
                security: {
                    ...storedSettings.security,
                    password_required: passwordRequiredFromAuth ?? storedSettings.security.password_required,
                    current_password: "",
                },
            });
            settingsLoadedRef.current = true;
        };

        void hydrateSettings();

        return () => {
            isMounted = false;
        };
    }, []);

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

    const persistSettings = (updater: (currentSettings: SettingsData) => SettingsData) => {
        setSettingsData((currentSettings) => {
            const nextSettings = updater(currentSettings);

            if (settingsLoadedRef.current) {
                void saveSettings(nextSettings).catch((error: unknown) => {
                    console.error("Error saving settings:", error);
                });
            }

            return nextSettings;
        });
    };

    const updateAutoStart = <Key extends keyof SettingsData["messages"]["auto_start_new_case"]>(
        key: Key,
        value: SettingsData["messages"]["auto_start_new_case"][Key],
    ) => {
        persistSettings((currentSettings) => ({
            ...currentSettings,
            messages: {
                ...currentSettings.messages,
                auto_start_new_case: {
                    ...currentSettings.messages.auto_start_new_case,
                    [key]: value,
                },
            },
        }));
    };

    const updateNotificationSetting = <Key extends keyof SettingsData["messages"]["notifications"]>(
        key: Key,
        value: SettingsData["messages"]["notifications"][Key],
    ) => {
        persistSettings((currentSettings) => ({
            ...currentSettings,
            messages: {
                ...currentSettings.messages,
                notifications: {
                    ...currentSettings.messages.notifications,
                    [key]: value,
                },
            },
        }));
    };

    const updateMessagesField = <Key extends keyof Pick<SettingsData["messages"], "notification_email">>(
        key: Key,
        value: SettingsData["messages"][Key],
    ) => {
        persistSettings((currentSettings) => ({
            ...currentSettings,
            messages: {
                ...currentSettings.messages,
                [key]: value,
            },
        }));
    };

    const updateMailserverField = <Key extends keyof SettingsData["mailserver"]>(
        key: Key,
        value: SettingsData["mailserver"][Key],
    ) => {
        persistSettings((currentSettings) => ({
            ...currentSettings,
            mailserver: {
                ...currentSettings.mailserver,
                [key]: value,
            },
        }));
    };

    const updateBrokerField = <Key extends keyof SettingsData["broker"]>(
        key: Key,
        value: SettingsData["broker"][Key],
    ) => {
        persistSettings((currentSettings) => ({
            ...currentSettings,
            broker: {
                ...currentSettings.broker,
                [key]: value,
            },
        }));
    };

    const updateUserField = <Key extends keyof SettingsData["user"]>(
        key: Key,
        value: SettingsData["user"][Key],
    ) => {
        persistSettings((currentSettings) => ({
            ...currentSettings,
            user: {
                ...currentSettings.user,
                [key]: value,
            },
        }));
    };

    const updateSecurityPasswordInput = (value: string) => {
        setSecurityErrorMessage("");
        setSecuritySuccessMessage("");
        setSettingsData((currentSettings) => ({
            ...currentSettings,
            security: {
                ...currentSettings.security,
                current_password: value,
            },
        }));
    };

    const enablePasswordProtection = async () => {
        const trimmedPassword = settingsData.security.current_password.trim();

        if (!trimmedPassword) {
            setSecurityErrorMessage("Bitte gib ein Passwort ein.");
            setSecuritySuccessMessage("");
            return;
        }

        setIsSecurityActionPending(true);
        setSecurityErrorMessage("");
        setSecuritySuccessMessage("");

        try {
            await setAuthPassword(trimmedPassword);

            persistSettings((currentSettings) => ({
                ...currentSettings,
                security: {
                    ...currentSettings.security,
                    password_required: true,
                    current_password: "",
                },
            }));
            setSecuritySuccessMessage("Passwort wurde gespeichert.");
        } catch (error) {
            console.error("Error saving password:", error);
            setSecurityErrorMessage(
                error instanceof Error ? error.message : "Passwort konnte nicht gespeichert werden.",
            );
        } finally {
            setIsSecurityActionPending(false);
        }
    };

    const disablePasswordProtection = async () => {
        setIsSecurityActionPending(true);
        setSecurityErrorMessage("");
        setSecuritySuccessMessage("");

        try {
            await setAuthPassword("");

            persistSettings((currentSettings) => ({
                ...currentSettings,
                security: {
                    ...currentSettings.security,
                    password_required: false,
                    current_password: "",
                },
            }));
            setSecuritySuccessMessage("Passwortschutz deaktiviert.");
        } catch (error) {
            console.error("Error clearing password:", error);
            setSecurityErrorMessage("Passwortschutz konnte nicht deaktiviert werden.");
        } finally {
            setIsSecurityActionPending(false);
        }
    };

    const handlePasswordRequiredChange = (nextRequired: boolean) => {
        if (nextRequired) {
            void enablePasswordProtection();
            return;
        }

        void disablePasswordProtection();
    };

    const panels: PanelDefinition[] = [
        {
            id: "messages",
            content: (
                <>
                    <p className="mb-2 text-lg font-semibold">Nachrichten</p>
                    <div className="mt-6">
                        <CheckboxComp
                          text="Automatische Fallerstellung aktivieren"
                          checked={settingsData.messages.auto_start_new_case.enabled}
                          onChange={(event) => updateAutoStart("enabled", event.target.checked)} />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <p className="whitespace-nowrap">Neuen Fall automatisch starten alle</p>
                        <div className="flex gap-3">
                            <InputComp
                              width={70}
                              height={30}
                              type="number"
                              min={1}
                              className="text-right"
                              value={settingsData.messages.auto_start_new_case.interval}
                              onChange={(event) =>
                                  updateAutoStart("interval", Math.max(1, Number(event.target.value) || 1))
                              } />
                            <div className="relative">
                                <select
                                  aria-label="Intervall fuer neuen Fall"
                                  value={settingsData.messages.auto_start_new_case.interval_unit}
                                  onChange={(event) =>
                                      updateAutoStart("interval_unit", event.target.value as IntervalUnit)
                                  }
                                  className={selectClassName}>
                                    <option value="days" className="bg-black text-white">Tage</option>
                                    <option value="weeks" className="bg-black text-white">Wochen</option>
                                    <option value="months" className="bg-black text-white">Monate</option>
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
                        <CheckboxComp
                          text="ein neuer Fall eröffnet wurde"
                          checked={settingsData.messages.notifications.new_case}
                          onChange={(event) => updateNotificationSetting("new_case", event.target.checked)} />
                        <CheckboxComp
                          text="ein Broker geantwortet hat"
                          checked={settingsData.messages.notifications.broker_response}
                          onChange={(event) =>
                              updateNotificationSetting("broker_response", event.target.checked)
                          } />
                        <CheckboxComp
                          text="Daten erfolgreich gelöscht wurden"
                          checked={settingsData.messages.notifications.data_deletion}
                          onChange={(event) => updateNotificationSetting("data_deletion", event.target.checked)} />
                    </div>
                    <p className="mt-6">Benachrichtigung senden an:</p>
                    <InputComp
                      width="100%"
                      height={30}
                      className="mt-2"
                      type="email"
                      placeholder="mail@beispiel.de"
                      value={settingsData.messages.notification_email}
                      onChange={(event) => updateMessagesField("notification_email", event.target.value)} />
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
                              placeholder="smtp.beispiel.de"
                              value={settingsData.mailserver.smtp_host}
                              onChange={(event) => updateMailserverField("smtp_host", event.target.value)} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="mb-2 text-sm text-white/80">Port</p>
                                <InputComp
                                  width="100%"
                                  height={30}
                                  type="number"
                                  placeholder="587"
                                  value={settingsData.mailserver.port}
                                  onChange={(event) =>
                                      updateMailserverField("port", Math.max(1, Number(event.target.value) || 1))
                                  } />
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-white/80">Sicherheit</p>
                                <div className="relative">
                                    <select
                                      aria-label="Sicherheitsmodus fuer Mailserver"
                                      value={settingsData.mailserver.security}
                                      onChange={(event) =>
                                          updateMailserverField("security", event.target.value as MailSecurityMode)
                                      }
                                      className={`w-full ${selectClassName}`}>
                                        <option value="STARTTLS" className="bg-black text-white">STARTTLS</option>
                                        <option value="SSL/TLS" className="bg-black text-white">SSL/TLS</option>
                                        <option value="Keine" className="bg-black text-white">Keine</option>
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
                                  placeholder="smtp-user"
                                  value={settingsData.mailserver.username}
                                  onChange={(event) => updateMailserverField("username", event.target.value)} />
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-white/80">Passwort</p>
                                <InputComp
                                  width="100%"
                                  height={30}
                                  type="password"
                                  placeholder="Passwort"
                                  value={settingsData.mailserver.password}
                                  onChange={(event) => updateMailserverField("password", event.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="mb-2 text-sm text-white/80">Absendername</p>
                                <InputComp
                                  width="100%"
                                  height={30}
                                  placeholder="Mein Unternehmen"
                                  value={settingsData.mailserver.sender_name}
                                  onChange={(event) => updateMailserverField("sender_name", event.target.value)} />
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-white/80">Absender-E-Mail</p>
                                <InputComp
                                  width="100%"
                                  height={30}
                                  type="email"
                                  placeholder="noreply@beispiel.de"
                                  value={settingsData.mailserver.sender_email}
                                  onChange={(event) => updateMailserverField("sender_email", event.target.value)} />
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
                    <CheckboxComp
                      text="Automatisch Fall starten, wenn Broker hinzugefügt wird"
                      checked={settingsData.broker.auto_start_when_added}
                      onChange={(event) =>
                          updateBrokerField("auto_start_when_added", event.target.checked)
                      } />
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
                              placeholder="Max Mustermann"
                              value={settingsData.user.name}
                              onChange={(event) => updateUserField("name", event.target.value)} />
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-white/80">E-Mail</p>
                            <InputComp
                              width="100%"
                              height={30}
                              type="email"
                              placeholder="max.mustermann@beispiel.de"
                              value={settingsData.user.email}
                              onChange={(event) => updateUserField("email", event.target.value)} />
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-white/80">Telefonnummer</p>
                            <InputComp
                              width="100%"
                              height={30}
                              type="tel"
                              placeholder="+49 170 1234567"
                              value={settingsData.user.phone}
                              onChange={(event) => updateUserField("phone", event.target.value)} />
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-white/80">Geburtsdatum</p>
                            <InputComp
                              width="100%"
                              height={30}
                              type="date"
                              className="pr-4"
                              value={settingsData.user.birth_date}
                              onChange={(event) => updateUserField("birth_date", event.target.value)} />
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
                        <CheckboxComp
                          text="Passwort erforderlich"
                          checked={settingsData.security.password_required}
                          disabled={isSecurityActionPending}
                          onChange={(event) => handlePasswordRequiredChange(event.target.checked)} />
                    </div>

                    <div className="mt-6 space-y-4">
                        <p className="text-sm text-white/80">Passwort</p>
                        <InputComp
                          width="100%"
                          height={30}
                          type="password"
                          placeholder={
                              settingsData.security.password_required
                                  ? "Neues Passwort eingeben"
                                  : "Passwort eingeben und aktivieren"
                          }
                          value={settingsData.security.current_password}
                          disabled={isSecurityActionPending}
                          onChange={(event) => updateSecurityPasswordInput(event.target.value)} />
                        <button
                          type="button"
                          disabled={isSecurityActionPending}
                          onClick={() => void enablePasswordProtection()}
                          className="h-[30px] rounded-full bg-transparent px-4 text-sm font-semibold outline outline-[1.5px] outline-white transition-[outline-width,background-color] duration-75 hover:bg-white/15 focus:outline-[3px] focus:outline-white disabled:cursor-not-allowed disabled:opacity-60">
                            {isSecurityActionPending ? "Speichert..." : "Passwort speichern"}
                        </button>
                        {securitySuccessMessage ? (
                            <p className="text-sm text-green-300">{securitySuccessMessage}</p>
                        ) : null}
                        {securityErrorMessage ? (
                            <p className="text-sm text-red-400">{securityErrorMessage}</p>
                        ) : null}
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
