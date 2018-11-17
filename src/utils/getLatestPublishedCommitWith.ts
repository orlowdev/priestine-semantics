import { ExecMiddleware } from './ExecMiddleware';
import { Messenger } from './Messenger';
import { Either, EitherInterface } from '@priestine/data/src';
import * as R from 'ramda';
import { Iro } from '@priestine/iro';

export const getLatestPublishedCommitWith = (cmd: string): Promise<string> =>
  ExecMiddleware.map(Messenger.tapInfo('Getting commit hash of the latest tagged version...'))
    .map(Either.fromNullable)
    .map((y: EitherInterface<string>) =>
      y.fold(
        Messenger.tapError('Could not extract commit of the latest tagged version'),
        R.tap((x) => Messenger.info(`Got commit related to the latest tagged version: ${Iro.green(Iro.bold(x))}`))
      )
    )
    .process(cmd);
