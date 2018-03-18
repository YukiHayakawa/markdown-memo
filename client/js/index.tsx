import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import configureStore from './store/configureStore';
import Router from './Router';
import History from './History';

// store
const store = configureStore({}, History);

render(
  <Provider store={store}>
    <ConnectedRouter history={History}>
      <Router />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app'),
);
