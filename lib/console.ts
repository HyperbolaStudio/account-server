import readline from 'readline';
import { server } from './server_init';
import {stop as serverStop} from '../lib/server_init';
import { gen, show } from '../api_utils/invitecode_utils';
import mysqlName from '../config/mysql_table_name.json';
let c = {
    info:()=>{
        let uri = server.info.uri;
        let pid = process.pid;
        let start = server.info.started;
        console.log(`Program PID: ${pid}`);
        console.log(`Server started at ${(new Date(start)).toLocaleString()}`);
        console.log(`Server running at ${uri}`);
    },
    stop:()=>{
        serverStop()
    },
    async genInviteCode(n:number){
        console.log((await gen(n,mysqlName.table.registerInviteCode)).join('\n'));
    },
    async showInviteCode(n?:number){
        console.log((await show(mysqlName.table.registerInviteCode)).slice(0,n).join('\n'))
    }
}
const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout,
});
rl.on('line',(input)=>{
    try{
        eval(input); 
    }catch(e){
        console.log(`${e.name}: ${e.message}`);
    }
});