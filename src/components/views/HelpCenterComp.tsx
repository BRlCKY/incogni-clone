import { useState } from "react";
import QuestionComp from "./QuestionComp";
import QuestionModal from "./ModalComp";

export type Question =
  | { text: string; content: string; url?: never }
  | { text: string; url: string; content?: never };

const questions: Question[] = [
  { text: "Geht erkin ins Gym?", content: "Ja" },
  { text: "Frage 2", content: "Antwort zu Frage 2" },
  { text: "Google", url: "https://google.com" },
  { text: "Frage 4", content: "Antwort zu Frage 4" },
  { text: "Frage 5", content: "Antwort zu Frage 5" },
  { text: "Frage 6", content: "Antwort zu Frage 6" },
  { text: "Frage 7", content: "Antwort zu Frage 7" },
  { text: "Frage 8", content: "Antwort zu Frage 8" },
  { text: "Frage 9", content: "Antwort zu Frage 9" },
  { text: "Frage 10", content: "Antwort zu Frage 10" },
  { text: "Frage 11", content: "Antwort zu Frage 11" },
  { text: "Frage 12", content: "Antwort zu Frage 12" },
];

const HelpCenterComp = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const handleClick = (q: Question) =>
    q.url ? window.open(q.url) : setSelectedQuestion(q);

  return (
    <>
      
      <div className="h-full-respect-nav w-full overflow-y-auto bg-transparent">
        
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 w-full">
            {questions.map((q, i) => (
              <QuestionComp
                key={i}
                question={q}
                onClick={handleClick}
              />
            ))}
          
          
        </div>
      </div>

      <QuestionModal
        question={selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
      />
    </>
  );
};

export default HelpCenterComp;