import { Action } from 'redux';
import * as fetch from 'isomorphic-fetch';
import { addTggleFlg } from 'js/draft/markdown';
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
  UPDATE_EDIT = 'nav/updateEdit',
  UPDATE_ACTIVE_FILE = 'nav/updateActiveFile',
  UPDATE_ACTIVE_DIR = 'nav/updateActiveDir',
  UPDATE_NAV_FLG = 'nav/updateNavFlg',
  REQUEST_NAV_LOADING = 'nav/requestNavLoading',
  REQUEST_NAV_SUCCESS = 'nav/requestNavSuccess',
  REQUEST_NAV_FAILURE = 'nav/requestNavfailure',
  UPDATE_NAV_LOADING = 'nav/updateNavLading',
  UPDATE_NAV_SUCCESS = 'nav/updateNavSuccess',
  UPDATE_NAV_FAILURE = 'nav/updateNavFailure',
}
/*
* ナビアイテムの編集状態の切り替え
*/
export interface UpdateEditAction extends Action {
  type: ActionNames.UPDATE_EDIT;
  edit: any;
}
export const updateEdit = (edit: any): UpdateEditAction => ({
  edit,
  type: ActionNames.UPDATE_EDIT,
});
/*
* ナビアイテムファイル選択状態の切り替え
*/
export interface UpdateActiveFileAction extends Action {
  type: ActionNames.UPDATE_ACTIVE_FILE;
  path: string;
}
export const updateActiveFile = (path: string): UpdateActiveFileAction => ({
  path,
  type: ActionNames.UPDATE_ACTIVE_FILE,
});
/*
* ナビアイテムディレクトリの選択状態の切り替え
*/
export interface UpdateActiveDirAction extends Action {
  type: ActionNames.UPDATE_ACTIVE_DIR;
  path: string;
}
export const updateActiveDir = (path: string): UpdateActiveDirAction => ({
  path,
  type: ActionNames.UPDATE_ACTIVE_DIR,
});
/*
* ナビアイテムの更新
*/
export interface UpdateNavFlgAction extends Action {
  type: ActionNames.UPDATE_NAV_FLG;
  toggleNavFlg: any;
}
export const updateNavFlg = (toggleNavFlg: any): UpdateNavFlgAction => ({
  toggleNavFlg,
  type: ActionNames.UPDATE_NAV_FLG,
});
/*
* ナビアイテムのリクエスト読み込み開始
*/
export interface RequestNavLoadingAction extends Action {
  type: ActionNames.REQUEST_NAV_LOADING;
}
export const requestNavLoading = (): RequestNavLoadingAction => ({
  type: ActionNames.REQUEST_NAV_LOADING,
});

/*
* ナビアイテムのリクエスト読み込み成功
*/
export interface RequestNavSuccessAction extends Action {
  type: ActionNames.REQUEST_NAV_SUCCESS;
  navList: any[];
  toggleNavFlg: any;
}
export const requestNavSuccess = (navList: any[], toggleNavFlg: any): RequestNavSuccessAction => ({
  navList,
  toggleNavFlg,
  type: ActionNames.REQUEST_NAV_SUCCESS,
});

/*
* ナビアイテムのリクエスト読み込み失敗
*/
export interface RequestNavFailureAction extends Action {
  type: ActionNames.REQUEST_NAV_FAILURE;
}
export const requestNavFailure = (): RequestNavFailureAction => ({
  type: ActionNames.REQUEST_NAV_FAILURE,
});

/*
* ナビアイテムのリクエスト処理
*/
export const getNavLists = (url: string): any => {
  return (dispatch: any): any => {
    dispatch(requestNavLoading());
    return fetch(`${api}${url}`)
      .then((response: Response) => response.json())
      .then((json: any) => {
        dispatch(requestNavSuccess(json, addTggleFlg(json)));
      })
      .catch(() => {
        dispatch(requestNavFailure());
      });
  };
};
/*
* ナビアイテム更新のリクエスト読み込み開始
*/
export interface UpdateNavLoadingAction extends Action {
  type: ActionNames.UPDATE_NAV_LOADING;
}
export const updateNavLoading = (): UpdateNavLoadingAction => ({
  type: ActionNames.UPDATE_NAV_LOADING,
});

/*
* ナビアイテム更新のリクエスト読み込み成功
*/
export interface UpdateNavSuccessAction extends Action {
  type: ActionNames.UPDATE_NAV_SUCCESS;
  navList: any[];
  toggleNavFlg: any;
}
export const updateNavSuccess = (navList: any[], toggleNavFlg: any): UpdateNavSuccessAction => ({
  navList,
  toggleNavFlg,
  type: ActionNames.UPDATE_NAV_SUCCESS,
});
/*
* ナビアイテム更新のリクエスト読み込み失敗
*/
export interface UpdateNavFailureAction extends Action {
  type: ActionNames.UPDATE_NAV_FAILURE;
}
export const updateNavFailure = (): UpdateNavFailureAction => ({
  type: ActionNames.UPDATE_NAV_FAILURE,
});

/*
* ナビアイテム更新のリクエスト処理
*/
export function updateNavLists(url: string, param: any): any {
  // console.log(url, param);
  return (dispatch: any): any => {
    dispatch(updateNavLoading());
    return fetch(`${api}${url}`, {
      method: 'POST',
      body: JSON.stringify(param),
      headers: new Headers({ 'Content-type': 'application/json' }),
    })
      .then((response: any) => response.json())
      .then((json: any) => {
        dispatch(updateNavSuccess(json, addTggleFlg(json)));
      })
      .catch(() => {
        dispatch(updateNavFailure());
      });
  };
}
