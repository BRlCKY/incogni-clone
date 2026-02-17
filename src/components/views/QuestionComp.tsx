import type { Question } from "./HelpCenterComp";

interface QuestionCard {
  question: Question;
  onClick: (q: Question) => void;
}

const QuestionComp = ({ question, onClick }: QuestionCard) => {
  return (
    <div
      onClick={() => onClick(question)}
      className="aspect-square bg-gray-800 rounded-2xl flex items-center justify-center text-center p-4 
      text-gray-400 transition-all duration-200 cursor-pointer hover:bg-gray-700 
      hover:scale-105 hover:shadow-lg"
    >
      <span className="font-semibold">
        {question.text}
      </span>
    </div>
  );
};

export default QuestionComp;
