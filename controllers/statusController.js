// controllers/statusController.js

const Status = require('../models/Status');

//  CREATE: 새로운 상태 등록
const createStatus = async (req, res) => {
  try {
    const { nickname, message, emoji, location } = req.body;

    const newStatus = new Status({
      nickname,
      message,
      emoji,
      location,
    });

    const savedStatus = await newStatus.save();
    res.status(201).json(savedStatus);
  } catch (err) {
    res.status(500).json({ error: '상태 저장 실패', details: err.message });
  }
};

//  READ ALL: 전체 상태 조회
const getAllStatuses = async (req, res) => {
  try {
    const statuses = await Status.find().sort({ createdAt: -1 }); // 최신순 정렬
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ error: '상태 불러오기 실패', details: err.message });
  }
};

//  READ ONE: 특정 ID 상태 조회
const getStatusById = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    if (!status) return res.status(404).json({ error: '상태를 찾을 수 없습니다.' });
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: '상태 조회 실패', details: err.message });
  }
};

//  UPDATE: 특정 상태 수정
const updateStatus = async (req, res) => {
  try {
    const updated = await Status.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // 수정 후 결과 반환
    );
    if (!updated) return res.status(404).json({ error: '수정할 상태가 없습니다.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '상태 수정 실패', details: err.message });
  }
};

//  DELETE: 특정 상태 삭제
const deleteStatus = async (req, res) => {
  try {
    const deleted = await Status.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: '삭제할 상태가 없습니다.' });
    res.json({ message: '상태 삭제 완료', deleted });
  } catch (err) {
    res.status(500).json({ error: '상태 삭제 실패', details: err.message });
  }
};

module.exports = {
  createStatus,
  getAllStatuses,
  getStatusById,
  updateStatus,
  deleteStatus,
};
