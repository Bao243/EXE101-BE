/**
 * Script tạo tài khoản admin
 * Chạy: node scripts/createAdmin.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../model/user");

const ADMIN_DATA = {
  username: "admin",
  fullName: "Admin MealMate",
  password: "Admin@123456",
  email: "admin@mealmate.com",
  phoneNumber: "0900000000",
  role: "admin",
  provider: "local",
  gender: "male",
  birthDate: new Date("1990-01-01"),
  job: "Đã đi làm",
};

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công");

    // Kiểm tra đã tồn tại chưa
    const existing = await User.findOne({
      $or: [
        { username: ADMIN_DATA.username },
        { email: ADMIN_DATA.email },
      ],
    });

    if (existing) {
      console.log("⚠️  Tài khoản admin đã tồn tại:", existing.username, "|", existing.email);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(ADMIN_DATA.password, salt);

    const admin = await new User({
      ...ADMIN_DATA,
      password: hashPassword,
    }).save();

    console.log("🎉 Tạo admin thành công!");
    console.log("   Username :", admin.username);
    console.log("   Email    :", admin.email);
    console.log("   Password :", ADMIN_DATA.password);
    console.log("   Role     :", admin.role);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
