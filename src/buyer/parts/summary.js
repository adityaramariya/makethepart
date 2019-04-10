import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import noRecord from '../../img/no_record.png';
import {
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Table
} from 'react-bootstrap';
import Sprite from '../../img/sprite.svg';

import {
  actionLoaderHide,
  actionLoaderShow,
  actionPendingApprovalPartList,
  approveRejectPart,
  actionSummaryQuotationList,
  actionPartIdForReview,
  actionTabData
} from '../../common/core/redux/actions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import { handlePermission } from '../../common/permissions';
let { permissionConstant } = CONSTANTS;

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'sixth'
    };

    this.reviewSummary = this.reviewSummary.bind(this);
    this.toggleButton = this.toggleButton.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
  }

  toggleButton() {
    this.setState({
      toggleFlag: !this.state.toggleFlag
    });
  }

  componentDidMount() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      sortByDeliveryDate: false,
      sortByTotalAmount: true
    };
    this.props.actionLoaderShow();
    this.props
      .actionSummaryQuotationList(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  reviewSummary(event, data) {
    this.props.actionPartIdForReview(data);
  }

  navigateToRFQ(data) {
    this.props.actionTabData(data);
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
          activeTabKey={this.state.tabKey === 'sixth' ? 'sixth' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === 'sixth' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <div className="db-filter flex align-center justify-space-between">
                  <h4 className="hero-title">Quotation Summary</h4>
                  {/* <div className="filter-in">
                    <Form inline>
                      <FormGroup controlId="formInlineName">
                        <ControlLabel>Search:</ControlLabel>
                        <FormControl
                          type="text"
                          placeholder="Search any part"
                        />
                        <span className="ico-search">
                          <svg>
                            <use xlinkHref={`${Sprite}#searchIco`} />
                          </svg>
                        </span>
                      </FormGroup>
                    </Form>
                  </div> */}
                </div>
                <div>
                  {/* {this.props.supplierParts.summaryQuotationList.length ? ( */}
                  <Table bordered responsive className="custom-table cell-125">
                    <thead>
                      <tr>
                        <th>Program code</th>
                        <th>Part Number</th>
                        <th>Quote 1</th>
                        <th>Quote 2</th>
                        <th>Quote 3</th>
                        <th>Quote 4</th>
                        <th>Quote 5</th>
                        <th> </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.supplierParts.summaryQuotationList.map(
                        (item, index) => {
                          let listOfQuotationIdAndPrice =
                            item.listOfQuotationIdAndPrice;
                          let newVal = 5;
                          let arrayNew = [1, 2, 3, 4];
                          return [
                            <tr>
                              <td>
                                <span
                                  className={
                                    index % 4 === 0
                                      ? 'r-caret red'
                                      : index % 4 === 1
                                      ? 'r-caret green'
                                      : index % 4 === 2
                                      ? 'r-caret blue'
                                      : 'r-caret yellow'
                                  }
                                />
                                {item.projectCode}
                              </td>
                              <td>{item.partNumber}</td>
                              {item.listOfQuotationIdAndPrice.length === 0
                                ? arrayNew.map(i => <td />)
                                : item.listOfQuotationIdAndPrice.map(
                                    (item, index) => {
                                      let checkCon =
                                        listOfQuotationIdAndPrice[index + 1];
                                      if (checkCon) arrayNew.pop();

                                      return [
                                        <td>
                                          <div className="small-info ticket-green">
                                            <ul>
                                              <li className="flex">
                                                <span className="dis">
                                                  {item.supplierResponse &&
                                                    item.supplierResponse
                                                      .companyName}
                                                </span>
                                              </li>
                                              <li className="flex">
                                                <span className="dis">
                                                  {item.costPerPiece}{' '}
                                                  {item.currency}
                                                  /pc
                                                </span>
                                              </li>
                                              <li className="flex">
                                                <span className="ttl">
                                                  Tooling:
                                                </span>
                                                <span className="dis">
                                                  {item.toolingCost}{' '}
                                                  {item.currency}
                                                </span>
                                              </li>
                                              <li className="flex">
                                                <span className="dis">
                                                  {item.deliveryLeadTime}{' '}
                                                  {item.deliveryLeadTimeUnit}
                                                </span>
                                              </li>
                                            </ul>
                                          </div>
                                        </td>,
                                        checkCon
                                          ? null
                                          : arrayNew.map(i => <td />)
                                      ];
                                    }
                                  )}
                              {/* <td /> */ console.log(
                                '-reviewSummary-',
                                item
                              )}
                              <td>
                                {handlePermission(
                                  this.props.userInfo.userData.permissions,
                                  permissionConstant.action.review_quotations
                                ) ? (
                                  <Link
                                    className="btn btn-default sm-btn br-0"
                                    to={{
                                      pathname: 'reviewPOApproval',
                                      state: {
                                        partId: item.partId,
                                        projectId: item.projectid
                                      }
                                    }}
                                  >
                                    Review Details
                                  </Link>
                                ) : null}
                              </td>
                            </tr>
                          ];
                        }
                      )}
                    </tbody>
                  </Table>
                  {/* ) : (
                    <div className="noRecord">
                      <img src={noRecord} />
                    </div>
                  )} */}
                </div>
              </div>
            </div>
            <Footer
              pageTitle={permissionConstant.footer_title.quotation_summary}
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
      actionPendingApprovalPartList,
      approveRejectPart,
      actionSummaryQuotationList,
      actionPartIdForReview,
      actionTabData
    },
    dispatch
  );
};

const mapStateToProps = state => {
  console.log(state);
  return {
    userInfo: state.User,
    supplierParts: state.supplierParts
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary);
