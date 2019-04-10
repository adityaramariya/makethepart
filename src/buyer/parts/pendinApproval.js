import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import * as Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import ReactToPrint from 'react-to-print';
import _ from 'lodash';
import * as moment from 'moment';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import noRecord from '../../img/no_record.png';
import socketIOClient from 'socket.io-client';
import InfiniteScroll from 'react-infinite-scroll-component';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Modal,
  Form,
  Row,
  Col,
  Table,
  Tooltip,
  DropdownButton,
  Glyphicon,
  OverlayTrigger
} from 'react-bootstrap';

import Sprite from '../../img/sprite.svg';

import {
  actionLoaderHide,
  actionLoaderShow,
  actionPendingApprovalPartList,
  approveRejectPart,
  actionUploadImage,
  actionUploadSpecification,
  actionUpdatePart,
  actionDeleteRevisionImage,
  actionDeletePartDatabase,
  actionCommentDetail,
  actionSubmitComment
} from '../../common/core/redux/actions';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import Image1 from '../../img/image.png';
//import User from '../../img/user.jpg';
import User from '../../img/profile.svg';
import CONSTANTS from '../../common/core/config/appConfig';

import SliderModal from '../slider/sliderModal';
import {
  topPosition,
  removeUnderScore,
  convertToTimeStamp,
  showErrorToast
} from '../../common/commonFunctions';
import Footer from '../common/footer';
import { handlePermission } from '../../common/permissions';
import validationMessages from '../../common/core/constants/validationMessages';

let { customConstant, permissionConstant } = CONSTANTS;
let socket;
let pageSize = 10;
let commentPageSize = 15;
class RFQApproval extends Component {
  constructor(props) {
    super(props);
    socket = socketIOClient.connect(
      customConstant.webNotificationURL.node_server_URL
    );
    this.state = {
      tabKey: 'third',
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
      showQuotationAnalysisModal: false,
      activeAssignerId: {},
      approverName: '',
      hasMore: true,
      pageCount: 1,
      isPageCount: false,
      pendingApprovalList: [],
      noRecordImage: false,
      pageCountComment: 1,
      isPageCountComment: false,
      hasMoreComment: true
    };

    this.partDetailReview = this.partDetailReview.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCommentClose = this.handleCommentClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.tabCheck = this.tabCheck.bind(this);
    this.handleSpecificationFile = this.handleSpecificationFile.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
    this.editPart = this.editPart.bind(this);
    this.updatePart = this.updatePart.bind(this);
    this.handleOnChangeAddress = this.handleOnChangeAddress.bind(this);
    this.handleOnChangeShipment = this.handleOnChangeShipment.bind(this);
    this.handleApproverChange = this.handleApproverChange.bind(this);
    this.handleUploadDesign = this.handleUploadDesign.bind(this);
    this.handleUploadSpecification = this.handleUploadSpecification.bind(this);
    this.handleApproverSelectedOption = this.handleApproverSelectedOption.bind(
      this
    );
    this.handleCommentsShow = this.handleCommentsShow.bind(this);
    this.handleCommentsClose = this.handleCommentsClose.bind(this);
    this.handleCommentsClose = this.handleCommentsClose.bind(this);
    this.handleListOfTeamSelectedOption = this.handleListOfTeamSelectedOption.bind(
      this
    );
    this.approveResendPartDetail = this.approveResendPartDetail.bind(this);

    this.quotationAnalysisModal = this.quotationAnalysisModal.bind(this);
    this.handleQuotationAnalysisClose = this.handleQuotationAnalysisClose.bind(
      this
    );
    this.submitComment = this.submitComment.bind(this);
    this.getRFQDataAfterUpdateProcess = this.getRFQDataAfterUpdateProcess.bind(
      this
    );
    this.tooltipApprove = <Tooltip id="tooltip1">Approve</Tooltip>;
    this.tooltipReview = <Tooltip id="tooltip2">Review</Tooltip>;
    this.tooltipResend = <Tooltip id="tooltip3">Resend</Tooltip>;
  }
  tabCheck() {
    this.props.tabCheck('first');
  }

  getRFQData() {
    let _this = this;
    const userId = this.props.userInfo.userData.id;
    const roleId = this.props.userInfo.userData.userRole;
    this.props.actionLoaderShow();
    let data = {
      userId: userId,
      roleId: roleId,
      pageNumber: this.state.pageCount,
      pageSize: pageSize
    };
    this.props
      .actionPendingApprovalPartList(data)
      .then((result, error) => {
        let totalRecordCount =
          result.payload.data.resourceData.totalRecordCount;
        let pendingApprovalList = this.props.supplierParts.pendingApprovalList;
        if (this.state.pageCount === 1) {
          //   this.setState({
          //     pendingApprovalList: pendingApprovalList, totalCount: totalRecordCount, isPageCount: true,
          //     recordLength: pendingApprovalList.length,
          //     noRecordImage: true
          //   });
          // }

          if (pendingApprovalList.length > 0) {
            for (let i = 0; i < pendingApprovalList.length; i++) {
              pendingApprovalList[i].listOfString = [];
              // pendingApprovalList[i].listOfTeam = this.state.listOfTeam;
            }
            for (let i = 0; i < pendingApprovalList.length; i++) {
              if (
                pendingApprovalList[i].listOfApprovers &&
                pendingApprovalList[i].listOfApprovers.length
              )
                for (
                  let j = 0;
                  j < pendingApprovalList[i].listOfApprovers.length;
                  j++
                ) {
                  if (pendingApprovalList[i].listOfApprovers[j].default) {
                    pendingApprovalList[i].listOfApprovers[j].checked = true;
                    let id = pendingApprovalList[i].listOfApprovers[j].id;
                    pendingApprovalList[i].listOfString.push(id);
                  }
                }
            }
          }

          this.setState({
            pendingApprovalList:
              pendingApprovalList &&
              JSON.parse(JSON.stringify(pendingApprovalList)),
            totalCount: totalRecordCount,
            isPageCount: true,
            recordLength: pendingApprovalList.length,
            noRecordImage: true
          });
          _this.props.actionLoaderHide();
        }
      })
      .catch(e => _this.props.actionLoaderHide());
    window.removeEventListener('scroll', this.handleScroll);
  }

