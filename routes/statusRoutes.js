const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/statusController');

console.log('statusRoutes.js 로딩됨');

router.use((req, res, next) => {
    console.log(`[statusRoutes] ${req.method} ${req.originalUrl}`);
    next();
});

router.post('/debug', (req, res) => {
    console.log('POST /status/debug 진입');
    res.json({ ok: true });
});

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: 상태 관련 API
 */

/**
 * @swagger
 * /status:
 *   post:
 *     summary: 상태 등록
 *     tags: [Status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [writerKakaoId, message, location]
 *             properties:
 *               writerKakaoId:
 *                 type: string
 *                 example: "kakao_123"
 *               message:
 *                 type: string
 *                 example: "도서관에서 공부 중입니다"
 *               location:
 *                 type: object
 *                 required: [latitude, longitude]
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: 37.5
 *                   longitude:
 *                     type: number
 *                     example: 127.0
 *     responses:
 *       201:
 *         description: 생성된 상태 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 writerKakaoId:
 *                   type: string
 *                 message:
 *                   type: string
 *                 location:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
 *                 createdAt:
 *                   type: string
 *                 viewCount:
 *                   type: number
 *                 reactionCounts:
 *                   type: object
 *                   properties:
 *                     like:
 *                       type: number
 *                     sad:
 *                       type: number
 *                     best:
 *                       type: number
 *                     funny:
 *                       type: number
 */
router.post('/', ctrl.createStatus);

/**
 * @swagger
 * /status/{id}:
 *   delete:
 *     summary: 상태 삭제
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상태 ID
 *       - in: query
 *         name: kakaoId
 *         required: true
 *         schema:
 *           type: string
 *         description: 작성자 카카오 ID
 *     responses:
 *       200:
 *         description: 삭제 완료 메시지
 *       404:
 *         description: 상태 없음 또는 삭제 권한 없음
 */
router.delete('/:id', ctrl.deleteStatus);

/**
 * @swagger
 * /status:
 *   get:
 *     summary: 상태 목록 조회 (거리순 기본, 인기순 선택)
 *     tags: [Status]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: 위도 (거리순 정렬용)
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: 경도 (거리순 정렬용)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [popular, distance]
 *         description: 정렬 방식
 *       - in: query
 *         name: kakaoId
 *         schema:
 *           type: string
 *         description: 내 리액션 정보 포함을 위한 카카오 ID
 *     responses:
 *       200:
 *         description: 상태 목록 반환
 */
router.get('/', ctrl.getStatuses);

/**
 * @swagger
 * /status/{id}:
 *   get:
 *     summary: 단일 상태 조회
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상태 ID
 *       - in: query
 *         name: kakaoId
 *         schema:
 *           type: string
 *         description: 내 리액션 확인을 위한 카카오 ID
 *     responses:
 *       200:
 *         description: 상태 상세 정보 반환
 *       404:
 *         description: 상태 없음
 */
router.get('/:id', ctrl.getStatusById);

/**
 * @swagger
 * /status/{id}/react/{type}:
 *   post:
 *     summary: 리액션 추가
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상태 ID
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [like, sad, best, funny]
 *         description: 리액션 타입
 *       - in: query
 *         name: kakaoId
 *         required: true
 *         schema:
 *           type: string
 *         description: 리액션을 누른 사용자 카카오 ID
 *     responses:
 *       200:
 *         description: 리액션 반영된 상태 정보 반환
 *       400:
 *         description: 리액션 실패
 */
router.post('/:id/react/:type', ctrl.addReaction);

/**
 * @swagger
 * /status/{id}/react/{type}:
 *   delete:
 *     summary: 리액션 취소
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상태 ID
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [like, sad, best, funny]
 *         description: 리액션 타입
 *       - in: query
 *         name: kakaoId
 *         required: true
 *         schema:
 *           type: string
 *         description: 리액션 취소할 사용자 카카오 ID
 *     responses:
 *       200:
 *         description: 리액션 제거된 상태 정보 반환
 *       400:
 *         description: 리액션 취소 실패
 */
router.delete('/:id/react/:type', ctrl.cancelReaction);

module.exports = router;
