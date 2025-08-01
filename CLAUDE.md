# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AllGoMenu is a multi-tenant restaurant delivery platform built with Next.js 14, designed to help Brazilian restaurants eliminate dependency on large marketplaces and reduce operational costs by 30%. The system serves multiple restaurants through a single codebase using slug-based routing.

## Development Commands

Since this project is in the planning phase, commands will be updated once the codebase is implemented. Expected commands based on Next.js/TypeScript stack:

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run start           # Start production server

# Code Quality
npm run lint            # ESLint check
npm run typecheck       # TypeScript validation
npm run test            # Run test suite
npm run test:watch      # Run tests in watch mode

# Database (Supabase)
npm run db:push         # Push schema changes (development)
npm run db:migrate      # Run migrations (production)
npm run db:seed         # Seed database with test data
```

## Core Architecture

### Multi-tenant System Design
- **Slug-based Routing**: Every restaurant has a unique slug (`/[slug]`, `/[slug]/admin`)
- **Data Isolation**: All database entities MUST be linked to `restaurantId`
- **Access Control**: Users can only access their own restaurant data
- **Shared Infrastructure**: Single codebase serves multiple restaurants

### Route Structure
```
/                           # Landing page
/[slug]                     # Restaurant customer view
/[slug]/admin               # Restaurant admin dashboard
/admin                      # Super admin (platform management)
/api/restaurant/[slug]/*    # Public restaurant APIs
/api/admin/*               # Protected admin APIs
```

### Database Patterns
- **Cascade Relationships**: Restaurant → Categories → Products (CASCADE delete)
- **Protect References**: Product references in OrderItems (RESTRICT delete)
- **Multi-tenant Filtering**: Always include `restaurantId` in queries
- **Variation System**: Products have Groups (size, flavor) → Options (individual pricing)

### Authentication Flow
- JWT with refresh tokens stored in localStorage
- Every protected API route must validate restaurant ownership
- Use `getAuthUser()` helper for authentication checks
- Validate `restaurantSlug` against user's profile

## Key Technical Features

### Advanced Color System
- Input: 2-4 base colors from restaurant branding
- Output: Complete 11-tone palette (50-950) following Tailwind standards
- HSL interpolation algorithm (not fixed addition)
- WCAG 2.1 contrast validation for accessibility
- CSS custom properties injected at restaurant layout level

### Native PIX Payment Integration
- Zero external dependencies - generates BR Code payload directly
- QR Code + "Copia e Cola" automatically generated per order
- 30-minute payment window with visual countdown
- Manual confirmation workflow via WhatsApp

### WhatsApp Integration
- Direct link integration (MVP phase)
- Pre-formatted order messages with restaurant/customer details
- Template system for customizable message formats
- Future: WhatsApp Business API integration

## Development Patterns

### State Management
- **Zustand**: Global state that persists across navigation
- **React Query**: Server state with automatic caching/sync
- **Local useState**: Component-only temporary state

### API Design
```typescript
// Always validate restaurant access
const authUser = await getAuthUser(request)
await validateRestaurantAccess(authUser.profileId, restaurantSlug)

// Always filter by restaurant
const products = await db.product.findMany({
  where: { 
    restaurantId,
    category: { restaurantId } // Related data must also belong to restaurant
  }
})
```

### Error Handling
```typescript
// Consistent error responses
return NextResponse.json(
  { error: 'Specific error message', code: 'ERROR_CODE' }, 
  { status: 400 }
)
```

## Business Context

### Target Market
- Brazilian local restaurants wanting independence from iFood/Uber Eats
- 57% cheaper than competitors (R$ 69/month vs R$ 135-300/month)
- Focus on eliminating 27%+ marketplace commissions

### Key Differentiators
- **Zero Commission Model**: Restaurant keeps 100% of revenue
- **Native PIX Payments**: No external payment processor fees
- **Complete Brand Control**: Restaurant owns customer experience
- **Brazilian-Optimized**: Local market features and compliance

### Performance Targets
- Loading Time: < 2 seconds (LCP)
- Concurrent Users per Restaurant: 1,000
- Simultaneous Orders per Restaurant: 100
- API Response Time: < 200ms

## Security Requirements

### LGPD Compliance
- Basic privacy policy implementation
- Cookie consent management
- Audit logs for orders and authentication

### Data Security
- Restaurant data must be completely isolated
- bcrypt for password hashing
- HTTPS enforcement across all environments
- Daily automated backups with 7-day retention

## Development Phases

### Phase 1 MVP (Current Focus)
- Multi-tenant base system with authentication
- Menu management with complex variations
- WhatsApp order integration (direct links)
- PIX payment system with QR codes
- Restaurant admin dashboard
- Advanced color theming system

### Subsequent Phases
- Advanced analytics and reporting
- WhatsApp Business API integration
- Mobile PWA
- Multi-location restaurant support
- White-label partner solutions

## Project Status

**Current Phase**: Planning complete, ready for implementation
**Next Step**: Initialize Next.js 14 project with TypeScript and Supabase integration
**Architecture**: Detailed PRD specifications available in `/docs/` directory