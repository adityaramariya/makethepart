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
  UPLOAD_REVISION,
  DELETE_REVISION_IMAGE,
  TAB_DATA,
  ADD_SPECIFICATION_LIST,
  SEND_NOTIFICATION
} from "./types";

import _ from "lodash";

const INITIAL_STATE = {
  projectList: [],
  newProject: {},
  uploadedDesignList: [],
  uploadedSpecificationList: [],
  partList: [],
  pendingApprovalList: [],
  summaryQuotationList: [],
  summaryReviewData: [],
  partDataById: {},
  summaryDataByTab: {},
  uploadedRevision: [],
  activeTab: "",
  notificationResponse: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PROJECT_LIST:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.projectList = action.payload.data.resourceData;
      }
      return Object.assign({}, state);

    case ADD_PROJECT:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.newProject = action.payload.data.resourceData;
      }
      return Object.assign({}, state);

    case UPLOAD_DESIGN:
      console.log("upload image ", action.payload);
      // contentType: "image/png"
      // filePath: "28-man-png-image-thumb.png"
      // fileSize: 34368
      // progressPercentage: -1
      // responseMessage: "File uploaded successfully."
      // s3FilePath: "28manpngimagethumb1531925115904.png"
      // s3ThumbnailFilePath: "28manpngimagethumb1531925115904.png"
      // status: 201
      // uploadStatus: "Completed"

      // "mediaName": "string",
      //     "mediaURL": "string",
      //     "mediaType": "string",
      //     "mediaSize": "string",
      //     "mediaExtension": "string"
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
        state.uploadedDesignList = [...state.uploadedDesignList, data];
      }
      return Object.assign({}, state);

    case UPLOAD_SPECIFICATION:
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
        state.uploadedSpecificationList = [
          ...state.uploadedSpecificationList,
          data
        ];
      }
      return Object.assign({}, state);

    case ADD_PARTS:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        let data = action.payload.data.resourceData;
        state.partList = [...state.partList, data];
      }
      return Object.assign({}, state);

    case CREATE_PART_WITH_MEDIA:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        let data = action.payload.data.resourceData;
        console.log(action.payload.data);

        state.partList = [...state.partList, ...data];
      }
      return Object.assign({}, state);

    // case ADD_SPECIFICATION_LIST:
    //   if (
    //     action.payload &&
    //     action.payload.data &&
    //     action.payload.data.resourceData
    //   ) {
    //     try {
    //       let data = action.payload.data.resourceData;
    //       if (data) {
    //         for (let index = 0; index < data.length; index++) {
    //           const element = data[index];
    //           if (state.partList) {
    //             for (
    //               let indexPartList = 0;
    //               indexPartList < state.partList.length;
    //               indexPartList++
    //             ) {
    //               // const partItem = state.partList[indexPartList];

    //               state.partList[
    //                 indexPartList
    //               ].listOfUnUsedSpecifications = state.partList &&
    //                 state.partList[indexPartList]
    //                   .listOfUnUsedSpecifications && [
    //                   ...(state.partList[indexPartList]
    //                     .listOfUnUsedSpecifications || []),
    //                   ...data[index].listOfUnUsedSpecifications
    //                 ];
    //               state.partList[
    //                 indexPartList
    //               ].listOfUnUsedSpecifications = _.uniqBy(
    //                 state.partList[indexPartList].listOfUnUsedSpecifications,
    //                 "mediaURL"
    //               );
    //             }
    //           }
    //         }
    //       }

    //       // state.partList = [...state.partList, ...data];
    //     } catch (error) {}
    //   }

    //   return Object.assign({}, state);

    case ADD_SPECIFICATION_LIST:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        try {
          let data = action.payload.data.resourceData;
          if (data) {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              if (state.partList) {
                for (
                  let indexPartList = 0;
                  indexPartList < state.partList.length;
                  indexPartList++
                ) {
                  // const partItem = state.partList[indexPartList];
                  let forEveryIndexPartList =
                    data[0].listOfUnUsedSpecifications &&
                    JSON.stringify(data[0].listOfUnUsedSpecifications);
                  state.partList[indexPartList].listOfUnUsedSpecifications =
                    forEveryIndexPartList && JSON.parse(forEveryIndexPartList);
                  /*state.partList && state.partList[indexPartList].listOfUnUsedSpecifications && [...(state.partList[indexPartList].listOfUnUsedSpecifications || []),
                    JSON.parse(forEveryIndexPartList)
                  ];*/

                  state.partList[
                    indexPartList
                  ].listOfUnUsedSpecifications = _.uniqBy(
                    state.partList[indexPartList].listOfUnUsedSpecifications,
                    "mediaURL"
                  );
                }
              } else {
              }
            }
          }

          // state.partList = [...state.partList, ...data];
        } catch (error) {
          console.log("inside catch ", error);
        }
      }

      return Object.assign({}, state);

    case CLEAR_ADD_PARTS_DATA:
      state.uploadedDesignList = [];
      state.uploadedSpecificationList = [];
      state.partList = [];
      return Object.assign({}, state);

    case APPROVE_REJECT_PART:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.approveRejectPart = action.payload.data.resourceData;
      }
      return Object.assign({}, state);

    case PENDING_APPROVAL_PART_LIST:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData &&
        action.payload.data.resourceData.list
      ) {
        let data =  action.payload.data.resourceData.list;
        console.log(action.payload.data.list);

        state.pendingApprovalList = [...data];
      }
      return Object.assign({}, state);

    case SUMMARY_QUOTATION_LIST:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.summaryQuotationList = action.payload.data.resourceData;
      }
      return Object.assign({}, state);

    case SUMMARY_REVIEW_DATA:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.summaryReviewData = action.payload.data.resourceData;
      }
      return Object.assign({}, state);

    case PART_ID_FOR_REVIEW:
      if (action.payload) {
        state.partDataById = action.payload;
      }
      return Object.assign({}, state);

    case SUMMARY_DATA_BY_TAB:
      if (action.payload) {
        state.summaryDataByTab = action.payload;
      }
      return Object.assign({}, state);

    case UPLOAD_REVISION:
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
        state.uploadedRevision = [...state.uploadedRevision, data];
      }
      return Object.assign({}, state);

    case DELETE_REVISION_IMAGE:
      if (action.payload) {
        state.uploadedRevision = delete state.uploadedRevision[0];
      }
      return Object.assign({}, state);

    case TAB_DATA:
      if (action.payload) {
        state.activeTab = action.payload;
      }
      return Object.assign({}, state);

    case SEND_NOTIFICATION:
      if (action.payload) {
        state.notificationResponse = action.payload;
      }
      return Object.assign({}, state);

    default:
      return state;
  }
};
