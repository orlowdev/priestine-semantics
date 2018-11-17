import { ExecMiddleware } from './ExecMiddleware';
import { Messenger } from './Messenger';
import { Either, EitherInterface } from '@priestine/data/src';
import * as R from 'ramda';
import { Iro } from '@priestine/iro';

export const getCurrentCommitWith = (cmd: string): Promise<string> =>
  ExecMiddleware.map(Messenger.tapInfo('Getting current commit hash...'))
    .map(Either.fromNullable)
    .map((y: EitherInterface<string>) =>
      y.fold(
        Messenger.tapWarning('Could not get current commit'),
        R.tap((x) => Messenger.info(`Got current commit hash: ${Iro.green(Iro.bold(x))}`))
      )
    )
    .process(cmd);
