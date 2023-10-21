import { useContext } from 'react';
import { JsonFeatureProviderContext } from '../providers/JsonFeatureProvider.tsx';

export const useJsonFeatureProvider = () => useContext(JsonFeatureProviderContext);
