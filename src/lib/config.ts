import type { ClientOptions } from 'discord.js';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';

const config: ClientOptions = {
  intents: [
    'GUILDS',
    'GUILD_MEMBERS',
    'GUILD_BANS',
    'GUILD_EMOJIS_AND_STICKERS',
    'GUILD_WEBHOOKS',
    'GUILD_INVITES',
    'GUILD_VOICE_STATES',
    'GUILD_PRESENCES',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'DIRECT_MESSAGES',
    'DIRECT_MESSAGE_REACTIONS',
    'GUILD_SCHEDULED_EVENTS'
  ],
  allowedMentions: {
    repliedUser: false
  },
  tasks: {
    strategy: new ScheduledTaskRedisStrategy({
      bull: {
        redis: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT!),
          password: process.env.REDIS_PASSWORD
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true
        }
      }
    })
  },
  hmr: { enabled: process.env.NODE_ENV !== 'production' }
};

export default config;
