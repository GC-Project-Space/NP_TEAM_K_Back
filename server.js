// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const statusRoutes = require('./routes/statusRoutes');
const reportRoutes = require('./routes/reportRoutes'); // 리포트 조회

//  Swagger 관련 추가
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// 환경 변수 로드 (.env 파일)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 요청 파싱

// 로그 미들웨어
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});


// DB 연결
const connectDB = require('./config/db');
connectDB();

// 라우트 연결
app.use('/status', statusRoutes); // 상태 등록, 삭제, 리액션 처리 등
app.use('/user', userRoutes);       // 로그인, 내 정보
app.use('/report', reportRoutes);   // 리포트 조회

//  Swagger 문서 라우트 연결
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 기본 라우트 (서버 확인용)
app.get('/', (req, res) => {
  res.send('서버 실행 중!');
});

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack || err);
  res.status(500).json({
    error: '서버 내부 오류 발생',
    message: err.message,
  });
});

// 존재하지 않는 경로 처리
app.use((req, res) => {
  res.status(404).json({
    error: '해당 경로는 존재하지 않습니다',
    path: req.originalUrl,
  });
});


// 서버 시작
app.listen(PORT, () => {
  console.log(` 서버 실행 중: http://localhost:${PORT}`);
  console.log(` Swagger 문서: http://localhost:${PORT}/api-docs`);
});
