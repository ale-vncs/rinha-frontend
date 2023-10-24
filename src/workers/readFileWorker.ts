interface ReadFileWorkerError {
  id: string;
  action: 'ERROR';
  error: string;
}

interface ReadFileWorkerComplete {
  id: string;
  action: 'COMPLETE';
}

interface ReadFileWorkerPart {
  id: string;
  action: 'LOADING';
  part: string[];
}

export type ReadFileWorkerReturn = ReadFileWorkerError | ReadFileWorkerComplete | ReadFileWorkerPart;

const sendError = (id: string, err: string) => {
  const data: ReadFileWorkerReturn = {
    id,
    action: 'ERROR',
    error: err,
  };

  self.postMessage(data);
};

const sendComplete = (id: string) => {
  const data: ReadFileWorkerReturn = {
    id,
    action: 'COMPLETE',
  };

  self.postMessage(data);
};

const sendPart = (id: string, part: ReadFileWorkerPart['part']) => {
  const data: ReadFileWorkerPart = {
    id,
    action: 'LOADING',
    part,
  };
  self.postMessage(data);
};

self.onmessage = (e: MessageEvent<{ jsonId: string; file: File }>) => {
  const { jsonId, file } = e.data;

  console.time(`${jsonId} : ${file.name} validate`);

  const collapseData: Record<number, number> = {};

  file
    .stream()
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(parseJson())
    .pipeThrough(buildCollapseData(collapseData))
    .pipeTo(
      new WritableStream({
        write(data) {
          sendPart(jsonId, data);
        },
        close() {
          console.log({ collapseData });
          console.timeEnd(`${jsonId} : ${file.name} validate`);
          sendComplete(jsonId);
        },
      }),
    )
    .catch((err: Error) => {
      console.error(err);
      sendError(jsonId, err.message);
    });
};

const parseJson = () => {
  let tabSize = 0;
  let putTabChar = false;
  let isString = false;
  let isCloseBracket = false;

  function repeat(x: string, n: number) {
    let s = '';
    for (;;) {
      if (n & 1) s += x;
      n >>= 1;
      if (n) x += x;
      else break;
    }
    return s;
  }

  const jsonFormat = (text: string) => {
    let jsonFinal = '';
    const listLine: string[] = [];
    let i = 0;
    while (i < text.length) {
      const ch = text[i];
      i++;
      if (ch === '\n') continue;
      if (ch === ' ' && !isString) continue;
      if (putTabChar && !isCloseBracket) jsonFinal += repeat('\t', tabSize);

      if (ch === '"') isString = !isString;
      isCloseBracket = false;

      if (ch === '{' || ch === '[') {
        jsonFinal += ch;
        listLine[listLine.length] = jsonFinal;
        jsonFinal = '';
        tabSize++;
        putTabChar = true;
      } else if (ch === '}' || ch === ']') {
        tabSize--;
        listLine[listLine.length] = jsonFinal;
        jsonFinal = repeat('\t', tabSize) + ch;
        putTabChar = true;
        isCloseBracket = true;
      } else if (ch === ',' && !isString) {
        putTabChar = true;
        jsonFinal += ch;
        listLine[listLine.length] = jsonFinal;
        jsonFinal = '';
      } else if (ch === ':' && !isString) {
        putTabChar = false;
        jsonFinal += ch + ' ';
      } else {
        putTabChar = false;
        jsonFinal += ch;
      }
    }
    listLine[listLine.length] = jsonFinal;
    return listLine;
  };

  let jsonToValidade = '';

  return new TransformStream<string, string[]>({
    transform(chunk, controller) {
      jsonToValidade += chunk;
      controller.enqueue(jsonFormat(chunk));
    },
    flush() {
      JSON.parse(jsonToValidade);
    },
  });
};

const buildCollapseData = (collapseData: Record<number, number>) => {
  const bracketIndexControl: number[] = [];

  return new TransformStream<string[], string[]>({
    transform(chunk, controller) {
      for (let index = 0; index < chunk.length; index++) {
        const line = chunk[index];
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
        for (const brackIndex of bracketIndexControl) {
          if (brackIndex !== index) {
            collapseData[brackIndex] = index;
          }
        }
      }
      controller.enqueue(chunk);
    },
  });
};
