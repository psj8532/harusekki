import { combineReducers } from 'redux';
import userReducer from './user';
import recordReducer from './record';

const reducers = combineReducers({
    userReducer,
    recordReducer,
});

export default reducers;