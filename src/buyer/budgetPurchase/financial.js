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
  actionSaveFinancialYear,
  actionGetFinancialYear
} from '../../common/core/redux/actions';
import { showErrorToast } from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
let { permissionConstant } = CONSTANTS;
let { validationMessages } = CONSTANTS;
class Purchasing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'tweleve',
      quarterly: [
        { forecastNo: 1 },
        { forecastNo: 1 },
        { forecastNo: 2 },
        { forecastNo: 3 }
      ],
      monthly: [
        { forecastNo: 1 },
        { forecastNo: 1 },
        { forecastNo: 2 },
        { forecastNo: 3 },
        { forecastNo: 4 },
        { forecastNo: 5 },
        { forecastNo: 6 },
        { forecastNo: 7 },
        { forecastNo: 8 },
        { forecastNo: 9 },
        { forecastNo: 10 },
        { forecastNo: 11 }
      ],
      monthName: [
        {
          abbreviation: 'Jan',
          name: 'January'
        },
        {
          abbreviation: 'Feb',
          name: 'February'
        },
        {
          abbreviation: 'Mar',
          name: 'March'
        },
        {
          abbreviation: 'Apr',
          name: 'April'
        },
        {
          abbreviation: 'May',
          name: 'May'
        },
        {
          abbreviation: 'Jun',
          name: 'June'
        },
        {
          abbreviation: 'Jul',
          name: 'July'
        },
        {
          abbreviation: 'Aug',
          name: 'August'
        },
        {
          abbreviation: 'Sep',
          name: 'September'
        },
        {
          abbreviation: 'Oct',
          name: 'October'
        },
        {
          abbreviation: 'Nov',
          name: 'November'
        },
        {
          abbreviation: 'Dec',
          name: 'December'
        }
      ],
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
        .actionSaveFinancialYear(data)
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
                <h4 className="m-t-40 m-b-50 text-center">
                  Financial Year Set Up
                </h4>

                <div className="border-around border-light p-20 m-b-50">
                  <Row className="show-grid">
                    <Col md={2}>
                      <FormGroup controlId="formBasicText">
                        <ControlLabel className="fs-12 ">
                          Financial Year Starts From
                        </ControlLabel>
                        <DatePicker
                          selected={this.state.finacialDate}
                          onChange={e => {
                            const value = e;
                            this.handleChange({
                              target: {
                                name: 'finacialDate',
                                value
                              }
                            });
                          }}
                          placeholderText="DD/MM"
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd/MM"
                          minDate={new Date()}
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <ControlLabel className="fs-12">
                        Budget Cycle
                      </ControlLabel>
                      <div>
                        <label className="label--radio fs-12 fw-normal">
                          <input
                            type="radio"
                            className="radio"
                            name="budgetCycle"
                            value={4}
                            checked={this.state.budgetCycle == 4 ? true : false}
                            onChange={event => {
                              this.handleChange(event, 'QUARTER');
                            }}
                          />
                          Quarterly
                        </label>

                        <label className="label--radio fs-12 fw-normal">
                          <input
                            type="radio"
                            className="radio"
                            name="budgetCycle"
                            value={12}
                            checked={
                              this.state.budgetCycle == 12 ? true : false
                            }
                            onChange={event => {
                              this.handleChange(event, 'MONTH');
                            }}
                          />
                          Monthly
                        </label>
                      </div>
                    </Col>

                    <Col md={2} />
                    <Col md={2} />
                  </Row>
                  <Row className="show-grid">
                    <Col md={2}>Annual Operating Plan</Col>
                  </Row>
                  {this.state.annualOperationPlans &&
                    this.state.annualOperationPlans.map((item, index) => {
                      console.log('annualOperationPlans----------', item);
                      return (
                        <div>
                          <Row>
                            <Col md={2}>
                              <ControlLabel
                                className="fs-12"
                                style={{ visibility: 'hidden' }}
                              >
                                Annual Operating Plan
                              </ControlLabel>
                              <FormGroup controlId="formBasicText">
                                <FormControl
                                  type="text"
                                  className="br-0"
                                  value={item.date}
                                  placeholderText="Year"
                                />
                                {/* <DatePicker
                                  selected={item.year}
                                  onChange={e => {
                                    const value = e;
                                    this.handleChange(
                                      {
                                        target: {
                                          name: 'year',
                                          value
                                        }
                                      },
                                      index
                                    );
                                  }}
                                  placeholderText="Year"
                                  showYearDropdown
                                  dropdownMode="select"
                                  dateFormat="yyy"
                                  minDate={new Date()}
                                /> */}
                                <FormControl.Feedback />
                              </FormGroup>
                            </Col>

                            <Col md={2}>
                              <ControlLabel className="fs-12">
                                {index == 0 ? '' : 'Forecast ' + index}
                              </ControlLabel>
                              <FormGroup controlId="formBasicText">
                                <FormControl
                                  type="text"
                                  className="br-0"
                                  value={item.month}
                                  placeholderText="Month"
                                />
                                {/* <DatePicker
                                  selected={item.month}
                                  onChange={e => {
                                    const value = e;
                                    this.handleChange(
                                      {
                                        target: {
                                          name: 'month',
                                          value
                                        }
                                      },
                                      index
                                    );
                                  }}
                                  placeholderText="Month"
                                  showMonthDropdown
                                  dropdownMode="select"
                                  dateFormat="MM"
                                /> */}
                                <FormControl.Feedback />
                              </FormGroup>
                            </Col>

                            {/* <Col md={2}>

                              <FormGroup controlId="formBasicText">
                                <FormControl
                                  type="text"
                                  className="br-0"
                                  value={item.year}
                                  placeholderText="Year"
                                />

                                <FormControl.Feedback />
                              </FormGroup>
                            </Col> */}
                          </Row>
                        </div>
                      );
                    })}
                </div>
                <div className="text-center m-b-20 m-t-20">
                  <button
                    onClick={this.saveFinancialData}
                    className="btn btn-default text-uppercase"
                  >
                    Save
                  </button>
                </div>
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
      actionSaveFinancialYear,
      actionGetFinancialYear
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Purchasing);
