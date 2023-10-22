import { CSSProperties, Fragment, MouseEvent, useState } from 'react';
import { Box, Tooltip } from '@mui/material';
import { useJsonLinesStyles } from './styles.ts';
import { useJsonFeatureProvider } from '../../../hooks/useJsonFeatureProvider.ts';

export interface HandleCollapseParam {
  divParentIndex: number;
  isCollapse: boolean;
}

interface JsonLineProps {
  lineNumber: number;
  lineData: string;
  totalLine: number;
  handleCollapse?: (param: HandleCollapseParam) => void;
  isCollapse: boolean;
  disableCollapse: boolean;
  style: CSSProperties;
}

export const JsonLine = ({
  lineNumber,
  lineData,
  totalLine,
  handleCollapse,
  isCollapse: isCol,
  disableCollapse,
  style,
}: JsonLineProps) => {
  const { tabSize, wordSearchPosition, wordSearch, isCaseSensitive, currentIndexWordMarked } = useJsonFeatureProvider();
  const classes = useJsonLinesStyles({ totalLine, tabSize });

  const [isCollapse, setIsCollapse] = useState(isCol);

  const lineId = (lineNumber: number) => `json-line-${lineNumber}`;

  const tabCount = lineData.match(/\t/g)?.length ?? 0;

  const colorLine = () => {
    const keyBracket = /(".+":) ({|\[)/; // "name": {
    const brackets = /^\s*({|}|]|\[),?/; // \t [
    const numberValue = /^\s*(".+":)\s([0-9.]+)(?=,?)/; // "age": 4
    const stringValue = /^\s*(".+":)\s(.+)(?=,?)/; // "name": "Ale"
    const booleanValue = /^\s*(".+":)\s(true|false|null|undefined)(?=,?)/; // "isOk": true

    lineData = lineData.replace(/\t/g, '');

    const hasComma = lineData.endsWith(',');
    const hasMarker = !!wordSearchPosition.positions[lineNumber - 1];

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

    let markerLineIndex = 0;
    const markText = (text: string) => {
      if (!hasMarker) return text;
      const regex = new RegExp(`${wordSearch}`, isCaseSensitive ? 'g' : 'gi');
      const markIndex = wordSearchPosition.positions[lineNumber - 1].findIndex((i) => currentIndexWordMarked === i);

      text = text.replace(regex, (value) => {
        let className = null;
        if (markerLineIndex++ === markIndex) className = 'marked';
        return `<mark class=${className}>${value}</mark>`;
      });

      return <span dangerouslySetInnerHTML={{ __html: text }} />;
    };

    return (
      <>
        {'\t'.repeat(tabCount)}
        {color.map(([className, text], i) => {
          if (text.includes(':')) text += ' ';
          return (
            <span key={String(i)} className={className}>
              {markText(text)}
            </span>
          );
        })}
      </>
    );
  };

  const toggleCollapse = (ev: MouseEvent<HTMLInputElement>) => {
    const parentEl = ev.currentTarget.parentElement as HTMLDivElement;

    setIsCollapse((prev) => !prev);
    const id = parentEl.id;
    const parentIndex = Number(id.replace(/\D/g, '')) - 1;

    handleCollapse?.({ divParentIndex: parentIndex, isCollapse: !isCollapse });
  };

  const isOpenBracket = (() => {
    const reg = /[{[]/g;
    return reg.test(lineData);
  })();

  const generateBorderMarker = () => {
    if (!tabCount) return <></>;
    return (
      <>
        {Array(tabCount)
          .fill('')
          .reduce(
            (Prev, _, index) => {
              return (
                <Box className={index + 1 === tabCount ? 'nested' : undefined} sx={classes('nested')}>
                  {Prev}
                </Box>
              );
            },
            <Fragment />,
          )}
      </>
    );
  };

  return (
    <Box id={lineId(lineNumber)} sx={classes('line')} style={style}>
      <Box sx={classes('lineCount')}>
        <p>{lineNumber}</p>
      </Box>
      {isOpenBracket && (
        <Tooltip title={disableCollapse ? 'Disabled because have many line to collapse' : ''} placement={'right'} arrow>
          <input type="button" disabled={disableCollapse} value={isCollapse ? '+' : '-'} onClick={toggleCollapse} />
        </Tooltip>
      )}
      {generateBorderMarker()}
      <Box component={'pre'} sx={classes('preColor')}>
        {colorLine()}
      </Box>
    </Box>
  );
};
