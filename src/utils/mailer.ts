import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { baseEmailTemplate, emailButton, emailLinkFallback } from './emailTemplate';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: env.GMAIL,
        pass: env.MAIL_PASSWORD,
    },
});
//FIXME: template banate hbe
export const sendVerificationEmail = async (
    to: string,
    token: string,
): Promise<void> => {
    const verifyUrl = `${env.CLIENT_URL}/auth/confirm-email/${token}`;

    const html = baseEmailTemplate(
        'Welcome to DevBlog!',
        `
        <p>Please verify your email address by clicking the button below.</p>
        <p>This link expires in <strong>5 minutes</strong>.</p>
        ${emailButton(verifyUrl, 'Verify Email')}
        ${emailLinkFallback(verifyUrl)}
        <p>If you didn't create an account, ignore this email.</p>
        `,
    );

    await transporter.sendMail({
        from: `"DevBlog" <${env.GMAIL}>`,
        to,
        subject: 'Verify your DevBlog email address',
        html,
    });
};

export const sendPasswordChangeEmail = async (
    to: string,
    token: string,
): Promise<void> => {
    const changePasswordUrl = `${env.CLIENT_URL}/auth/confirm-password-change/${token}`;

    const html = baseEmailTemplate(
        'Password Change Request',
        `
        <p>We received a request to change your DevBlog password.</p>
        <p>Click the button below to continue:</p>
        ${emailButton(changePasswordUrl, 'Change Password')}
        ${emailLinkFallback(changePasswordUrl)}
        <p>This link expires in <strong>5 minutes</strong>.</p>
        <p>If you did not request this change, ignore this email.</p>
        `,
    );

    await transporter.sendMail({
        from: `"DevBlog" <${env.GMAIL}>`,
        to,
        subject: 'Change your DevBlog password',
        html,
    });
};

export const sendPasswordChangedNotification = async (
    to: string,
): Promise<void> => {
    const html = baseEmailTemplate(
        'Password Changed Successfully',
        `
        <p>Your DevBlog password has been changed successfully.</p>
        <p>If you did not perform this action, please contact support immediately.</p>
        `,
    );

    await transporter.sendMail({
        from: `"DevBlog" <${env.GMAIL}>`,
        to,
        subject: 'Your DevBlog password was changed',
        html,
    });
};