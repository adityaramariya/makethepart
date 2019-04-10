import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as moment from "moment";
import socketIOClient from "socket.io-client";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Modal,
  Table,
  Tooltip,
  Form,
  Row,
  Col
} from "react-bootstrap";
import { Link } from "react-router-dom";
import SliderModal from "../slider/sliderModal";
import Sprite from "../../img/sprite.svg";

import {
  actionLoaderHide,
  actionLoaderShow,
  actionPendingApprovalPartList,
  approveRejectQuotation
} from "../../common/core/redux/actions";
import ReactToPrint from "react-to-print";
import { showSuccessToast, topPosition } from "../../common/commonFunctions";
import Image1 from "../../img/image.png";
import CONSTANTS from "../../common/core/config/appConfig";
let { customConstant } = CONSTANTS;
let socket;
let pageSize = 15;
class PendingApprovalList extends Component {
  constructor(props) {
    super(props);
    socket = socketIOClient.connect(
      customConstant.webNotificationURL.node_server_URL
    );
    this.state = {
      showApproveModal: false,
      showCommentModal: false,
      showResendButton: false,
      showApproveButton: false,
      reviewData: {},
      comment: "",
      partResponse: [],
      quotationResponse: [],
      disableApprove: false,
      currentStatus: "",
      quotationId: "",
      approvalId: "",
      pendingApprovalList: "",
      currencyArray: [],
      status: "",
      hasMore: true,
      pageCount: 1,
      isPageCount: false,
      noRecordImage: false
    };

    this.partDetailReview = this.partDetailReview.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCommentClose = this.handleCommentClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.tabCheck = this.tabCheck.bind(this);
    this.tabCheckSecond = this.tabCheckSecond.bind(this);

    this.tooltipApprove = <Tooltip id="tooltip1">Approve</Tooltip>;
    this.tooltipReview = <Tooltip id="tooltip2">Review</Tooltip>;
    this.tooltipResend = <Tooltip id="tooltip3">Resend</Tooltip>;
  }

