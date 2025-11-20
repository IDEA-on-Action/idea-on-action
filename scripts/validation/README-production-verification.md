# Production Migration Verification Scripts

This directory contains SQL scripts for verifying production migrations and database configurations.

## Available Scripts

### 1. Quick Production Verification (5 minutes)
**File**: `quick-verify-prod.sql`
**Purpose**: Fast verification of critical migration points
**Run time**: ~30 seconds
**Checks**: 7 critical items

```bash
# Run quick verification
psql $DATABASE_URL -f scripts/validation/quick-verify-prod.sql
```

**Output Example**:
```
🔍 Quick Production Migration Verification
===========================================

📧 Newsletter Security:
✅ View exists
✅ No auth.users exposure
✅ 3 RLS policies
✅ No DEFINER functions
✅ Anonymous access revoked

🔧 Function Search Path:
✅ Critical functions: 28/28+
✅ Trigger functions: 44/44+

📊 Overall Status:
✅ ALL MIGRATIONS VERIFIED
```

---

### 2. Full Production Verification (detailed)
**File**: `verify-production-migrations.sql`
**Purpose**: Comprehensive verification with detailed reporting
**Run time**: ~2-3 minutes
**Checks**: 13 detailed items

```bash
# Run full verification (save output)
psql $DATABASE_URL -f scripts/validation/verify-production-migrations.sql > verification-output.txt 2>&1

# Or run interactively
psql $DATABASE_URL -f scripts/validation/verify-production-migrations.sql
```

**Verification Sections**:
1. Newsletter Security Migration (8 checks)
   - View existence and configuration
   - auth.users exposure check
   - RLS policies (3 expected)
   - Anonymous role privileges
   - Function security modes (INVOKER vs DEFINER)

2. Function Search Path Migration (3 checks)
   - Critical functions (28 expected)
   - Trigger functions (44 expected)
   - Total coverage (72+ functions)

3. Additional Security Checks (2 checks)
   - Remaining SECURITY DEFINER functions
   - Views without security_invoker

**Output Example**:
```
================================================================
Production Migration Verification Report
Generated: Thu Nov 21 15:30:00 UTC 2025
================================================================

1. Newsletter Security Migration (20251121000000)
   Testing 8 security controls...

   Check 1/8: newsletter_subscribers view exists
   ✅ PASS: newsletter_subscribers view exists

   Check 2/8: View has security_invoker = true
   ✅ PASS: View has security_invoker = true

   [... 6 more checks ...]

   Summary: 8/8 checks passed
   ✅ Newsletter Security Migration: VERIFIED

================================================================

2. Function Search Path Migration (20251122000001)
   Testing 72 critical functions...

   Check 1/3: Critical functions (28 expected)
   ✅ PASS: All 28 critical functions have search_path

   [... 2 more checks ...]

   ✅ Function Search Path Migration: VERIFIED

================================================================

3. Additional Security Checks

   Check 1/2: Remaining SECURITY DEFINER functions
   ✅ PASS: No SECURITY DEFINER functions

   Check 2/2: Views with security_invoker
   ✅ PASS: All views have security_invoker

================================================================
Verification Complete
================================================================
```

---

### 3. Other Validation Scripts

#### Newsletter Security Check
**File**: `check-newsletter-security.sql`
**Purpose**: Detailed newsletter system security audit
**Location**: `scripts/validation/check-newsletter-security.sql`

```bash
psql $DATABASE_URL -f scripts/validation/check-newsletter-security.sql
```

#### Service Categories Schema Check
**File**: `check-service-categories-schema.sql`
**Purpose**: Verify service_categories table and RLS policies
**Location**: `scripts/validation/check-service-categories-schema.sql`

```bash
psql $DATABASE_URL -f scripts/validation/check-service-categories-schema.sql
```

#### All Services Data Check
**File**: `check-all-services-data.sql`
**Purpose**: Verify services, packages, and subscription plans data
**Location**: `scripts/validation/check-all-services-data.sql`

```bash
psql $DATABASE_URL -f scripts/validation/check-all-services-data.sql
```

---

## Usage Guide

### Step 1: Connect to Database

