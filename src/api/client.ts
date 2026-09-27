import type { z } from 'zod';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';

export const NETWORK_ERROR_CODE = 'NETWORK_ERROR';
export const UNEXPECTED_ERROR_CODE = 'UNEXPECTED_ERROR';

interface ErrorResponse {
    code?: string;
    message?: string;
}

export interface ApiClient {
    request<T>(path: string, init?: RequestInit, schema?: z.ZodType<T>): Promise<T>;
}

export class ApiError extends Error {
    readonly code: string;
    readonly status: number;
    readonly body: ErrorResponse | null;

    constructor(code: string, message: string, status: number, body: ErrorResponse | null = null) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.status = status;
        this.body = body;
    }
}

const parseError = async (response: Response): Promise<ApiError> => {
    try {
        const body = (await response.json()) as ErrorResponse;

        if (body.code && body.message) {
            return new ApiError(body.code, body.message, response.status, body);
        }
    } catch {
        return new ApiError(UNEXPECTED_ERROR_CODE, 'An unexpected error occurred', response.status);
    }

    return new ApiError(UNEXPECTED_ERROR_CODE, 'An unexpected error occurred', response.status);
};

const logRequestError = (path: string, init: RequestInit | undefined, error: ApiError) => {
    console.error('API request failed', {
        request: { method: init?.method ?? 'GET', path },
        response: { status: error.status, body: error.body },
    });
};

export const request = async <T>(
    path: string,
    init?: RequestInit,
    schema?: z.ZodType<T>,
): Promise<T> => {
    let response: Response;

    try {
        response = await fetch(`${API_URL}${path}`, {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...init?.headers,
            },
        });
    } catch {
        const error = new ApiError(NETWORK_ERROR_CODE, 'Unable to connect to the server', 0);
        logRequestError(path, init, error);
        throw error;
    }

    if (!response.ok) {
        const error = await parseError(response);
        logRequestError(path, init, error);
        throw error;
    }

    if (response.status === 204) {
        return undefined as T;
    }

    let body: unknown;

    try {
        body = await response.json();
    } catch {
        const error = new ApiError(
            UNEXPECTED_ERROR_CODE,
            'The server returned an invalid response',
            response.status,
        );
        logRequestError(path, init, error);
        throw error;
    }

    if (!schema) {
        return body as T;
    }

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
        const error = new ApiError(
            UNEXPECTED_ERROR_CODE,
            'The server returned an invalid response',
            response.status,
        );
        logRequestError(path, init, error);
        throw error;
    }

    return parsed.data;
};

export const apiClient: ApiClient = { request };
