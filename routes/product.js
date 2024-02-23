const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const {
  addProduct,
  updateProduct,
  deleteProduct,
  findProductById,
} = require("../controller/product");
const router = require("express").Router();

router.post("/add", verifyTokenAndAdmin, addProduct);
router.put("/update/:id", verifyTokenAndAdmin, updateProduct);
router.delete("/:id", verifyTokenAndAdmin, deleteProduct);
router.get("/find/:id", findProductById);

router.get("/", async (req, res) => {
  let qNew = req.query.new;
  const qCategory = req.query.category;

  let products;
  if (qCategory === "unisex")
    products = await Product.find({}).sort({ createdAt: -1 });
  else if (qNew) {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(1);
  } else if (qCategory) {
    products = await Product.find({
      categories: {
        $in: [qCategory],
      },
    });
  } else {
    products = await Product.find();
  }

  res.status(200).json(products);
});

module.exports = router;