#### Option A: Supabase CLI
```bash
# Connect to local database
supabase db reset

# Connect to production (use carefully!)
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

#### Option B: Environment Variable
```bash
# Set DATABASE_URL in .env.local
export DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Run script
psql $DATABASE_URL -f scripts/validation/quick-verify-prod.sql
```

#### Option C: Direct Connection
```bash
psql -h db.[project-ref].supabase.co \
     -U postgres \
     -d postgres \
     -f scripts/validation/quick-verify-prod.sql
```

---

### Step 2: Run Verification

#### Quick Check (recommended first)
```bash
# Run quick verification
psql $DATABASE_URL -f scripts/validation/quick-verify-prod.sql
```

**Interpret Results**:
- ✅ All checks pass → Migrations verified successfully
- ❌ Any check fails → Run full verification for details

#### Full Verification (if issues found)
```bash
# Save output to file for analysis
psql $DATABASE_URL -f scripts/validation/verify-production-migrations.sql > verification-report.txt 2>&1

# Review the report
cat verification-report.txt
```

---

### Step 3: Document Results

Use the verification output to fill in the **Production Migration Verification Report**:

**Template**: `docs/guides/security/production-migration-verification-report.md`

**Fill in sections**:
1. Executive Summary (overall status)
2. Newsletter Security checks (8 items)
3. Function Search Path checks (3 items)
4. Additional Security checks (2 items)
5. Issues found (if any)
6. Recommendations
7. Verification output (appendix)

---

## Verification Checklist

### Pre-Verification
- [ ] Confirm database connection (production or staging)
- [ ] Backup database (if running on production)
- [ ] Check applied migrations list
- [ ] Review migration files for expected changes

### During Verification
- [ ] Run quick verification first
- [ ] If issues found, run full verification
- [ ] Save all output to files
- [ ] Screenshot any errors or warnings

### Post-Verification
- [ ] Fill in verification report template
- [ ] List all failed checks (if any)
- [ ] Document recommended fixes
- [ ] Get approval from team lead (if production)
- [ ] Archive verification output

---

## Troubleshooting

### Issue: "relation does not exist"
**Cause**: Migration not applied or database mismatch
**Fix**:
```sql
-- Check applied migrations
SELECT version FROM supabase_migrations.schema_migrations
ORDER BY version DESC LIMIT 10;

-- Apply missing migration
psql $DATABASE_URL -f supabase/migrations/20251121000000_fix_newsletter_security_issues.sql
```

### Issue: "permission denied"
**Cause**: Insufficient database privileges
**Fix**:
```bash
# Connect as superuser (postgres)
psql -U postgres $DATABASE_URL -f scripts/validation/quick-verify-prod.sql
```

### Issue: "function does not exist"
**Cause**: Function search path migration not applied
**Fix**:
```sql
-- Check function existence
SELECT proname, pronamespace::regnamespace
FROM pg_proc
WHERE proname LIKE '%newsletter%';

-- Apply function search path migration
psql $DATABASE_URL -f supabase/migrations/20251122000001_fix_critical_functions_search_path.sql
```

### Issue: "timeout" or "connection refused"
**Cause**: Database connection issues
**Fix**:
```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Check Supabase project status
supabase status
```

---

## Related Documentation

- [Production Migration Verification Report](../../docs/guides/security/production-migration-verification-report.md)
- [Newsletter Security Audit](../../docs/guides/security/supabase-security-audit-2025-11-21.md)
- [Newsletter Security Quick Reference](../../docs/guides/security/newsletter-security-quick-ref.md)
- [Function Search Path Migration Guide](../../docs/guides/database/function-search-path-migration-guide.md)

---

## Maintenance

### Regular Verification Schedule
- **After every migration**: Run quick verification
- **Weekly**: Run full verification on staging
- **Monthly**: Run full verification on production
- **Quarterly**: Security audit + verification

### Script Updates
When adding new migrations:
1. Update `verify-production-migrations.sql` with new checks
2. Update `quick-verify-prod.sql` if critical
3. Update this README with new script documentation
4. Update verification report template

---

**Last Updated**: 2025-11-21
**Maintained By**: IDEA on Action Team
**Questions**: Contact sinclairseo@gmail.com
