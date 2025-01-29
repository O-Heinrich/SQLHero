import React from "react";
import clsx from "clsx";

interface WrapperProps extends React.PropsWithChildren {
    size?: string;
    className?: string;
}

export const Wrapper: React.FC<WrapperProps> = ({ size, children, className }) => {
    // I think this is not necessary anymore in React v19. The compiler should be able to handle 
    // this case pretty well. But I'm not sure. I have to test it.
    const classes = React.useMemo(() => className?.split(' ') || [], [className]);
    const maxSize = React.useMemo(() => `max-w-${size || '7xl'}`, [size]);

    return (
        <div className={clsx('py-4', 'xl:px-2', 'px-8', 'mx-auto', maxSize, ...classes)}>
            {children}
        </div>
    );
};