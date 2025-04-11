// routes/statusRoutes.js

const express = require('express');
const router = express.Router();
const {
  createStatus,
  getAllStatuses,
  getStatusById,
  updateStatus,
  deleteStatus,
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Status'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Status'
 */
router.get('/', getAllStatuses);

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
 *         description: 상태 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상태 상세 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Status'
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
 *         description: 상태 ID
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Status'
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
 *         description: 상태 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상태 삭제 성공
 *       404:
 *         description: 상태를 찾을 수 없음
 */
router.delete('/:id', deleteStatus);

module.exports = router;
