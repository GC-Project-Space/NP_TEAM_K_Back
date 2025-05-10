const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema({
    kakaoId: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    emotionCounts: {
        sad:    { type: Number, default: 0 },
        anxious:{ type: Number, default: 0 },
        happy:  { type: Number, default: 0 },
        surprise:{ type: Number, default: 0 },
        lonely: { type: Number, default: 0 },
        angry:  { type: Number, default: 0 },
    },
    receivedReactions: {
        like:  { type: Number, default: 0 },
        sad:   { type: Number, default: 0 },
        best:  { type: Number, default: 0 },
        funny: { type: Number, default: 0 },
    },
    uploadCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

dailyReportSchema.index({ kakaoId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyReport', dailyReportSchema);


/*
* 1. 상태 등록하면 이 리포트 페이지 업데이트
* 만일 오늘자 리포트가 존재하지 않는다면
* 리포트 생성하고 일주일 지 데이터 여기 집어넣고
* 방금 등록한 상태도 리포트에 업데이트까지 해야지 상태 저장 완료 됨
*
* 2. 내가 다른 사람 상태에 이모지를 누르면
* 다른 사람 반응 스키마 생성하고 그 사람의 오늘자 리포트가 존재하지 않는다면
* 리포트 생성하고 일주일 지 데이터 여기 집어넣고
* 방금 등록한 반응도 그 사람의 리포트에 업데이트까지 해야지 반응 완료
* */