import { createContext, PropsWithChildren, useRef, useState } from 'react';
import { ReadFileWorkerReturn } from '@workers/readFileWorker';

export interface FileData {
  id: string;
  name: string;
  status: 'LOADING' | 'ERROR' | 'AVAILABLE' | 'WAITING';
  content: string[];
  collapseData: Record<number, number>;
  problem?: {
    error: string;
    line: number;
  };
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

  const bigFileWaitingList = useRef<{ id: string; file: File }[]>([]);
  const bigFileIdLoading = useRef<string>();

  const addJson = (name: string) => {
    const id = (Math.random() + 1).toString(36).substring(2);
    const jsonInfo: FileData = { name, id, status: 'WAITING', content: [], collapseData: {} };
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
    const currentFileIsBig = file.size > 1024 * 20;
    const jsonId = addJson(file.name);

    if (currentFileIsBig && bigFileIdLoading.current) {
      bigFileWaitingList.current.push({
        id: jsonId,
        file,
      });
      return;
    }

    if (currentFileIsBig) {
      bigFileIdLoading.current = jsonId;
    }

    sendToWorker(jsonId, file);
  };

  const sendToWorker = (jsonId: string, file: File) => {
    const readFileWorker = getReadFileWorker();

    readFileWorker.postMessage({ jsonId, file });

    const arr: string[] = [];
    const collapse: Record<number, number> = {};
    let upCount = 51;

    readFileWorker.onmessage = (e: MessageEvent<ReadFileWorkerReturn>) => {
      const action = e.data.action;
      const id = e.data.id;

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
        if (upCount > 50) {
          setFileData((data) => {
            return data.map((item) => {
              if (item.id === id) {
                item.content = arr;
                item.status = 'LOADING';
                item.collapseData = collapse;
              }
              return item;
            });
          });
          upCount = 0;
        }
        upCount++;
      } else if (action === 'COMPLETE') {
        const problem = e.data.problem;
        setFileData((data) => {
          return data.map((item) => {
            if (item.id === id) {
              item.content = arr;
              item.status = problem ? 'ERROR' : 'AVAILABLE';
              item.collapseData = collapse;
              item.problem = problem || undefined;
            }
            return item;
          });
        });
        readNextBigFile(jsonId);
      } else if (action === 'ERROR') {
        setContentByJsonId(id, [e.data.error], {}, true);
        readNextBigFile(jsonId);
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

  const readNextBigFile = (jsonIdHasCompleted: string) => {
    if (bigFileIdLoading.current !== jsonIdHasCompleted) return;
    const bigFile = bigFileWaitingList.current.shift();
    if (bigFile) {
      bigFileIdLoading.current = bigFile.id;
      sendToWorker(bigFile.id, bigFile.file);
    } else {
      bigFileIdLoading.current = undefined;
    }
  };

  return (
    <Context.Provider value={{ readFile, files: fileData, jsonSelected, selectJsonById }}>{children}</Context.Provider>
  );
};
