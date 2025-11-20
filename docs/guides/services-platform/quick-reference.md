# Services Platform - Quick Reference

**Last Updated**: 2025-11-21
**Status**: Production Ready ✅

---

## 📦 Quick Start

### View Service Detail Page
```typescript
// Navigate to service by slug
navigate('/services/mvp-development')

// Or by UUID (fallback)
navigate('/services/fed76f94-b3a0-4c88-9540-cf3f98ef354c')
```

### Add Item to Cart
```typescript
import { useCartStore } from '@/store/cartStore'

const { addServiceItem } = useCartStore()

// Add package
addServiceItem({
  type: 'package',
  service_id: 'service-uuid',
  service_title: 'MVP 개발',
  item_id: 'package-uuid',
  item_name: 'Standard',
  price: 8000000,
  quantity: 1,
})

// Add subscription plan
addServiceItem({
  type: 'plan',
  service_id: 'service-uuid',
  service_title: '풀스택 개발',
  item_id: 'plan-uuid',
  item_name: '프로 플랜',
  price: 15000000,
  quantity: 1,
  billing_cycle: 'monthly',
})
```

---

## 🎣 React Query Hooks

### Fetch Service Detail
```typescript
import { useServiceDetailBySlug } from '@/hooks/useServicesPlatform'

// Recommended: Use slug
const { data: service, isLoading, error } = useServiceDetailBySlug('mvp-development')

// Fallback: Use UUID
const { data: service, isLoading, error } = useServiceDetail(serviceId)

// Data structure
service = {
  id: string,
  title: string,
  slug: string,
  description: string,
  category: string,
  tags: string[],
  pricing_data: {
    packages: ServicePackage[],
    plans: SubscriptionPlan[],
  },
  deliverables: Deliverable[],
  process_steps: ProcessStep[],
  faq: FAQItem[],
  hero_image_url: string,
  additional_images: string[],
}
```

### Fetch Packages/Plans
```typescript
import { useServicePackages, useSubscriptionPlans } from '@/hooks/useServicesPlatform'

// Get all packages for a service
const { data: packages } = useServicePackages(serviceId)

// Get all plans for a service
const { data: plans } = useSubscriptionPlans(serviceId)

// Get popular items
const { data: popularPackages } = usePopularPackages(serviceId)
const { data: popularPlans } = usePopularPlans(serviceId)
```

---

## 🧩 Components

### ServiceDetail Page
```typescript
import ServiceDetail from '@/pages/ServiceDetail'

// Route: /services/:id (slug or UUID)
<Route path="/services/:id" element={<ServiceDetail />} />
```

### ServiceHero
```typescript
import { ServiceHero } from '@/components/services-platform/ServiceHero'

<ServiceHero
  title="MVP 개발"
  description="Markdown content..."
  category="development"
  tags={['MVP', 'React', 'Supabase']}
  heroImageUrl="https://..."
  additionalImages={['https://...']}
/>
```

### PackageSelector
```typescript
import { PackageSelector } from '@/components/services-platform/PackageSelector'

<PackageSelector
  service={service}
  packages={packages}
  plans={plans}
  onSelectPackage={(pkg) => handleAddToCart(pkg)}
  onSelectPlan={(plan) => handleSubscribe(plan)}
/>
```

### PricingCard
```typescript
import { PricingCard } from '@/components/services-platform/PricingCard'

// Package
<PricingCard
  service={service}
  item={package}
  isPackage={true}
  onSelect={(pkg) => handleAddToCart(pkg)}
/>

// Plan
<PricingCard
  service={service}
  item={plan}
  isPackage={false}
  onSelect={(plan) => handleSubscribe(plan)}
/>
```

### ProcessTimeline
```typescript
import { ProcessTimeline } from '@/components/services-platform/ProcessTimeline'

<ProcessTimeline
  steps={[
    {
      title: 'Step 1',
      description: 'Description...',
      duration: '1주',
      activities: ['Activity 1', 'Activity 2'],
    },
  ]}
/>
```

### DeliverablesGrid
```typescript
import { DeliverablesGrid } from '@/components/services-platform/DeliverablesGrid'

<DeliverablesGrid
  deliverables={[
    {
      title: 'Source Code',
      description: 'Full source code...',
      icon: 'Code',
    },
  ]}
/>
```

### FAQSection
```typescript
import { FAQSection } from '@/components/services-platform/FAQSection'

<FAQSection
  faqs={[
    {
      question: 'How long does it take?',
      answer: 'Typically 2-4 weeks...',
    },
  ]}
/>
```

### AddToServiceCartButton
```typescript
import { AddToServiceCartButton } from '@/components/services-platform/AddToServiceCartButton'

<AddToServiceCartButton
  service={service}
  item={package}
  isPackage={true}
  label="장바구니 담기"
  size="default"
  variant="default"
  fullWidth={true}
  onAdded={() => console.log('Added!')}
/>
```

---

## 🛒 Cart Store (Zustand)

### State
```typescript
import { useCartStore } from '@/store/cartStore'

const {
  isOpen,          // boolean - Cart drawer open/closed
  itemCount,       // number - Total items (for badge)
  serviceItems,    // ServiceCartItem[] - Service packages/plans
  openCart,        // () => void
  closeCart,       // () => void
  toggleCart,      // () => void
  addServiceItem,  // (item: ServiceCartItem) => void
  removeServiceItem, // (itemId: string) => void
  clearServiceItems, // () => void
} = useCartStore()
```

### LocalStorage Persistence
```typescript
// Automatically persisted to localStorage
// Key: 'cart-storage'
// Only serviceItems are persisted (not isOpen, itemCount)
```

---

