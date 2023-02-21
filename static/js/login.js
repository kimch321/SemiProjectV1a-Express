const proccessLogin = () => {
    let frm = document.login;
    if (frm.uid.value === '') alert('아이디는?');
    else if (frm.pwd.value === '') alert('비밀번호는?');
    else {
        frm.method = 'post';
        frm.submit();
    }
};

let loginbtn = document.querySelector('#loginbtn');
loginbtn.addEventListener('click', proccessLogin);
