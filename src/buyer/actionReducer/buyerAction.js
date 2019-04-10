import { post } from 'axios';
import AppConfig from '../../common/core/config/appConfig';
import {
  GET_PURCHASE_CATEGORY_DATA,
  GET_PROJECT_LIST_FOR_INDIRECT_PURCHASE,
  GET_PART_LIST_BY_PROJECT,
  UPLOAD_SPECIFICATION_FOR_INDIRECT,
  UPLOAD_STATEMENT_OF_WORK__FOR_INDIRECT,
  SUBMIT_INDIRECT_PURCHASE,
  CHECK_ACC_NO,
  GET_LIST_OF_INDIRECT_PURCHASE,
  GET_DELETE_OF_INDIRECT_PURCHASE,
  SAVE_PURCHASE_DATA,
  BUDGET_ONE,
  UPLOAD_BUDGET_DOCUMENT,
  CREATE_ECO,
  GET_ECO_DROPDOWN_DATA,
  CREATE_GEOGRAPHICAL,
  GET_GEOGRAPHICAL,
  DELETE_GEOGRAPHICAL,
  GET_BUILD_PLAN_DATA,
  CREATE_BUILD_PLAN_DATA,
  GET_ECO_PART_DROPDOWN_DATA,
  GET_BOM_BUILD_PLAN_DROPDOWN_DATA,
  UPDATE_BUILD_PLAN_DATA,
  GET_APPROVER_BUILD_PLAN_DATA,
  ADD_APPROVER_BUILD_PLAN_DATA,
  ADD_COMMENT_REVISION_DATA,
  GET_REGION_SUBREGION_COUNTRY,
  CREATE_CLASSIFICATION,
  GET_ALL_PROJECT_DATA,
  CREATE_SPENDING_CATEGORY,
  GET_SPENDING_CATEGORY,
  DELETE_SPENDING_CATEGORY,
  CREATE_FUNCTIONAL_AREA,
  GET_FUNCTIONAL_AREA,
  DELETE_FUNCTIONAL_AREA,
  CREATE_PRODUCT_COST,
  GET_PRODUCT_COST,
  DELETE_PRODUCT_COST,
  CREATE_BRAND_COST,
  GET_BRAND_COST,
  DELETE_BRAND_COST,
  GET_BOM_VARIANT_DATA,
  GET_BOM_SUB_VARIANT_DATA,
  CREATE_FINANCIAL,
  GET_FINANCIAL,
  GET_PRODUCT_LINE,
  GET_MODEL_FAMILY,
  CREATE_LOCATION,
  GET_LOCATION,
  GET_PART_BY_KEYWORD,
  DELETE_PURCHASE_CATEGORY_DATA,
  GET_CLASSIFICATION,
  GET_BOM_CALCULATION_DATA,
  UPDATE_BOM_DATA,
  GET_FILTER_BOM_DATA,
  GET_SUGGESSION,
  GET_ACCOUNT_NUMBER,
  GET_SUGGESSION_FILTER_DATA,
  GET_WHERE_USED_DATA,
  GET_FIND_ALL_BOM_DATA,
  DELETE_BUDGET,
  GET_BUDGET,
  SET_BUDGET_APPROVAL,
  SAVE_BUDGET_REVISION_DATA,
  GET_SUGGESSION_USER,
  
} from './types';

import makeThePartApiService from '../../common/core/api/apiService';

export const actionGetPurchaseCategoryData = data => {
  const request = makeThePartApiService('getPurchaseData', data);
  return {
    type: GET_PURCHASE_CATEGORY_DATA,
    payload: request
  };
};

export const actionGetProjectListForIndirectPurchase = data => {
  const request = makeThePartApiService(
    'getProjectListForIndirectPurchase',
    data
  );
  return {
    type: GET_PROJECT_LIST_FOR_INDIRECT_PURCHASE,
    payload: request
  };
};

export const actionGetPartListForIndirectPurchase = data => {
  const request = makeThePartApiService('getPartListByProject', data);
  return {
    type: GET_PART_LIST_BY_PROJECT,
    payload: request
  };
};

export const actionUploadSpecificationForIndirect = data => {
  const url = AppConfig.API_URL_JAVA + '/api/v1/cloud/aws/upload';
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  const request = post(url, data, config);
  return {
    type: UPLOAD_SPECIFICATION_FOR_INDIRECT,
    payload: request
  };
};

