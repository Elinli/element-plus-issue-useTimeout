# Nuxt i18n SSR 500 Error — Reproduction

## 1. Problem description

In a Nuxt 3 project, when a full page refresh or an i18n language route change (e.g. from `/en` to `/de`) triggers **server-side rendering (SSR)**, the server returns a **500** error.

### Error stack

```text
TypeError: Cannot read properties of undefined (reading 'clearTimeout')
    at cancelTimeout (chunks/build/index.xxxx.mjs)
    at onScopeDispose (node_modules/@vue/runtime-core/dist/runtime-core.cjs)
    at cleanupContext (node_modules/@vue/server-renderer/dist/server-renderer.cjs)
```

## 2. Root cause

The error comes from the interaction between **Vue 3.5.13+ behavior** and **a bug in older Element Plus versions**:

| Factor | Explanation |
|--------|-------------|
| **Vue 3.5.13+** | To fix SSR memory leaks, Vue introduced `cleanupContext()`. After SSR finishes, all `onScopeDispose` hooks run. |
| **Element Plus** | The internal `useTimeout` hook’s cleanup calls `window.clearTimeout` directly. |
| **Runtime mismatch** | In Node.js during SSR there is **no** `window`, so the cleanup throws `TypeError` and breaks the render. |

## 3. Environment to reproduce

To reproduce reliably, **pin** these versions (avoid `^` so dependencies do not float):

| Dependency | Pinned version | Notes |
|------------|----------------|--------|
| `vue` | **`3.5.31`** (to reproduce) | SSR cleanup (`cleanupContext`) is present from **3.5.13+**; this repro uses **3.5.31**, where the error appears with Element Plus below. Use an older Vue patch if you need to confirm the issue goes away. |
| `element-plus` | `2.13.6` | Version whose `useTimeout` cleanup touches `window.clearTimeout`. |
| `nuxt` | `3.13.2` | Base SSR framework. |
| `unhead` | `1.11.11` | Stable pairing with i18n build. |
| `@nuxtjs/i18n` | `8.5.5` | Handles locale route switching. |

## 4. Steps to reproduce

1. In `package.json`, set **`vue` to `3.5.31`** (downgrading Vue avoids the issue in some setups).
2. Install dependencies:

   ```bash
   npm i
   ```

3. Build and preview:

   ```bash
   npm run build
   npm run preview
   ```

4. Open the app (e.g. `http://localhost:3000`).
5. **Refresh the page** or **switch locale via i18n routing** so SSR runs again — the server should respond with **500** and the stack above.
