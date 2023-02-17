const express = require("express");
const router = express.Router();
const path = require('path');
const oracledb = require('../models/Oracle')
const Write = require('../models/Board')

router.get('/write',(req,res)=> {
    res.render('board/write',{title : '새 글쓰기'})
})

router.post('/write',(req,res)=> {
    let {title, uid, contents} = req.body
    // console.log(title, uid, contents);
    new Write(title, uid, contents).insert();

res.redirect(303,'/board/list');
})

router.get('/list',async (req,res)=> {
    let board = new Write().select().then(async (result) => {return await result});
    // console.log(await board)

    res.render('board/list',{title : '게시판 목록',board: await board})
})
router.get('/view',async (req,res)=> {
    let bno = req.query.bno
    // console.log(bno);
    let views = new Write().selectOne(bno).then(async (result) => {return await result});
    console.log(await views);
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