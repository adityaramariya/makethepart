import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Authorization from '../common/authorization';
import Home from './home/home';
import Dashboard from './parts/dashboard';
import RFQApproval from './parts/pendinApproval';
// import OtpVerification from '../common/authorization/otpVerfication';
import AddPart from './parts/addPart';
import AddUser from './users/addUser';
import SetApprovalLimit from './parts/setApprovalLimit';
import Summary from './parts/summary';
import ReviewPOApproval from './parts/reviewPOApproval';
import ReviewSummary from './parts/reviewSummary';
import ReviewTabSummary from './parts/reviewTabSummary';
import ApprovalPO from './parts/approvalPO';
import SummaryPartsStatus from './parts/summaryPartsStatus';
import ReleasePO from './parts/releasePO';
import PPAPDocuments from './ppap/ppapDocuments';
import EditUser from '../common/users/editUser';
import PartDetail from './parts/partDetail';
import Disclosure from './disclosure/disclosure';
import ReviewSupplier from './disclosure/reviewSupplier';
import CreateECO from './bom/createECO';
import BuildPlanECO from './bom/buildPlanECO';
import HistoryECO from './bom/historyECO';
import ProductPlanning from './bom/productPlanning';
import Release from './parts/release';
import ValueAnalyst from './valueAnalyst/valueAnalyst';
import IndirectPurchase from './budgetPurchase/indirectPurchase';
import Purchasing from './budgetPurchase/purchasing';

// import ResetPassword from '../common/authorization/resetPassword';
import UserProfile from '../common/users/userProfile';
// import makeThePartApiService from '../common/core/api/apiService';
import Existing from './existing/existing';
import BuyerCriteria from './criteria/buyerCriteria';
import budgetPlan from './budgetPurchase/budgetPlan';
import budgetApproval from './budgetPurchase/budgetApproval';
import budgetRevision from './budgetPurchase/budgetRevision';
import budget4 from './budgetPurchase/budget4';
import budget5 from './budgetPurchase/budget5';
import budget6 from './budgetPurchase/budget6';
import budget7 from './budgetPurchase/budget7';
import budget8 from './budgetPurchase/budget8';
import budget9 from './budgetPurchase/budget9';
import budget10 from './budgetPurchase/budget10';
import budget11 from './budgetPurchase/budget11';
import budget12 from './budgetPurchase/budget12';
import budget13 from './budgetPurchase/budget13';
import Geographical from './costCenterClassification/geographical';
import Financial from './budgetPurchase/financial';
import Administrator from './administrator/administrator';
import createBuildPlanECO from './bom/createBuildPlanECO';
import SpendingCategory from './costCenterClassification/spendingCategory';
import BrandCost from './costCenterClassification/brandCost';
import ProductionCost from './costCenterClassification/productionCost';
import FunctionalAreaCost from './costCenterClassification/functionalAreaCost';
import buildPlanECO2 from './bom/buildPlanECO2';
import Location from './budgetPurchase/locations';
//import dummyPage from './budgetPurchase/dummyPage';

import UserRole from './administrator/userRole';


