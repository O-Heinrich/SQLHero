import { ICON_DEFAULT_PROPS, IconProps } from "./IconProps";

export const Moon: React.FC<IconProps> = ({ 
    fill = ICON_DEFAULT_PROPS.fill, 
    size = ICON_DEFAULT_PROPS.size,
 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" stroke="none" viewBox="0 0 24 24" width={`${size}rem`} height={`${size}rem`} strokeWidth={1.5} fill={fill}>
        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
    </svg>
);
