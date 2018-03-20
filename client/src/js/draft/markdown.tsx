import { EditorState, Modifier, SelectionState, convertFromRaw, convertToRaw } from 'draft-js';
import decorator from 'js/draft/decorator';

const changeRules = [
  {
    style: 'header-six', next: 'unstyled', flg: 'block', match: /^######\s/, reg: /^(.+)$/, res: '###### $1',
  },
  {
    style: 'header-five', next: 'header-six', flg: 'block', match: /^#####\s/, reg: /^(.+)$/, res: '##### $1',
  },
  {
    style: 'header-four', next: 'header-five', flg: 'block', match: /^####\s/, reg: /^(.+)$/, res: '#### $1',
  },
  {
    style: 'header-three', next: 'header-four', flg: 'block', match: /^###\s/, reg: /^(.+)$/, res: '### $1',
  },
  {
    style: 'header-two', next: 'header-three', flg: 'block', match: /^##\s/, reg: /^(.+)$/, res: '## $1',
  },
  {
    style: 'header-one', next: 'header-two', flg: 'block', match: /^#\s/, reg: /^(.+)$/, res: '# $1',
  },
  {
    style: 'blockquote', next: 'header-one', flg: 'block', match: /^>\s/, reg: /^(.+)$/, res: '> $1',
  },
  {
    style: 'unordered-list-item', next: 'header-one', flg: 'block', match: /^\s*?(-|\*)\s/, reg: /^(.+)$/, res: '- $1',
  },
  {
    style: 'ordered-list-item', next: 'header-one', flg: 'block',
    match: /^\s*?[0-9]+?\.\s/, reg: /^(.+)$/, res: '1. $1',
  },
  {
    style: 'code-block', flg: 'block', match: /(^```)/g, reg: /^(.+)$/, res: '```\n$1\n```',
  },
  {
    style: 'table', flg: 'block', match: /\|.+\|/, reg: /^(.+)$/, res: '$1',
  },
  {
    style: 'unstyled', next: 'header-one', flg: 'block', match: /.+/, reg: /^(.+)$/, res: '$1',
  },
  {
    style: 'CODE', flg: 'inline', match: /`([^`\n]+?)`/, res: '`$1`',
  },
  {
    style: 'BOLD', flg: 'inline', match: /\*\*(.+?)\*\*/, res: '**$1**',
  },
  {
    style: 'ITALIC', flg: 'inline', match: /\*(.+?)\*/, res: '*$1*',
  },
  {
    style: 'UNDERLINE', flg: 'inline', match: /~~(.+?)~~/, res: '~~$1~~',
  },
  {
    style: 'LINK', flg: 'inline', match: /\[(.+?)\]\(http:\/\/\)/, res: '[$1](http://)',
  },
  {
    style: 'PHOTO', flg: 'inline', match: /!\[(.+?)\]\(http:\/\/\)/, res: '![$1](http://)',
  },
];

/*
* markdownStyleをclear
*/
const regClearStyle = /(^#+|^\s*[0-9]+?\.|^\s*-|\*|^>|\s*)\s*/;
/**
 * blocktypeを取得
 * 
 * @param {string} text 
 * @returns {*} 
 */
const getBlockType = (text: string): any => {
  const res = text === '' ?
    'unstyled' : changeRules.filter((line: any): any => text.match(line.match))[0].style;
  return res;
};
/*
* テキストをDraftへ変換
*/
const changeRulesKey = changeRules.reduce((x: any, y: any): any => Object.assign(x, { [y.style]: y }), {});
/**
 * Draftをテキストへ変換
 * 
 * @param {Draft.EditorState} editorState 
 * @returns {*} 
 */
export const getMarkdownText = (editorState: Draft.EditorState): any => {
  let markdownText = '';
  const contentState = editorState.getCurrentContent();
  // console.log(convertToRaw(contentState));
  const textLine = convertToRaw(contentState).blocks;
  let beforeType = '';
  let blockquoteType = false;
  let codeCount = 0;
  textLine.forEach((line: any): any => {
    const res = line;
    const nowBlockType = getBlockType(res.text);

    if ((nowBlockType !== 'blockquote' && nowBlockType !== 'unstyled') || res.text === '') {
      blockquoteType = false;
    }
    if (blockquoteType && nowBlockType !== 'blockquote') {
      res.text = `> ${res.text}`;
    }
    if (nowBlockType === 'blockquote') {
      blockquoteType = true;
    }
    if ((nowBlockType !== beforeType && beforeType !== 'code-block' && beforeType !== 'blockquote' ||
      beforeType === 'blockquote' && nowBlockType !== 'unstyled' && !blockquoteType) &&
      (nowBlockType !== 'code-block' && codeCount % 2 !== 1)) {
      markdownText += '\n\n';
    }
    markdownText += `${res.text}`;
    markdownText += `\n`;
    beforeType = nowBlockType;
    if (nowBlockType === 'code-block') {
      codeCount += 1;
    }
  });
  return markdownText;
};
/**
 * テキストをDraftへ変換
 * 
 * @param {*} str 
 * @returns {*} 
 */
const addDraftMarkdown = (str: any): any => {
  const arr = str.split('\n');
  return {
    blocks: arr.map((text: string):any => ({
      text: text.replace(/\n$/, ''),
      entityRanges: [],
      inlineStyleRanges: [],
      type: 'unstyled',
    })),
    entityMap: {},
  };
};
/**
 * テキストを取得
 * 
 * @param {*} editorState 
 * @returns {string} 
 */
export const getText = (editorState: any): string => {
  const contentState = editorState.getCurrentContent();
  return contentState.getPlainText();
};
/**
 * 新しい行を追加
 * 
 * @param {*} editorState 
 * @returns {*} 
 */
export const insertNewLine = (editorState: any): any => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const anchorKey = selection.getAnchorKey();
  const currentContentBlock = contentState.getBlockForKey(anchorKey);
  const text = currentContentBlock.getText();
  const clearText = text.replace(regClearStyle, '');
  const flg = !!getBlockType(text).match('list-item');
  const block = contentState.getBlockForKey(selection.getAnchorKey());
  const newSelection = new SelectionState({
    anchorKey: block.getKey(),
    anchorOffset: 0,
    focusKey: block.getKey(),
    focusOffset: block.getLength(),
  });
  const cs = flg && clearText === '' ?
    Modifier.removeRange(contentState, newSelection, 'backward') : Modifier.splitBlock(contentState, selection);
  return {
    newEditorState: EditorState.push(editorState, cs, 'backspace-character'),
    beforeText: text,
    flg: flg && clearText !== '',
  };
};
/**
 * ul と olだった場合はデフォルトテキストを追加
 * 
 * @param {Draft.EditorState} editorState 
 * @param {string} beforeText 
 * @returns {Draft.EditorState} 
 */
export const addNewLineText = (editorState: Draft.EditorState, beforeText: string): Draft.EditorState => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const match = beforeText.match(/^(\s*)(\*|-|([0-9]+?)\.)(\s*)/);
  if (match) {
    const next = Number.isNaN(Number(match[3])) ? `${match[0]}` : `${match[1]}${Number(match[3]) + 1}.${match[4]}`;
    const cs = Modifier.insertText(contentState, selection, next);
    return EditorState.push(editorState, cs, 'backspace-character');  
  }
  return editorState;
};
/**
 * ナビゲーション（inline要素）をクリックされた時の処理
 * 
 * @param {string} text 
 * @param {string} style 
 * @param {Draft.SelectionState} selection 
 * @returns {*} 
 */
const getNextInlineType = (text: string, style: string, selection: Draft.SelectionState): any => {
  const next = { text, length: text.length };
  const start = selection.getStartOffset();
  const end = selection.getEndOffset();
  const selectedText = text.slice(start, end);
  if (changeRulesKey[style]) {
    const before = text.slice(0, start);
    const after = text.slice(end, text.length);
    next.text = before + changeRulesKey[style].res.replace('$1', selectedText) + after;
    next.length = next.text.length - (next.text.length - text.length);
  }
  return next;
};
/**
 * 次のスタイルを返す
 * 
 * @param {string} text 
 * @param {string} style 
 * @returns {string} 
 */
const getNextStyle = (text: string, style: string): string => {
  const nowBlockType = getBlockType(text);
  if (nowBlockType === style) {
    return 'unstyled';
  }
  if (style === 'header') {
    return changeRulesKey[nowBlockType].next;
  }
  return style;
};
/**
 * 次のブロックタイプを返す
 * 
 * @param {string} text 
 * @param {string} style 
 * @returns {*} 
 */
const getNextBlockType = (text: string, style: string): any => {
  const next: any = {};
  const nextStyle = getNextStyle(text, style);
  if (style === 'unstyled') {
    next.text = text.replace(regClearStyle, '').replace(/\*|~~|`/g, '');
  } else if (nextStyle === 'unstyled') {
    next.text = text.replace(regClearStyle, '');
  } else {
    const nomalText = text.replace(regClearStyle, '');
    const regexp = new RegExp(`(${nomalText.replace(/\*/g, '\\*')})`, 'g');
    next.text = nomalText.replace(regexp, changeRulesKey[nextStyle].res);
  }
  next.length = next.text.length - (next.text.length - text.length);
  return next;
};
/**
 * ナビゲーションをクリックされた時の処理
 * 
 * @param {Draft.EditorState} editorState 
 * @param {string} style 
 * @param {string} flg 
 * @returns {Draft.EditorState} 
 */
export const changeMarkDown = (editorState: Draft.EditorState, style: string, flg: string): Draft.EditorState => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const anchorKey = selection.getAnchorKey();
  const currentContentBlock = contentState.getBlockForKey(anchorKey);
  const text = currentContentBlock.getText();
  const next = flg === 'block' ? getNextBlockType(text, style) : getNextInlineType(text, style, selection);
  const block = contentState.getBlockForKey(selection.getAnchorKey());
  // const changeFlg = blockType !== 'code-block' || style === 'unstyled';
  const newSelection = new SelectionState({
    anchorKey: block.getKey(),
    anchorOffset: 0,
    focusKey: block.getKey(),
    focusOffset: next.length,
  });
  const cs = Modifier.replaceText(contentState, newSelection, next.text);
  return EditorState.push(editorState, cs, 'backspace-character');
};
/**
 * 入力時の処理の処理（必要に応じてスタイルを変更）
 * 
 * @param {Draft.EditorState} editorState 
 * @param {Draft.ContentBlock} contentBlock 
 * @returns {string} 
 */
export const checkMarkDown = (editorState: Draft.EditorState, contentBlock: Draft.ContentBlock): string => { 
  const key = contentBlock.getKey();
  const blockType = getBlockType(contentBlock.getText());
  // console.log(key, blockType);
  const contentState = editorState.getCurrentContent();
  const raw = convertToRaw(contentState);
  let flg = false;
  const codeFlg = raw.blocks.reduce(
    (x: number, y: object): number => {
      if (key === y['key']) { 
        if (x % 2 === 1 || getBlockType(y['text']) === 'code-block') {
          flg = true;
        }
      }
      return getBlockType(y['text']) === 'code-block' ? x + 1 : x;
    },
    0);
  return flg ? 'code-block' : blockType;
};
/**
 * draftのフォマットへ変換
 * 
 * @param {Draft.EditorState} editorState 
 * @param {string} json 
 * @returns {Draft.EditorState} 
 */
export const loadDraftMarkdown = (editorState: Draft.EditorState, json: string): Draft.EditorState => Object.assign(
  editorState,
  json !== '' ?
    EditorState.createWithContent(convertFromRaw(addDraftMarkdown(json)), decorator)
    :
    EditorState.createEmpty(decorator),
);
/**
 * ナビゲーションフラグの設定作成
 * 
 * @param {string} json 
 * @returns {*} 
 */
export const addTggleFlg = (json: string): any => {
  const result = {};
  const addFlg = (array: any): any => {
    array.forEach((list: any): any => {
      if (list.dir) {
        result[list.dir.path] = true;
        addFlg(list.dir.child);
      }
    });
  };
  addFlg(json);
  return result;
};
