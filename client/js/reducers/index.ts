import { combineReducers } from 'redux';
import editor from 'js/reducers/editor';
import layout from 'js/reducers/layout';
import suggest from 'js/reducers/suggest';
import {
  ActionNames,
  UpdateEditAction,
  UpdateActiveFileAction,
  UpdateActiveDirAction,
  UpdateNavFlgAction,
  RequestNavLoadingAction,
  RequestNavSuccessAction,
  RequestNavFailureAction,
  UpdateNavLoadingAction,
  UpdateNavSuccessAction,
  UpdateNavFailureAction,
} from 'js/actions';

export interface NavList {
  dir: {
    name: string;
    path: string;
    child: NavList[];
  };
  path: string;
  name: string;
}

export interface IndexState {
  loading: boolean;
  error: boolean;
  navList: NavList[];
  toggleNavFlg: any;
  activeDir: string;
  activeFile: string;
  edit: {
    afterName: string;
    beforeName: string;
    type: string;
    new: boolean;
  };
}
export type IndexActions = UpdateEditAction |
 UpdateActiveFileAction |
 UpdateActiveDirAction |
 UpdateNavFlgAction |
 RequestNavLoadingAction |
 RequestNavSuccessAction |
 RequestNavFailureAction |
 UpdateNavLoadingAction |
 UpdateNavSuccessAction |
 UpdateNavFailureAction;
/*
* 初期ステート
*/
const initialState = {
  loading: false,
  error: false,
  navList: [],
  toggleNavFlg: {},
  activeDir: '',
  activeFile: '',
  edit: {
    afterName: '',
    beforeName: '',
    type: '',
    new: false,
  },
};
/*
* ナビアイテムのReducer
*/
const item = (state: IndexState = initialState, action: IndexActions): IndexState => {
  switch (action.type) {
    case ActionNames.UPDATE_NAV_LOADING:
      return {
        ...state,
        ...{
          loading: true,
        },
      };
    case ActionNames.UPDATE_NAV_FAILURE:
      return {
        ...state,
        ...{
          loading: false,
          error: true,
        },
      };
    case ActionNames.UPDATE_NAV_SUCCESS:
      return {
        ...state,
        ...{
          navList: action.navList,
          toggleNavFlg: action.toggleNavFlg,
          loading: false,
        },
      };

    case ActionNames.UPDATE_EDIT:
      return {
        ...state,
        ...{
          edit: Object.assign(state.edit, action.edit),
        },
      };

    case ActionNames.UPDATE_ACTIVE_FILE:
      return {
        ...state,
        ...{
          activeFile: action.path,
        },
      };

    case ActionNames.UPDATE_ACTIVE_DIR:
      return {
        ...state,
        ...{
          activeDir: action.path,
        },
      };

    case ActionNames.UPDATE_NAV_FLG:
      return {
        ...state,
        ...{
          toggleNavFlg: Object.assign(state.toggleNavFlg, action.toggleNavFlg),
        },
      };

    case ActionNames.REQUEST_NAV_LOADING:
      return {
        ...state,
        ...{
          loading: true,
        },
      };

    case ActionNames.REQUEST_NAV_SUCCESS:
      return {
        ...state,
        ...{
          loading: false,
          navList: action.navList,
          toggleNavFlg: action.toggleNavFlg,
        },
      };

    case ActionNames.REQUEST_NAV_FAILURE:
      return {
        ...state,
        ...{
          loading: false,
          error: true,
        },
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  item,
  editor,
  layout,
  suggest,
});

export default rootReducer;
