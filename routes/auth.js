const router = require("express").Router();
const { registerUser, loginUser } = require("../controller/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
