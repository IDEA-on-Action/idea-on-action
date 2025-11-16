# User Value Fields - Quick Reference Card

**Migration**: `20251116120000_add_user_value_fields.sql`

---

## 📋 New Fields

### Roadmap Table
```sql
user_benefits   JSONB    DEFAULT '[]'::jsonb
stability_score INTEGER  DEFAULT 99 CHECK (0-100)
```

### Projects Table
```sql
problem  TEXT  DEFAULT NULL
solution TEXT  DEFAULT NULL
impact   JSONB DEFAULT '{}'::jsonb
```

---

## 🚀 Quick Commands

### Apply Migration
```bash
supabase db push              # Production
supabase db reset             # Local
```

### Verify Migration
```bash
psql -f scripts/validation/verify-user-value-fields-migration.sql
```

### Rollback Migration
```bash
psql -f supabase/migrations/rollback-20251116120000_add_user_value_fields.sql
```

---

## 💾 SQL Examples

### Roadmap: Add User Benefits
```sql
UPDATE roadmap
SET user_benefits = '["빠른 로딩", "안정적인 서비스"]'::jsonb,
    stability_score = 99
WHERE id = 1;
```

### Projects: Add Storytelling
```sql
UPDATE projects
SET problem = '고객사가 포트폴리오 웹사이트가 필요했어요',
    solution = 'React + Tailwind로 반응형 웹사이트 제작',
    impact = '{"users": "월 500명", "satisfaction": "4.8/5.0"}'::jsonb
WHERE slug = 'homepage-2025';
```

---

## 🔍 Query Examples

### Find High-Stability Items
```sql
SELECT * FROM roadmap
WHERE stability_score >= 95;
```

### Search JSON Arrays
```sql
SELECT * FROM roadmap
WHERE user_benefits @> '["빠른 로딩"]'::jsonb;
```

### Search JSON Objects
```sql
SELECT * FROM projects
WHERE impact->>'satisfaction' LIKE '4.%/5.0';
```

---

## 📊 TypeScript Types

### Roadmap Interface
```typescript
interface Roadmap {
  // ... existing fields
  user_benefits?: string[];
  stability_score?: number;
}
```

### Project Interface
```typescript
interface Project {
  // ... existing fields
  problem?: string;
  solution?: string;
  impact?: ProjectImpact;
}

interface ProjectImpact {
  users?: string;
  timeSaved?: string;
  satisfaction?: string;
  revenue?: string;
}
```

---

## ✅ Verification Checklist

- [ ] Migration file exists
- [ ] TypeScript types updated
- [ ] 5 columns created (2 roadmap + 3 projects)
- [ ] 2 GIN indexes created
- [ ] 1 check constraint created
- [ ] Sample data inserted
- [ ] Admin UI forms updated
- [ ] User testing passed

---

## 🔗 Related Files

- **Migration**: `supabase/migrations/20251116120000_add_user_value_fields.sql`
- **Rollback**: `supabase/migrations/rollback-20251116120000_add_user_value_fields.sql`
- **Verification**: `scripts/validation/verify-user-value-fields-migration.sql`
- **Full Guide**: `docs/guides/database/user-value-fields-migration.md`
- **Summary**: `docs/guides/database/user-value-fields-summary.md`
- **Types**: `src/types/v2.ts`

---

## 🆘 Troubleshooting

### Permission Denied
```sql
GRANT SELECT ON roadmap, projects TO anon, authenticated;
```

### JSON Validation Error
```sql
-- Use jsonb_build_array for arrays
SET user_benefits = jsonb_build_array('value1', 'value2')

-- Use jsonb_build_object for objects
SET impact = jsonb_build_object('key', 'value')
```

### Index Missing
```sql
CREATE INDEX idx_roadmap_user_benefits ON roadmap USING GIN(user_benefits);
CREATE INDEX idx_projects_impact ON projects USING GIN(impact);
```

---

**Last Updated**: 2025-11-16
**Status**: ✅ Production Ready
