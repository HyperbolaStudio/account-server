import { removeCode, gen, show } from "../lib/invitecode_utils";
async function test(){
    let a = await gen(10,'invitecode');
    let b = await gen(10,'invitecode');
    let all = [...a,...b];
    let c = await show('invitecode');
    for(let x of all){
        if(x !in c){
            throw new Error('\u001b[41;37m Wrong Answer \u001b[0m')
        }
        removeCode(x,'invitecode');
    }
}
test();
console.log('\u001b[42;37m Accepted \u001b[0m');
process.exit(0);
