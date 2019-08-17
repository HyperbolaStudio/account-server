import {Lifecycle,ResponseToolkit,ResponseValue} from '@hapi/hapi'
import { querySession } from './session_utils';
import { AbstractResponse } from '../account-client/lib/declarations';
import {Readable} from 'stream';
import { UploadHandler, StreamMap } from './upload_handler';
export type ResponseHandler<ResponseT> = ((payload:any,user:number,h:ResponseToolkit)=>Promise<ResponseT|ResponseValue>);
export function genRouterHandler<ResponseT extends AbstractResponse>(
    nLogin:ResponseT,
    uexpErr:ResponseT,
    responseHandler:ResponseHandler<ResponseT>
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
export type FileResponseHandler<ResponseT> = ((payload:any,user:number,h:ResponseToolkit,streams:StreamMap)=>Promise<ResponseT|ResponseValue>);
export function genFileRouterHandler<ResponseT extends AbstractResponse>(
    nLogin:ResponseT,
    uexpErr:ResponseT,
    responseHandler:FileResponseHandler<ResponseT>
):UploadHandler{
    return async (request,h,streams)=>{
        const session = request.state.session;
        let user:number|null = 0;
        try{
            if(!session || !session.sessionID || !(user = await querySession(session.sessionID))){
                return h.response(nLogin).code(403);
            }else{
                return await responseHandler(request.payload,user,h,streams);
            }
        }catch(e){
            console.log(e);
            return h.response(uexpErr).code(500);
        }
    }
}