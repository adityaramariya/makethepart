import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import * as moment from 'moment';
import noRecord from '../../img/no_record.png';
import _ from 'lodash';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Modal,
  Row,
  Col,
  Table,
  Tooltip,
  DropdownButton
} from 'react-bootstrap';

import Sprite from '../../img/sprite.svg';
import ReactToPrint from 'react-to-print';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  actionLoaderHide,
  actionLoaderShow,
  // actionPendingApprovalPartList,
  actionEditPartDetail,
  approveRejectPart,
  actionUploadImage,
  actionUploadSpecification,
  actionUpdatePart,
  actionDeleteRevisionImage,
  actionDeletePartDatabase,
  actionDeletePartDetail
} from '../../common/core/redux/actions';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import CONSTANTS from '../../common/core/config/appConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SliderModal from '../slider/sliderModal';
import {
  showSuccessToast,
  topPosition,
  convertToTimeStamp,
  removeUnderScore,
  showErrorToast,
  convertToDate
} from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Footer from '../common/footer';
import { handlePermission } from '../../common/permissions';
let { customConstant, permissionConstant, validationMessages } = CONSTANTS;

class PartDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showApproveModal: false,
      showCommentModal: false,
      showResendButton: false,
      showApproveButton: false,
      reviewData: {},
      comment: '',
      currentStatus: '',
      approvalId: '',
      listOfString: [],
      currentIndex: '',
      designList: [],
      status: '',
      showComments: false,
      comments: '',
      partIdForComments: '',
      tabKey: 'partDetail',
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
    // this.handleSpecificationFile = this.handleSpecificationFile.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
    this.editPart = this.editPart.bind(this);
    this.updatePart = this.updatePart.bind(this);
    this.handleOnChangeAddress = this.handleOnChangeAddress.bind(this);
    this.handleOnChangeShipment = this.handleOnChangeShipment.bind(this);
    this.handleUploadDesign = this.handleUploadDesign.bind(this);
    this.handleUploadSpecification = this.handleUploadSpecification.bind(this);
    // this.handleApproverSelectedOption = this.handleApproverSelectedOption.bind(
    //   this
    // );

    this.handleDeletePart = this.handleDeletePart.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);

    this.tooltipApprove = <Tooltip id="tooltip1">Approve</Tooltip>;
    this.tooltipReview = <Tooltip id="tooltip2">Review</Tooltip>;
    this.tooltipResend = <Tooltip id="tooltip3">Resend</Tooltip>;
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
  tabCheck() {
    this.props.tabCheck('first');
  }

  componentDidMount() {
    this.getRFQPartData();
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  getRFQPartData() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id || '',
      roleId: this.props.userInfo.userData.userRole || '',
      pageNumber: this.state.pageCount,
      pageSize: customConstant.paginationPerPageSize
    };

    this.props.actionLoaderShow();
    this.props
      .actionEditPartDetail(data)
      .then((result, error) => {
        let totalRecordCount = Number(result.payload.data.resourceId);
        if (this.state.pageCount === 1) {
          let responseData = result.payload.data.resourceData || [];
          let designList = _this.state.designList || [];
          let specificList = _this.state.specificList || [];
          responseData &&
            responseData.forEach(function(item, index) {
              designList[index] = item.partMediaResponses;

              item &&
                item.specificationResponse.forEach(function(subItem, subIndex) {
                  item.specificationResponse[subIndex].isSelected = true;
                });
              specificList[index] = item.specificationResponse;
            });
          _this.setState({
            responseData: JSON.parse(JSON.stringify(responseData)),
            responseDataTableView: JSON.parse(JSON.stringify(responseData)),
            designList: designList,
            specificList: specificList,
            isPageCount: true,
            totalRecordCount: totalRecordCount,
            recordLength: responseData.length,
            noRecordImage: true
          });
        } else {
          let concatResponseData;
          let newResponseData = result.payload.data.resourceData;
          let oldResponseData = this.state.responseData;
          concatResponseData = oldResponseData.concat(newResponseData);
          let designList = _this.state.designList || [];
          let specificList = _this.state.specificList || [];
          concatResponseData &&
            concatResponseData.forEach(function(item, index) {
              designList[index] = item.partMediaResponses;

              item &&
                item.specificationResponse.forEach(function(subItem, subIndex) {
                  item.specificationResponse[subIndex].isSelected = true;
                });
              specificList[index] = item.specificationResponse;
            });
          _this.setState({
            responseData: JSON.parse(JSON.stringify(concatResponseData)),
            responseDataTableView: JSON.parse(
              JSON.stringify(concatResponseData)
            ),
            designList: designList,
            specificList: specificList,
            totalRecordCount: totalRecordCount,
            recordLength: concatResponseData.length
          });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
    window.removeEventListener('scroll', this.handleScroll);
  }

  getMoreData = () => {
    let _this = this;
    if (this.state.responseData.length >= this.state.totalRecordCount) {
      this.setState({ hasMore: false });
      return;
    }
    if (this.state.isPageCount === true) {
      let PC = this.state.pageCount;
      let pageNumber = PC + 1;
      this.setState({ pageCount: pageNumber });
      this.getRFQPartData();
    }
  };

  handleScroll = () => {
    this.setState({
      pageScrollY: window.scrollY
    });
  };
  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  partDetailReview(data) {
    if (data.currentStatus === 'approved') {
      this.setState({
        currentStatus: 'approve'
      });
    }
    this.setState(
      {
        reviewData: data
      },
      () => {
        this.setState({
          showApproveModal: true
        });
      }
    );
  }

  // approveResendPartDetail(item) {
  //   this.setState({
  //     showCommentModal: false,
  //     comment: ''
  //   });
  //   let _this = this;
  //   let status = '';
  //   let index = this.state.currentIndex;
  //   if (item === 'approve') {
  //     status = 'approved';
  //   } else {
  //     status = 'send_back';
  //   }
  //   let data = {};

  //   if (this.state.approvalId) {
  //     data = {
  //       roleId: this.props.userInfo.userData.userRole,
  //       approverUserId: this.props.userInfo.userData.id,
  //       status: status,
  //       approvalId: this.state.approvalId,
  //       comment: this.state.comment,
  //       listOfString: this.state.pendingApprovalList[index].listOfString
  //     };
  //   } else {
  //     data = {
  //       roleId: this.props.userInfo.userData.userRole,
  //       approverUserId: this.props.userInfo.userData.id,
  //       status: status,
  //       approvalId: this.state.reviewData.id,
  //       comment: this.state.comment,
  //       listOfString: this.state.pendingApprovalList[index].listOfString
  //     };
  //   }
  //   this.props
  //     .approveRejectPart(data)
  //     .then((result, error) => {
  //       _this.props.actionLoaderHide();
  //       let pendingApprovalList = this.state.pendingApprovalList;
  //       if (pendingApprovalList[index].currentStatus === 'approved') {
  //         pendingApprovalList[index].currentStatus = 'approved';
  //       } else {
  //         pendingApprovalList[index].currentStatus = 'send_back';
  //       }
  //       _this.setState({ pendingApprovalList: pendingApprovalList });
  //     })
  //     .catch(e => _this.props.actionLoaderHide());
  // }

  // approveResendPart(data, item, index) {
  //   if (item) {
  //     this.setState({
  //       approvalId: item.id,
  //       currentIndex: index
  //     });
  //     // if (item.currentStatus === 'approved') {
  //     //   showSuccessToast('Already approved.');
  //     //   return;
  //     // }
  //   }
  //   //  else {
  //   //   if (this.state.currentStatus === 'approve') {
  //   //     showSuccessToast('Already approved.');
  //   //     return;
  //   //   }
  //   // }
  //   if (data === 'approve') {
  //     this.setState({
  //       status: 'approved',
  //       showResendButton: false,
  //       showApproveButton: true,
  //       showApproveModal: false,
  //       showCommentModal: true
  //     });
  //   } else {
  //     this.setState({
  //       status: 'send_back',
  //       showResendButton: true,
  //       showApproveButton: false,
  //       showApproveModal: false,
  //       showCommentModal: true
  //     });
  //   }
  // }

  updatePart() {
    let _this = this;
    let flag = true;
    let errorMsg = [];
    let showError = '';

    let listOfSelectedSuppliers = [];
    let listOfSelectedSuppliersIds = [];
    if (this.state.editData && this.state.editData) {
      listOfSelectedSuppliers = _.filter(
        this.state.editData.listOfSuppliers,
        function(userData) {
          return userData.isSelected === true;
        }
      );
      listOfSelectedSuppliersIds = listOfSelectedSuppliers.map(function(
        obj,
        index
      ) {
        return obj.id;
      });
    }

    let listOfPartialShipment = this.state.editData.listOfPartialShipment;
    for (let i = 0; i < listOfPartialShipment.length; i++) {
      if (
        listOfPartialShipment[i] &&
        listOfPartialShipment[i].shipmentTargetDate
      ) {
        listOfPartialShipment[i].shipmentTargetDate = convertToTimeStamp(
          listOfPartialShipment[i].shipmentTargetDate
        );
      }
    }

    if (
      this.props.userInfo.userData.userProfile ===
      permissionConstant.roles.buyer
    ) {
      if (this.state.editData.partDescription === '') {
        errorMsg.push('Please enter part description');
        flag = false;
      } else if (this.state.editData.quantity === '') {
        errorMsg.push('Please enter part quantity');
        flag = false;
      } else if (
        listOfSelectedSuppliersIds &&
        listOfSelectedSuppliersIds.length === 0
      ) {
        errorMsg.push('Please select supplier');
        flag = false;
      } else if (this.state.editData.partDescription === '') {
        errorMsg.push('Please enter part description');
        flag = false;
      } else if (this.state.editData.units === '') {
        errorMsg.push('Please enter part units');
        flag = false;
      } else if (this.state.editData.deliveryAddressResponse.address === '') {
        errorMsg.push('Please enter address');
        flag = false;
      } else if (this.state.editData.deliveryAddressResponse.country === '') {
        errorMsg.push('Please enter country');
        flag = false;
      } else if (this.state.editData.deliveryAddressResponse.state === '') {
        errorMsg.push('Please enter state');
        flag = false;
      } else if (this.state.editData.packagingDeliveryConditions === '') {
        errorMsg.push('Please enter packaging delivery conditions');
        flag = false;
      } else if (this.state.editData.targetDate === '') {
        errorMsg.push('Please enter target date');
        flag = false;
      } else if (this.state.editData.partRevisionNumber === '') {
        errorMsg.push('Please enter part revision number');
        flag = false;
      } else if (this.state.editData.production === '') {
        errorMsg.push('Please enter production');
        flag = false;
      } else if (listOfPartialShipment && listOfPartialShipment.length === 0) {
        errorMsg.push('Please enter at least one partial shipment details');
        flag = false;
      }
      // else if (this.state.editData.remarks === "") {
      //   errorMsg.push("Please enter remarks");
      //   flag = false;
      // }
      else if (this.state.editData.commodity === '') {
        errorMsg.push('Please enter commodity');
        flag = false;
      } else if (this.state.editData.usage === '') {
        errorMsg.push('Please enter usage');
        flag = false;
      } else if (
        this.state.editData.listOfSelectedApproval &&
        this.state.editData.listOfSelectedApproval.length === 0
      ) {
        errorMsg.push('Please select approval');
        flag = false;
      }
    }

    if (flag) {
      let designList = this.state.designList;

      if (designList && designList.length) {
        for (let i = 0; i < designList.length; i++) {
          if (designList[i].mediaURL) {
            designList[i].mediaURL = designList[i].mediaURL.split('/').pop(-1);
          }

          if (designList[i].mediaThumbnailUrl) {
            designList[i].mediaThumbnailUrl = designList[i].mediaThumbnailUrl
              .split('/')
              .pop(-1);
          }
        }
      }

      let specificList = this.state.specificList;

      if (specificList && specificList.length) {
        for (let i = 0; i < specificList.length; i++) {
          if (specificList[i].mediaURL) {
            specificList[i].mediaURL = specificList[i].mediaURL
              .split('/')
              .pop(-1);
          }

          if (specificList[i].mediaThumbnailUrl) {
            specificList[i].mediaThumbnailUrl = specificList[
              i
            ].mediaThumbnailUrl
              .split('/')
              .pop(-1);
          }
        }
      }
      let listOfApprovers = [];
      let listOfApproversIds = [];
      if (this.state.editData && this.state.editData.listOfApprovers) {
        listOfApprovers = _.filter(
          this.state.editData.listOfApprovers,
          function(userData) {
            return userData.isSelected === true;
          }
        );
        listOfApproversIds = listOfApprovers.map(function(obj, index) {
          return obj.id;
        });
      }

      let data = {
        partRequest: {
          buyerUserDetailsId: this.props.userInfo.userData.id || '',
          roleId: this.props.userInfo.userData.userRole || '',
          partId: this.state.editData.id,
          partNumber: this.state.editData.partNumber,
          partDescription: this.state.editData.partDescription,
          quantity: this.state.editData.quantity,
          units: this.state.editData.units,
          deliveryAddressRequest: {
            address:
              this.state.editData.deliveryAddressResponse &&
              this.state.editData.deliveryAddressResponse.address,
            country:
              this.state.editData.deliveryAddressResponse &&
              this.state.editData.deliveryAddressResponse.country,
            state:
              this.state.editData.deliveryAddressResponse &&
              this.state.editData.deliveryAddressResponse.state
          },
          packagingDeliveryConditions: this.state.editData
            .packagingDeliveryConditions,
          targetDate: convertToTimeStamp(this.state.editData.targetDate),
          partRevisionNumber: this.state.editData.partRevisionNumber,
          listOfPartialShipment: listOfPartialShipment,
          projectId: this.state.editData.projectResponse.id,
          production: this.state.editData.production,
          //remarks: this.state.editData.partResponse.remarks,
          commodity: this.state.editData.commodity,
          hsnCode: this.state.editData.hsnCode,
          usage: this.state.editData.usage,
          listOfApprovers: listOfApprovers,
          specificationList: this.state.specificList,
          partMediaList: this.state.designList,
          suppliersToSendQuotations: listOfSelectedSuppliersIds
        }
      };

      this.props
        .actionUpdatePart(data)
        .then((result, error) => {
          let designList = this.state.designList;

          if (designList && designList.length) {
            for (let i = 0; i < designList.length; i++) {
              if (designList[i].mediaURL) {
                designList[i].mediaURL =
                  customConstant.amazonURL + designList[i].mediaURL;
              }

              if (designList[i].mediaThumbnailUrl) {
                designList[i].mediaThumbnailUrl =
                  customConstant.amazonURL + designList[i].mediaThumbnailUrl;
              }
            }
          }
          this.getRFQPartData();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
      this.setState({ showEdit: false });
    } else {
      if (errorMsg) {
        showError = errorMsg.join(',\r\n');
        showErrorToast(showError);
      }
    }
  }

  editPart(item, index) {
    this.setState(
      {
        showEdit: true,
        editData: item,
        rowIndex: index,
        designList: item && item.partMediaResponses,
        specificList: item && item.specificationResponse
      },
      () => {
        let editData = this.state.editData || [];
        let listOfPartialShipment = [];
        // editData.listOfSelectedApproval = item.listOfApprovers;
        for (let i = 0; i < 4; i++) {
          if (editData && !editData.listOfPartialShipment) {
            editData.listOfPartialShipment = [];
          }
          if (!editData.listOfPartialShipment[i]) {
            editData.listOfPartialShipment[i] = {};
            editData.listOfPartialShipment[i].shipmentQty = '';
            editData.listOfPartialShipment[i].shipmentTargetDate = '';
          }
        }
        this.setState({ editData: editData });
      }
    );
  }

  handleOnChangePartDetails(event) {
    const { name, value } = event.target;
    this.setState((prevState, props) => {
      prevState.editData[name] = value;
      return { editData: prevState.editData };
    });
  }

  handleOnChangeAddress(event) {
    const { name, value } = event.target;
    let editData = this.state.editData;
    if (editData && editData.deliveryAddressResponse)
      editData.deliveryAddressResponse[name] = value;
    this.setState({ editData: editData });
  }
  handleOnChangeShipment(event, index) {
    // const { name, value } = event.target;
    // let editData = this.state.editData;
    // editData.listOfPartialShipment[index][name] = value;
    // this.setState({ editData: editData });

    const { name, value } = event.target;
    let editData = this.state.editData;
    if (name === 'shipmentTargetDate') {
      if (index === 0 || index < 3) {
        //dateArray[shipmentIndex + 1].dateDisable = false;
        editData.listOfPartialShipment[index + 1].dateDisable = false;
      } else if (index === 3) {
        //dateArray[shipmentIndex].dateDisable = false;
        editData.listOfPartialShipment[index].dateDisable = false;
      }
      this.setState({ editData: editData });
    }
    this.setState(
      (prevState, props) => {
        if (!prevState.editData['listOfPartialShipment'])
          prevState.editData['listOfPartialShipment'] = [];
        if (prevState.editData['listOfPartialShipment'].length < index + 1) {
          prevState.editData['listOfPartialShipment'].push({
            shipmentQty: '',
            shipmentTargetDate: ''
          });
        }
        if (
          prevState.editData['listOfPartialShipment'] &&
          prevState.editData['listOfPartialShipment'][index]
        )
          prevState.editData['listOfPartialShipment'][index][name] = value;

        return { editData: prevState.editData };
      },
      () => {
        let editData = this.state.editData;
        if (name === 'shipmentTargetDate') {
          for (let i = 0; i < editData.listOfPartialShipment.length; i++) {
            for (
              let j = i + 1;
              j < editData.listOfPartialShipment.length;
              j++
            ) {
              if (
                editData.listOfPartialShipment[i].shipmentTargetDate >
                  editData.listOfPartialShipment[j].shipmentTargetDate &&
                editData.listOfPartialShipment[j].shipmentTargetDate != ''
              ) {
                showErrorToast(validationMessages.part.shipmentError);
                if (
                  editData['listOfPartialShipment'] &&
                  editData['listOfPartialShipment'][index]
                )
                  editData['listOfPartialShipment'][index][name] = '';
                this.setState({ editData: editData });
                return;
              }
            }
          }
        }
      }
    );
  }

  handleUploadDesign(event) {
    let filesLength = event.target.files.length;
    let _this = this;
    let reqArray = [];
    for (let j = 0; j < filesLength; j++) {
      let fileObject = event.target.files[j];
      if (fileObject) {
        const formData = new FormData();
        formData.set('mFile', fileObject);
        formData.append('thumbnailHeight', 100);
        formData.append('thumbnailWidth', 100);
        formData.append('isCreateThumbnail', true);
        formData.append('fileKey', fileObject.name);
        formData.append('filePath', fileObject.name);
        this.props.actionLoaderShow();
        this.props
          .actionUploadImage(formData)
          .then((result, error) => {
            _this.props.actionLoaderHide();

            let designList = _this.state.designList;
            let reportArray = result.payload.data;
            var reqObject = {};

            let mediaExtension = reportArray.filePath.split('.').pop(-1);
            reqObject['mediaName'] = reportArray.filePath;
            reqObject['mediaURL'] =
              customConstant.amazonURL + reportArray.s3FilePath;
            reqObject['mediaSize'] = reportArray.fileSize;
            reqObject['mediaExtension'] = mediaExtension;
            reqObject['mediaType'] = reportArray.contentType;
            reqObject['isNewUpload'] = 1;
            designList.push(reqObject);
            this.setState({ designList: designList });
          })
          .catch(e => {
            _this.props.actionLoaderHide();
          });
      }
    }
  }

  handleUploadSpecification(event) {
    let filesLength = event.target.files.length;
    let _this = this;
    let reqArray = [];
    for (let j = 0; j < filesLength; j++) {
      let fileObject = event.target.files[j];
      if (fileObject) {
        const formData = new FormData();
        formData.set('mFile', fileObject);
        formData.append('thumbnailHeight', 100);
        formData.append('thumbnailWidth', 100);
        formData.append('isCreateThumbnail', true);
        formData.append('fileKey', fileObject.name);
        formData.append('filePath', fileObject.name);
        this.props.actionLoaderShow();
        this.props
          .actionUploadSpecification(formData)
          .then((result, error) => {
            _this.props.actionLoaderHide();
            let specificList = _this.state.specificList;
            let reportArray = result.payload.data;
            var reqObject = {};
            let mediaExtension = reportArray.filePath.split('.').pop(-1);
            reqObject['mediaName'] = reportArray.filePath;
            reqObject['mediaURL'] = reportArray.s3FilePath;
            reqObject['mediaSize'] = reportArray.fileSize;
            reqObject['mediaExtension'] = mediaExtension;
            reqObject['mediaType'] = reportArray.contentType;
            reqObject['isDeleted'] = false;
            reqObject['isNewUpload'] = 1;
            specificList.push(reqObject);
            this.setState({ specificList: specificList });
          })
          .catch(e => {
            _this.props.actionLoaderHide();
          });
      }
    }
    this.setState({
      specificationListArray: reqArray
    });
  }

  deleteDesign(event, index, path) {
    let _this = this;
    let s3FilePath = '';
    this.state.designList.forEach(function(item, index) {
      if (item.mediaName === path) {
        s3FilePath = item.mediaURL.substring(
          item.mediaURL.lastIndexOf('/') + 1,
          item.mediaURL.length
        );
      }
    });

    this.props
      .actionDeleteRevisionImage(s3FilePath)
      .then((result, error) => {
        let designList = _this.state.designList;
        designList.forEach(function(elem, elemIndex) {
          if (elem.mediaName === path) {
            designList.splice(elemIndex, 1);
          }
        });
        _this.setState({
          designList: designList
        });
      })
      .catch(e => _this.props.actionLoaderHide());

    let designList = _this.state.designList;
    designList &&
      designList.forEach(function(elem, i) {
        if (elem.mediaName === s3FilePath) {
          designList.splice(i, 1);
        }
      });
    this.setState({ designList: designList });
  }

  deleteSpecification(event, index, path) {
    let _this = this;
    let s3FilePath = '';

    this.state.specificList.forEach(function(item, index) {
      if (item.mediaName === path) {
        s3FilePath = item.mediaURL.substring(
          item.mediaURL.lastIndexOf('/') + 1,
          item.mediaURL.length
        );
      }
    });

    let specificList = _this.state.specificList;
    specificList &&
      specificList.forEach(function(elem, i) {
        if (elem.mediaName === s3FilePath) {
          specificList.splice(i, 1);
        }
      });
    this.setState({ specificList: specificList });
    this.props
      .actionDeleteRevisionImage(s3FilePath)
      .then((result, error) => {
        let specificList = _this.state.specificList;
        specificList.forEach(function(elem, elemIndex) {
          if (elem.mediaName === path) {
            specificList.splice(elemIndex, 1);
          }
        });
        _this.setState({
          specificList: specificList
        });
      })
      .catch();
  }

  handleApprovalSelectedOption(event, data, subIndex) {
    let editData = this.state.editData;

    const selected = event.target.checked;
    const value = event.target.value;
    if (!editData.listOfSelectedApproval) editData.listOfSelectedApproval = [];
    if (selected) {
      editData.listOfApprovers[subIndex].isSelected = true;
      //editData.listOfSelectedApproval.push(value);
    } else {
      editData.listOfApprovers[subIndex].isSelected = false;
      //editData.listOfSelectedApproval.pop(value);
    }

    this.setState({ editData: editData });
  }

  handleSuppliersSelectedOption(event, data, subIndex) {
    let editData = this.state.editData;
    const selected = event.target.checked;
    const value = event.target.value;
    if (!editData.listOfSelectedSuppliers)
      editData.listOfSelectedSuppliers = [];
    if (selected) {
      editData.listOfSuppliers[subIndex].isSelected = true;
      editData.listOfSelectedSuppliers.push(value);
    } else {
      editData.listOfSuppliers[subIndex].isSelected = false;
      editData.listOfSelectedSuppliers.pop(value);
    }
    this.setState({ editData: editData });
  }

  // handleSpecificationSelectedOption(event, data, subIndex) {
  //   let _this = this;
  //   let editData = this.state.editData;
  //   const selected = event.target.checked;
  //   const value = event.target.value;
  //   let specificList = this.state.specificList;

  //   if (!editData.listOfSelectedSpecificationData)
  //     editData.listOfSelectedSpecificationData = [];
  //   if (selected) {
  //     specificList[subIndex].isSelected = true;
  //     editData.listOfSelectedSpecificationData.push(value);
  //   } else {
  //     specificList[subIndex].isSelected = false;
  //     editData.listOfSelectedSpecificationData.pop(value);
  //   }
  //   this.setState({ editData: editData, specificList: specificList });
  // }

  handleClose() {
    this.setState({ showApproveModal: false });
  }

  // handlePartUpdateData() {
  //   let _this = this;
  //   const userId = this.props.userInfo.userData.id;
  //   const roleId = this.props.userInfo.userData.userRole;
  //   this.props.actionLoaderShow();
  //   this.props
  //     .actionPendingApprovalPartList({ userId, roleId })
  //     .then((result, error) => {
  //       _this.props.actionLoaderHide();
  //       let pendingApprovalList = this.props.supplierParts.pendingApprovalList;
  //       this.setState({
  //         pendingApprovalList: pendingApprovalList
  //       });
  //       if (pendingApprovalList.length > 0) {
  //         for (let i = 0; i < pendingApprovalList.length; i++) {
  //           pendingApprovalList[i].listOfString = [];
  //         }
  //         for (let i = 0; i < pendingApprovalList.length; i++) {
  //           for (
  //             let j = 0;
  //             j < pendingApprovalList[i].listOfApprovers.length;
  //             j++
  //           ) {
  //             if (pendingApprovalList[i].listOfApprovers[j].default) {
  //               pendingApprovalList[i].listOfApprovers[j].checked = true;
  //               let id = pendingApprovalList[i].listOfApprovers[j].id;
  //               pendingApprovalList[i].listOfString.push(id);
  //             }
  //           }
  //         }
  //       }

  //       this.setState({
  //         pendingApprovalList:
  //           pendingApprovalList &&
  //           JSON.parse(JSON.stringify(pendingApprovalList))
  //       });
  //     })
  //     .catch(e => _this.props.actionLoaderHide());
  // }

  handleEditClose() {
    this.setState({ showEdit: false });
    this.setState({
      pendingApprovalList:
        this.props.supplierParts.pendingApprovalList &&
        JSON.parse(JSON.stringify(this.props.supplierParts.pendingApprovalList))
    });
  }

  handleCommentClose() {
    this.setState({ showCommentModal: false });
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
      partNumber: partNumber,
      partMediaResponses: partMediaResponse,
      specificationResponses: specificationResponse
    });
  };

  handleCloseModal() {
    this.setState({ show: !this.state.show });
  }

  // handleSpecificationFile(event, data) {
  //   window.open(data.mediaURL);
  // }

  // handleApproverSelectedOption(event, data, mainindex, subIndex) {
  //   let pendingApprovalList = this.state.pendingApprovalList;

  //   if (event.target.checked) {
  //     let id = pendingApprovalList[mainindex].listOfApprovers[subIndex].id;
  //     pendingApprovalList[mainindex].listOfApprovers[subIndex].checked = true;
  //     pendingApprovalList[mainindex].listOfString &&
  //       pendingApprovalList[mainindex].listOfString.push(id);
  //   } else {
  //     pendingApprovalList[mainindex].listOfApprovers[subIndex].checked = false;
  //   }
  //   this.setState({ pendingApprovalList: pendingApprovalList });
  // }

  deleteUserConfirmation(event, item, index) {
    this.setState({
      showPartDeleteConformationModal: true,
      deleteItem: item,
      deleteIndex: index
    });
  }
  handleDeletePart(event, item, index) {
    let _this = this;

    let data = {
      userId: this.props.userInfo.userData.id || '',
      roleId: this.props.userInfo.userData.userRole || '',
      partId: item.id
    };

    this.props.actionLoaderShow();
    this.props
      .actionDeletePartDetail(data)
      .then((result, error) => {
        if (result.payload.data.status === 400) {
        } else {
          let responseData = _this.state.responseData;

          responseData &&
            responseData.forEach(function(elem, i) {
              if (elem.id === item.id) {
                responseData.splice(i, 1);
              }
            });
          _this.setState({ responseData: responseData });
        }

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
    this.setState({ showPartDeleteConformationModal: false });
  }
  render() {
    let self = this;
    let responseData = this.state.responseData && this.state.responseData;
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === 'sixth' ? 'sixth' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        <div className="content-body flex">
          <div className="content">
            <div className="container-fluid">
              <div className="flex align-center justify-space-between">
                <h4 className="hero-title">Part Detail</h4>
              </div>

              <div className="for-table">
                {this.state.responseData && this.state.responseData.length ? (
                  // <Table bordered responsive className="custom-table">
                  //   <thead>
                  //     <tr>
                  //       <th>Part No.</th>
                  //       <th>Program Code</th>
                  //       <th>Quantity</th>
                  //       <th>Units</th>
                  //       <th>Delivery Address</th>
                  //       <th>Packaging / Delivery Condition</th>
                  //       <th>Target Receipt Date</th>
                  //       {/* <th>Remarks</th> */}
                  //       <th>Part Preview</th>
                  //     </tr>
                  //   </thead>
                  //   <tbody>
                  //     {this.state.editData.map((item, index) => {
                  //       return (
                  //         <tr>
                  //           <td>
                  //             <span
                  //               className={
                  //                 index % 4 === 0
                  //                   ? 'r-caret red'
                  //                   : index % 4 === 1
                  //                     ? 'r-caret green'
                  //                     : index % 4 === 2
                  //                       ? 'r-caret blue'
                  //                       : 'r-caret yellow'
                  //               }
                  //             >
                  //               {' '}
                  //             </span>
                  //             {item.partResponse.partNumber}
                  //           </td>
                  //           <td>{item.partResponse.partDescription}</td>
                  //           <td>{item.partResponse.quantity}</td>
                  //           <td>{item.partResponse.units}</td>
                  //           <td>
                  //             {
                  //               item.partResponse.deliveryAddressResponse
                  //                 .address
                  //             }
                  //           </td>
                  //           <td>
                  //             {item.partResponse.packagingDeliveryConditions}
                  //           </td>
                  //           <td>
                  //             {moment(item.partResponse.targetDate).format(
                  //               'DD/MM/YYYY'
                  //             )}
                  //           </td>
                  //           {/* <td>{item.partResponse.remarks}</td> */}

                  //           <td className="btn-td">
                  //             <div className="">
                  //               <button
                  //                 className="btn btn-task"
                  //                 onClick={() => {
                  //                   const data = item;
                  //                   this.partDetailReview(data);
                  //                 }}
                  //               >
                  //                 <span className="ico-action ">
                  //                   <svg>
                  //                     <use xlinkHref={`${Sprite}#review1Ico`} />
                  //                   </svg>
                  //                 </span>
                  //                 <span className="ico-txt">Review</span>
                  //               </button>

                  //               {this.props.userInfo.userData.isAdmin ||
                  //               this.props.userInfo.userData.userProfile ===
                  //                 'designer' ||
                  //               this.props.userInfo.userData.userProfile ===
                  //                 'designer_approver' ? (
                  //                 <span>
                  //                   <button className="btn btn-task">
                  //                     <span
                  //                       className="ico-action"
                  //                       onClick={() => {
                  //                         this.editPart(item, index);
                  //                       }}
                  //                     >
                  //                       <svg>
                  //                         <use
                  //                           xlinkHref={`${Sprite}#editIco`}
                  //                         />
                  //                       </svg>
                  //                     </span>
                  //                     <span className="ico-txt">Edit</span>
                  //                   </button>

                  //                   <button
                  //                     className="btn btn-task btn btn-task"
                  //                     onClick={event =>
                  //                       this.deleteUserConfirmation(
                  //                         event,
                  //                         item,
                  //                         index
                  //                       )
                  //                     }
                  //                   >
                  //                     <span className="ico-action ">
                  //                       <svg>
                  //                         <use
                  //                           xlinkHref={`${Sprite}#deleteIco`}
                  //                         />
                  //                       </svg>
                  //                     </span>
                  //                     <span className="ico-txt">DELETE</span>
                  //                   </button>
                  //                 </span>
                  //               ) : (
                  //                 ''
                  //               )}
                  //             </div>
                  //           </td>
                  //         </tr>
                  //       );
                  //     })}
                  //   </tbody>
                  // </Table>
                  <InfiniteScroll
                    dataLength={this.state.recordLength}
                    next={this.getMoreData}
                    hasMore={this.state.hasMore}
                    height={300}
                  >
                    <Table bordered responsive className="custom-table">
                      <thead>
                        <tr>
                          <th>Part No.</th>
                          <th>Program Code</th>
                          {/* <th>Specification</th> */}
                          <th>Quantity</th>
                          <th>Units</th>
                          <th>Delivery Address</th>
                          <th>Packaging / Delivery Condition</th>
                          <th>Target Receipt Date</th>
                          <th>Remarks</th>
                          <th>Parts View</th>
                          <th> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.responseData &&
                          this.state.responseData.map((item, index) => {
                            return [
                              <tr key={index}>
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
                                <td>{item.projectResponse.projectCode}</td>

                                <td>{item.quantity}</td>
                                <td>{item.units}</td>
                                <td>
                                  {item.deliveryAddressResponse &&
                                    item.deliveryAddressResponse.address}
                                </td>
                                <td>{item.packagingDeliveryConditions}</td>
                                <td>
                                  {item.targetDate &&
                                    convertToDate(item.targetDate)}
                                </td>
                                <td>{item.remarks}</td>
                                <td className="p-0">
                                  <img
                                    onClick={self.imageShow.bind(
                                      self,
                                      item.id,
                                      item.partMediaResponses,
                                      item.partNumber,
                                      item.specificationResponse
                                    )}
                                    src={item.partMediaThumbnail}
                                    width="45"
                                    className="cursor-pointer"
                                  />
                                </td>

                                <td>
                                  {' '}
                                  {/* {this.props.userInfo.userData.isAdmin ? (
                                  <button
                                    className="btn btn-task btn btn-task"
                                    onClick={event =>
                                      this.handleView(event, index)
                                    }
                                  >
                                    <span className="ico-action ">
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#review1Ico`}
                                        />
                                      </svg>
                                    </span>
                                    <span className="ico-txt">VIEW</span>
                                  </button>
                                ) : null} */}
                                  <div className="w-175">
                                    <button
                                      className="btn btn-task"
                                      onClick={() => {
                                        const data = item;
                                        this.partDetailReview(data);
                                      }}
                                    >
                                      <span className="ico-action ">
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#review1Ico`}
                                          />
                                        </svg>
                                      </span>
                                      <span className="ico-txt">Review</span>
                                    </button>
                                    {this.props.userInfo.userData.isAdmin ||
                                    this.props.userInfo.userData.userProfile ===
                                      permissionConstant.roles.buyer ? null : (
                                      <div className="d-inline">
                                        <button
                                          className="btn btn-task btn btn-task"
                                          // onClick={event =>
                                          //   this.handleShow(event, index)
                                          // }
                                          onClick={() => {
                                            this.editPart(item, index);
                                          }}
                                        >
                                          <span className="ico-action ">
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#editIco`}
                                              />
                                            </svg>
                                          </span>
                                          <span className="ico-txt">EDIT</span>
                                        </button>
                                        <button
                                          className="btn btn-task btn btn-task"
                                          // onClick={event =>
                                          //   this.handleDeletePart(
                                          //     event,
                                          //     item,
                                          //     index
                                          //   )
                                          // }
                                          onClick={event =>
                                            this.deleteUserConfirmation(
                                              event,
                                              item,
                                              index
                                            )
                                          }
                                        >
                                          <span className="ico-action ">
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#deleteIco`}
                                              />
                                            </svg>
                                          </span>
                                          <span className="ico-txt">
                                            DELETE
                                          </span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>,
                              <tr />
                            ];
                          })}
                      </tbody>
                    </Table>
                  </InfiniteScroll>
                ) : this.state.noRecordImage &&
                  this.state.responseData.length == 0 ? (
                  <div className="noRecord">
                    <img src={noRecord} />
                  </div>
                ) : (
                  ''
                )}

                <div>
                  <Modal
                    show={this.state.showApproveModal}
                    onHide={this.handleClose}
                    className="custom-popUp"
                  >
                    <Modal.Header>
                      <div className="flex justify-space-between">
                        <h4>
                          Part No.:{' '}
                          <b>
                            {this.state.reviewData
                              ? this.state.reviewData.partNumber
                              : ''}
                          </b>
                        </h4>
                        <div className="">
                          <span className="print-btn">
                            <ReactToPrint
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
                          </span>
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
                      <div className="flex justify-space-between">
                        <h4>
                          Part No.:{' '}
                          <b>
                            {this.state.reviewData
                              ? this.state.reviewData.partNumber
                              : ''}
                          </b>
                        </h4>
                      </div>
                      <div
                        className="text-right"
                        ref={el => (this.componentRef = el)}
                      >
                        <div className="p-lr-40">
                          <div className="printableTable">
                            <Table className="no-border-table">
                              <tbody>
                                <tr>
                                  <td className="color-light">Buyer:</td>
                                  <td>
                                    {this.props.userInfo.userData.fullname}
                                    {/* ,{' '}
                                    {this.state.reviewData.partResponse &&
                                      this.state.reviewData.partResponse
                                        .buyerResponse.addresses[0].address}  */}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">Project:</td>
                                  <td>
                                    {this.state.reviewData &&
                                      this.state.reviewData.projectResponse &&
                                      this.state.reviewData.projectResponse
                                        .projectTitle}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">Project Code:</td>
                                  <td>
                                    {this.state.reviewData &&
                                      this.state.reviewData.projectResponse &&
                                      this.state.reviewData.projectResponse
                                        .projectCode}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">Part Number:</td>
                                  <td>
                                    {this.state.reviewData
                                      ? this.state.reviewData.partNumber
                                      : ''}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">
                                    Part Description:
                                  </td>
                                  <td>
                                    {this.state.reviewData
                                      ? this.state.reviewData.partDescription
                                      : ''}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">
                                    Delivery Location:
                                  </td>
                                  <td>
                                    {this.state.reviewData &&
                                      this.state.reviewData
                                        .deliveryAddressResponse &&
                                      this.state.reviewData
                                        .deliveryAddressResponse.address}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">
                                    Delivery Country:
                                  </td>
                                  <td>
                                    {this.state.reviewData &&
                                      this.state.reviewData
                                        .deliveryAddressResponse &&
                                      this.state.reviewData
                                        .deliveryAddressResponse.country}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">Usage:</td>
                                  <td>
                                    {this.state.reviewData
                                      ? this.state.reviewData.usage
                                      : ''}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">Quantity:</td>
                                  <td>
                                    {this.state.reviewData
                                      ? this.state.reviewData.quantity
                                      : ''}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">Units:</td>
                                  <td>
                                    {this.state.reviewData
                                      ? this.state.reviewData.units
                                      : ''}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">Production:</td>
                                  <td>
                                    {this.state.reviewData
                                      ? this.state.reviewData.production
                                      : ''}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">Commodity:</td>
                                  <td>
                                    {this.state.reviewData
                                      ? this.state.reviewData.commodity
                                      : ''}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">HSN Code:</td>
                                  <td>
                                    {this.state.reviewData
                                      ? this.state.reviewData.hsnCode
                                      : ''}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">
                                    Packaging / Delivery Condition:
                                  </td>
                                  <td>
                                    {this.state.reviewData
                                      ? this.state.reviewData
                                          .packagingDeliveryConditions
                                      : ''}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">Target Date:</td>
                                  <td>
                                    {this.state.reviewData
                                      ? moment(
                                          this.state.reviewData.targetDate
                                        ).format('DD/MM/YYYY')
                                      : ''}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="color-light">
                                    Supplier Star Rating:
                                  </td>
                                  <td>5</td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </div>
                        <div>
                          <div className="" style={{ padding: '0 10px' }}>
                            <div class="flex justify-space-between">
                              <h5 class="printHeading"> Partial Shipment</h5>
                            </div>
                            <Table
                              responsive
                              className="table-bordered custom-table col-border"
                            >
                              <thead>
                                <tr>
                                  <th>Shipment Qty</th>
                                  <th>Shipment Target Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.reviewData &&
                                this.state.reviewData.listOfPartialShipment
                                  ? this.state.reviewData.listOfPartialShipment.map(
                                      (item, index) => {
                                        return [
                                          <tr>
                                            <td>{item.shipmentQty}</td>
                                            <td>
                                              {' '}
                                              {item.shipmentTargetDate
                                                ? moment(
                                                    item.shipmentTargetDate
                                                  ).format('DD/MM/YYYY')
                                                : ''}
                                            </td>
                                          </tr>
                                        ];
                                      }
                                    )
                                  : ''}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
                <div>
                  {/* <Modal
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
                        <ControlLabel>Comment</ControlLabel>
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
                  </Modal> */}
                  <Modal
                    show={this.state.showEdit}
                    onHide={this.handleEditClose}
                    className="custom-popUp modal-xl"
                  >
                    <Modal.Body>
                      <div className="flex justify-space-between">
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
                                {this.state.designList &&
                                  this.state.designList.map(
                                    (designItem, index) => {
                                      return (
                                        <li className="flex justify-space-between align-center">
                                          <span>
                                            <img
                                              src={designItem.mediaURL}
                                              alt=""
                                            />
                                            {designItem.mediaName}
                                          </span>
                                          {designItem.isNewUpload ? (
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
                                          ) : (
                                            ''
                                          )}
                                        </li>
                                      );
                                    }
                                  )}
                              </ul>
                              {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.designer ||
                              this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.designer_approver ? (
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
                                    disabled={
                                      this.state.selectedProjectId === ''
                                    }
                                    // help="Example block-level help text here."
                                  />
                                </div>
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                          {/* <div className="text-center m-t-20">
                            <button
                              className="btn btn-success text-uppercase sm-btn"
                              onClick={() => {
                                this.addPartConfirmation('designs');
                              }}
                              disabled={this.state.selectedProjectId === ''}
                            >
                              add Designs
                            </button>
                          </div> */}
                        </Col>
                        <Col md={6}>
                          {/* <h4 className="hero-title">Upload Specifications</h4> */}
                          <div className="gray-card up-padd dash-border">
                            <ul className="upload-list b-btm">
                              {this.state.specificList &&
                                this.state.specificList.map(
                                  (designItem, index) => {
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
                                        {designItem.isNewUpload ? (
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
                                        ) : (
                                          ''
                                        )}
                                      </li>
                                    );
                                  }
                                )}
                            </ul>
                            {this.props.userInfo.userData.userProfile ===
                              permissionConstant.roles.designer ||
                            this.props.userInfo.userData.userProfile ===
                              permissionConstant.roles.designer_approver ? (
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
                                  />
                                </div>
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                          {/* <div className="text-center m-t-20 m-b-20">
                            <button
                              className="btn btn-success text-uppercase sm-btn"
                              onClick={() => {
                                this.addPartConfirmation('specification');
                              }}
                              disabled={this.state.selectedDesigns === ''}
                            >
                              add specification
                            </button>
                          </div> */}
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
                                value={
                                  this.state.editData &&
                                  this.state.editData.partDescription
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>
                                Part Description
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
                            </FormGroup>
                          </Col>
                          {/* <Col md={3}>
                            <div className="custom-dd dropRf dropdown-style">
                              <DropdownButton
                                id="selectSpecification"
                                title=" Select Specification"
                                name="secpeificationData"
                                // value={this.state.editData.specificationResponse}
                                className="w-125"
                              >
                                {this.state.specificList &&
                                  this.state.specificList.map((item, i) => {
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
                                              i
                                            );
                                          }}
                                        />
                                        <label>{item.mediaName}</label>
                                      </li>
                                    );
                                  })}
                              </DropdownButton>
                            </div>
                          </Col>*/}
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="partRevisionNumber"
                                required
                                onChange={event => {
                                  this.handleOnChangePartDetails(event);
                                }}
                                value={
                                  this.state.editData &&
                                  this.state.editData.partRevisionNumber
                                }
                              />
                              <FormControl.Feedback />
                              <ControlLabel>
                                Part Revision Number
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <div className="custom-dd dropRf dropdown-style">
                              <DropdownButton
                                id="selectApprover"
                                title="Select Approver"
                                name="secpeificationData"
                                // value={this.state.editData.listOfSuppliers}
                                className="w-125"
                              >
                                {this.state.editData &&
                                  this.state.editData.listOfApprovers &&
                                  this.state.editData.listOfApprovers.map(
                                    (item, i) => {
                                      let selected = '';
                                      if (item.default) {
                                        selected = 'selected';
                                      } else if (item.isSelected) {
                                        selected = 'selected';
                                      }
                                      return (
                                        <li>
                                          <input
                                            type="checkbox"
                                            name="suppliers"
                                            value={item.id}
                                            disabled={
                                              item.default ? true : false
                                            }
                                            checked={selected ? true : false}
                                            onClick={this.dontClose}
                                            onChange={event => {
                                              this.handleApprovalSelectedOption(
                                                event,
                                                item,
                                                i
                                              );
                                            }}
                                          />
                                          <label>
                                            {item.firstName +
                                              ' ' +
                                              item.lastName}
                                          </label>
                                        </li>
                                      );
                                    }
                                  )}
                              </DropdownButton>
                            </div>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="hsnCode"
                                required
                                onChange={event => {
                                  this.handleOnChangePartDetails(event);
                                }}
                                value={
                                  this.state.editData &&
                                  this.state.editData.hsnCode
                                }
                              />
                              <FormControl.Feedback />
                              <ControlLabel>
                                HSN Code
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="show-grid">
                          {this.props.userInfo.userData.userProfile ===
                          permissionConstant.roles.buyer ? (
                            <Col md={3}>
                              <div className="custom-dd dropRf dropdown-style">
                                <DropdownButton
                                  id="selectSupplier"
                                  title="Select Supplier"
                                  name="secpeificationData"
                                  className="w-125"
                                >
                                  {this.state.editData &&
                                    this.state.editData.listOfSuppliers &&
                                    this.state.editData.listOfSuppliers.map(
                                      (item, i) => {
                                        return (
                                          <li>
                                            <input
                                              type="checkbox"
                                              name="suppliers"
                                              value={item.id}
                                              checked={
                                                item.isSelected ? true : false
                                              }
                                              onClick={this.dontClose}
                                              onChange={event => {
                                                this.handleSuppliersSelectedOption(
                                                  event,
                                                  item,
                                                  i
                                                );
                                              }}
                                            />
                                            <label>{item.companyName}</label>
                                          </li>
                                        );
                                      }
                                    )}
                                </DropdownButton>
                              </div>
                            </Col>
                          ) : null}
                          <Col md={3}>
                            <FormGroup className="group ">
                              <FormControl
                                type="text"
                                name="quantity"
                                onChange={event => {
                                  this.handleOnChangePartDetails(event);
                                }}
                                required
                                value={
                                  this.state.editData &&
                                  this.state.editData.quantity
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>
                                Quantity
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
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
                                value={
                                  this.state.editData &&
                                  this.state.editData.units
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>
                                Units
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
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
                                value={
                                  this.state.editData &&
                                  this.state.editData.usage
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>
                                Usage
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
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
                                value={
                                  this.state.editData &&
                                  this.state.editData.commodity
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>
                                Commodity
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group">
                              <FormControl
                                type="text"
                                name="address"
                                required
                                onChange={event => {
                                  this.handleOnChangeAddress(event);
                                }}
                                value={
                                  this.state.editData &&
                                  this.state.editData.deliveryAddressResponse &&
                                  this.state.editData.deliveryAddressResponse
                                    .address
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>
                                Delivery Address
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
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
                                  this.state.editData &&
                                  this.state.editData.deliveryAddressResponse &&
                                  this.state.editData.deliveryAddressResponse
                                    .state
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>
                                Delivery State
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
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
                                  this.state.editData &&
                                  this.state.editData.deliveryAddressResponse &&
                                  this.state.editData.deliveryAddressResponse
                                    .country
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>
                                Delivery Country
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
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
                                  this.state.editData &&
                                  this.state.editData
                                    .packagingDeliveryConditions
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>
                                Packaging/Delivery Condition
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group d-p-label">
                              <ControlLabel>
                                Target Date{' '}
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>

                              <DatePicker
                                selected={
                                  this.state.editData &&
                                  this.state.editData.targetDate
                                    ? this.state.editData.targetDate
                                    : ''
                                }
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
                                placeholderText="DD/MM/YYYY"
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                              />

                              {/* <Datetime
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
                                value={
                                  this.state.editData &&
                                  this.state.editData.targetDate
                                }
                              /> */}
                              <FormControl.Feedback />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup
                              className="m-b-0 group"
                              controlId="formControlsSelect"
                            >
                              <FormControl
                                className="br-0 s-arrow"
                                componentClass="select"
                                placeholder="select"
                                name="production"
                                value={
                                  this.state.editData &&
                                  this.state.editData.production
                                }
                                onChange={event => {
                                  this.handleOnChangePartDetails(event);
                                }}
                              >
                                <option value="">Select</option>
                                <option value="proto">Proto</option>
                                <option value="production">Production</option>
                              </FormControl>
                              <FormControl.Feedback />
                              <ControlLabel>
                                Proto/Production{' '}
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
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
                                  this.state.editData &&
                                  this.state.editData.listOfPartialShipment &&
                                  this.state.editData
                                    .listOfPartialShipment[0] &&
                                  this.state.editData.listOfPartialShipment[0]
                                    .shipmentQty
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>
                                Shipment 1 Qty{' '}
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group d-p-label">
                              <ControlLabel>
                                Shipment 1 Target Date{' '}
                                {this.props.userInfo.userData.userProfile ===
                                permissionConstant.roles.buyer ? (
                                  <em>*</em>
                                ) : (
                                  ''
                                )}
                              </ControlLabel>

                              <DatePicker
                                selected={
                                  this.state.editData &&
                                  this.state.editData.listOfPartialShipment &&
                                  this.state.editData
                                    .listOfPartialShipment[0] &&
                                  this.state.editData.listOfPartialShipment[0]
                                    .shipmentTargetDate
                                }
                                onChange={event => {
                                  const value = event;
                                  this.handleOnChangeShipment(
                                    {
                                      target: {
                                        name: 'shipmentTargetDate',
                                        value
                                      }
                                    },
                                    0
                                  );
                                }}
                                placeholderText="DD/MM/YYYY"
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                              />

                              {/* <Datetime
                                className="db-0 "
                                closeOnSelect="true"
                                timeFormat={false}
                                dateFormat="YYYY-MM-DD"
                                min={moment().format('YYYY-MM-DD')}
                                inputProps={{ readOnly: true }}
                                onChange={event => {
                                  const value = event;
                                  this.handleOnChangeShipment(
                                    {
                                      target: {
                                        name: 'shipmentTargetDate',
                                        value
                                      }
                                    },
                                    0
                                  );
                                }}
                                value={
                                  this.state.editData &&
                                  this.state.editData.listOfPartialShipment &&
                                  this.state.editData
                                    .listOfPartialShipment[0] &&
                                  this.state.editData.listOfPartialShipment[0]
                                    .shipmentTargetDate
                                }
                              /> */}
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
                                  this.state.editData &&
                                  this.state.editData.listOfPartialShipment &&
                                  this.state.editData
                                    .listOfPartialShipment[1] &&
                                  this.state.editData.listOfPartialShipment[1]
                                    .shipmentQty
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Shipment 2 Qty</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group d-p-label">
                              <ControlLabel>
                                Shipment 2 Target Date
                              </ControlLabel>

                              <DatePicker
                                selected={
                                  this.state.editData &&
                                  this.state.editData.listOfPartialShipment &&
                                  this.state.editData
                                    .listOfPartialShipment[1] &&
                                  this.state.editData.listOfPartialShipment[1]
                                    .shipmentTargetDate
                                }
                                onChange={event => {
                                  const value = event;
                                  this.handleOnChangeShipment(
                                    {
                                      target: {
                                        name: 'shipmentTargetDate',
                                        value
                                      }
                                    },
                                    1
                                  );
                                }}
                                placeholderText="DD/MM/YYYY"
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                              />

                              {/* <Datetime
                                className="db-0"
                                closeOnSelect="true"
                                timeFormat={false}
                                dateFormat="YYYY-MM-DD"
                                min={moment().format('YYYY-MM-DD')}
                                inputProps={{ readOnly: true }}
                                onChange={event => {
                                  const value = event;
                                  this.handleOnChangeShipment(
                                    {
                                      target: {
                                        name: 'shipmentTargetDate',
                                        value
                                      }
                                    },
                                    1
                                  );
                                }}
                                value={
                                  this.state.editData &&
                                  this.state.editData.listOfPartialShipment &&
                                  this.state.editData
                                    .listOfPartialShipment[1] &&
                                  this.state.editData.listOfPartialShipment[1]
                                    .shipmentTargetDate
                                }
                              /> */}
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
                                  this.state.editData &&
                                  this.state.editData.listOfPartialShipment &&
                                  this.state.editData
                                    .listOfPartialShipment[2] &&
                                  this.state.editData.listOfPartialShipment[2]
                                    .shipmentQty
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Shipment 3 Qty</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group d-p-label">
                              <ControlLabel>
                                Shipment 3 Target Date
                              </ControlLabel>

                              <DatePicker
                                selected={
                                  this.state.editData &&
                                  this.state.editData.listOfPartialShipment &&
                                  this.state.editData
                                    .listOfPartialShipment[2] &&
                                  this.state.editData.listOfPartialShipment[2]
                                    .shipmentTargetDate
                                }
                                onChange={event => {
                                  const value = event;
                                  this.handleOnChangeShipment(
                                    {
                                      target: {
                                        name: 'shipmentTargetDate',
                                        value
                                      }
                                    },
                                    2
                                  );
                                }}
                                placeholderText="DD/MM/YYYY"
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                              />

                              {/* <Datetime
                                className="db-0"
                                closeOnSelect="true"
                                timeFormat={false}
                                dateFormat="YYYY-MM-DD"
                                min={moment().format('YYYY-MM-DD')}
                                inputProps={{ readOnly: true }}
                                onChange={event => {
                                  const value = event;
                                  this.handleOnChangeShipment(
                                    {
                                      target: {
                                        name: 'shipmentTargetDate',
                                        value
                                      }
                                    },
                                    2
                                  );
                                }}
                                value={
                                  this.state.editData &&
                                  this.state.editData.listOfPartialShipment &&
                                  this.state.editData
                                    .listOfPartialShipment[2] &&
                                  this.state.editData.listOfPartialShipment[2]
                                    .shipmentTargetDate
                                }
                              /> */}
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
                                  this.state.editData &&
                                  this.state.editData.listOfPartialShipment &&
                                  this.state.editData
                                    .listOfPartialShipment[3] &&
                                  this.state.editData.listOfPartialShipment[3]
                                    .shipmentQty
                                }
                              />
                              <FormControl.Feedback />

                              <ControlLabel>Shipment 4 Qty</ControlLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="group d-p-label">
                              <ControlLabel>
                                Shipment 4 Target Date
                              </ControlLabel>

                              <DatePicker
                                selected={
                                  this.state.editData &&
                                  this.state.editData.listOfPartialShipment &&
                                  this.state.editData
                                    .listOfPartialShipment[3] &&
                                  this.state.editData.listOfPartialShipment[3]
                                    .shipmentTargetDate
                                }
                                onChange={event => {
                                  const value = event;
                                  this.handleOnChangeShipment(
                                    {
                                      target: {
                                        name: 'shipmentTargetDate',
                                        value
                                      }
                                    },
                                    3
                                  );
                                }}
                                placeholderText="DD/MM/YYYY"
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                              />

                              {/* <Datetime
                                className="db-0"
                                closeOnSelect="true"
                                timeFormat={false}
                                dateFormat="YYYY-MM-DD"
                                min={moment().format('YYYY-MM-DD')}
                                inputProps={{ readOnly: true }}
                                onChange={event => {
                                  const value = event;
                                  this.handleOnChangeShipment(
                                    {
                                      target: {
                                        name: 'shipmentTargetDate',
                                        value
                                      }
                                    },
                                    3
                                  );
                                }}
                                value={
                                  this.state.editData &&
                                  this.state.editData.listOfPartialShipment &&
                                  this.state.editData
                                    .listOfPartialShipment[3] &&
                                  this.state.editData.listOfPartialShipment[3]
                                    .shipmentTargetDate
                                }
                              /> */}
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
                          onClick={this.handleEditClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
          {/* <Footer /> */}
          <Footer pageTitle={permissionConstant.footer_title.part_detail} />
        </div>
        <Modal
          show={this.state.showPartDeleteConformationModal}
          onHide={this.handleClose}
          className="custom-popUp confirmation-box"
          bsSize="small"
        >
          <Modal.Body>
            <div className="">
              <h5 className="text-center">
                Are you sure you want to delete this part?
              </h5>
              <div className="text-center">
                <button
                  className="btn btn-default text-uppercase sm-btn"
                  onClick={event =>
                    this.handleDeletePart(
                      event,
                      this.state.deleteItem,
                      this.state.deleteIndex
                    )
                  }
                >
                  Continue
                </button>
                <button
                  className="btn btn-success text-uppercase sm-btn"
                  onClick={this.handleCloseModel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {this.state.show ? (
          <SliderModal
            show={this.state.show}
            partId={this.state.partIdforMedia}
            partNumber={this.state.partNumber}
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
      // actionPendingApprovalPartList,
      actionEditPartDetail,
      approveRejectPart,
      actionUploadImage,
      actionUploadSpecification,
      actionUpdatePart,
      actionDeleteRevisionImage,
      actionDeletePartDatabase,
      actionDeletePartDetail
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
)(PartDetail);
