interface PasswordResetEmailOptions {
  to: string;
  resetUrl: string;
  businessName: string;
}

export async function sendPartnerPasswordResetEmail({ to, resetUrl, businessName }: PasswordResetEmailOptions) {
  if (process.env.RESEND_API_KEY) {
    try {
      // @ts-ignore — resend is an optional runtime dependency
      const { Resend } = await import(/* webpackIgnore: true */ 'resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.EMAIL_FROM || 'Wanderbook Canarias <noreply@wanderbookcanarias.com>';
      await resend.emails.send({
        from,
        to,
        subject: 'Reset your Wanderbook partner password',
        html: `
          <p>Hi ${businessName},</p>
          <p>You requested a password reset for your Wanderbook Canarias partner account.</p>
          <p><a href="${resetUrl}">Click here to reset your password</a></p>
          <p>This link expires in 1 hour.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        `,
      });
      return;
    } catch (err) {
      console.error('[send-partner-email] Resend failed:', err);
    }
  }

  // Fallback: log reset URL so developer can test without email configured
  console.log('========================================');
  console.log('[partner-password-reset] Email not configured. Reset URL:');
  console.log(resetUrl);
  console.log('========================================');
}
