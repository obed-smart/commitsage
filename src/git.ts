import { simpleGit } from 'simple-git';
import type { SimpleGit } from 'simple-git';
import { log } from './utils/logger.js';
import { askConfirmation } from './utils/confirm.js';

const git: SimpleGit = simpleGit();

const EXCLUDE_FILES = [
  ':(exclude)package-lock.json',
  ':(exclude)yarn.lock',
  ':(exclude)pnpm-lock.yaml',
  ':(exclude).env',
  ':(exclude).env.example',
];

export const getGitDiff = async () => {
  try {
    await git.raw(['config', 'core.autocrlf', 'true']);
    const status = await git.status();

    if (status.files.length === 0) {
      log.warn('No changes detected.');
      process.exit(0);
    }

    let diff = await git.diff([
      '--cached',
      '--ignore-space-at-eol',
      '--',
      '.',
      ...EXCLUDE_FILES,
    ]);

    if (!diff) {
      log.info('No staged changes detected');

      const shouldStage = await askConfirmation('Stage all changes?(y/n):');

      if (!shouldStage) {
        log.error('Aborting commit...');
        process.exit(0);
      }
      log.success('staging all file...');

      await git.add('.');
      diff = await git.diff([
        '--cached',
        '--ignore-space-at-eol',
        '--',
        '.',
        ...EXCLUDE_FILES,
      ]);

      if (!diff.trim()) {
        log.warn('No diff available after staging.');
        process.exit(0);
      }
    }
    return diff;
  } catch (error) {
    console.error(error);
    return '';
  }
};
