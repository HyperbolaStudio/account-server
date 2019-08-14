import {Request,ResponseToolkit,Lifecycle} from '@hapi/hapi';
import { querySession } from '../api_utils/session_utils';
export function sess(handler:(request:Request,h:ResponseToolkit,userid:number)=>Lifecycle.ReturnValue):Lifecycle.Method{
    return async(request,h)=>{
        const session = request.state.session;
        let userid:number|null = 0;
        try{
            if(!session || !session.sessionID){
                userid = -1;
                h.state('session',{});
            }else if(!(userid = await querySession(session.sessionID))){
                userid = -1;
                h.state('session',{});
            }
        }catch(e){
            userid = -1;
        }
        return handler(request,h,userid);
    }
}