import * as React from 'react';
import { connect } from 'react-redux';
import * as marked from 'marked';
import {
  changeMarkDown,
  insertNewLine,
  addNewLineText,
  getMarkdownText,
  getText,
} from 'js/draft/markdown';
import { updateNavLists } from 'js/actions';
import { editorChange } from 'js/actions/editor';
import MarkDownEditorNav from 'js/components/MarkDownEditorNav';
import MarkDownEditor from 'js/components/MarkdownEditor';
import { EditorsState } from 'js/reducers/editor';
import { IndexState } from 'js/reducers';
/**
 * Mainの型定義
 * 
 * @interface Props
 */
interface Props {
  useMarkDownEditor: boolean;
  usePreview: boolean;
  edirotFocus: () => void;
  draftEditorRef: (val: Draft.Editor) => void;
  dispatch: any;
  editor: EditorsState;
  item: IndexState;
}
/**
 * Mainコンポーネント
 * 
 * @class Main
 * @extends {React.Component<Props>}
 */
class Main extends React.Component<Props> {
  /**
   * Render関数
   * 
   * @returns {JSX.Element} 
   * @memberof Main
   */
  public render(): JSX.Element {
    const {
      useMarkDownEditor,
      usePreview,
      edirotFocus,
      draftEditorRef,
      dispatch,
      editor,
      item,
    }: Props = this.props;
    const { activeFile, loading }: IndexState = item;
    const { editorState }: EditorsState = editor;
    /**
     * テキストを保存
     * 
     * @param {Draft.EditorState} e 
     */
    const onTextSave = (e: Draft.EditorState): void => {
      if (activeFile && activeFile !== '' && loading === false) {
        dispatch(updateNavLists('updateFile/', { path: activeFile, text: getText(e) }));
      }
    };
    /**
     * エディタを更新
     * 
     * @param {Draft.EditorState} e 
     */
    const onEditorChange = (e: Draft.EditorState): void => {
      dispatch(editorChange(e));
    };
    /**
     * markdownスタイルを切り替え
     * 
     * @param {Draft.EditorState} e 
     * @param {string} style 
     * @param {string} flg 
     */
    const toggleMarkdownStyle = (e: Draft.EditorState, style: string, flg: string): void => {
      dispatch(editorChange(changeMarkDown(e, style, flg)));
      setTimeout(() => { edirotFocus(); }, 400);
    };
    /**
     * markdownスタイルを挿入
     * 
     * @param {Draft.EditorState} es 
     */
    const insertDraftMarkdown = (es: Draft.EditorState): void => {
      const { newEditorState, beforeText, flg }:
        { newEditorState: Draft.EditorState, beforeText: string, flg: boolean } = insertNewLine(es);
      dispatch(editorChange(newEditorState));
      if (flg) {
        dispatch(editorChange(addNewLineText(newEditorState, beforeText)));
      }
    };

    const markdownText: string = getMarkdownText(editorState);

    return (
      <div className="main">
        <MarkDownEditorNav
          editorState={editorState}
          toggleMarkdownStyle={toggleMarkdownStyle}
        />
        <div className="mainView">
          {useMarkDownEditor &&
            <div className="resize grid">
              <MarkDownEditor
                editorChange={onEditorChange}
                editorState={editorState}
                insertDraftMarkdown={insertDraftMarkdown}
                edirotFocus={edirotFocus}
                onTextSave={onTextSave}
                draftEditorRef={draftEditorRef}
                
              />
            </div>
          }
          {usePreview &&
            <div className="grid">
              <div className="preview" dangerouslySetInnerHTML={{ __html: marked(markdownText) }} />
            </div>
          }
        </div>
      </div>
    );
  }
}
export default Main;
