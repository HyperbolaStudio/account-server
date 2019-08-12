import {ResponseToolkit,ResponseValue} from '@hapi/hapi';
export function responser(response:ResponseValue,h:ResponseToolkit|undefined,code:number){
    if(h){
        return h.response(response).code(code);
    }else{
        return response;
    }
}