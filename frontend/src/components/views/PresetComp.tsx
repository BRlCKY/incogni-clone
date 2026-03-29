import { useRef, useState } from "react";
import GlassComp from "../GlassComp";
import InputComp from "../InputComp";
import { getAccessibleClickProps } from "../../utils/accessibility";

const placeholders = [
    { tag: "%%VOLLER_NAME%%", label: "Vollstaendiger Name" },
    { tag: "%%EMAIL%%", label: "E-Mail-Adresse" },
    { tag: "%%TELEFON%%", label: "Telefonnummer" },
    { tag: "%%GEBURTSDATUM%%", label: "Geburtsdatum" },
    { tag: "%%ANSCHRIFT%%", label: "Anschrift" },
    { tag: "%%ALIASE%%", label: "Fruehere Namen oder Aliase" },
    { tag: "%%FRIST%%", label: "Antwortfrist in Tagen" },
    { tag: "%%ANTWORT_EMAIL%%", label: "Antwort-E-Mail" },
    { tag: "%%DATUM%%", label: "Aktuelles Datum" },
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

const defaultTemplate = (): Template => ({
    id: `tpl_${Date.now()}`,
    subject: "Loeschantrag nach Art. 17 DSGVO - %%VOLLER_NAME%%",
    text: "Sehr geehrte Damen und Herren,\n\nhiermit fordere ich Sie auf, meine personenbezogenen Daten gemäß Art. 17 DSGVO unverzüglich zu löschen, soweit keine gesetzliche Aufbewahrungspflicht entgegensteht.\n\nZur Identifizierung meiner Person finden Sie nachfolgend die relevanten Angaben:\n\nVollständiger Name: %%VOLLER_NAME%%\nE-Mail-Adresse: %%E_MAIL%%\nTelefonnummer: %%TELEFON%%\nGeburtsdatum: %%GEBURTSDATUM%%\nAnschrift: %%ANSCHRIFT%%\nFrühere Namen / Aliase: %%ALIASE%%\n\nIch fordere Sie insbesondere dazu auf,\n\n1. sämtliche personenbezogenen Daten zu meiner Person zu löschen,\n2. die Verarbeitung meiner Daten einzustellen,\n3. mich aus allen Datenbanken, Verzeichnissen und Marketingverteilern zu entfernen,\n4. etwaige Empfänger, an die meine Daten weitergegeben wurden, über die Löschung zu informieren,\n5. mir eine Bestätigung der vollständigen Löschung zukommen zu lassen.\n\nBitte teilen Sie mir außerdem mit, welche Daten Sie zu meiner Person gespeichert hatten und an welche Dritten diese Daten weitergegeben wurden, soweit dies erforderlich ist, um die Löschung nachvollziehbar zu bestätigen.\n\nIch setze Ihnen hierfür eine Frist von %%FRIST%% Tagen ab Zugang dieser Nachricht. Sollte ich innerhalb dieser Frist keine vollständige und zufriedenstellende Rückmeldung erhalten, werde ich die Angelegenheit an einen Anwalt übergeben und weitere rechtliche Schritte prüfen.\n\nBitte senden Sie Ihre Antwort an: %%ANTWORT_EMAIL%%\n\nMit freundlichen Grüßen\n\n%%VOLLER_NAME%%",
});

const PresetComp = ({ initialTemplate, onBack, onSave }: PresetCompProps) => {
    const [template, setTemplate] = useState<Template>(initialTemplate ?? defaultTemplate());
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const selectionRef = useRef({ start: template.text.length, end: template.text.length });

    const updateSelection = () => {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        }

        selectionRef.current = {
            start: textarea.selectionStart,
            end: textarea.selectionEnd,
        };
    };

    const insertPlaceholder = (tag: string) => {
        const textarea = textareaRef.current;
        const start = textarea ? textarea.selectionStart : selectionRef.current.start;
        const end = textarea ? textarea.selectionEnd : selectionRef.current.end;
        const nextCursorPosition = start + tag.length;

        setTemplate((currentTemplate) => ({
            ...currentTemplate,
            text: `${currentTemplate.text.slice(0, start)}${tag}${currentTemplate.text.slice(end)}`,
        }));
        selectionRef.current = {
            start: nextCursorPosition,
            end: nextCursorPosition,
        };

        requestAnimationFrame(() => {
            const nextTextarea = textareaRef.current;

            if (!nextTextarea) {
                return;
            }

            nextTextarea.focus();
            nextTextarea.setSelectionRange(nextCursorPosition, nextCursorPosition);
        });
    };

    const handleSave = () => {
        if (!template.subject.trim()) {
            alert("Der Betreff darf nicht leer sein.");
            return;
        }

        if (!template.text.trim()) {
            alert("Der Nachrichtentext darf nicht leer sein.");
            return;
        }

        onSave(template);
    };

    return (
        <div className="h-full-respect-nav w-full overflow-hidden p-6">
            <div className="flex h-full w-full min-h-0 flex-col gap-6">
                <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(190px,240px)_minmax(0,1fr)] 2xl:grid-cols-[minmax(220px,280px)_minmax(0,1fr)]">
                    <div className="flex h-full min-h-0 flex-col gap-4">
                        <GlassComp
                          width="100%"
                          height="auto"
                          tintOpacity={0.5}
                          className="rounded-3xl border border-gray-700 p-5"
                        >
                            <div className="w-full">
                                <h2 className="text-xl font-semibold text-white">Platzhalter</h2>
                            </div>
                        </GlassComp>

                        <div className="grid flex-1 grid-cols-1 gap-3 overflow-y-auto pr-1 no-scrollbar sm:grid-cols-2 lg:grid-cols-1">
                            {placeholders.map((placeholder) => (
                                <button
                                  key={placeholder.tag}
                                  type="button"
                                  onClick={() => insertPlaceholder(placeholder.tag)}
                                  aria-label={`Platzhalter einfuegen: ${placeholder.label}`}
                                  className="w-full min-w-0 bg-transparent text-left"
                                >
                                    <GlassComp
                                      width="100%"
                                      height="100%"
                                      tintOpacity={0.5}
                                      borderRadius={24}
                                      className="rounded-3xl border border-gray-700 px-4 py-3 hover:bg-gray-800/40"
                                      isHoverable
                                    >
                                        <div className="flex h-full w-full flex-col gap-1.5">
                                            <span className="font-mono text-xs font-semibold text-white">
                                                {placeholder.tag}
                                            </span>
                                            <span className="text-xs text-gray-400">{placeholder.label}</span>
                                        </div>
                                    </GlassComp>
                                </button>
                            ))}
                        </div>
                    </div>

                    <GlassComp
                      width="100%"
                      height="100%"
                      tintOpacity={0.5}
                      className="h-full min-h-0 rounded-3xl border border-gray-700 p-6"
                    >
                        <div className="flex h-full w-full min-h-0 flex-col gap-6">
                            <div className="w-full">
                                <h2 className="text-2xl font-semibold text-white">E-Mail Vorlage</h2>
                            </div>

                            <div className="w-full">
                                <p className="mb-2 text-sm text-white/80">Betreff</p>
                                <InputComp
                                  width="100%"
                                  height={44}
                                  aria-label="Betreff der Vorlage"
                                  value={template.subject}
                                  onChange={(event) =>
                                      setTemplate((currentTemplate) => ({
                                          ...currentTemplate,
                                          subject: event.target.value,
                                      }))
                                  }
                                  placeholder="Betreff eingeben"
                                  className="px-4"
                                />
                            </div>

                            <div className="flex min-h-0 w-full flex-1 flex-col">
                                <p className="mb-2 text-sm text-white/80">Nachricht</p>
                                <GlassComp
                                  width="100%"
                                  height="100%"
                                  tintOpacity={0.5}
                                  borderRadius={24}
                                  className="h-full min-h-0 rounded-3xl border border-gray-700 transition-colors focus-within:border-gray-500"
                                >
                                    <textarea
                                      ref={textareaRef}
                                      value={template.text}
                                      onChange={(event) =>
                                          setTemplate((currentTemplate) => ({
                                              ...currentTemplate,
                                              text: event.target.value,
                                          }))
                                      }
                                      onClick={updateSelection}
                                      onKeyUp={updateSelection}
                                      onSelect={updateSelection}
                                      aria-label="Nachrichtentext der Vorlage"
                                      placeholder="Schreibe hier deinen Vorlagentext..."
                                      className="h-full w-full resize-none overflow-y-auto bg-transparent p-4 text-base leading-relaxed text-white placeholder-gray-500 focus:outline-none no-scrollbar"
                                    />
                                </GlassComp>
                            </div>
                        </div>
                    </GlassComp>
                </div>

                <div className="flex w-full flex-shrink-0 flex-wrap items-center justify-end gap-3">
                    <div className="h-[52px] w-full sm:w-[160px]">
                        <GlassComp
                          width="100%"
                          height="100%"
                          tintOpacity={0.5}
                          borderRadius={999}
                          className="cursor-pointer border border-gray-700 transition-colors hover:bg-gray-800/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          onClick={onBack}
                          isHoverable
                          {...getAccessibleClickProps(onBack, { label: "Vorlagenbearbeitung abbrechen" })}
                        >
                            <div className="flex h-full w-full items-center justify-center">
                                <p className="text-sm font-semibold text-white">Abbrechen</p>
                            </div>
                        </GlassComp>
                    </div>

                    <div className="h-[52px] w-full sm:w-[200px]">
                        <GlassComp
                          width="100%"
                          height="100%"
                          tintOpacity={0.5}
                          borderRadius={999}
                          className="cursor-pointer border border-emerald-400/60 bg-emerald-900/25 transition-colors hover:bg-emerald-900/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          onClick={handleSave}
                          isHoverable
                          {...getAccessibleClickProps(handleSave, { label: "Vorlage speichern" })}
                        >
                            <div className="flex h-full w-full items-center justify-center">
                                <p className="text-sm font-semibold text-white">Vorlage speichern</p>
                            </div>
                        </GlassComp>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PresetComp;
