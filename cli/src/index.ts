const framework = require('@tradercore/framework').default;
const chalk = require('chalk');
const { program } = require('commander');
const figlet = require('figlet');
const { usersCommand: setupUsersCommand } = require('./users.command');

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
