# LendIt Frontend Architecture — Phase 3

## Mental model

```text
DOMAIN
  ↓
FEATURE
  ↓
COMPONENTS
  ↓
UI
```

## Layers

```text
app/        Application composition
layouts/    Shared shell and navigation
routes/     User destinations and navigation metadata
features/   Business-facing vertical slices
components/ Reusable UI primitives
services/   API/network boundary
 types/     Shared domain types
 theme/     Semantic visual tokens
 lib/       Small pure utilities
```

## State strategy

- **Server state:** feature services now; a dedicated server-state library can be introduced when real API caching/synchronisation is needed.
- **UI state:** local React state for things like search, mobile navigation, and theme selection.
- **Form state:** keep local to the form until cross-screen coordination is proven necessary.
- **Derived state:** calculate with selectors/memoization only when useful; do not duplicate source data.
- **Session state:** introduce a focused auth/session mechanism when authentication is implemented.

No global state library is introduced in Phase 3 because the current product has no demonstrated cross-feature state problem.

## API boundary

```text
Component
  ↓
Feature service
  ↓
apiClient
  ↓
HTTP API
```

The UI should consume domain-shaped data and should not know URL construction or transport details.

## Error model

Every major data view should support:

```text
Loading → Success
       ↘ Empty
       ↘ Error → Retry
```

## Architectural rule

Create a new abstraction only when repeated real usage makes the boundary useful.
