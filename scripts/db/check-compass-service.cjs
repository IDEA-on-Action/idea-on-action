#!/usr/bin/env node
/**
 * COMPASS Navigator 서비스 정보 확인
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkCompassService() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧭 COMPASS Navigator 서비스 정보');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // COMPASS Navigator 서비스 조회
  const { data: service, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', 'fed76f94-b3a0-4c88-9540-cf3f98ef354c')
    .single();

  if (error) {
    console.error('❌ 조회 실패:', error.message);
    return;
  }

  console.log('📋 기본 정보:');
  console.log(`  ID: ${service.id}`);
  console.log(`  Title: ${service.title}`);
  console.log(`  Slug: ${service.slug || 'NULL'}`);
  console.log(`  Status: ${service.status}`);
  console.log(`  Category: ${service.category || 'NULL'}`);

  console.log('\n📦 Description:');
  console.log(`  ${service.description || 'NULL'}\n`);

  // 기존 플랜 확인
  const { data: plans, error: planError } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('service_id', service.id);

  if (planError) {
    console.error('❌ 플랜 조회 실패:', planError.message);
  } else {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📅 기존 Subscription Plans:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (plans && plans.length > 0) {
      plans.forEach((plan, i) => {
        console.log(`${i + 1}. ${plan.plan_name} (${plan.billing_cycle})`);
        console.log(`   Price: ₩${plan.price?.toLocaleString()}/월`);
        console.log(`   Popular: ${plan.is_popular ? '⭐' : 'No'}`);
        console.log(`   Features: ${plan.features.length}개\n`);
      });
    } else {
      console.log('⚠️ 플랜 없음 (추가 필요)\n');
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

checkCompassService().catch(console.error);
