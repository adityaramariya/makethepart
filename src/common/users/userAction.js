import {
  GET_APPROVER,
  GET_OTP_FOR_ADD_USER,
  SUPPLIER_ADD_USER,
  All_ADDED_USER,
  EDIT_USER,
  DELETE_USER,
  AFFECTED_USER,
  GET_USER_DETAILS,
  CHECK_TOKEN,
  UPDATE_USER_PROFILE,
  SEND_OTP_FOR_UPDATE_PROFILE,
  GET_PROFILE,
  GET_OTP_FOR_EDIT_USER,
  GET_COMPANY_DETAILS
} from './types';
import makeThePartApiService from '../../common/core/api/apiService';

export const actionGetApproverList = data => {
  console.log('actionGetApproverList');

  const request = makeThePartApiService('getApproverList', data);
  return {
    type: GET_APPROVER,
    payload: request
  };
};

export const actionGenerateOTPToAddUser = data => {
  console.log('actionGenerateOTPToAddUser');

  const request = makeThePartApiService('generateOTPToAddUser', data);
  return {
    type: GET_OTP_FOR_ADD_USER,
    payload: request
  };
};

export const actionSupplierAddUser = data => {
  const request = makeThePartApiService('supplierAddUser', data);
  return {
    type: SUPPLIER_ADD_USER,
    payload: request
  };
};

export const actionEditProfile = data => {
  const request = makeThePartApiService('editProfile', data);
  return {
    type: EDIT_USER,
    payload: request
  };
};

export const actionGetAllAddedUser = data => {
  const request = makeThePartApiService('getAllAddedUser', data);
  return {
    type: All_ADDED_USER,
    payload: request
  };
};

export const actionDeleteUser = data => {
  const request = makeThePartApiService('deleteUserProfile', data);
  return {
    type: DELETE_USER,
    payload: request
  };
};

export const actionDeleteAffectedUser = data => {
  const request = makeThePartApiService('affectedUserCheckBeforeDelete', data);
  return {
    type: AFFECTED_USER,
    payload: request
  };
};

export const actionUpdateUserProfile = data => {
  const request = makeThePartApiService('updateUserProfile', data);
  return {
    type: UPDATE_USER_PROFILE,
    payload: request
  };
};

export const actionSendOtpForUPdate = data => {
  const request = makeThePartApiService('sendOtpForUpdate', data);
  return {
    type: SEND_OTP_FOR_UPDATE_PROFILE,
    payload: request
  };
};

export const actionGetUserDetails = data => {
  const request = makeThePartApiService('getUserDetails', data);
  return {
    type: GET_USER_DETAILS,
    payload: request
  };
};

export const actionCheckToken = data => {
  const request = makeThePartApiService('checkToken');
  return {
    type: CHECK_TOKEN,
    payload: request
  };
};

export const actionGetUserProfileList = data => {
  console.log('actionGetApproverList');
  const request = makeThePartApiService('getUserProfileList', data);
  return {
    type: GET_PROFILE,
    payload: request
  };
};

export const actionGenerateOTPToEditUser = data => {
  const request = makeThePartApiService('generateOTPToEditUser', data);
  return {
    type: GET_OTP_FOR_EDIT_USER,
    payload: request
  };
};

export const actionGetCompanyData = data => {
  const request = makeThePartApiService('getCompanyDetails', data);
  return {
    type: GET_COMPANY_DETAILS,
    payload: request
  };
};
