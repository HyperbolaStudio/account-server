import {Server} from '@hapi/hapi';
import inert from '@hapi/inert';
import { mysqlInit, mysqlStop } from './mysql_server_init';

const server = new Server({
    port:3000,
    host:'localhost',
});
async function init (){
    console.log((new Date()).toLocaleString());
    mysqlInit();
    await server.start();
    await server.register(inert);
    console.log(`Server running at ${server.info.uri}`)
}
export async function stop(){
    await mysqlStop();
    await server.stop();
    console.log('Server stops.');
    process.exit();
}
init();
// process.on('exit',() => {
//     stop();
// });
process.on('SIGINT',()=>{
    console.log('Received SIGINT signal.');
    stop();
});
process.on('exit',()=>{
    stop();
})
export {server};
export {mysqlConnection} from './mysql_server_init';