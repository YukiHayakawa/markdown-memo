import * as React from 'react';
/**
 * 設定ファイル
 * 
 * @interface Config
 */
interface Config {
  name: string;
}
declare const CONFIG: Config;
const { name }: Config = CONFIG;
/**
 * Homeのコンポーネント
 * 
 * @returns {JSX.Element} 
 */
const home = (): JSX.Element => {
  return (
    <div className="main">
      <div className="home">
        <h1>{name}</h1>  
        <p>{name} app</p>
        <p><img src="/assets/img/demo.gif" /></p>
      </div>
    </div>
  );
};
export default home;
