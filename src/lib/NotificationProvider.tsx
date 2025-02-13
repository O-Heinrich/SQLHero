import clsx from "clsx";
import { ReactElement, ReactNode, useEffect, useState, useContext } from "react";
import { AnimatePresence, motion } from "motion/react"
import { NotificationContext, NotificationType } from "./NotificationContext";
import { Exclamation } from "@/components/icons";
import { NotNotificationTypeError } from "./errors";

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
const Notification: React.FC<{children: ReactNode, active: boolean}> = ({children, active}): ReactElement => {
    const { toggle } = useContext(NotificationContext);

    useEffect(() => {
        if (!active) return;
        const timeout = setTimeout(toggle, 5000);
        return () => clearTimeout(timeout);
    }, [active, toggle]);

    return (
        <AnimatePresence initial={false}>
            {
                active &&
                <motion.div 
                    className={clsx('fixed items-center gap-4 bottom-0 right-0 m-4 p-4 text-white rounded-md border-1 border-red-400 shadow-xl inner-shadow-sm inner-shadow-white/30 bg-red-800/40 backdrop-blur-lg flex flex-row')}
                    initial={{ opacity: 0, translateY: 100, scale: 0.5 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    exit={{ opacity: 0, translateY: 100, scale: 0.5 }}
                    key="box"
                >
                    {children}
                </motion.div>
            }
        </AnimatePresence>
    )
};

/**
 * NotificationIcon component that displays an icon based on the notification type.
 * 
 * @param {Object} props - The properties object.
 * @param {NotificationType} props.type - The type of notification.
 * 
 * @returns {ReactElement} The rendered notification icon component.
 * 
 * @example
 * ```tsx
 * <NotificationIcon type={NotificationType.INFO} />
 * ```
 */
const NotificationIcon = ({ type }: { type: NotificationType }): ReactElement => {
    switch (type) {
        case NotificationType.INFO:
            return <>(I) </>;
        case NotificationType.WARNING:
            return <Exclamation fill="#64ff67" size={2} />;
        case NotificationType.ERROR:
            return <Exclamation fill="#ff6467" size={2} />;
        default:
            throw new NotNotificationTypeError(`Invalid notification type: ${type}`);
    }
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
    const [msg, setMsg] = useState<{message: string, type: NotificationType}>({ message: '', type: NotificationType.INFO });
    const [active, setActive] = useState(false);
    const notify = (message: string, type?: NotificationType) => {
        setActive(() => true);
        setMsg(() => ({ message, type: type ?? NotificationType.INFO }))
    };
    return (
        <NotificationContext.Provider value={{ notify, toggle: () => setActive((prev) => !prev) }}>
            {children}
            <Notification active={active}>
                <NotificationIcon type={msg.type} />
                {' '}
                {msg.message}
            </Notification>
        </NotificationContext.Provider>
    );
};