import { useState } from "react";
import GlassComp from "../GlassComp";

const placeholders = [
    { tag: "%%ANREDE%%", label: "Anrede (Herr/Frau)" },
    { tag: "%%VORNAME%%", label: "Vorname" },
    { tag: "%%NACHNAME%%", label: "Nachname" },
    { tag: "%%DATUM%%", label: "Aktuelles Datum" }
];

export type Template = {
    id: string;
    subject: string;
    text: string;
};

type PresetCompProps = {
    initialTemplate?: Template;
    onBack: () => void;
    onSave: (template: Template) => void;
};

const PresetComp = ({ initialTemplate, onBack, onSave }: PresetCompProps) => {
    const [template, setTemplate] = useState<Template>(
        initialTemplate || {
            id: "tpl_" + Date.now(),
            subject: "",
            text: "Hallo %%ANREDE%% %%NACHNAME%%,\n\nvielen Dank für die Nachricht.\nWir werden das Anliegen bis zum %%DATUM%% bearbeiten.\n\nViele Grüße,\nDein Team",
        }
    );

    const handleSave = () => {
        if (!template.text.trim()) {
            alert("Der Nachrichtentext darf nicht leer sein.");
            return;
        }
        onSave(template);
    };

    return (
        <div className="flex h-[calc(100vh-70px)] w-full flex-col overflow-hidden p-6">
            <div className="grid w-full flex-1 grid-cols-[300px_minmax(0,1fr)] gap-6 min-h-0">
                <div className="flex h-full flex-col">
                    <GlassComp
                        width="100%"
                        height="100%"
                        tintOpacity={0.5}
                        className="flex-1 rounded-3xl border border-gray-700 p-8"
                    >
                        <div className="flex h-full flex-col gap-3 overflow-y-auto no-scrollbar">
                            <h2 className="mb-2 w-full text-left text-2xl font-bold text-white">Preset Mail</h2>
                            <p className="mb-2 text-sm text-gray-300">
                                Diese Platzhalter kannst du im Text verwenden:
                            </p>
                            
                            {placeholders.map((ph, idx) => (
                                <div key={idx} className="h-[80px] w-full flex-shrink-0">
                                    <GlassComp
                                        width="100%"
                                        height="100%"
                                        tintOpacity={0.5}
                                        className="rounded-xl border border-gray-700"
                                    >
                                        <div className="flex h-full w-full flex-col justify-center bg-transparent px-4 py-3 text-left">
                                            <span className="mb-1 font-mono text-sm font-semibold text-white">
                                                {ph.tag}
                                            </span>
                                            <span className="truncate text-xs text-gray-300">
                                                {ph.label}
                                            </span>
                                        </div>
                                    </GlassComp>
                                </div>
                            ))}
                        </div>
                    </GlassComp>
                </div>

                <div className="flex h-full w-full min-w-0 flex-col">
                    <GlassComp
                        width="100%"
                        height="100%"
                        tintOpacity={0.50}
                        className="flex-1 rounded-3xl border border-gray-700 p-8"
                    >
                        <div className="flex h-full w-full flex-col overflow-y-auto no-scrollbar">
                            
                            <label className="mb-8 w-full text-left text-2xl font-bold tracking-wide text-white">
                                E-Mail Vorlage
                            </label>
                            
                            <div className="flex w-full flex-1 flex-col min-h-[250px]">
                                <GlassComp width="100%" height="100%" tintOpacity={0.5} className="rounded-xl border border-gray-700 transition-colors focus-within:border-gray-500">
                                    <textarea 
                                        value={template.text}
                                        onChange={(e) => setTemplate({ ...template, text: e.target.value })}
                                        placeholder="Schreibe hier deinen Vorlagentext..."
                                        className="h-full w-full resize-none bg-transparent p-4 text-base leading-relaxed text-white placeholder-gray-500 focus:outline-none no-scrollbar"
                                    />
                                </GlassComp>
                            </div>

                        </div>
                    </GlassComp>
                </div>

            </div>

            <div className="mt-6 flex w-full flex-shrink-0 items-center justify-end gap-3">
                <div className="h-[52px] w-[160px]">
                    <GlassComp
                        width="100%"
                        height="100%"
                        tintOpacity={0.5}
                        borderRadius={999}
                        className="cursor-pointer border border-gray-700 transition-colors hover:bg-gray-800/50"
                        onClick={onBack}
                        role="button"
                    >
                        <div className="flex h-full w-full items-center justify-center">
                            <p className="text-sm font-semibold text-white">Abbrechen</p>
                        </div>
                    </GlassComp>
                </div>
                
                <div className="h-[52px] w-[200px]">
                    <GlassComp
                        width="100%"
                        height="100%"
                        tintOpacity={0.5}
                        borderRadius={999}
                        className="cursor-pointer border border-emerald-400/60 bg-emerald-900/25 transition-colors hover:bg-emerald-900/45"
                        onClick={handleSave}
                        role="button"
                    >
                        <div className="flex h-full w-full items-center justify-center">
                            <p className="text-sm font-semibold text-white">Vorlage speichern</p>
                        </div>
                    </GlassComp>
                </div>
            </div>

        </div>
    );
};

export default PresetComp;