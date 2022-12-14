import { merge } from '@edsolater/fnkit'
import { createComponentContext } from '@edsolater/uikit'
import { defaultTheme } from './defaultTheme'
import React from '@edsolater/uikit/node_modules/.pnpm/@types+react@18.0.25/node_modules/@types/react' // temp type fix

type CSSColor = string

export type AppTheme = {
  colors: {
    navBarBg?: CSSColor
    sideBarBg?: CSSColor
  }
  component: {}
}

export const [ThemeProvider, , { useTheme , useThemeSetter}] = createComponentContext({ theme: defaultTheme })

export const createPredefinedTheme = (part: Partial<AppTheme>) => merge(defaultTheme, part)
