import { createContext } from 'react';

import type { SnackbarContextValue } from './types';

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);
