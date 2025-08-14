# Admin Panel Environment Variable Test

## Current Setup
- **Development**: `NEXT_PUBLIC_ENABLE_ADMIN=true` in `.env.local`
- **Production**: `NEXT_PUBLIC_ENABLE_ADMIN=false` in `.env.production`

## Testing Instructions

### To Test Admin Panel Enabled (Development)
1. Ensure `.env.local` contains `NEXT_PUBLIC_ENABLE_ADMIN=true`
2. Run `npm run dev`
3. Start the experience
4. **Expected**: Admin button visible in top-right corner
5. **Expected**: Admin panel opens when clicked

### To Test Admin Panel Disabled (Production)
1. Change `.env.local` to `NEXT_PUBLIC_ENABLE_ADMIN=false`
2. Restart development server (`npm run dev`)
3. Start the experience
4. **Expected**: No admin button visible
5. **Expected**: No admin panel functionality
6. **Expected**: Reduced bundle size (admin components not loaded)

### Production Build Test
1. Set `NEXT_PUBLIC_ENABLE_ADMIN=false`
2. Run `npm run build`
3. Check bundle analyzer (if available) - admin components should be excluded
4. Run `npm start` and test production build

## What Gets Disabled
When `NEXT_PUBLIC_ENABLE_ADMIN=false`:
- ❌ Admin toggle button (hidden)
- ❌ Admin panel component (not bundled)
- ❌ Admin state management (disabled)
- ❌ Admin settings passed to 3D components (null)
- ❌ Admin-related imports (lazy loaded, excluded from bundle)

## Implementation Details
- Uses `AdminPanelWrapper` with lazy loading
- Environment variable checked at build time
- Conditional rendering prevents runtime overhead
- Clean separation between development and production code