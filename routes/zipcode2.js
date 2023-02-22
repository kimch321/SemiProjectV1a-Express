const express = require('express');
const router = express.Router();
const Zipcode = require('../models/Zipcode');

router.get('/', async (req,res)=>{
    res.render('zipcode2',{title:'시군구동 찾기 v2'})
});

router.get('/sido', async (req,res)=>{
    let sidos = new Zipcode().getSido().then(sido => sido);
    res.send(JSON.stringify(await sidos)) // 조회결과를 JSON으로 전송
});
// path variable
// REST API에서 사용하는 방식으로 경로를 변수로 사용하는 기법
// express 프레임워크에서 /:변수명 형식으로 사용함
// 변수값을 가져오려면 req.params. 변수명을 사용함

router.get('/gugun/:sido', async (req,res)=>{
    let sido = req.params.sido;
    let guguns = new Zipcode().getGugun(sido).then(gugun => gugun);

    res.send(JSON.stringify(await guguns)) // 조회결과를 JSON으로 전송
});

router.get('/dong/:sido/:gugun', async (req,res)=>{
    let {sido,gugun} = req.params;
    let dongs = new Zipcode().getDong(sido,gugun).then(dong => dong);

    res.send(JSON.stringify(await dongs)) // 조회결과를 JSON으로 전송
});

router.get('/zip/:sido/:gugun/:dong', async (req,res)=>{
    let {sido,gugun,dong} = req.params;
    let zips = new Zipcode().getZipcode(sido,gugun,dong).then(zips => zips);

    res.send(JSON.stringify(await zips)) // 조회결과를 JSON으로 전송
});

module.exports = router;