const { addToCart, getCartItems } = require("../controller/cart");
const { isAuth } = require("../middleware/isAuth");

const router = require("express").Router();

router.post("/add-to-cart", isAuth, addToCart);
router.post("/get-cart-items", getCartItems);

module.exports = router;
