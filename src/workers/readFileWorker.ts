const setContentByJsonId = (id: string, content: string[] | null) => {
  self.postMessage({ id, content });
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
        console.time(`${jsonId} validate`);
        jsonBuffer = JSON.stringify(JSON.parse(jsonBuffer), null, '\t');
        const jsonLines = jsonBuffer.split('\n');
        console.timeEnd(`${jsonId} validate`);
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
    .catch((err) => {
      console.error(err);
      setContentByJsonId(jsonId, null);
    });
};
