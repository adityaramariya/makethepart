import { post } from "axios";
import AppConfig from "../../common/core/config/appConfig";
import {
  GET_PROJECT_LIST,
  ADD_PROJECT,
  UPLOAD_DESIGN,
  UPLOAD_SPECIFICATION,
  ADD_PARTS,
  CREATE_PART_WITH_MEDIA,
  CLEAR_ADD_PARTS_DATA,
  PENDING_APPROVAL_PART_LIST,
  APPROVE_REJECT_PART,
  SUMMARY_QUOTATION_LIST,
  SUMMARY_REVIEW_DATA,
  PART_ID_FOR_REVIEW,
  SUMMARY_DATA_BY_TAB,
  DASHBOARD_DATA,
  UPDATE_PART_WITH_MEDIA,
  PART_ORDER,
  UPLOAD_REVISION,
  DELETE_REVISION_IMAGE,
  TAB_DATA,
  RELEASE_PO_LIST,
  SUBMIT_RELEASE_PO_LIST,
  APPROVE_REJECT_ORDER,
  SUMMARY_PART_STATUS,
  SUPPILER_QOUTION_DATA,
  ADD_SPECIFICATION_LIST,
  GET_QUOTATION_DATA,
  SUMMARY_QUOTATION,
  GET_USER_LIST,
  PART_HISTORY,
  DASHBOARD_HISTORY,
  SAVE_APPROVAL_LIMIT,
  GET_USER_BY_GROUP,
  UPDATE_APPROVAL_LIMIT,
  EDIT_PART_DETAIL,
  DELETE_PART_DETAIL,
  DELETE_PART_DATABASE,
  UPDATE_PART,
  GET_DISCLOSER_DATA,
  APPROVE_REJECT_NON_DISCLOSURE,
  VALUE_ANALYSIS,
  GET_PART_DETAILS,
  GET_COMMENT_DETAIL,
  SUBMIT_COMMENT,
  GET_PART_NOTIFICATION,
  SEND_NOTIFICATION,
  CLEAR_NOTIFICATION,
  READ_NOTIFICATION,
  GET_COMMENT_COUNT
} from "./types";
import makeThePartApiService from "../../common/core/api/apiService";

export const actionTabData = data => {
  return {
    type: TAB_DATA,
    payload: data
  };
};

export const actionGetProjectList = data => {
  const request = makeThePartApiService("getProjectList", data);
  return {
    type: GET_PROJECT_LIST,
    payload: request
  };
};

export const actionAddProject = data => {
  const request = makeThePartApiService("addProject", data);
  return {
    type: ADD_PROJECT,
    payload: request
  };
};

// export const actionUploadImage = (data) => {
//   const request = makeThePartApiService('uploadImage', data);
//   return {
//     type: UPLOAD_DESIGN,
//     payload: request
//   };
// };
export const actionUploadImage = data => {
  const url = AppConfig.API_URL_JAVA + "/api/v1/cloud/aws/upload";
  const config = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };
  const request = post(url, data, config);
  return {
    type: UPLOAD_DESIGN,
    payload: request
  };
};

export const actionUploadSpecification = data => {
  const url = AppConfig.API_URL_JAVA + "/api/v1/cloud/aws/upload";
  const config = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };
  const request = post(url, data, config);
  return {
    type: UPLOAD_SPECIFICATION,
    payload: request
  };
};

export const actionAddParts = data => {
  const request = makeThePartApiService("addPart", data);
  return {
    type: ADD_PARTS,
    payload: request
  };
};

export const actionCreatePartWithMedia = data => {
  const request = makeThePartApiService("createPartWithMedia", data);
  return {
    type: CREATE_PART_WITH_MEDIA,
    payload: request
  };
};

export const actionClearAddPartData = () => {
  return {
    type: CLEAR_ADD_PARTS_DATA,
    payload: ""
  };
};

export const actionPendingApprovalPartList = data => {
  const request = makeThePartApiService("pendingApprovalPartList", data);
  return {
    type: PENDING_APPROVAL_PART_LIST,
    payload: request
  };
};

export const approveRejectPart = data => {
  const request = makeThePartApiService("approveRejectPart", data);
  return {
    type: APPROVE_REJECT_PART,
    payload: request
  };
};

export const actionSummaryQuotationList = data => {
  const request = makeThePartApiService("actionSummaryQuotationList", data);
  return {
    type: SUMMARY_QUOTATION_LIST,
    payload: request
  };
};

export const actionSummaryReviewData = data => {
  const request = makeThePartApiService("actionSummaryReviewData", data);
  return {
    type: SUMMARY_REVIEW_DATA,
    payload: request
  };
};

export const actionPartIdForReview = data => {
  return {
    type: PART_ID_FOR_REVIEW,
    payload: data
  };
};

export const actionSummaryDataByTab = data => {
  return {
    type: SUMMARY_DATA_BY_TAB,
    payload: data
  };
};

export const actionDashboardData = data => {
  const request = makeThePartApiService("actionDashboardBuyerData", data);
  return {
    type: DASHBOARD_DATA,
    payload: request
  };
};

export const actionUpdatePartWithMedia = data => {
  const request = makeThePartApiService("updateMediaForRevision", data);
  return {
    type: UPDATE_PART_WITH_MEDIA,
    payload: request
  };
};

export const actionPartOrder = data => {
  const request = makeThePartApiService("actionPartOrder", data);
  return {
    type: PART_ORDER,
    payload: request
  };
};

export const actionUploadRevisionImage = data => {
  const url = AppConfig.API_URL_JAVA + "/api/v1/cloud/aws/upload";
  const config = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };
  const request = post(url, data, config);
  return {
    type: UPLOAD_REVISION,
    payload: request
  };
};

