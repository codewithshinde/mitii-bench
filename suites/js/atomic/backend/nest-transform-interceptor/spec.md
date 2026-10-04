Build a NestJS response interceptor implementing `NestInterceptor`.

* **Behavior**: Wraps all successful controller responses in a generic structure `{ data: response, timestamp: string }`.

### Authentication & Authorization (Passport.js, Jose)

Implement under the NestJS fixture (`src/interceptors/transform.interceptor.ts` and related modules). Keep the app buildable with `npm run build`.
