import pino, { BaseLogger } from 'pino';
import pretty from 'pino-pretty';
import type { MikroORM } from '@mikro-orm/core';
import { Log } from '../database';

class WumpiLogger {
  private pino: BaseLogger;
  private db: MikroORM;

  constructor(db: MikroORM) {
    this.pino = pino(
      pretty({
        colorize: true,
        translateTime: true
      })
    );
    this.db = db;
  }

  public async info(...message: string[]) {
    for (const msg of message) this.pino.info(msg);
    const newLog = new Log();
    newLog.message = message.join(' ');
    newLog.kind = 'INFO';
    newLog.timestamp = new Date().toISOString();
    await this.db.em.fork().persistAndFlush([newLog]);
  }

  public async error(...message: string[]) {
    for (const msg of message) this.pino.error(msg);
    const newLog = new Log();
    newLog.message = message.join(' ');
    newLog.kind = 'ERROR';
    newLog.timestamp = new Date().toISOString();
    await this.db.em.fork().persistAndFlush([newLog]);
  }

  public debug(...message: string[]) {
    for (const msg of message) this.pino.debug(msg);
  }
}

export default WumpiLogger;
