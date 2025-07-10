const express = require("express");
const router = express.Router();
const { authCheck, adminCheck } = require("../middlewares/auth-check");
const {
  getListOfUsers,
  changeUserStatus,
  changeUserRole,
  createUserCart,
  getUserCart,
  emptyCart,
  saveAddress,
  saveOrder,
  getOrder,
} = require("../controllers/user-controllers");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get list of all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", authCheck, adminCheck, getListOfUsers);

/**
 * @swagger
 * /change-status:
 *   post:
 *     summary: Change user's status (enabled/disabled)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status updated
 */
router.post("/change-status", authCheck, adminCheck, changeUserStatus);

/**
 * @swagger
 * /change-role:
 *   post:
 *     summary: Change user's role (admin/user)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated
 */
router.post("/change-role", authCheck, adminCheck, changeUserRole);

/**
 * @swagger
 * /user/cart:
 *   post:
 *     summary: Create or update user's cart
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     count:
 *                       type: number
 *                     price:
 *                       type: number
 *     responses:
 *       200:
 *         description: Cart added
 */
router.post("/user/cart", authCheck, createUserCart);

/**
 * @swagger
 * /user/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns cart
 */
router.get("/user/cart", authCheck, getUserCart);

/**
 * @swagger
 * /user/cart:
 *   delete:
 *     summary: Empty user's cart
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart emptied
 */
router.delete("/user/cart", authCheck, emptyCart);

/**
 * @swagger
 * /user/address:
 *   post:
 *     summary: Save user address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address saved
 */
router.post("/user/address", authCheck, saveAddress);

/**
 * @swagger
 * /user/order:
 *   post:
 *     summary: Save an order from cart
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentIntent:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   currency:
 *                     type: string
 *     responses:
 *       200:
 *         description: Order saved
 */
router.post("/user/order", authCheck, saveOrder);

/**
 * @swagger
 * /user/order:
 *   get:
 *     summary: Get user's orders
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders returned
 */
router.get("/user/order", authCheck, getOrder);

module.exports = router;
