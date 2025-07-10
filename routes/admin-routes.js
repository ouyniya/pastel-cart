const express = require("express");
const { authCheck } = require("../middlewares/auth-check");
const {
  changeOrderStatus,
  getOrderAdmin,
} = require("../controllers/admin-controllers");
const router = express.Router();

/**
 * @swagger
 * /admin/order-status:
 *   put:
 *     summary: Change order status
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *               orderStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Missing parameters
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put("/admin/order-status", authCheck, changeOrderStatus);

/**
 * @swagger
 * /admin/order:
 *   get:
 *     summary: Get orders for admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       500:
 *         description: Internal server error
 */
router.get("/admin/order", authCheck, getOrderAdmin);

module.exports = router;
