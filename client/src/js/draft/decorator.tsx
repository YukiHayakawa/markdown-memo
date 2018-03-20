import * as React from 'react';
import { CompositeDecorator } from 'draft-js';

interface Rules {
  regex: RegExp;
  className: string;
}
const rules = [
  {
    regex: /```.*/g,
    className: 'markdownStyleCode',
  },
  {
    regex: /^\s*\-\s/g,
    className: 'markdownStyle',
  },
  {
    regex: /^\s*\*\s/g,
    className: 'markdownStyle',
  },
  {
    regex: /^\s*\d+\.\s/g,
    className: 'markdownStyle',
  },
  {
    regex: /^\#*\s/g,
    className: 'markdownStyle',
  },
  {
    regex: /^>\s/g,
    className: 'markdownStyle',
  },
  {
    regex: /\*\*.+?\*\*/g,
    className: 'strong',
  },
  {
    regex: /\*.+?\*/g,
    className: 'italic',
  },
  {
    regex: /~~.+?~~/g,
    className: 'del',
  },
  {
    regex: /`.+?`/g,
    className: 'code',
  },
];

const decorator = new CompositeDecorator(rules.map((rule: Rules): any => ({
  strategy(contentBlock: Draft.ContentBlock, callback: Function): void {
    const text = contentBlock.getText();
    let matchArr;
    let start;
    while ((matchArr = rule.regex.exec(text)) !== null) {
      start = matchArr.index;
      // console.log(matchArr);
      callback(start, start + matchArr[0].length);
    }
  },
  component(prop: object): JSX.Element {
    return (
      <span className={rule.className}>
        {prop['children']}
      </span>
    );
  },
})));
export default decorator;
