require('dotenv').config();
const mongoose = require('mongoose');
const dbConnect = require('./DB/db');
const Payment = require('./model/payment');
const User = require('./model/user');
const Noti = require('./controller/NotificationController');

async function fix() {
  await dbConnect();
  const code = 1791561223023676;
  const payment = await Payment.findOne({ order_code: code });
  if (!payment) return console.log("Khong tim thay don hang");
  
  if (payment.status !== "paid") {
    payment.status = "paid";
    await payment.save();

    let extraDays = 0;
    if (payment.premium_package_type === "monthly") extraDays = 33;
    if (payment.premium_package_type === "trial") extraDays = 3;

    const user = await User.findById(payment.user_id);
    if (user) {
        user.premiumMembership = true;
        const now = new Date();
        const currentExp = user.premiumMembershipExpires && user.premiumMembershipExpires > now
          ? user.premiumMembershipExpires
          : now;
        currentExp.setDate(currentExp.getDate() + extraDays);
        user.premiumMembershipExpires = currentExp;
        await user.save();
        console.log("Da nang cap Premium cho user:", user.email);
    }
  } else {
    console.log("Don hang da duoc xu ly tu truoc");
  }
  process.exit(0);
}
fix();
