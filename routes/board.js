const express = require("express");
const router = express.Router();
const path = require('path');
const oracledb = require('../models/Oracle')
const Board = require('../models/Board')

router.get('/write',(req,res)=> {
    res.render('board/write',{title : '새 글쓰기'})
})

router.post('/write',async (req,res)=> {
    let viewName = '/board/failWrite';
    let {title, uid, contents} = req.body
    // console.log(title, uid, contents);

    // 문제 insert작업이 끝나기 전에 redirect 되고 있다.;;;
    // 해결함.
    let rowcnt = new Board(title, uid, contents)
        .insert().then((result) => result);
    if (await rowcnt > 0) viewName = '/board/list'

    res.redirect(303,viewName);
})

router.get('/list',async (req,res)=> {
    let board = new Board().select().then(async (result) => {return await result});
    // console.log(await board)

    res.render('board/list',{title : '게시판 목록',board: await board})
})
router.get('/view',async (req,res)=> {
    let bno = req.query.bno
    // console.log(bno);
    let views = new Board().selectOne(bno).then(async (result) => {return result});
    res.render('board/view',{title : '게시판 본문보기', views: await views});
});

// 아직 없는 페이지
// router.get('/delete',(req,res)=> {
//     res.sendFile(path.join(__dirname,'../public','delete.html'));
// })
// router.get('/update',(req,res)=> {
//     res.sendFile(path.join(__dirname,'../public','update.html'));
// })


module.exports = router;