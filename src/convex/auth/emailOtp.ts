import { Email } from "@convex-dev/auth/providers/Email";

export const emailOtp = Email({
  id: "email-otp",
  sendVerificationRequest: async ({ identifier, token }) => {
    console.log(
      `Verification code for ${identifier}: ${token}`,
    );
  },
});