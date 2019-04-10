import { combineReducers } from "redux";

// Common Reducers
import Common from "./reducerCommon";
import User from "../../../authorization/authorizationReducer";

//Supplier Reducers
import supplierUsers from "../../../users/userReducer";
import supplierParts from "../../../../buyer/parts/partReducer";
import supplierData from "../../../../supplier/parts/partReducer";
import BuyerData from "../../../../buyer/actionReducer/buyerReducer";

const appReducer = combineReducers({
  state: (state = {}) => state,
  User,
  supplierUsers,
  Common,
  supplierParts,
  supplierData,
  BuyerData
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
