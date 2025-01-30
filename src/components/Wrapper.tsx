import React from "react";
import clsx from "clsx";

interface WrapperProps extends React.PropsWithChildren {
    className?: string;
}

export const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
    // I think this is not necessary anymore in React v19. The compiler should be able to handle 
    // this case pretty well. But I'm not sure. I have to test it.
    const classes = React.useMemo(() => className?.split(' ') || [], [className]);

    return (
        <div className={clsx('max-w-7xl', 'py-4', 'xl:px-2', 'px-8', 'mx-auto', ...classes)}>
            {children}
        </div>
    );
};