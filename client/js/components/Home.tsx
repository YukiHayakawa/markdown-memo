import * as React from 'react';

/**
 * Homeのコンポーネント
 * 
 * @returns {JSX.Element} 
 */
const home = (): JSX.Element => {
  return (
    <div className="main">
      <div className="home">
        <h1>Markdown memo</h1>  
        <p>Markdown memo app</p>
        <p><img src="http://localhost:3030/assets/img/demo.gif" /></p>
      </div>
    </div>
  );
};
export default home;
