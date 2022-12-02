import { createComponentContext, addDefaultProps } from '@edsolater/uikit'
export type ThemeProviderProps = {
  colors?: {
    white: '#fff'
  }
}

export const [ThemeProvider, useTheme] = createComponentContext<ThemeProviderProps>()

const lightTheme: ThemeProviderProps = {
  colors: {
    white: '#fff'
  }
}

export const LightThemeProvider = addDefaultProps(ThemeProvider, lightTheme)
