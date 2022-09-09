import React, { useEffect, useState, useMemo } from 'react';
import { PaletteMode } from '@mui/material';

import { lightTheme, darkTheme } from './themes';
import { ThemeOptions } from '@mui/material/styles';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles';

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  ...(mode === 'light' ? lightTheme : darkTheme),
});

export const ColorModeContext = React.createContext<{
  toggleColorMode?: () => void;
}>({});

const getColorModeFromLocalStorage = () => {
  const localStorageMode = localStorage.getItem('colorMode');
  if (localStorageMode) return JSON.parse(localStorageMode);
  return 'dark';
};

export const ThemeProvider = (props: { children: React.ReactChild }) => {
  const [mode, setMode] = useState<PaletteMode>(getColorModeFromLocalStorage()); // light or dark default mode is light

  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
    }),
    [],
  );

  useEffect(() => {
    localStorage.setItem('colorMode', JSON.stringify(mode));
  }, [mode]);

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        {React.Children.only(props.children)}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};
