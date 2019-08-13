import { insertNewUser } from "../api_utils/register_utils";
import { asyncMysqlQuery } from "../lib/mysql_server_init";

asyncMysqlQuery(insertNewUser('iiii','aaa','aaa',2,[2017,4,14]));