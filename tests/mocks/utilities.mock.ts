import { jest } from '@jest/globals';

export const sendVerificationEmailMock = jest.fn();
export const sendEmailMock = jest.fn();
export const sendPasswordChangeConfirmationEmailMock = jest.fn();
export const sendPasswordChangedNotificationMock = jest.fn();

export const mailerMock = {
    sendVerificationEmail: sendVerificationEmailMock,
    sendEmail: sendEmailMock,
    sendPasswordChangeConfirmationEmail:
        sendPasswordChangeConfirmationEmailMock,
    sendPasswordChangedNotification: sendPasswordChangedNotificationMock,
};

export function resetAllUtilityMocks(): void {
    sendVerificationEmailMock.mockReset();
    sendEmailMock.mockReset();
    sendPasswordChangeConfirmationEmailMock.mockReset();
    sendPasswordChangedNotificationMock.mockReset();
}
