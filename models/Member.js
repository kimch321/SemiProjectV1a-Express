const oracledb = require('../models/Oracle')

class Join {
    insertSql = 'insert into member(MNO,USERID,PASSWD,NAME,EMAIL) VALUES(MNO.nextval,:1,:2,:3,:4)'
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

            let result = await conn.execute(this.insertSql,params);
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
}

module.exports = Join;