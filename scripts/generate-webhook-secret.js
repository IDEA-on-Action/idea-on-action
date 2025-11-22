#!/usr/bin/env node
/**
 * Webhook Secret Generator
 *
 * Node.js crypto.randomBytes를 사용하여 안전한 32바이트 웹훅 시크릿을 생성합니다.
 *
 * 사용법:
 *   node scripts/generate-webhook-secret.js
 *   npm run generate:webhook-secret
 */

import { randomBytes } from 'crypto';

// 32바이트(256비트) 암호학적으로 안전한 랜덤 시크릿 생성
const secret = randomBytes(32).toString('hex');

console.log('='.repeat(60));
console.log('Webhook Secret Generator');
console.log('='.repeat(60));
console.log('');
console.log('Generated Webhook Secret:');
console.log(secret);
console.log('');
console.log('-'.repeat(60));
console.log('');
console.log('Add this to your environment files:');
console.log('');
console.log('1. mcp-server/.env:');
console.log(`   WEBHOOK_SECRET_COMPASS=${secret}`);
console.log('');
console.log('2. Share with Compass Navigator team for their:');
console.log(`   IDEAONACTION_WEBHOOK_SECRET=${secret}`);
console.log('');
console.log('-'.repeat(60));
console.log('');
console.log('Security Notes:');
console.log('- Keep this secret confidential');
console.log('- Do not commit to version control');
console.log('- Rotate periodically for security');
console.log('- Use different secrets for different environments');
console.log('');
console.log('='.repeat(60));
