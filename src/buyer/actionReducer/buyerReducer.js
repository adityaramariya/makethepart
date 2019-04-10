import { GET_DEPARTMENT_LIST, GET_CLASSIFICATION } from './types';

import _ from 'lodash';
const INITIAL_STATE = {
  projectList: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_DEPARTMENT_LIST:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.projectList = action.payload.data.resourceData;
      }
      return Object.assign({}, state);

    case GET_CLASSIFICATION:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        let purchaseResponse = action.payload.data.resourceData;
        state.listOfDepartment = purchaseResponse.listOfDepartment;
        state.listOfBrands = purchaseResponse.listOfBrands;
        state.listOfMajorCategory = purchaseResponse.listOfCategory;
        state.listOfAddress = purchaseResponse.listOfAddress;
        state.listOfGlobalRegions = purchaseResponse.listOfGlobalRegions;
        state.listOfSectorCategory = purchaseResponse.listOfProductLine;
        state.listOfFunctionalArea = purchaseResponse.listOfDepartment;
      }
      return Object.assign({}, state);

    default:
      return state;
  }
};
