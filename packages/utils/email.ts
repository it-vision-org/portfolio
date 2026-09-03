import { Resend } from "resend";

const BRAND = "Ahmed Zouaghi";
const FROM = "Ahmed Zouaghi <onboarding@resend.dev>";
const ACCENT = "#0b63f6";
const ACCENT_DARK = "#06245c";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is missing");
  return new Resend(apiKey);
}

function shell(title: string, inner: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f3f0ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f0ff;">
    <tr><td style="padding:40px 20px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;box-shadow:0 8px 32px rgba(31,38,135,0.12);overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,${ACCENT_DARK},${ACCENT} 60%,#4f94ff);padding:32px 40px;">
          <div style="font-size:22px;font-weight:800;color:#ffffff;">${title}</div>
        </td></tr>
        <tr><td style="padding:32px 40px;color:#0b1b33;font-size:15px;line-height:1.6;">${inner}</td></tr>
        <tr><td style="background:#f3f0ff;padding:18px 40px;text-align:center;font-size:12px;color:#5b6b85;border-top:1px solid #dce6f7;">
          <strong style="color:${ACCENT_DARK};">${BRAND}</strong> · Software Developer
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/resetPassword?token=${token}`;
  const inner = `
    <p style="margin:0 0 20px;">We received a request to reset your <strong>${BRAND}</strong> backoffice password.</p>
    <p style="text-align:center;margin:0 0 28px;">
      <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,${ACCENT},#4f94ff);color:#fff;text-decoration:none;font-weight:700;padding:14px 36px;border-radius:12px;">Reset Password</a>
    </p>
    <p style="margin:0;font-size:13px;color:#5b6b85;">This link expires in <strong>1 hour</strong>. If you didn't request this, you can ignore this email.</p>`;

  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `Reset your ${BRAND} password`,
    html: shell("Reset Your Password", inner),
  });
}

export async function sendContactFormEmail({
  recipient,
  name,
  email,
  subject,
  message,
}: {
  recipient: string | string[];
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const displaySubject = subject?.trim() || "New message";
  const inner = `
    <p style="margin:0 0 6px;"><strong>Name:</strong> ${name}</p>
    <p style="margin:0 0 6px;"><strong>Email:</strong> ${email}</p>
    <p style="margin:0 0 16px;"><strong>Subject:</strong> ${displaySubject}</p>
    <div style="padding:18px;border:1px solid #dce6f7;border-radius:12px;background:#f3f0ff;white-space:pre-line;">${message}</div>
    <p style="margin:20px 0 0;">
      <a href="mailto:${email}?subject=Re: ${encodeURIComponent(displaySubject)}" style="display:inline-block;background:linear-gradient(135deg,${ACCENT},#4f94ff);color:#fff;text-decoration:none;font-weight:700;padding:12px 28px;border-radius:12px;">Reply to ${name.split(" ")[0]}</a>
    </p>`;

  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to: recipient,
    replyTo: email,
    subject: `[Portfolio] ${displaySubject} — from ${name}`,
    html: shell(`New Contact — ${displaySubject}`, inner),
  });
}
