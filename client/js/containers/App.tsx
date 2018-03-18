import 'babel-polyfill';
import * as React from 'react';
import { connect } from 'react-redux';
import { parse } from 'query-string';
import Header from 'js/components/Header';
import SideNav from 'js/components/SideNav';
import Main from 'js/containers/Main';
import Lading from 'js/components/Loading';
import { getNavLists } from 'js/actions';
import { navChange, mainChange } from 'js/actions/layout';
import { getText } from 'js/actions/editor';
import { toggleFocus, getSuggestLists } from 'js/actions/suggest';
import { LayoutState } from 'js/reducers/layout';
import { EditorsState } from 'js/reducers/editor';
import { IndexState } from 'js/reducers';
import { SuggestState } from 'js/reducers/suggest';
import Notfile from 'js/components/NotFile';
import Home from 'js/components/Home';
import 'css/style.css';
import 'css/markdown/github.css';

/**
 * Appの型定義
 * @interface
 */
interface Props {
  dispatch: any;
  location: any;
  editor: EditorsState;
  item: IndexState;
  layout: LayoutState;
  suggest: SuggestState;
}

/**
 * Appコンポーネント
 * 
 * @class App
 * @extends {React.Component<Props, {}>}
 */
class App extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.changeEditorText = this.changeEditorText.bind(this);
    this.edirotFocus = this.edirotFocus.bind(this);
  }
  /**
   * Draft.Editorを格納
   * 
   * @private
   * @type {Draft.Editor}
   * @memberof App
   */
  private draftEditor: Draft.Editor;
  /**
   * コンポーネントがマウントされた時
   * 
   * @memberof App
   */
  public componentDidMount(): void {
    const { dispatch, location }: Props = this.props;
    dispatch(getNavLists('/fileLists.json'));
    const query = parse(location.search);
    this.changeEditorText(query.file ? `${query.file}.md` : '');
  }
  /**
   * コンポーネントが新しいpropsを受け取ると実行
   * 
   * @param {Props} nextProps 
   * @memberof App
   */
  public componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.location.search !== this.props.location.search) {
      const query = parse(nextProps.location.search);
      this.changeEditorText(query.file ? `${query.file}.md` : '');
    }
  }
  /**
   * Draft.EditorをRefからApp.draftEditorへ格納
   * 
   * @private
   * @memberof App
   */
  private getRef = (draftEditor: Draft.Editor): void => { this.draftEditor = draftEditor; };
  private edirotFocus(): void {
    this.draftEditor && this.draftEditor.focus();
  }
  /**
   * エディタのステートを更新
   * 
   * @private
   * @param {string} fileName 
   * @memberof App
   */
  private changeEditorText(fileName: string): void {
    const { dispatch, editor }: Props = this.props;
    dispatch(getText(editor.editorState, fileName));
    this.edirotFocus();
  }
  /**
   * Render関数
   * 
   * @returns {JSX.Element} 
   * @memberof App
   */
  public render(): JSX.Element {
    const { dispatch, layout, location, suggest, item }: Props = this.props;
    const { sideNav, mainView }: LayoutState = layout;
    /**
     * フォーカスの切り替え
     * 
     * @param {boolean} focusFlg 
     */
    const onToggleFocus = (focusFlg: boolean): void => {
      setTimeout(() => dispatch(toggleFocus(focusFlg)), 200);
    };
    /**
     * サジェストの一覧を取得サジェストの一覧を取得
     * 
     * @param {string} keyword 
     */
    const onGetSuggestLists = (keyword: string): void => {
      dispatch(getSuggestLists(`/search/?keyword=${keyword}`));
      console.log(keyword);
    };
    /**
     * サイドナビの切り替え
     * 
     */
    const onToggleSideNav = (): void => {
      dispatch(navChange(!sideNav));
    };
    /**
     * メインビューの切り替え
     * 
     */
    const onToggleMainView = (): void => {
      const next = mainView === 2 ? 0 : mainView + 1;
      dispatch(mainChange(next));
    };
    const useMarkDownEditor = mainView === 0 || mainView === 1;
    const usePreview: boolean = mainView === 0 || mainView === 2;
    const query = parse(location.search);
    const mainArea = (): JSX.Element => {
      // if (item.loading) {
      //   return <Lading />;
      // }
      if (!query.file) {
        return <Home />;
      }
      if (item.activeFile === '') {
        return <Notfile />;
      }
      return <Main
        usePreview={usePreview}
        useMarkDownEditor={useMarkDownEditor}
        edirotFocus={this.edirotFocus}
        draftEditorRef={this.getRef}
        {...this.props}
      />;
    };
    return (
      <div>
        <Header
          onToggleSideNav={onToggleSideNav}
          onToggleMainView={onToggleMainView}
          onToggleFocus={onToggleFocus}
          onGetSuggestLists={onGetSuggestLists}
          suggest={suggest}
        />
        <div className="contents">
          {sideNav &&
            <SideNav {...this.props} edirotFocus={this.edirotFocus} />
          }
          {mainArea()}
        </div>
      </div>
    );
  }
}

export default connect((state: any): any => state)(App);
