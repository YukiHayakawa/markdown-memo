import { Action } from 'redux';

export enum ActionNames {
  NAV_CHANGE = 'layout/navChange',
  MAIN_CHANGE = 'layout/mainChange',
}

/*
* サイドナビの切り替え
*/
export interface NavChangeAction extends Action {
  type: ActionNames.NAV_CHANGE;
  sideNav: any;
}
export const navChange = (sideNav: any): NavChangeAction => ({
  sideNav,
  type: ActionNames.NAV_CHANGE,
});

/*
* メインビューの切り替え
*/
export interface MainChangeAction extends Action {
  type: ActionNames.MAIN_CHANGE;
  mainView: number;
}
export const mainChange = (mainView: number): MainChangeAction => ({
  mainView,
  type: ActionNames.MAIN_CHANGE,
});
