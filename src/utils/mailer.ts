import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: env.GMAIL,
        pass: env.PASSWORD,
    },
});

export const sendVerificationEmail = async (
    to: string,
    token: string,
): Promise<void> => {
    const verifyUrl = `${env.CLIENT_URL}/auth/confirm-email/${token}`;
    await transporter.sendMail({
        from: `"DevBlog" <${env.GMAIL}>`,
        to,
        subject: 'Verify your DevBlog email address',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to DevBlog!</h2>
            <p>Please verify your email address by clicking the button below.</p>
            <p>This link expires in <strong>24 hours</strong>.</p>
            <a href="${verifyUrl}"
            style="display: inline-block; padding: 12px 24px; background-color: #4F46E5;
                    color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Verify Email
            </a>
            <p>Or copy this link:<br/><a href="${verifyUrl}">${verifyUrl}</a></p>
            <p>If you didn't create an account, ignore this email.</p>
        </div>
        `,
    });
};
