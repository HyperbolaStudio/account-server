import { queryFollowing, queryFollowingAmount } from "../api_utils/follow_utils";
async function t(){
    let r = await queryFollowingAmount(41);
    console.log(r);
    process.exit();
}
t();
