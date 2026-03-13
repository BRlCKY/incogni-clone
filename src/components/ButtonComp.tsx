type ButtonCompProps = {
    label: string;
    onClick?: () => void;
};

const ButtonComp = ({ label, onClick }: ButtonCompProps) => {
    return (
        <button
            type="button"
            className="h-[50px] w-full mr-4 bg-gray-900 rounded-full items-center justify-center flex font-bold hover:bg-gray-800 cursor-pointer"
            onClick={onClick}
        >
            <p className="text-white text-sm">{label}</p>
        </button>
    );
};

export default ButtonComp;