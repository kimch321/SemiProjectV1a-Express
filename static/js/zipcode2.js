let sido = document.querySelector('#sido');
let gugun = document.querySelector('#gugun');
let dong = document.querySelector('#dong');
let zipcode = document.querySelector('#zipcode');

const maketag = (elm, text, tag) => {
    let opt = document.createElement(tag);
    let txt = document.createTextNode(text);
    opt.appendChild(txt);
    elm.appendChild(opt);
};
const setSido = (sidos) => {
    let objs = JSON.parse(sidos); // 문자열 => 객체로 바꿈
    // console.log(objs);

    objs.forEach((obj, idx)=>{
        maketag(sido, obj.sido, 'option');
    })
};
const getSido = () => { // 서버에 시도 데이터를 요청
    fetch('/zipcode2/sido')
        .then(response => response.text())
        .then(text => setSido(text));
};

const setGugun = (guguns) => {
    let objs = JSON.parse(guguns);
    objs.forEach((obj, idx) => {
        maketag(gugun, obj.gugun,'option');
    })
}
const getGugun = () => { // 서버에 구군 데이터를 요청
    fetch(`/zipcode2/gugun/${sido.value}`)
        .then(response => response.text())
        .then(text => setGugun(text))
    while(gugun.lastChild) {
        gugun.removeChild(gugun.lastChild);
    }
    maketag(gugun, '-- 시군구 --','option')
    while(dong.lastChild) {
        dong.removeChild(dong.lastChild);
    }
    maketag(dong, '-- 읍면동 --','option')
    while(zipcode.lastChild) {
        zipcode.removeChild(zipcode.lastChild);
    }
};
const setDong = (dongs) => {
    let objs = JSON.parse(dongs);
    objs.forEach((obj, idx) => {
        maketag(dong, obj.dong,'option');
    })
}
const getDong = () => {
    fetch(`/zipcode2/dong/${sido.value}/${gugun.value}`)
        .then(response => response.text())
        .then(text => setDong(text))
    while(dong.lastChild) {
        dong.removeChild(dong.lastChild);
    }
    maketag(dong, '-- 읍면동 --','option')
    while(zipcode.lastChild) {
        zipcode.removeChild(zipcode.lastChild);
    }
};
const setZip = (zips) => {
    let objs = JSON.parse(zips);
    objs.forEach((obj,idx)=>{
        // if (obj.ri === null) obj.ri = ''
        // if (obj.bunji === null) obj.bunji = ''
        maketag(zipcode,`${obj.zipcode} ${obj.sido}시 ${obj.gugun} ${obj.dong} ${obj.ri} ${obj.bunji}`,'p');
    })
}
const getZip = () => {
    fetch(`/zipcode2/zip/${sido.value}/${gugun.value}/${dong.value}`)
        .then(response => response.text())
        .then(text => setZip(text))
    while(zipcode.lastChild) {
        zipcode.removeChild(zipcode.lastChild);
    }
};

getSido();

sido.addEventListener('change',getGugun);
gugun.addEventListener('change',getDong);
dong.addEventListener('change',getZip);

// 클라이언트 사이드 렌더링은 서버 부하를 줄여주지만 검색엔진에 노출되기 어렵다는 단점이 있다.
