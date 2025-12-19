import React, { useRef, useEffect } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

interface SearchOverlayProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  currentMatch: number;
  totalMatches: number;
  onNextMatch: () => void;
  onPrevMatch: () => void;
  onClose: () => void;
  caseSensitive: boolean;
  onToggleCaseSensitive: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  searchText,
  onSearchChange,
  currentMatch,
  totalMatches,
  onNextMatch,
  onPrevMatch,
  onClose,
  caseSensitive,
  onToggleCaseSensitive,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the search input when overlay opens
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        onPrevMatch();
      } else {
        onNextMatch();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="search-overlay">
      <div className="search-overlay-icon">
        <Search size={16} />
      </div>

      <input
        ref={inputRef}
        type="text"
        className="search-overlay-input"
        placeholder="Find in script..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {searchText && (
        <div className="search-overlay-counter">
          {totalMatches > 0 ? `${currentMatch + 1}/${totalMatches}` : '0/0'}
        </div>
      )}

      <button
        className="search-overlay-button"
        onClick={onToggleCaseSensitive}
        title={caseSensitive ? 'Match Case (On)' : 'Match Case (Off)'}
        disabled={!searchText}
        data-active={caseSensitive}
      >
        Aa
      </button>

      <button
        className="search-overlay-button"
        onClick={onPrevMatch}
        disabled={!searchText || totalMatches === 0}
        title="Previous Match (Shift+Enter)"
      >
        <ChevronUp size={16} />
      </button>

      <button
        className="search-overlay-button"
        onClick={onNextMatch}
        disabled={!searchText || totalMatches === 0}
        title="Next Match (Enter)"
      >
        <ChevronDown size={16} />
      </button>

      <button
        className="search-overlay-button search-overlay-close"
        onClick={onClose}
        title="Close (Escape)"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default SearchOverlay;
