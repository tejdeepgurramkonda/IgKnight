import { useEffect } from 'react';

/**
 * Custom hook for keyboard navigation in the chess game
 * @param {Object} options - Configuration options
 * @param {Function} options.onArrowMove - Callback for arrow key moves (direction: 'up'|'down'|'left'|'right')
 * @param {Function} options.onEnter - Callback for Enter key
 * @param {Function} options.onEscape - Callback for Escape key
 * @param {Function} options.onUndo - Callback for Ctrl+Z
 * @param {Function} options.onRedo - Callback for Ctrl+Y or Ctrl+Shift+Z
 * @param {boolean} options.disabled - Whether keyboard navigation is disabled
 */
const useKeyboardNavigation = ({
  onArrowMove,
  onEnter,
  onEscape,
  onUndo,
  onRedo,
  disabled = false
} = {}) => {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          onArrowMove?.('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          onArrowMove?.('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onArrowMove?.('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          onArrowMove?.('right');
          break;
        case 'Enter':
          e.preventDefault();
          onEnter?.();
          break;
        case 'Escape':
          e.preventDefault();
          onEscape?.();
          break;
        case 'z':
        case 'Z':
          if (e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            onUndo?.();
          }
          break;
        case 'y':
        case 'Y':
          if (e.ctrlKey) {
            e.preventDefault();
            onRedo?.();
          }
          break;
        default:
          break;
      }

      // Ctrl+Shift+Z for redo (alternative)
      if (e.ctrlKey && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        onRedo?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onArrowMove, onEnter, onEscape, onUndo, onRedo, disabled]);
};

export default useKeyboardNavigation;
