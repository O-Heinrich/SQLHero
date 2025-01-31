export interface IconProps extends React.SVGProps<SVGSVGElement> {
    fill?: string;
    size?: number;
}

export const ICON_DEFAULT_PROPS = {
    fill: 'currentColor',
    size: 6,
};