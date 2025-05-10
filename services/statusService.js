const Status = require('../models/Status');
const Reaction = require('../models/Reaction');
const { ReactionType } = require('../constants/ReactionType');

const createStatus = async (dto) => {
    const status = new Status({
        writerKakaoId: dto.writerKakaoId,
        message: dto.message,
        location: dto.location,
    });
    try {
        return await status.save();
    } catch (err) {
        console.error('[MONGO ERROR] 상태 저장 실패:', err);
        throw err; // 전역 에러 핸들러로 넘김
    }
};

const deleteStatus = async (id, kakaoId) => {
    const status = await Status.findById(id);
    if (!status || status.writerKakaoId !== kakaoId) return null;
    await Status.findByIdAndDelete(id);
    await Reaction.deleteMany({ statusId: id });
    return true;
};

const getStatuses = async ({ lat, lng, sort, kakaoId }) => {
    const statuses = await Status.find();

    let sorted = statuses;
    if (sort === 'popular') {
        sorted = statuses.sort((a, b) => {
            const sum = r => Object.values(r || {}).reduce((s, v) => s + v, 0);
            return sum(b.reactionCounts) - sum(a.reactionCounts);
        });
    } else if (lat && lng) {
        const dist = ({ latitude, longitude }) =>
            Math.pow(latitude - lat, 2) + Math.pow(longitude - lng, 2);
        sorted = statuses.sort((a, b) => dist(a.location) - dist(b.location));
    }

    let myReactionsMap = {};
    if (kakaoId) {
        const reactions = await Reaction.find({
            reactorKakaoId: kakaoId,
            statusId: { $in: statuses.map(s => s._id) },
        });
        myReactionsMap = reactions.reduce((acc, r) => {
            acc[r.statusId.toString()] = r.reactionType;
            return acc;
        }, {});
    }

    return sorted.map(status => ({
        ...status.toObject(),
        myReaction: myReactionsMap[status._id.toString()] || null,
    }));
};

const getStatusById = async ({ id, kakaoId }) => {
    const status = await Status.findById(id);
    if (!status) return { status: null, myReaction: null };

    let myReaction = null;
    if (kakaoId) {
        const reaction = await Reaction.findOne({ statusId: id, reactorKakaoId: kakaoId });
        if (reaction) myReaction = reaction.reactionType;
    }

    return { status, myReaction };
};

const reactToStatus = async ({ statusId, kakaoId, reactionType }) => {
    if (!ReactionType[reactionType.toUpperCase()]) return null;
    const status = await Status.findById(statusId);
    if (!status) return null;

    const reaction = new Reaction({ statusId, reactorKakaoId: kakaoId, reactionType });
    await reaction.save();

    status.reactionCounts[reactionType] += 1;
    await status.save();
    return status;
};

const cancelReaction = async ({ statusId, kakaoId, reactionType }) => {
    const deleted = await Reaction.findOneAndDelete({
        statusId,
        reactorKakaoId: kakaoId,
        reactionType,
    });

    if (!deleted) return null;

    const status = await Status.findById(statusId);
    if (!status) return null;

    status.reactionCounts[reactionType] = Math.max(0, (status.reactionCounts[reactionType] || 0) - 1);
    await status.save();
    return status;
};

module.exports = {
    createStatus,
    deleteStatus,
    getStatuses,
    getStatusById,
    reactToStatus,
    cancelReaction,
};
