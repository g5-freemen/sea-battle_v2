import { combineReducers, configureStore } from '@reduxjs/toolkit';
import globalReducer from './reducers/globalReducer';

const rootReducer = combineReducers({ globalReducer });

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
