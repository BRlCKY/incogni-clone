import GlassComp from "../GlassComp";

const SettingsComp = () => {
    return (
        <div className="h-full-respect-nav w-full p-6 overflow-y-scroll no-scrollbar grid grid-cols-1 gap-4 sm:grid-cols-2">
            <GlassComp
              width="100%"
              height="auto"
              tintOpacity={0.5}
              className="min-h-[400px]">
                <div className="w-full h-full p-4">
                    <p className="text-lg font-semibold mb-2">Nachrichten</p>
                    <p>Antragfrequenz</p>
                </div>
            </GlassComp>
            <GlassComp
              width="100%"
              height="auto"
              tintOpacity={0.5}
              className="min-h-[400px]">
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
