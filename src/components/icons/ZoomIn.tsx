import { ICON_DEFAULT_PROPS, IconProps } from "./IconProps";

export const ZoomInIcon: React.FC<IconProps> = ({
    fill = ICON_DEFAULT_PROPS.fill,
    size = ICON_DEFAULT_PROPS.size,
}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={`${size}rem`} height={`${size}rem`} strokeWidth={1.5} stroke={fill}>
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Zm8.25-3.75a.75.75 0 0 1 .75.75v2.25h2.25a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0v-2.25H7.5a.75.75 0 0 1 0-1.5h2.25V7.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);