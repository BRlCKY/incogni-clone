import { Color } from "ogl";
import React from "react"
import { text } from "stream/consumers";

type ListCompProps = {
    title: string;
    text2?: string;
    text3?: string;
    circleColor?: string
    perimeter?: number;
}

// TODO: Scrollbox 

const ListComp = ({ title, text2, text3, circleColor, perimeter }: ListCompProps) => {
    
    return (
        <div
            className="h-[40px] w-3/4 bg-gray-800 rounded-full flex items-center px-1 hover:bg-gray-700 transition-colors duration-200 cursor-default"
        >
            <div 
                className={`${circleColor ? circleColor : "bg-white"} rounded-full align-middle relative left-[2px]`} 
                style={{
                    width: `${perimeter || 30}px`,
                    height: `${perimeter || 30}px`
                }} 
            />
            <p className="ml-10 text-3xl font-bold">{title}</p>
            <p className="ml-10 text-2xl text-gray-400 flex-1 truncate">{text2}</p>
            <p className="ml-10 text-2xl text-gray-400 pr-2">{text3}</p>
        </div>
    );
};

export default ListComp;