import { Args, Command, CommandOptions } from '@sapphire/framework';
import { type Message, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { setTimeout as sleep } from 'node:timers/promises';
import { codeBlock, isThenable } from '@sapphire/utilities';
import { Stopwatch } from '@sapphire/stopwatch';
import Type from '@sapphire/type';
import { inspect } from 'node:util';
import { colors } from '../../lib/constants';

@ApplyOptions<CommandOptions>({
  name: 'eval',
  description: 'Evaluate code and return result',
  category: 'Utility',
  syntax: '<code>',
  flags: ['sql'],
  preconditions: ['OwnerOnly'],
  quotes: []
})
export class EvalCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const sql = args.getFlags('sql');
    const code = await args.rest('string');
    const timeout = 60000;

    const { success, result, time, type } = sql
      ? await this.executeSQL(code)
      : await this.timedEval(message, args, code, timeout);

    const footer = codeBlock('ts', type);
    const header = `EVAL ${success ? 'SUCCESS' : 'FAILURE'}`;
    const color = success ? colors.success : colors.error;
    const displayedResult = codeBlock('js', result.substring(0, 1000));
    const displayedTime = codeBlock('css', time);
    const author = { text: message.author.tag, iconURL: message.author.displayAvatarURL() };

    const embed = new MessageEmbed();
    embed
      .setTitle(header)
      .setFooter(author)
      .setColor(color)
      .addField('Time', displayedTime)
      .addField('Type', footer)
      .addField('Result', displayedResult);

    return message.reply({ embeds: [embed] });
  }

  private async timedEval(message: Message, args: Args, code: string, flagTime: number) {
    if (flagTime === Infinity || flagTime === 0) return this.eval(message, args, code);
    return Promise.race([
      sleep(flagTime).then(() => ({
        result: 'Eval timed out.',
        success: false,
        time: '⏱ ...',
        type: 'EvalTimeoutError'
      })),
      this.eval(message, args, code)
    ]);
  }

  private async eval(message: Message, args: Args, code: string) {
    const stopwatch = new Stopwatch();
    let success: boolean;
    let syncTime = '';
    let asyncTime = '';
    let result: unknown;
    let thenable = false;
    let type: Type;

    try {
      if (code.includes('await')) code = `(async () => {\n${code}\n})();`;

      // @ts-ignore
      const msg = message;
      result = eval(code);

      syncTime = stopwatch.toString();
      type = new Type(result);

      if (isThenable(result)) {
        thenable = true;
        stopwatch.restart();
        result = await result;
        asyncTime = stopwatch.toString();
      }
      success = true;
    } catch (error) {
      if (!syncTime.length) syncTime = stopwatch.toString();
      if (thenable && !asyncTime.length) asyncTime = stopwatch.toString();
      if (!type!) type = new Type(error);
      result = error;
      success = false;
    }

    stopwatch.stop();
    if (typeof result !== 'string')
      result =
        result instanceof Error
          ? result.stack
          : args.getFlags('json')
          ? JSON.stringify(result, null, 4)
          : inspect(result, {
              depth: Number(args.getOption('depth') ?? 0) || 0,
              showHidden: args.getFlags('showHidden', 'hidden')
            });

    return {
      success,
      type: type!,
      time: EvalCommand.formatTime(syncTime, asyncTime ?? ''),
      result: EvalCommand.cleanResult(result as string)
    };
  }

  private async executeSQL(query: string) {
    let result, type, success, time;
    const stopwatch = new Stopwatch();
    const db = this.container.db.em.fork();
    try {
      const response = await db.getConnection().execute(query);
      result = (Array.isArray(response) && response.length > 0) ? [...Object.keys(response[0])] : 'SUCCESS';
      type = (result === 'SUCCESS') ? 'RESULT' : 'TABLE';
      success = true;
      time = stopwatch.toString();
    } catch (e: any) {
      result = e.stack || e.message;
      type = 'SQLError';
      success = false;
      time = stopwatch.toString();
    }
    stopwatch.stop();
    return {
      result,
      success,
      type,
      time: EvalCommand.formatTime(time)
    };
  }

  private static formatTime(syncTime: string, asyncTime?: string) {
    return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
  }

  private static cleanResult(result: string) {
    const REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;
    const tokens = [
      process.env.DISCORD_TOKEN,
      process.env.REDIS_PASSWORD,
      process.env.REDIS_HOST,
      process.env.REDIS_PORT
    ];

    const sensitivePattern: string | RegExp = new RegExp(
      tokens.map((t) => t!.replace(REGEXPESC, '\\$&')).join('|'),
      'gi'
    );
    const zws = String.fromCharCode(8203);

    if (typeof sensitivePattern === 'undefined') throw new Error('initClean must be called before running this.');

    return result.replace(sensitivePattern, '「ｒｅｄａｃｔｅｄ」').replace(/`/g, `\`${zws}`).replace(/@/g, `@${zws}`);
  }
}
