/**
 * Auth middleware for server functions
 * Demo mode - no real authentication validation needed
 */

/**
 * Stub authentication check for demo mode.
 * In production, this would verify JWT tokens or session cookies.
 * For demo, we rely on client-side auth checks in route guards.
 */
export function requireAuth(): void {
  // Demo mode: Auth is handled client-side via localStorage
  // Server functions don't validate auth in this demo app
  // Real implementation would check session/JWT here and be async
  return
}
