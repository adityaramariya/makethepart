import React, { Component } from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import { Row, Col, Tab, Nav, NavItem } from "react-bootstrap";
// import Sprite from "../../img/sprite.svg";
// import Images from "../../img/logo.png";
import SignIn from "./signIn";
import SignUp from "./signUp";
import SignUpSuccess from "./singUpSuccess";
import OTPVerification from "./otpVerfication";
import ResetPassword from "./resetPassword";
import {
  actionShowSignIn,
  actionUserLogin,
  actionChangeUserType,
  actionUserRegister,
  actionOtpVerification,
  actionLoaderHide,
  actionLoaderShow,
  actionForgotPassword,
  actionResetPassword
} from "../core/redux/actions";

function ShowHideSignUpIn(props) {
  if (props.key == 0) return <SignUp />;
  return <SignIn />;
}

class Authorizaton extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      key: "",
      roleId: 2,
      type: "",
      page: ""
    };
    // this.state.type = "";
    // this.state.page = "";
    this.checkPageNavigation = this.checkPageNavigation.bind(this);
  }

  checkPageNavigation(_props) {
    // let _props = this.props;
    let path = _props.location.pathname;
    try {
      //Navigate user to home page by roleId
      switch (path) {
        case "/buyer/signin":
          if (_props.userInfo.userType !== "buyer")
            _props.actionChangeUserType("buyer");
          if (_props.userInfo.showSignIn !== "signin")
            _props.actionShowSignIn("signin");
          break;
        case "/buyer/signup":
          if (_props.userInfo.userType !== "buyer")
            _props.actionChangeUserType("buyer");
          if (_props.userInfo.showSignIn !== "signup")
            _props.actionShowSignIn("signup");
          break;
        case "/supplier/signin":
          if (_props.userInfo.userType !== "supplier")
            _props.actionChangeUserType("supplier");
          if (_props.userInfo.showSignIn !== "signin")
            _props.actionShowSignIn("signin");
          break;
        case "/supplier/signup":
          if (_props.userInfo.userType !== "supplier")
            _props.actionChangeUserType("supplier");
          if (_props.userInfo.showSignIn !== "signup")
            _props.actionShowSignIn("signup");
          break;
        //Success screen show hide
        case "/supplier/signupsuccess":
          if (_props.userInfo.userType !== "supplier")
            _props.actionChangeUserType("supplier");
          if (_props.userInfo.showSignIn !== "success")
            _props.actionShowSignIn("success");
          break;
        case "/buyer/signupsuccess":
          if (_props.userInfo.userType !== "buyer")
            _props.actionChangeUserType("buyer");
          if (_props.userInfo.showSignIn !== "success")
            _props.actionShowSignIn("success");
          break;
        //OTP verification screens show hide
        case "/supplier/otpVerification":
          if (_props.userInfo.userType !== "supplier")
            _props.actionChangeUserType("supplier");
          if (_props.userInfo.showSignIn !== "otpverification")
            _props.actionShowSignIn("otpverification");
          break;
        case "/buyer/otpVerification":
          if (_props.userInfo.userType !== "buyer")
            _props.actionChangeUserType("buyer");
          if (_props.userInfo.showSignIn !== "otpverification")
            _props.actionShowSignIn("otpverification");
          break;
        //Forgot Password screens show hide
        case "/buyer/resetPassword":
          if (_props.userInfo.userType !== "buyer")
            _props.actionChangeUserType("buyer");
          if (_props.userInfo.showSignIn !== "resetPassword")
            _props.actionShowSignIn("resetPassword");
          break;
        case "/supplier/resetPassword":
          if (_props.userInfo.userType !== "supplier")
            _props.actionChangeUserType("supplier");
          if (_props.userInfo.showSignIn !== "resetPassword")
            _props.actionShowSignIn("resetPassword");
          break;

        default:
          break;
      }
    } catch (error) {}
  }

  componentDidMount() {
    this.checkPageNavigation(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkPageNavigation(nextProps);
    try {
      //Navigate user to home page by roleId
      switch (nextProps.userInfo.userData.userRole) {
        case 1:
          this.props.history.push("/buyer/home");
          break;
        case 2:
          this.props.history.push("/supplier/home");
        default:
          break;
      }
    } catch (error) {}
  }

  getValidationState() {
    const length = this.state.value.length;
    if (length > 10) return "success";
    else if (length > 5) return "warning";
    else if (length > 0) return "error";
    return null;
  }

  render() {
    return (
      <div>
        <div className="wrapper-hero">
          <div className="colWrap full-height">
            <div className="l-col flex align-center clear-fix">
              {/* <div className="mask" ></div> */}
              <div className="side-content">
                <h2 className="side-title">Lorem Ipsum is simply text</h2>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>

                <h6 className="copyright">copyright Makethepart 2018</h6>
              </div>
            </div>

            <div className="r-col clear-fix">
              <div className="flex align-center custom-tab">
                <div className="user-type">
                  <ul
                    className="nav nav-pills nav-stacked"
                    style={{
                      visibility:
                        this.props.userInfo.showSignIn == "otpverification" ||
                        this.props.userInfo.showSignIn == "success"
                          ? "hidden"
                          : ""
                    }}
                  >
                    <li
                      role="presentation"
                      className={`${
                        this.props.userInfo.userType === "buyer" ? "active" : ""
                      }`}
                      onClick={e => {
                        this.props.history.push("/buyer/signin");
                        // this.props.actionChangeUserType('buyer');
                      }}
                    >
                      <a>BUYER</a>
                    </li>
                    <li
                      role="presentation"
                      className={`${
                        this.props.userInfo.userType === "supplier"
                          ? "active"
                          : ""
                      }`}
                      onClick={e => {
                        this.props.history.push("/supplier/signin");
                        // this.props.actionChangeUserType('supplier');
                      }}
                    >
                      <a>SUPPLIER</a>
                    </li>
                  </ul>
                </div>
                <div
                  className="formContent"
                  style={{
                    display:
                      this.props.userInfo.showSignIn == "signin"
                        ? "block"
                        : "none"
                  }}
                >
                  <SignIn {...this.props} />
                </div>
                <div
                  className="formContent"
                  style={{
                    display:
                      this.props.userInfo.showSignIn == "signup"
                        ? "block"
                        : "none"
                  }}
                >
                  <SignUp {...this.props} />
                </div>
                <div
                  className="formContent"
                  style={{
                    display:
                      this.props.userInfo.showSignIn == "success"
                        ? "block"
                        : "none"
                  }}
                >
                  <SignUpSuccess {...this.props} />
                </div>
                <div
                  className="formContent"
                  style={{
                    display:
                      this.props.userInfo.showSignIn == "otpverification"
                        ? "block"
                        : "none",
                    height: "100%"
                  }}
                >
                  <OTPVerification {...this.props} />
                </div>
                <div
                  className="formContent"
                  style={{
                    display:
                      this.props.userInfo.showSignIn == "resetPassword"
                        ? "block"
                        : "none"
                  }}
                >
                  <ResetPassword {...this.props} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionShowSignIn,
      actionUserLogin,
      actionChangeUserType,
      actionUserRegister,
      actionOtpVerification,
      actionLoaderHide,
      actionLoaderShow,
      actionForgotPassword,
      actionResetPassword
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
)(Authorizaton);
