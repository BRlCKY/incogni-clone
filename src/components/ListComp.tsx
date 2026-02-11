interface ListCompProps {
  height: number;
  title: string;
  details?: string;
  date?: string;
  time?: string;
  circleColorClass?: string;
  onItemClick?: () => void;
}

const ListComp = (props: ListCompProps) => {
	const diameter =  props.height - 6;
	
	return (
		<div 
		  className="w-full rounded-full flex items-center bg-gray-800 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
		  style={{height: `${props.height}px`}}>
			<div 
			  className={`${props.circleColorClass ? props.circleColorClass : "bg-white"} rounded-full relative left-[3px] flex-shrink-0`} 
			  style={{width: `${diameter}px`, height: `${diameter}px`}}
			  onClick={props.onItemClick} />
			<div className="flex justify-end ml-3 w-full">
				<p className="font-bold min-w-[200px] max-[500px]:flex-1 max-[500px]:min-w-[100px] truncate">{props.title}</p>
				<p className="ml-2 text-gray-400 flex-1 truncate max-[500px]:hidden">{props.details}</p>
				<p className="mx-[10px] text-gray-400">{props.date} {props.time}</p>
			</div>
		</div>
	);
};

export default ListComp;