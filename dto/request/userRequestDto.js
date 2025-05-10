// 요청 DTO: 유효성 검사용
class UserLoginRequest {
    constructor(body) {
        this.kakaoId = body.kakaoId;
    }

    isValid() {
        return !!this.kakaoId;
    }
}


module.exports = { UserLoginRequest };