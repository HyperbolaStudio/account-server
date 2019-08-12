import { server } from "../lib/server_init";
import { genRouterHandler } from "../api_utils/sess_hadler";
import {UserCoreInfUpdateRequest as UserCoreInfUpdateRequest, UserUpdateResponse, UnValidated} from '../account-client/lib/declarations';

async function upadteCoreInf(payload:UnValidated<UserCoreInfUpdateRequest>){

}
server.route({
    method:'POST',
    path:'/api/user/update/coreinf',
    handler:genRouterHandler<UserUpdateResponse>(
        {status:'Not Logged In'},
        {status:'Unexpected Error'},
        async (payload,user,h)=>{
            return ''
        }
    )
})