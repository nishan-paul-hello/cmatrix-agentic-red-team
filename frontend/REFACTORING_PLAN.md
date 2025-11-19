# Frontend Refactoring Plan

## Overview
Restructure the frontend to follow Next.js 14+ industry standards and best practices for enterprise-grade applications.

## Current Structure Issues
1. ❌ Components mixed with business logic
2. ❌ No clear separation between UI components and feature components
3. ❌ Types not properly organized
4. ❌ Utilities scattered
5. ❌ No hooks abstraction
6. ❌ Styles not properly organized
7. ❌ No constants/config management
8. ❌ API client logic embedded in components

## Proposed Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Route groups for better organization
│   │   ├── (main)/              # Main application routes
│   │   │   ├── page.tsx         # Home/Chat page
│   │   │   └── layout.tsx       # Main layout
│   │   └── demo/                # Demo feature
│   │       └── page.tsx
│   ├── api/                      # API routes
│   │   └── chat/
│   │       └── route.ts
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── src/                          # Source code (NEW)
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   └── textarea.tsx
│   │   ├── chat/                 # Chat-specific components
│   │   │   ├── chat-message.tsx
│   │   │   ├── chat-input.tsx
│   │   │   ├── chat-header.tsx
│   │   │   └── chat-container.tsx
│   │   ├── diagram/              # Diagram components
│   │   │   └── animated-diagram.tsx
│   │   ├── layout/               # Layout components
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   └── shared/               # Shared components
│   │       ├── typewriter-text.tsx
│   │       └── loading-spinner.tsx
│   │
│   ├── features/                 # Feature-based modules
│   │   ├── chat/                 # Chat feature
│   │   │   ├── components/       # Feature-specific components
│   │   │   ├── hooks/            # Feature-specific hooks
│   │   │   │   ├── use-chat.ts
│   │   │   │   └── use-chat-stream.ts
│   │   │   ├── types/            # Feature-specific types
│   │   │   │   └── chat.types.ts
│   │   │   └── utils/            # Feature-specific utilities
│   │   │       └── chat.utils.ts
│   │   └── demo/                 # Demo feature
│   │       ├── components/
│   │       ├── hooks/
│   │       └── types/
│   │
│   ├── lib/                      # Shared libraries
│   │   ├── api/                  # API client
│   │   │   ├── client.ts         # Base API client
│   │   │   └── endpoints/        # API endpoints
│   │   │       └── chat.ts
│   │   ├── utils/                # Utility functions
│   │   │   ├── cn.ts             # Class name utility
│   │   │   ├── format.ts         # Formatting utilities
│   │   │   └── validation.ts     # Validation utilities
│   │   └── hooks/                # Shared hooks
│   │       ├── use-scroll-to-bottom.ts
│   │       └── use-local-storage.ts
│   │
│   ├── types/                    # Global TypeScript types
│   │   ├── api.types.ts
│   │   ├── chat.types.ts
│   │   └── common.types.ts
│   │
│   ├── config/                   # Configuration files
│   │   ├── site.config.ts        # Site metadata
│   │   └── api.config.ts         # API configuration
│   │
│   ├── constants/                # Constants
│   │   ├── routes.ts
│   │   └── messages.ts
│   │
│   └── styles/                   # Styles
│       ├── animations.css        # Animation styles
│       └── cyber-theme.css       # Cyber theme styles
│
├── public/                       # Static assets
│   ├── icons/                    # Icons
│   └── images/                   # Images
│
├── .env.local                    # Environment variables
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

## Key Improvements

### 1. **Feature-Based Architecture**
- Organize code by features (chat, demo) rather than file types
- Each feature has its own components, hooks, types, and utils
- Better encapsulation and maintainability

### 2. **Separation of Concerns**
- UI components separated from business logic
- API logic abstracted into dedicated client
- Hooks for reusable stateful logic
- Types in dedicated files

### 3. **Naming Conventions**
- **Components**: PascalCase (e.g., `ChatMessage.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useChat.ts`)
- **Utils**: camelCase (e.g., `formatMessage.ts`)
- **Types**: PascalCase with `.types.ts` suffix
- **Constants**: UPPER_SNAKE_CASE in files

### 4. **Path Aliases**
Update `tsconfig.json` to include:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/config/*": ["./src/config/*"],
      "@/constants/*": ["./src/constants/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  }
}
```

### 5. **Code Standards**
- ✅ Consistent file naming
- ✅ Proper TypeScript typing (no `any`)
- ✅ Component composition over large components
- ✅ Custom hooks for reusable logic
- ✅ Proper error boundaries
- ✅ Loading states
- ✅ Accessibility (ARIA labels)

### 6. **Performance Optimizations**
- Lazy loading for heavy components
- Memoization where appropriate
- Code splitting by features
- Optimized imports

## Migration Steps

### Phase 1: Setup New Structure
1. Create `src/` directory structure
2. Update `tsconfig.json` with path aliases
3. Update `next.config.mjs` if needed

### Phase 2: Move and Refactor Components
1. Extract UI components to `src/components/ui/`
2. Create feature modules in `src/features/`
3. Split large components into smaller ones
4. Extract reusable logic into hooks

### Phase 3: Type System
1. Create type definitions in `src/types/`
2. Add proper typing to all components
3. Remove all `any` types

### Phase 4: API Layer
1. Create API client in `src/lib/api/`
2. Abstract API calls from components
3. Add error handling and retry logic

### Phase 5: Configuration
1. Move constants to `src/constants/`
2. Create config files in `src/config/`
3. Environment variable management

### Phase 6: Styles
1. Organize styles in `src/styles/`
2. Extract reusable CSS classes
3. Create design system tokens

### Phase 7: Testing & Documentation
1. Add JSDoc comments
2. Create README for each feature
3. Add unit tests

## Benefits

1. **Scalability**: Easy to add new features without affecting existing code
2. **Maintainability**: Clear organization makes code easy to find and modify
3. **Collaboration**: Team members can work on different features independently
4. **Testing**: Isolated features are easier to test
5. **Performance**: Better code splitting and lazy loading
6. **Type Safety**: Comprehensive TypeScript coverage
7. **Developer Experience**: Better IDE support with path aliases

## Timeline

- **Phase 1-2**: 2-3 hours (Structure + Components)
- **Phase 3-4**: 2-3 hours (Types + API)
- **Phase 5-6**: 1-2 hours (Config + Styles)
- **Phase 7**: 1-2 hours (Testing + Docs)

**Total**: 6-10 hours for complete refactoring
