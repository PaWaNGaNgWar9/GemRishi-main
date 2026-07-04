/**
 * Utility functions for handling images
 */

/**
 * Fixes image URL by prepending the backend URL if it's a relative path
 * @param {string} url - The image URL from the API
 * @returns {string} - The corrected URL
 */
const normalizeImageValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.url && typeof value.url === "string") {
    return value.url;
  }
  return "";
};

export const fixImageUrl = (url) => {
  const normalizedUrl = normalizeImageValue(url);
  if (!normalizedUrl) return normalizedUrl;
  if (normalizedUrl.startsWith("http")) return normalizedUrl;
  const backendUrl = import.meta.env.VITE_URL;
  return `${backendUrl}${normalizedUrl}`;
};

const shouldFixUrl = (key) => {
  if (!key || typeof key !== "string") return false;
  const normalized = key.toLowerCase();
  return (
    normalized === "url" ||
    normalized === "image" ||
    normalized === "images" ||
    normalized.endsWith("image") ||
    normalized.endsWith("images") ||
    normalized === "thumbnail" ||
    normalized.endsWith("thumbnail")
  );
};

/**
 * Fixes image URLs in an object or array recursively
 * @param {any} data - The data containing image URLs
 * @param {string} [key] - The current property key used for detection
 * @returns {any} - The data with fixed image URLs
 */
export const fixImageUrlsInData = (data, key = "") => {
  if (typeof data === "string") {
    return shouldFixUrl(key) ? fixImageUrl(data) : data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => fixImageUrlsInData(item, key));
  }
  if (data && typeof data === "object") {
    const fixed = {};
    for (const prop in data) {
      fixed[prop] = fixImageUrlsInData(data[prop], prop);
    }
    return fixed;
  }
  return data;
};
