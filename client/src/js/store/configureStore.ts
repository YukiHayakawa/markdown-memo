import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from 'js/reducers';

export default function configureStore(initialState: any, history: any): any {
  const middleware = [routerMiddleware(history), thunk];
  if (process.env.NODE_ENV === 'development') {
    middleware.push(logger);
  }
  const store = createStore(
    reducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      typeof window === 'object' && typeof window['devToolsExtension'] !== 'undefined' ?
        window['devToolsExtension']() : (f: any): any => f,
    ),
  );
  return store;
}