export const actionUploadStatementOfWorkForIndirect = data => {
  const url = AppConfig.API_URL_JAVA + '/api/v1/cloud/aws/upload';
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  const request = post(url, data, config);
  return {
    type: UPLOAD_STATEMENT_OF_WORK__FOR_INDIRECT,
    payload: request
  };
};

export const actionSubmitIndirectPurchase = data => {
  const request = makeThePartApiService('submitIndirectPurchase', data);
  return {
    type: SUBMIT_INDIRECT_PURCHASE,
    payload: request
  };
};

export const actionCheckAccountNo = data => {
  const request = makeThePartApiService('checkAccountNo', data);
  return {
    type: CHECK_ACC_NO,
    payload: request
  };
};

export const actionGetListOfIndirectPurchase = data => {
  const request = makeThePartApiService('getListOfIndirectPurchase', data);
  return {
    type: GET_LIST_OF_INDIRECT_PURCHASE,
    payload: request
  };
};

export const actionDeleteOfIndirectPurchase = data => {
  const request = makeThePartApiService('deleteOfIndirectPurchase', data);
  return {
    type: GET_DELETE_OF_INDIRECT_PURCHASE,
    payload: request
  };
};

export const actionSavePurchaseData = data => {
  const request = makeThePartApiService('savePurchaseData', data);
  return {
    type: SAVE_PURCHASE_DATA,
    payload: request
  };
};

export const actionGetRevisionUsers = data => {
  const request = makeThePartApiService('getListOfRevisionUsers', data);
  return {
    type: BUDGET_ONE,
    payload: request
  };
};

export const actionSaveBudgetOne = data => {
  const request = makeThePartApiService('savebudgetOneData', data);
  return {
    type: BUDGET_ONE,
    payload: request
  };
};

export const actionUploadBudgetDocumentse = data => {
  const url = AppConfig.API_URL_JAVA + '/api/v1/cloud/aws/upload';
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  const request = post(url, data, config);
  return {
    type: UPLOAD_BUDGET_DOCUMENT,
    payload: request
  };
};

export const actionCreateECO = data => {
  const request = makeThePartApiService('createECOData', data);
  return {
    type: CREATE_ECO,
    payload: request
  };
};

export const actionECODropDownData = data => {
  const request = makeThePartApiService('getECODropDownData', data);
  return {
    type: GET_ECO_DROPDOWN_DATA,
    payload: request
  };
};

export const actionSaveGeographical = data => {
  const request = makeThePartApiService('saveGeographicalData', data);
  return {
    type: CREATE_GEOGRAPHICAL,
    payload: request
  };
};

export const actionGetGeographical = data => {
  const request = makeThePartApiService('getGeographicalData', data);
  return {
    type: GET_GEOGRAPHICAL,
    payload: request
  };
};

export const actionDeleteGetGeographical = data => {
  const request = makeThePartApiService('deleteGeographicalData', data);
  return {
    type: DELETE_GEOGRAPHICAL,
    payload: request
  };
};

export const actionGetBuildPlanData = data => {
  const request = makeThePartApiService('getBuildPlanData', data);
  return {
    type: GET_BUILD_PLAN_DATA,
    payload: request
  };
};

export const actionCreateBuildPlanData = data => {
  const request = makeThePartApiService('createBuildPlanData', data);
  return {
    type: CREATE_BUILD_PLAN_DATA,
    payload: request
  };
};

export const actionECOPartDropDownData = data => {
  const request = makeThePartApiService('getECOPartDropDownData', data);
  return {
    type: GET_ECO_PART_DROPDOWN_DATA,
    payload: request
  };
};

export const actionBOMBuildPlanDropDownData = data => {
  const request = makeThePartApiService('getBOMBuildPlanDropDownData', data);
  return {
    type: GET_BOM_BUILD_PLAN_DROPDOWN_DATA,
    payload: request
  };
};

export const actionUpdateBuildPlanData = data => {
  const request = makeThePartApiService('updateBuildPlanData', data);
  return {
    type: UPDATE_BUILD_PLAN_DATA,
    payload: request
  };
};

