/**
 * API utility functions with retry logic and error handling
 */

export interface FetchOptions extends RequestInit {
  retries?: number;
  timeout?: number;
}

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_RETRIES = 1;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getRetryDelayMs = (attempt: number, response?: Response) => {
  if (response) {
    const retryAfter = response.headers.get('Retry-After');
    if (retryAfter) {
      const parsed = Number.parseInt(retryAfter, 10);
      if (!Number.isNaN(parsed)) {
        return parsed * 1000;
      }
    }
  }

  return 1000 * Math.pow(2, attempt);
};

export const fetchWithRetry = async (
  url: string,
  options: FetchOptions = {}
) => {
  const { retries = DEFAULT_RETRIES, timeout = DEFAULT_TIMEOUT, ...fetchOpts } = options;
  const attempts = Math.max(1, retries + 1);

  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOpts,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Do not retry client errors (400-499 except 429 rate limit)
      if (!response.ok && response.status >= 400 && response.status < 500 && response.status !== 429) {
        return response;
      }
      
      if (!response.ok && response.status === 429 && attempt < retries) {
        await wait(getRetryDelayMs(attempt, response));
        continue;
      }

      if (!response.ok && attempt < retries) {
        await wait(getRetryDelayMs(attempt));
        continue;
      }
      
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        if (attempt === retries) {
          throw new APIError(408, err, 'Request timed out');
        }
      } else if (attempt === retries) {
        throw err;
      }

      await wait(getRetryDelayMs(attempt));
    }
  }
  
  throw new Error(`Failed after ${attempts} attempt(s)`);
};

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public originalError: any,
    message?: string
  ) {
    super(message || `API Error: ${statusCode}`);
    this.name = 'APIError';
  }
}

export const parseAPIResponse = async (response: Response) => {
  if (!response.ok) {
    throw new APIError(
      response.status,
      null,
      `API returned status ${response.status}`
    );
  }
  try {
    return await response.json();
  } catch (err) {
    throw new APIError(response.status, err, 'Failed to parse API response');
  }
};
