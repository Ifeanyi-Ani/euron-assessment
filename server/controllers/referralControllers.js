const Referral = require("../models/Referral");
const AppError = require("../utils/AppError");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createReferral = catchAsyncError(async (req, res, next) => {
  const { address, ref_code, is_manager_code } = req.body;

  if (!address || !ref_code) {
    return next(new AppError("Missing required fields", 400));
  }

  const count = await Referral.countDocuments({
    address,
  });

  if (count >= 10) {
    return res.status(400).json({ error: "Maximum referral limit reached" });
  }

  const existingReferral = await Referral.findOne({ ref_code });
  if (existingReferral) {
    return next(new AppError("Referral code already exists", 400));
  }

  const userExistingReferral = await Referral.findOne({ address, ref_code });
  if (userExistingReferral) {
    return next(new AppError("You have already used this referral code", 400));
  }

  const referral = await Referral.create({
    address,
    ref_code,
    is_manager_code,
  });

  res.status(201).json(referral);
});
