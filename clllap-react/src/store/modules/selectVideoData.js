import { createAction, handleActions } from 'redux-actions';
import { enableAllPlugins } from 'immer';
import produce from 'immer';
enableAllPlugins();

// 액션 타입을 정의해줍니다.
const UPDATE_S3STRINGDATA = 'selectvideo/s3_string_data';
const UPDATE_S3CLIENTSRCTEST = 'selectvideo/s3_clientsrc_test';
const UPDATE_S3URLLIST = 'selectvideo/s3_url_list';

// 액션 생성 함수를 만듭니다.
export const updateS3stringdata = createAction(UPDATE_S3STRINGDATA);
export const updateS3clientsrctest = createAction(UPDATE_S3CLIENTSRCTEST);
export const updateS3urllist = createAction(UPDATE_S3URLLIST);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
  selectvideoData:{
    s3_string_data:"",
    s3_clientsrc_test:"",
    s3_url_list:[],   
  },
}

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  [UPDATE_S3STRINGDATA]: (state, action) => {
    return produce(state, draft => {
      draft.selectvideoData.s3_string_data = action.payload.s3_string_data ? action.payload.s3_string_data : draft.selectvideoData.s3_string_data;
    });
  },
  [UPDATE_S3CLIENTSRCTEST]: (state, action) => {
    return produce(state, draft => {
        draft.selectvideoData.s3_clientsrc_test = action.payload.s3_clientsrc_test ? action.payload.s3_clientsrc_test :  draft.selectvideoData.s3_clientsrc_test;
    });
  },
  [UPDATE_S3URLLIST]: (state, action) => {
    return produce(state, draft => {
        draft.selectvideoData.s3_url_list = action.payload.s3_url_list ? action.payload.s3_url_list : draft.selectvideoData.s3_url_list;
    });
  },
}, initialState);