## 🗂️ TypeScript Types

### Core Types
```typescript
import type {
  Service,
  ServiceWithContent,
  ServicePackage,
  SubscriptionPlan,
  ServiceCartItem,
  Deliverable,
  ProcessStep,
  FAQItem,
  BillingCycle,
} from '@/types/services-platform'

// BillingCycle
type BillingCycle = 'monthly' | 'quarterly' | 'yearly'

// ServiceCartItem
interface ServiceCartItem {
  type: 'package' | 'plan'
  service_id: string
  service_title: string
  item_id: string
  item_name: string
  price: number
  quantity: number
  billing_cycle?: BillingCycle // Only for plans
}
```

---

## 🔍 Database Queries

### Supabase Direct Queries
```typescript
import { supabase } from '@/lib/supabase'

// Fetch service with packages/plans
const { data } = await supabase
  .from('services')
  .select(`
    *,
    packages:service_packages(*),
    plans:subscription_plans(*)
  `)
  .eq('slug', 'mvp-development')
  .single()

// Fetch packages for service
const { data } = await supabase
  .from('service_packages')
  .select('*')
  .eq('service_id', serviceId)
  .order('display_order')

// Fetch popular plans
const { data } = await supabase
  .from('subscription_plans')
  .select('*')
  .eq('service_id', serviceId)
  .eq('is_popular', true)
```

---

## 📊 Data Flow

### Complete User Journey
```
1. Browse Services (/services)
   └─> ServiceCard click

2. View Service Detail (/services/:slug)
   ├─> useServiceDetailBySlug(slug)
   ├─> ServiceHero (service info)
   ├─> PackageSelector (packages/plans)
   │   └─> PricingCard (individual item)
   │       └─> AddToServiceCartButton
   │           └─> addServiceItem() → cartStore
   │               └─> Toast notification
   │                   └─> "장바구니 보기" action
   │                       └─> openCart()
   ├─> ProcessTimeline (process steps)
   ├─> DeliverablesGrid (deliverables)
   └─> FAQSection (FAQ)

3. View Cart (CartDrawer)
   ├─> Regular items (cart_items)
   └─> Service items (serviceItems)
       └─> ServiceCartItem (render)
           └─> Remove button → removeServiceItem()

4. Checkout (/checkout)
   └─> CartSummary
       ├─> Calculate total (regular + service items)
       └─> Navigate to checkout
```

---

## 🧪 Testing Checklist

### Manual Testing
- [ ] Browse `/services` page
- [ ] Click service card → Navigate to `/services/:slug`
- [ ] View service detail page
- [ ] Click "장바구니 담기" on package
- [ ] Toast notification appears
- [ ] Click "장바구니 보기" → Drawer opens
- [ ] Verify item in drawer
- [ ] Click remove button → Item removed
- [ ] Click "장바구니 비우기" → All items cleared
- [ ] Add multiple items (regular + service)
- [ ] Verify total calculation (with 10% VAT)
- [ ] Navigate to `/checkout`
- [ ] Verify service items included in checkout

### E2E Tests (Future)
```typescript
// tests/e2e/services-platform.spec.ts
import { test, expect } from '@playwright/test'

test('add service package to cart', async ({ page }) => {
  await page.goto('/services/mvp-development')
  await page.getByRole('button', { name: '장바구니 담기' }).first().click()
  await expect(page.getByText('장바구니에 추가되었습니다')).toBeVisible()
  await page.getByRole('button', { name: '장바구니 보기' }).click()
  await expect(page.getByText('MVP 개발')).toBeVisible()
})
```

---

## 🚨 Troubleshooting

### Issue: Service not found
**Symptom**: 404 error on `/services/:slug`
**Solution**: Check slug in database
```sql
SELECT slug FROM services WHERE slug = 'mvp-development';
```

### Issue: Cart not persisting
**Symptom**: Cart items disappear on page reload
**Solution**: Check localStorage
```javascript
localStorage.getItem('cart-storage')
```

### Issue: Toast not appearing
**Symptom**: No notification after adding to cart
**Solution**: Check Sonner Toaster in App.tsx
```typescript
import { Toaster } from 'sonner'
<Toaster position="top-right" />
```

### Issue: TypeScript errors
**Symptom**: Type mismatches
**Solution**: Check type imports
```typescript
import type { ServiceCartItem } from '@/types/services-platform'
```

---

## 📚 Related Documentation

- [DB Setup Summary](./db-setup-summary.md) - Database schema and migrations
- [Cart Integration Summary](./cart-integration-summary.md) - Cart implementation details
- [Production Deployment Checklist](./production-deployment-checklist.md) - 71-item checklist
- [Integration Verification Report](./integration-verification-report.md) - Final verification
- [Services Platform Completion Summary](./services-platform-completion-summary.md) - Project overview

---

## 🔗 Quick Links

### Production URLs
- Service List: https://www.ideaonaction.ai/services
- MVP Service: https://www.ideaonaction.ai/services/mvp-development
- Fullstack Service: https://www.ideaonaction.ai/services/fullstack-development
- Design Service: https://www.ideaonaction.ai/services/design-system
- Operations Service: https://www.ideaonaction.ai/services/operations-management

### Database Tables
- `services` - Service catalog
- `service_packages` - One-time project packages
- `subscription_plans` - Recurring subscription plans

### Code Locations
- Types: `src/types/services-platform.ts`
- Hooks: `src/hooks/useServicesPlatform.ts`
- Components: `src/components/services-platform/`
- Page: `src/pages/ServiceDetail.tsx`
- Store: `src/store/cartStore.ts`

---

**Quick Reference Updated**: 2025-11-21
**Next Update**: After production deployment
