const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await CryptoJS.AES.encrypt(
      this.password,
      process.env.PASS_SEC
    ).toString();
  }
});

userSchema.methods.comparePassword = async function (newPassword) {
  const oldPassword = await CryptoJS.AES.decrypt(
    this.password,
    process.env.PASS_SEC
  );
  return newPassword === oldPassword.toString(CryptoJS.enc.Utf8);
};

module.exports = mongoose.model("User", userSchema);
