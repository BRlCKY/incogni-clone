import { FormEvent, useState } from "react";
import ColorBlendBackground from "../backgrounds/ColorBlendBackground";
import GlassContainer from "../GlassComp";
import InputComp from "../InputComp";
import type { ProfileRemovalData } from "../../../../shared/types";

const defaultRemovalData: ProfileRemovalData = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    phone: "",
};

type OnboardingDataCompProps = {
    onOnboardingComplete: () => void;
};

const OnboardingDataComp = ({ onOnboardingComplete }: OnboardingDataCompProps) => {
    const [removalData, setRemovalData] = useState<ProfileRemovalData>(defaultRemovalData);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const updateField = (key: keyof ProfileRemovalData, value: string) => {
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
            const response = await fetch("http://localhost:3000/profile/data", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(removalData),
            });

            if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as { message?: string } | null;
                setErrorMessage(payload?.message ?? "Profildaten konnten nicht gespeichert werden.");
                return;
            }

            const completed = await markOnboardingAsCompleted();
            if (!completed) {
                return;
            }

            onOnboardingComplete();
        } catch (error) {
            console.error("Failed to save profile data:", error);
            setErrorMessage("Profildaten konnten nicht gespeichert werden.");
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
                height={610}
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
                            aria-label="Vorname"
                            value={removalData.firstName}
                            onChange={(event) => updateField("firstName", event.target.value)}
                        />
                        <InputComp
                            type="text"
                            placeholder="Nachname"
                            aria-label="Nachname"
                            value={removalData.lastName}
                            onChange={(event) => updateField("lastName", event.target.value)}
                        />
                        <InputComp
                            type="email"
                            placeholder="E-Mail"
                            aria-label="E-Mail"
                            value={removalData.email}
                            onChange={(event) => updateField("email", event.target.value)}
                        />
                        <InputComp
                            type="tel"
                            placeholder="Telefon"
                            aria-label="Telefon"
                            value={removalData.phone}
                            onChange={(event) => updateField("phone", event.target.value)}
                        />
                        <InputComp
                            type="text"
                            placeholder="Adresse"
                            aria-label="Adresse"
                            value={removalData.address}
                            onChange={(event) => updateField("address", event.target.value)}
                            className="md:col-span-2"
                        />
                        <InputComp
                            type="text"
                            placeholder="Stadt"
                            aria-label="Stadt"
                            value={removalData.city}
                            onChange={(event) => updateField("city", event.target.value)}
                        />
                        <InputComp
                            type="text"
                            placeholder="PLZ"
                            aria-label="PLZ"
                            value={removalData.zipCode}
                            onChange={(event) => updateField("zipCode", event.target.value)}
                        />
                        <InputComp
                            type="text"
                            placeholder="Land"
                            aria-label="Land"
                            value={removalData.country}
                            onChange={(event) => updateField("country", event.target.value)}
                            className="md:col-span-2"
                        />
                        {errorMessage ? <p className="text-sm text-red-400 md:col-span-2">{errorMessage}</p> : null}

                        <button
                            type="submit"
                            aria-label="Daten speichern und weiter"
                            disabled={isSaving}
                            className="h-[50px] w-full bg-transparent rounded-full items-center justify-center flex font-bold hover:bg-[rgba(255,255,255,0.2)] cursor-pointer transition-colors duration-200 md:col-span-2">
                            {isSaving ? "Speichert..." : "Daten speichern & weiter"}
                        </button>
                        <button
                            type="button"
                            onClick={onSkip}
                            aria-label="Onboarding ueberspringen"
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
