import { insertNewUserStatement } from "../api_utils/register_utils";
import { asyncMysqlQuery } from "../lib/mysql_server_init";

asyncMysqlQuery(insertNewUserStatement('van','1','v',2,[2019,8,16])).then(()=>{
    console.log('test');
});
