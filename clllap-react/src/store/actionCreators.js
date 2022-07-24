import { bindActionCreators } from 'redux';
import * as userDataAction from './modules/userData';
import * as selectVideoDataAction from './modules/selectVideoData';

import store from './index';

const { dispatch } = store;

export const UserDataAction = bindActionCreators(userDataAction, dispatch);
export const SelectVideoDataAction = bindActionCreators(selectVideoDataAction, dispatch);
