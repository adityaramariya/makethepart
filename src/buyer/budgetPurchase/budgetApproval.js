import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as moment from 'moment';
import {
  Modal,
  Panel,
  Table,
  FormControl,
  FormGroup,
  DropdownButton,
  Glyphicon,
  ControlLabel, Row,
  Col
} from 'react-bootstrap';
import Sprite from '../../img/sprite.svg';
import noRecord from '../../img/no_record.png';
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
  actionUploadBudgetDocumentse,
  actionGetBudgetData,
  actionGetBudgetExtraData,
  actionSetBudgetApprovalData
} from '../../common/core/redux/actions';
import ReactToPrint from 'react-to-print';
import { showErrorToast, removeUnderScore } from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
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
      inputAmountBy: 'commit_and_pay',
      displayedColumns: [
        {
          label: 'Budget Item',
          key: 'budgetItemNo',
          isShow: true,
          disabled: true
        },
        { label: 'Account', key: 'accountNo', isShow: true, disabled: true },
        { label: 'Currency', key: 'currency', isShow: false },
        { label: 'Total', key: 'Total', isShow: false },
        { label: 'Spending Category', key: 'Spending Category', isShow: false },
        { label: 'Cost Center', key: 'Cost Center', isShow: false },
        {
          label: 'INPUT BY INTIAL APPROVAL BY',
          key: 'INPUT BY INTIAL APPROVAL BY',
          isShow: false
        },
        {
          label: 'APPROVERS',
          key: 'APPROVERS',
          isShow: false,
          disabled: false
        },
        {
          label: 'PARTIAL APPROVERS',
          key: 'PARTIAL APPROVERS',
          isShow: false,
          disabled: false
        },
        { label: 'STATUS', key: 'budgetItemStatus', isShow: false }
        // { label: 'ITEM REVISION', key: 'itemRevisionNo', isShow: false },
      ],
      show: false,
      tableNo: 0,
      showHeading: []
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.openQuarterlyShowHideCollapse = this.openQuarterlyShowHideCollapse.bind(
      this
    );
    this.openMonthlyShowHideCollapse = this.openMonthlyShowHideCollapse.bind(
      this
    );
    this.handleChange = this.handleChange.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleCommentsClose = this.handleCommentsClose.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
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
          listOfAddress: purchaseResponse.listOfAddress

          // listOfForecast: purchaseResponse.listOfMainCategory,
          // listOfRevision: purchaseResponse.listOfMainCategory,
          // listOfFY: purchaseResponse.listOfMainCategory
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
        console.log('ListOfBudget-----------------', result.payload.data);

        if (result.payload.data.status == 200) {
          let purchaseResponse =
            result.payload.data.resourceData.budgetDetailResponse;
          this.setState({
            ListOfBudget: purchaseResponse,
            noRecordImage: false
          });
        } else {
          this.setState({
            noRecordImage: true,
            ListOfBudget: []
          });
        }

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    // this.props
    //   .actionGetBudgetExtraData(data)
    //   .then((result, error) => {
    //     console.log('resourceData-----------------', result);
    //     let resourceData =
    //       result.payload.data.resourceData.budgetDetailResponse;
    //     console.log('resourceData-----------------', resourceData);
    //     resourceData &&
    //       resourceData.forEach(function(element, index) {
    //         approversLenght =
    //           approversLenght > element.listOfApprovers.length
    //             ? approversLenght
    //             : element.listOfApprovers.length;
    //         console.log(
    //           'approversLenghtAr-----------------',
    //           approversLenght,
    //           element.listOfApprovers.length
    //         );

    //         approversLenghtArr =
    //           approversLenghtArr.length > element.listOfApprovers.length
    //             ? approversLenghtArr
    //             : element.listOfApprovers;
    //         console.log(
    //           'approversLenghtAr-----------------',
    //           approversLenghtArr,
    //           element.listOfApprovers.length
    //         );
    //       });

    //     let financialBudgetResponse =
    //       result.payload.data.resourceData.financialBudgetResponse;

    //     if (result.payload.data.status == 200) {
    //       let date = financialBudgetResponse.dateOfFinancialYear
    //         ? financialBudgetResponse.dateOfFinancialYear
    //         : moment().format('DD/MM/YYYY');
    //       let cloneBudgetFromList =
    //         result.payload.data.resourceData.cloneBudgetFromList;
    //        let listOfRedComparision =
    //          result.payload.data.resourceData.listOfRedComparision;
    //       let listOfBlueComparision =
    //         result.payload.data.resourceData.listOfBlueComparision;

    //        let listOfForecastYears =
    //        result.payload.data.resourceData.listOfForecastYears;
    //       let listOfForecasts =
    //         result.payload.data.resourceData.listOfForecasts;

    //         let listOfRevisions =
    //         result.payload.data.resourceData.listOfRevisions;

    //       _this.setState({
    //         ListOfBudget: resourceData,
    //         dateOfFinancialYear: date,
    //         financialBudgetId: financialBudgetResponse.id,
    //          cloneBudgetFromList: cloneBudgetFromList,
    //          listOfRedComparision: listOfRedComparision,
    //          listOfBlueComparision: listOfBlueComparision,
    //          listOfForecastYears: listOfForecastYears,
    //          listOfForecasts: listOfForecasts,
    //          listOfRevisions: listOfRevisions,
    //         noRecordImage: true,
    //         approversLenght: approversLenght,
    //         approversLenghtArr: approversLenghtArr
    //       });
    //     }
    //     _this.props.actionLoaderHide();
    //   })
    //   .catch(e => _this.props.actionLoaderHide());
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

    if (!categoryData.budgetItemNumber) {
      let createdAccountNo =
        'RJ' + moment().format('MMYYYYDD') + moment().format('sshhmm');
      if (
        categoryData.mainCategoryId &&
        categoryData.spendCategoryId &&
        categoryData.departmentId &&
        categoryData.subCategoryId
      ) {
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

  revisionApprove(keyword, levelOfApproval, commentRevisionId, catIndex, type) {
    console.log('revisionApprove send_back', keyword, type);
    let _this = this;
    let status = '';
    let ListOfBudget = this.state.ListOfBudget;
    // if(keyword == 'send_back' && type == undefined){
    //   console.log("revisionApprove send_back",);
    //   this.setState({
    //     showComments: true,
    //     keyword:keyword,
    //     levelOfApproval:levelOfApproval,
    //     commentRevisionId:commentRevisionId,
    //     catIndex:catIndex
    //   });
    // }
    if (ListOfBudget[catIndex].comment) {
      let data = {
        userId: this.props.userInfo.userData.id,
        roleId: this.props.userInfo.userData.userRole,
        approvalStatus: keyword,
        levelOfApproval: levelOfApproval,
        comment: ListOfBudget[catIndex].comment,
        id: commentRevisionId
      };

      this.props
        .actionSetBudgetApprovalData(data)
        .then((result, error) => {
          if (result.payload.data.status == 200) {
            _this.props
              .actionGetBudgetData(data)
              .then((result, error) => {
                let purchaseResponse =
                  result.payload.data.resourceData.budgetDetailResponse;
                _this.setState({
                  ListOfBudget: purchaseResponse
                });
                _this.props.actionLoaderHide();
              })
              .catch(e => _this.props.actionLoaderHide());
          }

          this.setState({ comment: '' });
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      showErrorToast(validationMessages.buildPlanECO.commentError);
      return false;
    }
    this.setState({ showComments: false });
  }
  handleShow() {
    this.setState({ show: true });
  }
  handleClose() {
    this.setState({ show: false });
  }
  handleCommentsClose() {
    this.setState({ showComments: false });
  }

  exportExecle(event) {
    var htmltable = document.getElementById('excel-download');
    var html = htmltable.outerHTML;
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
    event.preventDefault();
  }

  handleSort(key) {
    let arrayCopy = [...this.state.ListOfBudget];
    arrayCopy.sort(this.compareBy(key));
    this.setState({ ListOfBudget: arrayCopy });
  }
  compareBy(key) {
    return function(a, b) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    };
  }

  handleOnchangeRevision(
    keyword,
    levelOfApproval,
    commentRevisionId,
    catIndex
  ) {
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

      this.props
        .actionSetBudgetApprovalData(data)
        .then((result, error) => {
          if (result.payload.data.status == 200) {
            _this.props
              .actionGetBudgetData(data)
              .then((result, error) => {
                let purchaseResponse =
                  result.payload.data.resourceData.budgetDetailResponse;
                _this.setState({
                  ListOfBudget: purchaseResponse
                });
                _this.props.actionLoaderHide();
              })
              .catch(e => _this.props.actionLoaderHide());
          }

          this.setState({ comment: '' });
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      showErrorToast(validationMessages.buildPlanECO.commentError);
      return false;
    }
  }
  imageShow = (partId, partMediaResponse, partNumber, partIndex) => {
    this.setState({
      showImage: true,
      partIdforMedia: partId,
      partNumberforMedia: partNumber,
      partMediaResponses: partMediaResponse
    });
  };
  handleCloseModal() {
    this.setState({ showImage: !this.state.showImage });
  }

  render() {
    let lastMonth = moment().format('DD/MM/YYYY');
    let lastMonth1 = '';
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

           <div className="createbugetRev m-b-30">
            <h4 className="hero-title">Create Budget Revision</h4>
            <div className="border-around border-light p-30">
                <div className="revApproval">
                    <Row>
                      <Col md={5}>
                        <FormGroup>
                          <ControlLabel className="labelGrey">Last Approved Revision</ControlLabel>
                          <FormControl
                            type="text"
                            className="br-0"
                            name="lastApprovedRevision"
                            value={this.state.lastApprovedRevision}
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                      <Col md={2}/>
                      <Col md={5}>
                        <FormGroup>
                          <ControlLabel className="labelGrey">Active Budget Revision</ControlLabel>
                          <FormControl
                            type="text"
                            className="br-0"
                            name="activeBudgetRevision"
                            value={this.state.activeBudgetRevision}
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                        <div className="text-center m-b-20 m-t-20">
                          <button
                            onClick={this.handleShow}
                            className="btn btn-primary text-uppercase"
                          >
                            Freeze and Revise
                          </button>
                          <button
                            onClick={event => {
                              this.handleSaveBudget(event);
                            }}
                            className="btn btn-info text-uppercase"
                          >
                          Approve
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </div>
     
             

                <div className="activeformRev">
                   <h4 className="smheading">Active New Revision  </h4>
               
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <ControlLabel className="labelGrey">Revision</ControlLabel>
                          <FormControl
                            type="text"
                            className="br-0"
                            name="revision"
                            value={this.state.revision}
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>

                      <Col md={4}>
                        <FormGroup  controlId="formControlsSelect">
                          <ControlLabel className="labelGrey">
                          Forecaste 
                          </ControlLabel>
                          <FormControl
                            componentClass="select"
                            className="br-0 s-arrow"
                            value={this.state.year}
                            name="year"
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                            onBlur={this.activateValidation}
                          >
                            <option value="select">select</option>
                            <option value="newProductDevelopment">
                              New Product Development
                            </option>
                            <option value="production">Production</option>
                          </FormControl>
                          {/* {renderMessage(
                            this.props.getValidationMessages('ecoCategory')
                          )} */}
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className=" ">
                          <ControlLabel className="labelGrey">Year</ControlLabel>
                          <FormControl
                            type="text"
                            className="br-0"
                            name="forecaste"
                            value={this.state.forecaste}
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="text-center m-b-20 m-t-20">
                      <button
                        onClick={this.handleShow}
                        className="btn btn-success text-uppercase"
                      >
                      Cancel
                      </button>
                      <button
                        onClick={event => {
                          this.handleSaveBudget(event);
                        }}
                        // disabled={
                        //   this.state.ListOfBudget &&
                        //   this.state.ListOfBudget.length > 0
                        //     ? false
                        //     : true
                        // }
                        className="btn btn-default text-uppercase"
                      >
                        Create Revision
                      </button>
                    </div>
                 
                </div>
              </div>
             </div>  



              <div>
                <h4 class="hero-title">Review Budget Plan</h4>
                <div className="bugetHeadWrap">
                  <div className="budgetHeadrgt">
                    {this.state.iscompareBlue ? (
                      <FormGroup controlId="formControlsSelect">
                        <FormControl
                          componentClass="select"
                          className="s-arrow br-0 redclr"
                          name="department"
                        >
                          <option value="select">
                            Select Revision X Forecast FY2018-19
                          </option>
                          <option>Revision X</option>
                        </FormControl>
                      </FormGroup>
                    ) : (
                      ''
                    )}
                    {this.state.iscompareRed ? (
                      <FormGroup controlId="formControlsSelect">
                        <FormControl
                          componentClass="select"
                          className="s-arrow br-0 blueclr"
                          // value={this.state.selectedProjectId}
                          name="department"
                        >
                          <option value="select">
                            Select Revision X Forecast FY2018-19
                          </option>
                          <option>Sales</option>
                        </FormControl>
                      </FormGroup>
                    ) : (
                      ''
                    )}
                  </div>

                  <div className="flex">
                    <div className="custom-dd dropRf">
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

                    <FormGroup className="p-5" controlId="formControlsSelect2">
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

                    <FormGroup className="p-5" controlId="formControlsSelect2">
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

                    <FormGroup className="p-5" controlId="formControlsSelect2">
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
               </div> 

                <div>
                  <div className="table-responsive">
                    <Table
                      id="excel-download"
                      bordered
                      condensed
                      className="custom-table inputform90 createBugetwrap print-table inputbdNone borderbox"
                    >
                      <thead>
                        <tr className="budgetThcenter">
                        <th rowspan="2" className="b-right w30"> 
                         <input
                                      type="checkbox"
                                      className="checkbox"
                                      value='all'
                                      checked={this.state.isSelected ? true : false}
                                      name="isSelected"
                                      onChange={event => {
                                        this.headingChange(event);
                                      }}
                                    /> 
                                    </th>
                          <th colspan="3" scope="colgroup" className="b-right">
                            {' '}
                            Budget Item
                          </th>
                          <th rowspan="2" className="b-right">
                            Account Number
                          </th>
                          {this.state.displayedColumns &&
                          this.state.displayedColumns[2].isShow ? (
                            <th rowspan="2" className="b-right">
                              Currency
                            </th>
                          ) : (
                            ''
                          )}
                          {this.state.displayedColumns &&
                          this.state.displayedColumns[3].isShow ? (
                            <th
                              colspan="3"
                              scope="colgroup"
                              className="b-right"
                            >
                              Total{' '}
                            </th>
                          ) : (
                            ''
                          )}
                          {this.state.displayedColumns &&
                          this.state.displayedColumns[4].isShow ? (
                            <th rowspan="2" className="b-right">
                              Spend Category
                            </th>
                          ) : (
                            ''
                          )}
                          {this.state.displayedColumns &&
                          this.state.displayedColumns[5].isShow ? (
                            <th rowspan="2" className="b-right">
                              Cost Center
                            </th>
                          ) : (
                            ''
                          )}
                          {this.state.displayedColumns &&
                          this.state.displayedColumns[6].isShow ? (
                            <th rowspan="2" className="b-right">
                              Input by:{' '}
                              <p className="m-t-10">Intial Approval by: </p>
                            </th>
                          ) : (
                            ''
                          )}
                          {this.state.displayedColumns &&
                          this.state.displayedColumns[7].isShow ? (
                            <th
                              colspan="2"
                              scope="colgroup"
                              className="b-right"
                            >
                              Approvers
                            </th>
                          ) : (
                            ''
                          )}
                          {this.state.displayedColumns &&
                          this.state.displayedColumns[8].isShow ? (
                            <th
                              colspan="2"
                              scope="colgroup"
                              className="b-right"
                            >
                              Partial Approval
                            </th>
                          ) : (
                            ''
                          )}
                          {this.state.displayedColumns &&
                          this.state.displayedColumns[9].isShow ? (
                            <th rowspan="2" className="b-right">
                              Status{' '}
                            </th>
                          ) : (
                            ''
                          )}
                          {this.state.ListOfBudget &&
                            this.state.ListOfBudget[0] &&
                            this.state.ListOfBudget[0].budgetYearRequests &&
                            this.state.ListOfBudget[0].budgetYearRequests.map(
                              (itemYear, indexYear) => {
                                return [
                                  // <th>Input by </th>,
                                  itemYear.yearlyAmount.map(
                                    (itemObj, indexObj) => {
                                      lastMonth1 = moment(
                                        itemObj.date,
                                        'DD/MM/YYYY'
                                      )
                                        .add(1, 'years')
                                        .format('DD/MM/YYYY');
                                      return [
                                        <th rowspan="2" className="b-right">
                                          <p className="m-b-0">
                                            {!itemObj.openQauter ? (
                                              <span
                                                className="ico-add blIcon clrblue"
                                                onClick={event => {
                                                  this.openQuarterlyShowHideCollapse(
                                                    event,
                                                    'YEAR',
                                                    true,
                                                    0,
                                                    indexYear,
                                                    indexObj
                                                  );
                                                }}
                                              >
                                                <svg>
                                                  <use
                                                    xlinkHref={`${Sprite}#addIco`}
                                                  />
                                                </svg>
                                              </span>
                                            ) : (
                                              <span
                                                class="ico-add blIcon clrblue"
                                                onClick={event => {
                                                  this.openQuarterlyShowHideCollapse(
                                                    event,
                                                    'YEAR',
                                                    false,
                                                    0,
                                                    indexYear,
                                                    indexObj
                                                  );
                                                }}
                                              >
                                                <p className="display-none">
                                                  g
                                                </p>
                                                <svg>
                                                  <use
                                                    xlinkHref={`${Sprite}#lessIco`}
                                                  />
                                                </svg>
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
                                                  <th
                                                    rowspan="2"
                                                    className="b-right"
                                                  >
                                                    <p className="m-t-15 m-b-0">
                                                      {!itemQauter.openMonth ? (
                                                        <span
                                                          className="ico-add blIcon clrblue"
                                                          onClick={event => {
                                                            this.openQuarterlyShowHideCollapse(
                                                              event,
                                                              'QAUTER',
                                                              true,
                                                              0,
                                                              indexYear,
                                                              indexObj,
                                                              indexQauter
                                                            );
                                                          }}
                                                        >
                                                          <svg>
                                                            <use
                                                              xlinkHref={`${Sprite}#addIco`}
                                                            />
                                                          </svg>
                                                        </span>
                                                      ) : (
                                                        <span
                                                          class="ico-add blIcon clrblue"
                                                          onClick={event => {
                                                            this.openQuarterlyShowHideCollapse(
                                                              event,
                                                              'QAUTER',
                                                              false,
                                                              0,
                                                              indexYear,
                                                              indexObj,
                                                              indexQauter
                                                            );
                                                          }}
                                                        >
                                                          {' '}
                                                          <svg>
                                                            <use
                                                              xlinkHref={`${Sprite}#lessIco`}
                                                            />
                                                          </svg>
                                                        </span>
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
                                                            <th
                                                              rowspan="2"
                                                              className="b-right"
                                                            >
                                                              <p className="m-t-30 m-b-0">
                                                                {this.state
                                                                  .quarterly ===
                                                                'hideData' ? (
                                                                  <span
                                                                    className="ico-add blIcon clrblue"
                                                                    onClick={
                                                                      this
                                                                        .openQuarterlyShowHideCollapse
                                                                    }
                                                                  >
                                                                    <svg>
                                                                      <use
                                                                        xlinkHref={`${Sprite}#addIco`}
                                                                      />
                                                                    </svg>
                                                                  </span>
                                                                ) : (
                                                                  <span
                                                                    class="ico-add blIcon clrblue"
                                                                    onClick={
                                                                      this
                                                                        .openQuarterlyShowHideCollapse
                                                                    }
                                                                  >
                                                                    <svg>
                                                                      <use
                                                                        xlinkHref={`${Sprite}#lessIco`}
                                                                      />
                                                                    </svg>
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
                            )}
                          <th rowspan="2" className="b-right">
                            Document
                          </th>
                        </tr>

                        <tr>
                          <th scope="col" className="b-right">
                            ITEM NUMBER{' '}
                          </th>
                          <th scope="col" className="b-right">
                            ITEM REVISION
                          </th>
                          <th scope="col" className="b-right">
                            BUDGET ITEM DESCRIPTION
                          </th>
                          {this.state.displayedColumns &&
                          this.state.displayedColumns[3].isShow
                            ? [
                                <th scope="col" className="b-right">
                                  TARGET
                                </th>,
                                <th scope="col" className="b-right">
                                  PAY
                                </th>,
                                <th scope="col" className="b-right">
                                  COMMIT
                                </th>
                              ]
                            : ''}
                          {this.state.displayedColumns &&
                          this.state.displayedColumns[7].isShow
                            ? [
                                <th scope="col" className="b-right">
                                  Approver Name
                                </th>,
                                <th scope="col" className="b-right">
                                  Comments
                                </th>
                              ]
                            : ''}
                          {this.state.displayedColumns &&
                          this.state.displayedColumns[8].isShow
                            ? [
                                <th scope="col" className="b-right">
                                  PAY
                                </th>,
                                <th scope="col" className="b-right">
                                  COMMIT
                                </th>
                              ]
                            : ''}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.ListOfBudget &&
                          this.state.ListOfBudget.length > 0 &&
                          this.state.ListOfBudget.map((elem, catIndex) => {
                            return (
                              <tr>
                                  <td>
                                  <label className="label--checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox"
                                      value={catIndex}
                                      checked={elem.isSelected ? true : false}
                                      name="isSelected"
                                      onChange={event => {
                                        this.handleAction(event, catIndex,elem.id);
                                      }}
                                    />
                                  </label>
                                </td>
                                <td>
                                  <p className="txtview">{elem.budgetItemNo}</p>
                                </td>

                                <td>
                                  <p className="txtview">
                                    {elem.itemRevisionNo}
                                  </p>
                                </td>

                                <td className="w-200 tooltipCustom">
                                {elem.description && elem.description.length >100?(
                                <span class="tooltiptext">{elem.description}</span>):''}
                                {elem.description}</td>
                                <td>
                                  <p className="txtview">{elem.accountNo}</p>
                                </td>

                                {/* <td
                                  className={
                                    elem.purchaseDescription
                                      ? 'w-200 tooltipCustom'
                                      : 'w-200'
                                  }
                                >
                                  {elem.purchaseDescription ? (
                                    <div className="toolwrap">
                                      <span class="tooltiptext">
                                        {elem.purchaseDescription}
                                      </span>
                                    </div>
                                  ) : (
                                    ''
                                  )}

                                  <FormControl
                                    className="s-arrow br-0"
                                    componentClass="select"
                                    placeholder="select"
                                    value={elem.accountNo}
                                    name="accountDetails"
                                    onChange={event => {
                                      this.handleChangeAccount(event, catIndex);
                                    }}
                                  >
                                    <option value="">Select Account</option>
                                    {this.state.listOfAccountDetails &&
                                      this.state.listOfAccountDetails.map(
                                        (item, indexAcc) => {
                                          console.log(
                                            'item--6456456456--',
                                            item,
                                            item.accountNo,
                                            indexAcc
                                          );
                                          return (
                                            <option
                                              value={item.accountNo}
                                              data-index={indexAcc}
                                            >
                                              {item.description}
                                            </option>
                                          );
                                        }
                                      )}
                                  </FormControl>
                                </td> */}

                                {this.state.displayedColumns &&
                                this.state.displayedColumns[2].isShow ? (
                                  <td className="w-100">{elem.currency}</td>
                                ) : (
                                  ''
                                )}

                                {/* <td>
                                  <FormGroup className="m-b-0 flex">
                                    <FormControl
                                      type="text"
                                      name="purchaseDescription"
                                      value={elem.purchaseDescription}
                                      placeholder="Description 1"
                                      className="br-0"
                                      onChange={event => {
                                        this.handleChange(event, catIndex);
                                      }}
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td> */}

                                {this.state.displayedColumns &&
                                this.state.displayedColumns[3].isShow
                                  ? [
                                      <td className="w-60">
                                        {elem.totalBudget}
                                      </td>,

                                      <td className="w-60">
                                        {elem.totalPayAmount}
                                      </td>,

                                      <td className="w-60">
                                        {elem.totalCommitAmount}
                                      </td>
                                    ]
                                  : ''}
                                {this.state.displayedColumns &&
                                this.state.displayedColumns[4].isShow
                                  ? [
                                      <td className="w-120">
                                        <ul className="spendcatTxt list-style-none p0 text-left">
                                          <li>{elem.majorCategoryName}</li>
                                          <li className="p-l-5">
                                            {elem.categoryName}
                                          </li>
                                          <li className="p-l-8">
                                            {' '}
                                            {elem.subCategoryName}
                                          </li>
                                          <li className="p-l-10">
                                            {elem.subSubCategoryName}
                                          </li>
                                        </ul>
                                      </td>
                                    ]
                                  : ''}
                                {/* ) : (
                                    ''
                                  )}{' '}
                                  {this.state.displayedColumns[6].isShow ? ( */}
                                {this.state.displayedColumns &&
                                this.state.displayedColumns[5].isShow
                                  ? [
                                      <td className="w-200">
                                        <ul className="spendcatTxt list-style-none p0 text-left">
                                          <li>
                                            {elem.globalRegionName}/{' '}
                                            {elem.globalSubRegionName}/{' '}
                                            {elem.countryName}/
                                            {elem.localBussinessRegion}/
                                            {elem.localBussinessRegion}/{' '}
                                            {elem.district}/ {elem.circle}/
                                            {elem.area}
                                          </li>
                                          <li>
                                            {elem.sectorName}/{' '}
                                            {elem.modelFamilyName}/{' '}
                                            {elem.productLineName}/
                                            {elem.programName}
                                          </li>
                                          <li>
                                            {elem.brandName}/{elem.subBrandName}
                                          </li>
                                          <li>
                                            {elem.departmentName}/
                                            {elem.subDepartmentName}/{' '}
                                            {elem.teamName}
                                          </li>
                                        </ul>
                                      </td>
                                    ]
                                  : ''}
                                {/* ) : (
                                    ''
                                  )} */}

                                {/* Start:- new td added as a region */}

                                {
                                  /* <td className="bugettbfl">
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      Region&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.globalRegionName}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      Sub Region&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.globalSubRegionName}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      Country&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.countryName}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      Zone&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.localBussinessRegion}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      District&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.district}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      Circle&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.circle}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      Area&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.area}
                                    </span>
                                  </div>
                                </td>

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
                                </td> */
                                  // <td>
                                  //   {this.state.inputAmountBy ==
                                  //     'commit_and_pay' ||
                                  //   this.state.inputAmountBy == 'pay' ? (
                                  //     <FormGroup className="m-b-3 flex">
                                  //       <ControlLabel className="labelwd">
                                  //         Pay
                                  //       </ControlLabel>
                                  //       <FormControl
                                  //         type="text"
                                  //         className="br-0 inputh30"
                                  //         name="totalPayAmount"
                                  //         placeholder="Total Pay"
                                  //         value={itemYear.totalPayAmount}
                                  //       />
                                  //       <FormControl.Feedback />
                                  //     </FormGroup>
                                  //   ) : (
                                  //     ''
                                  //   )}
                                  //   {this.state.inputAmountBy ==
                                  //     'commit_and_pay' ||
                                  //   this.state.inputAmountBy == 'commit' ? (
                                  //     <FormGroup className="m-b-0 flex">
                                  //       <ControlLabel className="labelwd">
                                  //         Commit
                                  //       </ControlLabel>
                                  //       <FormControl
                                  //         type="text"
                                  //         className="br-0 inputh30"
                                  //         name="totalCommitAmount"
                                  //         placeholder="Total Commit"
                                  //         value={itemYear.totalCommitAmount}
                                  //       />
                                  //       <FormControl.Feedback />
                                  //     </FormGroup>
                                  //   ) : (
                                  //     ''
                                  //   )}
                                  // </td>,
                                }

                                {/* End: new td added as a region */}

                                {this.state.displayedColumns &&
                                this.state.displayedColumns[6].isShow ? (
                                  <td className="inputapprove buyad w-120">
                                    <ul className="list-style-none p-0 limtb5 word-break">
                                      <li>
                                        {' '}
                                        {this.props.userInfo.userData.fullname}
                                      </li>
                                      <li>
                                        {elem.initialApprovalBy &&
                                          elem.initialApprovalBy.firstName +
                                            ' ' +
                                            elem.initialApprovalBy.lastName}
                                      </li>
                                    </ul>
                                  </td>
                                ) : (
                                  ''
                                )}
                                {this.state.displayedColumns &&
                                this.state.displayedColumns[7].isShow
                                  ? [
                                      <td>
                                        {elem.listOfApprovers &&
                                        elem.listOfApprovers.length > 0
                                          ? elem.listOfApprovers &&
                                            elem.listOfApprovers &&
                                            elem.listOfApprovers.map(
                                              (item, index) => {
                                                let className = 'm-l-10 w100';
                                                let btnCls = '';
                                                if (
                                                  item.approvalStatus ==
                                                  'waiting_for_approval'
                                                ) {
                                                  className =
                                                    'greyclr m-l-10 w100';
                                                } else if (
                                                  item.approvalStatus ==
                                                  'declined'
                                                ) {
                                                  className =
                                                    'redclr m-l-10 w100';
                                                } else if (
                                                  item.approvalStatus ==
                                                  'approved'
                                                ) {
                                                  className =
                                                    'greenclr m-l-10 w100';
                                                  btnCls = 'cursor-disabled';
                                                } else if (
                                                  item.approvalStatus ==
                                                  'send_back'
                                                ) {
                                                  className =
                                                    'yellowclr m-l-10 w100';
                                                }
                                                return (
                                                  <div className={className}>
                                                    {item &&
                                                    item['approver'] &&
                                                    item['approver'].name
                                                      ? item['approver'].name
                                                      : item['approver']
                                                          .firstName +
                                                        ' ' +
                                                        item['approver']
                                                          .lastName}{' '}
                                                  </div>
                                                );
                                              }
                                            )
                                          : ''}
                                      </td>,

                                      <td>
                                        {elem.listOfApprovers &&
                                        elem.listOfApprovers.length > 0
                                          ? elem.listOfApprovers &&
                                            elem.listOfApprovers &&
                                            elem.listOfApprovers.map(
                                              (item, index) => {
                                                let btnCls = '';
                                                if (
                                                  item.approvalStatus ==
                                                  'approved'
                                                ) {
                                                  btnCls = 'cursor-disabled';
                                                }
                                                return (
                                                  <div
                                                    className="top-col r-breif contentleft flex align-center m-l-10"
                                                    key={index}
                                                  >
                                                    {item &&
                                                    item.comments &&
                                                    item.comments !==
                                                      undefined &&
                                                    item.comments[0] &&
                                                    item.comments[0].comment ? (
                                                      <p>
                                                        Comments:{' '}
                                                        <span className="m-l-5">
                                                          {
                                                            item.comments[0]
                                                              .comment
                                                          }
                                                        </span>
                                                      </p>
                                                    ) : (
                                                      ''
                                                    )}
                                                    {item.approver &&
                                                    ((this.props.userInfo
                                                      .userData.id ==
                                                      item.approver.id &&
                                                      elem.comments ===
                                                        undefined &&
                                                      item.approvalStatus ===
                                                        'waiting_for_approval') ||
                                                      item.approvalStatus ===
                                                        'send_back') ? (
                                                      <div className="flex align-center">
                                                        <FormGroup className="m-l-5">
                                                          <FormControl
                                                            type="text"
                                                            className="br-0 h-28"
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

                                                        <div className="flex">
                                                        <button className="btn btn-task p-0"> 
                                                          <span
                                                            className="ico-action-sm fill-green flex m-l-10"
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
                                                          </button> 
                                                          <button className="btn btn-task p-0"> 
                                                          <span
                                                            className="ico-action-sm fill-red flex"
                                                            onClick={() => {
                                                              this.revisionApprove(
                                                                'reject',
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
                                                                xlinkHref={`${Sprite}#rejectIco`}
                                                              />
                                                            </svg>
                                                          </span>
                                                          </button> 
                                                          <button className="btn btn-task p-0"> 
                                                          <span
                                                            className={
                                                              'ico-action-sm fill-orange flex' +
                                                              btnCls
                                                            }
                                                            onClick={() => {
                                                              this.revisionApprove(
                                                                'send_back',
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
                                                                xlinkHref={`${Sprite}#refresh1Ico`}
                                                              />
                                                            </svg>
                                                          </span>
                                                          </button> 
                                                        </div>
                                                      </div>
                                                    ) : item &&
                                                      item.comments &&
                                                      item.comments !==
                                                        undefined &&
                                                      item.comments[0] &&
                                                      item.comments[0]
                                                        .comment ? (
                                                      ''
                                                    ) : (
                                                      <p>
                                                        Comments:
                                                        <span className="m-l-5">
                                                          NA
                                                        </span>
                                                      </p>
                                                    )}
                                                    {item.approvalStatus ===
                                                    'approved' ? (
                                                      <div>
                                                        <div className="flex">
                                                        <button className="btn btn-task p-0"> 
                                                          <span
                                                            className={
                                                              'ico-action-sm fill-green flex m-l-10 ' +
                                                              btnCls
                                                            }
                                                            disabled={
                                                              btnCls
                                                                ? true
                                                                : false
                                                            }
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
                                                          </button>
                                                          {/* <span
                                                        className={
                                                          'ico-action-sm fill-red flex m-l-10 ' +
                                                          btnCls
                                                        }
                                                        disabled={btnCls?true:false}
                                                        onClick={() => {
                                                          this.revisionApprove(
                                                            'reject',
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
                                                            xlinkHref={`${Sprite}#rejectIco`}
                                                          />
                                                        </svg>
                                                      </span> */}
                                                              <button className="btn btn-task p-0"> 
                                                          <span
                                                            className={
                                                              'ico-action-sm fill-orange flex' +
                                                              btnCls
                                                            }
                                                            disabled={
                                                              btnCls
                                                                ? true
                                                                : false
                                                            }
                                                            onClick={() => {
                                                              this.revisionApprove(
                                                                'send_back',
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
                                                                xlinkHref={`${Sprite}#refresh1Ico`}
                                                              />
                                                            </svg>
                                                          </span>
                                                          </button>
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      ''
                                                    )}
                                                  </div>
                                                );
                                              }
                                            )
                                          : ''}
                                      </td>
                                    ]
                                  : ''}
                                {this.state.displayedColumns &&
                                this.state.displayedColumns[8].isShow
                                  ? [
                                      <td className="w-60">
                                        {elem.partialPay}
                                      </td>,
                                      <td className="w-60">
                                        {elem.partialCommit}
                                      </td>
                                    ]
                                  : ''}
                                {/*comments text copy from buget aaprover  */}
                                {/* <td className="statuswrap w100">
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
                                            item.approvalStatus == 'declined'
                                          ) {
                                            className = 'redclr';
                                          } else if (
                                            item.approvalStatus == 'approved'
                                          ) {
                                            className = 'greenclr';
                                          } else if (
                                            item.approvalStatus == 'send_back'
                                          ) {
                                            className = 'yellowclr';
                                          }
                                          return (
                                            <li className={className}>
                                              {item &&
                                              item['approver'] &&
                                              item['approver'].name
                                                ? item['approver'].name
                                                : item['approver'].firstName +
                                                  ' ' +
                                                  item['approver']
                                                    .lastName}{' '}
                                                 <div>

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
                                                  'Comments: NA'
                                                )}

</div>

                                            </li>
                                          );
                                        }
                                      )}
                                  </ul>
                                </td> */}
                                {/* <td className="statuswrap w100">
                                  {elem.itemRevisionNo}
                                </td> */}
                                {this.state.displayedColumns &&
                                this.state.displayedColumns[9].isShow
                                  ? [
                                      <td className="userRev w100">
                                        <p>
                                          {removeUnderScore(
                                            elem.budgetItemStatus
                                          )}{' '}
                                        </p>
                                      </td>
                                    ]
                                  : ''}
                                {elem.budgetYearRequests.map(
                                  (itemYear, indexYear) => {
                                    return [
                                      // <td>
                                      //   <div class="radioWrap w100">
                                      //     <div className="radioFlex rdintxtWrap">
                                      //       <label className="label--radio flex align-center">
                                      //         <input
                                      //           type="radio"
                                      //           className="radio"
                                      //           name={
                                      //             'inputBy' +
                                      //             catIndex +
                                      //             indexYear
                                      //           }
                                      //           onClick={event => {
                                      //             this.handleSetInputBy(
                                      //               event,
                                      //               'YEAR',
                                      //               catIndex,
                                      //               indexYear
                                      //             );
                                      //           }}
                                      //           checked={
                                      //             itemYear.inputBy == 1
                                      //               ? true
                                      //               : false
                                      //           }
                                      //         />
                                      //         <span className="radioIntxt">Y</span>
                                      //       </label>
                                      //     </div>
                                      //     <div className="radioFlex rdintxtWrap">
                                      //       <label className="label--radio flex align-center">
                                      //         <input
                                      //           type="radio"
                                      //           className="radio"
                                      //           name={
                                      //             'inputBy' +
                                      //             catIndex +
                                      //             indexYear
                                      //           }
                                      //           onClick={event => {
                                      //             this.handleSetInputBy(
                                      //               event,
                                      //               'QAUTER',
                                      //               catIndex,
                                      //               indexYear
                                      //             );
                                      //           }}
                                      //           checked={
                                      //             itemYear.inputBy == 4
                                      //               ? true
                                      //               : false
                                      //           }
                                      //         />
                                      //          <span className="radioIntxt">Q</span>
                                      //       </label>
                                      //     </div>
                                      //     <div className="radioFlex rdintxtWrap">
                                      //       <label className="label--radio flex align-center">
                                      //         <input
                                      //           type="radio"
                                      //           className="radio"
                                      //           name={
                                      //             'inputBy' +
                                      //             catIndex +
                                      //             indexYear
                                      //           }
                                      //           onClick={event => {
                                      //             this.handleSetInputBy(
                                      //               event,
                                      //               'MONTH',
                                      //               catIndex,
                                      //               indexYear
                                      //             );
                                      //           }}
                                      //           checked={
                                      //             itemYear.inputBy == 12
                                      //               ? true
                                      //               : false
                                      //           }
                                      //         />
                                      //          <span className="radioIntxt">M</span>
                                      //       </label>
                                      //     </div>
                                      //   </div>
                                      // </td>,

                                      itemYear.yearlyAmount.map(
                                        (itemObj, indexObj) => {
                                          let _this = this;
                                          return [
                                            <td className="budinput w100">
                                              {/* <div class="radioWrap flex align-center justify-center m-b-10">
                                                <div className="rdintxtWrap">
                                                  <label className="label--radio flex align-center">
                                                    <input
                                                      type="radio"
                                                      className="radio"
                                                      name={
                                                        'inputBy' +
                                                        catIndex +
                                                        indexYear
                                                      }
                                                      onClick={event => {
                                                        this.handleSetInputBy(
                                                          event,
                                                          'YEAR',
                                                          catIndex,
                                                          indexYear
                                                        );
                                                      }}
                                                      checked={
                                                        itemYear.inputBy == 1
                                                          ? true
                                                          : false
                                                      }
                                                    />
                                                    <span className="radioIntxt">
                                                      Y
                                                    </span>
                                                  </label>
                                                </div>
                                                <div className="rdintxtWrap">
                                                  <label className="label--radio flex align-center">
                                                    <input
                                                      type="radio"
                                                      className="radio"
                                                      name={
                                                        'inputBy' +
                                                        catIndex +
                                                        indexYear
                                                      }
                                                      onClick={event => {
                                                        this.handleSetInputBy(
                                                          event,
                                                          'QAUTER',
                                                          catIndex,
                                                          indexYear
                                                        );
                                                      }}
                                                      checked={
                                                        itemYear.inputBy == 4
                                                          ? true
                                                          : false
                                                      }
                                                    />
                                                    <span className="radioIntxt">
                                                      Q
                                                    </span>
                                                  </label>
                                                </div>
                                                <div className="rdintxtWrap">
                                                  <label className="label--radio flex align-center">
                                                    <input
                                                      type="radio"
                                                      className="radio"
                                                      name={
                                                        'inputBy' +
                                                        catIndex +
                                                        indexYear
                                                      }
                                                      onClick={event => {
                                                        this.handleSetInputBy(
                                                          event,
                                                          'MONTH',
                                                          catIndex,
                                                          indexYear
                                                        );
                                                      }}
                                                      checked={
                                                        itemYear.inputBy == 12
                                                          ? true
                                                          : false
                                                      }
                                                    />
                                                    <span className="radioIntxt">
                                                      M
                                                    </span>
                                                  </label>
                                                </div>
                                              </div> */}
                                         

                                         <div className="flex tb-main">
                                            <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                              Pay&nbsp;:
                                            </span>
                                            <span className="flex-1 tb-value text-left">
                                            {_this.state.inputAmountBy ==
                                                  'commit_and_pay' ||
                                                _this.state.inputAmountBy ==
                                                  'pay' ? (
                                                  <div
                                                    className={
                                                      _this.state
                                                        .inputAmountBy != 'pay'
                                                        ? ''
                                                        : ''
                                                    }
                                                  >
                                                    <div className="">
                                                      {this.state
                                                        .iscompareBlue ? (
                                                        <span className="sm-tip text-left">
                                                          YYYY
                                                        </span>
                                                      ) : (
                                                        ''
                                                      )}

                                                      <FormControl
                                                        type="text"
                                                        className="br-0 inputh20 w-60"
                                                        name="payAmount"
                                                        placeholder="Pay Amount"
                                                        value={
                                                          itemObj.payAmount
                                                        }
                                                        onChange={event => {
                                                          _this.handleOnChange(
                                                            event,
                                                            'YEAR',
                                                            catIndex,
                                                            indexObj,
                                                            indexYear
                                                          );
                                                        }}
                                                        disabled={
                                                          itemYear.inputBy == 1
                                                            ? false
                                                            : true
                                                        }
                                                      />

                                                      {this.state
                                                        .iscompareBlue ? (
                                                        <span className="sm-tip color-light text-right">
                                                          YYYY
                                                        </span>
                                                      ) : (
                                                        ''
                                                      )}
                                                    </div>
                                                  </div>
                                                ) : (
                                                  ''
                                                )}

                                            </span>
                                          </div>

                                          <div className="flex tb-main">
                                            <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                             Commit&nbsp;:
                                            </span>
                                            <span className="flex-1 tb-value text-left">
                                            {_this.state.inputAmountBy ==
                                                  'commit_and_pay' ||
                                                _this.state.inputAmountBy ==
                                                  'commit' ? (
                                                  <div
                                                    className={
                                                      _this.state
                                                        .inputAmountBy != 'pay'
                                                        ? ''
                                                        : ' '
                                                    }
                                                  >
                                                    <div className="">
                                                    {this.state
                                                        .iscompareBlue ? (
                                                        <span className="sm-tip text-left">
                                                          YYYY
                                                        </span>
                                                      ) : (
                                                        ''
                                                      )}

                                                      <FormControl
                                                        type="text"
                                                        className="br-0 inputh20 w-60"
                                                        name="commitAmount"
                                                        placeholder="Commit Amount"
                                                        value={
                                                          itemObj.commitAmount
                                                        }
                                                        onChange={event => {
                                                          _this.handleOnChange(
                                                            event,
                                                            'YEAR',
                                                            catIndex,
                                                            indexObj,
                                                            indexYear
                                                          );
                                                        }}
                                                        disabled={
                                                          itemYear.inputBy == 1
                                                            ? false
                                                            : true
                                                        }
                                                      />

                                                      {this.state
                                                        .iscompareBlue ? (
                                                        <span className="sm-tip color-light text-right">
                                                          YYYY
                                                        </span>
                                                      ) : (
                                                        ''
                                                      )}
                                                    </div>
                                                  </div>
                                                ) : (
                                                  ''
                                                )}
                                            </span>
                                          </div>


{/* 
                                              <div className="flex align-center justify-space-around border-top">
                                                {_this.state.inputAmountBy ==
                                                  'commit_and_pay' ||
                                                _this.state.inputAmountBy ==
                                                  'pay' ? (
                                                  <p className="labelwd">
                                                    Pay{' '}
                                                  </p>
                                                ) : (
                                                  ''
                                                )}
                                                {_this.state.inputAmountBy ==
                                                'commit_and_pay' ? (
                                                  <span className="border-rightaf">
                                                    {' '}
                                                  </span>
                                                ) : (
                                                  ''
                                                )}

                                                {_this.state.inputAmountBy ==
                                                  'commit_and_pay' ||
                                                _this.state.inputAmountBy ==
                                                  'commit' ? (
                                                  <p className="labelwd">
                                                    Commit{' '}
                                                  </p>
                                                ) : (
                                                  ''
                                                )}
                                              </div>

                                              <div className="flex align-center bmainwrap">
                                                {_this.state.inputAmountBy ==
                                                  'commit_and_pay' ||
                                                _this.state.inputAmountBy ==
                                                  'pay' ? (
                                                  <div
                                                    className={
                                                      _this.state
                                                        .inputAmountBy != 'pay'
                                                        ? 'b-p-warpper comflex border-right'
                                                        : 'b-p-warpper comflex '
                                                    }
                                                  >
                                                    <div className="">
                                                      {this.state
                                                        .iscompareBlue ? (
                                                        <span className="sm-tip text-left">
                                                          YYYY
                                                        </span>
                                                      ) : (
                                                        ''
                                                      )}

                                                      <FormControl
                                                        type="text"
                                                        className="br-0 inputh20 w-60"
                                                        name="payAmount"
                                                        placeholder="Pay Amount"
                                                        value={
                                                          itemObj.payAmount
                                                        }
                                                        onChange={event => {
                                                          _this.handleOnChange(
                                                            event,
                                                            'YEAR',
                                                            catIndex,
                                                            indexObj,
                                                            indexYear
                                                          );
                                                        }}
                                                        disabled={
                                                          itemYear.inputBy == 1
                                                            ? false
                                                            : true
                                                        }
                                                      />

                                                      {this.state
                                                        .iscompareBlue ? (
                                                        <span className="sm-tip color-light text-right">
                                                          YYYY
                                                        </span>
                                                      ) : (
                                                        ''
                                                      )}
                                                    </div>
                                                  </div>
                                                ) : (
                                                  ''
                                                )}

                                                {_this.state.inputAmountBy ==
                                                  'commit_and_pay' ||
                                                _this.state.inputAmountBy ==
                                                  'commit' ? (
                                                  <div className="b-p-warpper comflex">
                                                    <div className="">
                                                      {this.state
                                                        .iscompareBlue ? (
                                                        <span className="sm-tip text-left">
                                                          YYYY
                                                        </span>
                                                      ) : (
                                                        ''
                                                      )}

                                                      <FormControl
                                                        type="text"
                                                        className="br-0 inputh20 w-60"
                                                        name="commitAmount"
                                                        placeholder="Commit Amount"
                                                        value={
                                                          itemObj.commitAmount
                                                        }
                                                        onChange={event => {
                                                          _this.handleOnChange(
                                                            event,
                                                            'YEAR',
                                                            catIndex,
                                                            indexObj,
                                                            indexYear
                                                          );
                                                        }}
                                                        disabled={
                                                          itemYear.inputBy == 1
                                                            ? false
                                                            : true
                                                        }
                                                      />

                                                      {this.state
                                                        .iscompareBlue ? (
                                                        <span className="sm-tip color-light text-right">
                                                          YYYY
                                                        </span>
                                                      ) : (
                                                        ''
                                                      )}
                                                    </div>
                                                  </div>
                                                ) : (
                                                  ''
                                                )}
                                              </div> */}
                                            </td>,

                                            itemObj.openQauter
                                              ? itemObj.quarterlyAmount.map(
                                                  (itemQauter, indexQauter) => {
                                                    return [
                                                      <td className="budinput w100">
                                                        {/* <div className="flex align-center justify-space-around border-top m-t-20">     
                                                            <p className="labelwd">Pay </p>
                                                            <span className="border-rightaf"> </span>
                                                            <p className="labelwd">Commit </p>
                                                          </div> */}

                                                  <div className="flex tb-main">
                                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                                      Pay&nbsp;:
                                                    </span>
                                   
                                                         {_this.state
                                                            .inputAmountBy ==
                                                            'commit_and_pay' ||
                                                          _this.state
                                                            .inputAmountBy ==
                                                            'pay' ? (
                                                              <span className="flex-1 tb-value text-left">
                                                              <div>
                                                                {this.state
                                                                  .iscompareBlue ? (
                                                                  <span className="sm-tip text-left">
                                                                    YYYY
                                                                  </span>
                                                                ) : (
                                                                  ''
                                                                )}

                                                                <FormControl
                                                                  type="text"
                                                                  className="br-0 inputh20 w-60"
                                                                  name="payAmount"
                                                                  value={
                                                                    itemQauter.payAmount
                                                                  }
                                                                  placeholder="Pay Amount"
                                                                  onChange={event => {
                                                                    _this.handleOnChange(
                                                                      event,
                                                                      'QAUTER',
                                                                      catIndex,
                                                                      indexObj,
                                                                      indexYear,
                                                                      indexQauter
                                                                    );
                                                                  }}
                                                                  disabled={
                                                                    itemObj.checkQauter
                                                                      ? false
                                                                      : true
                                                                  }
                                                                />

                                                                {this.state
                                                                  .iscompareBlue ? (
                                                                  <span className="sm-tip color-light text-right">
                                                                    YYYY
                                                                  </span>
                                                                ) : (
                                                                  ''
                                                                )}
                                                               
                                                            </div>
                                                            </span>
                                                          ) : (
                                                            ''
                                                          )}
                                 
                                             </div>

                                                  <div className="flex tb-main">
                                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                                    Commit&nbsp;:
                                                    </span>
                                                    {_this.state
                                                            .inputAmountBy ==
                                                            'commit_and_pay' ||
                                                          _this.state
                                                            .inputAmountBy ==
                                                            'commit' ? (
                                                            <span className="flex-1 tb-value text-left">
                                 
                                                          
                                                              <div>
                                                                {this.state
                                                                  .iscompareBlue ? (
                                                                  <span className="sm-tip text-left">
                                                                    YYYY
                                                                  </span>
                                                                ) : (
                                                                  ''
                                                                )}

                                                                <FormControl
                                                                  type="text"
                                                                  className="br-0 inputh20 w-60"
                                                                  name="commitAmount"
                                                                  placeholder="Commit Amount"
                                                                  value={
                                                                    itemQauter.commitAmount
                                                                  }
                                                                  onChange={event => {
                                                                    _this.handleOnChange(
                                                                      event,
                                                                      'QAUTER',
                                                                      catIndex,
                                                                      indexObj,
                                                                      indexYear,
                                                                      indexQauter
                                                                    );
                                                                  }}
                                                                  disabled={
                                                                    itemObj.checkQauter
                                                                      ? false
                                                                      : true
                                                                  }
                                                                />

                                                                {this.state
                                                                  .iscompareBlue ? (
                                                                  <span className="sm-tip color-light text-right">
                                                                    YYYY
                                                                  </span>
                                                                ) : (
                                                                  ''
                                                                )}
                                                              </div>
                                                          
                                                            </span>
                                                          ) : (
                                                            ''
                                                          )}
                                          
                                                   </div>



{/*                          
                                                        <div className="flex align-center justify-space-around border-top m-t-20">
                                                          {_this.state
                                                            .inputAmountBy ==
                                                            'commit_and_pay' ||
                                                          _this.state
                                                            .inputAmountBy ==
                                                            'pay' ? (
                                                            <p className="labelwd">
                                                              Pay{' '}
                                                            </p>
                                                          ) : (
                                                            ''
                                                          )}
                                                          {_this.state
                                                            .inputAmountBy ==
                                                          'commit_and_pay' ? (
                                                            <span className="border-rightaf">
                                                              {' '}
                                                            </span>
                                                          ) : (
                                                            ''
                                                          )}

                                                          {_this.state
                                                            .inputAmountBy ==
                                                            'commit_and_pay' ||
                                                          _this.state
                                                            .inputAmountBy ==
                                                            'commit' ? (
                                                            <p className="labelwd">
                                                              Commit{' '}
                                                            </p>
                                                          ) : (
                                                            ''
                                                          )}
                                                        </div>

                                                        <div className="flex align-center bmainwrap">
                                                          {_this.state
                                                            .inputAmountBy ==
                                                            'commit_and_pay' ||
                                                          _this.state
                                                            .inputAmountBy ==
                                                            'pay' ? (
                                                            <div
                                                              className={
                                                                _this.state
                                                                  .inputAmountBy !=
                                                                'pay'
                                                                  ? 'b-p-warpper comflex border-right'
                                                                  : 'b-p-warpper comflex '
                                                              }
                                                            >
                                                              <div>
                                                                {this.state
                                                                  .iscompareBlue ? (
                                                                  <span className="sm-tip text-left">
                                                                    YYYY
                                                                  </span>
                                                                ) : (
                                                                  ''
                                                                )}

                                                                <FormControl
                                                                  type="text"
                                                                  className="br-0 inputh20 w-60"
                                                                  name="payAmount"
                                                                  value={
                                                                    itemQauter.payAmount
                                                                  }
                                                                  placeholder="Pay Amount"
                                                                  onChange={event => {
                                                                    _this.handleOnChange(
                                                                      event,
                                                                      'QAUTER',
                                                                      catIndex,
                                                                      indexObj,
                                                                      indexYear,
                                                                      indexQauter
                                                                    );
                                                                  }}
                                                                  disabled={
                                                                    itemObj.checkQauter
                                                                      ? false
                                                                      : true
                                                                  }
                                                                />

                                                                {this.state
                                                                  .iscompareBlue ? (
                                                                  <span className="sm-tip color-light text-right">
                                                                    YYYY
                                                                  </span>
                                                                ) : (
                                                                  ''
                                                                )}
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            ''
                                                          )}

                                                          {_this.state
                                                            .inputAmountBy ==
                                                            'commit_and_pay' ||
                                                          _this.state
                                                            .inputAmountBy ==
                                                            'commit' ? (
                                                            <div className="b-p-warpper comflex">
                                                              <div>
                                                                {this.state
                                                                  .iscompareBlue ? (
                                                                  <span className="sm-tip text-left">
                                                                    YYYY
                                                                  </span>
                                                                ) : (
                                                                  ''
                                                                )}

                                                                <FormControl
                                                                  type="text"
                                                                  className="br-0 inputh20 w-60"
                                                                  name="commitAmount"
                                                                  placeholder="Commit Amount"
                                                                  value={
                                                                    itemQauter.commitAmount
                                                                  }
                                                                  onChange={event => {
                                                                    _this.handleOnChange(
                                                                      event,
                                                                      'QAUTER',
                                                                      catIndex,
                                                                      indexObj,
                                                                      indexYear,
                                                                      indexQauter
                                                                    );
                                                                  }}
                                                                  disabled={
                                                                    itemObj.checkQauter
                                                                      ? false
                                                                      : true
                                                                  }
                                                                />

                                                                {this.state
                                                                  .iscompareBlue ? (
                                                                  <span className="sm-tip color-light text-right">
                                                                    YYYY
                                                                  </span>
                                                                ) : (
                                                                  ''
                                                                )}
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            ''
                                                          )}
                                                        </div> */}
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
                                                                <td className="budinput  w100">
                                                                  {/* <div className="flex align-center justify-space-around border-top m-t-20">     
                                                                          <p className="labelwd">Pay </p>
                                                                          <span className="border-rightaf"> </span>
                                                                          <p className="labelwd">Commit </p>
                                                                        </div> */}





                                        <div className="flex tb-main">
                                          <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                            Pay&nbsp;:
                                          </span>
                                                  {_this.state
                                                      .inputAmountBy ==
                                                      'commit_and_pay' ||
                                                    _this.state
                                                      .inputAmountBy ==
                                                      'pay' ? (   <span className="flex-1 tb-value text-left">

                                          <div>
                                            {this
                                              .state
                                              .iscompareBlue ? (
                                              <span className="sm-tip text-left">
                                                YYYY
                                              </span>
                                            ) : (
                                              ''
                                            )}
                                            <FormControl
                                              type="text"
                                              className="br-0 inputh20 w-60"
                                              name="payAmount"
                                              value={
                                                itemMonth.payAmount
                                              }
                                              placeholder="Pay Amount"
                                              onChange={event => {
                                                _this.handleOnChange(
                                                  event,
                                                  'MONTH',
                                                  catIndex,
                                                  indexObj,
                                                  indexYear,
                                                  indexQauter,
                                                  indexMonth
                                                );
                                              }}
                                              disabled={
                                                itemQauter.checkMonth
                                                  ? false
                                                  : true
                                              }
                                            />
                                            {this
                                              .state
                                              .iscompareBlue ? (
                                              <span className="sm-tip color-light text-right">
                                                YYYY
                                              </span>
                                            ) : (
                                              ''
                                            )}
                                          </div>
                                          </span>
                                          ) : (
                                          ''
                                          )}


                                  </div>

                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                     Commit&nbsp;:
                                    </span>
                                    {_this.state
                                        .inputAmountBy ==
                                        'commit_and_pay' ||
                                      _this.state
                                        .inputAmountBy ==
                                        'commit' ? (
                                          <span className="flex-1 tb-value text-left">
                                          <div>
                                            {this
                                              .state
                                              .iscompareBlue ? (
                                              <span className="sm-tip text-left">
                                                YYYY
                                              </span>
                                            ) : (
                                              ''
                                            )}
                                            <FormControl
                                              type="text"
                                              className="br-0 inputh20 w-60"
                                              name="commitAmount"
                                              value={
                                                itemMonth.commitAmount
                                              }
                                              placeholder="Commit Amount"
                                              onChange={event => {
                                                _this.handleOnChange(
                                                  event,
                                                  'MONTH',
                                                  catIndex,
                                                  indexObj,
                                                  indexYear,
                                                  indexQauter,
                                                  indexMonth
                                                );
                                              }}
                                              disabled={
                                                itemQauter.checkMonth
                                                  ? false
                                                  : true
                                              }
                                            />

                                            {this
                                              .state
                                              .iscompareBlue ? (
                                              <span className="sm-tip color-light text-right">
                                                YYYY
                                              </span>
                                            ) : (
                                              ''
                                            )}
                                          </div>{' '}
                                          </span>
                                      ) : (
                                        ''
                                      )}   
        
                                    
                                  </div>














                                                                  {/* <div className="flex align-center justify-space-around border-top m-t-20">
                                                                    {_this.state
                                                                      .inputAmountBy ==
                                                                      'commit_and_pay' ||
                                                                    _this.state
                                                                      .inputAmountBy ==
                                                                      'pay' ? (
                                                                      <p className="labelwd">
                                                                        Pay{' '}
                                                                      </p>
                                                                    ) : (
                                                                      ''
                                                                    )}
                                                                    {_this.state
                                                                      .inputAmountBy ==
                                                                    'commit_and_pay' ? (
                                                                      <span className="border-rightaf">
                                                                        {' '}
                                                                      </span>
                                                                    ) : (
                                                                      ''
                                                                    )}

                                                                    {_this.state
                                                                      .inputAmountBy ==
                                                                      'commit_and_pay' ||
                                                                    _this.state
                                                                      .inputAmountBy ==
                                                                      'commit' ? (
                                                                      <p className="labelwd">
                                                                        Commit{' '}
                                                                      </p>
                                                                    ) : (
                                                                      ''
                                                                    )}
                                                                  </div>

                                                                  <div className="flex align-center bmainwrap">
                                                                    {_this.state
                                                                      .inputAmountBy ==
                                                                      'commit_and_pay' ||
                                                                    _this.state
                                                                      .inputAmountBy ==
                                                                      'pay' ? (
                                                                      <div
                                                                        className={
                                                                          _this
                                                                            .state
                                                                            .inputAmountBy !=
                                                                          'pay'
                                                                            ? 'b-p-warpper comflex border-right'
                                                                            : 'b-p-warpper comflex '
                                                                        }
                                                                      >
                                                                        <div>
                                                                          {this
                                                                            .state
                                                                            .iscompareBlue ? (
                                                                            <span className="sm-tip text-left">
                                                                              YYYY
                                                                            </span>
                                                                          ) : (
                                                                            ''
                                                                          )}
                                                                          <FormControl
                                                                            type="text"
                                                                            className="br-0 inputh20 w-60"
                                                                            name="payAmount"
                                                                            value={
                                                                              itemMonth.payAmount
                                                                            }
                                                                            placeholder="Pay Amount"
                                                                            onChange={event => {
                                                                              _this.handleOnChange(
                                                                                event,
                                                                                'MONTH',
                                                                                catIndex,
                                                                                indexObj,
                                                                                indexYear,
                                                                                indexQauter,
                                                                                indexMonth
                                                                              );
                                                                            }}
                                                                            disabled={
                                                                              itemQauter.checkMonth
                                                                                ? false
                                                                                : true
                                                                            }
                                                                          />
                                                                          {this
                                                                            .state
                                                                            .iscompareBlue ? (
                                                                            <span className="sm-tip color-light text-right">
                                                                              YYYY
                                                                            </span>
                                                                          ) : (
                                                                            ''
                                                                          )}
                                                                        </div>{' '}
                                                                      </div>
                                                                    ) : (
                                                                      ''
                                                                    )}

                                                                    {_this.state
                                                                      .inputAmountBy ==
                                                                      'commit_and_pay' ||
                                                                    _this.state
                                                                      .inputAmountBy ==
                                                                      'commit' ? (
                                                                      <div className="b-p-warpper comflex">
                                                                        <div>
                                                                          {this
                                                                            .state
                                                                            .iscompareBlue ? (
                                                                            <span className="sm-tip text-left">
                                                                              YYYY
                                                                            </span>
                                                                          ) : (
                                                                            ''
                                                                          )}
                                                                          <FormControl
                                                                            type="text"
                                                                            className="br-0 inputh20 w-60"
                                                                            name="commitAmount"
                                                                            value={
                                                                              itemMonth.commitAmount
                                                                            }
                                                                            placeholder="Commit Amount"
                                                                            onChange={event => {
                                                                              _this.handleOnChange(
                                                                                event,
                                                                                'MONTH',
                                                                                catIndex,
                                                                                indexObj,
                                                                                indexYear,
                                                                                indexQauter,
                                                                                indexMonth
                                                                              );
                                                                            }}
                                                                            disabled={
                                                                              itemQauter.checkMonth
                                                                                ? false
                                                                                : true
                                                                            }
                                                                          />

                                                                          {this
                                                                            .state
                                                                            .iscompareBlue ? (
                                                                            <span className="sm-tip color-light text-right">
                                                                              YYYY
                                                                            </span>
                                                                          ) : (
                                                                            ''
                                                                          )}
                                                                        </div>{' '}
                                                                      </div>
                                                                    ) : (
                                                                      ''
                                                                    )}
                                                                  </div> */}
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
                                )}
                                <td>
                                  <div className="upload-btn cursor-pointer sm-upload">
                                    {(elem.mediaRequests &&
                                      elem.mediaRequests[0] &&
                                      elem.mediaRequests[0].mediaType ===
                                        'application/octet-stream') ||
                                    (elem.mediaRequests &&
                                      elem.mediaRequests[0] &&
                                      elem.mediaRequests[0].mediaType ===
                                        'application/vnd.ms-excel') ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.mediaRequests,
                                          catIndex
                                        )}
                                        src={xlsImage}
                                        width="45"
                                      />
                                    ) : elem.mediaRequests &&
                                      elem.mediaRequests[0] &&
                                      elem.mediaRequests[0].mediaType ===
                                        'application/pdf' ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.mediaRequests,
                                          catIndex
                                        )}
                                        src={pdfImage}
                                        width="45"
                                      />
                                    ) : elem.mediaRequests &&
                                      elem.mediaRequests.mediaType ===
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.mediaRequests,
                                          catIndex
                                        )}
                                        src={docImage}
                                        width="45"
                                      />
                                    ) : elem.mediaRequests &&
                                      elem.mediaRequests[0] &&
                                      elem.mediaRequests[0].mediaType ===
                                        'text/plain' ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.mediaRequests,
                                          catIndex
                                        )}
                                        src={docImage}
                                        width="45"
                                      />
                                    ) : elem.mediaRequests &&
                                      elem.mediaRequests[0] &&
                                      elem.mediaRequests[0].mediaType ===
                                        'application/msword' ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.mediaRequests,
                                          catIndex
                                        )}
                                        src={docImage}
                                        width="45"
                                      />
                                    ) : (
                                      ''
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
                 
                    {this.state.noRecordImage &&
                    this.state.ListOfBudget.length == 0 ? (
                      <div className="recordNotFound flex align-center justify-center recordbd">
                      <tbody>
                        <tr>
                          <div className="noRecord">
                            <img src={noRecord} />
                          </div>
                        </tr>
                      </tbody>
                      </div>
                    ) : (
                      ''
                    )}
                
                </div>
                <div className="text-center m-b-20 m-t-20">
                  <button
                    onClick={this.handleShow}
                    className="btn btn-default text-uppercase"
                    disabled={
                      this.state.ListOfBudget &&
                      this.state.ListOfBudget.length > 0
                        ? false
                        : true
                    }
                  >
                    Preview
                  </button>
                </div>

                {this.state.ListOfBudget &&
                this.state.ListOfBudget.length > 0 &&
                this.state.approversLenghtArr &&
                this.state.approversLenghtArr.length > 0 ? (
                  <div className="revision-area">
                    <div className="flex">
                      <div className="top-col"> </div>

                      {_this.state.approversLenghtArr &&
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

                    {this.state.ListOfBudget &&
                      this.state.ListOfBudget.length > 0 &&
                      this.state.ListOfBudget.map((elem, catIndex) => {
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
                                      elem.listOfApprovers.map(
                                        (item, index) => {
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
                                                    ).format(
                                                      'DD MMM YYYY hh:mm a'
                                                    )
                                                  : ''}
                                              </h5>

                                              {elem &&
                                              elem.comments &&
                                              elem.comments !== undefined &&
                                              elem.comments[0] ? (
                                                <p>
                                                  Comments:{' '}
                                                  <span className="m-l-5">
                                                    {elem.comments[0].comment}
                                                  </span>
                                                </p>
                                              ) : (
                                                <p>
                                                  Comments:{' '}
                                                  <span className="m-l-5">
                                                    NA
                                                  </span>
                                                </p>
                                              )}

                                              {item.approver &&
                                              (this.props.userInfo.userData
                                                .id == item.approver.id &&
                                                elem.comments === undefined &&
                                                elem.approvalStatus ===
                                                  'waiting_for_approval') ? (
                                                <div>
                                                  <p>
                                                    <FormGroup controlId="formControlsTextarea">
                                                      <FormControl
                                                        className="resizenone"
                                                        componentClass="textarea"
                                                        placeholder="Comment"
                                                        value={elem.comment}
                                                        onChange={
                                                          this.handleChange
                                                        }
                                                        name="comment"
                                                        required
                                                      />
                                                    </FormGroup>
                                                  </p>
                                                  <div className="flex iconflex">
                                                  
                                                    <span
                                                      className="ico-action-sm fill-green"
                                                      // onClick={() => {
                                                      //   this.revisionApprove('approved', data.id);
                                                      // }}
                                                    >
                                                      <svg>
                                                        <use
                                                          xlinkHref={`${Sprite}#rightCircleIco`}
                                                        />
                                                      </svg>
                                                    </span>
                                                    <span
                                                      className="ico-action-sm fill-red m-l-5"
                                                      // onClick={() => {
                                                      //   this.revisionApprove('reject', data.id);
                                                      // }}
                                                    >
                                                      <svg>
                                                        <use
                                                          xlinkHref={`${Sprite}#rejectIco`}
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
                                        }
                                      )}
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
            <Modal
              className="custom-popUp modal-xxl"
              show={this.state.show}
              onHide={this.handleClose}
            >
              <Modal.Header>
                <div className="flex justify-space-between">
                  <h4>Budget Review</h4>
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
                <div ref={el => (this.componentRef = el)}>
                  <table className="m-b-15">
                    <tr>
                      <td>
                        <div className="company-info">
                          <Table className="print-table">
                            <tbody>
                              <tr>
                                <td>Buyer:</td>
                                <td>
                                  {this.props.userInfo.userData.companyName}
                                </td>
                              </tr>
                              <tr>
                                <td>Vendor:</td>
                                <td>
                                  {this.state.releasePOList &&
                                  this.state.releasePOList[0]
                                    .poreleasePartsRes[0] &&
                                  this.state.releasePOList[0]
                                    .poreleasePartsRes[0].supplierResponse
                                    .companyName
                                    ? this.state.releasePOList &&
                                      this.state.releasePOList[0]
                                        .poreleasePartsRes[0] &&
                                      this.state.releasePOList[0]
                                        .poreleasePartsRes[0].supplierResponse
                                        .companyName
                                    : ''}
                                </td>
                              </tr>
                              <tr>
                                <td>Contact:</td>
                                <td>
                                  {' '}
                                  {this.props.userInfo.userData.fullname},{' '}
                                  {this.props.userInfo.userData.userProfile},
                                  {this.props.userInfo.userData.contactNo}
                                </td>
                              </tr>
                              <tr>
                                <td>Puruchase Order No:</td>
                                <td>{this.state.purchaseOrderNo}</td>
                              </tr>
                              <tr>
                                <td>Issued Through:</td>
                                <td>makethepart.com</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </td>
                      <td> </td>
                    </tr>
                  </table>
                  <div className="table-responsive">
                    <Table
                      bordered
                      condensed
                      className="custom-table budgetTbWrapper inputform90 print-table"
                    >
                      <thead>
                        <tr className="budgetThcenter">
                          <th>Budget Item</th>
                          <th>Account No</th>
                          <th>BUDGET ITEM DESCRIPTION</th>
                          <th>ACCOUNT DESCRIPTION</th>
                          <th>Currency </th>

                          <th>BRAND</th>
                          <th>DEPARTMEN</th>
                          <th>MAJOR CATEGORY</th>
                          <th>SECTOR CATEGORY</th>
                          {/* <th>Total </th> */}
                          <th>Region</th>
                          {this.state.ListOfBudget &&
                            this.state.ListOfBudget[0] &&
                            this.state.ListOfBudget[0].budgetYearRequests &&
                            this.state.ListOfBudget[0].budgetYearRequests.map(
                              (itemYear, indexYear) => {
                                return [
                                  <th>Input by </th>,
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
                                            FY-{itemYear.yearFrom}-
                                            {itemYear.yearTo}{' '}
                                          </p>
                                        </th>,
                                        itemObj.quarterlyAmount.map(
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
                                                  Q{indexQauter + 1}{' '}
                                                </p>
                                              </th>,
                                              itemQauter.monthlyAmount.map(
                                                (itemMonth, indexMonth) => {
                                                  lastMonth = itemMonth.date;
                                                  return [
                                                    <th>
                                                      <p className="m-b-0">
                                                        {itemMonth.month}
                                                      </p>
                                                    </th>
                                                  ];
                                                }
                                              )
                                            ];
                                          }
                                        )
                                      ];
                                    }
                                  )
                                ];
                              }
                            )}

                          <th>
                            Input by: <p>Intial Approval by: </p>
                          </th>
                          <th>Approvers</th>
                          <th>Item Revision</th>
                          <th>Status </th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.ListOfBudget &&
                          this.state.ListOfBudget.map((elem, catIndex) => {
                            return (
                              <tr>
                                <td className="w100">{elem.budgetItemNo}</td>
                                <td className="w100">{elem.accountNo}</td>
                                <td className="w100">{elem.description}</td>
                                <td className="w100">{elem.description1}</td>
                                <td className="w100">{elem.currency}</td>
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

                                <td className="bugettbfl">
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      Region&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.globalRegionName}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      Sub Region&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.globalSubRegionName}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      Country&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.countryName}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      Zone&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.localBussinessRegion}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      District&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.district}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      Circle&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.circle}
                                    </span>
                                  </div>
                                  <div className="flex tb-main">
                                    <span className="flex-1 text-uppercase text-right fw-600 tb-title">
                                      Area&nbsp;:
                                    </span>
                                    <span className="flex-1 tb-value text-left">
                                      {elem.area}
                                    </span>
                                  </div>
                                </td>

                                {this.state.ListOfBudget &&
                                  this.state.ListOfBudget[0] &&
                                  this.state.ListOfBudget[0]
                                    .budgetYearRequests &&
                                  this.state.ListOfBudget[0].budgetYearRequests.map(
                                    (itemYear, indexYear) => {
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
                                          elem.inputAmountBy == 'pay' ? (
                                            <FormGroup className="m-b-3 flex">
                                              <ControlLabel className="labelwd">
                                                Pay
                                              </ControlLabel>
                                              {itemYear.totalPayAmount}
                                            </FormGroup>
                                          ) : (
                                            <FormGroup className="m-b-3 flex">
                                              <ControlLabel className="labelwd">
                                                Pay
                                              </ControlLabel>
                                              {itemYear.totalPayAmount}
                                            </FormGroup>
                                          )}
                                          {elem.inputAmountBy ==
                                            'commit_and_pay' ||
                                          elem.inputAmountBy == 'commit' ? (
                                            <FormGroup className="m-b-0 flex">
                                              <ControlLabel className="labelwd">
                                                Commit
                                              </ControlLabel>
                                              {itemYear.totalCommitAmount}
                                            </FormGroup>
                                          ) : (
                                            <FormGroup className="m-b-0 flex">
                                              <ControlLabel className="labelwd">
                                                Commit
                                              </ControlLabel>
                                              {itemYear.totalCommitAmount}
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
                                                  {_this.state.inputAmountBy ==
                                                    'commit_and_pay' ||
                                                  _this.state.inputAmountBy ==
                                                    'pay' ? (
                                                    <div className="td-item">
                                                      {this.state
                                                        .iscompareBlue ? (
                                                        <span className="sm-tip text-left">
                                                          YYYY
                                                        </span>
                                                      ) : (
                                                        ''
                                                      )}

                                                      {itemObj.payAmount}

                                                      {this.state
                                                        .iscompareBlue ? (
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
                                                        .iscompareBlue ? (
                                                        <span className="sm-tip text-left">
                                                          YYYY
                                                        </span>
                                                      ) : (
                                                        ''
                                                      )}

                                                      {itemObj.payAmount}

                                                      {this.state
                                                        .iscompareBlue ? (
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
                                                  {_this.state.inputAmountBy ==
                                                    'commit_and_pay' ||
                                                  _this.state.inputAmountBy ==
                                                    'commit' ? (
                                                    <div className="td-item">
                                                      {this.state
                                                        .iscompareBlue ? (
                                                        <span className="sm-tip text-left">
                                                          YYYY
                                                        </span>
                                                      ) : (
                                                        ''
                                                      )}

                                                      {itemObj.commitAmount}
                                                      {this.state
                                                        .iscompareBlue ? (
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
                                                        .iscompareBlue ? (
                                                        <span className="sm-tip text-left">
                                                          YYYY
                                                        </span>
                                                      ) : (
                                                        ''
                                                      )}

                                                      {itemObj.commitAmount}
                                                      {this.state
                                                        .iscompareBlue ? (
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
                                              itemObj.quarterlyAmount.map(
                                                (itemQauter, indexQauter) => {
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
                                                              .iscompareBlue ? (
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
                                                              .iscompareBlue ? (
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
                                                              .iscompareBlue ? (
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
                                                              .iscompareBlue ? (
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
                                                              .iscompareBlue ? (
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
                                                              .iscompareBlue ? (
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
                                                              .iscompareBlue ? (
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
                                                              .iscompareBlue ? (
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
                                                    itemQauter.monthlyAmount.map(
                                                      (
                                                        itemMonth,
                                                        indexMonth
                                                      ) => {
                                                        lastMonth =
                                                          itemMonth.date;
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
                                                                    .iscompareBlue ? (
                                                                    <span className="sm-tip text-left">
                                                                      YYYY
                                                                    </span>
                                                                  ) : (
                                                                    ''
                                                                  )}

                                                                  {
                                                                    itemMonth.payAmount
                                                                  }
                                                                  {this.state
                                                                    .iscompareBlue ? (
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
                                                                    .iscompareBlue ? (
                                                                    <span className="sm-tip text-left">
                                                                      YYYY
                                                                    </span>
                                                                  ) : (
                                                                    ''
                                                                  )}

                                                                  {
                                                                    itemMonth.payAmount
                                                                  }
                                                                  {this.state
                                                                    .iscompareBlue ? (
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
                                                                    .iscompareBlue ? (
                                                                    <span className="sm-tip text-left">
                                                                      YYYY
                                                                    </span>
                                                                  ) : (
                                                                    ''
                                                                  )}

                                                                  {
                                                                    itemMonth.commitAmount
                                                                  }

                                                                  {this.state
                                                                    .iscompareBlue ? (
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
                                                                    .iscompareBlue ? (
                                                                    <span className="sm-tip text-left">
                                                                      YYYY
                                                                    </span>
                                                                  ) : (
                                                                    ''
                                                                  )}

                                                                  {
                                                                    itemMonth.commitAmount
                                                                  }

                                                                  {this.state
                                                                    .iscompareBlue ? (
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
                                                  ];
                                                }
                                              )
                                            ];
                                          }
                                        )
                                      ];
                                    }
                                  )}

                                <td className="w100">
                                  <ul className="list-style-none p-0 limtb5">
                                    <li>
                                      {' '}
                                      {this.props.userInfo.userData.fullname}
                                    </li>
                                    <li>
                                      {elem.intitialApproverBy &&
                                        elem.intitialApproverBy.firstName +
                                          ' ' +
                                          elem.intitialApproverBy.lastName}
                                    </li>
                                  </ul>
                                </td>

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
                                            item.approvalStatus == 'declined'
                                          ) {
                                            className = 'redclr';
                                          } else if (
                                            item.approvalStatus == 'approved'
                                          ) {
                                            className = 'greenclr';
                                          } else if (
                                            item.approvalStatus == 'send_back'
                                          ) {
                                            className = 'yellowclr';
                                          }
                                          return (
                                            <li className={className}>
                                              {item &&
                                              item['approver'] &&
                                              item['approver'].name
                                                ? item['approver'].name
                                                : item['approver'].firstName +
                                                  ' ' +
                                                  item['approver']
                                                    .lastName}{' '}
                                            </li>
                                          );
                                        }
                                      )}
                                  </ul>
                                </td>

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
                                                : item['approver'].firstName +
                                                  ' ' +
                                                  item['approver'].lastName}
                                            </li>
                                          );
                                        }
                                      )}
                                  </ul>
                                </td>

                                <td className="w100">
                                  {removeUnderScore(elem.budgetItemStatus)}
                                </td>

                                <td>
                                  <div className="upload-btn cursor-pointer sm-upload">
                                    {(elem.mediaRequests &&
                                      elem.mediaRequests[0] &&
                                      elem.mediaRequests[0].mediaType ===
                                        'application/octet-stream') ||
                                    (elem.mediaRequests &&
                                      elem.mediaRequests[0] &&
                                      elem.mediaRequests[0].mediaType ===
                                        'application/vnd.ms-excel') ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.mediaRequests,
                                          catIndex
                                        )}
                                        src={xlsImage}
                                        width="45"
                                      />
                                    ) : elem.mediaRequests &&
                                      elem.mediaRequests[0] &&
                                      elem.mediaRequests[0].mediaType ===
                                        'application/pdf' ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.mediaRequests,
                                          catIndex
                                        )}
                                        src={pdfImage}
                                        width="45"
                                      />
                                    ) : elem.mediaRequests &&
                                      elem.mediaRequests.mediaType ===
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.mediaRequests,
                                          catIndex
                                        )}
                                        src={docImage}
                                        width="45"
                                      />
                                    ) : elem.mediaRequests &&
                                      elem.mediaRequests[0] &&
                                      elem.mediaRequests[0].mediaType ===
                                        'text/plain' ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.mediaRequests,
                                          catIndex
                                        )}
                                        src={docImage}
                                        width="45"
                                      />
                                    ) : elem.mediaRequests &&
                                      elem.mediaRequests[0] &&
                                      elem.mediaRequests[0].mediaType ===
                                        'application/msword' ? (
                                      <img
                                        onClick={this.imageShow.bind(
                                          this,
                                          elem.id,
                                          elem.mediaRequests,
                                          catIndex
                                        )}
                                        src={docImage}
                                        width="45"
                                      />
                                    ) : (
                                      ''
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
                </div>
              </Modal.Body>
            </Modal>

            <Modal
              show={this.state.deleteConformationModal}
              onHide={this.handleCloseConformation}
              className="custom-popUp confirmation-box"
              bsSize="small"
            >
              <Modal.Body>
                <div className="">
                  <h5 className="text-center">
                    Are you sure you want to delete this?
                  </h5>
                  <div className="text-center">
                    <button
                      className="btn btn-default text-uppercase sm-btn"
                      onClick={event =>
                        this.removeIndirectPurchaseDataRow(event)
                      }
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-success text-uppercase sm-btn"
                      onClick={this.handleCloseConformation}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            {this.state.showImage ? (
              <SliderModal
                show={this.state.showImage}
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
