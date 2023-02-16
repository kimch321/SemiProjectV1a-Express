const express = require("express");
const router = express.Router();
const path = require('path');

router.get('/join',(req,res)=> {
    res.sendFile(path.join(__dirname,'../public','join.html'));
})
router.get('/list',(req,res)=> {
    res.sendFile(path.join(__dirname,'../public','list.html'));
})
router.get('/view',(req,res)=> {
    res.sendFile(path.join(__dirname,'../public','view.html'));
})
router.get('/delete',(req,res)=> {
    res.sendFile(path.join(__dirname,'../public','delete.html'));
})
router.get('/update',(req,res)=> {
    res.sendFile(path.join(__dirname,'../public','update.html'));
})


module.exports = router;