export const actionGetApproverData = data => {
  const request = makeThePartApiService('getApproverData', data);
  return {
    type: GET_APPROVER_BUILD_PLAN_DATA,
    payload: request
  };
};

export const actionAddApproverUser = data => {
  const request = makeThePartApiService('addApproverUser', data);
  return {
    type: ADD_APPROVER_BUILD_PLAN_DATA,
    payload: request
  };
};

export const actionAddCommentRevision = data => {
  const request = makeThePartApiService('addCommentOfRevision', data);
  return {
    type: ADD_COMMENT_REVISION_DATA,
    payload: request
  };
};

export const actionGetRegionDetails = data => {
  const request = makeThePartApiService('getRegionDetails', data);
  return {
    type: GET_REGION_SUBREGION_COUNTRY,
    payload: request
  };
};

export const actionSaveClassification = data => {
  const request = makeThePartApiService('saveClassificationData', data);
  return {
    type: CREATE_CLASSIFICATION,
    payload: request
  };
};

export const actionGetAllProjectData = data => {
  const request = makeThePartApiService('getAllProjectList', data);
  return {
    type: GET_ALL_PROJECT_DATA,
    payload: request
  };
};

export const actionSaveSpendingCategory = data => {
  const request = makeThePartApiService('saveSpendingCategoryData', data);
  return {
    type: CREATE_SPENDING_CATEGORY,
    payload: request
  };
};

export const actionGetSpendingCategory = data => {
  const request = makeThePartApiService('getSpendingCategoryData', data);
  return {
    type: GET_SPENDING_CATEGORY,
    payload: request
  };
};

export const actionDeleteSpendingCategory = data => {
  const request = makeThePartApiService('deleteSpendingCategoryData', data);
  return {
    type: DELETE_SPENDING_CATEGORY,
    payload: request
  };
};

export const actionSaveFunctionalArea = data => {
  const request = makeThePartApiService('saveFunctionalAreaData', data);
  return {
    type: CREATE_FUNCTIONAL_AREA,
    payload: request
  };
};

export const actionGetFunctionalArea = data => {
  const request = makeThePartApiService('getFunctionalAreaData', data);
  return {
    type: GET_FUNCTIONAL_AREA,
    payload: request
  };
};

export const actionDeleteFunctionalArea = data => {
  const request = makeThePartApiService('deleteFunctionalAreaData', data);
  return {
    type: DELETE_FUNCTIONAL_AREA,
    payload: request
  };
};

export const actionSaveProductCost = data => {
  const request = makeThePartApiService('saveProductCostData', data);
  return {
    type: CREATE_PRODUCT_COST,
    payload: request
  };
};

export const actionGetProductCost = data => {
  const request = makeThePartApiService('getProductCostData', data);
  return {
    type: GET_PRODUCT_COST,
    payload: request
  };
};

export const actionDeleteProductCost = data => {
  const request = makeThePartApiService('deleteProductCostData', data);
  return {
    type: DELETE_PRODUCT_COST,
    payload: request
  };
};

export const actionSaveBrandCost = data => {
  const request = makeThePartApiService('saveBrandCostData', data);
  return {
    type: CREATE_BRAND_COST,
    payload: request
  };
};

export const actionGetBrandCost = data => {
  const request = makeThePartApiService('getBrandCostData', data);
  return {
    type: GET_BRAND_COST,
    payload: request
  };
};

export const actionDeleteBrandCost = data => {
  const request = makeThePartApiService('deleteBrandCostData', data);
  return {
    type: DELETE_BRAND_COST,
    payload: request
  };
};

export const actionBOMVariantData = data => {
  const request = makeThePartApiService('getBOMVariantData', data);
  return {
    type: GET_BOM_VARIANT_DATA,
    payload: request
  };
};

export const actionBOMSubVariantData = data => {
  const request = makeThePartApiService('getBOMSubVariantData', data);
  return {
    type: GET_BOM_SUB_VARIANT_DATA,
    payload: request
  };
};

export const actionSaveFinancialYear = data => {
  const request = makeThePartApiService('saveFinancialYearData', data);
  return {
    type: CREATE_FINANCIAL,
    payload: request
  };
};

export const actionGetFinancialYear = data => {
  const request = makeThePartApiService('getFinancialYearData', data);
  return {
    type: GET_FINANCIAL,
    payload: request
  };
};

