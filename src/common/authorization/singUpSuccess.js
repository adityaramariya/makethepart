import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Sprite from "../../img/sprite.svg";
import Logo from "../../img/logo.png";
import { makeThePartApiService } from "../core/api/apiService";
import { actionUserLogin } from "../core/redux/actions";
import { stat } from "fs";
// import { connect } from 'http2';

class SignUpSuccess extends Component {
  constructor(props) {
    super(props);

    this.handleNavigation = this.handleNavigation.bind(this);
  }

  handleNavigation(pathname) {
    this.props.history.push(pathname);
  }

  render() {
    return (
      <div className="centeredBox">
        <div className="logo-area text-center">
          <img src={Logo} alt="" />
        </div>

        <form>
          <FormGroup className="group">
            OTP sent to the mobile number and on email ID, please verify to
            activate the account.
          </FormGroup>
        </form>
        <div className="flex align-center brk">
          <hr />
          <span className="m-dot"> </span>
          <hr />
        </div>
        <p className="create-acc text-center cursor-pointer">
          I have an account{" "}
          <a onClick={() => this.handleNavigation("signin")}>LOGIN</a>
        </p>

        <p className="create-acc text-center cursor-pointer">
          Create an account{" "}
          <a onClick={() => this.handleNavigation("signup")}>REGISTER</a>
        </p>
      </div>
    );
  }
}

export default SignUpSuccess;
