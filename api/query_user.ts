import { server } from "../lib/server_init";
import { UnValidated, QueryUserRequest, QueryUserResponse, QUERY_USER_REQUEST_QUERY_COL_USERNAME, QUERY_USER_REQUEST_QUERY_COL_USERID } from "../account-client/lib/declarations";
import { validate } from "../account-client/lib/query_user";
import { queryUserViaUsername, queryUserViaUserID } from "../api_utils/user_queries";
import { genderNum2genderStr } from "../api_utils/register_utils";
import {ResponseToolkit} from '@hapi/hapi';
import { responser } from "../api_utils/responser";

export async function queryUser(payload:UnValidated<QueryUserRequest>,h?:ResponseToolkit){
    let response:QueryUserResponse = {
        status:'Unexpected Error',
    }
    try{
        if(!validate(payload)){
            response = {
                status:'Invalid',
            }
            return responser(response,h,400);
        }
        let res;
        switch(payload.queryCol){
            case QUERY_USER_REQUEST_QUERY_COL_USERNAME:
                res = await queryUserViaUsername(payload.queryName as string);
                break;
            case QUERY_USER_REQUEST_QUERY_COL_USERID:
                res = await queryUserViaUserID(payload.queryName as number);
                break;
        }
        if(!res){
            response = {
                status:'User Not Found',
            }
            return responser(response,h,404);
        }
        // console.log(res);
        response = {
            status:'Success',
            user:{
                username:res.username,
                userID:res.userid,
                nickname:res.nickname,
                regTime:res.regtime.getTime(),
                gender:genderNum2genderStr(res.gender),
            }
        }
        if(res.birthdate){
            (response.user as any).birthdate = [
                res.birthdate.getFullYear(),
                res.birthdate.getMonth(),
                res.birthdate.getDate()
            ];
        }
        return responser(response,h,200);
    }catch(e){
        console.log(e);
        response = {
            status:'Unexpected Error',
        }
        return responser(response,h,500);
    }
}

server.route({
    method:'POST',
    path:'/api/user/query',
    handler:async (request,h)=>{
        return await queryUser(request.payload as UnValidated<QueryUserRequest>,h)
    },
});
console.log(`notice[server]: Query User Service Started.`);