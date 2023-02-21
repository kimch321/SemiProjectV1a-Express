let updatebtn = document.querySelector('#updatebtn');
let deletebtn = document.querySelector('#deletebtn');
let bno = document.querySelector('#bno').value;
let uid = document.querySelector('#uid').value;

updatebtn?.addEventListener('click', () => {
    location.href = '/board/update?bno=' + bno;
});
deletebtn?.addEventListener('click', () => {
    if (confirm('정말로 삭제하시겠습니까?'))
        location.href = '/board/delete?bno=' + bno + '&uid=' + uid;
});