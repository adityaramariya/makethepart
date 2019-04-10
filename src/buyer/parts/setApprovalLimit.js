import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import _ from "lodash";

import {
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  Modal,
  Button,
  Table,
  DropdownButton,
  MenuItem,
  ButtonToolbar
} from "react-bootstrap";

import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetUserList,
  actionSaveApprovalLimit,
  actionGetUserByGroup,
  actionUpdateApprovalLimit
} from "../../common/core/redux/actions";
import xlsImage from "../../img/xls.png";
import pdfImage from "../../img/pdf.png";
import docImage from "../../img/doc.png";
import Sprite from "../../img/sprite.svg";
import Slider from "react-slick";
import { timeStampToDate, showErrorToast } from "../../common/commonFunctions";
import Footer from "../common/footer";
import CONSTANTS from "../../common/core/config/appConfig";
import { handlePermission } from "../../common/permissions";
let { permissionConstant } = CONSTANTS;

class SetApprovalLimit extends Component {
  constructor(props) {
    super(props);
    // this.userList = [{}];
    this.state = {
      nav1: null,
      nav2: null,
      tabKey: "setApprovalLimit",
      groupColumn: [
        {
          userList: [{}]
        },
        {
          userList: [{}]
        },
        {
          userList: [{}]
        }
      ],
      userList: [{}],
      showSlider: [],
      limitDisable: [],
      addCount: 0,
      editMode: false,
      showNewGroupFlag: false,
      tempArray: []
    };

    this.addGroupColumn = this.addGroupColumn.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.saveApprovalLimit = this.saveApprovalLimit.bind(this);
    this.addNewUserByGroup = this.addNewUserByGroup.bind(this);
    this.saveClick = this.saveClick.bind(this);
    this.updateClick = this.updateClick.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
  }

