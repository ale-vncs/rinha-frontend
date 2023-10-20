import { forwardRef, MouseEvent, RefObject, useEffect, useImperativeHandle, useRef } from 'react';
import { Box } from '@mui/material';
import { VariableSizeList } from 'react-window';
import { useJsonLinesStyles } from './styles.ts';

export interface HandleCollapseParam {
  divParentIndex: number;
  isCollapse: boolean;
  divIndexList: number[];
}

interface JsonLineProps {
  lineNumber: number;
  lineData: string;
  totalLine: number;
  listRef?: RefObject<VariableSizeList<string[]>>;
  handleCollapse?: (param: HandleCollapseParam) => void;
}

export const JsonLine = forwardRef<HTMLDivElement, JsonLineProps>(
  ({ lineNumber, lineData, totalLine, handleCollapse }, ref) => {
    const classes = useJsonLinesStyles({ totalLine, tabSize: 2 });

    const lineRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => lineRef.current!);

    const lineId = (lineNumber: number) => `json-line-${lineNumber}`;

    const BRACKET_ATTR = 'data-bracket-collapse';
    const COLLAPSE_BY_ATTR = 'data-collapse-by';
    const IS_COLLAPSE = 'data-is-collapse';

    const tabCount = lineData.match(/\t/g)?.length ?? 0;

    const colorLine = () => {
      const keyBracket = /(".+":) ({|\[)/; // "name": {
      const brackets = /^\s*({|}|]|\[),?/; // \t [
      const numberValue = /^\s*(".+":)\s([0-9.]+)(?=,?)/; // "age": 4
      const stringValue = /^\s*(".+":)\s(.+)(?=,?)/; // "name": "Ale"
      const booleanValue = /^\s*(".+":)\s(true|false|null|undefined)(?=,?)/; // "isOk": true

      lineData = lineData.replace(/\t/g, '');

      const hasComma = lineData.endsWith(',');

      const color: [string, string][] = [];

      if (hasComma) {
        lineData = lineData.substring(0, lineData.length - 1);
      }

      if (brackets.test(lineData)) {
        color.push(['color-bracket', lineData]);
      } else if (keyBracket.test(lineData)) {
        const [, key, bracket] = keyBracket.exec(lineData) as RegExpExecArray;
        color.push(['color-key', key]);
        color.push(['color-bracket', bracket]);
      } else if (numberValue.test(lineData)) {
        const [, key, number] = numberValue.exec(lineData) as RegExpExecArray;
        color.push(['color-key', key]);
        color.push(['color-number', number]);
      } else if (booleanValue.test(lineData)) {
        const [, key, boolean] = booleanValue.exec(lineData) as RegExpExecArray;
        color.push(['color-key', key]);
        color.push(['color-boolean', boolean]);
      } else if (stringValue.test(lineData)) {
        const [, key, string] = stringValue.exec(lineData) as RegExpExecArray;
        color.push(['color-key', key]);
        color.push(['color-string', string]);
      } else {
        let c = 'color-boolean';
        if (/".*"/.test(lineData)) c = 'color-string';
        if (/[0-9]+/.test(lineData)) c = 'color-number';
        color.push([c, lineData]);
      }

      if (hasComma) {
        color.push(['color-bracket', ',']);
      }

      return (
        <>
          {'\t'.repeat(tabCount)}
          {color.map(([className, text]) => {
            if (text.includes(':')) text += ' ';
            return <span className={className}>{text}</span>;
          })}
        </>
      );
    };

    const toggleCollapse = (ev: MouseEvent<HTMLInputElement>) => {
      const parentEl = ev.currentTarget.parentElement as HTMLDivElement;

      const isCollapse = parentEl.getAttribute(IS_COLLAPSE) === 'true';
      parentEl.setAttribute(IS_COLLAPSE, isCollapse ? 'false' : 'true');

      changeIconCollapse(parentEl);

      const id = parentEl.id;
      const parentIndex = Number(id.replace(/\D/g, '')) - 1;
      const elList = document.querySelectorAll(`[${COLLAPSE_BY_ATTR}]`);

      const divCollapseIndexList: number[] = [];

      elList.forEach((el) => {
        const value = (el.getAttribute(COLLAPSE_BY_ATTR) ?? '').split(',').map(Number).map(lineId);
        if (value.includes(id)) {
          const elId = Number(el.id.replace(/\D/g, '')) - 1;
          divCollapseIndexList.push(elId);
        }
      });

      handleCollapse?.({ divParentIndex: parentIndex, divIndexList: divCollapseIndexList, isCollapse: !isCollapse });
    };

    const isOpenBracket = (() => {
      const reg = /[{[]/g;
      return reg.test(lineData);
    })();

    const isCloseBracket = (() => {
      const reg = /[}\]]/g;
      return reg.test(lineData);
    })();

    const changeIconCollapse = (el: HTMLDivElement) => {
      const input = el.querySelector('input');
      const isCollapse = el.getAttribute(IS_COLLAPSE) === 'true';
      if (input) {
        input.value = isCollapse ? '+' : '-';
      }
    };

    const generateBorderMarker = () => {
      if (!tabCount) return <></>;

      return (
        <>
          {Array(tabCount + 1)
            .fill(null)
            .reduce((Prev, _, index) => {
              return (
                <Box className={index === tabCount ? 'nested' : undefined} sx={classes('nested')}>
                  {Prev}
                </Box>
              );
            })}
        </>
      );
    };

    useEffect(() => {
      const el = lineRef.current;
      if (!el) return;
      el.setAttribute(IS_COLLAPSE, 'false');
      changeIconCollapse(el);

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
        {isOpenBracket && <input type="button" value="-" onClick={toggleCollapse} />}
        {generateBorderMarker()}
        <Box component={'pre'} sx={classes('preColor')}>
          {colorLine()}
        </Box>
      </Box>
    );
  },
);
