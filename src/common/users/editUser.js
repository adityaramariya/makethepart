import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  Modal,
  Table,
  DropdownButton,
  Breadcrumb
} from 'react-bootstrap';
import validation from 'react-validation-mixin';
import strategy, { validator } from 'react-validatorjs-strategy';
import SideBarBuyer from '../../buyer/common/sideBar';
import SideBarSupplier from '../../supplier/common/sideBar';
import HeaderBuyer from '../../buyer/common/header';
import HeaderSupplier from '../../supplier/common/header';
import FooterBuyer from '../../buyer/common/footer';
import FooterSupplier from '../../supplier/common/footer';
import noRecord from '../../img/no_record.png';
import {
  actionUserLogout,
  actionGenerateOTPToAddUser,
  actionSupplierAddUser,
  actionLoaderHide,
  actionLoaderShow,
  actionEditProfile,
  actionGetAllAddedUser,
  actionGetApproverList,
  actionDeleteUser,
  actionDeleteAffectedUser,
  actionGetUserProfileList,
  actionGenerateOTPToEditUser,
  actionGetCompanyData
} from '../../common/core/redux/actions';
import Sprite from '../../img/sprite.svg';
import {
  renderMessage,
  showErrorToast,
  topPosition,
  removeUnderScore
} from '../../common/commonFunctions';
import CONSTANTS from '../../common/core/config/appConfig';
import _ from 'lodash';
import userImage from '../../img/profile.svg';
import { handlePermission } from '../../common/permissions';
let { validationMessages, permissionConstant } = CONSTANTS;

