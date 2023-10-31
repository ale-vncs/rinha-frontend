import { makeSx } from '@src/styles/makeSx';
import { alpha } from '@mui/material';

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

  const { jsonViewerColors } = theme.palette;

  return {
    line: (hasProblem: boolean) => ({
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
      background: hasProblem ? alpha(theme.palette.error.light, 0.08) : undefined,
      '&:hover': {
        background: jsonViewerColors.lineHover.main,
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
        background: theme.palette.grey[300],
      },
      '&:.line-collapse': {
        height: 0,
        overflow: 'hidden',
      },
    }),
    lineCount: {
      fontSize: fontSize,
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.secondary,
      textAlign: 'center',
      marginRight: lineCountMargin,
      alignSelf: 'stretch',
      borderRight: `2px solid ${theme.palette.text.secondary}`,
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
      borderLeft: `2px solid ${theme.palette.divider}`,
      position: 'absolute',
      left: `calc(${tabSize * 8.78}px - 2px)`,
      height: '100%',
    },
    preColor: {
      fontFamily: 'monospace',
      '& > .color-bracket': {
        color: jsonViewerColors.bracket.main,
      },
      '& > .color-normal': {
        color: jsonViewerColors.normal.main,
      },
      '& > .color-key': {
        color: jsonViewerColors.key.main,
      },
      '& > .color-string': {
        color: jsonViewerColors.string.main,
      },
      '& > .color-link': {
        color: jsonViewerColors.link.main,
      },
      '& > .color-number': {
        color: jsonViewerColors.number.main,
      },
      '& > .color-boolean': {
        color: jsonViewerColors.boolean.main,
      },
    },
  };
});
