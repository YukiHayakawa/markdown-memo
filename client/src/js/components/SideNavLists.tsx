import * as React from 'react';
import ListSubheader from 'material-ui/List/ListSubheader';
import { IconButton } from 'material-ui';
import List, { ListItem } from 'material-ui/List';
import ListItemText from 'material-ui/List/ListItemText';
import ListItemIcon from 'material-ui/List/ListItemIcon';
import Collapse from 'material-ui/transitions/Collapse';
import { ArrowDropDown, CreateNewFolder, NoteAdd } from 'material-ui-icons';
import { Link } from 'react-router-dom';
import history from 'js/History';
import { IndexState, NavList } from 'js/reducers';

/**
 * SideNavListsの型定義
 * 
 * @interface Props
 */
interface Props {
  navList: IndexState['navList'];
  toggleNavFlg: IndexState['toggleNavFlg'];
  activeDir: IndexState['activeDir'];
  activeFile: IndexState['activeFile'];
  edit: IndexState['edit'];
  onToggleNavFlg: (e: React.MouseEvent<JSX.Element>) => void;
  onUpdateEdit: (obj: { beforeName?: string; type?: string; new: boolean; }) => any;
  onUpdateNavLists: (url: string, param: any) => any;
  onUpdateActiveDir: (e: any) => void;
  edirotFocus: () => void;
}
/**
 * SideNavListsコンポーネント
 * 
 * @class SideNavLists
 * @extends {React.Component<Props>}
 */
