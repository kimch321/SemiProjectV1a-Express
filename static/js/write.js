let frm = document.write; // 이 자리는 폼의 이름이 온다.
let bno = document.querySelector('#bno').value;
function processWrite () {
    if (frm.title.value === '') alert('제목을 입력하세요');
    else if (frm.contents.value === '') alert('본문을 입력하세요')
    else {
    frm.method = 'post';
    frm.enctype = 'application/x-www-form-urlencoded';
    frm.submit();
    }
}
    let writebtn = document.querySelector('#writebtn');
    writebtn.addEventListener('click',processWrite);

function processDelete() {
    if (confirm('정말로 삭제하시겠습니까?'))
        location.href=`/board/delete?bno=`
}

    let deletebtn = document.querySelector('#deletebtn');
    deletebtn?.addEventListener('click',processDelete);

