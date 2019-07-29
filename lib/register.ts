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
        console.log(`notice[new request]: ${request.info.id}`);
        const {payload} = (request as {payload:UnValidatedRegisterRequest});
        if(payload.username && payload.passwordSHA256 && payload.inviteCode){
            if(!(user.username.regexp.test(payload.username)))
            if(queryUserViaUsername(payload.username)){
                console.log(`notice[err status]: user ${payload.username} already exists`)
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
                console.log(`notice[new user]: ${payload.username}`);
                h.response({
                    status:'Success',
                    userid:res.insertID,
                });
            });
        }else{
            console.log(`notice[err status]: invalid value by user ${payload.username}`);
            h.response({
                status:'Invalid',
                userid:-1,
            })
        }
        return '';
    }
});
server.route({
    method:'GET',
    path:'/register',
    handler:(request,h)=>{
        return h.file('./account-client/test/testpage.html');
    }
})
async function init (){
    mysqlConnection.connect((err)=>{
        if(err){
            throw err;
        }
    });
    console.log(`mysql connected.`)
    await server.start();
    await server.register(inert);
    console.log(`Server running at ${server.info.uri}`)
}
async function stop(){
    mysqlConnection.end();
    console.log('MySQL stops.');
    await server.stop();
    console.log('Server stops.');
}
init();
process.on('exit',() => {
    stop();
});
// process.on('SIGINT',()=>{
//     stop();
// })