// 응답 DTO: 응답용 가공
class UserResponse {
    constructor(user) {
        this.kakaoId = user.kakaoId;
        this.nickname = user.nickname;
        this.createdAt = user.createdAt;
    }
}


module.exports = { UserResponse };