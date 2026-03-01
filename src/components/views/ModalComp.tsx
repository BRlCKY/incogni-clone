import type { Question } from "./HelpCenterComp";

interface Modal {
  question: Question | null;
  onClose: () => void;
}

const QuestionModal = ({ question, onClose }: Modal) => {
  if (!question) return null;

  return (
   
    <div
      onClick={onClose}
      className="fixed inset-0 bg-gray-800/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full min-h-[300px] relative shadow-xl border border-gray-700"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-white">
          {question.text}
        </h2>

        <p className="text-gray-400">
          {question.content}
        </p>
      </div>
    </div>
  );
};

export default QuestionModal;