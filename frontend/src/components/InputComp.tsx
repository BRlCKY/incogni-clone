type InputCompProps = React.ComponentProps<"input">;

const baseInputClassName =
    "h-[50px] w-full bg-transparent outline-[1.5px] outline-white focus-visible:outline-[3px] rounded-full px-5 text-white placeholder:text-gray-400 outline-none border-transparent transition-colors duration-200";

const InputComp = ({ className = "", ...props }: InputCompProps) => {
    return <input className={`${baseInputClassName} ${className}`.trim()} {...props} />;
};

export default InputComp;
