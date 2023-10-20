import { createContext, PropsWithChildren, useState } from 'react';
import { ReadFileWorkerReturn } from '../workers/readFileWorker.ts';

export interface FileData {
  id: string;
  name: string;
  status: 'LOADING' | 'ERROR' | 'AVAILABLE';
  content: string[];
}

interface JsonProviderContext {
  readFile: (file: File) => void;
  selectJsonById: (id: string) => void;
  files: FileData[];
  jsonSelected: FileData | null;
}

export const Context = createContext<JsonProviderContext>({
  readFile: null as never,
  selectJsonById: null as never,
  files: null as never,
  jsonSelected: null,
});

export const JsonProvider = ({ children }: PropsWithChildren) => {
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [jsonSelected, setJsonSelected] = useState<FileData | null>(null);

  const addJson = (name: string) => {
    const id = (Math.random() + 1).toString(36).substring(2);
    const jsonInfo: FileData = { name, id, status: 'LOADING', content: [] };
    setFileData((data) => [...data, jsonInfo]);
    return id;
  };

  const setContentByJsonId = (id: string, content: string[], isError: boolean) => {
    const jsonStatus: FileData['status'] = !isError ? 'AVAILABLE' : 'ERROR';
    setFileData((data) => {
      return data.map((item) => {
        if (item.id === id) {
          item.status = jsonStatus;
          item.content = content;
        }
        return item;
      });
    });
  };

  const readFile: JsonProviderContext['readFile'] = (file) => {
    const readFileWorker = getWorker('readFileWorker');
    const arr: string[] = [];

    const jsonId = addJson(file.name);

    readFileWorker.postMessage({ jsonId, file });

    readFileWorker.onmessage = (e: MessageEvent<ReadFileWorkerReturn>) => {
      const { isError, content, id, total, part } = e.data;
      arr.push(...content);
      if (total === part) {
        setContentByJsonId(id, arr, isError);
        readFileWorker.terminate();
      }
    };
  };

  const selectJsonById = (id: string) => {
    const jsonData = fileData.find((item) => item.id === id);
    if (jsonData) {
      setJsonSelected(jsonData);
    }
  };

  const getWorker = (name: string) => {
    const path = '../workers/' + name + '.ts';
    return new Worker(new URL(path, import.meta.url), { type: 'module' });
  };

  return (
    <Context.Provider value={{ readFile, files: fileData, jsonSelected, selectJsonById }}>{children}</Context.Provider>
  );
};
