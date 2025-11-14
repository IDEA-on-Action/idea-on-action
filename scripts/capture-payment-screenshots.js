/**
 * Payment Process Screenshots 자동 캡처
 * WordPress 블로그 포스트용 스크린샷 생성
 *
 * Usage: node scripts/capture-payment-screenshots.js
 *
 * 환경 변수:
 * - BASE_URL: 테스트할 사이트 URL (기본값: http://localhost:8080)
 * - TEST_EMAIL: 테스트 계정 이메일 (기본값: admin@ideaonaction.local)
 * - TEST_PASSWORD: 테스트 계정 비밀번호 (기본값: demian00)
 */

import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 설정
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const TEST_EMAIL = process.env.TEST_EMAIL || 'admin@ideaonaction.local';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'demian00';
const OUTPUT_DIR = join(__dirname, '..', 'public', 'blog-screenshots', 'payment-process');
const MAX_RETRIES = 10; // 서버 시작 대기 시간을 고려하여 증가
const RETRY_DELAY = 2000; // 2초
const AUTO_START_SERVER = process.env.AUTO_START_SERVER !== 'false'; // 기본값: true

// 출력 디렉토리 생성
mkdirSync(OUTPUT_DIR, { recursive: true });

// 서버 프로세스 추적
let serverProcess = null;

/**
 * 서버 시작
 */