  getPendingApprovalPartList() {
    let _this = this;
    this.props.actionLoaderShow();
    let data = {
      userId: this.props.userInfo.userData.id || "",
      roleId: this.props.userInfo.userData.userRole || "",
      pageNumber: this.state.pageCount,
      pageSize: pageSize
    };
    //.actionPendingApprovalPartList({ userId, roleId })
    this.props
      .actionPendingApprovalPartList(data)
      .then((result, error) => {
        let totalRecordCount =
          result.payload.data.resourceData.totalRecordCount;
        if (this.state.pageCount === 1) {
          let pendingApprovalList = result.payload.data.resourceData.list;
          _this.setState({
            pendingApprovalList: pendingApprovalList,
            isPageCount: true,
            totalRecordCount: totalRecordCount,
            recordLength: pendingApprovalList.length,
            noRecordImage: true
          });
        } else {
          let concatPendingApprovalList = [];
          let newPendingApprovalList = result.payload.data.resourceData.list;
          let oldPendingApprovalList = this.state.pendingApprovalList;
          concatPendingApprovalList = oldPendingApprovalList.concat(
            newPendingApprovalList
          );
          _this.setState({
            pendingApprovalList: concatPendingApprovalList,
            totalRecordCount: totalRecordCount,
            recordLength: concatPendingApprovalList.length
          });
        }

        let currencyArray = [];
        this.state.pendingApprovalList.forEach(function(item, index) {
          currencyArray[index] = item.quotationResponse.currency;
        });
        this.setState({
          currencyArray: currencyArray
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  componentDidMount() {
    this.getPendingApprovalPartList();
  }

  getMoreData = () => {
    let _this = this;
    if (this.state.pendingApprovalList.length >= this.state.totalRecordCount) {
      this.setState({ hasMore: false });
      return;
    }
    if (this.state.isPageCount === true) {
      let PC = this.state.pageCount;
      let pageNumber = PC + 1;
      this.setState({ pageCount: pageNumber });
      this.getPendingApprovalPartList();
    }
  };

  tabCheck() {
    this.props.tabCheck("first");
  }

  tabCheckSecond() {
    this.props.tabCheckSecond("second");
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  partDetailReview(data, item, index) {
    if (item) {
      this.setState({
        currentIndex: index,
        quotationId: item.quotationResponse.quotationId,
        approvalId: item.id
      });

      if (data.currentStatus === "approved") {
        this.setState({
          currentStatus: "approve",
          showApproveButton: false
        });
      } else {
        this.setState({
          showApproveButton: true
        });
      }
    }

    this.setState(
      {
        reviewData: data.quotationResponse,
        buyerDetailResponse:
          data.partResponse && data.partResponse.buyerDetailResponse,
        buyerResponse: data.partResponse && data.partResponse.buyerResponse,
        responseData: data
      },
      () => {
        this.setState({
          showApproveModal: true
        });
      }
    );
  }

  approveResendPartDetail(item) {
    this.setState({
      showCommentModal: false,
      comment: ""
    });
    let _this = this;
    let index = this.state.currentIndex;
    let status = "";
    if (item === "approve") {
      status = "approved";
    } else {
      status = "send_back";
    }
    let data = {};
    if (this.state.quotationId) {
      data = {
        roleId: this.props.userInfo.userData.userRole,
        approverUserId: this.props.userInfo.userData.id,
        status: status,
        quotationId: this.state.quotationId,
        approvalId: this.state.approvalId,
        comment: this.state.comment
      };
    } else {
      data = {
        roleId: this.props.userInfo.userData.userRole,
        approverUserId: this.props.userInfo.userData.id,
        status: status,
        quotationId:
          this.state.reviewData &&
          this.state.reviewData.quotationResponse &&
          this.state.reviewData.quotationResponse.quotationId,
        approvalId: this.state.reviewData && this.state.reviewData.id,
        comment: this.state.comment
      };
    }
    this.props
      .approveRejectQuotation(data)
      .then((result, error) => {
        if (result.payload.data.status === 200) {
          let socketData = {
            notificationId: result.payload.data.resourceData
          };
          socket.emit("new-message", socketData);
        }
        _this.props.actionLoaderHide();
        let pendingApprovalList = this.state.pendingApprovalList;
        if (_this.state.status === "approved") {
          pendingApprovalList[index].currentStatus = "approved";
        } else {
          pendingApprovalList[index].currentStatus = "send_back";
        }
        _this.setState({ pendingApprovalList: pendingApprovalList });
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  approveResendPart(data, item, index) {
    if (item) {
      this.setState({
        currentIndex: index,
        quotationId:
          item && item.quotationResponse && item.quotationResponse.quotationId,
        approvalId: item.id
      });
      // if (item.currentStatus === 'approved') {
      //   showSuccessToast('Already approved.');
      //   return;
      // }
    }
    // else {
    //   if (this.state.currentStatus === 'approve') {
    //     showSuccessToast('Already approved.');
    //     return;
    //   }
    // }
    if (data === "approve") {
      this.setState({
        status: "approved",
        showResendButton: false,
        showApproveButton: true,
        showApproveModal: false,
        showCommentModal: true
      });
    } else {
      this.setState({
        status: "send_back",
        showResendButton: true,
        showApproveButton: false,
        showApproveModal: false,
        showCommentModal: true
      });
    }
  }

  imageShow = (
    partId,
    partMediaResponse,
    partNumber,
    specificationResponse
  ) => {
    let media = specificationResponse
      ? partMediaResponse.concat(specificationResponse)
      : partMediaResponse;

    this.setState(
      {
        show: true,
        partIdforMedia: partId,
        partMediaResponses: media,
        partNumberForMedia: partNumber
      },
      () => {
        console.log("speci res.................", this.state.specificatio);
      }
    );
  };

  handleCloseModal() {
    this.setState({ show: !this.state.show });
  }

  handleClose() {
    this.setState({ showApproveModal: false });
  }
  handleCommentClose() {
    this.setState({ showCommentModal: false });
  }

  render() {
    //this.props.supplierParts.pendingApprovalList
    return (
      <div {...this.props}>
        <div className="content-body flex">
          <div className="content">
            <div className="container-fluid">
              <h4 className="hero-title">Approve Quotations for Submission </h4>
              <div className="for-table-s">
                {this.state.pendingApprovalList.length ? (
                  <InfiniteScroll
                    dataLength={this.state.recordLength}
                    next={this.getMoreData}
                    hasMore={this.state.hasMore}
                    height={300}
                  >
                    <div className="flex m-b-20">
                      <div className="fix-table">
                        <Table
                          bordered
                          responsive
                          hover
                          className="custom-table"
                        >
                          <thead>
                            <tr>
                              <th> </th>
                              <th className="h-81">Buyer</th>
                              <th>Project</th>
                              <th>Part Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.pendingApprovalList.map(
                              (item, index) => {
                                return (
                                  <tr>
                                    <td className="p-0 h-55">
                                      <div className="w-175">
                                        <button
                                          className="btn btn-task"
                                          onClick={() => {
                                            const data = item;
                                            this.partDetailReview(
                                              data,
                                              item,
                                              index
                                            );
                                          }}
                                        >
                                          <span className="ico-action">
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
                                        <button
                                          className={
                                            item.currentStatus === "approved"
                                              ? "btn btn-task  p-e-none"
                                              : "btn btn-task"
                                          }
                                          onClick={() => {
                                            this.approveResendPart(
                                              "approve",
                                              item,
                                              index
                                            );
                                          }}
                                        >
                                          <span
                                            className={
                                              item.currentStatus === "approved"
                                                ? "ico-action fill-green"
                                                : "ico-action "
                                            }
                                          >
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#rightCircleIco`}
                                              />
                                            </svg>
                                          </span>
                                          <span className="ico-txt">
                                            Approve
                                          </span>
                                        </button>
                                        <button
                                          className={
                                            item.currentStatus === "approved" ||
                                            item.currentStatus === "send_back"
                                              ? "btn btn-task  p-e-none"
                                              : "btn btn-task"
                                          }
                                          onClick={() => {
                                            this.approveResendPart(
                                              "send_back",
                                              item,
                                              index
                                            );
                                          }}
                                        >
                                          <span
                                            className={
                                              item.currentStatus === "send_back"
                                                ? "ico-action fill-red"
                                                : "ico-action "
                                            }
                                          >
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#refresh1Ico`}
                                              />
                                            </svg>
                                          </span>
                                          <span className="ico-txt">
                                            Resend
                                          </span>
                                        </button>
                                      </div>
                                    </td>
                                    <td className="h-55">
                                      <span className="d-inline w100 text-ellipsis">
                                        {" "}
                                        {
                                          item.partResponse.buyerResponse
                                            .companyName
                                        }
                                      </span>
                                    </td>
                                    <td>
                                      {
                                        item.partResponse.projectResponse
                                          .projectTitle
                                      }
                                    </td>
                                    <td>{item.partResponse.partNumber}</td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </Table>
                      </div>
                      <div className="scroll-table">
                        <Table
                          bordered
                          responsive
                          hover
                          className="custom-table cell-125"
                        >
                          <thead>
                            <tr>
                              <th className="h-81">Part Description</th>
                              <th>Quantity</th>
                              <th>Proto/Production</th>
                              <th>Delivery Location</th>
                              <th>Delivery Country</th>
                              <th>Supplier</th>
                              <th>Part Preview</th>
                              <th>Logistics Cost</th>
                              <th>Packaging Cost</th>
                              <th rowSpan="1" className="two-row">
                                <tr>
                                  <td>Quantity</td>
                                </tr>
                                <tr>
                                  <td />
                                </tr>
                              </th>
                              <th rowSpan="1" className="two-row">
                                <tr>
                                  <td>Total</td>
                                </tr>
                                {/* <tr>
                              <td>INR</td>
                            </tr> */}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.pendingApprovalList &&
                              this.state.pendingApprovalList.map(
                                (item, listIndex) => {
                                  return (
                                    <tr>
                                      <td className="h-55">
                                        <span className="d-inline w100 text-ellipsis">
                                          {item.partResponse.partDescription}
                                        </span>
                                      </td>
                                      <td>{item.partResponse.quantity}</td>
                                      <td>{item.partResponse.production}</td>
                                      <td>
                                        <span className="d-inline w100 text-ellipsis">
                                          {
                                            item.partResponse
                                              .deliveryAddressResponse.address
                                          }
                                        </span>
                                      </td>
                                      <td>
                                        {
                                          item.partResponse
                                            .deliveryAddressResponse.country
                                        }
                                      </td>
                                      <td>
                                        {item.quotationResponse &&
                                          item.quotationResponse
                                            .supplierResponse &&
                                          item.quotationResponse
                                            .supplierResponse.companyName}
                                      </td>
                                      <td className="p-0 cursor-pointer">
                                        <img
                                          onClick={this.imageShow.bind(
                                            this,
                                            item.partResponse.id,
                                            item.partResponse
                                              .partMediaResponses,
                                            item.partResponse.partNumber,
                                            item.partResponse
                                              .specificationResponse
                                          )}
                                          src={
                                            item.partResponse.partMediaMainImage
                                          }
                                          width="45"
                                        />
                                      </td>

                                      <td>
                                        {item.quotationResponse &&
                                          item.quotationResponse
                                            .logisticsCost}{" "}
                                        {item.quotationResponse &&
                                        item.quotationResponse.currency ? (
                                          <span>/</span>
                                        ) : null}{" "}
                                        {item.quotationResponse &&
                                          item.quotationResponse.currency}
                                      </td>
                                      <td>
                                        {item.quotationResponse &&
                                          item.quotationResponse
                                            .packagingCost}{" "}
                                        {item.quotationResponse &&
                                        item.quotationResponse.currency ? (
                                          <span>/</span>
                                        ) : null}{" "}
                                        {item.quotationResponse &&
                                          item.quotationResponse.currency}
                                      </td>
                                      <td>
                                        {item.quotationResponse &&
                                          item.quotationResponse
                                            .quotationForQuantity}
                                      </td>
                                      <td>
                                        <span className="mw-100 text-ellipsis d-inline v-a-middle">
                                          {item.quotationResponse &&
                                            item.quotationResponse
                                              .grandTotal}{" "}
                                          {item.quotationResponse &&
                                          item.quotationResponse.currency ? (
                                            <span>/</span>
                                          ) : null}
                                        </span>
                                        {item.quotationResponse &&
                                          item.quotationResponse.currency}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </InfiniteScroll>
                ) : (
                  <div className="noRecord">No Record Found...!</div>
                )}

                {/* <Row className="show-grid">
                <Col md={5} className="pr-0">
                
                </Col>
                <Col md={7}>
                 
                </Col>
              </Row> */}
              </div>
              <div>
                <div>
                  <Modal
                    show={this.state.showApproveModal}
                    onHide={this.handleClose}
                    className="custom-popUp modal-xl"
                    bsSize="large"
                  >
                    <Modal.Header>
                      {/* <Modal.Title>Create Quotation Preview </Modal.Title> */}
                      <div className="flex justify-space-between">
                        {/* <h4>
                          Part ID:{' '}
                          <b>
                            {this.state.reviewData.partResponse
                              ? this.state.reviewData.partResponse.partNumber
                              : ''}
                          </b>
                        </h4> */}
                        <h4>Quotation Preview</h4>
                        <div className="">
                          <span className="print-btn">
                            <ReactToPrint
                              className="btn btn-link text-uppercase color-light sm-btn"
                              trigger={() => (
                                <a href="#">
                                  {" "}
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
                          </span>
                          <button
                            className={`btn btn-default text-uppercase ${
                              this.state.showApproveButton ? "" : "hide"
                            }`}
                            // className="btn btn-default text-uppercase"
                            onClick={() => {
                              this.approveResendPart("approve");
                            }}
                          >
                            approve
                          </button>
                          <button
                            className={`btn btn-success text-uppercase ${
                              this.state.showApproveButton ? "" : "hide"
                            }`}
                            // className="btn btn-success text-uppercase"
                            onClick={() => {
                              this.approveResendPart("send_back");
                            }}
                          >
                            Resend
                          </button>
                          <button
                            onClick={this.handleClose}
                            className="btn btn-link text-uppercase color-light"
                          >
                            close
                          </button>
                        </div>
                      </div>
                    </Modal.Header>
                    <Modal.Body>
                      <div
                        className="p-lr-20"
                        ref={el => (this.componentRef = el)}
                      >
                        <div className="m-b-50">
                          <Table className="no-border-table">
                            <tbody>
                              <tr>
                                <td>
                                  <div className="brand">
                                    {this.props.userInfo &&
                                    this.props.userInfo.userData.companyLogo ? (
                                      <img
                                        src={
                                          this.props.userInfo &&
                                          this.props.userInfo.userData
                                            .companyLogo
                                        }
                                        className="obj-cover"
                                      />
                                    ) : (
                                      <img src={Image1} className="obj-cover" />
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
                                            this.props.userInfo.userData
                                              .fullname
                                              ? this.props.userInfo.userData.fullname.trim()
                                              : ""}
                                            ,&nbsp;
                                            {this.props.userInfo &&
                                            this.props.userInfo.userData
                                              .contactNo
                                              ? this.props.userInfo.userData.contactNo.trim()
                                              : ""}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </Table>
                                  </div>
                                </td>
                                <td>
                                  <div className="brand">
                                    <img src={Image1} className="obj-cover" />
                                  </div>
                                  <div className="company-info">
                                    <Table className="">
                                      <tbody>
                                        <tr>
                                          <td>Buyer:</td>
                                          <td>
                                            {this.state.buyerResponse &&
                                              this.state.buyerResponse
                                                .companyName}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Contact:</td>
                                          <td>
                                            {this.state.buyerDetailResponse &&
                                              this.state.buyerDetailResponse
                                                .firstName}{" "}
                                            {this.state.buyerDetailResponse &&
                                              this.state.buyerDetailResponse
                                                .LastName}
                                            ,{""}
                                            {this.state.buyerDetailResponse &&
                                              this.state.buyerDetailResponse
                                                .userProfile}
                                            ,{" "}
                                            {this.state.buyerDetailResponse &&
                                              this.state.buyerDetailResponse
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
                                    {" "}
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
                                    {" "}
                                    {this.state.reviewData &&
                                      this.state.reviewData.quotationCost &&
                                      this.state.reviewData.quotationCost
                                        .total}{" "}
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

                          <Table className="no-border-table">
                            <tbody>
                              <tr>
                                <td>
                                  {" "}
                                  <Table className="info-table">
                                    <tbody>
                                      <tr>
                                        <td className="color-light">
                                          Currency:
                                        </td>
                                        <td>
                                          {" "}
                                          {this.state.reviewData &&
                                            this.state.reviewData.currency}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="color-light">
                                          Quotation for Quantity::
                                        </td>
                                        <td>
                                          {this.state.reviewData &&
                                            this.state.reviewData
                                              .quotationForQuantity}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="color-light">
                                          Delivery Lead Time:
                                        </td>
                                        <td>
                                          {this.state.reviewData &&
                                            this.state.reviewData
                                              .deliveryLeadTime}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="color-light">
                                          Target Date:
                                        </td>
                                        <td>
                                          {this.state.reviewData &&
                                            moment(
                                              this.state.reviewData
                                                .deliveryTargetDate
                                            ).format("DD/MM/YYYY")}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                  {/* <Form horizontal>
                                    <FormGroup controlId="formHorizontalEmail">
                                      <Col
                                        componentClass={ControlLabel}
                                        sm={4}
                                        className="color-light fw-normal text-left"
                                      >
                                        Currency:
                                      </Col>
                                      <Col sm={6}>
                                       
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
                                          this.state.reviewData
                                            .deliveryLeadTime}
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
                                        {this.state.reviewData &&
                                          this.state.reviewData
                                            .deliveryTargetDate}
                                      </Col>
                                    </FormGroup>
                                  </Form> */}
                                </td>
                                <td>
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
                                          this.state.reviewData
                                            .quotationProcess &&
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
                                                this.state.reviewData
                                                  .packagingCost}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Logistics:</td>
                                            <td>
                                              {this.state.reviewData &&
                                                this.state.reviewData
                                                  .logisticsCost}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Grand Total:</td>
                                            <td>
                                              {this.state.reviewData &&
                                                this.state.reviewData
                                                  .grandTotal}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
                <div>
                  <Modal
                    show={this.state.showCommentModal}
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
                            this.state.showApproveButton ? "" : "hide"
                          }`}
                          onClick={() => {
                            this.approveResendPartDetail("approve");
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className={`btn btn-default ${
                            this.state.showResendButton ? "" : "hide"
                          }`}
                          onClick={() => {
                            this.approveResendPartDetail("send_back");
                          }}
                        >
                          Resend
                        </button>
                      </center>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>

              <SliderModal
                show={this.state.show}
                partId={this.state.partIdforMedia}
                partMediaResponses={this.state.partMediaResponses}
                partNumber={this.state.partNumberForMedia}
                handleCloseModal={this.handleCloseModal}
              />
            </div>
          </div>
          <footer>
            <button
              className="btn btn-block br-0 btn-toTop text-uppercase"
              onClick={topPosition}
            >
              back to top
            </button>
            <div className="bg-Dgray">
              <div className="footer-container">
                <div className="p-tags-wrapper flex justify-space-between">
                  <ul className="p-tags">
                    <li>
                      <a onClick={this.tabCheckSecond}>
                        Review Part for Quotation
                      </a>
                    </li>
                    <li>
                      <a className="disabled">Quality certification</a>
                    </li>
                    <li>
                      <a className="disabled">Major Account Details</a>
                    </li>
                    <li>
                      <Link to="businessDetails">Business Details</Link>
                    </li>
                  </ul>

                  <ul className="p-tags">
                    <li>
                      <Link className="" to="vendor">
                        Vendor Registration with the Buyer
                      </Link>
                    </li>
                    <li>
                      <a className="disabled">Buyer Criteria</a>
                    </li>
                    <li>
                      <a className="disabled">Approve Quotation</a>
                    </li>
                    <li>
                      <a onClick={this.tabCheck}>My Dashboard</a>
                    </li>
                  </ul>

                  <ul className="p-tags">
                    {this.props.userInfo.userData.isAdmin ? (
                      <li>
                        <a onClick={() => this.props.history.push("adduser")}>
                          Add Users
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    <li>
                      <Link to="updatePartStatus">Update Parts Status</Link>
                    </li>
                    <li>
                      <a className="disabled">Download Parts Summary</a>
                    </li>
                    <li>
                      <Link to="infrastructureAudit">Infrastructure Audit</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
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
      approveRejectQuotation
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
)(PendingApprovalList);
