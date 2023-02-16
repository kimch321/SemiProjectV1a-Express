const express = require("express");
const router = express.Router();
const path = require('path');

router.get('/',(req,res)=> {
    res.render('index',{title:'첫화면'})
})



module.exports = router;  // 이 파일을 미들웨어로 만들어 준다.