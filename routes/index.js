const express = require("express");
const router = express.Router();
const path = require('path');

router.get('/',(req,res)=> {
    res.sendFile(path.join(__dirname,'../public','index.html'));
})



module.exports = router;  // 이 파일을 미들웨어로 만들어 준다.