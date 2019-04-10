import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import styled from 'styled-components';
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  Table,
  ControlLabel,
  Modal,
  DropdownButton,
  Glyphicon
} from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
// import * as Datetime from 'react-datetime';
//import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import validation from 'react-validation-mixin';
import strategy, { validator } from 'react-validatorjs-strategy';
import { Link } from 'react-router-dom';
import 'react-datetime/css/react-datetime.css';
import * as moment from 'moment';

import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import Sprite from '../../img/sprite.svg';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import Home from '../home/home';
import {
  actionUserLogout,
  actionLoaderHide,
  actionLoaderShow,
  actionGetProjectList,
  actionAddProject,
  actionUploadImage,
  actionUploadSpecification,
  actionAddParts,
  actionCreatePartWithMedia,
  actionClearAddPartData,
  actionTabData,
  actionDeleteRevisionImage,
  actionAddSpecificationList,
  actionDeletePartDatabase
} from '../../common/core/redux/actions';
import CONSTANTS from '../../common/core/config/appConfig';
import {
  renderMessage,
  showErrorToast,
  topPosition,
  ZoomInAndOut,
  convertToTimeStamp
} from '../../common/commonFunctions';
import customConstant from '../../common/core/constants/customConstant';
import Footer from '../common/footer';
import { handlePermission } from '../../common/permissions';
import socketIOClient from 'socket.io-client';
import _ from 'lodash';

let { permissionConstant } = CONSTANTS;
let { validationMessages } = CONSTANTS;
let { regExpressions } = CONSTANTS;

const options = [
  { label: 'Thing 1', value: 1 },
  { label: 'Thing 2', value: 2 }
];

/* Disable past date */
// const yesterday = Datetime.moment().subtract(1, 'day');
// const valid = function(current) {
//   return current.isAfter(yesterday);
// };
let socket;
class AddPart extends Component {
  constructor(props) {
    super(props);
    socket = socketIOClient.connect(
      customConstant.webNotificationURL.node_server_URL
    );
    this.partObject = {};
    this.state = {
      showCreateProject: false,
      projectCode: '',
      projectTitle: '',
      totalPartsPlanned: '',
      selectedProjectInfo: {},
      selectedProjectId: '',
      partList: [],
      tabKey: 'second',
      uploadedDesignList: '',
      uploadedSpecificationList: '',
      extraPartArray: [{ ...this.partObject }, { ...this.partObject }],
      selectedDesigns: '',
      type: '',
      disableSave: true,
      dateArray: [
        [
          { dateDisable: false },
          { dateDisable: true },
          { dateDisable: true },
          { dateDisable: true }
        ]
      ]
    };

    this.numberOfPartialShipment = [1, 2, 3, 4];
    this.uplodFileData = {}; // Store file data read by reader

    this.fetchShipmentData = this.fetchShipmentData.bind(this);
    this.handleSaveParts = this.handleSaveParts.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCreatePartWithMedia = this.handleCreatePartWithMedia.bind(this);
    this.handleCreateProject = this.handleCreateProject.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnChangePartDetails = this.handleOnChangePartDetails.bind(this);
    this.handleOnChangeShipment = this.handleOnChangeShipment.bind(this);
    this.handleUploadDesign = this.handleUploadDesign.bind(this);
    this.handleUploadSpecification = this.handleUploadSpecification.bind(this);
    this.toggleCreateProject = this.toggleCreateProject.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.addPartConfirmation = this.addPartConfirmation.bind(this);
    this.handleCloseModel = this.handleCloseModel.bind(this);
    this.deleteDesign = this.deleteDesign.bind(this);
    this.deleteSpecification = this.deleteSpecification.bind(this);
    this.applyValidation = this.applyValidation.bind(this);
    this.handleSpecificationFile = this.handleSpecificationFile.bind(this);
    this.handleApproverSelectedOption = this.handleApproverSelectedOption.bind(
      this
    );
    this.handleSpecificationSelectedOption = this.handleSpecificationSelectedOption.bind(
      this
    );
  }

