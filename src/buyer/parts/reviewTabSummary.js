import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, FormGroup, FormControl, Table } from 'react-bootstrap';

import Sprite from '../../img/sprite.svg';
import partImage from '../../img/part.jpg';
import * as Datetime from 'react-datetime';
import Image1 from '../../img/image.png';
import Image3 from '../../img/part.jpg';

import {
  actionLoaderHide,
  actionLoaderShow
} from '../../common/core/redux/actions';

class ReviewTabSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showApproveModal: false,
      showCommentModal: false,
      showResendButton: false,
      showApproveButton: false,
      reviewData: {},
      comment: '',
      currentStatus: ''
    };
  }

  componentDidMount() {
    // let _this = this;
    // const userId = this.props.userInfo.userData.id;
    // const roleId = this.props.userInfo.userData.userRole;
    // this.props.actionLoaderShow();
    // this.props
    //   .actionPendingApprovalPartList({ userId, roleId })
    //   .then((result, error) => {
    //     console.log('result................', result);
    //     _this.props.actionLoaderHide();
    //   })
    //   .catch(e => _this.props.actionLoaderHide());
  }

  render() {
    // const tabData = this.props.supplierParts.summaryReviewData[0];

    console.log("summaryDataByTab -- ",this.props.supplierParts.summaryDataByTab.buyerResponse);

    console.log("summaryDataByTab -- ",this.props.supplierParts.summaryReviewData[0]);
    let tabData = '';
    if (this.props.supplierParts.summaryDataByTab.buyerResponse) {
      tabData = this.props.supplierParts.summaryDataByTab;
    } else {
      tabData = this.props.supplierParts.summaryReviewData[0];
    }
    console.log('tabData.....', tabData);
    return (
      <div className="container-fluid">
        {/* <div className="company-name flex align-center">
          <div className="brand">
            <img src={Image1} className="obj-cover" />
          </div>
          {tabData && tabData.buyerResponse.companyName}
        </div> */}

        <div className="b-top b-bottom border-light q-p-space">
          <Row className="show-grid">
            <Col md={6}>
              <div className="company-info">
                <Table className="">
                  <tbody>
                    <tr>
                      <td>Supplier:</td>
                      <td>{tabData && tabData.supplierResponse.companyName}</td>
                    </tr>
                    <tr>
                      <td>Contact:</td>
                      <td>
                        {tabData &&
                          tabData.supplierResponse.addresseResponse &&
                          tabData.supplierResponse.addresseResponse.address}
                      </td>
                    </tr>
                    <tr>
                      <td>Part Number:</td>
                      <td>{tabData && tabData.partResponse.partNumber}</td>
                    </tr>
                    <tr>
                      <td>Provided Through:</td>
                      <td>makethepart.com</td>
                    </tr>
                    <tr>
                      <td>Currency:</td>
                      <td>
                        {' '}
                        <FormGroup
                          controlId="formControlsSelect"
                          className="w100"
                        >
                          <FormControl
                            componentClass="select"
                            placeholder="select"
                            className="br-0 s-arrow"
                            value={this.state.currency}
                            name="currency"
                          >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                          </FormControl>
                        </FormGroup>
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col md={6}>
              <figure className="p-preview">
                <img
                  src={tabData && tabData.partResponse.partMediaMainImage}
                  className="img-responsive"
                />
              </figure>
            </Col>
          </Row>
        </div>
        <div>
          <Row className="show-grid">
            <Col md={12}>
              <div>
                <Table
                  bordered
                  responsive
                  className="custom-table gray-row cell-style "
                >
                  <thead>
                    <tr>
                      <th>Operations</th>
                      <th>Decription</th>
                      <th>Source (Country)</th>
                      <th>Specfication</th>
                      <th>Tool Life (qty)</th>
                      <th>Time</th>
                      <th>Length</th>
                      <th>Weight</th>
                      <th>Rate</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Comments</th>
                    </tr>
                    <tr className="h-10"> </tr>
                  </thead>
                  <tbody>
                    {tabData && tabData.listOfQuotationDetails &&
                      tabData.listOfQuotationDetails.map((item, index) => {
                        return item.detail
                          ? ''
                          : [
                              <tr className={` ${item.price ? '' : 'hide '}`}>
                                <td>
                                  <span>{item.operations}</span>
                                </td>
                                <td>
                                  <span>{item.description}</span>
                                </td>
                                <td>
                                  <span>{item.sourceCountry}</span>
                                </td>
                                <td>
                                  <span>{item.specification}</span>
                                </td>
                                <td>
                                  <span>{item.toolLife}</span>
                                </td>
                                <td>
                                  <span>{item.time}</span>
                                </td>
                                <td>
                                  <span>{item.length}</span>
                                </td>
                                <td>
                                  <span>{item.weight}</span>
                                </td>
                                <td>
                                  <span>{item.rate}</span>
                                </td>
                                <td>
                                  <span>{item.quantity}</span>
                                </td>
                                <td>
                                  <span>{item.price}</span>
                                </td>
                                <td>
                                  <FormGroup controlId="formBasicText">
                                    <FormControl
                                      type="text"
                                      className="br-0"
                                      value=""
                                      //   onChange={event =>
                                      //     this.handlePartDetailFieldChange(event)
                                      //   }
                                      name="comments"
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                              </tr>,
                              <tr className={` ${item.price ? '' : 'hide '}`} />
                            ];
                      })}
                    <tr>
                      <td className="fw-800">Tool Cost</td>
                      <td>{tabData && tabData.toolingCost} </td>
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                    </tr>
                    <tr className="h-10"> </tr>
                    <tr>
                      <td className="fw-800">Subtotal</td>
                      <td>{tabData && tabData.subtotal} </td>
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                    </tr>
                    <tr className="h-10"> </tr>
                    {tabData && tabData.listOfQuotationDetails &&
                      tabData.listOfQuotationDetails.map((item, index) => {
                        return item.detail
                          ? [
                              <tr>
                                <td>
                                  <span>{item.operations}</span>
                                </td>
                                <td>
                                  <span>{item.detail}</span>
                                </td>
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                              </tr>,
                              <tr />
                            ]
                          : '';
                      })}
                    <tr>
                      <td className="fw-800">Total</td>
                      <td>{tabData && tabData.totalPrice}</td>
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionLoaderHide,
      actionLoaderShow
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
)(ReviewTabSummary);
