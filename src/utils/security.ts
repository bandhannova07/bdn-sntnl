/**
 * Security utilities for XSS prevention and data masking
 */

export const escapeHTML = (text: string): string => {
  if (typeof text !== 'string') return '';
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, char => map[char]);
};

/**
 * Sanitize user input for safe rendering
 * Removes dangerous characters and scripts
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove script tags and event handlers
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
};

/**
 * Mask sensitive data like API keys
 * Shows only prefix and hides the rest
 */
export const maskSensitiveData = (
  text: string,
  visibleChars: number = 6,
  replaceChar: string = '•'
): string => {
  if (!text || text.length <= visibleChars) return text;
  
  const prefix = text.substring(0, visibleChars);
  const hidden = replaceChar.repeat(Math.max(3, text.length - visibleChars));
  return `${prefix}${hidden}`;
};

/**
 * Validate URL is safe (no javascript: protocol)
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Validate webhook URL format
 */
export const isValidWebhookUrl = (url: string, provider: 'discord' | 'slack'): boolean => {
  if (!isValidUrl(url)) return false;
  
  if (provider === 'discord') {
    return url.includes('discord.com/api/webhooks/');
  }
  if (provider === 'slack') {
    return url.includes('hooks.slack.com/services/');
  }
  return false;
};
