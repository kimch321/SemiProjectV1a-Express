//진입점 파일
//
// 회원테이블 board
// bno, title, userid, regdate, views, contents
//
// 조건 : 조회수는 기본값 0 으로 셋팅
//
// 시퀀스 bno
//
// 1. 게시판 테이블 만들기 *
// 2. 새글 쓰기 이동하게 하기
// /board/write

// 3. 입력값 db로 전송하기 *
//
// 4. 게시판 글 클릭하면 게시글 확인 페이지로 이동하게 하기 *
//
//






// express 모듈과 기타 미들웨어 모듈 사용 선언
const express = require('express');
const path = require('path');
const logger = require('morgan');
const {engine} = require('express-handlebars');
const bodyParser = require('body-parser');
const oracle = require('./models/Oracle')

// 라우팅 모듈 설정
const indexRouter = require('./routes/index');
const memberRouter = require('./routes/member');
const boardRouter = require('./routes/board');

// express 객체 생성 및 포트 변수 선언
const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 등록 및 설정
app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
oracle.initConn();

// view 템플릿 엔진 설정
app.engine('hbs',engine({
    extname:'.hbs',
    defaultLayout:'layout',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        },
    },}))
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');

// 라우팅 없이 바로 호출 가능하도록 static 폴더 설정
app.use(express.static(path.join(__dirname,'static')));

// 라우팅 모듈 등록 - 클라이언트 요청 처리 핵심 파트
app.use('/',indexRouter);
app.use('/member',memberRouter);
app.use('/board',boardRouter);

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
