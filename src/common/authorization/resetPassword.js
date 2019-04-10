import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel, Modal } from "react-bootstrap";
import Sprite from "../../img/sprite.svg";
import Logo from "../../img/logo.png";
import validation from "react-validation-mixin";
import strategy from "react-validatorjs-strategy";
import classnames from "classnames";
import CONSTANTS from "../core/config/appConfig";
import lockImage from "../../img/lock.png";
import { renderMessage } from "../commonFunctions";

let { validationMessages } = CONSTANTS;
let { regExpressions } = CONSTANTS;
class ResetPassword extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      password: "",
      confirmPassword: "",
      roleId: 2,
      typeConfPass: "password",
      typeNewPass: "password"
    };

    this.userType = "";
    this.roleIdObj = {
      buyer: 1,
      supplier: 2
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleRegisterNavigation = this.handleRegisterNavigation.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.getValidatorData = this.getValidatorData.bind(this);
    this.validateData = this.validateData.bind(this);
    this.eyeNewClick = this.eyeNewClick.bind(this);
    this.eyeConfClick = this.eyeConfClick.bind(this);
    this.validatorTypes = strategy.createSchema(
      {
        password: ["required", "regex:" + regExpressions.passwordPattern],
        confirmPassword: ["required", "regex:" + regExpressions.passwordPattern]
      },
      {
        "required.password": validationMessages.password.required,
        "regex.password": validationMessages.password.passwordPattern,
        "required.confirmPassword": validationMessages.password.required,
        "regex.confirmPassword": validationMessages.password.passwordPattern
      }
    );
    console.log(
      "search --- ",
      this.props.location.search.substring(
        this.props.location.search.indexOf("=") + 1
      )
    );
    console.log("token --- ", this.props.match.params.id);
  }
  componentWillMount() {
    this.setState({ typeConfPass: "password", typeNewPass: "password" });
  }
  getValidatorData = () => {
    return this.state;
  };

  getClasses = field => {
    return classnames({
      error: !this.props.isValid(field)
    });
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

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  handleResetPassword(e) {
    console.log(
      "-password-",
      this.state.password,
      "-confirmPassword-",
      this.state.confirmPassword
    );

    if (this.state.password === this.state.confirmPassword) {
      // this.validatorTypes.rules['confirmPassword']='';
      // this.validatorTypes.messages['required.confirmPassword']="";
      let token = "";
      if (this.props.location.search) {
        token = this.props.location.search.substring(
          this.props.location.search.indexOf("=") + 1
        );
      }
      const path = this.props.location.pathname;
      const password = btoa(this.state.password);
      const roleId = path === "/buyer/resetPassword" ? 1 : 2;
      let _this = this;
      let data = {
        password: password,
        roleId: roleId,
        token: token
      };
      //this.props.actionLoaderShow();
      this.props
        .actionResetPassword(data)
        .then((result, error) => {
          //_this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      // this.validatorTypes.rules['confirmPassword']='required';
      // this.validatorTypes.messages['required.confirmPassword']="Your password and confirmation password do not match";
    }
  }

  handleRegisterNavigation() {
    // this.props.actionShowSignIn(false);
    // this.props.history.push('signup')
    let path = this.props.location.pathname;
    try {
      switch (path) {
        case "/buyer/signin":
          this.props.history.push("/buyer/signup");
          break;
        case "/supplier/signin":
          this.props.history.push("/supplier/signup");
          break;
        default:
          break;
      }
    } catch (error) {}
  }

  validateData = e => {
    e.preventDefault();
    let _this = this;
    this.props.validate(function(error) {
      console.log(error);
      if (!error) {
        // _this.setState({ isLoading: true });
        _this.handleResetPassword(e);
      }
    });
  };
  eyeNewClick() {
    let typeNewPass = this.state.typeNewPass;
    this.setState({ typeNewPass: !typeNewPass });
  }
  eyeConfClick() {
    let typeConfPass = this.state.typeConfPass;
    this.setState({ typeConfPass: !typeConfPass });
  }
  render() {
    return (
      <div className="centeredBox">
        <div className="logo-area text-center">
          <img src={Logo} alt="" />
          <h2>Password Recovery</h2>
        </div>

        <form>
          <FormGroup
            // validationState={this.getValidationState("password")}
            className="group"
          >
            <span className="ico-in">
              <svg>
                <use xlinkHref={`${Sprite}#lockIco`} />
              </svg>
            </span>
            <FormControl
              type={this.state.typeNewPass ? "password" : "text"}
              value={this.state.password}
              onChange={this.handleChange}
              onBlur={this.props.handleValidation("password")}
              name="password"
              required
            />
            <FormControl.Feedback />
            <span className="highlight" />
            <span className="bar" />
            {renderMessage(this.props.getValidationMessages("password"))}
            <ControlLabel>New password</ControlLabel>
            {this.state.typeNewPass ? (
              <span
                className="ico-in eye-set cursor-pointer"
                onClick={this.eyeNewClick}
              >
                <svg>
                  <use xlinkHref={`${Sprite}#eyeIco`} />
                </svg>
              </span>
            ) : (
              <span
                className="ico-in eye-set cursor-pointer"
                onClick={this.eyeNewClick}
              >
                <svg>
                  <use xlinkHref={`${Sprite}#eyeCancelIco`} />
                </svg>
              </span>
            )}
          </FormGroup>
          <FormGroup
            // validationState={this.getValidationState("password")}
            className="group"
          >
            <span className="ico-in">
              <svg>
                <use xlinkHref={`${Sprite}#lockIco`} />
              </svg>
            </span>
            <FormControl
              type={this.state.typeConfPass ? "password" : "text"}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              onBlur={this.props.handleValidation("confirmPassword")}
              name="confirmPassword"
              required
            />
            <FormControl.Feedback />
            <span className="highlight" />
            <span className="bar" />
            {renderMessage(this.props.getValidationMessages("confirmPassword"))}
            <ControlLabel>Re-enter new password</ControlLabel>
            {this.state.typeConfPass ? (
              <span
                className="ico-in eye-set cursor-pointer"
                onClick={this.eyeConfClick}
              >
                <svg>
                  <use xlinkHref={`${Sprite}#eyeIco`} />
                </svg>
              </span>
            ) : (
              <span
                className="ico-in eye-set cursor-pointer"
                onClick={this.eyeConfClick}
              >
                <svg>
                  <use xlinkHref={`${Sprite}#eyeCancelIco`} />
                </svg>
              </span>
            )}
          </FormGroup>
          <button
            className="btn btn-primary btn-block btn-md"
            onClick={event => this.validateData(event, "login")}
          >
            Submit
          </button>
        </form>
        <div className="flex align-center brk">
          <hr />
          <span className="m-dot"> </span>
          <hr />
        </div>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          className="custom-popUp forgotpwdPop"
        >
          <img src={lockImage} className="lock-img" />
          {/* <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                  </Modal.Header> */}
          <Modal.Body>
            <div className="p-20">
              <h4 className="fw-800 text-center">Forgot Password?</h4>
              <p className="text-center">
                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
                cursus magna,
              </p>
              <div className="p-lr-40">
                <FormGroup className="group m-t-40 ">
                  <span className="ico-in">
                    <svg>
                      <use xlinkHref={`${Sprite}#envelopIco`} />
                    </svg>
                  </span>
                  <FormControl
                    type="text"
                    value={this.state.email}
                    onChange={this.handleChange}
                    onBlur={this.props.handleValidation("email")}
                    name="email"
                    required
                  />

                  <FormControl.Feedback />
                  <span className="highlight" />
                  <span className="bar" />
                  {renderMessage(this.props.getValidationMessages("email"))}
                  <ControlLabel>Email</ControlLabel>
                </FormGroup>
              </div>

              <div className="flex align-center justify-space-between">
                <button
                  className="btn btn-link text-uppercase sm-btn fw-600"
                  onClick={this.handleClose}
                >
                  back to login
                </button>
                <button
                  className="btn btn-default text-uppercase sm-btn"
                  // onClick={this.handleForgotPassword}
                  onClick={event => this.validateData(event, "forgotPassword")}
                >
                  Reset my password
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
ResetPassword = validation(strategy)(ResetPassword);
export default ResetPassword;
