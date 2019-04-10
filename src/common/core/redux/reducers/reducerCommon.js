import { LOADER_SHOW, LOADER_HIDE } from '../types';

const INITIAL_STATE = {
  loader: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADER_SHOW:
      state.loader = action.payload;
      return Object.assign({}, state);

    case LOADER_HIDE:
      state.loader = action.payload;
      return Object.assign({}, state);

    default:
      return state;
  }
};
