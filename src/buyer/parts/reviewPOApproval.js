import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';
import ReactToPrint from 'react-to-print';
import SliderImage from '../slider/slider';
import _ from 'lodash';
import socketIOClient from 'socket.io-client';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  Table,
  ControlLabel,
  Form,
  Button,
  Modal,
  Tab,
  Nav,
  NavItem,
  Panel,
  PanelGroup
} from 'react-bootstrap';
import * as Datetime from 'react-datetime';
import Constant from '../../common/core/config/appConfig';
import 'react-datetime/css/react-datetime.css';
import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import Slider from 'react-slick';
import Image1 from '../../img/image.png';
import Sprite from '../../img/sprite.svg';
import makeThePartApiService from '../../common/core/api/apiService';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import {
  actionSummaryQuotationList,
  actionUpdatePartWithMedia,
  actionLoaderHide,
  actionLoaderShow,
  actionUploadRevisionImage,
  actionDeleteRevisionImage,
  actionTabData,
  actiongetSupplierQuotationData,
  actionGetPPAPDocuments,
  actionSummaryQuotationForPart,
  actionGetPartHistory,
  actionCommentDetail,
  actionSubmitComment,
  actionGetCommentsCount
} from '../../common/core/redux/actions';
import {
  removeUnderScore,
  showErrorToast,
  topPosition
} from '../../common/commonFunctions';
import Footer from '../common/footer';

import CONSTANTS from '../../common/core/config/appConfig';

import { handlePermission } from '../../common/permissions';

