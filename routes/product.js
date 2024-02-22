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
router.get("/:id", findProductById);

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
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
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
