/**
 * Check actual services in production DB
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkActualServices() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 All Services in Production DB:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const { data: services, error } = await supabase
    .from('services')
    .select('id, slug, title, status')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (!services || services.length === 0) {
    console.log('⚠️  No services found in database!');
    return;
  }

  console.log(`Total services: ${services.length}\n`);

  services.forEach((s, i) => {
    console.log(`${i + 1}. ${s.title}`);
    console.log(`   slug: "${s.slug}"`);
    console.log(`   status: ${s.status}`);
    console.log(`   id: ${s.id}`);
    console.log('');
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

checkActualServices();
