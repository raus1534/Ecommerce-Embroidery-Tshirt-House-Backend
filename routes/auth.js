const router = require("express").Router();
const { registerUser, loginUser } = require("../controller/auth");
const { isAuth } = require("../middleware/isAuth");
const { setAuthInfo } = require("../controller/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/is-auth", isAuth, setAuthInfo);

module.exports = router;
