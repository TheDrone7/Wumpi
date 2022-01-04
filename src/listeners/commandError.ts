import {
  Listener,
  PieceContext,
  ListenerOptions,
  UserError
} from '@sapphire/framework';

export class ErrorListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'commandError'
    });
  }

  public run(error: UserError) {
    this.container.log.error(error.stack || error.message);
  }
}
