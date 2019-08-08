import { server } from "../lib/server_init";
import { UnValidated, QueryUserRequest, QueryUserResponse, QUERY_USER_REQUEST_QUERY_COL_USERNAME, QUERY_USER_REQUEST_QUERY_COL_USERID } from "../account-client/lib/declarations";
import { validate } from "../account-client/lib/query_user";
import { queryUserViaUsername, queryUserViaUserID } from "../api_utils/user_queries";
import { genderNum2genderStr } from "../api_utils/register_utils";

export async function queryUser(payload:UnValidated<QueryUserRequest>){
    let response:QueryUserResponse = {
        status:'Unexpected Error',
    }
    try{
        if(!validate(payload)){
            response = {
                status:'Invalid',
            }
            return response;
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
            return response;
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
        return response;
    }catch(e){
        console.log(e);
        response = {
            status:'Unexpected Error',
        }
        return response;
    }
}

server.route({
    method:'POST',
    path:'/api/user/query',
    handler:async (request,h)=>{
        return await queryUser(request.payload as UnValidated<QueryUserRequest>)
    },
});
console.log(`notice[server]: Query User Service Started.`);