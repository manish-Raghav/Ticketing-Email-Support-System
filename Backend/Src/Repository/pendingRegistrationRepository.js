import PendingRegistration from "../Models/PendingRegistration.js";

class PendingRegistrationRepository {
  async createOrUpdate(registrationData) {
    const { email, ...data } = registrationData;

    return PendingRegistration.findOneAndUpdate(
      { email },
      {
        $set: {
          ...data,
          email,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).select("+password");
  }

  async findByEmail(email) {
    return PendingRegistration.findOne({ email })
      .select("+password");
  }

  async deleteByEmail(email) {
    return PendingRegistration.deleteOne({ email });
  }
}

export default new PendingRegistrationRepository();
