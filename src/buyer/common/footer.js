import React, { Component } from 'react';
import { Tab, Nav, NavItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sprite from '../../img/sprite.svg';

import {
  actionUserLogout,
  actionLoaderHide,
  actionLoaderShow
} from '../../common/core/redux/actions';
import { topPosition } from '../../common/commonFunctions';
import PendinApproval from '../parts/pendinApproval';
import Dashboard from '../parts/dashboard';
import CONSTANTS from '../../common/core/config/appConfig';
import { handlePermission } from '../../common/permissions';
let { permissionConstant } = CONSTANTS;
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: this.props.activeTabKey || 'none'
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.tabCheck = this.tabCheck.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, false);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
  }
  handleScroll = () => {
    this.setState({
      pageScrollY: window.scrollY
    });
  };
  tabCheck() {
    this.props.tabCheck('first');
  }
  render() {
    return (
      <footer>
        {this.state.pageScrollY ? (
          <button
            onClick={topPosition}
            className="btn btn-block br-0 btn-toTop text-uppercase"
          >
            back to top
          </button>
        ) : (
          ''
        )}

        <div className="bg-Dgray">
          <div className="footer-container">
            <div className="p-tags-wrapper flex justify-space-between">
              <ul className="p-tags flex-1">
                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.create_eco
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.create_eco
                          ? 'disabled'
                          : null
                      }
                      to="/buyer/createECO"
                    >
                      Create ECO
                    </Link>
                  </li>
                ) : null}
                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.build_plan_eco
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.build_plan_eco
                          ? 'disabled'
                          : null
                      }
                      to="/buyer/createBuildPlanECO"
                    >
                      Build Plan ECO
                    </Link>
                  </li>
                ) : null}
                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.history_eco
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.history_eco
                          ? 'disabled'
                          : null
                      }
                      to="/buyer/historyECO"
                    >
                      History ECO
                    </Link>
                  </li>
                ) : null}
                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.product_planning
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.product_planning
                          ? 'disabled'
                          : null
                      }
                      to="/buyer/productPlanning"
                    >
                      Product Plannning
                    </Link>
                  </li>
                ) : null}
              </ul>
              <ul className="p-tags flex-1">
                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.request_for_purchase
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.request_for_purchase
                          ? 'disabled'
                          : null
                      }
                      to="/buyer/addPart"
                    >
                      Request for Purchase
                    </Link>
                  </li>
                ) : null}
                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.footer_title.purchasing_of_summary
                ) ? (
                  <li>
                    <a
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.purchasing_of_summary
                          ? 'disabled'
                          : null
                      }
                    >
                      Purchasing of Summary
                    </a>
                  </li>
                ) : null}
                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.quotation_summary
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.quotation_summary
                          ? 'disabled'
                          : null
                      }
                      to="/buyer/summary"
                    >
                      Quotation Summary
                    </Link>
                  </li>
                ) : null}
                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.set_approval_limit
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.set_approval_limit
                          ? 'disabled'
                          : null
                      }
                      to="setApprovalLimit"
                    >
                      Set Approval Limit
                    </Link>
                  </li>
                ) : null}
              </ul>
              <ul className="p-tags flex-1">
                {(this.props.userInfo.userData.userProfile ===
                  permissionConstant.roles.buyer ||
                  this.props.userInfo.userData.userProfile ===
                    permissionConstant.roles.purchase_manager) &&
                this.props.pageTitle ===
                  permissionConstant.footer_title.review_po_approval ? (
                  <li>
                    <Link
                      to={{
                        pathname: 'releasePO',
                        state: {
                          partId: this.props.valueToSend.partId,
                          partNumber: this.props.valueToSend.partNumber,
                          projectCode: this.props.valueToSend.projectCode
                        }
                      }}
                    >
                      Release PO
                    </Link>
                  </li>
                ) : handlePermission(
                    this.props.userInfo.userData.permissions,
                    permissionConstant.pages.release_po
                  ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.release_po
                          ? 'disabled'
                          : null
                      }
                      to="releasePO"
                    >
                      Release PO
                    </Link>
                  </li>
                ) : null}

                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.supplier_criteria_setting
                ) ? (
                  <li>
                    <a
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title
                          .supplier_criteria_setting
                          ? 'disabled'
                          : 'disabled'
                      }
                    >
                      Supplier Criteria Setting
                    </a>
                  </li>
                ) : null}

                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.dashboard
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.dashboard
                          ? 'disabled'
                          : null
                      }
                      to="dashboard"
                    >
                      Dashboard
                    </Link>
                  </li>
                ) : null}

                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.summary_part_status
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.summary_part_status
                          ? 'disabled'
                          : null
                      }
                      to="summaryPartsStatus"
                    >
                      Summary Part Status
                    </Link>
                  </li>
                ) : null}
              </ul>

              <ul className="p-tags flex-1">
                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.po_approval
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.po_approval
                          ? 'disabled'
                          : null
                      }
                      to="approvalPO"
                    >
                      Approve PO
                    </Link>
                  </li>
                ) : null}
                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.rfq_approval
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.rfq_approval
                          ? 'disabled'
                          : null
                      }
                      // to={{
                      //   pathname: "home",
                      //   state: { path: "third" }
                      // }}
                      to="pendinApproval"
                    >
                      Approve RFQ
                    </Link>
                  </li>
                ) : null}

                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.add_user
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.add_user
                          ? 'disabled'
                          : null
                      }
                      to="addUser"
                    >
                      Add Users
                    </Link>
                  </li>
                ) : null}
                {handlePermission(
                  this.props.userInfo.userData.permissions,
                  permissionConstant.pages.part_detail
                ) ? (
                  <li>
                    <Link
                      className={
                        this.props.pageTitle ===
                        permissionConstant.footer_title.part_detail
                          ? 'disabled'
                          : null
                      }
                      to="/buyer/partDetail"
                    >
                      Part Detail
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.User,
    supplierParts: state.supplierParts
  };
};

export default connect(
  mapStateToProps,
  null
)(Footer);
