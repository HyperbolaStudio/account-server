import ejs from 'ejs'
import { server } from '../lib/server_init';
import { queryUserViaUserID } from '../api_utils/user_queries';
import { sess } from '../page_utils/sess';
server.route({
    method:'GET',
    path:'/',
    handler:sess(async (request,h,userid)=>{
        let res = '';
        try{
            let isLoggedIn = false;
            let username = ''
            if(~userid){
                let user = await queryUserViaUserID(userid);
                if(user){
                    username = user.username;
                    isLoggedIn = true;
                }
            }
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
    })
});
console.log('notice[server]: Index Page Service Started.');