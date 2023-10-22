export interface SearchWordWorkerReturn {
  total: number;
  positions: Record<number, number[]>;
}

export interface SearchWordWorkerInput {
  isCaseSensitive: boolean;
  value: string;
  jsonId: string;
  jsonLines: string[];
}

const getIndicesOf = (searchStr: string, str: string, caseSensitive = false) => {
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
    indices.push(index);
    startIndex = index + searchStrLen;
  }

  return indices;
};

const sendMessage = (positions: Record<number, number[]>) => {
  const returnData: SearchWordWorkerReturn = {
    positions: positions,
    total: Object.values(positions).flat().length,
  };

  self.postMessage(returnData);
};

self.onmessage = async (e: MessageEvent<SearchWordWorkerInput>) => {
  const { value, jsonLines, isCaseSensitive } = e.data;

  const wordPositions: Record<number, number[]> = {};

  jsonLines.forEach((line, index) => {
    const indices = getIndicesOf(value, line, isCaseSensitive);
    const total = Object.values(wordPositions).flat().length;
    if (indices.length) wordPositions[index] = indices.map((_, i) => total + i++);
    if (index % 280 === 0) sendMessage(wordPositions);
  });
  sendMessage(wordPositions);
};
