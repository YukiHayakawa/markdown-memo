import * as React from 'react';
import { Button } from 'material-ui';
import { Link } from 'react-router-dom';

/**
 * Errorのコンポーネント
 * 
 * @returns {JSX.Element} 
 */
const error = (): JSX.Element => {
  const linkItem = (props: any): JSX.Element => <Link {...props} to="/" />;
  return (
    <div className="error">
      <div className="header">
        <div className="nav">
          <h1>
            <Link className="logo" to="/">Markdown memo</Link>
          </h1>
        </div>
      </div>  
      <div className="icon">404</div>
      <p className="text">It looks like nothing was found at this location.</p>
      <Button className="button" size="large" variant="raised" component={linkItem}>Back to top</Button>
    </div>
  );
};
export default error;
