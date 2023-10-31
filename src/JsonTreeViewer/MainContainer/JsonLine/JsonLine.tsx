import { CSSProperties, Fragment, MouseEvent, useState } from 'react';
import { Box, Tooltip } from '@mui/material';
import { useJsonLinesStyles } from './styles';
import { useJsonFeatureProvider } from '@hooks/useJsonFeatureProvider';

interface ColorLine {
  key: string;
  value: string;
  type: 'string' | 'number' | 'bracket' | 'boolean' | 'link';
  hasComma: boolean;
}

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
  isOpenBracket: boolean;
  style: CSSProperties;
}

export const JsonLine = ({
  lineNumber,
  lineData,
  totalLine,
  handleCollapse,
  isCollapse: isCol,
  disableCollapse,
  isOpenBracket,
  style,
}: JsonLineProps) => {
  const { tabSize, wordSearchPosition, wordSearch, isCaseSensitive, currentIndexWordMarked, jsonSelected } =
    useJsonFeatureProvider();
  const classes = useJsonLinesStyles({ totalLine, tabSize });

  const [isCollapse, setIsCollapse] = useState(isCol);

  const lineId = (lineNumber: number) => `json-line-${lineNumber}`;

  const tabCount = lineData.match(/\t/g)?.length ?? 0;
  const isLineProblem = jsonSelected.problem?.line === lineNumber;

  const colorLine = () => {
    const keyBracket = /"(.+)": ({|\[)/; // "name": {
    const brackets = /^\s*({|}|]|\[),?/; // \t [
    const numberValue = /^\s*"(.+)":\s([0-9.]+)(?=,?)/; // "age": 4
    const stringValue = /^\s*"(.+)":\s"(.*)"(?=,?)/; // "name": "Ale"
    const linkValue =
      /^\s*"(.+)":\s"([(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))"(?=,?)/; // "link": "https:..."
    const booleanValue = /^\s*"(.+)":\s(true|false|null|undefined)(?=,?)/; // "isOk": true

    lineData = lineData.replace(/\t/g, '');

    const hasComma = lineData.endsWith(',');
    const hasMarker = !!wordSearchPosition.positions[lineNumber - 1];

    const colorLine: ColorLine = {} as never;

    if (hasComma) {
      lineData = lineData.substring(0, lineData.length - 1);
    }

    const setLineColor = (value: string, type: ColorLine['type'], key?: string) => {
      colorLine.type = type;
      colorLine.value = value;
      colorLine.key = key ?? '';
      colorLine.hasComma = hasComma;
    };

    const buildLineWhenCollapse = (bracket: string) => {
      if (!isCollapse) return bracket;
      const invertBracket: Record<string, string> = {
        '{': '}',
        '[': ']',
      };
      return bracket + '...' + invertBracket[bracket];
    };

    if (brackets.test(lineData)) {
      setLineColor(buildLineWhenCollapse(lineData), 'bracket');
    } else if (keyBracket.test(lineData)) {
      const [, key, bracket] = keyBracket.exec(lineData) as RegExpExecArray;
      setLineColor(buildLineWhenCollapse(bracket), 'bracket', key);
    } else if (numberValue.test(lineData)) {
      const [, key, number] = numberValue.exec(lineData) as RegExpExecArray;
      setLineColor(number, 'number', key);
    } else if (booleanValue.test(lineData)) {
      const [, key, boolean] = booleanValue.exec(lineData) as RegExpExecArray;
      setLineColor(boolean, 'boolean', key);
    } else if (linkValue.test(lineData)) {
      const [, key, string] = linkValue.exec(lineData) as RegExpExecArray;
      setLineColor(string, 'link', key);
    } else if (stringValue.test(lineData)) {
      const [, key, string] = stringValue.exec(lineData) as RegExpExecArray;
      setLineColor(string, 'string', key);
    } else {
      let c: ColorLine['type'] = 'boolean';
      if (/".*"/.test(lineData)) {
        c = 'string';
        lineData = lineData.replace(/"/g, '');
      }
      if (/[0-9]+/.test(lineData)) c = 'number';
      setLineColor(lineData, c);
    }

    let markerLineIndex = 0;
    const markText = (text: string) => {
      if (!hasMarker) return text;
      const wordSearchAd = wordSearch.replace(/([+*?^$\\.[\]{}()|/])/g, '\\$1');
      const regex = new RegExp(`${wordSearchAd}`, isCaseSensitive ? 'g' : 'gi');
      const markIndex = wordSearchPosition.positions[lineNumber - 1].findIndex((i) => currentIndexWordMarked === i);

      text = text.replace(regex, (value) => {
        let className = '';
        if (markerLineIndex++ === markIndex) className = 'marked';
        return `<mark class=${className}>${value}</mark>`;
      });

      return text;
    };

    const classNameByType = () => {
      return `color-${colorLine.type}`;
    };

    const valueByType = () => {
      const { type, value } = colorLine;
      if (type === 'string') return markText(`"${value}"`);
      if (type === 'link') return `"<a style='color: inherit' target='_blank' href='${value}'>${markText(value)}</a>"`;
      return markText(value);
    };

    const { key } = colorLine;

    return (
      <>
        {'\t'.repeat(tabCount)}
        {!!key && <span className={'color-key'} dangerouslySetInnerHTML={{ __html: markText(`"${key}": `) }} />}
        <span className={classNameByType()} dangerouslySetInnerHTML={{ __html: valueByType() }} />
        {hasComma && <span className={'color-bracket'} dangerouslySetInnerHTML={{ __html: markText(',') }} />}
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
    <Box id={lineId(lineNumber)} sx={classes('line', isLineProblem)} style={style}>
      <Box sx={classes('lineCount')}>
        <p>{lineNumber}</p>
      </Box>
      {isOpenBracket && (
        <Tooltip title={disableCollapse ? 'Disabled because have many line to collapse' : ''} placement={'right'} arrow>
          <input
            type="button"
            disabled={disableCollapse || jsonSelected.status === 'LOADING'}
            value={isCollapse ? '+' : '-'}
            onClick={toggleCollapse}
          />
        </Tooltip>
      )}
      {generateBorderMarker()}
      <Box component={'pre'} sx={classes('preColor')}>
        {colorLine()}
      </Box>
    </Box>
  );
};
