import { FormEvent } from "react";
import ColorBlendBackground from "../backgrounds/ColorBlendBackground";
import GlassContainer from "../GlassComp";
import InputComp from "../InputComp";

const LoginComp = () => {

    const onLogin = (event: FormEvent<HTMLFormElement>, password: string) => {
        event.preventDefault();
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
                        onSubmit={(event) => event.preventDefault()}>
                        <InputComp
                            type="password"
                            placeholder="Password"
                        />
                        <button
                            type="submit"
                            className="h-[50px] w-full bg-transparent rounded-full items-center justify-center flex font-bold hover:bg-[rgba(255,255,255,0.2)] cursor-pointer transition-colors duration-200">
                            Login
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