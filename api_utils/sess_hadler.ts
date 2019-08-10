import {Lifecycle} from '@hapi/hapi'
import { querySession } from './session_utils';
export function genRouterHandler<ResponseT>(
    nLogin:ResponseT,
    uexpErr:ResponseT,
    responseHandler:(payload:any,user:number)=>Promise<ResponseT>
):Lifecycle.Method{
    return async (request,h)=>{
        const session = request.state.session;
        let user:number|null = 0;
        try{
            if(!session || !session.sessionID || !(user = await querySession(session.sessionID))){
                return nLogin;
            }else{
                return await responseHandler(request.payload,user);
            }
        }catch(e){
            return uexpErr;
        }
    }
}