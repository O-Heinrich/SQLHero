import clsx from "clsx";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react"
import { NotificationContext } from "./NotificationContext";

/**
 * Notification component that displays a notification message with animation.
 * 
 * @param {Object} props - The properties object.
 * @param {ReactNode} props.children - The content to be displayed inside the notification.
 * 
 * @returns {ReactElement} The rendered notification component.
 * 
 * @example
 * ```tsx
 * <Notification>
 *   <p>Your changes have been saved!</p>
 * </Notification>
 * ```
 * 
 * The notification will appear with an animation and disappear after 5 seconds.
 */
const Notification: React.FC<{children: ReactNode}> = ({children}): ReactElement => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (children) {
            setIsVisible(() => true);
            const timeout = setTimeout(() => setIsVisible(() => false), 5000);
            return () => clearTimeout(timeout);
        }
    }, [children])

    return (
        <AnimatePresence initial={false}>
            {isVisible &&
            <motion.div 
                className={clsx('fixed bottom-0 right-0 m-4 p-4 text-white rounded-md border-1 border-red-400 shadow-xl bg-red-800/40 backdrop-blur-lg')}
                initial={{ opacity: 0, translateY: 100, scale: 0.5 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                exit={{ opacity: 0, translateY: 100, scale: 0.5 }}
                key="box"
            >
                {children}
            </motion.div>}
        </AnimatePresence>
    )
};

/**
 * NotificationProvider component that provides notification context to its children.
 *
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The child components that will receive the notification context.
 * @returns {ReactElement} The NotificationProvider component with notification context.
 *
 * @example
 * ```tsx
 * <NotificationProvider>
 *   <YourComponent />
 * </NotificationProvider>
 * ```
 *
 * @remarks
 * This component uses React's Context API to provide a notification system.
 * It maintains a message state and provides a `notify` function to update the message.
 */
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }): ReactElement => {
    const [message, setMessage] = useState<string>('');
    const notify = (message: string) => setMessage(() => message);
    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <Notification>{message}</Notification>
        </NotificationContext.Provider>
    );
};