# Engineering & Coding Standards

> **Title**: SPPG Companion Engineering & Coding Guidelines  
> **Version**: 1.0.0  
> **Status**: APPROVED  
> **Author**: Lead Software Architect  
> **Reviewer**: Enterprise Engineering Team  
> **Created**: 2026-07-31  
> **Last Updated**: 2026-07-31  
> **Next Review**: 2026-08-30  

---

## 1. Directory & File Naming Conventions

* **Files & Directories**: Use `kebab-case` for TypeScript modules (`event-bus.core.ts`), types (`event.types.ts`), and services (`storage.service.ts`).
* **Vue Components**: Use `PascalCase` for Vue component files (`ActivityCenterPage.vue`, `HeaderBar.vue`).
* **Composables**: Prefix with `use` in `camelCase` (`useExtension.ts`, `useCurrentTab.ts`).

---

## 2. TypeScript & Code Hygiene Guidelines

* **Strict Type Safety**: `noImplicitAny` and strict null checks enforced. Avoid `any` except where required by dynamic payloads (wrap with `unknown` where possible).
* **Enums & Types**: Prefer `enum` for fixed domain constants (`EventCategory`, `ActivityEventType`) and `union types` for string literal sets (`ActivitySource`, `ActivitySeverity`).
* **Explicit Function Return Types**: All public class methods and exported utility functions must specify return types.

```ts
// GOOD
public static getSessionId(): string {
  return this.currentSessionId;
}

// BAD
public static getSessionId() {
  return this.currentSessionId;
}
```

---

## 3. Vue 3 Guidelines

* **Composition API Only**: Use `<script setup lang="ts">` for all Vue single-file components.
* **Pinia State Management**: Keep UI components lean; delegate business logic, event listeners, and API calls to Pinia stores or underlying service classes.
* **Scoped Styling**: Use TailwindCSS utility classes directly. Custom CSS rules must reside in `index.css` design system variables.

---

## 4. SOLID & Clean Code Principles

1. **Single Responsibility Principle (SRP)**: Each class/file must have one clear responsibility (e.g. `NavigationService` listens *only* to navigation events).
2. **Open/Closed Principle (OCP)**: Extend engine features via event listeners and middleware without modifying core service constructors.
3. **Dependency Inversion (DIP)**: Depend on interface definitions (`StorageAdapter`, `EventMiddleware`) rather than concrete implementations.
4. **No Magic Strings**: All topics, storage keys, and event types must use enums or constants.

---

## 5. Error Handling & Logging Rules

* **Structured Enterprise Logging**: Never use `console.log` directly in business logic. Use the `Logger` service (`Logger.info`, `Logger.success`, `Logger.warn`, `Logger.error`, `Logger.debug`).
* **Silent Failure Prevention**: Catch async errors explicitly. When an error occurs, log it to `Logger.error()` and update `Diagnostics`.

```ts
try {
  await MessageBus.send({ type: MessageType.POPUP_CONNECTED });
} catch (err) {
  Logger.debug(MODULE, 'IPC send fallback', err);
}
```

---

## 6. Testing & Documentation Standards

* **Unit Verifications**: New core engine modules must provide spec verification functions or unit tests (e.g. `event-bus.spec.ts`).
* **JSDoc Comments**: Document all exported classes, methods, enums, and interfaces with concise JSDoc headers.
