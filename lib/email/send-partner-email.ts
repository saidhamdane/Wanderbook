import nodemailer from 'nodemailer';

interface PasswordResetEmailOptions {
  to: string;
  resetUrl: string;
  businessName: string;
}

const subject = 'Reset your Wanderbook Canarias password';

function buildHtml(businessName: string, resetUrl: string) {
  return `
    <p>Hello,</p>
    <p>You requested a password reset for your Wanderbook Canarias partner account.</p>
    <p><a href="${resetUrl}">Click here to reset your password</a></p>
    <p>This link expires in 1 hour.</p>
    <p>If you did not request this, you can ignore this email.</p>
  `;
}

function buildText(resetUrl: string) {
  return [
    'Hello,',
    'You requested a password reset for your Wanderbook Canarias partner account.',
    '',
    'Click here to reset your password:',
    resetUrl,
    '',
    'This link expires in 1 hour.',
    'If you did not request this, you can ignore this email.',
  ].join('\n');
}

export async function sendPartnerPasswordResetEmail({
  to,
  resetUrl,
  businessName,
}: PasswordResetEmailOptions) {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const from = process.env.EMAIL_FROM || 'Wanderbook Canarias <info@wanderbookcanarias.com>';
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 465,
        secure: SMTP_SECURE !== 'false',
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transporter.sendMail({
        from,
        to,
        subject,
        text: buildText(resetUrl),
        html: buildHtml(businessName, resetUrl),
      });

      console.log(`[partner-password-reset] Password reset email sent to ${to}`);
      return;
    } catch (err) {
      console.error('[send-partner-email] SMTP send failed:', err);
    }
  }

  // Fallback: log reset URL so the flow can be tested without email configured
  console.log('========================================');
  console.log('[partner-password-reset] Email not configured. Reset URL:');
  console.log(resetUrl);
  console.log('========================================');
}
