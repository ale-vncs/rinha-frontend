import { useJsonProvider } from '../../hooks/useJsonProvider.ts';
import { ListChildComponentProps, VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Box, Divider, Paper } from '@mui/material';
import { JsonLine } from './JsonLine/JsonLine.tsx';
import { MouseEvent, useEffect, useRef } from 'react';
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
    listRef.current?.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  }

  function scrollTop() {
    listRef.current?.scrollToItem(0, 'start');
  }

  const onClickCollapse = (ev: MouseEvent<HTMLInputElement>) => {
    const COLLAPSE_BY_ATTR = 'data-collapse-by';

    //const { value } = ev.currentTarget;
    const id = ev.currentTarget.parentElement?.id ?? '';
    const lineId = (lineNumber: number) => `json-line-${lineNumber}`;
    const elList = document.querySelectorAll(`[${COLLAPSE_BY_ATTR}]`);
    //const isCollapsed = value === '+';
    elList.forEach((el) => {
      const value = (el.getAttribute(COLLAPSE_BY_ATTR) ?? '').split(',').map(Number).map(lineId);
      if (value.includes(id)) {
        el.classList.add('line-collapse');
        const elId = Number(el.id.replace(/\D/g, '')) - 1;
        setRowHeight(elId, 0);
      }
    });
    listRef.current?.resetAfterIndex(Number(id.replace(/\D/g, '')) - 1);
    //value = isCollapsed ? '-' : '+';
  };

  const Row = ({ index, style, data }: ListChildComponentProps<string[]>) => {
    const rowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!rowRef.current) return;
      if (!getRowHeight(index)) {
        rowRef.current.classList.add('line-collapse');
      } else {
        setRowHeight(index, rowRef.current.clientHeight);
      }
      // eslint-disable-next-line
    }, []);

    return (
      <div style={style}>
        <JsonLine
          ref={rowRef}
          lineNumber={index + 1}
          lineData={data[index]}
          totalLine={data.length}
          listRef={listRef}
          onClickCollapse={onClickCollapse}
        />
      </div>
    );
  };

  useEffect(() => {
    if (!jsonSelected) return;
    scrollTop();
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
      <Box overflow={'auto'} height={'100%'}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemData={jsonSelected?.content}
              itemCount={jsonSelected?.content.length}
              itemSize={getRowHeight}
              width={width}
              ref={listRef}
              className={'list-virtualized'}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </Box>
    </Box>
  );
};
