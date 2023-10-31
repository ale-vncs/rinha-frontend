import { createContext, PropsWithChildren, useRef, useState } from 'react';
import { ReadFileWorkerReturn } from '@workers/readFileWorker';

export interface FileData {
  id: string;
  name: string;
  status: 'LOADING' | 'ERROR' | 'AVAILABLE';
  content: string[];
  collapseData: Record<number, number>;
  problem?: {
    error: string;
    line: number;
  };
}

interface JsonProviderContext {
  readFile: (file: File) => void;
  jsonSelected: FileData | null;
}

export const Context = createContext<JsonProviderContext>({} as never);

export const JsonProvider = ({ children }: PropsWithChildren) => {
  const [jsonSelected, setJsonSelected] = useState<FileData | null>(null);

  const workerRef = useRef<Worker>();

  const addJson = (name: string) => {
    const id = (Math.random() + 1).toString(36).substring(2);
    const jsonInfo: FileData = { id, name, status: 'LOADING', content: [], collapseData: {} };
    setJsonSelected(() => jsonInfo);
  };

  const readFile: JsonProviderContext['readFile'] = (file) => {
    addJson(file.name);
    sendToWorker(file);
  };

  const sendToWorker = (file: File) => {
    const readFileWorker = getReadFileWorker();

    readFileWorker.postMessage(file);

    const arr: string[] = [];
    const collapse: Record<number, number> = {};
    let upCount = Number.MAX_SAFE_INTEGER;

    readFileWorker.onmessage = (e: MessageEvent<ReadFileWorkerReturn>) => {
      const action = e.data.action;

      if (action === 'LOADING') {
        const { part, collapseData } = e.data;
        const l = arr.length;
        let i = 0;
        while (i < part.length) {
          arr[l + i] = part[i];
          i++;
        }
        for (const key in collapseData) {
          collapse[key] = collapseData[key];
        }
        if (upCount > 60) {
          setJsonSelected((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              content: arr,
              status: 'LOADING',
              collapseData: collapse,
            };
          });
          upCount = 0;
        }
        upCount++;
      } else if (action === 'COMPLETE') {
        const problem = e.data.problem;
        setJsonSelected((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            content: arr,
            status: problem ? 'ERROR' : 'AVAILABLE',
            collapseData: collapse,
            problem: problem || undefined,
          };
        });
      } else if (action === 'ERROR') {
        const error = e.data.error;
        setJsonSelected((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            content: [error],
            status: 'ERROR',
            collapseData: {},
          };
        });
      }
    };
  };

  const getReadFileWorker = () => {
    const newWorker = new Worker(new URL('../workers/readFileWorker.ts', import.meta.url), { type: 'module' });
    workerRef.current?.terminate();
    workerRef.current = newWorker;
    return newWorker;
  };

  return <Context.Provider value={{ readFile, jsonSelected }}>{children}</Context.Provider>;
};