import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import User from '../../img/user.jpg';
let { customConstant, permissionConstant } = CONSTANTS;
let socket;
let commentPageSize = 10;
class ReviewPOApproval extends Component {
  constructor(props) {
    super(props);
    socket = socketIOClient.connect(
      customConstant.webNotificationURL.node_server_URL
    );
    this.state = {
      nav1: null,
      nav2: null,
      show: false,
      rgqResponse: {},
      sumOfQuotation: {},
      partMediaResponses: [],
      approvedStatus: [],
      partHistoryData: [],
      showReplace: false,
      projectId:
        this.props.location.state && this.props.location.state.projectId,
      partId: this.props.location.state && this.props.location.state.partId,
      tabKey: 'reviewPOApp',
      showReview: false,
      callKey: 0,
      open: true,
      open1: true,
      open2: true,
      open3: true,
      open4: true,
      open5: true,
      shown: false,
      disableOrderButton: false,
      revisionNumber: '',
      valueToSendToReleasePO: {},
      showComments: false,
      hideOrderButton: false,
      commentCount: 0,
      pageCountComment: 1,
      isPageCountComment: false,
      hasMoreComment: true
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleShowReplace = this.handleShowReplace.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCreatePartWithMedia = this.handleCreatePartWithMedia.bind(this);
    this.handleUploadDesign = this.handleUploadDesign.bind(this);
    this.deleteAttachment = this.deleteAttachment.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.createShowDetailArrayCells = this.createShowDetailArrayCells.bind(
      this
    );
    this.handlePartDetailReview = this.handlePartDetailReview.bind(this);
    this.handleCloseReview = this.handleCloseReview.bind(this);
    this.ShowSingleDetailArrayCells = this.ShowSingleDetailArrayCells.bind(
      this
    );
    this.getsupplierQuotationList = this.getsupplierQuotationList.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handlePPAPList = this.handlePPAPList.bind(this);
    this.handlePartHistoryList = this.handlePartHistoryList.bind(this);
    this.handleSummaryQuotation = this.handleSummaryQuotation.bind(this);
    this.handlePartHistoryList = this.handlePartHistoryList.bind(this);
    this.createPartRevisionColumn = this.createPartRevisionColumn.bind(this);
    this.createPartRevisionColumnDetails = this.createPartRevisionColumnDetails.bind(
      this
    );
    this.handleCommentsShow = this.handleCommentsShow.bind(this);
    this.handleCommentsClose = this.handleCommentsClose.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.getCommemtsCount = this.getCommemtsCount.bind(this);

    this.getPartsDetail();
    this.getMediaPartHistory();
    this.getSummaryQuotationList();
    this.actionApproveStatus();
    this.handlePartHistoryList();
  }
  // componentWillMount(){
  //   let commentdata = this.state.commentResponse;
  //   this.setState({commentResponse:commentdata})
  // }

  componentWillReceiveProps(next) {
    topPosition();
    if (next.location.state && next.location.state.projectId)
      this.setState({
        projectId: next.location.state && next.location.state.projectId,
        partId: next.location.state && next.location.state.partId
      });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handlePartDetailReview(data, type) {
    this.setState(
      {
        reviewData: data.listOfQuotationDetails
      },
      () => {
        this.setState({
          showReview: true,
          callKey: type
        });
      }
    );
  }

  handleCloseReview() {
    this.setState({ showReview: false });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleShowReplace() {
    this.setState({ showReplace: !this.state.showReplace });
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
    this.getsupplierQuotationList();
    this.handlePPAPList();
    this.handleSummaryQuotation();
    this.getCommemtsCount();
  }

  handleSummaryQuotation() {
    let _this = this;
    let data = {
      userId: _this.props.userInfo.userData.id,
      roleId: _this.props.userInfo.userData.userRole,
      partId: _this.state.partId,
      sortByDeliveryDate: false,
      sortByTotalAmount: true
    };
    _this.props
      .actionSummaryQuotationForPart(data)
      .then((result, error) => {
        let summaryQuotationDetails = result.payload.data.resourceData;
        _this.setState({
          summaryQuotationDetails: summaryQuotationDetails
        });
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handlePPAPList() {
    let _this = this;
    let data = {
      userId: _this.props.userInfo.userData.id,
      roleId: _this.props.userInfo.userData.userRole,
      partId: _this.state.partId
    };
    _this.props
      .actionGetPPAPDocuments(data)
      .then((result, error) => {
        let ppapData = result.payload.data.resourceData;
        _this.setState({
          ppapData: ppapData
        });
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handlePartHistoryList() {
    let _this = this;
    let data = {
      userId: _this.props.userInfo.userData.id,
      partId: _this.state.partId
    };
    _this.props
      .actionGetPartHistory(data)
      .then((result, error) => {
        let partHistoryData = result.payload.data.resourceData;
        _this.setState({
          partHistoryData: partHistoryData
        });
      })
      .catch(e => _this.props.actionLoaderHide());
  }
  navigateToRFQ(data) {
    this.props.actionTabData(data);
  }
  getPartsDetail() {
    let _this = this;
    let partId = this.state.partId;
    makeThePartApiService('getPartDetail', { partId })
      .then(response => {
        let resource = response.data.resourceData;

        this.setState({
          rgqResponse: resource,
          partNumber: resource.partNumber,
          specificationNo: resource.specificationNo,
          quantity: resource.quantity,
          units: resource.units,
          currentStage: resource.currentStage,
          supplierStarRating: resource.supplierStarRating,
          targetDate: resource.targetDate,
          remarks: resource.remarks,
          partStatus: resource.partStatus,
          typeOfQuotation: resource.typeOfQuotation,
          address:
            resource.deliveryAddressResponse &&
            resource.deliveryAddressResponse.address,
          listOfPartialShipment: resource.listOfPartialShipment || [],
          partMediaResponses: resource.partMediaResponses,
          projectCode: resource.projectResponse.projectCode,
          valueAnalystQuotation: resource.valueAnalystQuotation
        });
        let valueToSendToReleasePO = {};
        valueToSendToReleasePO = {
          partId: _this.state.partId,
          partNumber: _this.state.partNumber,
          projectCode: _this.state.projectCode
        };
        _this.setState({ valueToSendToReleasePO: valueToSendToReleasePO });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getSummaryQuotationList() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      partId: this.state.partId
    };

    makeThePartApiService('getSummaryQuotationList', data)
      .then(response => {
        for (let i = 0; i < response.data.resourceData.length > 0; i++) {
          this.setState({ sumOfQuotation: response.data.resourceData[i] });
        }

        let orderResponse = response.data.resourceData;
        orderResponse &&
          orderResponse.forEach(function(item) {
            item.listOfQuotationResponese &&
              item.listOfQuotationResponese.forEach(function(elem) {
                if (elem.isSelectedByBuyer) {
                  _this.setState({ hideOrderButton: true });
                }
              });
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  actionApproveStatus() {
    let data = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      partId: this.state.partId
    };
    makeThePartApiService('actionApproveStatus', data)
      .then(response => {
        this.setState({
          approvedStatus: response.data.resourceData.requestForQuotation
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getMediaPartHistory() {
    let data = {
      projectId: this.state.projectId,
      partId: this.state.partId
    };

    makeThePartApiService('getUserPartHistory', data)
      .then(response => {
        this.setState({ partRevision: response.data.resourceData });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleUploadDesign(event) {
    const fileObject = event.target.files[0];
    let _this = this;

    const formData = new FormData();
    formData.set('mFile', fileObject);
    formData.append('thumbnailHeight', 100);
    formData.append('thumbnailWidth', 100);
    formData.append('isCreateThumbnail', true);
    formData.append('fileKey', fileObject.name);
    formData.append('filePath', fileObject.name);
    this.props.actionLoaderShow();
    this.props
      .actionUploadRevisionImage(formData)
      .then((result, error) => {
        _this.props.actionLoaderHide();
      })
      .catch(e => {
        console.log(e);
        _this.props.actionLoaderHide();
      });
  }

  handleCreatePartWithMedia = status => {
    let _this = this;
    const roleId = this.props.userInfo.userData.userRole;
    const partList = this.props.supplierParts.uploadedRevision;
    //  const specList = this.props.supplierParts.uploadedSpecificationList;
    const uploadedList = [...partList];
    let data = {
      partId: this.state.partId,
      projectId: this.state.rgqResponse.projectResponse.id,
      creatorUserId: this.props.userInfo.userData.id,
      roleId: roleId,
      partNumber:
        status === 'update' ? this.state.partNumber : this.state.newPartNumber,
      listOfPartMediaRequest: uploadedList,
      revisionNumber: this.state.revisionNumber
    };

    this.props.actionLoaderShow();
    this.props
      .actionUpdatePartWithMedia(data)
      .then((result, error) => {
        if (result.payload.data.state === 200) {
          _this.getMediaPartHistory();
          _this.setState({
            partNumber: this.state.newPartNumber,
            newPartNumber: '',
            showReplace: false,
            show: false,
            revisionNumber: ''
          });
        }
        _this.setState({
          show: false,
          revisionNumber: ''
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
    this.getMediaPartHistory();
  };

  deleteAttachment = path => {
    let filePath = path.mediaURL;

    this.props
      .actionDeleteRevisionImage(filePath)
      .then((result, error) => {})
      .catch();
  };

  activeTabKeyAction(tabKey) {
    if (tabKey === 'first') this.props.history.push('home');
    if (tabKey === 'third')
      this.props.history.push({ pathname: 'home', state: { path: 'third' } });
    this.setState({ tabKey: tabKey });
  }

  orderPOApproval(quotation) {
    let _this = this;
    if (quotation) {
      let partId = this.state.partId;
      let userId = this.props.userInfo.userData.id;
      let roleId = this.props.userInfo.userData.userRole;
      let quotationId = quotation;
      let data = {
        quotationId,
        partId,
        userId,
        roleId
      };
      makeThePartApiService('submitOrderDetail', data)
        .then(response => {
          if (response.data.status === 400) {
            // showErrorToast(response.data.responseMessage);
          } else {
            _this.setState({ disableOrderButton: true });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  createShowDetailArrayCells(listOfAllOperations, listOfQuotationDetails) {
    var newArray = [];
    var findKeyArray = [];
    var matchedCategories = listOfQuotationDetails.filter(function(item) {
      if (rr => listOfAllOperations.indexOf(item.operations) >= 0) {
        var obj = {};
        if (
          item.price &&
          item.price != '' &&
          typeof item.price != 'undefined'
        ) {
          obj[item.operations] = item.price;
        } else {
          obj[item.operations] = '';
        }
        newArray.push(obj);
        findKeyArray.push(item.operations);
      }
      return item => listOfAllOperations.indexOf(item.operations) >= 0;
    });

    let difference = listOfAllOperations.filter(x => !findKeyArray.includes(x));
    difference.forEach(function(element) {
      var obj = {};
      obj[element] = '';
      newArray.push(obj);
    });
    var returnElements = [];

    for (var i = 0; i < newArray.length; i++) {
      let findKey;
      let findValue;
      Object.keys(newArray[i]).forEach(function(key) {
        findKey = key;
        findValue = newArray[i][key];
      });
      let pushIndex = listOfAllOperations.findIndex(function findIndexForKey(
        element
      ) {
        return element == findKey;
      });
      returnElements[pushIndex] = <td>{findValue}</td>;
    }
    return returnElements;
  }

  ShowSingleDetailArrayCells(
    listOfAllOperations,
    listOfQuotationDetails,
    type
  ) {
    var newArray = [];
    var findKeyArray = [];
    var returnElements = [];
    if (listOfQuotationDetails) {
      var matchedCategories = listOfQuotationDetails.filter(function(item) {
        if (rr => listOfAllOperations.indexOf(item.operations) >= 0) {
          var obj = {};
          if (
            item.price &&
            item.price != '' &&
            typeof item.price != 'undefined'
          ) {
            obj[item.operations] = item.price;
          } else {
            obj[item.operations] = '';
          }
          newArray.push(obj);
          findKeyArray.push(item.operations);
        }
        return item => listOfAllOperations.indexOf(item.operations) >= 0;
      });

      let difference = listOfAllOperations.filter(
        x => !findKeyArray.includes(x)
      );
      difference.forEach(function(element) {
        var obj = {};
        obj[element] = '';
        newArray.push(obj);
      });

      for (var i = 0; i < newArray.length; i++) {
        let findKey;
        let findValue;
        Object.keys(newArray[i]).forEach(function(key) {
          findKey = key;
          findValue = newArray[i][key];
        });
        let pushIndex = listOfAllOperations.findIndex(function findIndexForKey(
          element
        ) {
          return element == findKey;
        });
        returnElements[pushIndex] = <td>{findValue}</td>;
      }
    }
    return returnElements;
  }
  getsupplierQuotationList() {
    let _this = this;
    let data = {
      userId: _this.props.userInfo.userData.id,
      roleId: _this.props.userInfo.userData.userRole,
      partId: _this.state.partId
    };

    _this.props
      .actiongetSupplierQuotationData(data)
      .then((result, error) => {
        let quotationResponseresourceData = result.payload.data.resourceData[0];
        _this.setState({
          supplierQuotation: result.payload.data.resourceData,
          quotationresourceData: quotationResponseresourceData.quotationResponse
        });
      })
      .catch(e => _this.props.actionLoaderHide());
  }
  handleFile(event, data) {
    window.open(data);
  }
  toggle() {
    this.setState({
      shown: !this.state.shown
    });
  }
  createPartRevisionColumn() {
    let peopleToReturn = [];
    if (this.state.partRevision) {
      let partRevision =
        this.state.partRevision && this.state.partRevision.slice(-1)[0];
      let lastRevitionLength = '';
      if (partRevision && partRevision.revisionNumber)
        lastRevitionLength = partRevision.revisionNumber;

      for (let i = 7; i <= lastRevitionLength; i++) {
        peopleToReturn.push(<th> REVISION {i}</th>);
      }
      return peopleToReturn;
    }
  }
  createPartRevisionColumnDetails() {
    let peopleToReturn = [];
    if (this.state.partRevision) {
      let partRevision =
        this.state.partRevision && this.state.partRevision.slice(-1)[0];
      let lastRevitionLength = '';
      if (partRevision && partRevision.revisionNumber)
        lastRevitionLength = partRevision.revisionNumber;
      for (let i = 1; i <= lastRevitionLength; i++) {
        var lastUpdatedTimestamp = _.result(
          _.find(this.state.partRevision, function(obj) {
            return obj.revisionNumber === i;
          }),
          'lastUpdatedTimestamp'
        );
        if (lastUpdatedTimestamp) {
          peopleToReturn.push(
            <td> {moment(lastUpdatedTimestamp).format('DD/MM/YYYY')}</td>
          );
        } else {
          peopleToReturn.push(<td />);
        }
      }
      return peopleToReturn;
    }
  }

  /** Comment Section -22 **/

  handleCommentsClose() {
    this.setState({
      showComments: false,
      partNumberForComments: '',
      commentBoxComment: ''
    });
  }

  handleCommentsShow(e) {
    let _this = this;
    this.setState({
      //showComments: true,
      partNumberForComments: this.state.partNumber
    });
    let data = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      partId: this.state.partId,
      pageNumber: this.state.pageCountComment,
      pageSize: commentPageSize
    };
    this.props.actionLoaderShow();
    this.props
      .actionCommentDetail(data)
      .then((result, error) => {
        let commentResponse = result.payload.data.resourceData.list;
        let totalRecordCountComment =
          result.payload.data.resourceData.totalRecordCount;
        if (_this.state.pageCountComment == 1) {
          _this.setState({
            commentResponse: commentResponse,
            isPageCountComment: true,
            totalRecordComment: totalRecordCountComment,
            commentRecordLength: commentResponse.length
          });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  getMoreData = () => {
    let _this = this;
    if (this.state.commentResponse.length >= this.state.totalRecordComment) {
      this.setState({ hasMore: false });
      return;
    }
    if (this.state.isPageCountComment === true) {
      let PC = this.state.pageCountComment;
      let pageNumber = PC + 1;
      let concatCommentData;
      this.setState({ pageCountComment: pageNumber });

      let data = {
        userId: this.props.userInfo.userData.id,
        roleId: this.props.userInfo.userData.userRole,
        partId: this.state.partId,
        pageNumber: this.state.pageCountComment,
        pageSize: commentPageSize
      };
      this.props.actionLoaderShow();
      this.props
        .actionCommentDetail(data)
        .then((result, error) => {
          let commentResponse = result.payload.data.resourceData.list;
          let totalRecordCountComment =
            result.payload.data.resourceData.totalRecordCount;
          let oldCommentResponse = this.state.commentResponse;
          if (_this.state.pageCountComment > 1) {
            concatCommentData = oldCommentResponse.concat(commentResponse);
            _this.setState({
              commentResponse: concatCommentData,
              totalRecordComment: totalRecordCountComment,
              commentRecordLength: concatCommentData.length
            });
          }
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  };

  submitComment() {
    let _this = this;
    let data = {
      userId: _this.props.userInfo.userData.id,
      roleId: _this.props.userInfo.userData.userRole,
      approvalId: _this.state.commentApporvalId,
      comment: _this.state.commentBoxComment,
      partId: _this.state.partId
    };

    this.props
      .actionSubmitComment(data)
      .then((result, error) => {
        let response = result.payload.data.resourceData;

        if (result.payload.data.status === 200) {
          //let notificationLen = _this.props.supplierParts.notificationResponse+1;
          let notificationLen = _this.props.supplierParts.notificationResponse;
          let socketData = {
            notificationCount: notificationLen,
            notificationId: result.payload.data.resourceData
          };
          socket.emit('new-message', socketData);
        }

        let count = _this.state.commentCount;
        let increaseCount = count + 1;

        _this.setState({ commentCount: increaseCount });

        let profileImage =
          customConstant.amazonURL +
          _this.props.userInfo.userData.profilePhotoURL;
        if (_this.props.userInfo.userData.profilePhotoURL == null) {
          profileImage = User;
        }
        let localComment = {
          comment: _this.state.commentBoxComment,
          date: new Date().getTime(),
          senderDetails: {
            firstName: _this.props.userInfo.userData.fullname,
            userProfile: _this.props.userInfo.userData.userProfile,
            profileImageThumbnailUrl: profileImage
          }
        };
        let commentResponse = _this.state.commentResponse
          ? _this.state.commentResponse
          : [];
        commentResponse.push(localComment);

        _this.setState({
          commentResponse: commentResponse,
          commentBoxComment: ''
        });

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  getCommemtsCount() {
    let _this = this;
    let partId = _this.state.partId;
    this.props
      .actionGetCommentsCount({ partId })
      .then((result, error) => {
        if (result.payload.data.status === 200) {
          let commentCount = result.payload.data.resourceData.commentCount;
          _this.setState({ commentCount: commentCount });
        } else {
          _this.setState({ commentCount: 0 });
        }
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  /** End Comment Section **/

  render() {
    let _this = this;
    let sumOfQuotation = this.state.sumOfQuotation,
      self = this;
    let arrayNew = [1, 2, 3, 4, 5];
    let supplierQuotation = self.state.supplierQuotation;
    var shown = { display: this.state.shown ? 'block' : 'none' };
    var hidden = { display: this.state.shown ? 'none' : 'block' };
    let valueAnalystQuotation = this.state.valueAnalystQuotation;

    return (
      <div>
        <Header {...this.props} />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === 'reviewPOApp' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <div className="border-around border-light p-10 m-t-20 m-b-20">
                  <Row>
                    <Col md={4}>
                      <div className="p-viwerWrapper flex-1 p-lr-20">
                        <SliderImage
                          partMediaResponses={this.state.partMediaResponses}
                          pageType="reviewPOApproval"
                        />
                      </div>
                    </Col>
                    <Col md={4}>
                      <div>
                        <Table className="no-border-table custom-table">
                          <tbody>
                            <tr>
                              <td className="color-light">Part Number</td>
                              <td>{this.state.partNumber}</td>
                            </tr>
                            <tr>
                              <td className="color-light">
                                Part Description :
                              </td>
                              <td> Part Description </td>
                            </tr>
                            <tr>
                              <td className="color-light">Part Status :</td>
                              <td>{this.state.partStatus}</td>
                            </tr>
                            <tr>
                              <td className="color-light">Quantity</td>
                              <td>{this.state.quantity}</td>
                            </tr>
                            <tr>
                              <td className="color-light">Units</td>
                              <td>{this.state.units}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                    <Col md={4}>
                      {' '}
                      <div>
                        <Table className="no-border-table custom-table">
                          <tbody>
                            <tr>
                              <td className="color-light">Status :</td>
                              <td>Status</td>
                            </tr>
                            <tr>
                              <td className="color-light">Total Price :</td>
                              <td>
                                {this.state.quotationresourceData &&
                                  this.state.quotationresourceData
                                    .grandTotal}{' '}
                                {this.state.quotationresourceData &&
                                  this.state.quotationresourceData.currency}
                              </td>
                            </tr>
                            <tr>
                              <td className="color-light">Subtotal Price :</td>
                              <td>
                                {' '}
                                {this.state.quotationresourceData &&
                                  this.state.quotationresourceData
                                    .quotationProcess.subTotal}{' '}
                                {this.state.quotationresourceData &&
                                  this.state.quotationresourceData.currency}
                              </td>
                            </tr>
                            <tr>
                              <td className="color-light">
                                Delivery target Date :
                              </td>
                              <td>
                                {moment(this.state.targetDate).format(
                                  'DD/MM/YYYY'
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="color-light">
                                Delivery Lead Time :
                              </td>
                              <td>
                                {this.state.quotationresourceData &&
                                  moment(
                                    this.state.quotationresourceData
                                      .deliveryLeadTime
                                  ).format('hh:mm A')}
                              </td>
                            </tr>
                            <tr>
                              <td className="color-light">Tooling Cost </td>
                              <td>
                                {this.state.quotationresourceData &&
                                  this.state.quotationresourceData.quotationTool
                                    .finalTotal}{' '}
                                {this.state.quotationresourceData &&
                                  this.state.quotationresourceData.currency}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </div>

                <Row>
                  <Col md={8}>
                    <h4 className="hero-title">New Product Development</h4>
                    <div className="border-around border-light p-10 m-t-20 m-b-20">
                      <Row>
                        {this.state.summaryQuotationDetails &&
                          this.state.summaryQuotationDetails.map(
                            (item, index) => {
                              let listOfQuotationIdAndPrice =
                                item.listOfQuotationIdAndPrice;
                              let newVal = 5;
                              let arrayNew = [1, 2, 3, 4];
                              return [
                                <div>
                                  {item.listOfQuotationIdAndPrice.length === 0
                                    ? arrayNew.map(i => <td />)
                                    : item.listOfQuotationIdAndPrice.map(
                                        (item, index) => {
                                          let checkCon =
                                            listOfQuotationIdAndPrice[
                                              index + 1
                                            ];
                                          if (checkCon) arrayNew.pop();
                                          return [
                                            <Col md={3}>
                                              <div
                                                className={
                                                  item.finalQuotationSelectedByBuyer
                                                    ? 'product-info-card ticket-green w-full '
                                                    : 'product-info-card ticket-blue w-full '
                                                }
                                              >
                                                <ul>
                                                  <li className="flex">
                                                    <span className="ttl">
                                                      {item.supplierResponse &&
                                                        item.supplierResponse
                                                          .companyName}
                                                    </span>
                                                  </li>
                                                  <li className="flex">
                                                    <span className="ttl">
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
                                                    <span className="ttl">
                                                      {item.deliveryLeadTime}{' '}
                                                      days
                                                    </span>
                                                  </li>
                                                </ul>
                                              </div>
                                            </Col>
                                          ];
                                        }
                                      )}
                                  {this.state.valueAnalystQuotation &&
                                  this.state.valueAnalystQuotation
                                    .valueAnalystDetailResponse ? (
                                    <Col md={3}>
                                      <div className="product-info-card s w-full">
                                        <ul>
                                          <li className="flex">
                                            <span className="ttl">
                                              {this.state
                                                .valueAnalystQuotation &&
                                              this.state.valueAnalystQuotation
                                                .valueAnalystDetailResponse
                                                ? this.state
                                                    .valueAnalystQuotation
                                                    .valueAnalystDetailResponse
                                                    .firstName +
                                                  ' ' +
                                                  this.state
                                                    .valueAnalystQuotation
                                                    .valueAnalystDetailResponse
                                                    .lastName
                                                : ''}
                                            </span>
                                          </li>
                                          <li className="flex">
                                            <span className="ttl">
                                              {item.costPerPiece}
                                              {this.state
                                                .valueAnalystQuotation &&
                                                this.state.valueAnalystQuotation
                                                  .currency}
                                              /pc
                                            </span>
                                          </li>
                                          <li className="flex">
                                            <span className="ttl">
                                              Tooling:
                                            </span>
                                            <span className="dis">
                                              {this.state
                                                .valueAnalystQuotation &&
                                                this.state.valueAnalystQuotation
                                                  .quotationTool &&
                                                this.state.valueAnalystQuotation
                                                  .quotationTool.costTotal}{' '}
                                              {this.state
                                                .valueAnalystQuotation &&
                                                this.state.valueAnalystQuotation
                                                  .currency}
                                            </span>
                                          </li>
                                          <li className="flex">
                                            <span className="ttl">
                                              {this.state
                                                .valueAnalystQuotation &&
                                                this.state.valueAnalystQuotation
                                                  .deliveryLeadTime}{' '}
                                              days
                                            </span>
                                          </li>
                                        </ul>
                                      </div>
                                    </Col>
                                  ) : (
                                    ''
                                  )}
                                </div>
                              ];
                            }
                          )}
                      </Row>
                      <div
                        className="gray-card p-10 text-center text-uppercase m-t-20 flex justify-center align-center cursor-pointer"
                        onClick={this.toggle.bind(this)}
                      >
                        summary of Quotation &nbsp;&nbsp;
                        <span className="ico-up-arrow" style={hidden}>
                          <svg>
                            <use xlinkHref={`${Sprite}#upArrowIco`} />
                          </svg>
                        </span>
                        <span className="ico-up-arrow rotate-180" style={shown}>
                          <svg>
                            <use xlinkHref={`${Sprite}#upArrowIco`} />
                          </svg>
                        </span>
                        {/* <span
                          style={hidden}
                          className="glyphicon glyphicon-upload"
                        >
                          {" "}
                        </span>
                        <span
                          style={shown}
                          className="glyphicon glyphicon-download"
                        >
                          {" "}
                        </span> */}
                      </div>
                    </div>
                    <h4 className="hero-title-2">
                      Summary of Part Number: {this.state.partNumber}{' '}
                    </h4>
                    <div style={hidden} />
                    <div style={shown}>
                      <h4 className="hero-title">
                        Quotation Summary Part Number: {this.state.partNumber}
                      </h4>
                      <div>
                        {/* {sumOfQuotation &&
                           sumOfQuotation.length > 0 && 
                           sumOfQuotation.map(function(
                              item,
                              indx
                            ){

                          })} */}

                        {sumOfQuotation &&
                        sumOfQuotation.listOfQuotationResponese &&
                        sumOfQuotation.listOfQuotationResponese.length > 0 ? (
                          <Table
                            bordered
                            responsive
                            className="custom-table cell-125"
                          >
                            <thead>
                              <tr>
                                <th>Supplier rating</th>
                                <th>Supplier</th>
                                <th>Supplier Country</th>
                                <th>Location</th>
                                <th>Tooling Cost</th>
                                <th>Total Price</th>
                                <th>Delivery Lead Time</th>
                                <th>Delivery Target Date</th>
                                <th>Quantity</th>
                                <th />
                                <th />
                              </tr>
                              <tr className="h-10"> </tr>
                            </thead>
                            <tbody>
                              {sumOfQuotation &&
                                sumOfQuotation.listOfQuotationResponese &&
                                sumOfQuotation.listOfQuotationResponese.map(
                                  function(data, index) {
                                    return (
                                      <tr>
                                        <td>**</td>
                                        <td>
                                          {data.supplierResponse &&
                                            data.supplierResponse.companyName}
                                        </td>
                                        <td>India</td>
                                        <td>India</td>

                                        <td>
                                          {' '}
                                          {data &&
                                            data.quotationTool &&
                                            data.quotationTool.finalTotal}
                                        </td>
                                        <td> {data && data.grandTotal}</td>
                                        <td>
                                          {' '}
                                          {moment(data.deliveryLeadTime).format(
                                            'hh:mm A'
                                          )}
                                        </td>
                                        <td>
                                          {moment(
                                            data.deliveryTargetDate
                                          ).format('DD/MM/YYYY')}
                                        </td>
                                        <td>{data.quotationForQuantity}</td>
                                        <td>
                                          <button
                                            className="btn btn-default sm-btn"
                                            onClick={() => {
                                              const list = {
                                                sumOfQuotation: sumOfQuotation,
                                                listOfAllOperations:
                                                  sumOfQuotation.listOfAllOperations,
                                                listOfQuotationDetails: data
                                              };
                                              self.handlePartDetailReview(
                                                list,
                                                index
                                              );
                                            }}
                                          >
                                            Review
                                          </button>
                                        </td>
                                        <td>
                                          {/* {_this.props.userInfo.userData
                                            .userProfile === 'buyer' ||
                                          !data.isSelectedByBuyer ? ( */}
                                          {_this.state
                                            .hideOrderButton ? null : (
                                            <button
                                              // className={`btn btn-success sm-btn ${
                                              //   _this.state.disableOrderButton
                                              // } ? '' : hide}`}
                                              className={
                                                _this.state.disableOrderButton
                                                  ? 'btn btn-success sm-btn p-e-none'
                                                  : 'btn btn-success sm-btn'
                                              }
                                              onClick={event =>
                                                self.orderPOApproval(
                                                  data.quotationId
                                                )
                                              }
                                            >
                                              Order
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                            </tbody>
                          </Table>
                        ) : (
                          <div>No Records found</div>
                        )}
                      </div>
                    </div>

                    {/* <PanelGroup
                      accordion
                      id="accordion-uncontrolled-example"
                      className="panelReview icon-p-m"
                      defaultActiveKey="2"
                    >
                      <Panel eventKey="1">
                        <Panel.Heading>
                          <Panel.Title toggle>
                            <h5 className="m-0 flex justify-space-between">
                              Final supplier Quote and delivery status
                              <span className="arrow-right mr-10"> </span>
                            </h5>
                          </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body collapsible />
                      </Panel>

                      <Panel eventKey="2">
                        <Panel.Heading>
                          <Panel.Title toggle>
                            <h5 className="m-0 flex justify-space-between">
                              PPAP History{" "}
                              <span className="arrow-right mr-10"> </span>
                            </h5>
                          </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body collapsible> </Panel.Body>
                      </Panel>

                      <Panel eventKey="3">
                        <Panel.Heading>
                          <Panel.Title toggle>
                            {" "}
                            <h5 className="m-0 flex justify-space-between">
                              RFQ Addtion Details{" "}
                              <span className="arrow-right mr-10"> </span>
                            </h5>
                          </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body collapsible> </Panel.Body>
                      </Panel>

                      <Panel eventKey="4">
                        <Panel.Heading>
                          <Panel.Title toggle>
                            <h5 className="m-0 flex justify-space-between">
                              Part Revision Status{" "}
                              <span className="arrow-right mr-10"> </span>
                            </h5>
                          </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body collapsible>
                          {" "}
                          <div className="flex justify-space-between align-center" />
                          <div className="">
                            <div />
                          </div>
                        </Panel.Body>
                      </Panel>

                      <Panel eventKey="5">
                        <Panel.Heading>
                          <Panel.Title toggle>
                            {" "}
                            {this.state.approvedStatus ? (
                              <h5 className="m-0 flex justify-space-between">
                                Approval Status{" "}
                                <span className="arrow-right mr-10" />
                              </h5>
                            ) : null}
                          </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body collapsible> </Panel.Body>
                      </Panel>
                    </PanelGroup> */}
                    <div className="pan-group">
                      <h5
                        onClick={() =>
                          this.setState({ open5: !this.state.open5 })
                        }
                        className={
                          this.state.open5
                            ? 'm-0 flex justify-space-between hero-title cursor-pointer rotate'
                            : 'm-0 flex justify-space-between hero-title cursor-pointer'
                        }
                      >
                        Technical Cost Estimation/ Zero Based Costing
                        <span className="arrow-right mr-10" />
                      </h5>
                      <Panel
                        id="collapsible-panel-example-1"
                        expanded={this.state.open5}
                      >
                        <Panel.Collapse>
                          <Panel.Body>
                            <div>
                              {this.state.valueAnalystQuotation &&
                              this.state.valueAnalystQuotation.buyerResponse ? (
                                <Table
                                  bordered
                                  responsive
                                  className="custom-table cell-125"
                                >
                                  <thead>
                                    <tr>
                                      <th>Buyer rating</th>
                                      <th>Buyer</th>
                                      <th>Buyer Country</th>
                                      <th>Location</th>
                                      <th>Tooling Cost</th>
                                      <th>Total Price</th>
                                      <th>Delivery Lead Time</th>
                                      <th>Delivery Target Date</th>
                                      <th>Quantity</th>
                                      <th />
                                      <th />
                                    </tr>
                                    <tr className="h-10"> </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>**</td>
                                      <td>
                                        {valueAnalystQuotation.buyerResponse &&
                                          valueAnalystQuotation.buyerResponse
                                            .companyName}
                                      </td>
                                      <td>India</td>
                                      <td>India</td>

                                      <td>
                                        {' '}
                                        {valueAnalystQuotation &&
                                          valueAnalystQuotation.quotationTool &&
                                          valueAnalystQuotation.quotationTool
                                            .finalTotal}
                                      </td>
                                      <td>
                                        {' '}
                                        {valueAnalystQuotation &&
                                          valueAnalystQuotation.grandTotal}
                                      </td>
                                      <td>
                                        {' '}
                                        {moment(
                                          valueAnalystQuotation.deliveryLeadTime
                                        ).format('hh:mm A')}
                                      </td>
                                      <td>
                                        {moment(
                                          valueAnalystQuotation.deliveryTargetDate
                                        ).format('DD/MM/YYYY')}
                                      </td>
                                      <td>
                                        {
                                          valueAnalystQuotation.quotationForQuantity
                                        }
                                      </td>
                                      <td>
                                        <button
                                          className="btn btn-default sm-btn"
                                          onClick={() => {
                                            const list = {
                                              sumOfQuotation: sumOfQuotation,
                                              listOfAllOperations:
                                                sumOfQuotation.listOfAllOperations,
                                              listOfQuotationDetails: valueAnalystQuotation
                                            };
                                            self.handlePartDetailReview(
                                              list,
                                              0
                                            );
                                          }}
                                        >
                                          Review
                                        </button>
                                      </td>
                                      {/* <td>                                    
                                              {_this.state
                                                .hideOrderButton ? null : (
                                                <button                            
                                                  className={
                                                    _this.state.disableOrderButton
                                                      ? 'btn btn-success sm-btn p-e-none'
                                                      : 'btn btn-success sm-btn'
                                                  }
                                                  onClick={event =>
                                                    self.orderPOApproval(
                                                      data.quotationId
                                                    )
                                                  }
                                                >
                                                  Order
                                                </button>
                                              )}
                                            </td> */}
                                    </tr>
                                  </tbody>
                                </Table>
                              ) : (
                                <div>No Records found</div>
                              )}
                            </div>
                          </Panel.Body>
                        </Panel.Collapse>
                      </Panel>

                      <h5
                        onClick={() =>
                          this.setState({ open: !this.state.open })
                        }
                        className={
                          this.state.open
                            ? 'm-0 flex justify-space-between hero-title cursor-pointer rotate'
                            : 'm-0 flex justify-space-between hero-title cursor-pointer'
                        }
                      >
                        Final supplier Quote and delivery status
                        <span className="arrow-right mr-10" />
                      </h5>

                      <Panel
                        id="collapsible-panel-example-1"
                        expanded={this.state.open}
                      >
                        <Panel.Collapse>
                          <Panel.Body>
                            <div className="">
                              {this.state.supplierQuotation &&
                              this.state.supplierQuotation.length > 0 ? (
                                <Table
                                  bordered
                                  responsive
                                  className="custom-table cell-125"
                                >
                                  <thead>
                                    <tr>
                                      <th>Project</th>
                                      <th>Part Number</th>
                                      <th>Project Title</th>
                                      <th>Supplier rating</th>
                                      <th>Delivery Target (Date)</th>
                                      <th>Delivery Lead Time</th>
                                      <th>Purchase OrderNo</th>
                                      <th>Current Status</th>
                                      <th>Percent Completion</th>
                                      <th>Quality Inspection (Date)</th>
                                      <th>Dispatch (Date)</th>
                                      <th>Parts Receipt (Date)</th>
                                      <th>Comments</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.supplierQuotation &&
                                      this.state.supplierQuotation.map(function(
                                        data,
                                        index
                                      ) {
                                        return (
                                          <tr>
                                            <td>
                                              {
                                                data.partResponse
                                                  .projectResponse.projectTitle
                                              }
                                            </td>
                                            <td>
                                              {data.partResponse.partNumber}
                                            </td>
                                            <td>
                                              {
                                                data.partResponse
                                                  .projectResponse.projectTitle
                                              }
                                            </td>
                                            <td>5{data.supplierStarRating}</td>
                                            <td>
                                              {moment(
                                                data.quotationResponse
                                                  .deliveryTargetDate
                                              ).format('DD/MM/YYYY')}
                                            </td>
                                            <td>
                                              {moment(
                                                data.quotationResponse
                                                  .deliveryLeadTime
                                              ).format('HH : MM A')}
                                            </td>
                                            <td>
                                              {supplierQuotation &&
                                                data.purchaseOrderNo}
                                            </td>
                                            <td>{data.currentStatus}</td>
                                            <td>{data.percentCompletion}</td>
                                            <td>
                                              {moment(
                                                data.qualityInspectionDate
                                              ).format('DD/MM/YYYY')}
                                            </td>
                                            <td>
                                              {moment(data.dispatchDate).format(
                                                'DD/MM/YYYY'
                                              )}
                                            </td>
                                            <td>
                                              {moment(
                                                data.partsReceiptDate
                                              ).format('DD/MM/YYYY')}
                                            </td>
                                            <td>{data.comments}</td>
                                          </tr>
                                        );
                                      })}
                                    <tr />
                                  </tbody>
                                </Table>
                              ) : (
                                <div>No Records found</div>
                              )}
                            </div>
                          </Panel.Body>
                        </Panel.Collapse>
                      </Panel>

                      <h5
                        className={
                          this.state.open1
                            ? 'm-0 flex justify-space-between hero-title cursor-pointer rotate'
                            : 'm-0 flex justify-space-between hero-title cursor-pointer'
                        }
                        onClick={() =>
                          this.setState({ open1: !this.state.open1 })
                        }
                      >
                        PPAP History
                        <span className="arrow-right mr-10" />
                      </h5>

                      <Panel
                        id="collapsible-panel-example-1"
                        expanded={this.state.open1}
                      >
                        <Panel.Collapse>
                          <Panel.Body>
                            <div className="">
                              {this.state.ppapData &&
                              this.state.ppapData.listOfPPAPDocumentRes.length >
                                0 ? (
                                <Table
                                  bordered
                                  responsive
                                  className="custom-table cell-125"
                                >
                                  <thead>
                                    <tr>
                                      <th>Document Name</th>
                                      <th>Buyer Review Status</th>
                                      <th>Document Status</th>
                                      <th>Document</th>
                                      <th>Created Time</th>
                                      <th>Buyer CommentsRes</th>
                                      <th>Designer CommentsRes</th>
                                      <th>Supplier CommentsRes</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {' '}
                                    {this.state.ppapData &&
                                      this.state.ppapData.listOfPPAPDocumentRes.map(
                                        function(data, index) {
                                          return (
                                            <tr>
                                              <td>{data.documentType}</td>
                                              <td>
                                                {data.buyerDocReviewStatus}
                                              </td>
                                              <td>{data.documentStatus}</td>
                                              <td>
                                                <div>
                                                  <span
                                                    onClick={event =>
                                                      self.handleFile(
                                                        event,
                                                        data.mediaURL
                                                      )
                                                    }
                                                  >
                                                    {(data &&
                                                      data.mediaType ===
                                                        'application/octet-stream') ||
                                                    (data &&
                                                      data.mediaType ===
                                                        'application/vnd.ms-excel') ? (
                                                      <img
                                                        src={xlsImage}
                                                        width="25"
                                                      />
                                                    ) : data &&
                                                      data.mediaType ===
                                                        'application/pdf' ? (
                                                      <img
                                                        src={pdfImage}
                                                        width="25"
                                                      />
                                                    ) : data &&
                                                      data.mediaType ===
                                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                                      <img
                                                        src={docImage}
                                                        width="25"
                                                      />
                                                    ) : data &&
                                                      data.mediaType ===
                                                        'text/plain' ? (
                                                      <img
                                                        src={docImage}
                                                        width="25"
                                                      />
                                                    ) : data &&
                                                      data.mediaType ===
                                                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
                                                      <img
                                                        src={xlsImage}
                                                        width="25"
                                                      />
                                                    ) : (
                                                      <div />
                                                    )}
                                                  </span>
                                                </div>
                                              </td>
                                              <td>
                                                {moment(
                                                  data.createdTimestamp
                                                ).format('DD/MM/YYYY')}
                                              </td>
                                              <td>
                                                {data.supplierCommentsRes &&
                                                  data.supplierCommentsRes[0]
                                                    .comment}
                                              </td>
                                              <td>
                                                {data.designerCommentsRes &&
                                                  data.designerCommentsRes[0]
                                                    .comment}
                                              </td>
                                              <td>
                                                {data.buyerCommentsRes &&
                                                  data.buyerCommentsRes[0]
                                                    .comment}
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )}
                                    <tr />
                                  </tbody>
                                </Table>
                              ) : (
                                <div>No Records found</div>
                              )}
                            </div>
                          </Panel.Body>
                        </Panel.Collapse>
                      </Panel>

                      <h5
                        className={
                          this.state.open2
                            ? 'm-0 flex justify-space-between hero-title cursor-pointer rotate'
                            : 'm-0 flex justify-space-between hero-title cursor-pointer'
                        }
                        onClick={() =>
                          this.setState({ open2: !this.state.open2 })
                        }
                      >
                        Additional Details
                        <span className="arrow-right mr-10" />
                      </h5>

                      <Panel
                        id="collapsible-panel-example-1"
                        expanded={this.state.open2}
                      >
                        <Panel.Collapse>
                          <Panel.Body>
                            <div>
                              {this.state.listOfPartialShipment &&
                              this.state.listOfPartialShipment.length > 0 ? (
                                <Table
                                  bordered
                                  responsive
                                  className="custom-table cell-125"
                                >
                                  <thead>
                                    <tr>
                                      <th>Part Number</th>
                                      {/* <th>Specification No</th> */}
                                      <th>Quantity</th>
                                      <th>Units</th>
                                      <th>Delivery Address</th>
                                      <th>Packaging / Devliery Condition</th>
                                      <th>Supplier Star Rating</th>
                                      {/* <th>Supplier Location</th>
                                          <th>New Suppliers</th>
                                          <th>New Suppliers?</th> */}
                                      <th>Proto/ Production</th>
                                      {this.state.listOfPartialShipment &&
                                        this.state.listOfPartialShipment.map(
                                          function(data, index) {
                                            return [
                                              <th>Shipment Qty {index + 1}</th>
                                            ];
                                          }
                                        )}
                                      {this.state.listOfPartialShipment &&
                                        this.state.listOfPartialShipment.map(
                                          function(data, index) {
                                            return [
                                              <th>Shipment Date {index + 1}</th>
                                            ];
                                          }
                                        )}
                                      <th>Target Date</th>
                                      <th>Remarks</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>{this.state.partNumber}</td>
                                      {/* <td>{this.state.specificationNo}</td> */}
                                      <td>{this.state.quantity}</td>
                                      <td>{this.state.units}</td>
                                      <td>{this.state.address}</td>
                                      <td>{this.state.currentStage}</td>
                                      <td>
                                        {this.state.supplierStarRating
                                          ? this.state.supplierStarRating
                                          : 5}
                                      </td>
                                      {/* <td />
                                          <td />
                                          <td /> */}
                                      <td>{this.state.typeOfQuotation}</td>
                                      {this.state.listOfPartialShipment &&
                                        this.state.listOfPartialShipment.map(
                                          function(data, index) {
                                            return [
                                              <td>{data.shipmentQty}</td>
                                            ];
                                          }
                                        )}
                                      {this.state.listOfPartialShipment &&
                                        this.state.listOfPartialShipment.map(
                                          function(data, index) {
                                            return [
                                              <td>
                                                {moment(
                                                  data.shipmentTargetDate
                                                ).format('DD/MM/YYYY')}
                                              </td>
                                            ];
                                          }
                                        )}
                                      <td>
                                        {' '}
                                        {moment(this.state.targetDate).format(
                                          'DD/MM/YYYY'
                                        )}
                                      </td>
                                      <td>{this.state.remarks}</td>
                                    </tr>
                                  </tbody>
                                </Table>
                              ) : (
                                <div>No Records found</div>
                              )}
                            </div>
                          </Panel.Body>
                        </Panel.Collapse>
                      </Panel>

                      <h5
                        className={
                          this.state.open3
                            ? 'm-0 flex justify-space-between hero-title cursor-pointer rotate'
                            : 'm-0 flex justify-space-between hero-title cursor-pointer'
                        }
                        onClick={() =>
                          this.setState({ open3: !this.state.open3 })
                        }
                      >
                        Part Revision Status
                        <span className="arrow-right mr-10" />
                      </h5>

                      <Panel
                        id="collapsible-panel-example-1"
                        expanded={this.state.open3}
                      >
                        <Panel.Collapse>
                          <Panel.Body>
                            <div>
                              {this.state.partRevision &&
                              this.state.partRevision.length > 0 ? (
                                <Table
                                  bordered
                                  responsive
                                  className="custom-table cell-125 "
                                >
                                  <thead>
                                    <tr>
                                      <th>
                                        <span style={{ visibility: 'hidden' }}>
                                          fff
                                        </span>{' '}
                                      </th>
                                      <th>Revision 1</th>
                                      <th>Revision 2</th>
                                      <th>Revision 3</th>
                                      <th>Revision 4</th>
                                      <th>Revision 5</th>
                                      <th>Revision 6</th>

                                      {this.createPartRevisionColumn()}

                                      {/* {this.state.partRevision &&
                                      this.state.partRevision.length > 6 &&
                                      this.state.partRevision.map(function(
                                        data,
                                        index
                                      ) {
                                        return <th>Revision {index + 1}</th>;
                                      })} */}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <b>Date</b>
                                      </td>
                                      {this.createPartRevisionColumnDetails()}

                                      {/* {this.state.partRevision &&
                                      this.state.partRevision.map(function(
                                        data,
                                        index
                                      ) {
                                        // let checkCon =
                                        //   self.state.approvedStatus[index + 1];
                                        // if (checkCon) arrayNew.pop();
                                        return (
                                          <td>
                                            {index+1 === data.revisionNumber?moment(
                                              data.lastUpdatedTimestamp
                                            ).format("DD/MM/YYYY"):''}
                                          </td>
                                        )
                                        //   <td>
                                        //     {moment(
                                        //       data.lastUpdatedTimestamp
                                        //     ).format("DD/MM/YYYY")}
                                        //   </td>,
                                        //   checkCon
                                        //     ? null
                                        //     : arrayNew.map(i => <td />)
                                        // ];
                                      })}{" "} */}
                                      {/*{this.state.partRevision &&*/}
                                      {/*this.state.partRevision.map(function(data) {*/}
                                      {/*return (*/}
                                      {/*<td>*/}
                                      {/*{moment(data.lastUpdatedTimestamp).format(*/}
                                      {/*"DD/MM/YYYY"*/}
                                      {/*)}*/}
                                      {/*</td>*/}
                                      {/*);*/}
                                      {/*})}*/}
                                    </tr>
                                  </tbody>
                                </Table>
                              ) : (
                                <div>No Records found</div>
                              )}
                            </div>
                          </Panel.Body>
                        </Panel.Collapse>
                      </Panel>

                      <h5
                        className={
                          this.state.open4
                            ? 'm-0 flex justify-space-between hero-title cursor-pointer rotate'
                            : 'm-0 flex justify-space-between hero-title cursor-pointer'
                        }
                        onClick={() =>
                          this.setState({ open4: !this.state.open4 })
                        }
                      >
                        Approval Status
                        <span className="arrow-right mr-10" />
                      </h5>

                      <Panel
                        id="collapsible-panel-example-1"
                        expanded={this.state.open4}
                      >
                        <Panel.Collapse>
                          <Panel.Body>
                            {this.state.approvedStatus ? (
                              <div>
                                {this.state.approvedStatus &&
                                this.state.approvedStatus.length > 0 ? (
                                  <Table
                                    bordered
                                    responsive
                                    className="custom-table cell-125"
                                  >
                                    <thead>
                                      <tr>
                                        <th>
                                          <span
                                            style={{ visibility: 'hidden' }}
                                          >
                                            fff
                                          </span>{' '}
                                        </th>
                                        <th>Approval 1</th>
                                        <th>Approval 2</th>
                                        <th>Approval 3</th>
                                        <th>Approval 4</th>
                                        <th>Approval 5</th>
                                        <th>Approval 6</th>
                                        {this.state.approvedStatus &&
                                          this.state.approvedStatus.length >
                                            6 &&
                                          this.state.approvedStatus.map(
                                            function(data, index) {
                                              return index > 6 ? (
                                                <th>Approval {index + 7}</th>
                                              ) : (
                                                ''
                                              );
                                            }
                                          )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>Name</td>
                                        {this.state.approvedStatus.map(function(
                                          data,
                                          index
                                        ) {
                                          let checkCon =
                                            self.state.approvedStatus[
                                              index + 1
                                            ];
                                          if (checkCon) arrayNew.pop();
                                          return [
                                            <td>{data.approverName}</td>,
                                            checkCon
                                              ? null
                                              : arrayNew.map(i => <td />)
                                          ];
                                        })}{' '}
                                      </tr>
                                      <tr>
                                        <td>Status</td>
                                        {this.state.approvedStatus.map(function(
                                          data,
                                          index
                                        ) {
                                          let checkCon =
                                            self.state.approvedStatus[
                                              index + 1
                                            ];
                                          if (checkCon) arrayNew.pop();
                                          return [
                                            <td>{data.status}</td>,
                                            checkCon
                                              ? null
                                              : arrayNew.map(i => <td />)
                                          ];
                                        })}{' '}
                                      </tr>
                                      <tr>
                                        <td>Date</td>
                                        {this.state.approvedStatus.map(function(
                                          data,
                                          index
                                        ) {
                                          let checkCon =
                                            self.state.approvedStatus[
                                              index + 1
                                            ];
                                          if (checkCon) arrayNew.pop();
                                          return [
                                            <td>
                                              {moment(data.date).format(
                                                'DD/MM/YYYY'
                                              )}
                                            </td>,
                                            checkCon
                                              ? null
                                              : arrayNew.map(i => <td />)
                                          ];
                                        })}{' '}
                                      </tr>
                                      <tr>
                                        <td>Comment</td>
                                        {this.state.approvedStatus.map(function(
                                          data,
                                          index
                                        ) {
                                          let checkCon =
                                            self.state.approvedStatus[
                                              index + 1
                                            ];
                                          if (checkCon) arrayNew.pop();
                                          return [
                                            <td>{data.comment}</td>,
                                            checkCon
                                              ? null
                                              : arrayNew.map(i => <td />)
                                          ];
                                        })}{' '}
                                      </tr>
                                    </tbody>
                                  </Table>
                                ) : (
                                  <div>No Records found</div>
                                )}
                              </div>
                            ) : null}
                          </Panel.Body>
                        </Panel.Collapse>
                      </Panel>
                    </div>
                  </Col>
                  <Col md={4} className="p-sticky">
                    <div className="style2-tab">
                      <Tab.Container
                        id="tabs-with-dropdown"
                        defaultActiveKey="first"
                      >
                        <Row className="clearfix">
                          <Col sm={12}>
                            <Nav bsStyle="tabs">
                              <NavItem eventKey="first">Part history</NavItem>

                              <NavItem eventKey="Third">Where Used</NavItem>
                              <NavItem eventKey="fourth">Delivery</NavItem>
                              <NavItem
                                eventKey="second"
                                onClick={e => _this.handleCommentsShow(e)}
                              >
                                Comments
                              </NavItem>
                            </Nav>
                          </Col>
                          <Col sm={12}>
                            <Tab.Content animation>
                              <Tab.Pane eventKey="first">
                                <div class="flex justify-space-between align-center">
                                  <h5
                                    className="fw-600"
                                    style={{ paddingLeft: '6px' }}
                                  >
                                    Summary of Part Number:{' '}
                                    {this.state.partNumber}
                                  </h5>
                                  <div className="flex">
                                    <button
                                      className="btn btn-default xsm-btn text-uppercase"
                                      onClick={this.handleShow}
                                    >
                                      upload Revision
                                    </button>
                                    <button
                                      className="btn btn-default xsm-btn text-uppercase"
                                      onClick={this.handleShowReplace}
                                    >
                                      Replace part
                                    </button>
                                  </div>
                                </div>
                                <div className="style1-panel w-350">
                                  <Panel
                                    id="collapsible-panel-example-3"
                                    defaultExpanded
                                  >
                                    <Panel.Heading className="flex align-center">
                                      {/* <Panel.Title>
                                        Title that functions as a collapse
                                        toggle
                                      </Panel.Title> */}
                                      <Panel.Toggle componentClass="a">
                                        <span className="arrow-right mr-10">
                                          {''}{' '}
                                        </span>
                                        <div className="flex flex-1">
                                          <span className="date mr-10">
                                            Part History
                                          </span>

                                          {/* <span className="revision flex-1">
                                            Revision A
                                          </span> */}
                                        </div>
                                      </Panel.Toggle>
                                      {/* <div
                                        title="Comment"
                                        className="cursor-pointer"
                                        onClick={e =>
                                          _this.handleCommentsShow(e)
                                        }
                                      >
                                        <span className="ico-message">
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#messageIco`}
                                            />
                                          </svg>
                                        </span>
                                        <span className="text-info fw-600 fs-12">
                                          {_this.state.commentCount}
                                        </span>
                                      </div> */}
                                    </Panel.Heading>
                                    <Panel.Collapse className="panel-scroll">
                                      <Panel.Body>
                                        <div className="summ-time-line">
                                          <ul className="timeline">
                                            {this.state.partHistoryData &&
                                              this.state.partHistoryData.map(
                                                function(item, index) {
                                                  return (
                                                    <li className="flex justify-space-between">
                                                      <div className="flex-1 date">
                                                        {item &&
                                                          moment(
                                                            item.actionDate
                                                          ).format(
                                                            'MMMM Do YYYY'
                                                          )}
                                                      </div>
                                                      <div className="flex-1 content flex justify-space-between">
                                                        <div>
                                                          <p>
                                                            {item &&
                                                              item.action}
                                                          </p>
                                                          <div className="color-light fs-12">
                                                            {item.actionBy &&
                                                              item.actionBy
                                                                .fullName}
                                                          </div>
                                                          <span className="color-light fs-12">
                                                            {item.actionBy &&
                                                              item.actionBy
                                                                .userProfile}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </li>
                                                  );
                                                }
                                              )}
                                            {/* <li className="flex justify-space-between active">
                                              <div className="flex-1 date">
                                                April, 10 2018
                                              </div>
                                              <div className="flex-1 content">
                                                <p>Part Creator</p>
                                                <span className="color-light fs-12">
                                                  Lara Croft
                                                </span>
                                              </div>
                                            </li> */}
                                          </ul>
                                        </div>

                                        {/* <button
                                          className="btn btn-task"
                                          onClick={e =>
                                            this.handleCommentsShow(e)
                                          }
                                        >
                                          <span className="ico-action ">
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#commentIco`}
                                              />
                                            </svg>
                                          </span>
                                          <span className="ico-txt">
                                            Comment
                                          </span>
                                        </button> */}
                                      </Panel.Body>
                                    </Panel.Collapse>
                                  </Panel>
                                </div>
                              </Tab.Pane>
                              <Tab.Pane eventKey="second">
                                <div className="chat-wrapper p-20">
                                  <InfiniteScroll
                                    dataLength={this.state.commentRecordLength}
                                    next={this.getMoreData}
                                    hasMore={this.state.hasMoreComment}
                                    height={300}
                                    style={{
                                      maxHeight: '400px',
                                      minHeight: '300px'
                                    }}
                                  >
                                    <ul
                                      className="chat-list"
                                      style={{
                                        maxHeight: 'initial',
                                        minHeight: 'initial'
                                      }}
                                    >
                                      {this.state.commentResponse &&
                                        this.state.commentResponse.map(
                                          (item, index) => {
                                            return (
                                              <li className="flex" key={index}>
                                                <div className="avatar">
                                                  <img
                                                    src={
                                                      item.senderDetails &&
                                                      item.senderDetails
                                                        .profileImageThumbnailUrl
                                                        ? item.senderDetails
                                                            .profileImageThumbnailUrl
                                                        : User
                                                    }
                                                  />
                                                </div>
                                                <div className="flex-1">
                                                  <div className="flex justify-space-between align-center">
                                                    <span className="u-name fs-12">
                                                      <b>
                                                        {item.senderDetails &&
                                                          item.senderDetails
                                                            .firstName}{' '}
                                                        {item.senderDetails &&
                                                          item.senderDetails
                                                            .lastName}
                                                        ,{' '}
                                                      </b>
                                                      <span className="color-light">
                                                        {item.senderDetails &&
                                                          removeUnderScore(
                                                            item.senderDetails
                                                              .userProfile
                                                          )}
                                                      </span>
                                                    </span>
                                                    <span className="chat-date fs-12 color-light">
                                                      <span>
                                                        {moment(
                                                          item.date
                                                        ).format('DD/MM/YYYY')}
                                                      </span>

                                                      {/* <span className="ico-reply m-l-10">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#replyIco`} />
                                    </svg>
                                  </span> */}
                                                    </span>
                                                  </div>
                                                  <div className="chat-hero-text">
                                                    {item.comment}
                                                  </div>
                                                </div>
                                              </li>
                                            );
                                          }
                                        )}
                                    </ul>
                                  </InfiniteScroll>
                                  <div className="compose-messang flex align-center b-top border-light">
                                    <FormGroup
                                      controlId="formControlsTextarea"
                                      className="flex-1"
                                    >
                                      <FormControl
                                        componentClass="textarea"
                                        placeholder="Add comment"
                                        name="commentBoxComment"
                                        value={this.state.commentBoxComment}
                                        onChange={this.handleChange}
                                      />
                                    </FormGroup>
                                    <span
                                      className={
                                        this.state.commentBoxComment ===
                                        undefined
                                          ? 'ico-post p-e-none'
                                          : 'ico-post cursor-pointer'
                                      }
                                      onClick={this.submitComment}
                                    >
                                      <svg>
                                        <use xlinkHref={`${Sprite}#postIco`} />
                                      </svg>
                                    </span>
                                  </div>
                                </div>
                              </Tab.Pane>
                              <Tab.Pane eventKey="Third">
                                Tab 3 content
                              </Tab.Pane>
                              <Tab.Pane eventKey="fourth">
                                Tab 4 content
                              </Tab.Pane>
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </div>
                  </Col>
                </Row>

                {/* <div>
                  <Table
                    bordered
                    responsive
                    hover
                    className="custom-table cell-125 gray-row"
                  >
                    <thead>
                      <tr>
                        {this.state.approvedStatus &&
                          this.state.approvedStatus.map(function(data, index) {
                            return <th>Revision {index + 1}</th>;
                          })}
                      </tr>
                      <tr className="h-10"> </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {this.state.approvedStatus &&
                          this.state.approvedStatus.map(function(data) {
                            return (
                              <td>
                                {moment(data.lastUpdatedTimestamp).format(
                                  "DD/MM/YYYY"
                                )}
                              </td>
                            );
                          })}
                      </tr>
                    </tbody>
                  </Table>
                </div> */}

                {/* <div className="gray-card p-20 text-center m-t-20 m-b-20">
                  <span className="cursor-pointer text-uppercase">
                    Quotation Summary&nbsp;
                     <span className="ico-add">
                <svg>
                  <use xlinkHref={`${Sprite}#plus-OIco`} />
                </svg>
              </span> 
                  </span>
                </div> */}
              </div>
            </div>

            <Modal
              show={this.state.show}
              onHide={this.handleClose}
              className="custom-popUp modal-450"
            >
              <Modal.Header>
                <Modal.Title>
                  {' '}
                  <div className="flex justify-space-between">
                    <h4 className="fw-600">Upload Revision</h4>
                    <div className="">
                      <button
                        className="btn btn-default text-uppercase sm-btn"
                        onClick={this.handleCreatePartWithMedia.bind(
                          this,
                          'update'
                        )}
                      >
                        Submit
                      </button>

                      <button
                        onClick={this.handleClose}
                        className="btn btn-link text-uppercase color-light sm-btn"
                      >
                        close
                      </button>
                    </div>
                  </div>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <FormGroup controlId="formBasicText" className="text-center">
                    <ControlLabel>Revision Number</ControlLabel>
                    <FormControl
                      type="number"
                      placeholder="Revision number"
                      className="br-0 w-300 m-auto"
                      name="revisionNumber"
                      pattern="[0-9]"
                      value={this.state.revisionNumber}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </div>

                {this.props.supplierParts.uploadedRevision &&
                this.props.supplierParts.uploadedRevision.length > 0 ? (
                  <div className="">
                    <div className="p-lr-40 m-b-50">
                      <ul className="upload-list">
                        {this.props.supplierParts.uploadedRevision.map(
                          (designItem, index) => {
                            return (
                              <li className="flex justify-space-between align-center">
                                <span>
                                  <img src={Image1} />
                                  {designItem.mediaName}
                                </span>

                                <span
                                  className="ico-delete cursor-pointer"
                                  onClick={self.deleteAttachment.bind(
                                    self,
                                    designItem
                                  )}
                                >
                                  <svg>
                                    <use xlinkHref={`${Sprite}#deleteIco`} />
                                  </svg>
                                </span>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>

                    <hr />
                    {/* <div className="text-center">
                <div className="upload-btn cursor-pointer text-uppercase">
                  <span className="ico-upload">
                    <svg>
                      <use xlinkHref={`${Sprite}#uploadIco`} />
                    </svg>
                  </span>
                  upload files
                  <FormControl
                    id="formControlsFile"
                    type="file"
                    label="File"
                    onChange={this.handleUploadDesign}
                  />
                </div>
              </div> */}
                  </div>
                ) : (
                  <div className="flex align-center justify-center bg-upload text-center">
                    <div className="upload-btn cursor-pointer text-uppercase">
                      <span className="ico-upload">
                        <svg>
                          <use xlinkHref={`${Sprite}#uploadIco`} />
                        </svg>
                      </span>
                      upload files
                      <FormControl
                        type="file"
                        label="File"
                        onChange={this.handleUploadDesign}
                      />
                    </div>
                  </div>
                )}
              </Modal.Body>
              {/* <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer> */}
            </Modal>
            {/* Modal for change part number */}
            <Modal
              show={this.state.showReplace}
              onHide={this.handleShowReplace}
              className="custom-popUp modal-800"
            >
              <Modal.Header>
                <Modal.Title>
                  {' '}
                  <div className="flex justify-space-between">
                    <h4 className="fw-600">Replace Part</h4>
                    <div className="">
                      <button
                        className="btn btn-default text-uppercase sm-btn"
                        onClick={this.handleCreatePartWithMedia.bind(
                          this,
                          'replace'
                        )}
                      >
                        Submit
                      </button>

                      <button
                        onClick={this.handleShowReplace}
                        className="btn btn-link text-uppercase color-light sm-btn"
                      >
                        close
                      </button>
                    </div>
                  </div>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="">
                  <div className="text-center" />
                </div>

                <div className="replace-part">
                  <Row className="show-grid">
                    <Col md={6}>
                      <FormGroup className="group m-t-40">
                        <FormControl
                          type="text"
                          name="userName"
                          value={this.state.partNumber}
                          required
                        />
                        <FormControl.Feedback />

                        <ControlLabel>Old Part</ControlLabel>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="group m-t-40">
                        <FormControl
                          type="text"
                          name="newPartNumber"
                          value={this.state.newPartNumber}
                          onChange={this.handleChange}
                          required
                        />
                        <FormControl.Feedback />

                        <ControlLabel>New Part</ControlLabel>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row className="show-grid">
                    <Col md={6}>
                      <div className="gray-card p-20">
                        <ul className="upload-list">
                          <li className="flex justify-space-between align-center">
                            <span>
                              <img src={Image1} />
                            </span>

                            <span className="ico-delete cursor-pointer">
                              <svg>
                                <use xlinkHref={`${Sprite}#deleteIco`} />
                              </svg>
                            </span>
                          </li>
                        </ul>

                        <hr />
                        <div className="text-center">
                          <div className="upload-btn cursor-pointer text-uppercase fs-12 flex align-center justify-center">
                            <span className="ico-upload">
                              <svg>
                                <use xlinkHref={`${Sprite}#uploadIco`} />
                              </svg>
                            </span>
                            upload files
                            <FormControl
                              id="formControlsFile"
                              type="file"
                              label="File"
                              onChange={this.handleUploadDesign}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="gray-card p-20">
                        <ul className="upload-list">
                          <li className="flex justify-space-between align-center">
                            <span>
                              <img src={Image1} />
                            </span>

                            <span className="ico-delete cursor-pointer">
                              <svg>
                                <use xlinkHref={`${Sprite}#deleteIco`} />
                              </svg>
                            </span>
                          </li>
                        </ul>

                        <hr />
                        <div className="text-center">
                          <div className="upload-btn cursor-pointer text-uppercase fs-12 flex align-center justify-center">
                            <span className="ico-upload">
                              <svg>
                                <use xlinkHref={`${Sprite}#uploadIco`} />
                              </svg>
                            </span>
                            upload files
                            <FormControl
                              id="formControlsFile"
                              type="file"
                              label="File"
                              onChange={this.handleUploadDesign}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Modal.Body>
            </Modal>
            <Footer
              valueToSend={this.state.valueToSendToReleasePO}
              pageTitle={permissionConstant.footer_title.review_po_approval}
            />
          </div>
        ) : null}

        <div>
          <Modal
            show={this.state.showReview}
            onHide={this.handleCloseReview}
            className="custom-popUp modal-xl"
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
                    onClick={this.handleCloseReview}
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
                      {this.state.reviewData &&
                      this.state.reviewData
                        .valueAnalystDetailResponse ? null : (
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
                                    {this.state.reviewData &&
                                      this.state.reviewData.supplierResponse &&
                                      this.state.reviewData.supplierResponse
                                        .companyName}
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
                                        .quotationCreatorDetailResponse.mobile}
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </td>
                      )}
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
                                  {this.props.userInfo &&
                                    this.props.userInfo.userData.companyName}
                                </td>
                              </tr>
                              <tr>
                                <td>Contact:</td>
                                {this.state.reviewData &&
                                this.state.reviewData
                                  .valueAnalystDetailResponse ? (
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
                                        .valueAnalystDetailResponse.LastName}
                                    ,{' '}
                                    {this.state.reviewData &&
                                      this.state.reviewData
                                        .valueAnalystDetailResponse &&
                                      this.state.reviewData
                                        .valueAnalystDetailResponse.mobile}
                                  </td>
                                ) : (
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
                                )}
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
                                  <td>{item.unitCost}</td>
                                  <td>{item.quantity}</td>
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
                              this.state.reviewData.quotationTool &&
                              this.state.reviewData.quotationTool.costTotal}
                          </td>
                          {this.state.reviewData &&
                            this.state.reviewData.quotationTool &&
                            this.state.reviewData.quotationTool.outerToolTax &&
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
                                this.state.reviewData.quotationCost.total}{' '}
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
                                      item.labourCost.map((elem, taxIndex) => {
                                        return [<td>{elem.labourCost}</td>];
                                      })}

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
                            this.state.reviewData.quotationProcess &&
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
                              moment(
                                this.state.reviewData.deliveryLeadTime
                              ).format('YYYY/MM/DD')}
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
                              moment(
                                this.state.reviewData.deliveryTargetDate
                              ).format('YYYY/MM/DD')}
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
            </Modal.Body>
          </Modal>
        </div>

        <div>
          <Modal
            show={this.state.showComments}
            onHide={this.handleCommentsClose}
            className="custom-popUp"
          >
            <Modal.Header>
              <div className="flex justify-space-between">
                <h4>
                  Part No: <b>{this.state.partNumberForComments}</b>
                </h4>
                <div className="">
                  <button
                    onClick={this.handleCommentsClose}
                    className="btn btn-link text-uppercase color-light"
                  >
                    close
                  </button>
                </div>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="chat-wrapper">
                <ul className="chat-list">
                  {this.state.commentResponse &&
                    this.state.commentResponse.map((item, index) => {
                      return (
                        <li className="flex" key={index}>
                          <div className="avatar">
                            <img
                              src={
                                item.senderDetails &&
                                item.senderDetails.profileImageThumbnailUrl
                                  ? item.senderDetails.profileImageThumbnailUrl
                                  : User
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-space-between align-center">
                              <span className="u-name fs-12">
                                <b>
                                  {item.senderDetails &&
                                    item.senderDetails.firstName}{' '}
                                  {item.senderDetails &&
                                    item.senderDetails.lastName}
                                  ,{' '}
                                </b>
                                <span className="color-light">
                                  {item.senderDetails &&
                                    removeUnderScore(
                                      item.senderDetails.userProfile
                                    )}
                                </span>
                              </span>
                              <span className="chat-date fs-12 color-light">
                                <span>
                                  {moment(item.date).format('DD/MM/YYYY')}
                                </span>

                                {/* <span className="ico-reply m-l-10">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#replyIco`} />
                                    </svg>
                                  </span> */}
                              </span>
                            </div>
                            <div className="chat-hero-text">{item.comment}</div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
                <div className="compose-messang flex align-center b-top border-light">
                  <FormGroup
                    controlId="formControlsTextarea"
                    className="flex-1"
                  >
                  <Form.Control  placeholder="Add comment"
                      name="commentBoxComment"
                      value={this.state.commentBoxComment}
                      onChange={this.handleChange}as="textarea" rows="3" />
                   
                  </FormGroup>
                  <span
                    className={
                      this.state.commentBoxComment === undefined
                        ? 'ico-post p-e-none'
                        : 'ico-post cursor-pointer'
                    }
                    onClick={this.submitComment}
                  >
                    <svg>
                      <use xlinkHref={`${Sprite}#postIco`} />
                    </svg>
                  </span>
                </div>
              </div>
            </Modal.Body>
            {/* <Modal.Footer>
                <Button onClick={this.handleCommentsClose}>Close</Button>
              </Modal.Footer> */}
          </Modal>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionUpdatePartWithMedia,
      actionSummaryQuotationList,
      actionLoaderHide,
      actionLoaderShow,
      actionUploadRevisionImage,
      actionDeleteRevisionImage,
      actionTabData,
      actiongetSupplierQuotationData,
      actionGetPPAPDocuments,
      actionSummaryQuotationForPart,
      actionGetPartHistory,
      actionCommentDetail,
      actionSubmitComment,
      actionGetCommentsCount
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
)(ReviewPOApproval);
