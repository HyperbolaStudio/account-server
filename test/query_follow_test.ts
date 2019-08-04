import { queryFollowing, queryFollowingAmount } from "../lib/follow_utils";
async function t(){
    let r = await queryFollowingAmount(41);
    console.log(r);
    process.exit();
}
t();
