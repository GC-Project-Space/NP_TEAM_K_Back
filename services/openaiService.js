const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 가능한 감정 목록
const EMOTIONS = ['sad', 'angry', 'anxious', 'happy', 'surprise', 'lonely'];

/**
 * 감정 분석 함수
 * @param {string} message 사용자 메시지
 * @returns {Promise<string>} 감정 라벨 (예: 'sad', 'happy' 등)
 */
const analyzeEmotionFromOpenAI = async (message) => {
  const prompt = `
다음 문장을 읽고 감정을 하나로 분류해줘. 가능한 감정은 다음 6개 중 하나야:
${EMOTIONS.join(', ')}.

문장: "${message}"

응답 형식은 감정 라벨 하나만 출력해. 다른 말은 하지 마.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '너는 감정을 정확히 분류하는 분석가야.' },
        { role: 'user', content: prompt },
      ],
    });

    const emotion = completion.choices[0].message.content.trim().toLowerCase();

    if (EMOTIONS.includes(emotion)) {
      return emotion;
    } else {
      console.warn('[WARN] 감정 분류 결과가 유효하지 않음:', emotion);
      return 'unknown';
    }
  } catch (error) {
    console.error('[ERROR] OpenAI 감정 분석 실패:', error.message);
    return 'unknown';
  }
};

module.exports = {
  analyzeEmotionFromOpenAI,
};
