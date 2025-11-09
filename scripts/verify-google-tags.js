#!/usr/bin/env node

/**
 * Google Tag Manager 설정 검증 스크립트
 * 
 * 이 스크립트는 다음을 검증합니다:
 * 1. index.html에 GTM 스크립트가 올바르게 포함되어 있는지
 * 2. analytics.ts의 함수들이 올바르게 구현되어 있는지
 * 3. App.tsx에서 AnalyticsTracker가 사용되는지
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// 검증 결과
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

// 1. index.html 검증
function verifyIndexHtml() {
  log('\n[1/3] index.html 검증 중...', 'cyan');
  
  try {
    const indexPath = join(projectRoot, 'index.html');
    const content = readFileSync(indexPath, 'utf-8');
    
    // GTM 컨테이너 ID 확인
    const gtmId = 'GTM-MSSSRHKZ';
    if (!content.includes(gtmId)) {
      logError(`GTM 컨테이너 ID (${gtmId})를 찾을 수 없습니다.`);
      results.failed++;
      return false;
    }
    logSuccess(`GTM 컨테이너 ID (${gtmId}) 확인됨`);
    
    // <head>에 GTM 스크립트 확인
    const headScriptPattern = /<head>[\s\S]*?<!-- Google Tag Manager -->[\s\S]*?GTM-MSSSRHKZ[\s\S]*?<!-- End Google Tag Manager -->/;
    if (!headScriptPattern.test(content)) {
      logError('<head> 섹션에 GTM 스크립트를 찾을 수 없습니다.');
      results.failed++;
      return false;
    }
    logSuccess('<head> 섹션에 GTM 스크립트 확인됨');
    
    // <body>에 GTM noscript 확인
    const bodyNoscriptPattern = /<body>[\s\S]*?<!-- Google Tag Manager \(noscript\) -->[\s\S]*?GTM-MSSSRHKZ[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/;
    if (!bodyNoscriptPattern.test(content)) {
      logError('<body> 섹션에 GTM noscript를 찾을 수 없습니다.');
      results.failed++;
      return false;
    }
    logSuccess('<body> 섹션에 GTM noscript 확인됨');
    
    // GTM 스크립트가 <head> 최상단에 있는지 확인 (meta 태그보다 앞)
    const headMatch = content.match(/<head>([\s\S]*?)<\/head>/);
    if (headMatch) {
      const headContent = headMatch[1];
      const gtmScriptIndex = headContent.indexOf('Google Tag Manager');
      const metaIndex = headContent.indexOf('<meta');
      
      if (gtmScriptIndex === -1) {
        logError('GTM 스크립트를 찾을 수 없습니다.');
        results.failed++;
        return false;
      }
      
      if (metaIndex !== -1 && gtmScriptIndex > metaIndex) {
        logWarning('GTM 스크립트가 <head> 최상단에 있지 않을 수 있습니다. meta 태그보다 앞에 위치해야 합니다.');
        results.warnings++;
      } else {
        logSuccess('GTM 스크립트가 <head> 최상단에 위치함');
      }
    }
    
    results.passed += 3;
    return true;
  } catch (error) {
    logError(`index.html 읽기 실패: ${error.message}`);
    results.failed++;
    return false;
  }
}

// 2. analytics.ts 검증
function verifyAnalytics() {
  log('\n[2/3] analytics.ts 검증 중...', 'cyan');
  
  try {
    const analyticsPath = join(projectRoot, 'src', 'lib', 'analytics.ts');
    const content = readFileSync(analyticsPath, 'utf-8');
    
    // 필수 함수 확인
    const requiredFunctions = [
      'initGA4',
      'trackPageView',
      'trackEvent',
      'trackConversion',
    ];
    
    for (const funcName of requiredFunctions) {
      const pattern = new RegExp(`export\\s+(?:function|const)\\s+${funcName}`);
      if (!pattern.test(content)) {
        logError(`필수 함수 '${funcName}'을 찾을 수 없습니다.`);
        results.failed++;
        return false;
      }
      logSuccess(`함수 '${funcName}' 확인됨`);
    }
    
    // analytics 객체 확인
    if (!content.includes('export const analytics')) {
      logError('analytics 객체를 찾을 수 없습니다.');
      results.failed++;
      return false;
    }
    logSuccess('analytics 객체 확인됨');
    
    // analytics 객체의 주요 메서드 확인
    const analyticsMethods = [
      'addToCart',
      'removeFromCart',
      'beginCheckout',
      'purchase',
      'login',
      'signUp',
      'search',
      'viewService',
      'viewBlogPost',
    ];
    
    for (const method of analyticsMethods) {
      const pattern = new RegExp(`${method}:\\s*\\([^)]*\\)\\s*=>`);
      if (!pattern.test(content)) {
        logWarning(`analytics.${method} 메서드를 찾을 수 없습니다.`);
        results.warnings++;
      } else {
        logSuccess(`analytics.${method} 메서드 확인됨`);
      }
    }
    
    // dataLayer 사용 확인
    if (!content.includes('window.dataLayer')) {
      logError('dataLayer를 사용하는 코드를 찾을 수 없습니다.');
      results.failed++;
      return false;
    }
    logSuccess('dataLayer 사용 확인됨');
    
    // ensureDataLayer 함수 확인
    if (!content.includes('ensureDataLayer')) {
      logWarning('ensureDataLayer 함수를 찾을 수 없습니다.');
      results.warnings++;
    } else {
      logSuccess('ensureDataLayer 함수 확인됨');
    }
    
    results.passed += requiredFunctions.length + analyticsMethods.length + 3;
    return true;
  } catch (error) {
    logError(`analytics.ts 읽기 실패: ${error.message}`);
    results.failed++;
    return false;
  }
}

// 3. App.tsx 검증
function verifyAppTsx() {
  log('\n[3/3] App.tsx 검증 중...', 'cyan');
  
  try {
    const appPath = join(projectRoot, 'src', 'App.tsx');
    const content = readFileSync(appPath, 'utf-8');
    
    // AnalyticsTracker 컴포넌트 확인
    if (!content.includes('AnalyticsTracker')) {
      logError('AnalyticsTracker 컴포넌트를 찾을 수 없습니다.');
      results.failed++;
      return false;
    }
    logSuccess('AnalyticsTracker 컴포넌트 확인됨');
    
    // AnalyticsTracker 사용 확인
    if (!content.includes('<AnalyticsTracker')) {
      logError('AnalyticsTracker가 사용되지 않았습니다.');
      results.failed++;
      return false;
    }
    logSuccess('AnalyticsTracker 사용 확인됨');
    
    // trackPageView import 확인
    const importPattern = /from\s+['"]\.\/lib\/analytics['"]|from\s+['"]@\/lib\/analytics['"]|from\s+['"]\.\.\/lib\/analytics['"]/;
    if (!importPattern.test(content)) {
      logWarning('analytics 모듈 import를 찾을 수 없습니다.');
      results.warnings++;
    } else {
      logSuccess('analytics 모듈 import 확인됨');
    }
    
    // initGA4 호출이 없는지 확인 (GTM 사용 시 불필요)
    if (content.includes('initGA4()')) {
      logWarning('initGA4() 호출이 발견되었습니다. GTM 사용 시 불필요할 수 있습니다.');
      results.warnings++;
    } else {
      logSuccess('initGA4() 호출 없음 (GTM 사용)');
    }
    
    results.passed += 3;
    return true;
  } catch (error) {
    logError(`App.tsx 읽기 실패: ${error.message}`);
    results.failed++;
    return false;
  }
}

// 브라우저 검증 코드 생성
function generateBrowserVerificationCode() {
  const code = `
// 브라우저 콘솔에서 실행할 검증 코드
// 개발자 도구 (F12) → Console 탭에서 실행하세요

(function() {
  console.log('%c=== Google Tag Manager 검증 ===', 'color: #4CAF50; font-size: 16px; font-weight: bold');
  
  const checks = {
    passed: 0,
    failed: 0,
    warnings: 0
  };
  
  function check(name, condition, message) {
    if (condition) {
      console.log(\`%c✓ \${name}\`, 'color: #4CAF50');
      console.log(\`  \${message}\`);
      checks.passed++;
    } else {
      console.log(\`%c✗ \${name}\`, 'color: #f44336');
      console.log(\`  \${message}\`);
      checks.failed++;
    }
  }
  
  function warn(name, message) {
    console.log(\`%c⚠ \${name}\`, 'color: #ff9800');
    console.log(\`  \${message}\`);
    checks.warnings++;
  }
  
  // 1. GTM 스크립트 로드 확인
  check(
    'GTM 스크립트 로드',
    typeof window.google_tag_manager !== 'undefined',
    window.google_tag_manager ? 'GTM이 로드되었습니다.' : 'GTM이 로드되지 않았습니다.'
  );
  
  // 2. GTM 컨테이너 확인
  const gtmId = 'GTM-MSSSRHKZ';
  check(
    'GTM 컨테이너',
    window.google_tag_manager && window.google_tag_manager[gtmId],
    window.google_tag_manager && window.google_tag_manager[gtmId] 
      ? \`컨테이너 \${gtmId} 확인됨\`
      : \`컨테이너 \${gtmId}를 찾을 수 없습니다.\`
  );
  
  // 3. dataLayer 확인
  check(
    'dataLayer 초기화',
    Array.isArray(window.dataLayer),
    window.dataLayer 
      ? \`dataLayer 확인됨 (길이: \${window.dataLayer.length})\`
      : 'dataLayer가 초기화되지 않았습니다.'
  );
  
  // 4. gtag 함수 확인 (GTM이 제공할 수 있음)
  if (typeof window.gtag === 'function') {
    check('gtag 함수', true, 'gtag 함수가 사용 가능합니다.');
  } else {
    warn('gtag 함수', 'gtag 함수가 없습니다. GTM에서 GA4 태그를 설정하면 자동으로 생성됩니다.');
  }
  
  // 5. dataLayer 이벤트 확인
  if (window.dataLayer && window.dataLayer.length > 0) {
    const events = window.dataLayer.filter(item => item.event);
    check(
      'dataLayer 이벤트',
      events.length > 0,
      \`\${events.length}개의 이벤트가 dataLayer에 있습니다.\`
    );
    
    if (events.length > 0) {
      console.log('%c최근 이벤트:', 'color: #2196F3; font-weight: bold');
      events.slice(-5).forEach((event, index) => {
        console.log(\`  \${index + 1}. \${event.event}\`, event);
      });
    }
  } else {
    warn('dataLayer 이벤트', 'dataLayer에 이벤트가 없습니다.');
  }
  
  // 6. GTM 스크립트 태그 확인
  const gtmScript = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
  check(
    'GTM 스크립트 태그',
    gtmScript !== null,
    gtmScript ? 'GTM 스크립트 태그가 DOM에 있습니다.' : 'GTM 스크립트 태그를 찾을 수 없습니다.'
  );
  
  // 7. GTM noscript 확인
  // JavaScript가 활성화된 경우 iframe은 렌더링되지 않으므로 noscript 태그 자체를 확인
  const noscriptTags = document.querySelectorAll('noscript');
  let gtmNoscriptFound = false;
  let gtmNoscriptText = '';
  
  noscriptTags.forEach(noscript => {
    const text = noscript.textContent || noscript.innerText || '';
    if (text.includes('googletagmanager.com') && text.includes('GTM-MSSSRHKZ')) {
      gtmNoscriptFound = true;
      gtmNoscriptText = text.trim().substring(0, 100);
    }
  });
  
  check(
    'GTM noscript',
    gtmNoscriptFound,
    gtmNoscriptFound 
      ? 'GTM noscript 태그가 DOM에 있습니다.' 
      : 'GTM noscript 태그를 찾을 수 없습니다. index.html에 noscript 태그가 있는지 확인하세요.'
  );
  
  // 결과 요약
  console.log('%c\\n=== 검증 결과 ===', 'color: #2196F3; font-size: 14px; font-weight: bold');
  console.log(\`%c통과: \${checks.passed}\`, 'color: #4CAF50');
  console.log(\`%c실패: \${checks.failed}\`, 'color: #f44336');
  console.log(\`%c경고: \${checks.warnings}\`, 'color: #ff9800');
  
  if (checks.failed === 0) {
    console.log('%c\\n✓ 모든 검증을 통과했습니다!', 'color: #4CAF50; font-size: 14px; font-weight: bold');
  } else {
    console.log('%c\\n✗ 일부 검증에 실패했습니다. 위의 오류를 확인하세요.', 'color: #f44336; font-size: 14px; font-weight: bold');
  }
  
  return checks;
})();
`;
  
  return code.trim();
}

// 메인 실행
function main() {
  log('\n' + '='.repeat(60), 'cyan');
  log('Google Tag Manager 설정 검증', 'cyan');
  log('='.repeat(60), 'cyan');
  
  verifyIndexHtml();
  verifyAnalytics();
  verifyAppTsx();
  
  // 결과 요약
  log('\n' + '='.repeat(60), 'cyan');
  log('검증 결과 요약', 'cyan');
  log('='.repeat(60), 'cyan');
  logSuccess(`통과: ${results.passed}개`);
  if (results.failed > 0) {
    logError(`실패: ${results.failed}개`);
  }
  if (results.warnings > 0) {
    logWarning(`경고: ${results.warnings}개`);
  }
  
  if (results.failed === 0) {
    log('\n✓ 모든 정적 검증을 통과했습니다!', 'green');
    log('\n다음 단계:', 'cyan');
    logInfo('1. 개발 서버를 실행하세요: npm run dev');
    logInfo('2. 브라우저에서 개발자 도구 (F12)를 엽니다');
    logInfo('3. Console 탭에서 아래 코드를 실행하세요:');
    log('\n' + generateBrowserVerificationCode(), 'yellow');
    process.exit(0);
  } else {
    log('\n✗ 일부 검증에 실패했습니다. 위의 오류를 수정하세요.', 'red');
    process.exit(1);
  }
}

main();

