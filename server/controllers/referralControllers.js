const Referral = require("../models/Referral");
const AppError = require("../utils/AppError");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createReferral = catchAsyncError(async (req, res, next) => {
  const { address, ref_code, is_manager_code } = req.body;

  const count = await Referral.countDocuments({
    address,
  });

  if (count >= 10) {
    return next(new AppError("Maximum referral limit reached"));
  }

  const existingReferralCode = await Referral.findOne({ ref_code });

  if (existingReferralCode) {
    return next(new AppError("Refarral code already exist"));
  }

  const referral = await Referral.create({
    address,
    ref_code,
    is_manager_code,
  });

  res.status(201).json(referral);
});
