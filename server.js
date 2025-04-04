// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// 환경 변수 로드 (.env 파일)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 요청 파싱

// DB 연결
const connectDB = require('./config/db');
connectDB();

// 라우트 연결
const statusRoutes = require('./routes/statusRoutes');


app.use('/status', statusRoutes);


// 기본 라우트 (서버 확인용)
app.get('/', (req, res) => {
  res.send('서버 실행 중!');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(` 서버 실행 중: http://localhost:${PORT}`);
});