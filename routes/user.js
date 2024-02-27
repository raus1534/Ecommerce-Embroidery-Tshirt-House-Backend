const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const {
  updateUser,
  deleteUser,
  findUserById,
  getStats,
} = require("../controller/user");
const { isAuth, isAdmin } = require("../middleware/isAuth");

const router = require("express").Router();

router.put("/:id", isAuth, isAdmin, updateUser);
router.delete("/:id", isAuth, isAdmin, deleteUser);
router.get("/find/:id", isAuth, isAdmin, findUserById);
router.get("/", async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/stats", getStats);

module.exports = router;
