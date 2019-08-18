import { server } from "../lib/server_init";
import {ResponseToolkit} from '@hapi/hapi';
import { DescriptionAndTagQueryResponse } from "../account-client/lib/declarations";
import { queryUserViaUserID } from "../api_utils/user_queries";
import mysqlName from '../config/mysql_table_name.json';
import { asyncMysqlQuery } from "../lib/mysql_server_init";

async function descriptionAndTag(userIDStr:string,h:ResponseToolkit){
    let response:DescriptionAndTagQueryResponse = {
        status:'Unexpected Error',
    };
    try{
        let userID = Number(userIDStr);
        if(isNaN(userID)){
            response.status = 'Invalid';
            return h.response(response).code(400);
        }
        if(!await queryUserViaUserID(userID)){
            response.status = 'User Not Found';
            return h.response(response).code(404);
        }
        let queryStatement = `select * from ${mysqlName.table.personalize} where userid = ${userID}`;
        let res = await asyncMysqlQuery(queryStatement);
        if(res && res[0]){
            response.status = 'Success';
            let description = res[0].descript;
            let tag = res[0].tag;
            response.description = description;
            response.tag = tag;
            return h.response(response).code(200);
        }else{
            response.status = 'Success';
            return h.response(response).code(200);
        }
    }catch(e){
        console.log(e);
        response.status = 'Unexpected Error';
        return h.response(response).code(500);
    }
}

server.route({
    method:'*',
    path:'/api/description_tag/{userID}',
    handler:async(request,h)=>{
        return await descriptionAndTag(request.params.userID,h);
    }
});
console.log('notice[server]: Personalize Service Started.')