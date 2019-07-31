import mysql from 'mysql';
import mysqlUser from '../secret/mysql_user.json';
import {Server} from '@hapi/hapi';
import inert from '@hapi/inert';
const mysqlConnection = mysql.createConnection({
    ...mysqlUser,
    host:'localhost',
    database:'users'
});
const server = new Server({
    port:3000,
    host:'localhost',
});
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
export {mysqlConnection,server};