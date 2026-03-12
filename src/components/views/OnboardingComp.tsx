import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ColorBlendBackground from "../backgrounds/ColorBlendBackground";
import GlassContainer from "../GlassContainer";
import InputComp from "../InputComp";

const OnboardingComp = () => {
    const navigate = useNavigate();

    const onSavePassword = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate("/onboarding/data");
    };

    const onContinueWithoutPassword = () => navigate("/onboarding/data");

    return (
        <div className="min-h-screen w-full flex justify-center items-center">
            <GlassContainer width={500} height={300}>
                <div className="w-full h-full flex flex-col justify-center items-center px-8">
                    <h1 className="text-2xl font-bold tracking-tight">Willkommen!</h1>
                    <p className="text-sm text-gray-300 mt-1 mb-5">Möchtest du ein Passwort eingeben, um deine Daten zu schützen?</p>

                    <form
                        className="w-full max-w-[340px] flex flex-col gap-3"
                        onSubmit={onSavePassword}>
                        <InputComp
                            type="password"
                            placeholder="Password"
                        />
                        <button
                            type="submit"
                            className="h-[50px] w-full bg-transparent rounded-full items-center justify-center flex font-bold hover:bg-[rgba(255,255,255,0.2)] cursor-pointer transition-colors duration-200">
                            Passwort speichern
                        </button>
                        <button
                            type="button"
                            onClick={onContinueWithoutPassword}
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
