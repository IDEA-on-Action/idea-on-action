#!/usr/bin/env node

/**
 * RLS 정책 상태 확인 스크립트
 * Supabase CLI를 사용하여 RLS 정책 상태를 확인합니다.
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 확인할 테이블 목록
const TABLES = [
  'notifications',
  'carts',
  'cart_items',
  'user_roles',
  'roles',
  'user_profiles'
];

// 예상 정책 개수
const EXPECTED_POLICIES = {
  notifications: 4,
  carts: 4,
  cart_items: 4,
  user_roles: 2,
  roles: 1,
  user_profiles: 4
};

/**
 * Supabase CLI를 사용하여 SQL 쿼리 실행
 */
function executeSQL(sql) {
  try {
    const result = execSync(
      `supabase db execute --sql "${sql.replace(/"/g, '\\"')}"`,
      {
        encoding: 'utf8',
        cwd: path.join(__dirname, '..'),
        stdio: ['pipe', 'pipe', 'pipe']
      }
    );
    return result.trim();
  } catch (error) {
    // Supabase CLI가 연결되지 않은 경우 대체 방법 시도
    console.warn('⚠️  Supabase CLI 연결 실패. 원격 데이터베이스에 직접 연결하거나 Dashboard에서 확인하세요.');
    return null;
  }
}

/**
 * 테이블의 RLS 활성화 상태 확인
 */
function checkRLSEnabled(tableName) {
  const sql = `
    SELECT 
      tablename,
      rowsecurity AS enabled
    FROM pg_tables
    WHERE schemaname = 'public' 
      AND tablename = '${tableName}';
  `;
  
  const result = executeSQL(sql);
  if (!result) return null;
  
  // 결과 파싱 (간단한 파싱)
  const lines = result.split('\n').filter(line => line.trim());
  if (lines.length < 2) return null;
  
  const dataLine = lines[lines.length - 1];
  const parts = dataLine.split('|').map(p => p.trim());
  
  return {
    table: parts[0] || tableName,
    enabled: parts[1] === 't' || parts[1] === 'true'
  };
}

/**
 * 테이블의 RLS 정책 목록 조회
 */
function getRLSPolicies(tableName) {
  const sql = `
    SELECT
      policyname,
      cmd AS operation,
      CASE
        WHEN qual IS NOT NULL THEN 'USING'
        WHEN with_check IS NOT NULL THEN 'WITH CHECK'
        ELSE 'N/A'
      END AS policy_type
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = '${tableName}'
    ORDER BY cmd, policyname;
  `;
  
  const result = executeSQL(sql);
  if (!result) return [];
  
  // 결과 파싱
  const lines = result.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const policies = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('|').map(p => p.trim());
    if (parts.length >= 3) {
      policies.push({
        name: parts[0],
        operation: parts[1],
        type: parts[2]
      });
    }
  }
  
  return policies;
}

/**
 * 테이블 존재 여부 확인
 */
function checkTableExists(tableName) {
  const sql = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = '${tableName}'
    ) AS exists;
  `;
  
  const result = executeSQL(sql);
  if (!result) return null;
  
  const lines = result.split('\n').filter(line => line.trim());
  if (lines.length < 2) return null;
  
  const dataLine = lines[lines.length - 1];
  const parts = dataLine.split('|').map(p => p.trim());
  
  return parts[0] === 't' || parts[0] === 'true';
}

/**
 * 메인 실행 함수
 */
function main() {
  console.log('🔍 RLS 정책 상태 확인 중...\n');
  
  const results = [];
  
  for (const table of TABLES) {
    console.log(`📋 ${table} 테이블 확인 중...`);
    
    const exists = checkTableExists(table);
    if (exists === null) {
      console.log(`   ⚠️  확인 불가 (Supabase CLI 연결 필요)\n`);
      results.push({
        table,
        exists: null,
        rlsEnabled: null,
        policyCount: null,
        policies: [],
        status: 'unknown'
      });
      continue;
    }
    
    if (!exists) {
      console.log(`   ❌ 테이블이 존재하지 않습니다.\n`);
      results.push({
        table,
        exists: false,
        rlsEnabled: false,
        policyCount: 0,
        policies: [],
        status: 'missing'
      });
      continue;
    }
    
    const rlsStatus = checkRLSEnabled(table);
    const policies = getRLSPolicies(table);
    
    const rlsEnabled = rlsStatus?.enabled || false;
    const policyCount = policies.length;
    const expectedCount = EXPECTED_POLICIES[table] || 0;
    
    let status = 'ok';
    if (!rlsEnabled) {
      status = 'rls_disabled';
    } else if (policyCount === 0) {
      status = 'no_policies';
    } else if (policyCount < expectedCount) {
      status = 'insufficient_policies';
    }
    
    console.log(`   ${rlsEnabled ? '✅' : '❌'} RLS: ${rlsEnabled ? '활성화' : '비활성화'}`);
    console.log(`   ${policyCount > 0 ? '✅' : '❌'} 정책: ${policyCount}개 (예상: ${expectedCount}개)`);
    
    if (policies.length > 0) {
      console.log(`   정책 목록:`);
      policies.forEach(policy => {
        console.log(`     - ${policy.name} (${policy.operation})`);
      });
    }
    
    console.log('');
    
    results.push({
      table,
      exists: true,
      rlsEnabled,
      policyCount,
      policies,
      expectedCount,
      status
    });
  }
  
  // 요약 출력
  console.log('='.repeat(60));
  console.log('📊 요약');
  console.log('='.repeat(60));
  
  const summary = {
    total: results.length,
    missing: results.filter(r => r.exists === false).length,
    rlsDisabled: results.filter(r => r.exists && !r.rlsEnabled).length,
    noPolicies: results.filter(r => r.exists && r.rlsEnabled && r.policyCount === 0).length,
    insufficient: results.filter(r => r.exists && r.rlsEnabled && r.policyCount > 0 && r.policyCount < r.expectedCount).length,
    ok: results.filter(r => r.status === 'ok').length
  };
  
  console.log(`총 테이블: ${summary.total}`);
  console.log(`✅ 정상: ${summary.ok}`);
  console.log(`❌ 테이블 없음: ${summary.missing}`);
  console.log(`⚠️  RLS 비활성화: ${summary.rlsDisabled}`);
  console.log(`⚠️  정책 없음: ${summary.noPolicies}`);
  console.log(`⚠️  정책 부족: ${summary.insufficient}`);
  console.log('');
  
  // 문제가 있는 테이블 목록
  const problematic = results.filter(r => r.status !== 'ok' && r.status !== 'unknown');
  if (problematic.length > 0) {
    console.log('⚠️  문제가 있는 테이블:');
    problematic.forEach(r => {
      console.log(`   - ${r.table}: ${r.status}`);
    });
    console.log('');
    console.log('💡 해결 방법: npm run fix:rls 명령어를 실행하세요.');
  } else if (summary.ok === summary.total) {
    console.log('✅ 모든 테이블의 RLS 정책이 올바르게 설정되어 있습니다!');
  }
  
  // 종료 코드 설정
  process.exit(problematic.length > 0 ? 1 : 0);
}

// 실행
main();

