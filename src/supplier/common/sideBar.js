import React, { Component } from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  Tab,
  Nav,
  NavItem,
  FormGroup,
  FormControl,
  ControlLabel,
  Form,
  Tooltip
} from "react-bootstrap";
import Sprite from "../../img/sprite.svg";
import {
  actionUserLogout,
  actionLoaderHide,
  actionLoaderShow
} from "../../common/core/redux/actions";

import ReviewPartQuotation from "../parts/reviewPartQuotation";
import Dashboard from "../parts/dashboard";
import CONSTANTS from "../../common/core/config/appConfig";
import PendingApproval from "../parts/pendingApproval";
import { handlePermission } from "../../common/permissions";
let { permissionConstant } = CONSTANTS;
class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      activeTabKey: this.props.activeTabKey
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.tabCheck = this.tabCheck.bind(this);
    this.tabCheckSecond = this.tabCheckSecond.bind(this);
    this.tabCheckThird = this.tabCheckThird.bind(this);

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);

    this.tooltip = <Tooltip id="tooltip1">review</Tooltip>;
  }

  handleLogout() {
    try {
      const roleId = this.props.userInfo.userData.userRole;
      const userId = this.props.userInfo.userData.id;
      this.props.actionUserLogout({ roleId, userId });
    } catch (error) {}
  }
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  tabCheckSecond(tab) {
    this.setState({ activeTabKey: tab });
  }
  tabCheckThird(tab) {
    this.setState({ activeTabKey: tab });
  }

  tabCheck(tab) {
    this.setState({ activeTabKey: tab });
    if (this.props.activeTabKeyAction) this.activeTabKeyAction(tab);
  }

  activeTabKeyAction(tab) {
    this.props.activeTabKeyAction(tab);
  }

  render() {
    return (
      <div>
        <section className="">
          <div>
            <div className="">
              <div className="dashboardWrapper">
                <div className="db-tab">
                  <Tab.Container
                    id="tabs-with-dropdown"
                    activeKey={this.state.activeTabKey}
                  >
                    <div className="clearfix">
                      <div className="container">
                        <div id="navWrap">
                          <Nav bsStyle="tabs">
                            <NavItem
                              eventKey="second"
                              onClick={() => this.tabCheck("second")}
                              title=" Quotations"
                            >
                              <span className="ico-db">
                                <svg>
                                  <use
                                    xlinkHref={`${Sprite}#billMaterialIco`}
                                  />
                                </svg>
                              </span>
                              <span className="t-title">Quotations</span>
                            </NavItem>

                            <NavItem
                              eventKey="first"
                              onClick={() => this.tabCheck("first")}
                              title="Dashboard"
                            >
                              <span className="ico-db">
                                <svg>
                                  <use xlinkHref={`${Sprite}#quotSumm1Ico`} />
                                </svg>
                              </span>
                              <span className="t-title">Dashboard</span>
                            </NavItem>

                            <NavItem
                              eventKey="third"
                              onClick={() => this.tabCheck("third")}
                              title="Approve Quotation"
                            >
                              <span className="ico-db">
                                <svg>
                                  <use xlinkHref={`${Sprite}#approvePoIco`} />
                                </svg>
                              </span>
                              <span className="t-title">Approve Quotation</span>
                            </NavItem>

                            <NavItem
                              eventKey="fourth"
                              onClick={() => this.tabCheck("fourth")}
                              title="Update Parts Status"
                            >
                              <Link to="updatePartStatus">
                                <span className="ico-db">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#updatePsIco`} />
                                  </svg>
                                </span>
                                <span className="t-title">
                                  Update Parts Status
                                </span>
                              </Link>
                            </NavItem>
                          </Nav>
                        </div>
                      </div>
                      <div>
                        <Tab.Content animation>
                          <Tab.Pane
                            eventKey="first"
                            onClick={
                              this.state.activeTabKey === "first"
                                ? this.activeTabKeyAction.bind(this, "first")
                                : null
                            }
                          >
                            {/* {this.state.activeTabKey === 'first' ? (
                              <Dashboard
                                tabCheckThird={this.tabCheckThird}
                                tabCheckSecond={this.tabCheckSecond}
                              />
                            ) : null} */}
                          </Tab.Pane>
                          <Tab.Pane
                            eventKey="second"
                            onClick={
                              this.state.activeTabKey === "second"
                                ? this.activeTabKeyAction.bind(this, "second")
                                : null
                            }
                          >
                            {/* {this.state.activeTabKey === 'second' ? (
                              <ReviewPartQuotation
                                tabCheck={this.tabCheck}
                                tabCheckThird={this.tabCheckThird}
                              />
                            ) : null} */}
                          </Tab.Pane>
                          <Tab.Pane
                            eventKey="third"
                            onClick={
                              this.state.activeTabKey === "third"
                                ? this.activeTabKeyAction.bind(this, "third")
                                : null
                            }
                          >
                            {/* {this.state.activeTabKey === 'third' ? (
                              <PendingApproval
                                tabCheck={this.tabCheck}
                                tabCheckSecond={this.tabCheckSecond}
                              /> */}
                            ) : null}
                          </Tab.Pane>
                          <Tab.Pane eventKey="seven">
                            <section className="db-section">
                              <div className="container">
                                <div className="db-filter flex align-center justify-space-between">
                                  <h4 className="hero-title">
                                    Supplier Approval
                                  </h4>
                                  <div className="filter-in">
                                    <Form inline>
                                      <FormGroup controlId="formInlineName">
                                        <ControlLabel>Search:</ControlLabel>
                                        <FormControl
                                          type="text"
                                          placeholder="Search any part"
                                        />
                                        <span className="ico-search">
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#searchIco`}
                                            />
                                          </svg>
                                        </span>
                                      </FormGroup>
                                      <FormGroup controlId="formInlineSelect">
                                        <ControlLabel>Sort By:</ControlLabel>
                                        <FormControl
                                          componentClass="select"
                                          placeholder="select"
                                        >
                                          <option value="select">select</option>
                                          <option value="other">
                                            dfgfhhhhhhfhdshdshdsh
                                          </option>
                                        </FormControl>
                                      </FormGroup>
                                    </Form>
                                  </div>
                                </div>
                              </div>
                            </section>
                          </Tab.Pane>
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
    supplierData: state.supplierData
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
