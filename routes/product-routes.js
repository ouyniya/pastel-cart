const express = require("express");
const router = express.Router();

const {
  createProduct,
  productList,
  removeProduct,
  listProductBy,
  searchFilter,
  addImages,
  removeImages,
} = require("../controllers/product-controllers");
const { authCheck, adminCheck } = require("../middlewares/authCheck");

router.post("/product", createProduct);
router.get("/products/:page/:limit", productList);
router.get("/product/:id", getProducts);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", removeProduct);
router.post("/product-by", listProductBy);
router.post("/search/filters", searchFilter);

router.post("/images", authCheck, adminCheck, addImages);
router.post("/remove-image", authCheck, adminCheck, removeImages);

module.exports = router;
