declare module '@mui/material/styles' {
  interface Palette {
    white: Palette['primary'];
    jsonViewerColors: {
      lineHover: Palette['primary'];
      key: Palette['primary'];
      bracket: Palette['primary'];
      normal: Palette['primary'];
      string: Palette['primary'];
      link: Palette['primary'];
      number: Palette['primary'];
      boolean: Palette['primary'];
    };
  }

  interface PaletteOptions {
    white: PaletteOptions['primary'];
    jsonViewerColors: {
      lineHover: PaletteOptions['primary'];
      key: PaletteOptions['primary'];
      bracket: PaletteOptions['primary'];
      normal: PaletteOptions['primary'];
      string: PaletteOptions['primary'];
      link: PaletteOptions['primary'];
      number: PaletteOptions['primary'];
      boolean: PaletteOptions['primary'];
    };
  }

  interface TypeBackground {
    dark: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    white: true;
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    white: true;
  }
}

declare module '@mui/material/CircularProgress' {
  interface CircularProgressPropsColorOverrides {
    white: true;
  }
}

export {};
