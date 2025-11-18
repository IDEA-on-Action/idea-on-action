/**
 * Services Content Data 검증 스크립트
 * 목적: 4개 서비스의 콘텐츠 데이터 확인
 * 사용법: node scripts/check-services-content-data.cjs
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 초기화
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 Services Content Data 검증');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

async function checkServicesContent() {
  try {
    // 4개 서비스 조회
    const { data: services, error } = await supabase
      .from('services')
      .select('slug, title, pricing_data, deliverables, process_steps, faq')
      .in('slug', ['mvp-development', 'fullstack-development', 'design-system', 'operations-management'])
      .order('slug');

    if (error) {
      console.error('❌ 서비스 조회 실패:', error.message);
      return;
    }

    if (!services || services.length === 0) {
      console.error('❌ 서비스 데이터가 없습니다.');
      return;
    }

    console.log(`✅ 총 ${services.length}개 서비스 조회 성공`);
    console.log('');

    // 각 서비스별 상세 정보
    services.forEach((service, index) => {
      console.log(`${index + 1}️⃣  ${service.title} (${service.slug})`);
      console.log('');

      // pricing_data 확인
      if (service.pricing_data && Array.isArray(service.pricing_data)) {
        console.log(`   💰 Pricing: ${service.pricing_data.length}개 패키지/플랜`);
        service.pricing_data.forEach((pricing, i) => {
          const priceFormatted = new Intl.NumberFormat('ko-KR').format(pricing.price);
          console.log(`      ${i + 1}. ${pricing.name} - ₩${priceFormatted}`);
        });
      } else {
        console.log('   ⚠️  Pricing data 없음');
      }

      // deliverables 확인
      if (service.deliverables && Array.isArray(service.deliverables)) {
        console.log(`   📦 Deliverables: ${service.deliverables.length}개 카테고리`);
        service.deliverables.forEach((deliverable, i) => {
          const itemCount = deliverable.items ? deliverable.items.length : 0;
          console.log(`      ${i + 1}. ${deliverable.category} (${itemCount}개 항목)`);
        });
      } else {
        console.log('   ⚠️  Deliverables 없음');
      }

      // process_steps 확인
      if (service.process_steps && Array.isArray(service.process_steps)) {
        console.log(`   🔄 Process Steps: ${service.process_steps.length}단계`);
        service.process_steps.forEach((step, i) => {
          console.log(`      ${step.step}. ${step.title} (${step.duration || step.activities?.length + ' activities'})`);
        });
      } else {
        console.log('   ⚠️  Process steps 없음');
      }

      // faq 확인
      if (service.faq && Array.isArray(service.faq)) {
        console.log(`   ❓ FAQ: ${service.faq.length}개`);
        service.faq.slice(0, 2).forEach((faq, i) => {
          console.log(`      ${i + 1}. ${faq.question}`);
        });
        if (service.faq.length > 2) {
          console.log(`      ... 외 ${service.faq.length - 2}개`);
        }
      } else {
        console.log('   ⚠️  FAQ 없음');
      }

      console.log('');
    });

    // 통계 요약
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 통계 요약');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    const totalPricing = services.reduce((sum, s) => sum + (s.pricing_data?.length || 0), 0);
    const totalDeliverables = services.reduce((sum, s) => sum + (s.deliverables?.length || 0), 0);
    const totalSteps = services.reduce((sum, s) => sum + (s.process_steps?.length || 0), 0);
    const totalFAQ = services.reduce((sum, s) => sum + (s.faq?.length || 0), 0);

    console.log(`📦 총 패키지/플랜: ${totalPricing}개`);
    console.log(`📋 총 결과물 카테고리: ${totalDeliverables}개`);
    console.log(`🔄 총 프로세스 단계: ${totalSteps}개`);
    console.log(`❓총 FAQ: ${totalFAQ}개`);
    console.log('');

    // 검증 결과
    const allComplete = services.every(s =>
      s.pricing_data && s.pricing_data.length > 0 &&
      s.deliverables && s.deliverables.length > 0 &&
      s.process_steps && s.process_steps.length > 0 &&
      s.faq && s.faq.length > 0
    );

    if (allComplete) {
      console.log('✅ 모든 서비스에 콘텐츠 데이터가 정상적으로 추가되었습니다!');
    } else {
      console.log('⚠️  일부 서비스에 누락된 데이터가 있습니다.');
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 다음 단계');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('1. Supabase Studio에서 데이터 확인:');
    console.log('   http://127.0.0.1:54323/project/default/editor');
    console.log('');
    console.log('2. 프로덕션 배포 준비:');
    console.log('   - 백업 생성');
    console.log('   - 마이그레이션 파일 검토');
    console.log('   - supabase db push');
    console.log('');

  } catch (error) {
    console.error('❌ 검증 중 오류 발생:', error.message);
  }
}

checkServicesContent();
