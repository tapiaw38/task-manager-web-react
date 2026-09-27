import { create } from 'zustand';

import { apiClient } from '../api/client';
import { InfoService } from '../services/info/infoService';
import type { IInfoService } from '../services/info/infoService';
import type { AppInfo } from '../types/info';

interface InfoStore {
    data: AppInfo | null;
    error: unknown;
    hasLoaded: boolean;
    loading: boolean;
    get: () => Promise<void>;
}

export const createInfoStore = (service: IInfoService) =>
    create<InfoStore>((set) => ({
        data: null,
        error: null,
        hasLoaded: false,
        loading: false,
        get: async () => {
            set({ loading: true, error: null });
            try {
                set({ data: await service.get() });
            } catch (error) {
                set({ error });
            } finally {
                set({ loading: false, hasLoaded: true });
            }
        },
    }));

export const useInfoStore = createInfoStore(new InfoService(apiClient));
