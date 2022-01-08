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
