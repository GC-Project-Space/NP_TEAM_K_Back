const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    statusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
        required: true,
    },
    reactorKakaoId: {
        type: String,
        required: true,
    },
    reactionType: {
        type: String,
        enum: ['like', 'sad', 'best', 'funny'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// 한 유저가 하나의 상태에 같은 리액션을 여러 번 못 하도록 제한
reactionSchema.index({ statusId: 1, reactorKakaoId: 1, reactionType: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);
