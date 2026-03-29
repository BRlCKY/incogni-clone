import { FormEvent, useState } from "react";
import ColorBlendBackground from "../backgrounds/ColorBlendBackground";
import GlassContainer from "../GlassComp";
import InputComp from "../InputComp";

type LoginCompProps = {
    onLoginSuccess: () => void;
};

const LoginComp = ({ onLoginSuccess }: LoginCompProps) => {
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const onLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrorMessage("");
        setIsLoggingIn(true);

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as { message?: string } | null;
                setErrorMessage(payload?.message ?? "Login fehlgeschlagen.");
                return;
            }

            onLoginSuccess();
        } catch (error) {
            console.error("Failed to login:", error);
            setErrorMessage("Login fehlgeschlagen.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex justify-center items-center">
            <GlassContainer 
              width={450} 
              height={280}
              tintOpacity={0.5}>
                <div className="w-full h-full flex flex-col justify-center items-center px-8">
                    <h1 className="text-2xl font-bold tracking-tight">Willkommen zurück!</h1>
                    <p className="text-sm text-gray-300 mt-1 mb-5">Gib dein Passwort ein, um dich anzumelden!</p>

                    <form
                        className="w-full max-w-[340px] flex flex-col gap-3"
                        onSubmit={onLogin}>
                        <InputComp
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                        />
                        {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}
                        <button
                          type="submit"
                          disabled={isLoggingIn}
                          className="h-[50px] w-full bg-transparent rounded-full items-center justify-center flex font-bold hover:bg-[rgba(255,255,255,0.2)] cursor-pointer transition-colors duration-200">
                          {isLoggingIn ? "Prüfe..." : "Login"}
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

export default LoginComp;
