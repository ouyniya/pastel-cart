const express = require("express");
const router = express.Router();
const { validationZod, categorySchema } = require("../middlewares/validators");
const { authCheck, adminCheck } = require("../middlewares/auth-check");
const {
  createCategory,
  categoryList,
  removeCategory,
} = require("../controllers/category-controllers");

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Category name is required
 *       409:
 *         description: Duplicated category name
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/category",
  validationZod(categorySchema),
  authCheck,
  adminCheck,
  createCategory
);

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get list of categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of categories
 *       404:
 *         description: No category found
 */
router.get("/category", categoryList);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete category by ID (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/category/:id", removeCategory);

module.exports = router;
