import { Listener, PieceContext, ListenerOptions, UserError, CommandDeniedPayload } from '@sapphire/framework';

export class DeniedListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'commandDenied'
    });
  }

  public async run(error: UserError, { message }: CommandDeniedPayload) {
    await this.container.log.error(error.stack || error.message);
    return message.reply(error.message);
  }
}
