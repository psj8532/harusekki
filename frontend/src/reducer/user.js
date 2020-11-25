import {LOGIN} from '../action/user';

const initialState = {
  user: null,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      const newState = Object.assign({}, state, {user: action.user});
      return newState;

    default:
      return state;
  }
}

export default userReducer;
