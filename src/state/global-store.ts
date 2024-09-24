import { createStore } from 'redux';
import { Provider } from 'react-redux';

const initialState = {
  user: null,
  settings: {},
};

function globalReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    default:
      return state;
  }
}

export const globalStore = createStore(globalReducer);

export const GlobalStoreProvider: React.FC = ({ children }) => (
  <Provider store={globalStore}>{children}</Provider>
);
