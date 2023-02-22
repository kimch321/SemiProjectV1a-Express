const express = require('express');
const router = express.Router();
const Zipcode = require('../models/Zipcode');

router.get('/', async (req,res)=>{
    let sidos = new Zipcode().getSido().then(sido => sido);
    //console.log(await sidos);

    let guguns = new Zipcode().getGugun('서울').then(gugun => gugun);
    // console.log(await guguns);

    let dongs = new Zipcode().getDong('서울','강남구').then(dong => dong);
    // console.log(await dongs);

    let zipcodes = new Zipcode().getZipcode('서울','강남구','개포1동').then(zipcode=>zipcode);
    // console.log(await zipcodes);

    res.render('zipcode',{title:'시군구동 찾기', sidos: await sidos, guguns: await guguns, dongs: await dongs})
});


module.exports = router;