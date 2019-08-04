import {follow,getFollowList,getFollowAmount, FOLLOW, FOLLOWING, FOLLOWED, UNFOLLOW} from '../api/follow'
import {register} from '../api/register';
import { gen as genInviteCode } from '../api/invitecode_utils';
import { queryFollowingAmount } from '../api/follow_utils';
import { queryUserViaUserID, queryUserViaUsername } from '../api/user_queries';
let start = 0,end = 0;
async function t(maxn:number){
    let status;
    start = Date.now();
    let c = await genInviteCode(maxn,'invitecode');
    end = Date.now();
    console.log(`Gen ${maxn} invitecode, used ${end-start} ms`);
    start = Date.now();
    for(let i = 0;i<maxn;i++){
        register({
            username:`${i}aaa`,
            passwordSHA256:`a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3`,
            inviteCode:c[i],
        })
    }
    end = Date.now();
    console.log(`Register ${maxn} accounts, used ${end-start} ms`);
    start = Date.now();
    let users:number[] = [];
    for(let i = 0;i<maxn;i++){
        let x = await queryUserViaUsername(`${i}aaa`);
        console.log(x);
        if(x){
            users.push(x.userid);
        }else{
            console.log('\u001b[41;37m Wrong Answer \u001b[0m');
            throw new Error(i.toString());
        }
    }
    end = Date.now();
    console.log(`Queried ${maxn} accounts, used ${end-start} ms`);
    start = Date.now();
    for(let i = 0;i<maxn;i++){
        for(let j = 0;j<maxn;j++){
            if(i != j){
                if((status = await follow({targetID:users[j]},users[i],FOLLOW)).status!='Success'){
                    console.log('\u001b[41;37m Wrong Answer \u001b[0m');
                    throw new Error(status.status);
                }
            }
        }
    }
    end = Date.now();
    console.log(`${maxn} users followed ${maxn-1} users, used ${end-start} ms`);
    start = Date.now();
    for(let i = 0;i<maxn;i++){
        if((status = await getFollowAmount(users[i],FOLLOWING)).status!='Success'){
            console.log('\u001b[41;37m Wrong Answer \u001b[0m');
            throw new Error(status.status);
        }
    }
    end = Date.now();
    console.log(`Queried ${maxn} following amounts, used ${end-start} ms`);
    // start = Date.now();
    // for(let i = 0;i<maxn;i++){
    //     if((status = await getFollowList({offset:0,amount:100},users[i],FOLLOWED)).status!='Success'){
    //         console.log('\u001b[41;37m Wrong Answer \u001b[0m');
    //         console.log(status.status);
    //         throw new Error(status.status);
    //     }
    // }
    // end = Date.now();
    // console.log(`Queried ${maxn} following lists(amount 100), used ${end-start} ms`);
    start = Date.now();
    for(let i = 0;i<maxn;i++){
        for(let j = 0;j<maxn;j++){
            if(i != j){
                if((status = await follow({targetID:users[j]},users[i],UNFOLLOW)).status!='Success'){
                    console.log('\u001b[41;37m Wrong Answer \u001b[0m');
                    throw new Error(status.status);
                }
            }
        }
    }
    end = Date.now();
    console.log(`${maxn} users unfollowed ${maxn-1} users, used ${end-start} ms`);
}
console.log('test start');
let st = Date.now();
(async ()=>{
    console.log(await queryUserViaUsername(`0aa`));
    await t(10);
    let ed = Date.now();
    console.log(`total ${ed-st} ms`);
    console.log('\u001b[42;37m Accepted \u001b[0m');
    process.exit();
})();
