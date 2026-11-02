
import bcrypt from "bcryptjs";

import userRepository from "../Repository/userRepository.js";
import OtpRepository from "../Repository/OtpRepository.js";
import pendingRegistrationRepository from "../Repository/pendingRegistrationRepository.js";
import OtpService from "./otpService.js";
import generateToken from "../utils/generateTokens.js";
import validatePassword from "../utils/passwordValidator.js";

class AuthService {

  // REGISTER: save details temporarily; do not create a User until OTP verification.
  async register(userData) {
    const { name, email, password, phone, role } = userData;

    if (!name?.trim() || !email?.trim() || !password) {
      throw new Error("Name, email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Keep the role selected by the user, but never allow public admin creation.
    // Admin accounts must be created by an existing administrator.
    const selectedRole = (role || "customer").trim().toLowerCase();
    const allowedRegistrationRoles = ["customer", "support_agent"];

    if (!allowedRegistrationRoles.includes(selectedRole)) {
      throw new Error(
        "Please choose a valid role: customer or support_agent. Admin accounts must be created by an administrator."
      );
    }

    const existingUser = await userRepository.existsByEmail(normalizedEmail);

    if (existingUser) {
      throw new Error("Email already registered. Please log in.");
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      throw new Error(passwordError);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pendingRegistrationRepository.createOrUpdate({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || null,
      role: selectedRole,
    });

    await OtpService.sendEmailVerificationOTP(normalizedEmail);

    return {
      message: "Verification OTP sent. Your account will be created after email verification.",
      email: normalizedEmail,
      role: selectedRole,
      registrationPending: true,
    };
  }

  // LOGIN
  async login(email, password) {

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isEmailVerified) {
      throw new Error("Please verify your email before logging in");
    }

    if (!user.isActive) {
      throw new Error("Your account is inactive");
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    };
  }

  // VERIFY EMAIL OTP: create the permanent User only after a valid OTP.
  async verifyEmailOTP(email, otp) {
    const normalizedEmail = email.trim().toLowerCase();

    const pendingRegistration = await pendingRegistrationRepository.findByEmail(
      normalizedEmail
    );

    if (!pendingRegistration) {
      throw new Error("Registration not found or expired. Please register again.");
    }

    if (pendingRegistration.expiresAt <= new Date()) {
      await pendingRegistrationRepository.deleteByEmail(normalizedEmail);
      await OtpRepository.deleteByEmail(normalizedEmail, "email_verification");
      throw new Error("Registration has expired. Please register again.");
    }

    const existingUser = await userRepository.existsByEmail(normalizedEmail);
    if (existingUser) {
      await pendingRegistrationRepository.deleteByEmail(normalizedEmail);
      await OtpRepository.deleteByEmail(normalizedEmail, "email_verification");
      throw new Error("Email already registered. Please log in.");
    }

    const otpRecord = await OtpService.verifyOTP(
      normalizedEmail,
      otp,
      "email_verification"
    );

    const user = await userRepository.createUser({
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      password: pendingRegistration.password,
      phone: pendingRegistration.phone,
      role: pendingRegistration.role || "customer",
      isEmailVerified: true,
      isActive: true,
    });

    await Promise.all([
      pendingRegistrationRepository.deleteByEmail(normalizedEmail),
      OtpRepository.deleteById(otpRecord._id),
    ]);

    return {
      message: "Email verified and account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  // FORGOT PASSWORD
  async forgotPassword(email) {

    const normalizedEmail = email.trim().toLowerCase();

    await OtpService.sendPasswordResetOTP(normalizedEmail);

    return {
      message: "If the account exists, a reset OTP will be sent",
    };
  }

  // RESET PASSWORD
  async resetPassword(email, otp, newPassword) {

    const normalizedEmail = email.trim().toLowerCase();

    const passwordError = validatePassword(newPassword);

    if (passwordError) {
      throw new Error(passwordError);
    }

    const otpRecord = await OtpService.verifyOTP(
      normalizedEmail,
      otp
    );

    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new Error("User not found");
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      throw new Error("New password must be different from old password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await userRepository.updatePassword(
      user._id,
      hashedPassword
    );

    await OtpRepository.deleteById(otpRecord._id);

    return {
      message: "Password reset successfully",
    };
  }
}

export default new AuthService();