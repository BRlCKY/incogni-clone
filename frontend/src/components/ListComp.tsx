import GlassComp from "./GlassComp";
import { getAccessibleClickProps } from "../utils/accessibility";

interface ListCompProps {
  height: number;
  title: string;
  text1?: string;
  text2?: string;
  text3?: string;
  circleColorClass?: string;
  onItemClick?: () => void;
  ariaLabel?: string;
}

const ListComp = (props: ListCompProps) => {
    const diameter = props.height - 6;
    const isClickable = typeof props.onItemClick === "function";

    return (
        <GlassComp
            width="100%"
            height={props.height}
            borderRadius={9999}
            isHoverable={isClickable}
            tintOpacity={0.5}
            className={`w-full flex items-center ${isClickable ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" : ""}`.trim()}
            onClick={props.onItemClick}
            {...(isClickable
                ? getAccessibleClickProps(props.onItemClick, {
                      label: props.ariaLabel ?? `Eintrag oeffnen: ${props.title}`,
                  })
                : {})}
        >
            <div
                className={`${props.circleColorClass ? props.circleColorClass : "bg-white"} rounded-full relative left-[-6px] flex-shrink-0`}
                style={{ width: `${diameter}px`, height: `${diameter}px` }}
                />
            <div className="flex justify-end ml-3 w-full">
                <p className="font-bold min-w-[200px] max-[500px]:flex-1 max-[500px]:min-w-[100px] truncate">{props.title}</p>
                <p className="ml-2 text-gray-400 flex-1 truncate max-[500px]:hidden">{props.text1}</p>
                <p className="mx-[10px] text-gray-400">{props.text2} {props.text3}</p>
            </div>
        </GlassComp>
    );
};

export default ListComp;