  componentDidMount() {
    let _this = this;
    const roleId = this.props.userInfo.userData.userRole;
    const userId = this.props.userInfo.userData.id;
    const data = {
      roleId,
      userId
    };
    this.props.actionLoaderShow();
    this.props
      .actionGetProjectList(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    let partList = this.state.partList || [];
    partList &&
      this.state.partList.forEach(function(element, index) {
        element.listOfUnUsedSpecifications.forEach(function(elementSpc, i) {
          if (element.partNumber === elementSpc.mediaName.split('.')[0]) {
            let partListUpdate = _this.state.partList;
            let partListUpdateJson = JSON.parse(
              JSON.stringify(partListUpdate[index])
            );
            let partListUpdateJsonUnUsedSpecifications =
              partListUpdateJson.listOfUnUsedSpecifications[1];
            partListUpdateJsonUnUsedSpecifications.isDisabled = true;
            partListUpdateJson.listOfUnUsedSpecifications[1] = partListUpdateJsonUnUsedSpecifications;
            partListUpdate[index] = partListUpdateJson;
            _this.setState({ partList: partListUpdate });
          } else {
            let partListUpdate = _this.state.partList;
            let partListUpdateJson = JSON.parse(
              JSON.stringify(partListUpdate[index])
            );
            let partListUpdateJsonUnUsedSpecifications =
              partListUpdateJson.listOfUnUsedSpecifications[1];
            partListUpdateJsonUnUsedSpecifications.isDisabled = false;
            partListUpdateJson.listOfUnUsedSpecifications[1] = partListUpdateJsonUnUsedSpecifications;
            partListUpdate[index] = partListUpdateJson;
            _this.setState({ partList: partListUpdate });
          }
          partList[index].listOfUnUsedSpecifications[i].isDisabled =
            _this.state.partList[index].listOfUnUsedSpecifications[
              i
            ].isDisabled;
        });
      });
    this.setState({ partList: partList });
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   partList: nextProps.supplierParts.partList
    // });
    let part_list = nextProps.supplierParts.partList.reduce((prev, next) => {
      if (typeof prev[next.partNumber] === 'undefined') {
        prev[next.partNumber] = [];
      }
      prev[next.partNumber].push(next);
      return prev;
    }, {});
    let partList = [];
    Object.keys(part_list).forEach(i => {
      let list_array = part_list[i];
      partList.push(list_array[0]);
    });
    this.setState({
      partList: partList
    });

    let listOfSuppliers = this.state.listOfSuppliers || [];
    let specificationList = this.state.specificationList || [];
    let listOfApprovers = this.state.listOfApprovers || [];
    partList.forEach(function(element, index) {
      listOfSuppliers[index] = element.listOfSuppliers;
      specificationList[index] = element.listOfUnUsedSpecifications;
      listOfApprovers[index] = element.approvalList;
    });

    this.setState({
      listOfSuppliers: listOfSuppliers,
      specificationList: specificationList,
      listOfApprovers: listOfApprovers
    });

    let options = [];
    let arrayLength = listOfSuppliers[0] && listOfSuppliers[0].length;
    let listOfSuppliersLength = listOfSuppliers.length || 0;
    for (let i = 0; i < listOfSuppliersLength; i++) {
      options.push([]);
      for (let k = 0; k < arrayLength; k++) {
        options[i].push({ label: '', value: '' });
      }
    }
    this.state.listOfSuppliers &&
      this.state.listOfSuppliers.forEach(function(element, index) {
        element &&
          element.forEach(function(elem, elemIndex) {
            options[index][elemIndex].label = elem.companyName;
            options[index][elemIndex].value = elem.id;
          });
      });
    this.setState({
      options: options
    });

    let approverOptions = [];
    let approverArrayLength = listOfApprovers[0] && listOfApprovers[0].length;
    let listOfApproversLength = listOfApprovers.length || 0;
    for (let i = 0; i < listOfApproversLength; i++) {
      approverOptions.push([]);
      for (let k = 0; k < approverArrayLength; k++) {
        approverOptions[i].push({ label: '', value: '' });
      }
    }
    this.state.listOfApprovers &&
      this.state.listOfApprovers.forEach(function(element, index) {
        element &&
          element.forEach(function(elem, elemIndex) {
            approverOptions[index][elemIndex].label = elem.fullName;
            approverOptions[index][elemIndex].value = elem.id;
          });
      });
    this.setState({
      approverOptions: approverOptions
    });

    let secpeificationData = [];
    let arraySecpeificationLength =
      specificationList[0] && specificationList[0].length;
    let listOfSecpeificationLength = specificationList.length || 0;
    for (let i = 0; i < listOfSecpeificationLength; i++) {
      secpeificationData.push([]);
      for (let k = 0; k < arraySecpeificationLength; k++) {
        secpeificationData[i].push({ label: '', value: '' });
      }
    }
    this.state.specificationList &&
      this.state.specificationList.forEach(function(element, index) {
        element &&
          element.forEach(function(elem, elemIndex) {
            secpeificationData[index][elemIndex].label = elem.mediaName;
            secpeificationData[index][elemIndex].value = elem;
          });
      });
    this.setState({
      secpeificationData: secpeificationData
    });

    let _this = this;
    partList &&
      this.state.partList.forEach(function(element, index) {
        element.listOfUnUsedSpecifications &&
          element.listOfUnUsedSpecifications.forEach(function(elementSpc, i) {
            if (element.partNumber === elementSpc.mediaName.split('.')[0]) {
              if (
                partList[index] &&
                partList[index].listOfUnUsedSpecifications[i]
              ) {
                partList[index].listOfUnUsedSpecifications[i].isDisabled = true;
                partList[index].listOfUnUsedSpecifications[i].isSelected = true;
                _this.setState({ partList: partList });
              }
            } else {
              let obj = _this.state.partList.find(
                o => o.partNumber === elementSpc.mediaName.split('.')[0]
              );
              if (
                obj &&
                partList[index] &&
                partList[index].listOfUnUsedSpecifications[i]
              ) {
                partList[index].listOfUnUsedSpecifications[i].isDisabled = true;
                partList[index].listOfUnUsedSpecifications[
                  i
                ].isSelected = false;
                _this.setState({ partList: partList });
              }
            }
          });
        element.dateArray = [
          { dateDisable: false },
          { dateDisable: true },
          { dateDisable: true },
          { dateDisable: true }
        ];
      });
  }

  applyValidation(actionType) {
    let _this = this;

    let fieldObject = {};
    let errorMessage = {};
    switch (actionType) {
      case 'createProject':
        fieldObject = {
          projectTitle: ['required', 'regex:' + regExpressions.alphaOnly],
          projectCode: ['required', 'regex:' + regExpressions.alphaOnly],
          totalPartsPlanned: ['required', 'regex:' + regExpressions.numberOnly]
        };
        errorMessage = {
          'required.projectTitle': validationMessages.projectTitle.required,
          'regex.projectTitle': validationMessages.projectTitle.alphaOnly,
          'required.projectCode': validationMessages.projectCode.required,
          'regex.projectCode': validationMessages.projectCode.alphaOnly,
          'required.totalPartsPlanned':
            validationMessages.totalPartsPlanned.required,
          'regex.totalPartsPlanned':
            validationMessages.totalPartsPlanned.numberOnly
        };
        break;
      default:
        break;
    }
    this.validatorTypes = strategy.createInactiveSchema(
      fieldObject,
      errorMessage
    );
  }

  validateData = (e, actionType) => {
    this.applyValidation(actionType);
    e.preventDefault();
    let _this = this;
    this.props.validate(function(error) {
      if (!error) {
        switch (actionType) {
          case 'addParts':
            _this.handleSaveParts();
            break;
          case 'createProject':
            _this.handleCreateProject();
            break;
          default:
            break;
        }
      }
    });
  };

  getValidatorData = () => {
    return this.state;
  };

  navigateToRFQ(data) {
    this.props.actionTabData(data);
  }

  handleSpecificationFile(event, data) {
    window.open(data.mediaURL);
  }

  fetchShipmentData(partDetails, keyName, shipmentIndex) {
    try {
      return partDetails['listOfPartialShipment'][shipmentIndex][keyName];
    } catch (error) {
      return '';
    }
  }

  handleSaveParts() {
    const buyerUserDetailsId = this.props.userInfo.userData.id;
    const projectId = this.state.selectedProjectId;
    const roleId = this.props.userInfo.userData.userRole;
    const partMedia = this.props.supplierParts.uploadedDesignList;
    let data = [];
    for (let index = 0; index < this.state.partList.length; index++) {
      let element = Object.assign({}, this.state.partList[index]);

      let dataElement = {
        partId: element.id,
        roleId,
        partNumber: element.partNumber || '',
        partDescription: element.partDescription || '',
        // specificationNo: element.specificationNo | '',
        partRevisionNumber: element.partRevisionNumber || '',
        quantity: element.quantity || '',
        units: element.units || '',
        usage: element.usage || '',
        commodity: element.commodity || '',
        hsnCode: element.hsnCode || '',
        // deliveryAddress: element.deliveryAddress || '',
        packagingDeliveryConditions: element.packagingDeliveryConditions || '',
        targetDate: convertToTimeStamp(element.targetDate),
        listOfPartialShipment: [],
        projectId,
        buyerUserDetailsId,
        supplierStarRating: element.supplierStarRating || 0,
        supplierLocation: element.supplierLocation || '',
        production: element.production || '',
        requestFromNewSupplier: !!element.requestFromNewSupplier,
        remarks: element.remarks || '',
        // suppliersToSendQuotations:
        //   this.state.suppToSend && this.state.suppToSend[index],
        listOfApprovers: element.approvalList || [],
        specificationList: element.listOfUnUsedSpecifications || []
      };
      let deliveryAddressRequest = {
        address: element.deliveryAddress,
        state: element.deliveryAddressState,
        country: element.deliveryAddressCountry
      };
      dataElement.deliveryAddressRequest = deliveryAddressRequest;

      //Code to parse partial shipment and convert date into timestamp value
      if (element.listOfPartialShipment) {
        for (
          let indexShipment = 0;
          indexShipment < element.listOfPartialShipment.length;
          indexShipment++
        ) {
          const elementShipment = element.listOfPartialShipment[indexShipment];
          if (elementShipment.shipmentTargetDate) {
            elementShipment.shipmentTargetDate = convertToTimeStamp(
              elementShipment.shipmentTargetDate
            );
          }
        }
      } else {
        element.listOfPartialShipment = [];
      }
      dataElement.listOfPartialShipment = element.listOfPartialShipment;
      data.push(dataElement);
    }
    this.props.actionLoaderShow();
    let _this = this;
    this.props
      .actionAddParts(data)
      .then((result, error) => {
        if (result.payload.data.status === 200) {
          //let notificationLen = _this.props.supplierParts.notificationResponse+1;
          let notificationLen = _this.props.supplierParts.notificationResponse;
          let socketData = {
            notificationCount: notificationLen,
            notificationId: result.payload.data.resourceData
          };

          socket.emit('new-message', socketData);
        }

        _this.props.actionLoaderHide();
        if (error) return;
        _this.props.actionClearAddPartData();
        _this.props.history.push('home');
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleCancel() {
    this.props.history.push('home');
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleCreatePartWithMedia() {
    this.setState({
      showApproveModal: false,
      selectedDesigns: 'upload'
    });
    let _this = this;
    const roleId = this.props.userInfo.userData.userRole;
    // const partList = this.props.supplierParts.uploadedDesignList;
    // const specList = this.props.supplierParts.uploadedSpecificationList;
    const partList = this.state.uploadedDesignList;
    const specList = this.state.uploadedSpecificationList;
    let uploadedList;
    let type = this.state.type;

    if (type === 'designs') {
      uploadedList = [...partList];
    } else if (type === 'specification') {
      uploadedList = [...specList];
    }

    let data = {
      projectId: this.state.selectedProjectId,
      creatorUserId: this.props.userInfo.userData.id,
      roleId: roleId,
      listOfPartMediaRequest: uploadedList
    };

    if (type === 'designs') {
      this.props.actionLoaderShow();
      this.props
        .actionCreatePartWithMedia(data)
        .then((result, error) => {
          let partNumberList = [];
          let reportArray = result.payload.data;

          let idList = reportArray.resourceData.map(function(item) {
            return partNumberList.push(item.id);
          });

          this.setState({
            partNumberList: partNumberList,
            disableSave: false
          });

          uploadedList && uploadedList.length == 1
            ? this.state.extraPartArray.pop()
            : '';
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else if (type === 'specification') {
      let newArray = [];
      let lookupObject = {};
      let originalArray = this.state.uploadedSpecificationList;
      for (var i in originalArray) {
        lookupObject[originalArray[i]['mediaName']] = originalArray[i];
      }

      for (i in lookupObject) {
        newArray.push(lookupObject[i]);
      }
      newArray;
      let data = {
        userId: _this.props.userInfo.userData.id,
        roleId: _this.props.userInfo.userData.userRole,
        listOfPartId: _this.state.partNumberList,
        //listOfSpecificationRequest: this.state.specificationListArray
        listOfSpecificationRequest: newArray
      };
      this.props
        .actionAddSpecificationList(data)
        .then((result, error) => {})
        .catch();
    }
  }

  handleCreateProject() {
    let _this = this;
    const { projectCode } = this.state;
    const { projectTitle } = this.state;
    const { totalPartsPlanned } = this.state;
    const creatorId = this.props.userInfo.userData.id;
    this.props.actionLoaderShow();
    this.props
      .actionAddProject({
        projectCode,
        projectTitle,
        creatorId,
        totalPartsPlanned
      })
      .then((result, error) => {
        _this.props.actionLoaderHide();
        if (error) return;
        try {
          //Set create projectId to show in selection list
          if (result.payload.data.resourceId)
            _this.setState({
              selectedProjectId: result.payload.data.resourceId
            });
          // To again populate project list
          const roleId = this.props.userInfo.userData.userRole;
          const userId = this.props.userInfo.userData.id;
          const data = {
            roleId,
            userId
          };
          this.props.actionLoaderShow();
          this.props
            .actionGetProjectList(data)
            .then((result, error) => {
              _this.props.actionLoaderHide();
            })
            .catch(e => _this.props.actionLoaderHide());
          // To again populate project list
        } catch (error) {}
        _this.setState({
          projectCode: '',
          projectTitle: '',
          totalPartsPlanned: '',
          showCreateProject: false
        });
        _this.props.actionGetProjectList();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleOnChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }
  handleOnChangePartDetails(event, index) {
    const { name, value } = event.target;
    if (name === 'quantity') {
      const regExp = new RegExp(regExpressions.numberOnly);
      if (!regExp.test(value) && value) {
        event.target.value = '';
        return;
      }
    }
    this.setState((prevState, props) => {
      prevState.partList[index][name] = value;
      return { partList: prevState.partList };
    });
  }
  handleOnChangeShipment(event, index, shipmentIndex) {
    const { name, value } = event.target;
    let partListForDate = this.state.partList;
    if (name === 'shipmentTargetDate') {
      let dateArray = this.state.dateArray;
      if (shipmentIndex === 0 || shipmentIndex < 3) {
        //dateArray[shipmentIndex + 1].dateDisable = false;
        partListForDate[index]['dateArray'][
          shipmentIndex + 1
        ].dateDisable = false;
      } else if (shipmentIndex === 3) {
        //dateArray[shipmentIndex].dateDisable = false;
        partListForDate[index]['dateArray'][shipmentIndex].dateDisable = false;
      }
      this.setState({ partList: partListForDate });
    }

    this.setState(
      (prevState, props) => {
        if (!prevState.partList[index]['listOfPartialShipment'])
          prevState.partList[index]['listOfPartialShipment'] = [];
        if (
          prevState.partList[index]['listOfPartialShipment'].length <
          shipmentIndex + 1
        ) {
          prevState.partList[index]['listOfPartialShipment'].push({
            shipmentQty: '',
            shipmentTargetDate: ''
          });
        }
        if (
          prevState.partList[index]['listOfPartialShipment'] &&
          prevState.partList[index]['listOfPartialShipment'][shipmentIndex]
        )
          prevState.partList[index]['listOfPartialShipment'][shipmentIndex][
            name
          ] = value;

        return { partList: prevState.partList };
      },
      () => {
        let partList = this.state.partList;
        if (name === 'shipmentTargetDate') {
          for (
            let i = 0;
            i < partList[index].listOfPartialShipment.length;
            i++
          ) {
            for (
              let j = i + 1;
              j < partList[index].listOfPartialShipment.length;
              j++
            ) {
              if (
                partList[index].listOfPartialShipment[i].shipmentTargetDate >
                  partList[index].listOfPartialShipment[j].shipmentTargetDate &&
                partList[index].listOfPartialShipment[j].shipmentTargetDate !=
                  ''
              ) {
                showErrorToast(validationMessages.part.shipmentError);
                if (
                  partList[index]['listOfPartialShipment'] &&
                  partList[index]['listOfPartialShipment'][shipmentIndex]
                )
                  partList[index]['listOfPartialShipment'][shipmentIndex][
                    name
                  ] = '';
                this.setState({ partList: partList });
                return;
              }
            }
          }
        }
      }
    );
  }

  handleLogout() {
    try {
      const roleId = this.props.userInfo.userData.userRole;
      const userId = this.props.userInfo.userData.id;
      this.props.actionUserLogout({ roleId, userId });
    } catch (error) {}
  }

  toggleCreateProject() {
    this.setState(prevState => {
      return { showCreateProject: !prevState.showCreateProject };
    });
  }

  handleUploadDesign(event) {
    // const fileObject = event.target.files[0];
    let filesLength = event.target.files.length;
    let _this = this;

    for (let j = 0; j < filesLength; j++) {
      let fileObject = event.target.files[j];
      if (fileObject) {
        // console.log("fileObject.name", fileObject.name);
        // let specChar = fileObject.name.match(/[!@#$%^&*(),.?":{}|<>]/g)
        //   ? true
        //   : false;
        // console.log("specChar", specChar);

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
            if (result.payload.data.status === 400) {
              showErrorToast(result.payload.data.responseMessage);
            } else {
              this.setState({
                uploadedDesignList: _this.props.supplierParts.uploadedDesignList
              });
            }
            _this.props.actionLoaderHide();
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
            let reportArray = result.payload.data;
            var reqObject = {};
            let mediaExtension = reportArray.filePath.split('.').pop(-1);
            reqObject['mediaName'] = reportArray.filePath;
            reqObject['mediaURL'] = reportArray.s3FilePath;
            reqObject['mediaSize'] = reportArray.fileSize;
            reqObject['mediaExtension'] = mediaExtension;
            reqObject['mediaType'] = reportArray.contentType;
            reqObject['isDeleted'] = false;
            reqArray.push(reqObject);
            _this.props.actionLoaderHide();

            this.setState({
              uploadedSpecificationList:
                _this.props.supplierParts.uploadedSpecificationList
            });
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
    const roleId = this.props.userInfo.userData.userRole;
    const userId = this.props.userInfo.userData.id;

    this.state.uploadedDesignList.forEach(function(item, index) {
      if (item.mediaName === path) {
        s3FilePath = item.mediaURL;
      }
    });
    this.props
      .actionDeleteRevisionImage(s3FilePath)
      .then((result, error) => {
        _this.state.uploadedDesignList.forEach(function(item, index) {
          let uploadedDesignList = _this.state.uploadedDesignList;
          if (item.mediaName === path) {
            uploadedDesignList.splice(index, 1);
            _this.setState({
              uploadedDesignList: uploadedDesignList
            });
          }
        });
      })
      .catch();

    if (this.state.partList && this.state.partList.length > 0) {
      let delete_id = _.result(
        _.find(this.state.partList, function(obj) {
          let mediaExtension =
            obj.partMediaResponses[0] && obj.partMediaResponses[0].mediaName;
          return mediaExtension === path;
        }),
        'id'
      );

      let data = {
        roleId,
        userId,
        partId: delete_id,
        mediaUrl: s3FilePath
      };
      _this.props
        .actionDeletePartDatabase(data)
        .then((result, error) => {
          _.remove(this.state.partList, function(currentObject) {
            let mediaExtension =
              currentObject.partMediaResponses[0] &&
              currentObject.partMediaResponses[0].mediaName;
            return mediaExtension === path;
          });
          let partList = this.state.partList;
          this.setState({ part_list: partList, partList: partList });
        })
        .catch();
    }
  }
  deleteSpecification(event, index, path) {
    let _this = this;
    let s3FilePath = '';
    //event.target.files
    this.state.uploadedSpecificationList.forEach(function(item, index) {
      if (item.mediaName === path) {
        s3FilePath = item.mediaURL;
      }
    });
    this.props
      .actionDeleteRevisionImage(path)
      .then((result, error) => {
        _this.state.uploadedSpecificationList.forEach(function(item, index) {
          let uploadedSpecificationList = _this.state.uploadedSpecificationList;
          if (item.mediaName === path) {
            uploadedSpecificationList.splice(index, 1);
            _this.setState({
              uploadedSpecificationList: uploadedSpecificationList
            });
          }
        });
      })
      .catch();
  }

  handleSelectedOption(index, data) {
    let suppArray = this.state.suppArray || [];
    suppArray[index] = data;
    this.setState({ suppArray: suppArray });

    let suppToSend = [];
    let listOfSuppliersLength = suppArray.length || 0;
    let arrayLength = suppArray[0] && suppArray[0].length;

    for (let i = 0; i < listOfSuppliersLength; i++) {
      suppToSend.push([]);
      for (let k = 0; k < arrayLength; k++) {
        suppToSend[i].push('');
      }
    }

    suppArray &&
      suppArray.forEach(function(element, index) {
        element &&
          element.forEach(function(elem, elemIndex) {
            suppToSend[index][elemIndex] = elem.value;
          });
      });
    this.setState({ suppToSend: Object.assign([], suppToSend) });
  }

  handleApproverSelectedOption11(index, data) {
    let apprArray = this.state.apprArray || [];
    apprArray[index] = data;
    this.setState({ apprArray: apprArray });

    let approverToSend = [];
    let listOfApproversLength = apprArray.length || 0;
    let arrayLength = apprArray[0] && apprArray[0].length;

    for (let i = 0; i < listOfApproversLength; i++) {
      approverToSend.push([]);
      for (let k = 0; k < arrayLength; k++) {
        approverToSend[i].push('');
      }
    }

    apprArray &&
      apprArray.forEach(function(element, index) {
        element &&
          element.forEach(function(elem, elemIndex) {
            approverToSend[index][elemIndex] = elem.value;
          });
      });
    this.setState({ approverToSend: Object.assign([], approverToSend) });
  }

  handleApproverSelectedOption(event, data, mainindex, subIndex) {
    let _this = this;
    let partListUpdate = _this.state.partList;
    let partListUpdateJson = JSON.parse(
      JSON.stringify(partListUpdate[mainindex])
    );
    let partListUpdateJsonUnUsedSpecifications =
      partListUpdateJson.approvalList[subIndex];
    partListUpdateJsonUnUsedSpecifications.isSelected = true;
    partListUpdateJson.approvalList[
      subIndex
    ] = partListUpdateJsonUnUsedSpecifications;
    partListUpdate[mainindex] = partListUpdateJson;
    _this.setState({ partList: partListUpdate });
  }

  handleSpecificationSelectedOption(event, data, mainindex, subIndex) {
    const selected = event.target.checked;

    let _this = this;
    let partList = this.state.partList;

    if (selected) {
      let partListUpdate = _this.state.partList;
      let partListUpdateJson = JSON.parse(
        JSON.stringify(partListUpdate[mainindex])
      );
      let partListUpdateJsonUnUsedSpecifications =
        partListUpdateJson.listOfUnUsedSpecifications[subIndex];
      partListUpdateJsonUnUsedSpecifications.isSelected = true;
      partListUpdateJson.listOfUnUsedSpecifications[
        subIndex
      ] = partListUpdateJsonUnUsedSpecifications;
      partListUpdate[mainindex] = partListUpdateJson;
      _this.setState({ partList: partListUpdate });

      this.state.partList.forEach(function(element, index) {
        element.listOfUnUsedSpecifications &&
          element.listOfUnUsedSpecifications.forEach(function(elementSpc, i) {
            if (data.mediaName === elementSpc.mediaName) {
              if (parseInt(mainindex) === parseInt(index)) {
                let partListUpdate = _this.state.partList;
                let partListUpdateJson = JSON.parse(
                  JSON.stringify(partListUpdate[mainindex])
                );
                let partListUpdateJsonUnUsedSpecifications =
                  partListUpdateJson.listOfUnUsedSpecifications[subIndex];
                partListUpdateJsonUnUsedSpecifications.isSelected = true;
                partListUpdateJsonUnUsedSpecifications.isDisabled = false;
                partListUpdateJson.listOfUnUsedSpecifications[
                  subIndex
                ] = partListUpdateJsonUnUsedSpecifications;
                partListUpdate[mainindex] = partListUpdateJson;
                _this.setState({ partList: partListUpdate });
              } else {
                let partListUpdate = _this.state.partList;
                let partListUpdateJson = JSON.parse(
                  JSON.stringify(partListUpdate[index])
                );
                let partListUpdateJsonUnUsedSpecifications =
                  partListUpdateJson.listOfUnUsedSpecifications[i];
                partListUpdateJsonUnUsedSpecifications.isSelected = false;
                partListUpdateJsonUnUsedSpecifications.isDisabled = true;

                partListUpdateJson.listOfUnUsedSpecifications[
                  i
                ] = partListUpdateJsonUnUsedSpecifications;
                partListUpdate[index] = partListUpdateJson;
                _this.setState({ partList: partListUpdate });
              }
            } else {
            }
          });
      });
    } else {
      let partListUpdate = _this.state.partList;
      let partListUpdateJson = JSON.parse(
        JSON.stringify(partListUpdate[mainindex])
      );
      let partListUpdateJsonUnUsedSpecifications =
        partListUpdateJson.listOfUnUsedSpecifications[subIndex];
      partListUpdateJsonUnUsedSpecifications.isSelected = false;
      partListUpdateJson.listOfUnUsedSpecifications[
        subIndex
      ] = partListUpdateJsonUnUsedSpecifications;
      partListUpdate[mainindex] = partListUpdateJson;
      _this.setState({ partList: partListUpdate });

      this.state.partList.forEach(function(element, index) {
        element.listOfUnUsedSpecifications &&
          element.listOfUnUsedSpecifications.forEach(function(elementSpc, i) {
            if (data.mediaName === elementSpc.mediaName) {
              if (parseInt(mainindex) === parseInt(index)) {
                let partListUpdate = _this.state.partList;
                let partListUpdateJson = JSON.parse(
                  JSON.stringify(partListUpdate[mainindex])
                );
                let partListUpdateJsonUnUsedSpecifications =
                  partListUpdateJson.listOfUnUsedSpecifications[subIndex];
                partListUpdateJsonUnUsedSpecifications.isSelected = false;
                partListUpdateJsonUnUsedSpecifications.isDisabled = false;
                partListUpdateJson.listOfUnUsedSpecifications[
                  subIndex
                ] = partListUpdateJsonUnUsedSpecifications;
                partListUpdate[mainindex] = partListUpdateJson;
                _this.setState({ partList: partListUpdate });
              } else {
                let partListUpdate = _this.state.partList;
                let partListUpdateJson = JSON.parse(
                  JSON.stringify(partListUpdate[index])
                );
                let partListUpdateJsonUnUsedSpecifications =
                  partListUpdateJson.listOfUnUsedSpecifications[i];
                partListUpdateJsonUnUsedSpecifications.isSelected = false;
                partListUpdateJsonUnUsedSpecifications.isDisabled = false;

                partListUpdateJson.listOfUnUsedSpecifications[
                  i
                ] = partListUpdateJsonUnUsedSpecifications;
                partListUpdate[index] = partListUpdateJson;
                _this.setState({ partList: partListUpdate });
              }
            } else {
            }
          });
      });
    }
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === 'first') this.props.history.push('home');
    if (tabKey === 'third')
      this.props.history.push({ pathname: 'home', state: { path: 'third' } });
    this.setState({ tabKey: tabKey });
  }
  handleCloseModel() {
    this.setState({ showApproveModal: false, type: '' });
  }
  addPartConfirmation(type) {
    this.setState({
      showApproveModal: true,
      type: type
    });
  }

  findCoordinate(e) {
    const targetElement = e.target.getBoundingClientRect();
    let cssContainer = document.getElementById('dateTimeCss');
    if (cssContainer && cssContainer.innerHTML == '')
      cssContainer.innerHTML =
        '.rdtPicker { left: ' + targetElement['x'] + 'px }';
  }

  resetCoordinate(e) {
    let cssContainer = document.getElementById('dateTimeCss');
    if (cssContainer) cssContainer.innerHTML = '';
  }

  render() {
    return (
      <div>
        ><Header {...this.props} />
        <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
        <SideBar
          activeTabKey={this.state.tabKey === 'second' ? 'second' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        <div className="content-body flex">
          {this.state.tabKey === 'second' ? (
            <div className="content">
              {/* <div className="c-1200 m-auto"> */}
              <div className="container">
                {/* <div className="m-b-50">
                  <Breadcrumb className="style-breadcrumb">
                    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="http://getbootstrap.com/components/#breadcrumbs">
                      Approve Quotation
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Submit Quotation</Breadcrumb.Item>
                  </Breadcrumb>
                </div> */}
                <h4 className="hero-title">Request for Purchase</h4>
                <div
                  className={`border-around border-light m-b-50 p-30 ${
                    this.state.showCreateProject ? 'hide' : ''
                  }`}
                >
                  <Row className="show-grid">
                    <Col md={12}>
                      <label>Select From Existing Projects</label>
                      <div className="flex align-center">
                        <FormGroup
                          controlId="formControlsSelect"
                          className="flex-1 m-b-0 "
                        >
                          <FormControl
                            className="h-42 br-0"
                            componentClass="select"
                            placeholder="select"
                            value={this.state.selectedProjectId}
                            name="selectedProjectId"
                            onChange={this.handleOnChange}
                          >
                            <option value="">Select</option>
                            {this.props.supplierParts.projectList.map(
                              (item, index) => {
                                return (
                                  <option value={item.id} key={item.id}>
                                    {item.projectCode} &nbsp; | &nbsp;{' '}
                                    {item.projectTitle} &nbsp; | &nbsp;{' '}
                                    {item.totalPartsPlanned}
                                  </option>
                                );
                              }
                            )}
                          </FormControl>
                        </FormGroup>
                        <span className="or">OR</span>
                        <div className="flex-1">
                          <button
                            className="btn btn-primary text-uppercase btn-block btn-md"
                            onClick={this.toggleCreateProject}
                          >
                            create a new project
                          </button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div
                  className={`noIco-form m-b-50 ${
                    this.state.showCreateProject ? '' : 'hide'
                  }`}
                >
                  <div className="border-around border-light padding-set">
                    <Row className="show-grid">
                      <Col md={4}>
                        <FormGroup
                          className="group m-b-0"
                          controlId="formBasicText"
                        >
                          <FormControl
                            type="text"
                            name="projectCode"
                            required
                            value={this.state.projectCode}
                            onChange={this.handleOnChange}
                          />
                          <FormControl.Feedback />
                          <span className="highlight" />
                          <span className="bar" />
                          <ControlLabel>Project Code</ControlLabel>
                          {renderMessage(
                            this.props.getValidationMessages('projectCode')
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup
                          className="group m-b-0"
                          controlId="formBasicText"
                        >
                          <FormControl
                            type="text"
                            name="projectTitle"
                            required
                            value={this.state.projectTitle}
                            onChange={this.handleOnChange}
                          />
                          <FormControl.Feedback />
                          <span className="highlight" />
                          <span className="bar" />
                          <ControlLabel>Project Title</ControlLabel>
                          {renderMessage(
                            this.props.getValidationMessages('projectTitle')
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup
                          className="group m-b-0"
                          controlId="formBasicText"
                        >
                          <FormControl
                            type="text"
                            name="totalPartsPlanned"
                            required
                            value={this.state.totalPartsPlanned}
                            onChange={this.handleOnChange}
                          />
                          <FormControl.Feedback />
                          <span className="highlight" />
                          <span className="bar" />
                          <ControlLabel>Total New Parts Planned</ControlLabel>
                          {renderMessage(
                            this.props.getValidationMessages(
                              'totalPartsPlanned'
                            )
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <div className="text-center m-t-20">
                    <button
                      className="btn btn-default text-uppercase"
                      // onClick={this.handleCreateProject}
                      onClick={event =>
                        this.validateData(event, 'createProject')
                      }
                    >
                      create
                    </button>
                    <button
                      className="btn btn-success text-uppercase"
                      onClick={this.toggleCreateProject}
                    >
                      cancel
                    </button>
                  </div>
                </div>
              </div>

              <hr className="bg-divider m-b-30" />

              {/* <div className="c-1200 m-auto"> */}
              <div className="container">
                <h4 className="hero-title text-center">Upload Files</h4>

                <Row className="show-grid center-gap">
                  <Col md={6}>
                    {/* <h4 className="hero-title">Upload Designs </h4> */}
                    <div className="gray-card dash-border up-padd">
                      <ul className="upload-list b-btm">
                        {this.state.uploadedDesignList &&
                          this.state.uploadedDesignList.map(
                            (designItem, index) => {
                              return (
                                <li className="flex justify-space-between align-center">
                                  <span>
                                    <img
                                      src={
                                        customConstant.amazonURL +
                                        designItem.mediaURL
                                      }
                                    />
                                    {designItem.mediaName}
                                  </span>

                                  {/* <span
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
                                      <use xlinkHref={`${Sprite}#delete1Ico`} />
                                    </svg>
                                  </span> */}
                                  <Glyphicon
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.deleteDesign(
                                        e,
                                        index,
                                        designItem.mediaName
                                      )
                                    }
                                    glyph="trash"
                                  />
                                </li>
                              );
                            }
                          )}
                      </ul>

                      <div className="text-center">
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
                            disabled={this.state.selectedProjectId == ''}
                            // help="Example block-level help text here."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-center m-t-40">
                      <button
                        className="btn btn-success text-uppercase"
                        onClick={() => {
                          this.addPartConfirmation('designs');
                        }}
                        disabled={
                          this.state.selectedProjectId == '' ||
                          !this.state.uploadedDesignList.length
                        }
                      >
                        add Designs
                      </button>
                    </div>
                  </Col>
                  <Col md={6}>
                    {/* <h4 className="hero-title">Upload Specifications</h4> */}
                    <div className="gray-card up-padd dash-border">
                      <ul className="upload-list b-btm">
                        {this.state.uploadedSpecificationList &&
                          this.state.uploadedSpecificationList.map(
                            (designItem, index) => {
                              return (
                                <li className="flex justify-space-between align-center">
                                  <span>
                                    {designItem.mediaType ===
                                      'application/octet-stream' ||
                                    designItem.mediaType ===
                                      'application/vnd.ms-excel' ? (
                                      <img src={xlsImage} />
                                    ) : designItem.mediaType ===
                                      'application/pdf' ? (
                                      <img src={pdfImage} />
                                    ) : (
                                      <img src={docImage} />
                                    )}
                                    {designItem.mediaName}
                                  </span>

                                  {/* <span
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
                                      <use xlinkHref={`${Sprite}#deleteIco`} />
                                    </svg>
                                  </span> */}

                                  <Glyphicon
                                    className="cursor-pointer"
                                    onClick={e =>
                                      this.deleteSpecification(
                                        e,
                                        index,
                                        designItem.mediaName
                                      )
                                    }
                                    glyph="trash"
                                  />
                                </li>
                              );
                            }
                          )}
                      </ul>

                      <div className="text-center">
                        <div className="upload-btn cursor-pointer text-uppercase">
                          <span className="ico-upload w-full">
                            <svg>
                              <use xlinkHref={`${Sprite}#upload1Ico`} />
                            </svg>
                          </span>
                          Upload other documents
                          <FormControl
                            id="formControlsFile"
                            multiple
                            type="file"
                            label="File"
                            accept=".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
                            onChange={this.handleUploadSpecification}
                            disabled={this.state.selectedDesigns == ''}
                            // help="Example block-level help text here."
                            onClick={event => {
                              event.target.value = null;
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-center m-t-40 m-b-20">
                      <button
                        className="btn btn-success text-uppercase"
                        onClick={() => {
                          this.addPartConfirmation('specification');
                        }}
                        disabled={this.state.selectedDesigns == ''}
                      >
                        add specification
                      </button>
                    </div>
                  </Col>
                </Row>

                {/* <div className="text-center m-t-40 m-b-60">
                  <button
                    className="btn btn-primary text-uppercase"
                    onClick={() => {
                      this.addPartConfirmation();
                    }}
                    disabled={this.state.selectedProjectId == ""}
                  >
                    add parts
                  </button>
                </div> */}
              </div>
              <hr className="bg-divider m-b-30" />
              <div className="container-fluid">
                <h4 className="hero-title">Part Details</h4>
                <div className="">
                  <Table
                    bordered
                    responsive
                    className="custom-table cell-input out-calander"
                  >
                    <thead>
                      <tr>
                        {/* <th>Part Id</th> */}
                        <th>Part Number</th>
                        <th>Part Description</th>
                        <th>Specification</th>
                        <th>Part Revision Number</th>
                        <th>Approver</th>
                        {/* <th>Supplier</th> */}
                        <th>Quantity</th>
                        <th>Units</th>
                        <th>Usage</th>
                        <th>Commodity</th>
                        <th>HSN Code</th>
                        <th>Delivery Address</th>
                        <th>Delivery State</th>
                        <th>Delivery Country</th>
                        <th>Packing/Delivery Condition</th>
                        <th>Target Date</th>
                        {/* <th>Suplier star rating</th>
                  <th>Suplier location</th>
                  <th>New suppliers?</th> */}
                        <th>Proto/Production</th>
                        <th>Shipment 1 Qty</th>
                        <th>Shipment 1 Target Date</th>
                        <th>Shipment 2 Qty</th>
                        <th>Shipment 2 Target Date</th>
                        <th>Shipment 3 Qty</th>
                        <th>Shipment 3 Target Date</th>
                        <th>Shipment 4 Qty</th>
                        <th>Shipment 4 Target Date</th>
                        <th>Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {this.props.supplierParts.partList.map((partDetails, index) => { */}
                      {this.state.partList &&
                        this.state.partList.map((partDetails, index) => {
                          const { partNumber } = partDetails;
                          const { id } = partDetails;
                          // const { partNumber } = partDetails;
                          return [
                            <tr>
                              {/* <td>
                                <div className="p-id">{id}</div>
                              </td> */}
                              <td>
                                <div className="p-id">{partNumber}</div>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="partDescription"
                                    value={partDetails.partDescription}
                                    onChange={event =>
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      )
                                    }
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td className="custom-dd dropRf">
                                <DropdownButton
                                  title=" Select"
                                  name="secpeificationData"
                                  value={partDetails.listOfUnUsedSpecifications}
                                  className="w-125"
                                >
                                  {partDetails.listOfUnUsedSpecifications &&
                                    partDetails.listOfUnUsedSpecifications.map(
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
                                            <label>{item.mediaName} </label>
                                          </li>
                                        );
                                      }
                                    )}
                                </DropdownButton>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="partRevisionNumber"
                                    value={partDetails.partRevisionNumber}
                                    onChange={event =>
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      )
                                    }
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td className="custom-dd dropRf">
                                <DropdownButton
                                  title="Select"
                                  name="secpeificationData"
                                  value={partDetails.approvalList}
                                  className="w-125"
                                >
                                  {partDetails.approvalList &&
                                    partDetails.approvalList.map((item, i) => {
                                      let selected = '';
                                      if (item.isDefault) selected = true;
                                      else if (item.isSelected) selected = true;

                                      return (
                                        <li className="xxx">
                                          <input
                                            type="checkbox"
                                            value={item}
                                            checked={selected ? true : false}
                                            disabled={
                                              item.isDefault ? true : false
                                            }
                                            onClick={this.dontClose}
                                            onChange={event => {
                                              this.handleApproverSelectedOption(
                                                event,
                                                item,
                                                index,
                                                i
                                              );
                                            }}
                                          />
                                          <label>{item.fullName}</label>
                                        </li>
                                      );
                                    })}
                                </DropdownButton>
                              </td>
                              {/* <td className="">
                                <div className="multiSelect">
                                  <ReactMultiSelectCheckboxes
                                    options={this.state.options[index]}
                                    searchable={false}
                                    onChange={this.handleSelectedOption.bind(
                                      this,
                                      index
                                    )}
                                  />
                                </div>
                              </td> */}
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="quantity"
                                    maxLength="5"
                                    value={partDetails.quantity}
                                    onChange={event => {
                                      // const { value } = event.target;
                                      // const numOnly = /^[0-9\b]+$/;
                                      // if (numOnly.test(value)) {
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      );
                                      // } else {
                                      //   partDetails.quantity = '';
                                      // }
                                    }}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    maxLength="10"
                                    name="units"
                                    value={partDetails.units}
                                    onChange={event =>
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      )
                                    }
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0"
                                    name="usage"
                                    value={partDetails.usage}
                                    onChange={event =>
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      )
                                    }
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="commodity"
                                    value={partDetails.commodity}
                                    onChange={event => {
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="hsnCode"
                                    value={partDetails.hsnCode}
                                    onChange={event => {
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="deliveryAddress"
                                    value={partDetails.deliveryAddress}
                                    onChange={event => {
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="deliveryAddressState"
                                    value={partDetails.deliveryAddressState}
                                    onChange={event => {
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="deliveryAddressCountry"
                                    value={partDetails.deliveryAddressCountry}
                                    onChange={event => {
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup
                                  className="m-b-0"
                                  controlId="formControlsSelect"
                                >
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="packagingDeliveryConditions"
                                    value={
                                      partDetails.packagingDeliveryConditions
                                    }
                                    onChange={event => {
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                </FormGroup>
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                
                                  <FormGroup className="m-b-0">
                                    <DatePicker
                                      selected={partDetails.targetDate}
                                      onChange={e => {
                                        const value = e;
                                        this.handleOnChangePartDetails(
                                          {
                                            target: {
                                              name: 'targetDate',
                                              value
                                            }
                                          },
                                          index
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

                                    {/*  <Datetime
                                      isValidDate={valid}
                                      className="db-0"
                                      closeOnSelect="true"
                                      timeFormat={false}
                                      dateFormat="DD/MM/YYYY"
                                      min={moment().format('DD/MM/YYYY')}
                                      inputProps={{
                                        placeholder: 'DD/MM/YYYY',
                                        readOnly: true
                                      }}
                                      onChange={e => {
                                        const value = e;
                                        console.log('on change triggered');
                                        this.handleOnChangePartDetails(
                                          {
                                            target: {
                                              name: 'targetDate',
                                              value
                                            }
                                          },
                                          index
                                        );
                                      }}
                                      value={partDetails.targetDate}
                                    />*/}
                                    {/* <FormControl type="date" className="br-0 " /> */}
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              {/* <td>5</td> */}
                              {/* <td>
                        <FormGroup className="m-b-0">
                          <FormControl type="text" className="br-0 " />
                          <FormControl.Feedback />
                        </FormGroup>
                      </td>
                      <td>
                        <FormGroup className="m-b-0">
                          <FormControl type="text" className="br-0 " />
                          <FormControl.Feedback />
                        </FormGroup>
                      </td> */}
                              <td>
                                <FormGroup
                                  className="m-b-0"
                                  controlId="formControlsSelect"
                                >
                                  <FormControl
                                    className="br-0   s-arrow"
                                    componentClass="select"
                                    placeholder="select"
                                    name="production"
                                    onChange={event =>
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      )
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option value="proto">Proto</option>
                                    <option value="production">
                                      Production
                                    </option>
                                  </FormControl>
                                </FormGroup>
                              </td>
                              {/* <td>
                        <FormGroup className="m-b-0">
                          <FormControl type="text" className="br-0 " />
                          <FormControl.Feedback />
                        </FormGroup>
                      </td> */}
                              {this.numberOfPartialShipment.map(
                                (partialShipmentItem, partialShipmentIndex) => {
                                  return [
                                    <td>
                                      <FormGroup className="m-b-0">
                                        <FormControl
                                          type="text"
                                          className="br-0 "
                                          name="shipmentQty"
                                          value={this.fetchShipmentData(
                                            partDetails,
                                            'shipmentQty',
                                            partialShipmentIndex
                                          )}
                                          onChange={event => {
                                            this.handleOnChangeShipment(
                                              event,
                                              index,
                                              partialShipmentIndex
                                            );
                                          }}
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                    </td>,
                                    <td ref="elem">
                                      <div
                                        onClick={this.findCoordinate.bind(this)}
                                      >
                                        <FormGroup className="m-b-0">
                                          <DatePicker
                                            selected={this.fetchShipmentData(
                                              partDetails,
                                              'shipmentTargetDate',
                                              partialShipmentIndex
                                            )}
                                            onChange={e => {
                                              const value = e;
                                              this.handleOnChangeShipment(
                                                {
                                                  target: {
                                                    name: 'shipmentTargetDate',
                                                    value
                                                  }
                                                },
                                                index,
                                                partialShipmentIndex
                                              );
                                            }}
                                            placeholderText="DD/MM/YYYY"
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            dateFormat="dd/MM/yyyy"
                                            minDate={new Date()}
                                            disabled={
                                              partDetails.dateArray &&
                                              partDetails.dateArray[
                                                partialShipmentIndex
                                              ].dateDisable
                                            }
                                          />

                                          {/* <Datetime
                                            className="db-0"
                                            closeOnSelect="true"
                                            dateFormat="DD/MM/YYYY"
                                            timeFormat={false}
                                            min={moment().format('DD/MM/YYYY')}
                                            //inputProps={{ readOnly: true }}
                                            inputProps={{
                                              placeholder: 'DD/MM/YYYY',
                                              readOnly: true,
                                              disabled:
                                                partDetails.dateArray &&
                                                partDetails.dateArray[
                                                  partialShipmentIndex
                                                ].dateDisable
                                            }}
                                            onChange={e => {
                                              const value = e;
                                              this.handleOnChangeShipment(
                                                {
                                                  target: {
                                                    name: 'shipmentTargetDate',
                                                    value
                                                  }
                                                },
                                                index,
                                                partialShipmentIndex
                                              );
                                            }}
                                            value={this.fetchShipmentData(
                                              partDetails,
                                              'shipmentTargetDate',
                                              partialShipmentIndex
                                            )}
                                          /> */}

                                          <FormControl.Feedback />
                                        </FormGroup>
                                      </div>
                                    </td>
                                  ];
                                }
                              )}
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="remarks"
                                    value={partDetails.remarks}
                                    onChange={event =>
                                      this.handleOnChangePartDetails(
                                        event,
                                        index
                                      )
                                    }
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                            </tr>,
                            <tr> </tr>
                          ];
                        })}
                      {this.state.partList.length <= 1 &&
                        this.state.extraPartArray &&
                        this.state.extraPartArray.map((item, index) => {
                          return [
                            <tr>
                              <td>
                                <div className="p-id">Part Number</div>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="partDescription"
                                    value={this.state.partDescription}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td className="custom-dd dropRf">
                                <DropdownButton
                                  title="Select"
                                  name="Select specification"
                                  className="w-125"
                                />
                              </td>

                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="partRevisionNumber"
                                    value={this.state.partRevisionNumber}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td className="custom-dd dropRf">
                                <DropdownButton
                                  title="Select"
                                  name="Select Approver"
                                  className="w-125"
                                />
                              </td>

                              {/* <td>
                                <div className="multiSelect">
                                  <ReactMultiSelectCheckboxes
                                    options={this.state.options}
                                    searchable={false}
                                  />
                                </div>
                              </td> */}
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="quantity"
                                    maxLength="5"
                                    value={this.state.quantity}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    maxLength="10"
                                    name="units"
                                    value={this.state.units}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="usage"
                                    value={this.state.usage}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="commodity"
                                    value={this.state.commodity}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="hsnCode"
                                    value={this.state.hsnCode}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="deliveryAddress"
                                    value={this.state.deliveryAddress}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="deliveryAddressState"
                                    value={this.state.deliveryAddressState}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="deliveryAddressCountry"
                                    value={this.state.deliveryAddressCountry}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup
                                  className="m-b-0"
                                  controlId="formControlsSelect"
                                >
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="packagingDeliveryConditions"
                                    value={
                                      this.state.packagingDeliveryConditions
                                    }
                                  />
                                </FormGroup>
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                
                                    <DatePicker
                                      selected={this.state.targetDate}
                                      placeholderText="DD/MM/YYYY"
                                      peekNextMonth
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      dateFormat="dd/MM/yyyy"
                                      minDate={new Date()}
                                      onChange={e => {
                                        setTimeout(() => {
                                          this.resetCoordinate(e);
                                        }, 200);
                                      }}
                                    />
                                    {/* <Datetime
                                      isValidDate={valid}
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                      timeFormat={false}
                                      min={moment().format('DD/MM/YYYY')}
                                      inputProps={{
                                        placeholder: 'DD/MM/YYYY',
                                        readOnly: true
                                      }}
                                      onBlur={e => {
                                        this.resetCoordinate(e);
                                      }}
                                      onChange={e => {
                                        setTimeout(() => {
                                          this.resetCoordinate(e);
                                        }, 200);
                                      }}
                                      value={this.state.targetDate}
                                    /> */}
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>

                              <td>
                                <FormGroup
                                  className="m-b-0"
                                  controlId="formControlsSelect"
                                >
                                  <FormControl
                                    className="br-0   s-arrow"
                                    componentClass="select"
                                    placeholder="select"
                                    name="production"
                                  >
                                    <option value="">select</option>
                                    <option value="proto">Proto</option>
                                    <option value="production">
                                      Production
                                    </option>
                                  </FormControl>
                                </FormGroup>
                              </td>

                              {this.numberOfPartialShipment.map(
                                (partialShipmentItem, partialShipmentIndex) => {
                                  return [
                                    <td>
                                     
                                      <FormGroup className="m-b-0">
                                        <FormControl
                                          type="text"
                                          className="br-0 "
                                          name="shipmentQty"
                                          value={this.state.s1}
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                    </td>,
                                    <td ref="elem">
                                      <div
                                        onClick={this.findCoordinate.bind(this)}
                                      >
                                        <FormGroup className="m-b-0">
                                          <DatePicker
                                            selected={this.state.targetDate}
                                            placeholderText="DD/MM/YYYY"
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            dateFormat="dd/MM/yyyy"
                                            minDate={new Date()}
                                            onChange={e => {
                                              setTimeout(() => {
                                                this.resetCoordinate(e);
                                              }, 200);
                                            }}
                                          />
                                          {/* <Datetime
                                            className="db-0"
                                            closeOnSelect="true"
                                            dateFormat="DD/MM/YYYY"
                                            timeFormat={false}
                                            min={moment().format('DD/MM/YYYY')}
                                            inputProps={{
                                              placeholder: 'DD/MM/YYYY',
                                              readOnly: true
                                            }}
                                            onBlur={e => {
                                              this.resetCoordinate(e);
                                            }}
                                            onChange={e => {
                                              setTimeout(() => {
                                                this.resetCoordinate(e);
                                              }, 200);
                                            }}
                                            value={this.state.targetDate}
                                          /> */}

                                          <FormControl.Feedback />
                                        </FormGroup>
                                      </div>
                                    </td>
                                  ];
                                }
                              )}

                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="remarks"
                                    value={this.state.remarks}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                            </tr>
                          ];
                        })}
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className="text-center m-t-40 m-b-30">
                <button
                  className="btn btn-success text-uppercase"
                  onClick={this.handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-default text-uppercase"
                  onClick={this.handleSaveParts}
                  disabled={
                    this.state.selectedProjectId == '' || this.state.disableSave
                  }
                >
                  save
                </button>
              </div>
            </div>
          ) : null}
          {this.state.tabKey === 'second' ? (
            <Footer
              pageTitle={permissionConstant.footer_title.request_for_purchase}
            />
          ) : null}
        </div>
        <Modal
          show={this.state.showApproveModal}
          onHide={this.handleClose}
          className="custom-popUp confirmation-box"
          bsSize="small"
        >
          {/* <Modal.Header>
            <div className="flex justify-space-between align-center">
              <h4>Confirmation</h4>
              <div className="">
                <button
                  onClick={this.handleCloseModel}
                  className="btn btn-link text-uppercase color-light sm-btn"
                >
                  close
                </button>
              </div>
            </div>
          </Modal.Header> */}
          <Modal.Body>
            <div className="">
              <h5 className="text-center">
                Are you sure you want to save this part?
              </h5>
              <div className="text-center">
                <button
                  className="btn btn-default text-uppercase sm-btn"
                  onClick={event => this.handleCreatePartWithMedia(event)}
                  // onClick={this.handleCreatePartWithMedia(this.state.type)}
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
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionUserLogout,
      actionLoaderHide,
      actionLoaderShow,
      actionGetProjectList,
      actionAddProject,
      actionUploadImage,
      actionUploadSpecification,
      actionAddParts,
      actionCreatePartWithMedia,
      actionClearAddPartData,
      actionTabData,
      actionDeleteRevisionImage,
      actionAddSpecificationList,
      actionDeletePartDatabase
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
AddPart = validation(strategy)(AddPart);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPart);
