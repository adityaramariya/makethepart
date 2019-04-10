import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  FormGroup,
  FormControl,
  Modal,
  Table,
  Breadcrumb
} from 'react-bootstrap';
import validation from 'react-validation-mixin';
import strategy, { validator } from 'react-validatorjs-strategy';
import classnames from 'classnames';
import PhoneInput from 'react-phone-number-input';
import PropTypes from 'prop-types';
import 'react-phone-number-input/rrui.css';
import 'react-phone-number-input/style.css';
import Sprite from '../../img/sprite.svg';
// import Header from "../common/header";
// import userImage from '../../img/user.jpg';
import userImage from '../../img/profile.svg';
import SideBarBuyer from '../../buyer/common/sideBar';
import SideBarSupplier from '../../supplier/common/sideBar';
import {
  actionGetApproverList,
  actionUserLogout,
  actionGenerateOTPToAddUser,
  actionSupplierAddUser,
  actionLoaderHide,
  actionLoaderShow,
  actionTabClick,
  actionGetUserProfileList,
  actionGetCompanyData
} from '../../common/core/redux/actions';
import CONSTANTS from '../../common/core/config/appConfig';
import _ from 'lodash';
import {
  renderMessage,
  showErrorToast,
  topPosition,
  removeUnderScore
} from '../../common/commonFunctions';
import FooterBuyer from '../../buyer/common/footer';
import FooterSupplier from '../../supplier/common/footer';
let { validationMessages, permissionConstant } = CONSTANTS;
// let { showErrorToast } = CONSTANTS;

class AddUser extends Component {
  constructor(props) {
    super(props);

    this.contactObject = {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      designation: '',
      userType: '',
      userProfile: '',
      listOfOtherApprovers: [],
      defaultApprover: '',
      approverList: [],
      profileList: []
    };

    this.state = {
      show: false,
      contactArray: [{ ...this.contactObject }],
      OTPField: ['', '', '', '', '', ''],
      OTPError: '',
      contactArrayIndex: '',
      countryCode: 'IN',
      approverList: [],
      profileList: [],
      tabKey: 'addUser'
    };

    this.applyValidation = this.applyValidation.bind(this);
    // this.checkApproverSelection = this.checkApproverSelection.bind(this);
    this.handleAddMoreContact = this.handleAddMoreContact.bind(this);
    this.handleAddUser = this.handleAddUser.bind(this);
    this.handleApproverSelect = this.handleApproverSelect.bind(this);
    this.handleApproverSelectAll = this.handleApproverSelectAll.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleContactFieldChange = this.handleContactFieldChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleModalShown = this.handleModalShown.bind(this);
    this.handleOTPChange = this.handleOTPChange.bind(this);
    this.handleShowApprovalModal = this.handleShowApprovalModal.bind(this);
    this.handleHideApprovalModal = this.handleHideApprovalModal.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.handleDefaultApproverSelect = this.handleDefaultApproverSelect.bind(
      this
    );
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
    // this.getOTP = this.getOTP.bind(this);
    this.applyValidation();
  }

  applyValidation() {
    let _this = this;
    let contanctCount = this.state.contactArray.length;
    let fieldObject = {};
    let errorMessage = {};

    for (let index = 0; index < contanctCount; index++) {
      fieldObject['firstName' + index] = 'required';
      fieldObject['lastName' + index] = 'required';
      fieldObject['email' + index] = 'required|email';
      fieldObject['mobile' + index] = 'required';
      fieldObject['userType' + index] = 'required';
      if (this.props.userInfo.userData.userRole == 1)
        fieldObject['departmentId' + index] = 'required';
      // fieldObject["userProfile" + index] = "required";
      // fieldObject['designation' + index] = 'required';

      errorMessage['required.firstName' + index] =
        validationMessages.firstName.required;
      errorMessage['required.lastName' + index] =
        validationMessages.lastName.required;
      errorMessage['required.email' + index] =
        validationMessages.email.required;
      errorMessage['email.email' + index] = validationMessages.email.invalid;
      errorMessage['required.mobile' + index] =
        validationMessages.mobile.required;
      errorMessage['required.userType' + index] =
        validationMessages.userType.required;
      if (this.props.userInfo.userData.userRole == 1)
        errorMessage['required.departmentId' + index] =
          validationMessages.departmentId.required;
      // errorMessage["required.userProfile" + index] =
      //   validationMessages.userProfile.required;
      // errorMessage['required.designation' + index] =
      //   validationMessages.designation.required;
    }

    this.validatorTypes = strategy.createInactiveSchema(
      fieldObject,
      errorMessage
    );
  }
  // checkApproverSelection(approverId, index) {
  //   if (this.state.contactArray[index].listOfOtherApprovers.indexOf(approverId) == -1)
  //     return '';
  //   return 'checked';
  // }

