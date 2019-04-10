import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tab, Nav, li } from 'react-bootstrap';
import Header from '../common/header';
import { Link } from 'react-router-dom';
import Sprite from '../../img/sprite.svg';
import CONSTANTS from '../../common/core/config/appConfig';
import {
  actionUserLogout,
  actionLoaderHide,
  actionLoaderShow
} from '../../common/core/redux/actions';

import PendinApproval from '../parts/pendinApproval';
import Dashboard from '../parts/dashboard';

import { handlePermission } from '../../common/permissions';
let { permissionConstant } = CONSTANTS;

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: this.props.activeTabKey || 'first'
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.tabCheck = this.tabCheck.bind(this);
  }

  tabCheck(tab) {
    this.setState({ activeTabKey: tab });
    if (this.props.activeTabKeyAction) this.activeTabKeyAction(tab);
  }

  activeTabKeyAction(tab) {
    this.props.activeTabKeyAction(tab);
  }
  handleSelect() {}
  render() {
    return (
      <div>
        <section className="">
          <div>
            <div className="">
              <div className="dashboardWrapper">
                <div className="db-tab">
                  <Tab.Container
                    onSelect={this.handleSelect}
                    id="tabs-with-dropdown"
                    activeKey={this.state.activeTabKey}
                  >
                    <div>
                      <div className="container">
                        <div id="navWrap">
                          <Nav bsStyle="tabs">
                            {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages.dashboard
                            ) ? (
                              <li
                                eventKey="first"
                                onClick={() => this.tabCheck('first')}
                                title="Dashboard"
                              >
                                <Link to="dashboard">
                                  <span className="ico-db">
                                    <svg>
                                      <use
                                        xlinkHref={`${Sprite}#quotSumm1Ico`}
                                      />
                                    </svg>
                                  </span>
                                  <span className="t-title">Dashboard</span>
                                </Link>
                              </li>
                            ) : null}

                            {this.props.userInfo.userData.userProfile ===
                            'admin' ? (
                              <li
                                eventKey="fourteen"
                                onClick={() => this.tabCheck('fourteen')}
                                title="Dashboard"
                              >
                                <Link to="administrator">
                                  <span className="ico-db">
                                    <svg>
                                      <use
                                        xlinkHref={`${Sprite}#quotSumm1Ico`}
                                      />
                                    </svg>
                                  </span>
                                  <span className="t-title">Dashboard</span>
                                </Link>
                              </li>
                            ) : null}

                            {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages.request_for_purchase
                            ) ? (
                              <li
                                eventKey="second"
                                onClick={() => this.tabCheck('second')}
                                title="Request for Purchase"
                              >
                                {this.props.activeTabKey !== 'second' ? (
                                  <Link to="addpart">
                                    <span className="ico-db">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#ndasIco`} />
                                      </svg>
                                    </span>
                                    <span className="t-title">
                                      Request for Purchase
                                    </span>
                                  </Link>
                                ) : (
                                  <Link to="addpart">
                                  <span className="ico-db">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#ndasIco`} />
                                    </svg>
                                  </span>
                                  <span className="t-title">
                                    Request for Purchase
                                  </span>
                                </Link>
                                  // [
                                  //   <span className="ico-db">
                                  //     <svg>
                                  //       <use xlinkHref={`${Sprite}#ndasIco`} />
                                  //     </svg>
                                  //   </span>,
                                  //   <span className="t-title">
                                  //     Request for Purchase
                                  //   </span>
                                  // ]
                                )}
                              </li>
                            ) : null}
                            {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages.rfq_approval
                            ) ? (
                              <li
                                eventKey="third"
                                // onClick={() => this.tabCheck("third")}
                                title="RFQ Approval"
                              >
                                <Link to="pendinApproval">
                                  <span className="ico-db">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#quotIco`} />
                                    </svg>
                                  </span>
                                  <span className="t-title">RFQ Approval</span>
                                </Link>
                                {/* <span className="ico-db">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#quotIco`} />
                                  </svg>
                                </span>
                                <span className="t-title">RFQ Approval</span> */}
                              </li>
                            ) : null}
                            {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages.po_approval
                            ) ? (
                              <li
                                eventKey="fourth"
                                onClick={() => this.tabCheck('fourth')}
                                title="Approve PO"
                              >
                                <Link to="approvalPO">
                                  <span className="ico-db">
                                    <svg>
                                      <use
                                        xlinkHref={`${Sprite}#approvePo1Ico`}
                                      />
                                    </svg>
                                  </span>
                                  <span className="t-title">Approve PO</span>
                                </Link>
                              </li>
                            ) : null}
                            {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages.release_po
                            ) ? (
                              <li
                                eventKey="fifth"
                                onClick={() => this.tabCheck('fifth')}
                                title="Release PO"
                              >
                                <Link to="Release">
                                  <span className="ico-db">
                                    <svg>
                                      <use
                                        xlinkHref={`${Sprite}#releasePoIco`}
                                      />
                                    </svg>
                                  </span>
                                  <span className="t-title">Release PO</span>
                                </Link>
                              </li>
                            ) : null}
                            {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages.quotation_summary
                            ) ? (
                              <li
                                eventKey="sixth"
                                onClick={() => this.tabCheck('sixth')}
                                title="Quotation Summary"
                              >
                                <Link to="summary">
                                  <span className="ico-db">
                                    <svg>
                                      <use
                                        xlinkHref={`${Sprite}#quotationSummaryIco`}
                                      />
                                    </svg>
                                  </span>
                                  <span className="t-title">
                                    Quotation Summary
                                  </span>
                                </Link>
                              </li>
                            ) : null}
                            {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages.summary_part_status
                            ) ? (
                              <li
                                eventKey="seventh"
                                onClick={() => this.tabCheck('seventh')}
                                title="Summary Part Status"
                              >
                                <Link to="summaryPartsStatus">
                                  <span className="ico-db">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#summPs1Ico`} />
                                    </svg>
                                  </span>
                                  <span className="t-title">
                                    Summary Part Status
                                  </span>

                                  <ul className="nav-notific">
                                    <li className="bg-g">1</li>
                                    <li className="bg-o">2</li>
                                    <li className="bg-r">99</li>
                                  </ul>
                                </Link>
                              </li>
                            ) : null}

                            {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages.non_disclosure
                            ) ? (
                              <li
                                eventKey="eighth"
                                onClick={() => this.tabCheck('eighth')}
                                title="Non Disclose"
                              >
                                <Link to="/buyer/disclosure">
                                  <span className="ico-db">
                                    <svg>
                                      <use
                                        xlinkHref={`${Sprite}#nonDiscloseIco`}
                                      />
                                    </svg>
                                  </span>
                                  <span className="t-title">
                                    Non Disclosure
                                  </span>
                                </Link>
                              </li>
                            ) : null}
                            {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages.create_eco
                            ) ? (
                              <li
                                eventKey="ninth"
                                onClick={() => this.tabCheck('ninth')}
                                title="Create ECO"
                              >
                                <Link to="/buyer/createECO">
                                  <span className="ico-db">
                                    <svg>
                                      <use
                                        xlinkHref={`${Sprite}#changeOrderIco`}
                                      />
                                    </svg>
                                  </span>
                                  <span className="t-title">Create ECO</span>
                                </Link>
                              </li>
                            ) : null}
                            {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages.product_planning
                            ) ? (
                              <li
                                eventKey="tenth"
                                onClick={() => this.tabCheck('tenth')}
                                title="New Product Build Plan"
                              >
                                <Link to="/buyer/createBuildPlanECO">
                                  <span className="ico-db">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#npbpIco`} />
                                    </svg>
                                  </span>
                                  <span className="t-title">
                                    New Product Build Plan
                                  </span>
                                </Link>
                              </li>
                            ) : null}

                            {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages
                                .create_indirect_purchase_request
                            ) ? (
                              <li
                                eventKey="eleven"
                                onClick={() => this.tabCheck('eleven')}
                                title="Indirect Purchase"
                              >
                                <Link to="/buyer/indirectPurchase">
                                  <span className="ico-db">
                                    <svg>
                                      <use
                                        xlinkHref={`${Sprite}#indirecrPurchasingIco`}
                                      />
                                    </svg>
                                  </span>
                                  <span className="t-title">
                                    Indirect Purchase
                                  </span>
                                </Link>
                              </li>
                            ) : null}

                            {/* {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages.purchase_category
                            ) ? ( */}
                            <li
                              eventKey="tweleve"
                              onClick={() => this.tabCheck('tweleve')}
                              title=" Create Budget Plan"
                            >
                              <Link to="/buyer/budgetPlan">
                                <span className="ico-db">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#purchasingIco`}
                                    />
                                  </svg>
                                </span>
                                <span className="t-title">
                                  Create Budget Plan
                                </span>
                              </Link>
                            </li>

                            <li
                              eventKey="tweleve"
                              onClick={() => this.tabCheck('tweleve')}
                              title="Budget Approval"
                            >
                              <Link to="/buyer/budgetApproval">
                                <span className="ico-db">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#purchasingIco`}
                                    />
                                  </svg>
                                </span>
                                <span className="t-title">Budget Plan</span>
                              </Link>
                            </li>

                            {/* ) : null} */}

                            {/* {handlePermission(
                              this.props.userInfo.userData.permissions,
                              permissionConstant.pages.geographical
                            ) ? (
                              <li
                                eventKey="thirteen"
                                onClick={() => this.tabCheck('thirteen')}
                                title="Geographical"
                              >
                                <Link to="/buyer/geographical">
                                  <span className="ico-db">
                                    <svg>
                                      <use
                                        xlinkHref={`${Sprite}#purchasingIco`}
                                      />
                                    </svg>
                                  </span>
                                  <span className="t-title">Geographical</span>
                                </Link>
                              </li>
                            ) : null} 

                            {this.props.userInfo.userData.userProfile ===
                            'admin' ? (
                              <li
                                eventKey="fourteen"
                                onClick={() => this.tabCheck('fourteen')}
                                title="Geographical"
                              >
                                <Link to="/buyer/administrator">
                                  <span className="ico-db">
                                    <svg>
                                      <use
                                        xlinkHref={`${Sprite}#purchasingIco`}
                                      />
                                    </svg>
                                  </span>
                                  <span className="t-title">Administrator</span>
                                </Link>
                              </li>
                            ) : null}*/}
                          </Nav>
                        </div>
                      </div>
                      <div className="">
                        <Tab.Content animation>
                          <Tab.Pane
                            eventKey="first"
                            onClick={
                              this.state.activeTabKey === 'first'
                                ? this.activeTabKeyAction.bind(this, 'first')
                                : null
                            }
                          />
                          {/* <Tab.Pane
                            eventKey="third"
                            onClick={
                              this.state.activeTabKey === "first"
                                ? this.activeTabKeyAction.bind(this, "third")
                                : null
                            }
                          /> */}
                          {/* <Tab.Pane eventKey="none">
                            {this.state.activeTabKey === 'none' ? (
                              <PendinApproval tabCheck={this.tabCheck} />
                            ) : null}
                          </Tab.Pane> */}
                          {/* <Tab.Pane eventKey="fifth">Coming soon</Tab.Pane> */}
                        </Tab.Content>
                      </div>
                    </div>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { actionUserLogout, actionLoaderHide, actionLoaderShow },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User,
    supplierParts: state.supplierParts
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
