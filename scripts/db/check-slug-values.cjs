const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    line = line.replace(/\r$/, '').trim();
    if (!line || line.startsWith('#')) return;

    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSlugValues() {
  console.log('=== Checking slug column values ===\n');

  // Check all services with slug column
  const { data: services, error } = await supabase
    .from('services')
    .select('id, title, slug')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Total services:', services?.length || 0);
    console.log('\n📋 Services with slug values:');
    services?.forEach(s => {
      console.log(`  - Title: ${s.title}`);
      console.log(`    Slug: ${s.slug || 'NULL'}`);
      console.log(`    ID: ${s.id}`);
      console.log('');
    });
  }

  // Check service_categories
  console.log('=== Checking service_categories ===\n');
  const { data: categories, error: catError } = await supabase
    .from('service_categories')
    .select('*');

  if (catError) {
    console.error('❌ Error:', catError);
  } else {
    console.log('✅ Categories:');
    categories?.forEach(c => {
      console.log(`  - ID: ${c.id}, Slug: ${c.slug}, Name: ${c.name}`);
    });
  }
}

checkSlugValues().catch(console.error);
