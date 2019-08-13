import {queryUser} from '../api/query_user';
import { QUERY_USER_REQUEST_QUERY_COL_USERNAME, QUERY_USER_REQUEST_QUERY_COL_USERID } from '../account-client/lib/declarations';
(async ()=>{
    let res = await queryUser({
        queryName:`0aaa`,
        queryCol:QUERY_USER_REQUEST_QUERY_COL_USERNAME,
    });
    console.log(res);
    res = await queryUser({
        queryName:2850,
        queryCol:QUERY_USER_REQUEST_QUERY_COL_USERID,
    })
    console.log(res);
})();