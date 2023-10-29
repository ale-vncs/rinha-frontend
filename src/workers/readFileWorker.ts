interface ReadFileWorkerError {
  id: string;
  action: 'ERROR';
  error: string;
}

interface ReadFileWorkerComplete {
  id: string;
  action: 'COMPLETE';
  problem: {
    error: string;
    line: number;
  } | null;
}

interface ReadFileWorkerPart {
  id: string;
  action: 'LOADING';
  part: string[];
  collapseData: Record<number, number>;
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

const sendComplete = (id: string, problem: ReadFileWorkerComplete['problem']) => {
  const data: ReadFileWorkerReturn = {
    id,
    action: 'COMPLETE',
    problem,
  };

  self.postMessage(data);
};

const sendPart = (id: string, part: ReadFileWorkerPart['part'], collapseData: ReadFileWorkerPart['collapseData']) => {
  const data: ReadFileWorkerPart = {
    id,
    action: 'LOADING',
    part,
    collapseData,
  };
  self.postMessage(data);
};

self.onmessage = async (e: MessageEvent<{ jsonId: string; file: File }>) => {
  const { jsonId, file } = e.data;

  console.time(`${jsonId} : ${file.name} validate`);
  const problem: ReadFileWorkerComplete['problem'] = {
    error: '',
    line: -1,
  };

  file
    .stream()
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(parseJson(problem))
    .pipeThrough(buildCollapseData())
    .pipeTo(
      new WritableStream({
        write({ data, collapseData }) {
          sendPart(jsonId, data, collapseData);
        },
        close() {
          console.timeEnd(`${jsonId} : ${file.name} validate`);
          sendComplete(jsonId, problem.error ? problem : null);
          self.close();
        },
      }),
    )
    .catch((err: Error) => {
      console.error(err);
      sendError(jsonId, err.message);
      self.close();
    });
};

const parseJson = (problem: NonNullable<ReadFileWorkerComplete['problem']>) => {
  let tabSize = 0;
  let putTabChar = false;
  let isString = false;
  let isCloseBracket = false;
  let nextCharIsString = false;

  const repeat = (x: string, n: number) => {
    let s = '';
    for (;;) {
      if (n & 1) s += x;
      n >>= 1;
      if (n) x += x;
      else break;
    }
    return s;
  };

  const jsonFormat = (text: string) => {
    let jsonFinal = '';
    const listLine: string[] = [];
    let i = 0;

    while (i < text.length) {
      const ch = text[i];
      i++;

      if (ch === '\n') continue;
      if (ch === '\t') continue;
      if (ch === ' ' && !isString) continue;
      if (putTabChar && !isCloseBracket) jsonFinal += repeat('\t', tabSize);

      if (ch === '"' && !nextCharIsString) isString = !isString;
      nextCharIsString = ch === '\\' && !nextCharIsString;
      isCloseBracket = false;

      if ((ch === '{' || ch === '[') && !isString) {
        jsonFinal += ch;
        listLine[listLine.length] = jsonFinal;
        jsonFinal = '';
        tabSize++;
        putTabChar = true;
      } else if ((ch === '}' || ch === ']') && !isString) {
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
      const f = jsonFormat(chunk);
      jsonToValidade += f.join('\n');
      controller.enqueue(f);
    },
    flush() {
      try {
        JSON.parse(jsonToValidade);
      } catch (e) {
        const msg = (e as Error).message;
        const reg = /Expected ',' or '}' after property value in JSON at position \d+ \(line (\d+) column \d+\)/;
        const matchArray = reg.exec(msg);
        if (!matchArray) {
          problem.error = msg;
          return;
        }
        const line = matchArray[1];
        problem.error = msg;
        problem.line = Number(line);
      }
    },
  });
};

const buildCollapseData = () => {
  let lineIndex = 0;
  const lastIndex: number[] = [];

  return new TransformStream<string[], { data: string[]; collapseData: Record<number, number> }>({
    transform(chunk, controller) {
      const collapseData: Record<number, number> = {};

      for (const line of chunk) {
        const isOpenBracket = (() => {
          const reg = /[{[]$/g;
          return reg.test(line);
        })();

        const isCloseBracket = (() => {
          const reg = /^\s*[}\]]/g;
          return reg.test(line);
        })();

        if (isOpenBracket) {
          collapseData[lineIndex] = -1;
          lastIndex[lastIndex.length] = lineIndex;
        } else if (isCloseBracket) {
          collapseData[lastIndex[lastIndex.length - 1]] = lineIndex - 1;
          lastIndex.pop();
        }

        lineIndex++;
      }
      controller.enqueue({ data: chunk, collapseData });
    },
  });
};
