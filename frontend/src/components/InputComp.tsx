interface InputCompProps {
    type?: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    placeholder?: string;
    min?: number;
    max?: number;
}

const InputComp = (props: InputCompProps) => {
    const width =
        props.width !== undefined
            ? typeof props.width === "number"
                ? `${props.width}px`
                : props.width
            : "100px";

    const height =
        props.height !== undefined
            ? typeof props.height === "number"
                ? `${props.height}px`
                : props.height
            : "50px";

    return (
        <input 
          className={`bg-transparent rounded-full outline-white outline-[1.5px] focus-visible:outline-[3px] text-right p-2 ${props.className}`.trim()}
          style={{ width, height }}
          {...props} />
    );
};

export default InputComp;