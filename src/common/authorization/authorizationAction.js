import {
  USER_LOGIN,
  USER_LOGOUT,
  GET_STUDENT_PERSONAL_INFO,
  USER_REGISTER,
  SHOW_SIGNIN,
  USER_TYPE,
  USER_FORGOT_PASSWORD,
  RESET_PASSWORD,
  USER_COMPANY_LOGO,
  PROFILE_PHOTO
} from './types';

import makeThePartApiService from '../../common/core/api/apiService';

export const actionUserLogin = data => {
  const request = makeThePartApiService('buyerLogin', data);
  return {
    type: USER_LOGIN,
    payload: request
  };
};

export const actionUserRegister = data => {
  const request = makeThePartApiService('register', data);
  return {
    type: USER_REGISTER,
    payload: request
  };
};

export const actionUserLogout = data => {
  const request = makeThePartApiService('logout', data);
  return {
    type: USER_LOGOUT,
    payload: request
  };
};

export const actionOtpVerification = data => {
  const request = makeThePartApiService('otpVerification', data);
  return {
    type: GET_STUDENT_PERSONAL_INFO,
    payload: request
  };
};

/**
 * To show hide signup and signin page
 * @param {Boolean } data  true to show sigin page and false to show signup page
 */
export const actionShowSignIn = data => {
  return {
    type: SHOW_SIGNIN,
    payload: data
  };
};

export const actionChangeUserType = data => {
  return {
    type: USER_TYPE,
    payload: data
  };
};

export const actionForgotPassword = data => {
  const request = makeThePartApiService('forgotPassword', data);
  return {
    type: USER_FORGOT_PASSWORD,
    payload: request
  };
};

export const actionResetPassword = data => {
  const request = makeThePartApiService('resetPassword', data);
  return {
    type: RESET_PASSWORD,
    payload: request
  };
};

export const actionChangeUserCompanyLogo = data => {
  return {
    type: USER_COMPANY_LOGO,
    payload: data
  };
};

export const actionChangeUserProfileLogo = data => {
  return {
    type: PROFILE_PHOTO,
    payload: data
  };
};
