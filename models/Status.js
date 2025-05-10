const mongoose = require('mongoose');

const getInitialReactionCounts = () => {
    const counts = {};
    Object.values(ReactionType).forEach(({ label }) => {
        counts[label] = 0;
    });
    return counts;
};

const statusSchema = new mongoose.Schema({
    writerKakaoId: { // 작성자 카카오 ID
        type: String,
        required: true,
    },
    message: {  // 상태 메시지
        type: String,
        required: true,
    },
    location: { // 위치 정보
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    createdAt: { // 생성일
        type: Date,
        default: Date.now,
    },
    viewCount: { // 조회 수
        type: Number,
        default: 0,
    },
    reactionCounts: { // 리액션 통계
        like:  { type: Number, default: 0 },
        sad:   { type: Number, default: 0 },
        best:  { type: Number, default: 0 },
        funny: { type: Number, default: 0 },
    },
});

statusSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Status', statusSchema);
