import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Table,
  Modal,
  Row,
  Col
} from 'react-bootstrap';
import * as Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import * as moment from 'moment';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import noRecord from '../../img/no_record.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  actionLoaderShow,
  actionLoaderHide,
  actionUpdatePartStatus,
  actionSubmitReleasePOListSupplier,
  actionUploadPicture,
  handleUploadReport,
  actionUploadPerformaInvoice,
  actionUploadStamp,
  actionUploadFinalInvoice,
  actionTabClick
} from '../../common/core/redux/actions';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import Image1 from '../../img/image.png';
import Sprite from '../../img/sprite.svg';
import { topPosition } from '../../common/commonFunctions';
import ReactToPrint from 'react-to-print';
import SliderModal from '../slider/sliderUploadModal';
import customConstant from '../../common/core/constants/customConstant';
import _ from 'lodash';
import { showErrorToast, showSuccessToast } from '../../common/commonFunctions';
class UpdatePartStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      partOrderData: [],
      orderArray: [],
      tabKey: 'fourth',
      uploadPicturesResponse: [],
      reportArray: [],
      performaInvoiceArray: [],
      stampArray: [],
      finalInvoiceArray: [],
      miscellaneousDocumentsArray: [],
      showReview: false,
      calendarReview: false
    };

    this.handleDetailChange = this.handleDetailChange.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    this.handleUploadPicture = this.handleUploadPicture.bind(this);
    this.handleUploadReport = this.handleUploadReport.bind(this);
    this.handleUploadPerformaInvoice = this.handleUploadPerformaInvoice.bind(
      this
    );
    this.handleUploadStamp = this.handleUploadStamp.bind(this);
    this.handleUploadFinalInvoice = this.handleUploadFinalInvoice.bind(this);
    this.handleUploadMiscellaneousDocumentse = this.handleUploadMiscellaneousDocumentse.bind(
      this
    );
    this.navigateTo = this.navigateTo.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.reviewQuotation = this.reviewQuotation.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleGetData = this.handleGetData.bind(this);
    // this.handleChangeBlue = this.handleChangeBlue.bind(this);
    // this.handleChangeFocus = this.handleChangeFocus.bind(this);
  }

  componentDidMount() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole
    };

    this.props.actionLoaderShow();
    this.props
      .actionUpdatePartStatus(data)
      .then((result, error) => {
        let resourceData = result.payload.data.resourceData;

        let orderArray = this.state.orderArray;
        resourceData.forEach(function(data) {
          orderArray.push({
            // partId: '',
            // quotationId: '',
            // purchaseOrderNo: '',
            // percentCompletion: '',
            // qualityInspectionDate: '',
            // dispatchDate: '',
            // partsReceiptDate: '',
            // comments: ''
          });
        });
        _this.setState({
          partOrderData: resourceData,
          orderArray: orderArray
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  navigateTo(data) {
    this.props.actionTabClick(data);
  }

  handleDetailChange(event, index) {
    const { name, value } = event.target;

    console.log('name, value', name, value);

    let orderArray = this.state.partOrderData;
    if (orderArray && orderArray[index]) orderArray[index][name] = value;
    this.setState({
      partOrderData: orderArray
    });

    console.log('partOrderData--', this.state.partOrderData);
  }
  submitOrder() {
    let _this = this;
    let listOfPOReleaseRequest = [];
    const covertToTimeStamp = momentObject => {
      return moment(momentObject).format('x');
    };

    let partOrderData1 = this.state.partOrderData;

    this.state.orderArray.forEach(function(item, index) {
      let partOrderData = partOrderData1[index];
      if (
        partOrderData.uploadPicturesResponse &&
        partOrderData.uploadPicturesResponse.length
      ) {
        for (let i = 0; i < partOrderData.uploadPicturesResponse.length; i++) {
          if (partOrderData.uploadPicturesResponse[i].mediaURL) {
            partOrderData.uploadPicturesResponse[
              i
            ].mediaURL = partOrderData.uploadPicturesResponse[i].mediaURL
              .split('/')
              .pop(-1);
            partOrderData.uploadPicturesResponse[
              i
            ].mediaThumbnailUrl = partOrderData.uploadPicturesResponse[
              i
            ].mediaThumbnailUrl
              .split('/')
              .pop(-1);
          }
        }
      }

      if (
        partOrderData.uploadPerfomaInvoiceResponse &&
        partOrderData.uploadPerfomaInvoiceResponse.length
      ) {
        for (
          let i = 0;
          i < partOrderData.uploadPerfomaInvoiceResponse.length;
          i++
        ) {
          if (partOrderData.uploadPerfomaInvoiceResponse[i].mediaURL) {
            partOrderData.uploadPerfomaInvoiceResponse[
              i
            ].mediaURL = partOrderData.uploadPerfomaInvoiceResponse[i].mediaURL
              .split('/')
              .pop(-1);
          }
        }
      }
      if (
        partOrderData.uploadMaterialInwardResponse &&
        partOrderData.uploadMaterialInwardResponse.length
      ) {
        for (
          let i = 0;
          i < partOrderData.uploadMaterialInwardResponse.length;
          i++
        ) {
          if (partOrderData.uploadMaterialInwardResponse[i].mediaURL) {
            partOrderData.uploadMaterialInwardResponse[
              i
            ].mediaURL = partOrderData.uploadMaterialInwardResponse[i].mediaURL
              .split('/')
              .pop(-1);
          }
        }
      }

      if (
        partOrderData.uploadFinalInvoiceResponse &&
        partOrderData.uploadFinalInvoiceResponse.length
      ) {
        for (
          let i = 0;
          i < partOrderData.uploadFinalInvoiceResponse.length;
          i++
        ) {
          if (partOrderData.uploadFinalInvoiceResponse[i].mediaURL) {
            partOrderData.uploadFinalInvoiceResponse[
              i
            ].mediaURL = partOrderData.uploadFinalInvoiceResponse[i].mediaURL
              .split('/')
              .pop(-1);
          }
        }
      }

      if (
        partOrderData.uploadMiscellaneousDocumentsResponse &&
        partOrderData.uploadMiscellaneousDocumentsResponse.length
      ) {
        for (
          let i = 0;
          i < partOrderData.uploadMiscellaneousDocumentsResponse.length;
          i++
        ) {
          if (partOrderData.uploadMiscellaneousDocumentsResponse[i].mediaURL) {
            partOrderData.uploadMiscellaneousDocumentsResponse[
              i
            ].mediaURL = partOrderData.uploadMiscellaneousDocumentsResponse[
              i
            ].mediaURL
              .split('/')
              .pop(-1);
          }
        }
      }

      console.log('listOfPOReleaseRequest----------', partOrderData);

      listOfPOReleaseRequest.push({
        id: partOrderData.id,
        partId: partOrderData.partResponse.id,

        quotationId: partOrderData.quotationResponse.quotationId,
        purchaseOrderNo: partOrderData.purchaseOrderNo,
        currentStatusDate: covertToTimeStamp(partOrderData.currentStatusDate),
        projectDeliveryDate: covertToTimeStamp(
          partOrderData.projectDeliveryDate
        ),
        qualityInspectionDate: covertToTimeStamp(
          partOrderData.qualityInspectionDate
        ),
        dispatchDate: covertToTimeStamp(partOrderData.dispatchDate),
        partsReceiptDate: covertToTimeStamp(partOrderData.partsReceiptDate),
        comments: partOrderData.comments,
        poGeneratedWith: 2,
        uploadPictures: partOrderData.uploadPicturesResponse,
        uploadPerfomaInvoice: partOrderData.uploadPerfomaInvoiceResponse
          ? partOrderData.uploadPerfomaInvoiceResponse
          : [],
        uploadMaterialInward: partOrderData.uploadMaterialInwardResponse
          ? partOrderData.uploadMaterialInwardResponse
          : [],
        uploadFinalInvoice: partOrderData.uploadFinalInvoiceResponse
          ? partOrderData.uploadFinalInvoiceResponse
          : [],
        uploadMiscellaneousDocuments: partOrderData.uploadMiscellaneousDocumentsResponse
          ? partOrderData.uploadMiscellaneousDocumentsResponse
          : [],
        percentCompletion: partOrderData.percentCompletion
        //dispatchDate1: partOrderData.dispatchDate,
        //partsReceiptDate1: partOrderData.partsReceiptDate
      });
    });

    let data = {
      roleId: _this.props.userInfo.userData.userRole,
      userId: _this.props.userInfo.userData.id,
      buyerUserId: '',
      listOfPOReleaseRequest: listOfPOReleaseRequest
    };
    console.log('listOfPOReleaseRequest------data----', data);
    _this.props
      .actionSubmitReleasePOListSupplier(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();

        if (result.payload.data.status === 200) {
          //showSuccessToast(result.payload.data.responseMessage)
        }

        _this.addFullURL();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  addFullURL() {
    let _this = this;
    let listOfPOReleaseRequest = [];
    const covertToTimeStamp = momentObject => {
      return moment(momentObject).format('x');
    };

    let partOrderData1 = this.state.partOrderData;
    this.state.orderArray.forEach(function(item, index) {
      let partOrderData = partOrderData1[index];

      if (
        partOrderData.uploadPicturesResponse &&
        partOrderData.uploadPicturesResponse.length
      ) {
        for (let i = 0; i < partOrderData.uploadPicturesResponse.length; i++) {
          let mediaURLArray =
            partOrderData.uploadPicturesResponse[i] &&
            partOrderData.uploadPicturesResponse[i].mediaURL &&
            partOrderData.uploadPicturesResponse[i].mediaURL.split('/');

          if (
            partOrderData.uploadPicturesResponse[i].mediaURL &&
            mediaURLArray &&
            mediaURLArray.length === 1
          ) {
            partOrderData.uploadPicturesResponse[i].mediaURL =
              customConstant.amazonURL +
              partOrderData.uploadPicturesResponse[i].mediaURL;
            partOrderData.uploadPicturesResponse[i].mediaThumbnailUrl =
              customConstant.amazonURL +
              partOrderData.uploadPicturesResponse[i].mediaThumbnailUrl;
          }
        }
      }

      if (
        partOrderData.uploadPerfomaInvoiceResponse &&
        partOrderData.uploadPerfomaInvoiceResponse.length
      ) {
        for (
          let i = 0;
          i < partOrderData.uploadPerfomaInvoiceResponse.length;
          i++
        ) {
          let mediaURLArray =
            partOrderData.uploadPerfomaInvoiceResponse[i] &&
            partOrderData.uploadPerfomaInvoiceResponse[i].mediaURL &&
            partOrderData.uploadPerfomaInvoiceResponse[i].mediaURL.split('/');

          if (
            partOrderData.uploadPerfomaInvoiceResponse[i].mediaURL &&
            mediaURLArray &&
            mediaURLArray.length === 1
          ) {
            partOrderData.uploadPerfomaInvoiceResponse[i].mediaURL =
              customConstant.amazonURL +
              partOrderData.uploadPerfomaInvoiceResponse[i].mediaURL;
            partOrderData.uploadPerfomaInvoiceResponse[i].mediaThumbnailUrl =
              customConstant.amazonURL +
              partOrderData.uploadPerfomaInvoiceResponse[i].mediaThumbnailUrl;
          }

          // if (partOrderData.uploadPerfomaInvoiceResponse[i].mediaURL) {
          //   partOrderData.uploadPerfomaInvoiceResponse[i].mediaURL =
          //     customConstant.amazonURL +
          //     partOrderData.uploadPerfomaInvoiceResponse[i].mediaURL;
          // }
        }
      }
      if (
        partOrderData.uploadMaterialInwardResponse &&
        partOrderData.uploadMaterialInwardResponse.length
      ) {
        for (
          let i = 0;
          i < partOrderData.uploadMaterialInwardResponse.length;
          i++
        ) {
          let mediaURLArray =
            partOrderData.uploadMaterialInwardResponse[i] &&
            partOrderData.uploadMaterialInwardResponse[i].mediaURL &&
            partOrderData.uploadMaterialInwardResponse[i].mediaURL.split('/');

          if (
            partOrderData.uploadMaterialInwardResponse[i].mediaURL &&
            mediaURLArray &&
            mediaURLArray.length === 1
          ) {
            partOrderData.uploadMaterialInwardResponse[i].mediaURL =
              customConstant.amazonURL +
              partOrderData.uploadMaterialInwardResponse[i].mediaURL;
            partOrderData.uploadMaterialInwardResponse[i].mediaThumbnailUrl =
              customConstant.amazonURL +
              partOrderData.uploadMaterialInwardResponse[i].mediaThumbnailUrl;
          }

          // if (partOrderData.uploadMaterialInwardResponse[i].mediaURL) {
          //   partOrderData.uploadMaterialInwardResponse[i].mediaURL =
          //     customConstant.amazonURL +
          //     partOrderData.uploadMaterialInwardResponse[i].mediaURL;
          // }
        }
      }

      if (
        partOrderData.uploadFinalInvoiceResponse &&
        partOrderData.uploadFinalInvoiceResponse.length
      ) {
        for (
          let i = 0;
          i < partOrderData.uploadFinalInvoiceResponse.length;
          i++
        ) {
          let mediaURLArray =
            partOrderData.uploadFinalInvoiceResponse[i] &&
            partOrderData.uploadFinalInvoiceResponse[i].mediaURL &&
            partOrderData.uploadFinalInvoiceResponse[i].mediaURL.split('/');

          if (
            partOrderData.uploadFinalInvoiceResponse[i].mediaURL &&
            mediaURLArray &&
            mediaURLArray.length === 1
          ) {
            partOrderData.uploadFinalInvoiceResponse[i].mediaURL =
              customConstant.amazonURL +
              partOrderData.uploadFinalInvoiceResponse[i].mediaURL;
            partOrderData.uploadFinalInvoiceResponse[i].mediaThumbnailUrl =
              customConstant.amazonURL +
              partOrderData.uploadFinalInvoiceResponse[i].mediaThumbnailUrl;
          }

          // if (partOrderData.uploadFinalInvoiceResponse[i].mediaURL) {
          //   partOrderData.uploadFinalInvoiceResponse[i].mediaURL =
          //     customConstant.amazonURL +
          //     partOrderData.uploadFinalInvoiceResponse[i].mediaURL;
          // }
        }
      }

      if (
        partOrderData.uploadMiscellaneousDocumentsResponse &&
        partOrderData.uploadMiscellaneousDocumentsResponse.length
      ) {
        for (
          let i = 0;
          i < partOrderData.uploadMiscellaneousDocumentsResponse.length;
          i++
        ) {
          let mediaURLArray =
            partOrderData.uploadMiscellaneousDocumentsResponse[i] &&
            partOrderData.uploadMiscellaneousDocumentsResponse[i].mediaURL &&
            partOrderData.uploadMiscellaneousDocumentsResponse[
              i
            ].mediaURL.split('/');

          if (
            partOrderData.uploadMiscellaneousDocumentsResponse[i].mediaURL &&
            mediaURLArray &&
            mediaURLArray.length === 1
          ) {
            partOrderData.uploadMiscellaneousDocumentsResponse[i].mediaURL =
              customConstant.amazonURL +
              partOrderData.uploadMiscellaneousDocumentsResponse[i].mediaURL;
            partOrderData.uploadMiscellaneousDocumentsResponse[
              i
            ].mediaThumbnailUrl =
              customConstant.amazonURL +
              partOrderData.uploadMiscellaneousDocumentsResponse[i]
                .mediaThumbnailUrl;
          }

          // if (partOrderData.uploadMiscellaneousDocumentsResponse[i].mediaURL) {
          //   partOrderData.uploadMiscellaneousDocumentsResponse[i].mediaURL =
          //     customConstant.amazonURL +
          //     partOrderData.uploadMiscellaneousDocumentsResponse[i].mediaURL;
          // }
        }
      }
    });
    this.setState({
      partOrderData: partOrderData1
    });
  }

  handleUploadPicture(event, index) {
    const fileObject = event.target.files[0];
    if (fileObject) {
      let _this = this;
      let uploadPicturesResponse = {};
      let reqArray = [];
      const formData = new FormData();
      formData.set('mFile', fileObject);
      formData.append('thumbnailHeight', 100);
      formData.append('thumbnailWidth', 100);
      formData.append('isCreateThumbnail', true);
      formData.append('fileKey', fileObject.name);
      formData.append('filePath', fileObject.name);

      this.props.actionLoaderShow();
      this.props
        .actionUploadPicture(formData)
        .then((result, error) => {
          //suploadPicturesResponse = this.state.uploadPicturesResponse;
          let mediaExtension = result.payload.data.filePath.split('.').pop(-1);
          uploadPicturesResponse.imageURL =
            customConstant.amazonURL + result.payload.data.s3FilePath;
          uploadPicturesResponse.mediaURL =
            customConstant.amazonURL + result.payload.data.s3FilePath;
          uploadPicturesResponse.mediaName = result.payload.data.filePath;
          uploadPicturesResponse.mediaSize = result.payload.data.fileSize;
          uploadPicturesResponse.mediaExtension = mediaExtension;
          uploadPicturesResponse.mediaType = result.payload.data.contentType;
          uploadPicturesResponse.mediaThumbnailUrl =
            customConstant.amazonURL + result.payload.data.s3ThumbnailFilePath;

          //reqArray = uploadPicturesResponse;
          let partListUpdate = this.state.partOrderData;

          let partListUpdateJson = partListUpdate[index];
          partListUpdateJson.uploadPicturesResponse = [];
          partListUpdateJson.uploadPicturesResponse.push(
            uploadPicturesResponse
          );
          partListUpdate[index] = partListUpdateJson;
          this.setState({ partOrderData: partListUpdate });

          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }

  handleUploadReport(event, index) {
    const fileObject = event.target.files[0];
    if (fileObject) {
      let _this = this;
      let reportArray = [];
      let reqArray = [];
      const formData = new FormData();
      formData.set('mFile', fileObject);
      formData.append('thumbnailHeight', 100);
      formData.append('thumbnailWidth', 100);
      formData.append('isCreateThumbnail', true);
      formData.append('fileKey', fileObject.name);
      formData.append('filePath', fileObject.name);

      this.props.actionLoaderShow();
      this.props
        .handleUploadReport(formData)
        .then((result, error) => {
          let mediaExtension = result.payload.data.filePath.split('.').pop(-1);
          reportArray = this.state.reportArray;
          //reportArray[index] = result.payload.data;

          reportArray[0].imageURL = result.payload.data.s3FilePath;

          reportArray[0].imageURL = result.payload.data.s3FilePath;
          reportArray[0].mediaName = result.payload.data.filePath;
          reportArray[0].mediaSize = result.payload.data.fileSize;
          reportArray[0].mediaExtension = mediaExtension;
          reportArray[0].mediaType = result.payload.data.contentType;
          reportArray[0].mediaThumbnailUrl =
            result.payload.data.s3ThumbnailFilePath;
          reportArray[index].mediaURL = result.payload.data.s3FilePath;
          reqArray[index] = reportArray;
          _this.setState({
            reportArray: reqArray
          });
          let partListUpdate = this.state.partOrderData;
          let partListUpdateJson = partListUpdate[index];

          partListUpdateJson.reportArray = reqArray;
          partListUpdate[index] = partListUpdateJson;
          this.setState({ partOrderData: partListUpdate });
          _this.addFullURL();
          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }
  handleUploadPerformaInvoice(event, index) {
    const fileObject = event.target.files[0];
    if (fileObject) {
      let _this = this;
      let uploadPerfomaInvoiceResponse = {};
      let reqArray = [];
      const formData = new FormData();
      formData.set('mFile', fileObject);
      formData.append('thumbnailHeight', 100);
      formData.append('thumbnailWidth', 100);
      formData.append('isCreateThumbnail', true);
      formData.append('fileKey', fileObject.name);
      formData.append('filePath', fileObject.name);

      this.props.actionLoaderShow();
      this.props
        .actionUploadPerformaInvoice(formData)
        .then((result, error) => {
          let mediaExtension = result.payload.data.filePath.split('.').pop(-1);
          //uploadPerfomaInvoiceResponse = this.state.performaInvoiceArray;
          //uploadPerfomaInvoiceResponse= result.payload.data;
          uploadPerfomaInvoiceResponse.imageURL =
            result.payload.data.s3FilePath;
          uploadPerfomaInvoiceResponse.mediaName = result.payload.data.filePath;
          uploadPerfomaInvoiceResponse.mediaSize = result.payload.data.fileSize;
          uploadPerfomaInvoiceResponse.mediaExtension = mediaExtension;
          uploadPerfomaInvoiceResponse.mediaType =
            result.payload.data.contentType;
          uploadPerfomaInvoiceResponse.mediaThumbnailUrl =
            result.payload.data.s3ThumbnailFilePath;
          uploadPerfomaInvoiceResponse.mediaURL =
            result.payload.data.s3FilePath;
          reqArray[0] = uploadPerfomaInvoiceResponse;

          let partListUpdate = this.state.partOrderData;
          let partListUpdateJson = partListUpdate[index];

          partListUpdateJson.uploadPerfomaInvoiceResponse = reqArray;

          partListUpdate[index] = partListUpdateJson;

          this.setState({ partOrderData: partListUpdate });
          _this.addFullURL();
          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }
  handleUploadStamp(event, index) {
    const fileObject = event.target.files[0];
    if (fileObject) {
      let _this = this;
      let uploadMaterialInwardResponse = {};
      let reqArray = [];
      const formData = new FormData();
      formData.set('mFile', fileObject);
      formData.append('thumbnailHeight', 100);
      formData.append('thumbnailWidth', 100);
      formData.append('isCreateThumbnail', true);
      formData.append('fileKey', fileObject.name);
      formData.append('filePath', fileObject.name);
      this.props.actionLoaderShow();
      this.props
        .actionUploadStamp(formData)
        .then((result, error) => {
          let mediaExtension = result.payload.data.filePath.split('.').pop(-1);

          //stampArray = this.state.stampArray;
          //stampArray[0] = result.payload.data;
          uploadMaterialInwardResponse.contentType =
            result.payload.data.contentType;
          uploadMaterialInwardResponse.imageURL =
            result.payload.data.s3FilePath;
          uploadMaterialInwardResponse.mediaName = result.payload.data.filePath;
          uploadMaterialInwardResponse.mediaSize = result.payload.data.fileSize;
          uploadMaterialInwardResponse.mediaExtension = mediaExtension;
          uploadMaterialInwardResponse.mediaType =
            result.payload.data.contentType;
          uploadMaterialInwardResponse.mediaThumbnailUrl =
            result.payload.data.s3ThumbnailFilePath;
          uploadMaterialInwardResponse.mediaURL =
            result.payload.data.s3FilePath;
          _this.setState({
            stampArray: uploadMaterialInwardResponse
          });
          reqArray[0] = uploadMaterialInwardResponse;

          let partListUpdate = this.state.partOrderData;
          let partListUpdateJson = partListUpdate[index];
          partListUpdateJson.uploadMaterialInwardResponse = reqArray;
          partListUpdate[index] = partListUpdateJson;
          this.setState({ partOrderData: partListUpdate });
          _this.addFullURL();
          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }
  handleUploadFinalInvoice(event, index) {
    const fileObject = event.target.files[0];
    if (fileObject) {
      let _this = this;
      let uploadFinalInvoiceResponse = {};
      let reqArray = [];
      const formData = new FormData();
      formData.set('mFile', fileObject);
      formData.append('thumbnailHeight', 100);
      formData.append('thumbnailWidth', 100);
      formData.append('isCreateThumbnail', true);
      formData.append('fileKey', fileObject.name);
      formData.append('filePath', fileObject.name);

      this.props.actionLoaderShow();
      this.props
        .actionUploadFinalInvoice(formData)
        .then((result, error) => {
          let mediaExtension = result.payload.data.filePath.split('.').pop(-1);
          //finalInvoiceArray = this.state.finalInvoiceArray;
          //uploadFinalInvoiceResponse = result.payload.data;

          uploadFinalInvoiceResponse.imageURL = result.payload.data.s3FilePath;
          uploadFinalInvoiceResponse.mediaName = result.payload.data.filePath;
          uploadFinalInvoiceResponse.mediaSize = result.payload.data.fileSize;
          uploadFinalInvoiceResponse.mediaExtension = mediaExtension;
          uploadFinalInvoiceResponse.mediaType =
            result.payload.data.contentType;
          uploadFinalInvoiceResponse.mediaThumbnailUrl =
            result.payload.data.s3ThumbnailFilePath;
          uploadFinalInvoiceResponse.mediaURL = result.payload.data.s3FilePath;

          _this.setState({
            finalInvoiceArray: uploadFinalInvoiceResponse
          });

          reqArray[0] = uploadFinalInvoiceResponse;

          let partListUpdate = this.state.partOrderData;
          let partListUpdateJson = partListUpdate[index];
          partListUpdateJson.uploadFinalInvoiceResponse = reqArray;
          partListUpdate[index] = partListUpdateJson;
          this.setState({ partOrderData: partListUpdate });
          _this.addFullURL();
          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }

  handleUploadMiscellaneousDocumentse(event, index) {
    const fileObject = event.target.files[0];
    if (fileObject) {
      let _this = this;
      let uploadMiscellaneousDocumentsResponse = {};
      let reqArray = [];
      const formData = new FormData();
      formData.set('mFile', fileObject);
      formData.append('thumbnailHeight', 100);
      formData.append('thumbnailWidth', 100);
      formData.append('isCreateThumbnail', true);
      formData.append('fileKey', fileObject.name);
      formData.append('filePath', fileObject.name);
      this.props.actionLoaderShow();
      this.props
        .actionUploadFinalInvoice(formData)
        .then((result, error) => {
          let mediaExtension = result.payload.data.filePath.split('.').pop(-1);
          //miscellaneousDocumentsArray = this.state.miscellaneousDocumentsArray;
          // miscellaneousDocumentsArray[0] = result.payload.data;
          // uploadMiscellaneousDocumentsResponse.imageURL =
          //   result.payload.data.s3FilePath;
          // uploadMiscellaneousDocumentsResponse.mediaName =
          //   result.payload.data.filePath;
          // uploadMiscellaneousDocumentsResponse.mediaSize =
          //   result.payload.data.fileSize;
          // uploadMiscellaneousDocumentsResponse.mediaExtension = mediaExtension;
          // uploadMiscellaneousDocumentsResponse.mediaType =
          //   result.payload.data.contentType;
          // uploadMiscellaneousDocumentsResponse.mediaThumbnailUrl =
          //   result.payload.data.s3ThumbnailFilePath;
          // uploadMiscellaneousDocumentsResponse.mediaThumbnailUrl =
          //   result.payload.data.s3FilePath;

          uploadMiscellaneousDocumentsResponse.imageURL =
            result.payload.data.s3FilePath;
          uploadMiscellaneousDocumentsResponse.mediaName =
            result.payload.data.filePath;
          uploadMiscellaneousDocumentsResponse.mediaSize =
            result.payload.data.fileSize;
          uploadMiscellaneousDocumentsResponse.mediaExtension = mediaExtension;
          uploadMiscellaneousDocumentsResponse.mediaType =
            result.payload.data.contentType;
          uploadMiscellaneousDocumentsResponse.mediaThumbnailUrl =
            result.payload.data.s3ThumbnailFilePath;
          uploadMiscellaneousDocumentsResponse.mediaURL =
            result.payload.data.s3FilePath;

          // _this.setState({
          //   miscellaneousDocumentsArray: uploadMiscellaneousDocumentsResponse
          // });

          reqArray[0] = uploadMiscellaneousDocumentsResponse;
          console.log(
            'uploadMiscellaneousDocumentsResponse',
            uploadMiscellaneousDocumentsResponse
          );
          let partListUpdate = this.state.partOrderData;
          let partListUpdateJson = partListUpdate[index];
          partListUpdateJson.uploadMiscellaneousDocumentsResponse = reqArray;
          partListUpdate[index] = partListUpdateJson;
          this.setState({ partOrderData: partListUpdate });
          _this.addFullURL();
          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === 'first')
      this.props.history.push({
        pathname: 'home',
        state: { path: 'first' }
      });
    if (tabKey === 'second') this.props.history.push('home');
    if (tabKey === 'third')
      this.props.history.push({
        pathname: 'home',
        state: { path: 'third' }
      });
    this.setState({ tabKey: tabKey });
  }

  reviewQuotation(data) {
    console.log('reviewQuotation---', data);

    this.setState(
      {
        reviewData: data.quotationResponse
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
  imageShow = (
    partId,
    partMediaResponse,
    partNumber,
    partIndex,
    fileFlag,
    uploadType
  ) => {
    this.setState({
      show: true,
      partIdforMedia: partId,
      partNumberforMedia: partNumber,
      partMediaResponses: partMediaResponse,
      partIndex: partIndex,
      fileFlag: fileFlag,
      uploadType: uploadType
    });
  };
  handleCloseModal(e) {
    this.setState({ show: false });
  }

  handleGetData(data, index, uploadType) {
    let partListUpdate = this.state.partOrderData;
    //let partListUpdateJson = JSON.parse(JSON.stringify(partListUpdate[index]));
    let partListUpdateJson = partListUpdate[index];

    if (uploadType === 'uploadPicturesResponse') {
      //partListUpdateJson.uploadPicturesResponse = data;
      partListUpdateJson.uploadPicturesResponse = data;
    } else if (uploadType === 'uploadPerfomaInvoiceResponse') {
      partListUpdateJson.uploadPerfomaInvoiceResponse = data;
    } else if (uploadType === 'uploadFinalInvoiceResponse') {
      partListUpdateJson.uploadFinalInvoiceResponse = data;
    } else if (uploadType === 'uploadMiscellaneousDocumentsResponse') {
      partListUpdateJson.uploadMiscellaneousDocumentsResponse = data;
    } else if (uploadType === 'uploadMaterialInwardResponse') {
      partListUpdateJson.uploadMaterialInwardResponse = data;
    } else {
      //partListUpdateJson.uploadPicturesResponse = data;
    }
    partListUpdate[index] = partListUpdateJson;
    this.setState({ partOrderData: partListUpdate });
  }
  render() {
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
                <div className="flex align-center justify-space-between">
                  <h4 className="hero-title">Update Part Status</h4>
                </div>
                {this.state.partOrderData.length ? (
                  <div>
                    <div
                      className={
                        this.state.calendarReview
                          ? 'calender'
                          : 'calendertretert'
                      }
                    >
                      <Table
                        bordered
                        responsive
                        className="custom-table out-calander"
                      >
                        <thead>
                          <tr>
                            <th>Buyer</th>
                            <th>Part Number</th>
                            <th>Quotation (Date)</th>
                            <th>Purchase Order (Date) </th>
                            <th>Project Delivery (Date)</th>
                            <th> % Completion (Approx.Estimate)</th>
                            <th>Quality Audit/ PPAP (Date)</th>
                            <th>Dispatch (Date)</th>
                            <th>Parts Receipt(Date)</th>
                            <th>Comments</th>
                            <th>Upload Pictures</th>
                            <th>Upload PPAP/Quality Inspection Report</th>
                            <th>Upload Proforma Invoice</th>
                            <th>Upload Material Inward (Gate Stamp)</th>
                            <th>Upload Final Invoice</th>
                            <th>Upload/ View Other Documents</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.partOrderData.map((item, index) => {
                            return [
                              <tr>
                                <td>{item.buyerResponse.companyName}</td>
                                <td>{item.partResponse.partNumber}</td>
                                <td>
                                  <a
                                    className="cursor-pointer"
                                    onClick={() => {
                                      this.reviewQuotation(item);
                                    }}
                                  >
                                    {moment(
                                      item.quotationResponse
                                        .lastUpdatedTimestamp
                                    ).format('DD/MM/YYYY')}
                                  </a>
                                </td>
                                <td>
                                  {moment(item.currentStatusDate).format(
                                    'DD/MM/YYYY'
                                  )}{' '}
                                </td>
                                <td className="w-150">
                                  <FormGroup className="m-b-0">
                                    <DatePicker
                                      selected={item.projectDeliveryDate}
                                      onChange={e => {
                                        const value = e;
                                        this.handleDetailChange(
                                          {
                                            target: {
                                              name: 'projectDeliveryDate',
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

                                    {/* <Datetime
                                      className="db-0 custom-cal"
                                      timeFormat={false}
                                      closeOnSelect="true"
                                      inputProps={{
                                        placeholder: 'DD/MM/YYYY',
                                        readOnly: true
                                      }}
                                      onChange={e => {
                                        const value = e;
                                        this.handleDetailChange(
                                          {
                                            target: {
                                              name: 'projectDeliveryDate',
                                              value
                                            }
                                          },
                                          index
                                        );
                                      }}
                                      dateFormat="DD/MM/YYYY"
                                      value={moment(
                                        item.projectDeliveryDate
                                      ).format('DD/MM/YYYY')}
                                    /> */}
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                <td className="w-150">
                                  <FormGroup className="m-b-0">
                                    <FormControl
                                      type="text"
                                      className="br-0"
                                      name="percentCompletion"
                                      value={item.percentCompletion}
                                      onChange={event =>
                                        this.handleDetailChange(event, index)
                                      }
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                <td className="w-150">
                                  <FormGroup className="m-b-0">
                                    <DatePicker
                                      selected={item.qualityInspectionDate}
                                      onChange={e => {
                                        const value = e;
                                        this.handleDetailChange(
                                          {
                                            target: {
                                              name: 'qualityInspectionDate',
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
                                      className="db-0 custom-cal"
                                      timeFormat={false}
                                      closeOnSelect="true"
                                      inputProps={{
                                        placeholder: 'DD/MM/YYYY',
                                        readOnly: true
                                      }}
                                      dateFormat="DD/MM/YYYY"
                                      onChange={e => {
                                        const value = e;
                                        this.handleDetailChange(
                                          {
                                            target: {
                                              name: 'qualityInspectionDate',
                                              value
                                            }
                                          },
                                          index
                                        );
                                      }}
                                      dateFormat="DD/MM/YYYY"
                                      value={moment(
                                        item.qualityInspectionDate
                                      ).format('DD/MM/YYYY')}
                                    />*/}
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                <td className="w-150">
                                  <FormGroup className="m-b-0">
                                    <DatePicker
                                      selected={item.dispatchDate}
                                      onChange={e => {
                                        const value = e;
                                        this.handleDetailChange(
                                          {
                                            target: {
                                              name: 'dispatchDate',
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

                                    {/* <Datetime
                                      className="db-0 custom-cal"
                                      timeFormat={false}
                                      closeOnSelect="true"
                                      inputProps={{
                                        placeholder: 'DD/MM/YYYY',
                                        readOnly: true
                                      }}
                                      onChange={e => {
                                        const value = e;
                                        this.handleDetailChange(
                                          {
                                            target: {
                                              name: 'dispatchDate',
                                              value
                                            }
                                          },
                                          index
                                        );
                                      }}
                                      dateFormat="DD/MM/YYYY"
                                      value={moment(item.dispatchDate).format(
                                        'DD/MM/YYYY'
                                      )}
                                    /> */}
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                <td className="w-150">
                                  <FormGroup className="m-b-0">
                                    <DatePicker
                                      selected={item.partsReceiptDate}
                                      onChange={e => {
                                        const value = e;
                                        this.handleDetailChange(
                                          {
                                            target: {
                                              name: 'partsReceiptDate',
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

                                    {/* <Datetime
                                      className="db-0 custom-cal"
                                      timeFormat={false}
                                      closeOnSelect="true"
                                      inputProps={{
                                        placeholder: 'DD/MM/YYYY',
                                        readOnly: true
                                      }}
                                      onChange={e => {
                                        const value = e;
                                        this.handleDetailChange(
                                          {
                                            target: {
                                              name: 'partsReceiptDate',
                                              value
                                            }
                                          },
                                          index
                                        );
                                      }}
                                      dateFormat="DD/MM/YYYY"
                                      value={moment(
                                        item.partsReceiptDate
                                      ).format('DD/MM/YYYY')}
                                    /> */}
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                <td className="w-150">
                                  <FormGroup className="m-b-0">
                                    <FormControl
                                      type="text"
                                      className="br-0"
                                      name="comments"
                                      value={item.comments}
                                      onChange={event =>
                                        this.handleDetailChange(event, index)
                                      }
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                <td className="cursor-pointer">
                                  {item.uploadPicturesResponse &&
                                  item.uploadPicturesResponse[0] &&
                                  item.uploadPicturesResponse[0].mediaURL ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadPicturesResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        0,
                                        'uploadPicturesResponse'
                                      )}
                                      alt=""
                                      width="45"
                                      src={
                                        item.uploadPicturesResponse &&
                                        item.uploadPicturesResponse[0] &&
                                        item.uploadPicturesResponse[0].mediaURL
                                      }
                                    />
                                  ) : (
                                    <div className="upload-btn cursor-pointer sm-upload">
                                      <span className="ico-upload">
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#uploadIco`}
                                          />
                                        </svg>
                                      </span>

                                      <FormControl
                                        id="formControlsFile"
                                        type="file"
                                        label="File"
                                        accept="image/jpeg, image/png, image/gif, video/mp4, video/webm"
                                        onChange={e =>
                                          this.handleUploadPicture(e, index, '')
                                        }
                                      />
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <Link
                                    to={{
                                      pathname: 'ppap',
                                      state: {
                                        partNumber:
                                          item.partResponse.partNumber,
                                        buyerUserId: item.buyerResponse.id,
                                        partId: item.partResponse.id
                                      }
                                    }}
                                  >
                                    {item.ppapScore}
                                  </Link>
                                </td>
                                <td className="cursor-pointer">
                                  {(item.uploadPerfomaInvoiceResponse &&
                                    item.uploadPerfomaInvoiceResponse[0] &&
                                    item.uploadPerfomaInvoiceResponse[0]
                                      .mediaType ===
                                      'application/octet-stream') ||
                                  (item.uploadPerfomaInvoiceResponse &&
                                    item.uploadPerfomaInvoiceResponse[0] &&
                                    item.uploadPerfomaInvoiceResponse[0]
                                      .mediaType ===
                                      'application/vnd.ms-excel') ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadPerfomaInvoiceResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        1,
                                        'uploadPerfomaInvoiceResponse'
                                      )}
                                      alt=""
                                      src={xlsImage}
                                      width="45"
                                    />
                                  ) : item.uploadPerfomaInvoiceResponse &&
                                    item.uploadPerfomaInvoiceResponse[0] &&
                                    item.uploadPerfomaInvoiceResponse[0]
                                      .mediaType === 'application/pdf' ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadPerfomaInvoiceResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        1,
                                        'uploadPerfomaInvoiceResponse'
                                      )}
                                      alt=""
                                      src={pdfImage}
                                      width="45"
                                    />
                                  ) : (item.uploadPerfomaInvoiceResponse &&
                                      item.uploadPerfomaInvoiceResponse[0] &&
                                      item.uploadPerfomaInvoiceResponse[0]
                                        .mediaType ===
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                                    (item.uploadPerfomaInvoiceResponse &&
                                      item.uploadPerfomaInvoiceResponse[0] &&
                                      item.uploadPerfomaInvoiceResponse[0]
                                        .mediaType === 'text/plain') ||
                                    (item.uploadPerfomaInvoiceResponse &&
                                      item.uploadPerfomaInvoiceResponse[0] &&
                                      item.uploadPerfomaInvoiceResponse[0]
                                        .mediaType === 'application/msword') ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadPerfomaInvoiceResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        1,
                                        'uploadPerfomaInvoiceResponse'
                                      )}
                                      alt=""
                                      src={docImage}
                                      width="45"
                                    />
                                  ) : (
                                    <div className="upload-btn cursor-pointer sm-upload">
                                      <span className="ico-upload">
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#uploadIco`}
                                          />
                                        </svg>
                                      </span>

                                      <FormControl
                                        id="formControlsFile"
                                        type="file"
                                        label="File"
                                        accept=".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
                                        onChange={e =>
                                          this.handleUploadPerformaInvoice(
                                            e,
                                            index
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                                </td>
                                <td className="cursor-pointer">
                                  {(item.uploadMaterialInwardResponse &&
                                    item.uploadMaterialInwardResponse[0] &&
                                    item.uploadMaterialInwardResponse[0]
                                      .mediaType ===
                                      'application/octet-stream') ||
                                  (item.uploadMaterialInwardResponse &&
                                    item.uploadMaterialInwardResponse[0]
                                      .mediaType ===
                                      'application/vnd.ms-excel') ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadMaterialInwardResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        1,
                                        'uploadMaterialInwardResponse'
                                      )}
                                      alt=""
                                      src={xlsImage}
                                      width="45"
                                    />
                                  ) : item.uploadMaterialInwardResponse &&
                                    item.uploadMaterialInwardResponse[0] &&
                                    item.uploadMaterialInwardResponse[0]
                                      .mediaType === 'application/pdf' ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadMaterialInwardResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        1,
                                        'uploadMaterialInwardResponse'
                                      )}
                                      alt=""
                                      src={pdfImage}
                                      width="45"
                                    />
                                  ) : (item.uploadMaterialInwardResponse &&
                                      item.uploadMaterialInwardResponse[0] &&
                                      item.uploadMaterialInwardResponse[0]
                                        .mediaType ===
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                                    (item.uploadMaterialInwardResponse &&
                                      item.uploadMaterialInwardResponse[0]
                                        .mediaType === 'text/plain') ||
                                    (item.uploadMaterialInwardResponse &&
                                      item.uploadMaterialInwardResponse[0]
                                        .mediaType === 'application/msword') ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadMaterialInwardResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        1,
                                        'uploadMaterialInwardResponse'
                                      )}
                                      alt=""
                                      src={docImage}
                                      width="45"
                                    />
                                  ) : (
                                    <div className="upload-btn cursor-pointer sm-upload">
                                      <span className="ico-upload">
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#uploadIco`}
                                          />
                                        </svg>
                                      </span>

                                      <FormControl
                                        id="formControlsFile"
                                        type="file"
                                        label="File"
                                        accept=".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
                                        onChange={e =>
                                          this.handleUploadStamp(e, index)
                                        }
                                      />
                                    </div>
                                  )}
                                </td>
                                <td className="cursor-pointer">
                                  {(item.uploadFinalInvoiceResponse &&
                                    item.uploadFinalInvoiceResponse[0] &&
                                    item.uploadFinalInvoiceResponse[0]
                                      .mediaType ===
                                      'application/octet-stream') ||
                                  (item.uploadFinalInvoiceResponse &&
                                    item.uploadFinalInvoiceResponse[0] &&
                                    item.uploadFinalInvoiceResponse[0]
                                      .mediaType ===
                                      'application/vnd.ms-excel') ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadFinalInvoiceResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        1,
                                        'uploadFinalInvoiceResponse'
                                      )}
                                      alt=""
                                      src={xlsImage}
                                      width="45"
                                    />
                                  ) : item.uploadFinalInvoiceResponse &&
                                    item.uploadFinalInvoiceResponse[0] &&
                                    item.uploadFinalInvoiceResponse[0]
                                      .mediaType === 'application/pdf' ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadFinalInvoiceResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        1,
                                        'uploadFinalInvoiceResponse'
                                      )}
                                      alt=""
                                      src={pdfImage}
                                      width="45"
                                    />
                                  ) : (item.uploadFinalInvoiceResponse &&
                                      item.uploadFinalInvoiceResponse[0] &&
                                      item.uploadFinalInvoiceResponse[0]
                                        .mediaType ===
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                                    (item.uploadFinalInvoiceResponse &&
                                      item.uploadFinalInvoiceResponse[0] &&
                                      item.uploadFinalInvoiceResponse[0]
                                        .mediaType === 'text/plain') ||
                                    (item.uploadFinalInvoiceResponse &&
                                      item.uploadFinalInvoiceResponse[0] &&
                                      item.uploadFinalInvoiceResponse[0]
                                        .mediaType === 'application/msword') ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadFinalInvoiceResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        1,
                                        'uploadFinalInvoiceResponse'
                                      )}
                                      alt=""
                                      src={docImage}
                                      width="45"
                                    />
                                  ) : (
                                    <div className="upload-btn cursor-pointer sm-upload">
                                      <span className="ico-upload">
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#uploadIco`}
                                          />
                                        </svg>
                                      </span>

                                      <FormControl
                                        id="formControlsFile"
                                        type="file"
                                        label="File"
                                        accept=".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
                                        onChange={e =>
                                          this.handleUploadFinalInvoice(
                                            e,
                                            index
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                                </td>
                                <td className="cursor-pointer">
                                  {(item.uploadMiscellaneousDocumentsResponse &&
                                    item
                                      .uploadMiscellaneousDocumentsResponse[0] &&
                                    item.uploadMiscellaneousDocumentsResponse[0]
                                      .mediaType ===
                                      'application/octet-stream') ||
                                  (item.uploadMiscellaneousDocumentsResponse &&
                                    item
                                      .uploadMiscellaneousDocumentsResponse[0] &&
                                    item.uploadMiscellaneousDocumentsResponse[0]
                                      .mediaType ===
                                      'application/vnd.ms-excel') ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadMiscellaneousDocumentsResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        1,
                                        'uploadMiscellaneousDocumentsResponse'
                                      )}
                                      alt=""
                                      src={xlsImage}
                                      width="45"
                                    />
                                  ) : item.uploadMiscellaneousDocumentsResponse &&
                                    item
                                      .uploadMiscellaneousDocumentsResponse[0] &&
                                    item.uploadMiscellaneousDocumentsResponse[0]
                                      .mediaType === 'application/pdf' ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadMiscellaneousDocumentsResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        1,
                                        'uploadMiscellaneousDocumentsResponse'
                                      )}
                                      alt=""
                                      src={pdfImage}
                                      width="45"
                                    />
                                  ) : (item.uploadMiscellaneousDocumentsResponse &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0] &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0]
                                        .mediaType ===
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                                    (item.uploadMiscellaneousDocumentsResponse &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0] &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0]
                                        .mediaType === 'text/plain') ||
                                    (item.uploadMiscellaneousDocumentsResponse &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0] &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0]
                                        .mediaType === 'application/msword') ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadMiscellaneousDocumentsResponse,
                                        item.partResponse.partNumber,
                                        index,
                                        1,
                                        'uploadMiscellaneousDocumentsResponse'
                                      )}
                                      alt=""
                                      src={docImage}
                                      width="45"
                                    />
                                  ) : (
                                    <div className="upload-btn cursor-pointer sm-upload">
                                      <span className="ico-upload">
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#uploadIco`}
                                          />
                                        </svg>
                                      </span>

                                      <FormControl
                                        id="formControlsFile"
                                        type="file"
                                        label="File"
                                        accept=".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
                                        onChange={e =>
                                          this.handleUploadMiscellaneousDocumentse(
                                            e,
                                            index
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ];
                          })}
                        </tbody>
                      </Table>
                    </div>
                    <div className="text-center m-t-40 m-b-30">
                      <button
                        className="btn btn-default text-uppercase"
                        onClick={this.submitOrder}
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="noRecord">
                    {' '}
                    <img src={noRecord} alt="" />
                  </div>
                )}
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
                        <Link
                          to="home"
                          onClick={() => this.navigateTo('second')}
                        >
                          Review Part for Quotation
                        </Link>
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
                        <Link
                          to={{
                            pathname: 'home',
                            state: { path: 'third' }
                          }}
                          // to="home"
                          // onClick={() => this.navigateTo('third')}
                        >
                          Approve Quotation
                        </Link>
                      </li>
                      <li>
                        <Link
                          // to="home"
                          to={{
                            pathname: 'home',
                            state: { path: 'first' }
                          }}
                        >
                          My Dashboard
                        </Link>
                      </li>
                    </ul>

                    <ul className="p-tags">
                      {this.props.userInfo.userData.isAdmin ? (
                        <li>
                          <Link to="addUser">Add Users</Link>
                        </li>
                      ) : null}
                      <li>
                        <a className="disabled">Update Part Status</a>
                      </li>
                      <li>
                        <a className="disabled">Download Parts Summary</a>
                      </li>
                      <li>
                        <Link to="infrastructureAudit">
                          Infrastructure Audit
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        ) : null}
        <div>
          <Modal
            show={this.state.showReview}
            onHide={this.handleClose}
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
              <div className="p-lr-20" ref={el => (this.componentRef = el)}>
                <div className="m-b-50">
                  <Table condensed className="no-border-table">
                    <tbody>
                      <tr>
                        <td>
                          <div className="brand">
                            {this.props.userInfo &&
                            this.props.userInfo.userData.companyLogo ? (
                              <img
                                alt=""
                                src={
                                  this.props.userInfo &&
                                  this.props.userInfo.userData.companyLogo
                                }
                                className="obj-cover"
                              />
                            ) : (
                              <img alt="" src={Image1} className="obj-cover" />
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
                            {this.state.reviewData &&
                            this.state.reviewData.buyerResponse &&
                            this.state.reviewData.buyerResponse
                              .companyLogoURL ? (
                              <img
                                alt=""
                                src={
                                  this.state.reviewData.buyerResponse
                                    .companyLogoURL
                                }
                                className="obj-cover"
                              />
                            ) : (
                              <img alt="" src={Image1} className="obj-cover" />
                            )}
                          </div>
                          <div className="company-info">
                            <Table className="">
                              <tbody>
                                <tr>
                                  <td>Buyer:</td>
                                  <td>
                                    {this.state.reviewData &&
                                      this.state.reviewData.buyerResponse &&
                                      this.state.reviewData.buyerResponse
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
                      </tr>
                    </tbody>
                  </Table>
                  {/* <Row className="show-grid">
                    <Col md={6}>
                      <div className="brand">
                        {this.props.userInfo &&
                        this.props.userInfo.userData.companyLogo ? (
                          <img
                            alt=""
                            src={
                              this.props.userInfo &&
                              this.props.userInfo.userData.companyLogo
                            }
                            className="obj-cover"
                          />
                        ) : (
                          <img alt="" src={Image1} className="obj-cover" />
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
                        <img alt="" src={Image1} className="obj-cover" />
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
                              <td>
                                {this.state.reviewData &&
                                  this.state.reviewData
                                    .partCreatorDetailResponse &&
                                  this.state.reviewData
                                    .partCreatorDetailResponse.firstName}{" "}
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
                                    .partCreatorDetailResponse.userProfile}
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
                          <th>Specfication</th>
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
                          <th>Specfication</th>
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
                            this.state.reviewData.quotationCost.outerCostTax &&
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

                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <Table className="no-border-table">
                            <tbody>
                              <tr>
                                <td className="color-light">Currency:</td>
                                <td>
                                  {this.state.reviewData &&
                                    this.state.reviewData.currency}
                                </td>
                              </tr>
                              <tr>
                                <td className="color-light">
                                  Quotation for Quantity:
                                </td>
                                <td>
                                  {this.state.reviewData &&
                                    this.state.reviewData.quotationForQuantity}
                                </td>
                              </tr>
                              <tr>
                                <td className="color-light">
                                  Delivery Lead Time:
                                </td>
                                <td>
                                  {this.state.reviewData &&
                                    this.state.reviewData.deliveryLeadTime}
                                </td>
                              </tr>
                              <tr>
                                <td className="color-light">Target Date:</td>
                                <td>
                                  {this.state.reviewData &&
                                    this.state.reviewData.deliveryTargetDate}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </td>

                        <td>
                          {' '}
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
                                        this.state.reviewData
                                          .quotationProcess &&
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
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  {/* <Row>
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
                  </Row> */}
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
        {console.log('partMediaResponses000', this.state.partMediaResponses)}

        {this.state.show ? (
          <SliderModal
            show={this.state.show}
            partId={this.state.partIdforMedia}
            partNumber={this.state.partNumberforMedia}
            partMediaResponses={this.state.partMediaResponses}
            partIndex={this.state.partIndex}
            fileFlag={this.state.fileFlag}
            uploadType={this.state.uploadType}
            handleCloseModal={e => this.handleCloseModal(e)}
            handleCheckData={this.handleGetData}
          />
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionLoaderShow,
      actionLoaderHide,
      actionUpdatePartStatus,
      actionSubmitReleasePOListSupplier,
      actionUploadPicture,
      handleUploadReport,
      actionUploadPerformaInvoice,
      actionUploadStamp,
      actionUploadFinalInvoice,
      actionTabClick
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User,
    supplierUsers: state.supplierUsers
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdatePartStatus);
