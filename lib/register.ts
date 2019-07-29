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
            if(queryUserViaUsername(payload.username)){
                return {
                    status:'User Already Registered',
                    userid:-1,
                }
            }
            payload.nickname = payload.nickname?payload.nickname:payload.username;
            let genderNum = genderStr2genderNum(payload.gender);
            mysqlConnection.query(insertNewUser(payload.username,payload.passwordSHA256,payload.nickname,genderNum,payload.birthDate));
        }else{
            return {
                status:'Invalid',
                userid:-1,
            }
        }
        return '';
    }
})