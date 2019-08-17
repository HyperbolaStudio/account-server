import { server } from "../lib/server_init";
import { genRouterHandler } from "../api_utils/sess_hadler";
import { WhoamiResponse } from "../account-client/lib/declarations";

server.route({
    path:'/api/whoami',
    method:'*',
    handler:genRouterHandler<WhoamiResponse>(
        {status:'Not Logged In',userID:-1},
        {status:'Unexpected Error',userID:-1},
        async (payload,user,h)=>{
            return {status:'Success',userID:user};
        }
    )
});
console.log('notice[server]: Whoami Service Started.')