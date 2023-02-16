const express = require("express");
const router = express.Router();
const path = require('path');

router.get('/join',(req,res)=> {
    res.sendFile(path.join(__dirname,'../public','join.html'));
})

router.get('/login',(req,res)=> {
    res.sendFile(path.join(__dirname,'../public','login.html'));
})
router.get('/myinfo',(req,res)=> {
    res.sendFile(path.join(__dirname,'../public','/myinfo.html'));
})




module.exports = router;