import {
  ActionNames,
  ToggleFocusAction,
  RequestSuggestTextLoadingAction,
  RequestSuggestTextSuccessAction,
  RequestSuggestTextFailureAction,
} from 'js/actions/suggest';

export type SuggestActions = ToggleFocusAction |
  RequestSuggestTextLoadingAction |
  RequestSuggestTextSuccessAction |
  RequestSuggestTextFailureAction;
/*
* 初期ステート
*/
export interface SuggestState {
  loading: boolean;
  error: boolean;
  focusFlg: boolean;
  suggestLists: any[];
}
const initialState = {
  loading: false,
  error: false,
  focusFlg: false,
  suggestLists: [],
};
/*
* サジェストのReducer
*/
const suggest = (state: SuggestState = initialState, action: SuggestActions): SuggestState => {
  switch (action.type) {
    case ActionNames.REQUEST_SUGGEST_TEXT_LOADING:
      return {
        ...state,
        ...{
          loading: true,
        },
      };

    case ActionNames.REQUEST_SUGGEST_TEXT_FAILURE:
      return {
        ...state,
        ...{
          loading: false,
          error: true,
        },
      };

    case ActionNames.REQUEST_SUGGEST_TEXT_SUCCESS:
      return {
        ...state,
        ...{
          suggestLists: action.suggestLists,
        },
      };

    case ActionNames.SEARCHEBOX_FOCUS_CHANGE:
      return {
        ...state,
        ...{
          focusFlg: action.focusFlg,
        },
      };

    default:
      return state;
  }
};
export default suggest;
