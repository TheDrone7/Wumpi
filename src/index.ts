import { config } from 'dotenv';
import '@sapphire/plugin-hmr/register';
import WumpiClient from './lib/client';

config();
const client = new WumpiClient();

client.login(process.env.DISCORD_TOKEN).catch(console.error);
