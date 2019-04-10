import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Provider, connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ZoomInAndOut } from "../commonFunctions";

import Authorization from "../authorization";
import BuyerView from "../../buyer";
import ErrorPage from "../../common/error/error";
// import Landing from '../landing/landing';
import SupplierView from "../../supplier";

class MakeThePartRoute extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return [
      <ToastContainer
        autoClose={3000}
        className="custom-toaster-main-cls"
        toastClassName="custom-toaster-bg"
        transition={ZoomInAndOut}
      />,
      <div className={`loader-container ${this.props.loader ? "" : "hide"}`}>
        <div className="loader">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
      </div>,
      <BrowserRouter>
        <Provider store={this.props.store}>
          <Switch>
            <Redirect
              exact
              from="/"
              to={{
                pathname: "/buyer/signin"
              }}
            />
            {/* <Route exact path="/" component={Landing} /> */}
            {/* <Route path="/signin" component={Authorization} /> */}
            <Route path="/buyer/signup" component={Authorization} />
            <Route path="/supplier/signup" component={Authorization} />
            {/* <Route path="/buyer/signupsuccess" component={Authorization} /> */}
            {/* <Route path="/supplier/signupsuccess" component={Authorization} /> */}
            <Route path="/buyer" component={BuyerView} />
            <Route path="/supplier" component={SupplierView} />
            <Route path="*" component={ErrorPage} />
          </Switch>
        </Provider>
      </BrowserRouter>
    ];
  }
}

// const mapDispatchToProps = dispatch => {
//   return bindActionCreators({ actionGetApproverList, actionUserLogout, actionGenerateOTPToAddUser, actionSupplierAddUser }, dispatch);
// };

const mapStateToProps = state => {
  return {
    loader: state.Common.loader
  };
};

export default connect(
  mapStateToProps,
  null
)(MakeThePartRoute);