export const actionDeleteRevisionImage = filePath => {
  const request = makeThePartApiService("deleteAttachment", { filePath });
  return {
    type: DELETE_REVISION_IMAGE,
    payload: request
  };
};

export const actionReleasePOList = data => {
  const request = makeThePartApiService("releasePOList", data);
  return {
    type: RELEASE_PO_LIST,
    payload: request
  };
};

export const actionSubmitReleasePOList = data => {
  const request = makeThePartApiService("submitReleasePOList", data);
  return {
    type: SUBMIT_RELEASE_PO_LIST,
    payload: request
  };
};

export const actionApproveRejectOrder = data => {
  const request = makeThePartApiService("approveRejectOrder", data);
  return {
    type: APPROVE_REJECT_ORDER,
    payload: request
  };
};

export const actionSummaryPartStatus = data => {
  const request = makeThePartApiService("summaryPartStatus", data);
  return {
    type: SUMMARY_PART_STATUS,
    payload: request
  };
};

export const actiongetSupplierQuotationData = data => {
  const request = makeThePartApiService("getSupplierQuotationData", data);
  return {
    type: SUPPILER_QOUTION_DATA,
    payload: request
  };
};

export const actionAddSpecificationList = data => {
  const request = makeThePartApiService("addSpecificationList", data);
  return {
    type: ADD_SPECIFICATION_LIST,
    payload: request
  };
};

export const actionGetQuotationData = data => {
  const request = makeThePartApiService("getQuotationData", data);
  return {
    type: GET_QUOTATION_DATA,
    payload: request
  };
};

export const actionSummaryQuotationForPart = data => {
  const request = makeThePartApiService("actionSummaryQuotationForPart", data);
  return {
    type: SUMMARY_QUOTATION,
    payload: request
  };
};

export const actionGetUserList = data => {
  const request = makeThePartApiService("getAllAddedUser", data);
  return {
    type: GET_USER_LIST,
    payload: request
  };
};

export const actionGetPartHistory = data => {
  const request = makeThePartApiService("getPartHistory", data);
  return {
    type: PART_HISTORY,
    payload: request
  };
};

export const actionDashboardHistory = data => {
  const request = makeThePartApiService("getDashboardHistory", data);
  return {
    type: DASHBOARD_HISTORY,
    payload: request
  };
};

export const actionSaveApprovalLimit = data => {
  const request = makeThePartApiService("saveApprovalLimit", data);
  return {
    type: SAVE_APPROVAL_LIMIT,
    payload: request
  };
};

export const actionGetUserByGroup = data => {
  const request = makeThePartApiService("getUserByGroup", data);
  return {
    type: GET_USER_BY_GROUP,
    payload: request
  };
};

export const actionUpdateApprovalLimit = data => {
  const request = makeThePartApiService("updateApprovalLimit", data);
  return {
    type: UPDATE_APPROVAL_LIMIT,
    payload: request
  };
};

export const actionEditPartDetail = data => {
  const request = makeThePartApiService("editPartDetail", data);
  return {
    type: EDIT_PART_DETAIL,
    payload: request
  };
};

export const actionDeletePartDetail = data => {
  const request = makeThePartApiService("deletePartDetail", data);
  return {
    type: DELETE_PART_DETAIL,
    payload: request
  };
};

export const actionDeletePartDatabase = data => {
  const request = makeThePartApiService("deletePartDatabase", data);
  return {
    type: DELETE_PART_DATABASE,
    payload: request
  };
};

export const actionUpdatePart = data => {
  const request = makeThePartApiService("updatePart", data);
  return {
    type: UPDATE_PART,
    payload: request
  };
};

export const actionGetDiscloserData = data => {
  const request = makeThePartApiService("getDiscloserData", data);
  return {
    type: GET_DISCLOSER_DATA,
    payload: request
  };
};

export const actionApproveRejectNonDiscloser = data => {
  const request = makeThePartApiService("approveRejectNonDisclosure", data);
  return {
    type: APPROVE_REJECT_NON_DISCLOSURE,
    payload: request
  };
};
export const actionValueAnalysis = data => {
  const request = makeThePartApiService("valueAnalysis", data);
  return {
    type: VALUE_ANALYSIS,
    payload: request
  };
};

export const actionGetPartDetailsByPartNumber = data => {
  const request = makeThePartApiService("getPartDetailsByPartNumber", data);
  return {
    type: GET_PART_DETAILS,
    payload: request
  };
};

export const actionCommentDetail = data => {
  const request = makeThePartApiService("getCommentDetail", data);
  return {
    type: GET_COMMENT_DETAIL,
    payload: request
  };
};

export const actionSubmitComment = data => {
  const request = makeThePartApiService("submitComment", data);
  return {
    type: SUBMIT_COMMENT,
    payload: request
  };
};

export const actionPartNotification = data => {
  const request = makeThePartApiService("getPartNotification", data);
  return {
    type: GET_PART_NOTIFICATION,
    payload: request
  };
};

export const sendNotification = data => {
  return {
    type: SEND_NOTIFICATION,
    payload: data
  };
};

export const actionDeleteNotification = data => {
  const request = makeThePartApiService("clearNotification", data);
  return {
    type: CLEAR_NOTIFICATION,
    payload: request
  };
};

export const actionReadNotification = data => {
  const request = makeThePartApiService("readNotification", data);
  return {
    type: READ_NOTIFICATION,
    payload: request
  };
};
export const actionGetCommentsCount = data => {
  const request = makeThePartApiService("getCommentCount", data);
  return {
    type: GET_COMMENT_COUNT,
    payload: request
  };
};

