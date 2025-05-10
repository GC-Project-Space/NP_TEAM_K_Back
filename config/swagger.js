// config/swagger.js

const swaggerJsdoc = require('swagger-jsdoc');

// Swagger 옵션 설정
const options = {
  definition: {
    openapi: '3.0.0', // Swagger 버전
    info: {
      title: '지금 뭐해요 - 백엔드 API', // 문서 제목
      version: '1.0.0', // 버전
      description: '위치 기반 감정 상태 공유 앱의 백엔드 API 문서입니다.', // 설명
    },
    servers: [
      {
        url: 'http://localhost:5000', // 기본 서버 주소 (배포 시 수정 가능)
      },
      {
        url: 'http://34.47.69.253/',
        description: '실제 배포 서버',
      },
    ],
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '661db9fe2910cc92060a6e23',
            },
            nickname: {
              type: 'string',
              example: '혼밥러',
            },
            message: {
              type: 'string',
              example: '도서관에서 공부 중입니다 📚',
            },
            emoji: {
              type: 'string',
              example: '📚',
            },
            location: {
              type: 'object',
              properties: {
                latitude: {
                  type: 'number',
                  example: 37.5,
                },
                longitude: {
                  type: 'number',
                  example: 127.0,
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-04-11T12:34:56.789Z',
            },
          },
        },
      },
    },
  },
  apis: [__dirname + '/../routes/*.js'], // 주석이 달린 라우트 파일 위치
};

const specs = swaggerJsdoc(options);
module.exports = specs;
