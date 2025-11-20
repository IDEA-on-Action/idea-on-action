# Production Migration Verification - Quick Start Guide

**Last Updated**: 2025-11-21
**Estimated Time**: 5-10 minutes
**Required**: PostgreSQL client (psql), Database credentials

---

## Prerequisites

✅ PostgreSQL client installed (`psql` command available)
✅ Production database credentials (from Supabase dashboard)
✅ Migrations applied to production DB

---

## Step-by-Step Guide

### Step 1: Set Database Connection (1 min)

**Option A: Environment Variable** (Recommended)
```bash
export DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

**Option B: Copy from Supabase Dashboard**
1. Open Supabase Dashboard → Project Settings → Database
2. Copy "Connection string" (URI format)
3. Replace `[YOUR-PASSWORD]` with actual password

**Test Connection**:
```bash
psql $DATABASE_URL -c "SELECT version();"
```

Expected output: PostgreSQL version string

---

### Step 2: Run Quick Verification (30 seconds)

```bash
cd d:\GitHub\idea-on-action
psql $DATABASE_URL -f scripts/validation/quick-verify-prod.sql
```

**Expected Output**:
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

**Result**:
- ✅ **All green checks** → Migrations verified! Skip to Step 4.
- ❌ **Any red checks** → Continue to Step 3.

---

### Step 3: Run Full Verification (if issues found) (2-3 min)

```bash
# Save detailed output
psql $DATABASE_URL -f scripts/validation/verify-production-migrations.sql > verification-output.txt 2>&1

# Review the output
cat verification-output.txt
# or open in text editor
```

**Analyze Output**:
1. Find all `❌ FAIL` lines
2. Note the check number and description
3. Check the "Summary" section for each migration

**Common Issues**:

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| "view does not exist" | Migration not applied | Apply migration file |
| "SECURITY DEFINER" | Old function version | Re-run migration |
| "auth.users" reference | View not updated | Re-run migration |
| "X RLS policies" (not 3) | Policies not created | Re-run migration |
| "functions: X/28" | Search path not set | Apply search path migration |

---

### Step 4: Document Results (2-3 min)

Fill in the verification report template:

**File**: `docs/guides/security/production-migration-verification-report.md`

**Required sections**:
1. **Executive Summary** → Copy "Overall Status" from quick verification
2. **Newsletter Security** → Copy 5 checks from output
3. **Function Search Path** → Copy 2 checks from output
4. **Issues Found** → List any ❌ FAIL items (or write "None")
5. **Date/Time** → Add current timestamp

**Example**:
```markdown
## Executive Summary

| Migration | Status | Checks Passed | Issues Found |
|-----------|--------|---------------|--------------|
| Newsletter Security | ✅ PASS | 8/8 | 0 |
| Function Search Path | ✅ PASS | 3/3 | 0 |
| **Overall** | ✅ VERIFIED | 11/11 | 0 |

**Quick Status**: ✅ ALL MIGRATIONS VERIFIED
```

---

### Step 5: Archive Verification Output (1 min)

```bash
# Create archive directory (if not exists)
mkdir -p docs/archive/2025-11-21

# Move verification output
mv verification-output.txt docs/archive/2025-11-21/production-verification-2025-11-21.txt

# (Optional) Commit to git
git add docs/archive/2025-11-21/
git commit -m "docs: add production verification output (2025-11-21)"
```

---

## Verification Checklist

- [ ] Step 1: Database connection tested
- [ ] Step 2: Quick verification run
- [ ] Step 3: Full verification (if needed)
- [ ] Step 4: Report template filled
- [ ] Step 5: Output archived

---

## Troubleshooting

### psql: command not found
**Install PostgreSQL client**:
- **macOS**: `brew install postgresql`
- **Ubuntu**: `sudo apt-get install postgresql-client`
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### connection refused / timeout
**Check**:
1. Supabase project is running (not paused)
2. Database password is correct
3. IP whitelist allows your connection (if enabled)
4. Connection string format is correct

### permission denied
**Use superuser connection**:
```bash
# Connect as postgres user
psql -U postgres $DATABASE_URL -f scripts/validation/quick-verify-prod.sql
```

### relation "X" does not exist
**Apply migrations first**:
```bash
# Check applied migrations
psql $DATABASE_URL -c "SELECT version FROM supabase_migrations.schema_migrations ORDER BY version DESC LIMIT 10;"

# Apply missing migrations
psql $DATABASE_URL -f supabase/migrations/20251121000000_fix_newsletter_security_issues.sql
psql $DATABASE_URL -f supabase/migrations/20251122000001_fix_critical_functions_search_path.sql
```

---

## Next Steps After Verification

### If All Checks Pass ✅
1. Archive verification output
2. Update project status in CLAUDE.md
3. Mark migration tasks as complete
4. Schedule next verification (30 days)

### If Any Checks Fail ❌
1. Review full verification output
2. Identify root cause (migration not applied, wrong version, etc.)
3. Apply fix (re-run migration, manual SQL, rollback)
4. Re-run verification
5. Document issue and resolution

---

## Related Files

**Verification Scripts**:
- `scripts/validation/quick-verify-prod.sql` - Quick check (30s)
- `scripts/validation/verify-production-migrations.sql` - Full check (2-3min)

**Documentation**:
- `docs/guides/security/production-migration-verification-report.md` - Report template
- `docs/guides/security/supabase-security-audit-2025-11-21.md` - Security audit
- `docs/guides/security/newsletter-security-quick-ref.md` - Quick reference
- `scripts/validation/README-production-verification.md` - Detailed guide

**Migrations Verified**:
- `supabase/migrations/20251121000000_fix_newsletter_security_issues.sql`
- `supabase/migrations/20251122000001_fix_critical_functions_search_path.sql`

---

## Contact

**Questions or Issues?**
- Email: sinclairseo@gmail.com
- GitHub: https://github.com/IDEA-on-Action/idea-on-action

---

**Generated**: 2025-11-21
**Version**: 1.0
