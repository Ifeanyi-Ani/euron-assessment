const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "Provide a wallet address"],
      lowercase: true,
      unique: true,
    },
    ref_code: {
      type: String,
      required: [true, "Provide a referralCode"],
      unique: [true, "Code already exists"],
    },
    is_manager_code: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

const Referral = mongoose.model("Referral", referralSchema);

module.exports = Referral;
