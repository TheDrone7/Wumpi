import { Listener, PieceContext, ListenerOptions, UserError, CommandDeniedPayload } from '@sapphire/framework';

export class DeniedListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'commandDenied'
    });
  }

  public async run(error: UserError, { message }: CommandDeniedPayload) {
    if (error.message !== 'not-bot') {
      await this.container.logger.warn(error.message);
      return message.reply(error.message);
    }
    return;
  }
}
