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
//FIXME: template banate hbe
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

export const sendPasswordChangeEmail = async (
    to: string,
    token: string,
): Promise<void> => {
    const changePasswordUrl = `${env.CLIENT_URL}/auth/confirm-password-change/${token}`;

    await transporter.sendMail({
        from: `"DevBlog" <${env.GMAIL}>`,
        to,
        subject: 'Change your DevBlog password',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

            <h2>Password Change Request</h2>

            <p>
                We received a request to change your DevBlog password.
            </p>

            <p>
                Click the button below to continue:
            </p>

            <a href="${changePasswordUrl}"
            style="display: inline-block; padding: 12px 24px; 
                    background-color: #4F46E5;
                    color: white; 
                    text-decoration: none; 
                    border-radius: 4px;
                    margin: 16px 0;">
                Change Password
            </a>

            <p>
                Or copy this link:
                <br/>
                <a href="${changePasswordUrl}">
                    ${changePasswordUrl}
                </a>
            </p>

            <p>
                This link expires in <strong>15 minutes</strong>.
            </p>

            <p>
                If you did not request this change, ignore this email.
            </p>

        </div>
        `,
    });
};

export const sendPasswordChangedNotification = async (
    to: string,
): Promise<void> => {
    await transporter.sendMail({
        from: `"DevBlog" <${env.GMAIL}>`,
        to,
        subject: 'Your DevBlog password was changed',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

            <h2>Password Changed Successfully</h2>

            <p>
                Your DevBlog password has been changed successfully.
            </p>

            <p>
                If you did not perform this action, please contact support immediately.
            </p>

        </div>
        `,
    });
};
