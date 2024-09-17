import { useState } from 'react';

export const useHistory = (initialState: any) => {
  const [history, setHistory] = useState<any[]>([initialState]);
  const [pointer, setPointer] = useState(0);

  const addState = (state: any) => {
    const newHistory = history.slice(0, pointer + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setPointer(newHistory.length - 1);
  };

  const undo = () => {
    if (pointer > 0) {
      setPointer(pointer - 1);
    }
  };

  const redo = () => {
    if (pointer < history.length - 1) {
      setPointer(pointer + 1);
    }
  };

  const currentState = history[pointer];

  return { currentState, addState, undo, redo };
};
