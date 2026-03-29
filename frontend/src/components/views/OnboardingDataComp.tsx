import { FormEvent, useState } from "react";
import ColorBlendBackground from "../backgrounds/ColorBlendBackground";
import GlassContainer from "../GlassComp";
import InputComp from "../InputComp";
import type { Settings } from "../../../../shared/types";

type OnboardingRemovalData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
};

const defaultRemovalData: OnboardingRemovalData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
};

const SETTINGS_ENDPOINT = "http://localhost:3000/settings";

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const loadSettings = async (): Promise<Settings> => {
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

    return payload as Settings;
};

type OnboardingDataCompProps = {
    onOnboardingComplete: () => void;
};

const OnboardingDataComp = ({ onOnboardingComplete }: OnboardingDataCompProps) => {
    const [removalData, setRemovalData] = useState<OnboardingRemovalData>(defaultRemovalData);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const updateField = (key: keyof OnboardingRemovalData, value: string) => {
        setRemovalData((prev) => ({ ...prev, [key]: value }));
    };

    const markOnboardingAsCompleted = async (): Promise<boolean> => {
        try {
            const response = await fetch("http://localhost:3000/onboarding/complete", {
                method: "POST",
            });

            if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as { message?: string } | null;
                setErrorMessage(payload?.message ?? "Onboarding-Status konnte nicht gespeichert werden.");
                return false;
            }

            return true;
        } catch (error) {
            console.error("Failed to mark onboarding completed:", error);
            setErrorMessage("Onboarding-Status konnte nicht gespeichert werden.");
            return false;
        }
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSaving(true);
        setErrorMessage("");

        try {
            const currentSettings = await loadSettings();
            const combinedName = `${removalData.firstName} ${removalData.lastName}`.trim();
            const nextSettings: Settings = {
                ...currentSettings,
                user: {
                    ...currentSettings.user,
                    name: combinedName,
                    email: removalData.email,
                    phone: removalData.phone,
                },
            };

            const response = await fetch(SETTINGS_ENDPOINT, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nextSettings),
            });

            if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as { message?: string } | null;
                setErrorMessage(payload?.message ?? "Einstellungen konnten nicht gespeichert werden.");
                return;
            }

            const completed = await markOnboardingAsCompleted();
            if (!completed) {
                return;
            }

            onOnboardingComplete();
        } catch (error) {
            console.error("Failed to save onboarding data:", error);
            setErrorMessage("Einstellungen konnten nicht gespeichert werden.");
        } finally {
            setIsSaving(false);
        }
    };

    const onSkip = async () => {
        setIsSaving(true);
        setErrorMessage("");

        const completed = await markOnboardingAsCompleted();
        if (completed) {
            onOnboardingComplete();
        }

        setIsSaving(false);
    };

    return (
        <div className="min-h-screen w-full flex justify-center items-center py-6">
            <GlassContainer 
                width={580}
                height={520}
                tintOpacity={0.5}
                >
                <div className="w-full h-full flex flex-col items-center px-8 py-8">
                    <h1 className="text-2xl font-bold tracking-tight text-center">Welche Daten sollen entfernt werden?</h1>
                    <p className="text-sm text-gray-300 mt-1 mb-5 text-center max-w-[440px]">
                        Fülle die Felder aus, damit wir bei Brokern gezielt Löschanfragen stellen können.
                        Du kannst diesen Schritt überspringen und die Daten später in den Einstellungen bearbeiten.
                    </p>

                    <form className="w-full max-w-[500px] grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
                        <InputComp
                            type="text"
                            placeholder="Vorname"
                            value={removalData.firstName}
                            onChange={(event) => updateField("firstName", event.target.value)}
                        />
                        <InputComp
                            type="text"
                            placeholder="Nachname"
                            value={removalData.lastName}
                            onChange={(event) => updateField("lastName", event.target.value)}
                        />
                        <InputComp
                            type="email"
                            placeholder="E-Mail"
                            value={removalData.email}
                            onChange={(event) => updateField("email", event.target.value)}
                        />
                        <InputComp
                            type="tel"
                            placeholder="Telefon"
                            value={removalData.phone}
                            onChange={(event) => updateField("phone", event.target.value)}
                        />
                        {errorMessage ? <p className="text-sm text-red-400 md:col-span-2">{errorMessage}</p> : null}

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="h-[50px] w-full bg-transparent rounded-full items-center justify-center flex font-bold hover:bg-[rgba(255,255,255,0.2)] cursor-pointer transition-colors duration-200 md:col-span-2">
                            {isSaving ? "Speichert..." : "Daten speichern & weiter"}
                        </button>
                        <button
                            type="button"
                            onClick={onSkip}
                            disabled={isSaving}
                            className="h-[50px] w-full bg-transparent rounded-full items-center justify-center flex font-bold hover:bg-[rgba(255,255,255,0.2)] cursor-pointer transition-colors duration-200 md:col-span-2">
                            Überspringen
                        </button>
                    </form>
                </div>
            </GlassContainer>
            <div className="fixed w-full h-full -z-50 top-0 left-0">
                <ColorBlendBackground />
            </div>
        </div>
    );
};

export default OnboardingDataComp;
