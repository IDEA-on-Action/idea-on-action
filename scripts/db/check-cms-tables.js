/**
 * Check CMS Table Structures in Supabase
 *
 * This script checks the actual database structure for CMS tables.
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Check if a table exists
 */
async function checkTableExists(tableName) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = '${tableName}'
      ) as exists;
    `
  })

  if (error) {
    // Fallback: try direct query
    const { data: fallbackData, error: fallbackError } = await supabase
      .from(tableName)
      .select('*')
      .limit(0)

    return !fallbackError
  }

  return data?.[0]?.exists || false
}

/**
 * Get table columns
 */
async function getTableColumns(tableName) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = '${tableName}'
      ORDER BY ordinal_position;
    `
  })

  if (error) {
    console.error(`  Error fetching columns for ${tableName}:`, error.message)
    return null
  }

  return data
}

/**
 * Get table indexes
 */
async function getTableIndexes(tableName) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename = '${tableName}';
    `
  })

  if (error) {
    console.error(`  Error fetching indexes for ${tableName}:`, error.message)
    return null
  }

  return data
}

/**
 * Check RLS policies
 */
async function getRLSPolicies(tableName) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT
        policyname,
        cmd,
        qual,
        with_check
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = '${tableName}';
    `
  })

  if (error) {
    console.error(`  Error fetching RLS policies for ${tableName}:`, error.message)
    return null
  }

  return data
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Checking CMS Table Structures in Supabase\n')
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

    // Check existence
    const exists = await checkTableExists(table)
    if (!exists) {
      console.log(`  ❌ Table does not exist`)
      continue
    }
    console.log(`  ✅ Table exists`)

    // Get columns
    const columns = await getTableColumns(table)
    if (columns && columns.length > 0) {
      console.log(`\n  📋 Columns (${columns.length}):`)
      columns.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
        const defaultVal = col.column_default ? `DEFAULT ${col.column_default}` : ''
        console.log(`    - ${col.column_name}: ${col.data_type} ${nullable} ${defaultVal}`)
      })
    }

    // Get indexes
    const indexes = await getTableIndexes(table)
    if (indexes && indexes.length > 0) {
      console.log(`\n  🔍 Indexes (${indexes.length}):`)
      indexes.forEach(idx => {
        console.log(`    - ${idx.indexname}`)
      })
    }

    // Get RLS policies
    const policies = await getRLSPolicies(table)
    if (policies && policies.length > 0) {
      console.log(`\n  🔒 RLS Policies (${policies.length}):`)
      policies.forEach(policy => {
        console.log(`    - ${policy.policyname} (${policy.cmd})`)
      })
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('✅ Check complete\n')
}

main().catch(console.error)
