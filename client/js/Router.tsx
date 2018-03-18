import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';
import App from 'js/containers/App';
import Error from 'js/components/Error';
/**
 * Router
 * 
 * @returns {JSX.Element} 
 */
const router = (): JSX.Element => (
  <Switch>
    <Route exact={true} path="/" component={App} />
    <Route component={Error} />
  </Switch>
);
export default hot(module)(router);
