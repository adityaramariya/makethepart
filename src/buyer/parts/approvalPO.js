import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Table,
  Modal,
  Form,
  Row,
  Col,
  Glyphicon
} from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import * as Datetime from 'react-datetime';
import * as moment from 'moment';
import SliderModal from '../slider/sliderModal';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionPartOrder,
  actionTabData,
  actionApproveRejectOrder,
  actionPartIdForReview,
  actionGetQuotationData
} from '../../common/core/redux/actions';
import Sprite from '../../img/sprite.svg';
import noRecord from '../../img/no_record.png';
import Image1 from '../../img/image.png';
import { topPosition, removeUnderScore } from '../../common/commonFunctions';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import { handlePermission } from '../../common/permissions';
let { permissionConstant } = CONSTANTS;
let pageSize = 10;
class ApprovalPO extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nav1: null,
      nav2: null,
      showApproveModal: false,
      show: false,
      partOrderData: [],
      tabKey: 'fourth',
      recordArray: [],
      suppArray: [],
      showReviewModal: false,
      valueFlag: false,
      pageCount: 1,
      isPageCount: false,
      hasMore: true,
      showResendButton: false,
      showApproveButton: false
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCommentClose = this.handleCommentClose.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    // this.reviewSummary = this.reviewSummary.bind(this);
    this.reviewQuotation = this.reviewQuotation.bind(this);
    this.handleReviewClose = this.handleReviewClose.bind(this);
    this.editPart = this.editPart.bind(this);
    this.handleCloseEditModal = this.handleCloseEditModal.bind(this);
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });

    let _this = this;
    let maxRecordArray = [];
    let maxApprovalRecordArray = [];
    let recordArray = [];
    let approvalHeaderArray = [];
    let approvalArray = [];
    let data = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      sortByTotalAmount: true,
      pageNumber: this.state.pageCount,
      pageSize: pageSize
    };
    let suppArray = this.state.suppArray;
    this.props.actionLoaderShow();
    this.props
      .actionPartOrder(data)
      .then((result, error) => {
        let largest = 0;
        let approvalLargest = 0;
        let approvalResponse = result.payload.data.resourceData.list;
        let totalRecordCount =
          result.payload.data.resourceData.totalRecordCount;
        if (this.state.pageCount === 1) {
          approvalResponse &&
            approvalResponse.forEach(function(item) {
              maxRecordArray.push(item.maxRecords);
              maxApprovalRecordArray.push(item.maxApproverRecord);
              if (item.valueAnalystQuoteDetails) {
                _this.setState({ valueFlag: true });
              }
              // item.listOfTopFiveQuotations[0].listOfQuotation.forEach(function(
              //   elem
              // ) {
              //   if (elem.valueAnalystDetailResponse) {
              //     _this.setState({ valueFlag: true });
              //     item.valueAnalystDetailResponse = elem;
              //     item = '';
              //   }
              // });
            });
          maxRecordArray.forEach(function(item) {
            if (item > largest) {
              largest = item;
            }
          });
          maxApprovalRecordArray.forEach(function(item) {
            if (item > approvalLargest) {
              approvalLargest = item;
            }
          });

          for (let i = 0; i < largest; i++) {
            recordArray.push(i);
          }
          let sl = largest - 1;
          for (let x = 0; x < sl; x++) {
            suppArray.push(x + 1);
          }

          for (let i = 0; i < approvalLargest; i++) {
            approvalHeaderArray.push(i);
          }
          let asl = approvalLargest - 1;
          for (let x = 0; x < asl; x++) {
            approvalArray.push(x + 1);
          }
          suppArray = Object.assign([], suppArray);
          approvalArray = Object.assign([], approvalArray);
          _this.setState({
            partOrderData: approvalResponse,
            recordArray: recordArray,
            approvalHeaderArray: approvalHeaderArray,
            suppArray: Object.assign([], suppArray),
            approvalArray: Object.assign([], approvalArray),
            totalCount: totalRecordCount,
            recordLength: approvalResponse.length,
            isPageCount: true
          });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  fetchMoreData = () => {
    let _this = this;
    let maxRecordArray = [];
    let maxApprovalRecordArray = [];
    let recordArray = [];
    let approvalHeaderArray = [];
    let approvalArray = [];

    if (this.state.partOrderData.length >= this.state.totalCount) {
      this.setState({ hasMore: false });
      return;
    }

    if (this.state.isPageCount === true) {
      let PC = this.state.pageCount;
      let pageNumber = PC + 1;
      let concatData;
      this.setState({ pageCount: pageNumber });

      let data = {
        userId: this.props.userInfo.userData.id,
        roleId: this.props.userInfo.userData.userRole,
        sortByTotalAmount: true,
        pageNumber: this.state.pageCount,
        pageSize: pageSize
      };
      let suppArray = this.state.suppArray;
      this.props.actionLoaderShow();
      this.props
        .actionPartOrder(data)
        .then((result, error) => {
          let largest = 0;
          let approvalLargest = 0;
          let approvalResponse = result.payload.data.resourceData.list;
          let totalRecordCount =
            result.payload.data.resourceData.totalRecordCount;
          let oldApprovalResponse = this.state.partOrderData;
          if (this.state.pageCount > 1) {
            concatData = oldApprovalResponse.concat(approvalResponse);

            concatData &&
              concatData.forEach(function(item) {
                maxRecordArray.push(item.maxRecords);
                maxApprovalRecordArray.push(item.maxApproverRecord);
                if (item.valueAnalystQuoteDetails) {
                  _this.setState({ valueFlag: true });
                }
              });
            maxRecordArray.forEach(function(item) {
              if (item > largest) {
                largest = item;
              }
            });
            maxApprovalRecordArray.forEach(function(item) {
              if (item > approvalLargest) {
                approvalLargest = item;
              }
            });

            for (let i = 0; i < largest; i++) {
              recordArray.push(i);
            }
            let sl = largest - 1;
            for (let x = 0; x < sl; x++) {
              suppArray.push(x + 1);
            }

            for (let i = 0; i < approvalLargest; i++) {
              approvalHeaderArray.push(i);
            }
            let asl = approvalLargest - 1;
            for (let x = 0; x < asl; x++) {
              approvalArray.push(x + 1);
            }
            suppArray = Object.assign([], suppArray);
            approvalArray = Object.assign([], approvalArray);
            _this.setState({
              partOrderData: concatData,
              recordArray: recordArray,
              approvalHeaderArray: approvalHeaderArray,
              suppArray: Object.assign([], suppArray),
              approvalArray: Object.assign([], approvalArray),
              totalCount: totalRecordCount,
              recordLength: concatData.length
            });
          }
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  };

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  imageShow = (
    partId,
    partMediaResponse,
    partNumber,
    specificationResponse
  ) => {
    this.setState({
      show: true,
      partIdforMedia: partId,
      partNumberforMedia: partNumber,
      partMediaResponses: partMediaResponse,
      specificationResponses: specificationResponse
    });
  };

  handleCloseModal() {
    this.setState({ show: !this.state.show });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleReviewClose() {
    this.setState({ showReviewModal: false });
  }

  // reviewSummary(event, data) {
  //   // this.props.actionPartIdForReview(data);
  // }

  reviewQuotation(event, quotationId, item) {
    let _this = this;
    let data = {
      partId: item.listOfTopFiveQuotations[0].partResponse.id,
      quotationId: quotationId,
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole
    };
    this.props
      .actionGetQuotationData(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
        if (error) return;
        try {
          this.setState({
            reviewData: result.payload.data.resourceData,
            showReviewModal: true
          });
        } catch (error) {}
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleCommentClose() {
    this.setState({ showApproveModal: false });
  }

  approveResendPart(data, item, index) {
    // if (item.currentStatus === 'approved') {
    //   showSuccessToast('Already approved.');
    //   return;
    // }
    if (data === 'approve') {
      this.setState({
        status: 'approved',
        showResendButton: false,
        showApproveButton: true
      });
    } else {
      this.setState({
        status: 'send_back',
        showResendButton: true,
        showApproveButton: false
      });
    }
    this.setState({
      showApproveModal: true,
      orderData: item,
      currentIndex: index
    });
  }

  approveResendPartDetail(keyword) {
    let _this = this;
    let index = this.state.currentIndex;
    this.setState({
      showApproveModal: false
    });
    let status = '';
    let data = '';
    if (keyword === 'approve') {
      status = 'approved';
    } else {
      status = 'send_back';
    }

    this.state.orderData &&
      this.state.orderData.listOfTopFiveQuotations[0] &&
      this.state.orderData.listOfTopFiveQuotations[0].listOfQuotation.forEach(
        function(item, itemIndex) {
          if (item.finalQuotationSelectedByBuyer) {
            _this.setState(
              {
                quotationId: item.quotationId,
                showApproveModal: false,
                comment: '',
                partId:
                  _this.state.orderData &&
                  _this.state.orderData.listOfTopFiveQuotations[0] &&
                  _this.state.orderData.listOfTopFiveQuotations[0].partResponse
                    .id
              },
              () => {
                data = {
                  roleId: _this.props.userInfo.userData.userRole,
                  quotationId: _this.state.quotationId,
                  partId: _this.state.partId,
                  approverUserId: _this.props.userInfo.userData.id,
                  approvalId: _this.state.orderData.id,
                  status: status,
                  comment: _this.state.comment
                };

                _this.props
                  .actionApproveRejectOrder(data)
                  .then((result, error) => {
                    _this.props.actionLoaderHide();
                    let orderData = _this.state.orderData;
                    let partOrderData = _this.state.partOrderData;

                    if (
                      _this.state.status === 'approved' &&
                      result.payload.data.status === 200
                    ) {
                      // orderData[index].currentStatus = "approved";
                      partOrderData[index].currentStatus = 'approved';
                    } else if (
                      _this.state.status === 'send_back' &&
                      result.payload.data.status === 200
                    ) {
                      //orderData[index].currentStatus = "send_back";
                      partOrderData[index].currentStatus = 'send_back';
                    }

                    _this.setState({
                      //orderData: orderData,
                      partOrderData: partOrderData
                    });
                  })
                  .catch(e => _this.props.actionLoaderHide());
              }
            );
          }
        }
      );
  }

  editPart(item, index) {
    this.setState({ showEdit: true, editData: item, rowIndex: index });
  }
  handleCloseEditModal() {
    this.setState({ showEdit: false });
  }

  navigateToRFQ(data) {
    this.props.actionTabData(data);
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === 'first') this.props.history.push('home');
    if (tabKey === 'third')
      this.props.history.push({ pathname: 'home', state: { path: 'third' } });
    this.setState({ tabKey: tabKey });
  }

  dontClose(e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }
  render() {
    let editData =
      this.state.editData && this.state.editData[this.state.rowIndex];
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === 'fourth' ? 'fourth' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === 'fourth' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <div className="db-filter flex align-center justify-space-between">
                  <h4 className="hero-title">Approve Purchase Orders</h4>
                </div>

                <div>
                  <InfiniteScroll
                    dataLength={this.state.recordLength}
                    next={this.fetchMoreData}
                    hasMore={this.state.hasMore}
                    //loader={<h4>Loading...</h4>}
                    //height= {200}
                    // endMessage={
                    //   <p style={{ textAlign: "center" }}>
                    //     <b>Yay! You have seen it all</b>
                    //   </p>
                    // }
                  >
                    {this.state.partOrderData ? (
                      <Table
                        striped
                        bordered
                        responsive
                        className="custom-table v-align-top"
                      >
                        <thead>
                          <tr>
                            {/* <th>ID</th> */}
                            <th>Part Preview</th>
                            <th>Part Details</th>
                            {this.state.recordArray &&
                              this.state.recordArray.map((item, index) => {
                                return <th> Supplier {index + 1}</th>;
                              })}
                            <th>Final Supplier</th>
                            {this.state.approvalHeaderArray &&
                              this.state.approvalHeaderArray.map(
                                (item, index) => {
                                  return <th>Approval {index + 1}</th>;
                                }
                              )}
                            {this.state.valueFlag ? (
                              <th>Buyer Cost Estimation</th>
                            ) : null}

                            <th>Approver</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.partOrderData &&
                            // this.state.partOrderData.listOfTopFiveQuotations[0] &&
                            this.state.partOrderData.map((element, index) => {
                              let listOfQuotation =
                                element.listOfTopFiveQuotations[0]
                                  .listOfQuotation;
                              let listOfApprovers = element.listOfApprovers;
                              let maxRecordArray = Object.assign(
                                [],
                                this.state.suppArray
                              );
                              let maxApprovalRecordArray = Object.assign(
                                [],
                                this.state.approvalArray
                              );
                              return (
                                <tr>
                                  <td className="w100">
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        element.listOfTopFiveQuotations[0]
                                          .partResponse.id,
                                        element.listOfTopFiveQuotations[0]
                                          .partResponse.partMediaResponses,
                                        element.listOfTopFiveQuotations[0]
                                          .partResponse.partNumber
                                      )}
                                      src={
                                        element.listOfTopFiveQuotations[0]
                                          .partResponse.partMediaMainImage
                                      }
                                      alt=""
                                      width="45"
                                    />
                                  </td>
                                  <td>
                                    <div className="flex tb-main">
                                      <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                        Project&nbsp;:
                                      </span>
                                      <span className="flex-1 tb-value text-left">
                                        {
                                          element.listOfTopFiveQuotations[0]
                                            .partResponse.projectResponse
                                            .projectCode
                                        }
                                      </span>
                                    </div>
                                    <div className="flex tb-main">
                                      <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                        Part Number&nbsp;:
                                      </span>
                                      <span className="flex-1 tb-value text-left">
                                        {
                                          element.listOfTopFiveQuotations[0]
                                            .partResponse.partNumber
                                        }
                                      </span>
                                    </div>
                                    <div className="flex tb-main">
                                      <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                        Part Description&nbsp;:
                                      </span>
                                      <span className="flex-1 tb-value text-left w-125 text-ellipsis">
                                        {
                                          element.listOfTopFiveQuotations[0]
                                            .partResponse.partDescription
                                        }
                                      </span>
                                    </div>
                                    <div className="flex tb-main">
                                      <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                        Commodity&nbsp;:
                                      </span>
                                      <span className="flex-1 tb-value text-left">
                                        {
                                          element.listOfTopFiveQuotations[0]
                                            .partResponse.commodity
                                        }
                                      </span>
                                    </div>
                                  </td>

                                  {element.listOfTopFiveQuotations[0] &&
                                  element.listOfTopFiveQuotations[0]
                                    .listOfQuotation === 0
                                    ? maxRecordArray &&
                                      maxRecordArray.map(i => <td />)
                                    : element.listOfTopFiveQuotations[0] &&
                                      element.listOfTopFiveQuotations[0]
                                        .listOfQuotation &&
                                      element.listOfTopFiveQuotations[0].listOfQuotation.map(
                                        (elem, index) => {
                                          let checkCon =
                                            listOfQuotation[index + 1];
                                          if (checkCon)
                                            maxRecordArray &&
                                              maxRecordArray.pop();
                                          return [
                                            <td
                                              onClick={event => {
                                                this.reviewQuotation(
                                                  event,
                                                  elem.quotationId,
                                                  element
                                                );
                                              }}
                                            >
                                              {elem.valueAnalystDetailResponse ? null : (
                                                <div
                                                  className={
                                                    index % 2 === 0
                                                      ? 'small-info cursor-pointer ticket-blue'
                                                      : 'small-info cursor-pointer'
                                                  }
                                                >
                                                  <ul>
                                                    <li className="flex">
                                                      <span className="dis">
                                                        {' '}
                                                        {elem.supplierResponse &&
                                                          elem.supplierResponse
                                                            .companyName}
                                                        ,
                                                        {elem.supplierResponse &&
                                                          elem.supplierResponse
                                                            .addresseResponse[0]
                                                            .address}
                                                        ,
                                                        {elem.supplierResponse &&
                                                          elem.supplierResponse
                                                            .addresseResponse[0]
                                                            .state}
                                                        ,
                                                        {elem.supplierResponse &&
                                                          elem.supplierResponse
                                                            .addresseResponse[0]
                                                            .country}
                                                      </span>
                                                    </li>
                                                    <li className="flex">
                                                      <span className="dis">
                                                        {elem.costPerPiece}
                                                        {elem.currency}
                                                        /pc
                                                      </span>
                                                    </li>
                                                    <li className="flex">
                                                      <span className="ttl">
                                                        Tooling:
                                                      </span>
                                                      <span className="dis">
                                                        {elem.toolingCost}
                                                        INR
                                                      </span>
                                                    </li>
                                                    <li className="flex">
                                                      <span className="dis">
                                                        {elem.deliveryLeadTime}{' '}
                                                        days
                                                      </span>
                                                    </li>
                                                    <li className="flex">
                                                      <span className="dis">
                                                        Total Business:{' '}
                                                        {
                                                          elem.totalBussinessWithSupplier
                                                        }{' '}
                                                      </span>
                                                    </li>
                                                    <li className="flex">
                                                      <span className="dis">
                                                        Total Project Business:
                                                        {
                                                          elem.totalBussinessWithSupplierForProject
                                                        }{' '}
                                                      </span>
                                                    </li>
                                                  </ul>
                                                </div>
                                              )}
                                            </td>,
                                            checkCon
                                              ? null
                                              : maxRecordArray &&
                                                maxRecordArray.map(i => <td />)
                                          ];
                                        }
                                      )}

                                  {/* {element.listOfTopFiveQuotations[0] &&
                                    element.listOfTopFiveQuotations[0].listOfQuotation.map(
                                      (item, itemIndex) => {
                                        return [
                                          item.valueAnalystDetailResponse ? (
                                            <td
                                              key={itemIndex}
                                              onClick={event => {
                                                this.reviewQuotation(
                                                  event,
                                                  item.quotationId,
                                                  element
                                                );
                                              }}
                                            >
                                              <div className="small-info cursor-pointer">
                                                <ul>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      {item.valueAnalystDetailResponse
                                                        ? item
                                                            .valueAnalystDetailResponse
                                                            .firstName
                                                        : null}{" "}
                                                      {item.valueAnalystDetailResponse
                                                        ? item
                                                            .valueAnalystDetailResponse
                                                            .lastName
                                                        : null}
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      {item.costPerPiece}
                                                      {item.currency}
                                                      /pc
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="ttl">
                                                      Tooling:
                                                    </span>
                                                    <span className="dis">
                                                      {item.toolingCost}
                                                      INR
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      {item.deliveryLeadTime} days
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      Total Business:
                                                      {
                                                        item.totalBussinessWithSupplier
                                                      }{" "}
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      Total Project Business:
                                                      {
                                                        item.totalBussinessWithSupplierForProject
                                                      }{" "}
                                                    </span>
                                                  </li>
                                                </ul>
                                              </div>
                                            </td>
                                          ) : null
                                        ];
                                      }
                                    )} */}

                                  {element.listOfTopFiveQuotations[0] &&
                                    element.listOfTopFiveQuotations[0].listOfQuotation.map(
                                      (item, itemIndex) => {
                                        return [
                                          item.finalQuotationSelectedByBuyer ? (
                                            <td
                                              key={itemIndex}
                                              onClick={event => {
                                                this.reviewQuotation(
                                                  event,
                                                  item.quotationId,
                                                  element
                                                );
                                              }}
                                            >
                                              <div className="small-info cursor-pointer ticket-green">
                                                <ul>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      {item.supplierResponse &&
                                                        item.supplierResponse
                                                          .companyName}
                                                      ,
                                                      {item.supplierResponse &&
                                                        item.supplierResponse
                                                          .addresseResponse[0]
                                                          .address}
                                                      ,
                                                      {item.supplierResponse &&
                                                        item.supplierResponse
                                                          .addresseResponse[0]
                                                          .state}
                                                      ,
                                                      {item.supplierResponse &&
                                                        item.supplierResponse
                                                          .addresseResponse[0]
                                                          .country}
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      {item.costPerPiece}
                                                      {item.currency}
                                                      /pc
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="ttl">
                                                      Tooling:
                                                    </span>
                                                    <span className="dis">
                                                      {item.toolingCost}
                                                      INR
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      {item.deliveryLeadTime}{' '}
                                                      days
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      Total Business:
                                                      {
                                                        item.totalBussinessWithSupplier
                                                      }{' '}
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      Total Project Business:
                                                      {
                                                        item.totalBussinessWithSupplierForProject
                                                      }{' '}
                                                    </span>
                                                  </li>
                                                </ul>
                                              </div>
                                            </td>
                                          ) : null
                                        ];
                                      }
                                    )}

                                  {element.listOfApprovers &&
                                  element.listOfApprovers === 0
                                    ? maxApprovalRecordArray &&
                                      maxApprovalRecordArray.map(i => <td />)
                                    : element.listOfApprovers &&
                                      element.listOfApprovers.map(
                                        (elem, elemIndex) => {
                                          let checkCon1 =
                                            listOfApprovers[elemIndex + 1];
                                          if (checkCon1)
                                            maxApprovalRecordArray &&
                                              maxApprovalRecordArray.pop();
                                          return [
                                            <td>
                                              <div className="flex tb-main">
                                                <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                                  Full Name&nbsp;:
                                                </span>
                                                <span className="flex-1 tb-value text-left">
                                                  {elem.fullName}
                                                </span>
                                              </div>
                                              <div className="flex tb-main">
                                                <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                                  Status&nbsp;:
                                                </span>
                                                <span className="flex-1 tb-value text-left">
                                                  {removeUnderScore(
                                                    elem.approvalStatus
                                                  )}
                                                </span>
                                              </div>
                                              <div className="flex tb-main">
                                                <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                                  User Profile&nbsp;:
                                                </span>
                                                <span className="flex-1 tb-value text-left">
                                                  {removeUnderScore(
                                                    elem.userProfile
                                                  )}
                                                </span>
                                              </div>
                                            </td>,
                                            checkCon1
                                              ? null
                                              : maxApprovalRecordArray &&
                                                maxApprovalRecordArray.map(
                                                  i => <td />
                                                )
                                          ];
                                        }
                                      )}

                                  {/* value analyst start*/}
                                  {element.valueAnalystQuoteDetails ? (
                                    <td
                                      key={index}
                                      onClick={event => {
                                        this.reviewQuotation(
                                          event,
                                          element.valueAnalystQuoteDetails &&
                                            element.valueAnalystQuoteDetails
                                              .quotationId,
                                          element
                                        );
                                      }}
                                    >
                                      <div className="small-info cursor-pointer">
                                        <ul>
                                          <li className="flex">
                                            <span className="dis">
                                              {element.valueAnalystQuoteDetails
                                                .valueAnalystDetailResponse
                                                ? element
                                                    .valueAnalystQuoteDetails
                                                    .valueAnalystDetailResponse
                                                    .firstName
                                                : null}{' '}
                                              {element.valueAnalystQuoteDetails
                                                .valueAnalystDetailResponse
                                                ? element
                                                    .valueAnalystQuoteDetails
                                                    .valueAnalystDetailResponse
                                                    .lastName
                                                : null}
                                            </span>
                                          </li>
                                          <li className="flex">
                                            <span className="dis">
                                              {
                                                element.valueAnalystQuoteDetails
                                                  .costPerPiece
                                              }
                                              {
                                                element.valueAnalystQuoteDetails
                                                  .currency
                                              }
                                              /pc
                                            </span>
                                          </li>
                                          <li className="flex">
                                            <span className="ttl">
                                              Tooling:
                                            </span>
                                            <span className="dis">
                                              {
                                                element.valueAnalystQuoteDetails
                                                  .toolingCost
                                              }
                                              INR
                                            </span>
                                          </li>
                                          <li className="flex">
                                            <span className="dis">
                                              {
                                                element.valueAnalystQuoteDetails
                                                  .deliveryLeadTime
                                              }{' '}
                                              days
                                            </span>
                                          </li>
                                          <li className="flex">
                                            <span className="dis">
                                              Total Business:
                                              {
                                                element.valueAnalystQuoteDetails
                                                  .totalBussinessWithSupplier
                                              }{' '}
                                            </span>
                                          </li>
                                          <li className="flex">
                                            <span className="dis">
                                              Total Project Business:
                                              {
                                                element.valueAnalystQuoteDetails
                                                  .totalBussinessWithSupplierForProject
                                              }{' '}
                                            </span>
                                          </li>
                                        </ul>
                                      </div>
                                    </td>
                                  ) : this.state.valueFlag ? (
                                    <td />
                                  ) : null}
                                  {/* value analyst */}
                                  <td className="">
                                    <div className="w-175">
                                      <Link
                                        to={{
                                          pathname: 'reviewPOApproval',
                                          state: {
                                            partId:
                                              element.listOfTopFiveQuotations[0]
                                                .partResponse.id,
                                            partNumber:
                                              element.listOfTopFiveQuotations[0]
                                                .partResponse.partNumber
                                          }
                                        }}
                                      >
                                        <button className="btn btn-task">
                                          <span className="ico-action ">
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#review1Ico`}
                                              />
                                            </svg>
                                          </span>
                                          <span className="ico-txt">
                                            Review
                                          </span>
                                        </button>
                                      </Link>

                                      <button
                                        className={
                                          element.currentStatus === 'approved'
                                            ? 'btn btn-task  p-e-none'
                                            : 'btn btn-task'
                                        }
                                        onClick={() => {
                                          this.approveResendPart(
                                            'approve',
                                            element,
                                            index
                                          );
                                        }}
                                      >
                                        <span
                                          className={
                                            element.currentStatus === 'approved'
                                              ? 'ico-action fill-green'
                                              : 'ico-action '
                                          }
                                        >
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#rightCircleIco`}
                                            />
                                          </svg>
                                        </span>
                                        <span className="ico-txt">Approve</span>
                                      </button>

                                      <button
                                        className={
                                          element.currentStatus ===
                                            'approved' ||
                                          element.currentStatus === 'send_back'
                                            ? 'btn btn-task  p-e-none'
                                            : 'btn btn-task'
                                        }
                                        onClick={() => {
                                          this.approveResendPart(
                                            'send_back',
                                            element,
                                            index
                                          );
                                        }}
                                      >
                                        <span
                                          className={
                                            element.currentStatus ===
                                            'send_back'
                                              ? 'ico-action fill-red'
                                              : 'ico-action '
                                          }
                                        >
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#refresh1Ico`}
                                            />
                                          </svg>
                                        </span>
                                        <span className="ico-txt">Resend</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="noRecord">
                        <img src={noRecord} alt="" />
                      </div>
                    )}
                  </InfiniteScroll>
                </div>

                {/* <div className="m-b-50">
                  {this.state.partOrderData ? (
                    <Table bordered responsive hover className="custom-table">
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Part Number</th>
                          <th>Part Description</th>
                          <th>Commodity</th>
                          <th>Part Preview</th>
                          {this.state.recordArray &&
                            this.state.recordArray.map((item, index) => {
                              return <th> Supplier {index + 1}</th>;
                            })}
                          <th>Buyer Cost Estimation</th>
                          <th>Final Supplier</th>

                          <th>Approver</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.partOrderData &&
                          this.state.partOrderData.map((element, index) => {
                            let listOfQuotation =
                              element.listOfTopFiveQuotations[0]
                                .listOfQuotation;
                            let maxRecordArray = Object.assign(
                              [],
                              this.state.suppArray
                            );
                            return (
                              <tr>
                                <td>
                                  {
                                    element.listOfTopFiveQuotations[0]
                                      .partResponse.projectResponse.projectCode
                                  }
                                </td>
                                <td>
                                  {
                                    element.listOfTopFiveQuotations[0]
                                      .partResponse.partNumber
                                  }
                                </td>
                                <td>
                                  {
                                    element.listOfTopFiveQuotations[0]
                                      .partResponse.partDescription
                                  }
                                </td>
                                <td>
                                  {
                                    element.listOfTopFiveQuotations[0]
                                      .partResponse.commodity
                                  }
                                </td>
                                <td className="p-0">
                                  <img
                                    onClick={this.imageShow.bind(
                                      this,
                                      element.listOfTopFiveQuotations[0]
                                        .partResponse.id,
                                      element.listOfTopFiveQuotations[0]
                                        .partResponse.partMediaResponses,
                                      element.listOfTopFiveQuotations[0]
                                        .partResponse.partNumber
                                    )}
                                    src={
                                      element.listOfTopFiveQuotations[0]
                                        .partResponse.partMediaMainImage
                                    }
                                    alt=""
                                    width="45"
                                  />
                                </td>

                                {element.listOfTopFiveQuotations[0] &&
                                element.listOfTopFiveQuotations[0]
                                  .listOfQuotation === 0
                                  ? maxRecordArray &&
                                    maxRecordArray.map(i => <td />)
                                  : element.listOfTopFiveQuotations[0] &&
                                    element.listOfTopFiveQuotations[0]
                                      .listOfQuotation &&
                                    element.listOfTopFiveQuotations[0].listOfQuotation.map(
                                      (elem, index) => {
                                        let checkCon =
                                          listOfQuotation[index + 1];
                                        if (checkCon)
                                          maxRecordArray &&
                                            maxRecordArray.pop();
                                        return [
                                          <td
                                            onClick={event => {
                                              this.reviewQuotation(
                                                event,
                                                elem.quotationId,
                                                element
                                              );
                                            }}
                                          >
                                            {elem.valueAnalystDetailResponse ? null : (
                                              <div
                                                className={
                                                  index % 2 === 0
                                                    ? 'small-info cursor-pointer ticket-blue'
                                                    : 'small-info cursor-pointer'
                                                }
                                              >
                                                <ul>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      {' '}
                                                      {elem.supplierResponse &&
                                                        elem.supplierResponse
                                                          .companyName}
                                                      ,
                                                      {elem.supplierResponse &&
                                                        elem.supplierResponse
                                                          .addresseResponse[0]
                                                          .address}
                                                      ,
                                                      {elem.supplierResponse &&
                                                        elem.supplierResponse
                                                          .addresseResponse[0]
                                                          .state}
                                                      ,
                                                      {elem.supplierResponse &&
                                                        elem.supplierResponse
                                                          .addresseResponse[0]
                                                          .country}
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      {elem.costPerPiece}
                                                      {elem.currency}
                                                      /pc
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="ttl">
                                                      Tooling:
                                                    </span>
                                                    <span className="dis">
                                                      {elem.toolingCost}
                                                      INR
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      {elem.deliveryLeadTime}{' '}
                                                      days
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      {
                                                        elem.totalBussinessWithSupplier
                                                      }{' '}
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="dis">
                                                      {
                                                        elem.totalBussinessWithSupplierForProject
                                                      }{' '}
                                                    </span>
                                                  </li>
                                                </ul>
                                              </div>
                                            )}
                                          </td>,
                                          checkCon
                                            ? null
                                            : maxRecordArray &&
                                              maxRecordArray.map(i => <td />)
                                        ];
                                      }
                                    )}
                                {element.listOfTopFiveQuotations[0] &&
                                  element.listOfTopFiveQuotations[0].listOfQuotation.map(
                                    (item, itemIndex) => {
                                      return [
                                        item.valueAnalystDetailResponse ? (
                                          <td
                                            key={itemIndex}
                                            onClick={event => {
                                              this.reviewQuotation(
                                                event,
                                                item.quotationId,
                                                element
                                              );
                                            }}
                                          >
                                            <div className="small-info cursor-pointer">
                                              <ul>
                                                <li className="flex">
                                                  <span className="dis">
                                                    {item.valueAnalystDetailResponse
                                                      ? item
                                                          .valueAnalystDetailResponse
                                                          .firstName
                                                      : null}{' '}
                                                    {item.valueAnalystDetailResponse
                                                      ? item
                                                          .valueAnalystDetailResponse
                                                          .lastName
                                                      : null}
                                                  </span>
                                                </li>
                                                <li className="flex">
                                                  <span className="dis">
                                                    {item.costPerPiece}
                                                    {item.currency}
                                                    /pc
                                                  </span>
                                                </li>
                                                <li className="flex">
                                                  <span className="ttl">
                                                    Tooling:
                                                  </span>
                                                  <span className="dis">
                                                    {item.toolingCost}
                                                    INR
                                                  </span>
                                                </li>
                                                <li className="flex">
                                                  <span className="dis">
                                                    {item.deliveryLeadTime} days
                                                  </span>
                                                </li>
                                                <li className="flex">
                                                  <span className="dis">
                                                    {
                                                      item.totalBussinessWithSupplier
                                                    }{' '}
                                                  </span>
                                                </li>
                                                <li className="flex">
                                                  <span className="dis">
                                                    {
                                                      item.totalBussinessWithSupplierForProject
                                                    }{' '}
                                                  </span>
                                                </li>
                                              </ul>
                                            </div>
                                          </td>
                                        ) : null
                                      ];
                                    }
                                  )}
                                {element.listOfTopFiveQuotations[0] &&
                                  element.listOfTopFiveQuotations[0].listOfQuotation.map(
                                    (item, itemIndex) => {
                                      return [
                                        item.finalQuotationSelectedByBuyer ? (
                                          <td
                                            key={itemIndex}
                                            onClick={event => {
                                              this.reviewQuotation(
                                                event,
                                                item.quotationId,
                                                element
                                              );
                                            }}
                                          >
                                            <div className="small-info cursor-pointer ticket-green">
                                              <ul>
                                                <li className="flex">
                                                  <span className="dis">
                                                    {item.supplierResponse &&
                                                      item.supplierResponse
                                                        .companyName}
                                                    ,
                                                    {item.supplierResponse &&
                                                      item.supplierResponse
                                                        .addresseResponse[0]
                                                        .address}
                                                    ,
                                                    {item.supplierResponse &&
                                                      item.supplierResponse
                                                        .addresseResponse[0]
                                                        .state}
                                                    ,
                                                    {item.supplierResponse &&
                                                      item.supplierResponse
                                                        .addresseResponse[0]
                                                        .country}
                                                  </span>
                                                </li>
                                                <li className="flex">
                                                  <span className="dis">
                                                    {item.costPerPiece}
                                                    {item.currency}
                                                    /pc
                                                  </span>
                                                </li>
                                                <li className="flex">
                                                  <span className="ttl">
                                                    Tooling:
                                                  </span>
                                                  <span className="dis">
                                                    {item.toolingCost}
                                                    INR
                                                  </span>
                                                </li>
                                                <li className="flex">
                                                  <span className="dis">
                                                    {item.deliveryLeadTime} days
                                                  </span>
                                                </li>
                                                <li className="flex">
                                                  <span className="dis">
                                                    {
                                                      item.totalBussinessWithSupplier
                                                    }{' '}
                                                  </span>
                                                </li>
                                                <li className="flex">
                                                  <span className="dis">
                                                    {
                                                      item.totalBussinessWithSupplierForProject
                                                    }{' '}
                                                  </span>
                                                </li>
                                              </ul>
                                            </div>
                                          </td>
                                        ) : null
                                      ];
                                    }
                                  )}

                                <td className="">
                                  <div className="w-175">
                                    <Link
                                      to={{
                                        pathname: 'reviewPOApproval',
                                        state: {
                                          partId:
                                            element.listOfTopFiveQuotations[0]
                                              .partResponse.id,
                                          partNumber:
                                            element.listOfTopFiveQuotations[0]
                                              .partResponse.partNumber
                                        }
                                      }}
                                    >
                                      <button className="btn btn-task">
                                        <span className="ico-action ">
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#review1Ico`}
                                            />
                                          </svg>
                                        </span>
                                        <span className="ico-txt">Review</span>
                                      </button>
                                    </Link>

                                    <button
                                      className={
                                        element.currentStatus === 'approved'
                                          ? 'btn btn-task  p-e-none'
                                          : 'btn btn-task'
                                      }
                                      onClick={() => {
                                        this.approveResendPart(
                                          'approve',
                                          element,
                                          index
                                        );
                                      }}
                                    >
                                      <span
                                        className={
                                          element.currentStatus === 'approved'
                                            ? 'ico-action fill-green'
                                            : 'ico-action '
                                        }
                                      >
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#rightCircleIco`}
                                          />
                                        </svg>
                                      </span>
                                      <span className="ico-txt">Approve</span>
                                    </button>

                                    <button
                                      className={
                                        element.currentStatus === 'approved' ||
                                        element.currentStatus === 'send_back'
                                          ? 'btn btn-task  p-e-none'
                                          : 'btn btn-task'
                                      }
                                      onClick={() => {
                                        this.approveResendPart(
                                          'send_back',
                                          element,
                                          index
                                        );
                                      }}
                                    >
                                      <span
                                        className={
                                          element.currentStatus === 'send_back'
                                            ? 'ico-action fill-red'
                                            : 'ico-action '
                                        }
                                      >
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#refresh1Ico`}
                                          />
                                        </svg>
                                      </span>
                                      <span className="ico-txt">Resend</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="noRecord">
                      <img src={noRecord} alt="" />
                    </div>
                  )}
                </div> */}
                <div>
                  <Modal
                    show={this.state.showApproveModal}
                    onHide={this.handleCommentClose}
                    className="custom-popUp"
                    bsSize="small"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Comment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <FormGroup controlId="formControlsTextarea">
                        {/* <ControlLabel>Comment</ControlLabel> */}
                        <FormControl
                          componentClass="textarea"
                          placeholder="Comment"
                          value={this.state.comment}
                          onChange={this.handleChange}
                          name="comment"
                          required
                        />
                      </FormGroup>
                      <center>
                        <button
                          className={`btn btn-default ${
                            this.state.showApproveButton ? '' : 'hide'
                          }`}
                          onClick={() => {
                            this.approveResendPartDetail('approve');
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className={`btn btn-default ${
                            this.state.showResendButton ? '' : 'hide'
                          }`}
                          onClick={() => {
                            this.approveResendPartDetail('send_back');
                          }}
                        >
                          Resend
                        </button>
                      </center>
                    </Modal.Body>
                  </Modal>
                  <Modal
                    show={this.state.showReviewModal}
                    onHide={this.handleReviewClose}
                    className="custom-popUp modal-xl"
                    bsSize="large"
                  >
                    <Modal.Header>
                      <div className="flex justify-space-between">
                        <h4>Quotation Preview</h4>
                        <div className="">
                          <span className="print-btn">
                            <ReactToPrint
                              className="btn btn-link text-uppercase color-light sm-btn"
                              trigger={() => (
                                <a href="#">
                                  {' '}
                                  <span className="ico-print">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#printIco`} />
                                    </svg>
                                  </span>
                                </a>
                              )}
                              content={() => this.componentRef}
                              onClick={() => {
                                this.printScreen();
                              }}
                            />
                            <button
                              onClick={this.handleReviewClose}
                              className="btn btn-link text-uppercase color-light"
                            >
                              close
                            </button>
                          </span>
                        </div>
                      </div>
                    </Modal.Header>
                    <Modal.Body className="modal-scroll">
                      <div
                        className="p-lr-20"
                        ref={el => (this.componentRef = el)}
                      >
                        <div className="m-b-50">
                          <Table>
                            <tbody>
                              <tr>
                                {this.state.reviewData &&
                                this.state.reviewData
                                  .valueAnalystDetailResponse ? (
                                  <td className="b-0">
                                    <div className="brand">
                                      <img
                                        src={Image1}
                                        alt=""
                                        className="obj-cover"
                                      />
                                    </div>
                                    <div className="company-info">
                                      <Table className="">
                                        <tbody>
                                          <tr>
                                            <td>Buyer Cost Estimation:</td>
                                            <td>
                                              {this.props.userInfo &&
                                                this.props.userInfo.userData
                                                  .companyName}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Contact:</td>
                                            <td>
                                              {this.state.reviewData &&
                                                this.state.reviewData
                                                  .valueAnalystDetailResponse &&
                                                this.state.reviewData
                                                  .valueAnalystDetailResponse
                                                  .firstName}{' '}
                                              {this.state.reviewData &&
                                                this.state.reviewData
                                                  .valueAnalystDetailResponse &&
                                                this.state.reviewData
                                                  .valueAnalystDetailResponse
                                                  .LastName}
                                              ,{''}
                                              {this.state.reviewData &&
                                                this.state.reviewData
                                                  .valueAnalystDetailResponse &&
                                                this.state.reviewData
                                                  .valueAnalystDetailResponse
                                                  .userProfile &&
                                                this.state.reviewData
                                                  .valueAnalystDetailResponse
                                                  .userProfile + ', '}
                                              {this.state.reviewData &&
                                                this.state.reviewData
                                                  .valueAnalystDetailResponse &&
                                                this.state.reviewData
                                                  .valueAnalystDetailResponse
                                                  .mobile}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </div>
                                  </td>
                                ) : (
                                  <td className="b-0">
                                    <div className="brand">
                                      {this.props.userInfo &&
                                      this.props.userInfo.userData
                                        .companyLogo ? (
                                        <img
                                          src={
                                            this.props.userInfo &&
                                            this.props.userInfo.userData
                                              .companyLogo
                                          }
                                          alt=""
                                          className="obj-cover"
                                        />
                                      ) : (
                                        <img
                                          src={Image1}
                                          alt=""
                                          className="obj-cover"
                                        />
                                      )}
                                    </div>

                                    <div className="company-info">
                                      <Table className="">
                                        <tbody>
                                          <tr>
                                            <td>Supplier:</td>
                                            <td>
                                              {this.state.reviewData &&
                                                this.state.reviewData
                                                  .supplierResponse &&
                                                this.state.reviewData
                                                  .supplierResponse.companyName}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Contact:</td>
                                            <td>
                                              {this.state.reviewData &&
                                                this.state.reviewData
                                                  .quotationCreatorDetailResponse &&
                                                this.state.reviewData
                                                  .quotationCreatorDetailResponse
                                                  .firstName}{' '}
                                              {this.state.reviewData &&
                                                this.state.reviewData
                                                  .quotationCreatorDetailResponse &&
                                                this.state.reviewData
                                                  .quotationCreatorDetailResponse
                                                  .LastName}
                                              ,{''}
                                              {this.state.reviewData &&
                                                this.state.reviewData
                                                  .quotationCreatorDetailResponse &&
                                                this.state.reviewData
                                                  .quotationCreatorDetailResponse
                                                  .userProfile &&
                                                this.state.reviewData
                                                  .quotationCreatorDetailResponse
                                                  .userProfile + ', '}
                                              {this.state.reviewData &&
                                                this.state.reviewData
                                                  .quotationCreatorDetailResponse &&
                                                this.state.reviewData
                                                  .quotationCreatorDetailResponse
                                                  .mobile}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </div>
                                  </td>
                                )}
                                <td className="b-0">
                                  <div className="brand">
                                    <img
                                      src={Image1}
                                      alt=""
                                      className="obj-cover"
                                    />
                                  </div>
                                  <div className="company-info">
                                    <Table className="">
                                      <tbody>
                                        <tr>
                                          <td>Buyer:</td>
                                          <td>
                                            {this.props.userInfo &&
                                              this.props.userInfo.userData
                                                .companyName}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Contact:</td>
                                          <td>
                                            {this.state.reviewData &&
                                              this.state.reviewData
                                                .partCreatorDetailResponse &&
                                              this.state.reviewData
                                                .partCreatorDetailResponse
                                                .firstName}{' '}
                                            {this.state.reviewData &&
                                              this.state.reviewData
                                                .partCreatorDetailResponse &&
                                              this.state.reviewData
                                                .partCreatorDetailResponse
                                                .LastName}
                                            ,{''}
                                            {this.state.reviewData &&
                                              this.state.reviewData
                                                .partCreatorDetailResponse &&
                                              this.state.reviewData
                                                .partCreatorDetailResponse
                                                .userProfile &&
                                              this.state.reviewData
                                                .partCreatorDetailResponse
                                                .userProfile + ', '}
                                            {this.state.reviewData &&
                                              this.state.reviewData
                                                .partCreatorDetailResponse &&
                                              this.state.reviewData
                                                .partCreatorDetailResponse
                                                .mobile}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </Table>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </Table>

                          {/* <Row className="show-grid">
                            <Col md={6}>
                              <div className="brand">
                                {this.props.userInfo &&
                                this.props.userInfo.userData.companyLogo ? (
                                  <img
                                    src={
                                      this.props.userInfo &&
                                      this.props.userInfo.userData.companyLogo
                                    }
                                    alt=""
                                    className="obj-cover"
                                  />
                                ) : (
                                  <img
                                    src={Image1}
                                    alt=""
                                    className="obj-cover"
                                  />
                                )}
                              </div>
                              <div className="company-info">
                                <Table className="">
                                  <tbody>
                                    <tr>
                                      <td>Supplier:</td>
                                      <td>
                                        {this.props.userInfo &&
                                          this.props.userInfo.userData
                                            .companyName}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Contact:</td>
                                      <td>
                                        {this.props.userInfo &&
                                        this.props.userInfo.userData.fullname
                                          ? this.props.userInfo.userData.fullname.trim()
                                          : ""}
                                        ,&nbsp;
                                        {this.props.userInfo &&
                                        this.props.userInfo.userData.contactNo
                                          ? this.props.userInfo.userData.contactNo.trim()
                                          : ""}
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="brand">
                                <img
                                  src={Image1}
                                  alt=""
                                  className="obj-cover"
                                />
                              </div>
                              <div className="company-info">
                                <Table className="">
                                  <tbody>
                                    <tr>
                                      <td>Buyer:</td>
                                      <td>
                                        {this.props.userInfo &&
                                          this.props.userInfo.userData
                                            .companyName}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Contact:</td>
                                      <td>
                                        {this.state.reviewData &&
                                          this.state.reviewData
                                            .partCreatorDetailResponse &&
                                          this.state.reviewData
                                            .partCreatorDetailResponse
                                            .firstName}{" "}
                                        {this.state.reviewData &&
                                          this.state.reviewData
                                            .partCreatorDetailResponse &&
                                          this.state.reviewData
                                            .partCreatorDetailResponse.LastName}
                                        ,{""}
                                        {this.state.reviewData &&
                                          this.state.reviewData
                                            .partCreatorDetailResponse &&
                                          this.state.reviewData
                                            .partCreatorDetailResponse
                                            .userProfile}
                                        ,{" "}
                                        {this.state.reviewData &&
                                          this.state.reviewData
                                            .partCreatorDetailResponse &&
                                          this.state.reviewData
                                            .partCreatorDetailResponse.mobile}
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </div>
                            </Col>
                          </Row> */}
                        </div>
                        <div className="">
                          <h4 className="">Proto Tool</h4>
                          <div>
                            <Table
                              bordered
                              responsive
                              className="custom-table print-table"
                            >
                              <thead>
                                <tr>
                                  <th>Description</th>
                                  <th>Source (Country)</th>
                                  <th>Specification</th>
                                  <th>Tool Life (qty)</th>
                                  <th>Unit Cost</th>
                                  <th>Quantity</th>
                                  <th>Total Cost</th>
                                  {this.state.reviewData &&
                                    this.state.reviewData.quotationTool &&
                                    this.state.reviewData.quotationTool
                                      .listOfQuotationTool[0] &&
                                    this.state.reviewData.quotationTool.listOfQuotationTool[0].listOfTaxDetails.map(
                                      (item, index) => {
                                        return [
                                          <th>Tax Description {index + 1}</th>,
                                          <th>Tax Rate {index + 1}</th>,
                                          <th>Tax {index + 1}</th>
                                        ];
                                      }
                                    )}
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.reviewData &&
                                  this.state.reviewData.quotationTool &&
                                  this.state.reviewData.quotationTool.listOfQuotationTool.map(
                                    (item, index) => {
                                      return (
                                        <tr>
                                          <td>{item.description}</td>
                                          <td>{item.sourceCountry}</td>
                                          <td>{item.specificationNo}</td>
                                          <td>{item.toolLifeQuantity}</td>
                                          <td>{item.quantity}</td>
                                          <td>{item.description}</td>
                                          <td>{item.totalCost}</td>
                                          {item.listOfTaxDetails &&
                                            item.listOfTaxDetails.map(
                                              (elem, taxIndex) => {
                                                return [
                                                  <td>
                                                    {elem.taxDescription}
                                                  </td>,
                                                  <td>{elem.taxRate}</td>,
                                                  <td>{elem.taxCost}</td>
                                                ];
                                              }
                                            )}

                                          <td>{item.total}</td>
                                        </tr>
                                      );
                                    }
                                  )}

                                <tr>
                                  <td> </td>
                                  <td> </td>
                                  <td> </td>
                                  <td> </td>
                                  <td> </td>
                                  <td> </td>
                                  <td>
                                    {this.state.reviewData &&
                                      this.state.reviewData.quotationTool &&
                                      this.state.reviewData.quotationTool
                                        .costTotal}
                                  </td>
                                  {this.state.reviewData &&
                                    this.state.reviewData.quotationTool &&
                                    this.state.reviewData.quotationTool
                                      .outerToolTax &&
                                    this.state.reviewData.quotationTool.outerToolTax.map(
                                      (elem, taxIndex) => {
                                        return [
                                          <td> </td>,
                                          <td> </td>,
                                          <td>{elem.taxCost} </td>
                                        ];
                                      }
                                    )}
                                  <td>
                                    {this.state.reviewData &&
                                      this.state.reviewData.quotationTool &&
                                      this.state.reviewData.quotationTool
                                        .finalTotal}
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                          <h4>Proto Part</h4>
                          <div>
                            <Table
                              bordered
                              responsive
                              className="custom-table print-table"
                            >
                              <thead>
                                <tr>
                                  <th>Description</th>
                                  <th>Source (Country)</th>
                                  <th>Specification</th>
                                  <th>Units</th>
                                  <th>Gross Qty</th>
                                  <th>Finished Qty</th>
                                  <th>Raw Material Rate</th>
                                  <th>Scrap Qty</th>
                                  <th>Scrap Rate</th>
                                  <th>Scrap Recovery</th>
                                  <th>Final Raw Material Rate</th>
                                  {this.state.reviewData &&
                                    this.state.reviewData.quotationCost &&
                                    this.state.reviewData.quotationCost
                                      .listOfQuotationCost[0] &&
                                    this.state.reviewData.quotationCost.listOfQuotationCost[0].listOfTaxDetails.map(
                                      (item, index) => {
                                        return [
                                          <th>
                                            Tax Description
                                            {index + 1}
                                          </th>,
                                          <th>
                                            Tax Rate
                                            {index + 1}
                                          </th>,
                                          <th>
                                            Tax
                                            {index + 1}
                                          </th>
                                        ];
                                      }
                                    )}
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.reviewData &&
                                  this.state.reviewData.quotationCost &&
                                  this.state.reviewData.quotationCost.listOfQuotationCost.map(
                                    (item, index) => {
                                      return (
                                        <tr>
                                          <td>{item.description}</td>
                                          <td>{item.sourceCountry}</td>
                                          <td>{item.specificationNo}</td>
                                          <td>{item.units}</td>
                                          <td>{item.grossQty}</td>
                                          <td>{item.finishedQty}</td>
                                          <td>{item.rawMaterilaRate}</td>
                                          <td>{item.scrapQty}</td>
                                          <td>{item.scrapRate}</td>
                                          <td>{item.scrapRecovery}</td>
                                          <td>{item.finalRawMaterialRate}</td>

                                          {item.listOfTaxDetails &&
                                            item.listOfTaxDetails.map(
                                              (elem, taxIndex) => {
                                                return [
                                                  <td>
                                                    {elem.taxDescription}
                                                  </td>,
                                                  <td>{elem.taxRate}</td>,
                                                  <td>{elem.taxCost}</td>
                                                ];
                                              }
                                            )}

                                          <td>{item.totalCost}</td>
                                        </tr>
                                      );
                                    }
                                  )}

                                <tr>
                                  <td> </td>
                                  <td> </td>
                                  <td> </td>
                                  <td> </td>
                                  <td> </td>
                                  <td> </td>
                                  <td> </td>
                                  <td> </td>
                                  <td> </td>
                                  <td> </td>
                                  <td>
                                    {' '}
                                    {this.state.reviewData &&
                                      this.state.reviewData.quotationCost &&
                                      this.state.reviewData.quotationCost
                                        .totalRawMaterialCost}
                                  </td>
                                  {this.state.reviewData &&
                                    this.state.reviewData.quotationCost &&
                                    this.state.reviewData.quotationCost
                                      .outerCostTax &&
                                    this.state.reviewData.quotationCost.outerCostTax.map(
                                      (elem, taxIndex) => {
                                        return [
                                          <td> </td>,
                                          <td> </td>,
                                          <td>{elem.taxCost} </td>
                                        ];
                                      }
                                    )}
                                  <td>
                                    {' '}
                                    {this.state.reviewData &&
                                      this.state.reviewData.quotationCost &&
                                      this.state.reviewData.quotationCost
                                        .total}{' '}
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>

                          <h4>Process/Operation</h4>
                          <div>
                            <Table
                              bordered
                              responsive
                              className="custom-table print-table"
                            >
                              <thead>
                                <tr>
                                  <th>Machine/Tool/Equipment</th>
                                  <th>Speed</th>
                                  <th>Feed</th>
                                  <th>Time</th>
                                  <th>Cost/Time</th>
                                  <th>Weight</th>
                                  <th>Cost/Weight</th>
                                  <th>Diameter</th>
                                  <th>Cost/Diameter</th>
                                  <th>Length</th>
                                  <th>Cost/Length</th>
                                  <th>Width</th>
                                  <th>Cost/Width</th>
                                  <th>Depth</th>
                                  <th>Cost/Depth</th>
                                  <th>Volume</th>
                                  <th>Cost/Volume</th>
                                  <th>Setting up Time</th>
                                  <th>Cost/Setting up Time</th>
                                  {this.state.reviewData &&
                                    this.state.reviewData.quotationProcess &&
                                    this.state.reviewData.quotationProcess.listOfQuotationProcess[0].labourCost.map(
                                      (item, index) => {
                                        return (
                                          <th>
                                            Labour
                                            {index + 1}
                                          </th>
                                        );
                                      }
                                    )}

                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.reviewData &&
                                  this.state.reviewData.quotationProcess &&
                                  this.state.reviewData.quotationProcess.listOfQuotationProcess.map(
                                    (item, index) => {
                                      return (
                                        <tr>
                                          <td>{item.descriptionOfTool}</td>
                                          <td>{item.speed}</td>
                                          <td>{item.feed}</td>
                                          <td>{item.time}</td>
                                          <td>{item.costByTime}</td>
                                          <td>{item.weight}</td>
                                          <td>{item.costByWeight}</td>
                                          <td>{item.diameter}</td>
                                          <td>{item.costByDiameter}</td>
                                          <td>{item.length}</td>
                                          <td>{item.costByLength}</td>
                                          <td>{item.width}</td>
                                          <td>{item.costByWidth}</td>
                                          <td>{item.depth}</td>
                                          <td>{item.costByDepth}</td>
                                          <td>{item.volume}</td>
                                          <td>{item.costByVolume}</td>
                                          <td>{item.settingUpTime}</td>
                                          <td>{item.costBySettingUpTime}</td>

                                          {item.labourCost &&
                                            item.labourCost.map(
                                              (elem, taxIndex) => {
                                                return [
                                                  <td>{elem.labourCost}</td>
                                                ];
                                              }
                                            )}

                                          <td>{item.total}</td>
                                        </tr>
                                      );
                                    }
                                  )}
                              </tbody>
                            </Table>
                          </div>
                          <Row>
                            <Col md={12}>
                              <div className="text-right">
                                <ControlLabel className="fw-normal color-light">
                                  Subtotal
                                </ControlLabel>

                                <p>
                                  {this.state.reviewData &&
                                    this.state.reviewData.quotationProcess &&
                                    this.state.reviewData.quotationProcess
                                      .subTotal}
                                </p>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form horizontal>
                                <FormGroup controlId="formHorizontalEmail">
                                  <Col
                                    componentClass={ControlLabel}
                                    sm={4}
                                    className="color-light fw-normal text-left"
                                  >
                                    Currency:
                                  </Col>
                                  <Col sm={6}>
                                    {this.state.reviewData &&
                                      this.state.reviewData.currency}
                                  </Col>
                                </FormGroup>
                                <FormGroup controlId="formHorizontalEmail">
                                  <Col
                                    componentClass={ControlLabel}
                                    sm={4}
                                    className="color-light fw-normal text-left"
                                  >
                                    Quotation for Quantity:
                                  </Col>
                                  <Col sm={6}>
                                    {this.state.reviewData &&
                                      this.state.reviewData
                                        .quotationForQuantity}
                                  </Col>
                                </FormGroup>
                                <FormGroup controlId="formHorizontalPassword">
                                  <Col
                                    componentClass={ControlLabel}
                                    sm={4}
                                    className="color-light fw-normal text-left"
                                  >
                                    Delivery Lead Time:
                                  </Col>
                                  <Col sm={6}>
                                    {this.state.reviewData &&
                                      this.state.reviewData.deliveryLeadTime}
                                  </Col>
                                </FormGroup>
                                <FormGroup controlId="formHorizontalPassword">
                                  <Col
                                    componentClass={ControlLabel}
                                    sm={4}
                                    className="color-light fw-normal text-left"
                                  >
                                    Target Date:
                                  </Col>
                                  <Col sm={6}>
                                    {moment(
                                      this.state.reviewData &&
                                        this.state.reviewData.deliveryTargetDate
                                    ).format('DD/MM/YYYY')}
                                    {/* {this.state.reviewData &&
                                      this.state.reviewData.deliveryTargetDate} */}
                                  </Col>
                                </FormGroup>
                              </Form>
                            </Col>

                            <Col md={6}>
                              <div className="tax-info-wrap">
                                <Table className="m-b-0">
                                  <thead>
                                    <tr>
                                      <th />
                                      <th className="color-light">
                                        Description
                                      </th>
                                      <th className="color-light">Rate</th>
                                      <th className="color-light">Tax</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.reviewData &&
                                      this.state.reviewData.quotationProcess &&
                                      this.state.reviewData.quotationProcess.outerProcessTax.map(
                                        (item, index) => {
                                          return [
                                            <tr>
                                              <td className="fw-600">
                                                Tax {index + 1}
                                              </td>
                                              <td>{item.taxDescription}</td>
                                              <td>{item.taxRate}</td>
                                              <td>{item.taxCost}</td>
                                            </tr>
                                          ];
                                        }
                                      )}
                                  </tbody>
                                </Table>
                              </div>
                              <div className="text-right m-b-20">
                                <div className="total-box">
                                  <Table responsive className="m-b-0">
                                    <tbody>
                                      <tr>
                                        <td>Total Process:</td>
                                        <td className="w-125">
                                          {this.state.reviewData &&
                                            this.state.reviewData
                                              .quotationProcess &&
                                            this.state.reviewData
                                              .quotationProcess
                                              .totalProcessCost}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Packaging:</td>
                                        <td>
                                          {this.state.reviewData &&
                                            this.state.reviewData.packagingCost}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Logistics:</td>
                                        <td>
                                          {this.state.reviewData &&
                                            this.state.reviewData.logisticsCost}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Grand Total:</td>
                                        <td>
                                          {this.state.reviewData &&
                                            this.state.reviewData.grandTotal}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                  <Modal
                    show={this.state.showEdit}
                    onHide={this.handleEditClose}
                    className="custom-popUp modal-xl"
                  >
                    <Modal.Body>
                      <div>
                        <h4 className="hero-title m-b-30">Edit Part</h4>
                        <button
                          onClick={this.handleEditClose}
                          className="btn btn-link text-uppercase color-light"
                        >
                          close
                        </button>
                      </div>
                      <Row className="show-grid center-gap">
                        <Col md={6}>
                          {/* <h4 className="hero-title">Upload Designs </h4> */}
                          <div className="gray-card dash-border up-padd">
                            <div className="text-center">
                              <ul className="upload-list b-btm">
                                {/* {this.state.editData &&
                                  this.state.editData[this.state.rowIndex] &&
                                  this.state.editData[this.state.rowIndex]
                                    .partMediaResponses &&
                                  this.state.editData[
                                    this.state.rowIndex
                                  ].partMediaResponses.map( */}
                                {this.state.designList &&
                                  this.state.designList[this.state.rowIndex] &&
                                  this.state.designList[
                                    this.state.rowIndex
                                  ].map((designItem, index) => {
                                    return (
                                      <li className="flex justify-space-between align-center">
                                        <span>
                                          <img
                                            src={designItem.mediaURL}
                                            alt=""
                                          />
                                          {designItem.mediaName}
                                        </span>

                                        <span
                                          className="ico-delete cursor-pointer"
                                          onClick={e =>
                                            this.deleteDesign(
                                              e,
                                              index,
                                              designItem.mediaName
                                            )
                                          }
                                        >
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#deleteIco`}
                                            />
                                          </svg>
                                        </span>
                                      </li>
                                    );
                                  })}
                              </ul>
                              <div className="upload-btn cursor-pointer text-uppercase">
                                <span className="ico-upload w-full">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#upload1Ico`} />
                                  </svg>
                                </span>
                                upload Designs
                                <FormControl
                                  id="formControlsFile"
                                  multiple
                                  type="file"
                                  label="File"
                                  accept="image/jpeg, image/png, image/gif, video/mp4, video/webm"
                                  onChange={this.handleUploadDesign}
                                  disabled={this.state.selectedProjectId === ''}
                                  // help="Example block-level help text here."
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-center m-t-20">
                            <button
                              className="btn btn-success text-uppercase sm-btn"
                              onClick={() => {
                                this.addPartConfirmation('designs');
                              }}
                              disabled={this.state.selectedProjectId === ''}
                            >
                              add Designs
                            </button>
                          </div>
                        </Col>
                        <Col md={6}>
                          {/* <h4 className="hero-title">Upload Specifications</h4> */}
                          <div className="gray-card up-padd dash-border">
                            <ul className="upload-list b-btm">
                              {this.state.specificList &&
                                this.state.specificList[this.state.rowIndex] &&
                                this.state.specificList[
                                  this.state.rowIndex
                                ].map((designItem, index) => {
                                  return (
                                    <li className="flex justify-space-between align-center">
                                      <span>
                                        {designItem.mediaType ===
                                          'application/octet-stream' ||
                                        designItem.mediaType ===
                                          'application/vnd.ms-excel' ||
                                        designItem.mediaType ===
                                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
                                          <img src={xlsImage} alt="" />
                                        ) : designItem.mediaType ===
                                          'application/pdf' ? (
                                          <img src={pdfImage} alt="" />
                                        ) : (
                                          <img src={docImage} alt="" />
                                        )}
                                        {designItem.mediaName}
                                      </span>

                                      <span
                                        className="ico-delete cursor-pointer"
                                        onClick={e =>
                                          this.deleteSpecification(
                                            e,
                                            index,
                                            designItem.mediaName
                                          )
                                        }
                                      >
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#deleteIco`}
                                          />
                                        </svg>
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>

                            <div className="text-center">
                              <div className="upload-btn cursor-pointer text-uppercase">
                                <span className="ico-upload w-full">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#upload1Ico`} />
                                  </svg>
                                </span>
                                upload Specifications
                                <FormControl
                                  id="formControlsFile"
                                  multiple
                                  type="file"
                                  label="File"
                                  accept=".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
                                  onChange={this.handleUploadSpecification}
                                  disabled={this.state.selectedDesigns === ''}
                                  // help="Example block-level help text here."
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-center m-t-20 m-b-20">
                            <button
                              className="btn btn-success text-uppercase sm-btn"
                              onClick={() => {
                                this.addPartConfirmation('specification');
                              }}
                              disabled={this.state.selectedDesigns === ''}
                            >
                              add specification
                            </button>
                          </div>
                        </Col>
                      </Row>
                      <h4 className="hero-title">Edit Part Details </h4>
                      <div className="style-form m-t-40">
                        <Row className="show-grid">
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="partDescription"
                                required
                                onChange={event => {
                                  this.handleOnChangePartDetails(event);
                                }}
                                value={editData && editData.partDescription}
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Part Description</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="userName"
                                required
                              />
                              <FormControl.Feedback />
                              {/* <DropdownButton
                                title=" Select"
                                name="secpeificationData"
                                value={editData.specificationResponse}
                                className="w-125"
                              >
                                {editData.specificationResponse &&
                                  editData.specificationResponse.map(
                                    (item, i) => {
                                      return (
                                        <li className="xxx">
                                          <input
                                            type="checkbox"
                                            value={item}
                                            checked={
                                              item.isSelected ? true : false
                                            }
                                            disabled={
                                              item.isDisabled ? true : false
                                            }
                                            onClick={this.dontClose}
                                            onChange={event => {
                                              this.handleSpecificationSelectedOption(
                                                event,
                                                item,
                                                index,
                                                i
                                              );
                                            }}
                                          />
                                          <label>{item.mediaName}</label>
                                        </li>
                                      );
                                    }
                                  )}
                              </DropdownButton> */}

                              <ControlLabel>Specification</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="partRevisionNumber"
                                required
                                onChange={event => {
                                  this.handleOnChangePartDetails(event);
                                }}
                                value={editData && editData.partRevisionNumber}
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Part Revision Number</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="approver"
                                required
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Approver</ControlLabel>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="show-grid">
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="supplier"
                                required
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Supplier</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="quantity"
                                onChange={event => {
                                  this.handleOnChangePartDetails(event);
                                }}
                                required
                                value={editData && editData.quantity}
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Quantity</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="units"
                                required
                                onChange={event => {
                                  this.handleOnChangePartDetails(event);
                                }}
                                value={editData && editData.units}
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Units</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="usage"
                                required
                                onChange={event => {
                                  this.handleOnChangePartDetails(event);
                                }}
                                value={editData && editData.usage}
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Usage</ControlLabel>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="show-grid">
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="commodity"
                                required
                                onChange={event => {
                                  this.handleOnChangePartDetails(event);
                                }}
                                value={editData && editData.commodity}
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Commodity</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group w-300">
                              <FormControl
                                type="text"
                                name="address"
                                required
                                onChange={event => {
                                  this.handleOnChangeAddress(event);
                                }}
                                value={
                                  editData &&
                                  editData.deliveryAddressResponse &&
                                  editData.deliveryAddressResponse.address
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Delivery Address</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="state"
                                required
                                onChange={event => {
                                  this.handleOnChangeAddress(event);
                                }}
                                value={
                                  editData &&
                                  editData.deliveryAddressResponse &&
                                  editData.deliveryAddressResponse.state
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Delivery State</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="country"
                                required
                                onChange={event => {
                                  this.handleOnChangeAddress(event);
                                }}
                                value={
                                  editData &&
                                  editData.deliveryAddressResponse &&
                                  editData.deliveryAddressResponse.country
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Delivery Country</ControlLabel>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="show-grid">
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="packagingDeliveryConditions"
                                required
                                onChange={event => {
                                  this.handleOnChangePartDetails(event);
                                }}
                                value={
                                  editData &&
                                  editData.packagingDeliveryConditions
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>
                                Packaging/Delivery Condition
                              </ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group d-p-label">
                              <ControlLabel>Target Date</ControlLabel>
                              <Datetime
                                className="db-0"
                                closeOnSelect="true"
                                timeFormat={false}
                                dateFormat="YYYY-MM-DD"
                                min={moment().format('YYYY-MM-DD')}
                                inputProps={{ readOnly: true }}
                                onChange={e => {
                                  const value = e;
                                  this.handleOnChangePartDetails(
                                    {
                                      target: {
                                        name: 'targetDate',
                                        value
                                      }
                                    },
                                    1 //index
                                  );
                                }}
                                value={editData && editData.targetDate}
                              />
                              <FormControl.Feedback />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="production"
                                required
                                onChange={event => {
                                  this.handleOnChangePartDetails(event);
                                }}
                                value={editData && editData.production}
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Proto/Production</ControlLabel>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="show-grid">
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="shipmentQty"
                                required
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 0);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[0] &&
                                  editData.listOfPartialShipment[0].shipmentQty
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Shipment 1 Qty</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group d-p-label">
                              {/* <FormControl
                                type="text"
                                name="shipmentTargetDate"
                                required
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 0);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[0]
                                    .shipmentTargetDate
                                }
                              />
                              <FormControl.Feedback /> */}
                              <ControlLabel>
                                Shipment 1 Target Date
                              </ControlLabel>
                              <Datetime
                                className="db-0 "
                                closeOnSelect="true"
                                timeFormat={false}
                                dateFormat="YYYY-MM-DD"
                                min={moment().format('YYYY-MM-DD')}
                                inputProps={{ readOnly: true }}
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 0);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[0] &&
                                  editData.listOfPartialShipment[0]
                                    .shipmentTargetDate
                                }
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="shipmentQty"
                                required
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 1);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[1] &&
                                  editData.listOfPartialShipment[1].shipmentQty
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Shipment 2 Qty</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group d-p-label">
                              {/* <FormControl
                                type="text"
                                name="shipmentTargetDate"
                                required
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 1);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[1] &&
                                  editData.listOfPartialShipment[1]
                                    .shipmentTargetDate
                                }
                              />
                              <FormControl.Feedback /> */}
                              <ControlLabel>
                                Shipment 2 Target Date
                              </ControlLabel>
                              <Datetime
                                className="db-0"
                                closeOnSelect="true"
                                timeFormat={false}
                                dateFormat="YYYY-MM-DD"
                                min={moment().format('YYYY-MM-DD')}
                                inputProps={{ readOnly: true }}
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 2);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[2] &&
                                  editData.listOfPartialShipment[2]
                                    .shipmentTargetDate
                                }
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="show-grid">
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="shipmentQty"
                                required
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 2);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[2] &&
                                  editData.listOfPartialShipment[2].shipmentQty
                                }
                              />
                              <FormControl.Feedback />
                              {/* <Datetime
                                className="db-0"
                                closeOnSelect="true"
                                timeFormat={false}
                                dateFormat="YYYY-MM-DD"
                                min={moment().format('YYYY-MM-DD')}
                                timeFormat={false}
                                inputProps={{ readOnly: true }}
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 2);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[2]
                                    .shipmentTargetDate
                                } 
                              />*/}
                              <ControlLabel>Shipment 3 Qty</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group d-p-label">
                              {/* <FormControl
                                type="text"
                                name="shipmentTargetDate"
                                required
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 2);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[2] &&
                                  editData.listOfPartialShipment[2]
                                    .shipmentTargetDate
                                }
                              />
                              <FormControl.Feedback /> */}
                              <ControlLabel>
                                Shipment 3 Target Date
                              </ControlLabel>
                              <Datetime
                                className="db-0"
                                closeOnSelect="true"
                                timeFormat={false}
                                dateFormat="YYYY-MM-DD"
                                min={moment().format('YYYY-MM-DD')}
                                inputProps={{ readOnly: true }}
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 2);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[2] &&
                                  editData.listOfPartialShipment[2]
                                    .shipmentTargetDate
                                }
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="shipmentQty"
                                required
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 3);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[3] &&
                                  editData.listOfPartialShipment[3].shipmentQty
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Shipment 4 Qty</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group d-p-label">
                              {/* <FormControl
                                type="text"
                                name="shipmentTargetDate"
                                required
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 3);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[3] &&
                                  editData.listOfPartialShipment[3]
                                    .shipmentTargetDate
                                }
                              /> 
                               <FormControl.Feedback />*/}
                              <ControlLabel>
                                Shipment 4 Target Date
                              </ControlLabel>
                              <Datetime
                                className="db-0"
                                closeOnSelect="true"
                                timeFormat={false}
                                dateFormat="YYYY-MM-DD"
                                min={moment().format('YYYY-MM-DD')}
                                inputProps={{ readOnly: true }}
                                onChange={event => {
                                  this.handleOnChangeShipment(event, 3);
                                }}
                                value={
                                  editData &&
                                  editData.listOfPartialShipment &&
                                  editData.listOfPartialShipment[3] &&
                                  editData.listOfPartialShipment[3]
                                    .shipmentTargetDate
                                }
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>

                      <div className="text-center m-b-20">
                        <button
                          className="btn btn-default text-uppercase"
                          onClick={this.updatePart}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-success text-uppercase"
                          onClick={this.handleClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
            <Footer pageTitle={permissionConstant.footer_title.po_approval} />
          </div>
        ) : null}
        {this.state.show ? (
          <SliderModal
            show={this.state.show}
            partId={this.state.partIdforMedia}
            partNumber={this.state.partNumberforMedia}
            partMediaResponses={this.state.partMediaResponses}
            specificationResponses={this.state.specificationResponses}
            handleCloseModal={this.handleCloseModal}
          />
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
      actionPartOrder,
      actionTabData,
      actionApproveRejectOrder,
      actionPartIdForReview,
      actionGetQuotationData
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User
    // supplierParts: supplierParts
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApprovalPO);
