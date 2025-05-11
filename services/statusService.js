const Status = require('../models/Status');
const Reaction = require('../models/Reaction');
const { ReactionType } = require('../constants/ReactionType');

// todo : 상태 생성하고 감정 표현 할 때 상태 리포트 스키마를 찾아 계속 업데이트 해줘야함
// todo : 리포트 요청은 즉시 계산해서 내려주는 것이 아니라, 미리 저장해두고 내려주기 때문에
// todo : 상태 서비스에서 계속 리포트의 스키마를 업데이트 해줘야 함

// 상태 생성 todo: 상태 생성할 때 오늘자 리포트 스키마에도 정보 업데이트 해줘야함
// todo: 리포트 스키마 찾아오는 건 리포트 서비스에 있는 메서드 쓰면 됨.
// todo : openai api 요청해서 감정 태깅 후 리포트에 저장까지 완료해야 함 (피그마 리포트 페이지 참고)
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

// 상태 삭제
const deleteStatus = async (id, kakaoId) => {
    const status = await Status.findById(id);
    if (!status || status.writerKakaoId !== kakaoId) return null;
    await Status.findByIdAndDelete(id);
    await Reaction.deleteMany({ statusId: id });
    return true;
};

// 상태 목록 조회 (거리순, 인기순)
// todo: 걍 이렇게 조회된 상태는 조회 수 하나씩 높이지 말고 상세 조회나, 이모티콘 남겼을 떄만 조회수 높이기
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

// 상태 상세 조회
// todo: 조회 수 증가, 상태 리포트 정보 업데이트
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

// 리액션 추가
// todo: 조회수 증가 시키기, 리액션 추가 시 리포트 정보 업데이트
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

// 리액션 취소
// todo: 조회수 증가 시키기, 리액션 취소 시 리포트 정보 업데이트
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
