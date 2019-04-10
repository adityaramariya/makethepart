import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import AddUser from '../common/users/addUser';
import AddUser from "./users/addUser";
// import AddPart from "../supplier/parts/addPart";
import Authorization from "../common/authorization";
import Home from "../supplier/home/home";
import Quotation from "../supplier/quotation/quotation";
import CreateQuotation from "../supplier/quotation/createQuotation";
import OtpVerification from "../common/authorization/otpVerfication";
import SignUpSuccess from "../common/authorization/singUpSuccess";
import CreateQuotPreview from "../supplier/quotation/createQuotationPreview.js";
import UpdatePartStatus from "./parts/updatePartStatus";
import PPAPDocuments from "../supplier/ppap/ppapDocuments";
import Vendor from "./vendor/vendor";
import InfrastructureAudit from "./audit/infrastructureAudit";
import BusinessDetails from "./businessDetails/businessDetails";
import { userInfo } from "os";
import { stat } from "fs";
import ResetPassword from "../common/authorization/resetPassword";
import EditUser from "../common/users/editUser";
import UserProfile from "../common/users/userProfile";
import SupplierCriteria from "./criteria/supplierCriteria";
import {
  actionUserLogout,
  actionCheckToken,
  actionLoaderHide
} from "../common/core/redux/actions";
class SupplierView extends Component {
  constructor(props) {
    super(props);
    this.allowedPath = [
      "/supplier/signin",
      "/supplier/singup",
      "/supplier/otpVerification",
      "/supplier/signupsuccess",
      "/supplier/resetPassword"
    ];
    this.checkValidAccessOfPages = this.checkValidAccessOfPages.bind(this);
    this.checkTokenByAPI = this.checkTokenByAPI.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  checkValidAccessOfPages(_props) {
    let _this = this;
    if (this.allowedPath.indexOf(this.props.location.pathname) == -1) {
      try {
        if (_props.userInfo.userData.userRole !== 2)
          this.props.history.push("/");
      } catch (error) {
        _this.props.history.push("/");
      }
    }
  }
  componentDidMount() {
    if (this.props.userInfo.userData.id) {
      this.checkTokenByAPI();
      setInterval(this.checkTokenByAPI, 30000);
    }
  }

  handleLogout() {
    try {
      const roleId = this.props.userInfo.userData.userRole;
      const userId = this.props.userInfo.userData.id;
      this.props.actionUserLogout({ roleId, userId });
    } catch (error) {}
  }
  async checkTokenByAPI() {
    console.log("checkTokenByAPI");
    let _this = this;
    let data = [];
    try {
      this.props
        .actionCheckToken(data)
        .then((response, error) => {
          if (response.payload.data.resourceData) {
          } else {
            _this.handleLogout();
          }
        })
        .catch(e => this.props.actionLoaderHide());
    } catch (error) {
      this.props.history.push("/");
    }
  }
  componentWillMount() {
    this.checkValidAccessOfPages(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log("will recieve props ", nextProps);
    this.checkValidAccessOfPages(nextProps);
  }

  render() {
    return (
      <Switch>
        <Route
          exact
          path={`${this.props.match.path}/signin`}
          component={Authorization}
        />
        <Route
          path={`${this.props.match.path}/signup`}
          component={Authorization}
        />
        <Route
          exact
          path={`${this.props.match.path}/signupsuccess`}
          component={Authorization}
        />
        <Route
          exact
          path={`${this.props.match.path}/otpVerification`}
          component={Authorization}
        />
        <Route exact path={`${this.props.match.path}/home`} component={Home} />
        <Route
          exact
          path={`${this.props.match.path}/adduser`}
          component={AddUser}
        />
        <Route
          exact
          path={`${this.props.match.path}/quotation`}
          component={Quotation}
        />
        <Route
          exact
          path={`${this.props.match.path}/updatePartStatus`}
          component={UpdatePartStatus}
        />
        <Route
          exact
          path={`${this.props.match.path}/ppap`}
          component={PPAPDocuments}
        />
        <Route
          exact
          path={`${this.props.match.path}/createQuotation`}
          component={CreateQuotation}
        />
        <Route
          exact
          path={`${this.props.match.path}/createQuotationPreview`}
          component={CreateQuotPreview}
        />
        <Route
          exact
          path={`${this.props.match.path}/editUser`}
          component={EditUser}
        />
        <Route
          exact
          path={`${this.props.match.path}/ResetPassword`}
          component={Authorization}
        />
        <Route
          exact
          path={`${this.props.match.path}/vendor`}
          component={Vendor}
        />
        <Route
          exact
          path={`${this.props.match.path}/infrastructureAudit`}
          component={InfrastructureAudit}
        />
        <Route
          exact
          path={`${this.props.match.path}/businessDetails`}
          component={BusinessDetails}
        />
        <Route
          exact
          path={`${this.props.match.path}/userProfile`}
          component={UserProfile}
        />
        <Route
          exact
          path={`${this.props.match.path}/supplierCriteria`}
          component={SupplierCriteria}
        />

        <Redirect from="*" to="/error" />
      </Switch>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionUserLogout,
      actionCheckToken,
      actionLoaderHide
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SupplierView);
