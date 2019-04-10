import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Modal } from 'react-bootstrap';
import Sprite from '../../img/sprite.svg';
import Logo from '../../img/logo.png';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import classnames from 'classnames';
import CONSTANTS from '../core/config/appConfig';
import lockImage from '../../img/lock.png';
import { renderMessage, showErrorToast } from '../commonFunctions';
import { ToastContainer } from 'react-toastify';
import { ZoomInAndOut } from '../../common/commonFunctions';

let { validationMessages } = CONSTANTS;
let { regExpressions } = CONSTANTS;
class SignIn extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      userName: '',
      password: '',
      roleId: 2,
      typePass: 'password'
    };

    this.userType = '';
    this.roleIdObj = {
      buyer: 1,
      supplier: 2
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegisterNavigation = this.handleRegisterNavigation.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.getValidatorData = this.getValidatorData.bind(this);
    this.validateData = this.validateData.bind(this);
    this.handleForgotPassword = this.handleForgotPassword.bind(this);
    this.eyeClick = this.eyeClick.bind(this);
    // this.eyeCrossClick = this.eyeCrossClick.bind(this);

    this.validatorTypes = strategy.createSchema(
      {
        userName: 'required|email',
        password: ['required', 'regex:' + regExpressions.passwordPattern]
      },
      {
        'required.userName': validationMessages.email.required,
        'email.userName': validationMessages.email.invalid,
        'required.password': validationMessages.password.required,
        'regex.password': validationMessages.password.passwordPattern
      }
    );
  }
  componentWillMount() {
    this.setState({ typePass: 'password' });
  }
  handleClose() {
    this.props.clearValidations();
    this.setState({ show: false, email: '' });
  }

  handleShow() {
    this.setState({ show: true, email: '' });
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

  handleChange(e) {
    const name = e.target.name;
    let value = e.target.value;
    if (name == 'userName') value = value.replace(/ /g, '');
    this.setState({
      [name]: value
    });
  }

  handleLogin(e) {
    const userName = this.state.userName;
    const password = btoa(this.state.password);
    const roleId = this.props.userInfo.userType === 'buyer' ? 1 : 2;
    let _this = this;
    this.props.actionLoaderShow();
    this.props
      .actionUserLogin({ userName, password, roleId })
      .then((result, error) => {
        if (result.payload.data.error === 'unverifed_user') {
          showErrorToast(result.payload.data.error_description);
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleRegisterNavigation() {
    // this.props.actionShowSignIn(false);
    // this.props.history.push('signup')
    let path = this.props.location.pathname;
    try {
      switch (path) {
        case '/buyer/signin':
          this.props.history.push('/buyer/signup');
          break;
        case '/supplier/signin':
          this.props.history.push('/supplier/signup');
          break;
        default:
          break;
      }
    } catch (error) {}
  }

  // validateData = e => {
  //   e.preventDefault();
  //   let _this = this;
  //   this.props.validate(function(error) {
  //     if (!error) {
  //       // _this.setState({ isLoading: true });
  //       _this.handleLogin(e);
  //     }
  //   });
  // };

  validateData = (e, actionType) => {
    this.applyValidation(actionType);
    e.preventDefault();
    let _this = this;
    this.props.validate(function(error) {
      if (!error) {
        if (actionType === 'forgotPassword') _this.handleForgotPassword();
        else _this.handleLogin(e);
      }
    });
  };

  applyValidation(actionType) {
    let _this = this;

    let fieldObject = {};
    let errorMessage = {};
    if (actionType === 'forgotPassword') {
      fieldObject = {
        email: 'required|email'
      };
      errorMessage = {
        'required.email': validationMessages.email.required,
        'email.email': validationMessages.email.invalid
      };
    } else {
      fieldObject = {
        userName: 'required|email',
        password: ['required', 'regex:' + regExpressions.passwordPattern]
      };
      errorMessage = {
        'required.userName': validationMessages.email.required,
        'email.userName': validationMessages.email.invalid,
        'required.password': validationMessages.password.required,
        'regex.password': validationMessages.password.passwordPattern
      };
    }
    this.validatorTypes = strategy.createInactiveSchema(
      fieldObject,
      errorMessage
    );
  }

  handleForgotPassword(e) {
    const email = this.state.email;
    const roleId = this.props.userInfo.userType === 'buyer' ? 1 : 2;
    let _this = this;
    //this.props.actionLoaderShow();
    this.props
      .actionForgotPassword({ email, roleId })
      .then((result, error) => {
        if (result.payload.data.status === 200) {
          this.setState({ show: false });
        }
      })
      .catch(e => _this.props.actionLoaderHide());
  }
  eyeClick() {
    let typePass = this.state.typePass;
    this.setState({ typePass: !typePass });
  }
  // eyeCrossClick() {
  //   this.setState({ typePass: 'password' });
  // }
  // handleSpaceFilter(value) {
  //   value = value.replace(/ /g, '');
  // }
  render() {
    return (
      <div className="centeredBox">
        <ToastContainer
          autoClose={3000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
        <div className="logo-area text-center">
          <img src={Logo} alt="" />
        </div>
        <form>
          <FormGroup
            // validationState={this.getValidationState("userName")}
            className="group"
          >
            <span className="ico-in">
              <svg>
                <use xlinkHref={`${Sprite}#userIco`} />
              </svg>
            </span>
            <FormControl
              type="text"
              value={this.state.userName}
              onChange={this.handleChange}
              onBlur={this.props.handleValidation('userName')}
              name="userName"
              required
            />
            <FormControl.Feedback />
            <span className="highlight" />
            <span className="bar" />
            {renderMessage(this.props.getValidationMessages('userName'))}
            <ControlLabel>Username</ControlLabel>
          </FormGroup>
          <FormGroup
            // validationState={this.getValidationState("password")}
            className="group m-b-0"
          >
            <span className="ico-in">
              <svg>
                <use xlinkHref={`${Sprite}#lockIco`} />
              </svg>
            </span>
            <FormControl
              type={this.state.typePass ? 'password' : 'text'}
              value={this.state.password}
              onChange={this.handleChange}
              onBlur={this.props.handleValidation('password')}
              name="password"
              required
            />
            <FormControl.Feedback />
            <span className="highlight" />
            <span className="bar" />
            {renderMessage(this.props.getValidationMessages('password'))}
            <ControlLabel>Password</ControlLabel>
            {this.state.typePass ? (
              <span
                className="ico-in eye-set cursor-pointer"
                onClick={this.eyeClick}
              >
                <svg>
                  <use xlinkHref={`${Sprite}#eyeIco`} />
                </svg>
              </span>
            ) : (
              <span
                className="ico-in eye-set cursor-pointer"
                onClick={this.eyeClick}
              >
                <svg>
                  <use xlinkHref={`${Sprite}#eyeCancelIco`} />
                </svg>
              </span>
            )}

            {/* <span className="ico-in eye-set">
              <svg>
                <use xlinkHref={`${Sprite}#plus-OIco`} />
              </svg>
            </span> */}
          </FormGroup>
          <p className="fg-pwd color-light">
            <span className="cursor-pointer" onClick={this.handleShow}>
              Forgot Password?
            </span>
          </p>
          <button
            className="btn btn-primary btn-block btn-md"
            onClick={event => this.validateData(event, 'login')}
          >
            LOG IN
          </button>
        </form>
        <div className="flex align-center brk">
          <hr />
          <span className="m-dot"> </span>
          <hr />
        </div>
        <p className="create-acc text-center">
          Create an account{' '}
          <a onClick={this.handleRegisterNavigation} className="cursor-pointer">
            REGISTER
          </a>
        </p>

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
                Reset your password by filling in your e-mail address. You will
                then receive an email with a link that will let you enter a new
                password.
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
                    onBlur={this.props.handleValidation('email')}
                    name="email"
                    required
                  />

                  <FormControl.Feedback />
                  <span className="highlight" />
                  <span className="bar" />
                  {renderMessage(this.props.getValidationMessages('email'))}
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
                  onClick={event => this.validateData(event, 'forgotPassword')}
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
SignIn = validation(strategy)(SignIn);
export default SignIn;
