const express = require("express");
const router = express.Router();
const path = require('path');
const Member = require('../models/Member')


router.get('/join',(req,res)=> {
    res.render('member/join',{title:'회원가입'})
})

router.post('/join',(req,res) => {
    // console.log(req.body);
    let {uid, pwd, name, email} = req.body;
    new Member(uid, pwd, name, email).insert();
    res.redirect(303,'/member/login');
})

router.get('/login',(req,res)=> {
    res.render('member/login',{title:'로그인'})
})

router.post('/login',async (req,res) =>{
    let {uid, pwd} = req.body;
    let viewName = '/member/loginFail'; // 아직 구현되지 않았다.

    let isLogin = await new Member().login(uid,pwd)
        .then(result => result);
        // console.log('result는?',isLogin)
    if (isLogin > 0) {
        viewName = '/member/myinfo';
        req.session.userid = uid; // 아이디를 세션변수로 등록
        // console.log(uid);
        // console.log(req.session.userid);

        res.redirect(303, viewName);
    }
})

// 로그 아웃시 세션 끊김
router.get('/logout', (req, res) => {
    req.session.destroy(() => req.session);

    res.redirect(303, '/');
});


router.get('/myinfo',async (req,res)=> {
    if(req.session.userid) {
        let member = new Member()
            .selectOne(req.session.userid)
            .then(mb=>mb);
        res.render('member/myinfo',{title:'내정보', mb: await member})
        // console.log(await member);
    } else {
        res.redirect(303,'/member/login');
    }
})




module.exports = router;