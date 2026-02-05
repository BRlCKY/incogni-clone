interface ListCompProps {
  height: number;
  title: string;
  details: string;
  date: string;
  time: string;
  circleColorClass: string;
}

const ListComp = (props: ListCompProps) => {
    const perimeter =  props.height - 6;
    
    return (
        <div className={`w-full h-[${props.height}px] rounded-full flex items-center bg-gray-800 hover:bg-gray-700 transition-colors duration-200 cursor-pointer`}>
            <div 
              className={`${props.circleColorClass ? props.circleColorClass : "bg-white"} rounded-full relative left-[3px]`} 
              style={{width: `${perimeter}px`, height: `${perimeter}px`}}/>
            <p className="ml-10 font-bold">{props.title}</p>
            <p className="ml-10 text-gray-400 flex-1 truncate">{props.details}</p>
            <p className="ml-10 text-gray-400 pr-2">{props.date}, {props.time}</p>
        </div>
    );
};

export default ListComp;