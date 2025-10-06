import { useState, useCallback } from 'react';

// A handy hook to toggle a boolean state.  Useful for modals, dropdowns,
// accordions, etc.  Returns the current state and a function to toggle it.
export function useToggle(initial: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

// A simple hook that provides access to the design tokens.  This can be
// extended in the future to support dynamic theming.
import { tokens } from '@tokens/index';
export function useTokens() {
  return tokens;
}
