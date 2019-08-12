import {Lifecycle,ResponseToolkit,ResponseValue} from '@hapi/hapi'
import { querySession } from './session_utils';
import { AbstractResponse } from '../account-client/lib/declarations';
export function genRouterHandler<ResponseT extends AbstractResponse>(
    nLogin:ResponseT,
    uexpErr:ResponseT,
    responseHandler:(payload:any,user:number,h:ResponseToolkit)=>Promise<ResponseT|ResponseValue>
):Lifecycle.Method{
    return async (request,h)=>{
        const session = request.state.session;
        let user:number|null = 0;
        try{
            if(!session || !session.sessionID || !(user = await querySession(session.sessionID))){
                return h.response(nLogin).code(403);
            }else{
                return await responseHandler(request.payload,user,h);
            }
        }catch(e){
            return h.response(uexpErr).code(500);
        }
    }
}