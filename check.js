require('dotenv').config();
const mongoose = require('mongoose');
const dbConnect = require('./DB/db');
const Payment = require('./model/payment');

async function check() {
  await dbConnect();
  const payment = await Payment.findOne({ order_code: 1791561223023676 });
  console.log(payment);
  process.exit(0);
}
check();
