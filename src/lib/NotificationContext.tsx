import { createContext } from 'react';
import { NotImplementedError } from './errors';

export enum NotificationType {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
}

/**
 * ContextType defines the shape of the context object used in NotificationContext.
 * 
 * @typedef {Object} ContextType
 * @property {(message: string) => void} notify - Function to trigger a notification with a given message.
 * @property {React.RefObject<HTMLDivElement>} msgRef - Reference to a HTMLDivElement to display the notification message.
 */
type ContextType = {
    notify: (message: string, type?: NotificationType) => void;
    toggle: () => void;
};
/**
 * NotificationContext is a React context that provides notification functionality.
 * 
 * @constant
 * @type {React.Context<ContextType>}
 * @default
 */
export const NotificationContext = createContext<ContextType>({
    notify: () => {
        throw new NotImplementedError('NotificationContext is not implemented');
    },
    toggle: () => {
        throw new NotImplementedError('NotificationContext is not implemented');
    },
});