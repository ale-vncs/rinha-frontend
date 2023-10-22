import { useContext } from 'react';
import { Context } from '@providers/JsonProvider';

export const useJsonProvider = () => useContext(Context);
