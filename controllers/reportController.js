const service = require('../services/reportService');
const { EmotionReportDto, ReactionReportDto, ActivityReportDto } = require('../dto/response/reportResponseDto');

const getTodayEmotionRatio = async (req, res) => {
    const { kakaoId } = req.query;
    const report = await service.getTodayReport(kakaoId);
    if (!report) return res.status(404).json({ error: '리포트 없음' });

    res.json(new EmotionReportDto(report));
};

const getTodayReactionRatio = async (req, res) => {
    const { kakaoId } = req.query;
    const report = await service.getTodayReport(kakaoId);
    if (!report) return res.status(404).json({ error: '리포트 없음' });

    res.json(new ReactionReportDto(report));
};

const getTodayUploadCount = async (req, res) => {
    const { kakaoId } = req.query;
    const report = await service.getTodayReport(kakaoId);
    if (!report) return res.status(404).json({ error: '리포트 없음' });

    res.json(new ActivityReportDto(report));
};

module.exports = {
    getTodayEmotionRatio,
    getTodayReactionRatio,
    getTodayUploadCount,
};
