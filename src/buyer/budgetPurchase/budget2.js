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
import noRecord from '../../img/no_record.png';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetPurchaseCategoryData,
  actionGetProjectListForIndirectPurchase,
  actionCheckAccountNo,
  actionGetRevisionUsers,
  actionSaveBudgetOne,
  actionUploadBudgetDocumentse,
  actionGetBudgetData,
  actionGetBudgetExtraData,
  actionSetBudgetApprovalData
} from '../../common/core/redux/actions';
import {
  showSuccessToast,
  showErrorToast,
  removeUnderScore
} from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Slider from 'react-slick';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import { handlePermission } from '../../common/permissions';
import _ from 'lodash';
let { permissionConstant } = CONSTANTS;
let { validationMessages } = CONSTANTS;
const otherApproversStyle = {
  height: '34px',
  fontSize: '13px',
  fontWeight: 'normal',
  textTransform: 'capitalize',
  lineHeight: '0.428571',
  paddingLeft: '14px',
  color: '#555',
  bordreRadius: '4px'
};

class budget2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'tenth',
      displayedColumns: [
        {
          label: 'Budget Item',
          key: 'budgetItemNumber',
          isShow: true,
          disabled: true
        },
        { label: 'Account', key: 'account', isShow: true, disabled: true },
        {
          label: 'Account Description',
          key: 'accountDescription',
          isShow: true,
          disabled: true
        },
        {
          label: 'Budget Item Description',
          key: 'budgetItemDescription',
          isShow: true,
          disabled: true
        },

        { label: 'Currency', key: 'Currency', isShow: false },
        { label: 'Description', key: 'description', isShow: false },

        { label: 'BRAND', key: 'brand', isShow: false },

        { label: 'DEPARTMEN', key: 'DEPARTMEN', isShow: false },

        { label: 'MAJOR CATEGORY', key: 'MAJOR CATEGORY', isShow: false },

        { label: 'SECTOR  CATEGORY', key: 'SECTOR CATEGORY', isShow: false },
        {
          label: 'INPUT BY INTIAL APPROVAL BY',
          key: 'INPUT BY INTIAL APPROVAL BY',
          isShow: false
        },
        { label: 'APPROVERS', key: 'APPROVERS', isShow: false },
        { label: 'ITEM REVISION', key: 'ITEM REVISION', isShow: false },
        { label: 'STATUS', key: 'STATUS', isShow: false },
        { label: 'GLOBAL REGIONS', key: 'GLOBAL REGIONS', isShow: false }
      ],
      show: false,
      tableNo: 0,
      showHeading: [],
      listOfYears: [this.yearObject],
      listOfQuater: [this.quaterlyObject],
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
        listOfMediaRequest: [],
        noRecordImage: false
      }
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.addTable = this.addTable.bind(this);
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
  }

  componentWillMount() {}

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

    this.props
      .actionGetBudgetData(data)
      .then((result, error) => {
        let purchaseResponse =
          result.payload.data.resourceData.budgetDetailResponse;

        console.log('ListOfBudget-----------------', purchaseResponse);
        let approversLenght = 0;
        let approversLenghtArr = [];
        purchaseResponse &&
          purchaseResponse.forEach(function(element, index) {
            approversLenght =
              approversLenght > element.listOfApprovers.length
                ? approversLenght
                : element.listOfApprovers.length;

            approversLenghtArr =
              approversLenghtArr.length > element.listOfApprovers.length
                ? approversLenghtArr
                : element.listOfApprovers;
          });

        this.setState({
          ListOfBudget: purchaseResponse,
          approversLenght: approversLenght,
          approversLenghtArr: approversLenghtArr
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    this.props
      .actionGetBudgetExtraData(data)
      .then((result, error) => {
        let resourceData =
          result.payload.data.resourceData.budgetDetailResponse;
        let financialBudgetResponse =
          result.payload.data.resourceData.financialBudgetResponse;

        if (result.payload.data.status == 200) {
          let date = financialBudgetResponse.dateOfFinancialYear
            ? financialBudgetResponse.dateOfFinancialYear
            : moment().format('DD/MM/YYYY');
          let cloneBudgetFromList =
            result.payload.data.resourceData.cloneBudgetFromList;
          let listOfRedComparision =
            result.payload.data.resourceData.listOfRedComparision;
          let listOfBlueComparision =
            result.payload.data.resourceData.listOfBlueComparision;

          let listOfForecastYears =
            result.payload.data.resourceData.listOfForecastYears;
          let listOfForecasts =
            result.payload.data.resourceData.listOfForecasts;
          let listOfRevisions =
            result.payload.data.resourceData.listOfRevisions;

          _this.setState({
            ListOfBudget: resourceData,
            dateOfFinancialYear: date,
            financialBudgetId: financialBudgetResponse.id,
            cloneBudgetFromList: cloneBudgetFromList,
            listOfRedComparision: listOfRedComparision,
            listOfBlueComparision: listOfBlueComparision,
            listOfForecastYears: listOfForecastYears,
            listOfForecasts: listOfForecasts,
            listOfRevisions: listOfRevisions,
            noRecordImage: true
          });
        }
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

  addTable() {
    let tableNo = this.state.tableNo;
    let noOfTable = this.state.noOfTable;
    let noOfCategory = this.state.noOfCategory;
    tableNo += 1;
    noOfCategory[tableNo] = [{}];
    noOfTable.push({});
    this.setState({ noOfTable: noOfTable, tableNo: tableNo });
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

    let ListOfBudget = this.state.ListOfBudget;
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
    ListOfBudget.push(categoryObject);
    this.setState({ ListOfBudget: ListOfBudget });
  }
  removeCategory(event) {
    let ListOfBudget = this.state.ListOfBudget;
    if (ListOfBudget.length !== 1) {
      ListOfBudget.pop();
    }
    this.setState({ ListOfBudget: ListOfBudget });
  }

  addToolYear(event) {
    let _this = this;
    let ListOfBudget = this.state.ListOfBudget;

    let yearRange =
      this.state.listOfYears &&
      this.state.listOfYears[0] &&
      this.state.listOfYears[0].length
        ? this.state.listOfYears[0].length
        : 1;
    console.log('--yearRange--', yearRange);
    console.log('--Before ListOfBudget--', this.state.ListOfBudget);
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
    ListOfBudget.map(function(item, index) {
      item.listOfYearDetails.push(yearObject);
      if (index === 0) toolList.push(item.listOfYearDetails);
    });

    this.setState({ listOfYears: toolList });
    this.setState({ ListOfBudget: ListOfBudget });

    console.log('--After ListOfBudget--', this.state.ListOfBudget);
    console.log('--After listOfYears--', this.state.listOfYears);
  }

  addQuaterly(event, quaterIndex, quaterFlag) {
    let _this = this;
    let ListOfBudget = this.state.ListOfBudget;
    let quaterlyObject = this.quaterlyObject;
    if (quaterFlag) {
      ListOfBudget.map(function(item, index) {
        item.listOfYearDetails[quaterIndex].listOfMonthlyDetails = [];
        item.listOfYearDetails[quaterIndex].listOfQuaterlyDetails = [];
        item.listOfYearDetails[quaterIndex].quaterFlag = false;
      });
    } else {
      ListOfBudget.map(function(item, index) {
        item.listOfYearDetails[quaterIndex].listOfMonthlyDetails = [];
        item.listOfYearDetails[quaterIndex].listOfQuaterlyDetails = [];
        item.listOfYearDetails[quaterIndex].listOfQuaterlyDetails.push(
          quaterlyObject
        );
        item.listOfYearDetails[quaterIndex].quaterFlag = true;
      });
    }
    this.setState({ ListOfBudget: ListOfBudget });
    console.log('--After ListOfBudget--', this.state.ListOfBudget);
  }

  addMonthly(event, monthIndex, monthFlag) {
    console.log('addMonthly', monthFlag);

    let _this = this;
    let ListOfBudget = this.state.ListOfBudget;

    let monthsObject = this.monthsObject;
    console.log('yearObject--', monthsObject);
    console.log('monthIndex--', monthIndex);

    if (monthFlag) {
      console.log('if');
      ListOfBudget.map(function(item, index) {
        item.listOfYearDetails[monthIndex].listOfQuaterlyDetails = [];
        item.listOfYearDetails[monthIndex].listOfMonthlyDetails = [];
        item.listOfYearDetails[monthIndex].monthFlag = false;
      });
    } else {
      console.log('else');
      ListOfBudget.map(function(item, index) {
        item.listOfYearDetails[monthIndex].listOfQuaterlyDetails = [];
        item.listOfYearDetails[monthIndex].listOfMonthlyDetails = [];
        item.listOfYearDetails[monthIndex].listOfMonthlyDetails.push(
          monthsObject
        );
        item.listOfYearDetails[monthIndex].monthFlag = true;
      });
    }
    this.setState({ ListOfBudget: ListOfBudget });
    console.log('--After ListOfBudget--', this.state.ListOfBudget);
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
    console.log('catIndex..', catIndex, 'tableIndex', tableIndex);
    const { name, value } = event.target;
    let noOfTable = this.state.noOfTable;
    noOfTable[tableIndex][catIndex][name] = value;
    this.setState({ noOfTable: noOfTable });
  }
  handleDisplayedColumns(event, index) {
    const selected = event.target.checked;
    let selectedItem = false;
    if (selected) {
      selectedItem = true;
    } else {
      selectedItem = false;
    }

    this.setState((prevState, props) => {
      const approverIndex = (prevState.displayedColumns[
        index
      ].isShow = selectedItem);
      return { displayedColumns: prevState.displayedColumns };
    });
  }

  openQuarterlyShowHideCollapse(
    event,
    type,
    flag,
    indexBud,
    indexYear,
    indexObj,
    indexQauter
  ) {
    console.log(
      'openQuarterlyShowHideCollapse',
      flag,
      indexBud,
      indexYear,
      indexObj,
      indexQauter
    );

    let ListOfBudget = this.state.ListOfBudget;
    let yearlyAmount = ListOfBudget[indexBud].budgetYearRequests[indexYear];

    ListOfBudget &&
      ListOfBudget.forEach(function(element, index) {
        element &&
          element.budgetYearRequests.forEach(function(elementBud, indexBud) {
            if (indexYear == indexBud) {
              elementBud &&
                elementBud.yearlyAmount.forEach(function(elementQauter, index) {
                  elementQauter.quarterlyAmount.forEach(function(
                    elementMonth,
                    indexQ
                  ) {
                    if (type == 'QAUTER' && indexQ === indexQauter) {
                      elementMonth.openMonth = flag;
                    }
                  });
                  if (type == 'YEAR') {
                    elementQauter.openQauter = flag;
                  }
                });
            }
          });
      });

    // if(type == 'YEAR'){
    //  yearlyAmount.yearlyAmount[indexObj].openQauter = flag
    // }
    // else if(type == 'QAUTER'){
    //   yearlyAmount.yearlyAmount[indexObj].quarterlyAmount[indexQauter].openMonth = flag
    // }

    //ListOfBudget[indexBud].budgetYearRequests[indexYear] = yearlyAmount;
    this.setState({
      ListOfBudget: ListOfBudget
    });
  }

  openMonthlyShowHideCollapse(event) {
    console.log('openMonthlyShowHideCollapse gtertertre');
    if (this.state.monthly === 'showData') {
      this.setState({ monthly: 'hideData', quarterly: 'hideData' });
    } else {
      this.setState({ monthly: 'showData', quarterly: 'hideData' });
    }
  }
  handleChange(event, catIndex) {
    const { name, value, checked } = event.target;
    let ListOfBudget = this.state.ListOfBudget;
    let listOfAddress = this.state.listOfAddress;

    console.log('ListOfBudget-', ListOfBudget);
    console.log('name, value-', name, value);
    ListOfBudget[catIndex][name] = value;

    if (name === 'address') {
      let addressObj = _.filter(listOfAddress, function(data) {
        return data.address === value;
      });

      ListOfBudget[catIndex].area =
        addressObj && addressObj[0] && addressObj[0].locationId
          ? addressObj[0].locationId
          : '';

      ListOfBudget[catIndex][name] = addressObj[0];
    } else if (name === 'rAndD') {
      if (checked) {
        ListOfBudget[catIndex][name] = true;
      } else {
        ListOfBudget[catIndex][name] = false;
      }
    }
    let categoryData = this.state.ListOfBudget[catIndex];
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
        ListOfBudget[catIndex].budgetItemNumber = createdAccountNo;
        ListOfBudget[catIndex].showAccountText = true;
      }
    }
    this.setState({ ListOfBudget: ListOfBudget });
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
          this.state.ListOfBudget[catIndex].budgetItemNumber = '';
        }

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }
  handleChangeRequest(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value
    });
  }

  revisionApprove(keyword, levelOfApproval, commentRevisionId, catIndex) {
    let _this = this;
    let status = '';
    let ListOfBudget = this.state.ListOfBudget;
    if (_this.state.comment) {
      let data = {
        userId: this.props.userInfo.userData.id,
        roleId: this.props.userInfo.userData.userRole,
        approvalStatus: keyword,
        levelOfApproval: levelOfApproval,
        comment: _this.state.comment,
        id: commentRevisionId
      };

      // this.props
      //   .actionSetBudgetApprovalData(data)
      //   .then((result, error) => {
      //     if (result.payload.data.status == 200) {
      //       _this.props
      //         .actionGetBudgetData(data)
      //         .then((result, error) => {
      //           console.log('result-----------------', result);

      //           let purchaseResponse =
      //             result.payload.data.resourceData.budgetDetailResponse;
      //           _this.setState({
      //             ListOfBudget: purchaseResponse
      //           });
      //           _this.props.actionLoaderHide();
      //         })
      //         .catch(e => _this.props.actionLoaderHide());
      //     }

      //     this.setState({ comment: '' });
      //     // this.getBuildPlanData(this.state.projectKey);
      //     _this.props.actionLoaderHide();
      //   })
      //   .catch(e => _this.props.actionLoaderHide());
    } else {
      showErrorToast(validationMessages.buildPlanECO.commentError);
      return false;
    }
  }
  render() {
    let lastMonth = moment().format('DD/MM/YYYY');
    let _this = this;
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
                <h4 class="hero-title">Budget Plan</h4>
                <div className="bugetHeadWrap">
                  {/* <div className="budgetHeadleft flex align-center">
                    <div className="commitWrap"> */}
                  {/* <label className="label--radio">
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
                      </label> */}
                  {/* </div>
                  </div> */}

                  <div className="budgetHeadrgt">
                    <FormGroup controlId="formControlsSelect">
                      <FormControl
                        componentClass="select"
                        className="s-arrow br-0 redclr"
                        name="department"
                      >
                        <option value="select">
                          Revision X Forecast FY2018-19
                        </option>
                        <option>Sales</option>
                      </FormControl>
                    </FormGroup>

                    <FormGroup controlId="formControlsSelect">
                      <FormControl
                        componentClass="select"
                        className="s-arrow br-0 blueclr"
                        // value={this.state.selectedProjectId}
                        name="department"
                      >
                        <option value="select">
                          Revision X Forecast FY2018-19
                        </option>
                        <option>Sales</option>
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
                    {/* <div className="text-center m-b-20"> */}
                    {/* <button
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
                      </button> */}
                    {/* </div> */}

                    <div className="flex">
                      <FormGroup controlId="formControlsSelect" className="p-5">
                        <FormControl
                          componentClass="select"
                          placeholder="Revision X"
                          className="s-arrow br-0"
                          name="revisionNo"
                          value={this.state.revisionNo}
                          onChange={event => {
                            this.handleChangeRequest(event);
                          }}
                        >
                          <option value="select">Revision X</option>
                          {this.state.listOfRevisions &&
                            this.state.listOfRevisions.map((item, index) => {
                              return (
                                <option value={item} key={index}>
                                  {item}
                                </option>
                              );
                            })}
                        </FormControl>
                      </FormGroup>
                      <FormGroup controlId="formControlsSelect" className="p-5">
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
                          {this.state.listOfForecasts &&
                            this.state.listOfForecasts.map((item, index) => {
                              return (
                                <option value={item} key={index}>
                                  {removeUnderScore(item)}
                                </option>
                              );
                            })}
                        </FormControl>
                      </FormGroup>
                      <FormGroup controlId="formControlsSelect" className="p-5">
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
                          {this.state.listOfForecastYears &&
                            this.state.listOfForecastYears.map(
                              (item, index) => {
                                return (
                                  <option value={item} key={index}>
                                    {item}
                                  </option>
                                );
                              }
                            )}
                        </FormControl>
                      </FormGroup>
                    </div>
                    <div className="flex">
                      {/* <FormGroup className="p-5" controlId="formControlsSelect2">
                            <FormControl
                              componentClass="select"
                              placeholder="select"
                              className="s-arrow br-0"
                              name="department">
                              <option value="select">Hide Columns</option>
                              <option>View Columns</option>
                            </FormControl>
                          </FormGroup> */}

                      <div className="custom-dd dropRf p-5">
                        <DropdownButton
                          title=" Select Columns"
                          name="displayedColumns"
                          className="dropSelect btn-block"
                          style={otherApproversStyle}
                        >
                          {this.state.displayedColumns &&
                            this.state.displayedColumns.map((item, index) => {
                              return (
                                <li className="xxx">
                                  <input
                                    type="checkbox"
                                    value={item.isShow}
                                    disabled={item.disabled ? true : false}
                                    checked={item.isShow ? true : false}
                                    onChange={event => {
                                      this.handleDisplayedColumns(event, index);
                                    }}
                                  />
                                  <label>{item.label} </label>
                                </li>
                              );
                            })}
                        </DropdownButton>
                      </div>

                      <FormGroup
                        className="p-5"
                        controlId="formControlsSelect2"
                      >
                        <FormControl
                          componentClass="select"
                          placeholder="select"
                          className="s-arrow br-0"
                          name="department"
                        >
                          <option value="select">Currency</option>
                          <option>11</option>
                        </FormControl>
                      </FormGroup>

                      <FormGroup
                        className="p-5"
                        controlId="formControlsSelect2"
                      >
                        <FormControl
                          componentClass="select"
                          placeholder="select"
                          className="s-arrow br-0"
                          name="department"
                        >
                          <option value="select">Show Total</option>
                          <option>Individual Item</option>
                        </FormControl>
                      </FormGroup>

                      <FormGroup
                        className="p-5"
                        controlId="formControlsSelect2"
                      >
                        <FormControl
                          componentClass="select"
                          placeholder="select"
                          className="s-arrow br-0"
                          name="department"
                        >
                          <option value="select">000 mil</option>
                          <option>000 mil</option>
                        </FormControl>
                      </FormGroup>
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
                          {this.state.displayedColumns &&
                            this.state.displayedColumns.map((item, index) => {
                              return item.isShow ? (
                                <th>
                                  {item.label}
                                  <span
                                    onClick={event => {
                                      this.handleSort(event, item.key);
                                    }}
                                  >
                                    <i class="glyphicon glyphicon-triangle-bottom" />{' '}
                                  </span>
                                </th>
                              ) : (
                                ''
                              );
                            })}

                          {this.state.ListOfBudget &&
                            this.state.ListOfBudget.map((itemBud, indexBud) => {
                              return [
                                itemBud.budgetYearRequests.map(
                                  (itemYear, indexYear) => {
                                    return [
                                      <th>
                                        Input by{' '}
                                        <span>
                                          <i class="glyphicon glyphicon-triangle-bottom" />
                                        </span>
                                      </th>,
                                      <th>Total </th>,
                                      itemYear.yearlyAmount.map(
                                        (itemObj, indexObj) => {
                                          lastMonth = moment(
                                            itemObj.date,
                                            'DD/MM/YYYY'
                                          )
                                            .add(1, 'years')
                                            .format('DD/MM/YYYY');
                                          return [
                                            <th>
                                              <p className="m-b-0">
                                                {!itemObj.openQauter ? (
                                                  <span
                                                    className="ico-add plusIcon"
                                                    onClick={event => {
                                                      this.openQuarterlyShowHideCollapse(
                                                        event,
                                                        'YEAR',
                                                        true,
                                                        indexBud,
                                                        indexYear,
                                                        indexObj
                                                      );
                                                    }}
                                                  >
                                                    <svg>
                                                      <use
                                                        xlinkHref={`${Sprite}#plus-OIco`}
                                                      />
                                                    </svg>
                                                  </span>
                                                ) : (
                                                  <span
                                                    class="ico-minusgly minIcon"
                                                    onClick={event => {
                                                      this.openQuarterlyShowHideCollapse(
                                                        event,
                                                        'YEAR',
                                                        false,
                                                        indexBud,
                                                        indexYear,
                                                        indexObj
                                                      );
                                                    }}
                                                  >
                                                    {' '}
                                                  </span>
                                                )}
                                                FY-{itemYear.yearFrom}-
                                                {itemYear.yearTo}{' '}
                                              </p>
                                            </th>,
                                            itemObj.openQauter
                                              ? itemObj.quarterlyAmount.map(
                                                  (itemQauter, indexQauter) => {
                                                    lastMonth = moment(
                                                      itemObj.date,
                                                      'DD/MM/YYYY'
                                                    )
                                                      .add(1, 'years')
                                                      .format('DD/MM/YYYY');
                                                    return [
                                                      <th>
                                                        <p className="m-b-0">
                                                          {!itemQauter.openMonth ? (
                                                            <span
                                                              className="ico-add plusIcon"
                                                              onClick={event => {
                                                                this.openQuarterlyShowHideCollapse(
                                                                  event,
                                                                  'QAUTER',
                                                                  true,
                                                                  indexBud,
                                                                  indexYear,
                                                                  indexObj,
                                                                  indexQauter
                                                                );
                                                              }}
                                                            >
                                                              <svg>
                                                                <use
                                                                  xlinkHref={`${Sprite}#plus-OIco`}
                                                                />
                                                              </svg>
                                                            </span>
                                                          ) : (
                                                            <span
                                                              class="ico-minusgly minIcon"
                                                              onClick={event => {
                                                                this.openQuarterlyShowHideCollapse(
                                                                  event,
                                                                  'QAUTER',
                                                                  false,
                                                                  indexBud,
                                                                  indexYear,
                                                                  indexObj,
                                                                  indexQauter
                                                                );
                                                              }}
                                                            />
                                                          )}
                                                          Q{indexQauter + 1}{' '}
                                                        </p>
                                                      </th>,
                                                      itemQauter.openMonth
                                                        ? itemQauter.monthlyAmount.map(
                                                            (
                                                              itemMonth,
                                                              indexMonth
                                                            ) => {
                                                              lastMonth =
                                                                itemMonth.date;
                                                              return [
                                                                <th>
                                                                  <p className="m-b-0">
                                                                    {this.state
                                                                      .quarterly ===
                                                                    'hideData' ? (
                                                                      <span
                                                                        className="ico-add plusIcon"
                                                                        onClick={
                                                                          this
                                                                            .openQuarterlyShowHideCollapse
                                                                        }
                                                                      >
                                                                        <svg>
                                                                          <use
                                                                            xlinkHref={`${Sprite}#plus-OIco`}
                                                                          />
                                                                        </svg>
                                                                      </span>
                                                                    ) : (
                                                                      <span
                                                                        class="ico-minusgly minIcon"
                                                                        onClick={
                                                                          this
                                                                            .openQuarterlyShowHideCollapse
                                                                        }
                                                                      >
                                                                        {' '}
                                                                      </span>
                                                                    )}
                                                                    {
                                                                      itemMonth.month
                                                                    }
                                                                  </p>
                                                                </th>
                                                              ];
                                                            }
                                                          )
                                                        : ''
                                                    ];
                                                  }
                                                )
                                              : ''
                                          ];
                                        }
                                      )
                                    ];
                                  }
                                )
                              ];
                            })}

                          <th lassName="w100">Document</th>
                        </tr>
                      </thead>
                      {this.state.ListOfBudget &&
                      this.state.ListOfBudget.length ? (
                        <tbody>
                          {this.state.ListOfBudget &&
                            this.state.ListOfBudget.map((elem, catIndex) => {
                              return (
                                <tr>
                                  <td className="w100">{elem.budgetItemNo}</td>
                                  <td className="w100">{elem.accountNo}</td>
                                  <td className="w100">{elem.total}</td>
                                  <td className="w100">{elem.description}</td>
                                  {this.state.displayedColumns &&
                                  this.state.displayedColumns[4].isShow ? (
                                    <td className="w100">
                                      {elem.description1}
                                    </td>
                                  ) : (
                                    ''
                                  )}
                                  {this.state.displayedColumns &&
                                  this.state.displayedColumns[5].isShow ? (
                                    <td className="w100">{elem.currency}</td>
                                  ) : (
                                    ''
                                  )}
                                  {this.state.displayedColumns[6].isShow ? (
                                    <td className="bugettbfl">
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          BRAND&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.brandName}
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          SUB BRAND&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.subBrandName}
                                        </span>
                                      </div>
                                    </td>
                                  ) : (
                                    ''
                                  )}{' '}
                                  {this.state.displayedColumns[7].isShow ? (
                                    <td className="bugettbfl">
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Department&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.departmentName}
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          SUB Department&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.subDepartmentName}
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Team&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.teamName}
                                        </span>
                                      </div>
                                    </td>
                                  ) : (
                                    ''
                                  )}{' '}
                                  {this.state.displayedColumns[8].isShow ? (
                                    <td className="bugettbfl">
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Major Category&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.majorCategoryName}
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Category&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.categoryName}
                                        </span>
                                      </div>

                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Sub Category&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.subCategoryName}
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Sub Sub Category&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.subSubCategoryName}
                                        </span>
                                      </div>
                                    </td>
                                  ) : (
                                    ''
                                  )}{' '}
                                  {this.state.displayedColumns[9].isShow ? (
                                    <td className="bugettbfl">
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Sector&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.sectorName}
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Model Family&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.modelFamilyName}
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Product Line&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.productLineName}
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Program&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          {elem.programName}
                                        </span>
                                      </div>
                                    </td>
                                  ) : (
                                    ''
                                  )}{' '}
                                  {this.state.displayedColumns[14].isShow ? (
                                    <td className="bugettbfl">
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Region&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          xxxxx
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Sub Region&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          xxxxx
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Country&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          xxxxx
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Zone&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          xxxxx
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          District&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          xxxxx
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Circle&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          xxxxx
                                        </span>
                                      </div>
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                          Area&nbsp;:
                                        </span>
                                        <span className="flex-1 tb-value text-left">
                                          xxxxx
                                        </span>
                                      </div>
                                    </td>
                                  ) : (
                                    ''
                                  )}
                                  {this.state.ListOfBudget &&
                                    this.state.ListOfBudget.map(
                                      (itemBud, indexBud) => {
                                        return [
                                          itemBud.budgetYearRequests.map(
                                            (itemYear, indexYear) => {
                                              console.log(
                                                'itemYear-----------',
                                                itemYear
                                              );
                                              return [
                                                <td>
                                                  {itemYear.inputBy == 1
                                                    ? 'Yearly'
                                                    : itemYear.inputBy == 4
                                                    ? 'Quaterly'
                                                    : itemYear.inputBy == 12
                                                    ? 'Monthly'
                                                    : ''}
                                                </td>,
                                                <td>
                                                  {' '}
                                                  {elem.inputAmountBy ==
                                                    'commit_and_pay' ||
                                                  elem.inputAmountBy ==
                                                    'pay' ? (
                                                    <FormGroup className="m-b-3 flex">
                                                      <ControlLabel className="labelwd">
                                                        Pay
                                                      </ControlLabel>
                                                      {itemYear.totalPay}
                                                    </FormGroup>
                                                  ) : (
                                                    <FormGroup className="m-b-3 flex">
                                                      <ControlLabel className="labelwd">
                                                        Pay
                                                      </ControlLabel>
                                                      {itemYear.totalPay}
                                                    </FormGroup>
                                                  )}
                                                  {elem.inputAmountBy ==
                                                    'commit_and_pay' ||
                                                  elem.inputAmountBy ==
                                                    'commit' ? (
                                                    <FormGroup className="m-b-0 flex">
                                                      <ControlLabel className="labelwd">
                                                        Commit
                                                      </ControlLabel>
                                                      {itemYear.totalCommit}
                                                    </FormGroup>
                                                  ) : (
                                                    <FormGroup className="m-b-0 flex">
                                                      <ControlLabel className="labelwd">
                                                        Commit
                                                      </ControlLabel>
                                                      {itemYear.totalCommit}
                                                    </FormGroup>
                                                  )}
                                                </td>,
                                                itemYear.yearlyAmount.map(
                                                  (itemObj, indexObj) => {
                                                    lastMonth = moment(
                                                      itemObj.date,
                                                      'DD/MM/YYYY'
                                                    )
                                                      .add(1, 'years')
                                                      .format('DD/MM/YYYY');
                                                    return [
                                                      <td>
                                                        <div className="m-b-3 flex align-center comflex">
                                                          {_this.state
                                                            .inputAmountBy ==
                                                            'commit_and_pay' ||
                                                          _this.state
                                                            .inputAmountBy ==
                                                            'pay' ? (
                                                            <div className="td-item">
                                                              {this.state
                                                                .iscompareGreen ? (
                                                                <span className="sm-tip text-left">
                                                                  YYYY
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}

                                                              {
                                                                itemObj.payAmount
                                                              }

                                                              {this.state
                                                                .iscompareGreen ? (
                                                                <span className="sm-tip color-light text-right">
                                                                  YYYY
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}
                                                            </div>
                                                          ) : (
                                                            <div className="td-item">
                                                              {this.state
                                                                .iscompareGreen ? (
                                                                <span className="sm-tip text-left">
                                                                  YYYY
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}

                                                              {
                                                                itemObj.payAmount
                                                              }

                                                              {this.state
                                                                .iscompareGreen ? (
                                                                <span className="sm-tip color-light text-right">
                                                                  YYYY
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}
                                                            </div>
                                                          )}
                                                        </div>
                                                        <div className="flex align-center comflex">
                                                          {_this.state
                                                            .inputAmountBy ==
                                                            'commit_and_pay' ||
                                                          _this.state
                                                            .inputAmountBy ==
                                                            'commit' ? (
                                                            <div className="td-item">
                                                              {this.state
                                                                .iscompareGreen ? (
                                                                <span className="sm-tip text-left">
                                                                  YYYY
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}

                                                              {
                                                                itemObj.commitAmount
                                                              }
                                                              {this.state
                                                                .iscompareGreen ? (
                                                                <span className="sm-tip color-light text-right">
                                                                  YYYY
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}
                                                            </div>
                                                          ) : (
                                                            <div className="td-item">
                                                              {this.state
                                                                .iscompareGreen ? (
                                                                <span className="sm-tip text-left">
                                                                  YYYY
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}

                                                              {
                                                                itemObj.commitAmount
                                                              }
                                                              {this.state
                                                                .iscompareGreen ? (
                                                                <span className="sm-tip color-light text-right">
                                                                  YYYY
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}
                                                            </div>
                                                          )}
                                                        </div>
                                                      </td>,
                                                      itemObj.openQauter
                                                        ? itemObj.quarterlyAmount.map(
                                                            (
                                                              itemQauter,
                                                              indexQauter
                                                            ) => {
                                                              lastMonth = moment(
                                                                itemObj.date,
                                                                'DD/MM/YYYY'
                                                              )
                                                                .add(1, 'years')
                                                                .format(
                                                                  'DD/MM/YYYY'
                                                                );
                                                              return [
                                                                <td>
                                                                  <div className="m-b-3 flex align-center comflex">
                                                                    {_this.state
                                                                      .inputAmountBy ==
                                                                      'commit_and_pay' ||
                                                                    _this.state
                                                                      .inputAmountBy ==
                                                                      'pay' ? (
                                                                      <div className="td-item">
                                                                        {this
                                                                          .state
                                                                          .iscompareGreen ? (
                                                                          <span className="sm-tip text-left">
                                                                            YYYY
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}

                                                                        {
                                                                          itemQauter.payAmount
                                                                        }

                                                                        {this
                                                                          .state
                                                                          .iscompareGreen ? (
                                                                          <span className="sm-tip color-light text-right">
                                                                            YYYY
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}
                                                                      </div>
                                                                    ) : (
                                                                      <div className="td-item">
                                                                        {this
                                                                          .state
                                                                          .iscompareGreen ? (
                                                                          <span className="sm-tip text-left">
                                                                            YYYY
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}

                                                                        {
                                                                          itemQauter.payAmount
                                                                        }

                                                                        {this
                                                                          .state
                                                                          .iscompareGreen ? (
                                                                          <span className="sm-tip color-light text-right">
                                                                            YYYY
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                  </div>

                                                                  <div className="flex align-center comflex">
                                                                    {_this.state
                                                                      .inputAmountBy ==
                                                                      'commit_and_pay' ||
                                                                    _this.state
                                                                      .inputAmountBy ==
                                                                      'commit' ? (
                                                                      <div className="td-item">
                                                                        {this
                                                                          .state
                                                                          .iscompareGreen ? (
                                                                          <span className="sm-tip text-left">
                                                                            YYYY
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}

                                                                        {
                                                                          itemQauter.commitAmount
                                                                        }

                                                                        {this
                                                                          .state
                                                                          .iscompareGreen ? (
                                                                          <span className="sm-tip color-light text-right">
                                                                            YYYY
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}
                                                                      </div>
                                                                    ) : (
                                                                      <div className="td-item">
                                                                        {this
                                                                          .state
                                                                          .iscompareGreen ? (
                                                                          <span className="sm-tip text-left">
                                                                            YYYY
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}

                                                                        {
                                                                          itemQauter.commitAmount
                                                                        }

                                                                        {this
                                                                          .state
                                                                          .iscompareGreen ? (
                                                                          <span className="sm-tip color-light text-right">
                                                                            YYYY
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                  </div>
                                                                </td>,
                                                                itemQauter.openMonth
                                                                  ? itemQauter.monthlyAmount.map(
                                                                      (
                                                                        itemMonth,
                                                                        indexMonth
                                                                      ) => {
                                                                        lastMonth =
                                                                          itemMonth.date;
                                                                        return [
                                                                          <td>
                                                                            <div className="m-b-3 flex align-center comflex">
                                                                              {_this
                                                                                .state
                                                                                .inputAmountBy ==
                                                                                'commit_and_pay' ||
                                                                              _this
                                                                                .state
                                                                                .inputAmountBy ==
                                                                                'pay' ? (
                                                                                <div className="td-item">
                                                                                  {this
                                                                                    .state
                                                                                    .iscompareGreen ? (
                                                                                    <span className="sm-tip text-left">
                                                                                      YYYY
                                                                                    </span>
                                                                                  ) : (
                                                                                    ''
                                                                                  )}

                                                                                  {
                                                                                    itemMonth.payAmount
                                                                                  }
                                                                                  {this
                                                                                    .state
                                                                                    .iscompareGreen ? (
                                                                                    <span className="sm-tip color-light text-right">
                                                                                      YYYY
                                                                                    </span>
                                                                                  ) : (
                                                                                    ''
                                                                                  )}
                                                                                </div>
                                                                              ) : (
                                                                                <div className="td-item">
                                                                                  {this
                                                                                    .state
                                                                                    .iscompareGreen ? (
                                                                                    <span className="sm-tip text-left">
                                                                                      YYYY
                                                                                    </span>
                                                                                  ) : (
                                                                                    ''
                                                                                  )}

                                                                                  {
                                                                                    itemMonth.payAmount
                                                                                  }
                                                                                  {this
                                                                                    .state
                                                                                    .iscompareGreen ? (
                                                                                    <span className="sm-tip color-light text-right">
                                                                                      YYYY
                                                                                    </span>
                                                                                  ) : (
                                                                                    ''
                                                                                  )}
                                                                                </div>
                                                                              )}
                                                                            </div>

                                                                            <div className="flex align-center comflex">
                                                                              {_this
                                                                                .state
                                                                                .inputAmountBy ==
                                                                                'commit_and_pay' ||
                                                                              _this
                                                                                .state
                                                                                .inputAmountBy ==
                                                                                'commit' ? (
                                                                                <div className="td-item">
                                                                                  {this
                                                                                    .state
                                                                                    .iscompareGreen ? (
                                                                                    <span className="sm-tip text-left">
                                                                                      YYYY
                                                                                    </span>
                                                                                  ) : (
                                                                                    ''
                                                                                  )}

                                                                                  {
                                                                                    itemMonth.commitAmount
                                                                                  }

                                                                                  {this
                                                                                    .state
                                                                                    .iscompareGreen ? (
                                                                                    <span className="sm-tip color-light text-right">
                                                                                      YYYY
                                                                                    </span>
                                                                                  ) : (
                                                                                    ''
                                                                                  )}
                                                                                </div>
                                                                              ) : (
                                                                                <div className="td-item">
                                                                                  {this
                                                                                    .state
                                                                                    .iscompareGreen ? (
                                                                                    <span className="sm-tip text-left">
                                                                                      YYYY
                                                                                    </span>
                                                                                  ) : (
                                                                                    ''
                                                                                  )}

                                                                                  {
                                                                                    itemMonth.commitAmount
                                                                                  }

                                                                                  {this
                                                                                    .state
                                                                                    .iscompareGreen ? (
                                                                                    <span className="sm-tip color-light text-right">
                                                                                      YYYY
                                                                                    </span>
                                                                                  ) : (
                                                                                    ''
                                                                                  )}
                                                                                </div>
                                                                              )}
                                                                            </div>
                                                                          </td>
                                                                        ];
                                                                      }
                                                                    )
                                                                  : ''
                                                              ];
                                                            }
                                                          )
                                                        : ''
                                                    ];
                                                  }
                                                )
                                              ];
                                            }
                                          )
                                        ];
                                      }
                                    )}
                                  {/* {elem.budgetYearRequests.map(
                                  (itemYear, indexYear) => {
                                    console.log(
                                      'itemBud.budgetYearRequests----',
                                      elem,
                                      itemYear.budgetYearRequests
                                    );
                                    return [
                                      <td className="w100">
                                        <div class="radioWrap">
                                          {itemYear.inputBy == 1
                                            ? 'Yearly'
                                            : itemYear.inputBy == 4
                                            ? 'Quaterly'
                                            : itemYear.inputBy == 12
                                            ? 'Monthly'
                                            : ''}
                                        </div>
                                      </td>,

                                      <td className="w100">
                                        {this.state.inputAmountBy ==
                                          'commit_and_pay' ||
                                        this.state.inputAmountBy == 'pay' ? (
                                          <FormGroup className="m-b-3 flex">
                                            <ControlLabel className="labelwd">
                                              Pay
                                            </ControlLabel>
                                            {itemYear.totalPay}
                                          </FormGroup>
                                        ) : (
                                          ''
                                        )}

                                        {this.state.inputAmountBy ==
                                          'commit_and_pay' ||
                                        this.state.inputAmountBy == 'commit' ? (
                                          <FormGroup className="m-b-0 flex">
                                            <ControlLabel className="labelwd">
                                              Commit
                                            </ControlLabel>
                                            {itemYear.totalCommit}
                                          </FormGroup>
                                        ) : (
                                          ''
                                        )}
                                      </td>,

                                      itemYear.yearlyAmount.map(
                                        (itemObj, indexObj) => {
                                          let _this = this;
                                          return [
                                            <td className="b-p-warpper budinput commitpaysec">
                                              <div className="m-b-3 flex align-center comflex">
                                                {_this.state.inputAmountBy ==
                                                  'commit_and_pay' ||
                                                _this.state.inputAmountBy ==
                                                  'pay' ? (
                                                  <div className="td-item">
                                                    {this.state
                                                      .iscompareGreen ? (
                                                      <span className="sm-tip text-left">
                                                        YYYY
                                                      </span>
                                                    ) : (
                                                      ''
                                                    )}

                                                    {itemObj.payAmount}

                                                    {this.state
                                                      .iscompareGreen ? (
                                                      <span className="sm-tip color-light text-right">
                                                        YYYY
                                                      </span>
                                                    ) : (
                                                      ''
                                                    )}
                                                  </div>
                                                ) : (
                                                  ''
                                                )}
                                              </div>

                                              <div className="flex align-center comflex">
                                                {_this.state.inputAmountBy ==
                                                  'commit_and_pay' ||
                                                _this.state.inputAmountBy ==
                                                  'commit' ? (
                                                  <div className="td-item">
                                                    {this.state
                                                      .iscompareGreen ? (
                                                      <span className="sm-tip text-left">
                                                        YYYY
                                                      </span>
                                                    ) : (
                                                      ''
                                                    )}

                                                    {itemObj.commitAmount}
                                                    {this.state
                                                      .iscompareGreen ? (
                                                      <span className="sm-tip color-light text-right">
                                                        YYYY
                                                      </span>
                                                    ) : (
                                                      ''
                                                    )}
                                                  </div>
                                                ) : (
                                                  ''
                                                )}
                                              </div>
                                            </td>,

                                            itemObj.openQauter
                                              ? itemObj.quarterlyAmount.map(
                                                  (itemQauter, indexQauter) => {
                                                    return [
                                                      <td className="b-p-warpper budinput commitpaysec w100">
                                                        <div className="m-b-3 flex align-center comflex">
                                                          {_this.state
                                                            .inputAmountBy ==
                                                            'commit_and_pay' ||
                                                          _this.state
                                                            .inputAmountBy ==
                                                            'pay' ? (
                                                            <div className="td-item">
                                                              {this.state
                                                                .iscompareGreen ? (
                                                                <span className="sm-tip text-left">
                                                                  YYYY
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}

                                                              {
                                                                itemQauter.payAmount
                                                              }

                                                              {this.state
                                                                .iscompareGreen ? (
                                                                <span className="sm-tip color-light text-right">
                                                                  YYYY
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}
                                                            </div>
                                                          ) : (
                                                            ''
                                                          )}
                                                        </div>

                                                        <div className="flex align-center comflex">
                                                          {_this.state
                                                            .inputAmountBy ==
                                                            'commit_and_pay' ||
                                                          _this.state
                                                            .inputAmountBy ==
                                                            'commit' ? (
                                                            <div className="td-item">
                                                              {this.state
                                                                .iscompareGreen ? (
                                                                <span className="sm-tip text-left">
                                                                  YYYY
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}

                                                              {
                                                                itemQauter.commitAmount
                                                              }

                                                              {this.state
                                                                .iscompareGreen ? (
                                                                <span className="sm-tip color-light text-right">
                                                                  YYYY
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}
                                                            </div>
                                                          ) : (
                                                            ''
                                                          )}
                                                        </div>
                                                      </td>,
                                                      itemQauter.openMonth
                                                        ? itemQauter.monthlyAmount.map(
                                                            (
                                                              itemMonth,
                                                              indexMonth
                                                            ) => {
                                                              lastMonth =
                                                                itemMonth.date;
                                                              return [
                                                                <td className="b-p-warpper budinput commitpaysec w100">
                                                                  <div className="m-b-3 flex align-center comflex">
                                                                    {_this.state
                                                                      .inputAmountBy ==
                                                                      'commit_and_pay' ||
                                                                    _this.state
                                                                      .inputAmountBy ==
                                                                      'pay' ? (
                                                                      <div className="td-item">
                                                                        {this
                                                                          .state
                                                                          .iscompareGreen ? (
                                                                          <span className="sm-tip text-left">
                                                                            YYYY
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}

                                                                        {
                                                                          itemMonth.payAmount
                                                                        }
                                                                        {this
                                                                          .state
                                                                          .iscompareGreen ? (
                                                                          <span className="sm-tip color-light text-right">
                                                                            YYYY
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}
                                                                      </div>
                                                                    ) : (
                                                                      ''
                                                                    )}
                                                                  </div>

                                                                  <div className="flex align-center comflex">
                                                                    {_this.state
                                                                      .inputAmountBy ==
                                                                      'commit_and_pay' ||
                                                                    _this.state
                                                                      .inputAmountBy ==
                                                                      'commit' ? (
                                                                      <div className="td-item">
                                                                        {this
                                                                          .state
                                                                          .iscompareGreen ? (
                                                                          <span className="sm-tip text-left">
                                                                            YYYY
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}

                                                                        {
                                                                          itemMonth.commitAmount
                                                                        }

                                                                        {this
                                                                          .state
                                                                          .iscompareGreen ? (
                                                                          <span className="sm-tip color-light text-right">
                                                                            YYYY
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}
                                                                      </div>
                                                                    ) : (
                                                                      ''
                                                                    )}
                                                                  </div>
                                                                </td>
                                                              ];
                                                            }
                                                          )
                                                        : ''
                                                    ];
                                                  }
                                                )
                                              : ''
                                          ];
                                        }
                                      )
                                    ];
                                  }
                                )} */}
                                  {this.state.displayedColumns[10].isShow ? (
                                    <td className="w100">
                                      <ul className="list-style-none p-0 limtb5">
                                        <li>
                                          {' '}
                                          {
                                            this.props.userInfo.userData
                                              .fullname
                                          }
                                        </li>
                                        <li>
                                          {elem.intitialApproverBy &&
                                            elem.intitialApproverBy.firstName +
                                              ' ' +
                                              elem.intitialApproverBy.lastName}
                                        </li>
                                      </ul>
                                    </td>
                                  ) : (
                                    ''
                                  )}
                                  {this.state.displayedColumns[11].isShow ? (
                                    <td className="w100">
                                      <ul className="list-style-none p-0 limtb5">
                                        {elem.listOfApprovers &&
                                          elem.listOfApprovers.map(
                                            (item, index) => {
                                              let className = '';
                                              if (
                                                item.approvalStatus ==
                                                'waiting_for_approval'
                                              ) {
                                                className = 'greyclr';
                                              } else if (
                                                item.approvalStatus ==
                                                'declined'
                                              ) {
                                                className = 'redclr';
                                              } else if (
                                                item.approvalStatus ==
                                                'approved'
                                              ) {
                                                className = 'greenclr';
                                              } else if (
                                                item.approvalStatus ==
                                                'send_back'
                                              ) {
                                                className = 'yellowclr';
                                              }
                                              return (
                                                <li className={className}>
                                                  {item &&
                                                  item['approver'] &&
                                                  item['approver'].name
                                                    ? item['approver'].name
                                                    : item['approver']
                                                        .firstName +
                                                      ' ' +
                                                      item['approver']
                                                        .lastName}{' '}
                                                </li>
                                              );
                                            }
                                          )}
                                      </ul>
                                    </td>
                                  ) : (
                                    ''
                                  )}
                                  {this.state.displayedColumns[12].isShow ? (
                                    <td className="w100">
                                      <ul className="list-style-none p-0 limtb5">
                                        {elem.listOfApprovers &&
                                          elem.listOfApprovers.map(
                                            (item, index) => {
                                              return (
                                                <li className="greyclr">
                                                  {item &&
                                                  item['approver'] &&
                                                  item['approver'].name
                                                    ? item['approver'].name
                                                    : item['approver']
                                                        .firstName +
                                                      ' ' +
                                                      item['approver'].lastName}
                                                </li>
                                              );
                                            }
                                          )}
                                      </ul>
                                    </td>
                                  ) : (
                                    ''
                                  )}
                                  {this.state.displayedColumns[13].isShow ? (
                                    <td className="w100">
                                      {removeUnderScore(elem.budgetItemStatus)}
                                    </td>
                                  ) : (
                                    ''
                                  )}
                                  <td>
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
                      ) : this.state.noRecordImage &&
                        this.state.ListOfBudget.length == 0 ? (
                        <tbody>
                          <tr>
                            <div className="noRecord">
                              <img src={noRecord} />
                            </div>
                          </tr>
                        </tbody>
                      ) : (
                        ''
                      )}
                    </Table>
                  </div>
                </div>
                {this.state.ListOfBudget && this.state.ListOfBudget.length ? (
                  <div className="text-center m-b-20 m-t-20">
                    <button
                      to="home"
                      className="btn btn-default text-uppercase"
                    >
                      Export Pdf
                    </button>
                    <button
                      to="home"
                      className="btn btn-default text-uppercase"
                    >
                      Print Review
                    </button>
                  </div>
                ) : (
                  ''
                )}

                {this.state.ListOfBudget &&
                this.state.ListOfBudget.length > 0 ? (
                  <div className="revision-area">
                    <div className="flex">
                      <div className="top-col"> </div>

                      {_this.state.approversLenghtAr &&
                        _this.state.approversLenghtArr.map((elem, catIndex) => {
                          return (
                            <div className="top-col">
                              <span className="user-add">
                                Approval {catIndex + 1}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                    {/* {_this.state.approversLenghtArr &&
                      _this.state.approversLenghtArr.map((elem, catIndex) => {
                        return (
                          <div className="flex">
                            <div className="top-col"> </div>
                            <div className="top-col">
                              <span className="user-add">
                                Approvers {catIndex + 1}
                              </span>
                            </div>
                          </div>
                        );
                      })} */}
                    {this.state.ListOfBudget.map((elem, catIndex) => {
                      return (
                        <div className="r-drop-panel">
                          <Panel id="collapsible-panel-example-2">
                            <Panel.Heading>
                              <Panel.Title toggle>
                                {elem.budgetItemNo}{' '}
                                <Glyphicon glyph="chevron-down" />
                              </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                              <Panel.Body>
                                <div className="flex">
                                  {elem.listOfApprovers &&
                                    elem.listOfApprovers.map((item, index) => {
                                      return (
                                        <div
                                          className="top-col r-breif contentleft"
                                          key={index}
                                        >
                                          <h5 className="m-b-0">
                                            {item.approver.firstName +
                                              ' ' +
                                              item.approver.lastName}
                                          </h5>
                                          <small className="color-light">
                                            {' '}
                                            {removeUnderScore(
                                              item.approver.userProfile
                                            )}
                                          </small>
                                          <h5 class="datesm">
                                            {elem.lastModifiedTimestamp
                                              ? moment(
                                                  elem.lastModifiedTimestamp
                                                ).format('DD MMM YYYY hh:mm a')
                                              : ''}
                                          </h5>
                                          {item &&
                                          item.comments &&
                                          item.comments !== undefined &&
                                          item.comments[0] &&
                                          item.comments[0].comment ? (
                                            <p>
                                              Comments:{' '}
                                              <span className="m-l-5">
                                                {item.comments[0].comment}
                                              </span>
                                            </p>
                                          ) : (
                                            <p>
                                              Comments:
                                              <span className="m-l-5">NA</span>
                                            </p>
                                          )}
                                          {item.approver &&
                                          ((this.props.userInfo.userData.id ==
                                            item.approver.id &&
                                            elem.comments === undefined &&
                                            item.approvalStatus ===
                                              'waiting_for_approval') ||
                                            item.approvalStatus ===
                                              'send_back') ? (
                                            <div>
                                              <p>
                                                <FormGroup controlId="formControlsTextarea">
                                                  <FormControl
                                                    className="resizenone"
                                                    componentClass="textarea"
                                                    placeholder="Comment"
                                                    value={elem.comment}
                                                    onChange={event => {
                                                      this.handleChange(
                                                        event,
                                                        catIndex
                                                      );
                                                    }}
                                                    name="comment"
                                                    required
                                                  />
                                                </FormGroup>
                                              </p>
                                              <div className="flex">
                                                <span
                                                  className="ico-action-sm fill-green"
                                                  onClick={() => {
                                                    this.revisionApprove(
                                                      'approved',
                                                      item.levelOfApproval,
                                                      elem
                                                        .budgetRevisionResponse
                                                        .id,
                                                      catIndex
                                                    );
                                                  }}
                                                >
                                                  <svg>
                                                    <use
                                                      xlinkHref={`${Sprite}#rightCircleIco`}
                                                    />
                                                  </svg>
                                                </span>
                                                <span
                                                  className="ico-action-sm fill-red m-l-5"
                                                  onClick={() => {
                                                    this.revisionApprove(
                                                      'reject',
                                                      item.levelOfApproval,
                                                      item
                                                        .budgetRevisionResponse
                                                        .id,
                                                      catIndex
                                                    );
                                                  }}
                                                >
                                                  <svg>
                                                    <use
                                                      xlinkHref={`${Sprite}#rejectIco`}
                                                    />
                                                  </svg>
                                                </span>
                                                <span
                                                  className="ico-action-sm fill-orange m-l-5"
                                                  onClick={() => {
                                                    this.revisionApprove(
                                                      'send_back',
                                                      item.levelOfApproval,
                                                      item
                                                        .budgetRevisionResponse
                                                        .id,
                                                      catIndex
                                                    );
                                                  }}
                                                >
                                                  <svg>
                                                    <use
                                                      xlinkHref={`${Sprite}#refresh1Ico`}
                                                    />
                                                  </svg>
                                                </span>
                                              </div>
                                            </div>
                                          ) : (
                                            ''
                                          )}
                                          {item.approvalStatus ===
                                          'approved' ? (
                                            <div>
                                              <div className="flex">
                                                <span className="ico-action-sm fill-green">
                                                  <svg>
                                                    <use
                                                      xlinkHref={`${Sprite}#rightCircleIco`}
                                                    />
                                                  </svg>
                                                </span>
                                              </div>
                                            </div>
                                          ) : (
                                            ''
                                          )}
                                        </div>
                                      );
                                    })}
                                </div>
                              </Panel.Body>
                            </Panel.Collapse>
                          </Panel>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
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
      actionUploadBudgetDocumentse,
      actionGetBudgetData,
      actionGetBudgetExtraData,
      actionSetBudgetApprovalData
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
)(budget2);
