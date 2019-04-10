import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import ReactToPrint from 'react-to-print';
import ReactPaginate from 'react-paginate';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  Table,
  ControlLabel,
  Form,
  Modal,
  FormGroup,
  Row,
  Col
} from 'react-bootstrap';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import noRecord from '../../img/no_record.png';
import Image1 from '../../img/image.png';
import Sprite from '../../img/sprite.svg';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionDashboardData,
  actionDashboardHistory,
  actionGetClassifications
} from '../../common/core/redux/actions';
import { topPosition } from '../../common/commonFunctions';
import Slider from 'react-slick';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import { handlePermission } from '../../common/permissions';
let { permissionConstant } = CONSTANTS;
let pageSize = 15;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'first',
      dashboardData: [],
      partDetails: [],
      reviewData: [],
      show: false,
      showQuoatation: false,
      currentPage: 1,
      indexDummy: 0,
      data: [],
      offset: 0,
      hasMore: true,
      pageCount: 1,
      isPageCount: false,
      noRecordImage: false
    };
    this.toggleButton = this.toggleButton.bind(this);
    this.tabCheck = this.tabCheck.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleDetails = this.handleDetails.bind(this);
    this.handleQuoatationDetails = this.handleQuoatationDetails.bind(this);
    this.handleHideQuotation = this.handleHideQuotation.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.handlePaginationQuatation = this.handlePaginationQuatation.bind(this);
  }

  getDashboardData() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      pageNumber: this.state.pageCount,
      pageSize: pageSize
    };
    this.props.actionLoaderShow();
    this.props
      .actionDashboardData(data)
      .then((result, error) => {
        let totalRecordCount = result.payload.data.resourceId;
        if (this.state.pageCount === 1) {
          let dashboardData = result.payload.data.resourceData;
          _this.setState({
            dashboardData: result.payload.data.resourceData,
            isPageCount: true,
            totalRecordCount: totalRecordCount,
            recordLength: dashboardData.length,
            noRecordImage: true
          });
        } else {
          let concatDashboardData;
          let newDashboardData = result.payload.data.resourceData;
          let oldDashboardData = this.state.dashboardData;
          concatDashboardData = oldDashboardData.concat(newDashboardData);
          _this.setState({
            dashboardData: concatDashboardData,
            totalRecordCount: totalRecordCount,
            recordLength: concatDashboardData.length
          });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
    window.addEventListener('scroll', this.handleScroll);
  }

  componentDidMount() {
    let _this = this;
    this.getDashboardData();
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };
    this.props
      .actionGetClassifications(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  getMoreData = () => {
    let _this = this;
    if (this.state.dashboardData.length >= this.state.totalRecordCount) {
      this.setState({ hasMore: false });
      return;
    }
    if (this.state.isPageCount === true) {
      let PC = this.state.pageCount;
      let pageNumber = PC + 1;
      this.setState({ pageCount: pageNumber });
      this.getDashboardData();
    }
  };

  handleHide() {
    this.setState({ show: false });
  }
  handleHideQuotation() {
    this.setState({ showQuoatation: false });
  }

  toggleButton() {
    this.setState({
      toggleFlag: !this.state.toggleFlag
    });
  }
  tabCheck() {
    this.props.tabCheck('third');
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  handleScroll = () => {
    this.setState({
      pageScrollY: window.scrollY
    });
  };

  handleDetails = (e, projectCode, key, count, title, partsQuotedIndex) => {
    let total = count > 10 ? parseInt(count / 10, 0.1) : 1;
    let totalCheckFloat = count > 10 ? parseInt(count % 10) : 0;

    if (totalCheckFloat) {
      total = total + 1;
    }

    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id,
      key: key,
      projectCode: projectCode,
      pageNumber: 1,
      pageSize: 10,
      quotationCount: partsQuotedIndex
    };

    this.props
      .actionDashboardHistory(data)
      .then((result, error) => {
        _this.setState({
          partDetails: result.payload.data.resourceData
        });
      })
      .catch(e => _this.props.actionLoaderHide());
    this.setState({
      show: true,
      title: key,
      pCode: projectCode,
      totalCount: total,
      headingTitle: title
    });
  };

  handleQuoatationDetails = (e, projectCode, key, partId, count) => {
    let _this = this;
    let total = count;
    let data = {
      userId: this.props.userInfo.userData.id,
      key: key,
      projectCode: projectCode,
      pageNumber: 1,
      pageSize: 1,
      partId: partId
    };

    this.props
      .actionDashboardHistory(data)
      .then((result, error) => {
        let data = result.payload.data.resourceData;
        _this.setState({
          reviewData: data.quotationRes
        });
      })
      .catch(e => _this.props.actionLoaderHide());
    this.setState({
      showQuoatation: true,
      title: key,
      pCode: projectCode,
      totalCount: total,
      pId: partId
    });
  };

  imageShow = (
    partId,
    partMediaResponse,
    partNumber,
    specificationResponse
  ) => {
    this.setState({
      show: true,
      partIdforMedia: partId,
      partNumber: partNumber,
      partMediaResponses: partMediaResponse,
      specificationResponses: specificationResponse
    });
  };

  handlePagination(e, total, projectCode, key) {
    console.log('handlePagination', e.selected);
    let pageNumberNew = e.selected + 1;
    let currentPage = e.selected ? pageNumberNew : 1;

    this.setState({ currentPage: currentPage });
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id,
      key: key,
      projectCode: projectCode,
      pageNumber: currentPage,
      pageSize: 10
    };

    console.log('handlePagination', data);

    this.props
      .actionDashboardHistory(data)
      .then((result, error) => {
        _this.setState({
          partDetails: result.payload.data.resourceData
        });
        console.log('result handlePagination', result);
      })
      .catch(e => _this.props.actionLoaderHide());
    this.setState({
      show: true,
      pCode: projectCode
    });
  }

  handlePaginationQuatation(e, total, projectCode, key, partId) {
    let currentPage = parseInt(e.selected) + 1;

    this.setState({ currentPage: currentPage });
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id,
      key: key,
      projectCode: projectCode,
      pageNumber: currentPage,
      pageSize: 1,
      partId: this.state.pId
    };
    this.props
      .actionDashboardHistory(data)
      .then((result, error) => {
        let data = result.payload.data.resourceData;
        _this.setState({
          reviewData: data.quotationRes
        });
      })
      .catch(e => _this.props.actionLoaderHide());
    this.setState({
      showQuoatation: true,
      pCode: projectCode
    });
  }

  render() {
    let self = this;
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <div>
        {/* <Header {...this.props} /> */}
        <SideBar
          activeTabKey={this.state.tabKey === 'first' ? 'first' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === 'first' ? (
          <div>
            <div className="content-body flex">
              <div className="content">
                <div className="container-fluid">
                  <h4 className="hero-title">My Dashboard</h4>

                  <div className="for-table of-x-inital">
                    <InfiniteScroll
                      dataLength={this.state.recordLength}
                      next={this.getMoreData}
                      hasMore={this.state.hasMore}
                      height={300}
                    >
                      <Table bordered responsive className="custom-table">
                        <thead>
                          <tr>
                            <th rowspan="2" className="b-right border-light">
                              Program Code
                            </th>
                            <th rowspan="2" className="b-right border-light">
                              Parts Planned
                            </th>
                            <th rowspan="2" className="b-right border-light">
                              Parts Created
                            </th>
                            <th rowspan="2" className="b-right border-light">
                              Parts Deleted
                            </th>
                            <th rowspan="2" className="b-right border-light">
                              Parts detail Submitted
                            </th>
                            {/* <th rowspan="2" className="b-right border-light">
                          Parts Request Approved
                        </th> */}
                            <th rowspan="2" className="b-right border-light">
                              Buyer Assigned
                            </th>
                            <th rowspan="2" className="b-right border-light">
                              {' '}
                              RFQ Approved
                            </th>
                            <th colSpan="4" className="b-right border-light">
                              Quotations Received
                            </th>
                            <th rowspan="2" className="b-right border-light">
                              PO Released
                            </th>
                            <th colSpan="4" className="b-right border-light">
                              PPAP
                            </th>

                            <th rowspan="2" className="b-right border-light">
                              Parts Received
                            </th>
                            <th rowspan="2">Parts in Transit</th>
                          </tr>
                          <tr>
                            <th className="b-right border-light w50">0</th>
                            <th className="b-right border-light w50">1</th>
                            <th className="b-right border-light w50">2</th>
                            <th className="b-right border-light w50"> >2 </th>

                            <th className="b-right border-light">In process</th>
                            <th className="b-right border-light">
                              Fully Approved
                            </th>
                            <th className="b-right border-light">Rejected</th>
                            <th className="b-right border-light">
                              Deviation Approved
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.dashboardData &&
                          this.state.dashboardData.length > 0 ? (
                            this.state.dashboardData.map((item, index) => {
                              return [
                                <tr>
                                  <td className="wordbreakAll">
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
                                  <td>{item.totalPartsPlannedCount}</td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'partsCreated',
                                        item.partsCreatedCount,
                                        'Part Created'
                                      )
                                    }
                                  >
                                    {item.partsCreatedCount}
                                  </td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'partsDeleted',
                                        item.partsDeletedCount,
                                        'Part Deleted'
                                      )
                                    }
                                  >
                                    {item.partsDeletedCount}
                                  </td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'partDetailsSubmitted',
                                        item.partDetailsSubmittedCount,
                                        'Part Details Submitted'
                                      )
                                    }
                                  >
                                    {item.partDetailsSubmittedCount}
                                  </td>
                                  {/* <td
                                  className="cursor-pointer"
                                  onClick={e =>
                                    this.handleDetails(
                                      e,
                                      item.projectCode,
                                      "partRequestApproved",
                                      item.partRequestApprovedCount,
                                      "Part Request Approved"
                                    )
                                  }
                                >
                                  {item.partRequestApprovedCount}
                                </td> */}
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'buyerAssigned',
                                        item.buyerAssignedCount,
                                        'Buyer Assigned'
                                      )
                                    }
                                  >
                                    {item.buyerAssignedCount}
                                  </td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'rfqApproved',
                                        item.rfqApprovedCount,
                                        'RFQ Approved'
                                      )
                                    }
                                  >
                                    {item.rfqApprovedCount}
                                  </td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'partsQuoted',
                                        item.zeroQuotedParts,
                                        'parts Quoted',
                                        0
                                      )
                                    }
                                  >
                                    {item.zeroQuotedParts}
                                  </td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'partsQuoted',
                                        item.oneQuotedParts,
                                        'parts Quoted',
                                        1
                                      )
                                    }
                                  >
                                    {item.oneQuotedParts}
                                  </td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'partsQuoted',
                                        item.twoQuotedParts,
                                        'parts Quoted',
                                        2
                                      )
                                    }
                                  >
                                    {item.twoQuotedParts}
                                  </td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'partsQuoted',
                                        item.moreThanTwoQuotedParts,
                                        'parts Quoted',
                                        3
                                      )
                                    }
                                  >
                                    {item.moreThanTwoQuotedParts}
                                  </td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'poReleased',
                                        item.poReleasedCount,
                                        'PO Released'
                                      )
                                    }
                                  >
                                    {item.poReleasedCount}
                                  </td>
                                  <td />
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'partsFullyApproved',
                                        item.partsFullyApprovedCount,
                                        'Part Fully Approved'
                                      )
                                    }
                                  >
                                    {item.partsFullyApprovedCount}
                                  </td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'ppapRejected',
                                        item.ppapRejectedCount,
                                        'PPAP Rejected'
                                      )
                                    }
                                  >
                                    {item.ppapRejectedCount}
                                  </td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'ppapDeviation',
                                        item.ppapDeviationCount,
                                        'PPAP Deviation'
                                      )
                                    }
                                  >
                                    {item.ppapDeviationCount}
                                  </td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'partsOrdered',
                                        item.partsOrderedCount,
                                        'Part Ordered'
                                      )
                                    }
                                  >
                                    {item.partsOrderedCount}
                                  </td>
                                  <td
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.handleDetails(
                                        e,
                                        item.projectCode,
                                        'partsInTransit',
                                        item.partsInTransitCount,
                                        'Part in Transit'
                                      )
                                    }
                                  >
                                    {item.partsInTransitCount}
                                  </td>
                                </tr>,
                                <tr />
                              ];
                            })
                          ) : (
                            <tr>
                              <td colSpan="18">
                                {this.state.noRecordImage &&
                                this.state.dashboardData.length == 0 ? (
                                  <div className="noRecord">
                                    <img src={noRecord} />
                                  </div>
                                ) : (
                                  ''
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </InfiniteScroll>
                  </div>
                </div>
              </div>
              <Footer pageTitle={permissionConstant.footer_title.dashboard} />
            </div>

            <Modal
              show={this.state.show}
              onHide={this.handleHide}
              container={this}
              aria-labelledby="contained-modal-title"
              className="custom-popUp modal-xl"
            >
              <Modal.Header>
                <div className="flex justify-space-between">
                  <h4>
                    {/* {this.state.headingTitle} */}
                    {this.state.partDetails &&
                      this.state.partDetails[0] &&
                      this.state.partDetails[0].projectResponse &&
                      this.state.partDetails[0].projectResponse.projectCode}
                  </h4>
                  <div className="">
                    <span className="print-btn">
                      <ReactToPrint
                        className="btn btn-link text-uppercase color-light sm-btn"
                        trigger={() => (
                          <a href="#">
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
                      onClick={this.handleHide}
                      className="btn btn-link text-uppercase color-light"
                    >
                      close
                    </button>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <div ref={el => (this.componentRef = el)}>
                  <div className="m-b-50 p-lr-20">
                    <h4>
                      {/* {this.state.headingTitle} */}
                      {this.state.partDetails &&
                        this.state.partDetails[0] &&
                        this.state.partDetails[0].projectResponse &&
                        this.state.partDetails[0].projectResponse.projectCode}
                    </h4>
                    <Table bordered responsive className="custom-table">
                      <thead>
                        <tr>
                          <th>Part No.</th>
                          {/* <th>Program Code</th> */}
                          <th>Part Description</th>
                          <th>Quantity</th>
                          <th>Units</th>
                          <th>Usage</th>
                          <th>Production</th>
                          <th>Commodity</th>
                          <th>Target Date</th>
                          <th>PO Status</th>
                          <th>PPAP Status</th>
                          <th>Reciept Status</th>
                          <th>Quotation Receipt</th>
                          <th>Assigned Buyer</th>
                          <th>Designer</th>
                        </tr>
                      </thead>
                      {this.state.partDetails.length > 0 ? (
                        <tbody>
                          {this.state.partDetails &&
                            this.state.partDetails.map((item, index) => {
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
                                    >
                                      {' '}
                                    </span>
                                    {item.partNumber}
                                  </td>
                                  {/* <td>{item.projectResponse.projectCode}</td> */}
                                  <td>{item.partDescription}</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.units}</td>
                                  <td>{item.usage}</td>
                                  <td>{item.production}</td>
                                  <td>{item.commodity}</td>
                                  <td>
                                    {item.targetDate &&
                                      moment(item.targetDate).format(
                                        'DD/MM/YYYY'
                                      )}
                                  </td>

                                  <td>{item.poStatus}</td>
                                  <td>{item.ppapDocumentStatus}</td>
                                  <td>{item.receiptStatus}</td>
                                  <td>{item.quotationReceived}</td>
                                  <td>
                                    {item.assignedBuyerDetailResponse
                                      ? item.assignedBuyerDetailResponse
                                          .firstName +
                                        ' ' +
                                        item.assignedBuyerDetailResponse
                                          .lastName
                                      : ''}
                                  </td>
                                  <td>
                                    {item.rfqCreatorBuyer &&
                                      item.rfqCreatorBuyer.firstName +
                                        ' ' +
                                        item.rfqCreatorBuyer &&
                                      item.rfqCreatorBuyer.lastName}
                                  </td>
                                </tr>,
                                <tr />
                              ];
                            })}
                        </tbody>
                      ) : (
                        ''
                      )}
                    </Table>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="flex justify-space-between text-center">
                {/* <Button
              className="btn btn-success text-uppercase"
              onClick={e =>
                this.handlePrevious(
                  e,
                  this.state.totalCount,
                  this.state.pCode,
                  this.state.title
                )
              }
            >
              Previous
            </Button>{' '}
            <Button
              className="btn btn-success text-uppercase"
              onClick={e =>
                this.handleNext(
                  e,
                  this.state.totalCount,
                  this.state.pCode,
                  this.state.title
                )
              }
            >
              Next
            </Button> */}

                <ReactPaginate
                  previousLabel={'<<'}
                  nextLabel={'>>'}
                  breakLabel={<a target="_blank">...</a>}
                  breakClassName={'break-me'}
                  pageCount={this.state.totalCount}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  // onPageChange={this.handlePageClick}
                  onPageChange={e =>
                    this.handlePagination(
                      e,
                      this.state.totalCount,
                      this.state.pCode,
                      this.state.title
                    )
                  }
                  containerClassName={'pagination paginationWrapper'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
                {/* <Pagination className="paginationWrapper">
              <Pagination.First
                onClick={e =>
                  this.handlePrevious(
                    e,
                    this.state.totalCount,
                    this.state.pCode,
                    this.state.title
                  )
                }
              />
              <Pagination.Prev
                onClick={e =>
                  this.handlePrevious(
                    e,
                    this.state.totalCount,
                    this.state.pCode,
                    this.state.title
                  )
                }
              />{" "}
              currentPage
              <Pagination.Item>{1}</Pagination.Item>
              <Pagination.Ellipsis />
              <Pagination.Item>{10}</Pagination.Item>
              <Pagination.Item>{11}</Pagination.Item>
              <Pagination.Item active>{12}</Pagination.Item>
              <Pagination.Item>{13}</Pagination.Item>
              <Pagination.Item disabled>{14}</Pagination.Item>
              <Pagination.Ellipsis />
              <Pagination.Item>{20}</Pagination.Item>
              <Pagination.Next
                onClick={e =>
                  this.handleNext(
                    e,
                    this.state.totalCount,
                    this.state.pCode,
                    this.state.title
                  )
                }
              />
              <Pagination.Last
                onClick={e =>
                  this.handlePrevious(
                    e,
                    this.state.totalCount,
                    this.state.pCode,
                    this.state.title
                  )
                }
              />
            </Pagination> */}
              </Modal.Footer>
            </Modal>

            <Modal
              show={this.state.showQuoatation}
              onHide={this.handleHideQuotation}
              className="custom-popUp modal-xxl"
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
                      onClick={this.handleHideQuotation}
                      className="btn btn-link text-uppercase color-light"
                    >
                      close
                    </button>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <div ref={el => (this.componentRef = el)}>
                  <div className="m-b-50 p-lr-20">
                    <h4>Quotation Preview</h4>
                    <table className="w-full">
                      <tr>
                        <td>
                          <div className="brand">
                            {this.props.userInfo &&
                            this.props.userInfo.userData.companyLogo ? (
                              <img
                                src={
                                  this.props.userInfo &&
                                  this.props.userInfo.userData.companyLogo
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
                                      this.props.userInfo.userData.companyName}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Contact:</td>
                                  <td>
                                    {this.props.userInfo &&
                                    this.props.userInfo.userData.fullname
                                      ? this.props.userInfo.userData.fullname.trim()
                                      : ''}
                                    ,&nbsp;
                                    {this.props.userInfo &&
                                    this.props.userInfo.userData.contactNo
                                      ? this.props.userInfo.userData.contactNo.trim()
                                      : ''}
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
                          <div className="company-info p-lr-20">
                            <Table className="">
                              <tbody>
                                <tr>
                                  <td>Buyer: {this.state.indexDummy}</td>
                                  <td>
                                    {this.props.userInfo &&
                                      this.props.userInfo.userData.companyName}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Contact:</td>
                                  <td>
                                    {this.state.reviewData &&
                                      this.state.reviewData
                                        .quotationCreatorDetailResponse &&
                                      this.state.reviewData &&
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
                                      this.state.reviewData &&
                                      this.state.reviewData
                                        .quotationCreatorDetailResponse
                                        .userProfile}
                                    ,{' '}
                                    {this.state.reviewData &&
                                      this.state.reviewData
                                        .quotationCreatorDetailResponse &&
                                      this.state.reviewData &&
                                      this.state.reviewData
                                        .quotationCreatorDetailResponse.mobile}
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div className="p-lr-20">
                    <h4 className="">Proto Tool</h4>
                    <div>
                      <Table
                        bordered
                        responsive
                        className="custom-table cell-input print-table"
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
                              this.state.reviewData &&
                              this.state.reviewData.quotationTool
                                .listOfQuotationTool[0] &&
                              this.state.reviewData &&
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
                            this.state.reviewData &&
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
                                            <td>{elem.taxDescription}</td>,
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
                                this.state.reviewData &&
                                this.state.reviewData &&
                                this.state.reviewData.quotationTool &&
                                this.state.reviewData &&
                                this.state.reviewData.quotationTool.costTotal}
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
                                this.state.reviewData &&
                                this.state.reviewData &&
                                this.state.reviewData.quotationTool &&
                                this.state.reviewData &&
                                this.state.reviewData.quotationTool.finalTotal}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <div className="">
                      <h4>Proto Part</h4>
                      <div>
                        <Table
                          bordered
                          responsive
                          className="custom-table cell-input print-table"
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
                                              <td>{elem.taxDescription}</td>,
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
                                  this.state.reviewData &&
                                  this.state.reviewData.quotationCost
                                    .totalRawMaterialCost}
                              </td>
                              {this.state.reviewData &&
                                this.state.reviewData.quotationCost &&
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
                    </div>
                    <div className="">
                      <h4>Process/Operation</h4>
                      <div>
                        <Table
                          bordered
                          responsive
                          className="custom-table cell-input print-table"
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
                                            return [<td>{elem.labourCost}</td>];
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
                    </div>
                    <Row>
                      <Col md={12}>
                        <div className="text-right">
                          <ControlLabel className="fw-normal color-light">
                            Subtotal
                          </ControlLabel>

                          <p>
                            {this.state.reviewData &&
                              this.state.reviewData &&
                              this.state.reviewData &&
                              this.state.reviewData.quotationProcess &&
                              this.state.reviewData &&
                              this.state.reviewData.quotationProcess.subTotal}
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
                                this.state.reviewData &&
                                this.state.reviewData &&
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
                                this.state.reviewData &&
                                this.state.reviewData &&
                                this.state.reviewData.quotationForQuantity}
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
                                this.state.reviewData &&
                                this.state.reviewData &&
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
                              {this.state.reviewData &&
                                this.state.reviewData &&
                                this.state.reviewData &&
                                this.state.reviewData.deliveryTargetDate}
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
                                <th className="color-light">Description</th>
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
                                      this.state.reviewData.quotationProcess &&
                                      this.state.reviewData.quotationProcess
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
              </Modal.Body>{' '}
              <Modal.Footer className="flex .justify-space-between">
                <ReactPaginate
                  previousLabel={'previous'}
                  nextLabel={'next'}
                  breakLabel={<a target="_blank">...</a>}
                  breakClassName={'break-me'}
                  pageCount={this.state.totalCount}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={e =>
                    this.handlePaginationQuatation(
                      e,
                      this.state.totalCount,
                      this.state.pCode,
                      this.state.title
                    )
                  }
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </Modal.Footer>
            </Modal>
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
      actionDashboardData,
      actionDashboardHistory,
      actionGetClassifications
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
)(Dashboard);
