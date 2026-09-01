import { Email } from "@convex-dev/auth/providers/Email";
import { Resend } from "resend";

export const emailOtp = Email({
  id: "email-otp",

  // Generate a cryptographically secure 6-digit code instead of the
  // default 32-character alphanumeric string.
  async generateVerificationToken() {
    const digits = new Uint8Array(6);
    crypto.getRandomValues(digits);
    let code = "";
    for (const d of digits) {
      code += (d % 10).toString();
    }
    return code;
  },

  async sendVerificationRequest({ identifier, token }) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY in the Convex deployment.");
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: identifier,
      subject: "Your sonar/match verification code",
      text: `Your sonar/match verification code is ${token}. It expires soon.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Your sonar/match verification code</h2>
          <p>Enter this code to continue:</p>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">
            ${token}
          </p>
          <p>This code expires soon. If you did not request it, you can ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  },
});
