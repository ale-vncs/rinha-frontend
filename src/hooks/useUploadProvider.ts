import { useContext } from 'react';
import { Context } from '../providers/UploadProvider.tsx';

export const useUploadProvider = () => useContext(Context);
