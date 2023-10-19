import { forwardRef, MouseEvent, RefObject, useEffect, useImperativeHandle, useRef } from 'react';
import { Box } from '@mui/material';
import { VariableSizeList } from 'react-window';
import { useJsonLinesStyles } from './styles.ts';

interface JsonLineProps {
  lineNumber: number;
  lineData: string;
  totalLine: number;
  listRef: RefObject<VariableSizeList<string[]>>;
  onClickCollapse: (ev: MouseEvent<HTMLInputElement>) => void;
}

export const JsonLine = forwardRef<HTMLDivElement, JsonLineProps>(
  ({ lineNumber, lineData, totalLine, listRef, onClickCollapse }, ref) => {
    const classes = useJsonLinesStyles({ totalLine, tabSize: 2 });

    const lineRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => lineRef.current!);

    const lineId = (lineNumber: number) => `json-line-${lineNumber}`;
    const BRACKET_ATTR = 'data-bracket-collapse';
    const COLLAPSE_BY_ATTR = 'data-collapse-by';
    const CAN_COLLAPSE_ATTR = 'data-can-collapse';

    const f = () => {
      const keyBracket = /"(.+)": ({|\[)/; // "name": {
      const bracktes = /^\s+({|}|]|\[),?/; // \t [
      const numberValue = /(?<=.*:\s)[0-9.]+(?=,?)/; // "age": 4
      const booleanValue = /(?<=.*:\s)(true|false)+(?=,?)/; // "isOk": true
      const stringValue = /(?<=.*:\s")(.+)(?=",?)/; // "name": "Ale"

      const tabCount = lineData.match(/&#9;/)?.length ?? 0;
    };

    /*
    const onClickCollapse = (ev: MouseEvent<HTMLInputElement>) => {
      const { value } = ev.currentTarget;
      const id = ev.currentTarget.parentElement?.id ?? '';
      const elList = document.querySelectorAll(`[${COLLAPSE_BY_ATTR}]`);
      const isCollapsed = value === '+';
      console.log({ id, elList });
      elList.forEach((el) => {
        const value = (el.getAttribute(COLLAPSE_BY_ATTR) ?? '').split(',').map(Number).map(lineId);
        if (value.includes(id)) {
          el.classList.add('line-collapse');
          listRef.current?.resetAfterIndex(Number(id.replace(/\D/, '')));
        }
      });
      //value = isCollapsed ? '-' : '+';
    };

     */

    const isOpenBracket = (() => {
      const reg = /[{[]/g;
      return reg.test(lineData);
    })();

    const isCloseBracket = (() => {
      const reg = /[}\]]/g;
      return reg.test(lineData);
    })();

    useEffect(() => {
      if (!lineRef.current) return;

      const beforeLineId = lineId(lineNumber - 1);
      const lineBeforeCurrent = document.getElementById(beforeLineId);

      if (isOpenBracket) {
        lineRef.current.setAttribute(BRACKET_ATTR, '');
      }

      if (!lineBeforeCurrent) return;
      const canCollapseBy = (lineBeforeCurrent.getAttribute(COLLAPSE_BY_ATTR) ?? '').split(',').filter(Boolean);
      const hasAttr = lineBeforeCurrent.hasAttribute(BRACKET_ATTR);

      if (hasAttr || canCollapseBy.length) {
        const collapseById = String(lineNumber - 1);

        if (hasAttr) canCollapseBy.push(collapseById);
        if (isCloseBracket) canCollapseBy.pop();

        //lineRef.current.setAttribute(CAN_COLLAPSE_ATTR, '');
        lineRef.current.setAttribute(COLLAPSE_BY_ATTR, canCollapseBy.join(','));
      }
    }, []);

    return (
      <Box id={lineId(lineNumber)} ref={lineRef} sx={classes('line')}>
        <Box sx={classes('lineCount')}>
          <p>{lineNumber}</p>
        </Box>
        {isOpenBracket && <input type="button" value="-" onClick={onClickCollapse} />}
        <Box sx={classes('nested')} className="nested">
          <Box sx={classes('nested')}>
            <Box sx={classes('nested')} />
          </Box>
        </Box>
        <pre>{lineData}</pre>
      </Box>
    );
  },
);
