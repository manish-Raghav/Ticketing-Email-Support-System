import crypto from "crypto";

import transporter from "../Config/email.js";
import OtpRepository from "../Repository/OtpRepository.js";
import userRepository from "../Repository/userRepository.js";

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_WAIT_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

const generateOTP = () => crypto.randomInt(100000, 1000000).toString();

const hashOTP = (otp) => {
  if (!process.env.OTP_SECRET) {
    throw new Error("OTP_SECRET is missing from the Backend .env file");
  }

  return crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(String(otp))
    .digest("hex");
};

const compareOTP = (otp, storedHash) => {
  const inputHash = Buffer.from(hashOTP(otp), "hex");
  const savedHash = Buffer.from(storedHash, "hex");

  return (
    inputHash.length === savedHash.length &&
    crypto.timingSafeEqual(inputHash, savedHash)
  );
};

class OtpService {
  async sendOTP(email, purpose, subject, heading) {
    const existingOtp = await OtpRepository.findByEmail(email, purpose);

    if (
      existingOtp?.lastSentAt &&
      Date.now() - new Date(existingOtp.lastSentAt).getTime() < OTP_RESEND_WAIT_MS
    ) {
      const error = new Error("Please wait 60 seconds before requesting another OTP");
      error.statusCode = 429;
      throw error;
    }

    const otp = generateOTP();
    const otpHash = hashOTP(otp);

    // Save the OTP first so a delivered code is always verifiable.
    await OtpRepository.createOrUpdate(
      email,
      {
        otpHash,
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
        attempts: 0,
        lastSentAt: new Date(),
      },
      purpose
    );

    try {
      await transporter.sendMail({
        from: `\"Ticket Support\" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: `
          <div style=\"font-family:Arial,sans-serif;padding:20px\">
            <h2>${heading}</h2>
            <p>Your one-time password is:</p>
            <h1 style=\"letter-spacing:8px\">${otp}</h1>
            <p>This code expires in 5 minutes.</p>
            <p>Do not share this code with anyone.</p>
          </div>
        `,
      });
    } catch (error) {
      await OtpRepository.deleteByEmail(email, purpose);
      throw new Error(`Unable to send OTP email: ${error.message}`);
    }
  }

  async sendEmailVerificationOTP(email) {
    return this.sendOTP(
      email,
      "email_verification",
      "Email Verification OTP",
      "Verify Your Email"
    );
  }

  async sendPasswordResetOTP(email) {
    const user = await userRepository.findByEmail(email);

    // Avoid revealing whether an email address has an account.
    if (!user) return;

    return this.sendOTP(
      email,
      "forgot_password",
      "Password Reset OTP",
      "Reset Your Password"
    );
  }

  async verifyOTP(email, enteredOTP, purpose = "forgot_password") {
    if (!/^\d{6}$/.test(String(enteredOTP))) {
      throw new Error("Please enter a valid 6-digit OTP");
    }

    const otpRecord = await OtpRepository.findByEmail(email, purpose);

    if (!otpRecord) {
      throw new Error("OTP not found. Please request a new OTP");
    }

    if (otpRecord.expiresAt <= new Date()) {
      await OtpRepository.deleteById(otpRecord._id);
      throw new Error("OTP has expired");
    }

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await OtpRepository.deleteById(otpRecord._id);
      throw new Error("Maximum OTP attempts exceeded. Please request a new OTP");
    }

    if (!compareOTP(enteredOTP, otpRecord.otpHash)) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new Error("Invalid OTP");
    }

    return otpRecord;
  }
}

export default new OtpService();
