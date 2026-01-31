import React from "react"

const ListComp = ({ text }) => {
    return (
        <div
            className="h-[50px] w-3/4 bg-gray-800 rounded-full flex items-center px-3"
        >
            <div className="w-[40px] h-[40px] bg-white rounded-full align-middle" />
            <p className="ml-3 text-3xl">{text}</p>
        </div>
    );
}

export default ListComp;