const {
  addProduct,
  updateProduct,
  deleteProduct,
  findProductById,
  getProducts,
} = require("../controller/product");
const { isAdmin, isAuth } = require("../middleware/isAuth");
const router = require("express").Router();

router.get("/", getProducts);
router.post("/add", isAuth, isAdmin, addProduct);
router.put("/update/:productId", isAuth, isAdmin, updateProduct);
router.delete("/:productId", isAuth, isAdmin, deleteProduct);
router.get("/find/:productId", findProductById);

module.exports = router;
