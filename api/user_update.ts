import { server } from "../lib/server_init";
import { genRouterHandler } from "../api_utils/sess_hadler";
import {UserCoreInfUpdateRequest as UserCoreInfUpdateRequest, UserUpdateResponse, UnValidated} from '../account-client/lib/declarations';
import {validate} from '../account-client/lib/user_coreinf_update';
import {ResponseToolkit} from '@hapi/hapi';

async function upadteCoreInf(userID:number,payload:UnValidated<UserCoreInfUpdateRequest>,h:ResponseToolkit){
    let response:UserUpdateResponse = {
        status:'Unexpected Error',
    };
    if(!validate(payload)){
        response = {
            status:'Invalid',
        };
        return h.response(response).code(400);
    }
    
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