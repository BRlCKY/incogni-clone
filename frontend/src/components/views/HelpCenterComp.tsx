import { useEffect, useState } from "react";
import GlassComp from "../GlassComp";
import QuestionModal from "../ModalComp";
import Topic from "../TopicComp";
import { Question } from "../../../../shared/types";

const HelpCenterComp = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

    useEffect(() => {
        fetch("http://localhost:3000/faq")
            .then((response) => response.json())
            .then((data) => setQuestions(data));
    }, []);

    const handleClick = (question: Question) =>
        question.url ? window.open(question.url) : setSelectedQuestion(question);

    return (
        <>
            <div className="h-full-respect-nav w-full overflow-y-auto p-6 no-scrollbar">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 pb-24">
                    <GlassComp
                        width="100%"
                        height="auto"
                        tintOpacity={0.5}
                        className="rounded-3xl border border-gray-700 p-6"
                    >
                        <div className="w-full">
                            <span className="rounded-full bg-blue-400/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
                                Support
                            </span>
                            <h1 className="mt-4 text-3xl font-semibold text-white">Help Center</h1>
                            <p className="mt-2 max-w-2xl text-sm text-gray-300">
                                Wichtige Antworten und weiterführende Ressourcen an einem Ort. Wähle
                                ein Thema aus, um eine Antwort direkt im Dialog zu lesen oder eine
                                externe Hilfequelle zu öffnen.
                            </p>
                        </div>
                    </GlassComp>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {questions.map((question, index) => (
                            <Topic
                                key={`${question.text}-${index}`}
                                text={question.text}
                                onClick={() => handleClick(question)}
                                isExternal={Boolean(question.url)}
                            />
                        ))}

                        {questions.length === 0 && (
                            <GlassComp
                                width="100%"
                                height={120}
                                tintOpacity={0.5}
                                borderRadius={24}
                                className="rounded-3xl border border-gray-700 sm:col-span-2 lg:col-span-3 xl:col-span-4"
                            >
                                <p className="text-sm text-gray-400">
                                    Es sind aktuell keine Hilfe-Themen verfuegbar.
                                </p>
                            </GlassComp>
                        )}
                    </div>
                </div>
            </div>

            <QuestionModal question={selectedQuestion} onClose={() => setSelectedQuestion(null)} />
        </>
    );
};

export default HelpCenterComp;
