export const logger = {
    error: (message: string, meta?: Record<string, unknown>) => {
        console.error(
            JSON.stringify({
                level: 'error',
                message,
                timeStamp: new Date().toISOString(),
                ...meta,
            }),
        );
    },
    warn: (message: string, meta?: Record<string, unknown>) => {
        console.warn(
            JSON.stringify({
                level: 'warn',
                message,
                timeStamp: new Date().toISOString(),
                ...meta,
            }),
        );
    },
};
