import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  // Defina o estado inicial aqui
};

const StoreContext = createContext(initialState);

const storeReducer = (state, action) => {
  switch (action.type) {
    // Defina os casos do reducer aqui
    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
