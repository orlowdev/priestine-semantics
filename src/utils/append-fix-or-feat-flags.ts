/**
 * Append args to `process.argv` to only put fixes and features to changelog if `--fix-or-feat` flag is provided.
 */
import { Messenger } from './Messenger';
import { Shell } from '@totemish/shell';

export const appendFixOrFeatFlags = (): void => {
  if (!process.argv.includes('--fix-or-feat')) {
    return;
  }

  Messenger.info(
    Shell.bold(
      'You have provided the ',
      Shell.green(Shell.underline('--fix-or-feat')),
      Shell.white(' flag. Only '),
      Shell.blue('fixes'),
      Shell.white(', '),
      Shell.blue('features'),
      Shell.white(' and '),
      Shell.blue('breaking changes'),
      Shell.white(' will be displayed in the changelog.')
    )
  );

  process.argv.push('--no-chore');
  process.argv.push('--no-style');
  process.argv.push('--no-refactor');
  process.argv.push('--no-docs');
  process.argv.push('--no-perf');
  process.argv.push('--no-test');
  process.argv.push('--no-revert');
  process.argv.push('--no-build');
  process.argv.push('--no-ci');
  process.argv.push('--no-helpers');
};
