import { createContext, PropsWithChildren, useState } from 'react';

interface FileData {
  name: string;
  content: string;
  isError: boolean;
}

interface JsonProviderContext {
  readFile: (file: File) => void;
  files: FileData[];
  jsonSelected: FileData | null;
}

export const Context = createContext<JsonProviderContext>({
  readFile: null as never,
  files: null as never,
  jsonSelected: null,
});

export const JsonProvider = ({ children }: PropsWithChildren) => {
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [jsonSelected, setJsonSelected] = useState<FileData | null>(null);

  const addJson = (name: string, content: string) => {
    setFileData((data) => [...data, { name, content, isError: !content }]);
    setJsonSelected({ name, content, isError: !content });
  };

  const readFile: JsonProviderContext['readFile'] = (file) => {
    const fileRead = new FileReader();
    fileRead.onload = function (e) {
      const content = e.target?.result as string;
      if (content) {
        try {
          const json = JSON.parse(content);
          addJson(file.name, json);
        } catch (e) {
          addJson(file.name, '');
        }
      }
    };
    fileRead.readAsText(file);
  };

  return <Context.Provider value={{ readFile, files: fileData, jsonSelected }}>{children}</Context.Provider>;
};
