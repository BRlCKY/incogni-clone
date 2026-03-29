import { useEffect, useState } from "react";
import Topic from "../TopicComp";
import QuestionModal from "../ModalComp";
import { Question } from "../../../../shared/types";

const HelpCenterComp = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/faq")
      .then((response) => response.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleClick = (q: Question) =>
    q.url ? window.open(q.url) : setSelectedQuestion(q);

  return (
    <>
      
      <div className="h-full-respect-nav w-full overflow-y-auto bg-transparent">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 w-full">
            {questions.map((q, i) => (
              <Topic
              key={i}           
              text={q.text}
              onClick={() => handleClick(q)} 
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