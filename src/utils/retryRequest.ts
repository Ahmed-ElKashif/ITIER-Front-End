/**
 * retryRequest — Task 15.5
 * Wraps any async function with exponential backoff retry logic.
 * Designed for Vercel cold-start recovery and transient network failures.
 *
 * Usage:
 *   const data = await retryRequest(() => TrackAPI.getActiveTracks());
 */

export interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  shouldRetry: (error: any) => boolean;
}

const defaultConfig: RetryConfig = {
  maxRetries: 3,
  delayMs: 1000,
  shouldRetry: (error: any) => {
    // Retry on network errors (status 0) and gateway errors (502/503/504)
    const status = error?.response?.status ?? error?.status ?? 0;
    return (
      status === 0 ||   // Network error / timeout
      status === 502 || // Bad Gateway (Vercel cold start)
      status === 503 || // Service Unavailable
      status === 504    // Gateway Timeout
    );
  },
};

export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
): Promise<T> {
  const { maxRetries, delayMs, shouldRetry } = { ...defaultConfig, ...config };
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s...
      const delay = delayMs * Math.pow(2, attempt);
      console.log(`⏳ Retry ${attempt + 1}/${maxRetries} after ${delay}ms…`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
