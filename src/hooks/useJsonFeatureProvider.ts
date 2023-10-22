import { useContext } from 'react';
import { JsonFeatureProviderContext } from '@providers/JsonFeatureProvider';

export const useJsonFeatureProvider = () => useContext(JsonFeatureProviderContext);
