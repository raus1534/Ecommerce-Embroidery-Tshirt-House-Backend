const crypto = require("crypto");
exports.createSignature = (message) => {
  const signature = "8gBm/:&EnhH.1/q";
  const hmac = crypto.createHmac("sha256", signature);
  hmac.update(message);
  const base64Format = hmac.digest("base64");
  return base64Format;
};
