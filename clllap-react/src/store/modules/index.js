import { combineReducers } from 'redux';
import userData from './userData';
import selectVideoData from './selectVideoData';

export default combineReducers({
  userData,
  selectVideoData
});