import {
  actionUserLogout,
  actionCheckToken,
  actionLoaderHide
} from '../common/core/redux/actions';
class BuyerView extends Component {
  constructor(props) {
    super(props);
    this.allowedPath = [
      '/buyer/signin',
      '/buyer/singup',
      '/buyer/otpVerification',
      '/buyer/signupsuccess',
      '/buyer/resetPassword'
    ];
    this.checkValidAccessOfPages = this.checkValidAccessOfPages.bind(this);
    this.checkTokenByAPI = this.checkTokenByAPI.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.userData.id) {
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
      this.props.history.push('/');
    }
  }
  checkValidAccessOfPages(_props) {
    let _this = this;
    if (this.allowedPath.indexOf(this.props.location.pathname) === -1) {
      try {
        if (_props.userInfo.userData.userRole !== 1)
          this.props.history.push('/');
      } catch (error) {
        _this.props.history.push('/');
      }
    }
  }

  componentWillMount() {
    this.checkValidAccessOfPages(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('will recieve props ', nextProps);
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
          exact
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
        <Route
          exact
          path={`${this.props.match.path}/resetPassword`}
          component={Authorization}
        />

        <Route exact path={`${this.props.match.path}/home`} component={Home} />

        <Route
          exact
          path={`${this.props.match.path}/addpart`}
          component={AddPart}
        />
        <Route
          exact
          path={`${this.props.match.path}/dashboard`}
          component={Dashboard}
        />
        <Route
          exact
          path={`${this.props.match.path}/pendinApproval`}
          component={RFQApproval}
        />

        <Route
          exact
          path={`${this.props.match.path}/adduser`}
          component={AddUser}
        />
        <Route
          exact
          path={`${this.props.match.path}/summary`}
          component={Summary}
        />
        <Route
          exact
          path={`${this.props.match.path}/approvalPO`}
          component={ApprovalPO}
        />
        <Route
          exact
          path={`${this.props.match.path}/reviewSummary`}
          component={ReviewSummary}
        />
        <Route
          exact
          path={`${this.props.match.path}/reviewTabSummary`}
          component={ReviewTabSummary}
        />

        <Route
          exact
          path={`${this.props.match.path}/reviewPOApproval`}
          component={ReviewPOApproval}
        />

        <Route
          exact
          path={`${this.props.match.path}/summaryPartsStatus`}
          component={SummaryPartsStatus}
        />
        <Route
          exact
          path={`${this.props.match.path}/releasePO`}
          component={ReleasePO}
        />
        <Route
          exact
          path={`${this.props.match.path}/ppap`}
          component={PPAPDocuments}
        />

        <Route
          exact
          path={`${this.props.match.path}/setApprovalLimit`}
          component={SetApprovalLimit}
        />
        <Route
          exact
          path={`${this.props.match.path}/editUser`}
          component={EditUser}
        />

        <Route
          exact
          path={`${this.props.match.path}/PartDetail`}
          component={PartDetail}
        />
        <Route
          exact
          path={`${this.props.match.path}/disclosure`}
          component={Disclosure}
        />
        <Route
          exact
          path={`${this.props.match.path}/reviewSupplier`}
          component={ReviewSupplier}
        />
        <Route
          exact
          path={`${this.props.match.path}/createECO`}
          component={CreateECO}
        />
        <Route
          exact
          path={`${this.props.match.path}/buildPlanECO`}
          component={BuildPlanECO}
        />
        <Route
          exact
          path={`${this.props.match.path}/historyECO`}
          component={HistoryECO}
        />
        <Route
          exact
          path={`${this.props.match.path}/productPlanning`}
          component={ProductPlanning}
        />
        <Route
          exact
          path={`${this.props.match.path}/release`}
          component={Release}
        />
        <Route
          exact
          path={`${this.props.match.path}/valueAnalyst`}
          component={ValueAnalyst}
        />
        <Route
          exact
          path={`${this.props.match.path}/userProfile`}
          component={UserProfile}
        />
        <Route
          exact
          path={`${this.props.match.path}/buyerCriteria`}
          component={BuyerCriteria}
        />
        <Route
          exact
          path={`${this.props.match.path}/existing`}
          component={Existing}
        />

        <Route
          exact
          path={`${this.props.match.path}/purchasing`}
          component={Purchasing}
        />
        <Route
          exact
          path={`${this.props.match.path}/budgetPlan`}
          component={budgetPlan}
        />
        <Route
          exact
          path={`${this.props.match.path}/budgetApproval`}
          component={budgetApproval}
        />
        <Route
          exact
          path={`${this.props.match.path}/budgetRevision`}
          component={budgetRevision}
        />
        <Route
          exact
          path={`${this.props.match.path}/budget4`}
          component={budget4}
        />
        <Route
          exact
          path={`${this.props.match.path}/budget5`}
          component={budget5}
        />
        <Route
          exact
          path={`${this.props.match.path}/budget6`}
          component={budget6}
        />
        <Route
          exact
          path={`${this.props.match.path}/budget7`}
          component={budget7}
        />
        <Route
          exact
          path={`${this.props.match.path}/budget8`}
          component={budget8}
        />
        <Route
          exact
          path={`${this.props.match.path}/budget9`}
          component={budget9}
        />
        <Route
          exact
          path={`${this.props.match.path}/budget10`}
          component={budget10}
        />
        <Route
          exact
          path={`${this.props.match.path}/budget11`}
          component={budget11}
        />
        <Route
          exact
          path={`${this.props.match.path}/budget12`}
          component={budget12}
        />
        <Route
          exact
          path={`${this.props.match.path}/budget13`}
          component={budget13}
        />
        <Route
          exact
          path={`${this.props.match.path}/indirectPurchase`}
          component={IndirectPurchase}
        />
        <Route
          exact
          path={`${this.props.match.path}/geographical`}
          component={Geographical}
        />
        <Route
          exact
          path={`${this.props.match.path}/financialyear`}
          component={Financial}
        />
        <Route
          exact
          path={`${this.props.match.path}/location`}
          component={Location}
        />

        <Route
          exact
          path={`${this.props.match.path}/administrator`}
          component={Administrator}
        />
        <Route
          exact
          path={`${this.props.match.path}/createBuildPlanECO`}
          component={createBuildPlanECO}
        />

        <Route
          exact
          path={`${this.props.match.path}/spendingCategory`}
          component={SpendingCategory}
        />

        <Route
          exact
          path={`${this.props.match.path}/brandCost`}
          component={BrandCost}
        />

        <Route
          exact
          path={`${this.props.match.path}/productionCost`}
          component={ProductionCost}
        />
        <Route
          exact
          path={`${this.props.match.path}/buildPlanECO2`}
          component={buildPlanECO2}
        />

        <Route
          exact
          path={`${this.props.match.path}/functionalAreaCost`}
          component={FunctionalAreaCost}
        />


          <Route
              exact
              path={`${this.props.match.path}/userRole`}
              component={UserRole}
          />

        {/* <Route
          exact
          path={`${this.props.match.path}/dummyPage`}
          component={dummyPage}
        /> */}

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
)(BuyerView);
