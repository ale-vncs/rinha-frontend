import { createContext, PropsWithChildren, useRef, useState } from 'react';
import { ReadFileWorkerReturn } from '@workers/readFileWorker';
import { Backdrop, CircularProgress } from '@mui/material';

export interface FileData {
  id: string;
  name: string;
  status: 'LOADING' | 'ERROR' | 'AVAILABLE';
  content: string[];
  collapseData: Record<number, number>;
}

interface JsonProviderContext {
  readFile: (file: File) => void;
  selectJsonById: (id: string) => void;
  files: FileData[];
  jsonSelected: FileData | null;
}

export const Context = createContext<JsonProviderContext>({} as never);

export const JsonProvider = ({ children }: PropsWithChildren) => {
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [jsonSelected, setJsonSelected] = useState<FileData | null>(null);
  const [waitJson, setWaitJson] = useState(false);

  const addJson = (name: string) => {
    const id = (Math.random() + 1).toString(36).substring(2);
    const jsonInfo: FileData = { name, id, status: 'LOADING', content: [], collapseData: {} };
    setFileData((data) => [...data, jsonInfo]);
    return id;
  };

  const setContentByJsonId = (
    id: string,
    content: string[],
    collapseData: Record<number, number>,
    isError: boolean,
  ) => {
    const jsonStatus: FileData['status'] = !isError ? 'AVAILABLE' : 'ERROR';
    setFileData((data) => {
      return data.map((item) => {
        if (item.id === id) {
          item.status = jsonStatus;
          item.content = content;
          item.collapseData = collapseData;
        }
        return item;
      });
    });
  };

  const readFile: JsonProviderContext['readFile'] = (file) => {
    const readFileWorker = getReadFileWorker();

    const jsonId = addJson(file.name);

    readFileWorker.postMessage({ jsonId, file });
    const arr: string[] = [];
    readFileWorker.onmessage = (e: MessageEvent<ReadFileWorkerReturn>) => {
      const action = e.data.action;
      const id = e.data.id;
      if (action === 'LOADING') {
        const part = e.data.part;
        const l = arr.length;
        let i = 0;
        while (i < part.length) {
          arr[l + i] = part[i];
          i++;
        }
      } else if (action === 'COMPLETE') {
        setFileData((data) => {
          return data.map((item) => {
            if (item.id === id) {
              item.status = 'AVAILABLE';
              item.content = arr;
            }
            return item;
          });
        });
      } else if (action === 'ERROR') {
        setContentByJsonId(id, [e.data.error], {}, true);
      }
    };
  };

  const selectJsonById = (id: string) => {
    const jsonData = fileData.find((item) => item.id === id);
    if (jsonData) {
      setJsonSelected(jsonData);
    }
  };

  const getReadFileWorker = () => {
    return new Worker(new URL('../workers/readFileWorker.ts', import.meta.url), { type: 'module' });
  };

  return (
    <Context.Provider value={{ readFile, files: fileData, jsonSelected, selectJsonById }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, width: '100vw', height: '100vh' }}
        open={waitJson}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </Context.Provider>
  );
};
