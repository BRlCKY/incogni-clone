import ButtonComp from "./ButtonComp";
import GlassComp from "./GlassComp";
import type { Question } from "../../../shared/types";

interface Modal {
    question: Question | null;
    onClose: () => void;
}

const QuestionModal = ({ question, onClose }: Modal) => {
    if (!question) {
        return null;
    }

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6 backdrop-blur-sm"
        >
            <div className="w-full max-w-3xl" onClick={(event) => event.stopPropagation()}>
                <GlassComp
                    width="100%"
                    height="auto"
                    borderRadius={28}
                    tintOpacity={0.56}
                    className="rounded-[28px] border border-gray-700 p-6 md:p-8"
                >
                    <div className="w-full">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="rounded-full bg-blue-400/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
                                    Hilfeartikel
                                </span>
                                <h2 className="mt-4 text-2xl font-semibold leading-tight text-white md:text-3xl">
                                    {question.text}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-700 bg-black/20 text-gray-300 transition-colors hover:bg-gray-800/50 hover:text-white"
                                aria-label="Modal schliessen"
                            >
                                <span className="text-lg leading-none">x</span>
                            </button>
                        </div>

                        <div className="my-6 h-px w-full bg-gray-700" />

                        <div className="max-h-[55vh] overflow-y-auto pr-1 text-base leading-7 text-gray-200 no-scrollbar">
                            <p className="whitespace-pre-wrap">{"content" in question ? question.content : ""}</p>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <div className="w-full max-w-[180px]">
                                <ButtonComp label="Schliessen" onClick={onClose} />
                            </div>
                        </div>
                    </div>
                </GlassComp>
            </div>
        </div>
    );
};

export default QuestionModal;
