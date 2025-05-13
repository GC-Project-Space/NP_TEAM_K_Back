const Status = require('../models/Status');
const Reaction = require('../models/Reaction');
const { ReactionType } = require('../constants/ReactionType');
const { getTodayReport } = require('./reportService');
const { analyzeEmotionFromOpenAI } = require('../services/openaiService');

// todo : 상태 생성하고 감정 표현 할 때 상태 리포트 스키마를 찾아 계속 업데이트 해줘야함
// todo : 리포트 요청은 즉시 계산해서 내려주는 것이 아니라, 미리 저장해두고 내려주기 때문에
// todo : 상태 서비스에서 계속 리포트의 스키마를 업데이트 해줘야 함

// 상태 생성 todo: 상태 생성할 때 오늘자 리포트 스키마에도 정보 업데이트 해줘야함
// todo: 리포트 스키마 찾아오는 건 리포트 서비스에 있는 메서드 쓰면 됨.
// todo : openai api 요청해서 감정 태깅 후 리포트에 저장까지 완료해야 함 (피그마 리포트 페이지 참고)
const createStatus = async (dto) => {
    // 1 상태 저장
    const status = new Status({
        writerKakaoId: dto.writerKakaoId,
        message: dto.message,
        location: dto.location,
    });

    try {
        const savedStatus = await status.save();

        // 2 리포트 찾기 (또는 생성)
        const report = await getTodayReport(dto.writerKakaoId);

        // 3 업로드 횟수 +1
        report.uploadCount += 1;

        // 4 감정 분석 (OpenAI 추후 연결)
        const detectedEmotion = await analyzeEmotionFromOpenAI(dto.message); // ex: 'sad', 'angry' , 'anxious' , 'happy' , 'surprise' , 'lonely'

        // 5 감정 통계 반영
        if (report.emotionCounts[detectedEmotion] !== undefined) {
            report.emotionCounts[detectedEmotion] += 1;
        }

        // 6 저장
        await report.save();

        return savedStatus;
    } catch (err) {
        console.error('[MONGO ERROR] 상태 저장 실패:', err);
        throw err;
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

    //  다른 사람이 조회했을 때만 조회수 증가
    if (kakaoId && kakaoId !== status.writerKakaoId) {
        status.viewCount += 1;
        await status.save();
    }

    //  본인 리액션 확인
    let myReaction = null;
    if (kakaoId) {
        const reaction = await Reaction.findOne({
            statusId: id,
            reactorKakaoId: kakaoId,
        });
        if (reaction) myReaction = reaction.reactionType;
    }

    return { status, myReaction };
};

// 리액션 추가
// todo: 조회수 증가 시키기, 리액션 추가 시 리포트 정보 업데이트
const reactToStatus = async ({ statusId, kakaoId, reactionType }) => {
    //  ReactionType label 검증
    const validLabels = Object.values(ReactionType).map(v => v.label);
    if (!validLabels.includes(reactionType)) return null;

    const status = await Status.findById(statusId);
    if (!status) return null;

    //  본인이 아닌 다른 사람이 리액션 → 조회수 +1
    if (kakaoId && kakaoId !== status.writerKakaoId) {
        status.viewCount += 1;
    }

    //  리액션 추가
    const reaction = new Reaction({
        statusId,
        reactorKakaoId: kakaoId,
        reactionType
    });
    await reaction.save();

    //  상태의 reactionCounts 증가
    status.reactionCounts[reactionType] += 1;
    await status.save();

    //  상태 작성자의 DailyReport receivedReactions 증가
    const report = await getTodayReport(status.writerKakaoId);
    report.receivedReactions[reactionType] += 1;
    await report.save();

    return status;
};

// 리액션 취소
// todo: 조회수 증가 시키기, 리액션 취소 시 리포트 정보 업데이트
const cancelReaction = async ({ statusId, kakaoId, reactionType }) => {
    //  ReactionType label 검증
    const validLabels = Object.values(ReactionType).map(v => v.label);
    if (!validLabels.includes(reactionType)) return null;
    
    
  //  리액션 삭제
    const deleted = await Reaction.findOneAndDelete({
        statusId,
        reactorKakaoId: kakaoId,
        reactionType,
    });

    if (!deleted) return null;

    //  상태 찾기
    const status = await Status.findById(statusId);
    if (!status) return null;

    //  다른 사람이 취소했을 때만 viewCount +1
    if (kakaoId && kakaoId !== status.writerKakaoId) {
        status.viewCount += 1;
    }

    //  상태의 reactionCounts 감소 (최소 0)
    status.reactionCounts[reactionType] = Math.max(
        0,
        (status.reactionCounts[reactionType] || 0) - 1
    );
    await status.save();

    //  상태 작성자의 리포트 receivedReactions 감소 (최소 0)
    const report = await getTodayReport(status.writerKakaoId);
    report.receivedReactions[reactionType] = Math.max(
        0,
        (report.receivedReactions[reactionType] || 0) - 1
    );
    await report.save();

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
