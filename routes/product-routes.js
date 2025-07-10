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

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - quantity
 *               - categoryId
 *               - images
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     asset_id:
 *                       type: string
 *                     public_id:
 *                       type: string
 *                     url:
 *                       type: string
 *                     secure_url:
 *                       type: string
 *     responses:
 *       200:
 *         description: Product created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/product", createProduct);

/**
 * @swagger
 * /products/{page}/{limit}:
 *   get:
 *     summary: Get paginated list of products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Internal server error
 */
router.get("/products/:page/:limit", productList);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product detail
 *       404:
 *         description: Product not found
 */
router.get("/product/:id", getProducts);

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     asset_id:
 *                       type: string
 *                     public_id:
 *                       type: string
 *                     url:
 *                       type: string
 *                     secure_url:
 *                       type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.put("/product/:id", updateProduct);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete("/product/:id", removeProduct);

/**
 * @swagger
 * /product-by:
 *   post:
 *     summary: Get products sorted by field
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sort:
 *                 type: string
 *               order:
 *                 type: string
 *               limit:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List of products
 */

router.post("/product-by", listProductBy);

/**
 * @swagger
 * /search/filters:
 *   post:
 *     summary: Search and filter products
 *     tags: [Products]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: integer
 *               price:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Search results
 */
router.post("/search/filters", searchFilter);
/**
 * @swagger
 * /images:
 *   post:
 *     summary: Upload image to Cloudinary
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image uploaded
 */
router.post("/images", authCheck, adminCheck, addImages);

/**
 * @swagger
 * /remove-image:
 *   post:
 *     summary: Remove image from Cloudinary
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               public_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image removed
 */
router.post("/remove-image", authCheck, adminCheck, removeImages);

module.exports = router;
