import { FollowRequest, FollowResponse } from "../account-client/lib/declarations";
import { addFollow, removeFollow } from "./follow_utils";
import { server } from "./server_init";
import { querySession } from "./session_utils";

type UnvalidatedFollowRequest = {
    [P in keyof FollowRequest]?:FollowRequest[P];
}
export async function follow(payload:UnvalidatedFollowRequest,followedBy:number){
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
        await addFollow(followedBy,payload.targetID);
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
export async function unfollow(payload:UnvalidatedFollowRequest,followedBy:number){
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
        await removeFollow(followedBy,payload.targetID);
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
            return await follow(request.payload as UnvalidatedFollowRequest,followedBy);
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
            return await unfollow(request.payload as UnvalidatedFollowRequest,followedBy);
        }
    }
});
console.log('notice[server]: Follow Service Started.');