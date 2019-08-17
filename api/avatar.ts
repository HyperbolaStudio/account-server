import { server } from "../lib/server_init";
import url from 'url';
import querystring from 'querystring';
import { uploadConfig } from "../api_utils/upload_handler";
import { UpdateAvatarResponse } from "../account-client/lib/declarations";
import { genFileRouterHandler } from "../api_utils/sess_hadler";
import {FileReadable} from '../api_utils/upload_handler';
import gm from 'gm';
import { Readable } from "stream";
import path from 'path';
import fs from 'fs';
import {ResponseToolkit} from '@hapi/hapi';

const sizeList:ReadonlyArray<number> = [-1,240,100,60];

async function updateAvatar(userID:number,fileStream:FileReadable,h:ResponseToolkit){
    let response:UpdateAvatarResponse = {
        status:'Unexpected Error',
    }
    try{
        const avatarPath = `./data/avatar/${userID}/`;
        if(!fs.existsSync(avatarPath)){
            fs.mkdirSync(avatarPath);
        }
        await (function ():Promise<boolean>{
            return new Promise((resolve,reject)=>{
                let size0 = path.join(avatarPath,'0.png');
                gm(fileStream,fileStream.hapi.filename).write(size0,(err,stdout,stderr)=>{
                    if(err){
                        reject(err);
                    }
                    // stdout.pipe(size0);
                    (function f(i:number){
                        if(i>=sizeList.length){
                            resolve()
                            return;
                        }
                        let size = sizeList[i];
                        let filePath = path.join(avatarPath,`${i}.png`);
                        gm(size0).resize(size,size).write(filePath,(err)=>{
                            if(err){
                                reject(err);
                            }
                            f(i+1);
                        })
                    })(1);
                });
            });
        })();
    }catch(e){
        console.log(e);
        response={
            status:'Unexpected Error',
        }
        return h.response(response).code(500);
    }
    response={
        status:'Success',
    }
    return response;
}

server.route({
    method:'GET',
    path:'/api/avatar/{userID}',
    handler:(request,h)=>{
        let query = url.parse(request.path).query
        let queryObj = query?querystring.parse(query):null;
        let type = 0;
        if(queryObj){
            if(queryObj.type){
                let t = Number(queryObj.type)
                type = isNaN(t)?0:t;
            }
        }
        return h.file(`./data/avatar/${request.params.userID}/${type}.png`);
    }
});
server.route(uploadConfig(
    '/api/avatar/update',
    'POST',
    1<<20,
    ['avatar'],
    genFileRouterHandler<UpdateAvatarResponse>(
        {status:'Not Logged In'},
        {status:'Unexpected Error'},
        async (payload,user,h,updateStream)=>{
            if(updateStream.avatar instanceof Readable){
                return updateAvatar(user,updateStream.avatar,h);
            }
            return h.response({status:'Invalid'}).code(400);
        }
    )
));
console.log('notice[server]: Avatar Service Started.')