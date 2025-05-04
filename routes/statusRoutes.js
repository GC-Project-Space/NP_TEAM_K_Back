// routes/statusRoutes.js

const express = require('express');
const router = express.Router();
const {
  createStatus,
  getAllStatuses,
  getStatusById,
  updateStatus,
  deleteStatus,
  addReaction,
  getPopularStatuses,
  recordStatusView,
  getStatusViewStats,
  getMyStatuses,
  getReactionStats,
  getWeeklyPostStats,
} = require('../controllers/statusController');

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: 사용자 상태 관련 API
 */

/**
 * @swagger
 * /status:
 *   post:
 *     summary: 새로운 상태 등록
 *     tags: [Status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 example: 혼밥러
 *               message:
 *                 type: string
 *                 example: 학식 먹는 중 🍚
 *               emoji:
 *                 type: string
 *                 example: 🍚
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: 37.5
 *                   longitude:
 *                     type: number
 *                     example: 127.0
 *     responses:
 *       201:
 *         description: 상태 생성 성공
 */
router.post('/', createStatus);

/**
 * @swagger
 * /status:
 *   get:
 *     summary: 전체 상태 조회
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: 상태 목록 반환
 */
router.get('/', getAllStatuses);

/**
 * @swagger
 * /status/popular:
 *   get:
 *     summary: 인기 상태 조회 (리액션 많은 순)
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: 인기 상태 반환
 */
router.get('/popular', getPopularStatuses);

/**
 * @swagger
 * /status/{id}:
 *   get:
 *     summary: 특정 상태 조회
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상태 조회 성공
 *       404:
 *         description: 상태를 찾을 수 없음
 */
router.get('/:id', getStatusById);

/**
 * @swagger
 * /status/{id}:
 *   put:
 *     summary: 상태 수정
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 도서관에서 졸려서 잠깐 눈 붙이는 중 😴
 *     responses:
 *       200:
 *         description: 상태 수정 성공
 *       404:
 *         description: 상태를 찾을 수 없음
 */
router.put('/:id', updateStatus);

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
 *     responses:
 *       200:
 *         description: 상태 삭제 성공
 *       404:
 *         description: 상태를 찾을 수 없음
 */
router.delete('/:id', deleteStatus);

/**
 * @swagger
 * /status/{id}/react:
 *   post:
 *     summary: 상태에 리액션 추가
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: like
 *     responses:
 *       200:
 *         description: 리액션 추가 성공
 *       400:
 *         description: 잘못된 리액션 유형
 *       404:
 *         description: 상태를 찾을 수 없음
 */
router.post('/:id/react', addReaction);

//  조회 기록 저장
/**
 * @swagger
 * /status/{id}/view:
 *   post:
 *     summary: 상태 조회 기록 저장
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상태 ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: user123
 *     responses:
 *       200:
 *         description: 조회 기록 저장 성공
 *       404:
 *         description: 상태를 찾을 수 없음
 */
router.post('/:id/view', recordStatusView);

//  조회 통계 (오늘/30일 기준)
/**
 * @swagger
 * /status/views/{userId}:
 *   get:
 *     summary: 특정 유저 기준의 오늘 및 최근 30일 조회 수 반환
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 유저 ID
 *     responses:
 *       200:
 *         description: 조회 수 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todayCount:
 *                   type: number
 *                   example: 5
 *                 monthCount:
 *                   type: number
 *                   example: 21
 */
router.get('/views/:userId', getStatusViewStats);

// 최신순/인기순 정렬 기능 
/**
 * @swagger
 * /status/mine:
 *   get:
 *     summary: 내가 작성한 상태 목록 조회 (인기순/최신순)
 *     tags: [Status]
 *     parameters:
 *       - in: query
 *         name: nickname
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 닉네임
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [latest, popular]
 *         description: "정렬 기준 (latest: 최신순, popular: 인기순)"
 *     responses:
 *       200:
 *         description: 상태 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Status'
 */
router.get('/mine', getMyStatuses); // 내 상태 목록 조회 (정렬 포함)

// 사용자 리액션 종류별 통계 (Pie Chart용)
/**
 * @swagger
 * /status/reactions/{nickname}:
 *   get:
 *     summary: 사용자 리액션 종류별 통계 (파이차트용)
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: nickname
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 닉네임
 *     responses:
 *       200:
 *         description: 리액션 통계 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 like:
 *                   type: number
 *                   example: 12
 *                 laugh:
 *                   type: number
 *                   example: 5
 *                 sad:
 *                   type: number
 *                   example: 3
 *                 thumbsup:
 *                   type: number
 *                   example: 8
 */
router.get('/reactions/:nickname', getReactionStats);

// 최근 7일간 상태 작성 통계 
/**
 * @swagger
 * /status/weekly/{nickname}:
 *   get:
 *     summary: 최근 7일간 상태 작성 통계 (요일별)
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: nickname
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 닉네임
 *     responses:
 *       200:
 *         description: 요일별 작성 수 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 Mon: 2
 *                 Tue: 1
 *                 Wed: 0
 *                 Thu: 3
 *                 Fri: 0
 *                 Sat: 1
 *                 Sun: 0
 */
router.get('/weekly/:nickname', getWeeklyPostStats);
module.exports = router;
