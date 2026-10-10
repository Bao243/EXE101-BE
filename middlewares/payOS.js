const { PayOS } = require("@payos/node");

module.exports = function verifyPayOSSignature(req, res, next) {
  try {
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY;
    if (!checksumKey) {
      console.warn("[PayOS] Missing PAYOS_CHECKSUM_KEY env.");
      return next();
    }

    const payOS = new PayOS(
      process.env.PAYOS_CLIENT_ID || "dummy",
      process.env.PAYOS_API_KEY || "dummy",
      process.env.PAYOS_CHECKSUM_KEY
    );

    // Dùng SDK chính thức của PayOS để xác thực chữ ký (tự động sort field và check HMAC)
    const webhookData = payOS.verifyPaymentWebhookData(req.body);
    
    // Nếu thành công, có thể gán data vào req để controller dùng (tuỳ chọn)
    req.payosData = webhookData;
    
    return next();
  } catch (e) {
    console.warn("[PayOS] Signature verification error:", e?.message);
    return res.status(401).json({ success: false, message: "Invalid PayOS signature", error: e?.message });
  }
};
