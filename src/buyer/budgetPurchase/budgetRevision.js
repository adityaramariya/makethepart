import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as moment from 'moment';
import {
  FormControl,
  FormGroup,
  Row,
  Col,
  ControlLabel
} from 'react-bootstrap';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionSaveBudgetRevisionData,
  actionGetFinancialYear
} from '../../common/core/redux/actions';
import { showErrorToast } from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import 'react-datepicker/dist/react-datepicker.css';
let { permissionConstant } = CONSTANTS;
let { validationMessages } = CONSTANTS;
class budgetrevision extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'tweleve',
      annualOperationPlans: []
    };
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.saveFinancialData = this.saveFinancialData.bind(this);
  }

  componentDidMount() {
    let _this = this;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };
    this.props
      .actionGetFinancialYear(data)
      .then((result, error) => {
        let listofQuarterly = result.payload.data.resourceData;
        var year = listofQuarterly.yearStartFrom;
        var month = listofQuarterly.monthStartFrom;

        var day = 1;
        let date = moment()
          .date(day)
          .month(month)
          .year(year)
          .format('YYYY-MM-DD');

        this.setState({
          annualOperationPlans: listofQuarterly.annualOperationPlans,
          budgetCycle: listofQuarterly.budgetCycle,
          monthStartFrom: listofQuarterly.monthStartFrom,
          yearStartFrom: listofQuarterly.yearStartFrom,
          id: listofQuarterly.id,
          finacialDate: date
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

  handleChangeForecat(event) {
    // const name = event.target.name;
    let type = this.state.budgetCycle;
    const value = this.state.budgetCycle;
    let monthName = this.state.monthName;
    let currentDay = '';

    let finacialDate = this.state.finacialDate;
    let finacialDateForDay = moment(finacialDate, 'D');
    if (finacialDate === undefined || finacialDate === null) {
      showErrorToast(validationMessages.financialYear.yearError);
      this.setState({
        annualOperationPlans: '',
        budgetCycle: ''
      });
    } else {
      let year = moment(this.state.finacialDate).format('YYYY');
      let month = moment(this.state.finacialDate).format('MM');
      let date = moment(this.state.finacialDate).format('dd');

      this.setState({
        yearStartFrom: year,
        monthStartFrom: month,
        datStartFrom: date
      });
      if (type == 4) {
        let listofQuarterly = this.state.quarterly;
        for (let i = 0; i <= 3; i++) {
          month = parseInt(month);
          year = parseInt(year);

          console.log('listofQuarterly-----------', month);

          if (month >= 12) {
            month = month % 12;
            console.log(
              'After listofQuarterly-----------',
              month,
              monthName[0]
            );
            year = moment(this.state.finacialDate, 'YYYY')
              .add(1, 'years')
              .format('YYYY');
          }

          if (month == 0) {
            listofQuarterly[i]['month'] = '';
            listofQuarterly[i]['month'] = monthName[month]
              ? monthName[month].name
              : '';
            listofQuarterly[i]['abbreviation'] = monthName[month]
              ? monthName[month].abbreviation
              : '';
          } else {
            listofQuarterly[i]['month'] = '';
            listofQuarterly[i]['month'] = monthName[month - 1]
              ? monthName[month - 1].name
              : '';
            listofQuarterly[i]['abbreviation'] = monthName[month - 1]
              ? monthName[month - 1].abbreviation
              : '';
          }

          listofQuarterly[i]['year'] = '';
          listofQuarterly[i]['year'] = year;
          month = parseInt(month) + 3;

          // finacialDateForDay = moment(finacialDateForDay, 'D')
          //   .add(3, 'M')
          //   .format('D');
          // listofQuarterly[i]['date'] = finacialDateForDay;

          if (i == 0) {
            finacialDateForDay = moment(finacialDateForDay)
              .add(0, 'M')
              .format('LLLL');
            currentDay = finacialDateForDay;
          } else {
            finacialDateForDay = moment(finacialDateForDay)
              .add(3, 'M')
              .format('LLLL');
            currentDay = finacialDateForDay;
          }

          listofQuarterly[i]['date'] = moment(currentDay).format('DD');
        }

        this.setState({
          annualOperationPlans: listofQuarterly,
          quarterly: listofQuarterly
        });
      } else if (type == 12) {
        let monthly = this.state.monthly;
        let listofMonth = this.state.monthly;

        for (let i = 0; i < 12; i++) {
          month = parseInt(month);
          listofMonth[i]['month'] = monthName[month - 1]
            ? monthName[month - 1].name
            : '';
          listofMonth[i]['abbreviation'] = monthName[month - 1]
            ? monthName[month - 1].abbreviation
            : '';
          listofMonth[i]['year'] = '';
          listofMonth[i]['year'] = year;

          if (i == 0) {
            finacialDateForDay = moment(finacialDateForDay)
              .add(0, 'M')
              .format('LLLL');
            currentDay = finacialDateForDay;
          } else {
            finacialDateForDay = moment(finacialDateForDay)
              .add(1, 'M')
              .format('LLLL');
            currentDay = finacialDateForDay;
          }

          listofMonth[i]['date'] = moment(currentDay).format('DD');
          if (month === 12) {
            month = 0;
            year = moment(this.state.finacialDate, 'YYYY')
              .add(1, 'years')
              .format('YYYY');
          }
          month = parseInt(month) + 1;
        }

        this.setState({
          annualOperationPlans: monthly,
          monthly: listofMonth
        });
      } else {
        this.setState({
          annualOperationPlans: ''
        });
      }
    }
  }

  handleChange(event, type) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(
      {
        [name]: value
      },
      () => this.handleChangeForecat(event)
    );
  }

  saveFinancialData() {
    let _this = this;
    let id = this.state.id;
    let errorMsg = [];
    let flag = true;
    let showError = '';
    let annualOperationPlans = this.state.annualOperationPlans;
    if (this.state.budgetCycle === '') {
      errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
      flag = false;
    } else if (this.state.finacialDate === '') {
      errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
      flag = false;
    }
    if (flag) {
      let annualOperationPlanObj = annualOperationPlans[0];
      annualOperationPlanObj.forecastNo = 0; //'AOP';
      let forecasts = annualOperationPlans.slice(1);

      let data = [];
      if (id) {
        data = {
          roleId: this.props.userInfo.userData.userRole,
          userId: this.props.userInfo.userData.id,
          yearStartFrom: this.state.yearStartFrom,
          monthStartFrom: this.state.monthStartFrom,
          budgetCycle: this.state.budgetCycle,
          forecasts: forecasts,
          annualOperationPlan: annualOperationPlanObj,
          id: id
        };
      } else {
        data = {
          roleId: this.props.userInfo.userData.userRole,
          userId: this.props.userInfo.userData.id,
          yearStartFrom: this.state.yearStartFrom,
          monthStartFrom: this.state.monthStartFrom,
          budgetCycle: this.state.budgetCycle,
          forecasts: forecasts,
          annualOperationPlan: annualOperationPlanObj
        };
      }

      this.props
        .actionSaveBudgetRevisionData(data)
        .then((result, error) => {
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      if (errorMsg) {
        let uniqErrorMsg = _.uniqBy(errorMsg, function(e) {
          return e;
        });
        showError = uniqErrorMsg.join(',\r\n');
        showErrorToast(showError);
      }
    }
  }

  render() {
    let designerIndex = [];
    let projectVariant = [];
    let projectName = [];
    let BOMCalculation = [];
    let BOMVariantData = [];
    let BOMSubVariantData = [];
    let allBomList = [];
    let bomListLength = [];
    let searchedData = [];
    let _this = this;
    let cropImage = this.state.cropImage;
    let childIndexMFG = this.state.childIndexMFG;
    let parentIndexMFG = this.state.parentIndexMFG;
    let childIndexPack = this.state.childIndexPack;
    let parentIndexPack = this.state.parentIndexPack;
    let allBomDatas = [];
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === 'tweleve' ? 'tweleve' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === 'tweleve' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <h4 className="hero-title text-center">Create Budget Revision</h4>

                <div className="">
                  <div className="">
                    <Row>
                      <Col md={6}>
                        <FormGroup className=" ">
                          <ControlLabel>Last Approved Revision</ControlLabel>
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
                
                      <Col md={6}>
                        <FormGroup className=" ">
                          <ControlLabel>Active Budget Revision</ControlLabel>
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
                            className="btn btn-default text-uppercase"
                          >
                          Approve
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </div>
     
                </div>

                <div className="border-around border-light p-20 eco-form m-b-30 m-t-20">
                  <form id="createECOForm">
                    <Row>
                      <Col md={4}>
                        <FormGroup className=" ">
                          <ControlLabel>Revision</ControlLabel>
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
                        <FormGroup className=" " controlId="formControlsSelect">
                          <ControlLabel>
                          Forecaste <i className="text-danger">*</i>
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
                          <ControlLabel>Year</ControlLabel>
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
                        className="btn btn-default text-uppercase"
                      >
                        Preview
                      </button>
                      <button
                        onClick={event => {
                          this.handleSaveBudget(event);
                        }}
                        disabled={
                          this.state.ListOfBudget &&
                          this.state.ListOfBudget.length > 0
                            ? false
                            : true
                        }
                        className="btn btn-default text-uppercase"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>

                <hr />
              </div>
            </div>
            <Footer pageTitle={permissionConstant.footer_title.create_eco} />
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
      actionSaveBudgetRevisionData,
      actionGetFinancialYear
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

//budgetrevision = validation(strategy)(budgetrevision);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(budgetrevision);
