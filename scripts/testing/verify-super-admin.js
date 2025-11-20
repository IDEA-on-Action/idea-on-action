/**
 * Super Admin 계정 검증 스크립트
 *
 * admin@ideaonaction.local 계정이 super_admin 역할을 가지고 있는지 확인합니다.
 *
 * 사용법: node scripts/verify-super-admin.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수 수동 로드
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.VITE_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL 환경 변수를 찾을 수 없습니다');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY 환경 변수를 찾을 수 없습니다');
  console.error('   이 스크립트는 Service Role Key가 필요합니다 (auth.users 조회용)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifySuperAdmin() {
  console.log('\n🔍 Super Admin 계정 확인 중...\n');
  console.log(`📡 URL: ${supabaseUrl}\n`);

  try {
    // 1. auth.users에서 admin 사용자 ID 조회
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('❌ auth.users 조회 실패:', usersError.message);
      process.exit(1);
    }

    const adminUser = users.users.find(u => u.email === 'admin@ideaonaction.local');

    if (!adminUser) {
      console.error('❌ admin@ideaonaction.local 계정을 찾을 수 없습니다');
      console.error('   auth.users 테이블에 해당 계정이 존재하지 않습니다');
      process.exit(1);
    }

    console.log(`✅ Admin 계정 발견: ${adminUser.email}`);
    console.log(`   User ID: ${adminUser.id}`);
    console.log(`   Created: ${new Date(adminUser.created_at).toLocaleString()}`);

    // 2. admins 테이블에서 역할 확인
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('user_id, role, created_at, updated_at')
      .eq('user_id', adminUser.id)
      .single();

    if (adminError) {
      console.error('\n❌ admins 테이블 조회 실패:', adminError.message);
      console.error('   Code:', adminError.code);
      console.error('   Details:', adminError.details);
      process.exit(1);
    }

    if (!adminData) {
      console.error('\n❌ admins 테이블에 해당 user_id가 없습니다');
      console.error(`   user_id: ${adminUser.id}`);
      process.exit(1);
    }

    console.log(`\n✅ admins 테이블 레코드 확인:`);
    console.log(`   Role: ${adminData.role}`);
    console.log(`   Created: ${new Date(adminData.created_at).toLocaleString()}`);
    console.log(`   Updated: ${new Date(adminData.updated_at).toLocaleString()}`);

    // 3. super_admin 역할 검증
    if (adminData.role === 'super_admin') {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n✅ SUCCESS: Admin 계정이 super_admin 역할을 가지고 있습니다');
      console.log('\n   AdminUsers 페이지 접근 가능 (/admin/users)');
      console.log('   admin-users.spec.ts 테스트 18개 통과 예상');
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      process.exit(0);
    } else {
      console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error(`\n❌ FAILURE: Admin 계정의 역할이 '${adminData.role}'입니다`);
      console.error('\n   Expected: super_admin');
      console.error(`   Actual: ${adminData.role}`);
      console.error('\n   다음 마이그레이션을 실행하세요:');
      console.error('   → supabase/migrations/20251116000001_upgrade_admin_to_super_admin.sql');
      console.error('\n   실행 방법:');
      console.error('   1. Supabase Dashboard → SQL Editor 열기');
      console.error('   2. 마이그레이션 파일 내용 복사 & 실행');
      console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ 예상치 못한 오류:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

verifySuperAdmin();
