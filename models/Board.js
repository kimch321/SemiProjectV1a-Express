const oracledb = require('../models/Oracle')

class Write {
    options = {
        resultSet: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT
    };
    insertSql = `insert into BOARD(BNO,TITLE,USERID,CONTENTS) VALUES(BNO.nextval,:1,:2,:3)`
    selectSql = `select BNO,TITLE,USERID,to_char(REGDATE,'YYYY-MM-DD') regdate,VIEWS FROM BOARD ORDER BY BNO DESC`
    selectOneSql = `select TITLE,USERID,to_char(REGDATE,'YYYY-MM-DD HH:MI:SS') regdate,CONTENTS,VIEWS FROM BOARD WHERE BNO = :1`
    constructor(title, uid, contents) {
        this.title = title;
        this.uid = uid;
        this.contents = contents;
    }

    async insert () {
        let conn;
        let params = [this.title, this.uid, this.contents]

        try {
            conn = await oracledb.makeConn();

            let result = await conn.execute(this.insertSql,params);
            await conn.commit();
            if (result.rowsAffected>0) {
                console.log('게시글 저장 성공')
            }
        } catch(e) {
            console.log('e')
        } finally {
            await oracledb.clossConn(conn);
        }

    }

    async select () {
        let conn;
        let result;
        let board = [];

        try {
            conn = await oracledb.makeConn();

            result = await conn.execute(this.selectSql,[],this.options);
            let rs = await result.resultSet;
            let row;
            while((row = await rs.getRow())) {

                // clob 데이터타입을 가져오는 방법
                const clobTitle = row[1];
                let title = "";
                clobTitle.setEncoding("utf-8");
                clobTitle.on("data", chunk => {
                    title += chunk;
                });
                await new Promise(resolve => clobTitle.on("end", resolve));

                let write = new Write(title,row[2])
                write.bno = row[0];
                write.regdate = row[3];
                write.views = row[4];
                // console.log(write);
                board.push(write);
            }
        } catch(e) {
            console.log(e)
        } finally {
            await oracledb.clossConn(conn);
        }
        return await board;
    }

    async selectOne (bno) {
        let conn;
        let result;
        let views = [];

        try {
            conn = await oracledb.makeConn();

            result = await conn.execute(this.selectOneSql,[bno],this.options);
            // console.log(result);
            let rs = await result.resultSet;
            let row;
            while((row = await rs.getRow())) {

                // clob 데이터타입을 가져오는 방법
                const clobTitle = row[0];
                let title = "";
                clobTitle.setEncoding("utf-8");
                clobTitle.on("data", chunk => {
                    title += chunk;
                });
                await new Promise(resolve => clobTitle.on("end", resolve));


                const clobContents = row[3];
                let contents ="";
                clobContents.setEncoding("utf-8");
                clobContents.on("data", chunk => {
                    contents += chunk;
                });
                await new Promise(resolve => clobContents.on("end", resolve));

                let view = new Write(title,row[1],contents)
                view.regdate = row[2];
                view.views = row[4];
                // console.log(write);
                views.push(view);
            }
        } catch(e) {
            console.log(e)
        } finally {
            await oracledb.clossConn(conn);
        }
        return await views;

    }
}

module.exports = Write;