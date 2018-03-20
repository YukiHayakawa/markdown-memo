import * as React from 'react';

/**
 * NotFileのコンポーネント
 * 
 * @returns {JSX.Element} 
 */
const notfile = (): JSX.Element => {
  return (
    <div className="main">
      <p className="notfile-text">I can not find the markdown file.</p>
    </div>
  );
};
export default notfile;
