#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

import { Command } from 'commander';
import { simpleGit } from 'simple-git';
import type { SimpleGit } from 'simple-git';
import { getGitDiff } from '../git.js';
import { log } from '../utils/logger.js';
import { generateCommitMessage } from '../llm.js';
import { askConfirmation } from '../utils/confirm.js';

const git: SimpleGit = simpleGit();
const program = new Command();

function trimDiff(diff: string): string {
  const cleanedDiff = diff.replace(
    /diff --git a\/package-lock\.json[\s\S]*?(?=diff --git|$)/g,
    '[package-lock.json diff hidden]\n',
  );

  const MAX_CHARS = 250000;
  const MAX_LINES = 1000;

  const shortDiff =
    cleanedDiff.length > MAX_CHARS
      ? cleanedDiff.slice(0, MAX_CHARS)
      : cleanedDiff;

  return shortDiff.split('\n').slice(0, MAX_LINES).join('\n').trim();
}

program
  .name('git-sage')
  .description('AI-powered Git commit using Google Gemini')
  .version('1.0.0')
  .option('-p, --push', 'push after committing')
  .option('-d, --details', 'Generate detailed commit message');

program.action(async (options) => {
  try {
    const diff = await getGitDiff();

    if (!diff) {
      log.warn('No changes to commit!');
      process.exit(0);
    }

    const status = await git.status();

    if (status.staged.length === 0) {
      log.warn('No staged files found.');
      process.exit(0);
    }

    log.titleInLine('Files being committed');

    status.staged.forEach((file) => log.text(` • ${file}`));

    log.line();

    log.info('Analyzing staged changes...\n');

    const detailed = options.details;

    const message = await generateCommitMessage(trimDiff(diff), detailed);

    log.titleInLine('Generated Commit');

    log.text(message);

    log.line();

    const confirmCommit = await askConfirmation('Commit this message? (y/n): ');

    if (!confirmCommit) {
      log.warn('Commit cancelled.');
      process.exit(0);
    }

    log.info(`> git commit -m "${message}"`);

    await git.commit(message);

    log.success('✔ Commit successful');

    if (options.push) {
      log.info('> git push');

      await git.push();

      log.success('✔ Push successful');
    } else {
      const confirmPush = await askConfirmation(
        'Push changes to remote? (y/n): ',
      );

      if (!confirmPush) {
        log.warn('Push cancelled.');
        process.exit(0);
      }

      await git.push();

      log.success('✔ Push successful');
    }
  } catch (error) {
    log.error('✖ Commit failed');

    console.error(error);

    process.exit(1);
  }
});

program.parse(process.argv);
