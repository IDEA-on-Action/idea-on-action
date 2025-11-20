/**
 * Supabase 마이그레이션 실행 스크립트
 *
 * 사용법: node scripts/run-migration.js <migration-file>
 * 예시: node scripts/run-migration.js fix-rls-policies-all.sql
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// __dirname 설정 (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수 로드
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 환경 변수를 찾을 수 없습니다:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL 또는 VITE_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\n.env.local 파일에 다음 변수를 추가하세요:');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

// Supabase 클라이언트 생성 (Service Role Key 사용)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration(migrationFile) {
  try {
    console.log(`\n📋 마이그레이션 파일: ${migrationFile}`);

    // 마이그레이션 파일 경로
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile);

    if (!fs.existsSync(migrationPath)) {
      throw new Error(`마이그레이션 파일을 찾을 수 없습니다: ${migrationPath}`);
    }

    // SQL 파일 읽기
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    console.log(`\n📄 SQL 파일 크기: ${(sql.length / 1024).toFixed(2)} KB`);
    console.log(`📄 SQL 라인 수: ${sql.split('\n').length}`);

    console.log('\n🚀 마이그레이션 실행 중...');

    // SQL 실행 (rpc를 사용하여 raw SQL 실행)
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();

    if (error) {
      // rpc가 없을 경우 다른 방법 시도
      if (error.code === '42883' || error.message.includes('does not exist')) {
        console.log('⚠️ exec_sql function이 없습니다. 직접 SQL 실행을 시도합니다...');

        // PostgreSQL REST API를 통한 직접 실행
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ sql_query: sql })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('\n✅ 마이그레이션 실행 완료!');
        console.log('결과:', result);
      } else {
        throw error;
      }
    } else {
      console.log('\n✅ 마이그레이션 실행 완료!');
      if (data) {
        console.log('결과:', data);
      }
    }

  } catch (error) {
    console.error('\n❌ 마이그레이션 실행 실패:');
    console.error(error.message);

    if (error.details) {
      console.error('\n상세 정보:', error.details);
    }

    if (error.hint) {
      console.error('\n힌트:', error.hint);
    }

    process.exit(1);
  }
}

// 명령줄 인자에서 파일명 가져오기
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('❌ 사용법: node scripts/run-migration.js <migration-file>');
  console.error('예시: node scripts/run-migration.js fix-rls-policies-all.sql');
  process.exit(1);
}

// 마이그레이션 실행
runMigration(migrationFile);
