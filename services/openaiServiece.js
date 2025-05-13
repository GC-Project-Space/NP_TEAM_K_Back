//services/openaiServiece.js

const analyzeEmotionFromOpenAI = async (text) => {
    // 실제 서비스에서는 OpenAI API 호출 예정
    // 임시: 랜덤 감정 반환 (예시용)
    const emotions = ['sad', 'anxious', 'happy', 'surprise', 'lonely', 'angry'];
    return emotions[Math.floor(Math.random() * emotions.length)];
};

module.exports = { analyzeEmotionFromOpenAI };
