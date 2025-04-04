#  지금 뭐해요 - 백엔드 API

> 위치 기반 감정/상태 공유 앱의 백엔드입니다.  
> 말하지 않아도 외롭지 않게, 지금 이 순간 누군가와 정서적으로 연결될 수 있도록 만들어졌습니다.

---

##  기술 스택

- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv (환경변수)
- Postman (API 테스트용)

---

##  프로젝트 구조

<pre>
MP/
├── server.js                # 서버 진입점
├── .env                     # 환경 변수 (포트, DB 주소 등)
├── package.json             # 의존성, 실행 스크립트 등
│
├── config/
│   └── db.js                # MongoDB 연결 설정
│
├── models/
│   └── Status.js            # 상태 데이터 모델 정의
│
├── controllers/
│   └── statusController.js  # CRUD 로직
│
├── routes/
│   └── statusRoutes.js      # API 라우터
</pre>

---

##  실행 방법

1.  저장소 클론  
   ```bash
   git clone https://github.com/GC-Project-Space/NP_TEAM_K_Back
   cd Fodler

2.  패키지 설치
    npm install

3.  .env 파일 생성
    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority

4.  서버 실행

    개발 모드 (자동 재시작):
    npm run dev

    또는 일반 실행:
    npm start

    

##  API 목록
    
    메서드	    엔드포인트	            설명
    
    POST	    /status	            새로운 상태 등록
    GET	        /status	            전체 상태 목록 조회
    GET	        /status/:id	        특정 상태 조회
    PUT	        /status/:id	        상태 수정
    DELETE	    /status/:id	        상태 삭제


## Postman 테스트 예시

POST /status

{
  "nickname": "혼밥중",
  "message": "학식 먹는 중 🍚",
  "emoji": "🍚",
  "location": { "latitude": 37.5, "longitude": 127.0 }
}

PUT /status/:id

{
  "message": "밥 다 먹고 나왔어요 ☕"
}