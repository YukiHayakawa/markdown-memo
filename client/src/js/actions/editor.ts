import { Action } from 'redux';
import * as fetch from 'isomorphic-fetch';
import { loadDraftMarkdown } from 'js/draft/markdown';
import { updateActiveFile, updateActiveDir } from 'js/actions';
/**
 * 設定ファイル
 * 
 * @interface Config
 */
interface Config {
  defaultDir: string;
  api: string;
}
declare const CONFIG: Config;
const { defaultDir, api }: Config = CONFIG;

export enum ActionNames {
  EDITOR_CHANGE = 'editor/editorChange',
  REQUEST_TEXT_LOADING = 'editor/requestTextLoading',
  REQUEST_TEXT_SUCCESS = 'editor/requestTextSuccess',
  REQUEST_TEXT_FAILURE = 'editor/requestTextFailure',
}

/*
* エディタテキストの切り替え
*/
export interface EditorChangeAction extends Action {
  type: ActionNames.EDITOR_CHANGE;
  editorState: any;
}
export const editorChange = (editorState: Draft.EditorState): EditorChangeAction => ({
  editorState,
  type: ActionNames.EDITOR_CHANGE,
});
/*
* エディタテキストのリクエスト開始
*/
export interface RequestTextLoadingAction extends Action {
  type: ActionNames.REQUEST_TEXT_LOADING;
}
export const requestTextLoading = (): RequestTextLoadingAction => ({
  type: ActionNames.REQUEST_TEXT_LOADING,
});
/*
* エディタテキストのリクエスト成功
*/
export interface RequestTextSuccessAction extends Action {
  type: ActionNames.REQUEST_TEXT_SUCCESS;
  editorState: any;
}
export const requestTextSuccess = (editorState: any): RequestTextSuccessAction => ({
  editorState,
  type: ActionNames.REQUEST_TEXT_SUCCESS,
});
/*
* エディタテキストのリクエスト失敗
*/
export interface RequestTextFailureAction extends Action {
  type: ActionNames.REQUEST_TEXT_FAILURE;
}
export const requestTextFailure = (): RequestTextFailureAction => ({
  type: ActionNames.REQUEST_TEXT_FAILURE,
});
/*
* エディタテキストのリクエスト処理
*/
export const getText = (editorState: any, url: string): any => {
  return (dispatch: any): any => {
    dispatch(requestTextLoading());
    if (url === '') {
      dispatch(requestTextSuccess(loadDraftMarkdown(editorState, '')));
      return;
    }
    fetch(`${api}${defaultDir}${url}`)
      .then((response: any) => response.json())
      .then((json: any) => {
        if (json.status) {
          dispatch(requestTextSuccess(loadDraftMarkdown(editorState, json.text)));
          dispatch(updateActiveFile(url));
          dispatch(updateActiveDir(url.replace(/(.+\/).+?\.md/, '$1')));
        } else {
          dispatch(requestTextSuccess(editorState));
        }
      })
      .catch(() => {
        dispatch(requestTextFailure());
      });
  };
};
