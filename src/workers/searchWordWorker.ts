export interface SearchWordWorkerReturn {
  total: number;
  positions: Record<number, number[]>;
}

export interface SearchWordWorkerInput {
  isCaseSensitive: boolean;
  value: string;
  jsonLines: string[];
}

const getIndicesOf = (searchStr: string, str: string, caseSensitive = false, total: number) => {
  const searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }

  let startIndex = 0;
  let index: number;
  const indices: number[] = [];

  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }

  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(total++);
    startIndex = index + searchStrLen;
  }

  return indices;
};

const sendMessage = (positions: Record<number, number[]>, total: number) => {
  const returnData: SearchWordWorkerReturn = {
    positions: positions,
    total,
  };

  self.postMessage(returnData);
};

self.onmessage = async (e: MessageEvent<SearchWordWorkerInput>) => {
  const { value, jsonLines, isCaseSensitive } = e.data;

  const wordPositions: Record<number, number[]> = {};
  let total = 0;

  for (let index = 0; index < jsonLines.length; index++) {
    const line = jsonLines[index];
    const indices = getIndicesOf(value, line, isCaseSensitive, total);
    total += indices.length;
    if (indices.length) wordPositions[index] = indices;
  }
  sendMessage(wordPositions, total);
  self.close();
};
