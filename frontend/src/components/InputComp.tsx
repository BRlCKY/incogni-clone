interface InputCompProps {
    type?: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    value?: string | number;
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

    const type = props.type !== undefined ? props.type : "text";
    const placeholder = props.placeholder !== undefined ? props.placeholder : "";
    const min = props.min !== undefined ? props.min : undefined;
    const max = props.max !== undefined ? props.max : undefined;
    const value = props.value !== undefined ? props.value : undefined;

    return (
        <input 
          className={`rounded-full bg-transparent px-2 outline outline-[1.5px] outline-white transition-[outline-width] duration-75 focus:outline-[3px] focus:outline-white ${props.className}`.trim()}
          style={{ width, height }}
          type={type}
          placeholder={placeholder}
          min={min}
          max={max} 
          value={value}/>
    );
};

export default InputComp;