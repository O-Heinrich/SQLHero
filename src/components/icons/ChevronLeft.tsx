import { ICON_DEFAULT_PROPS, IconProps } from "./IconProps";

export const ChevronLeft: React.FC<IconProps> = ({
    fill = ICON_DEFAULT_PROPS.fill,
    size = ICON_DEFAULT_PROPS.size,
}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={fill} className={`size-${size}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);