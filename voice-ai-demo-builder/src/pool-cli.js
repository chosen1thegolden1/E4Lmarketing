#!/usr/bin/env node
import { poolStatus, recycleStale, releaseSlug } from './pool.js';

const [cmd, arg] = process.argv.slice(2);

switch (cmd) {
  case 'status':
  case undefined:
    await poolStatus();
    break;
  case 'recycle': {
    const released = await recycleStale(arg ? Number(arg) : undefined);
    if (!released.length) console.log('Nothing stale — all assignments within max age.');
    for (const r of released) console.log(`released ${r.number} from ${r.slug}`);
    break;
  }
  case 'release': {
    if (!arg) {
      console.error('Usage: npm run pool -- release <slug>');
      process.exit(1);
    }
    const number = await releaseSlug(arg);
    console.log(number ? `released ${number} from ${arg}` : `no active number on "${arg}"`);
    break;
  }
  default:
    console.log('Usage: npm run pool -- [status|recycle [days]|release <slug>]');
    process.exit(1);
}
