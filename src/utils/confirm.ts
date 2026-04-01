import * as readline from 'readline';
import chalk from 'chalk';

export const askConfirmation = (question: string): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      chalk.yellow(question),

      (answer: string) => {
        rl.close();

        const normalised = answer.trim().toLowerCase();

        resolve(normalised === 'y' || normalised === 'yes');
      },
    );
  });
};
