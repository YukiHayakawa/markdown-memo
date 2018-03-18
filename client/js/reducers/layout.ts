import {
  ActionNames,
  NavChangeAction,
  MainChangeAction,
} from 'js/actions/layout';

export type LayoutActions = MainChangeAction | NavChangeAction;
/*
* 初期ステート
*/
export interface LayoutState {
  sideNav: boolean;
  mainView: number;
}
const initialState = {
  sideNav: true,
  mainView: 0,
};
/*
* レイアウト切り替えのReducer
*/
const layout = (state: LayoutState = initialState, action: LayoutActions): LayoutState => {
  switch (action.type) {
    case ActionNames.MAIN_CHANGE:
      return {
        ...state,
        ...{
          mainView: action.mainView,
        },
      };

    case ActionNames.NAV_CHANGE:
      return {
        ...state,
        ...{
          sideNav: action.sideNav,
        },
      };

    default:
      return state;
  }
};
export default layout;
