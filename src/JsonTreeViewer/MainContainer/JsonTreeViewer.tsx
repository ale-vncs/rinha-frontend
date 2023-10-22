import { useJsonProvider } from '@hooks/useJsonProvider';
import { areEqual, ListChildComponentProps, VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Box, Divider, Paper } from '@mui/material';
import { HandleCollapseParam, JsonLine } from './JsonLine/JsonLine';
import { memo, useEffect, useRef } from 'react';
import { JsonNotSelected } from './JsonNotSelected';
import { JsonHeader } from './JsonHeader';
import { JsonFeatureProvider } from '@providers/JsonFeatureProvider';
import { FileData } from '@providers/JsonProvider';

export const JsonTreeViewer = () => {
  const { jsonSelected } = useJsonProvider();

  const currentJsonId = useRef('');
  const listRef = useRef<List<FileData>>(null);
  const rowHeights = useRef<Record<number, number>>({});

  function getRowHeight(index: number) {
    return rowHeights.current[index] ?? 20;
  }

  function setRowHeight(index: number, size: number) {
    rowHeights.current = { ...rowHeights.current, [index]: size };
  }

  function scrollTop() {
    listRef.current?.scrollToItem(0, 'start');
  }

  const handleCollapse = ({ divParentIndex, isCollapse }: HandleCollapseParam) => {
    const collapseData = jsonSelected?.collapseData ?? {};
    const lastIndex = collapseData[divParentIndex];
    for (let i = divParentIndex + 1; i <= lastIndex; i++) {
      setRowHeight(i, isCollapse ? 0 : 20);
    }

    listRef.current?.resetAfterIndex(divParentIndex);
  };

  const Row = memo(({ index, style, data }: ListChildComponentProps<FileData>) => {
    const lineData = data.content[index];

    const isCollapse = !getRowHeight(index + 1) && !!getRowHeight(index);

    const disableCollapse = (data.collapseData[index] ?? 0) - index > 5000;

    return (
      <JsonLine
        style={style}
        disableCollapse={disableCollapse}
        isCollapse={isCollapse}
        lineNumber={index + 1}
        lineData={lineData}
        totalLine={data.content.length}
        handleCollapse={handleCollapse}
      />
    );
  }, areEqual);

  useEffect(() => {
    if (!jsonSelected) return;
    scrollTop();
    listRef.current?.resetAfterIndex(0);
  }, [jsonSelected]);

  if (currentJsonId.current !== jsonSelected?.id) {
    rowHeights.current = {};
    currentJsonId.current = jsonSelected?.id ?? '';
  }

  if (!jsonSelected) return <JsonNotSelected />;

  return (
    <JsonFeatureProvider jsonSelected={jsonSelected} listRef={listRef}>
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
                itemData={jsonSelected}
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
    </JsonFeatureProvider>
  );
};
