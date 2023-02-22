const express = require('express');
const router = express.Router();
const Zipcode = require('../models/Zipcode');

router.get('/', async (req,res)=>{
    let sido = req.query.sido;
    let gugun = req.query.gugun;
    let dong = req.query.dong;

    let [guguns, dongs, zips] = [null,null,null]


    let sidos = new Zipcode().getSido().then(sido => sido);
    //console.log(await sidos);

    if (sido !== undefined)     // 시군구 검색
        guguns = new Zipcode().getGugun(sido).then(gugun => gugun);
    // console.log(await guguns);

    if (sido !== undefined && gugun !== undefined)      // 읍면동 검색
        dongs = new Zipcode().getDong(sido,gugun).then(dong => dong);
    // console.log(await dongs);

    if (sido !== undefined && gugun !== undefined && dong !== undefined)    // zipcode 검색
    zips = new Zipcode().getZipcode(sido,gugun,dong).then(zipcode=>zipcode);
    // console.log(await zips);

    res.render('zipcode',{title:'시군구동 찾기', sidos: await sidos, guguns: await guguns, dongs: await dongs, zips: await zips,
        sido : sido, gugun : gugun, dong : dong})

    // 서버사이드 랜더링의 단점은, 만약 동을 검색해야 한다면 시도와 시군구를 다시 검색해서 보여주게 된다. 이 경우엔 어쩔 방법은 없다.
});


module.exports = router;