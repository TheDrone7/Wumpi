import { join } from 'path';

export const rootDir = join(__dirname, '..', '..');
export const srcDir = join(rootDir, 'src');

export const colors = {
  success: 0x30c630,
  info: 0x3185fc,
  error: 0xe84855,
  warn: 0xf9dc5c,
  blurple: 0x5865f2
};

export const RandomLoadingMessage = [
  'Computing...',
  'Thinking...',
  'Cooking some food',
  'Give me a moment',
  'Loading...'
];

export const AutomodLog = {
  blacklist: 'Use of a blacklisted word.',
  invite: 'Sent a discord invite.',
  ratelimit: 'Sending messages too quickly',
  emojis: 'Too many emojis',
  spam: 'Too many duplicated characters'
};

export const AutomodMessage = {
  blacklist: 'You just used a bad word. Please do not use those.',
  invite: "You just sent an invite. That's not allowed here.",
  ratelimit: 'You are sending messages too quickly!',
  emojis: 'Your message right now had too many emojis!',
  spam: 'Your message right now was too spammy.'
};
