import * as React from 'react';
import { Editor } from 'draft-js';
import { checkMarkDown } from 'js/draft/markdown';
/**
 * MarkdownEditorの型定義
 * 
 * @interface Props
 */
interface Props {
  editorChange: (editorState: Draft.EditorState) => void;
  editorState: Draft.EditorState;
  insertDraftMarkdown: (val: Draft.EditorState) => void;
  edirotFocus: () => void;
  draftEditorRef: (val: Draft.Editor) => void;
  onTextSave: (editorState: Draft.EditorState) => void;
}
/**
 * MarkdownEditorコンポーネント
 * 
 * @class MarkdownEditor
 * @extends {React.Component<Props>}
 */
class MarkdownEditor extends React.Component<Props> {
  /**
   * テキストを保存
   * 
   * @private
   * @memberof MarkdownEditor
   */
  private onTextSave = (): void => {
    this.props.onTextSave(this.props.editorState);
  }
  /**
   * codeblockのクラス名を付与
   * 
   * @private
   * @memberof MarkdownEditor
  */
  private blockStyleFn = (contentBlock: Draft.ContentBlock): string => {
    const className = checkMarkDown(this.props.editorState, contentBlock);
    return className;
  }
  /**
   * エディタがクリックされた処理
   * 
   * @private
   * @memberof MarkdownEditor
   */
  private onEditorClick = (): void => {
    this.props.edirotFocus();
  }
  /**
   * Enterが押下された時の処理
   * 
   * @private
   * @memberof MarkdownEditor
   */
  private onEditorKeyPress = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key && e.key === 'Enter') {
      this.props.insertDraftMarkdown(this.props.editorState);
    }
    this.props.edirotFocus();
  }
  /**
   * Rneder関数
   * 
   * @returns {JSX.Element} 
   * @memberof MarkdownEditor
   */
  public render(): JSX.Element {
    const {
      editorChange, editorState,
      draftEditorRef,
    }: Props = this.props;

    return (
      <div className="editor" onKeyDown={this.onEditorKeyPress} onClick={this.onEditorClick}>
        <Editor
          editorState={editorState}
          onChange={editorChange}
          onBlur={this.onTextSave}
          placeholder="Tell a story..."
          spellCheck={true}
          blockStyleFn={this.blockStyleFn}
          ref={draftEditorRef}
        />
      </div>
    );
  }
}

export default MarkdownEditor;
