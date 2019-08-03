import {addFollow,removeFollow} from '../lib/follow_utils';
async function t(){
    await addFollow(41,40);
    await addFollow(40,41);
    await removeFollow(40,41);
}
t().then(()=>{
    console.log('Accepted');
});