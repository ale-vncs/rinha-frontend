import { createContext, PropsWithChildren, useState } from 'react';

interface FileData {
  id: string;
  name: string;
  status: 'LOADING' | 'ERROR' | 'AVAILABLE';
  content: string;
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
    const jsonInfo: FileData = { name, id, status: 'LOADING', content: '' };
    setFileData((data) => [...data, jsonInfo]);
    setJsonSelected(jsonInfo);
    return id;
  };

  const setContentByJsonId = (id: string, content: string | null) => {
    const jsonStatus: FileData['status'] = content ? 'AVAILABLE' : 'ERROR';

    setFileData((data) => {
      return data.map((item) => {
        if (item.id === id) {
          item.status = jsonStatus;
          item.content = content ?? 'Invalid Json';
        }
        return item;
      });
    });
  };

  const readFile: JsonProviderContext['readFile'] = (file) => {
    const jsonId = addJson(file.name);

    const parseJson = () => {
      let jsonBuffer = '';

      return new TransformStream<string>({
        transform(chunk) {
          jsonBuffer += chunk;
        },
        flush(controller) {
          controller.enqueue(JSON.parse(jsonBuffer));
        },
      });
    };

    file
      .stream()
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(parseJson())
      .pipeTo(
        new WritableStream<string>({
          write(chunk) {
            console.log(jsonId, chunk);
            setContentByJsonId(jsonId, chunk);
          },
        }),
      )
      .catch((err) => {
        console.log(err);
        setContentByJsonId(jsonId, null);
      });
  };

  const selectJsonById = (id: string) => {
    const jsonData = fileData.find((item) => item.id === id);
    if (jsonData) setJsonSelected(jsonData);
  };

  return (
    <Context.Provider value={{ readFile, files: fileData, jsonSelected, selectJsonById }}>{children}</Context.Provider>
  );
};
