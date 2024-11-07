import { program } from 'commander';

function usersCommand() {
    program
        .command('users')
        .description('Manage users')
        .action(() => {
            console.log('Users');
        });
}

export { usersCommand };
