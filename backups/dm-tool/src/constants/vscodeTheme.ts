// VS Code Native Color Scheme for Syntax Highlighting
// Based on VS Code's default Dark+ and Light+ themes

export interface VSCodeTheme {
  background: string;
  foreground: string;
  lineNumber: string;
  lineNumberActive: string;
  selection: string;
  comment: string;
  keyword: string;
  string: string;
  number: string;
  function: string;
  operator: string;
  punctuation: string;
  type: string;
  variable: string;
  property: string;
  constant: string;
}

// VS Code Dark+ Theme
export const VSCODE_DARK_THEME: VSCodeTheme = {
  background: '#1e1e1e',
  foreground: '#d4d4d4',
  lineNumber: '#858585',
  lineNumberActive: '#c6c6c6',
  selection: '#264f78',
  comment: '#6a9955',
  keyword: '#569cd6',
  string: '#ce9178',
  number: '#b5cea8',
  function: '#dcdcaa',
  operator: '#d4d4d4',
  punctuation: '#d4d4d4',
  type: '#4ec9b0',
  variable: '#9cdcfe',
  property: '#9cdcfe',
  constant: '#4fc1ff',
};

// VS Code Light+ Theme
export const VSCODE_LIGHT_THEME: VSCodeTheme = {
  background: '#ffffff',
  foreground: '#000000',
  lineNumber: '#237893',
  lineNumberActive: '#0b216f',
  selection: '#add6ff',
  comment: '#008000',
  keyword: '#0000ff',
  string: '#a31515',
  number: '#098658',
  function: '#795e26',
  operator: '#000000',
  punctuation: '#000000',
  type: '#267f99',
  variable: '#001080',
  property: '#001080',
  constant: '#0070c1',
};

// VS Code Gray Variant (for dark mode)
export const VSCODE_GRAY_THEME: VSCodeTheme = {
  background: '#1e1e1e',
  foreground: '#cccccc',
  lineNumber: '#858585',
  lineNumberActive: '#c6c6c6',
  selection: '#264f78',
  comment: '#608b4e',
  keyword: '#569cd6',
  string: '#ce9178',
  number: '#b5cea8',
  function: '#dcdcaa',
  operator: '#cccccc',
  punctuation: '#cccccc',
  type: '#4ec9b0',
  variable: '#9cdcfe',
  property: '#9cdcfe',
  constant: '#4fc1ff',
};

export function getVSCodeTheme(isDark: boolean, variant: 'slate' | 'vscode-gray' = 'slate'): VSCodeTheme {
  if (isDark) {
    return variant === 'vscode-gray' ? VSCODE_GRAY_THEME : VSCODE_DARK_THEME;
  }
  return VSCODE_LIGHT_THEME;
}
