import chalk from 'chalk';

export const log = {
  info: (msg: string) => console.log(chalk.blue(msg)),

  success: (msg: string) => console.log(chalk.green(msg)),

  warn: (msg: string) => console.log(chalk.yellow(msg)),

  error: (msg: string) => console.log(chalk.red(msg)),

  title: (msg: string) => console.log(chalk.cyan(msg)),

  text: (msg: string) => console.log(chalk.white(msg)),

  titleInLine: (title: string) =>
    console.log(chalk.cyan(`\n━━━━━━━━ ${title} ━━━━━━━━\n`)),

  line: () => console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')),
};
