const oracledb = require('../models/Oracle')

let memberSql = {
    insertSql: 'insert into member(MNO,USERID,PASSWD,NAME,EMAIL) VALUES(MNO.nextval,:1,:2,:3,:4)',
    loginSql: ' select count(USERID) cnt from member where USERID = :1 and PASSWD = :2',
    selectOne: `select member.*, to_char(regdate, 'YYYY-MM-DD HH24:MI:SS') regdate2 from member where userid = :1`
}

class Member {
    constructor(uid, pwd, name, email) {
        this.uid = uid;
        this.pwd = pwd;
        this.name = name;
        this.email = email;
    }

    async insert () {
        let conn;
        let params = [this.uid,this.pwd,this.name,this.email]

        try{
            conn = await oracledb.makeConn();

            let result = await conn.execute(memberSql.insertSql,params);
            await conn.commit();
            if (result.rowsAffected>0) {
                console.log('회원정보 저장 성공!')
            }

        }catch(e){
            console.log(e);
        }finally {
            await oracledb.clossConn(conn);
        }
    }
    async login(uid,pwd) { //로그인 처리
        let conn;
        let params =[uid,pwd]
        let isLogin = 0;
        // console.log('uid와 pwd는?',uid,pwd); aa, aa이다

        try {
            conn = await oracledb.makeConn();
            // console.log(conn);
            let result = await conn.execute(
                memberSql.loginSql, params, oracledb.options
            )
            let rs = result.resultSet;

            let row;
            while((row = await rs.getRow())) {
                isLogin = await row.CNT; // 이 부분을 기다려야 한다.
            }
        } catch(e) {
            console.log(e);
        } finally {
            await oracledb.clossConn();
        }
        return isLogin;
    }

    async selectOne(uid) { // 아이디로 검색된 회원의 모든 정보 조회
        let conn;
        let params = [uid];
        let members = [];

        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(memberSql.selectOne,params,oracledb.options);
            let rs = result.resultSet;

            let row;
            while((row = await rs.getRow())) {
                let m = new Member(row.USERID,'',row.NAME,row.EMAIL);
                m.regdate = row.REGDATE2;
                members.push(m);
            }
        }catch(e){
            console.log(e);
        }finally{
            await oracledb.clossConn();
        }

        return members;
    }
}
module.exports = Member;