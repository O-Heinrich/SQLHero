export class NotImplementedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotImplementedError';
    }
}

export class NotNotificationTypeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotNotificationTypeError';
    }
}