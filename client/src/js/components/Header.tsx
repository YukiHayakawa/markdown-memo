import * as React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Paper } from 'material-ui';
import Tooltip from 'material-ui/Tooltip';
import Input, { InputAdornment } from 'material-ui/Input';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemText from 'material-ui/List/ListItemText';
import { Search, Menu, ChromeReaderMode } from 'material-ui-icons';
import { SuggestState } from 'js/reducers/suggest';
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
 * Headerの型定義
 * 
 * @interface Props
 */
interface Props {
  onToggleSideNav: () => void;
  onToggleMainView: () => void;
  onToggleFocus: (val: boolean) => void;
  onGetSuggestLists: (keyword: string) => void;
  suggest: SuggestState;
}
/**
 * SuggestListsの型定義
 * 
 * @interface SuggestLists
 */
interface SuggestLists {
  matches: string[];
  count: number;
  line: string[];
  path: string;
}
/**
 * Headerコンポーネント
 * 
 * @class Header
 * @extends {React.Component<Props, {}>}
 */
class Header extends React.Component<Props, {}> {
  /**
   * フォーカスを切り替え
   * 
   * @private
   * @memberof Header
   */
  private onToggleFocus = (): void => this.props.onToggleFocus(true);
  /**
   * フォーカスが外れた時の処理
   * 
   * @private
   * @memberof Header
   */
  private onToggleBlur = (): void => this.props.onToggleFocus(false);
  /**
   * サジェストの情報を取得
   * 
   * @private
   * @memberof Header
   */
  private onGetSuggestLists = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.props.onGetSuggestLists(e.currentTarget.value)
  /**
   * Render関数
   * 
   * @returns {JSX.Element} 
   * @memberof Header
   */
  public render(): JSX.Element {
    const { onToggleSideNav, onToggleMainView, onToggleFocus, onGetSuggestLists, suggest }: Props = this.props;
    const { focusFlg, suggestLists }: SuggestState = suggest;
    return (
      <div className="header">
        <AppBar className="nav">
          <Toolbar className="toolBar" >
            <IconButton className="menu headerIcon" onClick={onToggleSideNav}>
              <Tooltip title="Toggle Menu" placement="bottom">
                <Menu />
              </Tooltip>
            </IconButton>
            <IconButton className="logoBox">
              <Link to="/" href="/" className="logo">{name}</Link>
            </IconButton>
            <div className="searchBox">
              <div className="searchInputBox">
                <Input
                  className="searchInput"
                  onChange={this.onGetSuggestLists}
                  onFocus={this.onToggleFocus}
                  onBlur={this.onToggleBlur}
                  startAdornment={<InputAdornment position="start"><Search className="searchIcon" /></InputAdornment>}
                />
                {focusFlg && suggestLists.length > 0 &&
                  <Paper className="suggest">
                    <List>
                      {suggestLists.map((lists: SuggestLists): JSX.Element => (
                        <ListItem
                          component={Link}
                          to={`/?file=${lists.path.replace(/^(.+?)\.md$/, '$1')}`}
                          {...{ key: lists.path } as any}
                        >
                          <ListItemText primary={lists.path} secondary={lists.line.join('\n')} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                }
              </div>
            </div>
            <IconButton className="headerIcon" onClick={onToggleMainView}>
              <Tooltip title="Toggle View" placement="bottom">
                <ChromeReaderMode />
              </Tooltip>
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;
