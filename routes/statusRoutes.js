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

// 전체 CRUD 라우팅
router.post('/', createStatus);           // CREATE
router.get('/', getAllStatuses);          // READ ALL
router.get('/:id', getStatusById);        // READ ONE
router.put('/:id', updateStatus);         // UPDATE
router.delete('/:id', deleteStatus);      // DELETE

module.exports = router;