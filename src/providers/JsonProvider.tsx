import { createContext, PropsWithChildren, useMemo, useState } from 'react';

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

  const readFileWorker = useMemo(() => new Worker(new URL('../workers/readFileWorker.ts', import.meta.url)), []);

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
    const jsonId = addJson(file.name);

    readFileWorker.postMessage({ jsonId, file });

    readFileWorker.onmessage = (e: MessageEvent<{ id: string; content: string[]; isError: boolean }>) => {
      const { isError, content, id } = e.data;
      setContentByJsonId(id, content, isError);
    };
  };

  const selectJsonById = (id: string) => {
    const jsonData = fileData.find((item) => item.id === id);
    if (jsonData) setJsonSelected(jsonData);
  };

  return (
    <Context.Provider value={{ readFile, files: fileData, jsonSelected, selectJsonById }}>{children}</Context.Provider>
  );
};
