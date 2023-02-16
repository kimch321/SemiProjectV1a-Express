const express = require("express");
const router = express.Router();
const path = require('path');

router.get('/join',(req,res)=> {
    res.render('member/join',{title:'회원가입'})
})

router.get('/login',(req,res)=> {
    res.render('member/login',{title:'로그인'})
})
router.get('/myinfo',(req,res)=> {
    res.render('member/myinfo',{title:'내정보'})
})




module.exports = router;