  fetchMoreData = () => {
    let _this = this;
    if (this.state.pendingApprovalList.length >= this.state.totalCount) {
      this.setState({ hasMore: false });
      return;
    }

    if (this.state.isPageCount === true) {
      let PC = this.state.pageCount;
      let pageNumber = PC + 1;
      let concatData;
      this.setState({ pageCount: pageNumber });

      this.props.actionLoaderShow();
      let data = {
        userId: this.props.userInfo.userData.id || '',
        roleId: this.props.userInfo.userData.userRole || '',
        pageNumber: this.state.pageCount,
        pageSize: pageSize
      };
      this.props
        .actionPendingApprovalPartList(data)
        .then((result, error) => {
          let totalRecordCount =
            result.payload.data.resourceData.totalRecordCount;
          let pendingApprovalList = this.props.supplierParts
            .pendingApprovalList;
          let oldpendingApprovalList = this.state.pendingApprovalList;
          if (this.state.pageCount > 1) {
            concatData = oldpendingApprovalList.concat(pendingApprovalList);

            if (concatData.length > 0) {
              for (let i = 0; i < concatData.length; i++) {
                concatData[i].listOfString = [];
                // concatData[i].listOfTeam = this.state.listOfTeam;
              }
              for (let i = 0; i < concatData.length; i++) {
                if (
                  concatData[i].listOfApprovers &&
                  concatData[i].listOfApprovers.length
                )
                  for (
                    let j = 0;
                    j < concatData[i].listOfApprovers.length;
                    j++
                  ) {
                    if (concatData[i].listOfApprovers[j].default) {
                      concatData[i].listOfApprovers[j].checked = true;
                      let id = concatData[i].listOfApprovers[j].id;
                      concatData[i].listOfString.push(id);
                    }
                  }
              }
            }

            this.setState({
              pendingApprovalList:
                concatData && JSON.parse(JSON.stringify(concatData)),
              totalCount: totalRecordCount,
              recordLength: concatData.length
            });
          }
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
      window.removeEventListener('scroll', this.handleScroll);
    }
  };
  componentDidMount() {
    this.getRFQData();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleApproverChange(event, index) {
    const { name, value } = event.target;
    let pendingApprovalList = this.state.pendingApprovalList;
    pendingApprovalList[index][name] = value;
    const activeAssignerId = { ...this.state.activeAssignerId };
    activeAssignerId[pendingApprovalList[index].id] = value;
    this.setState({
      pendingApprovalList: pendingApprovalList,
      activeAssignerId: activeAssignerId
    });
  }
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

  approveResendPartDetail(item) {
    this.setState({
      showCommentModal: false,
      comment: ''
    });
    let _this = this;
    let status = '';
    let teamSelectFlag = false;
    let listOfTeamsSelected = this.state.listOfTeamsSelected;
    let index = this.state.currentIndex;
    if (item === 'approve') {
      status = 'approved';
    } else {
      status = 'send_back';
      teamSelectFlag = true;
    }

    if (
      this.props.userInfo.userData.userProfile ===
        permissionConstant.roles.designer_approver &&
      listOfTeamsSelected
    ) {
      for (let i = 0; i < listOfTeamsSelected.length; i++) {
        if (listOfTeamsSelected[i].isSelected) {
          teamSelectFlag = true;
        }
        if (!teamSelectFlag) {
          teamSelectFlag = false;
          showErrorToast(validationMessages.part.checkForward);
          break;
        }
      }
    } else {
      teamSelectFlag = true;
    }

    if (teamSelectFlag) {
      let pendingApprovalList = this.state.pendingApprovalList;
      let data = {};
      if (this.state.approvalId) {
        data = {
          roleId: this.props.userInfo.userData.userRole,
          approverUserId: this.props.userInfo.userData.id,
          status: status,
          approvalId: this.state.approvalId,
          comment: this.state.comment,
          assignedToId: pendingApprovalList[index].assignedToId
            ? pendingApprovalList[index].assignedToId
            : this.state.activeAssignerId[pendingApprovalList[index].id],
          // listOfString: this.state.pendingApprovalList[index].listOfString,
          listOfSelectedTeams: this.state.pendingApprovalList[index]
            .listOfTeamsSelected
        };
      } else {
        data = {
          roleId: this.props.userInfo.userData.userRole,
          approverUserId: this.props.userInfo.userData.id,
          status: status,
          approvalId: this.state.reviewData.id,
          comment: this.state.comment,
          assignedToId: pendingApprovalList[index].assignedToId
            ? pendingApprovalList[index].assignedToId
            : this.state.activeAssignerId[pendingApprovalList[index].id],
          listOfString: this.state.pendingApprovalList[index].listOfString,
          listOfSelectedTeams: this.state.pendingApprovalList[index]
            .listOfTeamsSelected
        };
      }

      this.props
        .approveRejectPart(data)
        .then((result, error) => {
          if (result.payload.data.status === 200) {
            let socketData = {
              notificationId: result.payload.data.resourceData
            };
            socket.emit('new-message', socketData);
          }
          _this.props.actionLoaderHide();
          let pendingApprovalList = this.state.pendingApprovalList;
          if (
            _this.state.status === 'approved' &&
            result.payload.data.status === 200
          ) {
            pendingApprovalList[index].currentStatus = 'approved';
          } else if (
            _this.state.status === 'send_back' &&
            result.payload.data.status === 200
          ) {
            pendingApprovalList[index].currentStatus = 'send_back';
          }
          _this.setState({
            pendingApprovalList: pendingApprovalList,
            approverName: result.payload.data.resourceId
          });
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  }

  approveResendPart(data, item, index) {
    if (item) {
      this.setState({
        approvalId: item.id,
        currentIndex: index,
        listOfTeamsSelected: item.listOfTeamsSelected
      });
    }
    if (data === 'approve') {
      this.setState({
        status: 'approved',
        showResendButton: false,
        showApproveButton: true,
        showApproveModal: false,
        showCommentModal: true
      });
    } else {
      this.setState({
        status: 'send_back',
        showResendButton: true,
        showApproveButton: false,
        showApproveModal: false,
        showCommentModal: true
      });
    }
  }

  updatePart() {
    let _this = this;
    let flag = true;
    let errorMsg = [];
    let showError = '';

    let listOfSelectedSuppliers = [];
    let listOfSelectedSuppliersIds = [];
    if (this.state.editData && this.state.editData.partResponse) {
      listOfSelectedSuppliers = _.filter(
        this.state.editData.partResponse.listOfSuppliers,
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

    let listOfPartialShipment = this.state.editData.partResponse
      .listOfPartialShipment;

    // for (let i = 0; i < listOfPartialShipment.length; i++) {
    //   if (
    //     listOfPartialShipment[i] &&
    //     listOfPartialShipment[i].shipmentTargetDate
    //   ) {
    //     listOfPartialShipment[i].shipmentTargetDate = convertToTimeStamp(
    //       listOfPartialShipment[i].shipmentTargetDate
    //     );
    //     console.log("+++", listOfPartialShipment[i].shipmentTargetDate);
    //   }
    // }

    if (
      this.props.userInfo.userData.userProfile ===
      permissionConstant.roles.buyer
    ) {
      if (!this.state.editData.partResponse.partDescription) {
        errorMsg.push('Please enter part description');
        flag = false;
      } else if (!this.state.editData.partResponse.hsnCode) {
        errorMsg.push('Please enter part HSN Code');
        flag = false;
      } else if (!this.state.editData.partResponse.partRevisionNumber) {
        errorMsg.push('Please enter part revision number');
        flag = false;
      } else if (!this.state.editData.partResponse.quantity) {
        errorMsg.push('Please enter part quantity');
        flag = false;
      } else if (
        listOfSelectedSuppliersIds &&
        listOfSelectedSuppliersIds.length === 0
      ) {
        errorMsg.push('Please select supplier');
        flag = false;
      } else if (!this.state.editData.partResponse.units) {
        errorMsg.push('Please enter part units');
        flag = false;
      } else if (!this.state.editData.partResponse.usage) {
        errorMsg.push('Please enter usage');
        flag = false;
      } else if (!this.state.editData.partResponse.commodity) {
        errorMsg.push('Please enter commodity');
        flag = false;
      } else if (
        !this.state.editData.partResponse.deliveryAddressResponse.address
      ) {
        errorMsg.push('Please enter address');
        flag = false;
      } else if (
        !this.state.editData.partResponse.deliveryAddressResponse.country
      ) {
        errorMsg.push('Please enter country');
        flag = false;
      } else if (
        !this.state.editData.partResponse.deliveryAddressResponse.state
      ) {
        errorMsg.push('Please enter state');
        flag = false;
      } else if (
        !this.state.editData.partResponse.packagingDeliveryConditions
      ) {
        errorMsg.push('Please enter packaging delivery conditions');
        flag = false;
      } else if (!this.state.editData.partResponse.targetDate) {
        errorMsg.push('Please enter target date');
        flag = false;
      } else if (!this.state.editData.partResponse.production) {
        errorMsg.push('Please enter production');
        flag = false;
      } else if (
        !listOfPartialShipment[0].shipmentQty ||
        !listOfPartialShipment[0].shipmentTargetDate
      ) {
        errorMsg.push('Please enter at least first partial shipment details');
        flag = false;
      }
      // else if (
      //   this.state.editData.listOfSelectedApproval &&
      //   this.state.editData.listOfSelectedApproval.length === 0
      // ) {
      //   errorMsg.push("Please select approval");
      //   flag = false;
      // }
    }

    if (flag) {
      // let listOfPartialShipment = this.state.editData.partResponse
      //   .listOfPartialShipment;
      for (let i = 0; i < listOfPartialShipment.length; i++) {
        if (
          listOfPartialShipment[i] &&
          listOfPartialShipment[i].shipmentTargetDate
        ) {
          listOfPartialShipment[i].shipmentTargetDate = convertToTimeStamp(
            listOfPartialShipment[i].shipmentTargetDate
          );
          console.log('+++', listOfPartialShipment[i].shipmentTargetDate);
        }
      }

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
          partId: this.state.editData.partResponse.id,
          partNumber: this.state.editData.partResponse.partNumber,
          partDescription: this.state.editData.partResponse.partDescription,
          quantity: this.state.editData.partResponse.quantity,
          units: this.state.editData.partResponse.units,
          deliveryAddressRequest: {
            address: this.state.editData.partResponse.deliveryAddressResponse
              .address,
            country: this.state.editData.partResponse.deliveryAddressResponse
              .country,
            state: this.state.editData.partResponse.deliveryAddressResponse
              .state
          },
          packagingDeliveryConditions: this.state.editData.partResponse
            .packagingDeliveryConditions,
          targetDate: convertToTimeStamp(
            this.state.editData.partResponse.targetDate
          ),
          partRevisionNumber: this.state.editData.partResponse
            .partRevisionNumber,
          listOfPartialShipment: listOfPartialShipment,
          projectId: this.state.editData.partResponse.projectResponse.id,
          production: this.state.editData.partResponse.production,
          //remarks: this.state.editData.partResponse.remarks,
          commodity: this.state.editData.partResponse.commodity,
          hsnCode: this.state.editData.partResponse.hsnCode,
          usage: this.state.editData.partResponse.usage,
          listOfApprovers: listOfApprovers,
          specificationList: this.state.specificList,
          partMediaList: this.state.designList,
          suppliersToSendQuotations: listOfSelectedSuppliersIds
        }
      };
      this.props
        .actionUpdatePart(data)
        .then((result, error) => {
          if (result.payload.data.status === 200) {
            let socketData = {
              notificationId: result.payload.data.resourceData
            };
            socket.emit('new-message', socketData);
          }
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
            //this.getRFQDataAfterUpdateProcess(); /** Instead of below 6 lines */

            let rowIndex = this.state.rowIndex;
            let pendingApprovalList = this.state.pendingApprovalList;
            pendingApprovalList[rowIndex] = this.state.editData;
            this.setState({
              pendingApprovalList: pendingApprovalList
            });
          }
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
        designList: item.partResponse && item.partResponse.partMediaResponses,
        specificList:
          item.partResponse && item.partResponse.specificationResponse
      },
      () => {
        let editData = this.state.editData;
        editData.listOfSelectedApproval = item.listOfApprovers;
        for (let i = 0; i < 4; i++) {
          if (!editData.partResponse.listOfPartialShipment[i]) {
            editData.partResponse.listOfPartialShipment[i] = {};
            editData.partResponse.listOfPartialShipment[i].shipmentQty = '';
            editData.partResponse.listOfPartialShipment[i].shipmentTargetDate =
              '';
          }
          // else{
          //   let AllShipMentDate = [];
          //   AllShipMentDate = parseInt(editData.partResponse.listOfPartialShipment[i].shipmentTargetDate);
          //   editData.partResponse.listOfPartialShipment[i].shipmentTargetDate = AllShipMentDate;
          // }
        }
        this.setState({ editData: editData });
      }
    );
  }

  handleOnChangePartDetails(event) {
    const { name, value } = event.target;
    this.setState((prevState, props) => {
      prevState.editData.partResponse[name] = value;
      return { editData: prevState.editData };
    });
  }

  handleOnChangeAddress(event) {
    const { name, value } = event.target;
    let editData = this.state.editData;
    editData.partResponse.deliveryAddressResponse[name] = value;
    this.setState({ editData: editData });
  }
  handleOnChangeShipment(event, index) {
    const { name, value } = event.target;
    let editData = this.state.editData;
    editData.partResponse.listOfPartialShipment[index][name] = value;
    this.setState({ editData: editData });
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
    if (!editData.partResponse.listOfSelectedSuppliers)
      editData.partResponse.listOfSelectedSuppliers = [];
    if (selected) {
      editData.partResponse.listOfSuppliers[subIndex].isSelected = true;
      editData.partResponse.listOfSelectedSuppliers.push(value);
    } else {
      editData.partResponse.listOfSuppliers[subIndex].isSelected = false;
      editData.partResponse.listOfSelectedSuppliers.pop(value);
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

  handlePartUpdateData() {
    let _this = this;
    const userId = this.props.userInfo.userData.id;
    const roleId = this.props.userInfo.userData.userRole;
    this.props.actionLoaderShow();
    this.props
      .actionPendingApprovalPartList({ userId, roleId })
      .then((result, error) => {
        _this.props.actionLoaderHide();
        let pendingApprovalList = this.props.supplierParts.pendingApprovalList;
        this.setState({
          pendingApprovalList: pendingApprovalList
        });
        if (pendingApprovalList.length > 0) {
          for (let i = 0; i < pendingApprovalList.length; i++) {
            pendingApprovalList[i].listOfString = [];
          }
          for (let i = 0; i < pendingApprovalList.length; i++) {
            for (
              let j = 0;
              j < pendingApprovalList[i].listOfApprovers.length;
              j++
            ) {
              if (pendingApprovalList[i].listOfApprovers[j].default) {
                pendingApprovalList[i].listOfApprovers[j].checked = true;
                let id = pendingApprovalList[i].listOfApprovers[j].id;
                pendingApprovalList[i].listOfString.push(id);
              }
            }
          }
        }

        this.setState({
          pendingApprovalList:
            pendingApprovalList &&
            JSON.parse(JSON.stringify(pendingApprovalList))
        });
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleEditClose() {
    this.setState({ showEdit: false });
    this.setState({
      pendingApprovalList:
        this.props.supplierParts.pendingApprovalList &&
        JSON.parse(JSON.stringify(this.props.supplierParts.pendingApprovalList))
    });
    this.getRFQData();
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

  handleSpecificationFile(event, data) {
    window.open(data.mediaURL);
  }

  handleApproverSelectedOption(event, data, mainindex, subIndex) {
    let pendingApprovalList = this.state.pendingApprovalList;

    if (event.target.checked) {
      let id = pendingApprovalList[mainindex].listOfApprovers[subIndex].id;
      pendingApprovalList[mainindex].listOfApprovers[subIndex].checked = true;
      pendingApprovalList[mainindex].listOfString &&
        pendingApprovalList[mainindex].listOfString.push(id);
    } else {
      pendingApprovalList[mainindex].listOfApprovers[subIndex].checked = false;
    }
    this.setState({ pendingApprovalList: pendingApprovalList });
  }

  handleListOfTeamSelectedOption(event, data, mainindex, subIndex) {
    let pendingApprovalList = this.state.pendingApprovalList;
    if (event.target.checked) {
      let id = pendingApprovalList[mainindex].listOfTeamsSelected[subIndex].id;
      pendingApprovalList[mainindex].listOfTeamsSelected[
        subIndex
      ].isSelected = true;
    } else {
      pendingApprovalList[mainindex].listOfTeamsSelected[
        subIndex
      ].isSelected = false;
    }
    this.setState({ pendingApprovalList: pendingApprovalList });
  }

  handleCommentsClose() {
    this.setState({
      showComments: false,
      comments: '',
      partNumberForComments: '',
      commentBoxComment: ''
    });
  }

  handleCommentsShow(e, item) {
    let _this = this;
    this.setState({
      showComments: true,
      comments: item.comments,
      partNumberForComments: item.partResponse.partNumber,
      commentStatus: item.currentStatus,
      commentApporvalId: item.id,
      approvePartId: item.partResponse.id,
      itemcomments: item
    });
    let data = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      partId: item.partResponse.id,
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

      this.setState({
        showComments: true,
        comments: this.state.itemcomments.comments,
        partNumberForComments: this.state.itemcomments.partResponse.partNumber,
        commentStatus: this.state.itemcomments.currentStatus,
        commentApporvalId: this.state.itemcomments.id,
        approvePartId: this.state.itemcomments.partResponse.id
      });
      let data = {
        userId: this.props.userInfo.userData.id,
        roleId: this.props.userInfo.userData.userRole,
        partId: this.state.itemcomments.partResponse.id,
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
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      approvalId: this.state.commentApporvalId,
      status: this.state.commentStatus,
      comment: this.state.commentBoxComment,
      partId: this.state.approvePartId
    };
    this.props
      .actionSubmitComment(data)
      .then((result, error) => {
        let response = result.payload.data.resourceData;
        if (result.payload.data.status === 200) {
          let socketData = {
            notificationId: result.payload.data.resourceData
          };
          socket.emit('new-message', socketData);
        }

        let profileImage =
          customConstant.amazonURL +
          this.props.userInfo.userData.profilePhotoURL;
        if (this.props.userInfo.userData.profilePhotoURL == null) {
          profileImage = User;
        }
        let localComment = {
          comment: this.state.commentBoxComment,
          date: new Date().getTime(),
          senderDetails: {
            firstName: this.props.userInfo.userData.fullname,
            userProfile: this.props.userInfo.userData.userProfile,
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

  quotationAnalysisModal(itemData) {
    this.setState({
      reviewData: itemData,
      showQuotationAnalysisModal: true
    });
  }

  handleQuotationAnalysisClose(itemData) {
    this.setState({
      showQuotationAnalysisModal: false
    });
  }

  getRFQDataAfterUpdateProcess() {
    let _this = this;
    const userId = this.props.userInfo.userData.id;
    const roleId = this.props.userInfo.userData.userRole;
    //let pageNumber = 1;
    //let pageSize = 10;
    this.props.actionLoaderShow();
    this.props
      .actionPendingApprovalPartList({ userId, roleId })
      .then((result, error) => {
        _this.props.actionLoaderHide();
        let pendingApprovalList = this.props.supplierParts.pendingApprovalList;
        this.setState({
          pendingApprovalList: pendingApprovalList
        });
        if (pendingApprovalList.length > 0) {
          for (let i = 0; i < pendingApprovalList.length; i++) {
            pendingApprovalList[i].listOfString = [];
            // pendingApprovalList[i].listOfTeam = this.state.listOfTeam;
          }
          for (let i = 0; i < pendingApprovalList.length; i++) {
            if (
              pendingApprovalList[i].listOfApprovers &&
              pendingApprovalList[i].listOfApprovers.length
            )
              for (
                let j = 0;
                j < pendingApprovalList[i].listOfApprovers.length;
                j++
              ) {
                if (pendingApprovalList[i].listOfApprovers[j].default) {
                  pendingApprovalList[i].listOfApprovers[j].checked = true;
                  let id = pendingApprovalList[i].listOfApprovers[j].id;
                  pendingApprovalList[i].listOfString.push(id);
                }
              }
          }
        }
        this.setState({
          pendingApprovalList: pendingApprovalList
        });
      })
      .catch(e => _this.props.actionLoaderHide());
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    let self = this;
    let editData = this.state.editData && this.state.editData;
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === 'third' ? 'third' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === 'third' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <div className="">
                  <h4 className="hero-title">
                    {/* {this.props.userInfo.userData.userProfile ===
                    permissionConstant.roles.designer_approver
                      ? 'Approve Part Request'
                      : this.props.userInfo.userData.userProfile ===
                        permissionConstant.roles.value_analyst
                      ? 'Cost Estimation'
                      : this.props.userInfo.userData.userProfile ===
                        permissionConstant.roles.purchase_manager
                      ? 'Assign Buyer'
                      : 'RFQ Approval..................'} */}
                    {this.props.userInfo.userData.userProfile
                      ? removeUnderScore(
                          this.props.userInfo.userData.userProfile
                        )
                      : 'RFQ'}{' '}
                    Approval
                  </h4>
                </div>

                <InfiniteScroll
                  dataLength={this.state.recordLength}
                  next={this.fetchMoreData}
                  hasMore={this.state.hasMore}
                >
                  <div style={{ position: 'relative' }}>
                    {this.state.pendingApprovalList &&
                    this.state.pendingApprovalList.length ? (
                      <Table
                        striped
                        bordered
                        responsive
                        className="custom-table v-align-top"
                      >
                        <tbody>
                          {this.state.pendingApprovalList.map((item, index) => {
                            return [
                              <tr>
                                <td className="p-0 w100 v-a-middle">
                                  <img
                                    onClick={self.imageShow.bind(
                                      self,
                                      item.partResponse.id,
                                      item.partResponse.partMediaResponses,
                                      item.partResponse.partNumber,
                                      item.partResponse.specificationResponse
                                    )}
                                    src={item.partResponse.partMediaThumbnail}
                                    width="45"
                                    className="cursor-pointer"
                                  />
                                </td>
                                <td>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      PART NO&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {item.partResponse.partNumber}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      DESCRIPTION&nbsp;:
                                    </span>
                                    <OverlayTrigger
                                      placement="left"
                                      overlay={
                                        <Tooltip id="tooltip">
                                          {item.partResponse.partDescription}
                                        </Tooltip>
                                      }
                                    >
                                      <span className="flex-1 tb-value text-left">
                                        {item.partResponse.partDescription}
                                      </span>
                                    </OverlayTrigger>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      PROGRAM CODE&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {
                                        item.partResponse.projectResponse
                                          .projectCode
                                      }
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      PROJECT DESCRIPTION&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      -
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      MODEL&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      -
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      DESIGNER&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {item.partResponse.listOfPartApprovers &&
                                        item.partResponse.listOfPartApprovers[0]
                                          .firstName}{' '}
                                      {item.partResponse.listOfPartApprovers &&
                                        item.partResponse.listOfPartApprovers[0]
                                          .lastName}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      DESIGNER APPROVER&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {item.partResponse.listOfPartApprovers &&
                                        item.partResponse
                                          .listOfPartApprovers[1] &&
                                        item.partResponse.listOfPartApprovers[1]
                                          .firstName}{' '}
                                      {item.partResponse.listOfPartApprovers &&
                                        item.partResponse
                                          .listOfPartApprovers[1] &&
                                        item.partResponse.listOfPartApprovers[1]
                                          .lastName}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      GROUP&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      -
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      COMPANY NAME&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {
                                        item.partResponse.buyerResponse
                                          .companyName
                                      }
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      COMMODITY&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {item.partResponse.commodity}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      ON ORDER&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      -
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      TARGET DELIVERY DATE&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {moment(
                                        item.partResponse.targetDate
                                      ).format('DD/MM/YYYY')}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      ESTIMATED SCRAP&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      -
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      ESTIMATED SCRAP QTY&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      -
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      REPLACE PART&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      -
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      STOCK&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      -
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      ECO NO&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      -
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      QTY/UNIT&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {item.partResponse.quantity}
                                      {item.partResponse.quantity ? '/' : null}
                                      {item.partResponse.units}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      QTY NEEDED&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      -
                                    </span>
                                  </div>
                                  {/* <div className="flex tb-main">
                                  <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                    REPLACE PART :
                                  </span>
                                  <span className="flex-1 tb-value text-left">
                                    -
                                  </span>
                                </div>
                                <div className="flex tb-main">
                                  <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                    STOCK :
                                  </span>
                                  <span className="flex-1 tb-value text-left">
                                    -
                                  </span>
                                </div> */}
                                </td>
                                <td>
                                  <div className="flex tb-main align-center">
                                    {this.props.userInfo.userData
                                      .userProfile ===
                                    permissionConstant.roles.buyer ? (
                                      <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                        Purchase Manager&nbsp;:
                                      </span>
                                    ) : this.props.userInfo.userData
                                        .userProfile ===
                                      permissionConstant.roles
                                        .purchase_manager ? (
                                      <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                        Buyer&nbsp;:{' '}
                                      </span>
                                    ) : this.props.userInfo.userData
                                        .userProfile ===
                                        permissionConstant.roles
                                          .designer_approver &&
                                      item.currentStatus === 'send_back' ? (
                                      <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                        Send Back by&nbsp;:
                                      </span>
                                    ) : this.props.userInfo.userData
                                        .userProfile ===
                                        permissionConstant.roles
                                          .designer_approver &&
                                      item.currentStatus === 'approved' ? (
                                      <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                        Approved for&nbsp;:
                                      </span>
                                    ) : this.props.userInfo.userData
                                        .userProfile ===
                                        permissionConstant.roles
                                          .designer_approver &&
                                      item.currentStatus ===
                                        'waiting_for_approval' ? (
                                      <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                        List of Team&nbsp;:
                                      </span>
                                    ) : this.props.userInfo.userData
                                        .userProfile ===
                                      permissionConstant.roles.value_analyst ? (
                                      <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                        Product Cost Manager&nbsp;:
                                      </span>
                                    ) : this.props.userInfo.userData
                                        .userProfile ===
                                      permissionConstant.roles
                                        .manufacturing_engineer ? (
                                      <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                        Head of Manufacturing Engineer&nbsp;:
                                      </span>
                                    ) : (
                                      <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                        Approver&nbsp;:
                                      </span>
                                    )}

                                    {
                                      //item.currentStatus ===
                                      //     "send_back" ? (
                                      //       <span className="flex-1 w100 text-ellipsis text-left d-inline">
                                      //   Purchase Manager : {item.sendBackUser && item.sendBackUser.firstName}
                                      // </span>
                                      //     ) : item.currentStatus ===
                                      //     "approved" ? (
                                      //       <span className="flex-1 w100 text-ellipsis text-left d-inline">
                                      //       Purchase Manager : {item.approvedUser && item.approvedUser.firstName}
                                      //     </span>
                                      //     ) :  (
                                      //       <span className="flex-1 w100 text-ellipsis text-left d-inline">
                                      //         waiting_for_approval
                                      //       </span>
                                      //     )
                                    }

                                    <span className="flex-1 text-left custom-dd appr-dd">
                                      {this.props.userInfo.userData
                                        .userProfile ===
                                        permissionConstant.roles
                                          .designer_approver &&
                                      item.currentStatus != 'send_back' &&
                                      item.listOfTeamsSelected ? (
                                        <DropdownButton
                                          id="selectApprover"
                                          title="List of Team"
                                          name="secpeificationData"
                                          // value={this.state.listOfTeam}
                                          className="w-125"
                                        >
                                          {item.listOfTeamsSelected &&
                                            item.listOfTeamsSelected.map(
                                              (data, i) => {
                                                return (
                                                  <li key={i}>
                                                    <input
                                                      type="checkbox"
                                                      value={data.teamName}
                                                      checked={
                                                        data.isSelected
                                                          ? true
                                                          : false
                                                      }
                                                      onClick={this.dontClose}
                                                      onChange={event => {
                                                        this.handleListOfTeamSelectedOption(
                                                          event,
                                                          data,
                                                          index,
                                                          i
                                                        );
                                                      }}
                                                    />
                                                    <label>
                                                      {data.teamName
                                                        ? removeUnderScore(
                                                            data.teamName
                                                          )
                                                        : null}
                                                    </label>
                                                  </li>
                                                );
                                              }
                                            )}
                                        </DropdownButton>
                                      ) : item.currentStatus === 'send_back' ? (
                                        <span>
                                          {item.sendBackUser
                                            ? item.sendBackUser.firstName +
                                              ' ' +
                                              item.sendBackUser.lastName
                                            : this.state.approverName}
                                        </span>
                                      ) : item.currentStatus === 'approved' ? (
                                        <span>
                                          {item.approvedUser
                                            ? item.approvedUser.firstName +
                                              ' ' +
                                              item.approvedUser.lastName
                                            : this.state.approverName}
                                        </span>
                                      ) : // <DropdownButton
                                      // id="selectApprover"
                                      // title="Select Approver"
                                      // name="secpeificationData"
                                      // value={item.listOfApprovers}
                                      // className="w-125"
                                      // >
                                      // {item.listOfApprovers &&
                                      // item.listOfApprovers.map((item, i) => {
                                      // let selected = '';
                                      // if (item.default) {
                                      // selected = 'selected';
                                      // } else if (item.isSelected) {
                                      // selected = 'selected';
                                      // }
                                      // return (
                                      // <li className="xxx" key={i}>
                                      // <input
                                      // type="checkbox"
                                      // value={item.id}
                                      // disabled={
                                      // item.default ? true : false
                                      // }
                                      // checked={selected ? true : false}
                                      // onClick={this.dontClose}
                                      // onChange={event => {
                                      // this.handleApproverSelectedOption(
                                      // event,
                                      // item,
                                      // index,
                                      // i
                                      // );
                                      // }}
                                      // />
                                      // <label>
                                      // {' '}
                                      // {item.firstName} {item.lastName} |
                                      // {item.userProfile
                                      // ? removeUnderScore(
                                      // item.userProfile
                                      // )
                                      // : ''}
                                      // </label>
                                      // </li>
                                      // );
                                      // })}
                                      // </DropdownButton>

                                      // DIleep 26/12
                                      // <FormControl
                                      //   componentClass="select"
                                      //   placeholder="select"
                                      //   className="br-0 s-arrow w-150 sel-approver"
                                      //   name="assignedToId"
                                      //   value={this.state.assignedToId}
                                      //   onChange={e => {
                                      //     this.handleApproverChange(e, index);
                                      //   }}
                                      // >
                                      //   <option value="select">Select</option>
                                      //   {item.listOfApprovers &&
                                      //     item.listOfApprovers.map(
                                      //       (item, i) => {
                                      //         return (
                                      //           <option value={item.id} key={i}>
                                      //             {item.firstName}{' '}
                                      //             {item.lastName}
                                      //           </option>
                                      //         );
                                      //       }
                                      //     )}
                                      // </FormControl>

                                      //)
                                      this.props.userInfo.userData
                                          .userProfile ===
                                        permissionConstant.roles.buyer ? (
                                        <span>
                                          {item.listOfApprovers[0].firstName +
                                            ' ' +
                                            item.listOfApprovers[0].lastName}
                                        </span>
                                      ) : this.props.userInfo.userData
                                          .userProfile ===
                                        permissionConstant.roles
                                          .value_analyst ? (
                                        <span>
                                          {item.listOfApprovers[0].firstName +
                                            ' ' +
                                            item.listOfApprovers[0].lastName}
                                        </span>
                                      ) : this.props.userInfo.userData
                                          .userProfile ===
                                        permissionConstant.roles
                                          .manufacturing_engineer ? (
                                        <span>
                                          {item.listOfApprovers[0].firstName +
                                            ' ' +
                                            item.listOfApprovers[0].lastName}
                                        </span>
                                      ) : (
                                        <FormControl
                                          componentClass="select"
                                          placeholder="select"
                                          className="br-0 s-arrow w-150 sel-approver"
                                          name="assignedToId"
                                          value={this.state.assignedToId}
                                          onChange={e => {
                                            this.handleApproverChange(e, index);
                                          }}
                                        >
                                          <option value="select">Select</option>
                                          {item.listOfApprovers &&
                                            item.listOfApprovers.map(
                                              (item, i) => {
                                                return (
                                                  <option
                                                    value={item.id}
                                                    key={i}
                                                  >
                                                    {item.firstName}{' '}
                                                    {item.lastName}
                                                  </option>
                                                );
                                              }
                                            )}
                                        </FormControl>
                                      )}
                                    </span>
                                  </div>
                                </td>

                                <td className="v-a-top">
                                  <div className="flex flex-column align-item-end">
                                    <button
                                      className={
                                        item.currentStatus === 'approved'
                                          ? 'btn btn-task p-0 p-e-none'
                                          : 'btn btn-task p-0'
                                      }
                                      onClick={() => {
                                        this.approveResendPart(
                                          'approve',
                                          item,
                                          index
                                        );
                                      }}
                                    >
                                      <span
                                        className={
                                          item.currentStatus === 'approved'
                                            ? 'ico-action-sm fill-green'
                                            : 'ico-action-sm '
                                        }
                                      >
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#rightCircleIco`}
                                          />
                                        </svg>
                                      </span>
                                    </button>

                                    <button
                                      className={
                                        item.currentStatus === 'approved' ||
                                        item.currentStatus === 'send_back'
                                          ? 'btn btn-task p-0  p-e-none'
                                          : 'btn btn-task p-0'
                                      }
                                      onClick={() => {
                                        this.approveResendPart(
                                          'send_back',
                                          item,
                                          index
                                        );
                                      }}
                                    >
                                      <span
                                        className={
                                          item.currentStatus === 'send_back'
                                            ? 'ico-action-sm fill-red'
                                            : 'ico-action-sm '
                                        }
                                      >
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#refresh1Ico`}
                                          />
                                        </svg>
                                      </span>
                                    </button>

                                    <div className="more-dd action-dd">
                                      <DropdownButton
                                        title={
                                          <Glyphicon glyph="option-vertical" />
                                        }
                                      >
                                        <li
                                          className="flex align-center"
                                          onClick={() => {
                                            const data = item;
                                            this.partDetailReview(data);
                                          }}
                                        >
                                          <span className="ico-action-sm">
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#review1Ico`}
                                              />
                                            </svg>
                                          </span>
                                          <span className="flex-1 text-center">
                                            Review
                                          </span>
                                        </li>
                                        <li
                                          className="flex align-center"
                                          // onClick={() => {
                                          //   this.approveResendPart(
                                          //     'send_back',
                                          //     item,
                                          //     index
                                          //   );
                                          // }}
                                        >
                                          <span className="ico-action-sm">
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#chat1Ico`}
                                              />
                                            </svg>
                                          </span>
                                          <span className="flex-1 text-center">
                                            Chat
                                          </span>
                                        </li>
                                        <li
                                          className="flex align-center"
                                          onClick={e =>
                                            this.handleCommentsShow(e, item)
                                          }
                                        >
                                          <span className="ico-action-sm">
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#commentIco`}
                                              />
                                            </svg>
                                          </span>
                                          <span className="flex-1 text-center">
                                            Comment
                                          </span>
                                        </li>
                                        {this.props.userInfo.userData
                                          .userProfile ===
                                        permissionConstant.roles
                                          .value_analyst ? null : (
                                          <li
                                            className="flex align-center"
                                            onClick={() => {
                                              this.editPart(item, index);
                                            }}
                                          >
                                            <span className="ico-action-sm">
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#editIco`}
                                                />
                                              </svg>
                                            </span>
                                            <span className="flex-1 text-center">
                                              Edit
                                            </span>
                                          </li>
                                        )}

                                        {this.props.userInfo.userData
                                          .userProfile ===
                                          permissionConstant.roles
                                            .product_cost_manager ||
                                        this.props.userInfo.userData
                                          .userProfile ===
                                          permissionConstant.roles
                                            .head_product_development ? (
                                          <li
                                            className={
                                              item.valueAnalystQuotation
                                                ? 'flex align-center'
                                                : 'btn-disable flex align-center p-e-none'
                                            }
                                            onClick={() => {
                                              this.quotationAnalysisModal(
                                                item.valueAnalystQuotation
                                              );
                                            }}
                                          >
                                            <span className="ico-action-sm">
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#valueAnlstIco`}
                                                />
                                              </svg>
                                            </span>
                                            <span className="flex-1 text-center">
                                              Cost Estimate
                                            </span>
                                          </li>
                                        ) : null}

                                        {this.props.userInfo.userData
                                          .userProfile ===
                                        permissionConstant.roles
                                          .value_analyst ? (
                                          <Link
                                            to={{
                                              pathname: 'valueAnalyst',
                                              state: {
                                                pendingApprovalData: item
                                              }
                                            }}
                                          >
                                            <li className="flex align-center">
                                              <span className="ico-action-sm">
                                                <svg>
                                                  <use
                                                    xlinkHref={`${Sprite}#valueAnlstIco`}
                                                  />
                                                </svg>
                                              </span>
                                              <span className="flex-1 text-center">
                                                {item.valueAnalystQuotation
                                                  ? 'Edit Estimation'
                                                  : 'Cost Estimate'}
                                              </span>
                                            </li>
                                          </Link>
                                        ) : null}
                                      </DropdownButton>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ];
                          })}
                        </tbody>
                      </Table>
                    ) : this.state.noRecordImage &&
                      this.state.pendingApprovalList.length == 0 ? (
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
                          <div className="flex justify-space-between align-center">
                            <h4 className="m-0">
                              Part No.:{' '}
                              <b>
                                {this.state.reviewData.partResponse
                                  ? this.state.reviewData.partResponse
                                      .partNumber
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
                                          <use
                                            xlinkHref={`${Sprite}#printIco`}
                                          />
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
                          <div className="p-lr-40">
                            <div
                              className=""
                              ref={el => (this.componentRef = el)}
                            >
                              <h4 className="">
                                Part No. :{' '}
                                <b>
                                  {this.state.reviewData.partResponse
                                    ? this.state.reviewData.partResponse
                                        .partNumber
                                    : ''}
                                </b>
                              </h4>

                              <Table className="no-border-table print-table">
                                <tbody>
                                  <tr>
                                    <td className="color-light w-175">
                                      Buyer:
                                    </td>
                                    <td>
                                      {this.state.reviewData.partResponse &&
                                        this.state.reviewData.partResponse
                                          .buyerResponse.companyName}
                                      ,{' '}
                                      {this.state.reviewData.partResponse &&
                                        this.state.reviewData.partResponse
                                          .buyerResponse.addresses[0].address}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">Project:</td>
                                    <td>
                                      {this.state.reviewData.partResponse &&
                                        this.state.reviewData.partResponse
                                          .projectResponse.projectTitle}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">
                                      Project Code:
                                    </td>
                                    <td>
                                      {this.state.reviewData.partResponse &&
                                        this.state.reviewData.partResponse
                                          .projectResponse.projectCode}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">
                                      Part Number:
                                    </td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? this.state.reviewData.partResponse
                                            .partNumber
                                        : ''}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">
                                      Part Description:
                                    </td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? this.state.reviewData.partResponse
                                            .partDescription
                                        : ''}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">
                                      Delivery Location:
                                    </td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? this.state.reviewData.partResponse
                                            .deliveryAddressResponse.address
                                        : ''}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">
                                      Delivery Country:
                                    </td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? this.state.reviewData.partResponse
                                            .deliveryAddressResponse.country
                                        : ''}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">Usage:</td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? this.state.reviewData.partResponse
                                            .usage
                                        : ''}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">Quantity:</td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? this.state.reviewData.partResponse
                                            .quantity
                                        : ''}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">Units:</td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? this.state.reviewData.partResponse
                                            .units
                                        : ''}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">Production:</td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? this.state.reviewData.partResponse
                                            .production
                                        : ''}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">Commodity:</td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? this.state.reviewData.partResponse
                                            .commodity
                                        : ''}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">HSN Code:</td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? this.state.reviewData.partResponse
                                            .hsnCode
                                        : ''}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">
                                      Packaging / Delivery Condition:
                                    </td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? this.state.reviewData.partResponse
                                            .packagingDeliveryConditions
                                        : ''}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">
                                      Target Date:
                                    </td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? moment(
                                            this.state.reviewData.partResponse
                                              .targetDate
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
                                  <tr>
                                    <td className="color-light">Remarks</td>
                                    <td>
                                      {this.state.reviewData.partResponse
                                        ? this.state.reviewData.partResponse
                                            .remarks
                                        : ''}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                            <div>
                              <div className="">
                                <div class="flex justify-space-between">
                                  <h5 class="printHeading">
                                    {' '}
                                    Partial Shipment
                                  </h5>
                                </div>
                                <Table
                                  responsive
                                  className="table-bordered custom-table col-border print-table"
                                >
                                  <thead>
                                    <tr>
                                      <th>Shipment Qty</th>
                                      <th>Shipment Target Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.reviewData.partResponse &&
                                    this.state.reviewData.partResponse
                                      .listOfPartialShipment
                                      ? this.state.reviewData.partResponse.listOfPartialShipment.map(
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
                              //onChange={this.handleChange}
                              onChange={event => {
                                this.handleChange(event);
                              }}
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
                                    permissionConstant.rolesdesigner_approver ? (
                                    <div className="upload-btn cursor-pointer text-uppercase">
                                      <span className="ico-upload w-full">
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#upload1Ico`}
                                          />
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
                                          <use
                                            xlinkHref={`${Sprite}#upload1Ico`}
                                          />
                                        </svg>
                                      </span>
                                      upload Specifications
                                      <FormControl
                                        id="formControlsFile"
                                        multiple
                                        type="file"
                                        label="File"
                                        accept=".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
                                        onChange={
                                          this.handleUploadSpecification
                                        }
                                        disabled={
                                          this.state.selectedDesigns === ''
                                        }
                                        // help="Example block-level help text here."
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
                                      editData &&
                                      editData.partResponse.partDescription
                                    }
                                  />
                                  <FormControl.Feedback />

                                  <ControlLabel>
                                    Part Description
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                // value={editData.specificationResponse}
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
                                      editData &&
                                      editData.partResponse.partRevisionNumber
                                    }
                                  />
                                  <FormControl.Feedback />
                                  <ControlLabel>
                                    Part Revision Number
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                  id="selectApprover"
                                  title="Select Approver"
                                  name="secpeificationData"
                                  //value={editData.listOfSuppliers}
                                  className="w-125"
                                >
                                  {editData &&
                                    editData.listOfApprovers &&
                                    editData.listOfApprovers.map((item, i) => {
                                      let selected = "";
                                      if (item.isDefault) {
                                        selected = "selected";
                                      } else if (item.isSelected) {
                                        selected = "selected";
                                      }
                                      return (
                                        <li>
                                          <input
                                            type="checkbox"
                                            name="suppliers"
                                            value={item.id}
                                            disabled={
                                              item.isDefault ? true : false
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
                                              " " +
                                              item.lastName}
                                          </label>
                                        </li>
                                      );
                                    })}
                                </DropdownButton>
                              </div>
                            </Col> */}
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
                                      editData && editData.partResponse.hsnCode
                                    }
                                  />
                                  <FormControl.Feedback />
                                  <ControlLabel>
                                    HSN Code
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                      {editData &&
                                        editData.partResponse.listOfSuppliers &&
                                        editData.partResponse.listOfSuppliers.map(
                                          (item, i) => {
                                            return (
                                              <li>
                                                <input
                                                  type="checkbox"
                                                  name="suppliers"
                                                  value={item.id}
                                                  checked={
                                                    item.isSelected
                                                      ? true
                                                      : false
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
                                                <label>
                                                  {item.companyName}
                                                </label>
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
                                      editData && editData.partResponse.quantity
                                    }
                                  />
                                  <FormControl.Feedback />

                                  <ControlLabel>
                                    Quantity
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                      editData && editData.partResponse.units
                                    }
                                  />
                                  <FormControl.Feedback />

                                  <ControlLabel>
                                    Units
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                      editData && editData.partResponse.usage
                                    }
                                  />
                                  <FormControl.Feedback />

                                  <ControlLabel>
                                    Usage
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                      editData &&
                                      editData.partResponse.commodity
                                    }
                                  />
                                  <FormControl.Feedback />

                                  <ControlLabel>
                                    Commodity
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                      editData &&
                                      editData.partResponse
                                        .deliveryAddressResponse &&
                                      editData.partResponse
                                        .deliveryAddressResponse.address
                                    }
                                  />
                                  <FormControl.Feedback />

                                  <ControlLabel>
                                    Delivery Address
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                      editData &&
                                      editData.partResponse
                                        .deliveryAddressResponse &&
                                      editData.partResponse
                                        .deliveryAddressResponse.state
                                    }
                                  />
                                  <FormControl.Feedback />

                                  <ControlLabel>
                                    Delivery State
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                      editData &&
                                      editData.partResponse
                                        .deliveryAddressResponse &&
                                      editData.partResponse
                                        .deliveryAddressResponse.country
                                    }
                                  />
                                  <FormControl.Feedback />

                                  <ControlLabel>
                                    Delivery Country
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                      editData &&
                                      editData.partResponse
                                        .packagingDeliveryConditions
                                    }
                                  />
                                  <FormControl.Feedback />

                                  <ControlLabel>
                                    Packaging/Delivery Condition
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                    {this.props.userInfo.userData
                                      .userProfile ===
                                    permissionConstant.roles.buyer ? (
                                      <em>*</em>
                                    ) : (
                                      ''
                                    )}
                                  </ControlLabel>

                                  <DatePicker
                                    selected={
                                      editData &&
                                      editData.partResponse.targetDate
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
                                  min={moment().format("YYYY-MM-DD")}
                                  inputProps={{ readOnly: true }}
                                  onChange={e => {
                                    const value = e;
                                    this.handleOnChangePartDetails(
                                      {
                                        target: {
                                          name: "targetDate",
                                          value
                                        }
                                      },
                                      1 //index
                                    );
                                  }}
                                  value={
                                    editData && editData.partResponse.targetDate
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
                                      editData &&
                                      editData.partResponse.production
                                    }
                                    onChange={event => {
                                      this.handleOnChangePartDetails(event);
                                    }}
                                  >
                                    <option value="">Select</option>
                                    <option value="proto">Proto</option>
                                    <option value="production">
                                      Production
                                    </option>
                                  </FormControl>
                                  <FormControl.Feedback />
                                  <ControlLabel>
                                    Proto/Production{' '}
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                      editData &&
                                      editData.partResponse &&
                                      editData.partResponse
                                        .listOfPartialShipment &&
                                      editData.partResponse
                                        .listOfPartialShipment[0] &&
                                      editData.partResponse
                                        .listOfPartialShipment[0].shipmentQty
                                    }
                                  />
                                  <FormControl.Feedback />

                                  <ControlLabel>
                                    Shipment 1 Qty{' '}
                                    {this.props.userInfo.userData
                                      .userProfile ===
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
                                    {this.props.userInfo.userData
                                      .userProfile ===
                                    permissionConstant.roles.buyer ? (
                                      <em>*</em>
                                    ) : (
                                      ''
                                    )}
                                  </ControlLabel>

                                  <DatePicker
                                    selected={
                                      editData &&
                                      editData.partResponse &&
                                      editData.partResponse
                                        .listOfPartialShipment &&
                                      editData.partResponse
                                        .listOfPartialShipment[0] &&
                                      editData.partResponse
                                        .listOfPartialShipment[0]
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
                                  min={moment().format("YYYY-MM-DD")}
                                  inputProps={{ readOnly: true }}
                                  onChange={event => {
                                    const value = event;
                                    this.handleOnChangeShipment(
                                      {
                                        target: {
                                          name: "shipmentTargetDate",
                                          value
                                        }
                                      },
                                      0
                                    );
                                  }}
                                  value={
                                    editData &&
                                    editData.partResponse &&
                                    editData.partResponse
                                      .listOfPartialShipment &&
                                    editData.partResponse
                                      .listOfPartialShipment[0] &&
                                    editData.partResponse
                                      .listOfPartialShipment[0]
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
                                      editData &&
                                      editData.partResponse
                                        .listOfPartialShipment &&
                                      editData.partResponse
                                        .listOfPartialShipment[1] &&
                                      editData.partResponse
                                        .listOfPartialShipment[1].shipmentQty
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
                                      editData &&
                                      editData.partResponse
                                        .listOfPartialShipment &&
                                      editData.partResponse
                                        .listOfPartialShipment[1] &&
                                      editData.partResponse
                                        .listOfPartialShipment[1]
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
                                  min={moment().format("YYYY-MM-DD")}
                                  inputProps={{ readOnly: true }}
                                  onChange={event => {
                                    const value = event;
                                    this.handleOnChangeShipment(
                                      {
                                        target: {
                                          name: "shipmentTargetDate",
                                          value
                                        }
                                      },
                                      1
                                    );
                                  }}
                                  value={
                                    editData &&
                                    editData.partResponse
                                      .listOfPartialShipment &&
                                    editData.partResponse
                                      .listOfPartialShipment[1] &&
                                    editData.partResponse
                                      .listOfPartialShipment[1]
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
                                      editData &&
                                      editData.partResponse &&
                                      editData.partResponse
                                        .listOfPartialShipment &&
                                      editData.partResponse
                                        .listOfPartialShipment[2] &&
                                      editData.partResponse
                                        .listOfPartialShipment[2].shipmentQty
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
                                      editData &&
                                      editData.partResponse
                                        .listOfPartialShipment &&
                                      editData.partResponse
                                        .listOfPartialShipment[2] &&
                                      editData.partResponse
                                        .listOfPartialShipment[2]
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

                                  {/*<Datetime
                                  className="db-0"
                                  closeOnSelect="true"
                                  timeFormat={false}
                                  dateFormat="YYYY-MM-DD"
                                  min={moment().format("YYYY-MM-DD")}
                                  inputProps={{ readOnly: true }}
                                  onChange={event => {
                                    const value = event;
                                    this.handleOnChangeShipment(
                                      {
                                        target: {
                                          name: "shipmentTargetDate",
                                          value
                                        }
                                      },
                                      2
                                    );
                                  }}
                                  value={
                                    editData &&
                                    editData.partResponse
                                      .listOfPartialShipment &&
                                    editData.partResponse
                                      .listOfPartialShipment[2] &&
                                    editData.partResponse
                                      .listOfPartialShipment[2]
                                      .shipmentTargetDate
                                  }
                                />*/}
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
                                      editData.partResponse &&
                                      editData.partResponse
                                        .listOfPartialShipment &&
                                      editData.partResponse
                                        .listOfPartialShipment[3] &&
                                      editData.partResponse
                                        .listOfPartialShipment[3].shipmentQty
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
                                      editData &&
                                      editData.partResponse
                                        .listOfPartialShipment &&
                                      editData.partResponse
                                        .listOfPartialShipment[3] &&
                                      editData.partResponse
                                        .listOfPartialShipment[3]
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
                                      editData &&
                                      editData.partResponse
                                        .listOfPartialShipment &&
                                      editData.partResponse
                                        .listOfPartialShipment[3] &&
                                      editData.partResponse
                                        .listOfPartialShipment[3]
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
                </InfiniteScroll>
              </div>
            </div>
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
                  <InfiniteScroll
                    dataLength={this.state.commentRecordLength}
                    next={this.getMoreData}
                    hasMore={this.state.hasMoreComment}
                    height={300}
                    style={{ maxHeight: '400px', minHeight: '300px' }}
                  >
                    <ul
                      className="chat-list"
                      style={{ maxHeight: 'initial', minHeight: 'initial' }}
                    >
                      {this.state.commentResponse &&
                        this.state.commentResponse.map((item, index) => {
                          return (
                            <li className="flex" key={index}>
                              <div className="avatar">
                                <img
                                  src={
                                    item.senderDetails &&
                                    item.senderDetails.profileImageThumbnailUrl
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
                                <div className="chat-hero-text">
                                  {item.comment}
                                </div>
                              </div>
                            </li>
                          );
                        })}
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
                        //onChange={this.handleChange}
                        onChange={event => {
                          this.handleChange(event);
                        }}
                      />
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

            {/* <Modal
              show={this.state.showComments}
              onHide={this.handleCommentsClose}
              className="custom-popUp modal-450 popUp-15"
            >
              <Modal.Body>
                <div className="flex justify-space-between m-b-30">
                  <div className="flex align-center">
                    <span className="ico-action comment-blue">
                      <svg>
                        <use xlinkHref={`${Sprite}#commentIco`} />
                      </svg>
                    </span>
                    <div>
                      <h4 className="m-b-0">
                        Part Number: {this.state.partNumberForComments}
                      </h4>
                      <small>Comments</small>
                    </div>
                  </div>
                  <button
                    className="btn btn-link"
                    onClick={this.handleCommentsClose}
                  >
                    Close
                  </button>
                </div>

                <p>{this.state.comments}</p>
              </Modal.Body>
            </Modal> */}
            <Modal
              show={this.state.showQuotationAnalysisModal}
              onHide={this.handleQuotationAnalysisClose}
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
                        onClick={this.handleQuotationAnalysisClose}
                        className="btn btn-link text-uppercase color-light"
                      >
                        close
                      </button>
                    </span>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <div className="p-lr-20" ref={el => (this.componentRef = el)}>
                  <div className="m-b-50">
                    <Table>
                      <tbody>
                        <tr>
                          <td className="b-0">
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
                          <td className="b-0">
                            <div className="brand">
                              <img src={Image1} alt="" className="obj-cover" />
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
                                          .partCreatorDetailResponse.LastName}
                                      ,{''}
                                      {this.state.reviewData &&
                                        this.state.reviewData
                                          .partCreatorDetailResponse &&
                                        this.state.reviewData
                                          .partCreatorDetailResponse
                                          .userProfile}
                                      ,{' '}
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
                                this.state.reviewData.quotationTool.finalTotal}
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
              </Modal.Body>
            </Modal>
            <Footer pageTitle={permissionConstant.footer_title.rfq_approval} />
          </div>
        ) : null}
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
      actionPendingApprovalPartList,
      approveRejectPart,
      actionUploadImage,
      actionUploadSpecification,
      actionUpdatePart,
      actionDeleteRevisionImage,
      actionDeletePartDatabase,
      actionCommentDetail,
      actionSubmitComment
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
)(RFQApproval);
