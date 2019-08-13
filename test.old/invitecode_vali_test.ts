import {validate} from '../api_utils/invitecode_utils';
let test = [
    {
        category:'invitecode',
        v:'1aec3038fe4a35d7',
        res:true,
    },{
        category:'cxknmsl',
        v:'1aec3038fe4a35d7',
        res:false,
    },{
        category:'invitecode',
        v:'badc0ffee1234567',
        res:false,
    },{
        category:'invitecode',
        v:'2e5f9d350126cc56',
        res:true,
    }
]
async function t(){
    for(let x of test){
        try{
            if((await validate(x.v,x.category)) !== x.res){
                console.log('\u001b[41;37m Wrong Answer \u001b[0m');
            }else{
                console.log('\u001b[42;37m Accepted \u001b[0m')
            }
        }catch(e){
            if(x.res){
                console.log('\u001b[41;37m Wrong Answer \u001b[0m');
            }else{
                console.log('\u001b[42;37m Accepted \u001b[0m')
            }
        }
    }
}
t();