  componentWillMount() {
    let _this = this;
    const userId = this.props.userInfo.userData.id;
    const roleId = this.props.userInfo.userData.userRole;
    this.props.actionGetApproverList({ userId, roleId });
    this.props.actionGetUserProfileList({ userId, roleId });
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };
    this.props
      .actionGetCompanyData(data)
      .then((result, error) => {
        console.log('result.....', result.payload.data.resourceData);
        let purchaseResponse = result.payload.data.resourceData;
        this.setState({
          listOfDepartment: purchaseResponse.departmentResponses,
          listOfAddress: purchaseResponse.addresses
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  getClasses = field => {
    return classnames({
      error: !this.props.isValid(field)
    });
  };

  getValidatorData = () => {
    return this.state;
  };

  getValidationState(stateName) {
    if (
      this.props.getValidationMessages(stateName) == '' &&
      this.state[stateName] == ''
    )
      return null;
    else if (
      this.props.getValidationMessages(stateName) == '' &&
      this.state[stateName] !== ''
    )
      return 'success';
    else if (
      this.props.getValidationMessages(stateName) !== '' &&
      this.state[stateName] !== ''
    )
      return 'error';
    else if (
      this.props.getValidationMessages(stateName) !== '' &&
      this.state[stateName] == ''
    )
      return 'error';
  }

  navigateTo(data) {
    this.props.actionTabClick(data);
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === 'first')
      this.context.router.history.push({
        pathname: 'home',
        state: { path: 'first' }
      });
    if (
      this.context.router.location &&
      this.context.router.location.pathname === '/supplier/adduser'
    ) {
      if (tabKey === 'second') this.context.router.history.push('home');
    }
    if (tabKey === 'third')
      this.context.router.history.push({
        pathname: 'home',
        state: { path: 'third' }
      });
    // if (tabKey === 'first') this.props.history.push('home');
    // if (tabKey === 'second') this.props.history.push('home');
    // if (tabKey === 'third') this.props.history.push('home');
    this.setState({ tabKey: tabKey });
  }

  static contextTypes = {
    router: PropTypes.object
  };

  handleAddMoreContact() {
    let addMoreContactList = this.state.contactArray;
    let lengthArr = addMoreContactList.length - 1;
    if (
      addMoreContactList[lengthArr]['firstName'] === undefined ||
      addMoreContactList[lengthArr]['firstName'] === '' ||
      addMoreContactList[lengthArr]['lastName'] === undefined ||
      addMoreContactList[lengthArr]['lastName'] === '' ||
      addMoreContactList[lengthArr]['email'] === undefined ||
      addMoreContactList[lengthArr]['email'] === '' ||
      addMoreContactList[lengthArr]['mobile'] === undefined ||
      addMoreContactList[lengthArr]['mobile'] === '' ||
      addMoreContactList[lengthArr]['userType'] === undefined ||
      addMoreContactList[lengthArr]['userType'] === ''
    ) {
      showErrorToast('Please enter all user detail first');
      return false;
    }

    const item = {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      designation: '',
      userType: '',
      listOfOtherApprovers: [],
      defaultApprover: '',
      approverList: []
    };
    this.setState(
      (prevState, props) => ({
        contactArray: [...prevState.contactArray, item]
      }),
      () => {
        this.applyValidation();
      }
    );
  }

  handleAddUser() {
    const emailOTP = this.state.OTPField.join('');
    const roleId = this.props.userInfo.userData.userRole;
    const parentUserId = this.props.userInfo.userData.id;
    let _this = this;
    let data = {
      userDetailRequests: [
        {
          userId: 'string',
          firstName: 'string',
          lastName: 'string',
          password: 'string',
          designation: 'string',
          mobile: 'string',
          email: 'string',
          accessToken: 'string',
          isEnabled: false,
          profileImageURL: 'string',
          isPrimaryUser: false,
          creatorUserId: 'string',
          roleId: 0,
          createdTimestamp: 0,
          lastUpdatedTimestamp: 0,
          userType: 'string',
          userProfile: 'string',
          addApproval: 'string',
          listOfOtherApprovers: ['string'],
          defaultApprover: 0,
          departmentId: 'string',
          budgetPlanner: 'string',
          addressRequest: 'string'
        }
      ],
      parentUserId,
      roleId,
      emailOTP
    };

    data.userDetailRequests = this.state.contactArray;
    this.props
      .actionSupplierAddUser(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
        console.log(result.payload.data.status);
        if (result.payload.data.status === 200) {
          let contactArray = _this.state.contactArray;
          for (let i = 0; i < contactArray.length; i++) {
            contactArray[i].firstName = '';
            contactArray[i].lastName = '';
            contactArray[i].email = '';
            contactArray[i].mobile = '';
            contactArray[i].designation = '';
            contactArray[i].userType = '';
            contactArray[i].userProfile = '';
            contactArray[i].defaultApprover = '';
            contactArray[i].approverList = [];
            contactArray[i].listOfOtherApprovers = [];
          }
          _this.setState({ contactArray: contactArray });
        }
      })
      .catch(e => _this.props.actionLoaderHide());

    // this.state.contactArray;
  }

  handleApproverSelect(event, approverId) {
    const index = this.state.contactArrayIndex;
    const selected = event.target.checked;
    if (selected) {
      this.setState(
        (prevState, props) => {
          const approverIndex = prevState.contactArray[
            index
          ].listOfOtherApprovers.indexOf(approverId);
          if (approverIndex == -1)
            prevState.contactArray[index].listOfOtherApprovers.push(approverId);
          return { contactArray: prevState.contactArray };
        },
        () => {
          this.handleModalShown();
        }
      );
      this.setState((prevState, props) => {
        const approverIndex = (prevState.contactArray[index].defaultApprover =
          prevState.contactArray[index].listOfOtherApprovers[0]);
        return { contactArray: prevState.contactArray };
      });
    } else {
      this.setState(
        (prevState, props) => {
          const approverIndex = prevState.contactArray[
            index
          ].listOfOtherApprovers.indexOf(approverId);
          if (approverIndex !== -1)
            prevState.contactArray[index].listOfOtherApprovers.splice(
              approverIndex,
              1
            );
          return { contactArray: prevState.contactArray };
        },
        () => {
          this.handleModalShown();
        }
      );
      this.setState((prevState, props) => {
        const approverIndex = (prevState.contactArray[index].defaultApprover =
          prevState.contactArray[index].listOfOtherApprovers[0]);
        return { contactArray: prevState.contactArray };
      });
      this.setState((prevState, props) => {
        const approverIndex = (prevState.contactArray[
          index
        ].allchecked = false);
        return { contactArray: prevState.contactArray };
      });
    }

    // console.log("approver -- ",this.state.contactArray);
    // let approver = this.state.approverList;
    // let selectedApprover = this.state.contactArray[index].listOfOtherApprovers;
    // approver.map((item,index)=>{
    //   selectedApprover.indexOf(item.id)?this.state.contactArray[index].approverList.push(item):'';
    // })

    // console.log("approver -- ",this.state.contactArray);

    // console.log("approver -- ",approver);
  }

  handleApproverSelectAll(event) {
    const checked = event.target.checked;
    const index = this.state.contactArrayIndex;

    if (checked) {
      this.setState(
        (prevState, props) => {
          prevState.contactArray[index].listOfOtherApprovers = [
            ...prevState.contactArray[index].listOfOtherApprovers,
            ...this.props.supplierUsers.approverList.map(approver => {
              return approver.id;
            })
          ];
          return { contactArray: prevState.contactArray };
        },
        () => {
          this.handleModalShown();
        }
      );
      this.setState((prevState, props) => {
        const approverIndex = (prevState.contactArray[index].defaultApprover =
          prevState.contactArray[index].listOfOtherApprovers[0]);
        return { contactArray: prevState.contactArray };
      });

      this.setState((prevState, props) => {
        const approverIndex = (prevState.contactArray[index].allchecked = true);
        return { contactArray: prevState.contactArray };
      });
    } else {
      this.setState(
        (prevState, props) => {
          prevState.contactArray[index].listOfOtherApprovers = [];
          return { contactArray: prevState.contactArray };
        },
        () => {
          this.handleModalShown();
        }
      );
      this.setState((prevState, props) => {
        const approverIndex = (prevState.contactArray[index].defaultApprover =
          prevState.contactArray[index].listOfOtherApprovers[0]);
        return { contactArray: prevState.contactArray };
      });
      this.setState((prevState, props) => {
        const approverIndex = (prevState.contactArray[
          index
        ].allchecked = false);
        return { contactArray: prevState.contactArray };
      });
    }
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleContactFieldChange(event, index, stateName) {
    let value = event.target.value;
    let checked = event.target.checked;
    let listOfAddress = this.state.listOfAddress;

    if (stateName === 'addressRequest') {
      console.log('addressRequest');

      let addressObj = _.filter(listOfAddress, function(data) {
        return data.address === value;
      });
      let stateNameExtra = 'area';
      let locDetails =
        addressObj && addressObj[0] && addressObj[0].locationId
          ? addressObj[0].locationId
          : '';

      this.setState((prevState, props) => {
        prevState.contactArray[index][stateNameExtra] = locDetails;

        return {
          contactArray: prevState.contactArray,
          [stateNameExtra + index]: locDetails
        };
      });
      value = addressObj[0];
      console.log('value', value);
      // noOfTable[tableIndex].noOfCategory[catIndex][name] = addressObj[0];
    }
    if (stateName === 'budgetPlanner') {
      console.log('budgetPlanner');
      if (checked) {
        value = true;
      } else {
        value = false;
      }

      this.setState((prevState, props) => {
        prevState.contactArray[index][stateName] = value;
        return {
          contactArray: prevState.contactArray,
          [stateName + index]: value
        };
      });
      // noOfTable[tableIndex].noOfCategory[catIndex][name] = addressObj[0];
    }

    this.setState((prevState, props) => {
      prevState.contactArray[index][stateName] = value;
      return {
        contactArray: prevState.contactArray,
        [stateName + index]: value
      };
    });

    console.log('contactArray', this.state.contactArray);
  }

  handleLogout() {
    try {
      const roleId = this.props.userInfo.userData.userRole;
      const userId = this.props.userInfo.userData.id;
      this.props.actionUserLogout({ roleId, userId });
    } catch (error) {}
  }

  handleOTPChange(stateName, index, e) {
    const value = e.target.value;
    this.setState(
      (prevState, props) => {
        prevState[stateName][index] = value;
        return { [stateName]: prevState[stateName] };
      },
      () => {
        const OTPField = this.state.OTPField.join('');
        if (OTPField.length == 6) {
          this.setState({
            OTPError: ''
          });
        }

        const nextElementIndex = index + 1;
        if (nextElementIndex < 6 && this.state[stateName][index] !== '') {
          const elementRef = stateName + nextElementIndex;
          this[elementRef].focus();
        }
      }
    );
  }

  handleShowApprovalModal(event, index) {
    const userId = this.props.userInfo.userData.id;
    const roleId = this.props.userInfo.userData.userRole;
    this.props.actionGetApproverList({ userId, roleId });

    this.setState({
      show: true,
      contactArrayIndex: index
    });
  }

  handleHideApprovalModal() {
    this.setState({
      show: false
    });
  }

  handleModalShown() {
    let approverList = [...this.props.supplierUsers.approverList];
    for (let index = 0; index < approverList.length; index++) {
      let element = approverList[index];
      element.checked = '';
      if (
        this.state.contactArray[this.state.contactArrayIndex] &&
        this.state.contactArray[this.state.contactArrayIndex]
          .listOfOtherApprovers &&
        this.state.contactArray[
          this.state.contactArrayIndex
        ].listOfOtherApprovers.indexOf(element.id) !== -1
      )
        element.checked = 'checked';
    }
    this.setState({
      approverList
    });
  }

  validateData = (e, actionType) => {
    e.preventDefault();
    let _this = this;
    this.props.validate(function(error) {
      console.log(error);
      if (!error) {
        switch (actionType) {
          case 'generateOTP':
            const roleId = _this.props.userInfo.userData.userRole;
            const userId = _this.props.userInfo.userData.id;
            _this.props.actionLoaderShow();
            _this.props
              .actionGenerateOTPToAddUser({ userId, roleId })
              .then((result, error) => {
                console.log('actionGenerateOTPToAddUser---', result);

                _this.props.actionLoaderHide();
              })
              .catch(e => {
                this.props.actionLoaderHide();
              });
            break;
          case 'addUser':
            _this.handleAddUser();
            break;

          default:
            break;
        }
      }
    });
  };

  handleDefaultApproverSelect(event, id, stateName) {
    const { value } = event.target;
    const index = this.state.contactArrayIndex;
    this.setState((prevState, props) => {
      prevState.contactArray[index][stateName] = id;
      return {
        contactArray: prevState.contactArray,
        [stateName + index]: id
      };
    });
  }

  handleRemoveUser(product) {
    let contactArrayLength = this.state.contactArray.length;
    if (contactArrayLength > 1) {
      this.setState(
        (prevState, props) => ({
          contactArray: this.state.contactArray.slice(0, -1)
        }),
        () => {
          this.applyValidation();
        }
      );
    } else {
      showErrorToast('Please add more user detail first');
    }
  }

  render() {
    let profileList = this.props.supplierUsers.profileList;
    return (
      <div>
        {this.props.userInfo.userData.userRole === 1 ? (
          <SideBarBuyer activeTabKeyAction={this.activeTabKeyAction} />
        ) : (
          <SideBarSupplier activeTabKeyAction={this.activeTabKeyAction} />
        )}
        {this.state.tabKey === 'addUser' ? (
          <div>
            <div className="content-body flex">
              <div className="content">
                <section className="">
                  <div className="container-fluid">
                    {this.props.userInfo.userData.userProfile === 'admin' ? (
                      <div className="">
                        <Breadcrumb className="style-breadcrumb">
                          <Breadcrumb.Item>
                            <Link to="administrator">Dashboard</Link>
                          </Breadcrumb.Item>

                          <Breadcrumb.Item active>Add Users</Breadcrumb.Item>
                        </Breadcrumb>
                      </div>
                    ) : (
                      ''
                    )}
                    <h4 className="hero-title">Add Users</h4>
                    <div className="">
                      <Table
                        bordered
                        responsive
                        className="custom-table v-align-top cell-input"
                      >
                        <thead>
                          <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email Address</th>
                            {this.props.userInfo.userData.userRole === 1 ? (
                              <th>User Profile</th>
                            ) : (
                              ''
                            )}
                            <th>Mobile Number</th>
                            {/* <th>Designation</th> */}
                            <th>User Type</th>
                            {this.props.userInfo.userData.userRole === 1 ? (
                              <th>Department</th>
                            ) : (
                              ''
                            )}
                            {this.props.userInfo.userData.userRole === 1 ? (
                              <th>Location</th>
                            ) : (
                              ''
                            )}
                            {this.props.userInfo.userData.userRole === 1 ? (
                              <th>Region</th>
                            ) : (
                              ''
                            )}
                            {this.props.userInfo.userData.userRole === 1 ? (
                              <th>Budget Planning</th>
                            ) : (
                              ''
                            )}

                            <th>Selected Approver</th>
                            <th> </th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.contactArray.map((item, index) => {
                            return [
                              <tr>
                                <td>
                                  <FormGroup controlId="formBasicText">
                                    <FormControl
                                      className="br-0"
                                      maxLength="50"
                                      type="text"
                                      name={'firstName' + index}
                                      value={
                                        this.state.contactArray[index].firstName
                                      }
                                      onChange={event =>
                                        this.handleContactFieldChange(
                                          event,
                                          index,
                                          'firstName'
                                        )
                                      }
                                      required
                                      autoFocus
                                    />
                                    <FormControl.Feedback />

                                    {renderMessage(
                                      this.props.getValidationMessages(
                                        'firstName' + index
                                      )
                                    )}
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formBasicText">
                                    <FormControl
                                      className="br-0"
                                      type="text"
                                      maxLength="50"
                                      name={'lastName' + index}
                                      value={
                                        this.state.contactArray[index].lastName
                                      }
                                      onChange={event =>
                                        this.handleContactFieldChange(
                                          event,
                                          index,
                                          'lastName'
                                        )
                                      }
                                      required
                                    />
                                    <FormControl.Feedback />

                                    {renderMessage(
                                      this.props.getValidationMessages(
                                        'lastName' + index
                                      )
                                    )}
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formBasicText">
                                    <FormControl
                                      className="br-0"
                                      type="text"
                                      name={'email' + index}
                                      value={
                                        this.state.contactArray[index].email
                                      }
                                      onChange={event =>
                                        this.handleContactFieldChange(
                                          event,
                                          index,
                                          'email'
                                        )
                                      }
                                      required
                                    />
                                    <FormControl.Feedback />

                                    {renderMessage(
                                      this.props.getValidationMessages(
                                        'email' + index
                                      )
                                    )}
                                  </FormGroup>
                                </td>
                                {this.props.userInfo.userData.userRole === 1 ? (
                                  <td>
                                    <FormGroup
                                      controlId="formBasicText"
                                      className="sel-cap"
                                    >
                                      <FormControl
                                        className="br-0"
                                        type="text"
                                        componentClass="select"
                                        value={
                                          this.state.contactArray[index]
                                            .userProfile
                                        }
                                        onChange={event =>
                                          this.handleContactFieldChange(
                                            event,
                                            index,
                                            'userProfile'
                                          )
                                        }
                                      >
                                        <option value="">
                                          Select user profile
                                        </option>
                                        {profileList &&
                                          profileList.map((val, index) => {
                                            return (
                                              <option value={val.id}>
                                                {val.profileName &&
                                                  removeUnderScore(
                                                    val.profileName
                                                  )}
                                              </option>
                                            );
                                          })}
                                      </FormControl>
                                      <FormControl.Feedback />

                                      {renderMessage(
                                        this.props.getValidationMessages(
                                          'userProfile' + index
                                        )
                                      )}
                                    </FormGroup>
                                  </td>
                                ) : (
                                  ''
                                )}
                                <td>
                                  <FormGroup
                                    className="mobile-input no-border no-ico-mob"
                                    controlId="formBasicText"
                                  >
                                    <PhoneInput
                                      className="form-control br-0"
                                      placeholder="Mobile Number"
                                      value={
                                        this.state.contactArray[index].mobile
                                      }
                                      onChange={value =>
                                        this.handleContactFieldChange(
                                          {
                                            target: { name: 'mobile', value }
                                          },
                                          index,
                                          'mobile'
                                        )
                                      }
                                      name={`mobile` + index}
                                      country={this.state.countryCode}
                                    />

                                    {/* <FormControl.Feedback />
                            <span className="highlight" />
                            <span className="bar" /> */}
                                    {renderMessage(
                                      this.props.getValidationMessages(
                                        'mobile' + index
                                      )
                                    )}
                                  </FormGroup>
                                </td>
                                {/* <td>
                          <FormGroup controlId="formBasicText">
                            <FormControl
                              className="br-0"
                              type="text"
                              name={'designation' + index}
                              value={this.state.contactArray[index].designation}
                              onChange={event =>
                                this.handleContactFieldChange(
                                  event,
                                  index,
                                  'designation'
                                )
                              }
                              required
                            />
                            <FormControl.Feedback />
                            {renderMessage(
                              this.props.getValidationMessages(
                                'designation' + index
                              )
                            )}
                          </FormGroup>
                        </td> */}
                                <td>
                                  <FormGroup controlId="formBasicText">
                                    <FormControl
                                      className="br-0 w-175"
                                      type="text"
                                      componentClass="select"
                                      value={
                                        this.state.contactArray[index].userType
                                      }
                                      onChange={event =>
                                        this.handleContactFieldChange(
                                          event,
                                          index,
                                          'userType'
                                        )
                                      }
                                    >
                                      <option value="">
                                        Select user privilage
                                      </option>
                                      <option value="1">Admin</option>
                                      <option value="2">Regular</option>
                                    </FormControl>
                                    <FormControl.Feedback />

                                    {renderMessage(
                                      this.props.getValidationMessages(
                                        'userType' + index
                                      )
                                    )}
                                  </FormGroup>
                                </td>
                                {this.props.userInfo.userData.userRole === 1 ? (
                                  <td>
                                    <FormGroup controlId="formControlsSelect">
                                      <FormControl
                                        componentClass="select"
                                        placeholder="select"
                                        className="s-arrow br-0"
                                        name={'departmentId' + index}
                                        value={
                                          this.state.contactArray[index]
                                            .departmentId
                                        }
                                        onChange={event =>
                                          this.handleContactFieldChange(
                                            event,
                                            index,
                                            'departmentId'
                                          )
                                        }
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
                                      {renderMessage(
                                        this.props.getValidationMessages(
                                          'departmentId' + index
                                        )
                                      )}
                                    </FormGroup>
                                  </td>
                                ) : (
                                  ''
                                )}
                                {this.props.userInfo.userData.userRole === 1 ? (
                                  <td>
                                    <FormGroup controlId="formControlsSelect">
                                      <FormControl
                                        componentClass="select"
                                        placeholder="select"
                                        className="s-arrow br-0"
                                        name={'addressRequest' + index}
                                        value={
                                          this.state.contactArray[index]
                                            .addressRequest
                                        }
                                        onChange={event =>
                                          this.handleContactFieldChange(
                                            event,
                                            index,
                                            'addressRequest'
                                          )
                                        }
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
                                ) : (
                                  ''
                                )}
                                {this.props.userInfo.userData.userRole === 1 ? (
                                  <td>
                                    <FormGroup controlId="formBasicText">
                                      <FormControl
                                        className="br-0"
                                        type="text"
                                        maxLength="50"
                                        name={'area' + index}
                                        value={
                                          this.state.contactArray[index].area
                                        }
                                        onChange={event =>
                                          this.handleContactFieldChange(
                                            event,
                                            index,
                                            'area'
                                          )
                                        }
                                      />
                                      <FormControl.Feedback />
                                    </FormGroup>
                                  </td>
                                ) : (
                                  ''
                                )}
                                {this.props.userInfo.userData.userRole === 1 ? (
                                  <td>
                                    <label className="label--checkbox">
                                      <input
                                        type="checkbox"
                                        className="checkbox"
                                        onChange={event =>
                                          this.handleContactFieldChange(
                                            event,
                                            index,
                                            'budgetPlanner'
                                          )
                                        }
                                        className="checkbox"
                                        name="budgetPlanner"
                                        checked={
                                          this.state.contactArray[index]
                                            .budgetPlanner
                                            ? 'checked'
                                            : ''
                                        }
                                        // onClick={event =>
                                        //   this.handleApproverSelect(event, id)
                                        // }
                                      />
                                    </label>
                                  </td>
                                ) : (
                                  ''
                                )}
                                <td className="w-150">
                                  {this.state.approverList.map((val, idx) => {
                                    return val.checked == 'checked' ? (
                                      <div className="flex tb-main">
                                        <span className="flex-1 text-left">
                                          {val.firstName} {val.lastName}
                                        </span>
                                      </div>
                                    ) : (
                                      ''
                                    );
                                  })}

                                  {/* <FormGroup controlId="formBasicText">
                                    <FormControl
                                      className="br-0"
                                      type="text"
                                      componentClass="select"
                                      value={
                                        this.state.contactArray[index]
                                          .addApproval
                                      }
                                      onChange={event =>
                                        this.handleContactFieldChange(
                                          event,
                                          index,
                                          'addApproval'
                                        )
                                      }
                                    >
                                      <option value="">
                                        Selected approver
                                      </option>
                                      {this.state.approverList.map(
                                        (val, idx) => {
                                          return val.checked == 'checked' ? (
                                            <option value={val.firstName}>
                                              {val.firstName} {val.lastName}{' '}
                                            </option>
                                          ) : (
                                            ''
                                          );
                                        }
                                      )}
                                    </FormControl>
                                    <FormControl.Feedback />
                                    <span className="highlight" />
                                    <span className="bar" />
                                    {renderMessage(
                                      this.props.getValidationMessages(
                                        'addApproval' + index
                                      )
                                    )}
                                  </FormGroup> */}
                                </td>
                                <td className="">
                                  <button
                                    className="btn btn-primary text-uppercase sm-btn show-list"
                                    onClick={e =>
                                      this.handleShowApprovalModal(e, index)
                                    }
                                  >
                                    add approver
                                  </button>
                                </td>
                              </tr>
                            ];
                          })}
                        </tbody>
                      </Table>
                    </div>
                    <div className="">
                      <span
                        onClick={this.handleAddMoreContact}
                        className="cursor-pointer"
                      >
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp; Add more user
                      </span>
                      {'  '}
                      {this.state.contactArray.length > 1 ? (
                        <span
                          onClick={this.handleRemoveUser}
                          className="cursor-pointer"
                        >
                          <span className="ico-minusgly">Remove user</span>
                        </span>
                      ) : (
                        ''
                      )}
                    </div>

                    <div className="text-center">
                      <button
                        className="btn btn-default text-uppercase"
                        onClick={event =>
                          this.validateData(event, 'generateOTP')
                        }
                      >
                        Generate OTP
                      </button>
                    </div>
                    <div className="centeredBox m-t-40 m-b-60">
                      <h4 className="text-center">
                        Enter OTP sent to your Email
                      </h4>
                      <form>
                        <div className="otp-input">
                          <FormGroup>
                            <FormControl
                              type="text"
                              placeholder=""
                              maxLength="1"
                              inputRef={element => {
                                this.OTPField0 = element;
                              }}
                              onChange={e => {
                                this.handleOTPChange('OTPField', 0, e);
                              }}
                            />
                            <FormControl
                              type="text"
                              placeholder=""
                              maxLength="1"
                              inputRef={element => {
                                this.OTPField1 = element;
                              }}
                              onChange={e => {
                                this.handleOTPChange('OTPField', 1, e);
                              }}
                            />
                            <FormControl
                              type="text"
                              placeholder=""
                              maxLength="1"
                              inputRef={element => {
                                this.OTPField2 = element;
                              }}
                              onChange={e => {
                                this.handleOTPChange('OTPField', 2, e);
                              }}
                            />
                            <span>▬</span>
                            <FormControl
                              type="text"
                              placeholder=""
                              maxLength="1"
                              inputRef={element => {
                                this.OTPField3 = element;
                              }}
                              onChange={e => {
                                this.handleOTPChange('OTPField', 3, e);
                              }}
                            />
                            <FormControl
                              type="text"
                              placeholder=""
                              maxLength="1"
                              inputRef={element => {
                                this.OTPField4 = element;
                              }}
                              onChange={e => {
                                this.handleOTPChange('OTPField', 4, e);
                              }}
                            />
                            <FormControl
                              type="text"
                              placeholder=""
                              maxLength="1"
                              inputRef={element => {
                                this.OTPField5 = element;
                              }}
                              onChange={e => {
                                this.handleOTPChange('OTPField', 5, e);
                              }}
                            />
                          </FormGroup>
                        </div>
                      </form>
                    </div>
                    <div className="text-center m-b-60">
                      <button
                        className="btn btn-default text-uppercase"
                        disabled={this.state.OTPField.join('').length != 6}
                        onClick={event => this.validateData(event, 'addUser')}
                      >
                        Add Users
                      </button>
                    </div>
                  </div>
                </section>
              </div>
              {/* -----add approval modal------ */}
              <Modal
                className="custom-popUp"
                show={this.state.show}
                onHide={this.handleClose}
                onEntered={this.handleModalShown}
              >
                <Modal.Body>
                  <h4 className="modal-head text-center">Add Approver</h4>
                  <Table bordered responsive className="custom-table">
                    <thead>
                      <tr>
                        <th>
                          <label className="label--checkbox">
                            <input
                              type="checkbox"
                              className="checkbox"
                              name="allchecked"
                              checked={
                                this.state.contactArray &&
                                this.state.contactArray[
                                  this.state.contactArrayIndex
                                ] &&
                                this.state.contactArray[
                                  this.state.contactArrayIndex
                                ].allchecked
                                  ? 'checked'
                                  : ''
                              }
                              onChange={event =>
                                this.handleApproverSelectAll(event)
                              }
                              // onClick={event =>
                              //   this.handleApproverSelectAll(event)
                              // }
                            />
                          </label>
                        </th>
                        <th />
                        <th>First Name</th>
                        <th>last Name</th>
                        <th>Email</th>
                        <th>User Profile</th>
                        <th>Make Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.approverList.map((approver, index) => {
                        const firstName = approver.firstName || '';
                        const lastName = approver.lastName || '';
                        const userProfile = approver.userProfile || '';
                        const email = approver.email || '';
                        const id = approver.id || '';
                        const checked = approver.checked ? 'checked' : '';
                        let lastIndex = this.state.contactArray;
                        let lengthArr = lastIndex.length - 1;
                        return (
                          <tr>
                            <td>
                              <label className="label--checkbox">
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  checked={checked}
                                  onClick={event =>
                                    this.handleApproverSelect(event, id)
                                  }
                                />
                              </label>
                            </td>
                            <td>
                              <div className="sm-avtar">
                                <img src={userImage} />
                              </div>
                            </td>
                            <td className="text-capitalize">{firstName} </td>
                            <td className="text-capitalize">{lastName}</td>
                            <td>{email}</td>
                            <td className="text-capitalize">
                              {userProfile.replace(/_/g, ' ')}
                            </td>
                            <td>
                              <label className="label--radio">
                                <input
                                  type="radio"
                                  className="radio"
                                  checked={
                                    this.state.contactArray[lengthArr]
                                      .defaultApprover === id
                                      ? 'checked'
                                      : ''
                                  }
                                  name="m-radio"
                                  onChange={event =>
                                    this.handleDefaultApproverSelect(
                                      event,
                                      id,
                                      'defaultApprover'
                                    )
                                  }
                                />
                              </label>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>

                  <div className="text-center text-uppercase">
                    <button
                      className="btn btn-default"
                      onClick={this.handleHideApprovalModal}
                    >
                      Close
                    </button>{' '}
                  </div>
                  {/* <div className="custom-responsive">
              <div className="table-row">
                <div className="table-col">
                  <label className="label--checkbox">
                    <input type="checkbox" className="checkbox" />
                    Item 1
                  </label>
                </div>

                <div className="table-col">First Name</div>

                <div className="table-col">last Name</div>

                <div className="table-col">Email</div>
              </div>

              <div className="table-row">
                <div className="table-col">
                  <label className="label--checkbox">
                    <input type="checkbox" className="checkbox" />
                    Item 1
                  </label>
                </div>
                <div className="table-col">Jack sparrow</div>

                <div className="table-col">Male</div>

                <div className="table-col">jack@gmail.com</div>
              </div>
            </div> */}
                </Modal.Body>
              </Modal>
              {this.props.userInfo.userData.userRole === 1 ? (
                <FooterBuyer
                  pageTitle={permissionConstant.footer_title.add_user}
                />
              ) : (
                <FooterSupplier
                  pageTitle={permissionConstant.footer_title.add_user}
                />
              )}
            </div>
            {/* ) : null} */}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionGetApproverList,
      actionUserLogout,
      actionGenerateOTPToAddUser,
      actionSupplierAddUser,
      actionLoaderHide,
      actionLoaderShow,
      actionTabClick,
      actionGetUserProfileList,
      actionGetCompanyData
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

AddUser = validation(strategy)(AddUser);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUser);
