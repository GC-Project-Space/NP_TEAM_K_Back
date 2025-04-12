# 베이스 이미지
FROM node:20

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 앱 소스 복사
COPY . .

# 환경 변수 설정 (.env 파일은 docker-compose에서 bind mount로 연결)
EXPOSE 5000

# 앱 실행
CMD ["npm", "start"]
