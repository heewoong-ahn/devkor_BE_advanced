FROM node:18-alpine

#도커에서의 작업 디렉토리 설정
WORKDIR /app 
#현재 폴더 모든 것 /app으로 이전 
ADD . /app/ 

RUN npm install 

RUN npm run build 

EXPOSE 3000

ENTRYPOINT npm run start:prod
