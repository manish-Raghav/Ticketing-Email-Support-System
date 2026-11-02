import Otp from "../Models/Otp.js";

class OtpRepository {
  async createOrUpdate(email, otpData, purpose = "forgot_password") {
    return Otp.findOneAndUpdate(
      { email, purpose },
      { $set: { ...otpData, purpose } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  async findByEmail(email, purpose = "forgot_password") {
    return Otp.findOne({ email, purpose });
  }

  async deleteByEmail(email, purpose = "forgot_password") {
    return Otp.deleteOne({ email, purpose });
  }

  async deleteById(id) {
    return Otp.deleteOne({ _id: id });
  }
}

export default new OtpRepository();
