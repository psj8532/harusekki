import {UPDATE_MENU} from '../action/record';

const initialState = {
  menu: null,
};

function recordReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_MENU:
      const newState = Object.assign({}, state, {menu: action.menu});
      return newState;

    default:
      return state;
  }
}

export default recordReducer;
