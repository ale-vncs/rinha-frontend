import { makeSx } from '../../../utils/makeSx.ts';
import { grey } from '@mui/material/colors';

export interface StyleProps {
  totalLine: number;
  tabSize: number;
}

export const useJsonLinesStyles = makeSx((theme, props: StyleProps) => {
  const lineCountMargin = '20px';
  const lineHeight = 20;
  const { totalLine, tabSize } = props;
  const totalLineSpace = String(totalLine).length;
  const fontSize = '0.65rem';

  return {
    line: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      position: 'relative',
      whiteSpace: 'nowrap',
      width: '100%',
      height: lineHeight,
      fontSize: '1rem',
      overflowY: 'clip',
      '&:hover': {
        background: 'rgba(83, 169, 255, 0.1)',
      },
      '& pre': {
        tabSize,
        margin: 0,
      },
      '& .marked': {
        background: 'aqua',
      },
      '& > div': {
        userSelect: 'none',
      },
      '& > .nested': {
        left: `calc(20px + ${lineCountMargin} + (8px * ${totalLineSpace})) !important`,
      },
      "& input[type='button']": {
        width: `calc(${lineHeight}px - 6px)`,
        height: `calc(${lineHeight}px - 6px)`,
        lineHeight: 0.6,
        fontSize: fontSize,
        textAlign: 'center',
        border: '1px solid #dcdcdc',
        borderRadius: '2px',
        position: 'absolute',
        left: `calc(8px * ${totalLineSpace} + ${lineCountMargin})`,
        cursor: 'pointer',
        top: 0,
        bottom: 0,
        padding: 0,
        margin: 'auto 0',
      },
      '&:.line-collapse': {
        height: 0,
        overflow: 'hidden',
      },
    },
    lineCount: {
      fontSize: fontSize,
      fontFamily: theme.typography.fontFamily,
      color: grey['500'],
      textAlign: 'center',
      marginRight: lineCountMargin,
      alignSelf: 'stretch',
      borderRight: '2px solid #c6c6c6',
      display: 'inline-flex',
      alignItems: 'center',
      '& > p': {
        margin: 0,
        mx: 1,
        textAlign: 'right',
        width: `calc(8px * ${totalLineSpace})`,
        boxSizing: 'content-box',
      },
    },
    nested: {
      borderLeft: '2px solid rgb(0, 0, 0, 0.05)',
      position: 'absolute',
      left: `calc(10px * ${tabSize} - ${tabSize * 1.48}px)`,
      height: '100%',
    },
    preColor: {
      fontFamily: 'monospace',
      '& > .color-bracket': {
        color: '#afafaf',
      },
      '& > .color-normal': {
        color: grey['600'],
      },
      '& > .color-key': {
        color: '#da6972',
      },
      '& > .color-string': {
        color: '#8dbd6d',
      },
      '& > .color-number': {
        color: '#e468cc',
      },
      '& > .color-boolean': {
        color: '#d88f6d',
      },
    },
  };
});
