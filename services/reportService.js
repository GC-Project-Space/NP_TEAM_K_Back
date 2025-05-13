const DailyReport = require('../models/DailyReport');
const User = require('../models/User');  //  User 모델 추가
const { format } = require('date-fns');

const getTodayReport = async (kakaoId) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    try {
        //  추가: 유효한 사용자(kakaoId)인지 확인
        const user = await User.findOne({ kakaoId });
        if (!user) {
            throw new Error(`[DailyReport] 존재하지 않는 사용자입니다. (kakaoId: ${kakaoId})`);
        }

        //  기존 DailyReport 로직
        let report = await DailyReport.findOne({ kakaoId, date: today });

        if (!report) {
            report = new DailyReport({ kakaoId, date: today }); // 기본값 자동 설정됨
            await report.save();
        }

        return report;
    } catch (err) {
        console.error('[DB ERROR]', err);
        throw err;  //  에러 전파 → 상위 controller에서 처리 가능
    }
};

module.exports = { getTodayReport };
