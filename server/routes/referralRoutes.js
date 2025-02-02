const express = require("express");
const referralController = require("../controllers/referralControllers");

const router = express.Router();

router.route("/").post(referralController.createReferral);

module.exports = router;
