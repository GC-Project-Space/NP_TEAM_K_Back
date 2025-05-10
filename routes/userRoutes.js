const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: 카카오 로그인 및 자동 회원가입
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kakaoId:
 *                 type: string
 *                 example: "73722123"
 *     responses:
 *       200:
 *         description: 유저 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 kakaoId:
 *                   type: string
 *                   example: "73722123"
 *                 nickname:
 *                   type: string
 *                   example: "user_737"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-05-10T13:20:01.000Z"
 */

router.post('/login', userController.loginOrRegister);

module.exports = router;
