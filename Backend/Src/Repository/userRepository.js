import { User } from "../Models/User.js";





class UserRepository {

  async createUser(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select("+password");
  }

  async findById(userId) {
    return await User.findById(userId);
  }

  async updatePassword(userId, password) {
    return await User.findByIdAndUpdate(
      userId,
      {
        password,
        passwordChangedAt: new Date(),
      },
      { new: true, runValidators: true }
    );
  }

  async existsByEmail(email) {
    return await User.exists({ email });
  }

  async listUsers({ role, search = "", page = 1, limit = 20 }) {
    const filter = {};
    if (role) filter.role = role;
    if (search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
      ];
    }
    const [users, total] = await Promise.all([
      User.find(filter).select("name email phone role isEmailVerified isActive createdAt")
        .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    return { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateActiveStatus(userId, isActive) {
    return User.findByIdAndUpdate(userId, { $set: { isActive } }, { new: true })
      .select("name email phone role isEmailVerified isActive createdAt").lean();
  }
}

export default new UserRepository();