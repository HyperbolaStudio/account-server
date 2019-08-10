import ejs from 'ejs'
import { server } from '../lib/server_init';
import { readFile } from 'fs';
import { querySession } from '../api_utils/session_utils';
import { queryUserViaUserID } from '../api_utils/user_queries';
server.route({
    method:'GET',
    path:'/',
    handler:async (request,h)=>{
        console.log(1);
        let isLoggedIn = true;
        const session = request.state.session;
        let userid:number|null = 0;
        let username = '';
        try{
            console.log(2);
            if(!session || !session.sessionID || !(userid = await querySession(session.sessionID))){
                isLoggedIn = false;
            }else{
                console.log(3);
                let u = await queryUserViaUserID(userid)
                console.log(4);
                if(u){
                    username = u.username;
                }else{
                    console.log(5);
                    throw new Error();
                }
            }
        }catch(e){
            console.log(6);
            isLoggedIn = false;
        }
        console.log(7);
        let res = '';
        try{
            res = await ejs.renderFile('./account-client/view/index.ejs',{
                titleBar:{
                    logoSrc:'/assets/logo0.svg',
                    title:'破站',
                    navItems:[{
                        innerText:'主页',
                        id:'homepage',
                        href:'/',
                    },{
                        innerText:'动态',
                        id:'trend',
                        href:'/trend',
                    },{
                        innerText:'-1娘的破站',
                        id:'nega1',
                        href:'https://nega1.hyperbola.studio/',
                    },{
                        innerText:'关于',
                        id:'about',
                        href:'/about',
                    }],
                },
                isLoggedIn,
                userInf:{
                    userid,
                    username,
                },
            });
        }catch(e){
            console.log(e);
        }
        
        console.log(res);
        return res;
    }
})
console.log('notice[server]: Index Page Service Started.')