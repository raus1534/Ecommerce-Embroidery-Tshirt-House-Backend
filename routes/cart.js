const {
  addToCart,
  getCartItems,
  updateCart,
  removeFromCart,
} = require("../controller/cart");
const { isAuth } = require("../middleware/isAuth");

const router = require("express").Router();

router.post("/add-to-cart", isAuth, addToCart);
router.put("/update-cart", isAuth, updateCart);
router.put("/remove-from-cart", isAuth, removeFromCart);
router.post("/get-cart-items", getCartItems);

module.exports = router;
