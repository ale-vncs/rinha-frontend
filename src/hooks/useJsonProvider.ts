import { useContext } from 'react';
import { Context } from '../providers/JsonProvider.tsx';

export const useJsonProvider = () => useContext(Context);
