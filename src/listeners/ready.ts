import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';

export class ReadyListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      once: true,
      event: 'ready'
    });
  }

  public async run() {
    const { username, id } = this.container.client.user!;
    await this.container.logger.info(`Successfully logged in as ${username} (${id})`);
  }
}
