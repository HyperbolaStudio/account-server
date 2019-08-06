import commander from 'commander';
import { gen, show } from './invitecode_utils';
commander
    .version('1.0.0')
    .option('-c,--category <category>','Invite code category')
    .command('gen [amount]','Generates invite code.')
    .action(async (amount?)=>{
        let i = 0;
        for(let x of (await gen(amount,commander.category))){
            console.log(x);
            i++;
        }
        console.log(`${i} invite code generated in '${commander.category}.'`)
    })
    .command('show','Print invite code list to standard output.')
    .action(async ()=>{
        for(let x of (await show(commander.category))){
            console.log(x);
        }
    })
    .parse(process.argv);
