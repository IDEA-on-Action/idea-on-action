#!/usr/bin/env node

/**
 * Export .env.local to 1Password CSV
 *
 * .env.local 파일을 1Password CSV 형식으로 변환
 * - 옵션 1: 각 변수를 개별 항목으로 (Password 타입)
 * - 옵션 2: 전체를 하나의 Secure Note로
 */

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

function escapeCSV(value) {
  if (!value) return '';
  // CSV 표준: 쌍따옴표가 있으면 두 개로 이스케이프, 쉼표/줄바꿈이 있으면 전체를 쌍따옴표로 감싸기
  const escaped = value.replace(/"/g, '""');
  if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
    return `"${escaped}"`;
  }
  return escaped;
}

function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const variables = [];
  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // 주석 섹션 감지
    if (trimmed.startsWith('#') && !trimmed.includes('=')) {
      currentSection = trimmed.replace('#', '').trim();
      continue;
    }

    // 빈 줄 건너뛰기
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // KEY=VALUE 파싱
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex > 0) {
      const key = trimmed.substring(0, equalIndex).trim();
      const value = trimmed.substring(equalIndex + 1).trim();

      variables.push({
        key,
        value,
        section: currentSection,
      });
    }
  }

  return variables;
}

function exportAsIndividualItems(variables, outputPath) {
  // 1Password CSV 형식 (개별 항목)
  // title,username,password,url,notes,tags
  const header = 'title,username,password,url,notes,tags';
  const rows = [header];

  for (const { key, value, section } of variables) {
    const title = key;
    const username = '';
    const password = value;
    const url = '';
    const notes = section ? `Section: ${section}` : '';
    const tags = 'env,development,idea-on-action';

    rows.push(
      `${escapeCSV(title)},${escapeCSV(username)},${escapeCSV(password)},${escapeCSV(url)},${escapeCSV(notes)},${escapeCSV(tags)}`
    );
  }

  const csv = rows.join('\n');
  fs.writeFileSync(outputPath, csv, 'utf8');
  log(`✅ 개별 항목 CSV 생성됨: ${path.basename(outputPath)}`, 'green');
}

function exportAsSecureNote(variables, outputPath) {
  // 1Password CSV 형식 (Secure Note)
  // title,notesPlain,tags,type
  const header = 'title,notesPlain,tags,type';
  const rows = [header];

  // .env.local 전체 내용을 notes에 포함
  let notes = '';
  let currentSection = '';

  for (const { key, value, section } of variables) {
    if (section !== currentSection) {
      notes += `\n# ${section}\n`;
      currentSection = section;
    }
    notes += `${key}=${value}\n`;
  }

  const title = 'IDEA on Action - Environment Variables';
  const tags = 'env,development,backup,idea-on-action';
  const type = 'Secure Note';

  rows.push(
    `${escapeCSV(title)},${escapeCSV(notes.trim())},${escapeCSV(tags)},${escapeCSV(type)}`
  );

  const csv = rows.join('\n');
  fs.writeFileSync(outputPath, csv, 'utf8');
  log(`✅ Secure Note CSV 생성됨: ${path.basename(outputPath)}`, 'green');
}

function exportEnvToCSV() {
  const envLocalPath = path.join(ROOT_DIR, '.env.local');

  // .env.local 파일 존재 확인
  if (!fs.existsSync(envLocalPath)) {
    log('❌ .env.local 파일을 찾을 수 없습니다.', 'red');
    process.exit(1);
  }

  // 파싱
  log('📖 .env.local 파일 읽는 중...', 'blue');
  const variables = parseEnvFile(envLocalPath);
  log(`✅ ${variables.length}개의 환경 변수 발견`, 'green');

  // 출력 폴더
  const outputDir = path.join(ROOT_DIR, 'backups', 'env');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];

  // 옵션 1: 개별 항목 CSV
  log('\n📝 옵션 1: 각 변수를 개별 Password 항목으로 변환 중...', 'blue');
  const individualPath = path.join(outputDir, `env-individual-${timestamp}.csv`);
  exportAsIndividualItems(variables, individualPath);

  // 옵션 2: Secure Note CSV
  log('\n📝 옵션 2: 전체를 하나의 Secure Note로 변환 중...', 'blue');
  const securePath = path.join(outputDir, `env-secure-note-${timestamp}.csv`);
  exportAsSecureNote(variables, securePath);

  // 요약
  log('\n' + '='.repeat(60), 'blue');
  log('📊 생성된 파일:', 'blue');
  log('', 'reset');
  log(`1️⃣  개별 항목 (${variables.length}개):`, 'yellow');
  log(`   ${path.relative(ROOT_DIR, individualPath)}`, 'reset');
  log(`   각 환경 변수를 별도의 Password 항목으로 import`, 'reset');
  log('', 'reset');
  log(`2️⃣  Secure Note (1개):`, 'yellow');
  log(`   ${path.relative(ROOT_DIR, securePath)}`, 'reset');
  log(`   전체 환경 변수를 하나의 Secure Note로 import`, 'reset');
  log('', 'reset');
  log('='.repeat(60), 'blue');

  // Import 가이드
  log('\n📌 1Password Import 가이드:', 'blue');
  log('', 'reset');
  log('웹 (권장):', 'yellow');
  log('  1. https://my.1password.com 접속', 'reset');
  log('  2. 좌측 메뉴 [...] → Import', 'reset');
  log('  3. "CSV" 선택', 'reset');
  log('  4. 위에서 생성된 CSV 파일 업로드', 'reset');
  log('  5. Vault 선택 (예: Development)', 'reset');
  log('  6. [Import Items] 클릭', 'reset');
  log('', 'reset');
  log('앱:', 'yellow');
  log('  1. 1Password 앱 열기', 'reset');
  log('  2. File → Import', 'reset');
  log('  3. "1Password (CSV)" 선택', 'reset');
  log('  4. CSV 파일 선택', 'reset');
  log('  5. Vault 선택 후 Import', 'reset');
  log('', 'reset');

  // 추천
  log('💡 추천:', 'blue');
  log('  - 개인 사용: Secure Note (한 곳에서 관리 편함)', 'green');
  log('  - 팀 사용: 개별 항목 (세부 권한 관리 가능)', 'green');
  log('', 'reset');

  // 보안 주의
  log('⚠️  보안 주의:', 'yellow');
  log('  - CSV 파일은 평문입니다! Import 후 즉시 삭제하세요.', 'red');
  log('  - Git에 커밋하지 마세요. (.gitignore에 포함됨)', 'red');
  log('', 'reset');
}

// 실행
try {
  log('='.repeat(60), 'blue');
  log('🔐 1Password CSV Export', 'blue');
  log('='.repeat(60), 'blue');
  log('', 'reset');

  exportEnvToCSV();

  log('', 'reset');
  log('✨ 완료!', 'green');
  log('', 'reset');
  log('='.repeat(60), 'blue');
} catch (error) {
  log('\n❌ 오류 발생:', 'red');
  console.error(error);
  process.exit(1);
}
