const userService = require('../services/userService');
const {UserLoginRequest} = require("../dto/request/userRequestDto");
const {UserResponse} = require("../dto/response/userResponseDto");

const loginOrRegister = async (req, res) => {
    const loginRequest = new UserLoginRequest(req.body);

    if (!loginRequest.isValid()) {
        return res.status(400).json({ error: 'kakaoId와 nickname은 필수입니다.' });
    }

    try {
        const user = await userService.findOrCreateUser(loginRequest.kakaoId);
        const responseDto = new UserResponse(user);
        res.status(200).json(responseDto);
    } catch (err) {
        console.error('[UserController] 로그인 오류:', err);
        res.status(500).json({ error: '서버 오류' });
    }
};

module.exports = { loginOrRegister };
