import framework from '@tradercore/framework';
import chalk from 'chalk';
import { program } from 'commander';
import figlet from 'figlet';
import { usersCommand as setupUsersCommand } from './users.command.js';

const title = chalk.blueBright(figlet.textSync('TraderCore'));

console.log(title);

program
    .name('tradercore')
    .version(framework.version)
    .description(`Powering all things Trader: ${framework.version}`)
    .option('-a, --auth <type>', 'Authenticate with tradercore')
    .option('-u, --url <type>', 'tradercore API URL');

setupUsersCommand();

program.parse(process.argv);
