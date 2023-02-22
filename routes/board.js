const express = require("express");
const router = express.Router();
const path = require('path');
const oracledb = require('../models/Oracle')
const Board = require('../models/Board')
const session = require("express-session");

router.get('/write',(req,res)=> {
    if (!req.session.userid) {
        res.redirect(303,'/member/login');

    } else{
        res.render('board/write',{title : '새 글쓰기'})
    }
})

router.post('/write',async (req,res)=> {
    let viewName = '/board/failWrite';
    let {title, uid, contents} = req.body

    let rowcnt = new Board(null,title,uid,null,contents,null)
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
    let bds = new Board().selectOne(bno).then(async (result) => {return result});
    // console.log('bds는?',await bds)
    res.render('board/view',{title : '게시판 본문보기', bds: await bds});
});

router.get('/delete',async (req,res) => {
    let {bno, uid} = req.query;
    let suid =req.session.userid;

    // console.log('bno',bno,'uid',uid,'suid',suid)
    if (suid && uid &&(suid == uid)) {
        await new Board().delete(bno).then(cnt => cnt);
    }

    res.redirect(303, '/board/list')
});

router.get('/update',async (req, res) => {
    let {bno, uid} = req.query;
    let suid = req.session.userid;
    console.log('uid?',uid,'suid?',suid,'bno',bno);

    if (uid && suid && (uid == suid)) {
        let bds = new Board().selectOne(bno).then(bds => bds);
        res.render('board/update', {title: '게시판 수정하기', bds: await bds});
    } else {
        res.redirect(303, '/board/list');
    }
});

router.post('/update',(req,res)=>{
    let { title, uid, contents} = req.body;
    let bno = req.query.bno;
    let suid = req.session.userid;

    if (uid && suid && (uid == suid)) {
        new Board(bno,title, uid, 0,contents, 0).update().then(cnt =>cnt);
        res.redirect(303, `/board/view?bno=${bno}`);
    } else {
        res.redirect(303, '/board/list');
    }

})




module.exports = router;