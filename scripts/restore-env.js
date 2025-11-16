#!/usr/bin/env node

/**
 * Environment Variables Restore Script
 *
 * .env.local 파일을 복원하는 스크립트
 * - GPG 암호화된 백업 복원
 * - 타임스탬프 백업에서 복원
 * - 안전한 복원 프로세스
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
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

async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve =>
    rl.question(query, ans => {
      rl.close();
      resolve(ans);
    })
  );
}

async function restoreEnv() {
  const envLocalPath = path.join(ROOT_DIR, '.env.local');
  const backupDir = path.join(ROOT_DIR, 'backups', 'env');
  const gpgBackupPath = path.join(ROOT_DIR, '.env.local.gpg');

  // 기존 .env.local 파일이 있으면 경고
  if (fs.existsSync(envLocalPath)) {
    log('⚠️  .env.local 파일이 이미 존재합니다!', 'yellow');
    const answer = await askQuestion('덮어쓰시겠습니까? (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      log('❌ 복원이 취소되었습니다.', 'red');
      process.exit(0);
    }

    // 기존 파일 백업
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${envLocalPath}.backup.${timestamp}`;
    fs.copyFileSync(envLocalPath, backupPath);
    log(`✅ 기존 파일 백업됨: ${path.basename(backupPath)}`, 'green');
  }

  log('\n📋 복원 옵션:', 'blue');
  log('  1. GPG 암호화 백업에서 복원 (.env.local.gpg)', 'reset');
  log('  2. 타임스탬프 백업에서 복원 (backups/env/)', 'reset');
  log('  3. dotenv-vault에서 복원 (.env.vault)', 'reset');
  log('', 'reset');

  const option = await askQuestion('옵션을 선택하세요 (1-3): ');

  switch (option) {
    case '1':
      await restoreFromGPG(gpgBackupPath, envLocalPath);
      break;
    case '2':
      await restoreFromBackup(backupDir, envLocalPath);
      break;
    case '3':
      await restoreFromVault(envLocalPath);
      break;
    default:
      log('❌ 잘못된 옵션입니다.', 'red');
      process.exit(1);
  }

  log('\n✨ 복원 완료!', 'green');
  log('\n📌 다음 단계:', 'blue');
  log('   1. .env.local 파일 내용 확인', 'reset');
  log('   2. 개발 서버 재시작: npm run dev', 'reset');
}

async function restoreFromGPG(gpgBackupPath, envLocalPath) {
  if (!fs.existsSync(gpgBackupPath)) {
    log('❌ .env.local.gpg 파일을 찾을 수 없습니다.', 'red');
    process.exit(1);
  }

  if (!checkGPG()) {
    log('❌ GPG가 설치되어 있지 않습니다.', 'red');
    log('   GPG 설치: https://gnupg.org/download/', 'blue');
    process.exit(1);
  }

  log('\n🔐 GPG 암호화 백업에서 복원합니다...', 'blue');
  log('⚠️  백업 시 입력한 비밀번호를 입력하세요.', 'yellow');

  try {
    execSync(
      `gpg --decrypt --output "${envLocalPath}" "${gpgBackupPath}"`,
      { stdio: 'inherit' }
    );
    log('✅ 복원 완료!', 'green');
  } catch (error) {
    log('❌ GPG 복호화 실패', 'red');
    console.error(error.message);
    process.exit(1);
  }
}

async function restoreFromBackup(backupDir, envLocalPath) {
  if (!fs.existsSync(backupDir)) {
    log('❌ 백업 폴더를 찾을 수 없습니다: backups/env/', 'red');
    process.exit(1);
  }

  const backupFiles = fs
    .readdirSync(backupDir)
    .filter(file => file.startsWith('.env.local'))
    .sort()
    .reverse();

  if (backupFiles.length === 0) {
    log('❌ 백업 파일이 없습니다.', 'red');
    process.exit(1);
  }

  log('\n📋 사용 가능한 백업:', 'blue');
  backupFiles.forEach((file, index) => {
    const filePath = path.join(backupDir, file);
    const stats = fs.statSync(filePath);
    const date = stats.mtime.toLocaleString();
    log(`  ${index + 1}. ${file} (${date})`, 'reset');
  });

  const choice = await askQuestion('\n복원할 백업 번호를 선택하세요: ');
  const index = parseInt(choice) - 1;

  if (index < 0 || index >= backupFiles.length) {
    log('❌ 잘못된 선택입니다.', 'red');
    process.exit(1);
  }

  const selectedBackup = path.join(backupDir, backupFiles[index]);
  fs.copyFileSync(selectedBackup, envLocalPath);
  log(`✅ 복원 완료: ${backupFiles[index]}`, 'green');
}

async function restoreFromVault(envLocalPath) {
  const vaultPath = path.join(ROOT_DIR, '.env.vault');

  if (!fs.existsSync(vaultPath)) {
    log('❌ .env.vault 파일을 찾을 수 없습니다.', 'red');
    log('   먼저 npm run env:encrypt를 실행하세요.', 'blue');
    process.exit(1);
  }

  log('\n📦 dotenv-vault에서 복원합니다...', 'blue');
  log('⚠️  DOTENV_KEY가 필요합니다.', 'yellow');

  try {
    execSync('npx dotenv-vault local decrypt', { stdio: 'inherit' });
    log('✅ 복원 완료!', 'green');
  } catch (error) {
    log('❌ dotenv-vault 복호화 실패', 'red');
    console.error(error.message);
    process.exit(1);
  }
}

// 실행
try {
  log('='.repeat(60), 'blue');
  log('🔄 환경 변수 복원 시작', 'blue');
  log('='.repeat(60), 'blue');
  log('', 'reset');

  await restoreEnv();

  log('', 'reset');
  log('='.repeat(60), 'blue');
} catch (error) {
  log('\n❌ 복원 중 오류 발생:', 'red');
  console.error(error);
  process.exit(1);
}
