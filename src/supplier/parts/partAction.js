import { post } from 'axios';
import AppConfig from '../../common/core/config/appConfig';
import { PART_LIST_FOR_QUOTATION } from './types';
import { SUBMIT_QUOTATION } from './types';
import { PENDING_APPROVAL_PART_LIST } from './types';
import { APPROVE_REJECT_QUOTATION } from './types';
import { DELETE_PART } from './types';
import { UPDATE_PART_STATUS } from './types';
import { SUBMIT_RELEASE_PO_LIST_SUPPLIER } from './types';
import { UPLOAD_PICTURE } from './types';
import { UPLOAD_REPORT } from './types';
import { UPLOAD_PERFORMA_INVOICE } from './types';
import { UPLOAD_STAMP } from './types';
import { UPLOAD_FINAL_INVOICE } from './types';
import { TAB_CLICK } from './types';
import { UPDATE_PPAP_DOCUMENTS } from './types';
import { UPLOAD_MISCELLANEOUS_DOCUMENTS } from './types';
import { SEARCH_QUOTATION_DATA } from './types';
import { UPDATE_QUOTATION } from './types';
import { GET_BUYER_DETAILS } from './types';
import { SUBMIT_VENDOR } from './types';
import { UPLOAD_DOC } from './types';
import { DELETE_DOC } from './types';
import { SAVE_AUDIT } from './types';
import { UPLOAD_UPDATE } from './types';
import { GET_BUSINESS_DETAILS } from './types';
import { UPLOAD_TESTIMONIAL } from './types';

import makeThePartApiService from '../../common/core/api/apiService';

export const actionPartListForQuotation = data => {
  const request = makeThePartApiService('partListForQuotation', data);
  return {
    type: PART_LIST_FOR_QUOTATION,
    payload: request
  };
};

export const actionSubmitQuotation = data => {
  const request = makeThePartApiService('actionSubmitQuotation', data);
  return {
    type: SUBMIT_QUOTATION,
    payload: request
  };
};

export const actionPendingApprovalPartList = data => {
  const request = makeThePartApiService('pendingApprovalPartList', data);
  return {
    type: PENDING_APPROVAL_PART_LIST,
    payload: request
  };
};

export const approveRejectQuotation = data => {
  const request = makeThePartApiService('approveRejectQuotation', data);
  return {
    type: APPROVE_REJECT_QUOTATION,
    payload: request
  };
};
export const actionDeletePart = data => {
  const request = makeThePartApiService('actionDeletePart', data);
  return {
    type: DELETE_PART,
    payload: request
  };
};
export const actionUpdatePartStatus = data => {
  const request = makeThePartApiService('updatePartStatus', data);
  return {
    type: UPDATE_PART_STATUS,
    payload: request
  };
};

export const actionSubmitReleasePOListSupplier = data => {
  const request = makeThePartApiService('submitReleasePOListSupplier', data);
  return {
    type: SUBMIT_RELEASE_PO_LIST_SUPPLIER,
    payload: request
  };
};

export const actionUploadPicture = data => {
  const url = AppConfig.API_URL_JAVA + '/api/v1/cloud/aws/upload';
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  const request = post(url, data, config);
  console.log('multipart - ', data);
  return {
    type: UPLOAD_PICTURE,
    payload: request
  };
};

export const handleUploadReport = data => {
  const url = AppConfig.API_URL_JAVA + '/api/v1/cloud/aws/upload';
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  const request = post(url, data, config);
  return {
    type: UPLOAD_REPORT,
    payload: request
  };
};

export const actionUploadPerformaInvoice = data => {
  const url = AppConfig.API_URL_JAVA + '/api/v1/cloud/aws/upload';
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  const request = post(url, data, config);
  return {
    type: UPLOAD_PERFORMA_INVOICE,
    payload: request
  };
};

export const actionUploadStamp = data => {
  const url = AppConfig.API_URL_JAVA + '/api/v1/cloud/aws/upload';
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  const request = post(url, data, config);
  return {
    type: UPLOAD_STAMP,
    payload: request
  };
};

export const actionUploadFinalInvoice = data => {
  const url = AppConfig.API_URL_JAVA + '/api/v1/cloud/aws/upload';
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  const request = post(url, data, config);
  return {
    type: UPLOAD_FINAL_INVOICE,
    payload: request
  };
};

export const actionTabClick = data => {
  return {
    type: TAB_CLICK,
    payload: data
  };
};

export const actionUploadMiscellaneousDocumentse = data => {
  const url = AppConfig.API_URL_JAVA + '/api/v1/cloud/aws/upload';
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  const request = post(url, data, config);
  return {
    type: UPLOAD_MISCELLANEOUS_DOCUMENTS,
    payload: request
  };
};

export const actionSubmitPPAPDocuments = data => {
  const request = makeThePartApiService('submitPPAPDocuments', data);
  return {
    type: UPDATE_PPAP_DOCUMENTS,
    payload: request
  };
};

export const actionUpdatePPAPDocuments = data => {
  const request = makeThePartApiService('updatePPAPDocuments', data);
  return {
    type: UPDATE_PPAP_DOCUMENTS,
    payload: request
  };
};

export const actionUpdatePPAPOtherDocuments = data => {
  const request = makeThePartApiService('updatePPAPOtherDocuments', data);
  return {
    type: UPDATE_PPAP_DOCUMENTS,
    payload: request
  };
};

export const actionGetPPAPDocuments = data => {
  const request = makeThePartApiService('getPPAPDocuments', data);
  return {
    type: UPDATE_PPAP_DOCUMENTS,
    payload: request
  };
};

export const actionSearchQuotation = data => {
  const request = makeThePartApiService('searchQuotationData', data);
  return {
    type: SEARCH_QUOTATION_DATA,
    payload: request
  };
};

export const actionUpdateQuotation = data => {
  const request = makeThePartApiService('updateQuotation', data);
  return {
    type: UPDATE_QUOTATION,
    payload: request
  };
};

export const actionGetBuyerDetails = data => {
  const request = makeThePartApiService('getBuyerDetails', data);
  return {
    type: GET_BUYER_DETAILS,
    payload: request
  };
};

export const actionSubmitVendor = data => {
  const request = makeThePartApiService('submitVendor', data);
  return {
    type: SUBMIT_VENDOR,
    payload: request
  };
};

export const actionUploadDoc = data => {
  const url = AppConfig.API_URL_JAVA + '/api/v1/cloud/aws/upload';
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  const request = post(url, data, config);
  return {
    type: UPLOAD_DOC,
    payload: request
  };
};

export const actionDeleteDoc = filePath => {
  const request = makeThePartApiService('deleteAttachment', { filePath });
  return {
    type: DELETE_DOC,
    payload: request
  };
};

export const actionSaveAuditData = data => {
  const request = makeThePartApiService('saveAudit', data);
  return {
    type: SAVE_AUDIT,
    payload: request
  };
};

export const actionGetBusinessDetails = data => {
  const request = makeThePartApiService('getBusinessDetails', data);
  return {
    type: GET_BUSINESS_DETAILS,
    payload: request
  };
};

export const actionUploadTestimonal = data => {
  const request = makeThePartApiService('uploadTestimonial', data);
  return {
    type: UPLOAD_TESTIMONIAL,
    payload: request
  };
};
