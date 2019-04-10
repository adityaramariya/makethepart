import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import * as moment from 'moment';
import { Panel, PanelGroup, Accordion, Button } from 'react-bootstrap';
import Sprite from '../../img/sprite.svg';

import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetClassifications
} from '../../common/core/redux/actions';
import { showSuccessToast, showErrorToast } from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import { handlePermission } from '../../common/permissions';
let { permissionConstant } = CONSTANTS;
class administrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'fourteen',
      noOfTable: [[]],
      noOfCategory: [{}],
      tableNo: 0,
      showHeading: [],
      showSaveRedirect: false,
      accError: 0
    };
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
  }

  componentWillMount() {
    let noOfCategory = this.state.noOfCategory;
    let noOfTable = this.state.noOfTable;
    for (let i = 0; i < noOfTable.length; i++) {
      noOfTable[i].noOfCategory = [{ department: '' }];
    }
    for (let i = 0; i < noOfCategory.length; i++) {
      noOfCategory[i] = [{}];
    }
    this.setState({ noOfCategory: noOfCategory });
  }
  componentDidMount() {
    let _this = this;
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === 'first') this.props.history.push('home');
    if (tabKey === 'third')
      this.props.history.push({
        pathname: 'home',
        state: { path: 'third' }
      });
    this.setState({ tabKey: tabKey });
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === 'fourteen' ? 'fourteen' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === 'fourteen' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <h4 className="m-t-40 m-b-15 greytxt text-center">
                  User Administrator
                </h4>

                {/* <div className="flex  justify-space-between m-b-15">
                  <div />
                  <div className="flex align-center">
                    <Button
                      bsStyle="btn-primary"
                      className="text-uppercase word-break sm-btn btn-primary"
                    >
                      Add Administrator
                    </Button>
                  </div>
                </div> */}

                <div className="userAdmin">
                  <PanelGroup accordion id="accordion-example">
                    <Panel eventKey="1">
                      <Panel.Heading>
                        <Panel.Title toggle>User</Panel.Title>
                      </Panel.Heading>
                      <Panel.Body collapsible>
                        <ul class="panelListing">
                          <li>
                            <Link
                              to={{
                                pathname: 'addUser',
                                state: { backURL: 'admin' }
                              }}
                            >
                              Add User
                            </Link>
                          </li>
                          <li>
                            <Link to="/buyer/editUser">Edit User</Link>
                          </li>
                          <li>User Role And Responsibilities</li>
                          <li>Draft Circulation</li>
                          <li>Glossary</li>
                        </ul>
                      </Panel.Body>
                    </Panel>
                    <Panel eventKey="2">
                      <Panel.Heading>
                        <Panel.Title toggle>
                          Cost Center Classification
                        </Panel.Title>
                      </Panel.Heading>
                      <Panel.Body collapsible>
                        <ul class="panelListing">
                          <li>
                            <Link to="/buyer/geographical">
                              Geographical Classification
                            </Link>
                          </li>
                          <li>
                            <Link to="/buyer/spendingCategory">
                              Spending Categories
                            </Link>
                          </li>
                          <li>
                            <Link to="/buyer/brandCost">
                              Brand Cost Centers
                            </Link>
                          </li>
                          <li>
                            <Link to="/buyer/productionCost">
                              Product Line Classifications
                            </Link>
                          </li>
                          <li>
                            <Link to="/buyer/functionalAreaCost">
                              Functional Classifications
                            </Link>
                          </li>
                          <li>
                            <Link to="/buyer/location">
                              Plant/ Zonal offices
                            </Link>
                          </li>
                        </ul>
                      </Panel.Body>
                    </Panel>
                    <Panel eventKey="3">
                      <Panel.Heading>
                        <Panel.Title toggle>Financial set up</Panel.Title>
                      </Panel.Heading>
                      <Panel.Body collapsible>
                        <ul class="panelListing">
                          <li>
                            <Link to="/buyer/financialyear">
                              Financial Year & Budget Cycle
                            </Link>
                          </li>
                          {/* <li class="active">User Role And Responsibilities</li> */}
                          <li>S&OP Set Up</li>
                          <li>Accounts Payables </li>
                          <li>
                            <Link to="/buyer/budgetPlan">Budget Plan </Link>
                          </li>
                          <li>
                            <Link to="/buyer/budget2">Budget Plan View </Link>
                          </li>
                          <li>
                            <Link to="/buyer/purchasing">
                              Assign Budget Approvals By Cost Center
                            </Link>
                          </li>
                        </ul>
                      </Panel.Body>
                    </Panel>
                    <Panel eventKey="4">
                      <Panel.Heading>
                        <Panel.Title toggle>Work Flow</Panel.Title>
                      </Panel.Heading>
                      <Panel.Body collapsible>
                        <ul class="panelListing">
                          <li>
                            {' '}
                            <Link to="/buyer/setApprovalLimit">
                              Direct Purchasing Approval
                            </Link>{' '}
                          </li>
                          <li>
                            Indirect Purchasing Approval - Financial Delegation
                            of Authority
                          </li>
                          <li>Operational Budget Approval</li>
                          <li>S&OP Approval</li>
                        </ul>
                      </Panel.Body>
                    </Panel>
                    <Panel eventKey="5">
                      <Panel.Heading>
                        <Panel.Title toggle>Program</Panel.Title>
                      </Panel.Heading>
                      <Panel.Body collapsible>
                        <ul class="panelListing">
                          <li>Create Program</li>
                          <li>
                            Program Milestone Approval & Financial Delegation of
                            Authority{' '}
                          </li>
                          <li>Program Charter Approval</li>
                          <li>Product Program Milestone Deliverables</li>
                          <li>Workspace/ Chatroom</li>
                          {/* <li class="active">User Role And Responsibilities</li>
                          <li>Draft Circulation</li>
                          <li>Glossary</li> */}
                        </ul>
                      </Panel.Body>
                    </Panel>
                    <Panel eventKey="6">
                      <Panel.Heading>
                        <Panel.Title toggle>Program</Panel.Title>
                      </Panel.Heading>
                      <Panel.Body collapsible>
                        <ul class="panelListing">
                          <li>Purchasing Commodity</li>
                        </ul>
                      </Panel.Body>
                    </Panel>
                  </PanelGroup>
                </div>
              </div>
            </div>
            <Footer
              pageTitle={permissionConstant.footer_title.build_plan_eco}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionLoaderHide,
      actionLoaderShow,
      actionGetClassifications
    },
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
)(administrator);