  componentDidMount() {
    let _this = this;
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
    // const roleId = this.props.userInfo.userData.userRole;
    const userId = this.props.userInfo.userData.id;
    let data = {
      roleId: this.props.userInfo.userData.userRole || "",
      userId: this.props.userInfo.userData.id || ""
    };
    this.props.actionLoaderShow();
    this.props
      .actionGetUserByGroup(data)
      .then((result, error) => {
        let listOfPOApproverGroupRes = [];
        let renderGroupList = [];
        //newly added code
        if (result.payload.data.responseMessage === "No PO Aprover Group") {
          listOfPOApproverGroupRes = [];
        } else {
          //newly added code
          listOfPOApproverGroupRes =
            result.payload &&
            result.payload.data &&
            result.payload.data.resourceData.listOfPOApproverGroupRes
              ? result.payload.data.resourceData.listOfPOApproverGroupRes
              : [];
          listOfPOApproverGroupRes &&
            listOfPOApproverGroupRes.forEach(function(element, index) {
              renderGroupList[index] = element.groupMemberList;
            });
        }
        let showSlider = _this.state.showSlider;
        let limitDisable = _this.state.limitDisable;
        listOfPOApproverGroupRes &&
          listOfPOApproverGroupRes.forEach(function(element, index) {
            showSlider[index] = true;
            limitDisable[index] = true;
          });

        _this.setState({
          showSlider: showSlider,
          listOfPOApproverGroupRes: listOfPOApproverGroupRes,
          renderGroupList: renderGroupList
        });
        // if (!result.payload.data.resourceData) {
        // if (!result.payload.data.length) {
        _this.props.actionLoaderShow();
        _this.props
          .actionGetUserList({ userId })
          .then((result, error) => {
            let userDataList = this.state.userDataList;
            let userRenderList = [];
            userDataList = result.payload.data.resourceData;
            userDataList &&
              userDataList.forEach(function(elem, index) {
                userRenderList[index] = [];
              });
            _this.setState({
              userDataList: userDataList,
              userRenderList: userRenderList
            });
            //---
            let listOfPOApproverGroupRes = this.state.listOfPOApproverGroupRes;
            listOfPOApproverGroupRes &&
              listOfPOApproverGroupRes.forEach(function(item, index) {
                let disableAddNewUser = _this.state.disableAddNewUser || [];
                if (item.groupMemberList.length === userDataList.length) {
                  disableAddNewUser[index] = true;
                }
                _this.setState({ disableAddNewUser: disableAddNewUser });
              });
            //---
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
        // }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === "first") this.props.history.push("home");
    if (tabKey === "third")
      this.props.history.push({
        pathname: "home",
        state: { path: "third" }
      });
    this.setState({ tabKey: tabKey });
  }

  handleUserChange(event, index, columnIndex) {
    const { name, value, key } = event.target;
    this.setState({
      [name]: value
    });
    let data = _.filter(this.state.userDataList, function(userData) {
      return userData.id === value;
    });
    let userRenderList = this.state.userRenderList;
    let userDataList = this.state.userDataList;
    if (userRenderList[index].id !== "") {
      for (let i = 0; i < userDataList.length; i++) {
        if (userDataList[i].id === userRenderList[index].id) {
          userDataList[i].userDisable = false;
        }
      }
    }

    let tempArray = this.state.tempArray;
    let listArrayIndex = userDataList.findIndex(item => item.id === value);
    //let checkValue = tempArray[listArrayIndex] ? tempArray[listArrayIndex] : "";
    for (let i = 0; i < userDataList.length; i++) {
      if (userDataList[i].id === value) {
        userDataList[i].userDisable = true;
      }
    }
    tempArray[listArrayIndex] = value;
    userRenderList[index].id = data[0].id;
    userRenderList[index].email = data[0].email;
    userRenderList[index].userProfile = data[0].userProfile;
    userRenderList[index].mobile = data[0].mobile;

    console.log("this.state.showNewGroupFlag", this.state.showNewGroupFlag);

    this.setState({
      userDataList: userDataList,
      tempArray: tempArray
    });
  }

  handleLimitChange(event, index) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    let limitArray = this.state.limitArray || [];
    limitArray[index] = value;
    this.setState({ limitArray: limitArray });
  }

  addGroupColumn() {
    if (this.state.editMode === true) {
      showErrorToast("Please save or cancel group data first");
    } else {
      let _this = this;
      const userId = this.props.userInfo.userData.id;
      let addCount = this.state.addCount;
      addCount += 1;

      let userRenderList = this.state.userRenderList;
      userRenderList &&
        userRenderList.forEach(function(item) {
          item.email = "";
          item.userProfile = "";
          item.mobile = "";
        });

      let userDataList = this.state.userDataList;
      let tempArray = [];
      //----
      // for (let i = 0; i <userDataList.length; i++) {
      if (userDataList) {
        for (let i = 0; i < userDataList.length; i++) {
          userDataList[i].userDisable = false;
          tempArray[i] = "";
        }
      }
      //----

      let listOfPOApproverGroupRes = this.state.listOfPOApproverGroupRes || [];
      let groupMemberList = this.state.userDataList;
      listOfPOApproverGroupRes.push({ groupMemberList });

      this.setState({
        editMode: true,
        listOfPOApproverGroupRes: listOfPOApproverGroupRes,
        addCount: addCount,
        userRenderList: userRenderList,
        showNewGroupFlag: false,
        tempArray: tempArray
      });
    }
  }

  addNewUserByGroup(event, index) {
    if (this.state.editMode === true) {
      showErrorToast("Please save or cancel group data first");
    } else {
      let _this = this;
      let showSlider = this.state.showSlider;
      //let limitDisable = this.state.limitDisable;
      let listOfPOApproverGroupRes = this.state.listOfPOApproverGroupRes;
      let userDataList = this.state.userDataList;
      let userRenderList = this.state.userRenderList;
      // userRenderList[index] = '';
      userRenderList[index] = listOfPOApproverGroupRes[index].groupMemberList;
      //--
      for (let i = 0; i < userDataList.length; i++) {
        userDataList[i].userDisable = false;
      }
      //--
      let newList = listOfPOApproverGroupRes[index].groupMemberList;
      //-
      for (let i = 0; i < userDataList.length; i++) {
        if (newList && newList.length) {
          for (let j = 0; j < newList.length; j++) {
            if (userDataList[i].id === newList[j].id) {
              userDataList[i].userDisable = true;
            }
          }
        }
      }
      //--
      listOfPOApproverGroupRes[index].groupMemberList = userDataList;
      showSlider[index] = false;
      //limitDisable[index] = false;
      this.setState({
        editMode: true,
        newList: newList,
        showSlider: showSlider,
        //limitDisable: limitDisable,
        listOfPOApproverGroupRes: listOfPOApproverGroupRes,
        userRenderList: userRenderList,
        showNewGroupFlag: true
      });
    }
  }

  saveApprovalLimit() {
    let _this = this;
    let groupColumn = this.state.groupColumn;
    let listOfPoApprovalGroupReq = [];
    let groupMemberList = [];
    groupColumn &&
      groupColumn.forEach(function(element, index) {
        element.selectedList.forEach(function(elem, elemIndex) {
          if (elem.id) {
            groupMemberList.push(elem.id);
            listOfPoApprovalGroupReq.push({
              groupName: elem.groupName,
              groupLimitAmount: elem.groupLimitAmount,
              groupMemberList: groupMemberList
            });
          }
        });
      });

    let data = {
      roleId: this.props.userInfo.userData.userRole || "",
      userId: this.props.userInfo.userData.id || "",
      currency: "INR",
      listOfPoApprovalGroupReq: listOfPoApprovalGroupReq || []
    };
    this.props.actionLoaderShow();
    this.props
      .actionSaveApprovalLimit(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  cancelClick(event, index) {
    let showSlider = this.state.showSlider;
    showSlider[index] = false;
    let listOfPOApproverGroupRes = this.state.listOfPOApproverGroupRes;
    let renderGroupList = this.state.renderGroupList;

    // listOfPOApproverGroupRes[index].groupMemberList = renderGroupList[index];
    //-----
    if (renderGroupList[index]) {
      listOfPOApproverGroupRes[index].groupMemberList = renderGroupList[index];
      showSlider[index] = true;
    } else {
      listOfPOApproverGroupRes.splice(index, 1);
    }
    //----
    this.setState({
      editMode: false,
      showSlider: showSlider,
      listOfPOApproverGroupRes: listOfPOApproverGroupRes
    });
  }

  saveClick(event, index) {
    let _this = this;
    let userRenderList = this.state.userRenderList;
    let groupMemberList = [];
    if (!userRenderList[0].userProfile) {
      showErrorToast("Please fill details first");
    } else if (this.state.limitArray && this.state.limitArray) {
      let showSlider = this.state.showSlider;
      showSlider[index] = true;
      this.setState({ editMode: false, showSlider: showSlider });

      userRenderList &&
        userRenderList.forEach(function(elem, index) {
          groupMemberList[index] = elem.id ? elem.id : null;
        });
      let data = {
        roleId: this.props.userInfo.userData.userRole || "",
        userId: this.props.userInfo.userData.id || "",
        currency: "INR",
        groupLimitAmount:
          this.state.limitArray[index] && this.state.limitArray[index],
        groupMemberList: groupMemberList,
        groupNumber: index + 1
      };
      this.props.actionLoaderShow();
      this.props
        .actionSaveApprovalLimit(data)
        .then((result, error) => {
          //--
          this.props.actionLoaderShow();
          this.props
            .actionGetUserByGroup(data)
            .then((result, error) => {
              let listOfPOApproverGroupRes = [];
              let renderGroupList = [];
              listOfPOApproverGroupRes =
                result.payload &&
                result.payload.data &&
                result.payload.data.resourceData.listOfPOApproverGroupRes
                  ? result.payload.data.resourceData.listOfPOApproverGroupRes
                  : [];
              listOfPOApproverGroupRes &&
                listOfPOApproverGroupRes.forEach(function(element, index) {
                  renderGroupList[index] = element.groupMemberList;
                });

              let showSlider = _this.state.showSlider;
              let limitDisable = _this.state.limitDisable;
              listOfPOApproverGroupRes &&
                listOfPOApproverGroupRes.forEach(function(element, index) {
                  showSlider[index] = true;
                  limitDisable[index] = true;
                });

              _this.setState({
                showSlider: showSlider,
                listOfPOApproverGroupRes: listOfPOApproverGroupRes,
                renderGroupList: renderGroupList
              });
              _this.props.actionLoaderHide();
            })
            .catch(e => _this.props.actionLoaderHide());
          //--
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      showErrorToast("Please fill Approver Limit");
    }
  }

  updateClick(event, index) {
    let _this = this;
    let showSlider = this.state.showSlider;
    showSlider[index] = true;
    this.setState({ editMode: false, showSlider: showSlider });
    let userRenderList = this.state.userRenderList;
    let groupMemberList = [];
    userRenderList &&
      userRenderList.forEach(function(elem, index) {
        groupMemberList[index] = elem.id ? elem.id : null;
      });
    let newList = this.state.newList;
    for (let i = 0; i < newList.length; i++) {
      groupMemberList.push(newList[i].id);
    }

    let data = {
      roleId: this.props.userInfo.userData.userRole || "",
      userId: this.props.userInfo.userData.id || "",
      id:
        this.state.listOfPOApproverGroupRes[index] &&
        this.state.listOfPOApproverGroupRes[index].id,
      currency: "INR",
      groupLimitAmount:
        this.state.listOfPOApproverGroupRes[index] &&
        this.state.listOfPOApproverGroupRes[index].groupLimitAmount,
      groupMemberList: groupMemberList
    };
    this.props.actionLoaderShow();
    this.props
      .actionUpdateApprovalLimit(data)
      .then((result, error) => {
        //--
        this.props.actionLoaderShow();
        this.props
          .actionGetUserByGroup(data)
          .then((result, error) => {
            let listOfPOApproverGroupRes = [];
            let renderGroupList = [];
            listOfPOApproverGroupRes =
              result.payload &&
              result.payload.data &&
              result.payload.data.resourceData.listOfPOApproverGroupRes
                ? result.payload.data.resourceData.listOfPOApproverGroupRes
                : [];
            listOfPOApproverGroupRes &&
              listOfPOApproverGroupRes.forEach(function(element, index) {
                renderGroupList[index] = element.groupMemberList;
              });

            let showSlider = _this.state.showSlider;
            let limitDisable = _this.state.limitDisable;
            listOfPOApproverGroupRes &&
              listOfPOApproverGroupRes.forEach(function(element, index) {
                showSlider[index] = true;
                limitDisable[index] = true;
              });

            _this.setState({
              showSlider: showSlider,
              listOfPOApproverGroupRes: listOfPOApproverGroupRes,
              renderGroupList: renderGroupList
            });

            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
        //--

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <div>
        <Header {...this.props} />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === "setApprovalLimit" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <h4 className="hero-title text-center">Set Approval Limits</h4>
                <h4 className="">
                  Approval Limits{" "}
                  <small>
                    (Need specific Authorization to change the approvals)
                  </small>
                </h4>
                <div className="approverWrapper flex border-around border-light m-b-20 overflowXAuto">
                  <div className="l-column w100 after-border">
                    <div className="col-ttl">NAME</div>
                    <div className="col-ttl">EMAIL</div>
                    <div className="col-ttl">PROFILE</div>
                    <div className="col-ttl">PHONE</div>
                    <div className="col-ttl">LIMIT</div>
                  </div>

                  {this.state.listOfPOApproverGroupRes &&
                    this.state.listOfPOApproverGroupRes.map((item, index) => {
                      return (
                        <div className="verticel-slider" key={index}>
                          <div className="user text-center">
                            <span> APPROVER GROUP {index + 1}</span>
                            <p>User</p>
                          </div>
                          {this.state.showSlider[index] ? (
                            <Slider {...settings}>
                              {this.state.listOfPOApproverGroupRes &&
                                this.state.listOfPOApproverGroupRes[index] &&
                                this.state.listOfPOApproverGroupRes[index]
                                  .groupMemberList &&
                                this.state.listOfPOApproverGroupRes[
                                  index
                                ].groupMemberList.map((item, userIndex) => {
                                  return (
                                    <div key={userIndex}>
                                      <FormGroup>
                                        <FormControl
                                          type="text"
                                          className="br-0"
                                          name={"user" + index}
                                          disabled
                                          // value={this.state.userName}
                                          value={
                                            this.state
                                              .listOfPOApproverGroupRes &&
                                            this.state.listOfPOApproverGroupRes[
                                              index
                                            ] &&
                                            this.state.listOfPOApproverGroupRes[
                                              index
                                            ].groupMemberList[userIndex]
                                              .firstName
                                          }
                                        />
                                      </FormGroup>
                                      <FormGroup>
                                        <FormControl
                                          type="text"
                                          className="br-0"
                                          name={"email" + index}
                                          disabled
                                          value={
                                            this.state
                                              .listOfPOApproverGroupRes &&
                                            this.state.listOfPOApproverGroupRes[
                                              index
                                            ] &&
                                            this.state.listOfPOApproverGroupRes[
                                              index
                                            ].groupMemberList &&
                                            this.state.listOfPOApproverGroupRes[
                                              index
                                            ].groupMemberList[userIndex].email
                                          }
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                      <FormGroup>
                                        <FormControl
                                          type="text"
                                          className="br-0"
                                          name={"userProfile" + index}
                                          disabled
                                          value={
                                            this.state
                                              .listOfPOApproverGroupRes &&
                                            this.state.listOfPOApproverGroupRes[
                                              index
                                            ] &&
                                            this.state.listOfPOApproverGroupRes[
                                              index
                                            ].groupMemberList &&
                                            this.state.listOfPOApproverGroupRes[
                                              index
                                            ].groupMemberList[userIndex]
                                              .userProfile
                                          }
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                      <FormGroup>
                                        <FormControl
                                          type="text"
                                          className="br-0"
                                          name={"mobile" + index}
                                          disabled
                                          value={
                                            this.state
                                              .listOfPOApproverGroupRes &&
                                            this.state.listOfPOApproverGroupRes[
                                              index
                                            ] &&
                                            this.state.listOfPOApproverGroupRes[
                                              index
                                            ].groupMemberList &&
                                            this.state.listOfPOApproverGroupRes[
                                              index
                                            ].groupMemberList[userIndex].mobile
                                          }
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                    </div>
                                  );
                                })}
                            </Slider>
                          ) : (
                            // <div>
                            <Slider {...settings}>
                              {// this.state.userRenderList &&
                              // this.state.userRenderList
                              this.state.listOfPOApproverGroupRes &&
                                this.state.listOfPOApproverGroupRes[index] &&
                                this.state.listOfPOApproverGroupRes[index]
                                  .groupMemberList &&
                                this.state.listOfPOApproverGroupRes[
                                  index
                                ].groupMemberList.map((element, elemIndex) => {
                                  console.log("if");
                                  return this.state.showNewGroupFlag ? (
                                    <div key={elemIndex}>
                                      {/* {this.state.listOfPOApproverGroupRes &&
                                        this.state.listOfPOApproverGroupRes[index] &&
                                        this.state.listOfPOApproverGroupRes[index]
                                        .groupMemberList[0].id ? ( */}
                                      <FormGroup>
                                        <FormControl
                                          componentClass="select"
                                          placeholder="select"
                                          className="br-0 s-arrow"
                                          name={"user" + index}
                                          value={this.state.userName}
                                          onChange={event => {
                                            this.handleUserChange(
                                              event,
                                              elemIndex,
                                              index
                                            );
                                          }}
                                        >
                                          <option value="select">Select</option>
                                          {this.state.userDataList.map(
                                            (elem, nameIndex) => {
                                              return (
                                                <option
                                                  disabled={elem.userDisable}
                                                  value={elem.id}
                                                  key={nameIndex}
                                                >
                                                  {elem.firstName}{" "}
                                                  {elem.lastName}
                                                </option>
                                              );
                                            }
                                          )}
                                        </FormControl>
                                      </FormGroup>

                                      <FormGroup>
                                        <FormControl
                                          type="text"
                                          className="br-0"
                                          name={"email" + elemIndex}
                                          value={
                                            element[elemIndex] &&
                                            element[elemIndex].email
                                          }
                                          disabled
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                      <FormGroup>
                                        <FormControl
                                          type="text"
                                          className="br-0"
                                          name={"userProfile" + elemIndex}
                                          value={
                                            element[elemIndex] &&
                                            element[elemIndex].userProfile
                                          }
                                          disabled
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                      <FormGroup className="limitSlider">
                                        <FormControl
                                          type="text"
                                          className="br-0"
                                          name={"mobile" + elemIndex}
                                          value={
                                            element[elemIndex] &&
                                            element[elemIndex].mobile
                                          }
                                          disabled
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                    </div>
                                  ) : (
                                    <div key={elemIndex}>
                                      {console.log("else")}
                                      {/* {this.state.listOfPOApproverGroupRes &&
                                          this.state.listOfPOApproverGroupRes[index] &&
                                          this.state.listOfPOApproverGroupRes[index]
                                          .groupMemberList[0].id ? ( */}
                                      <FormGroup>
                                        <FormControl
                                          componentClass="select"
                                          placeholder="select"
                                          className="br-0 s-arrow"
                                          name={"user" + index}
                                          value={this.state.userName}
                                          onChange={event => {
                                            this.handleUserChange(
                                              event,
                                              elemIndex,
                                              index
                                            );
                                          }}
                                        >
                                          <option value="select">Select</option>
                                          {this.state.userDataList.map(
                                            (elem, nameIndex) => {
                                              return (
                                                <option
                                                  disabled={elem.userDisable}
                                                  value={elem.id}
                                                  key={nameIndex}
                                                >
                                                  {elem.firstName}{" "}
                                                  {elem.lastName}
                                                </option>
                                              );
                                            }
                                          )}
                                        </FormControl>
                                      </FormGroup>

                                      <FormGroup>
                                        <FormControl
                                          type="text"
                                          className="br-0"
                                          name={"email" + elemIndex}
                                          value={
                                            this.state.userRenderList[elemIndex]
                                              .email
                                          }
                                          disabled
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                      <FormGroup>
                                        <FormControl
                                          type="text"
                                          className="br-0"
                                          name={"userProfile" + elemIndex}
                                          value={
                                            this.state.userRenderList[elemIndex]
                                              .userProfile
                                          }
                                          disabled
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                      <FormGroup className="limitSlider">
                                        <FormControl
                                          type="text"
                                          className="br-0"
                                          name={"mobile" + elemIndex}
                                          value={
                                            this.state.userRenderList[elemIndex]
                                              .mobile
                                          }
                                          disabled
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                    </div>
                                  );
                                })}
                            </Slider>
                            // {/* </div> */}
                          )}
                          <FormGroup className="limitSlider">
                            <FormControl
                              type="text"
                              className="br-0"
                              name={"groupLimitAmount" + index}
                              disabled={this.state.limitDisable[index]}
                              value={
                                this.state.listOfPOApproverGroupRes &&
                                this.state.listOfPOApproverGroupRes[index] &&
                                this.state.listOfPOApproverGroupRes[index]
                                  .groupLimitAmount
                              }
                              onChange={event => {
                                this.handleLimitChange(event, index);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>
                          {this.state.showSlider[index] ? (
                            <div className="btnmbt10">
                              <span
                                className={
                                  this.state.disableAddNewUser &&
                                  this.state.disableAddNewUser[index]
                                    ? "bluetxt p-e-none"
                                    : "cursor-pointer bluetxt"
                                }
                                onClick={event => {
                                  this.addNewUserByGroup(event, index);
                                }}
                              >
                                <span className="ico-add">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#plus-OIco`} />
                                  </svg>
                                </span>
                                &nbsp;Add New User in this group
                              </span>
                            </div>
                          ) : (
                            <div>
                              {" "}
                              {/* {this.state.listOfPOApproverGroupRes &&
                            this.state.listOfPOApproverGroupRes[index] &&
                            this.state.listOfPOApproverGroupRes[index]
                              .groupMemberList[0].id ? ( */}
                              {this.state.listOfPOApproverGroupRes &&
                              this.state.listOfPOApproverGroupRes[index].id ? (
                                <button
                                  className="btn btn-default sm-btn text-uppercase"
                                  onClick={event => {
                                    this.updateClick(event, index);
                                  }}
                                >
                                  Update
                                </button>
                              ) : (
                                <button
                                  className="btn btn-default sm-btn text-uppercase"
                                  onClick={event => {
                                    this.saveClick(event, index);
                                  }}
                                >
                                  save
                                </button>
                              )}
                              <button
                                className="btn btn-success sm-btn text-uppercase"
                                onClick={event => {
                                  this.cancelClick(event, index);
                                }}
                              >
                                cancel
                              </button>{" "}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  <div className="last-col">
                    <button
                      className="btn btn-primary text-uppercase"
                      onClick={this.addGroupColumn}
                    >
                      {" "}
                      add new group
                    </button>
                  </div>
                </div>

                {/* new design */}
                {/* <div className="text-center">
                  <Button bsStyle="primary" className="badge-btn">
                    GLOBAL
                  </Button>
                  <Button bsStyle="default" className="badge-btn">
                    LOCAL
                  </Button>
                  &nbsp;&nbsp;
                  <span className="d-inline">
                    <FormControl
                      componentClass="select"
                      placeholder="select"
                      className="sm-select s-arrow text-uppercase"
                    >
                      <option value="select">Location 1</option>
                      <option value="other" />
                    </FormControl>
                  </span>
                </div>

                <div className="m-b-15">
                  <Button
                    bsStyle="success"
                    className="badge-btn border-around border-light"
                  >
                    GROUP 1
                  </Button>
                  <Button
                    bsStyle="success"
                    className="badge-btn border-around border-light"
                  >
                    APPROVAL LIMIT
                  </Button>
                  &nbsp;&nbsp;
                  <span className="d-inline edit-in w-125">
                    <FormGroup controlId="formBasicText" className="m-b-0">
                      <FormControl type="text" className="sm-select" />
                    </FormGroup>
                    <span className="ico-sm cursor-pointer">
                      <svg>
                        <use xlinkHref={`${Sprite}#editIco`} />
                      </svg>
                    </span>
                  </span>
                  <Button bsStyle="info" className="badge-btn br-0">
                    {" "}
                    <span className="ico-sm ">
                      <svg>
                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                      </svg>
                    </span>
                    &nbsp;&nbsp; NEW USER
                  </Button>
                </div> */}
              </div>
            </div>{" "}
            <Footer
              pageTitle={permissionConstant.footer_title.set_approval_limit}
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
      actionGetUserList,
      actionSaveApprovalLimit,
      actionGetUserByGroup,
      actionUpdateApprovalLimit
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
)(SetApprovalLimit);
