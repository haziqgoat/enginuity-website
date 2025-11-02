/**
 * Google reCAPTCHA v2 & v3 integration for enhanced security
 * Supports both visible checkbox and invisible verification
 */

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export type RecaptchaVersion = 'v2' | 'v3';

export interface RecaptchaConfig {
  siteKey: string;
  action?: string; // For v3 only
  theme?: 'light' | 'dark'; // For v2 only
  size?: 'compact' | 'normal'; // For v2 only
  version: RecaptchaVersion;
  threshold?: number; // For v3 only (0.0 - 1.0)
}

export interface RecaptchaResponse {
  success: boolean;
  score?: number; // v3 only
  action?: string; // v3 only
  challenge_ts?: string;
  hostname?: string;
  error?: string;
}

/**
 * Load Google reCAPTCHA script (v2 or v3)
 */
export function loadRecaptchaScript(siteKey: string, version: RecaptchaVersion = 'v2'): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.grecaptcha) {
      resolve();
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector('script[src*="recaptcha"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', reject);
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    if (version === 'v3') {
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    } else {
      script.src = 'https://www.google.com/recaptcha/api.js';
    }
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Wait for grecaptcha to be ready
      const checkReady = () => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          if (version === 'v3') {
            window.grecaptcha.ready(() => resolve());
          } else {
            resolve(); // v2 doesn't need ready callback
          }
        } else if (window.grecaptcha && version === 'v2') {
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };
    
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Execute reCAPTCHA v3 and get token
 */
export async function executeRecaptchaV3(config: RecaptchaConfig): Promise<string> {
  if (!window.grecaptcha) {
    throw new Error('reCAPTCHA not loaded');
  }

  return new Promise((resolve, reject) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(config.siteKey, { action: config.action })
        .then((token: string) => {
          if (!token) {
            reject(new Error('Failed to get reCAPTCHA token'));
          } else {
            resolve(token);
          }
        })
        .catch(reject);
    });
  });
}

/**
 * Render reCAPTCHA v2 widget
 */
export function renderRecaptchaV2(
  elementId: string,
  config: RecaptchaConfig,
  callback?: (token: string) => void,
  expiredCallback?: () => void
): number | null {
  if (!window.grecaptcha) {
    throw new Error('reCAPTCHA not loaded');
  }

  try {
    return window.grecaptcha.render(elementId, {
      sitekey: config.siteKey,
      theme: config.theme || 'light',
      size: config.size || 'normal',
      callback: callback,
      'expired-callback': expiredCallback,
    });
  } catch (error) {
    console.error('Failed to render reCAPTCHA:', error);
    return null;
  }
}

/**
 * Get response from reCAPTCHA v2 widget
 */
export function getRecaptchaV2Response(widgetId?: number): string | null {
  if (!window.grecaptcha) {
    return null;
  }

  try {
    return window.grecaptcha.getResponse(widgetId);
  } catch (error) {
    console.error('Failed to get reCAPTCHA response:', error);
    return null;
  }
}

/**
 * Reset reCAPTCHA v2 widget
 */
export function resetRecaptchaV2(widgetId?: number): void {
  if (!window.grecaptcha) {
    return;
  }

  try {
    window.grecaptcha.reset(widgetId);
  } catch (error) {
    console.error('Failed to reset reCAPTCHA:', error);
  }
}

/**
 * Verify reCAPTCHA token on the server
 */
export async function verifyRecaptchaToken(
  token: string,
  secretKey: string,
  remoteip?: string
): Promise<RecaptchaResponse> {
  const params = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  if (remoteip) {
    params.append('remoteip', remoteip);
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();
    
    return {
      success: data.success || false,
      score: data.score,
      action: data.action,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      error: data['error-codes']?.[0],
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error during verification',
    };
  }
}

/**
 * Check if reCAPTCHA score meets threshold
 */
export function isScoreValid(score?: number, threshold: number = 0.5): boolean {
  return score !== undefined && score >= threshold;
}

/**
 * Get human-readable score description
 */
export function getScoreDescription(score?: number): string {
  if (score === undefined) return 'Unknown';
  if (score >= 0.9) return 'Very likely human';
  if (score >= 0.7) return 'Likely human';
  if (score >= 0.5) return 'Neutral';
  if (score >= 0.3) return 'Suspicious';
  return 'Likely bot';
}

/**
 * React hook for reCAPTCHA integration (supports both v2 and v3)
 */
export function useRecaptcha(siteKey: string, version: RecaptchaVersion = 'v2') {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteKey) {
      setError('reCAPTCHA site key not provided');
      return;
    }

    loadRecaptchaScript(siteKey, version)
      .then(() => {
        setIsLoaded(true);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to load reCAPTCHA');
        console.error('reCAPTCHA load error:', err);
      });
  }, [siteKey, version]);

  const executeV3 = async (action: string): Promise<string> => {
    if (!isLoaded) {
      throw new Error('reCAPTCHA not loaded yet');
    }

    if (version !== 'v3') {
      throw new Error('executeV3 can only be used with reCAPTCHA v3');
    }

    return executeRecaptchaV3({ siteKey, action, version });
  };

  const renderV2 = (
    elementId: string,
    config?: Partial<RecaptchaConfig>,
    callback?: (token: string) => void,
    expiredCallback?: () => void
  ): number | null => {
    if (!isLoaded) {
      throw new Error('reCAPTCHA not loaded yet');
    }

    if (version !== 'v2') {
      throw new Error('renderV2 can only be used with reCAPTCHA v2');
    }

    return renderRecaptchaV2(
      elementId,
      { siteKey, version, ...config },
      callback,
      expiredCallback
    );
  };

  return { 
    isLoaded, 
    error, 
    executeV3, 
    renderV2,
    getResponse: getRecaptchaV2Response,
    reset: resetRecaptchaV2
  };
}

// Import useState and useEffect for the hook
import { useState, useEffect } from 'react';