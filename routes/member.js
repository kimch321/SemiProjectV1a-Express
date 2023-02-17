const express = require("express");
const router = express.Router();
const path = require('path');
const Join = require('../models/Member')


router.get('/join',(req,res)=> {
    res.render('member/join',{title:'회원가입'})
})

router.post('/join',(req,res) => {
    // console.log(req.body);
    let {uid, pwd, name, email} = req.body;
    new Join(uid, pwd, name, email).insert();
    res.redirect(303,'/member/login');
})

router.get('/login',(req,res)=> {
    res.render('member/login',{title:'로그인'})
})
router.get('/myinfo',(req,res)=> {
    res.render('member/myinfo',{title:'내정보'})
})




module.exports = router;