import { PART_LIST_FOR_QUOTATION } from "./types";
import { SUBMIT_QUOTATION } from "./types";
import { PENDING_APPROVAL_PART_LIST } from "./types";
import { APPROVE_REJECT_QUOTATION } from "./types";
import { UPLOAD_PICTURE } from "./types";
import { UPLOAD_REPORT } from "./types";
import { UPLOAD_PERFORMA_INVOICE } from "./types";
import { UPLOAD_STAMP } from "./types";
import { UPLOAD_FINAL_INVOICE } from "./types";
import { TAB_CLICK } from "./types";
import customConstant from "../../common/core/constants/customConstant";
const INITIAL_STATE = {
  uploadedFinalInvoiceList: [],
  partDataForQuotation: {},
  uploadedPictureList: [],
  uploadedStampList: [],
  uploadedPerformaInvoiceList: [],
  uploadedReportList: [],
  uploadedPictureList: [],
  activeTab: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PART_LIST_FOR_QUOTATION:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.partListForQuotation = action.payload.data.resourceData;
      }
      return Object.assign({}, state);

    case SUBMIT_QUOTATION:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.submitQuotationResponse = action.payload.data.resourceData;
      }
      return Object.assign({}, state);

    case PENDING_APPROVAL_PART_LIST:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        let data = action.payload.data.resourceData;
        console.log(action.payload.data);

        state.pendingApprovalList = [...data];
      }
      return Object.assign({}, state);

    case APPROVE_REJECT_QUOTATION:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.approveRejectPart = action.payload.data.resourceData;
      }
      return Object.assign({}, state);

    case UPLOAD_PICTURE:
      console.log("upload picture ", action.payload);
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.s3FilePath
      ) {
        const response = action.payload.data;
        let extension = response.filePath.split(".");
        extension = extension[extension.length - 1];
        let data = {
          mediaName: response.filePath,
          mediaURL: customConstant.amazonURL + response.s3FilePath,
          mediaType: response.contentType,
          mediaSize: response.fileSize,
          mediaExtension: extension,
          mediaThumbnailUrl:
            customConstant.amazonURL + response.s3ThumbnailFilePath
        };
        state.uploadedPictureList = [...state.uploadedPictureList, data];
      }
      return Object.assign({}, state);

    case UPLOAD_REPORT:
      console.log("upload report ", action.payload);
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.s3FilePath
      ) {
        const response = action.payload.data;
        let extension = response.filePath.split(".");
        extension = extension[extension.length - 1];
        let data = {
          mediaName: response.filePath,
          mediaURL: response.s3FilePath,
          mediaType: response.contentType,
          mediaSize: response.fileSize,
          mediaExtension: extension
        };
        state.uploadedReportList = [...state.uploadedReportList, data];
      }
      return Object.assign({}, state);

    case UPLOAD_PERFORMA_INVOICE:
      console.log("upload per invoice ", action.payload);
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.s3FilePath
      ) {
        const response = action.payload.data;
        let extension = response.filePath.split(".");
        extension = extension[extension.length - 1];
        let data = {
          mediaName: response.filePath,
          mediaURL: response.s3FilePath,
          mediaType: response.contentType,
          mediaSize: response.fileSize,
          mediaExtension: extension
        };
        state.uploadedPerformaInvoiceList = [
          ...state.uploadedPerformaInvoiceList,
          data
        ];
      }
      return Object.assign({}, state);

    case UPLOAD_STAMP:
      console.log("upload stamp ", action.payload);
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.s3FilePath
      ) {
        const response = action.payload.data;
        let extension = response.filePath.split(".");
        extension = extension[extension.length - 1];
        let data = {
          mediaName: response.filePath,
          mediaURL: response.s3FilePath,
          mediaType: response.contentType,
          mediaSize: response.fileSize,
          mediaExtension: extension
        };
        state.uploadedStampList = [...state.uploadedStampList, data];
      }
      return Object.assign({}, state);

    case UPLOAD_FINAL_INVOICE:
      console.log("upload final invoice ", action.payload);
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.s3FilePath
      ) {
        const response = action.payload.data;
        let extension = response.filePath.split(".");
        extension = extension[extension.length - 1];
        let data = {
          mediaName: response.filePath,
          mediaURL: response.s3FilePath,
          mediaType: response.contentType,
          mediaSize: response.fileSize,
          mediaExtension: extension
        };
        state.uploadedFinalInvoiceList = [
          ...state.uploadedFinalInvoiceList,
          data
        ];
      }
      return Object.assign({}, state);

    case TAB_CLICK:
      if (action.payload) {
        state.activeTab = action.payload;
      }
      return Object.assign({}, state);

    default:
      return state;
  }
};
