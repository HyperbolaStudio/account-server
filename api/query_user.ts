import { server } from "../lib/server_init";

server.route({
    method:'POST',
    path:'/api/user/query',
    handler:()=>'',
})