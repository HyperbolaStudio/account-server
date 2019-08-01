import commander from 'commander';
import { mysqlConnection } from './server_init';
import hash from 'hash.js'
commander
    .version('1.0.0')
    .command('gen [amount]','Generates invite code.')
    .command('show','Print invite code list to standard output.')
    .parse(process.argv);
const amount = commander.amount?commander.amount:1;
let arr:string[] = [];
for(let i = 0;i<amount;i++){
    let code = hash.sha256().update(Math.random().toString()).digest('hex').slice(0,16);
    arr.push(code);
    mysqlConnection.query(`insert into invitecode (code) values ('${code}')`,(err,res,field) => {
        if(err){
            console.log(err);
        }
        console.log(code);
    });
    console.log(`${i} invite code(s) generated.`);
}