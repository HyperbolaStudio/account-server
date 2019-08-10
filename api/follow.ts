import { FollowRequest, FollowResponse, GetFollowListResponse, GetFollowListRequest, GetFollowAmountResponse, UnValidated } from "../account-client/lib/declarations";
import { addFollow, removeFollow, queryFollowing, queryFollowed, queryFollowedAmount, queryFollowingAmount } from "../api_utils/follow_utils";
import { server } from "../lib/server_init";
import { queryUserViaUserID } from "../api_utils/user_queries";

import { qFollowListValidate, followValidate } from "../account-client/lib/follow";
import { genRouterHandler } from "../api_utils/sess_hadler";

export const FOLLOW = false;
export const UNFOLLOW = true;
export async function follow(
    payload:UnValidated<FollowRequest>,
    followedBy:number,
    op:boolean,
){
    let response:FollowResponse = {
        status:'Unexpected Error',
    }
    if(!followValidate(payload) || payload.targetID == followedBy){
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
        console.log(e);
        response = {
            status:'Unexpected Error',
        }
        return response;
    }
}
export const FOLLOWING = false;//关注
export const FOLLOWED = true;//粉丝

export async function getFollowList(
    payload:UnValidated<GetFollowListRequest>,
    user:number,
    op:boolean
){
    let response:GetFollowListResponse = {
        status:'Unexpected Error',
        list:[],
    }
    try{
        if(!qFollowListValidate(payload)){
            response = {
                status:'Invalid',
                list:[],
            }
            return response
        }
        if(op == FOLLOWING){
            response = {
                status:'Success',
                list:await queryFollowing(user,payload.offset,payload.amount),
            }
        }else if(op == FOLLOWED){
            response = {
                status:'Success',
                list:await queryFollowed(user,payload.offset,payload.amount),
            }
        }
        return response;
    }catch(e){
        console.log(e);
        response = {
            status:'Unexpected Error',
            list:[],
        }
        return response
    }
}
export async function getFollowAmount(user:number,op:boolean){
    let response:GetFollowAmountResponse = {
        status:'Unexpected Error',
        amount:-1,
    }
    try{
        if(op == FOLLOWING){
            response = {
                status:'Success',
                amount:await queryFollowingAmount(user),
            }
        }else if(op == FOLLOWED){
            response = {
                status:'Success',
                amount:await queryFollowedAmount(user),
            }
        }
        return response;
    }catch(e){
        console.log(e);
        response = {
            status:'Unexpected Error',
            amount:-1,
        }
        return response;
    }
}

server.route({
    method:'POST',
    path:'/api/follow',
    handler:genRouterHandler<FollowResponse>(
        {status:'Not Logged In'},
        {status:'Unexpected Error'},
        async (payload,user)=>{
            return await follow(payload,user,FOLLOW);
        }
    )
});
server.route({
    method:'POST',
    path:'/api/unfollow',
    handler:genRouterHandler<FollowResponse>(
        {status:'Not Logged In'},
        {status:'Unexpected Error'},
        async (payload,user)=>{
            return await follow(payload,user,UNFOLLOW);
        }
    )
});
server.route({
    method:'POST',
    path:'/api/follow/list/following',
    handler:genRouterHandler<GetFollowListResponse>(
        {status:'Not Logged In',list:[]},
        {status:'Unexpected Error',list:[]},
        async (payload,user)=>{
            return await getFollowList(payload,user,FOLLOWING);
        }
    )
});
server.route({
    method:'POST',
    path:'/api/follow/list/followed',
    handler:genRouterHandler<GetFollowListResponse>(
        {status:'Not Logged In',list:[]},
        {status:'Unexpected Error',list:[]},
        async (payload,user)=>{
            return await getFollowList(payload,user,FOLLOWED);
        }
    )
});
server.route({
    method:'POST',
    path:'/api/follow/amount/following',
    handler:genRouterHandler<GetFollowAmountResponse>(
        {status:'Not Logged In',amount:-1},
        {status:"Unexpected Error",amount:-1},
        async (payload,user)=>{
            return await getFollowAmount(user,FOLLOWING);
        }
    )
});
server.route({
    method:'POST',
    path:'/api/follow/amount/followed',
    handler:genRouterHandler<GetFollowAmountResponse>(
        {status:'Not Logged In',amount:-1},
        {status:"Unexpected Error",amount:-1},
        async (payload,user)=>{
            return await getFollowAmount(user,FOLLOWED);
        }
    )
})
console.log('notice[server]: Follow Service Started.');