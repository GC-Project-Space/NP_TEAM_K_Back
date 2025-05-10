class StatusResponse {
    constructor(status, myReaction = null) {
        this.id = status._id;
        this.writerKakaoId = status.writerKakaoId;
        this.message = status.message;
        this.location = status.location;
        this.viewCount = status.viewCount;
        this.reactionCounts = status.reactionCounts;
        this.createdAt = status.createdAt;
        this.myReaction = myReaction; // 내가 누른 리액션
    }
}

module.exports = { StatusResponse };
