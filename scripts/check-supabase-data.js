/**
 * Supabase 데이터 확인 스크립트
 *
 * 사용법: node scripts/check-supabase-data.js
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
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 환경 변수를 찾을 수 없습니다');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  console.log('\n🔍 Supabase 데이터 확인 중...\n');
  console.log(`📡 URL: ${supabaseUrl}\n`);

  try {
    // 1. Projects 테이블 확인
    const { data: projects, error: projectsError, count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .limit(5);

    if (projectsError) {
      console.error('❌ Projects 조회 실패:', projectsError.message);
      console.error('   Code:', projectsError.code);
      console.error('   Details:', projectsError.details);
      console.error('   Hint:', projectsError.hint);
    } else {
      console.log(`✅ Projects: ${projectsCount || 0}개`);
      if (projects && projects.length > 0) {
        console.log(`   예시: ${projects[0].title || projects[0].id}`);
      }
    }

    // 2. Bounties 테이블 확인
    const { data: bounties, error: bountiesError, count: bountiesCount } = await supabase
      .from('bounties')
      .select('*', { count: 'exact' })
      .limit(5);

    if (bountiesError) {
      console.error('\n❌ Bounties 조회 실패:', bountiesError.message);
      console.error('   Code:', bountiesError.code);
    } else {
      console.log(`\n✅ Bounties: ${bountiesCount || 0}개`);
      if (bounties && bounties.length > 0) {
        console.log(`   예시: ${bounties[0].title || bounties[0].id}`);
      }
    }

    // 3. Logs 테이블 확인
    const { data: logs, error: logsError, count: logsCount } = await supabase
      .from('logs')
      .select('*', { count: 'exact' })
      .limit(5);

    if (logsError) {
      console.error('\n❌ Logs 조회 실패:', logsError.message);
      console.error('   Code:', logsError.code);
    } else {
      console.log(`\n✅ Logs: ${logsCount || 0}개`);
      if (logs && logs.length > 0) {
        console.log(`   예시: ${logs[0].title || logs[0].id}`);
      }
    }

    // 4. Newsletter 테이블 확인
    const { data: newsletter, error: newsletterError, count: newsletterCount } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact' })
      .limit(5);

    if (newsletterError) {
      console.error('\n❌ Newsletter 조회 실패:', newsletterError.message);
      console.error('   Code:', newsletterError.code);
    } else {
      console.log(`\n✅ Newsletter: ${newsletterCount || 0}개`);
      if (newsletter && newsletter.length > 0) {
        console.log(`   예시: ${newsletter[0].email}`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 요약:');
    console.log(`   Projects: ${projectsCount || 0}개`);
    console.log(`   Bounties: ${bountiesCount || 0}개`);
    console.log(`   Logs: ${logsCount || 0}개`);
    console.log(`   Newsletter: ${newsletterCount || 0}개`);

    const totalData = (projectsCount || 0) + (bountiesCount || 0) + (logsCount || 0);

    if (totalData === 0) {
      console.log('\n⚠️ 데이터가 없습니다. 샘플 데이터를 삽입하세요:');
      console.log('   → supabase/migrations/20250109000007_seed_initial_data.sql 실행');
    } else {
      console.log('\n✅ 데이터 확인 완료!');
    }

  } catch (error) {
    console.error('\n❌ 예상치 못한 오류:', error.message);
  }
}

checkData();
