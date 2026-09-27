import type { ApiClient } from '../../api/client';
import type { AppInfo } from '../../types/info';

export interface IInfoService {
    get(): Promise<AppInfo>;
}

export class InfoService implements IInfoService {
    private readonly api: ApiClient;

    constructor(api: ApiClient) {
        this.api = api;
    }

    get() {
        return this.api.request<AppInfo>('/api/info');
    }
}
