import {
  USER_LOGIN,
  USER_LOGOUT,
  GET_STUDENT_PERSONAL_INFO,
  USER_REGISTER,
  SHOW_SIGNIN,
  USER_TYPE,
  USER_COMPANY_LOGO,
  PROFILE_PHOTO
} from './types';
import {
  setLocalStorage,
  getLocalStorage,
  clearLocalStorage
} from '../commonFunctions';

const INITIAL_STATE = {
  userData: getLocalStorage('userInfo') || {},
  userRegiser: {},
  showSignIn: 'signin',
  userType: 'buyer'
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_LOGIN:
      if (action.payload && action.payload.data) {
        const userInfo = action.payload.data;
        if (userInfo.userProfile)
          userInfo.userProfile = userInfo.userProfile.toLowerCase();
        state.userData = userInfo;
        setLocalStorage('userInfo', userInfo);
      }
      return Object.assign({}, state);

    case USER_REGISTER:
      if (action.payload && action.payload.data) {
        const userInfo = action.payload.data;
        state.userRegiser = userInfo;
      }
      return Object.assign({}, state);

    case USER_LOGOUT:
      state.userData = {};
      clearLocalStorage();
      return Object.assign({}, state);

    case SHOW_SIGNIN:
      state.showSignIn = action.payload;
      return Object.assign({}, state);

    case USER_TYPE:
      state.userType = action.payload;
      return Object.assign({}, state);

    case USER_COMPANY_LOGO:
      state.companyProfileURL = action.payload;
      return Object.assign({}, state);

    case PROFILE_PHOTO:
      if (action.payload) {
        state.userData.profilePhotoURL = action.payload;
        return Object.assign({}, state);
      }

    default:
      return state;
  }
};
