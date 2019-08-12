import { FollowRequest, FollowResponse, GetFollowListResponse, GetFollowListRequest, GetFollowAmountResponse, UnValidated } from "../account-client/lib/declarations";
import { addFollow, removeFollow, queryFollowing, queryFollowed, queryFollowedAmount, queryFollowingAmount } from "../api_utils/follow_utils";
import { server } from "../lib/server_init";
import { queryUserViaUserID } from "../api_utils/user_queries";

import { qFollowListValidate, followValidate } from "../account-client/lib/follow";
import { genRouterHandler } from "../api_utils/sess_hadler";
import {ResponseToolkit,ResponseObject} from '@hapi/hapi'

export const FOLLOW = false;
export const UNFOLLOW = true;
export async function follow(
    payload:UnValidated<FollowRequest>,
    followedBy:number,
    op:boolean,
    h:ResponseToolkit
){
    let response:FollowResponse = {
        status:'Unexpected Error',
    }
    if(!followValidate(payload) || payload.targetID == followedBy){
        response = {
            status:'Invalid',
        };
        return h.response(response).code(400);
    }
    try{
        if(!await queryUserViaUserID(payload.targetID)){
            response = {
                status:'Target User Not Exist',
            }
            return h.response(response).code(404);
        }
        if(op == FOLLOW){
            await addFollow(followedBy,payload.targetID);
        }else if(op == UNFOLLOW){
            await removeFollow(followedBy,payload.targetID);
        }
        response = {
            status:'Success',
        }
        return h.response(response).code(200);
    }catch(e){
        console.log(e);
        response = {
            status:'Unexpected Error',
        }
        return h.response(response).code(500);
    }
}
export const FOLLOWING = false;//关注
export const FOLLOWED = true;//粉丝

export async function getFollowList(
    payload:UnValidated<GetFollowListRequest>,
    user:number,
    op:boolean,
    h:ResponseToolkit
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
            return h.response(response).code(400)
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
        return h.response(response).code(200);
    }catch(e){
        console.log(e);
        response = {
            status:'Unexpected Error',
            list:[],
        }
        return h.response(response).code(500)
    }
}
export async function getFollowAmount(user:number,op:boolean,h:ResponseToolkit){
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
        return h.response(response).code(200);
    }catch(e){
        console.log(e);
        response = {
            status:'Unexpected Error',
            amount:-1,
        }
        return h.response(response).code(500);
    }
}

server.route({
    method:'POST',
    path:'/api/follow',
    handler:genRouterHandler<FollowResponse>(
        {status:'Not Logged In'},
        {status:'Unexpected Error'},
        async (payload,user,h)=>{
            return await follow(payload,user,FOLLOW,h);
        }
    )
});
server.route({
    method:'POST',
    path:'/api/unfollow',
    handler:genRouterHandler<FollowResponse>(
        {status:'Not Logged In'},
        {status:'Unexpected Error'},
        async (payload,user,h)=>{
            return await follow(payload,user,UNFOLLOW,h);
        }
    )
});
server.route({
    method:'POST',
    path:'/api/follow/list/following',
    handler:genRouterHandler<GetFollowListResponse>(
        {status:'Not Logged In',list:[]},
        {status:'Unexpected Error',list:[]},
        async (payload,user,h)=>{
            return await getFollowList(payload,user,FOLLOWING,h);
        }
    )
});
server.route({
    method:'POST',
    path:'/api/follow/list/followed',
    handler:genRouterHandler<GetFollowListResponse>(
        {status:'Not Logged In',list:[]},
        {status:'Unexpected Error',list:[]},
        async (payload,user,h)=>{
            return await getFollowList(payload,user,FOLLOWED,h);
        }
    )
});
server.route({
    method:'POST',
    path:'/api/follow/amount/following',
    handler:genRouterHandler<GetFollowAmountResponse>(
        {status:'Not Logged In',amount:-1},
        {status:"Unexpected Error",amount:-1},
        async (payload,user,h)=>{
            return await getFollowAmount(user,FOLLOWING,h);
        }
    )
});
server.route({
    method:'POST',
    path:'/api/follow/amount/followed',
    handler:genRouterHandler<GetFollowAmountResponse>(
        {status:'Not Logged In',amount:-1},
        {status:"Unexpected Error",amount:-1},
        async (payload,user,h)=>{
            return await getFollowAmount(user,FOLLOWED,h);
        }
    )
})
console.log('notice[server]: Follow Service Started.');