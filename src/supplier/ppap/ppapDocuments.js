import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Table,
  Row,
  Col
} from 'react-bootstrap';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Image1 from '../../img/image.png';
import _ from 'lodash';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionSummaryPartStatus,
  actionTabData,
  handleUploadReport,
  actionSubmitPPAPDocuments,
  actionUpdatePPAPDocuments,
  actionGetPPAPDocuments,
  actionUpdatePPAPOtherDocuments,
  actionDeleteRevisionImage
} from '../../common/core/redux/actions';
import Sprite from '../../img/sprite.svg';
import {
  topPosition,
  ZoomInAndOut,
  showErrorToast
} from '../../common/commonFunctions';
import docImage from '../../img/doc.png';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
// import Sprite from "../../img/sprite.svg";
import makeThePartApiService from '../../common/core/api/apiService';
import CONSTANTS from '../../common/core/config/appConfig';
let { customConstant } = CONSTANTS;
class PpapDocuments extends Component {
  constructor(props) {
    super(props);

    this.vendorList = [
      { value: 'Design Documentation', name: 'Design Documentation' },
      {
        value: 'Engineering Change Documentation',
        name: 'Engineering Change Documentation'
      },
      {
        value: 'Customer Engineering Approval',
        name: 'Customer Engineering Approval'
      },
      {
        value: 'Design Failure Mode and Effects Analysis',
        name: 'Design Failure Mode and Effects Analysis'
      },
      {
        value: 'Process Flow Diagram',
        name: 'Process Flow Diagram'
      },
      {
        value: 'Process Failure Mode and Effects Analysis',
        name: 'Process Failure Mode and Effects Analysis'
      },
      {
        value: 'Control Plan',
        name: 'Control Plan'
      },
      {
        value: 'Measurement System Analysis Studies',
        name: 'Measurement System Analysis Studies'
      },
      { value: 'Dimensional Results', name: 'Dimensional Results' },
      {
        value: 'Records of Material / Performance Tests',
        name: 'Records of Material / Performance Tests'
      },
      { value: 'Initial Process Studies', name: 'Initial Process Studies' },
      {
        value: 'Qualified Laboratory Documentation',
        name: 'Qualified Laboratory Documentation'
      },
      {
        value: 'Appearance Approval Report',
        name: 'Appearance Approval Report'
      },
      { value: 'Sample Production Parts', name: 'Sample Production Parts' },
      { value: 'Master Sample', name: 'Master Sample' },
      { value: 'Checking Aids', name: 'Checking Aids' },
      {
        value: 'Customer Specific Requirements',
        name: 'Customer Specific Requirements'
      },
      { value: 'Part Submission Warrant', name: 'Part Submission Warrant' }
    ];

    this.state = {
      summaryPartStatus: '',
      tabKey: 'ppapDocuments',
      roleId: this.props.userInfo.userData.userRole,
      partNumber:
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.partNumber
          ? this.props.location.state.partNumber
          : 0,
      buyerUserId:
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.buyerUserId
          ? this.props.location.state.buyerUserId
          : 0,
      partId:
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.partId
          ? this.props.location.state.partId
          : 0,
      DocumentId: 0,
      ppapScore: 0,
      // ppapTitle: '',
      // companyName: '',
      // ppapLogo: '',
      companyNameBuyer: '',
      ppapTitleBuyer: '',
      ppapTitleSupplier: '',
      companyNameSupplier: '',
      ppapLogoSupplier: '',
      ppapLogoBuyer: '',
      partSearch: '',
      documentTypeList: [],
      documentType: this.vendorList, //[],
      otherDocumentTypeList: [],
      vendorList: this.vendorList,
      rowArray: [],
      documentRow: [{}, {}, {}],
      documentTypeListBlank: [
        {
          documentNo: 1,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerComments: [{ comment: '' }]
        },
        {
          documentNo: 2,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 3,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 4,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 5,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 6,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 7,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 8,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 9,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 10,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 11,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 12,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 13,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 14,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 15,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 16,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 17,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 18,
          documentType: '',
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        }
      ]
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.handleDocumentUpdate = this.handleDocumentUpdate.bind(this);
    this.handleUploadReport = this.handleUploadReport.bind(this);
    this.handleUpdateComment = this.handleUpdateComment.bind(this);
    this.deleteSpecification = this.deleteSpecification.bind(this);

    this.handleAddOtherDocument = this.handleAddOtherDocument.bind(this);
    this.handleDocumentUpdateOther = this.handleDocumentUpdateOther.bind(this);
    this.handleUploadReportOther = this.handleUploadReportOther.bind(this);
    this.handleUpdateDetailsOther = this.handleUpdateDetailsOther.bind(this);
    this.handleUpdateCommentOther = this.handleUpdateCommentOther.bind(this);
    this.deleteSpecificationOther = this.deleteSpecificationOther.bind(this);
    this.handleSpecificationFile = this.handleSpecificationFile.bind(this);
    this.handleSearchDetails = this.handleSearchDetails.bind(this);
    this.handlePartData = this.handlePartData.bind(this);
    this.handleSearchDetailsByKey = this.handleSearchDetailsByKey.bind(this);
    this.handleChange = this.handleChange.bind(this);
    topPosition();
  }

  handleDocumentUpdate = (index, event, item) => {
    let _this = this;
    let documentTypeListArr = this.state.documentTypeList;
    let documentTypeListJsonArr = documentTypeListArr[index];

    let chkDocumentType = documentTypeListJsonArr.documentType;
    let chkmediaType = documentTypeListJsonArr.mediaType;
    const value = event.target.value;
    const name = event.target.name;
    let rowArray = this.state.rowArray;
    rowArray[index][name] = value;
    this.setState({ rowArray: rowArray });
    let documentList = this.state.vendorList;
    if (value === 'Facility pictures') {
      this.setState({ indexOfRow: index });
    } else {
      this.setState({ indexOfRow: '' });
    }
    for (let i = 0; i < documentList.length; i++) {
      documentList[i].isDisabled = false;
    }
    for (let i = 0; i < rowArray.length; i++) {
      let docIndex = documentList.findIndex(
        todo => todo.name === rowArray[i].documentType
      );
      if (docIndex !== -1) documentList[docIndex].isDisabled = true;
    }
    this.setState({ vendorList: documentList });

    if (value !== '') {
      //_this.props.actionLoaderShow();
      var reqObject = {};

      if (name === 'supplierComments') {
        reqObject[name] = [value];
        if (
          chkDocumentType === '' ||
          chkmediaType === '' ||
          chkDocumentType === undefined ||
          chkmediaType === undefined
        ) {
          showErrorToast('Please Enter Document Type and Document Upload');
          return false;
        }
      } else if (name === 'documentType') {
        reqObject[name] = value;
        documentTypeListJsonArr.documentType = event.target.value;
        documentTypeListArr[index] = documentTypeListJsonArr;
        this.setState({ documentTypeList: documentTypeListArr });
        if (
          chkmediaType === undefined ||
          chkmediaType === '' ||
          chkmediaType === null
        ) {
          return false;
        }
      }

      reqObject['documentNo'] = index + 1;
      var reqArray = [];
      reqArray.push(reqObject);

      if (this.state.DocumentId) {
        let updateArr = {
          userId: _this.props.userInfo.userData.id,
          roleId: _this.props.userInfo.userData.userRole,
          partId: _this.state.partId,
          resourceId: _this.state.docType1,
          ppapId: this.state.DocumentId,
          ppapDocumentRequests: reqArray
        };
        _this.props
          .actionUpdatePPAPDocuments(updateArr)
          .then((result, error) => {
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      } else {
        let addArr = {
          userId: _this.props.userInfo.userData.id,
          roleId: _this.props.userInfo.userData.userRole,
          buyerUserId: _this.state.buyerUserId,
          partId: _this.state.partId,
          resourceId: _this.state.docType1,
          ppapDocumentRequests: reqArray
        };
        _this.props
          .actionSubmitPPAPDocuments(addArr)
          .then((result, error) => {
            _this.setState({
              DocumentId: result.payload.data.resourceId
            });
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      }

      let documentTypeList = this.state.documentTypeList;
      let documentTypeListJson = documentTypeList[index];
      if (name === 'documentType')
        documentTypeListJson.documentType = event.target.value;
      else if (name === 'supplierComments') {
        documentTypeListJson.supplierCommentsRes = event.target.value;
      }

      documentTypeList[index] = documentTypeListJson;
      this.setState({ documentTypeList: documentTypeList });
    }
  };

  // handleDropdownChange(event, item, rowIndex) {
  //   let _this = this;
  //   let { name, value } = event.target;
  //   let rowArray = this.state.rowArray;
  //   rowArray[rowIndex][name] = value;
  //   this.setState({ rowArray: rowArray });
  //   let documentList = this.state.vendorList;
  //   if (value === "Facility pictures") {
  //     this.setState({ indexOfRow: rowIndex });
  //   } else {
  //     this.setState({ indexOfRow: "" });
  //   }
  //   for (let i = 0; i < documentList.length; i++) {
  //     documentList[i].isDisabled = false;
  //   }
  //   for (let i = 0; i < rowArray.length; i++) {
  //     let docIndex = documentList.findIndex(
  //       todo => todo.name === rowArray[i].documentType
  //     );
  //     if (docIndex !== -1) documentList[docIndex].isDisabled = true;
  //   }
  //   this.setState({ vendorList: documentList });
  // }

  componentWillMount() {
    let rowArray = this.state.rowArray || [];
    this.state.vendorList &&
      this.state.vendorList.forEach(function(elem, index) {
        rowArray[index] = {};
      });
    this.setState({ rowArray: rowArray });

    let documentTypeListArr = [
      {
        documentNo: 1,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 2,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 3,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 4,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 5,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 6,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 7,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 8,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 9,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 10,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 11,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 12,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 13,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 14,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 15,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 16,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 17,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      {
        documentNo: 18,
        supplierCommentsRes: [{ comment: '' }],
        buyerComments: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      }
    ];
    let otherDocumentTypeList = [];
    this.setState({
      documentTypeList: documentTypeListArr,
      otherDocumentTypeList: otherDocumentTypeList,
      //documentType: documentType,
      roleId: this.props.userInfo.userData.userRole,
      partNumber: this.state.partNumber,
      buyerUserId: this.state.buyerUserId,
      partId: this.state.partId
    });
  }

  componentDidMount() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      sortByTotalAmount: true
    };
    this.props.actionLoaderShow();
    this.props
      .actionSummaryPartStatus(data)
      .then((result, error) => {
        _this.setState({
          summaryPartStatus: result.payload.data.resourceData
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    let ppapData = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      partId: this.state.partId
    };
    let addressBuyer = '';
    let addressSupplier = '';
    let addrBuyer = '';
    let addrSupplier = '';
    let countryBuyer = '';
    let countrySupplier = '';
    let companyNameBuyer = '';
    let titleSupplier = '';
    let titleBuyer = '';
    let companyNameSupplier = '';
    this.props
      .actionGetPPAPDocuments(ppapData)
      .then((result, error) => {
        let ppapDetails = result.payload.data.resourceData;

        let ppapArr = ppapDetails.listOfPPAPDocumentRes
          ? ppapDetails.listOfPPAPDocumentRes
          : [];

        let resultData = _this.state.documentTypeList.map(
          obj => ppapArr.find(o => o.documentNo === obj.documentNo) || obj
        );

        let documentType = _this.state.documentTypeList.map(
          obj => ppapArr.find(o => o.documentType === obj.documentType) || obj
        );

        let vendorList = _this.state.vendorList;
        resultData &&
          resultData.forEach(function(item, index) {
            if (item.documentType && item.documentType !== '') {
              vendorList.forEach(function(itemVendor, indexVendor) {
                if (item.documentType === itemVendor.name) {
                  _this.state.vendorList[indexVendor].isDisabled = true;
                  _this.state.vendorList[indexVendor].isSelected = true;
                }
              });
            }
          });

        addressBuyer = _.findKey(ppapDetails.buyerResponse.addresses, function(
          o
        ) {
          return o.flag === 1;
        });

        addressSupplier = _.findKey(
          ppapDetails.supplierResponse.addresses,
          function(o) {
            return o.flag === 1;
          }
        );

        companyNameSupplier = ppapDetails.supplierResponse.companyName;
        addressSupplier = addressSupplier ? addressSupplier : 0;
        addrSupplier = ppapDetails.supplierResponse.addresseResponse[
          addressSupplier
        ].address
          ? ppapDetails.supplierResponse.addresseResponse[addressSupplier]
              .address
          : '';
        countrySupplier = ppapDetails.supplierResponse.addresseResponse[
          addressSupplier
        ].country
          ? ppapDetails.supplierResponse.addresseResponse[addressSupplier]
              .country
          : '';
        titleSupplier =
          companyNameSupplier + ' ' + addrSupplier + ', ' + countrySupplier;
        addressBuyer = addressBuyer ? addressBuyer : 0;
        companyNameBuyer = ppapDetails.buyerResponse.companyName;
        addrBuyer = ppapDetails.buyerResponse.addresses[addressBuyer].address
          ? ppapDetails.buyerResponse.addresses[addressBuyer].address
          : '';
        countryBuyer = ppapDetails.buyerResponse.addresses[addressBuyer].country
          ? ppapDetails.buyerResponse.addresses[addressBuyer].country
          : '';
        titleBuyer = companyNameBuyer + ' ' + addrBuyer + ', ' + countryBuyer;

        let otherPpapArr = ppapDetails.listOfOtherPPAPDocumentRes;
        if (otherPpapArr)
          _this.setState({ otherDocumentTypeList: otherPpapArr });
        _this.setState({
          documentTypeList: resultData,
          DocumentId: ppapDetails.id,
          ppapScore: ppapDetails.ppapScore,

          ppapTitleBuyer: titleBuyer,
          companyNameSupplier: companyNameSupplier,
          ppapTitleSupplier: titleSupplier,
          companyNameBuyer: companyNameBuyer,
          ppapLogoSupplier: ppapDetails.supplierResponse.companyLogoURL
            ? customConstant.amazonURL +
              ppapDetails.supplierResponse.companyLogoURL
            : '',
          ppapLogoBuyer: ppapDetails.buyerResponse.companyLogoURL
            ? customConstant.amazonURL +
              ppapDetails.buyerResponse.companyLogoURL
            : '',
          vendorList: vendorList
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  navigateToRFQ(data) {
    this.props.actionTabData(data);
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

  deleteSpecification(event, index, path) {
    let _this = this;
    this.props
      .actionDeleteRevisionImage(path)
      .then((result, error) => {
        let documentTypeListArr = this.state.documentTypeList;
        let documentTypeListJsonArr = documentTypeListArr[index];

        let updateArr = {
          userId: _this.props.userInfo.userData.id,
          roleId: _this.props.userInfo.userData.userRole,
          partId: _this.state.partId,
          ppapId: this.state.DocumentId,
          ppapDocumentRequests: [
            {
              documentNo: index + 1,
              mediaName: '',
              mediaURL: '',
              mediaSize: '',
              mediaExtension: '',
              mediaType: ''
            }
          ]
        };

        makeThePartApiService('updatePPAPDocuments', updateArr).then(
          response => {
            console.log(response);
          }
        );

        documentTypeListJsonArr.mediaType = '';
        documentTypeListJsonArr.mediaName = "'";
        documentTypeListJsonArr.mediaSize = '';
        documentTypeListJsonArr.mediaURL = '';

        documentTypeListArr[index] = documentTypeListJsonArr;

        this.setState({ documentTypeList: documentTypeListArr });
      })
      .catch();
  }

  handleUploadReport(event, index) {
    const fileObject = event.target.files[0];
    let _this = this;
    let reportArray = [];
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
        let reportArray = result.payload.data;

        var reqObject = {};
        let documentTypeListArr = this.state.documentTypeList;
        let documentTypeListJsonArr = documentTypeListArr[index];
        let chkDocumentType = documentTypeListJsonArr.documentType;
        var reqArray = [];
        let mediaExtension = reportArray.filePath.split('.').pop(-1);

        reqObject['documentNo'] = index + 1;
        reqObject['mediaName'] = reportArray.filePath;
        reqObject['mediaURL'] = reportArray.s3FilePath;
        reqObject['mediaSize'] = reportArray.fileSize;
        reqObject['mediaExtension'] = mediaExtension;
        reqObject['mediaType'] = reportArray.contentType;
        reqObject['documentType'] = chkDocumentType;
        reqArray.push(reqObject);
        documentTypeListJsonArr.mediaType = reportArray.contentType;
        documentTypeListJsonArr.mediaName = reqArray.filePath;
        documentTypeListJsonArr.mediaSize = reportArray.fileSize;
        documentTypeListJsonArr.mediaURL =
          customConstant.amazonURL + reportArray.s3FilePath;
        documentTypeListArr[index] = documentTypeListJsonArr;
        this.setState({ documentTypeList: documentTypeListArr });

        this.handleUpdateDetails(reqArray, index);

        _this.props.actionLoaderHide();
      })
      .catch(e => {
        _this.props.actionLoaderHide();
      });
  }

  handleUpdateDetails(reqArray, index) {
    let _this = this;
    _this.props.actionLoaderShow();
    if (this.state.DocumentId) {
      let updateArr = {
        userId: _this.props.userInfo.userData.id,
        roleId: _this.props.userInfo.userData.userRole,
        partId: _this.state.partId,
        ppapId: this.state.DocumentId,
        ppapDocumentRequests: reqArray
      };
      _this.props
        .actionUpdatePPAPDocuments(updateArr)
        .then((result, error) => {
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      let addArr = {
        userId: _this.props.userInfo.userData.id,
        roleId: _this.props.userInfo.userData.userRole,
        buyerUserId: _this.state.buyerUserId,
        partId: _this.state.partId,
        resourceId: _this.state.docType1,
        ppapDocumentRequests: reqArray
      };
      _this.props
        .actionSubmitPPAPDocuments(addArr)
        .then((result, error) => {
          let documentTypeListArr = this.state.documentTypeList;
          let documentTypeListJsonArr = documentTypeListArr[index];

          documentTypeListJsonArr.mediaType = reqArray.mediaType;
          documentTypeListJsonArr.mediaName = reqArray.filePath;
          documentTypeListJsonArr.mediaSize = reqArray.fileSize;
          documentTypeListJsonArr.mediaURL = reqArray.s3FilePath;

          documentTypeListArr[index] = documentTypeListJsonArr;
          this.setState({ documentTypeList: documentTypeListArr });
          _this.setState({
            DocumentId: result.payload.data.resourceId
          });
          // _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  }

  handleUpdateComment = (index, event) => {
    let documentTypeList = this.state.documentTypeList;
    let documentTypeListJson = documentTypeList[index];
    documentTypeListJson.supplierCommentsRes = event.target.value;
    this.setState({ documentTypeList: documentTypeList });
  };

  handleUpdateCommentOther = (index, event) => {
    let documentTypeList = this.state.otherDocumentTypeList;
    let documentTypeListJson = documentTypeList[index];
    documentTypeListJson.supplierCommentsRes = event.target.value;
    this.setState({ otherDocumentTypeList: documentTypeList });
  };

  handleUploadReportOther(event, index) {
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
      .handleUploadReport(formData)
      .then((result, error) => {
        let reportArray = result.payload.data;

        var reqObject = {};
        let documentTypeListArr = this.state.otherDocumentTypeList;
        let documentTypeListJsonArr = documentTypeListArr[index];
        let chkDocumentType = documentTypeListJsonArr.documentType;

        var reqArray = [];

        let mediaExtension = reportArray.filePath.split('.').pop(-1);

        reqObject['documentNo'] = index + 1;
        reqObject['mediaName'] = reportArray.filePath;
        reqObject['mediaURL'] = reportArray.s3FilePath;
        reqObject['mediaSize'] = reportArray.fileSize;
        reqObject['mediaExtension'] = mediaExtension;
        reqObject['mediaType'] = reportArray.contentType;
        reqObject['documentType'] = chkDocumentType;
        reqArray.push(reqObject);

        documentTypeListJsonArr.mediaType = reportArray.contentType;
        documentTypeListJsonArr.mediaName = reqArray.filePath;
        documentTypeListJsonArr.mediaSize = reportArray.fileSize;
        documentTypeListJsonArr.mediaURL = reportArray.s3FilePath;

        documentTypeListArr[index] = documentTypeListJsonArr;
        this.setState({ otherDocumentTypeList: documentTypeListArr });

        this.handleUpdateDetailsOther(reqArray, index);
        console.log('reqArray--', reqArray);

        this.handleUpdateDetailsOther(reqArray, index);
        _this.props.actionLoaderHide();
      })
      .catch(e => {
        _this.props.actionLoaderHide();
      });
  }

  handleDocumentUpdateOther = (index, event) => {
    let _this = this;
    let documentTypeListArr = this.state.otherDocumentTypeList;
    let documentTypeListJsonArr = documentTypeListArr[index];

    let chkDocumentType = documentTypeListJsonArr.documentType;
    let chkmediaType = documentTypeListJsonArr.mediaType;

    const value = event.target.value;
    const name = event.target.name;

    console.log('handleDocumentUpdateOther---1');

    if (value !== '') {
      //_this.props.actionLoaderShow();
      var reqObject = {};

      if (name === 'supplierComments') {
        reqObject[name] = [value];
        if (
          chkDocumentType === '' ||
          chkmediaType === '' ||
          chkDocumentType === undefined ||
          chkmediaType === undefined
        ) {
          showErrorToast('Please Enter Document Type and Document Upload');
          return false;
        }
      } else if (name === 'documentType') {
        console.log('handleDocumentUpdateOther---22');
        reqObject[name] = value;
        documentTypeListJsonArr.documentType = event.target.value;
        documentTypeListArr[index] = documentTypeListJsonArr;
        this.setState({ otherDocumentTypeList: documentTypeListArr });
        if (
          chkmediaType === undefined ||
          chkmediaType === '' ||
          chkmediaType === null
        ) {
          console.log(
            'handleDocumentUpdateOther---66',
            this.state.otherDocumentTypeList
          );
          return false;
        }
      }
      console.log('handleDocumentUpdateOther---55');
      reqObject['documentNo'] = index + 1;
      var reqArray = [];
      reqArray.push(reqObject);

      if (this.state.DocumentId) {
        console.log('handleDocumentUpdateOther---33');
        let updateArr = {
          userId: _this.props.userInfo.userData.id,
          roleId: _this.props.userInfo.userData.userRole,
          partId: _this.state.partId,
          resourceId: _this.state.docType1,
          ppapId: this.state.DocumentId,
          otherPpapDocumentRequests: reqArray
        };
        _this.props
          .actionUpdatePPAPOtherDocuments(updateArr)
          .then((result, error) => {
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      } else {
        console.log('handleDocumentUpdateOther---44');
        let addArr = {
          userId: _this.props.userInfo.userData.id,
          roleId: _this.props.userInfo.userData.userRole,
          buyerUserId: _this.state.buyerUserId,
          partId: _this.state.partId,
          resourceId: _this.state.docType1,
          otherPpapDocumentRequests: reqArray
        };
        _this.props
          .actionSubmitPPAPDocuments(addArr)
          .then((result, error) => {
            _this.setState({
              DocumentId: result.payload.data.resourceId
            });
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      }

      let documentTypeList = this.state.otherDocumentTypeList;
      let documentTypeListJson = documentTypeList[index];
      if (name === 'documentType')
        documentTypeListJson.documentType = event.target.value;
      else if (name === 'supplierComments') {
        documentTypeListJson.supplierCommentsRes = event.target.value;
      }

      documentTypeList[index] = documentTypeListJson;
      this.setState({ otherDocumentTypeList: documentTypeList });

      console.log(
        'otherDocumentTypeList----',
        this.state.otherDocumentTypeList
      );
    }
  };

  handleUpdateDetailsOther(reqArray, index) {
    let _this = this;
    _this.props.actionLoaderShow();
    if (this.state.DocumentId) {
      let updateArr = {
        userId: _this.props.userInfo.userData.id,
        roleId: _this.props.userInfo.userData.userRole,
        partId: _this.state.partId,
        ppapId: this.state.DocumentId,
        otherPpapDocumentRequests: reqArray
      };
      _this.props
        .actionUpdatePPAPOtherDocuments(updateArr)
        .then((result, error) => {
          _this.props.actionLoaderHide();
          return false;
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      let addArr = {
        userId: _this.props.userInfo.userData.id,
        roleId: _this.props.userInfo.userData.userRole,
        buyerUserId: _this.state.buyerUserId,
        partId: _this.state.partId,
        resourceId: _this.state.docType1,
        otherPpapDocumentRequests: reqArray
      };
      _this.props
        .actionSubmitPPAPDocuments(addArr)
        .then((result, error) => {
          _this.setState({
            DocumentId: result.payload.data.resourceId
          });
          // _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  }
  deleteSpecificationOther(event, index, path) {
    let _this = this;
    this.props
      .actionDeleteRevisionImage(path)
      .then((result, error) => {
        let documentTypeListArr = this.state.otherDocumentTypeList;
        let documentTypeListJsonArr = documentTypeListArr[index];

        let updateArr = {
          userId: _this.props.userInfo.userData.id,
          roleId: _this.props.userInfo.userData.userRole,
          partId: _this.state.partId,
          ppapId: this.state.DocumentId,
          otherPpapDocumentRequests: [
            {
              documentNo: index + 1,
              mediaName: '',
              mediaURL: '',
              mediaSize: '',
              mediaExtension: '',
              mediaType: ''
            }
          ]
        };

        makeThePartApiService('updatePPAPOtherDocuments', updateArr).then(
          response => {
            console.log(response);
          }
        );

        documentTypeListJsonArr.mediaType = '';
        documentTypeListJsonArr.mediaName = "'";
        documentTypeListJsonArr.mediaSize = '';
        documentTypeListJsonArr.mediaURL = '';

        documentTypeListArr[index] = documentTypeListJsonArr;

        this.setState({ otherDocumentTypeList: documentTypeListArr });
      })
      .catch();
  }
  handleAddOtherDocument = () => {
    const item = {
      documentNo: 1,
      buyerDocReviewStatus: '',
      deviationApproved: '',
      supplierCommentsRes: [{ comment: '' }],
      documentStatus: '',
      buyerCommentsRes: [{ comment: '' }],
      designerComments: [{ comment: '' }]
    };

    if (this.state.otherDocumentTypeList)
      this.setState({
        otherDocumentTypeList: [...this.state.otherDocumentTypeList, item]
      });
    else this.setState({ otherDocumentTypeList: [item] });
  };

  handleSpecificationFile(event, data) {
    window.open(data);
  }
  handleSearchDetails(event) {
    this.handlePartData(event.target.value);
  }
  handleSearchDetailsByKey(event) {
    if (event.key === 'Enter') {
      this.handlePartData(event.target.value);
    }
  }

  handlePartData = partNumber => {
    let _this = this;
    let ppapData = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      partNumber: partNumber
    };
    let addressBuyer = '';
    let addressSupplier = '';
    let addrBuyer = '';
    let addrSupplier = '';
    let countryBuyer = '';
    let countrySupplier = '';
    let companyNameBuyer = '';
    let titleSupplier = '';
    let titleBuyer = '';
    let companyNameSupplier = '';
    let resultDataOther = [];
    this.props
      .actionGetPPAPDocuments(ppapData)
      .then((result, error) => {
        if (result.payload.data.status === 400) {
          showErrorToast(result.payload.data.responseMessage);
        } else {
          let ppapDetails = result.payload.data.resourceData;

          let ppapArr =
            ppapDetails.listOfPPAPDocumentRes &&
            ppapDetails.listOfPPAPDocumentRes.length > 0
              ? ppapDetails.listOfPPAPDocumentRes
              : this.state.documentTypeListBlank;

          addressBuyer = _.findKey(
            ppapDetails.buyerResponse.addresses,
            function(o) {
              return o.flag === 1;
            }
          );

          addressSupplier = _.findKey(
            ppapDetails.supplierResponse.addresses,
            function(o) {
              return o.flag === 1;
            }
          );

          companyNameSupplier = ppapDetails.supplierResponse.companyName;
          addressSupplier = addressSupplier ? addressSupplier : 0;
          addrSupplier = ppapDetails.supplierResponse.addresseResponse[
            addressSupplier
          ].address
            ? ppapDetails.supplierResponse.addresseResponse[addressSupplier]
                .address
            : '';
          countrySupplier = ppapDetails.supplierResponse.addresseResponse[
            addressSupplier
          ].country
            ? ppapDetails.supplierResponse.addresseResponse[addressSupplier]
                .country
            : '';
          titleSupplier =
            companyNameSupplier + ' ' + addrSupplier + ', ' + countrySupplier;
          addressBuyer = addressBuyer ? addressBuyer : 0;
          companyNameBuyer = ppapDetails.buyerResponse.companyName;
          addrBuyer = ppapDetails.buyerResponse.addresses[addressBuyer].address
            ? ppapDetails.buyerResponse.addresses[addressBuyer].address
            : '';
          countryBuyer = ppapDetails.buyerResponse.addresses[addressBuyer]
            .country
            ? ppapDetails.buyerResponse.addresses[addressBuyer].country
            : '';
          titleBuyer = companyNameBuyer + ' ' + addrBuyer + ', ' + countryBuyer;

          let resultData = _this.state.documentTypeList.map(
            obj => ppapArr.find(o => o.documentNo === obj.documentNo) || obj
          );

          let otherPpapArr =
            ppapDetails.listOfOtherPPAPDocumentRes &&
            ppapDetails.listOfOtherPPAPDocumentRes.length > 0
              ? ppapDetails.listOfOtherPPAPDocumentRes
              : [];

          if (
            ppapDetails.listOfOtherPPAPDocumentRes &&
            ppapDetails.listOfOtherPPAPDocumentRes.length > 0
          ) {
            resultDataOther = otherPpapArr;
          } else {
            resultDataOther = [];
          }

          //if (resultDataOther)
          _this.setState({ otherDocumentTypeList: resultDataOther });

          _this.setState({
            documentTypeList: resultData,
            DocumentId: ppapDetails.id,
            ppapScore: ppapDetails.ppapScore,
            ppapTitleBuyer: titleBuyer,
            companyNameSupplier: companyNameSupplier,
            ppapTitleSupplier: titleSupplier,
            companyNameBuyer: companyNameBuyer,
            ppapLogoSupplier: ppapDetails.supplierResponse.companyLogoURL
              ? customConstant.amazonURL +
                ppapDetails.supplierResponse.companyLogoURL
              : '',
            ppapLogoBuyer: ppapDetails.buyerResponse.companyLogoURL
              ? customConstant.amazonURL +
                ppapDetails.buyerResponse.companyLogoURL
              : '',
            partNumber: ppapDetails.partResponse.partNumber
          });
          this.props.history.push({
            pathname: '/supplier/ppap'
          });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  };
  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }
  handleDocumentUpdate11 = (index, event) => {
    let _this = this;

    let documentTypeListArr = this.state.documentTypeList;
    let documentTypeListJsonArr = documentTypeListArr[index];

    let chkDocumentType = documentTypeListJsonArr.documentType;
    let chkmediaType = documentTypeListJsonArr.mediaType;
    const value = event.target.value;
    const name = event.target.name;
    if (value !== '') {
      //_this.props.actionLoaderShow();
      var reqObject = {};

      if (name === 'supplierComments') {
        reqObject[name] = [value];
        if (
          chkDocumentType === '' ||
          chkmediaType === '' ||
          chkDocumentType === undefined ||
          chkmediaType === undefined
        ) {
          showErrorToast('Please Enter Document Type and Document Upload');
          return false;
        }
      } else if (name === 'documentType') {
        reqObject[name] = value;
        documentTypeListJsonArr.documentType = event.target.value;
        documentTypeListArr[index] = documentTypeListJsonArr;
        this.setState({ documentTypeList: documentTypeListArr });
        if (
          chkmediaType === undefined ||
          chkmediaType === '' ||
          chkmediaType === null
        ) {
          return false;
        }
      }

      reqObject['documentNo'] = index + 1;
      var reqArray = [];
      reqArray.push(reqObject);

      if (this.state.DocumentId) {
        let updateArr = {
          userId: _this.props.userInfo.userData.id,
          roleId: _this.props.userInfo.userData.userRole,
          partId: _this.state.partId,
          resourceId: _this.state.docType1,
          ppapId: this.state.DocumentId,
          ppapDocumentRequests: reqArray
        };
        _this.props
          .actionUpdatePPAPDocuments(updateArr)
          .then((result, error) => {
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      } else {
        let addArr = {
          userId: _this.props.userInfo.userData.id,
          roleId: _this.props.userInfo.userData.userRole,
          buyerUserId: _this.state.buyerUserId,
          partId: _this.state.partId,
          resourceId: _this.state.docType1,
          ppapDocumentRequests: reqArray
        };
        _this.props
          .actionSubmitPPAPDocuments(addArr)
          .then((result, error) => {
            _this.setState({
              DocumentId: result.payload.data.resourceId
            });
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      }

      let documentTypeList = this.state.documentTypeList;
      let documentTypeListJson = documentTypeList[index];
      if (name === 'documentType')
        documentTypeListJson.documentType = event.target.value;
      else if (name === 'supplierComments') {
        documentTypeListJson.supplierCommentsRes = event.target.value;
      }

      documentTypeList[index] = documentTypeListJson;
      this.setState({ documentTypeList: documentTypeList });
    }
  };

  handleDocumentUpdate33333 = (event, item, index) => {
    let _this = this;

    let documentTypeListArr = this.state.documentTypeList;
    let documentTypeListJsonArr = documentTypeListArr[index];

    let chkDocumentType =
      documentTypeListJsonArr && documentTypeListJsonArr.documentType;
    let chkmediaType =
      documentTypeListJsonArr && documentTypeListJsonArr.mediaType;
    const value = event.target.value;
    const name = event.target.name;
    // console.log("name -- ",name,"value -- ",value);

    let rowArray = this.state.rowArray;
    rowArray[index][name] = value;
    this.setState({ rowArray: rowArray });
    let documentList = this.state.vendorList;

    if (value === 'Facility pictures') {
      this.setState({ indexOfRow: index });
    } else {
      this.setState({ indexOfRow: '' });
    }

    for (let i = 0; i < documentList.length; i++) {
      documentList[i].isDisabled = false;
    }
    for (let i = 0; i < rowArray.length; i++) {
      let docIndex = documentList.findIndex(
        todo => todo.name === rowArray[i].documentType
      );
      if (docIndex !== -1) documentList[docIndex].isDisabled = true;
    }
    this.setState({ vendorList: documentList });

    if (value !== '') {
      //_this.props.actionLoaderShow();
      var reqObject = {};

      if (name === 'supplierComments') {
        reqObject[name] = [value];
        if (
          chkDocumentType === '' ||
          chkmediaType === '' ||
          chkDocumentType === undefined ||
          chkmediaType === undefined
        ) {
          showErrorToast('Please Enter Document Type and Document Upload');
          return false;
        }
      } else if (name === 'documentType') {
        reqObject[name] = value;
        documentTypeListJsonArr.documentType = event.target.value;
        documentTypeListArr[index] = documentTypeListJsonArr;
        this.setState({ documentTypeList: documentTypeListArr });
        if (
          chkmediaType === undefined ||
          chkmediaType === '' ||
          chkmediaType === null
        ) {
          return false;
        }
      }

      reqObject['documentNo'] = index + 1;
      var reqArray = [];
      reqArray.push(reqObject);

      if (this.state.DocumentId) {
        let updateArr = {
          userId: _this.props.userInfo.userData.id,
          roleId: _this.props.userInfo.userData.userRole,
          partId: _this.state.partId,
          resourceId: _this.state.docType1,
          ppapId: this.state.DocumentId,
          ppapDocumentRequests: reqArray
        };
        _this.props
          .actionUpdatePPAPDocuments(updateArr)
          .then((result, error) => {
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      } else {
        let addArr = {
          userId: _this.props.userInfo.userData.id,
          roleId: _this.props.userInfo.userData.userRole,
          buyerUserId: _this.state.buyerUserId,
          partId: _this.state.partId,
          resourceId: _this.state.docType1,
          ppapDocumentRequests: reqArray
        };
        _this.props
          .actionSubmitPPAPDocuments(addArr)
          .then((result, error) => {
            _this.setState({
              DocumentId: result.payload.data.resourceId
            });
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      }

      let documentTypeList = this.state.documentTypeList;
      let documentTypeListJson = documentTypeList[index];
      if (name === 'documentType')
        documentTypeListJson.documentType = event.target.value;
      else if (name === 'supplierComments') {
        documentTypeListJson.supplierCommentsRes = event.target.value;
      }

      documentTypeList[index] = documentTypeListJson;
      this.setState({ documentTypeList: documentTypeList });
    }
  };

  render() {
    let _this = this;
    return (
      <div>
        <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
        <Header />
        <SideBar
          activeTabKeyAction={this.activeTabKeyAction}
          activeTabKey={
            this.state.tabKey === 'ppapDocuments' ? 'ppapDocuments' : 'none'
          }
        />
        {this.state.tabKey === 'ppapDocuments' ? (
          <div className="content-body flex">
            <div className="content">
              <div className className="container-fluid">
                <h4 className="hero-title">Upload PPAP Status </h4>

                <Table condensed className="no-border-table">
                  <tbody>
                    <tr>
                      <td>
                        <div className="brand">
                          <img
                            alt="image"
                            src={
                              this.state.ppapLogoSupplier
                                ? this.state.ppapLogoSupplier
                                : Image1
                            }
                            className="obj-cover"
                          />
                        </div>
                        <div className="company-info">
                          <Table className="">
                            <tbody>
                              <tr>
                                <td>Supplier:</td>
                                <td>{this.state.companyNameSupplier}</td>
                              </tr>
                              <tr>
                                <td>Contact:</td>
                                <td>{this.state.ppapTitleSupplier}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </td>

                      <td>
                        <div className="brand">
                          <img
                            alt="image"
                            src={
                              this.state.ppapLogoBuyer
                                ? this.state.ppapLogoBuyer
                                : Image1
                            }
                            className="obj-cover"
                          />
                        </div>
                        <div className="company-info">
                          <Table className="">
                            <tbody>
                              <tr>
                                <td>Buyer:</td>
                                <td>{this.state.companyNameBuyer}</td>
                              </tr>
                              <tr>
                                <td>Contact:</td>
                                <td>{this.state.ppapTitleBuyer}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>

                {/* <div className="company-name flex align-center">
                  <div className="brand">
                    <img
                      alt="image"
                      src={this.state.ppapLogo ? this.state.ppapLogo : Image1}
                      className="obj-cover"
                    />
                  </div>
                  <h4>{this.state.ppapTitle}</h4>
                </div> */}

                <div>
                  <Row className="show-grid">
                    <Col md={12}>
                      <div className="filter-in b-bottom border-light m-b-20">
                        <div className="flex justify-space-between p-20">
                          <FormGroup controlId="formInlineName">
                            <FormControl
                              type="text"
                              name="searchByPart"
                              className="orange"
                              value={this.state.searchByPart}
                              placeholder="Search..."
                              onKeyUp={this.handleSearchDetailsByKey}
                              onChange={e => this.handleChange(e)}
                            />
                            <FormControl.Feedback />
                            <span className="ico-search">
                              <svg>
                                <use xlinkHref={`${Sprite}#searchIco`} />
                              </svg>
                            </span>
                          </FormGroup>
                          <div className="show-p-info flex align-center">
                            <ControlLabel>Part Number</ControlLabel>
                            {/* <FormControl type="text" /> */}
                            <span>{this.state.partNumber}</span>
                          </div>

                          <div className="show-p-info flex align-center">
                            <ControlLabel>Total PPAP Score</ControlLabel>
                            {/* <FormControl type="text" /> */}
                            <span>{this.state.ppapScore}</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div>
                  <Table bordered responsive hover className="custom-table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th className="w-175">Document Type</th>
                        <th>Upload</th>
                        <th>Buyer Review status</th>
                        <th>Action</th>
                        <th className="w-125"> Deviation Approved</th>
                        <th>Supplier Comments</th>
                        <th>Supplier Quality</th>
                        <th>Designer Comments</th>
                      </tr>
                      <tr className="h-10"> </tr>
                    </thead>
                    <tbody>
                      {_this.state.documentTypeList &&
                        _this.state.documentTypeList.map((item, index) => {
                          let status =
                            item.documentStatus === 'APPROVED' ? 1 : 0;
                          return [
                            <tr>
                              <td>{index + 1}.</td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                    name="documentType"
                                    value={item.documentType}
                                    // onChange={e => {
                                    //   this.handleDocumentUpdate(index, e);
                                    // }}
                                    onChange={event => {
                                      this.handleDocumentUpdate(
                                        index,
                                        event,
                                        item
                                      );
                                    }}
                                  >
                                    <option value="select">select</option>
                                    {_this.state.documentType &&
                                      _this.state.documentType.map(
                                        (item, index) => {
                                          return [
                                            <option
                                              value={item.value}
                                              disabled={item.isDisabled}
                                            >
                                              {item.value}
                                            </option>
                                          ];
                                        }
                                      )}
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td style={{ width: '71px' }}>
                                {item &&
                                item.mediaType === 'application/msword' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-space-between align-center m-b-0">
                                        <span
                                          onClick={event =>
                                            this.handleSpecificationFile(
                                              event,
                                              item && item.mediaURL
                                            )
                                          }
                                        >
                                          <img
                                            alt="image"
                                            src={docImage}
                                            className="mr-10"
                                          />
                                        </span>
                                        {status ? (
                                          ''
                                        ) : (
                                          <span
                                            onClick={e =>
                                              this.deleteSpecification(
                                                e,
                                                index,
                                                item.mediaURL
                                              )
                                            }
                                            className="ico-delete cursor-pointer"
                                          >
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#deleteIco`}
                                              />
                                            </svg>
                                          </span>
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                ) : item.mediaType &&
                                  item.mediaType === 'application/pdf' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-space-between align-center m-b-0">
                                        <span
                                          onClick={event =>
                                            this.handleSpecificationFile(
                                              event,
                                              item && item.mediaURL
                                            )
                                          }
                                        >
                                          <img
                                            alt="image"
                                            src={pdfImage}
                                            className="mr-10"
                                          />
                                        </span>
                                        {status ? (
                                          ''
                                        ) : (
                                          <span
                                            onClick={e =>
                                              this.deleteSpecification(
                                                e,
                                                index,
                                                item.mediaURL
                                              )
                                            }
                                            className="ico-delete cursor-pointer"
                                          >
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#deleteIco`}
                                              />
                                            </svg>
                                          </span>
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                ) : (item.mediaType &&
                                    item.mediaType ===
                                      'application/vnd.ms-excel') ||
                                  item.mediaType ===
                                    'application/octet-stream' ||
                                  item.mediaType ===
                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-space-between align-center m-b-0">
                                        <span
                                          onClick={event =>
                                            this.handleSpecificationFile(
                                              event,
                                              item && item.mediaURL
                                            )
                                          }
                                        >
                                          <img
                                            alt="image"
                                            src={xlsImage}
                                            className="mr-10"
                                          />
                                        </span>
                                        {status ? (
                                          ''
                                        ) : (
                                          <span
                                            onClick={e =>
                                              this.deleteSpecification(
                                                e,
                                                index,
                                                item.mediaURL
                                              )
                                            }
                                            className="ico-delete cursor-pointer"
                                          >
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#deleteIco`}
                                              />
                                            </svg>
                                          </span>
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                ) : item.mediaType &&
                                  item.mediaType ===
                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-space-between align-center m-b-0">
                                        <span
                                          onClick={event =>
                                            this.handleSpecificationFile(
                                              event,
                                              item && item.mediaURL
                                            )
                                          }
                                        >
                                          <img
                                            alt="image"
                                            src={docImage}
                                            className="mr-10"
                                          />
                                        </span>
                                        {status ? (
                                          ''
                                        ) : (
                                          <span
                                            onClick={e =>
                                              this.deleteSpecification(
                                                e,
                                                index,
                                                item.mediaURL
                                              )
                                            }
                                            className="ico-delete cursor-pointer"
                                          >
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#deleteIco`}
                                              />
                                            </svg>
                                          </span>
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                ) : item.mediaType &&
                                  item.mediaType === 'text/plain' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-space-between align-center m-b-0">
                                        <span
                                          onClick={event =>
                                            this.handleSpecificationFile(
                                              event,
                                              item && item.mediaURL
                                            )
                                          }
                                        >
                                          <img
                                            alt="image"
                                            src={docImage}
                                            className="mr-10"
                                          />
                                        </span>

                                        {status ? (
                                          ''
                                        ) : (
                                          <span
                                            onClick={e =>
                                              this.deleteSpecification(
                                                e,
                                                index,
                                                item.mediaURL
                                              )
                                            }
                                            className="ico-delete cursor-pointer"
                                          >
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#deleteIco`}
                                              />
                                            </svg>
                                          </span>
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                ) : (
                                  // <img src={docImage} width="45" />
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
                                      accept=".doc, .docx, .pdf, .rtf, .txt, .tex, .wks, .wps, .xls, .xlxs, .wpd, .odt"
                                      disabled={
                                        item.documentType === '' ||
                                        item.documentType === undefined
                                      }
                                      onChange={e =>
                                        this.handleUploadReport(e, index)
                                      }
                                    />
                                  </div>
                                )}
                              </td>
                              <td className="w-76">
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                    name="buyerDocReviewStatus"
                                    value={
                                      item.buyerDocReviewStatus
                                        ? item.buyerDocReviewStatus
                                        : 'NO'
                                    }
                                    disabled={this.state.roleId === 2}
                                  >
                                    <option value="YES">YES </option>
                                    <option value="NO">NO</option>
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                {' '}
                                <div className="w-175">
                                  <button
                                    className={
                                      item.documentStatus === 'REJECTED'
                                        ? 'btn btn-task  fill-red'
                                        : 'btn btn-task'
                                    }
                                    disabled={this.state.roleId === 2}
                                  >
                                    <span className="ico-action ">
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#rejectIco`}
                                        />
                                      </svg>
                                    </span>
                                    <span className="ico-txt">Rejected</span>
                                  </button>
                                  <button
                                    disabled={this.state.roleId === 2}
                                    className={
                                      item.documentStatus === 'APPROVED'
                                        ? 'btn btn-task fill-green'
                                        : 'btn btn-task'
                                    }
                                  >
                                    <span className="ico-action ">
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#rightCircleIco`}
                                        />
                                      </svg>
                                    </span>
                                    <span className="ico-txt">Approve</span>
                                  </button>
                                  <button
                                    disabled={this.state.roleId === 2}
                                    className={
                                      item.documentStatus === 'SEND_BACK'
                                        ? 'btn btn-task  fill-red'
                                        : 'btn btn-task'
                                    }
                                  >
                                    <span className="ico-action ">
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
                              <td>
                                {item.deviationApproved === 'YES' ? (
                                  <span className="s-circle yes">Y</span>
                                ) : (
                                  <span className="s-circle no">N</span>
                                )}
                              </td>
                              <td>
                                <FormGroup controlId="formControlsTextarea">
                                  <FormControl
                                    componentClass="textarea"
                                    placeholder="Supplier Comments"
                                    type="text"
                                    name="supplierComments"
                                    disabled={
                                      item.documentType === '' ||
                                      item.documentType === undefined
                                    }
                                    value={
                                      item.supplierCommentsRes &&
                                      item.supplierCommentsRes
                                        ? item.supplierCommentsRes[0].comment
                                        : ''
                                    }
                                    onChange={event => {
                                      this.handleUpdateComment(index, event);
                                    }}
                                    onBlur={event => {
                                      this.handleDocumentUpdate(index, event);
                                    }}
                                  />
                                </FormGroup>
                              </td>
                              <td>
                                {' '}
                                <FormGroup controlId="formControlsTextarea">
                                  <FormControl
                                    componentClass="textarea"
                                    placeholder="Supplier Quality"
                                    disabled={this.state.roleId === 2}
                                    value={
                                      item.buyerComments && item.buyerComments
                                        ? item.buyerComments[0].comment
                                        : ''
                                    }
                                  />
                                </FormGroup>
                              </td>
                              <td>
                                {' '}
                                <FormGroup controlId="formControlsTextarea">
                                  <FormControl
                                    componentClass="textarea"
                                    placeholder="Designer Comments"
                                    disabled={this.state.roleId === 2}
                                    value={
                                      item.designerComments &&
                                      item.designerComments
                                        ? item.designerComments[0].comment
                                        : ''
                                    }
                                  />
                                </FormGroup>
                              </td>
                            </tr>
                          ];
                        })}
                    </tbody>
                  </Table>
                </div>
                <div className="m-b-20">
                  <Table bordered responsive hover className="custom-table">
                    <tbody>
                      {_this.state.otherDocumentTypeList &&
                        _this.state.otherDocumentTypeList.map((item, index) => {
                          let status =
                            item.documentStatus === 'APPROVED' ? 1 : 0;
                          return [
                            <tr>
                              <td style={{ width: '53px' }}>{index + 19}.</td>
                              <td className="w-175">
                                <FormGroup controlId="formBasicText">
                                  <FormControl
                                    className="br-0"
                                    type="text"
                                    name="documentType"
                                    value={item.documentType}
                                    onChange={e => {
                                      this.handleDocumentUpdateOther(index, e);
                                    }}
                                  />
                                </FormGroup>
                              </td>
                              <td style={{ width: '71px' }}>
                                {(item &&
                                  item.mediaType ===
                                    'application/octet-stream') ||
                                item.mediaType === 'application/vnd.ms-excel' ||
                                item.mediaType ===
                                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-space-between align-center m-b-0">
                                        <span>
                                          <img
                                            onClick={event =>
                                              this.handleSpecificationFile(
                                                event,
                                                item && item.mediaURL
                                              )
                                            }
                                            alt="image"
                                            src={xlsImage}
                                            className="mr-10"
                                          />
                                        </span>
                                        <span
                                          className="ico-delete cursor-pointer"
                                          disabled={
                                            item.documentStatus === 'NOT_VIEWED'
                                              ? false
                                              : true
                                          }
                                          onClick={e =>
                                            this.deleteSpecificationOther(
                                              e,
                                              index,
                                              item.mediaURL
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
                                    </ul>
                                  </div>
                                ) : item.mediaType &&
                                  item.mediaType === 'application/pdf' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-space-between align-center m-b-0">
                                        <span>
                                          <img
                                            onClick={event =>
                                              this.handleSpecificationFile(
                                                event,
                                                item && item.mediaURL
                                              )
                                            }
                                            alt="image"
                                            src={pdfImage}
                                            className="mr-10"
                                          />
                                        </span>
                                        {status ? (
                                          ''
                                        ) : (
                                          <span
                                            onClick={e =>
                                              this.deleteSpecificationOther(
                                                e,
                                                index,
                                                item.mediaURL
                                              )
                                            }
                                            className="ico-delete cursor-pointer"
                                          >
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#deleteIco`}
                                              />
                                            </svg>
                                          </span>
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                ) : item.mediaType &&
                                  item.mediaType ===
                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-space-between align-center m-b-0">
                                        <span>
                                          <img
                                            onClick={event =>
                                              this.handleSpecificationFile(
                                                event,
                                                item && item.mediaURL
                                              )
                                            }
                                            alt="image"
                                            src={docImage}
                                            className="mr-10"
                                          />
                                        </span>

                                        {status ? (
                                          ''
                                        ) : (
                                          <span
                                            onClick={e =>
                                              this.deleteSpecificationOther(
                                                e,
                                                index,
                                                item.mediaURL
                                              )
                                            }
                                            className="ico-delete cursor-pointer"
                                          >
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#deleteIco`}
                                              />
                                            </svg>
                                          </span>
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                ) : item.mediaType &&
                                  item.mediaType === 'application/msword' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-space-between align-center m-b-0">
                                        <span>
                                          <img
                                            onClick={event =>
                                              this.handleSpecificationFile(
                                                event,
                                                item && item.mediaURL
                                              )
                                            }
                                            alt="image"
                                            src={docImage}
                                            className="mr-10"
                                          />
                                        </span>

                                        {status ? (
                                          ''
                                        ) : (
                                          <span
                                            onClick={e =>
                                              this.deleteSpecificationOther(
                                                e,
                                                index,
                                                item.mediaURL
                                              )
                                            }
                                            className="ico-delete cursor-pointer"
                                          >
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#deleteIco`}
                                              />
                                            </svg>
                                          </span>
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                ) : item.mediaType &&
                                  item.mediaType === 'text/plain' ? (
                                  <div className="">
                                    <ul className="upload-list">
                                      <li className="flex justify-space-between align-center">
                                        <span>
                                          <img
                                            onClick={event =>
                                              this.handleSpecificationFile(
                                                event,
                                                item && item.mediaURL
                                              )
                                            }
                                            alt="image"
                                            src={docImage}
                                            className="mr-10"
                                          />
                                        </span>

                                        {status ? (
                                          ''
                                        ) : (
                                          <span
                                            onClick={e =>
                                              this.deleteSpecificationOther(
                                                e,
                                                index,
                                                item.mediaURL
                                              )
                                            }
                                            className="ico-delete cursor-pointer"
                                          >
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#deleteIco`}
                                              />
                                            </svg>
                                          </span>
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                ) : (
                                  // <img src={docImage} width="45" />
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
                                      disabled={
                                        item.documentType === '' ||
                                        item.documentType === undefined
                                      }
                                      onChange={e =>
                                        this.handleUploadReportOther(e, index)
                                      }
                                    />
                                  </div>
                                )}
                              </td>
                              <td className="w-76">
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                    name="buyerDocReviewStatus"
                                    value={
                                      item.buyerDocReviewStatus
                                        ? item.buyerDocReviewStatus
                                        : 'NO'
                                    }
                                    disabled={this.state.roleId === 2}
                                  >
                                    <option value="YES">YES </option>
                                    <option value="NO">NO</option>
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                {' '}
                                <div className="w-175">
                                  <button
                                    className={
                                      item.documentStatus === 'REJECTED'
                                        ? 'btn btn-task  fill-red'
                                        : 'btn btn-task'
                                    }
                                    disabled={this.state.roleId === 2}
                                  >
                                    <span className="ico-action ">
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#rejectIco`}
                                        />
                                      </svg>
                                    </span>
                                    <span className="ico-txt">Rejected</span>
                                  </button>
                                  <button
                                    disabled={this.state.roleId === 2}
                                    className={
                                      item.documentStatus === 'APPROVED'
                                        ? 'btn btn-task fill-green'
                                        : 'btn btn-task'
                                    }
                                  >
                                    <span className="ico-action ">
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#rightCircleIco`}
                                        />
                                      </svg>
                                    </span>
                                    <span className="ico-txt">Approve</span>
                                  </button>
                                  <button
                                    disabled={this.state.roleId === 2}
                                    className={
                                      item.documentStatus === 'SEND_BACK'
                                        ? 'btn btn-task  fill-red'
                                        : 'btn btn-task'
                                    }
                                  >
                                    <span className="ico-action ">
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
                              <td className="w-125">
                                {item.deviationApproved === 'YES' ? (
                                  <span className="s-circle yes">Y</span>
                                ) : (
                                  <span className="s-circle no">N</span>
                                )}
                              </td>
                              <td>
                                <FormGroup controlId="formControlsTextarea">
                                  <FormControl
                                    componentClass="textarea"
                                    placeholder="Supplier Comments"
                                    type="text"
                                    name="supplierComments"
                                    disabled={
                                      item.documentType === '' ||
                                      item.documentType === undefined
                                    }
                                    value={
                                      item.supplierCommentsRes &&
                                      item.supplierCommentsRes
                                        ? item.supplierCommentsRes[0].comment
                                        : ''
                                    }
                                    onChange={event => {
                                      this.handleUpdateCommentOther(
                                        index,
                                        event
                                      );
                                    }}
                                    onBlur={event => {
                                      this.handleDocumentUpdateOther(
                                        index,
                                        event
                                      );
                                    }}
                                  />
                                </FormGroup>
                              </td>
                              <td>
                                {' '}
                                <FormGroup controlId="formControlsTextarea">
                                  <FormControl
                                    componentClass="textarea"
                                    placeholder="Supplier Quality"
                                    disabled={this.state.roleId === 2}
                                    value={
                                      item.buyerComments && item.buyerComments
                                        ? item.buyerComments[0].comment
                                        : ''
                                    }
                                  />
                                </FormGroup>
                              </td>
                              <td>
                                {' '}
                                <FormGroup controlId="formControlsTextarea">
                                  <FormControl
                                    componentClass="textarea"
                                    placeholder="Designer Comments"
                                    disabled={this.state.roleId === 2}
                                    value={
                                      item.designerComments &&
                                      item.designerComments
                                        ? item.designerComments[0].comment
                                        : ''
                                    }
                                  />
                                </FormGroup>
                              </td>
                            </tr>
                          ];
                        })}
                    </tbody>
                  </Table>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleAddOtherDocument}
                  >
                    <span className="ico-add">
                      <svg>
                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                      </svg>
                    </span>
                    &nbsp; Add more
                  </span>
                </div>
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
                          Review part for Quotation
                        </a>
                      </li>
                      <li>
                        <a className="disabled">Quality certification</a>
                      </li>
                      <li>
                        <a className="disabled">Major Account Details</a>
                      </li>
                      <li>
                        <a className="disabled">Facility pictures</a>
                      </li>
                    </ul>

                    <ul className="p-tags">
                      <li>
                        <a className="disabled">
                          Vendor Registration with the Buyer
                        </a>
                      </li>
                      <li>
                        <a className="disabled">Buyer Criteria</a>
                      </li>

                      <li>
                        <a onClick={this.tabCheckThird}>Approve Quotation</a>
                      </li>
                      <li>
                        <a className="disabled">My Dashboard</a>
                      </li>
                    </ul>

                    <ul className="p-tags">
                      <li>
                        <Link to="addUser">Add Users</Link>
                      </li>
                      <li>
                        <Link to="updatePartStatus">Update Parts Status</Link>
                      </li>
                      <li>
                        <a className="disabled">Download Parts Summary</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
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
      actionSummaryPartStatus,
      actionTabData,
      handleUploadReport,
      actionSubmitPPAPDocuments,
      actionUpdatePPAPDocuments,
      actionGetPPAPDocuments,
      actionUpdatePPAPOtherDocuments,
      actionDeleteRevisionImage
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
)(PpapDocuments);
