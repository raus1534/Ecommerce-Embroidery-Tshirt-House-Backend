const mongoose = require("mongoose");

const newsLetterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Newsletter", newsLetterSchema);
