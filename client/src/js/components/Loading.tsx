import * as React from 'react';
import { CircularProgress } from 'material-ui/Progress';

/**
 * Ladingのコンポーネント
 * 
 * @returns {JSX.Element} 
 */
const lading = (): JSX.Element => {
  return (
    <div className="main">
      <CircularProgress thickness={5} className="loading" size={50} />
    </div>
  );
};
export default lading;
