class EmotionReportDto {
    constructor(report) {
        this.total = Object.values(report.emotionCounts).reduce((sum, v) => sum + v, 0);
        this.emotionCounts = report.emotionCounts;
    }
}

class ReactionReportDto {
    constructor(report) {
        this.total = Object.values(report.receivedReactions).reduce((sum, v) => sum + v, 0);
        this.receivedReactions = report.receivedReactions;
    }
}

class ActivityReportDto {
    constructor(report) {
        this.uploadCount = report.uploadCount;
    }
}

module.exports = {
    EmotionReportDto,
    ReactionReportDto,
    ActivityReportDto,
};
