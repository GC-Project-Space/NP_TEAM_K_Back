const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');

/**
 * @swagger
 * tags:
 *   name: Report
 *   description: 일일 리포트 관련 API
 */

/**
 * @swagger
 * /report/emotion:
 *   get:
 *     summary: 오늘 감정 비율 조회
 *     tags: [Report]
 *     parameters:
 *       - in: query
 *         name: kakaoId
 *         schema:
 *           type: string
 *         required: true
 *         description: 사용자 카카오 ID
 *     responses:
 *       200:
 *         description: 감정 비율 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 30
 *                 emotionCounts:
 *                   type: object
 *                   properties:
 *                     sad: { type: number, example: 10 }
 *                     anxious: { type: number, example: 3 }
 *                     happy: { type: number, example: 7 }
 *                     surprise: { type: number, example: 2 }
 *                     lonely: { type: number, example: 5 }
 *                     angry: { type: number, example: 3 }
 *       404:
 *         description: 리포트 없음
 */
router.get('/emotion', ctrl.getTodayEmotionRatio);

/**
 * @swagger
 * /report/reaction:
 *   get:
 *     summary: 오늘 받은 공감 비율 조회
 *     tags: [Report]
 *     parameters:
 *       - in: query
 *         name: kakaoId
 *         schema:
 *           type: string
 *         required: true
 *         description: 사용자 카카오 ID
 *     responses:
 *       200:
 *         description: 공감 비율 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 30
 *                 receivedReactions:
 *                   type: object
 *                   properties:
 *                     like: { type: number, example: 15 }
 *                     sad: { type: number, example: 3 }
 *                     best: { type: number, example: 7 }
 *                     funny: { type: number, example: 5 }
 *       404:
 *         description: 리포트 없음
 */
router.get('/reaction', ctrl.getTodayReactionRatio);

/**
 * @swagger
 * /report/activity:
 *   get:
 *     summary: 오늘 업로드 수 조회
 *     tags: [Report]
 *     parameters:
 *       - in: query
 *         name: kakaoId
 *         schema:
 *           type: string
 *         required: true
 *         description: 사용자 카카오 ID
 *     responses:
 *       200:
 *         description: 업로드 수 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploadCount:
 *                   type: number
 *                   example: 5
 *       404:
 *         description: 리포트 없음
 */
router.get('/activity', ctrl.getTodayUploadCount);

module.exports = router;
