//진입점 파일

// express 모듈과 기타 미들웨어 모듈 사용 선언
const express = require('express');
const path = require('path');
const logger = require('morgan');

// 라우팅 모듈 설정
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const aboutRouter = require('./routes/about');
const static = require("express");

// express 객체 생성 및 포트 변수 선언
const app = express();
const port = process.env.PORT || 3000;

// 라우팅 없이 바로 호출 가능하도록 static 폴더 설정
app.use(express.static(path.join(__dirname,'static')));

// 라우팅 모듈 등록 - 클라이언트 요청 처리 핵심 파트
app.use('/',indexRouter);
app.use('/user',userRouter);
app.use('/about',aboutRouter);

// 404, 500 응답코드에 라우팅 처리 정의
app.use((req,res) => {
    res.status(404);
    res.send('404-페이지가 없어요')
})
app.use((err,req,res,next) => {
    res.status(500);
    res.send('500-서버 내부 오류 발생했어요!!')
})

// 위에서 설정한 내용을 토대로 express 서버 설정
app.listen(port,()=>{
    console.log('semiprojectV1 서버 실행중...')
});
