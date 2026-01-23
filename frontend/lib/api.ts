/**
 * K2M Analytics - API Configuration
 * ==================================
 * Centralized API helper for all backend requests.
 * Handles base URL configuration and common fetch patterns.
 */

/**
 * Base URL for the API.
 * Uses environment variable in production, falls back to localhost in development.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling.
 * @param endpoint - API endpoint (without base URL)
 * @param options - Fetch options
 * @returns Promise with JSON response
 */
export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `API Error: ${response.status}`);
    }

    return response.json();
}

/**
 * GET request helper
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
    return apiFetch<T>(endpoint, { method: 'GET' });
}

/**
 * POST request helper
 */
export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
    return apiFetch<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

/**
 * PUT request helper
 */
export async function apiPut<T>(endpoint: string, body: unknown): Promise<T> {
    return apiFetch<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

/**
 * DELETE request helper
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
    return apiFetch<T>(endpoint, { method: 'DELETE' });
}

/**
 * Upload file helper (multipart/form-data)
 */
export async function apiUpload<T>(endpoint: string, file: File): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Upload Error: ${response.status}`);
    }

    return response.json();
}
