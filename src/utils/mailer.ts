import Mailjet from 'node-mailjet';
import { env } from '../config/env';
import { baseEmailTemplate, emailButton, escapeHtml } from './emailTemplate';

const mailjet = Mailjet.apiConnect(env.MAILJET_API_KEY, env.MAILJET_SECRET_KEY);

type SendMailParams = {
    to: string;
    subject: string;
    html: string;
};

const sendMail = async ({
    to,
    subject,
    html,
}: SendMailParams): Promise<void> => {
    await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: env.GMAIL,
                    Name: 'DevBlog',
                },
                To: [{ Email: to }],
                Subject: subject,
                HTMLPart: html,
            },
        ],
    });
};

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
        
        <p>If you didn't create an account, ignore this email.</p>
        `,
    );

    await sendMail({
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
        
        <p>This link expires in <strong>${env.PASSWORD_JWT_EXPIRATION}</strong>.</p>
        <p>If you did not request this change, ignore this email.</p>
        `,
    );

    await sendMail({
        to,
        subject: 'Change your DevBlog password',
        html,
    });
};

export const sendNewsletterConfirmationEmail = async (
    to: string,
    token: string,
): Promise<void> => {
    const confirmUrl = `${env.CLIENT_URL}/newsletter/confirm/${token}`;

    const html = baseEmailTemplate(
        'Confirm your subscription',
        `
        <p>Thanks for subscribing to the DevBlog newsletter!</p>
        <p>Click the button below to confirm your email and start getting new stories in your inbox.</p>
        ${emailButton(confirmUrl, 'Confirm Subscription')}

        <p>If you didn't request this, you can safely ignore this email.</p>
        `,
    );

    await sendMail({
        to,
        subject: 'Confirm your DevBlog newsletter subscription',
        html,
    });
};

export const sendNewStoryNotificationEmail = async (
    to: string,
    story: { title: string; summary: string | null; storyId: string },
    unsubscribeToken: string,
): Promise<void> => {
    const storyUrl = `${env.CLIENT_URL}/stories/${story.storyId}`;
    const unsubscribeUrl = `${env.CLIENT_URL}/newsletter/unsubscribe/${unsubscribeToken}`;

    const html = baseEmailTemplate(
        'New story on DevBlog',
        `
        <h3 style="margin-bottom: 4px;">${escapeHtml(story.title)}</h3>
        ${story.summary ? `<p style="color: #6b7280;">${escapeHtml(story.summary)}</p>` : ''}
        ${emailButton(storyUrl, 'Read the story')}

        <p style="font-size: 12px; color: #6b7280; margin-top: 24px;">
            Don't want these emails? <a href="${unsubscribeUrl}" style="color: #6b7280;">Unsubscribe</a>
        </p>
        `,
    );

    await sendMail({
        to,
        subject: `New story: ${story.title}`,
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

    await sendMail({
        to,
        subject: 'Your DevBlog password was changed',
        html,
    });
};
