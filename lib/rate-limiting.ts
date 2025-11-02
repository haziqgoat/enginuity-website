/**
 * Rate limiting utilities for authentication security
 */

interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private maxAttempts: number;
  private windowMs: number;
  private blockDurationMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000, blockDurationMs = 30 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs; // 15 minutes
    this.blockDurationMs = blockDurationMs; // 30 minutes
  }

  /**
   * Check if an identifier (email/IP) is rate limited
   */
  isRateLimited(identifier: string): { limited: boolean; resetTime?: number; attemptsLeft?: number } {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry) {
      return { limited: false, attemptsLeft: this.maxAttempts };
    }

    // Check if block period has expired
    if (entry.blockedUntil && now > entry.blockedUntil) {
      this.attempts.delete(identifier);
      return { limited: false, attemptsLeft: this.maxAttempts };
    }

    // Check if window has expired
    if (now - entry.lastAttempt > this.windowMs) {
      this.attempts.delete(identifier);
      return { limited: false, attemptsLeft: this.maxAttempts };
    }

    // Check if currently blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return { limited: true, resetTime: entry.blockedUntil };
    }

    // Not blocked but within window
    const attemptsLeft = Math.max(0, this.maxAttempts - entry.attempts);
    return { limited: false, attemptsLeft };
  }

  /**
   * Record a failed attempt
   */
  recordFailedAttempt(identifier: string): { blocked: boolean; resetTime?: number } {
    const now = Date.now();
    const entry = this.attempts.get(identifier) || { attempts: 0, lastAttempt: now };

    // Reset if window expired
    if (now - entry.lastAttempt > this.windowMs) {
      entry.attempts = 0;
    }

    entry.attempts += 1;
    entry.lastAttempt = now;

    // Block if max attempts reached
    if (entry.attempts >= this.maxAttempts) {
      entry.blockedUntil = now + this.blockDurationMs;
      this.attempts.set(identifier, entry);
      return { blocked: true, resetTime: entry.blockedUntil };
    }

    this.attempts.set(identifier, entry);
    return { blocked: false };
  }

  /**
   * Record a successful attempt (clears the record)
   */
  recordSuccessfulAttempt(identifier: string): void {
    this.attempts.delete(identifier);
  }

  /**
   * Get remaining attempts for an identifier
   */
  getRemainingAttempts(identifier: string): number {
    const result = this.isRateLimited(identifier);
    return result.attemptsLeft || 0;
  }

  /**
   * Clear all rate limit records (admin function)
   */
  clearAll(): void {
    this.attempts.clear();
  }

  /**
   * Clear rate limit for specific identifier (admin function)
   */
  clearIdentifier(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Create singleton instances for different types of rate limiting
export const loginRateLimit = new RateLimiter(5, 15 * 60 * 1000, 30 * 60 * 1000); // 5 attempts per 15 min, block for 30 min
export const signupRateLimit = new RateLimiter(3, 60 * 60 * 1000, 60 * 60 * 1000); // 3 attempts per hour, block for 1 hour
export const passwordResetRateLimit = new RateLimiter(3, 60 * 60 * 1000, 2 * 60 * 60 * 1000); // 3 attempts per hour, block for 2 hours

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: Request): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

/**
 * Format time remaining until rate limit reset
 */
export function formatTimeRemaining(resetTime: number): string {
  const now = Date.now();
  const remaining = resetTime - now;
  
  if (remaining <= 0) return '0 seconds';
  
  const minutes = Math.ceil(remaining / (60 * 1000));
  
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  
  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours === 1 ? '' : 's'}`;
}