import chunk from 'lodash.chunk';

export interface ReadFileWorkerReturn {
  id: string;
  content: string[];
  isError: boolean;
  part: number;
  total: number;
}

const setContentByJsonId = (id: string, content: string[], isError = false) => {
  const dataChunk = chunk(content, 25000);
  const data: ReadFileWorkerReturn = { id, content, isError, part: 1, total: dataChunk.length };

  dataChunk.forEach((chk, index) => {
    self.postMessage({ ...data, content: chk, part: index + 1 });
  });
};

self.onmessage = (e: MessageEvent<{ jsonId: string; file: File }>) => {
  const { jsonId, file } = e.data;

  const parseJson = () => {
    let jsonBuffer = '';

    return new TransformStream<string, string[]>({
      transform(chunk) {
        jsonBuffer += chunk;
      },
      flush(controller) {
        console.time(`${jsonId} : ${file.name} validate`);
        jsonBuffer = JSON.stringify(JSON.parse(jsonBuffer), null, '\t');
        const jsonLines = jsonBuffer.split('\n');
        console.timeEnd(`${jsonId} : ${file.name} validate`);
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
        },
      }),
    )
    .catch((err: Error) => {
      console.error(err);
      setContentByJsonId(jsonId, [err.message], true);
    });
};
