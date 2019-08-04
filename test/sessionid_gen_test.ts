import {genSessionID} from '../api/session_utils';
async function t(){
    console.log(await genSessionID(40));
    console.log('\u001b[42;37m Accepted \u001b[0m');
}
t();