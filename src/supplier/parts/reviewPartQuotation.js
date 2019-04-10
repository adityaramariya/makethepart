import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import { Table, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import SliderModal from '../slider/sliderModal';
import Sprite from '../../img/sprite.svg';
import ReactToPrint from 'react-to-print';
import noRecord from '../../img/no_record.png';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionPartListForQuotation,
  actionDeletePart
} from '../../common/core/redux/actions';
import { topPosition, showErrorToast } from '../../common/commonFunctions';

class ReviewPartQuotation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showReview: false,
      checkboxFlag: false,
      iconDisable: true,
      showDeleteModal: false,
      reviewPartList: [],
      showDeleteAllModal: false,
      show: false,
      showApproveModal: false,
      item: ''
    };

    this.reviewQuotation = this.reviewQuotation.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDeleteClose = this.handleDeleteClose.bind(this);
    // this.submitClick = this.submitClick.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleAllCheckboxChange = this.handleAllCheckboxChange.bind(this);
    this.deletePart = this.deletePart.bind(this);
    this.deleteAllPart = this.deleteAllPart.bind(this);
    this.handleDeleteAllClose = this.handleDeleteAllClose.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.tabCheck = this.tabCheck.bind(this);
    this.tabCheckThird = this.tabCheckThird.bind(this);
    this.addPartConfirmation = this.addPartConfirmation.bind(this);
    this.handleCloseModel = this.handleCloseModel.bind(this);
    this.handleSpecificationFile = this.handleSpecificationFile.bind(this);

    this.tooltipReview = <Tooltip id="tooltip1">Review</Tooltip>;
    this.tooltipDelete = <Tooltip id="tooltip2">Delete</Tooltip>;
    this.tooltipDownload = <Tooltip id="tooltip3">Download</Tooltip>;
  }

  componentDidMount() {
    let _this = this;
    const userId = this.props.userInfo.userData.id;
    const roleId = this.props.userInfo.userData.userRole;
    this.props.actionLoaderShow();
    this.props
      .actionPartListForQuotation({ userId, roleId })
      .then((result, error) => {
        this.setState({
          reviewPartList: result.payload.data.resourceData
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  tabCheck() {
    this.props.tabCheck('first');
  }

  tabCheckThird() {
    this.props.tabCheckThird('third');
  }

  reviewQuotation(data) {
    this.setState(
      {
        reviewData: data
      },
      () => {
        this.setState({
          showReview: true
        });
      }
    );
  }
  handleClose() {
    this.setState({ showReview: false });
  }

  handleDeleteClose() {
    this.setState({ showDeleteModal: false });
  }
  handleDeleteAllClose() {
    this.setState({ showDeleteAllModal: false });
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
    this.setState({
      show: true,
      partIdforMedia: partId,
      partMediaResponses: media,
      partNumberforMedia: partNumber
    });
  };

  handleCloseModal() {
    this.setState({ show: !this.state.show });
  }

  handleSpecificationFile(event, data) {
    window.open(data.mediaURL);
  }
  downloadPartDetail(item) {
    let _this = this;
    let partId = '';
    if (item) {
      partId = item.id;
    }
    this.props.actionLoaderShow();
    axios({
      url: '/api/v1/user/quotation/excel/create?partId=' + partId,
      method: 'GET',
      responseType: 'blob'
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', item.partNumber + '.xlxs');
      document.body.appendChild(link);
      link.click();
    });
    _this.props.actionLoaderHide();
  }

  deletePartDetail(item, index) {
    this.setState({
      showDeleteModal: true,
      partId: item.id,
      projectId: item.projectResponse.id,
      partIndex: index,
      itemData: item
    });
  }
  deletePart() {
    let _this = this;
    let data = {
      removerUserId: this.props.userInfo.userData.id,
      listOfIds: [
        {
          partId: this.state.partId,
          projectId: this.state.projectId
        }
      ]
    };
    this.props.actionLoaderShow();
    this.props
      .actionDeletePart(data)
      .then((result, error) => {
        this.state.reviewPartList.forEach(function(item, index) {
          let reviewPartList = _this.state.reviewPartList;
          if (item.id === _this.state.itemData.id) {
            reviewPartList.splice(index, 1);
            _this.setState({
              reviewPartList: reviewPartList,
              showDeleteModal: false
            });
          }
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }
  deleteAllPart() {
    let _this = this;
    let partProjectArray = [];
    this.state.reviewPartList.forEach(function(item, index) {
      partProjectArray.push({
        partId: item.id,
        projectId: item.projectResponse.id
      });
    });
    let data = {
      removerUserId: this.props.userInfo.userData.id,
      listOfIds: partProjectArray
    };
    this.props.actionLoaderShow();
    this.props
      .actionDeletePart(data)
      .then((result, error) => {
        this.state.reviewPartList.forEach(function(item, index) {
          let reviewPartList = _this.state.reviewPartList;
          reviewPartList = [];
          _this.setState({
            reviewPartList: reviewPartList,
            showDeleteAllModal: false
          });
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }
  deleteAllPartDetail() {
    this.setState({
      showDeleteAllModal: true
    });
  }

  handleCheckboxChange(event, index) {
    let reviewPartList = this.state.reviewPartList;
    if (event.target.checked) {
      reviewPartList[index]['check'] = true;
    } else {
      reviewPartList[index]['check'] = false;
    }
    this.setState({ reviewPartList: reviewPartList });
  }
  handleAllCheckboxChange(event) {
    let reviewPartList = this.state.reviewPartList;
    if (event.target.checked) {
      reviewPartList = reviewPartList.map(function(item, index) {
        item['check'] = true;
        return item;
      });
      this.setState({
        iconDisable: false
      });
    } else {
      reviewPartList = reviewPartList.map(function(item, index) {
        item['check'] = false;
        return item;
      });
      this.setState({
        iconDisable: true
      });
    }
    this.setState({ reviewPartList: reviewPartList });
  }

  addPartConfirmation(event, data, production) {   
    let targetDate = data.targetDate;   
    if (moment() > moment(targetDate)) {
      showErrorToast('Part target date expired');      
    }else{    
      this.setState({
        showApproveModal: true,
        item: data,
        production: production
      });
    }
  }
  handleCloseModel() {
    let self = this;
    self.setState({ showApproveModal: false });
  }

  render() {
    let self = this;
    return (
      <div {...this.props}>
        <div className="content-body flex">
          <div className="content">
            <div className="container-fluid">
              <div className="flex justify-space-between align-center">
                <h4 className="hero-title">Review New Parts For Quotation</h4>
                <div className="flex-1 text-right">
                  <span className="rev-btn cursor-pointer">
                    <span
                      className={
                        this.state.iconDisable
                          ? 'ico-delete1 ico-sq bg-gray cursor-pointer disabled'
                          : 'ico-delete1 ico-sq bg-gray cursor-pointer'
                      }
                      onClick={() => {
                        this.deleteAllPartDetail();
                      }}
                    >
                      <svg>
                        <use xlinkHref={`${Sprite}#delete1Ico`} />
                      </svg>
                    </span>
                    Remove
                  </span>

                  <span className="rev-btn cursor-pointer">
                    <a
                      className={
                        this.state.iconDisable
                          ? 'ico-download ico-sq bg-blue cursor-pointer disabled'
                          : 'ico-download ico-sq bg-blue cursor-pointer'
                      }
                      onClick={() => {
                        this.downloadPartDetail();
                      }}
                    >
                      <svg>
                        <use xlinkHref={`${Sprite}#downloadIco`} />
                      </svg>
                    </a>
                    Download
                  </span>
                </div>
              </div>
              <div className="m-b-50">
                {this.state.reviewPartList ? (
                  <Table bordered responsive hover className="custom-table">
                    <thead>
                      <tr>
                        <th>
                          <label className="label--checkbox">
                            <input
                              type="checkbox"
                              className="checkbox"
                              onClick={event =>
                                this.handleAllCheckboxChange(event)
                              }
                            />
                          </label>
                        </th>
                        <th>Part Number</th>
                        <th style={{ width: '125px' }}>Company Name (Buyer)</th>
                        {/* <th>Rating</th> */}
                        <th>Part Detail</th>
                        <th>Commodity</th>
                        <th>Preview</th>
                        <th>Specification</th>
                        {/* <th>Quote Submited</th> */}
                        <th>Registered with the Buyer</th>
                        <th>Proto/Production</th>
                        <th>Delivery Target Date</th>
                        <th>Quantity</th>
                        <th> </th>
                        <th> </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.reviewPartList.map((item, index) => {
                        return [
                          <tr>
                            <td>
                              <label className="label--checkbox">
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  onClick={event =>
                                    this.handleCheckboxChange(event, index)
                                  }
                                  checked={item.check ? true : false}
                                />
                              </label>
                            </td>
                            <td>{item.partNumber}</td>
                            <td>{item.buyerResponse.companyName}</td>
                            {/* <td>Star 5</td> */}
                            <td>
                              <div className="w100 text-ellipsis">
                                {item.partDescription}
                              </div>
                            </td>
                            <td>{item.commodity}</td>
                            <td className="p-0 cursor-pointer">
                              <img
                                onClick={this.imageShow.bind(
                                  this,
                                  item.id,
                                  item.partMediaResponses,
                                  item.partMediaResponses[0] && item.partNumber,
                                  item.specificationResponse
                                )}
                                src={item.partMediaMainImage}
                                width="45"
                                className="sm-p-img"
                              />
                            </td>
                            <td>
                              {item && item.specificationResponse ? (
                                <div className="flex w100 align-center">
                                  <span
                                    onClick={event =>
                                      this.handleSpecificationFile(
                                        event,
                                        item && item.specificationResponse[0]
                                      )
                                    }
                                  >
                                    {(item &&
                                      item.specificationResponse[0] &&
                                      item.specificationResponse[0]
                                        .mediaType ===
                                        'application/octet-stream') ||
                                    (item &&
                                      item.specificationResponse[0] &&
                                      item.specificationResponse[0]
                                        .mediaType ===
                                        'application/vnd.ms-excel') ||
                                    (item &&
                                      item.specificationResponse[0] &&
                                      item.specificationResponse[0]
                                        .mediaType ===
                                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ? (
                                      <img src={xlsImage} width="25" />
                                    ) : item &&
                                      item.specificationResponse[0] &&
                                      item.specificationResponse[0]
                                        .mediaType === 'application/pdf' ? (
                                      <img src={pdfImage} width="25" />
                                    ) : item &&
                                      item.specificationResponse[0] &&
                                      item.specificationResponse[0]
                                        .mediaType ===
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                      <img src={docImage} width="25" />
                                    ) : item &&
                                      item.specificationResponse[0] &&
                                      item.specificationResponse[0]
                                        .mediaType === 'text/plain' ? (
                                      <img src={docImage} width="25" />
                                    ) : (
                                      <div />
                                    )}
                                  </span>
                                  <p className="m-ellipsis">
                                    {item &&
                                      item.specificationResponse[0] &&
                                      item &&
                                      item.specificationResponse[0].mediaName}
                                  </p>
                                </div>
                              ) : (
                                <div />
                              )}
                            </td>
                            <td>
                              <Link
                                to={{
                                  pathname: '/supplier/vendor',
                                  state: { data: item }
                                }}
                              >
                                {item.isRegistredWithBuyer ? (
                                  <span className="s-circle yes">Y</span>
                                ) : (
                                  <span className="s-circle no">N</span>
                                )}
                              </Link>
                            </td>
                            <td>{item.production}</td>
                            <td>
                              {moment(item.targetDate).format('DD/MM/YYYY')}
                            </td>
                            <td>{item.quantity}</td>
                            <td style={{ minWidth: '150px' }}>
                              {/* <OverlayTrigger
                                placement="top"
                                overlay={this.tooltipReview}
                              >
                                <span
                                  className="ico-review1 ico-sq  cursor-pointer fill-orange"
                                  onClick={() => {
                                    const data = item;
                                    this.reviewQuotation(data);
                                  }}
                                >
                                  <svg>
                                    <use xlinkHref={`${Sprite}#review1Ico`} />
                                  </svg>
                                </span>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="top"
                                overlay={this.tooltipDelete}
                              >
                                <span
                                  className={
                                    item.check
                                      ? 'ico-delete1 ico-sq bg-gray cursor-pointer'
                                      : 'ico-delete1 ico-sq bg-gray cursor-pointer disabled'
                                  }
                                  onClick={() => {
                                    this.deletePartDetail(item, index);
                                  }}
                                >
                                  <svg>
                                    <use xlinkHref={`${Sprite}#delete1Ico`} />
                                  </svg>
                                </span>
                              </OverlayTrigger>

                              <OverlayTrigger
                                placement="top"
                                overlay={this.tooltipDownload}
                              >
                                <a
                                  className={
                                    item.check
                                      ? 'ico-download ico-sq bg-blue cursor-pointer'
                                      : 'ico-download ico-sq bg-blue cursor-pointer disabled'
                                  }
                                  onClick={() => {
                                    this.downloadPartDetail(item);
                                  }}
                                >
                                  <svg>
                                    <use xlinkHref={`${Sprite}#downloadIco`} />
                                  </svg>
                                </a>
                              </OverlayTrigger> */}
                              <div className="w-175">
                                <button
                                  className="btn btn-task"
                                  onClick={() => {
                                    const data = item;
                                    this.reviewQuotation(data);
                                  }}
                                >
                                  <span className="ico-action ">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#review1Ico`} />
                                    </svg>
                                  </span>
                                  <span className="ico-txt">Review</span>
                                </button>
                                <button
                                  // className="btn btn-task  p-e-none"
                                  className={
                                    item.check
                                      ? 'btn btn-task'
                                      : 'btn btn-task disabled'
                                  }
                                  onClick={() => {
                                    this.deletePartDetail(item, index);
                                  }}
                                >
                                  <span
                                    className={
                                      item.currentStatus === 'approved'
                                        ? 'ico-action fill-green'
                                        : 'ico-action '
                                    }
                                  >
                                    <svg>
                                      <use xlinkHref={`${Sprite}#delete1Ico`} />
                                    </svg>
                                  </span>
                                  <span className="ico-txt">Delete</span>
                                </button>
                                <button
                                  // className=" btn btn-task  p-e-none"
                                  className={
                                    item.check
                                      ? 'btn btn-task'
                                      : 'btn btn-task disabled'
                                  }
                                  onClick={() => {
                                    this.downloadPartDetail(item);
                                  }}
                                >
                                  <span className="ico-action">
                                    <svg>
                                      <use
                                        xlinkHref={`${Sprite}#downloadIco`}
                                      />
                                    </svg>
                                  </span>
                                  <span className="ico-txt">Download</span>
                                </button>
                              </div>
                            </td>
                            <td>
                              {item.isQuotationSend ? (
                                <Link
                                  to={{
                                    pathname: '/supplier/createQuotation',
                                    state: {
                                      data: item,
                                      checkKey: 'editQuotation'
                                    }
                                  }}
                                  className="btn btn btn-default br-0 sm-btn"
                                  onClick={this.editQuotation}
                                >
                                  Edit Quotation
                                </Link>
                              ) : (
                                item.quotationSendByCompany ? <spsn><strong>Quotation By:</strong> {item.quotationSendBy.firstName}</spsn> :
                                <button
                                  className="btn btn btn-default br-0 sm-btn"
                                  // disabled={item.isQuotationSend}
                                  onClick={event =>
                                    this.addPartConfirmation(
                                      event,
                                      item,
                                      item.production
                                    )
                                  }
                                >
                                  Submit Quotation
                                </button>
                              )
                              
                              }
                            </td>
                          </tr>,
                          <tr />
                        ];
                      })}
                    </tbody>
                  </Table>
                ) : (
                  <div className="noRecord">
                    {' '}
                    <img src={noRecord} />
                  </div>
                )}
              </div>
              <Modal
                show={this.state.showReview}
                onHide={this.handleClose}
                className="custom-popUp"
              >
                <Modal.Header>
                  <div className="flex justify-space-between">
                    <h4>
                      Part No. :{' '}
                      <b>
                        {this.state.reviewData &&
                          this.state.reviewData.partNumber}
                      </b>
                    </h4>
                    <div className="">
                      <ReactToPrint
                        className=""
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
                  <div className="p-lr-20" ref={el => (this.componentRef = el)}>
                    <h4>
                      Part No. :{' '}
                      <b>
                        {this.state.reviewData &&
                          this.state.reviewData.partNumber}
                      </b>
                    </h4>
                    <Table className="no-border-table print-table">
                      <tbody>
                        <tr>
                          <td className="color-light">Buyer:</td>
                          <td>
                            {this.state.reviewData &&
                              this.state.reviewData.buyerResponse.companyName}
                          </td>
                        </tr>
                        <tr>
                          <td className="color-light">Project:</td>
                          <td>
                            {this.state.reviewData &&
                              this.state.reviewData.projectResponse
                                .projectTitle}
                          </td>
                        </tr>
                        <tr>
                          <td className="color-light">Project Code:</td>
                          <td>
                            {this.state.reviewData &&
                              this.state.reviewData.projectResponse.projectCode}
                          </td>
                        </tr>
                        <tr>
                          <td className="color-light">Part Number:</td>
                          <td>
                            {this.state.reviewData &&
                              this.state.reviewData.partNumber}
                          </td>
                        </tr>
                        <tr>
                          <td className="color-light">Part Description:</td>
                          <td>
                            {this.state.reviewData &&
                              this.state.reviewData.partDescription}
                          </td>
                        </tr>
                        <tr>
                          <td className="color-light">Delivery Location:</td>
                          <td>
                            {this.state.reviewData &&
                              this.state.reviewData.deliveryAddressResponse
                                .address}
                            ,{' '}
                            {this.state.reviewData &&
                              this.state.reviewData.deliveryAddressResponse
                                .state}
                            ,{' '}
                            {this.state.reviewData &&
                              this.state.reviewData.deliveryAddressResponse
                                .country}
                          </td>
                        </tr>
                        {/* <tr>
                    <td className="color-light">Delivery Country:</td>
                    <td>dgffd</td>
                  </tr> */}
                        <tr>
                          <td className="color-light">Production:</td>
                          <td>
                            {this.state.reviewData &&
                              this.state.reviewData.production}
                          </td>
                        </tr>
                        <tr>
                          <td className="color-light">Usage:</td>
                          <td>
                            {this.state.reviewData &&
                              this.state.reviewData.usage}
                          </td>
                        </tr>
                        <tr>
                          <td className="color-light">Quantity:</td>
                          <td>
                            {' '}
                            {this.state.reviewData &&
                              this.state.reviewData.quantity}
                          </td>
                        </tr>
                        <tr>
                          <td className="color-light">Units:</td>
                          <td>
                            {' '}
                            {this.state.reviewData &&
                              this.state.reviewData.units}
                          </td>
                        </tr>
                        <tr>
                          <td className="color-light">Commodity:</td>
                          <td>
                            {' '}
                            {this.state.reviewData &&
                              this.state.reviewData.commodity}
                          </td>
                        </tr>
                        {/* <tr>
                    <td className="color-light">
                      Packaging/Delevery Condition:
                    </td>
                    <td>dfgdfg</td>
                  </tr> */}
                        <tr>
                          <td className="color-light">Target Date:</td>
                          <td>
                            {this.state.reviewData &&
                              moment(this.state.reviewData.targetDate).format(
                                'DD/MM/YYYY'
                              )}
                          </td>
                        </tr>
                        <tr>
                          <td className="color-light">Supplier Star Rating:</td>
                          <td>5</td>
                        </tr>
                        <tr>
                          <td className="color-light">Remarks</td>
                          <td>
                            {this.state.reviewData &&
                              this.state.reviewData.remarks}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Modal.Body>
              </Modal>
              <Modal
                show={this.state.showDeleteModal}
                onHide={this.handleDeleteClose}
                className="custom-popUp"
                bsSize="small"
              >
                <Modal.Header closeButton>
                  <Modal.Title />
                </Modal.Header>
                <Modal.Body>
                  <center>
                    <h5>Are you sure you want to delete this part?</h5>
                    <button
                      className="btn btn-default "
                      onClick={() => {
                        this.deletePart();
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className="btn btn-default"
                      onClick={() => {
                        this.handleDeleteClose();
                      }}
                    >
                      No
                    </button>
                  </center>
                </Modal.Body>
              </Modal>
              <Modal
                show={this.state.showDeleteAllModal}
                onHide={this.handleDeleteAllClose}
                className="custom-popUp"
                bsSize="small"
              >
                <Modal.Header closeButton>
                  <Modal.Title />
                </Modal.Header>
                <Modal.Body>
                  <center>
                    <h5>Are you sure you want to delete all parts?</h5>
                    <button
                      className="btn btn-default "
                      onClick={() => {
                        this.deleteAllPart();
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className="btn btn-default"
                      onClick={() => {
                        this.handleDeleteAllClose();
                      }}
                    >
                      No
                    </button>
                  </center>
                </Modal.Body>
              </Modal>
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
                      <a className="disabled">Review Part for Quotation</a>
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
                      <a onClick={this.tabCheckThird}>Approve Quotation</a>
                    </li>
                    <li>
                      <a onClick={this.tabCheck}>My Dashboard</a>
                    </li>
                  </ul>

                  <ul className="p-tags">
                    {this.props.userInfo.userData.isAdmin ? (
                      <li>
                        <Link to="addUser">Add Users</Link>
                      </li>
                    ) : null}

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
        {this.state.show ? (
          <SliderModal
            show={this.state.show}
            partId={this.state.partIdforMedia}
            partMediaResponses={this.state.partMediaResponses}
            partNumber={this.state.partNumberforMedia}
            handleCloseModal={this.handleCloseModal}
          />
        ) : null}

        <Modal
          show={self.state.showApproveModal}
          onHide={self.handleCloseModel}
          className="custom-popUp confirmation-box"
          bsSize="small"
        >
          {/* <Modal.Header>
                <div className="flex justify-space-between">
                    <h4 className="m0">Confirmation</h4>
                    <div className="">
                        <button
                            onClick={self.handleCloseModel}
                            className="btn btn-link text-uppercase color-light sm-btn"
                        >
                            close
                        </button>
                    </div>
                </div>
            </Modal.Header> */}
          <Modal.Body>
            <div className="p-lr-40">
              <h5 className="text-center">
                This part requested for {this.state.production}. Do you continue
                ?
              </h5>
              <div className="text-center">
                <Link
                  className="btn btn-default text-uppercase sm-btn"
                  // onClick={() => this.submitClick(this.state.item)}
                  to={{
                    pathname: '/supplier/createQuotation',
                    state: { data: this.state.item }
                  }}
                >
                  Continue
                </Link>
                <button
                  className="btn btn-success text-uppercase sm-btn"
                  onClick={self.handleCloseModel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionLoaderHide,
      actionLoaderShow,
      actionPartListForQuotation,
      actionDeletePart
    },
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
)(ReviewPartQuotation);
