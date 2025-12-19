import { useRef, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import { ScriptType } from '../types';
import { getVSCodeTheme } from '../constants/vscodeTheme';
import '../styles/codeEditor.css';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: ScriptType;
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: string;
  searchText?: string;
  searchMatches?: Array<{ start: number; end: number }>;
  currentMatchIndex?: number;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  isDarkTheme = false,
  darkThemeVariant = 'slate',
  placeholder,
  readOnly = false,
  minHeight = '300px',
  searchText = '',
  searchMatches = [],
  currentMatchIndex = 0
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const theme = getVSCodeTheme(isDarkTheme, darkThemeVariant);

  // Map script type to Prism language
  const getPrismLanguage = (type: ScriptType): string => {
    switch (type) {
      case 'postgresql':
      case 'oracle':
        return 'sql';
      case 'dbml':
        return 'javascript'; // DBML is similar to JS syntax
      default:
        return 'sql';
    }
  };

  const prismLanguage = getPrismLanguage(language);

  // Highlight function using Prism
  const highlight = (code: string): string => {
    try {
      return Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage);
    } catch (e) {
      console.error('Prism highlight error:', e);
      return code;
    }
  };

  // Apply theme colors dynamically
  useEffect(() => {
    if (containerRef.current) {
      const root = containerRef.current;
      root.style.setProperty('--vscode-bg', theme.background);
      root.style.setProperty('--vscode-fg', theme.foreground);
      root.style.setProperty('--vscode-selection', theme.selection);
      root.style.setProperty('--vscode-line-number', theme.lineNumber);
      root.style.setProperty('--vscode-line-number-active', theme.lineNumberActive);
      root.style.setProperty('--vscode-comment', theme.comment);
      root.style.setProperty('--vscode-keyword', theme.keyword);
      root.style.setProperty('--vscode-string', theme.string);
      root.style.setProperty('--vscode-number', theme.number);
      root.style.setProperty('--vscode-function', theme.function);
      root.style.setProperty('--vscode-operator', theme.operator);
      root.style.setProperty('--vscode-punctuation', theme.punctuation);
      root.style.setProperty('--vscode-type', theme.type);
      root.style.setProperty('--vscode-variable', theme.variable);
      root.style.setProperty('--vscode-property', theme.property);
      root.style.setProperty('--vscode-constant', theme.constant);
    }
  }, [theme]);

  // Apply search highlights using DOM manipulation
  useEffect(() => {
    if (!containerRef.current || !searchText || searchMatches.length === 0) {
      return;
    }

    const preElement = containerRef.current.querySelector('.code-editor-pre');
    if (!preElement) return;

    // Remove existing highlights
    const existingMarks = preElement.querySelectorAll('mark.search-highlight');
    existingMarks.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        parent.normalize();
      }
    });

    // Get the text content
    const textContent = preElement.textContent || '';

    // Create a tree walker to find text nodes
    const walker = document.createTreeWalker(
      preElement,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: { node: Text; offset: number }[] = [];
    let currentOffset = 0;

    let node;
    while ((node = walker.nextNode() as Text)) {
      textNodes.push({ node, offset: currentOffset });
      currentOffset += node.textContent?.length || 0;
    }

    // Apply highlights from end to start
    const sortedMatches = [...searchMatches].sort((a, b) => b.start - a.start);

    sortedMatches.forEach((match, index) => {
      const matchIndex = searchMatches.length - 1 - index;
      const isActive = matchIndex === currentMatchIndex;

      // Find which text node(s) contain this match
      for (let i = textNodes.length - 1; i >= 0; i--) {
        const { node, offset } = textNodes[i];
        const nodeEnd = offset + (node.textContent?.length || 0);

        if (match.start >= offset && match.start < nodeEnd) {
          const startInNode = match.start - offset;
          const endInNode = Math.min(match.end - offset, node.textContent?.length || 0);

          // Split the text node if needed
          if (endInNode < (node.textContent?.length || 0)) {
            node.splitText(endInNode);
          }

          if (startInNode > 0) {
            const remainingNode = node.splitText(startInNode);
            // Create mark element
            const mark = document.createElement('mark');
            mark.className = isActive ? 'search-highlight active' : 'search-highlight';
            mark.textContent = remainingNode.textContent;
            remainingNode.parentNode?.replaceChild(mark, remainingNode);
          } else {
            // Wrap the entire node
            const mark = document.createElement('mark');
            mark.className = isActive ? 'search-highlight active' : 'search-highlight';
            mark.textContent = node.textContent;
            node.parentNode?.replaceChild(mark, node);
          }

          break;
        }
      }
    });
  }, [searchText, searchMatches, currentMatchIndex]);

  // Scroll to current match
  useEffect(() => {
    if (searchMatches.length > 0 && containerRef.current) {
      // Wait for DOM update
      setTimeout(() => {
        const activeHighlight = containerRef.current?.querySelector('.search-highlight.active') as HTMLElement;
        if (activeHighlight) {
          activeHighlight.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 100);
    }
  }, [currentMatchIndex]);

  return (
    <div
      ref={containerRef}
      className="code-editor-container"
      style={{
        minHeight,
        background: theme.background,
        color: theme.foreground,
        border: `1px solid ${isDarkTheme ? '#3c3c3c' : '#d0d0d0'}`,
        borderRadius: '4px',
        overflow: 'auto'
      }}
    >
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={highlight}
        padding={12}
        placeholder={placeholder}
        disabled={readOnly}
        style={{
          fontFamily: "'Consolas', 'Courier New', monospace",
          fontSize: '13px',
          lineHeight: '1.6',
          minHeight,
          caretColor: theme.foreground,
        }}
        textareaClassName="code-editor-textarea"
        preClassName="code-editor-pre"
      />
    </div>
  );
}
