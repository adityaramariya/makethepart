import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import validation from "react-validation-mixin";
import strategy from "react-validatorjs-strategy";
import classnames from "classnames";
import * as qs from "query-string";
import Sprite from "../../img/sprite.svg";
import Logo from "../../img/logo.png";
import { makeThePartApiService } from "../core/api/apiService";
import { actionUserLogin } from "../core/redux/actions";
import CONSTANTS from "../core/config/appConfig";
import { renderMessage } from "../commonFunctions";

let { validationMessages } = CONSTANTS;
let { regExpressions } = CONSTANTS;
class OTPVerification extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      password: "",
      password_confirmation: "",
      roleId: 0,
      userId: "",
      emailOTP: ["", "", "", "", "", ""],
      mobileOTP: ["", "", "", "", "", ""],
      EmailOTPError: "",
      MobileOTPError: ""
    };
    this.roleIdObj = {
      buyer: 1,
      supplier: 2
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.handleOTPChange = this.handleOTPChange.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.getValidatorData = this.getValidatorData.bind(this);
    this.validateData = this.validateData.bind(this);

    this.applyValidation();
  }

  componentDidMount() {
    const parsed = qs.parse(window.location.search);
    console.log("parsed", parsed);
    if (parsed.buyerId) {
      this.setState({
        roleId: 1,
        userId: parsed.buyerId
      });
    } else if (parsed.supplierId) {
      this.setState({
        roleId: 2,
        userId: parsed.supplierId
      });
    }
  }

  applyValidation() {
    let fieldObject = {
      password: ["required", "regex:" + regExpressions.passwordPattern],
      password_confirmation: [
        "required",
        "regex:" + regExpressions.passwordPattern,
        "same:password"
      ]
    };

    let errorMessage = {
      "required.password": validationMessages.password.required,
      "regex.password": validationMessages.password.passwordPattern,
      "required.password_confirmation": validationMessages.password.required,
      "regex.password_confirmation": validationMessages.password.passwordPattern
    };

    this.validatorTypes = strategy.createInactiveSchema(
      fieldObject,
      errorMessage
    );
  }

  getValidatorData = () => {
    return this.state;
  };

  getClasses = field => {
    return classnames({
      error: !this.props.isValid(field)
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.userType !== this.userType) {
      this.userType = nextProps.userType;
      this.setState({
        roleId: this.roleIdObj[this.userType] || 2
      });
    }
    try {
      //Navigate user to home page by roleId
      switch (nextProps.userInfo.userData.userRole) {
        case 1:
          this.props.navigateByURL("/buyer/home");
          break;
        case 2:
          this.props.navigateByURL("/supplier/home");
        default:
          break;
      }
    } catch (error) {}
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  handleOTPChange(stateName, index, e) {
    const value = e.target.value;
    this.setState(
      (prevState, props) => {
        prevState[stateName][index] = value;
        return { [stateName]: prevState[stateName] };
      },
      () => {
        const mobileOTP = this.state.mobileOTP.join("");
        const emailOTP = this.state.emailOTP.join("");
        if (emailOTP.length == 6) {
          this.setState({
            EmailOTPError: ""
          });
        }
        if (mobileOTP.length == 6) {
          this.setState({
            MobileOTPError: ""
          });
        }
        const nextElementIndex = index + 1;
        if (nextElementIndex < 6 && this.state[stateName][index] !== "") {
          const elementRef = stateName + nextElementIndex;
          this[elementRef].focus();
        }
      }
    );
  }

  validateData = e => {
    e.preventDefault();
    let _this = this;
    const mobileOTP = this.state.mobileOTP.join("");
    const emailOTP = this.state.emailOTP.join("");
    let EmailOTPError = "";
    let MobileOTPError = "";
    if (emailOTP.length !== 6) {
      EmailOTPError = validationMessages.OTP.required;
    }
    if (mobileOTP.length !== 6) {
      MobileOTPError = validationMessages.OTP.required;
    }
    this.setState({
      EmailOTPError,
      MobileOTPError
    });

    if (mobileOTP.length == 6 && emailOTP.length == 6) {
      this.props.validate(function(error) {
        console.log(error);
        if (!error) {
          _this.handleCreateAccount(e);
        }
      });
    }
  };

  getValidationState(stateName) {
    if (
      this.props.getValidationMessages(stateName) == "" &&
      this.state[stateName] == ""
    )
      return null;
    else if (
      this.props.getValidationMessages(stateName) == "" &&
      this.state[stateName] !== ""
    )
      return "success";
    else if (
      this.props.getValidationMessages(stateName) !== "" &&
      this.state[stateName] !== ""
    )
      return "error";
    else if (
      this.props.getValidationMessages(stateName) !== "" &&
      this.state[stateName] == ""
    )
      return "error";
  }

  handleCreateAccount(e) {
    e.preventDefault();
    let _this = this;
    const mobileOTP = this.state.mobileOTP.join("");
    const { userId } = this.state;
    const emailOTP = this.state.emailOTP.join("");
    const password = btoa(this.state.password);
    const { roleId } = this.state;

    // console.log(userId, roleId, emailOTP, mobileOTP, password);
    // return;
    this.props.actionLoaderShow();
    this.props
      .actionOtpVerification({ userId, roleId, emailOTP, mobileOTP, password })
      .then((result, error) => {
        this.props.actionLoaderHide();
        if (error) return;
        if (result.payload.data.status == 200) {
          this.props.history.push("signin");
        }
      })
      .catch(e => _this.props.actionLoaderHide());
    // this.props.actionUserLogin({ userName, password, roleId });
  }

  render() {
    return (
      <div className="out-form-set">
        <div className="centeredBox">
          <div className="logo-area text-center">
            <img src={Logo} alt="" />
          </div>
          <h4 className="m-b-30">
            Enter OTP sent to you Email and mobile to get in...
          </h4>
          <form>
            <div className="m-b-50">
              <div className="otp-input">
                <ControlLabel>EMAIL OTP</ControlLabel>
                <FormGroup
                // controlId="formBasicText"
                // validationState={this.getValidationState()}
                >
                  <FormControl
                    type="text"
                    value={this.state.value}
                    placeholder=""
                    maxLength="1"
                    name="emailOTP0"
                    inputRef={element => {
                      this.emailOTP0 = element;
                    }}
                    onChange={e => {
                      console.log(e);
                      this.handleOTPChange("emailOTP", 0, e);
                    }}
                  />
                  <FormControl.Feedback />
                  <FormControl
                    type="text"
                    name="emailOTP1"
                    maxLength="1"
                    value={this.state.value}
                    inputRef={element => {
                      this.emailOTP1 = element;
                    }}
                    placeholder=""
                    onChange={e => this.handleOTPChange("emailOTP", 1, e)}
                  />
                  <FormControl.Feedback />
                  <FormControl
                    type="text"
                    name="emailOTP2"
                    maxLength="1"
                    value={this.state.value}
                    inputRef={element => (this.emailOTP2 = element)}
                    placeholder=""
                    onChange={e => this.handleOTPChange("emailOTP", 2, e)}
                  />
                  <FormControl.Feedback />
                  <span>▬</span>
                  <FormControl
                    type="text"
                    name="emailOTP3"
                    maxLength="1"
                    value={this.state.value}
                    inputRef={element => (this.emailOTP3 = element)}
                    placeholder=""
                    onChange={e => this.handleOTPChange("emailOTP", 3, e)}
                  />
                  <FormControl.Feedback />
                  <FormControl
                    type="text"
                    name="emailOTP4"
                    maxLength="1"
                    value={this.state.value}
                    inputRef={element => (this.emailOTP4 = element)}
                    placeholder=""
                    onChange={e => this.handleOTPChange("emailOTP", 4, e)}
                  />
                  <FormControl.Feedback />
                  <FormControl
                    type="text"
                    name="emailOTP5"
                    maxLength="1"
                    value={this.state.value}
                    inputRef={element => (this.emailOTP5 = element)}
                    placeholder=""
                    onChange={e => this.handleOTPChange("emailOTP", 5, e)}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </div>
              {renderMessage(this.state.EmailOTPError)}

              <div className="otp-input">
                <ControlLabel>MOBILE OTP</ControlLabel>
                <FormGroup
                // controlId="formBasicText"
                // validationState={this.getValidationState()}
                >
                  <FormControl
                    type="text"
                    maxLength="1"
                    value={this.state.value}
                    inputRef={element => (this.mobileOTP0 = element)}
                    placeholder=""
                    onChange={e => this.handleOTPChange("mobileOTP", 0, e)}
                  />
                  <FormControl.Feedback />
                  <FormControl
                    type="text"
                    maxLength="1"
                    value={this.state.value}
                    inputRef={element => (this.mobileOTP1 = element)}
                    placeholder=""
                    onChange={e => this.handleOTPChange("mobileOTP", 1, e)}
                  />
                  <FormControl.Feedback />
                  <FormControl
                    type="text"
                    maxLength="1"
                    inputRef={element => (this.mobileOTP2 = element)}
                    value={this.state.value}
                    placeholder=""
                    onChange={e => this.handleOTPChange("mobileOTP", 2, e)}
                  />
                  <FormControl.Feedback />
                  <span>▬</span>
                  <FormControl
                    type="text"
                    maxLength="1"
                    inputRef={element => (this.mobileOTP3 = element)}
                    value={this.state.value}
                    placeholder=""
                    onChange={e => this.handleOTPChange("mobileOTP", 3, e)}
                  />
                  <FormControl.Feedback />
                  <FormControl
                    type="text"
                    maxLength="1"
                    inputRef={element => (this.mobileOTP4 = element)}
                    value={this.state.value}
                    placeholder=""
                    onChange={e => this.handleOTPChange("mobileOTP", 4, e)}
                  />
                  <FormControl.Feedback />
                  <FormControl
                    type="text"
                    maxLength="1"
                    inputRef={element => (this.mobileOTP5 = element)}
                    value={this.state.value}
                    placeholder=""
                    onChange={e => this.handleOTPChange("mobileOTP", 5, e)}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </div>
              {renderMessage(this.state.MobileOTPError)}
            </div>
            <FormGroup
              // controlId="formBasicText"
              validationState={this.getValidationState("password")}
              className="group"
            >
              <span className="ico-in">
                <svg>
                  <use xlinkHref={`${Sprite}#lockIco`} />
                </svg>
              </span>
              <FormControl
                type="password"
                value={this.state.password}
                onChange={this.handleChange}
                name="password"
                required
              />
              <FormControl.Feedback />
              <span className="highlight" />
              <span className="bar" />
              {renderMessage(this.props.getValidationMessages("password"))}
              <ControlLabel>Password</ControlLabel>
            </FormGroup>
            <FormGroup
              // controlId="formBasicText"
              validationState={this.getValidationState("password_confirmation")}
              className="group"
            >
              <span className="ico-in">
                <svg>
                  <use xlinkHref={`${Sprite}#lockIco`} />
                </svg>
              </span>
              <FormControl
                type="password"
                value={this.state.password_confirmation}
                onChange={this.handleChange}
                name="password_confirmation"
                required
              />
              <FormControl.Feedback />
              <span className="highlight" />
              <span className="bar" />
              {renderMessage(
                this.props.getValidationMessages("password_confirmation")
              )}
              <ControlLabel>Confirm password</ControlLabel>
            </FormGroup>
            <button
              className="btn btn-primary btn-block"
              onClick={this.validateData}
              disabled={!this.state.userId}
            >
              create account
            </button>
          </form>
        </div>
      </div>
    );
  }
}

OTPVerification = validation(strategy)(OTPVerification);
export default OTPVerification;
