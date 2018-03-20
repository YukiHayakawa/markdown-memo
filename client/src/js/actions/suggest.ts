import { Action } from 'redux';
import * as fetch from 'isomorphic-fetch';
/**
 * 設定ファイル
 * 
 * @interface Config
 */
interface Config {
  api: string;
}
declare const CONFIG: Config;
const { api }: Config = CONFIG;

export enum ActionNames {
  SEARCHEBOX_FOCUS_CHANGE = 'suggest/searchboxFocusChange',
  REQUEST_SUGGEST_TEXT_LOADING = 'suggest/requestSuggestTextLoading',
  REQUEST_SUGGEST_TEXT_SUCCESS = 'suggest/requestSuggestTextSuccess',
  REQUEST_SUGGEST_TEXT_FAILURE = 'suggest/requestSuggestTextFailure',
}
/*
* サジェストのトグル切り替え
*/
export interface ToggleFocusAction extends Action {
  type: ActionNames.SEARCHEBOX_FOCUS_CHANGE;
  focusFlg: boolean;
}
export const toggleFocus = (focusFlg: boolean): ToggleFocusAction => ({
  focusFlg,
  type: ActionNames.SEARCHEBOX_FOCUS_CHANGE,
});
/*
* サジェストリクエスト読み込み開始
*/
export interface RequestSuggestTextLoadingAction extends Action {
  type: ActionNames.REQUEST_SUGGEST_TEXT_LOADING;
}
export const requestSuggestTextLoading = (): RequestSuggestTextLoadingAction => ({
  type: ActionNames.REQUEST_SUGGEST_TEXT_LOADING,
});
/*
* サジェストリクエスト読み込み成功
*/
export interface RequestSuggestTextSuccessAction extends Action {
  type: ActionNames.REQUEST_SUGGEST_TEXT_SUCCESS;
  suggestLists: any;
}
export const requestSuggestTextSuccess = (suggestLists: any): RequestSuggestTextSuccessAction => ({
  suggestLists,
  type: ActionNames.REQUEST_SUGGEST_TEXT_SUCCESS,
});
/*
* サジェストリクエスト読み込み失敗
*/
export interface RequestSuggestTextFailureAction extends Action {
  type: ActionNames.REQUEST_SUGGEST_TEXT_FAILURE;
}

export const requestSuggestTextFailure = (): RequestSuggestTextFailureAction => ({
  type: ActionNames.REQUEST_SUGGEST_TEXT_FAILURE,
});
/*
* サジェストリクエスト処理
*/
export const getSuggestLists = (url: string): any => {
  return (dispatch: any): any => {
    dispatch(requestSuggestTextLoading());
    return fetch(`${api}${url}`)
      .then((response: any) => response.json())
      .then((json: any) => {
        dispatch(requestSuggestTextSuccess(json));
      })
      .catch(() => {
        dispatch(requestSuggestTextFailure());
      });
  };
};
