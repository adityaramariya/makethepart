import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import {
  Popover,
  Panel,
  Glyphicon,
  Table,
  FormControl,
  FormGroup,
  DropdownButton,
  Radio,
  ControlLabel
} from 'react-bootstrap';
import Sprite from '../../img/sprite.svg';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import SliderModal from '../slider/sliderModal';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetPurchaseCategoryData,
  actionGetProjectListForIndirectPurchase,
  actionCheckAccountNo,
  actionGetRevisionUsers,
  actionSaveBudgetOne,
  actionUploadBudgetDocumentse
} from '../../common/core/redux/actions';
import { showSuccessToast, showErrorToast } from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Slider from 'react-slick';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import { handlePermission } from '../../common/permissions';
import _ from 'lodash';
import customConstant from '../../common/core/constants/customConstant';
let { permissionConstant } = CONSTANTS;
class budget extends Component {
  constructor(props) {
    super(props);
    this.yearObject = {
      payAmount: '',
      commitAmount: '',
      fromYear: moment().format('YYYY'),
      toYear: moment()
        .add('years', 1)
        .format('YYYY'),
      listOfQuaterlyDetails: [],
      listOfMonthlyDetails: [],
      quaterFlag: false,
      monthFlag: false
    };
    this.quaterlyObject = [
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' }
    ];
    this.monthsObject = [
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' },
      { payAmount: '', commitAmount: '' }
    ];
    this.state = {
      tabKey: 'tenth',
      show: false,
      tableNo: 0,
      showHeading: [],
      listOfYears: [this.yearObject],
      listOfQuater: [this.quaterlyObject],
      noOfCategory: [
        {
          budgetItemNumber: '',
          account: '',
          address: '',
          currency: '',
          description: '',
          departmentId: '',
          mainCategoryId: '',
          spendCategoryId: '',
          subCategoryId: '',
          listOfYearDetails: [this.yearObject],
          addedApproversBy: '',
          programId: '',
          listOfApprovers: [],
          listOfMediaRequest: [
            {
              mediaName: '',
              mediaURL: '',
              mediaType: '',
              mediaSize: '',
              mediaExtension: ''
            }
          ]
        }
      ],
      categoryObject: {
        budgetItemNumber: '',
        account: '',
        address: '',
        currency: '',
        description: '',
        departmentId: '',
        mainCategoryId: '',
        spendCategoryId: '',
        subCategoryId: '',
        listOfYearDetails: [this.yearObject],
        addedApproversBy: '',
        programId: '',
        listOfApprovers: [],
        listOfMediaRequest: []
      }
    };
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.removeTable = this.removeTable.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.removeCategory = this.removeCategory.bind(this);
    this.headingChange = this.headingChange.bind(this);
    this.saveHeading = this.saveHeading.bind(this);
    this.dropdownChange = this.dropdownChange.bind(this);
    this.openQuarterlyShowHideCollapse = this.openQuarterlyShowHideCollapse.bind(
      this
    );
    this.openMonthlyShowHideCollapse = this.openMonthlyShowHideCollapse.bind(
      this
    );
    this.addToolYear = this.addToolYear.bind(this);
    this.addQuaterly = this.addQuaterly.bind(this);
    this.addMonthly = this.addMonthly.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleApprovers = this.handleApprovers.bind(this);

    this.handleSaveBudgetDraft = this.handleSaveBudgetDraft.bind(this);
    this.handleSaveBudget = this.handleSaveBudget.bind(this);
    this.handlePrintReview = this.handlePrintReview.bind(this);
    this.handleExportPdf = this.handleExportPdf.bind(this);
    this.handleChangeRequest = this.handleChangeRequest.bind(this);
    this.handleUploadDocumentse = this.handleUploadDocumentse.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleCompareValues = this.handleCompareValues.bind(this);
  }

  componentWillMount() {
    console.log('Componenet Will Mount....');
    console.log('moment()...', moment());
    console.log('moment().toString...', moment().toString());
    console.log('moment().format(YYYYMMDD)...', moment().format('MMYYYYDD'));
    console.log('moment().format()...', moment().format());
    console.log('moment().format(hh)...', moment().format('mmhhss'));
    let noOfCategory = this.state.noOfCategory;

    noOfCategory &&
      noOfCategory.forEach(function(elem, index) {
        elem[index] = [];
      });
    // for (let i = 0; i < noOfCategory.length; i++) {
    //   noOfCategory[i] = [{}];
    // }
    this.setState({ noOfCategory: noOfCategory });
  }

