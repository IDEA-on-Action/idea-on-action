/**
 * Detailed check of service packages and plans data
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDetailedData() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 Detailed Service Data Check');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check services
  console.log('📦 Services:');
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('id, slug, title')
    .in('slug', ['mvp-development', 'fullstack-development', 'design-system', 'operations-management'])
    .eq('status', 'active');

  if (servicesError) {
    console.error('❌ Services error:', servicesError.message);
  } else {
    console.log(`  Found ${services?.length || 0} services:`);
    services?.forEach(s => console.log(`    - ${s.slug} (${s.id})`));
  }

  console.log('');

  // Check packages
  console.log('📦 Service Packages:');
  const { data: packages, error: packagesError } = await supabase
    .from('service_packages')
    .select('id, service_id, name, price, is_popular');

  if (packagesError) {
    console.error('❌ Packages error:', packagesError.message);
  } else {
    console.log(`  Total: ${packages?.length || 0} packages`);
    packages?.forEach(p => console.log(`    - ${p.name}: ₩${p.price.toLocaleString()} ${p.is_popular ? '⭐' : ''}`));
  }

  console.log('');

  // Check plans
  console.log('📅 Subscription Plans:');
  const { data: plans, error: plansError } = await supabase
    .from('subscription_plans')
    .select('id, service_id, plan_name, billing_cycle, price, is_popular');

  if (plansError) {
    console.error('❌ Plans error:', plansError.message);
  } else {
    console.log(`  Total: ${plans?.length || 0} plans`);
    plans?.forEach(p => console.log(`    - ${p.plan_name} (${p.billing_cycle}): ₩${p.price.toLocaleString()}/월 ${p.is_popular ? '⭐' : ''}`));
  }

  console.log('');

  // Check a specific service detail
  console.log('🔎 Testing useServiceDetailBySlug for "fullstack-development":');
  const { data: serviceDetail, error: detailError } = await supabase
    .from('services')
    .select('*')
    .eq('slug', 'fullstack-development')
    .eq('status', 'active')
    .single();

  if (detailError) {
    console.error('❌ Service detail error:', detailError.message);
  } else if (serviceDetail) {
    console.log('  ✅ Service found:', serviceDetail.title);

    // Get packages for this service
    const { data: pkgs } = await supabase
      .from('service_packages')
      .select('*')
      .eq('service_id', serviceDetail.id)
      .order('display_order', { ascending: true });

    // Get plans for this service
    const { data: plns } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('service_id', serviceDetail.id)
      .order('display_order', { ascending: true });

    console.log(`  Packages: ${pkgs?.length || 0}`);
    console.log(`  Plans: ${plns?.length || 0}`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

checkDetailedData();
