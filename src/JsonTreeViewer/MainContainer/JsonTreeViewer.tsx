import { useJsonProvider } from '../../hooks/useJsonProvider.ts';
import { areEqual, ListChildComponentProps, VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Box, Divider, Paper } from '@mui/material';
import { HandleCollapseParam, JsonLine } from './JsonLine/JsonLine.tsx';
import { memo, useEffect, useRef } from 'react';
import { JsonNotSelected } from './JsonNotSelected.tsx';
import { JsonHeader } from './JsonHeader';

export const JsonTreeViewer = () => {
  const { jsonSelected } = useJsonProvider();

  const listRef = useRef<List<string[]>>(null);
  const rowHeights = useRef<Record<number, number>>({});

  function getRowHeight(index: number) {
    return rowHeights.current[index] ?? 20;
  }

  function setRowHeight(index: number, size: number) {
    //listRef.current?.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  }

  function scrollTop() {
    listRef.current?.scrollToItem(0, 'start');
  }

  const handleCollapse = ({ divIndexList, divParentIndex, isCollapse }: HandleCollapseParam) => {
    divIndexList.forEach((i) => {
      setRowHeight(i, isCollapse ? 0 : 20);
    });
    listRef.current?.resetAfterIndex(divParentIndex);
  };

  const Row = memo(({ index, style, data }: ListChildComponentProps<string[]>) => {
    const rowRef = useRef<HTMLDivElement>(null);

    const lineData = data[index];

    return (
      <JsonLine
        ref={rowRef}
        style={style}
        lineNumber={index + 1}
        lineData={lineData}
        totalLine={data.length}
        listRef={listRef}
        handleCollapse={handleCollapse}
      />
    );
  }, areEqual);

  useEffect(() => {
    if (!jsonSelected) return;
    scrollTop();
    rowHeights.current = {};
  }, [jsonSelected]);

  if (!jsonSelected) return <JsonNotSelected />;

  return (
    <Box
      component={Paper}
      variant={'outlined'}
      height={'100%'}
      overflow={'auto'}
      display={'flex'}
      flexDirection={'column'}
      flexWrap={'nowrap'}
    >
      <JsonHeader jsonSelected={jsonSelected} />
      <Divider />
      <Box flex={1} width={'100%'}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemData={jsonSelected?.content}
              itemCount={jsonSelected?.content.length}
              itemSize={getRowHeight}
              width={width}
              ref={listRef}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </Box>
    </Box>
  );
};
