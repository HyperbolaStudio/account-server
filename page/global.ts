import { server } from "../lib/server_init";
import inert from '@hapi/inert';
import Boom from '@hapi/boom'
server.register(inert);
server.route({
    method:'GET',
    path:'/dist/{f*}',
    handler:(request,h)=>{
        return h.file(`./account-client/dist/${request.params.f}`);
    }
});
server.route({
    method:'GET',
    path:'/assets/{f*}',
    handler:(request,h)=>{
        return h.file(`./account-client/assets/${request.params.f}`);
    }
});
server.ext('onPreResponse',(request,h)=>{
    if((request.response as Boom).isBoom){
        let code = (request.response as Boom).output.payload.statusCode;
        if(request.path.split('/')[1]!='api'){
            return h.file(`./account-client/view/404.html`).code(code);
        }
    }
    return h.continue;
})
console.log('notice[server]: Global Page Service Started.')