import * as React from 'react';
import IconButton from 'material-ui/IconButton';
import {
  FormatSize, FormatQuote, FormatListBulleted, FormatListNumbered, Code, FormatBold,
  FormatItalic, FormatStrikethrough, FormatClear, InsertLink, InsertPhoto,
} from 'material-ui-icons';

const navTypeLists = [
  {
    style: 'header',
    flg: 'block',
    icon: (): JSX.Element => <FormatSize />,
  },
  {
    style: 'blockquote',
    flg: 'block',
    icon: (): JSX.Element => <FormatQuote />,
  },
  {
    style: 'unordered-list-item',
    flg: 'block',
    icon: (): JSX.Element => <FormatListBulleted />,
  },
  {
    style: 'ordered-list-item',
    flg: 'block',
    icon: (): JSX.Element => <FormatListNumbered />,
  },
  {
    style: 'CODE',
    flg: 'inline',
    icon: (): JSX.Element => <Code />,
  },
  {
    style: 'BOLD',
    flg: 'inline',
    icon: (): JSX.Element => <FormatBold />,
  },
  {
    style: 'ITALIC',
    flg: 'inline',
    icon: (): JSX.Element => <FormatItalic />,
  },
  {
    style: 'UNDERLINE',
    flg: 'inline',
    icon: (): JSX.Element => <FormatStrikethrough />,
  },
  {
    style: 'LINK',
    flg: 'inline',
    icon: (): JSX.Element => <InsertLink />,
  },
  {
    style: 'PHOTO',
    flg: 'inline',
    icon: (): JSX.Element => <InsertPhoto />,
  },
  {
    style: 'unstyled',
    flg: 'block',
    icon: (): JSX.Element => <FormatClear />,
  },
];
/**
 * markdownEditorNavnの型定義
 * 
 * @interface Props
 */
interface Props {
  editorState: Draft.EditorState;
  toggleMarkdownStyle: (editorState:Draft.EditorState , style: string, flg: string) => void;
}
/**
 * listTypeの型定義
 * 
 * @interface listType
 */
interface listType {
  style: string;
  flg: string;
  icon: () => JSX.Element;
}
/**
 * markdownEditorNavのコンポーネント
 * 
 * @param {Props} { editorState, toggleMarkdownStyle } 
 * @returns {JSX.Element} 
 */
const markdownEditorNav = ({ editorState, toggleMarkdownStyle }: Props): JSX.Element => {
  const selection = editorState.getSelection();
  const currentStyle = editorState.getCurrentInlineStyle();
  const contentState = editorState.getCurrentContent();
  const blockType = contentState.getBlockForKey(selection.getStartKey()).getType();
  return (
    <div className="editorNav">
      {navTypeLists.map((type: listType): JSX.Element => {
        const { style, flg }: listType = type;
        const active = type.flg === 'block' ? style === blockType : currentStyle.has(type.style);
        const onToggle = (e: any): void => {
          e.preventDefault();
          toggleMarkdownStyle(editorState, style, flg);
        };
        return (
          <IconButton
            className={`navBtn ${active ? 'active' : 'normal'}`}
            key={type.style}
            onClick={onToggle}
            onKeyDown={onToggle}
            role="presentation"
          >
            {type.icon()}
          </IconButton>
        );
      })}
    </div>
  );
};
export default markdownEditorNav;
