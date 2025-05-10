const User = require('../models/User');

const findOrCreateUser = async (kakaoId) => {
    let user = await User.findOne({ kakaoId });

    if (!user) {
        const nickname = `user_${kakaoId.slice(0, 3)}`;
        user = new User({
            kakaoId: kakaoId,
            nickname: nickname,
        });
        await user.save();
    }

    return user;
};

module.exports = { findOrCreateUser };
