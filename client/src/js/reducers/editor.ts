import { EditorState } from 'draft-js';
import decorator from 'js/draft/decorator';
import {
  ActionNames,
  EditorChangeAction,
  RequestTextLoadingAction,
  RequestTextSuccessAction,
  RequestTextFailureAction,
} from 'js/actions/editor';

/*
* 初期ステート
*/
export interface EditorsState {
  loading: boolean;
  error: boolean;
  editorState: any;
}
const initialState = {
  loading: false,
  error: false,
  editorState: EditorState.createEmpty(decorator),
};


export type EditorActions = EditorChangeAction |
  RequestTextLoadingAction |
  RequestTextSuccessAction |
  RequestTextFailureAction;
/*
* エディタ切り替えのReducer
*/
const editor = (state: EditorsState = initialState, action: EditorActions): EditorsState => {
  switch (action.type) {
    case ActionNames.EDITOR_CHANGE:
      return Object.assign({}, state, {
        editorState: action.editorState,
      });

    case ActionNames.REQUEST_TEXT_LOADING:
      return {
        ...state,
        ...{
          loading: true,
        },
      };
    case ActionNames.REQUEST_TEXT_SUCCESS:
      return {
        ...state,
        ...{
          loading: false,
          editorState: action.editorState,
        },
      };
    case ActionNames.REQUEST_TEXT_FAILURE:
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
export default editor;