export const actionGetModelFamily = data => {
  const request = makeThePartApiService('getModelFamilyData', data);
  return {
    type: GET_MODEL_FAMILY,
    payload: request
  };
};

export const actionGetProductData = data => {
  console.log('actionGetProductLine---', data);
  const request = makeThePartApiService('getProductLineData', data);
  return {
    type: GET_PRODUCT_LINE,
    payload: request
  };
};

export const actionSaveLocation = data => {
  const request = makeThePartApiService('saveLocationData', data);
  return {
    type: CREATE_LOCATION,
    payload: request
  };
};

export const actionGetLocation = data => {
  const request = makeThePartApiService('getLocationData', data);
  return {
    type: GET_LOCATION,
    payload: request
  };
};

export const actionSearchPartByKeyword = data => {
  const request = makeThePartApiService('getPartByKeyword', data);
  return {
    type: GET_PART_BY_KEYWORD,
    payload: request
  };
};

export const actionGetClassifications = data => {
  const request = makeThePartApiService('getClassificationsData', data);
  return {
    type: GET_CLASSIFICATION,
    payload: request
  };
};

export const actionGetDiscription = data => {
  const request = makeThePartApiService('getDescriptionData', data);
  return {
    type: GET_PURCHASE_CATEGORY_DATA,
    payload: request
  };
};
export const actionDeletePurchaseData = data => {
  const request = makeThePartApiService('deletePurchaseData', data);
  return {
    type: DELETE_PURCHASE_CATEGORY_DATA,
    payload: request
  };
};

export const actionGetBOMCalculationData = data => {
  const request = makeThePartApiService('getBOMCalculationData', data);
  return {
    type: GET_BOM_CALCULATION_DATA,
    payload: request
  };
};

export const actionUpdateBOMData = data => {
  const request = makeThePartApiService('updateBOMData', data);
  return {
    type: UPDATE_BOM_DATA,
    payload: request
  };
};

export const actionGetBOMFilterData = data => {
  const request = makeThePartApiService('getBOMECOFilter', data);
  return {
    type: GET_FILTER_BOM_DATA,
    payload: request
  };
};
export const actionSuggessionData = data => {
  const request = makeThePartApiService('getSuggessionData', data);
  return {
    type: GET_SUGGESSION,
    payload: request
  };
};
export const actionAccountNumberData = data => {
  const request = makeThePartApiService('getAccountNumberData', data);
  return {
    type: GET_ACCOUNT_NUMBER,
    payload: request
  };
};
export const actionGetBudgetExtraData = data => {
  const request = makeThePartApiService('getBudgetExtraData', data);
  return {
    type: GET_ACCOUNT_NUMBER,
    payload: request
  };
};
export const actuionGetSuggessionFilterData = data => {
  const request = makeThePartApiService('getSuggessionFilterData', data);
  return {
    type: GET_SUGGESSION_FILTER_DATA,
    payload: request
  };
};
export const actuionGetWhereUsedData = data => {
  const request = makeThePartApiService('getWhereUsedData', data);
  return {
    type: GET_WHERE_USED_DATA,
    payload: request
  };
};
export const actuionGetFindAllBOMData = data => {
  const request = makeThePartApiService('getFindAllBOMData', data);
  return {
    type: GET_FIND_ALL_BOM_DATA,
    payload: request
  };
};

export const actionDeleteOfBudget = data => {
  const request = makeThePartApiService('deleteOfBudget', data);
  return {
    type: DELETE_BUDGET,
    payload: request
  };
};
export const actionGetBudgetData = data => {
  const request = makeThePartApiService('getBudgetData', data);
  return {
    type: GET_BUDGET,
    payload: request
  };
};

export const actionSetBudgetApprovalData = data => {
  const request = makeThePartApiService('setBudgetApprovalData', data);
  return {
    type: SET_BUDGET_APPROVAL,
    payload: request
  };
};

export const actionSaveBudgetRevisionData = data => {
  const request = makeThePartApiService('saveBudgetRevisionData', data);
  return {
    type: SAVE_BUDGET_REVISION_DATA,
    payload: request
  };
};

export const actuionGetSuggessionFilterUserList = data => {
  const request = makeThePartApiService('getSuggessionUserData', data);
  return {
    type: GET_SUGGESSION_USER,
    payload: request
  };
};
