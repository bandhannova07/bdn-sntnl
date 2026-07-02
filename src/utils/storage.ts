/**
 * Safe localStorage wrapper with error handling
 * Prevents JSON.parse crashes and provides fallback values
 */

export const safeStorageGetItem = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Failed to parse localStorage[${key}]:`, err);
    return defaultValue;
  }
};

export const safeStorageSetItem = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to set localStorage[${key}]:`, err);
    return false;
  }
};

export const safeStorageRemoveItem = (key: string) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error(`Failed to remove localStorage[${key}]:`, err);
    return false;
  }
};

export const clearAllStorage = (...keys: string[]) => {
  keys.forEach(key => safeStorageRemoveItem(key));
};
