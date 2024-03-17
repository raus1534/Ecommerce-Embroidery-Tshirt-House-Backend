const User = require("../models/User");
const {
  updateUser,
  deleteUser,
  findUserById,
  userStats,
  publishNewsletter,
} = require("../controller/user");
const { isAuth, isAdmin } = require("../middleware/isAuth");

const router = require("express").Router();

router.put("/:userId", isAuth, isAdmin, updateUser);
router.delete("/:userId", isAuth, isAdmin, deleteUser);
router.get("/find/:userId", isAuth, isAdmin, findUserById);
router.get("/stats", isAuth, isAdmin, userStats);
router.post("/newsletter", isAuth, publishNewsletter);

module.exports = router;
