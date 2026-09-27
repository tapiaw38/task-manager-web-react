import { useInfoStore } from '../stores/infoStore';

export const useInfo = () => {
    const data = useInfoStore((state) => state.data);
    const error = useInfoStore((state) => state.error);
    const hasLoaded = useInfoStore((state) => state.hasLoaded);
    const isLoading = useInfoStore((state) => state.loading);
    const getInfo = useInfoStore((state) => state.get);

    return { data, hasLoaded, isLoading, isError: error !== null, getInfo };
};
