import WumpiClient from './lib/client';
const client = new WumpiClient();

client.login(process.env.DISCORD_TOKEN).catch(console.error);
