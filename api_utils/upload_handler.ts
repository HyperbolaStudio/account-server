import { server } from "../lib/server_init";
import {ServerRoute,Request,ResponseToolkit,Lifecycle} from '@hapi/hapi';
import { Readable } from "stream";

type UploadHandler = (request:Request,h:ResponseToolkit,uploadStream:Readable)=>Lifecycle.ReturnValue;

export function uploadConfig(
    path:string,
    method:string,
    maxBytes:number,
    uploadName:string,
    uploadHandler:UploadHandler
):ServerRoute{
    return {
        path,
        method,
        options:{
            payload:{
                output:'stream',
                maxBytes,
            }
        },
        handler:(request,h)=>{
            let s = (request.payload as {[property:string]:Readable|undefined})[uploadName];
            if(!s){
                throw new Error(`Key "${uploadName}" doesn't exist in request payload.`);
            }
            return uploadHandler(
                request,
                h,
                s
            )
        }
    }
}