import jwt from "jsonwebtoken";
import{ User} from "../Models/User.js";
// import User from "../Models/User.js";
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token required",
      });
    } 

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive || !user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: "User not authorized or email not verified",
      });
    }

    // Prevent old tokens from working after password changes
    if (
      user.passwordChangedAt &&
      decoded.iat * 1000 < user.passwordChangedAt.getTime()
    ) {
      return res.status(401).json({
        success: false,
        message: "Password changed. Please log in again",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

// export default protect;