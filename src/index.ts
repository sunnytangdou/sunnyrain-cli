import { Command } from 'commander';
import { version } from '../package.json'
import { create } from './command/create';
import { update } from './command/update';


const program = new Command('sunnyrain');
program
    .version(version, '-v, --version');
program
    .command('create')
    .description('creact a new project')
    .argument('[name]', 'project name')
    .action(async (dirName) => {
        // 添加create方法
        await create(dirName);
    });
program
    .command('update')
    .description('update cli')
    .action(async () => {
        // 添加create方法
        await update();
    });
program.parse();