const oracledb = require('../models/Oracle')
const session = require("express-session");
const ppg = 15;

let boardSql = {
    insertSql : 'insert into BOARD(BNO,TITLE,USERID,CONTENTS) VALUES(BNO.nextval,:1,:2,:3)',
    selectSql : `select BNO,TITLE,USERID,to_char(REGDATE,'YYYY-MM-DD') regdate,VIEWS FROM BOARD ORDER BY BNO DESC`,

    paging :`select * from (select BNO,TITLE,USERID,to_char(REGDATE,'YYYY-MM-DD') regdate,VIEWS, row_number() over (order by bno desc) rowno
    from BOARD`,
    paging2 :`) bd where rowno >= :1 and rowno < :2`,

    selectCount :'select count(bno) cnt from board',

    selectOneSql : `select TITLE,USERID,to_char(REGDATE,'YYYY-MM-DD HH:MI:SS') regdate,CONTENTS,VIEWS FROM BOARD WHERE BNO = :1`,
    viewOne: 'update BOARD set VIEWS = VIEWS + 1 where BNO = :1 ',
    update: 'update BOARD set TITLE = :1, contents = :2, regdate = current_timestamp where bno = :3',
    delete: 'delete from BOARD where BNO = :1'
}

// 동적쿼리 생성 함수
const makeWhere = (ftype,fkey) => {
    let where = ` where title = '${fkey}'`;
    if (ftype == 'userid') where = ` where userid = '${fkey}' `
    else if (ftype == 'contents') where = ` where contents like '%${fkey}%' `
    return where;
};


class Board {
    options = {
        resultSet: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT
    };

    constructor(bno, title, userid, regdate, contents, views) {
        this.bno = bno;
        this.title = title;
        this.userid = userid;
        this.regdate = regdate;
        this.contents = contents;
        this.views = views;
    }

    async insert () {
        let conn;
        let params = [this.title, this.userid, this.contents]
        let inserCnt = 0;
        try {
            conn = await oracledb.makeConn();

            let result = await conn.execute(boardSql.insertSql,params);
            await conn.commit();
            if (result.rowsAffected>0) {
                inserCnt = result.rowsAffected;
            }
        } catch(e) {
            console.log(e)
        } finally {
            await oracledb.clossConn(conn);
        }
        return inserCnt
    }

    async select (stnum,ftype,fkey) {
        let conn;
        let params = [stnum,stnum + ppg];
        let board=[]
        let allcnt;
        let where ='';

        if (fkey !== undefined) where = makeWhere(ftype, fkey);

        try {
            conn = await oracledb.makeConn();
            //console.log('conn1?',conn);

            allcnt = await this.selectCnt(where);
            let idx = allcnt - stnum +1
             // 총 게시글 수

            let result = await conn.execute(boardSql.paging+ where +boardSql.paging2,params,this.options);
            let rs = await result.resultSet;
            let row = null;
            while((row = await rs.getRow())) {
                // clob 데이터타입을 가져오는 방법
                // const clobTitle = row[1];
                // let title = "";
                // clobTitle.setEncoding("utf-8");
                // clobTitle.on("data", chunk => {
                //     title += chunk;
                // });
                // await new Promise(resolve => clobTitle.on("end", resolve));
                let a = new Board(row[0],row[1],row[2],row[3],'',row[4])
                a.idx = idx--
                board.push(a);
            }
        } catch(e) {
            console.log(e)
        } finally {
            await oracledb.clossConn(conn);
        }
        return board;
    }

    async selectCnt (where,ftype,fkey) { // 총 게시물 수 구하기
        let conn;
        let params = [];
        let cnt = -1;
        try {
            conn = await oracledb.makeConn();
            let result;
            if (fkey) {
                console.log(boardSql.selectCount + where);
                result = await conn.execute(boardSql.selectCount + where, params, this.options);
            } else {result = await conn.execute(boardSql.selectCount, params, this.options); }
            let rs = result.resultSet;
            let row = null;
            if ((row = await rs.getRow())){
                cnt = row
            } // 총 게시글 수
        } catch(e) {
            console.log(e)
        } finally {
            await oracledb.clossConn(conn);
        }
        return cnt;
    }

    async selectOne (bno) {
        let conn;
        let params = [bno]
        let views = [];

        try {
            conn = await oracledb.makeConn();

            let result = await conn.execute(boardSql.selectOneSql,params,this.options);

            let rs = await result.resultSet;

            let row;
            while((row = await rs.getRow())) {

                // clob 데이터타입을 가져오는 방법
                // const clobTitle = row[0];
                // let title = "";
                // clobTitle.setEncoding("utf-8");
                // clobTitle.on("data", chunk => {
                //     title += chunk;
                // });
                // await new Promise(resolve => clobTitle.on("end", resolve));


                // const clobContents = row[3];
                // let contents ="";
                // clobContents.setEncoding("utf-8");
                // clobContents.on("data", chunk => {
                //     contents += chunk;
                // });
                // await new Promise(resolve => clobContents.on("end", resolve));

                let view = new Board(bno,row[0],row[1],row[2],row[3],row[4])
                views.push(view);
            }

            await conn.execute(boardSql.viewOne, params);
            await conn.commit();
        } catch(e) {
            console.log(e)
        }
        return views;

    }
    async update() {
        let conn = null;
        let params = [this.title, this.contents, this.bno];
        let updatecnt = 0;

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardSql.update,params)
            await conn.commit();
            if (result.rowsAffected>0) {
                updatecnt = result.rowsAffected;
            }
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.clossConn();
        }

        return updatecnt;
    }

    async delete(bno) {
        let conn = null;
        let params = [bno];
        console.log('params?',params)
        let deletecnt = 0;
        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardSql.delete,params)
            await conn.commit();
            if (result.rowsAffected>0) {
               deletecnt = result.rowsAffected;
            }
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.clossConn();
        }
        return deletecnt;
    }
}

module.exports = Board;