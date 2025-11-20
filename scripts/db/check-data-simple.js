/**
 * Supabase 데이터 간단 확인
 */

import { createClient } from '@supabase/supabase-js';

// 하드코딩된 Supabase 정보
const supabaseUrl = 'https://zykjdneewbzyazfukzyg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5a2pkbmVld2J6eWF6ZnVrenlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0Mjc4MTUsImV4cCI6MjA3MTAwMzgxNX0.Lgnm2-NpoDVMLgb3qUK9xgrE2k1S-_eORbG-5RyGST8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  console.log('\n🔍 Supabase 데이터 확인 중...\n');

  // 1. Projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: false });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (projectsError) {
    console.log('❌ Projects:', projectsError.message);
    console.log('   Code:', projectsError.code);
  } else {
    console.log('✅ Projects:', projects?.length || 0, '개');
  }

  // 2. Bounties
  const { data: bounties, error: bountiesError } = await supabase
    .from('bounties')
    .select('*');

  if (bountiesError) {
    console.log('\n❌ Bounties:', bountiesError.message);
  } else {
    console.log('\n✅ Bounties:', bounties?.length || 0, '개');
  }

  // 3. Logs
  const { data: logs, error: logsError } = await supabase
    .from('logs')
    .select('*');

  if (logsError) {
    console.log('\n❌ Logs:', logsError.message);
  } else {
    console.log('\n✅ Logs:', logs?.length || 0, '개');
  }

  // 4. Newsletter
  const { data: newsletter, error: newsletterError } = await supabase
    .from('newsletter_subscribers')
    .select('*');

  if (newsletterError) {
    console.log('\n❌ Newsletter:', newsletterError.message);
  } else {
    console.log('\n✅ Newsletter:', newsletter?.length || 0, '개');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

checkData();
