import { createContext, PropsWithChildren, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { FileData } from './JsonProvider.tsx';
import { SearchWordWorkerInput, SearchWordWorkerReturn } from '../workers/searchWordWorker.ts';
import { VariableSizeList as List } from 'react-window';
import debounce from 'lodash.debounce';

interface JsonFeatureProviderContextProps {
  tabSize: number;
  wordSearchPosition: SearchWordWorkerReturn;
  changeTabSize: (size: number) => void;
  searchWord: (value: string) => void;
  toggleCaseSensitive: () => void;
  nextWordFound: () => void;
  previousWordFound: () => void;
  wordSearch: string;
  isCaseSensitive: boolean;
  currentIndexWordMarked: number;
}

interface JsonFeatureProviderProps {
  jsonSelected: FileData;
  listRef: RefObject<List<FileData>>;
}

export const JsonFeatureProviderContext = createContext<JsonFeatureProviderContextProps>({} as never);

export const JsonFeatureProvider = ({
  children,
  jsonSelected,
  listRef,
}: PropsWithChildren<JsonFeatureProviderProps>) => {
  const [tabSize, setTabSize] = useState(2);
  const [wordSearchPosition, setWordSearchPosition] = useState<SearchWordWorkerReturn>({
    total: 0,
    positions: [],
  });
  const [wordSearch, setWordSearch] = useState('');
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [currentIndexWordMarked, setCurrentIndexWordMarked] = useState(-1);

  const workerRef = useRef<Worker>();

  const changeTabSize = (size: number) => setTabSize(size);

  const toggleCaseSensitive = () => {
    setIsCaseSensitive((prev) => !prev);
  };

  const searchWord = useCallback(
    debounce((value: string) => {
      const worker = getWorker();
      setWordSearch(value);
      if (!value) {
        setCurrentIndexWordMarked(-1);
        setWordSearchPosition({
          total: 0,
          positions: [],
        });
        return;
      }

      const message: SearchWordWorkerInput = {
        value,
        jsonLines: jsonSelected.content,
        isCaseSensitive,
        jsonId: jsonSelected.id,
      };

      worker.postMessage(message);

      worker.onmessage = (ev: MessageEvent<SearchWordWorkerReturn>) => {
        setWordSearchPosition(ev.data);
      };
    }, 300),
    [isCaseSensitive, jsonSelected],
  );

  const nextWord = () => {
    setCurrentIndexWordMarked((prev) => {
      prev += 1;
      if (prev >= wordSearchPosition.total) {
        prev = 0;
      }
      listRef.current?.scrollToItem(prev);
      return prev;
    });
  };

  const previousWord = () => {
    setCurrentIndexWordMarked((prev) => {
      prev -= 1;
      if (prev < 0) {
        prev = wordSearchPosition.total - 1;
      }
      listRef.current?.scrollToItem(prev);
      return prev;
    });
  };

  const getWorker = () => {
    const newWorker = new Worker(new URL('../workers/searchWordWorker.ts', import.meta.url), { type: 'module' });
    workerRef.current?.terminate();
    workerRef.current = newWorker;
    return newWorker;
  };

  useEffect(() => {
    setWordSearchPosition({
      total: 0,
      positions: [],
    });
    setWordSearch('');
    workerRef.current?.terminate();
  }, [jsonSelected]);

  useEffect(() => {
    searchWord(wordSearch);
  }, [isCaseSensitive]);

  return (
    <JsonFeatureProviderContext.Provider
      value={{
        tabSize,
        changeTabSize,
        searchWord,
        wordSearchPosition,
        wordSearch,
        isCaseSensitive,
        toggleCaseSensitive,
        nextWordFound: nextWord,
        previousWordFound: previousWord,
        currentIndexWordMarked,
      }}
    >
      {children}
    </JsonFeatureProviderContext.Provider>
  );
};
