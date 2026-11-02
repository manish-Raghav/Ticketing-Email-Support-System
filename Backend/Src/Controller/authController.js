
import AuthService from "../Service/authService.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const result = await AuthService.register({
      name,
      email,
      password,
      phone,
      role,
    });

    return res.status(201).json({
      success: true,
      message: result.message,
      data: result,
    });

  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};


// VERIFY EMAIL OTP
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const result = await AuthService.verifyEmailOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.user,
    });

  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Email verification failed",
    });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await AuthService.login(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });

  } catch (error) {
    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message,
    });
  }
};


// FORGOT PASSWORD
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const result = await AuthService.forgotPassword(email);

    return res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode === 429
        ? error.message
        : "Unable to process password reset request",
    });
  }
};


// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    const result = await AuthService.resetPassword(
      email,
      otp,
      newPassword
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};
