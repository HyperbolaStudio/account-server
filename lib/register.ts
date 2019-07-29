import {Server} from '@hapi/hapi';
import inert from '@hapi/inert';
import {RegisterRequest,RegisterResponse} from '../account-client/lib/declarations';
import {user} from '../account-client/lib/regexp';
import mysql from 'mysql';
import mysqlUser from '../secret/mysql_user.json';
import {insertNewUser,genderStr2genderNum} from './sql_statements';
import {queryUserViaUsername} from './user_queries'
const mysqlConnection = mysql.createConnection({
    ...mysqlUser,
    host:'localhost',
    database:'users'
})
type UnValidatedRegisterRequest = {
    [P in keyof RegisterRequest]?:RegisterRequest[P];
}
const server = new Server({
    port:3000,
    host:'localhost',
})
server.route({
    method:'POST',
    path:'/register',
    handler:(request,h) => {
        const {payload} = (request as {payload:UnValidatedRegisterRequest});
        if(payload.username && payload.passwordSHA256 && payload.inviteCode){
            if(!(user.username.regexp.test(payload.username)))
            if(queryUserViaUsername(payload.username)){
                h.response({
                    status:'User Already Registered',
                    userid:-1,
                })
            }
            payload.nickname = payload.nickname?payload.nickname:payload.username;
            let genderNum = genderStr2genderNum(payload.gender);
            mysqlConnection.query(insertNewUser(payload.username,payload.passwordSHA256,payload.nickname,genderNum,payload.birthDate),(err,res,field)=>{
                if(err){
                    h.response({
                        status:'Unexpected Error',
                        userid:-1,
                    })
                    throw err;
                }
                h.response({
                    status:'Success',
                    userid:res.insertID,
                });
            });
        }else{
            h.response({
                status:'Invalid',
                userid:-1,
            })
        }
        return '';
    }
});
const init = async () => {
    await server.start();
    console.log(`Server running at ${server.info.uri}`)
    mysqlConnection.connect((err)=>{
        if(err){
            throw err;
        }
    });
    console.log(`mysql connected.`)
}
init();
process.on('exit',() => {
    server.stop();
    console.log('Server stops.');
    mysqlConnection.end();
    console.log('MySQL stops.');

})