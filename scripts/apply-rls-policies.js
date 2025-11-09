#!/usr/bin/env node

/**
 * RLS 정책 적용 스크립트
 * fix-rls-policies-all.sql 파일을 Supabase에 적용합니다.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQL 파일 경로
const SQL_FILE = path.join(__dirname, '..', 'supabase', 'migrations', 'fix-rls-policies-all.sql');

/**
 * SQL 파일 읽기
 */
function readSQLFile() {
  try {
    const content = fs.readFileSync(SQL_FILE, 'utf8');
    return content;
  } catch (error) {
    console.error(`❌ SQL 파일을 읽을 수 없습니다: ${SQL_FILE}`);
    console.error(`   오류: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Supabase CLI를 사용하여 SQL 실행
 */
function executeSQL(sql) {
  try {
    console.log('📤 Supabase에 SQL 적용 중...');
    
    // SQL을 임시 파일로 저장
    const tempFile = path.join(__dirname, '..', '.temp-rls-fix.sql');
    fs.writeFileSync(tempFile, sql, 'utf8');
    
    try {
      // Supabase CLI로 SQL 실행
      const result = execSync(
        `supabase db execute --file "${tempFile}"`,
        {
          encoding: 'utf8',
          cwd: path.join(__dirname, '..'),
          stdio: 'inherit'
        }
      );
      
      // 임시 파일 삭제
      fs.unlinkSync(tempFile);
      
      return { success: true, output: result };
    } catch (error) {
      // 임시 파일 삭제
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
      
      // 에러가 발생했지만 일부는 성공했을 수 있음
      if (error.stdout) {
        console.log(error.stdout);
      }
      if (error.stderr) {
        console.error(error.stderr);
      }
      
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('❌ SQL 실행 중 오류 발생:');
    console.error(`   ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * 원격 Supabase에 직접 연결하여 SQL 실행
 */
function executeSQLRemote(sql) {
  console.log('📤 원격 Supabase에 SQL 적용 중...');
  console.log('');
  console.log('⚠️  Supabase CLI를 사용할 수 없습니다.');
  console.log('');
  console.log('다음 방법 중 하나를 사용하세요:');
  console.log('');
  console.log('1. Supabase Dashboard 사용:');
  console.log('   - https://supabase.com/dashboard 접속');
  console.log('   - 프로젝트 선택 → SQL Editor');
  console.log('   - 다음 파일의 내용을 복사하여 실행:');
  console.log(`   ${SQL_FILE}`);
  console.log('');
  console.log('2. Supabase CLI 연결 확인:');
  console.log('   - supabase link --project-ref <project-ref>');
  console.log('   - 또는 supabase db remote set <connection-string>');
  console.log('');
  
  return { success: false, error: 'CLI 연결 불가' };
}

/**
 * 메인 실행 함수
 */
function main() {
  console.log('🔧 RLS 정책 적용 스크립트');
  console.log('='.repeat(60));
  console.log('');
  
  // SQL 파일 확인
  if (!fs.existsSync(SQL_FILE)) {
    console.error(`❌ SQL 파일을 찾을 수 없습니다: ${SQL_FILE}`);
    process.exit(1);
  }
  
  console.log(`📄 SQL 파일: ${SQL_FILE}`);
  console.log('');
  
  // SQL 파일 읽기
  const sql = readSQLFile();
  console.log(`✅ SQL 파일 읽기 완료 (${sql.length} bytes)`);
  console.log('');
  
  // SQL 실행
  const result = executeSQL(sql);
  
  if (result.success) {
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ RLS 정책 적용 완료!');
    console.log('='.repeat(60));
    console.log('');
    console.log('📋 적용된 정책:');
    console.log('   - notifications: 테이블 생성 + RLS 정책 4개');
    console.log('   - carts: RLS 정책 4개');
    console.log('   - cart_items: RLS 정책 4개');
    console.log('   - user_roles: RLS 정책 2개');
    console.log('   - roles: RLS 정책 1개');
    console.log('   - user_profiles: RLS 정책 4개');
    console.log('');
    console.log('🔍 상태 확인: npm run check:rls');
    console.log('');
  } else {
    console.log('');
    console.log('='.repeat(60));
    console.log('⚠️  SQL 실행 실패');
    console.log('='.repeat(60));
    console.log('');
    
    // 대체 방법 제시
    executeSQLRemote(sql);
    
    console.log('');
    process.exit(1);
  }
}

// 실행
main();

