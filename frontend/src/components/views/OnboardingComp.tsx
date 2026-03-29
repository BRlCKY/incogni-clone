import { FormEvent, useState } from "react";
import ColorBlendBackground from "../backgrounds/ColorBlendBackground";
import GlassContainer from "../GlassComp";
import InputComp from "../InputComp";

type OnboardingCompProps = {
    onPasswordConfigured: () => void;
    onContinueToData: () => void;
};

const OnboardingComp = ({ onPasswordConfigured, onContinueToData }: OnboardingCompProps) => {
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const onSavePassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedPassword = password.trim();
        if (!trimmedPassword) {
            setErrorMessage("Bitte gib ein Passwort ein.");
            return;
        }

        setIsSavingPassword(true);
        setErrorMessage("");

        try {
            const response = await fetch("http://localhost:3000/auth/setpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: trimmedPassword }),
            });

            if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as { message?: string } | null;
                setErrorMessage(payload?.message ?? "Passwort konnte nicht gespeichert werden.");
                return;
            }

            onPasswordConfigured();
            onContinueToData();
        } catch (error) {
            console.error("Failed to save password:", error);
            setErrorMessage("Passwort konnte nicht gespeichert werden.");
        } finally {
            setIsSavingPassword(false);
        }
    };

    const onContinueWithoutPassword = () => {
        setErrorMessage("");
        onContinueToData();
    };

    return (
        <div className="min-h-screen w-full flex justify-center items-center">
            <GlassContainer 
              width={500} 
              height={390}
              tintOpacity={0.5}>
                <div className="w-full h-full flex flex-col justify-center items-center px-8">
                    <h1 className="text-2xl font-bold tracking-tight">Willkommen!</h1>
                    <p className="text-sm text-gray-300 mt-1 mb-5">Möchtest du ein Passwort eingeben, um deine Daten zu schützen?</p>
                    <p className="text-sm text-red-400 mb-5">DEMO-DISCLAIMER: Dies ist eine Demo-Anwendung und die Daten werden nicht sicher gespeichert. Verwende ein Passwort, das du sonst nicht verwendest!</p>

                    <form
                        className="w-full max-w-[340px] flex flex-col gap-3"
                        onSubmit={onSavePassword}>
                        <InputComp
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}
                        <button
                            type="submit"
                            disabled={isSavingPassword}
                            className="h-[50px] w-full bg-transparent rounded-full items-center justify-center flex font-bold hover:bg-[rgba(255,255,255,0.2)] cursor-pointer transition-colors duration-200">
                            {isSavingPassword ? "Speichert..." : "Passwort speichern"}
                        </button>
                        <button
                            type="button"
                            onClick={onContinueWithoutPassword}
                            disabled={isSavingPassword}
                            className="h-[50px] w-full bg-transparent rounded-full items-center justify-center flex font-bold hover:bg-[rgba(255,255,255,0.2)] cursor-pointer transition-colors duration-200">
                            Ohne Passwort fortfahren
                        </button>
                    </form>
                </div>
            </GlassContainer>
            <div className="fixed w-full h-full -z-50 top-0 left-0">
                <ColorBlendBackground />
            </div>
        </div>
    );
}

export default OnboardingComp;
