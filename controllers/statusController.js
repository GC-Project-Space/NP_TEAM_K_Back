// controllers/statusController.js

const Status = require('../models/Status');

// CREATE
const createStatus = async (req, res) => {
  try {
    const { nickname, message, emoji, location } = req.body;
    const newStatus = new Status({ nickname, message, emoji, location });
    const saved = await newStatus.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: '상태 저장 실패', details: err.message });
  }
};

// GET ALL
const getAllStatuses = async (req, res) => {
  try {
    const statuses = await Status.find().sort({ createdAt: -1 });
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ error: '상태 불러오기 실패', details: err.message });
  }
};

// GET ONE
const getStatusById = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    if (!status) return res.status(404).json({ error: '상태 없음' });
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: '조회 실패', details: err.message });
  }
};

// UPDATE
const updateStatus = async (req, res) => {
  try {
    const updated = await Status.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: '수정할 상태 없음' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '수정 실패', details: err.message });
  }
};

// DELETE
const deleteStatus = async (req, res) => {
  try {
    const deleted = await Status.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: '삭제할 상태 없음' });
    res.json({ message: '삭제 완료', deleted });
  } catch (err) {
    res.status(500).json({ error: '삭제 실패', details: err.message });
  }
};

//  REACT
const addReaction = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!['like', 'laugh', 'sad', 'thumbsup'].includes(type)) {
    return res.status(400).json({ error: '유효하지 않은 리액션 타입' });
  }

  try {
    const status = await Status.findById(id);
    if (!status) return res.status(404).json({ error: '상태 없음' });

    status.reactions[type] = (status.reactions[type] || 0) + 1;
    await status.save();
    res.json({ message: '리액션 추가됨', status });
  } catch (err) {
    res.status(500).json({ error: '리액션 실패', details: err.message });
  }
};

//  POPULAR
const getPopularStatuses = async (req, res) => {
  try {
    const statuses = await Status.find();

    // 리액션 수 총합 계산
    const statusesWithCount = statuses.map((status) => {
      const r = status.reactions || {};
      const reactionCount =
        (r.like || 0) + (r.laugh || 0) + (r.sad || 0) + (r.thumbsup || 0);
      return {
        ...status.toObject(),
        reactionCount,
      };
    });

    // 반응 수로 내림차순 정렬 (0도 포함)
    statusesWithCount.sort((a, b) => b.reactionCount - a.reactionCount);

    res.json(statusesWithCount);
  } catch (err) {
    res.status(500).json({
      error: '인기 상태 조회 실패',
      details: err.message,
    });
  }
};

//  조회 기록 저장
const recordStatusView = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await Status.findById(id);
    if (!status) return res.status(404).json({ message: '상태 없음' });

    status.views.push({
      userId: req.body.userId || 'anonymous',
    });

    await status.save();
    res.status(200).json({ message: '조회 기록 저장됨' });
  } catch (err) {
    res.status(500).json({ message: '조회 기록 실패', error: err.message });
  }
};

//  특정 유저의 오늘/30일 조회 수 반환
const getStatusViewStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthAgo = new Date();
    monthAgo.setDate(today.getDate() - 30);

    const statuses = await Status.find({
      'views.userId': userId,
      'views.timestamp': { $gte: monthAgo },
    });

    let todayCount = 0;
    let monthCount = 0;

    statuses.forEach(status => {
      status.views.forEach(view => {
        if (view.userId === userId) {
          const viewDate = new Date(view.timestamp);
          if (viewDate >= today) todayCount++;
          if (viewDate >= monthAgo) monthCount++;
        }
      });
    });

    res.json({ todayCount, monthCount });
  } catch (err) {
    res.status(500).json({ message: '조회 통계 조회 실패', error: err.message });
  }
};

const getMyStatuses = async (req, res) => {
  try {
    const { nickname, sort } = req.query;
    if (!nickname) return res.status(400).json({ message: 'nickname 쿼리 필요' });

    let statuses = await Status.find({ nickname });

    // 리액션 수 계산
    const statusesWithCount = statuses.map(status => {
      const r = status.reactions || {};
      const reactionCount = (r.like || 0) + (r.laugh || 0) + (r.sad || 0) + (r.thumbsup || 0);
      return {
        ...status.toObject(),
        reactionCount,
      };
    });

    if (sort === 'popular') {
      statusesWithCount.sort((a, b) => b.reactionCount - a.reactionCount); // 인기순
    } else {
      statusesWithCount.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 최신순
    }

    res.json(statusesWithCount);
  } catch (err) {
    res.status(500).json({ message: '내 상태 조회 실패', error: err.message });
  }
};

//  리액션 통계 함수 추가
const getReactionStats = async (req, res) => {
  try {
    const { nickname } = req.params;
    const statuses = await Status.find({ nickname });

    const totalReactions = {
      like: 0,
      laugh: 0,
      sad: 0,
      thumbsup: 0,
    };

    statuses.forEach(status => {
      const r = status.reactions || {};
      totalReactions.like += r.like || 0;
      totalReactions.laugh += r.laugh || 0;
      totalReactions.sad += r.sad || 0;
      totalReactions.thumbsup += r.thumbsup || 0;
    });

    res.json(totalReactions);
  } catch (err) {
    res.status(500).json({ message: '리액션 통계 실패', error: err.message });
  }
};

const getWeeklyPostStats = async (req, res) => {
  try {
    const { nickname } = req.params;

    // 7일 전 날짜 구하기
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // 최근 7일간 해당 유저의 상태 가져오기
    const statuses = await Status.find({
      nickname,
      createdAt: { $gte: sevenDaysAgo },
    });

    // 요일별 초기화
    const dayMap = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    statuses.forEach(status => {
      const day = new Date(status.createdAt).toLocaleString('en-US', { weekday: 'short' });
      if (dayMap[day] !== undefined) {
        dayMap[day]++;
      }
    });

    res.json(dayMap);
  } catch (err) {
    res.status(500).json({ message: '주간 상태 통계 실패', error: err.message });
  }
};

module.exports = {
  createStatus,
  getAllStatuses,
  getStatusById,
  updateStatus,
  deleteStatus,
  addReaction,
  getPopularStatuses,
  getMyStatuses,
  recordStatusView,
  getStatusViewStats,
  getReactionStats,
  getWeeklyPostStats,
};