class SideNavLists extends React.Component<Props> {
  /**
   * inputエレメント
   * 
   * @type {HTMLInputElement}
   * @memberof SideNavLists
  */
  public input: HTMLInputElement;
  /**
   * ダブルクリックされた処理
   * 
   * @private
   * @memberof SideNavLists
   */
  private onEditName = (e: React.MouseEvent<HTMLDivElement>): void => {
    const beforeName = e.currentTarget['dataset']['path'];
    this.props.onUpdateEdit({
      beforeName,
      new: false,
    });
    setTimeout(():void => this.input.focus(), 400);
  }
  /**
   * Enterが押下されたとき
   * 
   * @private
   * @memberof SideNavLists
  */
  private onEnter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      this.props.edirotFocus();
    }
  }
  /**
   * 変更が終了した処理
   * 
   * @private
   * @memberof SideNavLists
   */
  private onEditEnd = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { onUpdateNavLists }: any = this.props;
    const type = e.currentTarget.dataset.type;
    const add = e.currentTarget.dataset.add;
    const ext = type === 'file' ? '.md' : '';
    const path = e.currentTarget.dataset.path + e.currentTarget.value + ext;
    console.log(type, add, e.currentTarget.dataset.name, path);
    if (add && e.currentTarget.value !== '') {
      if (type === 'file') {
        history.push(`?file=${e.currentTarget.dataset.path + e.currentTarget.value}`);
        onUpdateNavLists('updateFile/', { path });
      } else {
        onUpdateNavLists('addDir/', { path });
      }
    } else if (!add && path !== e.currentTarget.dataset.name) {
      if (type === 'file') {
        history.push(`?file=${e.currentTarget.dataset.path + e.currentTarget.value}`);
      }
      onUpdateNavLists('rename/', { before: e.currentTarget.dataset.name, after: path });
    }
    this.props.onUpdateEdit({
      beforeName: '',
      new: false,
    });
  }
  /**
   * ダブルクリックされた処理
   * 
   * @private
   * @memberof SideNavLists
   */
  private addItem = (e: React.MouseEvent<HTMLElement>): void => {
    const type = e.currentTarget['dataset']['type'];
    this.props.onUpdateEdit({
      type,
      new: true,
    });
    setTimeout(() => this.input.focus(), 400);
  }
  /**
   * Render関数
   * 
   * @returns {JSX.Element} 
   * @memberof SideNavLists
   */
  public render(): JSX.Element {
    const {
      navList, toggleNavFlg, activeDir,
      activeFile, onUpdateActiveDir, onToggleNavFlg, edit,
    }: Props = this.props;
    /**
     * パスを編集
     * 
     * @param {string} path 
     * @param {string} type 
     * @returns {string} 
     */
    const getEditPath = (path: string, type: string): string => {
      const pathArray = path.split('/');
      pathArray.pop();
      if (type === 'dir') pathArray.pop();
      return `${pathArray.join('/')}/`;
    };
    /**
     * ナビリストのコンポネント作成
     * 
     * @param {IndexState['navList']} lists 
     * @param {string} path 
     * @returns {JSX.Element[]} 
     */
    const showLists = (lists: IndexState['navList'], path: string): JSX.Element[] => {
      const result = lists.map((list: NavList): JSX.Element => {
        const resList = list.dir ? (
          <div key={list.dir.path} className="listBlock">
            <ListItem
              {...{ component: 'div' } as any}
              onClick={onUpdateActiveDir}
              onDoubleClick={this.onEditName}
              className={`dir${activeDir === list.dir.path ? ' active' : ''}`}
              button={!(edit.beforeName === list.dir.path)}
              data-path={list.dir.path}
            >
            <ListItemIcon
              {...{ component: 'div' } as any}
              onClick={onToggleNavFlg}
              className={`listIcon${toggleNavFlg[list.dir.path] ? '' : ' close'}`}
              data-path={list.dir.path}
            >
              <ArrowDropDown/>
            </ListItemIcon>
            {edit.beforeName === list.dir.path ?
              <input
                ref={(input: HTMLInputElement): void => { this.input = input; }}
                type="text"
                placeholder="Enter directory name"
                defaultValue={list.dir.name}
                data-path={getEditPath(list.dir.path, 'dir')}
                data-type={'dir'}
                data-name={list.dir.path}
                className="editItem"
                onBlur={this.onEditEnd}
                onKeyPress={this.onEnter}  
              />
              :
              <ListItemText className="dirText" secondary={list.dir.name} />
            }
            </ListItem>
            <Collapse in={toggleNavFlg[list.dir.path]} timeout="auto" unmountOnExit={true}>
              {showLists(list.dir.child, list.dir.path)}
            </Collapse>
          </div>
        ) : (
          <ListItem
            key={list.path}
            {...{ key: list.path } as any}
            to={`/?file=${list.path.replace(/^(.+?)\.md$/, '$1')}`}
            component={Link}
            onDoubleClick={this.onEditName}
            disableGutters={edit.beforeName !== list.path}
            className={`listFile list${activeFile === list.path ?
              ' active' : ''}${edit.beforeName === list.path ? ' isEdit' : ''}`}
            button={edit.beforeName !== list.path}
            data-path={list.path}
          >
            {edit.beforeName === list.path ?
              <input
                ref={(input: HTMLInputElement): void => { this.input = input; }}
                type="text"
                placeholder="Enter file name"
                defaultValue={list.name}
                className="editItem"
                data-path={getEditPath(list.path, 'file')}
                data-name={list.path}
                data-type={'file'}
                onBlur={this.onEditEnd}
                onKeyPress={this.onEnter}  
              />
              :
              <ListItemText className="listFileText" secondary={list.name} />
            }
          </ListItem>
        );
        return resList;
      });
      if (edit.new && activeDir === path) {
        result.unshift(((): JSX.Element => (
          <ListItem key={edit.type} className="listFile list">
            <input
              ref={(input: HTMLInputElement): void => { this.input = input; }}
              type="text"
              placeholder={`Enter ${edit.type} name`}
              defaultValue=""
              className="editItem"
              data-path={path}
              data-type={edit.type}
              data-add={'add'}
              onBlur={this.onEditEnd}
              onKeyPress={this.onEnter}  
            />
          </ListItem>
        ))());
      }
      return result;
    };
    return (
      <List
        {...{ component: 'nav' } as any}
        className="sideNavLists"
      >
        <div className="listHeader">
          <ListSubheader className="listHeaderLabel" component="div" disableSticky={true}>
            Item Lists
          </ListSubheader>
          <IconButton
            className="listHeaderIcon"
            onClick={this.addItem}
            data-type="dir"
          >
            <CreateNewFolder />
          </IconButton>
          <IconButton
            className="listHeaderIcon"
            onClick={this.addItem}
            data-type="file"
          >
            <NoteAdd />
          </IconButton>
        </div>
        {showLists(navList, '')}
      </List>
    );
  }
}

export default SideNavLists;
