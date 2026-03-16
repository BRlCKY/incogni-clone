import { useState } from "react";
import GlassComp from "./GlassComp";

interface ListCompProps {
  height: number;
  title: string;
  text1?: string;
  text2?: string;
  text3?: string;
  circleColorClass?: string;
  onItemClick?: () => void;
}

const ListComp = (props: ListCompProps) => {
    const diameter = props.height - 6;
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <GlassComp
            width="100%"
            height={props.height}
            borderRadius={9999}
            tintOpacity={isHovered ? 0.8 : 0.3}
            className="w-full flex items-center cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave} >
            <div
                className={`${props.circleColorClass ? props.circleColorClass : "bg-white"} rounded-full relative left-[-6px] flex-shrink-0`}
                style={{ width: `${diameter}px`, height: `${diameter}px` }}
                onClick={props.onItemClick} />
            <div className="flex justify-end ml-3 w-full">
                <p className="font-bold min-w-[200px] max-[500px]:flex-1 max-[500px]:min-w-[100px] truncate">{props.title}</p>
                <p className="ml-2 text-gray-400 flex-1 truncate max-[500px]:hidden">{props.text1}</p>
                <p className="mx-[10px] text-gray-400">{props.text2} {props.text3}</p>
            </div>
        </GlassComp>
    );
};

export default ListComp;