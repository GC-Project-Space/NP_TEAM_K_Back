const DailyReport = require('../models/DailyReport');
const { format } = require('date-fns');

// todo: 카카오 아이디가 존재하는 사용자의 것인지 확인해야 함 (예외 처리)
const getTodayReport = async (kakaoId) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    try {
        let report = await DailyReport.findOne({kakaoId: kakaoId, date: today});

        if (!report) {
            report = new DailyReport({kakaoId, date: today}); // 기본값 자동 설정됨
            await report.save();
        }

        return report;
    } catch (err) {
        console.error('[DB ERROR]', err);
    }
};

module.exports = { getTodayReport };
