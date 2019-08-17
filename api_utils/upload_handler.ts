import {ServerRoute,Request,ResponseToolkit,Lifecycle} from '@hapi/hapi';
import { Readable } from "stream";

export type StreamMap = {[property:string]:FileReadable|string|undefined};
export type UploadHandler = (request:Request,h:ResponseToolkit,streams:StreamMap)=>Lifecycle.ReturnValue;

//extra implementation
export interface FileReadable extends Readable{
    hapi:{
        filename:string;
        headers:{
            'content-disposition':string;
            'content-type':string;
        }
    }
}

export function uploadConfig(
    path:string,
    method:string,
    maxBytes:number,
    uploadName:string[],
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
            let strms:StreamMap = {};
            for(let x of uploadName){
                let s = (request.payload as {[property:string]:FileReadable|undefined})[x];
                strms[x] = s;
            }
            
            return uploadHandler(
                request,
                h,
                strms
            )
        }
    }
}