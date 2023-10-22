export interface ReadFileWorkerReturn {
  id: string;
  collapseData: Record<number, number>;
  isError: boolean;
  fileFormatted: Blob[];
}

const setContentByJsonId = (id: string, content: string[], isError = false) => {
  const collapseData = buildCollapseData(content);
  const jsonFile = new File([content.join('\n')], 'foo.json', {
    type: 'application/json',
  });

  const jsonBlob: Blob[] = [];
  const chunkSizeMb = 50 * 1024;

  for (let i = 0; i < jsonFile.size; i += chunkSizeMb) {
    jsonBlob.push(jsonFile.slice(i, i + chunkSizeMb));
  }

  const data: ReadFileWorkerReturn = {
    id,
    isError,
    collapseData,
    fileFormatted: jsonBlob,
  };

  self.postMessage(data);
};

const buildCollapseData = (jsonLines: string[]) => {
  const collapseData: Record<number, number> = {};
  const bracketIndexControl: number[] = [];

  jsonLines.forEach((line, index) => {
    const isOpenBracket = (() => {
      const reg = /[{[]$/g;
      return reg.test(line);
    })();

    const isCloseBracket = (() => {
      const reg = /^\s*[}\]]/g;
      return reg.test(line);
    })();

    if (isOpenBracket) {
      collapseData[index] = -1;
      bracketIndexControl.push(index);
    } else if (isCloseBracket) {
      bracketIndexControl.pop();
    }
    bracketIndexControl.forEach((brackIndex) => {
      if (brackIndex !== index) {
        collapseData[brackIndex] = index;
      }
    });
  });

  return collapseData;
};

self.onmessage = (e: MessageEvent<{ jsonId: string; file: File }>) => {
  const { jsonId, file } = e.data;
  console.time(`${jsonId} : ${file.name} validate`);

  const parseJson = () => {
    let jsonBuffer = '';

    return new TransformStream<string, string[]>({
      transform(chunk) {
        jsonBuffer += chunk;
      },
      flush(controller) {
        jsonBuffer = JSON.stringify(JSON.parse(jsonBuffer), null, '\t');
        const jsonLines = jsonBuffer.split('\n');
        controller.enqueue(jsonLines);
      },
    });
  };

  file
    .stream()
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(parseJson())
    .pipeTo(
      new WritableStream({
        write(chunk) {
          setContentByJsonId(jsonId, chunk);
          console.timeEnd(`${jsonId} : ${file.name} validate`);
        },
      }),
    )
    .catch((err: Error) => {
      console.error(err);
      setContentByJsonId(jsonId, [err.message], true);
    });
};
