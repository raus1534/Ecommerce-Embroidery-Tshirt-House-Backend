const User = require("../models/User");
const {
  updateUser,
  deleteUser,
  findUserById,
  getStats,
} = require("../controller/user");
const { isAuth, isAdmin } = require("../middleware/isAuth");

const router = require("express").Router();

router.put("/:id", isAuth, isAdmin, updateUser);
router.delete("/:userId", isAuth, isAdmin, deleteUser);
router.get("/find/:id", isAuth, isAdmin, findUserById);

router.get("/stats", getStats);

module.exports = router;
