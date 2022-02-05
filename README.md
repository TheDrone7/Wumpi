Wumpi Bot
=========
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://nodejs.org/en/) [![forthebadge](https://forthebadge.com/images/badges/for-you.svg)]()

## Description
The goal of this bot is to provide a full suite of moderation commands and functions. The bot not only will be available to make a moderators life easier, but automate as much as it can. This extends to new member scans and anti bot players. It also allows for automating the muting of spammers, swearing, racial slurs, and raiding. This will improve the overall security of your server. It also includes a backup function which will keep a 24/7 backup of your server.

### Created pridefully by:
[TheDrone7 - Current dev](https://thedrone7.repl.co)
[Alex - Original Dev](https://github.com/alex5219/)
[Edqe - Original Dev](https://github.com/Edqe14/)
Leon - Original Dev
Snow - Artist

### Features:
- Web UI
- Ticket/Support system
- Auto-moderation
  - Anti-spam
  - Auto-slowmode
  - Anti-raid/bot
  - Filter swearing/racial slurs
  
- Moderation
  - Ban/Unban, Kick, Mute/Timeout
  - Warning system
  - Moderator notes system
  
- Miscellaneous
  - Invite Manager
  - Maintenance/lockdown mode

Discord:
https://discord.gg/mPPBNty

## Setup (Invite Bot/Normal)
- Invite Bot with [Invite Link](https://discordapp.com/oauth2/authorize?client_id=592568340485111827&permissions=8&scope=bot)
- Use [Web Panel(WIP)]()

## Setup for self hosting
- Install [Node.js](https://nodejs.org/) (LTS), [PostgreSQL](https://www.postgresql.org/) and [Redis](https://redis.io/). You can also get these hosted on the cloud.
- Create a new file named `.env` and inside it, add the following content: -
  ```
  DISCORD_TOKEN="<my-discord-bot-token-here>"
  DB_URL="<my-postgresql-connection-uri-here>"
  REDIS_HOST="<my-redis-server-host-address-here>"
  REDIS_PORT="<my-redis-servert-port-here>"
  REDIS_PASSWORD="<my-redis-server-connection-password-here>"
  NODE_ENV="production"
  ```
  You can get your `DISCORD_TOKEN` from the [discord developer's dashboard](https://discord.com/developers/applications/).

  Your `DB_URL` by default will be `postgresql://postgres:password@localhost:5432/wumpi` where password may either be what you set it to, or not required.
  
  Your `REDIS_HOST`, `REDIS_PORT` will default to `localhost` and `6379` respectively (or get from the cloud host). `REDIS_PASSWORD` may be what you set it to.
- After this, open up a terminal window and run the following commands -
  ```shell
  $ npm run build
  $ npm run start
  ```

- In case you want to add to the bot, run in dev mode by running the following code - 
  ```shell
  $ npm run build
  $ npm run dev
  ```
  ALSO, change `NODE_ENV` from `production` to `development` in your `.env` file,
  this will enable hot module reload, so you don't have to restart your bot every time you make change some part in the bot.