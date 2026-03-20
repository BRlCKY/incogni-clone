interface TopicProps {
  text: string;         
  onClick: () => void; 
}
const Topic = ({ text, onClick }: TopicProps) => {
  return (
    <button
      onClick={onClick}
      className="aspect-square min-w-[120px] min-h-[120px] bg-gray-800 rounded-2xl flex items-center justify-center text-center p-6
           text-gray-400 text-lg transition-all duration-200 hover:bg-gray-700 
           hover:scale-105 hover:shadow-lg"
    >
      <span className="font-semibold">
        {text}
      </span>
    </button>
  );
};


export default Topic;
