import ejs from 'ejs'
import { server } from '../lib/server_init';
import { querySession } from '../api_utils/session_utils';
import { queryUserViaUserID } from '../api_utils/user_queries';
server.route({
    method:'GET',
    path:'/',
    handler:async (request,h)=>{
        let isLoggedIn = true;
        const session = request.state.session;
        let userid:number|null = 0;
        let username = '';
        try{
            if(!session || !session.sessionID || !(userid = await querySession(session.sessionID))){
                isLoggedIn = false;
            }else{
                let u = await queryUserViaUserID(userid)
                if(u){
                    username = u.username;
                }else{
                    throw new Error();
                }
            }
        }catch(e){
            isLoggedIn = false;
        }
        let res = '';
        try{
            res = await ejs.renderFile('./account-client/view/page/index.ejs',{
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
            return h.response().code(500);
        }
        // console.log(res);
        return res;
    }
})
console.log('notice[server]: Index Page Service Started.')