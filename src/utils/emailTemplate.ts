const BRAND_NAME = 'DevBlog';
const BRAND_COLOR = '#4F46E5';
const TEXT_COLOR = '#111827';
const MUTED_COLOR = '#6b7280';
const BORDER_COLOR = '#e5e7eb';

export const emailButton = (url: string, label: string): string => `
  <a href="${url}"
     style="display: inline-block; padding: 12px 24px; background-color: ${BRAND_COLOR};
            color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;
            font-family: Arial, sans-serif;">
    ${label}
  </a>
`;

export const emailLinkFallback = (url: string): string => `
  <p style="font-family: Arial, sans-serif; color: ${TEXT_COLOR};">
    Or copy this link:<br/><a href="${url}" style="color: ${BRAND_COLOR};">${url}</a>
  </p>
`;

export const baseEmailTemplate = (title: string, bodyHtml: string): string => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: ${TEXT_COLOR};">
    <h2 style="color: ${TEXT_COLOR}; margin-bottom: 8px;">${title}</h2>
    ${bodyHtml}
    <hr style="border: none; border-top: 1px solid ${BORDER_COLOR}; margin: 24px 0;" />
    <p style="font-size: 12px; color: ${MUTED_COLOR};">
      ${BRAND_NAME} · This is an automated message, please do not reply.
    </p>
  </div>
`;