  componentDidMount() {
    let _this = this;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };
    this.props
      .actionGetPurchaseCategoryData(data)
      .then((result, error) => {
        console.log('result.....', result.payload.data.resourceData[0]);
        let purchaseResponse = result.payload.data.resourceData[0];
        this.setState({
          listOfDepartment: purchaseResponse.listOfDepartment,
          listOfFunctionalArea: purchaseResponse.listOfFunctionalArea,
          listOfMainCategory: purchaseResponse.listOfMainCategory,
          listOfSpendCategory: purchaseResponse.listOfSpendCategory,
          listOfSubCatgeory: purchaseResponse.listOfSubCatgeory,
          listOfAddress: purchaseResponse.listOfAddress,

          listOfForecast: purchaseResponse.listOfMainCategory,
          listOfRevision: purchaseResponse.listOfMainCategory,
          listOfFY: purchaseResponse.listOfMainCategory
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    this.props
      .actionGetProjectListForIndirectPurchase(data)
      .then((result, error) => {
        console.log('actionGetProjectList--', result);
        let projectList = result.payload.data.resourceData;
        this.setState({
          listOfProject: projectList
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
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

  removeTable() {
    let noOfTable = this.state.noOfTable;
    if (noOfTable.length !== 1) {
      noOfTable.pop();
    }
    this.setState({ noOfTable: noOfTable });
  }
  addCategory(event) {
    let listOfYear = [this.yearObject];
    console.log('if listOfYears', this.state.listOfYears);
    if (
      this.state.listOfYears &&
      this.state.listOfYears[0] &&
      this.state.listOfYears[0].length > 1
    ) {
      listOfYear = this.state.listOfYears[0];
      console.log(
        'if listOfYears',
        this.state.listOfYears && this.state.listOfYears[0]
      );
    }

    let noOfCategory = this.state.noOfCategory;
    let categoryObject = {
      description: '',
      sourceCountry: '',
      specificationNo: '',
      toolLifeQuantity: '',
      unitCost: '',
      quantity: '',
      totalCost: '',
      taxTotal: '',
      listOfYearDetails: listOfYear,
      total: '',
      projectId: '',
      listOfApprovers: [],
      listOfMediaRequest: []
    };
    noOfCategory.push(categoryObject);
    this.setState({ noOfCategory: noOfCategory });
  }
  removeCategory(event) {
    let noOfCategory = this.state.noOfCategory;
    if (noOfCategory.length !== 1) {
      noOfCategory.pop();
    }
    this.setState({ noOfCategory: noOfCategory });
  }

  headingChange(event, tableIndex) {
    const { name, value } = event.target;
    let noOfTable = this.state.noOfTable;
    noOfTable[tableIndex][name] = value;
    this.setState({ noOfTable: noOfTable });
  }

  saveHeading(index) {
    let showHeading = this.state.showHeading;
    showHeading[index] = true;
    this.setState({ showHeading: showHeading });
  }

  dropdownChange(event, catIndex, tableIndex) {
    const { name, value } = event.target;
    let noOfTable = this.state.noOfTable;
    noOfTable[tableIndex][catIndex][name] = value;
    this.setState({ noOfTable: noOfTable });
  }

  openQuarterlyShowHideCollapse(event) {
    alert('quarterly call');
  }

  openMonthlyShowHideCollapse(event) {
    alert('monthly call');
  }

  addToolYear(event) {
    let _this = this;
    let noOfCategory = this.state.noOfCategory;

    let yearRange =
      this.state.listOfYears &&
      this.state.listOfYears[0] &&
      this.state.listOfYears[0].length
        ? this.state.listOfYears[0].length
        : 1;
    console.log('--yearRange--', yearRange);
    console.log('--Before noOfCategory--', this.state.noOfCategory);
    console.log('--Before listOfYears--', this.state.listOfYears);

    let yearObject = {
      payAmount: '',
      commitAmount: '',
      fromYear: moment()
        .add('years', yearRange)
        .format('YYYY'),
      toYear: moment()
        .add('years', yearRange + 1)
        .format('YYYY'),
      quaterFlag: false,
      monthFlag: false
    };
    console.log('yearObject--', yearObject);
    let toolList = [];
    noOfCategory.map(function(item, index) {
      item.listOfYearDetails.push(yearObject);
      if (index === 0) toolList.push(item.listOfYearDetails);
    });

    this.setState({ listOfYears: toolList });
    this.setState({ noOfCategory: noOfCategory });

    console.log('--After noOfCategory--', this.state.noOfCategory);
    console.log('--After listOfYears--', this.state.listOfYears);
  }

  addQuaterly(event, quaterIndex, quaterFlag) {
    let _this = this;
    let noOfCategory = this.state.noOfCategory;
    let quaterlyObject = this.quaterlyObject;
    if (quaterFlag) {
      noOfCategory.map(function(item, index) {
        item.listOfYearDetails[quaterIndex].listOfMonthlyDetails = [];
        item.listOfYearDetails[quaterIndex].listOfQuaterlyDetails = [];
        item.listOfYearDetails[quaterIndex].quaterFlag = false;
      });
    } else {
      noOfCategory.map(function(item, index) {
        item.listOfYearDetails[quaterIndex].listOfMonthlyDetails = [];
        item.listOfYearDetails[quaterIndex].listOfQuaterlyDetails = [];
        item.listOfYearDetails[quaterIndex].listOfQuaterlyDetails.push(
          quaterlyObject
        );
        item.listOfYearDetails[quaterIndex].quaterFlag = true;
      });
    }
    this.setState({ noOfCategory: noOfCategory });
    console.log('--After noOfCategory--', this.state.noOfCategory);
  }

  addMonthly(event, monthIndex, monthFlag) {
    console.log('addMonthly', monthFlag);

    let _this = this;
    let noOfCategory = this.state.noOfCategory;

    let monthsObject = this.monthsObject;
    console.log('yearObject--', monthsObject);
    console.log('monthIndex--', monthIndex);

    if (monthFlag) {
      console.log('if');
      noOfCategory.map(function(item, index) {
        item.listOfYearDetails[monthIndex].listOfQuaterlyDetails = [];
        item.listOfYearDetails[monthIndex].listOfMonthlyDetails = [];
        item.listOfYearDetails[monthIndex].monthFlag = false;
      });
    } else {
      console.log('else');
      noOfCategory.map(function(item, index) {
        item.listOfYearDetails[monthIndex].listOfQuaterlyDetails = [];
        item.listOfYearDetails[monthIndex].listOfMonthlyDetails = [];
        item.listOfYearDetails[monthIndex].listOfMonthlyDetails.push(
          monthsObject
        );
        item.listOfYearDetails[monthIndex].monthFlag = true;
      });
    }
    this.setState({ noOfCategory: noOfCategory });
    console.log('--After noOfCategory--', this.state.noOfCategory);
  }

  handleChange(event, catIndex) {
    const { name, value, checked } = event.target;
    let noOfCategory = this.state.noOfCategory;
    let listOfAddress = this.state.listOfAddress;

    console.log('noOfCategory-', noOfCategory);
    console.log('name, value-', name, value);
    noOfCategory[catIndex][name] = value;

    if (name === 'address') {
      let addressObj = _.filter(listOfAddress, function(data) {
        return data.address === value;
      });

      noOfCategory[catIndex].area =
        addressObj && addressObj[0] && addressObj[0].locationId
          ? addressObj[0].locationId
          : '';

      noOfCategory[catIndex][name] = addressObj[0];
    } else if (name === 'rAndD') {
      if (checked) {
        noOfCategory[catIndex][name] = true;
      } else {
        noOfCategory[catIndex][name] = false;
      }
    }
    let categoryData = this.state.noOfCategory[catIndex];
    console.log('categoryData---', categoryData);
    if (!categoryData.budgetItemNumber) {
      console.log('categoryData.account---', categoryData.account);
      let createdAccountNo =
        'RJ' + moment().format('MMYYYYDD') + moment().format('sshhmm');
      if (
        categoryData.mainCategoryId &&
        categoryData.spendCategoryId &&
        categoryData.departmentId &&
        categoryData.subCategoryId
      ) {
        console.log('--account---', createdAccountNo);
        noOfCategory[catIndex].budgetItemNumber = createdAccountNo;
        noOfCategory[catIndex].showAccountText = true;
      }
    }
    this.setState({ noOfCategory: noOfCategory });
  }

  handleOnChange(
    event,
    catIndex,
    yearIndex,
    yearValue,
    type,
    quaterMonthIndex
  ) {
    console.log(
      'catIndex-',
      catIndex,
      'yearIndex-',
      yearIndex,
      'yearValue-',
      yearValue,
      'type-',
      type,
      'quaterMonthIndex-',
      quaterMonthIndex
    );

    const { name, value, checked } = event.target;
    let noOfCategory = this.state.noOfCategory;

    noOfCategory[catIndex].listOfYearDetails[yearIndex][name] = parseFloat(
      value
    )
      ? parseFloat(value)
      : '';

    console.log('noOfCategory-', noOfCategory);
    console.log('name, value-', name, value);
    //oOfCategory[catIndex][name] = value;

    this.setState({ noOfCategory: noOfCategory });
  }

  handleAccountBlur(event, catIndex) {
    const value = event.target.value || '';
    let _this = this;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      account: value
    };
    this.props
      .actionCheckAccountNo(data)
      .then((result, error) => {
        let accountCheck = result.payload.data.resourceId;
        let noOfTable = _this.state.noOfTable;
        if (accountCheck === 'true') {
          showErrorToast(
            "'" + value + "'" + ' ' + ' Account number already exists.'
          );
          this.state.noOfCategory[catIndex].budgetItemNumber = '';
        }

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleApprovers(e) {
    let _this = this;
    const name = e.target.name;
    const value = e.target.value;

    let noOfCategory = this.state.noOfCategory;
    //noOfCategory[name] = value;

    let data = { action: value };
    this.props
      .actionGetRevisionUsers(data)
      .then((result, error) => {
        console.log('actionGetProjectList--', result);
        let approvers = result.payload.data.resourceData;
        this.setState({
          listOfApprovers: approvers
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    this.setState({
      [name]: value
    });
  }

  handleChangeRequest(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  handleSaveBudget() {
    let _this = this;
    let listOfBudgetRequest = [];
    const covertToTimeStamp = momentObject => {
      return moment(momentObject).format('x');
    };

    let partOrderData1 = this.state.partOrderData;

    console.log('submit- this.state.noOfCategor', this.state.noOfCategory);

    this.state.noOfCategory.forEach(function(item, index) {
      // let partOrderData = partOrderData1[index];
      // if (
      //   partOrderData.uploadPicturesResponse &&
      //   partOrderData.uploadPicturesResponse.length
      // ) {
      //   for (let i = 0; i < partOrderData.uploadPicturesResponse.length; i++) {
      //     if (partOrderData.uploadPicturesResponse[i].mediaURL) {
      //       partOrderData.uploadPicturesResponse[
      //         i
      //       ].mediaURL = partOrderData.uploadPicturesResponse[i].mediaURL
      //         .split('/')
      //         .pop(-1);
      //       partOrderData.uploadPicturesResponse[
      //         i
      //       ].mediaThumbnailUrl = partOrderData.uploadPicturesResponse[
      //         i
      //       ].mediaThumbnailUrl
      //         .split('/')
      //         .pop(-1);
      //     }
      //   }
      // }
      console.log('item--', item);
      console.log('item.budgetItemNumber--', item.budgetItemNumber);
      listOfBudgetRequest.push({
        budgetItemNumber: item.budgetItemNumber,
        account: item.account,
        address: item.address,
        currency: item.currency,
        description: item.description,
        departmentId: item.departmentId,
        mainCategoryId: item.mainCategoryId,
        spendCategoryId: item.spendCategoryId,
        subCategoryId: item.subCategoryId,
        listOfMediaRequest: item.listOfMediaRequest,
        budgetInputType: [
          {
            fromYear: 0,
            toYear: 0,
            month: '',
            quater: 0,
            commitAmount: 0,
            payAmount: 0
          }
        ],
        addedApproversBy: this.props.userInfo.userData.id,
        programId: item.programId
      });
    });

    let data = {
      roleId: _this.props.userInfo.userData.userRole,
      userId: _this.props.userInfo.userData.id,
      revisionNo: this.state.revisionNo,
      forecastNo: this.state.forecastNo,
      forecastYear: this.state.forecastYear,
      budgetInputBy: this.state.budgetInputBy,
      budgetGroupBy: this.state.budgetGroupBy,
      budgetDetailRequests: listOfBudgetRequest,
      listOfApprovers: []
    };

    _this.props
      .actionSaveBudgetOne(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
        console.log('result--', result);
        if (result.payload.data.status === 200) {
          //showSuccessToast(result.payload.data.responseMessage)
        }
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleSaveBudgetDraft() {}
  handlePrintReview() {}
  handleExportPdf() {}

  handleUploadDocumentse(event, index) {
    let filesLength = event.target.files.length;
    let _this = this;
    let reqArray = [];
    let noOfCategory = this.state.noOfCategory;
    for (let j = 0; j < filesLength; j++) {
      let fileObject = event.target.files[j];
      if (fileObject) {
        const url = 'http://103.76.253.133:8572/api/v1/cloud/aws/upload';
        const formData = new FormData();
        formData.set('mFile', fileObject);
        formData.append('thumbnailHeight', 100);
        formData.append('thumbnailWidth', 100);
        formData.append('isCreateThumbnail', true);
        formData.append('fileKey', fileObject.name);
        formData.append('filePath', fileObject.name);
        this.props.actionLoaderShow();
        this.props
          .actionUploadBudgetDocumentse(formData)
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
          })
          .catch(e => {
            _this.props.actionLoaderHide();
          });
      }
    }
    noOfCategory[index].listOfMediaRequest = reqArray;
    this.setState({
      noOfCategory: noOfCategory
    });
  }
  imageShow = (partId, partMediaResponse, partNumber, partIndex) => {
    this.setState({
      show: true,
      partIdforMedia: partId,
      partNumberforMedia: partNumber,
      partMediaResponses: partMediaResponse
    });
  };
  handleCloseModal() {
    this.setState({ show: !this.state.show });
  }
  handleSort(e, name) {
    let noOfCategory = this.state.noOfCategory;
    noOfCategory.sort(this.handleCompareValues(name));
    this.setState({
      noOfCategory: noOfCategory
    });
  }

  // function for dynamic sorting
  handleCompareValues(key, order = 'asc') {
    return function(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
      const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order == 'desc' ? comparison * -1 : comparison;
    };
  }

  render() {
    console.log('this.state.noOfCategory---', this.state.noOfCategory);
    console.log('this.state.listOfYears---', this.state.listOfYears);
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === 'tenth' ? 'tenth' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === 'tenth' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <h4 class="hero-title">Create Budget</h4>

                <div className="bugetHeadWrap">
                  <div className="budgetHeadleft flex align-center">
                    <div className="commitWrap">
                      <label className="label--radio">
                        <input
                          type="radio"
                          className="radio"
                          name="m-radio"
                          value="aa"
                        />{' '}
                        <span>Commit</span>
                      </label>

                      <label className="label--radio">
                        <input
                          type="radio"
                          className="radio"
                          name="m-radio"
                          value="saa"
                        />{' '}
                        <span className="label--radio">Pay</span>
                      </label>
                      <label className="label--radio">
                        <input
                          type="radio"
                          className="radio"
                          name="m-radio"
                          value="saa"
                        />{' '}
                        <span className="label--radio">Commit & Pay</span>
                      </label>
                    </div>
                  </div>

                  <div className="budgetHeadrgt">
                    <FormGroup controlId="formControlsSelect">
                      <FormControl
                        componentClass="select"
                        placeholder="Revision X"
                        className="s-arrow br-0"
                        name="revisionNo"
                        onChange={event => {
                          this.handleChangeRequest(event);
                        }}
                      >
                        <option value="select">Revision X</option>
                        {this.state.listOfRevision &&
                          this.state.listOfRevision.map((item, index) => {
                            return (
                              <option value={item.id} key={index}>
                                {item.mainCatgeory}
                              </option>
                            );
                          })}
                      </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect">
                      <FormControl
                        componentClass="select"
                        placeholder="Forecast Y"
                        className="s-arrow br-0"
                        name="forecastNo"
                        onChange={event => {
                          this.handleChangeRequest(event);
                        }}
                      >
                        <option value="select">Forecast Y</option>
                        {this.state.listOfForecast &&
                          this.state.listOfForecast.map((item, index) => {
                            return (
                              <option value={item.id} key={index}>
                                {item.mainCatgeory}
                              </option>
                            );
                          })}
                      </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect">
                      <FormControl
                        componentClass="select"
                        placeholder="FY2018-19"
                        className="s-arrow br-0"
                        name="forecastYear"
                        onChange={event => {
                          this.handleChangeRequest(event);
                        }}
                      >
                        <option value="select">FY2018-19</option>
                        {this.state.listOfFY &&
                          this.state.listOfFY.map((item, index) => {
                            return (
                              <option value={item.id} key={index}>
                                {item.mainCatgeory}
                              </option>
                            );
                          })}
                      </FormControl>
                    </FormGroup>
                  </div>

                  <div className="budhead">
                    <h4 className="hero-title">Clone Budget from</h4>
                    <FormGroup controlId="formControlsSelect1">
                      <FormControl
                        componentClass="select"
                        placeholder="select"
                        className="s-arrow br-0"
                        // value={this.state.selectedProjectId}
                        name="department"
                      >
                        <option value="select">
                          {' '}
                          Revision 2 Forecast FY2018-19
                        </option>
                        <option>Sales</option>
                      </FormControl>
                    </FormGroup>
                  </div>
                </div>
                <div>
                  <div className="headrd flex justify-space-between align-center">
                    <div className="text-center m-b-20">
                      <button
                        to="home"
                        className="btn btn-primary text-uppercase"
                        onClick={event => {
                          this.addCategory(event);
                        }}
                      >
                        Add Row
                      </button>
                      <button
                        to="home"
                        className="btn btn-primary text-uppercase"
                        onClick={event => {
                          this.removeCategory(event);
                        }}
                      >
                        Delete Row
                      </button>
                      <button
                        to="home"
                        className="btn btn-primary text-uppercase"
                        onClick={event => {
                          this.addToolYear(event);
                        }}
                      >
                        Add Year
                      </button>
                    </div>

                    <div>
                      <div class="radioWrap">
                        <span>Input By</span>
                        <label className="label--radio">
                          <input
                            type="radio"
                            className="radio"
                            name="budgetInputBy"
                            value="1"
                            onChange={event => {
                              this.handleChangeRequest(event);
                            }}
                          />{' '}
                          Year
                        </label>
                        <label className="label--radio">
                          <input
                            type="radio"
                            className="radio"
                            name="budgetInputBy"
                            value="4"
                            onChange={event => {
                              this.handleChangeRequest(event);
                            }}
                          />{' '}
                          Quater
                        </label>

                        <label className="label--radio">
                          <input
                            type="radio"
                            className="radio"
                            name="budgetInputBy"
                            value="12"
                            onChange={event => {
                              this.handleChangeRequest(event);
                            }}
                          />{' '}
                          Month
                        </label>
                      </div>

                      {/* <div class="groupRadio">
                        <span>Group By</span>
                        <label className="label--radio">
                          <input
                            type="radio"
                            className="radio"
                            name="m-radio"
                            value="aa"
                          />{' '}
                          Year
                        </label>
                        <label className="label--radio">
                          <input
                            type="radio"
                            className="radio"
                            name="m-radio"
                            value="aa"
                          />{' '}
                          Quater
                        </label>
                      </div> */}
                    </div>
                  </div>
                  <div className="table-responsive">
                    <Table
                      bordered
                      condensed
                      className="custom-table budgetTbWrapper inputform90"
                    >
                      <thead>
                        <tr>
                          <th> </th>
                          <th>
                            Budget Item{' '}
                            <span
                              onClick={event => {
                                this.handleSort(event, 'budgetItemNumber');
                              }}
                            >
                              <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                            </span>
                          </th>
                          <th>
                            Program{' '}
                            <span
                              onClick={event => {
                                this.handleSort(event, 'programId');
                              }}
                            >
                              <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                            </span>
                          </th>
                          <th>
                            Account{' '}
                            <span
                              onClick={event => {
                                this.handleSort(event, 'account');
                              }}
                            >
                              <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                            </span>
                          </th>
                          <th>
                            Region{' '}
                            <span
                              onClick={event => {
                                this.handleSort(event, 'regions');
                              }}
                            >
                              <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                            </span>
                          </th>
                          <th>
                            Department{' '}
                            <span
                              onClick={event => {
                                this.handleSort(event, 'departmentId');
                              }}
                            >
                              <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                            </span>
                          </th>
                          <th>
                            Main Category{' '}
                            <span
                              onClick={event => {
                                this.handleSort(event, 'mainCategoryId');
                              }}
                            >
                              <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                            </span>
                          </th>
                          <th>
                            Spend Category{' '}
                            <span
                              onClick={event => {
                                this.handleSort(event, 'spendCategoryId');
                              }}
                            >
                              <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                            </span>
                          </th>
                          <th>
                            Sub Category{' '}
                            <span
                              onClick={event => {
                                this.handleSort(event, 'subCategoryId');
                              }}
                            >
                              <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                            </span>
                          </th>
                          <th>
                            Location/Plant{' '}
                            <span
                              onClick={event => {
                                this.handleSort(event, 'address');
                              }}
                            >
                              <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                            </span>
                          </th>
                          <th>
                            Area{' '}
                            <span
                              onClick={event => {
                                this.handleSort(event, 'area');
                              }}
                            >
                              <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                            </span>
                          </th>
                          <th>
                            Currency{' '}
                            <span
                              onClick={event => {
                                this.handleSort(event, 'currency');
                              }}
                            >
                              <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                            </span>
                          </th>
                          <th>Description</th>
                          {this.state.noOfCategory &&
                            this.state.noOfCategory[0] &&
                            this.state.noOfCategory[0].listOfYearDetails &&
                            this.state.noOfCategory[0].listOfYearDetails.map(
                              (item, index) => {
                                return [
                                  <th>
                                    Year {item.fromYear}-{item.toYear}{' '}
                                    {index + 1}
                                    <span>
                                      <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                                    </span>{' '}
                                    <p className="m-b-0">
                                      <span
                                        className={
                                          item.listOfQuaterlyDetails &&
                                          item.listOfQuaterlyDetails[0] &&
                                          item.listOfQuaterlyDetails[0].length >
                                            0
                                            ? 'ico-minusgly minIcon'
                                            : 'ico-add plusIcon'
                                        }
                                        onClick={event => {
                                          this.addQuaterly(
                                            event,
                                            index,
                                            item.quaterFlag
                                          );
                                        }}
                                      >
                                        {item.listOfQuaterlyDetails &&
                                        item.listOfQuaterlyDetails[0] &&
                                        item.listOfQuaterlyDetails[0].length >
                                          0 ? (
                                          ''
                                        ) : (
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#plus-OIco`}
                                            />
                                          </svg>
                                        )}
                                      </span>
                                      Quaterly{' '}
                                    </p>
                                    <p className="m-b-0">
                                      <span
                                        className={
                                          item.listOfMonthlyDetails &&
                                          item.listOfMonthlyDetails[0] &&
                                          item.listOfMonthlyDetails[0].length >
                                            0
                                            ? 'ico-minusgly minIcon'
                                            : 'ico-add plusIcon'
                                        }
                                        onClick={event => {
                                          this.addMonthly(
                                            event,
                                            index,
                                            item.monthFlag
                                          );
                                        }}
                                      >
                                        {item.listOfMonthlyDetails &&
                                        item.listOfMonthlyDetails[0] &&
                                        item.listOfMonthlyDetails[0].length >
                                          0 ? (
                                          ''
                                        ) : (
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#plus-OIco`}
                                            />
                                          </svg>
                                        )}
                                      </span>{' '}
                                      Month
                                    </p>
                                  </th>,
                                  item.listOfQuaterlyDetails &&
                                    item.listOfQuaterlyDetails[0] &&
                                    item.listOfQuaterlyDetails[0].length > 0 &&
                                    item.listOfQuaterlyDetails[0].map(function(
                                      item22,
                                      indexQuater
                                    ) {
                                      return (
                                        <th>
                                          {indexQuater === 0
                                            ? 'MON 1-MON 3'
                                            : indexQuater === 1
                                            ? 'MON 4-MON 6'
                                            : indexQuater === 2
                                            ? 'MON 7-MON 9'
                                            : 'MON 10-MON 12'}
                                        </th>
                                      );
                                    }),
                                  item.listOfMonthlyDetails &&
                                    item.listOfMonthlyDetails[0] &&
                                    item.listOfMonthlyDetails[0].length > 0 &&
                                    item.listOfMonthlyDetails[0].map(function(
                                      item22,
                                      indexMonth
                                    ) {
                                      return <th>Mon {indexMonth + 1}</th>;
                                    })
                                ];
                              }
                            )}
                          <th>
                            Input by <p>Intial Approval by </p>
                          </th>
                          <th />
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.noOfCategory &&
                          this.state.noOfCategory.map((elem, catIndex) => {
                            return (
                              <tr>
                                <td>
                                  <label className="label--checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox"
                                    />
                                  </label>
                                </td>
                                <td>
                                  <div>
                                    <FormControl
                                      className="w-150 br-0"
                                      type="text"
                                      name="budgetItemNumber"
                                      placeholder="Budget Item Number"
                                      value={elem.budgetItemNumber}
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                      onBlur={event => {
                                        this.handleAccountBlur(event, catIndex);
                                      }}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      className="s-arrow br-0"
                                      componentClass="select"
                                      placeholder="select"
                                      value={elem.programId}
                                      name="programId"
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                    >
                                      <option value="">Select</option>
                                      {this.state.listOfProject &&
                                        this.state.listOfProject.map(
                                          (item, index) => {
                                            return (
                                              <option
                                                value={item.id}
                                                key={item.id}
                                              >
                                                {item.projectCode} &nbsp; |
                                                &nbsp; {item.projectTitle}{' '}
                                                &nbsp; | &nbsp;{' '}
                                                {item.totalPartsPlanned}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="account"
                                      value={elem.account}
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                    >
                                      <option value="select">select</option>
                                      <option value="account1">
                                        Account 1
                                      </option>
                                      <option value="account22">
                                        Account 2
                                      </option>
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0 flex">
                                    <FormControl
                                      type="text"
                                      className="br-0"
                                      name="regions"
                                      value={elem.regions}
                                      placeholder="Regions"
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>

                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="departmentId"
                                      value={elem.departmentId}
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                    >
                                      <option value="">select</option>
                                      {this.state.listOfDepartment &&
                                        this.state.listOfDepartment.map(
                                          (item, index) => {
                                            return (
                                              <option
                                                value={item.id}
                                                key={index}
                                              >
                                                {item.department}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="mainCategoryId"
                                      value={elem.mainCategoryId}
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                    >
                                      <option value="">select</option>
                                      {this.state.listOfMainCategory &&
                                        this.state.listOfMainCategory.map(
                                          (item, index) => {
                                            return (
                                              <option
                                                value={item.id}
                                                key={index}
                                              >
                                                {item.mainCatgeory}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="spendCategoryId"
                                      value={elem.spendCategoryId}
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                    >
                                      <option value="">select</option>
                                      {this.state.listOfSpendCategory &&
                                        this.state.listOfSpendCategory.map(
                                          (item, index) => {
                                            return (
                                              <option
                                                value={item.id}
                                                key={index}
                                              >
                                                {item.spendCategory}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="subCategoryId"
                                      value={elem.subCategoryId}
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                    >
                                      <option value="">select</option>
                                      {this.state.listOfSubCatgeory &&
                                        this.state.listOfSubCatgeory.map(
                                          (item, index) => {
                                            return (
                                              <option
                                                value={item.id}
                                                key={index}
                                              >
                                                {item.subCategory}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="address"
                                      value={elem.address}
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                    >
                                      <option value="">select</option>
                                      {this.state.listOfAddress &&
                                        this.state.listOfAddress.map(
                                          (item, index) => {
                                            return (
                                              <option
                                                value={item.id}
                                                key={index}
                                              >
                                                {item.address}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      type="text"
                                      className="br-0"
                                      name="area"
                                      placeholder="Area"
                                      value={elem.area}
                                      disabled
                                    />
                                  </FormGroup>
                                </td>

                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="currency"
                                      value={elem.currency}
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                    >
                                      <option value="select">select</option>
                                      <option value="EUR">EUR</option>{' '}
                                      <option value="USD">USD</option>
                                      <option value="INR">INR</option>
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0 flex">
                                    <FormControl
                                      type="text"
                                      name="description"
                                      value={elem.description}
                                      placeholder="Description"
                                      className="br-0"
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>

                                {elem.listOfYearDetails &&
                                  elem.listOfYearDetails.map(
                                    (itemYear, yearIndex) => {
                                      return [
                                        <td>
                                          <FormGroup className="m-b-3 flex">
                                            {yearIndex === 0 ? (
                                              <ControlLabel className="labelwd">
                                                Pay
                                              </ControlLabel>
                                            ) : (
                                              ''
                                            )}
                                            <FormControl
                                              type="text"
                                              className="br-0 inputh28"
                                              name="payAmount"
                                              placeholder="Pay Amount"
                                              value={itemYear.payAmount}
                                              onChange={event => {
                                                this.handleOnChange(
                                                  event,
                                                  catIndex,
                                                  yearIndex,
                                                  itemYear,
                                                  'year'
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                          <FormGroup className="m-b-0 flex">
                                            {yearIndex === 0 ? (
                                              <ControlLabel className="labelwd">
                                                Commit
                                              </ControlLabel>
                                            ) : (
                                              ''
                                            )}
                                            <FormControl
                                              type="text"
                                              className="br-0 inputh28"
                                              name="commitAmount"
                                              placeholder="Commit Amount"
                                              value={itemYear.commitAmount}
                                              onChange={event => {
                                                this.handleOnChange(
                                                  event,
                                                  catIndex,
                                                  yearIndex,
                                                  itemYear,
                                                  'year'
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>,
                                        itemYear.listOfQuaterlyDetails &&
                                          itemYear.listOfQuaterlyDetails[0] &&
                                          itemYear.listOfQuaterlyDetails[0]
                                            .length > 0 &&
                                          itemYear.listOfQuaterlyDetails[0].map(
                                            function(itemQuater, indexQuater) {
                                              return (
                                                <td>
                                                  <FormGroup className="m-b-3 flex">
                                                    <FormControl
                                                      type="text"
                                                      className="br-0 inputh28"
                                                      name="payAmount"
                                                      value={itemYear.payAmount}
                                                      placeholder="Pay Amount"
                                                      onChange={event => {
                                                        this.handleOnChange(
                                                          event,
                                                          catIndex,
                                                          yearIndex,
                                                          itemYear,
                                                          'quater',
                                                          indexQuater
                                                        );
                                                      }}
                                                    />
                                                    <FormControl.Feedback />
                                                  </FormGroup>
                                                  <FormGroup className="m-b-0 flex">
                                                    <FormControl
                                                      type="text"
                                                      className="br-0 inputh28"
                                                      name="commitAmount"
                                                      placeholder="Commit Amount"
                                                      value={
                                                        itemYear.commitAmount
                                                      }
                                                      onChange={event => {
                                                        this.handleOnChange(
                                                          event,
                                                          catIndex,
                                                          yearIndex,
                                                          itemYear,
                                                          'quater',
                                                          indexQuater
                                                        );
                                                      }}
                                                    />
                                                    <FormControl.Feedback />
                                                  </FormGroup>
                                                </td>
                                              );
                                            }
                                          ),

                                        itemYear.listOfMonthlyDetails &&
                                          itemYear.listOfMonthlyDetails[0] &&
                                          itemYear.listOfMonthlyDetails[0]
                                            .length > 0 &&
                                          itemYear.listOfMonthlyDetails[0].map(
                                            function(itemMonth, indexMonth) {
                                              return (
                                                <td>
                                                  <FormGroup className="m-b-3 flex">
                                                    <FormControl
                                                      type="text"
                                                      className="br-0 inputh28"
                                                      name="payAmount"
                                                      value={
                                                        itemMonth.payAmount
                                                      }
                                                      placeholder="Pay Amount"
                                                      onChange={event => {
                                                        this.handleOnChange(
                                                          event,
                                                          catIndex,
                                                          yearIndex,
                                                          itemYear,
                                                          'month',
                                                          indexMonth
                                                        );
                                                      }}
                                                    />
                                                    <FormControl.Feedback />
                                                  </FormGroup>
                                                  <FormGroup className="m-b-0 flex">
                                                    <FormControl
                                                      type="text"
                                                      className="br-0 inputh28"
                                                      name="commitAmount"
                                                      value={
                                                        itemMonth.commitAmount
                                                      }
                                                      placeholder="Commit Amount"
                                                      onChange={event => {
                                                        this.handleOnChange(
                                                          event,
                                                          catIndex,
                                                          yearIndex,
                                                          itemYear,
                                                          'month',
                                                          indexMonth
                                                        );
                                                      }}
                                                    />
                                                    <FormControl.Feedback />
                                                  </FormGroup>
                                                </td>
                                              );
                                            }
                                          )
                                      ];
                                    }
                                  )}
                                <td className="inputapprove">
                                  <FormGroup className="m-b-0 flex">
                                    <FormControl
                                      type="text"
                                      className="br-0"
                                      name="addedApproversBy"
                                      value={
                                        this.props.userInfo.userData.fullname
                                      }
                                      disabled="true"
                                      placeholder="Name"
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>

                                <td>
                                  {console.log(
                                    'elem.listOfMediaRequest',
                                    elem.listOfMediaRequest
                                  )}
                                  <div className="upload-btn cursor-pointer sm-upload">
                                    {(elem.listOfMediaRequest &&
                                      elem.listOfMediaRequest[0] &&
                                      elem.listOfMediaRequest[0].mediaType ===
                                        'application/octet-stream') ||
                                    (elem.listOfMediaRequest &&
                                      elem.listOfMediaRequest[0] &&
                                      elem.listOfMediaRequest[0].mediaType ===
                                        'application/vnd.ms-excel') ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.listOfMediaRequest,
                                          catIndex
                                        )}
                                        src={xlsImage}
                                        width="45"
                                      />
                                    ) : elem.listOfMediaRequest &&
                                      elem.listOfMediaRequest[0] &&
                                      elem.listOfMediaRequest[0].mediaType ===
                                        'application/pdf' ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.listOfMediaRequest,
                                          catIndex
                                        )}
                                        src={pdfImage}
                                        width="45"
                                      />
                                    ) : elem.listOfMediaRequest &&
                                      elem.listOfMediaRequest.mediaType ===
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.listOfMediaRequest,
                                          catIndex
                                        )}
                                        src={docImage}
                                        width="45"
                                      />
                                    ) : elem.listOfMediaRequest &&
                                      elem.listOfMediaRequest[0] &&
                                      elem.listOfMediaRequest[0].mediaType ===
                                        'text/plain' ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.listOfMediaRequest,
                                          catIndex
                                        )}
                                        src={docImage}
                                        width="45"
                                      />
                                    ) : elem.listOfMediaRequest &&
                                      elem.listOfMediaRequest[0] &&
                                      elem.listOfMediaRequest[0].mediaType ===
                                        'application/msword' ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.listOfMediaRequest,
                                          catIndex
                                        )}
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
                                          multiple
                                          accept=".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
                                          onChange={e =>
                                            this.handleUploadDocumentse(
                                              e,
                                              catIndex
                                            )
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                </td>

                                {/* <td>
                                  {' '}
                                  <span className="ico-action-sm">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#chat1Ico`} />
                                    </svg>
                                  </span>
                                </td> */}
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                  {/* <div className=" m-b-20">
                          <div className=" mb-30 mt-15">
                            <span
                              className="cursor-pointer "
                              onClick={event => {
                                this.addCategory(event, tableIndex);
                              }}
                            >
                              <span className="ico-add">
                                <svg>
                                  <use xlinkHref={`${Sprite}#plus-OIco`} />
                                </svg>
                              </span>
                              &nbsp;Add Category
                            </span>{" "}
                            &nbsp; &nbsp; &nbsp; &nbsp;
                            <span
                              className="cursor-pointer"
                              onClick={event => {
                                this.removeCategory(event, tableIndex);
                              }}
                            >
                              <span className="ico-minusgly"> </span>
                              &nbsp;Remove Category
                            </span>
                          </div>
                        </div> */}
                </div>

                <p className="once-title ">
                  <div class="groupRadio">
                    <span>Agreed:</span>
                    <label className="label--radio">
                      <input
                        type="radio"
                        className="radio"
                        name="approver"
                        value="budgetRevision"
                        onChange={event => {
                          this.handleApprovers(event);
                        }}
                      />{' '}
                      Copy users from previous budget revision
                    </label>
                    <label className="label--radio">
                      <input
                        type="radio"
                        className="radio"
                        name="approver"
                        value="standardList"
                        onChange={event => {
                          this.handleApprovers(event);
                        }}
                      />{' '}
                      Copy users from standard list
                    </label>
                    <label className="label--radio">
                      <input
                        type="radio"
                        className="radio"
                        name="approver"
                        value="addManually"
                        onChange={event => {
                          this.handleApprovers(event);
                        }}
                      />{' '}
                      Add Manually
                    </label>
                  </div>
                </p>

                <div className="text-center m-b-20 m-t-20">
                  <button
                    onClick={this.handleSaveBudgetDraft}
                    className="btn btn-default text-uppercase"
                  >
                    Save draft
                  </button>
                  <button
                    onClick={this.handleExportPdf}
                    className="btn btn-default text-uppercase"
                  >
                    Export Pdf
                  </button>
                  <button
                    onClick={this.handlePrintReview}
                    className="btn btn-default text-uppercase"
                  >
                    Print Review
                  </button>
                  <button
                    onClick={this.handleSaveBudget}
                    className="btn btn-default text-uppercase"
                  >
                    Submit
                  </button>
                </div>

                <div className="revision-area">
                  <div className="flex">
                    <div className="top-col"> </div>
                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 1
                      </span>
                    </div>

                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 2
                      </span>
                    </div>
                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 3
                      </span>
                    </div>
                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 4
                      </span>
                    </div>
                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 5
                      </span>
                    </div>
                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 6
                      </span>
                    </div>
                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 7
                      </span>
                    </div>
                  </div>

                  <div className="r-drop-panel">
                    <Panel id="collapsible-panel-example-2" defaultExpanded>
                      <Panel.Heading>
                        <Panel.Title toggle>
                          Revision 3 <Glyphicon glyph="chevron-down" />
                        </Panel.Title>
                      </Panel.Heading>
                      <Panel.Collapse>
                        <Panel.Body>
                          <div className="flex">
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>

                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                          </div>
                        </Panel.Body>
                      </Panel.Collapse>
                    </Panel>
                  </div>
                  <div className="r-drop-panel">
                    <Panel id="collapsible-panel-example-2">
                      <Panel.Heading>
                        <Panel.Title toggle>
                          Revision 2 <Glyphicon glyph="chevron-down" />
                        </Panel.Title>
                      </Panel.Heading>
                      <Panel.Collapse>
                        <Panel.Body>
                          <div className="flex">
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>

                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                          </div>
                        </Panel.Body>
                      </Panel.Collapse>
                    </Panel>
                  </div>
                  <div className="r-drop-panel">
                    <Panel id="collapsible-panel-example-2">
                      <Panel.Heading>
                        <Panel.Title toggle>
                          Revision 1 <Glyphicon glyph="chevron-down" />
                        </Panel.Title>
                      </Panel.Heading>
                      <Panel.Collapse>
                        <Panel.Body>
                          <div className="flex">
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>

                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                          </div>
                        </Panel.Body>
                      </Panel.Collapse>
                    </Panel>
                  </div>
                </div>
              </div>
            </div>
            {this.state.show ? (
              <SliderModal
                show={this.state.show}
                partId={this.state.partIdforMedia}
                partNumber={this.state.partNumberforMedia}
                partMediaResponses={this.state.partMediaResponses}
                specificationResponses={this.state.specificationResponses}
                handleCloseModal={this.handleCloseModal}
              />
            ) : null}
            <Footer
              pageTitle={permissionConstant.footer_title.build_plan_eco}
            />
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
      actionGetPurchaseCategoryData,
      actionGetProjectListForIndirectPurchase,
      actionCheckAccountNo,
      actionGetRevisionUsers,
      actionSaveBudgetOne,
      actionUploadBudgetDocumentse
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
)(budget);
