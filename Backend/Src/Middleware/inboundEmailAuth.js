import { timingSafeEqual } from "node:crypto";

const inboundEmailAuth = (req, res, next) => {
  const configuredSecret = process.env.INBOUND_EMAIL_WEBHOOK_SECRET;
  const suppliedSecret = req.get("x-inbound-webhook-secret") || "";
  if (!configuredSecret) {
    return res.status(503).json({ success: false, message: "Inbound email webhook is not configured." });
  }
  const expected = Buffer.from(configuredSecret);
  const supplied = Buffer.from(suppliedSecret);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    return res.status(401).json({ success: false, message: "Invalid inbound webhook secret." });
  }
  next();
};
export default inboundEmailAuth;
