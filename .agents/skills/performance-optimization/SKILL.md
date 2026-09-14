---
name: performance-optimization
description: Provides performance best practices for code splitting, reactivity, memory management, and security. Use when optimizing app performance or implementing security measures.
---

# Performance & Best Practices

## Code Splitting

- Use lazy loading for routes with large components
- Implement component lazy loading where appropriate
- Use dynamic imports for heavy libraries

## Reactivity Patterns

- Use `shallowRef` for large objects without deep reactivity
- Implement `markRaw` for non-reactive objects
- Use `readonly` to prevent accidental mutations

## Memory Management

- Call store `$reset` methods when navigating away
- Use `onBeforeUnmount` for cleanup in components
- Implement proper cache invalidation strategies

## Security Considerations

- Sanitize user inputs before display
- Use nuxt-security module configuration
- Implement proper CSRF protection
- Validate data on both client and server sides
