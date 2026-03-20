import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import ColorBlendBackground from "../backgrounds/ColorBlendBackground";
import GlassContainer from "../GlassComp";
import InputComp from "../InputComp";

type RemovalData = {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    phone: string;
};

const defaultRemovalData: RemovalData = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    phone: "",
};

const OnboardingDataComp = () => {
    const navigate = useNavigate();
    const [removalData, setRemovalData] = useState<RemovalData>(defaultRemovalData);

    const updateField = (key: keyof RemovalData, value: string) => {
        setRemovalData((prev) => ({ ...prev, [key]: value }));
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate("/");
    };

    const onSkip = () => {
        navigate("/");
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
                        <InputComp
                            type="text"
                            placeholder="Adresse"
                            value={removalData.address}
                            onChange={(event) => updateField("address", event.target.value)}
                            className="md:col-span-2"
                        />
                        <InputComp
                            type="text"
                            placeholder="Stadt"
                            value={removalData.city}
                            onChange={(event) => updateField("city", event.target.value)}
                        />
                        <InputComp
                            type="text"
                            placeholder="PLZ"
                            value={removalData.zipCode}
                            onChange={(event) => updateField("zipCode", event.target.value)}
                        />
                        <InputComp
                            type="text"
                            placeholder="Land"
                            value={removalData.country}
                            onChange={(event) => updateField("country", event.target.value)}
                            className="md:col-span-2"
                        />

                        <button
                            type="submit"
                            className="h-[50px] w-full bg-transparent rounded-full items-center justify-center flex font-bold hover:bg-[rgba(255,255,255,0.2)] cursor-pointer transition-colors duration-200 md:col-span-2">
                            Daten speichern & weiter
                        </button>
                        <button
                            type="button"
                            onClick={onSkip}
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
