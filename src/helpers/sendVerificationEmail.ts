import { resend } from "@/lib/resend";

import verificationEmail from "../../email/verificationEmail";
import { APIResponse } from "@/types/APIResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<APIResponse> {
  try {
    await resend.emails.send({
      from: "mylearning910@gmail.com",
      to: email,
      subject: "Mystry message | Verification code",
      react: verificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email send successfully",
    };
  } catch (error) {
    console.log("Failed to send verification email");
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