async function startServer() {
  if (!AUTO_START_SERVER) {
    return null;
  }

  console.log('🚀 개발 서버 시작 중...');
  console.log('   (서버는 스크린샷 캡처 완료 후 자동으로 종료됩니다)\n');

  const process = spawn('npm', ['run', 'dev'], {
    cwd: join(__dirname, '..'),
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  // 서버 출력을 로그에 표시 (선택사항)
  process.stdout.on('data', (data) => {
    const output = data.toString();
    // Vite 서버 시작 메시지 확인
    if (output.includes('Local:') || output.includes('ready')) {
      console.log('   서버 시작 중...');
    }
  });

  process.stderr.on('data', (data) => {
    // 에러는 무시 (일반적으로 Vite는 stderr에도 정상 출력을 보냄)
  });

  process.on('error', (error) => {
    console.error('❌ 서버 시작 실패:', error.message);
  });

  return process;
}

/**
 * 서버 종료
 */
function stopServer() {
  if (serverProcess) {
    console.log('\n🛑 개발 서버 종료 중...');
    serverProcess.kill('SIGTERM');
    serverProcess = null;
    console.log('✅ 서버 종료 완료');
  }
}

/**
 * 서버 연결 확인
 */
async function checkServerConnection(page, retries = MAX_RETRIES) {
  console.log(`🔍 서버 연결 확인 중... (${BASE_URL})`);
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await page.goto(BASE_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 5000,
      });
      
      if (response && response.status() < 400) {
        console.log('✅ 서버 연결 성공!\n');
        return true;
      }
    } catch (error) {
      if (i < retries - 1) {
        console.log(`⏳ 재시도 중... (${i + 1}/${retries - 1})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.error('\n❌ 서버 연결 실패');
        console.error(`   URL: ${BASE_URL}`);
        console.error(`   에러: ${error.message}\n`);
        
        if (AUTO_START_SERVER && !serverProcess) {
          console.error('💡 서버 자동 시작이 실패했습니다. 수동으로 서버를 실행해주세요:');
        } else {
          console.error('💡 해결 방법:');
          console.error('   1. 개발 서버를 실행하세요: npm run dev');
          console.error('   2. 또는 다른 포트를 사용 중이라면 BASE_URL 환경 변수를 설정하세요:');
          console.error('      BASE_URL=http://localhost:5173 npm run generate:screenshots');
          console.error('   3. 서버 자동 시작을 비활성화하려면:');
          console.error('      AUTO_START_SERVER=false npm run generate:screenshots\n');
        }
        throw new Error(`서버에 연결할 수 없습니다: ${BASE_URL}\n개발 서버가 실행 중인지 확인하세요.`);
      }
    }
  }
  
  return false;
}

/**
 * 스크린샷 캡처 유틸리티
 */
async function captureScreenshot(page, name, description) {
  const path = join(OUTPUT_DIR, `${name}.png`);

  // 페이지 로딩 대기
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // 애니메이션 완료 대기

  // 스크린샷 캡처
  await page.screenshot({
    path,
    fullPage: true,
    type: 'png',
  });

  console.log(`✅ ${description}`);
  console.log(`   📁 ${path}\n`);
}

/**
 * 로그인 헬퍼
 */
async function login(page) {
  console.log('🔐 로그인 중...');

  try {
    await page.goto(`${BASE_URL}/login`, {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
    
    // 로그인 폼이 로드될 때까지 대기 (더 유연한 셀렉터 사용)
    // 이메일 입력 필드: placeholder에 "이메일" 또는 "email"이 포함된 input, 또는 type="text"인 input
    const emailSelector = 'input[placeholder*="이메일" i], input[placeholder*="email" i], input[type="text"], input[type="email"]';
    await page.waitForSelector(emailSelector, { timeout: 10000 });
    
    // 페이지가 완전히 로드될 때까지 추가 대기
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 이메일 입력 (placeholder에 "이메일"이 포함된 필드를 우선적으로 찾고, 없으면 첫 번째 텍스트 입력 필드)
    const emailInputWithPlaceholder = page.locator('input[placeholder*="이메일" i], input[placeholder*="email" i]').first();
    const emailInputFallback = page.locator('input[type="text"], input[type="email"]').first();
    
    // placeholder가 있는 입력 필드가 보이면 사용, 아니면 fallback 사용
    try {
      if (await emailInputWithPlaceholder.isVisible({ timeout: 2000 })) {
        await emailInputWithPlaceholder.fill(TEST_EMAIL);
      } else {
        await emailInputFallback.fill(TEST_EMAIL);
      }
    } catch {
      // 둘 다 실패하면 fallback 사용
      await emailInputFallback.fill(TEST_EMAIL);
    }
    
    // 비밀번호 입력
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    // 로그인 버튼 클릭
    const submitButton = page.locator('button[type="submit"]:has-text("로그인"), button[type="submit"]').first();
    await submitButton.click();

    // 로그인 완료 대기 (리다이렉트)
    await page.waitForURL(/\/(?!login)/, { timeout: 15000 });

    console.log('✅ 로그인 완료\n');
  } catch (error) {
    console.error('❌ 로그인 실패:', error.message);
    
    // 디버깅을 위해 현재 페이지 스크린샷 저장
    const debugPath = join(OUTPUT_DIR, 'login-debug.png');
    await page.screenshot({ path: debugPath, fullPage: true });
    console.error(`📁 디버그 스크린샷 저장: ${debugPath}`);
    
    throw error;
  }
}

/**
 * 메인 함수
 */
async function capturePaymentScreenshots() {
  console.log('📸 Payment Process Screenshots 캡처 시작\n');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`📧 Test Email: ${TEST_EMAIL}`);
  console.log(`🔧 서버 자동 시작: ${AUTO_START_SERVER ? '활성화' : '비활성화'}\n`);

  const browser = await chromium.launch({ headless: false }); // 디버깅을 위해 headless: false
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    // 0. 서버 시작 (필요한 경우)
    if (AUTO_START_SERVER) {
      serverProcess = await startServer();
      // 서버가 시작될 때까지 대기
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // 1. 서버 연결 확인
    await checkServerConnection(page);
    
    // 2. 로그인
    await login(page);

    // 3. 서비스 페이지 (장바구니 버튼 보이는 상태)
    console.log('1️⃣ 서비스 페이지 캡처 중...');
    await page.goto(`${BASE_URL}/services`);
    await captureScreenshot(
      page,
      '01-services-page',
      '서비스 목록 페이지 (장바구니 버튼 포함)'
    );

    // 4. 장바구니에 아이템 추가 (첫 번째 서비스)
    console.log('2️⃣ 장바구니에 아이템 추가 중...');
    const firstServiceCard = page.locator('.service-card, [data-testid="service-card"]').first();
    const addToCartButton = firstServiceCard.locator('button:has-text("장바구니")');

    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      await page.waitForTimeout(500); // 토스트 표시 대기
    } else {
      console.warn('⚠️ 장바구니 버튼을 찾을 수 없습니다. 서비스 상세 페이지로 이동합니다.');
      await firstServiceCard.click();
      await page.waitForTimeout(1000);
      await page.click('button:has-text("장바구니")');
    }

    // 5. 장바구니 Drawer 열기
    console.log('3️⃣ 장바구니 Drawer 캡처 중...');
    await page.click('button[aria-label="장바구니"], button:has-text("장바구니")');
    await page.waitForTimeout(1000); // Drawer 애니메이션 대기
    await captureScreenshot(
      page,
      '02-cart-drawer',
      '장바구니 Drawer (슬라이드 패널)'
    );

    // 6. 체크아웃 페이지로 이동
    console.log('4️⃣ 체크아웃 페이지 캡처 중...');
    await page.click('button:has-text("주문하기"), a[href*="checkout"]');
    await page.waitForURL(/\/checkout/, { timeout: 10000 });

    // 폼 입력 (샘플 데이터)
    await page.fill('input[name="shippingName"]', '홍길동');
    await page.fill('input[name="shippingPhone"]', '010-1234-5678');
    await page.fill('input[name="postcode"]', '12345');
    await page.fill('input[name="address"]', '서울시 강남구 테헤란로 123');
    await page.fill('input[name="addressDetail"]', '101동 202호');
    await page.fill('textarea[name="shippingNote"]', '문 앞에 놓아주세요');
    await page.fill('input[name="contactEmail"]', 'hong@example.com');
    await page.fill('input[name="contactPhone"]', '010-1234-5678');

    await captureScreenshot(
      page,
      '03-checkout-page',
      '체크아웃 페이지 (배송 정보 폼 + 주문 요약)'
    );

    // 7. 결제 페이지로 이동 (주문 생성)
    console.log('5️⃣ 결제 수단 선택 페이지 캡처 중...');

    // 주문하기 버튼 클릭
    const submitButton = page.locator('button:has-text("주문하기")');
    await submitButton.click();

    // 결제 페이지 로딩 대기
    await page.waitForURL(/\/checkout\/payment/, { timeout: 15000 });
    await captureScreenshot(
      page,
      '04-payment-method',
      '결제 수단 선택 페이지 (Kakao Pay / Toss Payments)'
    );

    // 8. 주문 내역 페이지
    console.log('6️⃣ 주문 내역 페이지 캡처 중...');
    await page.goto(`${BASE_URL}/orders`);
    await captureScreenshot(
      page,
      '05-orders-page',
      '주문 내역 페이지 (목록 + 필터)'
    );

    // 9. 주문 상세 페이지 (첫 번째 주문)
    console.log('7️⃣ 주문 상세 페이지 캡처 중...');
    const firstOrderRow = page.locator('table tbody tr, [data-testid="order-item"]').first();
    if (await firstOrderRow.isVisible()) {
      await firstOrderRow.click();
      await page.waitForURL(/\/orders\//, { timeout: 10000 });
      await captureScreenshot(
        page,
        '06-order-detail',
        '주문 상세 페이지 (배송 정보 + 결제 정보 + 주문 항목)'
      );
    } else {
      console.warn('⚠️ 주문 내역이 없습니다. 주문 상세 캡처를 건너뜁니다.');
    }

    console.log('\n🎉 모든 스크린샷 캡처 완료!');
    console.log(`📂 저장 위치: ${OUTPUT_DIR}`);
    console.log('\n캡처된 파일 목록:');
    console.log('  1. 01-services-page.png - 서비스 목록');
    console.log('  2. 02-cart-drawer.png - 장바구니 Drawer');
    console.log('  3. 03-checkout-page.png - 체크아웃 페이지');
    console.log('  4. 04-payment-method.png - 결제 수단 선택');
    console.log('  5. 05-orders-page.png - 주문 내역');
    console.log('  6. 06-order-detail.png - 주문 상세 (선택사항)');

  } catch (error) {
    console.error('\n❌ 스크린샷 캡처 실패:', error);

    // 에러 발생 시 현재 페이지 스크린샷 저장
    const errorPath = join(OUTPUT_DIR, 'error-screenshot.png');
    await page.screenshot({ path: errorPath, fullPage: true });
    console.error(`📁 에러 스크린샷 저장: ${errorPath}`);

    throw error;
  } finally {
    await browser.close();
    // 서버 종료
    stopServer();
  }
}

// 실행
capturePaymentScreenshots().catch((error) => {
  console.error('Fatal error:', error);
  // 서버가 실행 중이면 종료
  stopServer();
  process.exit(1);
});

// 프로세스 종료 시 서버도 함께 종료
process.on('SIGINT', () => {
  console.log('\n\n⚠️ 프로세스가 중단되었습니다.');
  stopServer();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopServer();
  process.exit(0);
});
