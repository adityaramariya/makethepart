import { GET_APPROVER, GET_PROFILE } from "./types";

const INITIAL_STATE = {
  approverList: [],
  userList: [],
  profileList: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_APPROVER:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.approverList = action.payload.data.resourceData;
      }
      return Object.assign({}, state);
    case GET_PROFILE:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.profileList = action.payload.data.resourceData;
      }
      return Object.assign({}, state);
    default:
      return state;
  }
};
