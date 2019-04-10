import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tab, Nav, NavItem } from 'react-bootstrap';
import Header from '../common/header';
import Sprite from '../../img/sprite.svg';

import {
  actionUserLogout,
  actionLoaderHide,
  actionLoaderShow
} from '../../common/core/redux/actions';

import PendinApproval from '../parts/pendinApproval';
import Dashboard from '../parts/dashboard';

class BuyerHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey:
        (this.props.supplierParts && this.props.supplierParts.activeTab) ||
        'first'
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.tabCheck = this.tabCheck.bind(this);
    // if (
    //   this.props.location.state &&
    //   this.props.location.state.path === 'third'
    // ) {
    //   this.state = {
    //     activeTabKey: 'third'
    //   };
    // }
  }

  componentWillMount() {
    if (this.props.userInfo.userData.isAdmin) {
      this.props.history.push('/buyer/administrator');
    }
    // else if (
    //   this.props.userInfo.userData.userProfile === "designer_approver" ||
    //   this.props.userInfo.userData.userProfile === "product_cost_approver"
    // ) {
    //   this.setState({
    //     activeTabKey:
    //       (this.props.supplierParts && this.props.supplierParts.activeTab) ||
    //       "third"
    //   });
    // }
  }

  handleLogout() {
    try {
      let _this = this;
      const roleId = this.props.userInfo.userData.userRole;
      const userId = this.props.userInfo.userData.id;
      this.props.actionLoaderShow();
      this.props
        .actionUserLogout({ roleId, userId })
        .then((result, error) => {
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } catch (error) {}
  }

  tabCheck(tab) {
    this.setState({ activeTabKey: tab });
  }

  render() {
    return (
      <div>
        <section className="">
          <Header {...this.props} />

          <div>
            <div className="">
              <div className="dashboardWrapper">
                <div className="db-tab">
                  <Tab.Container
                    id="tabs-with-dropdown"
                    activeKey={this.state.activeTabKey}
                  >
                    <div>
                      <div className="container">
                        <div id="navWrap">
                          <Nav bsStyle="tabs">
                            <NavItem
                              eventKey="first"
                              onClick={() => this.tabCheck('first')}
                              title="Dashboard"
                            >
                              {/* <span className="ico-db">
                                <svg>
                                  <use xlinkHref={`${Sprite}#quotSumm1Ico`} />
                                </svg>
                              </span>
                              <span className="t-title">Dashboard</span> */}
                              <Link to="dashboard">
                                <span className="ico-db">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#quotSumm1Ico`} />
                                  </svg>
                                </span>
                                <span className="t-title">Dashboard</span>
                              </Link>
                            </NavItem>
                            {this.props.userInfo.userData.isAdmin ? null : this
                                .props.userInfo.userData.userProfile ===
                              'designer' ? (
                              <NavItem
                                eventKey="second"
                                onClick={() =>
                                  this.props.history.push('addpart')
                                }
                                title=" Request for Purchase"
                              >
                                <span className="ico-db">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#ndasIco`} />
                                  </svg>
                                </span>
                                <span className="t-title">
                                  Request for Purchase
                                </span>
                              </NavItem>
                            ) : null}
                            {this.props.userInfo.userData.isAdmin ? null : (
                              <NavItem
                                eventKey="third"
                                // onClick={() => this.tabCheck("third")}
                                title="RFQ Approval"
                              >
                                {/* <span className="ico-db">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#quotIco`} />
                                  </svg>
                                </span>
                                <span className="t-title">RFQ Approval</span> */}

                                <Link to="pendinApproval">
                                  <span className="ico-db">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#quotIco`} />
                                    </svg>
                                  </span>
                                  <span className="t-title">RFQ Approval</span>
                                </Link>
                              </NavItem>
                            )}
                            {this.props.userInfo.userData.userProfile ===
                              'buyer' ||
                            this.props.userInfo.userData.userProfile ===
                              'purchase_manager' ? (
                              <NavItem eventKey="fourth" title="Approve PO">
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
                              </NavItem>
                            ) : null}
                            {this.props.userInfo.userData.userProfile ===
                              'buyer' ||
                            this.props.userInfo.userData.userProfile ===
                              'purchase_manager' ? (
                              <NavItem eventKey="fifth" title="Release PO">
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
                              </NavItem>
                            ) : null}
                            <NavItem eventKey="sixth" title="Quotation Summary">
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
                            </NavItem>
                            {this.props.userInfo.userData.isAdmin ? null : (
                              <NavItem
                                eventKey="seventh"
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
                                </Link>
                              </NavItem>
                            )}
                            {this.props.userInfo.userData.isAdmin ? (
                              <NavItem
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
                              </NavItem>
                            ) : null}
                            <NavItem
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
                            </NavItem>
                            <NavItem
                              eventKey="tenth"
                              onClick={() => this.tabCheck('tenth')}
                              title="New Product Build Plan"
                            >
                              <Link to="/buyer/buildPlanECO">
                                <span className="ico-db">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#npbpIco`} />
                                  </svg>
                                </span>
                                <span className="t-title">
                                  New Product Build Plan
                                </span>
                              </Link>
                            </NavItem>
                          </Nav>
                        </div>
                      </div>
                      <div className="">
                        <Tab.Content animation>
                          <Tab.Pane eventKey="first">
                            {this.state.activeTabKey === 'first' ? (
                              <Dashboard
                                {...this.props}
                                tabCheck={this.tabCheck}
                              />
                            ) : null}
                          </Tab.Pane>
                          {/* <Tab.Pane eventKey="third">
                            {this.state.activeTabKey === "third" ? (
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
)(BuyerHome);
