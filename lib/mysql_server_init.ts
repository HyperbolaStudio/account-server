import mysql from 'mysql';
import mysqlUser from '../config/mysql_user.json';
import mysqlName from '../config/mysql_table_name.json';
export const mysqlConnection = mysql.createConnection({
    ...mysqlUser,
    host:'localhost',
    database:mysqlName.database,
});
export function mysqlInit(){
    mysqlConnection.connect((err)=>{
        if(err){
            throw err;
        }
        console.log(`mysql connected.`);
    });
}
export async function mysqlStop(){
    return new Promise<void>((resolve,reject)=>{
        mysqlConnection.end((err)=>{
            if(err)reject(err);
            console.log('MySQL stops.');
            resolve();
        });
    })
}
export function asyncMysqlQuery(statement:string):Promise<any>{
    return new Promise((resolve,reject)=>{
        mysqlConnection.query(statement,(err,res,field)=>{
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        })
    })
}