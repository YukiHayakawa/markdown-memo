import * as React from 'react';
import { updateNavFlg, updateActiveDir, updateEdit, updateNavLists } from 'js/actions';
import SideNavLists from 'js/components/SideNavLists';
import { IndexState } from 'js/reducers';

/**
 * SideNavの型定義
 * 
 * @interface Props
 */
interface Props {
  dispatch: any;
  item: IndexState;
  edirotFocus: () => void;
}
/**
 * SideNavコンポーネント
 * 
 * @export
 * @class SideNav
 * @extends {React.Component<Props, {}>}
 */
export default class SideNav extends React.Component<Props, {}> {
  /**
   * Render関数
   * 
   * @returns {JSX.Element} 
   * @memberof SideNav
   */
  public render(): JSX.Element {
    const {
      navList, toggleNavFlg, activeDir, activeFile, edit,
    }: IndexState = this.props.item;
    const { dispatch, edirotFocus }: Props = this.props;
    const onUpdateActiveDir = (e: React.MouseEvent<JSX.Element>): void => {
      const path: string = e.currentTarget['dataset']['path'];
      dispatch(updateActiveDir(path));
    };
    const onUpdateNavLists = (url: string, param: any): void => {
      dispatch(updateNavLists(url, param));
    };
    const onToggleNavFlg = (e: React.MouseEvent<JSX.Element>): void => {
      const key = e.currentTarget['dataset']['path'];
      dispatch(updateNavFlg({
        [key]: !toggleNavFlg[key],
      }));
    };
    const onUpdateEdit = (obj: any): void => {
      dispatch(updateEdit(obj));
    };
    return (
      <div className="sideNav">
        <SideNavLists
          edirotFocus={edirotFocus}
          navList={navList}
          toggleNavFlg={toggleNavFlg}
          onToggleNavFlg={onToggleNavFlg}
          activeDir={activeDir}
          activeFile={activeFile}
          onUpdateActiveDir={onUpdateActiveDir}
          edit={edit}
          onUpdateEdit={onUpdateEdit}
          onUpdateNavLists={onUpdateNavLists}
        />
      </div>
    );
  }
}