class EditUser extends Component {
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
      contactArray: []
    };
    this.state = {
      show: false,
      tabKey: 'editUser',
      approverList: [],
      editUserDetails: [],
      contactArrayIndex: '',
      contactArray: [{ ...this.contactObject }],
      otpOption: false,
      activeGenerat: false,
      OTPField: ['', '', '', '', '', '']
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.handleEditUser = this.handleEditUser.bind(this);
    this.handleGetUserList = this.handleGetUserList.bind(this);
    this.handleGetApproverList = this.handleGetApproverList.bind(this);
    this.handleContactFieldChange = this.handleContactFieldChange.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDefaultApproverSelect = this.handleDefaultApproverSelect.bind(
      this
    );
    this.handleApproverSelect = this.handleApproverSelect.bind(this);
    this.handleCloseModel = this.handleCloseModel.bind(this);
    this.applyValidationForBlank = this.applyValidationForBlank.bind(this);
    this.handleOTPChange = this.handleOTPChange.bind(this);
  }

  componentDidMount() {
    let _this = this;
    const userId = this.props.userInfo.userData.id;
    const roleId = this.props.userInfo.userData.userRole;
    this.handleGetUserList();
    this.handleGetApproverList();
    this.props.actionGetUserProfileList({ userId, roleId });

    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };
    this.props
      .actionGetCompanyData(data)
      .then((result, error) => {
        let purchaseResponse = result.payload.data.resourceData;
        this.setState({
          listOfDepartment: purchaseResponse.departmentResponses,
          listOfAddress: purchaseResponse.addresses
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  applyValidationForBlank() {
    let fieldObject = {};
    let errorMessage = {};
    this.validatorTypes = strategy.createInactiveSchema(
      fieldObject,
      errorMessage
    );
    // if (this.state.contactArray && this.state.contactArray[index]) {
    //   fieldObject["firstName"] = "";
    //   errorMessage["required.firstName"] = "";

    //   fieldObject["lastName"] = "";
    //   errorMessage["required.lastName"] = "";

    //   fieldObject["email"] = "";
    //   errorMessage["required.email"] = "";

    //   fieldObject["mobile"] = "";
    //   errorMessage["required.mobile"] = "";

    //   fieldObject["userType"] = "";
    //   errorMessage["required.userType"] = "";

    //   this.validatorTypes = strategy.createInactiveSchema(
    //     fieldObject,
    //     errorMessage
    //   );

    //   console.log("validatorTypes", this.validatorTypes);
    // }
  }

  applyValidation(index) {
    let fieldObject = {};
    let errorMessage = {};
    let listOfOtherApprovers = [];
    if (this.state.contactArray && this.state.contactArray[index]) {
      if (!this.state.contactArray[index].firstName) {
        fieldObject['firstName'] = 'required';
        errorMessage['required.firstName'] =
          validationMessages.firstName.required;
      } else {
        fieldObject['firstName'] = '';
        errorMessage['required.firstName'] = '';
      }

      if (!this.state.contactArray[index].lastName) {
        fieldObject['lastName'] = 'required';
        errorMessage['required.lastName'] =
          validationMessages.lastName.required;
      } else {
        fieldObject['lastName'] = '';
        errorMessage['required.lastName'] = '';
      }

      if (!this.state.contactArray[index].email)
        fieldObject['email'] = 'required';
      errorMessage['required.email'] = validationMessages.email.required;
    } else {
      fieldObject['email'] = '';
      errorMessage['required.email'] = '';
    }

    if (!this.state.contactArray[index].mobile) {
      fieldObject['mobile'] = 'required';
      errorMessage['required.mobile'] = validationMessages.mobile.required;
    } else {
      fieldObject['mobile'] = '';
      errorMessage['required.mobile'] = '';
    }

    if (!this.state.contactArray[index].userType) {
      fieldObject['userType'] = 'required';
      errorMessage['required.userType'] = validationMessages.userType.required;
    } else {
      fieldObject['userType'] = '';
      errorMessage['required.userType'] = '';
    }

    this.validatorTypes = strategy.createInactiveSchema(
      fieldObject,
      errorMessage
    );
  }
  handleClose() {
    this.setState({ show: false, otpOption: false, activeGenerat: false });
    this.handleGetUserList();
    this.applyValidationForBlank();
  }

  handleShow(event, i) {
    let approverList = this.props.supplierUsers.approverList;
    let listOfOtherApprovers = [];
    let listOfOtherApproversIds = [];
    let listOfOtherDefaultApprovers = [];
    if (
      this.state.contactArray &&
      this.state.contactArray[i] &&
      this.state.contactArray[i].listOfApproversRes
    ) {
      listOfOtherApproversIds = this.state.contactArray[
        i
      ].listOfApproversRes.map(function(obj, index) {
        return obj.id;
      });
      listOfOtherDefaultApprovers = this.state.contactArray[
        i
      ].listOfApproversRes.map(function(obj, index) {
        if (obj.defaultApprover === true) {
          return obj.id;
        }
      });
    }

    for (let index = 0; index < approverList.length; index++) {
      let element = approverList[index];
      element.checked = false;
      if (
        listOfOtherApproversIds &&
        listOfOtherApproversIds.indexOf(element.id) !== -1
      ) {
        element.checked = true;
      }

      if (
        listOfOtherDefaultApprovers &&
        listOfOtherDefaultApprovers.indexOf(element.id) !== -1
      ) {
        element.defaultApprover = true;
      } else {
        element.defaultApprover = false;
      }
    }
    this.setState({
      approverList
    });
    this.setState({ show: true, contactArrayIndex: i });
    this.applyValidationForBlank();
  }

  handleContactFieldChange(event, index, stateName) {
    const { value } = event.target;
    this.setState((prevState, props) => {
      prevState.editUserDetails[stateName] = value;
      return {
        editUserDetails: prevState.editUserDetails,
        [stateName + index]: value
      };
    });
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

  handleGetUserList() {
    let reportArray = [];
    const userId = this.props.userInfo.userData.id;
    this.props
      .actionGetAllAddedUser({ userId })
      .then((result, error) => {
        if (result && result.payload) {
          if (result.payload.data && result.payload.data.resourceData) {
            reportArray = result.payload.data.resourceData;
          }
          this.setState({
            contactArray: reportArray
              ? JSON.parse(JSON.stringify(reportArray))
              : [],
            contactArrayList: reportArray
              ? JSON.parse(JSON.stringify(reportArray))
              : []
          });
        }
      })
      .catch();
  }

  handleChange(event, index, stateName) {
    // const { value } = event.target;
    let value = event.target.value;
    let checked = event.target.checked;
    const { options, selectedIndex } = event.target;
    let listOfAddress = this.state.listOfAddress;
    let allContactArray = this.state.contactArray;
    let contactArray = allContactArray[index];

    if (stateName === 'departmentId') {
      contactArray.departmentResponse = [];
      contactArray.departmentResponse.department =
        options[selectedIndex].innerHTML;
      contactArray.departmentResponse.id = value;
      allContactArray[index] = contactArray;
      this.setState({
        contactArray: allContactArray
      });
    }

    this.setState((prevState, props) => {
      prevState.contactArray[index][stateName] = value;

      if (stateName === 'userProfileId') {
        let filteredUserProfileName = _.filter(
          this.props.supplierUsers.profileList,
          function(userData) {
            return userData.id === value;
          }
        );
        prevState.contactArray[index]['userProfile'] =
          filteredUserProfileName && filteredUserProfileName[0].profileName;
      }

      if (stateName === 'addressRequest') {
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

        this.setState({
          addressRequest: value,
          contactArray: allContactArray
        });

        if (addressObj[0]) {
          contactArray.addressResponse = value;
          allContactArray[index] = contactArray;
          this.setState({
            contactArray: allContactArray
          });
        }
      }

      if (stateName === 'budgetPlanner') {
        if (checked) {
          value = true;
        } else {
          value = false;
        }

        contactArray.budgetPlanner = value;
        allContactArray[index] = contactArray;
        this.setState({
          contactArray: allContactArray
        });

        this.setState((prevState, props) => {
          prevState.contactArray[index][stateName] = value;
          return {
            contactArray: prevState.contactArray,
            [stateName + index]: value,
            activeGenerat: true
          };
        });
      }
      return {
        contactArray: prevState.contactArray,
        [stateName + index]: value,
        activeGenerat: true
      };
    });
  }

  handleGetApproverList() {
    const userId = this.props.userInfo.userData.id;
    const roleId = this.props.userInfo.userData.userRole;
    this.props
      .actionGetApproverList({ userId, roleId })
      .then((result, error) => {
        if (result && result.payload) {
          let reportArray =
            result.payload.data && result.payload.data.resourceData;
          this.setState({
            approverList: reportArray
          });
        }
      })
      .catch();
  }

  handleDeleteUser(event, id, index) {
    let _this = this;
    const parentId = this.props.userInfo.userData.id;
    const roleId = this.props.userInfo.userData.userRole;
    const userId = id;
    let data = {
      parentId,
      roleId,
      userId
    };

    this.props
      .actionDeleteUser(data)
      .then((result, error) => {
        if (result.payload.data.resourceData) {
          this.setState({ showApprover: true });
        }
        let status = result.payload.data.status;
        if (status === 200) {
          let list = _this.state.contactArrayList;
          let contactArrayLength =
            _this.state.contactArrayList && _this.state.contactArrayList.length;
          if (contactArrayLength > 1) {
            list.splice(index, 1);
            _this.setState({
              contactArrayList: list
            });
          }
        }
      })
      .catch();
    this.setState({
      showApproveModal: false
    });
  }

  handleDefaultApproverSelect(event, id, stateName) {
    let index = this.state.contactArrayIndex;
    let mainindex = this.state.contactArrayIndex;
    const { value } = event.target;

    let contactArrayList = this.state.contactArray;

    this.setState((prevState, props) => {
      prevState.contactArray[index][stateName] = id;
      return {
        contactArray: prevState.contactArray,
        [stateName + index]: id
      };
    });

    let approverList = this.props.supplierUsers.approverList;
    let listOfOtherApprovers = [];
    let listOfOtherDefaultApprovers = [];
    if (
      this.state.contactArray &&
      this.state.contactArray[index] &&
      this.state.contactArray[index].listOfApproversRes
    ) {
      listOfOtherDefaultApprovers = [id];
    }
    for (let index = 0; index < approverList.length; index++) {
      let element = approverList[index];
      this.setState({ contactArrayList: contactArrayList });
      if (
        listOfOtherDefaultApprovers &&
        listOfOtherDefaultApprovers.indexOf(element.id) !== -1
      ) {
        element.defaultApprover = true;
      } else {
        element.defaultApprover = false;
      }
    }
    this.setState({
      approverList
    });
  }

  handleApproverSelect(event, approverId) {
    const index = this.state.contactArrayIndex;
    const selected = event.target.checked;
    const approverList = this.state.approverList;
    let contactArray = this.state.contactArray[index];
    let indexArr = this.state.approverList.findIndex(x => x.id == approverId);
    let listOfOtherApprovers = [];

    if (selected) {
      this.setState({ activeGenerat: true });
      const result = this.state.approverList.find(
        applist => applist.id === approverId
      );
      approverList[indexArr].checked = true;
      this.setState({ approverList: approverList });
    } else {
      approverList[indexArr].checked = false;
      approverList[indexArr].defaultApprover = false;
      this.setState({ approverList: approverList });
    }

    listOfOtherApprovers = _.filter(this.state.approverList, function(
      userData
    ) {
      return userData.checked === true;
    });
    if (listOfOtherApprovers.length === 0) {
      approverList[indexArr].defaultApprover = false;
      this.setState({ approverList: approverList });
    }
    listOfOtherApprovers = _.filter(this.state.approverList, function(
      userData
    ) {
      return userData.checked === true;
    });

    if (listOfOtherApprovers.length <= 0) {
      for (let index = 0; index < approverList.length; index++) {
        approverList[index].defaultApprover = false;
        this.setState({ approverList: approverList });
      }
    } else if (listOfOtherApprovers.length === 1) {
      for (let index = 0; index < approverList.length; index++) {
        if (approverList[index].checked)
          approverList[index].defaultApprover = true;
        this.setState({ approverList: approverList });
      }
    }
    // else if (listOfOtherApprovers.length > 1) {
    //   let flag = false;
    //   let flagIndex = "";
    //   for (let index = 0; index < approverList.length; index++) {
    //     if (approverList[index].defaultApprover === true) {
    //       flag = true;
    //       break;
    //     } else {
    //       flag = false;
    //     }
    //     flagIndex = index;

    //     console.log("flagIndex", flagIndex);
    //     console.log("flag", flag);
    //     this.setState({ approverList: approverList });
    //   }
    //   approverList[flagIndex].defaultApprover = false;
    //   this.setState({ approverList: approverList });
    // }
  }
  handleModalShown() {
    let approverList = [...this.props.supplierUsers.approverList];
    for (let index = 0; index < approverList.length; index++) {
      let element = approverList[index];
      element.checked = false;
      if (
        this.state.contactArray[this.state.contactArrayIndex] &&
        this.state.contactArray[this.state.contactArrayIndex]
          .listOfOtherApprovers &&
        this.state.contactArray[
          this.state.contactArrayIndex
        ].listOfOtherApprovers.indexOf(element.id) !== -1
      )
        element.checked = true;
    }
    this.setState({
      approverList
    });
  }

  validateData = (e, index, actionType) => {
    e.preventDefault();
    this.applyValidation(index);
    let _this = this;
    _this.props.validate(function(error) {
      if (!error) {
        switch (actionType) {
          case 'generateOTP':
            const roleId = _this.props.userInfo.userData.userRole;
            const userId = _this.props.userInfo.userData.id;
            _this.props.actionLoaderShow();
            _this.props
              .actionGenerateOTPToEditUser({ userId, roleId })
              .then((result, error) => {
                _this.setState({
                  otpOption: true
                });
                _this.props.actionLoaderHide();
              })
              .catch(e => {
                _this.props.actionLoaderHide();
              });
            break;
          case 'editUser':
            _this.handleEditUser(e, index);
            break;

          default:
            break;
        }
      }
    });
  };

  // validateData = (e, index) => {
  //   console.log("validateData");
  //   e.preventDefault();
  //   //this.handleEditUser(e, index);
  //   this.applyValidation(index);
  //   this.props.validate(function(error) {
  //     console.log(error);
  //     if (!error) {
  //       this.generateOTP(e, index);
  //       //_this.handleEditUser(e, index);
  //     }
  //   });
  // };

  getValidatorData = () => {
    return this.state;
  };

  handleEditUser(event, index) {
    const emailOTP = this.state.OTPField.join('');
    const roleId = this.props.userInfo.userData.userRole;
    const parentUserId = this.props.userInfo.userData.id;
    let _this = this;
    let listOfOtherApproversIds = [];
    let listOfOtherApprovers = [];
    let defaultApproverIds = [];
    let listOfDefaultApprover = [];
    if (this.state.approverList) {
      listOfOtherApprovers = _.filter(this.state.approverList, function(
        userData
      ) {
        return userData.checked === true;
      });
      listOfOtherApproversIds = listOfOtherApprovers.map(function(obj, index) {
        return obj.id;
      });

      listOfDefaultApprover = _.filter(this.state.approverList, function(
        userData
      ) {
        return userData.defaultApprover === true;
      });
      defaultApproverIds = listOfDefaultApprover.map(function(obj, index) {
        return obj.id;
      });
    }
    let flag = true;
    if (isNaN(emailOTP)) {
      showErrorToast('Please enter correct otp');
      flag = false;
    }

    if (flag) {
      let address = this.state.addressRequest;
      let budgetPlanner = this.state.contactArray[index].budgetPlanner;

      // this.setState((prevState, props) => {
      //   prevState.contactArray[index]['addressResponse'] = address;
      //   prevState.contactArray[index]['budgetPlanner'] = budgetPlanner;
      //   return {
      //     contactArray: prevState.contactArray,
      //     ['addressResponse']: address,
      //     ['budgetPlanner']: budgetPlanner
      //   };
      // });

      let userType =
        this.state.contactArray[index].userType === 'Admin' ? 1 : 2;
      let data = {
        userDetailRequests: [
          {
            userId: this.state.contactArray[index].id,
            firstName: this.state.contactArray[index].firstName,
            lastName: this.state.contactArray[index].lastName,
            userType: userType,
            userProfile: this.state.contactArray[index].userProfileId,
            departmentId: this.state.contactArray[index].departmentId,
            budgetPlanner: this.state.contactArray[index].budgetPlanner,
            addressRequest: this.state.addressRequest,
            listOfOtherApprovers: listOfOtherApproversIds,
            defaultApprover: defaultApproverIds[0]
              ? defaultApproverIds[0]
              : listOfOtherApproversIds[0]
          }
        ],
        parentUserId,
        roleId,
        emailOTP
      };

      console.log('parentUserId--', data);

      // data.userDetailRequests[0] = this.state.contactArray[index];

      this.props
        .actionEditProfile(data)
        .then((result, error) => {
          _this.props.actionLoaderHide();
          if (result.payload.data.status === 400) {
            showErrorToast(result.payload.data.message);
          } else {
            let element = this.state.contactArray;
            element[index].listOfApproversRes = listOfOtherApprovers;
            this.setState({
              contactArrayList: element,
              show: false,
              otpOption: false,
              activeGenerat: false
            });
          }
        })
        .catch(e => _this.props.actionLoaderHide());

      // this.state.contactArray;
    }
  }

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
  deleteUserConfirmation(event, id, index) {
    const parentId = this.props.userInfo.userData.id;
    const roleId = this.props.userInfo.userData.userRole;
    const userId = id;
    let data = {
      parentId,
      roleId,
      userId
    };
    this.props
      .actionDeleteAffectedUser(data)
      .then((result, error) => {
        this.setState({
          affrctedUser: result.payload.data.resourceData
        });
      })
      .catch();

    this.setState({
      showApproveModal: false
    });
    this.setState({
      showApproveModal: true,
      deleteId: id,
      deleteIndex: index
    });
  }
  handleCloseModel() {
    this.setState({ showApproveModal: false, type: '' });
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
  render() {
    let profileList = this.props.supplierUsers.profileList;
    console.log('this.state.contactArrayList', this.state.contactArrayList);
    return (
      <div>
        {this.props.userInfo.userData.userRole === 1 ? (
          <div>
            <HeaderBuyer activeTabKeyAction={this.activeTabKeyAction} />
            <SideBarBuyer activeTabKeyAction={this.activeTabKeyAction} />
          </div>
        ) : (
          <div>
            <HeaderSupplier activeTabKeyAction={this.activeTabKeyAction} />
            <SideBarSupplier activeTabKeyAction={this.activeTabKeyAction} />
          </div>
        )}
        {this.state.tabKey === 'editUser' ? (
          <section className="">
            <div className="content-body flex">
              <div className="content">
                <div className="container-fluid">
                  {this.props.userInfo.userData.userProfile === 'admin' ? (
                    <div className="">
                      <Breadcrumb className="style-breadcrumb">
                        <Breadcrumb.Item>
                          <Link to="administrator">Dashboard</Link>
                        </Breadcrumb.Item>

                        <Breadcrumb.Item active>Edit Users</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  ) : (
                    ''
                  )}
                  <h4 className="hero-title">Edit User</h4>

                  <div>
                    {this.state.contactArrayList &&
                    this.state.contactArrayList.length ? (
                      <Table bordered responsive className="custom-table">
                        <thead>
                          <tr>
                            <th className="text-uppercase">Name</th>
                            <th className="">Email</th>
                            {this.props.userInfo.userData.userRole === 1 ? (
                              <th className="text-uppercase">User profile</th>
                            ) : (
                              ''
                            )}
                            <th className="text-uppercase">mobile number</th>
                            <th className="text-uppercase">user type</th>
                            {this.props.userInfo.userData.userRole === 1 ? (
                              <th className="text-uppercase">department</th>
                            ) : (
                              ''
                            )}
                            {this.props.userInfo.userData.userRole === 1 ? (
                              <th className="text-uppercase">Address</th>
                            ) : (
                              ''
                            )}
                            {this.props.userInfo.userData.userRole === 1 ? (
                              <th className="text-uppercase">Region</th>
                            ) : (
                              ''
                            )}
                            {this.props.userInfo.userData.userRole === 1 ? (
                              <th className="text-uppercase">Budget Planner</th>
                            ) : (
                              ''
                            )}
                            <th className="text-uppercase">
                              Selected approver
                            </th>
                            <th> </th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.contactArrayList.map((item, index) => {
                            return (
                              <tr>
                                <td>
                                  {this.state.contactArrayList[index]
                                    .firstName +
                                    ' ' +
                                    this.state.contactArrayList[index].lastName}
                                </td>
                                <td className="">
                                  <span className="w-150 text-ellipsis d-inline">
                                    {' '}
                                    {this.state.contactArrayList[index].email}
                                  </span>
                                </td>
                                {this.props.userInfo.userData.userRole === 1 ? (
                                  <td>
                                    {this.state.contactArrayList[index]
                                      .userProfile
                                      ? removeUnderScore(
                                          this.state.contactArrayList[index]
                                            .userProfile
                                        )
                                      : ''}
                                  </td>
                                ) : (
                                  ''
                                )}

                                <td>
                                  {this.state.contactArrayList[index].mobile}
                                </td>
                                <td>
                                  {this.state.contactArrayList[index].userType}
                                </td>

                                {this.props.userInfo.userData.userRole === 1 ? (
                                  <td>
                                    {this.state.contactArrayList[index]
                                      .departmentResponse &&
                                    this.state.contactArrayList[index]
                                      .departmentResponse.department
                                      ? this.state.contactArrayList[index]
                                          .departmentResponse.department
                                      : ''}
                                  </td>
                                ) : (
                                  ''
                                )}
                                {this.props.userInfo.userData.userRole === 1 ? (
                                  <td>
                                    {this.state.contactArrayList[index]
                                      .addressResponse &&
                                    this.state.contactArrayList[index]
                                      .addressResponse.address
                                      ? this.state.contactArrayList[index]
                                          .addressResponse.address
                                      : ''}
                                  </td>
                                ) : (
                                  ''
                                )}
                                {this.props.userInfo.userData.userRole === 1 ? (
                                  <td>
                                    {this.state.contactArrayList[index]
                                      .addressResponse &&
                                    this.state.contactArrayList[index]
                                      .addressResponse.locationId
                                      ? this.state.contactArrayList[index]
                                          .addressResponse.locationId
                                      : ''}
                                  </td>
                                ) : (
                                  ''
                                )}
                                {this.props.userInfo.userData.userRole === 1 ? (
                                  <td className="w100">
                                    {this.state.contactArrayList[index]
                                      .budgetPlanner ? (
                                      <button className="btn-hollow text-success fill-green">
                                        <span className="ico-right">
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#rightIco`}
                                            />
                                          </svg>
                                        </span>
                                      </button>
                                    ) : (
                                      <button className="btn-hollow text-danger">
                                        <span className="cross">&#10005;</span>
                                      </button>
                                    )}
                                  </td>
                                ) : (
                                  ''
                                )}
                                <td>
                                  <FormControl
                                    className="br-0 w-200"
                                    type="text"
                                    componentClass="select"
                                    value={
                                      this.state.contactArrayList[index]
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
                                    <option value="">Selected approver</option>
                                    {this.state.contactArrayList &&
                                      this.state.contactArrayList[index] &&
                                      this.state.contactArrayList[index]
                                        .listOfApproversRes &&
                                      this.state.contactArrayList[
                                        index
                                      ].listOfApproversRes.map((val, idx) => {
                                        return (
                                          <option
                                            value={val.firstName}
                                            className={
                                              val.defaultApprover
                                                ? 'default-app'
                                                : ''
                                            }
                                          >
                                            {val.firstName} {val.lastName} |{' '}
                                            {val.userProfile
                                              ? removeUnderScore(
                                                  val.userProfile
                                                )
                                              : ''}
                                          </option>
                                        );
                                      })}
                                  </FormControl>
                                </td>

                                <td className="w-125">
                                  {' '}
                                  <button
                                    className="btn btn-task btn btn-task"
                                    onClick={event =>
                                      this.handleShow(event, index)
                                    }
                                  >
                                    <span className="ico-action ">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#editIco`} />
                                      </svg>
                                    </span>
                                    <span className="ico-txt">EDIT</span>
                                  </button>
                                  <button
                                    className="btn btn-task btn btn-task"
                                    // onClick={event =>
                                    //   this.handleDeleteUser(
                                    //     event,
                                    //     this.state.contactArrayList[index].id,
                                    //     index
                                    //   )
                                    // }
                                    onClick={event =>
                                      this.deleteUserConfirmation(
                                        event,
                                        this.state.contactArrayList[index].id,
                                        index
                                      )
                                    }
                                  >
                                    <span className="ico-action ">
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#deleteIco`}
                                        />
                                      </svg>
                                    </span>
                                    <span className="ico-txt">DELETE</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="noRecord">
                        {' '}
                        <img src={noRecord} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {this.props.userInfo.userData.userRole === 1 ? (
                <FooterBuyer
                  pageTitle={permissionConstant.footer_title.edit_user}
                />
              ) : (
                <FooterSupplier
                  pageTitle={permissionConstant.footer_title.edit_user}
                />
              )}
            </div>
            <Modal
              show={this.state.show}
              onHide={this.handleClose}
              className="custom-popUp"
            >
              <Modal.Body>
                <h4 className="text-center m-b-30">Edit User</h4>
                <div className="style-form">
                  <Row className="show-grid">
                    <Col md={6}>
                      <FormGroup className="group ">
                        <FormControl
                          type="text"
                          name="firstName"
                          value={
                            this.state.contactArray &&
                            this.state.contactArray[
                              this.state.contactArrayIndex
                            ] &&
                            this.state.contactArray[
                              this.state.contactArrayIndex
                            ].firstName
                          }
                          onChange={event =>
                            this.handleChange(
                              event,
                              this.state.contactArrayIndex,
                              'firstName'
                            )
                          }
                        />
                        <FormControl.Feedback />

                        <ControlLabel>First Name</ControlLabel>
                        {renderMessage(
                          this.props.getValidationMessages('firstName')
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="group ">
                        <FormControl
                          type="text"
                          name={'lastName'}
                          value={
                            this.state.contactArray &&
                            this.state.contactArray[
                              this.state.contactArrayIndex
                            ] &&
                            this.state.contactArray[
                              this.state.contactArrayIndex
                            ].lastName
                          }
                          required
                          onChange={event =>
                            this.handleChange(
                              event,
                              this.state.contactArrayIndex,
                              'lastName'
                            )
                          }
                        />
                        <FormControl.Feedback />

                        <ControlLabel>Last Name</ControlLabel>
                        {renderMessage(
                          this.props.getValidationMessages('lastName')
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="show-grid">
                    <Col md={6}>
                      <FormGroup className="group ">
                        <FormControl
                          type="text"
                          name={'email' + this.state.contactArrayIndex}
                          required
                          //disabled={true}
                          value={
                            this.state.contactArray &&
                            this.state.contactArray[
                              this.state.contactArrayIndex
                            ] &&
                            this.state.contactArray[
                              this.state.contactArrayIndex
                            ].email
                          }
                          onChange={event =>
                            this.handleChange(
                              event,
                              this.state.contactArrayIndex,
                              'email'
                            )
                          }
                        />
                        <FormControl.Feedback />

                        <ControlLabel>Email</ControlLabel>
                        {renderMessage(
                          this.props.getValidationMessages('email')
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup className="group">
                        <FormControl
                          type="text"
                          name={'mobile'}
                          required
                          disabled={true}
                          onChange={event =>
                            this.handleChange(
                              event,
                              this.state.contactArrayIndex,
                              'mobile'
                            )
                          }
                          value={
                            this.state.contactArray &&
                            this.state.contactArray[
                              this.state.contactArrayIndex
                            ] &&
                            this.state.contactArray[
                              this.state.contactArrayIndex
                            ].mobile
                          }
                        />
                        <FormControl.Feedback />

                        <ControlLabel>Mobile Number</ControlLabel>
                        {renderMessage(
                          this.props.getValidationMessages('mobile')
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="show-grid">
                    <Col md={6}>
                      <FormGroup controlId="formBasicText" className="group">
                        <FormControl
                          className="br-0 s-arrow"
                          type="text"
                          componentClass="select"
                          name={'userProfile'}
                          value={
                            this.state.contactArray &&
                            this.state.contactArray[
                              this.state.contactArrayIndex
                            ] &&
                            this.state.contactArray[
                              this.state.contactArrayIndex
                            ].userType
                          }
                          onChange={event =>
                            this.handleChange(
                              event,
                              this.state.contactArrayIndex,
                              'userType'
                            )
                          }
                        >
                          <option value="">Select user privilage</option>
                          <option value="Admin">Admin</option>
                          <option value="Regular">Regular</option>
                        </FormControl>
                        <FormControl.Feedback />

                        {renderMessage(
                          this.props.getValidationMessages('userProfile')
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <div class="custom-dd dropflex dropdown-style selapproveDp">
                        <DropdownButton
                          title="Selected Approver"
                          name="secpeificationData"
                        >
                          {this.state.approverList &&
                            this.state.approverList.map((approver, index) => {
                              const firstName = approver.firstName || '';
                              const lastName = approver.lastName || '';
                              const email = approver.email || '';
                              const id = approver.id || '';
                              // let checked = "";
                              let lastIndex = this.state.contactArray;
                              let userProfile = approver.userProfile;
                              let defaultApprover = approver.defaultApprover
                                ? true
                                : false;
                              const checked = approver.checked ? true : false;
                              if (
                                this.state.contactArray &&
                                this.state.contactArray[
                                  this.state.contactArrayIndex
                                ] &&
                                this.state.contactArray[
                                  this.state.contactArrayIndex
                                ].id === id
                              ) {
                              } else {
                                return (
                                  <li className="flex justify-space-between">
                                    <label className="label--checkbox flex-1">
                                      <input
                                        className="checkbox"
                                        type="checkbox"
                                        value={id}
                                        checked={checked ? true : false}
                                        onChange={event =>
                                          this.handleApproverSelect(event, id)
                                        }
                                      />
                                      {firstName}

                                      {userProfile
                                        ? '| ' + removeUnderScore(userProfile)
                                        : ''}
                                    </label>
                                    &nbsp;
                                    <label className="label--radio sm-radio">
                                      <input
                                        type="radio"
                                        className="radio"
                                        // checked={
                                        //   defaultApprover === id ? "checked" : ""
                                        // }
                                        checked={defaultApprover ? true : false}
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
                                  </li>
                                );
                              }
                            })}
                        </DropdownButton>
                      </div>
                    </Col>
                  </Row>
                  {this.props.userInfo.userData.userRole === 1 ? (
                    <Row>
                      <Col md={6}>
                        <FormGroup controlId="formBasicText" className="group">
                          <FormControl
                            className=" s-arrow"
                            type="text"
                            componentClass="select"
                            name={'userProfile'}
                            value={
                              this.state.contactArray &&
                              this.state.contactArray[
                                this.state.contactArrayIndex
                              ] &&
                              this.state.contactArray[
                                this.state.contactArrayIndex
                              ].userProfileId
                            }
                            onChange={event =>
                              this.handleChange(
                                event,
                                this.state.contactArrayIndex,
                                'userProfileId'
                              )
                            }
                          >
                            <option value="">Select user profile</option>
                            {profileList &&
                              profileList.map((val, index) => {
                                return (
                                  <option value={val.id}>
                                    {val.profileName &&
                                      removeUnderScore(val.profileName)}
                                  </option>
                                );
                              })}
                          </FormControl>
                          <FormControl.Feedback />

                          {renderMessage(
                            this.props.getValidationMessages('userProfile')
                          )}
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup
                          controlId="formControlsSelect"
                          className="group"
                        >
                          <FormControl
                            componentClass="select"
                            placeholder="select"
                            className="s-arrow br-0"
                            name={'departmentId' + this.state.contactArrayIndex}
                            value={
                              this.state.contactArray &&
                              this.state.contactArray[
                                this.state.contactArrayIndex
                              ] &&
                              this.state.contactArray[
                                this.state.contactArrayIndex
                              ].departmentResponse &&
                              this.state.contactArray[
                                this.state.contactArrayIndex
                              ].departmentResponse.id
                            }
                            onChange={event =>
                              this.handleChange(
                                event,
                                this.state.contactArrayIndex,
                                'departmentId'
                              )
                            }
                          >
                            <option value="">select</option>

                            {this.state.listOfDepartment &&
                              this.state.listOfDepartment.map((item, index) => {
                                return (
                                  <option value={item.id} key={item.department}>
                                    {item.department}
                                  </option>
                                );
                              })}
                          </FormControl>
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}
                  {this.props.userInfo.userData.userRole === 1 ? (
                    <Row>
                      <Col md={6}>
                        <td>
                          <FormGroup
                            controlId="formControlsSelect"
                            className="group"
                          >
                            <FormControl
                              componentClass="select"
                              placeholder="select"
                              className="s-arrow br-0"
                              name={
                                'addressRequest' + this.state.contactArrayIndex
                              }
                              value={
                                this.state.contactArray &&
                                this.state.contactArray[
                                  this.state.contactArrayIndex
                                ] &&
                                this.state.contactArray[
                                  this.state.contactArrayIndex
                                ].addressResponse &&
                                this.state.contactArray[
                                  this.state.contactArrayIndex
                                ].addressResponse.address
                              }
                              onChange={event =>
                                this.handleChange(
                                  event,
                                  this.state.contactArrayIndex,
                                  'addressRequest'
                                )
                              }
                            >
                              <option value="">select</option>
                              {this.state.listOfAddress &&
                                this.state.listOfAddress.map((item, index) => {
                                  return (
                                    <option value={item.id} key={index}>
                                      {item.address}
                                    </option>
                                  );
                                })}
                            </FormControl>
                          </FormGroup>
                        </td>
                      </Col>

                      <Col md={6}>
                        <FormGroup controlId="formBasicText" className="group">
                          <FormControl
                            className="br-0"
                            type="text"
                            maxLength="50"
                            name={'area' + this.state.contactArrayIndex}
                            value={
                              this.state.contactArray &&
                              this.state.contactArray[
                                this.state.contactArrayIndex
                              ] &&
                              this.state.contactArray[
                                this.state.contactArrayIndex
                              ].addressResponse &&
                              this.state.contactArray[
                                this.state.contactArrayIndex
                              ].addressResponse.locationId
                            }
                            onChange={event =>
                              this.handleChange(
                                event,
                                this.state.contactArrayIndex,
                                'area'
                              )
                            }
                          />
                          <ControlLabel>Country</ControlLabel>
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}
                  {this.props.userInfo.userData.userRole === 1 ? (
                    <Row>
                      <Col md={6}>
                        <label className="label--checkbox">
                          <input
                            type="checkbox"
                            onChange={event =>
                              this.handleChange(
                                event,
                                this.state.contactArrayIndex,
                                'budgetPlanner'
                              )
                            }
                            className="checkbox"
                            name={
                              'budgetPlanner' + this.state.contactArrayIndex
                            }
                            checked={
                              this.state.contactArray &&
                              this.state.contactArray[
                                this.state.contactArrayIndex
                              ] &&
                              this.state.contactArray[
                                this.state.contactArrayIndex
                              ].budgetPlanner
                                ? 'checked'
                                : ''
                            }
                          />
                          Budget Planner
                        </label>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}
                </div>
                {this.state.otpOption ? (
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
                ) : null}
                <div className="text-center m-b-20">
                  {!this.state.otpOption ? (
                    <button
                      className={
                        this.state.activeGenerat
                          ? 'btn btn-default text-uppercase'
                          : 'btn btn-default text-uppercase disabled'
                      }
                      // onClick={event =>
                      //   this.handleEditUser(event, this.state.contactArrayIndex)
                      // }
                      onClick={event =>
                        this.validateData(
                          event,
                          this.state.contactArrayIndex,
                          'generateOTP'
                        )
                      }
                    >
                      Generate OTP
                    </button>
                  ) : null}
                  {this.state.otpOption ? (
                    <button
                      className="btn btn-default text-uppercase"
                      // onClick={event =>
                      //   this.handleEditUser(event, this.state.contactArrayIndex)
                      // }
                      onClick={event =>
                        this.validateData(
                          event,
                          this.state.contactArrayIndex,
                          'editUser'
                        )
                      }
                      disabled={
                        this.state.OTPField &&
                        this.state.OTPField.join('').length != 6
                      }
                    >
                      Save
                    </button>
                  ) : null}
                  <button
                    className="btn btn-success text-uppercase"
                    onClick={this.handleClose}
                  >
                    Cancel
                  </button>
                </div>
              </Modal.Body>
              {/* <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer> */}
            </Modal>
            <Modal
              show={this.state.showApproveModal}
              onHide={this.handleClose}
              className={
                this.state.affrctedUser && this.state.affrctedUser.length > 0
                  ? 'custom-popUp'
                  : 'custom-popUp confirmation-box'
              }
              bsSize={
                this.state.affrctedUser && this.state.affrctedUser.length > 0
                  ? ''
                  : 'small'
              }
            >
              <Modal.Body>
                <div className="">
                  <h5 className="modal-head text-center">
                    {this.state.affrctedUser &&
                    this.state.affrctedUser.length > 0
                      ? ' This user is approver in the below list of users. Are sure want to delete?'
                      : 'Are sure want to delete this user?'}
                  </h5>
                  <div>
                    {this.state.affrctedUser &&
                    this.state.affrctedUser.length > 0 ? (
                      <Table bordered responsive className="custom-table">
                        <thead>
                          <tr>
                            <th />
                            <th>Name</th>
                            <th>Profile</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.affrctedUser.map((item, index) => {
                            return (
                              <tr>
                                <td>
                                  <div className="sm-avtar">
                                    <img
                                      src={
                                        item.profileImageThumbnailUrl
                                          ? item.profileImageThumbnailUrl
                                          : userImage
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{item.fullName}</td>
                                <td>
                                  {item.userProfile
                                    ? removeUnderScore(item.userProfile)
                                    : ''}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    ) : (
                      ''
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      className="btn btn-default text-uppercase sm-btn"
                      onClick={event =>
                        this.handleDeleteUser(
                          event,
                          this.state.deleteId,
                          this.state.deleteIndex
                        )
                      }
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-success text-uppercase sm-btn"
                      onClick={this.handleCloseModel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </section>
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
      actionEditProfile,
      actionGetAllAddedUser,
      actionDeleteUser,
      actionDeleteAffectedUser,
      actionGetUserProfileList,
      actionGenerateOTPToEditUser,
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

EditUser = validation(strategy)(EditUser);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUser);
