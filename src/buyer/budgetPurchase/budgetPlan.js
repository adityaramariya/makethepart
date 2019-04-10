import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as moment from 'moment';
import {
  Panel,
  Glyphicon,
  Table,
  FormControl,
  FormGroup,
  ControlLabel,
  Modal,
  DropdownButton
} from 'react-bootstrap';
import Sprite from '../../img/sprite.svg';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import SliderModal from '../slider/sliderModal';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionCheckAccountNo,
  actionGetRevisionUsers,
  actionSaveBudgetOne,
  actionUploadBudgetDocumentse,
  actionAccountNumberData,
  actionGetBudgetExtraData,
  actionDeleteOfBudget,
  actionGetClassifications
} from '../../common/core/redux/actions';
import {
  showSuccessToast,
  showErrorToast,
  removeUnderScore
} from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import _ from 'lodash';
import ReactToPrint from 'react-to-print';
const otherWordStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '176px',
  display: 'block'
};
let { permissionConstant, validationMessages } = CONSTANTS;
class budgetPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'tenth',
      FinancialDate: '05/04/2019',
      show: false,
      inputBy: 1,
      listOfYears: [this.yearObject],
      listOfQuater: [this.quaterlyObject],
      ListOfBudget: [
        {
          budgetItemNo: '',
          accountNo: '',
          address: '',
          currency: '',
          description: '',
          purchaseDescription: '',
          budgetPlan: [],
          mainCategoryId: '',
          spendCategoryId: '',
          subCategoryId: '',
          budgetYearRequests: [],
          addedApproversBy: '',
          programId: '',
          listOfApprovers: [],
          mediaRequests: [
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
      payKey: false,
      commitKey: false,
      inputAmountBy: 'commit_and_pay',
      iscompareBlue: true,
      iscompareRed: true,
      isClone: false,
      resionTitlr:'',
      sectorTitle:'',
      departmentTitle:'',
      majorTitle:'',
      brandTitle:'',
      listOfStatus:['approved','waiting_for_approval','send_back'],
      deleteIndirectPurchaseArray: [],
      deleteArray:[],
      listOfRedComparision: [],
      listOfBlueComparision: [],
      listOfForecastYears:  [],
      listOfForecasts: [],
      listOfRevisions: [],
    };
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.addCategory = this.addCategory.bind(this);
    // this.removeCategory = this.removeCategory.bind(this);
    this.headingChange = this.headingChange.bind(this);
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
    this.handleSaveBudget = this.handleSaveBudget.bind(this);
    this.handleChangeRequest = this.handleChangeRequest.bind(this);
    this.handleUploadDocumentse = this.handleUploadDocumentse.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleCompareValues = this.handleCompareValues.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleGetBudgetRecord = this.handleGetBudgetRecord.bind(this);
    this.createObject = this.createObject.bind(this);
    this.removeIndirectPurchaseDataRow = this.removeIndirectPurchaseDataRow.bind(
      this
    );
    this.deleteConfirmation = this.deleteConfirmation.bind(this);
  }

  componentWillMount() {
    let ListOfBudget = this.state.ListOfBudget;
    ListOfBudget &&
      ListOfBudget.forEach(function(elem, index) {
        elem[index] = [];
      });
    this.setState({ ListOfBudget: ListOfBudget });
  }

  componentDidMount() {
    let _this = this;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };
    let ListOfBudget = this.state.ListOfBudget;
    let cloneBudgetFromList = [];
    let listOfRedComparision = [];
    let listOfBlueComparision = [];
    let listOfForecastYears = [];
    let listOfForecasts = [];
    let listOfRevisions = [];
    let approversLenght = 0;
    let approversLenghtArr = []; 
    let budgetRevisionResponse = [];
    let financialBudgetResponse = [];
    let forecastYearsResponse = []
    let fNo = '';
    let yNo =  '';
    let rNo =  '';

    this.props
      .actionGetClassifications(data)
      .then((result, error) => {
        let purchaseResponse = result.payload.data.resourceData;
        this.setState({
          listOfDepartment: purchaseResponse.listOfDepartment,
          listOfBrands: purchaseResponse.listOfBrands,
          listOfMajorCategory: purchaseResponse.listOfCategory,
          //listOfAddress: purchaseResponse.listOfAddress,
          listOfGlobalRegions: purchaseResponse.listOfGlobalRegions,
          listOfSectorCategory: purchaseResponse.listOfProductLine,
          listOfFunctionalArea: purchaseResponse.listOfDepartment
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    this.props
      .actionGetBudgetExtraData(data)
      .then((result, error) => {

        if (result.payload.data.status == 200) {   
          let resultArray = result.payload.data.resourceData


          let resourceData =
            resultArray.budgetDetailResponse;
            ListOfBudget = resourceData;


          // if(resourceData){
          //   resourceData.forEach(function(element, index) {
          //     if (element && element.listOfApprovers) {
          //       approversLenght =
          //         approversLenght > element.listOfApprovers.length
          //           ? approversLenght
          //           : element.listOfApprovers.length;

          //       approversLenghtArr =
          //         approversLenghtArr.length > element.listOfApprovers.length
          //           ? approversLenghtArr
          //           : element.listOfApprovers;
          //     }
          //   });
            
          // }

           financialBudgetResponse =
            resultArray.financialBudgetResponse;
           ListOfBudget = _this.state.ListOfBudget;
           let date = financialBudgetResponse.dateOfFinancialYear
            ? financialBudgetResponse.dateOfFinancialYear
            : moment().format('DD/MM/YYYY');
         
          if(resultArray && resultArray.cloneBudgetFromList)
           cloneBudgetFromList =
            resultArray.cloneBudgetFromList;
            if(resultArray && resultArray.listOfRedComparision)
           listOfRedComparision =
            resultArray.listOfRedComparision;
            if(resultArray && resultArray.listOfBlueComparision)
           listOfBlueComparision =
            resultArray.listOfBlueComparision;
            if(resultArray && resultArray.listOfForecastYears)
           listOfForecastYears =
            resultArray.listOfForecastYears;
          //   if(resultArray && resultArray.listOfForecasts)
          //  listOfForecasts =
          //   resultArray.listOfForecasts;

          //   if(resultArray && resultArray.listOfRevisions)
          //  listOfRevisions =
          //   resultArray.listOfRevisions;

            if(resultArray && resultArray.budgetRevisionResponse)
             budgetRevisionResponse =
            resultArray.budgetRevisionResponse;
            
            if(listOfForecastYears && listOfForecastYears.length>0){
                listOfForecasts =  _.uniqBy(listOfForecastYears, 'forecastNo');
                listOfRevisions =  _.uniqBy(listOfForecastYears, 'revisionNo');
            }

            if(listOfForecastYears && listOfForecastYears.length>0 && resultArray.forecastYear){
              fNo = resultArray.forecastNo
              yNo =  resultArray.forecastYear
              rNo =  resultArray.revisionNo
             //forecastYearsResponse= listOfForecastYears.find(x =>x.forecastYear === yNo);
           }
           _this.setState(
             {
              ListOfBudget: ListOfBudget,
              dateOfFinancialYear: date,
              financialBudgetId: financialBudgetResponse.id,
              cloneBudgetFromList: cloneBudgetFromList,
              listOfRedComparision: listOfRedComparision,
              listOfBlueComparision: listOfBlueComparision,
              listOfForecastYears: listOfForecastYears,
              // listOfForecasts: listOfForecasts, // listOfForecastYears,
              // listOfRevisions: listOfRevisions,  //listOfForecastYears,
              // approversLenght: approversLenght,
              // approversLenghtArr: approversLenghtArr,
              listOfForecasts:  listOfForecasts,
              listOfRevisions:listOfRevisions,
              forecastNo: fNo,
              forecastYear: yNo,
              revisionNo: rNo,
            }
            // ,this.handleGetAccountDetails()
          );
        }

        if (
          result.payload.data.status == 200 &&
          result.payload.data.resourceData.budgetDetailResponse &&
          result.payload.data.resourceData.budgetDetailResponse.length > 0
        ) {  
          let resourceDataIn =
            result.payload.data.resourceData.budgetDetailResponse;
          _this.setState({
            ListOfBudget: resourceDataIn,
            //ListOfBudgetAll: resourceDataIn,
          });
        } else {
          let date = moment().format('DD/MM/YYYY');
          let yearObject = {
            payAmount: '',
            commitAmount: '',
            yearFrom: moment().format('YYYY'),
            yearTo: moment()
              .add('years', 1)
              .format('YYYY'),
            checkYear: true,
            yearlyAmount: [
              {
                payAmount: '',
                commitAmount: '',
                openQauter: false,
                checkQauter: false,
                date: moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
                year: moment(date, 'DD/MM/YYYY').format('YYYY'),
                inputBy: 1,
                quarterlyAmount: [
                  {
                    payAmount: '',
                    commitAmount: '',
                    month: 'Q1',
                    date: moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
                    openMonth: false,
                    checkMonth: false,
                    monthlyAmount: [
                      {
                        payAmount: '',
                        commitAmount: '',
                        date: moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
                        month: moment(date, 'DD/MM/YYYY').format('MMMM')
                      },
                      {
                        payAmount: '',
                        commitAmount: '',
                        date: moment(date, 'DD/MM/YYYY')
                          .add(1, 'months')
                          .format('DD/MM/YYYY'),
                        month: moment(date, 'DD/MM/YYYY')
                          .add(1, 'months')
                          .format('MMMM')
                      },
                      {
                        payAmount: '',
                        commitAmount: '',
                        date: moment(date, 'DD/MM/YYYY')
                          .add(2, 'months')
                          .format('DD/MM/YYYY'),
                        month: moment(date, 'DD/MM/YYYY')
                          .add(2, 'months')
                          .format('MMMM')
                      }
                    ]
                  },
                  {
                    payAmount: '',
                    commitAmount: '',
                    month: 'Q2',
                    openMonth: false,
                    date: moment(date, 'DD/MM/YYYY')
                      .add(3, 'months')
                      .format('DD/MM/YYYY'),
                    monthlyAmount: [
                      {
                        payAmount: '',
                        commitAmount: '',
                        date: moment(date, 'DD/MM/YYYY')
                          .add(3, 'months')
                          .format('DD/MM/YYYY'),
                        month: moment(date, 'DD/MM/YYYY')
                          .add(3, 'months')
                          .format('MMMM')
                      },
                      {
                        payAmount: '',
                        commitAmount: '',
                        date: moment(date, 'DD/MM/YYYY')
                          .add(4, 'months')
                          .format('DD/MM/YYYY'),
                        month: moment(date, 'DD/MM/YYYY')
                          .add(4, 'months')
                          .format('MMMM')
                      },
                      {
                        payAmount: '',
                        commitAmount: '',
                        date: moment(date, 'DD/MM/YYYY')
                          .add(5, 'months')
                          .format('DD/MM/YYYY'),
                        month: moment(date, 'DD/MM/YYYY')
                          .add(5, 'months')
                          .format('MMMM')
                      }
                    ]
                  },
                  {
                    payAmount: '',
                    commitAmount: '',
                    month: 'Q3',
                    openMonth: false,
                    date: moment(date, 'DD/MM/YYYY')
                      .add(6, 'months')
                      .format('DD/MM/YYYY'),
                    monthlyAmount: [
                      {
                        payAmount: '',
                        commitAmount: '',
                        date: moment(date, 'DD/MM/YYYY')
                          .add(6, 'months')
                          .format('DD/MM/YYYY'),
                        month: moment(date, 'DD/MM/YYYY')
                          .add(6, 'months')
                          .format('MMMM')
                      },
                      {
                        payAmount: '',
                        commitAmount: '',
                        date: moment(date, 'DD/MM/YYYY')
                          .add(7, 'months')
                          .format('DD/MM/YYYY'),
                        month: moment(date, 'DD/MM/YYYY')
                          .add(7, 'months')
                          .format('MMMM')
                      },
                      {
                        payAmount: '',
                        commitAmount: '',
                        date: moment(date, 'DD/MM/YYYY')
                          .add(8, 'months')
                          .format('DD/MM/YYYY'),
                        month: moment(date, 'DD/MM/YYYY')
                          .add(8, 'months')
                          .format('MMMM')
                      }
                    ]
                  },
                  {
                    payAmount: '',
                    commitAmount: '',
                    month: 'Q4',
                    openMonth: false,
                    date: moment(date, 'DD/MM/YYYY')
                      .add(9, 'months')
                      .format('DD/MM/YYYY'),
                    monthlyAmount: [
                      {
                        payAmount: '',
                        commitAmount: '',
                        date: moment(date, 'DD/MM/YYYY')
                          .add(9, 'months')
                          .format('DD/MM/YYYY'),
                        month: moment(date, 'DD/MM/YYYY')
                          .add(9, 'months')
                          .format('MMMM')
                      },
                      {
                        payAmount: '',
                        commitAmount: '',
                        date: moment(date, 'DD/MM/YYYY')
                          .add(10, 'months')
                          .format('DD/MM/YYYY'),
                        month: moment(date, 'DD/MM/YYYY')
                          .add(10, 'months')
                          .format('MMMM')
                      },
                      {
                        payAmount: '',
                        commitAmount: '',
                        date: moment(date, 'DD/MM/YYYY')
                          .add(11, 'months')
                          .format('DD/MM/YYYY'),
                        month: moment(date, 'DD/MM/YYYY')
                          .add(11, 'months')
                          .format('MMMM')
                      }
                    ]
                  }
                ]
              }
            ],
            quaterFlag: false,
            monthFlag: false,
            inputBy: 1
          };
          ListOfBudget[0].budgetYearRequests.push(yearObject);
          _this.setState({
            ListOfBudget: ListOfBudget,
            //ListOfBudgetAll: ListOfBudget,
            dateOfFinancialYear: date
          });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }


handleGetExtraData(type){

console.log("this.state------------",this.state);


   if(!this.state.forecastYear || !this.state.forecastNo || !this.state.revisionNo){
      showErrorToast('ForecastYear, forecastNo and revisionNo are required feild');
      return true;
    }
       let _this = this;
      let ListOfBudget = this.state.ListOfBudget;
      let cloneBudgetFromList = [];
      let listOfRedComparision = [];
      let listOfBlueComparision = [];
      let financialBudgetResponse = [];
      let listOfForecastYears = [];
      let listOfForecasts = [];
      let listOfRevisions = [];
      let approversLenght = 0;
      let approversLenghtArr = []; 
      let budgetRevisionResponse = [];
      let forecastYearsResponse = []
      let fNo = '';
      let yNo =  '';
      let rNo =  '';
      let data = {
        roleId: this.props.userInfo.userData.userRole,
        userId: this.props.userInfo.userData.id,
        revisionNo:this.state.revisionNo,
        forecastNo:this.state.forecastNo,
        forecastYear:this.state.forecastYear,
        listBy:this.state.status,

        redRevisionNo:this.state.redRevisionNo,
        redForecastNo:this.state.redForecastNo,
        redForecastYear:this.state.redForecastYear,

        blueRevisionNo:this.state.blueRevisionNo,
        blueForecastNo:this.state.blueForecastNo,
        blueForecastYear:this.state.blueForecastYear,
      };  

        this.props
        .actionGetBudgetExtraData(data)
        .then((result, error) => {
      
          if (result.payload.data.status == 200) {   
            let resultArray = result.payload.data.resourceData
      
            let resourceData = resultArray.budgetDetailResponse;


            ListOfBudget = resourceData;




            // if(resourceData){
            //   resourceData.forEach(function(element, index) {
            //     if (element && element.listOfApprovers) {
            //       approversLenght =
            //         approversLenght > element.listOfApprovers.length
            //           ? approversLenght
            //           : element.listOfApprovers.length;
      
            //       approversLenghtArr =
            //         approversLenghtArr.length > element.listOfApprovers.length
            //           ? approversLenghtArr
            //           : element.listOfApprovers;
            //     }
            //   });
            // }

            financialBudgetResponse = resultArray.financialBudgetResponse;
            let date = financialBudgetResponse.dateOfFinancialYear
              ? financialBudgetResponse.dateOfFinancialYear
              : moment().format('DD/MM/YYYY');

            if(resultArray && resultArray.cloneBudgetFromList)
            cloneBudgetFromList =
              resultArray.cloneBudgetFromList;

              if(resultArray && resultArray.listOfRedComparision)
            listOfRedComparision =
              resultArray.listOfRedComparision;

              if(resultArray && resultArray.listOfBlueComparision)
            listOfBlueComparision =
              resultArray.listOfBlueComparision;

              if(resultArray && resultArray.listOfForecastYears)
            listOfForecastYears =
              resultArray.listOfForecastYears;

            //   if(resultArray && resultArray.listOfForecasts)
            // listOfForecasts =
            //   resultArray.listOfForecasts;
      
            //   if(resultArray && resultArray.listOfRevisions)
            // listOfRevisions =
            //   resultArray.listOfRevisions;
      
              if(resultArray && resultArray.budgetRevisionResponse)
              budgetRevisionResponse =
              resultArray.budgetRevisionResponse;
              
      
            //   if(listOfForecastYears && listOfForecastYears.length>0 && resultArray.forecastYear){
            //     fNo = resultArray.forecastNo
            //     yNo =  resultArray.forecastYear
            //     rNo =  resultArray.revisionNo
            //    forecastYearsResponse = listOfForecastYears.find(x =>x.forecastYear === yNo);
            //  }
      
            _this.setState(
              {
                ListOfBudget: ListOfBudget,
                dateOfFinancialYear: date,
                financialBudgetId: financialBudgetResponse.id,
                cloneBudgetFromList: cloneBudgetFromList,
                listOfRedComparision: listOfRedComparision,
                listOfBlueComparision: listOfBlueComparision,
                //listOfForecastYears: listOfForecastYears,


               // listOfForecasts: listOfForecastYears,
               // listOfRevisions: listOfForecastYears,
                // approversLenght: approversLenght,
                // approversLenghtArr: approversLenghtArr,
               // forecastNo:  fNo,
               // forecastYear:  yNo,
               // revisionNo:  rNo,
              }
              //,
              //this.handleGetAccountDetails()
            );
            if(type == 'cloneBudget'){
              _this.setState(
                {
                  ListOfBudgetClone:resourceData
                })
              }
          }
      
          if (
            result.payload.data.status == 200 &&
            result.payload.data.resourceData.budgetDetailResponse &&
            result.payload.data.resourceData.budgetDetailResponse.length > 0
          ) {  
            let resourceDataIn =
              result.payload.data.resourceData.budgetDetailResponse;
            _this.setState({
              ListOfBudget: resourceDataIn,
              //ListOfBudgetAll: resourceDataIn,
            });
          } else {
            let date = moment().format('DD/MM/YYYY');
            let yearObject = {
              payAmount: '',
              commitAmount: '',
              yearFrom: moment().format('YYYY'),
              yearTo: moment()
                .add('years', 1)
                .format('YYYY'),
              checkYear: true,
      
              yearlyAmount: [
                {
                  payAmount: '',
                  commitAmount: '',
                  openQauter: false,
                  checkQauter: false,
                  date: moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
                  year: moment(date, 'DD/MM/YYYY').format('YYYY'),
                  inputBy: 1,
                  quarterlyAmount: [
                    {
                      payAmount: '',
                      commitAmount: '',
                      month: 'Q1',
                      date: moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
                      openMonth: false,
                      checkMonth: false,
                      monthlyAmount: [
                        {
                          payAmount: '',
                          commitAmount: '',
                          date: moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
                          month: moment(date, 'DD/MM/YYYY').format('MMMM')
                        },
                        {
                          payAmount: '',
                          commitAmount: '',
                          date: moment(date, 'DD/MM/YYYY')
                            .add(1, 'months')
                            .format('DD/MM/YYYY'),
                          month: moment(date, 'DD/MM/YYYY')
                            .add(1, 'months')
                            .format('MMMM')
                        },
                        {
                          payAmount: '',
                          commitAmount: '',
                          date: moment(date, 'DD/MM/YYYY')
                            .add(2, 'months')
                            .format('DD/MM/YYYY'),
                          month: moment(date, 'DD/MM/YYYY')
                            .add(2, 'months')
                            .format('MMMM')
                        }
                      ]
                    },
                    {
                      payAmount: '',
                      commitAmount: '',
                      month: 'Q2',
                      openMonth: false,
                      date: moment(date, 'DD/MM/YYYY')
                        .add(3, 'months')
                        .format('DD/MM/YYYY'),
                      monthlyAmount: [
                        {
                          payAmount: '',
                          commitAmount: '',
                          date: moment(date, 'DD/MM/YYYY')
                            .add(3, 'months')
                            .format('DD/MM/YYYY'),
                          month: moment(date, 'DD/MM/YYYY')
                            .add(3, 'months')
                            .format('MMMM')
                        },
                        {
                          payAmount: '',
                          commitAmount: '',
                          date: moment(date, 'DD/MM/YYYY')
                            .add(4, 'months')
                            .format('DD/MM/YYYY'),
                          month: moment(date, 'DD/MM/YYYY')
                            .add(4, 'months')
                            .format('MMMM')
                        },
                        {
                          payAmount: '',
                          commitAmount: '',
                          date: moment(date, 'DD/MM/YYYY')
                            .add(5, 'months')
                            .format('DD/MM/YYYY'),
                          month: moment(date, 'DD/MM/YYYY')
                            .add(5, 'months')
                            .format('MMMM')
                        }
                      ]
                    },
                    {
                      payAmount: '',
                      commitAmount: '',
                      month: 'Q3',
                      openMonth: false,
                      date: moment(date, 'DD/MM/YYYY')
                        .add(6, 'months')
                        .format('DD/MM/YYYY'),
                      monthlyAmount: [
                        {
                          payAmount: '',
                          commitAmount: '',
                          date: moment(date, 'DD/MM/YYYY')
                            .add(6, 'months')
                            .format('DD/MM/YYYY'),
                          month: moment(date, 'DD/MM/YYYY')
                            .add(6, 'months')
                            .format('MMMM')
                        },
                        {
                          payAmount: '',
                          commitAmount: '',
                          date: moment(date, 'DD/MM/YYYY')
                            .add(7, 'months')
                            .format('DD/MM/YYYY'),
                          month: moment(date, 'DD/MM/YYYY')
                            .add(7, 'months')
                            .format('MMMM')
                        },
                        {
                          payAmount: '',
                          commitAmount: '',
                          date: moment(date, 'DD/MM/YYYY')
                            .add(8, 'months')
                            .format('DD/MM/YYYY'),
                          month: moment(date, 'DD/MM/YYYY')
                            .add(8, 'months')
                            .format('MMMM')
                        }
                      ]
                    },
                    {
                      payAmount: '',
                      commitAmount: '',
                      month: 'Q4',
                      openMonth: false,
                      date: moment(date, 'DD/MM/YYYY')
                        .add(9, 'months')
                        .format('DD/MM/YYYY'),
                      monthlyAmount: [
                        {
                          payAmount: '',
                          commitAmount: '',
                          date: moment(date, 'DD/MM/YYYY')
                            .add(9, 'months')
                            .format('DD/MM/YYYY'),
                          month: moment(date, 'DD/MM/YYYY')
                            .add(9, 'months')
                            .format('MMMM')
                        },
                        {
                          payAmount: '',
                          commitAmount: '',
                          date: moment(date, 'DD/MM/YYYY')
                            .add(10, 'months')
                            .format('DD/MM/YYYY'),
                          month: moment(date, 'DD/MM/YYYY')
                            .add(10, 'months')
                            .format('MMMM')
                        },
                        {
                          payAmount: '',
                          commitAmount: '',
                          date: moment(date, 'DD/MM/YYYY')
                            .add(11, 'months')
                            .format('DD/MM/YYYY'),
                          month: moment(date, 'DD/MM/YYYY')
                            .add(11, 'months')
                            .format('MMMM')
                        }
                      ]
                    }
                  ]
                }
              ],
              quaterFlag: false,
              monthFlag: false,
              inputBy: 1
            };
      
            ListOfBudget[0].budgetYearRequests.push(yearObject);
            _this.setState({
              ListOfBudget: ListOfBudget,
              //ListOfBudgetAll: ListOfBudget,
              dateOfFinancialYear: date
            });
          }
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
   }


  // startMonth should be january or april
  handleGetAccountDetails() {
    let _this = this;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      
    };
    this.props
      .actionAccountNumberData(data)
      .then((result, error) => {
        _this.setState({
          listOfAccountDetails: result.payload.data.resourceData.list
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }
  handleGetBudgetRecord(inputBy) {
    let _this = this;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };
    this.props
      .actionGetBudgetExtraData(data)
      .then((result, error) => {
        let resourceData =
          result.payload.data.resourceData.budgetDetailResponse;
        if (result.payload.data.status == 200) {
          let yearObject = {
            payAmount: '',
            amountReqId:'',
            commitAmount: '',
            yearFrom: moment()
              .add('years', 1)
              .format('YYYY'),
            yearTo: moment()
              .add('years', 1 + 1)
              .format('YYYY'),
            quaterFlag: false,
            monthFlag: false,
            amountReqId: ''
          };

          resourceData &&
            resourceData.forEach(function(elem, index) {
              if (elem.budgetYearRequests == undefined) {
                elem.budgetYearRequests = [];
                elem.budgetYearRequests = [yearObject];
              }
            });

          _this.setState({
            ListOfBudget: resourceData,
            inputBy: inputBy
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


  createObject(dateValue,checkYear,checkQauter,checkMonth) {


console.log("(dateValue,checkYear,checkQauter,checkMont==",dateValue,checkYear,checkQauter,checkMonth);

    let yearObject = {
      payAmount: '',
      commitAmount: '',
      amountReqId:'',
      yearFrom: moment(dateValue).format('YYYY'),
      yearTo: moment(dateValue)
        .add('years', 1)
        .format('YYYY'),
      checkYear: true,
      yearlyAmount: [
        {
          payAmount: '',
          commitAmount: '',
          checkQauter:  false,
          openQauter: checkQauter?checkQauter:'',
          date: moment(dateValue).format('DD/MM/YYYY'),
          year: moment(dateValue).format('YYYY'),
          inputBy: 1,
          quarterlyAmount: [
            {
              payAmount: '',
              commitAmount: '',
              checkMonth:  false,
              openMonth: checkMonth?checkMonth:'',
              date: moment(dateValue).format('DD/MM/YYYY'),
              month: 'Q1',
              monthlyAmount: [
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(1, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(1, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(2, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(2, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(3, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(3, 'months')
                    .format('MMMM')
                }
              ]
            },
            {
              payAmount: '',
              commitAmount: '',
              month: 'Q2',
              openMonth: false,
              date: moment(dateValue)
                .add(3, 'months')
                .format('DD/MM/YYYY'),
              monthlyAmount: [
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(4, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(4, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(5, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(5, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(6, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(6, 'months')
                    .format('MMMM')
                }
              ]
            },
            {
              payAmount: '',
              commitAmount: '',
              openMonth: false,
              month: 'Q3',
              date: moment(dateValue)
                .add(6, 'months')
                .format('DD/MM/YYYY'),
              monthlyAmount: [
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(7, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(7, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(8, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(8, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(9, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(9, 'months')
                    .format('MMMM')
                }
              ]
            },
            {
              payAmount: '',
              commitAmount: '',
              openMonth: false,
              month: 'Q4',
              date: moment(dateValue)
                .add(9, 'months')
                .format('DD/MM/YYYY'),
              monthlyAmount: [
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(10, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(10, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(11, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(11, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(12, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(12, 'months')
                    .format('MMMM')
                }
              ]
            }
          ]
        }
      ],
      quaterFlag: false,
      monthFlag: false,
      inputBy: 1
    };
    return yearObject;
  }
  addCategory(event) {
    let _this = this;
    let dateValue = moment(this.state.dateOfFinancialYear, 'DD/MM/YYYY').format(
      'MM/DD/YYYY'
    );
    let ListOfBudget = this.state.ListOfBudget;
    let approversLenghtArr = '';
    let obj = [];
    let listOfYear = []
    approversLenghtArr =
      ListOfBudget && ListOfBudget[0] && ListOfBudget[0].budgetYearRequests && ListOfBudget[0].budgetYearRequests.length;
    
    ListOfBudget[0] &&
      ListOfBudget[0].budgetYearRequests.forEach(function(element, index) {
        console.log("element----",element);
        dateValue = moment(dateValue, 'DD/MM/YYYY')
          .add(index, 'years')
          .format('MM/DD/YYYY');
        
        let item = _this.createObject(dateValue,element.openYear,element.yearlyAmount[0].openQauter,element.yearlyAmount[0].quarterlyAmount[0].openMonth);
  
        obj.push(item);
        dateValue = moment(dateValue, 'DD/MM/YYYY').format('MM/DD/YYYY');
      });

if(obj && obj.length > 0){
console.log("if");
  listOfYear = obj;
}  
else{
  console.log("Else");
  let item = _this.createObject(dateValue);
  obj.push(item);
   listOfYear = obj;
}
    let categoryObject = {
      description: '',
      purchaseDescription: '',
      sourceCountry: '',
      specificationNo: '',
      toolLifeQuantity: '',
      unitCost: '',
      quantity: '',
      totalCost: '',
      taxTotal: '',
      budgetYearRequests: listOfYear,
      total: '',
      projectId: '',
      listOfApprovers: [],
      mediaRequests: []
    };

    let length =
      ListOfBudget && ListOfBudget.length > 0 ? ListOfBudget.length : 0;
    if (
      length != 0 &&
      ListOfBudget &&
      ListOfBudget[length - 1] &&
      (ListOfBudget[length - 1].budgetItemNo == '' ||
        ListOfBudget[length - 1].budgetItemNo == undefined)
    ) {
      showErrorToast('Please enter all detail first');
    } else {
      ListOfBudget.push(categoryObject);
      this.setState({ ListOfBudget: ListOfBudget });
    }
  }

  headingChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  dropdownChange(event, catIndex, tableIndex) {
    const { name, value } = event.target;
    let noOfTable = this.state.noOfTable;
    noOfTable[tableIndex][catIndex][name] = value;
    this.setState({ noOfTable: noOfTable });
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
    let ListOfBudget = this.state.ListOfBudget;
    let yearlyAmount =
      ListOfBudget[indexBud] &&
      ListOfBudget[indexBud].budgetYearRequests[indexYear];

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

  handleSetInputBy(event, type, indexBud, indexYear) {
    const { name, value, checked } = event.target;

    //console.log(" name, value", name, value)
    let ListOfBudget = this.state.ListOfBudget;
    let yearlyAmount = ListOfBudget[indexBud].budgetYearRequests[indexYear];
    let checkYear = false;
    let checkQauter = false;
    let checkMonth = false;
    let openQauter = false;
    let openMonth = false;
    let openYear = false;
    let inputBy = 1;
    // totalCommitAmount: "0"
    // totalPayAmount: "0"

    yearlyAmount.totalCommitAmount = 0;
    yearlyAmount.totalPayAmount = 0;

    if (type == 'YEAR') {
      checkYear = true;
      checkQauter = false;
      checkMonth = false;
    } else if (type == 'QAUTER') {
      inputBy = 4;
      checkYear = false;
      checkQauter = true;
      checkMonth = false;
      openQauter = true;
      openMonth = false;
    } else if (type == 'MONTH') {
      inputBy = 12;
      checkYear = false;
      checkQauter = false;
      checkMonth = true;

      openQauter = true;
      openMonth = true;
    }

    ListOfBudget &&
      ListOfBudget.forEach(function(element, indexB) {
        element &&
          element.budgetYearRequests.forEach(function(elementBud, indexY) {
            elementBud &&
              elementBud.yearlyAmount.forEach(function(elementQauter, indexQ) {


                if (indexBud == indexB && indexYear == indexY) {
                 // elementQauter.payAmount = '';
                //  elementQauter.commitAmount = '';
                  ListOfBudget[indexB].budgetYearRequests[indexY].yearlyAmount[
                    indexQ
                  ].checkQauter = checkQauter;
                }

                if (indexYear == indexY) elementQauter.openQauter = openQauter;

                elementQauter.quarterlyAmount.forEach(function(
                  elementMonth,
                  indexM
                ) {


                  if (indexYear == indexY) elementMonth.openMonth = openMonth;

                  if (indexBud == indexB && indexYear == indexY) {
                   // elementMonth.payAmount = '';
                   // elementMonth.commitAmount = '';
                    elementMonth.checkMonth = checkMonth;
                  }

                  elementMonth.monthlyAmount.forEach(function(item, indexItem) {
                  //  item.payAmount = '';
                  //  item.commitAmount = '';
                  });
                });
              });
          });
        //console.log("element--",element);
      });

    //     yearlyAmount &&
    //     yearlyAmount.yearlyAmount.forEach(function(element, index) {
    // console.log("QAUTER element-----",element);
    //         element.payAmount = '';
    //         element.commitAmount = '';
    //         element.openQauter = openQauter;
    //           element.quarterlyAmount.forEach(function(elementMonth, index) {

    //               elementMonth.payAmount = '';
    //               elementMonth.commitAmount = '';
    //               elementMonth.openMonth = openMonth;
    //               elementMonth.checkMonth = checkMonth;
    //               elementMonth.monthlyAmount.forEach(function(item, indexItem) {

    //                   item.payAmount = '';
    //                   item.commitAmount = '';
    //                 });
    //             });
    //       element.checkQauter = checkQauter;
    //     });

    yearlyAmount.checkYear = checkYear;

    yearlyAmount.inputBy = inputBy;
    ListOfBudget[indexBud].budgetYearRequests[indexYear] = yearlyAmount;
    this.setState({
      ListOfBudget: ListOfBudget
    });
  }

  openMonthlyShowHideCollapse(event) {
    //alert('monthly call');
  }

  addToolYear(event) {
    let _this = this;
    let ListOfBudget = this.state.ListOfBudget;
    let itemIndex = this.state.ListOfBudget[0] && this.state.ListOfBudget[0].budgetYearRequests && this.state.ListOfBudget[0].budgetYearRequests.length;
    
    let date = this.state.ListOfBudget[0].budgetYearRequests[itemIndex-1].yearlyAmount[0].date
    if(itemIndex == '' || date == undefined){
        return false;
    }

    let yearRange =
      this.state.listOfYears &&
      this.state.listOfYears[0] &&
      this.state.listOfYears[0].length
        ? this.state.listOfYears[0].length
        : 1;

    let dateValue = moment(date, 'DD/MM/YYYY').add('years', 1).format('MM/DD/YYYY');
    let yearObject = {
      payAmount: '',
      commitAmount: '',
      yearFrom: moment(dateValue).format('YYYY'),
      yearTo: moment(dateValue)
        .add('years', 1)
        .format('YYYY'),
      checkYear: true,
      yearlyAmount: [
        {
          payAmount: '',
          commitAmount: '',
          openQauter: false,
          checkQauter: false,
          date: moment(dateValue).format('DD/MM/YYYY'),
          year: moment(dateValue).format('YYYY'),
          inputBy: 1,
          quarterlyAmount: [
            {
              payAmount: '',
              commitAmount: '',
              openMonth: false,
              checkMonth: false,
              date: moment(dateValue).format('DD/MM/YYYY'),
              month: 'Q1',
              monthlyAmount: [
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(1, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(1, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(2, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(2, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(3, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(3, 'months')
                    .format('MMMM')
                }
              ]
            },
            {
              payAmount: '',
              commitAmount: '',
              month: 'Q2',
              openMonth: false,
              date: moment(dateValue)
                .add(3, 'months')
                .format('DD/MM/YYYY'),
              monthlyAmount: [
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(4, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(4, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(5, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(5, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(6, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(6, 'months')
                    .format('MMMM')
                }
              ]
            },
            {
              payAmount: '',
              commitAmount: '',
              openMonth: false,
              month: 'Q3',
              date: moment(dateValue)
                .add(6, 'months')
                .format('DD/MM/YYYY'),
              monthlyAmount: [
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(7, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(7, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(8, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(8, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(9, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(9, 'months')
                    .format('MMMM')
                }
              ]
            },
            {
              payAmount: '',
              commitAmount: '',
              openMonth: false,
              month: 'Q4',
              date: moment(dateValue)
                .add(9, 'months')
                .format('DD/MM/YYYY'),
              monthlyAmount: [
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(10, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(10, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(11, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(11, 'months')
                    .format('MMMM')
                },
                {
                  payAmount: '',
                  commitAmount: '',
                  date: moment(dateValue)
                    .add(12, 'months')
                    .format('DD/MM/YYYY'),
                  month: moment(dateValue)
                    .add(12, 'months')
                    .format('MMMM')
                }
              ]
            }
          ]
        }
      ],
      quaterFlag: false,
      monthFlag: false,
      inputBy: 1
    };

    // let yearObject = {
    //   payAmount: '',
    //   commitAmount: '',
    //   yearFrom: moment()
    //     .add('years', yearRange)
    //     .format('YYYY'),
    //   yearTo: moment()
    //     .add('years', yearRange + 1)
    //     .format('YYYY'),
    //   quaterFlag: false,
    //   yearlyAmount : [
    //     { payAmount: '', commitAmount: '',month:'Y1',
    //    quarterlyAmount:[
    //      { payAmount: '', commitAmount: '',month:'Q1',
    //    month: [
    //    { payAmount: '', commitAmount: '',month:'month1' },
    //    { payAmount: '', commitAmount: '',month:'month2'  },
    //    { payAmount: '', commitAmount: '',month:'month3'  }]
    //    },
    //    { payAmount: '', commitAmount: '',month:'Q2' ,
    //    month: [,
    //    { payAmount: '', commitAmount: '',month:'month4' },
    //    { payAmount: '', commitAmount: '',month:'month5'  },
    //    { payAmount: '', commitAmount: '',month:'month6'  }]
    //    },
    //    { payAmount: '', commitAmount: '',month:'Q3',
    //    month: [,
    //    { payAmount: '', commitAmount: '',month:'month7' },
    //    { payAmount: '', commitAmount: '',month:'month8'  },
    //    { payAmount: '', commitAmount: '',month:'month9'  }]
    //    },
    //    { payAmount: '', commitAmount: '',month:'Q4',
    //    month: [,
    //    { payAmount: '', commitAmount: '',month:'month10' },
    //    { payAmount: '', commitAmount: '',month:'month11'  },
    //    { payAmount: '', commitAmount: '',month:'month12'  }]
    //    }
    //    ]
    //    }
    //    ],
    //   monthFlag: false,
    //   amountReqId:''
    // };

    let toolList = [];
    ListOfBudget.map(function(item, index) {
      item.budgetYearRequests.push(yearObject);
      if (index === 0) toolList.push(item.budgetYearRequests);
    });

    this.setState({ listOfYears: toolList });
    this.setState({ ListOfBudget: ListOfBudget });
  }

  addQuaterly(event, quaterIndex, quaterFlag) {
    let _this = this;
    let ListOfBudget = this.state.ListOfBudget;
    let quaterlyObject = this.quaterlyObject;
    if (quaterFlag) {
      ListOfBudget.map(function(item, index) {
        item.budgetYearRequests[quaterIndex].listOfMonthlyDetails = [];
        item.budgetYearRequests[quaterIndex].listOfQuaterlyDetails = [];
        item.budgetYearRequests[quaterIndex].quaterFlag = false;
        item.budgetYearRequests[quaterIndex].inputBy = 1;
      });
    } else {
      ListOfBudget.map(function(item, index) {
        item.budgetYearRequests[quaterIndex].listOfMonthlyDetails = [];
        item.budgetYearRequests[quaterIndex].listOfQuaterlyDetails = [];
        item.budgetYearRequests[quaterIndex].listOfQuaterlyDetails.push(
          quaterlyObject
        );
        item.budgetYearRequests[quaterIndex].quaterFlag = true;
        item.budgetYearRequests[quaterIndex].inputBy = 4;
      });
    }
    this.setState({ ListOfBudget: ListOfBudget });
  }

  addMonthly(event, monthIndex, monthFlag) {
    let _this = this;
    let ListOfBudget = this.state.ListOfBudget;

    let monthsObject = this.monthsObject;

    if (monthFlag) {
      ListOfBudget.map(function(item, index) {
        item.budgetYearRequests[monthIndex].listOfQuaterlyDetails = [];
        item.budgetYearRequests[monthIndex].listOfMonthlyDetails = [];
        item.budgetYearRequests[monthIndex].monthFlag = false;
        item.budgetYearRequests[monthIndex].inputBy = 1;
      });
    } else {
      ListOfBudget.map(function(item, index) {
        item.budgetYearRequests[monthIndex].listOfQuaterlyDetails = [];
        item.budgetYearRequests[monthIndex].listOfMonthlyDetails = [];
        item.budgetYearRequests[monthIndex].listOfMonthlyDetails.push(
          monthsObject
        );
        item.budgetYearRequests[monthIndex].monthFlag = true;
        item.budgetYearRequests[monthIndex].inputBy = 12;
      });
    }
    this.setState({ ListOfBudget: ListOfBudget });
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
    } else if (name === 'total') {
      ListOfBudget[catIndex][name] = parseFloat(value) ? parseFloat(value) : '';
    }
    let categoryData = this.state.ListOfBudget[catIndex];

    if (!categoryData.budgetItemNo) {
      let createdAccountNo =
        'RJ' + moment().format('MMYYYYDD') + moment().format('sshhmm');
      if (
        categoryData.mainCategoryId &&
        categoryData.spendCategoryId &&
        categoryData.departmentId &&
        categoryData.subCategoryId
      ) {
        ListOfBudget[catIndex].budgetItemNo = createdAccountNo;
        ListOfBudget[catIndex].showAccountText = true;
      }
    }
    this.setState({ ListOfBudget: ListOfBudget });
  }

  handleOnChange(
    event,
    type,
    catIndex,
    indexObj,
    indexYear,
    indexQauter,
    indexMonth
  ) {
    const { name, value, checked } = event.target;
    let ListOfBudget = this.state.ListOfBudget;

console.log("    catIndex,indexObj,indexYear,ndexQauter,indexMonth",    catIndex,
indexObj,
indexYear,
indexQauter,
indexMonth,name);


    if (type === 'YEAR') {
      ListOfBudget[catIndex].budgetYearRequests[indexYear].yearlyAmount[0][
        name
      ] = parseFloat(value) ? parseFloat(value) : '';
       // this.totalCommitAmountPayYear();
    } else if (type === 'QAUTER') {
      ListOfBudget[catIndex].budgetYearRequests[
        indexYear
      ].yearlyAmount[0].quarterlyAmount[indexQauter][name] = parseFloat(value)
        ? parseFloat(value)
        : '';
    } else if (type === 'MONTH') {
      ListOfBudget[catIndex].budgetYearRequests[
        indexYear
      ].yearlyAmount[0].quarterlyAmount[indexQauter].monthlyAmount[indexMonth][
        name
      ] = parseFloat(value) ? parseFloat(value) : '';
    }
    //this.totalCommitAmountPay()
    //  this.setState({ ListOfBudget: ListOfBudget });

    this.setState(
      {
        ListOfBudget: ListOfBudget
      },

      this.totalCommitAmountPay(type,catIndex)
    );
  }
  
  totalCommitAmountPay(type,index) {
    let ListOfBudgetWithAll = this.state.ListOfBudget;
    let ListOfBudget = ListOfBudgetWithAll[index];

      let totalCommitAmount = 0;
      let totalPayAmount = 0;
      let quaterDataPay = 0;
      let quaterDataCommit = 0;
      let monthDataCommit = 0;
      let monthDataPay = 0;
      let yearDataCommit = 0;
      let yearDataPay = 0;
      ListOfBudget.budgetYearRequests.forEach(function(dataitem, indexItem) {
        quaterDataPay = 0;
        quaterDataCommit = 0;
        monthDataCommit = 0;
        monthDataPay = 0;
        yearDataCommit = 0;
        yearDataPay = 0;
        if (dataitem.checkYear || dataitem.checkYear == undefined) {



        if (type == 'YEAR') {
          quaterDataCommit = ListOfBudget.budgetYearRequests[
            indexItem
          ].yearlyAmount[0].commitAmount/4;

          quaterDataPay = ListOfBudget.budgetYearRequests[
            indexItem
          ].yearlyAmount[0].payAmount/4;

          monthDataCommit = ListOfBudget.budgetYearRequests[
            indexItem
          ].yearlyAmount[0].commitAmount/12;

          monthDataPay = ListOfBudget.budgetYearRequests[
            indexItem
          ].yearlyAmount[0].payAmount/12;

          yearDataCommit = ListOfBudget.budgetYearRequests[
            indexItem
          ].yearlyAmount[0].commitAmount  ;

          yearDataPay =  ListOfBudget.budgetYearRequests[
            indexItem
          ].yearlyAmount[0].payAmount;
        }
      }
          dataitem.yearlyAmount[0].quarterlyAmount.forEach(function(
            dataitemQauter,
            indexQauter
          ) {  
            if (type == 'QAUTER') {
              
             // totalPayAmount = totalPayAmount + dataitemQauter.payAmount;
             // totalCommitAmount = totalCommitAmount + dataitemQauter.commitAmount;

               yearDataCommit = dataitemQauter.commitAmount + yearDataCommit  
               yearDataPay = dataitemQauter.payAmount + yearDataPay

               monthDataCommit = dataitemQauter.commitAmount/3
               monthDataPay = dataitemQauter.payAmount/3;

              quaterDataPay = dataitemQauter.payAmount;
              quaterDataCommit = dataitemQauter.commitAmount
            } 
            if (type == 'MONTH') {
              quaterDataPay = 0;
              quaterDataCommit = 0;
              }
            dataitemQauter.monthlyAmount.forEach(function(
                dataitemMonth,
                indexMonth
              ) {

                if (type == 'MONTH') {
                 // totalPayAmount = totalPayAmount + dataitemMonth.payAmount;
                 // totalCommitAmount = totalCommitAmount + dataitemMonth.commitAmount;
                  quaterDataCommit = dataitemMonth.commitAmount + quaterDataCommit  

                  quaterDataPay = dataitemMonth.payAmount + quaterDataPay

                  monthDataPay = dataitemMonth.payAmount;
                  monthDataCommit = dataitemMonth.commitAmount
                  yearDataPay = totalPayAmount
                  yearDataCommit = totalCommitAmount
                }

                ListOfBudget.budgetYearRequests[
                  indexItem
                ].yearlyAmount[0].quarterlyAmount[indexQauter].monthlyAmount[indexMonth][
                  'payAmount'] = monthDataPay;

                ListOfBudget.budgetYearRequests[
                  indexItem
                ].yearlyAmount[0].quarterlyAmount[indexQauter].monthlyAmount[indexMonth][
                  'commitAmount'] = monthDataCommit;
              });

                ListOfBudget.budgetYearRequests[
                  indexItem
                ].yearlyAmount[0].quarterlyAmount[indexQauter]['payAmount'] = quaterDataPay;
                      
                ListOfBudget.budgetYearRequests[
                  indexItem
                ].yearlyAmount[0].quarterlyAmount[indexQauter]['commitAmount'] = quaterDataCommit;
              
                
              ListOfBudget.budgetYearRequests[
                indexItem
              ].yearlyAmount[0].payAmount = yearDataPay;

              ListOfBudget.budgetYearRequests[
                indexItem
              ].yearlyAmount[0].commitAmount = yearDataCommit;
          });
          totalCommitAmount = ListOfBudget.budgetYearRequests[
            indexItem
          ].yearlyAmount[0].commitAmount + totalCommitAmount;




          totalPayAmount = ListOfBudget.budgetYearRequests[
            indexItem
          ].yearlyAmount[0].payAmount + totalPayAmount;
        ListOfBudget.totalCommitAmount = totalCommitAmount;
        ListOfBudget.totalPayAmount = totalPayAmount;
      });
     this.setState({ ListOfBudget: ListOfBudget });
  }

  handleAccountBlur(event, catIndex) {
    const value = event.target.value || '';
    let _this = this;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      budgetItemNo: value
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
          this.state.ListOfBudget[catIndex].budgetItemNo = '';
        }

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleApprovers(e) {
    let _this = this;
    const name = e.target.name;
    const value = e.target.value;

    let ListOfBudget = this.state.ListOfBudget;
    //ListOfBudget[name] = value;

    let data = { action: value };
    this.props
      .actionGetRevisionUsers(data)
      .then((result, error) => {
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

  handleChangeRequest(e,type) {
    const name = e.target.name;
    const value = e.target.value;
      const selectedIndex = e.target.options.selectedIndex;
      const keyIndex = e.target.options[selectedIndex].getAttribute('data-key');
      let listOfRevisions = [];
      let listOfForecasts = [];
      if(keyIndex != ''){


console.log("name,value------------",name,value);
        if(name == 'blueForecastYear'){
          this.setState({
            blueRevisionNo: this.state.listOfBlueComparision[keyIndex].revisionNo,
            blueForecastNo: this.state.listOfBlueComparision[keyIndex].forecastNo,
            blueForecastYear: this.state.listOfBlueComparision[keyIndex].forecastYear,
            blueFromYear: this.state.listOfBlueComparision[keyIndex].fromYear,
          })
        }
        else if(name == 'redForecastYear'){
          this.setState({
            redRevisionNo: this.state.listOfRedComparision[keyIndex].revisionNo,
            redForecastNo: this.state.listOfRedComparision[keyIndex].forecastNo,
            redForecastYear: this.state.listOfRedComparision[keyIndex].forecastYear,
            redFromYear: this.state.listOfRedComparision[keyIndex].fromYear,
          })
        }
        else if(name == 'cloneBudget'){
          this.setState({
            forecastNo: this.state.cloneBudgetFromList[keyIndex].forecastNo,
            revisionNo: this.state.cloneBudgetFromList[keyIndex].revisionNo,
            forecastYear: this.state.cloneBudgetFromList[keyIndex].forecastYear,
            fromYear: this.state.cloneBudgetFromList[keyIndex].fromYear,
            
          })
        }
      }
    this.setState(
      {
        [name]: value
      },
      () => this.handleGetExtraData(type)
    );
  }

  handleBudgetList(value) {
    let _this = this;
    let listOfYear = [this.yearObject];
    if (
      this.state.listOfYears &&
      this.state.listOfYears[0] &&
      this.state.listOfYears[0].length > 1
    ) {
      listOfYear = this.state.listOfYears[0];
    }
    let ListOfBudget = this.state.ListOfBudget;
    let categoryObject = [
      {
        budgetItemNo: '',
        accountNo: '',
        description: '',
        purchaseDescription: '',
        address: '',
        area: '',
        currency: '',
        programId: '',
        sourceCountry: '',
        specificationNo: '',
        toolLifeQuantity: '',
        unitCost: '',
        quantity: '',
        totalCost: '',
        taxTotal: '',
        budgetYearRequests: listOfYear,
        total: '',
        projectId: '',
        listOfApprovers: [],
        mediaRequests: []
      }
    ];
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };
    this.props
      .actionGetBudgetExtraData(data)
      .then((result, error) => {
        let ListOfBudgetList = result.payload.data.resourceData;
        if (result.payload.data.status == 200) {


          categoryObject =
            ListOfBudgetList && ListOfBudgetList.length > 0
              ? ListOfBudgetList
              : categoryObject;
        }
        _this.setState({
          // ListOfBudget: categoryObject
        });

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleSaveBudget(e, tempDraft) {
    let _this = this;
    let listOfBudgetRequest = [];
    let flag = true;
    let showError = '';
    let errorMsg = [];
    let saveAsDraft = false;
    let budgetYearRequests = [];

    const covertToTimeStamp = momentObject => {
      return moment(momentObject).format('x');
    };
    let partOrderData1 = this.state.partOrderData;
    this.state.ListOfBudget.forEach(function(item, index) {
      let totalPayAmount = 0;
      let totalcommit = 0;

      item.budgetYearRequests &&
        item.budgetYearRequests.forEach(function(dataitem, index) {
          if (dataitem.yearlyAmount[0].payAmount == '') {
            flag = false;
            errorMsg.push(
              'Please enter pay amount'
            );
          }
          if (dataitem.yearlyAmount[0].commitAmount == '') {
            flag = false;
            errorMsg.push(
              'Please enter commit amount'
            );
          }
          totalcommit = item.totalCommitAmount;
          totalPayAmount = item.totalPayAmount;
        });

      if (item.accountNo === '' || item.accountNo === undefined) {
        flag = false;
        errorMsg.push(
          'Please select region, department, major and product category'
        );
      } else if (
        _this.state.forecastYear === '' ||
        _this.state.forecastYear === undefined
      ) {
        flag = false;
        errorMsg.push('Please select forecast year');
      } else if (tempDraft) {

        if(item.id == undefined || item.id == '' || item.budgetItemStatus == "not_submitted"){
          flag = true;
          saveAsDraft = true;
        }else{

        }
          
      } else {  
        if (item.budgetItemNo === '' || item.budgetItemNo === undefined) {
          errorMsg.push('Please enter Budget Item');
          flag = false;
        }
        if (
          totalcommit == totalPayAmount &&
          totalPayAmount == item.totalBudget &&
          _this.state.inputAmountBy == 'commit_and_pay'
        ) {
        } else if (
          totalPayAmount == item.totalBudget &&
          _this.state.inputAmountBy == 'pay'
        ) {
          flag = true;
        } else if (
          totalcommit == item.totalBudget &&
          _this.state.inputAmountBy == 'commit'
        ) {
          flag = true;
        } else {
           errorMsg.push('Please enter correct total amount');
          flag = false;
        }
      }

      let costCenterManagerId = item.costCenterManagerId;
      if (item.initialApprovalBy && item.initialApprovalBy.id)
        costCenterManagerId = item.initialApprovalBy.id;

      listOfBudgetRequest.push({
        id: item.id ? item.id : '',
        budgetItemNo: item.budgetItemNo,
        //accountNo: item.accountNo,
        address: item.address,
        currency: item.currency,
        description: item.description,
        saveAsDraft: saveAsDraft,
        indirectPurchaseId: item.indirectPurchaseId,
        mediaRequests: item.mediaRequests,
        budgetYearRequests: item.budgetYearRequests, //budgetYearRequests,
        //  budgetInputType: budgetYearRequests,
        addedApproversBy: _this.props.userInfo.userData.id,
        //programId: item.programId,
        inputAmountBy: _this.state.inputAmountBy,
        //inputBy: 4,
        costCenterManagerId: costCenterManagerId,
        totalBudget: item.totalBudget
      });
    });

    let data = {
      roleId: _this.props.userInfo.userData.userRole,
      userId: _this.props.userInfo.userData.id,
      revisionNo: this.state.revisionNo,
      forecastNo: this.state.forecastNo,
      forecastYear: this.state.forecastYear,
      cloneBudgetFromId: this.state.cloneBudgetFromId,
      budgetInputBy: this.state.budgetInputBy,
      budgetGroupBy: this.state.budgetGroupBy,
      budgetItemRequests: listOfBudgetRequest,
      listOfApprovers: [],
      financialBudgetId: this.state.financialBudgetId,
      fromYear: 2019,
      toYear: 2020,
    };

    if (flag) {
      _this.props
        .actionSaveBudgetOne(data)
        .then((result, error) => {
          _this.props.actionLoaderHide();
          if (result.payload.data.status === 200) {
            _this.setState({
               ListOfBudget: result.payload.data.resourceData
            });
          }
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      if (errorMsg) {
        showError = errorMsg.join(',\r\n');
        showErrorToast(showError);
      }
    }
  }

  handleUploadDocumentse(event, index) {
    let filesLength = event.target.files.length;
    let _this = this;
    let reqArray = [];
    let ListOfBudget = this.state.ListOfBudget;
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
            reqObject['mediaThumbnailUrl'] =
            reportArray.s3ThumbnailFilePath;
            reqObject['isDeleted'] = false;
            reqArray.push(reqObject);
            _this.props.actionLoaderHide();
          })
          .catch(e => {
            _this.props.actionLoaderHide();
          });
      }
    }
    ListOfBudget[index].mediaRequests = reqArray;
    this.setState({
      ListOfBudget: ListOfBudget
    });
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
  handleSort(e, name) {
    let ListOfBudget = this.state.ListOfBudget;
    ListOfBudget.sort(this.handleCompareValues(name));
    this.setState({
      ListOfBudget: ListOfBudget
    });
  }

  // function for dynamic sorting
  handleCompareValues(key, order = 'asc') {
    return function(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either yearlyAmount
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

  handleChangeAccount(e, catIndex) {
    let _this = this;

    const { name } = e.target;
    const { value } = e.target;
    let approversLenght = 0;
    let approversLenghtArr = [];
    const selectedIndex = e.target.options.selectedIndex;
    const index = e.target.options[selectedIndex].getAttribute('data-index');

    let list = this.state.listOfAccountDetails;
    let listOfAccountDetails = list[index];

    let ListOfBudget = this.state.ListOfBudget;
    if (value == '') {

      ListOfBudget[catIndex].accountNo = '';
      ListOfBudget[catIndex].costCenterManagerName = '';
      ListOfBudget[catIndex].listOfApprovers = [];
      ListOfBudget[catIndex].purchaseDescription = '';
      ListOfBudget[catIndex].costCenterManagerId = '';
      ListOfBudget[catIndex].indirectPurchaseId = '';
      ListOfBudget[catIndex].initialApprovalBy = '';
      ListOfBudget[catIndex][name] = value;

      ListOfBudget[catIndex].brandName = '';
      ListOfBudget[catIndex].subBrandName = '';

      ListOfBudget[catIndex].departmentName = '';
      ListOfBudget[catIndex].subDepartmentName = '';
      ListOfBudget[catIndex].teamName = '';

      ListOfBudget[catIndex].majorCategoryName = '';
      ListOfBudget[catIndex].categoryName = '';
      ListOfBudget[catIndex].subCategoryName = '';
      ListOfBudget[catIndex].subSubCategoryName = '';

      ListOfBudget[catIndex].sectorName = '';
      ListOfBudget[catIndex].modelFamilyName = '';
      ListOfBudget[catIndex].productLineName = '';
      ListOfBudget[catIndex].programName = '';

      ListOfBudget[catIndex].globalRegionName = '';
      ListOfBudget[catIndex].globalSubRegionName = '';
      ListOfBudget[catIndex].countryName = '';
      ListOfBudget[catIndex].localBussinessRegion = '';
      ListOfBudget[catIndex].localBussinessRegion = '';
      ListOfBudget[catIndex].district = '';
      ListOfBudget[catIndex].circle = '';
      ListOfBudget[catIndex].area = '';
    } else {
      ListOfBudget[catIndex].accountNo = value;
      ListOfBudget[catIndex].purchaseDescription =
        listOfAccountDetails.description;
      ListOfBudget[catIndex].costCenterManagerId =
        listOfAccountDetails.initialApprovalBy.id;
      ListOfBudget[catIndex].indirectPurchaseId = listOfAccountDetails.id;
      ListOfBudget[catIndex].listOfApprovers =
        listOfAccountDetails.listOfApprovers;
      ListOfBudget[catIndex].initialApprovalBy =
        listOfAccountDetails.initialApprovalBy;

      ListOfBudget[catIndex].brandName = listOfAccountDetails.brandName;
      ListOfBudget[catIndex].subBrandName = listOfAccountDetails.subBrandName;

      ListOfBudget[catIndex].departmentName =
        listOfAccountDetails.departmentName;
      ListOfBudget[catIndex].subDepartmentName =
        listOfAccountDetails.subDepartmentName;
      ListOfBudget[catIndex].teamName = listOfAccountDetails.teamName;

      ListOfBudget[catIndex].majorCategoryName =
        listOfAccountDetails.majorCategoryName;
      ListOfBudget[catIndex].categoryName = listOfAccountDetails.categoryName;
      ListOfBudget[catIndex].subCategoryName =
        listOfAccountDetails.subCategoryName;
      ListOfBudget[catIndex].subSubCategoryName =
        listOfAccountDetails.subSubCategoryName;

      ListOfBudget[catIndex].sectorName = listOfAccountDetails.sectorName;
      ListOfBudget[catIndex].modelFamilyName =
        listOfAccountDetails.modelFamilyName;
      ListOfBudget[catIndex].productLineName =
        listOfAccountDetails.productLineName;
      ListOfBudget[catIndex].programName = listOfAccountDetails.programName;

      ListOfBudget[catIndex].globalRegionName =
        listOfAccountDetails.globalRegionName;
      ListOfBudget[catIndex].globalSubRegionName =
        listOfAccountDetails.globalSubRegionName;
      ListOfBudget[catIndex].countryName = listOfAccountDetails.countryName;
      ListOfBudget[catIndex].localBussinessRegion =
        listOfAccountDetails.localBussinessRegion;
      ListOfBudget[catIndex].localBussinessRegion =
        listOfAccountDetails.localBussinessRegion;
      ListOfBudget[catIndex].district = listOfAccountDetails.district;
      ListOfBudget[catIndex].circle = listOfAccountDetails.circle;
      ListOfBudget[catIndex].area = listOfAccountDetails.area;

      ListOfBudget[catIndex][name] = value;

      ListOfBudget &&
      ListOfBudget.forEach(function(element, index) {
        if (element && element.listOfApprovers) {
          approversLenght =
            approversLenght > element.listOfApprovers.length
              ? approversLenght
              : element.listOfApprovers.length;

          approversLenghtArr =
            approversLenghtArr.length > element.listOfApprovers.length
              ? approversLenghtArr
              : element.listOfApprovers;
        }
      });




      if (!ListOfBudget.budgetItemNo) {
        let createdAccountNo =
          'bud' + moment().format('MMYYYYDD') + moment().format('sshhmm');
        ListOfBudget[catIndex].budgetItemNo = createdAccountNo;
        ListOfBudget[catIndex].showAccountText = true;
      }
    }
    _this.setState({ ListOfBudget: ListOfBudget,  approversLenght: approversLenght,
      approversLenghtArr: approversLenghtArr });
  }

  handleAction(event, index, id) {
    const { name, value } = event.target;
    const selected = event.target.checked;

    let deleteIndirectPurchaseArray = this.state.deleteIndirectPurchaseArray;
    let deleteArray = this.state.deleteArray;
    // deleteIndirectPurchaseArray.push(id);
    // deleteArray.push(index);
    // this.setState({
    //   deleteIndirectPurchaseArray: deleteIndirectPurchaseArray,
    //   deleteArray:deleteArray
    // });
    // deleteIndirectPurchaseArray;

    let listOfIndirectPurchaseData = this.state.ListOfBudget;
    let listOfIndirectPurchaseDataJson = listOfIndirectPurchaseData[index];
    if (selected) {
      deleteIndirectPurchaseArray.push(id);
      deleteArray.push(index);
      listOfIndirectPurchaseDataJson.isSelected = true;
    } else {
      deleteIndirectPurchaseArray.pop(id);
      deleteArray.pop(index);
      listOfIndirectPurchaseDataJson.isSelected = false;
    }
    listOfIndirectPurchaseData[index] = listOfIndirectPurchaseDataJson;
    this.setState({ ListOfBudget: listOfIndirectPurchaseData,
      deleteIndirectPurchaseArray: deleteIndirectPurchaseArray,
      deleteArray:deleteArray });
  }

  deleteConfirmation11(event) {
    if (this.state.deleteArray && this.state.deleteArray.length > 0) {
      this.setState({
        deleteConformationModal: true
      });
    } else { 
      showErrorToast(validationMessages.Indirect.deleteProject);
    }
  }

  deleteConfirmation(
    id,
    categoryIndex,
  ) {

    this.setState({
      deleteConformationModal: true,
      categoryIndex: categoryIndex,
      id: id,
    });
  }


  handleCloseConformation(event) {
    this.setState({
      deleteConformationModal: false
      //deleteIndirectPurchaseArray:[],
      //deleteArray:[]
    });
  }

  removePurchaseDataRow(e) {
    if (this.state.deleteArray.length > 0) {
      let _this = this;
      let deleteId = '';
      let ListOfBudget = this.state.ListOfBudget;
      let listOfIds = [];
      let deleteArray = this.state.deleteArray ? this.state.deleteArray : [];

      this.state.deleteArray.forEach(function(item, index) {
        deleteId = item;

        let idsList1 = _.result(
          _.find(ListOfBudget, function(description, indexItem) {
            return indexItem === item;
          }),
          'id'
        );
        idsList1 ? listOfIds.push(idsList1) : [];
        _.remove(ListOfBudget, function(currentObject, indexValue) {
          return indexValue === deleteId;
        });
      });

      this.setState({
        ListOfBudget: ListOfBudget,
        deleteConformationModal: false
      });
      if (listOfIds && listOfIds.length > 0) {
        let data = {
          listOfIds: listOfIds,
          roleId: this.props.userInfo.userData.userRole,
          userId: this.props.userInfo.userData.id
        };

        this.props
          .actionDeleteOfBudget(data)
          .then((result, error) => {
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      } else {
        showSuccessToast('Budget request deleted successfully');
      }
      this.state.deleteArray.pop(deleteId);
      this.setState({
        deleteArray: deleteArray
      });
    } else {
      showErrorToast(validationMessages.Indirect.deleteError);
    }
  }
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }
  exportExecle(event) {
    var htmltable = document.getElementById('excel-download');
    var html = htmltable.outerHTML;
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
    event.preventDefault();
  }
  handleChangeRegion(
    event,
    error,
    catIndex,
    id,
    parentId,
    parentIdTwo,
    parentIdThree,
    parentIdFour,
    parentIdFive,
    parentIdSix,
    parentIdSeven,
    parentIdEight,
    regionTitle,
    subRegionTitle,
    countryTitle
  ) {
    event.stopPropagation();
    event.preventDefault();
    let _this = this;

    if (error === 'error') {
      showErrorToast("Please select last label item")
    } else {
      let ListOfBudget = this.state.ListOfBudget;
      ListOfBudget[catIndex]['geogrophyId'] = id;
      ListOfBudget[catIndex]['globalRegionId'] = parentId;
      ListOfBudget[catIndex]['globalSubRegionId'] = parentIdTwo;
      ListOfBudget[catIndex]['countryId'] = parentIdThree;
      ListOfBudget[catIndex]['zone'] = parentIdFour;
      ListOfBudget[catIndex]['localBussinessRegion'] = parentIdFive;
      ListOfBudget[catIndex]['district'] = parentIdSix;
      ListOfBudget[catIndex]['circle'] = parentIdSeven;
      ListOfBudget[catIndex]['area'] = parentIdEight;
      ListOfBudget[catIndex]['resionTitle'] = parentId+'/'+parentIdTwo+'/'+parentIdThree+'/'+parentIdFour
      +'/'+parentIdFive+'/'+parentIdSix+'/'+parentIdSeven+'/'+parentIdEight
      ListOfBudget[catIndex]['resionTitle'] = regionTitle+'/'+subRegionTitle+'/'+countryTitle+'/'+parentIdFour
      +'/'+parentIdFive+'/'+parentIdSix+'/'+parentIdSeven+'/'+parentIdEight
      let ListOfBudgetElem = ListOfBudget[catIndex];

      if (
        ListOfBudgetElem.brandId &&
        ListOfBudgetElem.departmentId &&
        ListOfBudgetElem.majorCategoryId &&
        ListOfBudgetElem.sectorId &&
        ListOfBudgetElem.globalRegionId
      ) {
        let data = {
          roleId: _this.props.userInfo.userData.userRole,
          userId: _this.props.userInfo.userData.id,
          brandId: ListOfBudgetElem.brandId,
          subBrandId: ListOfBudgetElem.subBrandId,
          departmentId: ListOfBudgetElem.departmentId,
          subDepartmentId: ListOfBudgetElem.subDepartmentId,
          teamId: ListOfBudgetElem.teamId,
          majorCategoryId: ListOfBudgetElem.majorCategoryId,
          categoryId: ListOfBudgetElem.categoryId,
          subCategoryId: ListOfBudgetElem.subCategoryId,
          subSubCategoryId: ListOfBudgetElem.subSubCategoryId,
          sectorId: ListOfBudgetElem.sectorId,
          productLineId: ListOfBudgetElem.productLineId,
          modelFamilyId: ListOfBudgetElem.modelFamilyId,
          programId: ListOfBudgetElem.programId,
          geogrophyId: ListOfBudgetElem.geogrophyId,
          globalRegionId: ListOfBudgetElem.globalRegionId,
          globalSubRegionId: ListOfBudgetElem.globalSubRegionId,
          countryId: ListOfBudgetElem.countryId,
          zone: ListOfBudgetElem.zone,
          localBussinessRegion: ListOfBudgetElem.localBussinessRegion,
          district: ListOfBudgetElem.district,
          circle: ListOfBudgetElem.circle,
          area: ListOfBudgetElem.area,
          geogrophyId: ListOfBudgetElem.geogrophyId
        };
        this.handleGetAccount(data, catIndex);
      }



      if (!ListOfBudgetElem.budgetItemNo) {
        let createdAccountNo =
          'acc' + moment().format('MMYYYYDD') + moment().format('sshhmm');
        if (
          ListOfBudgetElem.brandId &&
          ListOfBudgetElem.departmentId &&
          ListOfBudgetElem.majorCategoryId &&
          ListOfBudgetElem.sectorId &&
          ListOfBudgetElem.globalRegionId
        ) {
          ListOfBudgetElem[
            catIndex
          ].budgetItemNo = createdAccountNo;
          ListOfBudgetElem[catIndex].showAccountText = true;
        }
      }
      this.setState({ ListOfBudget: ListOfBudget });
    }
  }

  handleChangeMajorCategory(
    event,
    catIndex,
    classificationType,
  ) {
    let _this = this;
    let value= event.target.value
    let name= event.target.name
    let ListOfBudget = this.state.ListOfBudget;
    ListOfBudget[catIndex][name] = value;

    let subcatIndex = ListOfBudget[catIndex].categoryId;
    let subsubcatIndex = ListOfBudget[catIndex].subCategoryId;
    const selectedIndex = event.target.options.selectedIndex;
    const index = event.target.options[selectedIndex].getAttribute('data-key');

    let listOfMajorCategory = this.state.listOfMajorCategory;

    let flag = '';
    
    if (classificationType === 'CATEGORY') {
      ListOfBudget[catIndex].categoryId = '';
      ListOfBudget[catIndex].subCategoryId = '';
      ListOfBudget[catIndex].subSubCategoryId = ''

    } else if (classificationType === 'SUB_CATEGORY') {
      ListOfBudget[catIndex].subCategoryId = '';
      ListOfBudget[catIndex].subSubCategoryId = ''
    } else if (classificationType === 'SUB_SUB_CATEGORY') {
      ListOfBudget[catIndex].subSubCategoryId = ''
    } 
    
    this.setState({
      ListOfBudget: ListOfBudget
    });
    
        this.getClassifications(
          catIndex,
          value,
          classificationType,
          subcatIndex,
          subsubcatIndex,
        );
        let ListOfBudgetElem = ListOfBudget[catIndex];

          if (
            ListOfBudgetElem.brandId &&
            ListOfBudgetElem.departmentId &&
            ListOfBudgetElem.majorCategoryId &&
            ListOfBudgetElem.sectorId &&
            ListOfBudgetElem.globalRegionId
          ) {
            let data = {
              roleId: _this.props.userInfo.userData.userRole,
              userId: _this.props.userInfo.userData.id,
              brandId: ListOfBudgetElem.brandId,
              subBrandId: ListOfBudgetElem.subBrandId,
              departmentId: ListOfBudgetElem.departmentId,
              subDepartmentId: ListOfBudgetElem.subDepartmentId,
              teamId: ListOfBudgetElem.teamId,
              majorCategoryId: ListOfBudgetElem.majorCategoryId,
              categoryId: ListOfBudgetElem.categoryId,
              subCategoryId: ListOfBudgetElem.subCategoryId,
              subSubCategoryId: ListOfBudgetElem.subSubCategoryId,
              sectorId: ListOfBudgetElem.sectorId,
              productLineId: ListOfBudgetElem.productLineId,
              modelFamilyId: ListOfBudgetElem.modelFamilyId,
              programId: ListOfBudgetElem.programId,
              geogrophyId: ListOfBudgetElem.geogrophyId,
              globalRegionId: ListOfBudgetElem.globalRegionId,
              globalSubRegionId: ListOfBudgetElem.globalSubRegionId,
              countryId: ListOfBudgetElem.countryId,
              zone: ListOfBudgetElem.zone,
              localBussinessRegion: ListOfBudgetElem.localBussinessRegion,
              district: ListOfBudgetElem.district,
              circle: ListOfBudgetElem.circle,
              area: ListOfBudgetElem.area,
              geogrophyId: ListOfBudgetElem.geogrophyId
            };
             this.handleGetAccount(data, catIndex);
          }
  }


  handleChangeMouseOver(
    event,
    value,
    catIndex,
    classificationType,
    subcatIndex,
    subsubcatIndex,
  ) {

    let listOfBrands = this.state.listOfBrands;
    let listOfDepartment = this.state.listOfDepartment;
    let listOfMajorCategory = this.state.listOfMajorCategory;
    let listOfSectorCategory = this.state.listOfSectorCategory;
    let flag = '';

    if (classificationType === 'BRAND') {
      flag =
        listOfBrands[catIndex] &&
          listOfBrands[catIndex]['listOfSubBrands'] &&
          listOfBrands[catIndex]['listOfSubBrands'].length > 0
          ? false
          : true;
    } else if (classificationType === 'DEPARTMENT_SUB_DIVISION') {
      flag =
        listOfDepartment[catIndex] &&
          listOfDepartment[catIndex]['listOfSubDept'] &&
          listOfDepartment[catIndex]['listOfSubDept'].length > 0
          ? false
          : true;
    } else if (classificationType === 'TEAM') {
      flag =
        listOfDepartment[catIndex] &&
          listOfDepartment[catIndex]['listOfSubDept'] &&
          listOfDepartment[catIndex]['listOfSubDept'][subcatIndex] &&
          listOfDepartment[catIndex]['listOfSubDept'][subcatIndex][
          'listOfTeam'
          ] &&
          listOfDepartment[catIndex]['listOfSubDept'][subcatIndex]['listOfTeam']
            .length > 0
          ? false
          : true;
    } else if (classificationType === 'CATEGORY') {
      flag =
        listOfMajorCategory[catIndex] &&
          listOfMajorCategory[catIndex]['listOfCategory'] &&
          listOfMajorCategory[catIndex]['listOfCategory'].length > 0
          ? false
          : true;
    } else if (classificationType === 'SUB_CATEGORY') {
      flag =
        listOfMajorCategory[catIndex] &&
          listOfMajorCategory[catIndex]['listOfCategory'] &&
          listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex] &&
          listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
          'listOfSubCategory'
          ] &&
          listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
            'listOfSubCategory'
          ].length > 0
          ? false
          : true;
    } else if (classificationType === 'SUB_SUB_CATEGORY') {
      flag =
        listOfMajorCategory[catIndex] &&
          listOfMajorCategory[catIndex]['listOfCategory'] &&
          listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex] &&
          listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
          'listOfSubCategory'
          ] &&
          listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
          'listOfSubCategory'
          ][subsubcatIndex] &&
          listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
          'listOfSubCategory'
          ][subsubcatIndex]['listOfSubSubCategory'] &&
          listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
            'listOfSubCategory'
          ][subsubcatIndex]['listOfSubSubCategory'].length > 0
          ? false
          : true;
    } else if (classificationType === 'PRODUCT_LINE') {
      flag =
        listOfSectorCategory[catIndex] &&
          listOfSectorCategory[catIndex]['listOfProductLineCategory'] &&
          listOfSectorCategory[catIndex]['listOfProductLineCategory'].length > 0
          ? false
          : true;
    } else if (classificationType === 'MODEL_FAMILY') {
      flag =
        listOfSectorCategory[catIndex] &&
          listOfSectorCategory[catIndex]['listOfProductLineCategory'] &&
          listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
          ] &&
          listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
          ]['listOfModelFamilyCategory'] &&
          listOfSectorCategory[catIndex]['listOfProductLineCategory'][
            subcatIndex
          ]['listOfModelFamilyCategory'].length > 0
          ? false
          : true;
    } else if (classificationType === 'PROGRAM') {
      flag =
        listOfSectorCategory[catIndex] &&
          listOfSectorCategory[catIndex]['listOfProductLineCategory'] &&
          listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
          ] &&
          listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
          ]['listOfModelFamilyCategory'] &&
          listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
          ]['listOfModelFamilyCategory'][subsubcatIndex] &&
          listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
          ]['listOfModelFamilyCategory'][subsubcatIndex][
          'listOfProgramCategory'
          ] &&
          listOfSectorCategory[catIndex]['listOfProductLineCategory'][
            subcatIndex
          ]['listOfModelFamilyCategory'][subsubcatIndex]['listOfProgramCategory']
            .length > 0
          ? false
          : true;
    }

    if (flag) {
      this.getClassifications(
        catIndex,
        value,
        classificationType,
        subcatIndex,
        subsubcatIndex,
      );
    }
  }
  getClassifications(
    catIndex,
    id,
    classificationType,
    subcatIndex,
    subsubcatIndex,
  ) {
    let _this = this;
    let ListOfBudget = this.state.ListOfBudget;
    let listOfBrands = this.state.listOfBrands;
    let listOfDepartment = this.state.listOfDepartment;
    let listOfMajorCategory = this.state.listOfMajorCategory;
    let listOfSectorCategory = this.state.listOfSectorCategory;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      classificationType: classificationType,
      id: id
    };

    this.props
      .actionGetClassifications(data)
      .then((result, error) => {
        let resourceData = result.payload.data.resourceData;
        if (classificationType === 'BRAND') {
          listOfBrands[catIndex]['listOfSubBrands'] = resourceData.listOfBrands;
          this.setState({
            listOfBrands: listOfBrands
          });
        } else if (classificationType === 'DEPARTMENT_SUB_DIVISION') {
          listOfDepartment[catIndex]['listOfSubDept'] =
            resourceData.listOfDepartment;
          this.setState({
            listOfDepartment: listOfDepartment
          });
        } else if (classificationType === 'TEAM') {
          listOfDepartment[catIndex]['listOfSubDept'][subcatIndex][
            'listOfTeam'
          ] = resourceData.listOfDepartment;
          this.setState({
            listOfDepartment: listOfDepartment
          });
        } else if (classificationType === 'CATEGORY') {
          ListOfBudget[catIndex]['listOfCategory'] =
            resourceData.listOfCategory;
          this.setState({
            ListOfBudget: ListOfBudget
          });
        } else if (classificationType === 'SUB_CATEGORY') {

          ListOfBudget[catIndex]['listOfSubCategory'] = resourceData.listOfCategory;
          this.setState({
            ListOfBudget: ListOfBudget
          });
        } else if (classificationType === 'SUB_SUB_CATEGORY') {
          ListOfBudget[catIndex]['listOfSubSubCategory'] =
            resourceData.listOfCategory;
          this.setState({
            ListOfBudget: ListOfBudget
          });
        } else if (classificationType === 'PRODUCT_LINE') {
          listOfSectorCategory[catIndex]['listOfProductLineCategory'] =
            resourceData.listOfProductLine;
          this.setState({
            listOfSectorCategory: listOfSectorCategory
          });
        } else if (classificationType === 'MODEL_FAMILY') {
          listOfSectorCategory[catIndex]['listOfProductLineCategory'][
            subcatIndex
          ]['listOfModelFamilyCategory'] = resourceData.listOfProductLine;
          this.setState({
            listOfSectorCategory: listOfSectorCategory
          });
        } else if (classificationType === 'PROGRAM') {
          listOfSectorCategory[catIndex]['listOfProductLineCategory'][
            subcatIndex
          ]['listOfModelFamilyCategory'][subsubcatIndex][
            'listOfProgramCategory'
          ] = resourceData.listOfProductLine;
          this.setState({
            listOfSectorCategory: listOfSectorCategory
          });
        }

        this.setState({
          ListOfBudget: ListOfBudget
        });

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }
  handleChangeSelect(
    event,
    name,
    value,
    catIndex,
    parentId,
    parentIdTwo,
    parentIdThree,
    firstTitle,
    SecondTitle,
    thirdTitle,
    FourthTitle
  ) {
    event.stopPropagation();
    event.preventDefault();
    let ListOfBudget = this.state.ListOfBudget;
    let _this = this;

    ListOfBudget[catIndex][name] = value;
    //ListOfBudget[catIndex][nameText] = text;

    if (name == 'brandId') {
      ListOfBudget[catIndex].subBrandId = '';
      ListOfBudget[catIndex]['brandTitle'] = firstTitle;
    } else if (name == 'subBrandId') {
      ListOfBudget[catIndex]['brandId'] = parentId;
      ListOfBudget[catIndex]['brandTitle'] = firstTitle+'/'+SecondTitle;
    }
    if (name == 'majorCategoryId') {
      ListOfBudget[catIndex].categoryId = '';
      ListOfBudget[catIndex].subCategoryId = '';
      ListOfBudget[catIndex].subSubCategoryId = '';
      ListOfBudget[catIndex]['majorTitle'] = firstTitle;
    } else if (name == 'categoryId') {
      ListOfBudget[catIndex].subCategoryId = '';
      ListOfBudget[catIndex].subSubCategoryId = '';
      ListOfBudget[catIndex].majorCategoryId = parentId;
      ListOfBudget[catIndex]['majorTitle'] = firstTitle+'/'+SecondTitle;
    } else if (name == 'subCategoryId') {
      ListOfBudget[catIndex].subSubCategoryId = '';
      ListOfBudget[catIndex].majorCategoryId = parentId;
      ListOfBudget[catIndex].categoryId = parentIdTwo;
      ListOfBudget[catIndex]['majorTitle'] = firstTitle+'/'+SecondTitle+'/'+thirdTitle;
    } else if (name == 'subSubCategoryId') {
      ListOfBudget[catIndex].majorCategoryId = parentId;
      ListOfBudget[catIndex].categoryId = parentIdTwo;
      ListOfBudget[catIndex].subCategoryId = parentIdThree;
      ListOfBudget[catIndex]['majorTitle'] = firstTitle+'/'+SecondTitle+'/'+thirdTitle+'/'+FourthTitle;
    }

    if (name == 'departmentId') {
      ListOfBudget[catIndex].subDepartmentId = '';
      ListOfBudget[catIndex].teamId = '';
      ListOfBudget[catIndex]['departmentTitle'] = firstTitle;
    } else if (name == 'subDepartmentId') {
      ListOfBudget[catIndex].teamId = '';
      ListOfBudget[catIndex].departmentId = parentId;
      ListOfBudget[catIndex]['departmentTitle'] = firstTitle+'/'+SecondTitle;
    } else if (name == 'teamId') {
      ListOfBudget[catIndex].departmentId = parentId;
      ListOfBudget[catIndex].subDepartmentId = parentIdTwo;
      ListOfBudget[catIndex]['departmentTitle'] = firstTitle+'/'+SecondTitle+'/'+thirdTitle;
    }
    if (name == 'sectorId') {
      ListOfBudget[catIndex].productLineId = '';
      ListOfBudget[catIndex].modelFamilyId = '';
      ListOfBudget[catIndex].programId = '';
      ListOfBudget[catIndex]['sectorTitle'] = firstTitle;
    } else if (name == 'productLineId') {
      ListOfBudget[catIndex].modelFamilyId = '';
      ListOfBudget[catIndex].programId = '';
      ListOfBudget[catIndex].sectorId = parentId;
      ListOfBudget[catIndex]['sectorTitle'] = firstTitle+'/'+SecondTitle;;
    } else if (name == 'modelFamilyId') {
      ListOfBudget[catIndex].programId = '';
      ListOfBudget[catIndex].sectorId = parentId;
      ListOfBudget[catIndex].productLineId = parentIdTwo;
      ListOfBudget[catIndex]['sectorTitle'] = firstTitle+'/'+SecondTitle+'/'+thirdTitle;
    } else if (name == 'programId') {
      ListOfBudget[catIndex].sectorId = parentId;
      ListOfBudget[catIndex].productLineId = parentIdTwo;
      ListOfBudget[
        catIndex
      ].modelFamilyId = parentIdThree;
      ListOfBudget[catIndex]['sectorTitle'] = firstTitle+'/'+SecondTitle+'/'+thirdTitle+'/'+FourthTitle;
    }
    
    let ListOfBudgetElem = ListOfBudget[catIndex];

    if (
      ListOfBudgetElem.brandId &&
      ListOfBudgetElem.departmentId &&
      ListOfBudgetElem.majorCategoryId &&
      ListOfBudgetElem.sectorId &&
      ListOfBudgetElem.globalRegionId
    ) {
      let data = {
        roleId: _this.props.userInfo.userData.userRole,
        userId: _this.props.userInfo.userData.id,
        brandId: ListOfBudgetElem.brandId,
        subBrandId: ListOfBudgetElem.subBrandId,
        departmentId: ListOfBudgetElem.departmentId,
        subDepartmentId: ListOfBudgetElem.subDepartmentId,
        teamId: ListOfBudgetElem.teamId,
        majorCategoryId: ListOfBudgetElem.majorCategoryId,
        categoryId: ListOfBudgetElem.categoryId,
        subCategoryId: ListOfBudgetElem.subCategoryId,
        subSubCategoryId: ListOfBudgetElem.subSubCategoryId,
        sectorId: ListOfBudgetElem.sectorId,
        productLineId: ListOfBudgetElem.productLineId,
        modelFamilyId: ListOfBudgetElem.modelFamilyId,
        programId: ListOfBudgetElem.programId,
        geogrophyId: ListOfBudgetElem.geogrophyId,
        globalRegionId: ListOfBudgetElem.globalRegionId,
        globalSubRegionId: ListOfBudgetElem.globalSubRegionId,
        countryId: ListOfBudgetElem.countryId,
        zone: ListOfBudgetElem.zone,
        localBussinessRegion: ListOfBudgetElem.localBussinessRegion,
        district: ListOfBudgetElem.district,
        circle: ListOfBudgetElem.circle,
        area: ListOfBudgetElem.area,
        geogrophyId: ListOfBudgetElem.geogrophyId
      };
      this.handleGetAccount(data, catIndex);
    }
    if (!ListOfBudgetElem.budgetItemNo) {
      let createdAccountNo =
        'BUD'  + moment().format('sshhmm');
      ListOfBudget[
        catIndex
      ].budgetItemNo = createdAccountNo;
      ListOfBudget[catIndex].showAccountText = true;
    }
    this.setState({ ListOfBudget: ListOfBudget });
  }

  handleGetAccount(data, catIndex) {

    let _this = this;
    let ListOfBudget = this.state.ListOfBudget;
    this.props
      .actionAccountNumberData(data)
      .then((result, error) => {

        if (result.payload.data.status == 400) {
          showErrorToast(result.payload.data.responseMessage);
          ListOfBudget[catIndex].accountNo = '';
          ListOfBudget[catIndex].costCenterManagerName = '';
          ListOfBudget[catIndex].listOfApprovers = [];
          ListOfBudget[catIndex].description1 = '';  
          ListOfBudget[catIndex].costCenterManagerId = '';  
          ListOfBudget[catIndex].indirectPurchaseId = '';
        } else {
          ListOfBudget[catIndex].accountNo = result.payload.data.resourceData.accountNo;
          ListOfBudget[catIndex].initialApprovalBy = result.payload.data.resourceData.initialApprovalBy;
          ListOfBudget[catIndex].description1 = result.payload.data.resourceData.description;
          ListOfBudget[catIndex].costCenterManagerId = result.payload.data.resourceData.initialApprovalBy.id;
          ListOfBudget[catIndex].indirectPurchaseId = result.payload.data.resourceData.id;
          ListOfBudget[catIndex].listOfApprovers = result.payload.data.resourceData.listOfApprovers;
          
          
        //   ListOfBudget[catIndex].listOfApprovers = [
        //     {
        //         "approver": {
        //             "name": result.payload.data.resourceData.globalCFOUserName,
        //         },
        //     },
        //     {
        //       "approver": {
        //         "name": result.payload.data.resourceData.globalHODUserName,
        //     },
        //     },
        //     {
        //       "approver": {
        //         "name":result.payload.data.resourceData.localFPUserName,
        //     },
        //     },
        //     {
        //       "approver": {
        //         "name": result.payload.data.resourceData.localHODUserName,
        //     },
        //     },
        //     {
        //       "approver": {
        //         "name": result.payload.data.resourceData.regionalCFOUserName,
        //     },
        //     },
        //     {
        //       "approver": {
        //         "name": result.payload.data.resourceData.regionalFPUserName,
        //     },
        //     },
        //     {
        //       "approver": {
        //         "name": result.payload.data.resourceData.regionalHODUserName,
        //     },
        //     }
        // ]
         
        }
        _this.setState({ ListOfBudget: ListOfBudget });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  removeIndirectPurchaseDataRow(e) {

    if (this.state.deleteIndirectPurchaseArray.length > 0) {
      let _this = this;
      let deleteId = "";
      let ListOfBudget = this.state.ListOfBudget;
      let deleteArray = this.state.deleteArray
        ? this.state.deleteIndirectPurchaseArray
        : [];

      this.state.deleteArray.forEach(function(item, index) {
        // deleteId =
        // ListOfBudget &&
        // ListOfBudget[index] &&
        // ListOfBudget[index].purchaseRequestNumber;
        for( var i = 0; i < ListOfBudget.length; i++){ 
          if ( item === i) {
            ListOfBudget.splice(i, 1); 
          }
       }
        // _.remove(ListOfBudget, (currentObject,index) => {

        //   return index == item;
        // });
      });
      this.setState({ deleteConformationModal: false });

      let data = {
        listOfIds: this.state.deleteIndirectPurchaseArray,
        roleId: this.props.userInfo.userData.userRole,
        userId: this.props.userInfo.userData.id
      };


      console.log("listOfIds----------------",data);

      if(this.state.deleteIndirectPurchaseArray && this.state.deleteIndirectPurchaseArray.length>0 ){
        this.props
        .actionDeleteOfBudget(data)
        .then((result, error) => {
          if(result.payload.data.status == 200)
            this.setState({ ListOfBudget: ListOfBudget });
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
      }else{
      this.setState({ ListOfBudget: ListOfBudget,deleteArray:[],deleteIndirectPurchaseArray:[] });
      }

    } else {
      showErrorToast(validationMessages.Indirect.deleteError);
    }
  }


  deleteCategory(e, catIndex, id) {

    let noOfCategory= this.state.noOfCategory;
    let _this = this;
    this.setState(prevState => {
      // you shouldn't mutate, this is just an example.
      delete prevState.noOfCategory[catIndex];
      return prevState;
    });

    if (
      noOfCategory.length === 0 &&
      noOfCategory.length !== 0
    ) {
      noOfCategory.splice(catIndex, 1);
    }

    let data = {
      roleId: _this.props.userInfo.userData.userRole,
      userId: _this.props.userInfo.userData.id,
      id: id
    };

    this.props
    .actionDeletePurchaseData(data)
    .then((result, error) => {
      _this.props.actionLoaderHide();
      _this.setState({ noOfCategory: noOfCategory,deleteConformationModal: false });
    })
    .catch(e => _this.props.actionLoaderHide())
    
  }


  render() {
    let lastMonth = moment().format('DD/MM/YYYY');
    let lastMonth1 = '';
    let _this = this;
    console.log('ListOfBudget============', this.state.ListOfBudget);
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
              <h4 class="hero-title">Create Budget Plan</h4>
              <div className="bugetHeadWrap">
                <div className="budgetHeadleft flex align-center">
                  <div className="commitWrap">
                    <label className="label--radio">
                      <input
                        type="radio"
                        className="radio"
                        name="inputAmountBy"
                        onChange={event => {
                          this.headingChange(event);
                        }}
                        checked={
                          this.state.inputAmountBy == 'commit' ? true : false
                        }
                        value="commit"
                      />{' '}
                      <span>Commit</span>
                    </label>

                    <label className="label--radio">
                      <input
                        type="radio"
                        className="radio"
                        name="inputAmountBy"
                        onChange={event => {
                          this.headingChange(event);
                        }}
                        checked={
                          this.state.inputAmountBy == 'pay' ? true : false
                        }
                        value="pay"
                      />{' '}
                      <span className="label--radio">Pay</span>
                    </label>
                    <label className="label--radio">
                      <input
                        type="radio"
                        className="radio"
                        name="inputAmountBy"
                        onChange={event => {
                          this.headingChange(event);
                        }}
                        checked={
                          this.state.inputAmountBy == 'commit_and_pay'
                            ? true
                            : false
                        }
                        value="commit_and_pay"
                      />{' '}
                      <span className="label--radio">Commit & Pay</span>
                    </label>
                  </div>
                </div>

                <div className="budgetHeadrgt">
                  {this.state.listOfRedComparision &&  this.state.listOfRedComparision.length>0? (
                    <FormGroup>
                      <FormControl
                        componentClass="select"
                        className="s-arrow br-0 redclr"
                        name="redForecastYear"
                        value={this.state.redComparision}
                        onChange={event => {
                          this.handleChangeRequest(event,'redComparision');
                        }}
                      >
                        <option value="">Select Red Comparision</option>
                        {this.state.listOfRedComparision &&
                          this.state.listOfRedComparision.map((item, index) => {
                            return (
                              <option value={item.forecastYear}  data-key={index}>
                               {item.forecastNo ==0?(
                                'Revision' +item.revisionNo+ ' AOP ' +item.forecastYear
                              ):(
                                'Revision' +item.revisionNo+ 'Forecast ' +item.forecastNo +item.forecastYear
                              )}
                              </option>
                            );
                          })}
                      </FormControl>
                    </FormGroup>
                  ) : (
                    ''
                  )}             
                  {this.state.listOfBlueComparision &&  this.state.listOfBlueComparision.length>0? (
                    <FormGroup>
                      <FormControl
                        componentClass="select"
                        className="s-arrow br-0 blueclr"
                        value={this.state.blueComparision}
                        name="blueForecastYear"
                        onChange={event => {
                          this.handleChangeRequest(event,'blueComparision');
                        }}
                      >
                        <option value="">Select Blue Comparision</option>
                        {this.state.listOfBlueComparision &&
                          this.state.listOfBlueComparision.map((item, index) => {
                            return (
                              <option value={item.forecastYear} data-key={index}>
                              {item.forecastNo ==0?(
                                'Revision' +item.revisionNo+ ' AOP ' +item.forecastYear
                              ):(
                                'Revision' +item.revisionNo+ 'Forecast ' +item.forecastNo +item.forecastYear
                              )}
                             </option>
                            );
                          })}
                      </FormControl>
                    </FormGroup>
                  ) : (
                    ''
                  )}
                </div>
                  {this.state.cloneBudgetFromList &&  this.state.cloneBudgetFromList.length>0? (
                  <div className="budhead">
                    <h4 className="hero-title">Clone Budget from</h4>
                    <FormGroup controlId="formControlsSelect1">
                      <FormControl
                        componentClass="select"
                        placeholder="select"
                        className="s-arrow br-0"
                        value={this.state.cloneBudget}
                        name="cloneBudget"
                        onChange={event => {
                          this.handleChangeRequest(event,'cloneBudget');
                        }}
                      >
                        <option value="">Select Status</option>
                        {this.state.cloneBudgetFromList &&
                          this.state.cloneBudgetFromList.map((item, index) => {
                            return (
                              <option value={item.forecastYear} data-key={index}>
                              {item.forecastNo ==0?(
                                'Revision' +item.revisionNo+ ' AOP ' +item.forecastYear
                              ):(
                                'Revision' +item.revisionNo+ 'Forecast ' +item.forecastNo +item.forecastYear
                              )}
                              </option>
                            );
                          })}
                      </FormControl>
                    </FormGroup>
                  </div>
                ) : (
                  ''
                )}
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
                        this.deleteConfirmation(event);
                      }}
                      disabled={this.state.ListOfBudget && this.state.ListOfBudget.length>0?false:true}
                    >
                      Delete Row
                    </button>
                    <button
                      to="home"
                      className="btn btn-primary text-uppercase"
                      onClick={event => {
                        this.addToolYear(event);
                      }}
                      disabled={this.state.ListOfBudget && this.state.ListOfBudget.length>0?false:true}
                    >
                      Add Year
                    </button>
                  </div>
                
       

                  <div className="flex">
                  <FormGroup controlId="formControlsSelect" className="p-5">
                      <FormControl
                        componentClass="select"
                        placeholder="FY2018-19"
                        className="s-arrow br-0"
                        name="forecastYear"
                        value={this.state.forecastYear}
                        onChange={event => {
                          this.handleChangeRequest(event);
                        }}
                      >
                        <option value="">Select FY</option>
                        {this.state.listOfForecastYears &&
                          this.state.listOfForecastYears.map(
                            (item, index) => {
                              return (
                                <option value={item.forecastYear} data-key={index}>
                                  {item.forecastYear}
                                </option>
                              );
                            }
                          )}
                      </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect" className="p-5">
                      <FormControl
                        componentClass="select"
                        placeholder="Revision No"
                        className="s-arrow br-0"
                        name="revisionNo"
                        value={this.state.revisionNo}
                        onChange={event => {
                          this.handleChangeRequest(event);
                        }}
                       >              
                        <option value="">Select Revision</option>
                        {this.state.listOfRevisions &&
                          this.state.listOfRevisions.map((item, index) => {
                            return (
                              <option value={item.revisionNo} key={index}>
                                {item.revisionNo+ ' '+'Revision'}
                              </option>
                            );
                          })}
                      </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect" className="p-5">
                      <FormControl
                        componentClass="select"
                        placeholder="Forecast No"
                        className="s-arrow br-0"
                        name="forecastNo"
                        value={this.state.forecastNo}
                        onChange={e => {
                          this.handleChangeRequest(e);
                        }}
                      >
                        <option value="">Select Forecast</option>
                        {this.state.listOfForecasts &&
                          this.state.listOfForecasts.map((item, index) => {
                            return (
                              <option value={item.forecastNo} key={index} >
                                {item.forecastNo+ ' '+'Forecast'}
                              </option>
                            );
                          })}
                      </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect" className="p-5">
                      <FormControl
                        componentClass="select"
                        placeholder="Revision X"
                        className="s-arrow br-0"
                        name="status"
                        value={this.state.status}
                        onChange={event => {
                          this.handleChangeRequest(event);
                        }}
                      >
                        <option value="">Select Status</option>
                        {this.state.listOfStatus &&
                          this.state.listOfStatus.map((item, index) => {
                            return (
                              <option value={item} key={index}>
                                {removeUnderScore(item)}
                              </option>
                            );
                          })}
                      </FormControl>
                    </FormGroup>
                   
                  </div>
                </div>
                  <div className="table-responsive">
                    <Table
                      id="excel-download"
                      bordered
                      condensed
                      className="custom-table inputform90 createBugetwrap print-table inputbdNone borderbox"
                    >
                      <thead>
                        <tr className="budgetThcenter">
                          <th rowspan="2" className="b-right"> <input
                                      type="checkbox"
                                      className="checkbox"
                                      value='all'
                                      checked={this.state.isSelected ? true : false}
                                      name="isSelected"
                                      onChange={event => {
                                        this.headingChange(event);
                                      }}
                                    /></th>
                          <th colspan="3" scope="colgroup" className="b-right"> Budget Item</th>
                          <th rowspan="2" className="b-right">Account Number</th>
                          {/* <th>Select Account</th> */}
                          <th rowspan="2" className="b-right">Currency </th>
                          {/* <th>ACCOUNT DESCRIPTION</th> */}
                          <th colspan="3" scope="colgroup" className="b-right">Total </th>
                          <th rowspan="2" className="b-right">Spend Category</th>
                          <th rowspan="2" className="b-right">Cost Center</th>
                          {/* <th>Cost Center</th> */}
                          {/* <th>Region</th>
                          <th>BRAND</th>
                          <th>DEPARTMEN</th>
                          <th>MAJOR CATEGORY</th>
                          <th>SECTOR CATEGORY</th> */}
                          {this.state.ListOfBudget[0] &&
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
                                              <p className="display-none">g</p>
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
                                                  <th rowspan="2" className="b-right">
                                                    <p className="m-b-0">
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
                                                            <th rowspan="2" className="b-right">
                                                              <p className="m-b-0">
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
                            Input by: <p className="m-t-10">Intial Approval by: </p>
                          </th>
                          <th colspan="2" scope="colgroup" className="b-right">Approvers</th>
                          <th colspan="2" scope="colgroup" className="b-right">Partial Approval</th>
                          <th rowspan="2"  className="b-right">Status </th>
                          <th rowspan="2" className="b-right">Document</th>
                          <th rowspan="2" className="b-right"></th>
                        </tr>

                        <tr>
                          <th scope="col" className="b-right">ITEM NUMBER </th>
                            <th scope="col" className="b-right">ITEM REVISION</th>
                            <th scope="col" className="b-right">BUDGET ITEM DESCRIPTION</th>
                            <th scope="col" className="b-right">TARGET</th>
                            <th scope="col" className="b-right">PAY</th>
                            <th scope="col" className="b-right">COMMIT</th>
                            <th scope="col" className="b-right">Approver Name</th>
                            <th scope="col" className="b-right">Comments</th>
                            <th scope="col" className="b-right">PAY</th>
                            <th scope="col" className="b-right">COMMIT</th>
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
                                        <p className="txtview">{elem.itemRevisionNo}</p>
                                    </td>

                                    
                                    <td className="w-200">
                                  <FormGroup className="m-b-0 flex">
                                  <textarea rows="5" id="comment"
                                   name="description"
                                   value={elem.description}
                                   placeholder="Description"
                                   className="br-0 form-control"
                                   onChange={event => {
                                     this.handleChange(event, catIndex);
                                    }}/>

                                  
                                  {/* <FormControl as="textarea" rows="3"
                                  name="description"
                                  value={elem.description}
                                  placeholder="Description"
                                  className="br-0 "
                                  onChange={event => {
                                    this.handleChange(event, catIndex);
                                  }}/>
                                   */}
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                <td>
                                        <p className="txtview">{elem.accountNo}</p>
                                    </td>   
                                   
   
    


                                  {/* <FormControl
                                    className="w-150 br-0"
                                    type="text"
                                    name="accountNo"
                                    disabled={true}
                                    placeholder="Budget Item Number"
                                    value={elem.accountNo}
                                    onChange={event => {
                                      this.handleChange(event, catIndex);
                                    }}
                                    onBlur={event => {
                                      this.handleAccountBlur(event, catIndex);
                                    }}
                                  /> */}
                     
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


                                 <td className="w-60"> 
                                  <span className="sm-tip text-left">
                                        {elem.totalBlueBudget}100
                                    </span>
                                   
                                    <FormControl className="br-0"
                                              type="text"
                                              name="totalBudget"
                                              placeholder="Total Budget"
                                              value= {elem.totalBudget}
                                              onChange={event => {
                                                this.handleChange(event, catIndex);
                                              }}
                                            />
                                            <FormControl.Feedback />
                                    <span className="sm-tip color-light text-right">
                                      {elem.totalRedBudget}100
                                    </span>
                                 </td>

                              <td className="w-60">    
                              <span className="sm-tip text-left">
                                        {elem.totalBluePayAmount} 100
                                    </span>
                                  {elem.totalPayAmount}
                                  <span className="sm-tip color-light text-right">
                                      {elem.totalRedPayAmount}100
                                    </span>
               
                              </td>

                              <td className="w-60">
                              <span className="sm-tip text-left">
                                        {elem.totalBlueCommitAmount}100
                                    </span> 
                                {elem.totalCommitAmount}
                                <span className="sm-tip color-light text-right">
                                      {elem.totalRedCommitAmount}100
                                    </span>
                              </td>


                                <td className="custom-dd dropRf customdropdown w-150">
                                <FormGroup
                                  controlId="formControlsSelect"
                                  className="w-full"
                                >
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0 line-set"
                                    name="majorCategoryId"
                                    value={elem.majorCategoryId}
                                    // onChange={this.handleChange(
                                    //   'region',
                                    //    catIndex
                                    // )}

                                    onChange = {event => {
                                      this.handleChangeMajorCategory(
                                        event,
                                        catIndex,
                                        'CATEGORY',
                                      );
                                    }}
                                  >
                                    <option value="">Major Category</option>
                                    {this.state.listOfMajorCategory &&
                                      this.state.listOfMajorCategory.map(
                                        (item, index) => {
                                          return (
                                            <option
                                              value={item.id}
                                              key={index}
                                              data-key={index}
                                            >
                                              {item.name}
                                            </option>
                                          );
                                        }
                                      )}
                                  </FormControl>
                                </FormGroup>
                                <FormGroup
                                  controlId="formControlsSelect"
                                  className="w-full"
                                >
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0 line-set"
                                    name="categoryId"
                                    value={elem.categoryId}
                                    // onChange={this.handleChange(
                                    //   'region',
                                    //    catIndex
                                    // )}
                                    onChange={event => {
                                      this.handleChangeMajorCategory(
                                        event,
                                        catIndex,
                                        'SUB_CATEGORY',
                                      );
                                    }}
                                  >
                                    <option value="">Category</option>
                                    {elem.listOfCategory &&
                                      elem.listOfCategory.map(
                                        (subitem,subindex) => {
                                          return (
                                            <option
                                              value={subitem.id}
                                              key={subindex}
                                              data-key={subindex}
                                            >
                                              {subitem.name}
                                            </option>
                                          );
                                        }
                                      )}
                                  </FormControl>
                                </FormGroup>
                                <FormGroup
                                  controlId="formControlsSelect"
                                  className="w-full"
                                >
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0 line-set"
                                    name="subCategoryId"
                                    value={elem.subCategoryId}
                                    onChange={event => {
                                      this.handleChangeMajorCategory(
                                        event,
                                        catIndex,
                                        'SUB_SUB_CATEGORY',
                                      );
                                    }}
                                  >
                                    <option value="">Sub Category</option>
                                    {elem.listOfSubCategory &&
                                      elem.listOfSubCategory.map(
                                        (subSubItem,subsubindex)=> {
                                          return (
                                            <option
                                              value={subSubItem.id}
                                              key={subsubindex}
                                              data-key={subsubindex}
                                            >
                                              {subSubItem.name}
                                            </option>
                                          );
                                        }
                                      )}
                                  </FormControl>
                                </FormGroup>
                                <FormGroup
                                  controlId="formControlsSelect"
                                  className="w-full"
                                >
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0 line-set"
                                    name="subSubCategoryId"
                                    value={elem.subSubCategoryId}
                                    onChange={event => {
                                      this.handleChangeMajorCategory(
                                        event,
                                        catIndex,
                                        'CHILD',
                                      );
                                    }}
                                  >
                                    <option value="">Sub Sub Category</option>
                                    {elem.listOfSubSubCategory &&
                                      elem.listOfSubSubCategory.map(
                                        (subSubSubItem,subsubsubindex) => {
                                          return (
                                            <option
                                              value={subSubSubItem.id}
                                              key={subsubsubindex}
                                              data-key={subsubsubindex}
                                            >
                                              {subSubSubItem.name}
                                            </option>
                                          );
                                        }
                                      )}
                                  </FormControl>
                                </FormGroup>

                              </td>
                                <td className="custom-dd dropRf customdropdown">
                               <div className="createDrop tooltipCustom">
                                 {elem.regionTitle?(<span class="tooltiptext">{elem.regionTitle}</span>):''}
                                 <DropdownButton
                                    title={elem.regionTitle?(<span className='dropdownEllipsis'>{elem.regionTitle}</span>):'Geographical Classification'}
                                    name="Select specification"
                                    className="dropbgwhite w-200 word-break"
                                  >
                                    <ul>
                                      {this.state.listOfGlobalRegions &&
                                        this.state.listOfGlobalRegions.map(
                                          (item, index) => [
                                            <li
                                              className={item.globalRegionId ==
                                                elem.globalRegionId
                                                ? 'dropactiveTitle'
                                                : ''}>
                                             <span className="costTitle"> {item.globalRegions}</span>
                                              {item.globalSubRegions &&
                                                item.globalSubRegions
                                                  .length > 0 ? (
                                                  <ul>
                                                    {item.globalSubRegions.map(
                                                      (
                                                        subitem,
                                                        subindex
                                                      ) => [
                                                          <li
                                                            className={subitem.id ==
                                                              elem.globalSubRegionId
                                                              ? 'dropactiveTitle'
                                                              : ''}

                                                            onClick={event =>
                                                              this.handleChangeRegion(
                                                                event,
                                                                'error'
                                                              )
                                                            }
                                                          >
                                                           <span className="costTitle"> {subitem.name} </span>
                                                            {subitem.countries &&
                                                              subitem.countries
                                                                .length > 0 ? (
                                                                <ul>
                                                                  {subitem.countries.map(
                                                                    (
                                                                      countryItem,
                                                                      countryIndex
                                                                    ) => [
                                                                        <li
                                                                          className={countryItem.id ==
                                                                            elem.countryId
                                                                            ? 'dropactiveTitle'
                                                                            : ''}
                                                                          onClick={event =>
                                                                            this.handleChangeRegion(
                                                                              event,
                                                                              'error'
                                                                            )
                                                                          }
                                                                        >
                                                                          <span className="costTitle">{
                                                                            countryItem.name
                                                                          }</span>

                                                                          {countryItem.zones &&
                                                                            countryItem
                                                                              .zones
                                                                              .length >
                                                                            0 ? (
                                                                              <ul>
                                                                                {countryItem.zones.map(
                                                                                  (
                                                                                    zoneItem,
                                                                                    zoneIndex
                                                                                  ) => [
                                                                                      <li
                                                                                        className={zoneItem.name ==
                                                                                          elem.zone
                                                                                          ? 'dropactiveTitle'
                                                                                          : ''}
                                                                                        onClick={event =>
                                                                                          this.handleChangeRegion(
                                                                                            event,
                                                                                            'error'
                                                                                          )
                                                                                        }
                                                                                      >
                                                                                       <span className="costTitle"> {
                                                                                          zoneItem.name
                                                                                        }</span>
                                                                                        {zoneItem.localBussinessRegion &&
                                                                                          zoneItem
                                                                                            .localBussinessRegion
                                                                                            .length >
                                                                                          0 ? (
                                                                                            <ul>
                                                                                              {zoneItem.localBussinessRegion.map(
                                                                                                (
                                                                                                  localItem,
                                                                                                  zoneIndex
                                                                                                ) => [
                                                                                                    <li
                                                                                                      className={localItem.name ==
                                                                                                        elem.localBussinessRegion
                                                                                                        ? 'dropactiveTitle'
                                                                                                        : ''}
                                                                                                      onClick={event =>
                                                                                                        this.handleChangeRegion(
                                                                                                          event,
                                                                                                          'error'
                                                                                                        )
                                                                                                      }
                                                                                                    >
                                                                                                     <span className="costTitle"> {
                                                                                                        localItem.name
                                                                                                      }</span>
                                                                                                      {localItem.districts &&
                                                                                                        localItem
                                                                                                          .districts
                                                                                                          .length >
                                                                                                        0 ? (
                                                                                                          <ul>
                                                                                                            {localItem.districts.map(
                                                                                                              (
                                                                                                                districtsItem,
                                                                                                                zoneIndex
                                                                                                              ) => [
                                                                                                                  <li
                                                                                                                    className={districtsItem.name ==
                                                                                                                      elem.district
                                                                                                                      ? 'dropactiveTitle'
                                                                                                                      : ''}
                                                                                                                    onClick={event =>
                                                                                                                      this.handleChangeRegion(
                                                                                                                        event,
                                                                                                                        'error'
                                                                                                                      )
                                                                                                                    }
                                                                                                                  >
                                                                                                                 <span className="costTitle">   {
                                                                                                                      districtsItem.name
                                                                                                                    }</span>
                                                                                                                    {districtsItem.circles &&
                                                                                                                      districtsItem
                                                                                                                        .circles
                                                                                                                        .length >
                                                                                                                      0 ? (
                                                                                                                        <ul>
                                                                                                                          {districtsItem.circles.map(
                                                                                                                            (
                                                                                                                              circlesItem,
                                                                                                                              zoneIndex
                                                                                                                            ) => [
                                                                                                                                <li className={circlesItem.name ==
                                                                                                                                  elem.circle
                                                                                                                                  ? 'dropactiveTitle'
                                                                                                                                  : ''}
                                                                                                                                >
                                                                                                                                  <span className="costTitle">{
                                                                                                                                    circlesItem.name
                                                                                                                                  }</span>




                                                                                                                                  {circlesItem.area &&
                                                                                                                                    circlesItem
                                                                                                                                      .area
                                                                                                                                      .length >
                                                                                                                                    0 ? (
                                                                                                                                      <ul>
                                                                                                                                        {circlesItem.area.map(
                                                                                                                                          (
                                                                                                                                            areaItem,
                                                                                                                                            zoneIndex
                                                                                                                                          ) => [
                                                                                                                                              <li
                                                                                                                                                className={areaItem.name ==
                                                                                                                                                  elem.area
                                                                                                                                                  ? 'dropactiveTitle '
                                                                                                                                                  : ''}
                                                                                                                                                onClick={event =>
                                                                                                                                                  this.handleChangeRegion(
                                                                                                                                                    event,
                                                                                                                                                    '',
                                                                                                                                                    catIndex,
                                                                                                                                                    item.id,
                                                                                                                                                    item.globalRegionId,
                                                                                                                                                    subitem.id,
                                                                                                                                                    countryItem.id,
                                                                                                                                                    zoneItem.name,
                                                                                                                                                    localItem.name,
                                                                                                                                                    districtsItem.name,
                                                                                                                                                    circlesItem.name,
                                                                                                                                                    areaItem.name,
                                                                                                                                                    item.globalRegions,
                                                                                                                                                    subitem.name,
                                                                                                                                                    countryItem.name
                                                                                                                                                  )
                                                                                                                                                }
                                                                                                                                              >
                                                                                                                                               <span className="costTitle"> {
                                                                                                                                                  areaItem.name
                                                                                                                                                }</span>
                                                                                                                                              </li>
                                                                                                                                            ]
                                                                                                                                        )}
                                                                                                                                      </ul>
                                                                                                                                    ) : (
                                                                                                                                      ''
                                                                                                                                    )}






                                                                                                                                </li>
                                                                                                                              ]
                                                                                                                          )}
                                                                                                                        </ul>
                                                                                                                      ) : (
                                                                                                                        ''
                                                                                                                      )}
                                                                                                                  </li>
                                                                                                                ]
                                                                                                            )}
                                                                                                          </ul>
                                                                                                        ) : (
                                                                                                          ''
                                                                                                        )}
                                                                                                    </li>
                                                                                                  ]
                                                                                              )}
                                                                                            </ul>
                                                                                          ) : (
                                                                                            ''
                                                                                          )}
                                                                                      </li>
                                                                                    ]
                                                                                )}
                                                                              </ul>
                                                                            ) : (
                                                                              ''
                                                                            )}
                                                                        </li>
                                                                      ]
                                                                  )}
                                                                </ul>
                                                              ) : (
                                                                ''
                                                              )}
                                                          </li>
                                                        ]
                                                    )}
                                                  </ul>
                                                ) : (
                                                  ''
                                                )}
                                            </li>
                                          ]
                                        )}
                                    </ul>     
                                  </DropdownButton>
                                </div>  
                               <div className="createDrop tooltipCustom">  
                               {/* <span class="tooltiptext">hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</span>  */}
                               {elem.sectorTitle?(<span class="tooltiptext">{elem.sectorTitle}</span>):''}
                                  <DropdownButton
                                    title= {elem.sectorTitle?(<span className='dropdownEllipsis'>{elem.sectorTitle}</span>):'Product Line Classification'}
                                    name="Select specification"
                                    className="dropbgwhite w-200 word-break"
                                  >
                                    <ul>
                                      {this.state.listOfSectorCategory &&
                                        this.state.listOfSectorCategory.map(
                                          (item, index) => {
                                            let subdepLen =
                                              item.listOfProductLineCategory &&
                                                item
                                                  .listOfProductLineCategory
                                                  .length > 0
                                                ? ''
                                                : '';
                                            let subdepActive =
                                              item.id == elem.sectorId
                                                ? 'dropactiveTitle'
                                                : '';
                                            return [
                                              <li
                                                className={
                                                  subdepLen +
                                                  ' ' +
                                                  subdepActive
                                                }
                                                onMouseOver={event => {
                                                  this.handleChangeMouseOver(
                                                    event,
                                                    item.id,
                                                    index,
                                                    'PRODUCT_LINE'
                                                  );
                                                }}
                                                onClick={event => {
                                                  this.handleChangeSelect(
                                                    event,
                                                    'sectorId',
                                                    item.id,
                                                    catIndex,'','','',item.name
                                                  );
                                                }}
                                              >
                                                <span className="costTitle">{item.name}</span>
                                                {item.listOfProductLineCategory &&
                                                  item
                                                    .listOfProductLineCategory
                                                    .length > 0 ? (
                                                    <ul>
                                                      {item.listOfProductLineCategory.map(
                                                        (
                                                          subitem,
                                                          subindex
                                                        ) => {
                                                          let subdepLen =
                                                            subitem.listOfModelFamilyCategory &&
                                                              subitem
                                                                .listOfModelFamilyCategory
                                                                .length > 0
                                                              ? ''
                                                              : '';
                                                          let subdepActive =
                                                            subitem.id ==
                                                              elem.productLineId
                                                              ? 'dropactiveTitle'
                                                              : '';
                                                          return [
                                                            <li
                                                              className={
                                                                subdepLen +
                                                                ' ' +
                                                                subdepActive
                                                              }
                                                              onMouseOver={event => {
                                                                this.handleChangeMouseOver(
                                                                  event,
                                                                  subitem.id,
                                                                  index,
                                                                  'MODEL_FAMILY',
                                                                  subindex
                                                                );
                                                              }}
                                                              onClick={event => {
                                                                this.handleChangeSelect(
                                                                  event,
                                                                  'productLineId',
                                                                  subitem.id,
                                                                  catIndex,
                                                                  item.id,'','',item.name,subitem.name
                                                                );
                                                              }}
                                                            >
                                                              <span className="costTitle">{subitem.name}</span>
                                                              {subitem.listOfModelFamilyCategory &&
                                                                subitem
                                                                  .listOfModelFamilyCategory
                                                                  .length >
                                                                0 ? (
                                                                  <ul>
                                                                    {subitem.listOfModelFamilyCategory.map(
                                                                      (
                                                                        subSubItem,
                                                                        sunsubindex
                                                                      ) => {
                                                                        let subdepLen =
                                                                          subSubItem.listOfProgramCategory &&
                                                                            subSubItem
                                                                              .listOfProgramCategory
                                                                              .length >
                                                                            0
                                                                            ? ''
                                                                            : '';
                                                                        let subdepActive =
                                                                          subSubItem.id ==
                                                                            elem.modelFamilyId
                                                                            ? 'dropactiveTitle'
                                                                            : '';
                                                                        return [
                                                                          <li
                                                                            className={
                                                                              subdepLen +
                                                                              ' ' +
                                                                              subdepActive
                                                                            }
                                                                            onMouseOver={event => {
                                                                              this.handleChangeMouseOver(
                                                                                event,
                                                                                subSubItem.id,
                                                                                index,
                                                                                'PROGRAM',
                                                                                subindex,
                                                                                sunsubindex
                                                                              );
                                                                            }}
                                                                            onClick={event => {
                                                                              this.handleChangeSelect(
                                                                                event,
                                                                                'modelFamilyId',
                                                                                subSubItem.id,
                                                                                catIndex,
                                                                                item.id,
                                                                                subitem.id,'',item.name,
                                                                                subitem.name,subSubItem.name
                                                                              );
                                                                            }}
                                                                          > <span className="costTitle">
                                                                            {
                                                                              subSubItem.name
                                                                            }</span>
                                                                            {subSubItem.listOfProgramCategory &&
                                                                              subSubItem
                                                                                .listOfProgramCategory
                                                                                .length >
                                                                              0 ? (
                                                                                <ul>
                                                                                  {subSubItem.listOfProgramCategory.map(
                                                                                    (
                                                                                      childitem,
                                                                                      subindex
                                                                                    ) => {
                                                                                      let subdepActive =
                                                                                        childitem.id ==
                                                                                          elem.programId
                                                                                          ? 'dropactiveTitle'
                                                                                          : '';
                                                                                      return [
                                                                                        <li
                                                                                          className={
                                                                                            subdepActive
                                                                                          }
                                                                                          onClick={event => {
                                                                                            this.handleChangeSelect(
                                                                                              event,
                                                                                              'programId',
                                                                                              childitem.id,
                                                                                              catIndex,
                                                                                              item.id,
                                                                                              subitem.id,
                                                                                              subSubItem.id
                                                                                              ,item.name,
                                                                                              subitem.name,subSubItem.name,
                                                                                              childitem.name
                                                                                            );
                                                                                          }}
                                                                                        >
                                                                                          <span className="costTitle">{
                                                                                            childitem.name
                                                                                          }</span> 

                                                                                        </li>
                                                                                      ];
                                                                                    }
                                                                                  )}
                                                                                </ul>
                                                                              ) : (
                                                                                ''
                                                                              )}
                                                                          </li>
                                                                        ];
                                                                      }
                                                                    )}
                                                                  </ul>
                                                                ) : (
                                                                  ''
                                                                )}
                                                            </li>
                                                          ];
                                                        }
                                                      )}
                                                    </ul>
                                                  ) : (
                                                    ''
                                                  )}
                                              </li>
                                            ];
                                          }
                                        )}
                                    </ul>
                                  </DropdownButton>
                               </div>
                              <div className="createDrop tooltipCustom">  
                               {elem.brandTitle?(<span class="tooltiptext">{elem.brandTitle}</span>):''}
                                  <DropdownButton
                                    title= {elem.brandTitle?(<span className='dropdownEllipsis'>{elem.brandTitle}</span>):'Brand Cost Center'}
                                    name="Select specification"
                                    className="dropbgwhite w-200 word-break"
                                  >
                                    <ul>
                                      {this.state.listOfBrands &&
                                        this.state.listOfBrands.map(
                                          (item, index) => {
                                            let brlen =
                                              item.listOfSubBrands &&
                                                item.listOfSubBrands
                                                  .length > 0
                                                ? ''
                                                : '';
                                            let brActive =
                                              elem.brandId === item.id
                                                ? 'dropactiveTitle'
                                                : '';
                                            return [
                                              <li
                                                className={
                                                  brlen + ' ' + brActive
                                                }
                                                onMouseOver={event => {
                                                  this.handleChangeMouseOver(
                                                    event,
                                                    item.id,
                                                    index,
                                                    'BRAND'
                                                  );
                                                }}
                                                onClick={event =>
                                                  this.handleChangeSelect(
                                                    event,
                                                    'brandId',
                                                    item.id,
                                                    catIndex,
                                                    '','','',item.name
                                                  )
                                                }


                                              >
                                               <span className="costTitle"> {item.name}</span>
                                                {item.listOfSubBrands &&
                                                  item.listOfSubBrands
                                                    .length > 0 ? (
                                                    <ul>
                                                      {item.listOfSubBrands.map(
                                                        (
                                                          subitem,
                                                          subindex
                                                        ) => {
                                                          return [
                                                            <li
                                                              className={
                                                                elem.subBrandId ===
                                                                  subitem.id
                                                                  ? 'dropactiveTitle'
                                                                  : ''
                                                              }
                                                              onClick={event =>
                                                                this.handleChangeSelect(
                                                                  event,
                                                                  'subBrandId',
                                                                  subitem.id,
                                                                  catIndex,
                                                                  item.id,
                                                                  '','',item.name,subitem.name
                                                                )
                                                              }


                                                            >
                                                             <span className="costTitle"> {subitem.name}</span>
                                                            </li>
                                                          ];
                                                        }
                                                      )}
                                                    </ul>
                                                  ) : (
                                                    ''
                                                  )}
                                              </li>
                                            ];
                                          }
                                        )}
                                    </ul>
                                  </DropdownButton>
                                </div>
                                <div className="createDrop tooltipCustom">  
                                {elem.departmentTitle?(<span class="tooltiptext">{elem.departmentTitle}</span>):''}
                                  <DropdownButton
                                   title= {elem.departmentTitle?(<span className='dropdownEllipsis'>{elem.departmentTitle}</span>):'Functional Classification'}
                                    name="Select specification"
                                    className="dropbgwhite w-200 word-break"
                                  >
                                    <ul>
                                      {this.state.listOfDepartment &&
                                        this.state.listOfDepartment.map(
                                          (item, index) => {
                                            let depLen =
                                              item.listOfSubDept &&
                                                item.listOfSubDept.length >
                                                0
                                                ? ''
                                                : '';
                                            let depActive =
                                              item.id == elem.departmentId
                                                ? 'dropactiveTitle'
                                                : '';
                                            return [
                                              <li
                                                className={
                                                  depLen + ' ' + depActive
                                                }
                                                onMouseOver={event => {
                                                  this.handleChangeMouseOver(
                                                    event,
                                                    item.id,
                                                    index,
                                                    'DEPARTMENT_SUB_DIVISION'
                                                  );
                                                }}
                                                onClick={event => {
                                                  this.handleChangeSelect(
                                                    event,
                                                    'departmentId',
                                                    item.id,
                                                    catIndex
                                                    ,'','','',item.name
                                                  );
                                                }}
                                              >
                                              <span className="costTitle">  {item.name}</span>
                                                {item.listOfSubDept &&
                                                  item.listOfSubDept
                                                    .length > 0 ? (
                                                    <ul>
                                                      {item.listOfSubDept.map(
                                                        (
                                                          subitem,
                                                          subindex
                                                        ) => {
                                                          let subdepLen =
                                                            subitem.listOfTeam &&
                                                              subitem
                                                                .listOfTeam
                                                                .length > 0
                                                              ? ''
                                                              : '';
                                                          let subdepActive =
                                                            subitem.id ==
                                                              elem.subDepartmentId
                                                              ? 'dropactiveTitle'
                                                              : '';
                                                          return [
                                                            <li
                                                              className={
                                                                subdepLen +
                                                                ' ' +
                                                                subdepActive
                                                              }
                                                              onMouseOver={event => {
                                                                this.handleChangeMouseOver(
                                                                  event,
                                                                  subitem.id,
                                                                  index,
                                                                  'TEAM',
                                                                  subindex
                                                                );
                                                              }}
                                                              onClick={event => {
                                                                this.handleChangeSelect(
                                                                  event,
                                                                  'subDepartmentId',
                                                                  subitem.id,
                                                                  catIndex,
                                                                  item.id
                                                                  ,'','',item.name,subitem.name
                                                                );
                                                              }}
                                                            >
                                                             <span className="costTitle"> {subitem.name}</span>
                                                                  {subitem.listOfTeam &&
                                                                subitem
                                                                  .listOfTeam
                                                                  .length >
                                                                0 ? (
                                                                  <ul>
                                                                    {subitem.listOfTeam.map(
                                                                      (
                                                                        subSubItem,
                                                                        subindex
                                                                      ) => [
                                                                          <li
                                                                            className={
                                                                              subSubItem.id ==
                                                                                elem.teamId
                                                                                ? 'dropactiveTitle'
                                                                                : ''
                                                                            }
                                                                            onClick={event => {
                                                                              this.handleChangeSelect(
                                                                                event,
                                                                                'teamId',
                                                                                subSubItem.id,
                                                                                catIndex,
                                                                                item.id,
                                                                                subitem.id
                                                                                ,'',item.name,subitem.name,subSubItem.name
                                                                              );
                                                                            }}
                                                                          >
                                                                           <span className="costTitle"> {
                                                                              subSubItem.name
                                                                            }</span>
                                                                          </li>
                                                                        ]
                                                                    )}
                                                                  </ul>
                                                                ) : (
                                                                  ''
                                                                )}
                                                            </li>
                                                          ];
                                                        }
                                                      )}
                                                    </ul>
                                                  ) : (
                                                    ''
                                                  )}
                                              </li>
                                            ];
                                          }
                                        )}
                                    </ul>
                                  </DropdownButton>
                                  </div>
                                  </td>

                                {/* Start:- new td added as a region */}

                                {/* <td className="bugettbfl">
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
                                        <td className="budinput commitpaysec">


                                             <div class="radioWrap flex align-center justify-center m-b-10">
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
                                                    <span className="radioIntxt">Y</span>
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
                                                     <span className="radioIntxt">Q</span>
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
                                                     <span className="radioIntxt">M</span>
                                                  </label>
                                                </div>
                                              </div>

                                      <div className="flex align-center justify-space-around border-top">   
                                          {_this.state.inputAmountBy ==
                                                  'commit_and_pay' ||
                                                _this.state.inputAmountBy ==
                                                  'pay' ? (  
                                            <p className="labelwd">Pay </p>):''}
                                          {_this.state.inputAmountBy ==
                                            'commit_and_pay'  ? (
                                            <span className="border-rightaf"> </span>):''}

                                          {_this.state.inputAmountBy ==
                                                  'commit_and_pay' ||
                                                _this.state.inputAmountBy ==
                                                  'commit' ? (
                                            <p className="labelwd">Commit </p>):''}
                                         </div>
                                       <div className="flex align-center bmainwrap">  
                                            {_this.state.inputAmountBy ==
                                                  'commit_and_pay' ||
                                                _this.state.inputAmountBy ==
                                                  'pay' ? (
                                                    <div className={_this.state.inputAmountBy !=
                                                      'pay' ? ('b-p-warpper comflex border-right'):'b-p-warpper comflex '}>
                                                  <div className="">
                                                    {this.state
                                                      .iscompareRed ? (
                                                      <span className="sm-tip text-left">
                                                        {itemObj.bluePayAmount}
                                                      </span>
                                                    ) : (
                                                      ''
                                                    )}
                                                    <FormControl
                                                      type="text"
                                                      className="br-0 inputh20 w-60"
                                                      name="payAmount"
                                                      placeholder="Pay Amount"
                                                      value={itemObj.payAmount}
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
                                                         {itemObj.redPayAmount}
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
                                                      .iscompareRed ? (
                                                      <span className="sm-tip text-left">
                                                        {itemObj.blueCommitAmount}
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
                                                        {itemObj.redCommitAmount}
                                                      </span>
                                                    ) : (
                                                      ''
                                                    )}
                                                  </div>
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
                                                      <td className="budinput commitpaysec">
                                                        
                                                        
                                                        {/* <div className="flex align-center justify-space-around border-top m-t-20">     
                                                            <p className="labelwd">Pay </p>
                                                            <span className="border-rightaf"> </span>
                                                            <p className="labelwd">Commit </p>
                                                          </div> */}
                                                          
                                                  <div className="flex align-center justify-space-around border-top m-t-20">   
                                                  {_this.state.inputAmountBy ==
                                                              'commit_and_pay' ||
                                                            _this.state.inputAmountBy ==
                                                              'pay' ? (  
                                                      <p className="labelwd">Pay </p>):''}
                                                      {_this.state.inputAmountBy ==
                                                        'commit_and_pay'  ? (
                                                      <span className="border-rightaf"> </span>):''}

                                                      {_this.state.inputAmountBy ==
                                                              'commit_and_pay' ||
                                                            _this.state.inputAmountBy ==
                                                              'commit' ? (
                                                      <p className="labelwd">Commit </p>):''}
                                                    </div>


                                                        <div className="flex align-center bmainwrap">  
                                                         
                                                          {_this.state
                                                            .inputAmountBy ==
                                                            'commit_and_pay' ||
                                                          _this.state
                                                            .inputAmountBy ==
                                                            'pay' ? (
                                                              <div className={_this.state.inputAmountBy !=
                                                                'pay' ? ('b-p-warpper comflex border-right'):'b-p-warpper comflex '}>
                                                            <div>
                                                              {this.state
                                                                .iscompareRed ? (
                                                                <span className="sm-tip text-left">
                                                                   {itemQauter.bluePayAmount}
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
                                                                   {itemQauter.redPayAmount}
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
                                                                .iscompareRed ? (
                                                                <span className="sm-tip text-left">
                                                                 {itemQauter.blueCommitAmount}
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
                                                                  {itemQauter.redCommitAmount}
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}
                                                            </div>
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
                                                                <td className="budinput commitpaysec">
                                                                       {/* <div className="flex align-center justify-space-around border-top m-t-20">     
                                                                          <p className="labelwd">Pay </p>
                                                                          <span className="border-rightaf"> </span>
                                                                          <p className="labelwd">Commit </p>
                                                                        </div> */}
                                                                <div className="flex align-center justify-space-around border-top m-t-20">   
                                                                  {_this.state.inputAmountBy ==
                                                                              'commit_and_pay' ||
                                                                            _this.state.inputAmountBy ==
                                                                              'pay' ? (  
                                                                      <p className="labelwd">Pay </p>):''}
                                                                      {_this.state.inputAmountBy ==
                                                                        'commit_and_pay'  ? (
                                                                      <span className="border-rightaf"> </span>):''}

                                                                      {_this.state.inputAmountBy ==
                                                                              'commit_and_pay' ||
                                                                            _this.state.inputAmountBy ==
                                                                              'commit' ? (
                                                                      <p className="labelwd">Commit </p>):''}
                                                                    </div>


                                                                      <div className="flex align-center bmainwrap">  
                                                                    {_this.state
                                                                      .inputAmountBy ==
                                                                      'commit_and_pay' ||
                                                                    _this.state
                                                                      .inputAmountBy ==
                                                                      'pay' ? (
                                                                        <div className={_this.state.inputAmountBy !=
                                                                          'pay' ? ('b-p-warpper comflex border-right'):'b-p-warpper comflex '}>

                                                                      <div>
                                                                        {this
                                                                          .state
                                                                          .iscompareRed ? (
                                                                          <span className="sm-tip text-left">
                                                                           {itemMonth.bluePayAmount}
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
                                                                            {itemMonth.redPayAmount}
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}
                                                                      </div> </div>
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
                                                                          .iscompareRed ? (
                                                                          <span className="sm-tip text-left">
                                                                            {itemMonth.blueCommitAmount}
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
                                                                            {itemMonth.redCommitAmount}
                                                                          </span>
                                                                        ) : (
                                                                          ''
                                                                        )}
                                                                      </div> </div>
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
                                )}

                                <td className="inputapprove buyad w-120">
                                  <ul className="list-style-none p-0 limtb5 word-break">
                                    <li>
                                      {elem.initialCreatorBy?(elem.initialCreatorBy.firstName
                                      +' ' +elem.initialCreatorBy.lastName
                                      ):(this.props.userInfo.userData.fullname)}
                                    </li>
                                    <li>
                                      {elem.initialApprovalBy &&
                                      elem.initialApprovalBy.firstName +' ' 
                                      +elem.initialApprovalBy.lastName}
                                    </li>
                                  </ul>
                                </td>



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
                                              className = 'greyclr m-l-10 w100';
                                            } else if (
                                              item.approvalStatus == 'declined'
                                            ) {
                                              className = 'redclr m-l-10 w100';
                                            } else if (
                                              item.approvalStatus == 'approved'
                                            ) {
                                              className =
                                                'greenclr m-l-10 w100';
                                              btnCls = 'cursor-disabled';
                                            } else if (
                                              item.approvalStatus == 'send_back'
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
                                                  : item['approver'].firstName +
                                                    ' ' +
                                                    item['approver']
                                                      .lastName}{' '}
                                              </div>
                                            );
                                          }
                                        )
                                      : ''}
                                  </td>



                                  <td>
                                    {elem.listOfApprovers &&
                                    elem.listOfApprovers.length > 0
                                      ? elem.listOfApprovers &&
                                        elem.listOfApprovers &&
                                        elem.listOfApprovers.map(
                                          (item, index) => {
                                            let btnCls = '';
                                             if (
                                              item.approvalStatus == 'approved'
                                            ) {
                                              btnCls = 'cursor-disabled';
                                            } 
                                            return (
                                              <div className="top-col r-breif contentleft flex align-center m-l-10"
                                                key={index}>
                                                {item &&
                                                item.comments &&
                                                item.comments !== undefined &&
                                                item.comments[0] &&
                                                item.comments[0].comment ? (
                                                  <p>
                                                    <span className="m-l-5" style={otherWordStyle}>
                                                      {item.comments[0].comment}
                                                    </span>
                                                    
                                                  </p>
                                                ) : (
                                                  ''
                                                )}
                                                {item.approver &&
                                                ((this.props.userInfo.userData
                                                  .id == item.approver.id &&
                                                  elem.comments === undefined &&
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
                                                      <span
                                                        className="ico-action-sm fill-green flex m-l-10"
                                                        // onClick={() => {
                                                        //   this.revisionApprove(
                                                        //     'approved',
                                                        //     item.levelOfApproval,
                                                        //     elem
                                                        //       .budgetRevisionResponse
                                                        //       .id,
                                                        //     catIndex
                                                        //   );
                                                        // }}
                                                      >
                                                        <svg>
                                                          <use
                                                            xlinkHref={`${Sprite}#rightCircleIco`}
                                                          />
                                                        </svg>
                                                      </span>
                                                      {/* <span
                                                        className="ico-action-sm fill-red flex m-l-10"
                                                        // onClick={() => {
                                                        //   this.revisionApprove(
                                                        //     'reject',
                                                        //     item.levelOfApproval,
                                                        //     elem
                                                        //       .budgetRevisionResponse
                                                        //       .id,
                                                        //     catIndex
                                                        //   );
                                                        // }}
                                                      >
                                                        <svg>
                                                          <use
                                                            xlinkHref={`${Sprite}#rejectIco`}
                                                          />
                                                        </svg>
                                                      </span> */}
                                                      <span
                                                        className={
                                                          'ico-action-sm fill-orange flex m-l-10 ' +
                                                          btnCls
                                                        }
                                                        // onClick={() => {
                                                        //   this.revisionApprove(
                                                        //     'send_back',
                                                        //     item.levelOfApproval,
                                                        //     elem
                                                        //       .budgetRevisionResponse
                                                        //       .id,
                                                        //     catIndex
                                                        //   );
                                                        // }}
                                                      >
                                                        <svg>
                                                          <use
                                                            xlinkHref={`${Sprite}#refresh1Ico`}
                                                          />
                                                        </svg>
                                                      </span>
                                                    </div>
                                                  </div>
                                                ) : item &&
                                                  item.comments &&
                                                  item.comments !== undefined &&
                                                  item.comments[0] &&
                                                  item.comments[0].comment ? (
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
                                                      <span
                                                        className={
                                                          'ico-action-sm fill-green flex m-l-10 ' +
                                                          btnCls
                                                        }
                                                        // disabled={
                                                        //   btnCls ? true : false
                                                        // }
                                                        // onClick={() => {
                                                        //   this.revisionApprove(
                                                        //     'approved',
                                                        //     item.levelOfApproval,
                                                        //     elem
                                                        //       .budgetRevisionResponse
                                                        //       .id,
                                                        //     catIndex
                                                        //   );
                                                        // }}
                                                      >
                                                        <svg>
                                                          <use
                                                            xlinkHref={`${Sprite}#rightCircleIco`}
                                                          />
                                                        </svg>
                                                      </span>
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
                                                      <span
                                                        className={
                                                          'ico-action-sm fill-orange flex m-l-10 ' +
                                                          btnCls
                                                        }
                                                        // disabled={
                                                        //   btnCls ? true : false
                                                        // }
                                                        // onClick={() => {
                                                        //   _this.revisionApprove(
                                                        //     'send_back',
                                                        //     item.levelOfApproval,
                                                        //     elem
                                                        //       .budgetRevisionResponse
                                                        //       .id,
                                                        //     catIndex
                                                        //   );
                                                        // }}
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
                                              </div>
                                            );
                                          }
                                        )
                                      : ''}
                                  </td>
                                  <td>
                                  {elem.partialPay}
                                  
                                    {/* {elem.listOfApprovers &&
                                    elem.listOfApprovers.length > 0
                                      ? elem.listOfApprovers &&
                                        elem.listOfApprovers &&
                                        elem.listOfApprovers.map(
                                          (item, index) => {
                                            return (
                                              <FormGroup className="m-l-10 w50">
                                                <FormControl
                                                  placeholder="Pay"
                                                  type="text"
                                                  className="br-0 h-28"
                                                  value={elem.totalPayAmount}
                                                  name="otherSpecialDescription"
                                                />
                                                <FormControl.Feedback />
                                              </FormGroup>
                                            );
                                          }
                                        )
                                      : ''} */}
                                  </td>
                                  <td>
                                  {elem.partialCommit}
                                    {/* {elem.listOfApprovers &&
                                    elem.listOfApprovers.length > 0
                                      ? elem.listOfApprovers &&
                                        elem.listOfApprovers &&
                                        elem.listOfApprovers.map(
                                          (item, index) => {
                                            return (
                                              <FormGroup className="m-l-10 w50">
                                              <FormControl
                                                placeholder="Commit"
                                                type="text"
                                                className="br-0 h-28"
                                                value={elem.totalCommitAmount}
                                                name="otherSpecialDescription"
                                              />
                                              <FormControl.Feedback />
                                            </FormGroup>
                                            );
                                          }
                                        )
                                      : ''} */}
                                  </td>

    







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
                                <td className="userRev w100">
                                  <p>
                                    {removeUnderScore(elem.budgetItemStatus)}{' '}
                                  </p>
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
                                      <div className="upload-btn cursor-pointer sm-upload">
                                        <span className="ico-upload">
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#upload1Ico`}
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
                                <td>
                                  <div
                                    className="flex align-center"
                                    onClick={() => {
                                      this.deleteConfirmation(
                                        elem.id,
                                        catIndex
                                      );
                                    }}>
                                    <span className="ico-action-sm">
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#deleteIco`}
                                        />
                                      </svg>
                                    </span>
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
                <div className="text-center m-b-20 m-t-20">
                  <button
                    onClick={event => {
                      this.handleSaveBudget(event, 1);
                    }}
                    className="btn btn-default text-uppercase"
                    disabled={this.state.ListOfBudget && this.state.ListOfBudget.length>0?false:true}
                  >
                   
                    Save draft
                  </button>
                  {/* <button
                    onClick={this.handleExportPdf}
                    className="btn btn-default text-uppercase"
                  >
                    Export Pdf
                  </button> */}
                  <button
                    onClick={this.handleShow}
                    className="btn btn-default text-uppercase"
                    disabled={this.state.ListOfBudget && this.state.ListOfBudget.length>0?false:true}
                  >
                    Preview
                  </button>
                  <button
                    onClick={event => {
                      this.handleSaveBudget(event);
                    }}
                    disabled={this.state.ListOfBudget && this.state.ListOfBudget.length>0?false:true}
                    className="btn btn-default text-uppercase"
                  >
                    Submit
                  </button>
                </div>

                {this.state.ListOfBudget &&
                this.state.ListOfBudget.length > 0 && this.state.approversLenghtArr &&
                this.state.approversLenghtArr.length > 0? (
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
                          {this.state.ListOfBudget[0] &&
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
                                                        (
                                                          itemMonth,
                                                          indexMonth
                                                        ) => {
                                                          lastMonth =
                                                            itemMonth.date;
                                                          return [
                                                            <th>
                                                              <p className="m-b-0">
                                                                {
                                                                  itemMonth.month
                                                                }
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
                                    <td className="w100">
                                      {elem.description1}
                                    </td>
                                    <td className="w100">
                                      {elem.currency}
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
                                 
                                    {this.state.ListOfBudget[0] &&
                            this.state.ListOfBudget[0].budgetYearRequests &&
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
                                                  elem.inputAmountBy ==
                                                    'pay' ? (
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
                                                  elem.inputAmountBy ==
                                                    'commit' ? (
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
                                                                itemObj.payAmount
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
                                                                itemObj.payAmount
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
                                                                itemObj.commitAmount
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
                                                                itemObj.commitAmount
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
                                                       itemObj.quarterlyAmount.map(
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
                                                                    ) : (
                                                                      <div className="td-item">
                                                                        {this
                                                                          .state
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
                                                                    ) : (
                                                                      <div className="td-item">
                                                                        {this
                                                                          .state
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
                                                                              ) : (
                                                                                <div className="td-item">
                                                                                  {this
                                                                                    .state
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
                                                                              ) : (
                                                                                <div className="td-item">
                                                                                  {this
                                                                                    .state
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
                                          )
                                        }
                                
                                 
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
                     
                    </Table></div>
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
                  onClick={event => this.removeIndirectPurchaseDataRow(event)}
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
      actionCheckAccountNo,
      actionGetRevisionUsers,
      actionSaveBudgetOne,
      actionUploadBudgetDocumentse,
      actionAccountNumberData,
      actionGetBudgetExtraData,
      actionDeleteOfBudget,
      actionGetClassifications
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User,
    buyerData: state.BuyerData
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(budgetPlan);
