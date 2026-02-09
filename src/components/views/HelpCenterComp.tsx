const questions = [
  { text: "Frage 1", url: "" },
  { text: "Frage 2", url: "" },
  { text: "Frage 3", url: "" },
  { text: "Frage 4", url: "" },
  { text: "Frage 5", url: "" },
];

const HelpCenterComp = () => {
  return (
    <div className="flex justify-center items-center h-full-respect-nav">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-4xl">
        {questions.map((q, i) => (
          
          <a
            key={i}
            href={q.url}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-center p-4
             transition duration-200 cursor-pointer
             hover:bg-gray-300 hover:shadow-xl hover:scale-105"
              >
            {q.text}
          </a>
        ))}
      </div>
    </div>
  );
};

export default HelpCenterComp;