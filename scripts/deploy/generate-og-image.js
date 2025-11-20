/**
 * OG Image 자동 생성 스크립트
 * HTML 템플릿을 PNG로 변환
 *
 * Usage: node scripts/generate-og-image.js
 */

import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateOGImage() {
  console.log('🎨 OG Image 생성 시작...');

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 }
  });

  // HTML 템플릿 읽기
  const templatePath = join(__dirname, '..', 'public', 'og-template.html');
  const htmlContent = readFileSync(templatePath, 'utf-8');

  // HTML 콘텐츠 설정
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  // 폰트 로딩 대기 (Google Fonts)
  await page.waitForTimeout(3000);

  // 스크린샷 저장
  const outputPath = join(__dirname, '..', 'public', 'og-image.png');
  await page.screenshot({
    path: outputPath,
    type: 'png',
    fullPage: false
  });

  await browser.close();

  console.log('✅ OG Image 생성 완료!');
  console.log(`📁 저장 경로: ${outputPath}`);
  console.log('📐 크기: 1200x630px');
}

generateOGImage().catch((error) => {
  console.error('❌ OG Image 생성 실패:', error);
  process.exit(1);
});
