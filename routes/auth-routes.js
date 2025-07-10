const express = require("express");
const router = express.Router();
const {
  register,
  login,
  currentUser,
} = require("../controllers/auth-controller");
const { authCheck, adminCheck } = require("../middlewares/auth-check");

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully registered
 */
router.post("/register", register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 */
router.post("/login", login);

/**
 * @swagger
 * /current-user:
 *   get:
 *     summary: Get current logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 */
router.get("/current-user", authCheck, currentUser);

/**
 * @swagger
 * /current-admin:
 *   get:
 *     summary: Get current admin user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin info
 *       403:
 *         description: Access Denied
 */
router.get("/current-admin", authCheck, adminCheck, currentUser);

module.exports = router;
