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
  actionSubmitPPAPDocuments,
  actionUpdatePPAPDocuments,
  actionGetPPAPDocuments,
  actionUpdatePPAPOtherDocuments,
  actionDeleteRevisionImage
} from '../../common/core/redux/actions';
import Sprite from '../../img/sprite.svg';
import docImage from '../../img/doc.png';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';

import {
  topPosition,
  ZoomInAndOut,
  showErrorToast
} from '../../common/commonFunctions';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import { handlePermission } from '../../common/permissions';
let { customConstant } = CONSTANTS;
let { permissionConstant } = CONSTANTS;

class PpapDocuments extends Component {
  constructor(props) {
    super(props);
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
      documentObject: {
        documentNo: 1,
        buyerDocReviewStatus: '',
        deviationApproved: '',
        supplierCommentsRes: [{ comment: '' }],
        documentStatus: '',
        buyerCommentsRes: [{ comment: '' }],
        designerComments: [{ comment: '' }]
      },
      ppapScore: 0,
      ppapTitle: '',
      companyName: '',

      companyNameBuyer: '',
      ppapTitleBuyer: '',
      ppapTitleSupplier: '',
      companyNameSupplier: '',
      ppapLogoSupplier: '',
      ppapLogoBuyer: '',
      // ppapLogo: '',
      partSearch: '',
      documentTypeList: [
        {
          documentNo: 1,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerComments: [{ comment: '' }]
        },
        {
          documentNo: 2,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 3,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 4,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 5,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 6,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 7,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 8,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 9,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 10,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 11,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 12,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 13,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 14,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 15,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 16,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 17,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        },
        {
          documentNo: 18,
          buyerDocReviewStatus: '',
          deviationApproved: '',
          supplierCommentsRes: [{ comment: '' }],
          documentStatus: '',
          buyerCommentsRes: [{ comment: '' }],
          designerCommentsRes: [{ comment: '' }]
        }
      ],
      documentType: [
        'Design Documentation',
        'Engineering Change Documentation',
        'Customer Engineering Approval',
        'Design Failure Mode and Effects Analysis',
        'Process Flow Diagram',
        'Process Failure Mode and Effects Analysis',
        'Control Plan',
        'Measurement System Analysis Studies',
        'Dimensional Results',
        'Records of Material / Performance Tests',
        'Initial Process Studies',
        'Qualified Laboratory Documentation',
        'Appearance Approval Report',
        'Sample Production Parts',
        'Master Sample',
        'Checking Aids',
        'Customer Specific Requirements',
        'Part Submission Warrant'
      ],
      otherDocumentTypeList: [],
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
    this.handleAddMoreContact = this.handleAddMoreContact.bind(this);
    this.handleDocumentUpdate = this.handleDocumentUpdate.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleUpdateComment = this.handleUpdateComment.bind(this);
    this.handleDocumentUpdateOther = this.handleDocumentUpdateOther.bind(this);
    this.handleUploadReportOther = this.handleUploadReportOther.bind(this);
    this.handleUpdateDetailsOther = this.handleUpdateDetailsOther.bind(this);
    this.handleSpecificationFile = this.handleSpecificationFile.bind(this);
    this.handleSearchDetails = this.handleSearchDetails.bind(this);
    this.handlePartData = this.handlePartData.bind(this);
    this.handleSearchDetailsByKey = this.handleSearchDetailsByKey.bind(this);
    this.handleChange = this.handleChange.bind(this);
    topPosition();
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

        let ppapArr =
          ppapDetails.listOfPPAPDocumentRes &&
          ppapDetails.listOfPPAPDocumentRes.length > 0
            ? ppapDetails.listOfPPAPDocumentRes
            : this.state.documentTypeListBlank;

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

        let resultData = _this.state.documentTypeList.map(
          obj => ppapArr.find(o => o.documentNo === obj.documentNo) || obj
        );

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
            : ''
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
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
            ppapDetails.supplierResponse.addresses,
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
          // companyName = ppapDetails.supplierResponse.companyName;
          // addr = ppapDetails.supplierResponse.addresses[address].address
          //   ? ppapDetails.supplierResponse.addresses[address].address
          //   : '';
          // country = ppapDetails.supplierResponse.addresses[address].country
          //   ? ppapDetails.supplierResponse.addresses[address].country
          //   : '';
          // title = companyName + ' ' + addr + ', ' + country;
          console.log('hkfghkfghfkg 1');
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
          console.log('hkfghkfghfkg 6');
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
          console.log('hkfghkfghfkg 7');
          let resultData = _this.state.documentTypeList.map(
            obj => ppapArr.find(o => o.documentNo === obj.documentNo) || obj
          );
          console.log('hkfghkfghfkg 2');
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
          console.log('hkfghkfghfkg 3');
          //if (resultDataOther)
          _this.setState({ otherDocumentTypeList: resultDataOther });
          _this.setState({
            documentTypeList: resultData,
            DocumentId: ppapDetails.id,
            ppapScore: ppapDetails.ppapScore,
            companyNameBuyer: companyNameBuyer,
            ppapTitleBuyer: titleBuyer,
            ppapTitleSupplier: titleSupplier,
            companyNameSupplier: companyNameSupplier,
            // ppapTitle: title,
            // companyName: companyName,
            partNumber: ppapDetails.partResponse.partNumber,
            ppapLogoSupplier: ppapDetails.supplierResponse.companyLogoURL
              ? customConstant.amazonURL +
                ppapDetails.supplierResponse.companyLogoURL
              : '',
            ppapLogoBuyer: ppapDetails.buyerResponse.companyLogoURL
              ? customConstant.amazonURL +
                ppapDetails.buyerResponse.companyLogoURL
              : ''
          });
          console.log('hkfghkfghfkg 4');
        }
        console.log('hkfghkfghfkg 5');
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  };

  navigateToRFQ(data) {
    this.props.actionTabData(data);
  }

  activeTabKeyAction(tabKey) {
    // if (tabKey === "first")
    //   this.props.history.push({
    //     pathname: "home",
    //     state: { path: "first" }
    //   });
    // if (tabKey === "second") this.props.history.push("home");
    // if (tabKey === "third")
    //   this.props.history.push({
    //     pathname: "home",
    //     state: { path: "third" }
    //   });
    // this.setState({ tabKey: tabKey });
    if (tabKey === 'first') this.props.history.push('home');
    if (tabKey === 'third')
      this.props.history.push({
        pathname: 'home',
        state: { path: 'third' }
      });
    this.setState({ tabKey: tabKey });
  }

  handleDocumentUpdateClick(index, name, value) {
    console.log('updateArr---');
    let _this = this;
    var reqObject = {};
    reqObject[name] = value;
    reqObject['documentNo'] = index + 1;
    var reqArray = [];
    reqArray.push(reqObject);

    _this.props.actionLoaderShow();
    if (this.state.DocumentId) {
      let updateArr = {
        userId: _this.props.userInfo.userData.id,
        roleId: _this.props.userInfo.userData.userRole,
        partId: _this.state.partId,
        resourceId: _this.state.docType1,
        ppapId: this.state.DocumentId,
        ppapDocumentRequests: reqArray,
        otherPpapDocumentRequests: []
      };
      console.log('updateArr---', updateArr);
      _this.props
        .actionUpdatePPAPDocuments(updateArr)
        .then((result, error) => {
          console.log('result----', result);
          if (result.payload.data.status === 200) {
            if (result.payload.data.resourceData)
              _this.setState({ ppapScore: result.payload.data.resourceData });

            let documentTypeList = _this.state.documentTypeList;
            let documentTypeListJson = documentTypeList[index];
            documentTypeListJson.documentStatus = value;

            documentTypeList[index] = documentTypeListJson;
            _this.setState({ documentTypeList: documentTypeList });
          }
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
        ppapDocumentRequests: reqArray,
        otherPpapDocumentRequests: []
      };
      console.log('updateArr---', addArr);
      _this.props
        .actionSubmitPPAPDocuments(addArr)
        .then((result, error) => {
          console.log('result----', result);

          if (result.payload.data.status === 200) {
            if (result.payload.data.resourceData)
              _this.setState({ ppapScore: result.payload.data.resourceData });
            _this.setState({
              DocumentId: result.payload.data.resourceId
            });
            let documentTypeList = _this.state.documentTypeList;
            let documentTypeListJson = documentTypeList[index];
            documentTypeListJson.documentStatus = value;

            documentTypeList[index] = documentTypeListJson;
            _this.setState({ documentTypeList: documentTypeList });
          }

          // _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  }

  handleDocumentUpdate = (index, event) => {
    let _this = this;
    const value = event.target.value;
    const name = event.target.name;
    if (value !== '') {
      var reqObject = {};

      if (name === 'designerComments') reqObject[name] = [value];
      else if (name === 'buyerComments') reqObject[name] = [value];
      else reqObject[name] = value;

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
      if (name === 'buyerDocReviewStatus')
        documentTypeListJson.buyerDocReviewStatus = event.target.value;
      else if (name === 'documentStatus')
        documentTypeListJson.designerCommentsRes = event.target.value;
      else if (name === 'deviationApproved')
        documentTypeListJson.deviationApproved = event.target.value;
      else if (name === 'designerComments')
        documentTypeListJson.designerCommentsRes = event.target.value;
      else if (name === 'buyerComments')
        documentTypeListJson.buyerCommentsRes = event.target.value;

      documentTypeList[index] = documentTypeListJson;
      this.setState({ documentTypeList: documentTypeList });
    }
  };

  handleAddMoreContact() {
    let documentTypeList = this.state.documentTypeList;
    documentTypeList.push({ test: 'test' });
    this.setState({ documentTypeList: documentTypeList });
  }

  onBlur = (index, event) => {};

  handleUpdateComment = (index, event) => {
    let documentTypeList = this.state.documentTypeList;
    let documentTypeListJson = documentTypeList[index];
    documentTypeListJson.supplierCommentsRes = event.target.value;
    this.setState({ documentTypeList: documentTypeList });
  };
  handleUploadReportOther(event, index) {
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
        reportArray = result.payload.data;

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

        _this.props.actionLoaderHide();
      })
      .catch(e => {
        _this.props.actionLoaderHide();
      });
  }
  handleDocumentUpdateOther = (index, event) => {
    let _this = this;
    const value = event.target.value;
    const name = event.target.name;
    if (value !== '') {
      var reqObject = {};

      if (name === 'designerComments') reqObject[name] = [value];
      else if (name === 'buyerComments') reqObject[name] = [value];
      else reqObject[name] = value;

      reqObject['documentNo'] = index + 1;
      var reqArray = [];
      reqArray.push(reqObject);

      if (this.state.DocumentId) {
        console.log('if');
        let updateArr = {
          userId: _this.props.userInfo.userData.id,
          roleId: _this.props.userInfo.userData.userRole,
          partId: _this.state.partId,
          resourceId: _this.state.docType1,
          ppapId: this.state.DocumentId,
          otherPpapDocumentRequests: reqArray
        };
        _this.props
          .actionUpdatePPAPDocuments(updateArr)
          .then((result, error) => {
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      } else {
        console.log('else');
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
      if (name === 'buyerDocReviewStatus')
        documentTypeListJson.buyerDocReviewStatus = event.target.value;
      else if (name === 'documentStatus')
        documentTypeListJson.designerCommentsRes = event.target.value;
      else if (name === 'deviationApproved')
        documentTypeListJson.deviationApproved = event.target.value;
      else if (name === 'designerComments')
        documentTypeListJson.designerCommentsRes = event.target.value;
      else if (name === 'buyerComments')
        documentTypeListJson.buyerCommentsRes = event.target.value;

      documentTypeList[index] = documentTypeListJson;
      this.setState({ otherDocumentTypeList: documentTypeList });

      console.log('otherDocumentTypeList', this.state.otherDocumentTypeList);
    }
  };
  handleDocumentUpdateOther1111 = (index, event) => {
    let _this = this;

    let documentTypeListArr = this.state.otherDocumentTypeList;
    let documentTypeListJsonArr = documentTypeListArr[index];

    let chkDocumentType = documentTypeListJsonArr.documentType;
    let chkmediaType = documentTypeListJsonArr.mediaType;

    const value = event.target.value;
    const name = event.target.name;

    if (value !== '') {
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
        this.setState({ otherDocumentTypeList: documentTypeListArr });
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
          otherPpapDocumentRequests: reqArray
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
    }
  };
  handleUpdateDetailsOther(reqArray) {
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
  handleDocumentUpdateClickOther(index, name, value) {
    console.log('updateArr---');

    let _this = this;
    var reqObject = {};
    reqObject[name] = value;
    reqObject['documentNo'] = index + 1;
    var reqArray = [];
    reqArray.push(reqObject);

    _this.props.actionLoaderShow();
    if (this.state.DocumentId) {
      let updateArr = {
        userId: _this.props.userInfo.userData.id,
        roleId: _this.props.userInfo.userData.userRole,
        partId: _this.state.partId,
        resourceId: _this.state.docType1,
        ppapId: this.state.DocumentId,
        otherPpapDocumentRequests: reqArray,
        ppapDocumentRequests: []
      };
      console.log('updateArr---', updateArr);

      _this.props
        .actionUpdatePPAPDocuments(updateArr)
        .then((result, error) => {
          if (result.payload.data.status === 200) {
            if (result.payload.data.resourceData)
              _this.setState({ ppapScore: result.payload.data.resourceData });

            let documentTypeList = this.state.otherDocumentTypeList;
            let documentTypeListJson = documentTypeList[index];
            documentTypeListJson.documentStatus = value;

            documentTypeList[index] = documentTypeListJson;
            this.setState({ otherDocumentTypeList: documentTypeList });
          }

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
        otherPpapDocumentRequests: reqArray,
        ppapDocumentRequests: []
      };

      console.log('addArr---', addArr);

      _this.props
        .actionSubmitPPAPDocuments(addArr)
        .then((result, error) => {
          if (result.payload.data.status === 200) {
            if (result.payload.data.resourceData)
              _this.setState({ ppapScore: result.payload.data.resourceData });

            let documentTypeList = this.state.otherDocumentTypeList;
            let documentTypeListJson = documentTypeList[index];
            documentTypeListJson.documentStatus = value;

            documentTypeList[index] = documentTypeListJson;
            this.setState({ otherDocumentTypeList: documentTypeList });
          }

          _this.setState({
            DocumentId: result.payload.data.resourceId
          });
          // _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }
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
      this.props.history.push({
        pathname: '/buyer/ppap'
      });
    }
  }
  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }
  render() {
    console.log(
      'this.props.userInfo.userData----',
      this.props.userInfo.userData
    );
    let _this = this;
    return (
      <div>
        <Header />
        <ToastContainer
          autoClose={5000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
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
                <div className="">
                  <h4 className="hero-title">PPAP Status</h4>
                </div>
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
                <Table condensed className="no-border-table">
                  <tbody>
                    <tr>
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
                    </tr>
                  </tbody>
                </Table>
                <div>
                  <Row className="show-grid">
                    <Col md={12}>
                      <div className="filter-in b-bottom border-light m-b-20">
                        <div className="flex justify-space-between p-20">
                          <FormGroup>
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
                            <ControlLabel>Part Number :</ControlLabel>
                            {/* <FormControl type="text" /> */}
                            <span>{this.state.partNumber}</span>
                            <FormControl.Feedback />
                          </div>

                          <div className="show-p-info flex align-center">
                            <ControlLabel>Total PPAP Score :</ControlLabel>
                            {/* <FormControl type="text" /> */}
                            <span>{this.state.ppapScore}</span>
                            <FormControl.Feedback />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Table bordered responsive className="custom-table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th className="w-175">Document Type</th>
                        <th>Upload</th>
                        <th>Buyer Review status</th>
                        <th>Action</th>
                        <th className="w-125">Deviation Approved</th>
                        <th>Supplier Comments</th>
                        <th>Supplier Quality</th>
                        <th>Designer Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {_this.state.documentTypeList &&
                        _this.state.documentTypeList.map((item, index) => {
                          return [
                            <tr>
                              <td>{index + 1}.</td>
                              <td>
                                {' '}
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                    name="documentType"
                                    value={item.documentType}
                                    disabled={this.state.roleId === 1}
                                    onChange={e => {
                                      this.handleDocumentUpdate(index, e);
                                    }}
                                  >
                                    <option value="select">select</option>
                                    {_this.state.documentType &&
                                      _this.state.documentType.map(
                                        (item, index) => {
                                          return [
                                            <option value={item}>{item}</option>
                                          ];
                                        }
                                      )}
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                {(item.mediaType &&
                                  item.mediaType ===
                                    'application/vnd.ms-excel') ||
                                item.mediaType === 'application/octet-stream' ||
                                item.mediaType ===
                                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-center align-center m-b-0">
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
                                      </li>
                                    </ul>
                                  </div>
                                ) : item.mediaType &&
                                  item.mediaType === 'application/pdf' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-center align-center m-b-0">
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
                                      </li>
                                    </ul>
                                  </div>
                                ) : (item.mediaType &&
                                    item.mediaType ===
                                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                                  item.mediaType === 'application/msword' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-center align-center m-b-0">
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
                                      </li>
                                    </ul>
                                  </div>
                                ) : item.mediaType &&
                                  item.mediaType === 'text/plain' ? (
                                  <div className="">
                                    <ul className="upload-list m-b-0">
                                      <li className="flex justify-center align-center m-b-0">
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
                                      </li>
                                    </ul>
                                  </div>
                                ) : (
                                  ''
                                )}
                              </td>

                              <td className="w-76">
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                    name="buyerDocReviewStatus"
                                    disabled={
                                      item.mediaType === '' ||
                                      item.mediaType === undefined
                                    }
                                    value={
                                      item.buyerDocReviewStatus
                                        ? item.buyerDocReviewStatus
                                        : 'NO'
                                    }
                                    onChange={event => {
                                      this.handleDocumentUpdate(index, event);
                                    }}
                                  >
                                    <option value="YES">YES </option>
                                    <option value="NO">NO</option>
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td className="p-0">
                                <div className="w-175">
                                  <button
                                    className={
                                      item.documentStatus === 'REJECTED'
                                        ? 'btn btn-task  fill-red'
                                        : 'btn btn-task'
                                    }
                                    name="test"
                                    value="test"
                                    disabled={
                                      item.mediaType === '' ||
                                      item.mediaType === undefined
                                    }
                                    onClick={event => {
                                      this.handleDocumentUpdateClick(
                                        index,
                                        'documentStatus',
                                        'REJECTED'
                                      );
                                    }}
                                  >
                                    <span
                                      className={
                                        item.documentStatus === 'REJECTED'
                                          ? 'ico-action fill-orange'
                                          : 'ico-action'
                                      }
                                    >
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#rejectIco`}
                                        />
                                      </svg>
                                    </span>
                                    <span className="ico-txt">Rejected</span>
                                  </button>
                                  <button
                                    className={
                                      item.documentStatus === 'APPROVED'
                                        ? 'btn btn-task fill-green'
                                        : 'btn btn-task'
                                    }
                                    disabled={
                                      item.mediaType === '' ||
                                      item.mediaType === undefined ||
                                      item.documentStatus === 'REJECTED'
                                    }
                                    onClick={event => {
                                      this.handleDocumentUpdateClick(
                                        index,
                                        'documentStatus',
                                        'APPROVED'
                                      );
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
                                        <use
                                          xlinkHref={`${Sprite}#rightCircleIco`}
                                        />
                                      </svg>
                                    </span>
                                    <span className="ico-txt">Approve</span>
                                  </button>
                                  <button
                                    className={
                                      item.documentStatus === 'SEND_BACK'
                                        ? 'btn btn-task fill-red'
                                        : 'btn btn-task'
                                    }
                                    disabled={
                                      item.mediaType === '' ||
                                      item.mediaType === undefined ||
                                      item.documentStatus === 'REJECTED'
                                    }
                                    onClick={event => {
                                      this.handleDocumentUpdateClick(
                                        index,
                                        'documentStatus',
                                        'SEND_BACK'
                                      );
                                    }}
                                  >
                                    <span
                                      className={
                                        item.documentStatus === 'send_back'
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
                              <td>
                                <div className="flex align-center justify-center">
                                  <label className="label--checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox"
                                      value="YES"
                                      name="deviationApproved"
                                      disabled={
                                        item.mediaType === '' ||
                                        item.mediaType === undefined
                                      }
                                      checked={
                                        item.deviationApproved === 'YES'
                                          ? true
                                          : false
                                      }
                                      onChange={event => {
                                        this.handleDocumentUpdate(index, event);
                                      }}
                                    />
                                    Yes
                                  </label>
                                  <span style={{ marginLeft: '10px' }}>
                                    <label className="label--checkbox">
                                      <input
                                        type="checkbox"
                                        className="checkbox"
                                        disabled={
                                          item.mediaType === '' ||
                                          item.mediaType === undefined
                                        }
                                        value="NO"
                                        name="deviationApproved"
                                        checked={
                                          item.deviationApproved === 'NO'
                                            ? true
                                            : false
                                        }
                                        onChange={event => {
                                          this.handleDocumentUpdate(
                                            index,
                                            event
                                          );
                                        }}
                                      />
                                      No
                                    </label>
                                  </span>
                                </div>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsTextarea">
                                  <FormControl
                                    componentClass="textarea"
                                    placeholder="Supplier Comments"
                                    type="text"
                                    name="supplierComments"
                                    disabled={this.state.roleId === 1}
                                    value={
                                      item.supplierCommentsRes &&
                                      item.supplierCommentsRes
                                        ? item.supplierCommentsRes[0].comment
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
                                    placeholder="Supplier Quality"
                                    name="buyerComments"
                                    disabled={
                                      item.documentType === '' ||
                                      item.documentType === undefined
                                    }
                                    value={
                                      item.buyerCommentsRes &&
                                      item.buyerCommentsRes
                                        ? item.buyerCommentsRes[0].comment
                                        : ''
                                    }
                                    onChange={event => {
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
                                    placeholder="Designer Comments"
                                    name="designerComments"
                                    disabled={
                                      item.documentType === '' ||
                                      item.documentType === undefined
                                    }
                                    value={
                                      item.designerCommentsRes &&
                                      item.designerCommentsRes
                                        ? item.designerCommentsRes[0].comment
                                        : ''
                                    }
                                    onChange={event => {
                                      this.handleDocumentUpdate(index, event);
                                    }}
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
                                    disabled={this.state.roleId === 1}
                                    onChange={e => {
                                      this.handleDocumentUpdateOther(index, e);
                                    }}
                                  />
                                </FormGroup>
                              </td>
                              <td style={{ width: '71px' }}>
                                {item &&
                                item.mediaType ===
                                  'application/octet-stream' ? (
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
                                            src={docImage}
                                            className="mr-10"
                                          />
                                        </span>
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
                                      </li>
                                    </ul>
                                  </div>
                                ) : (item.mediaType &&
                                    item.mediaType === 'text/plain') ||
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
                                      </li>
                                    </ul>
                                  </div>
                                ) : (
                                  ''
                                  // <img src={docImage} width="45" />
                                  // <div className="upload-btn cursor-pointer sm-upload">
                                  //   <span
                                  //     className="ico-upload"
                                  //     style={{ marginRight: '0' }}
                                  //   >
                                  //     <svg>
                                  //       <use
                                  //         xlinkHref={`${Sprite}#uploadIco`}
                                  //       />
                                  //     </svg>
                                  //   </span>
                                  //   <FormControl
                                  //     id="formControlsFile"
                                  //     type="file"
                                  //     label="File"
                                  //     accept=".doc, .docx, .pdf, .rtf, .txt, .tex, .wks, .wps, .xls, .xlxs, .wpd, .odt"
                                  //     disabled={this.state.roleId === 1}
                                  //     onChange={e =>
                                  //       this.handleUploadReportOther(e, index)
                                  //     }
                                  //   />
                                  // </div>
                                )}
                              </td>
                              <td className="w-76">
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                    name="buyerDocReviewStatus"
                                    onChange={event => {
                                      this.handleDocumentUpdateOther(
                                        index,
                                        event
                                      );
                                    }}
                                    value={
                                      item.buyerDocReviewStatus
                                        ? item.buyerDocReviewStatus
                                        : 'NO'
                                    }
                                    disabled={
                                      item.mediaType === '' ||
                                      item.mediaType === undefined
                                    }
                                  >
                                    <option value="YES">YES </option>
                                    <option value="NO">NO</option>
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td className="p-0">
                                {' '}
                                <div className="w-175">
                                  <button
                                    disabled={
                                      item.mediaType === '' ||
                                      item.mediaType === undefined ||
                                      this.state.roleId === 2
                                    }
                                    className={
                                      item.documentStatus === 'REJECTED'
                                        ? 'btn btn-task  fill-red'
                                        : 'btn btn-task'
                                    }
                                    onClick={event => {
                                      this.handleDocumentUpdateClickOther(
                                        index,
                                        'documentStatus',
                                        'REJECTED'
                                      );
                                    }}
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
                                    disabled={
                                      item.mediaType === '' ||
                                      item.mediaType === undefined ||
                                      item.documentStatus === 'REJECTED' ||
                                      this.state.roleId === 2
                                    }
                                    className={
                                      item.documentStatus === 'APPROVED'
                                        ? 'btn btn-task fill-green'
                                        : 'btn btn-task'
                                    }
                                    onClick={event => {
                                      this.handleDocumentUpdateClickOther(
                                        index,
                                        'documentStatus',
                                        'APPROVED'
                                      );
                                    }}
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
                                    disabled={
                                      item.mediaType === '' ||
                                      item.mediaType === undefined ||
                                      item.documentStatus === 'REJECTED' ||
                                      this.state.roleId === 2
                                    }
                                    className={
                                      item.documentStatus === 'SEND_BACK'
                                        ? 'btn btn-task  fill-red'
                                        : 'btn btn-task'
                                    }
                                    onClick={event => {
                                      this.handleDocumentUpdateClickOther(
                                        index,
                                        'documentStatus',
                                        'SEND_BACK'
                                      );
                                    }}
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
                                <div className="flex align-center justify-center">
                                  <label className="label--checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox"
                                      value="YES"
                                      name="deviationApproved"
                                      disabled={
                                        item.mediaType === '' ||
                                        item.mediaType === undefined
                                      }
                                      checked={
                                        item.deviationApproved === 'YES'
                                          ? true
                                          : false
                                      }
                                      onChange={event => {
                                        this.handleDocumentUpdateOther(
                                          index,
                                          event
                                        );
                                      }}
                                    />
                                    Yes
                                  </label>
                                  <span style={{ marginLeft: '10px' }}>
                                    <label className="label--checkbox">
                                      <input
                                        type="checkbox"
                                        className="checkbox"
                                        disabled={
                                          item.mediaType === '' ||
                                          item.mediaType === undefined
                                        }
                                        value="NO"
                                        name="deviationApproved"
                                        checked={
                                          item.deviationApproved === 'NO'
                                            ? true
                                            : false
                                        }
                                        onChange={event => {
                                          this.handleDocumentUpdateOther(
                                            index,
                                            event
                                          );
                                        }}
                                      />
                                      No
                                    </label>
                                  </span>
                                </div>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsTextarea">
                                  <FormControl
                                    componentClass="textarea"
                                    placeholder="Supplier Comments"
                                    type="text"
                                    name="supplierComments"
                                    value={
                                      item.supplierCommentsRes &&
                                      item.supplierCommentsRes
                                        ? item.supplierCommentsRes[0].comment
                                        : ''
                                    }
                                    disabled={this.state.roleId === 1}
                                  />
                                </FormGroup>
                              </td>
                              <td>
                                {' '}
                                <FormGroup controlId="formControlsTextarea">
                                  <FormControl
                                    componentClass="textarea"
                                    placeholder="Supplier Quality"
                                    name="buyerComments"
                                    disabled={this.state.roleId === 2}
                                    value={
                                      item.buyerCommentsRes &&
                                      item.buyerCommentsRes
                                        ? item.buyerCommentsRes[0].comment
                                        : ''
                                    }
                                    onChange={event => {
                                      this.handleDocumentUpdateOther(
                                        index,
                                        event
                                      );
                                    }}
                                    // onBlur={event => {
                                    //   this.handleDocumentUpdateOther(
                                    //     index,
                                    //     event
                                    //   );
                                    // }}
                                    disabled={
                                      item.documentType === '' ||
                                      item.documentType === undefined
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
                                    name="designerComments"
                                    disabled={
                                      item.documentType === '' ||
                                      item.documentType === undefined
                                    }
                                    onChange={event => {
                                      this.handleDocumentUpdateOther(
                                        index,
                                        event
                                      );
                                    }}
                                    // onBlur={event => {
                                    //   this.handleDocumentUpdateOther(
                                    //     index,
                                    //     event
                                    //   );
                                    // }}
                                    value={
                                      item.designerCommentsRes &&
                                      item.designerCommentsRes
                                        ? item.designerCommentsRes[0].comment
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
                  {this.state.roleId === 2 ? (
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
                  ) : (
                    ''
                  )}

                  <div className="row clearfix">
                    <div className="col-md-12 column" />
                  </div>
                </div>
              </div>
            </div>
            <Footer pageTitle={permissionConstant.footer_title.buyer_ppap} />
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
      actionSubmitPPAPDocuments,
      actionUpdatePPAPDocuments,
      actionGetPPAPDocuments
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
