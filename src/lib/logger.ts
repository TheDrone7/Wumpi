import pino, { BaseLogger } from 'pino';
import pretty from 'pino-pretty';
import type { MikroORM } from '@mikro-orm/core';
import { Logs } from '../database';
import { type ILogger, LogLevel } from '@sapphire/framework';

class WumpiLogger implements ILogger {
  private pino: BaseLogger;
  private db: MikroORM;
  private readonly level: LogLevel;

  constructor(db: MikroORM, level?: LogLevel) {
    this.pino = pino(
      { level: level?.toString().toLowerCase() || 'debug' },
      pretty({
        colorize: true,
        translateTime: true
      })
    );
    this.db = db;
    this.level = level || LogLevel.Info;
  }

  public async info(...message: readonly string[]) {
    for (const msg of message) this.pino.info(msg);
    const newLog = new Logs();
    newLog.message = message.join(' ');
    newLog.kind = 'INFO';
    newLog.timestamp = new Date().toISOString();
    await this.db.em.fork().persistAndFlush([newLog]);
  }

  public async error(...message: readonly string[]) {
    for (const msg of message) this.pino.error(msg);
    const newLog = new Logs();
    newLog.message = message.join(' ');
    newLog.kind = 'ERROR';
    newLog.timestamp = new Date().toISOString();
    await this.db.em.fork().persistAndFlush([newLog]);
  }

  public async fatal(...message: readonly string[]) {
    for (const msg of message) this.pino.fatal(msg);
    const newLog = new Logs();
    newLog.message = message.join(' ');
    newLog.kind = 'FATAL';
    newLog.timestamp = new Date().toISOString();
    await this.db.em.fork().persistAndFlush([newLog]);
  }

  public async warn(...message: readonly string[]) {
    for (const msg of message) this.pino.warn(msg);
    const newLog = new Logs();
    newLog.message = message.join(' ');
    newLog.kind = 'WARN';
    newLog.timestamp = new Date().toISOString();
    await this.db.em.fork().persistAndFlush([newLog]);
  }

  public debug(...message: string[]) {
    for (const msg of message) this.pino.debug(msg);
  }

  public has(level: LogLevel) {
    return this.level < level;
  }

  public trace(...message: readonly string[]) {
    for (const msg of message) this.pino.debug(msg);
  }

  public async write(level: LogLevel, ...message: readonly string[]) {
    if (this.has(level))
      switch (level) {
        case LogLevel.Info:
          await this.info(...message);
          break;
        case LogLevel.Warn:
          await this.warn(...message);
          break;
        case LogLevel.Error:
          await this.error(...message);
          break;
        case LogLevel.Fatal:
          await this.fatal(...message);
          break;
        case LogLevel.Trace:
          this.trace(...message);
          break;
        default:
          this.debug(...message);
      }
  }
}

export default WumpiLogger;
