/**
 * Utility functions for API endpoints
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Build a complete API URL from an endpoint path
 * @param endpoint - The API endpoint (e.g., '/api/products')
 * @returns Complete URL for the API call
 */
export function buildApiUrl(endpoint: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
}

/**
 * Build an API endpoint with the /api prefix
 * @param path - The path after /api (e.g., 'products')
 * @returns Complete API URL
 */
export function apiEndpoint(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return buildApiUrl(`api/${cleanPath}`);
}

/**
 * Get the base API URL
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
