#!/usr/bin/env node

/**
 * Environment Variables Backup Script
 *
 * .env.local 파일을 백업하는 스크립트
 * - GPG 암호화 백업 생성
 * - 타임스탬프가 포함된 백업 파일 생성
 * - 백업 폴더 관리
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkGPG() {
  try {
    execSync('gpg --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function backupEnv() {
  const envLocalPath = path.join(ROOT_DIR, '.env.local');
  const backupDir = path.join(ROOT_DIR, 'backups', 'env');

  // .env.local 파일 존재 확인
  if (!fs.existsSync(envLocalPath)) {
    log('❌ .env.local 파일을 찾을 수 없습니다.', 'red');
    process.exit(1);
  }

  // 백업 폴더 생성
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    log('📁 백업 폴더 생성됨: backups/env/', 'blue');
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];

  // 1. 일반 백업 (타임스탬프 포함)
  const backupPath = path.join(backupDir, `.env.local.${timestamp}.backup`);
  fs.copyFileSync(envLocalPath, backupPath);
  log(`✅ 백업 생성됨: ${path.relative(ROOT_DIR, backupPath)}`, 'green');

  // 2. GPG 암호화 백업
  if (checkGPG()) {
    log('\n🔐 GPG 암호화 백업을 생성합니다...', 'blue');
    log('⚠️  강력한 비밀번호를 입력하세요 (꼭 기억해두세요!)', 'yellow');

    const gpgBackupPath = path.join(ROOT_DIR, '.env.local.gpg');

    try {
      execSync(
        `gpg --symmetric --cipher-algo AES256 --output "${gpgBackupPath}" "${envLocalPath}"`,
        { stdio: 'inherit' }
      );
      log(`✅ 암호화된 백업 생성됨: .env.local.gpg`, 'green');
      log('', 'reset');
      log('📌 중요: 이 파일을 안전한 곳에 보관하세요:', 'yellow');
      log('   - Google Drive', 'yellow');
      log('   - OneDrive', 'yellow');
      log('   - 외장 하드디스크', 'yellow');
      log('   - USB 드라이브 (암호화 필요)', 'yellow');
    } catch (error) {
      log('❌ GPG 암호화 실패', 'red');
      console.error(error.message);
    }
  } else {
    log('\n⚠️  GPG가 설치되어 있지 않습니다. 암호화 백업을 건너뜁니다.', 'yellow');
    log('   GPG 설치: https://gnupg.org/download/', 'blue');
  }

  // 3. 백업 파일 목록
  log('\n📋 백업 파일 목록:', 'blue');
  const backupFiles = fs.readdirSync(backupDir);
  backupFiles.forEach(file => {
    const filePath = path.join(backupDir, file);
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(2);
    log(`   - ${file} (${size} KB)`, 'reset');
  });

  // 4. .env.vault 파일이 있으면 표시
  const vaultPath = path.join(ROOT_DIR, '.env.vault');
  if (fs.existsSync(vaultPath)) {
    log('\n📦 dotenv-vault 파일도 백업되어 있습니다:', 'green');
    log('   - .env.vault (암호화됨, Git 커밋 가능)', 'reset');
  } else {
    log('\n💡 Tip: dotenv-vault로 암호화된 백업도 만들 수 있습니다:', 'blue');
    log('   npm run env:encrypt', 'reset');
  }

  log('\n✨ 백업 완료!', 'green');
}

// 실행
try {
  log('='.repeat(60), 'blue');
  log('🔄 환경 변수 백업 시작', 'blue');
  log('='.repeat(60), 'blue');
  log('', 'reset');

  backupEnv();

  log('', 'reset');
  log('='.repeat(60), 'blue');
} catch (error) {
  log('\n❌ 백업 중 오류 발생:', 'red');
  console.error(error);
  process.exit(1);
}
