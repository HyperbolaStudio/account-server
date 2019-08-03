import { FollowRequest, FollowResponse, GetFollowListResponse } from "../account-client/lib/declarations";
import { addFollow, removeFollow } from "./follow_utils";
import { server } from "./server_init";
import { querySession } from "./session_utils";
import { queryUserViaUserID } from "./user_queries";

type UnvalidatedFollowRequest = {
    [P in keyof FollowRequest]?:FollowRequest[P];
}
const FOLLOW = false;
const UNFOLLOW = true;
export async function follow(
    payload:UnvalidatedFollowRequest,
    followedBy:number,
    op:boolean,
){
    let response:FollowResponse = {
        status:'Unexpected Error',
    }
    if(!payload.targetID || payload.targetID == followedBy){
        response = {
            status:'Invalid',
        };
        return response;
    }
    try{
        if(!await queryUserViaUserID(payload.targetID)){
            response = {
                status:'Target User Not Exist',
            }
            return response;
        }
        if(op == FOLLOW){
            await addFollow(followedBy,payload.targetID);
        }else if(op == UNFOLLOW){
            await removeFollow(followedBy,payload.targetID);
        }
        response = {
            status:'Success',
        }
        return response;
    }catch(e){
        response = {
            status:'Unexpected Error',
        }
        return response;
    }
}
const FOLLOWING = false;
const FOLLOWED = true;
export async function getFollowList(
    user:number,
    op:boolean
){
    let response:GetFollowListResponse = {
        status:'Unexpected Error',
        list:[],
    }
    if(op == FOLLOWING){
        let res;
    }
}
server.route({
    method:'POST',
    path:'/api/follow',
    handler:async (request,h)=>{
        const session = request.state.session;
        let response:FollowResponse = {
            status:'Unexpected Error',
        }
        let followedBy:number|null = 0;
        if(!session || !session.sessionID || !(followedBy = await querySession(session.sessionID))){
            response = {
                status:'Not Logged In',
            }
            return response;
        }else{
            return await follow(request.payload as UnvalidatedFollowRequest,followedBy,FOLLOW);
        }
    }
});
server.route({
    method:'POST',
    path:'/api/unfollow',
    handler:async (request,h)=>{
        const session = request.state.session;
        let response:FollowResponse = {
            status:'Unexpected Error',
        }
        let followedBy:number|null = 0;
        if(!session || !session.sessionID || !(followedBy = await querySession(session.sessionID))){
            response = {
                status:'Not Logged In',
            }
            return response;
        }else{
            return await follow(request.payload as UnvalidatedFollowRequest,followedBy,UNFOLLOW);
        }
    }
});
console.log('notice[server]: Follow Service Started.');