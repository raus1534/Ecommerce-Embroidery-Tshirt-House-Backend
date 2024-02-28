const {
  handleEsewaSuccess,
  handleKhaltiCallback,
  updateChanges,
} = require("../controller/payment");

const router = require("express").Router();

router.get("/esewa/success", handleEsewaSuccess, updateChanges);
router.get("/khalti/callback", handleKhaltiCallback, updateChanges);

module.exports = router;
