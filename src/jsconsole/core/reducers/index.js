import { combineReducers } from 'redux';
import history from './history';
import settings from './settings';
import drags from './drags';

export default combineReducers({
  history,
  settings,
  drags,
});
