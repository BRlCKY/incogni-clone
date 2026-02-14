import { useState } from "react";

interface Question {
  text: string;
  content?: string;
  url?: string;
}

const questions: Question[] = [
  { text: "Geht erkin ins Gym?", content: "Ja" },
  { text: "Frage 2", content: "Antwort zu Frage 2" },
  { text: "Google", url: "https://google.com" },
  { text: "Frage 4", content: "Antwort zu Frage 4" },
  { text: "Frage 5", content: "Antwort zu Frage 5" },
];

const HelpCenterComp = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

 const handleClick = (q: Question) => q.url ? window.open(q.url) : setSelectedQuestion(q);


  return (
    <>
      <div className="flex justify-center items-center h-full-respect-nav px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-5xl">
          {questions.map((q, i) => (
            <div
              key={i}
              onClick={() => handleClick(q)}
              className="aspect-square  bg-gray-800 rounded-2xl flex items-center justify-center text-center p-4 
                text-gray-400 transition-all duration-200 cursor-pointer hover:bg-gray-700 hover:scale-105 
                hover:shadow-lg"
            >
              <span className="font-semibold truncate">
                {q.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedQuestion && (
        <div className="fixed inset-0 bg-gray-800/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full min-h-[300px] relative shadow-xl border border-gray-700">
            
            <button
              onClick={() => setSelectedQuestion(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-white">
              {selectedQuestion.text}
            </h2>

            <p className="text-gray-400">
              {selectedQuestion.content}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpCenterComp;