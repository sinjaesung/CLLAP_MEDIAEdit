import { createAction, handleActions } from 'redux-actions';
import { enableAllPlugins } from 'immer';
import produce from 'immer';
enableAllPlugins();

// 액션 타입을 정의해줍니다.
const UPDATE_USERDATA = 'user/userData';
const UPDATE_LOGOUT = 'user/userLogout';

// 액션 생성 함수를 만듭니다.
export const updateUserData = createAction(UPDATE_USERDATA);
export const updateLogout = createAction(UPDATE_LOGOUT);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
  userData:{
    user_age:0,
    user_country:"",
    user_email:"",
    user_gender:"",
    user_id:0,
    user_join_check:"",
    user_name:"",
    user_nickname:"",
    user_phone:"",
    user_profile:"",
    user_region:"",
    username:"",
  },
}

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  [UPDATE_USERDATA]: (state, action) => {
    return produce(state, draft => {
      draft.userData = action.payload.userData ? action.payload.userData : draft.userData;
    });
  },
  [UPDATE_LOGOUT]: (state, action) => {
    return initialState;
  },
}, initialState);
