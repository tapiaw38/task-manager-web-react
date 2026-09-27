import { vi } from 'vitest';

export const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

export const emptyResponse = (status = 204) => new Response(null, { status });

export const errorResponse = (code: string, message: string, status: number) =>
    jsonResponse({ code, message }, status);

export interface FetchRoute {
    method?: string;
    match: string | RegExp;
    response: () => Response | Promise<Response>;
}

export const mockFetch = (routes: FetchRoute[]) => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : input.toString();
        const method = (init?.method ?? 'GET').toUpperCase();
        const route = routes.find((candidate) => {
            const methodMatches = (candidate.method ?? 'GET').toUpperCase() === method;
            const urlMatches =
                typeof candidate.match === 'string'
                    ? url.includes(candidate.match)
                    : candidate.match.test(url);

            return methodMatches && urlMatches;
        });

        if (!route) {
            throw new Error(`Unhandled request: ${method} ${url}`);
        }

        return route.response();
    });

    vi.stubGlobal('fetch', fetchMock);

    return fetchMock;
};
