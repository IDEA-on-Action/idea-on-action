/**
 * Check CMS Table Structures in Supabase
 * CommonJS version (no ESM imports)
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env.local manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found')
    return {}
  }

  const envContent = fs.readFileSync(envPath, 'utf-8')
  const env = {}

  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      env[key] = value
    }
  })

  return env
}

const env = loadEnv()
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Check if a table exists by trying to query it
 */
async function checkTableExists(tableName) {
  const { error } = await supabase
    .from(tableName)
    .select('*')
    .limit(0)

  return !error
}

/**
 * Get sample data to infer structure
 */
async function getTableStructure(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1)

  if (error) {
    return { exists: false, error: error.message }
  }

  if (!data || data.length === 0) {
    return { exists: true, columns: [], isEmpty: true }
  }

  const columns = Object.keys(data[0]).map(key => ({
    name: key,
    type: typeof data[0][key],
    sample: data[0][key]
  }))

  return { exists: true, columns, isEmpty: false }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Checking CMS Table Structures in Supabase\n')
  console.log('📍 URL:', supabaseUrl)
  console.log('='.repeat(80))

  const tables = [
    'admins',
    'roadmap_items',
    'portfolio_items',
    'lab_items',
    'blog_posts',
    'team_members',
    'blog_categories',
    'post_categories',
    'tags',
    'post_tags'
  ]

  for (const table of tables) {
    console.log(`\n📊 Table: ${table}`)
    console.log('-'.repeat(80))

    const structure = await getTableStructure(table)

    if (!structure.exists) {
      console.log(`  ❌ Table does not exist`)
      console.log(`  Error: ${structure.error}`)
      continue
    }

    console.log(`  ✅ Table exists`)

    if (structure.isEmpty) {
      console.log(`  ⚠️  Table is empty (no data to infer structure)`)
      continue
    }

    console.log(`\n  📋 Columns (${structure.columns.length}):`)
    structure.columns.forEach(col => {
      const sampleValue = col.sample === null ? 'NULL' : JSON.stringify(col.sample).substring(0, 50)
      console.log(`    - ${col.name}: ${col.type} (sample: ${sampleValue})`)
    })
  }

  console.log('\n' + '='.repeat(80))
  console.log('✅ Check complete\n')
}

main().catch(console.error)
