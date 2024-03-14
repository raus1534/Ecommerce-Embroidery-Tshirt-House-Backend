const crypto = require("crypto");
exports.createSignature = (message) => {
  const signature = "8gBm/:&EnhH.1/q";
  const hmac = crypto.createHmac("sha256", signature);
  hmac.update(message);
  const base64Format = hmac.digest("base64");
  return base64Format;
};

exports.generateRandomString = () => {
  const length = 3; // Length of the random string
  let result = "COD"; // Prefix for the transaction code
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
