import React, { Component } from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Nav, NavItem, Navbar, MenuItem, NavDropdown } from "react-bootstrap";

import Images from "../../img/logo.png";
import Sprite from "../../img/sprite.svg";
import duserImage from "../../img/profile.svg";
import {
  actionLoaderShow,
  actionLoaderHide,
  actionUserLogout
} from "../../common/core/redux/actions";
import { ToastContainer } from "react-toastify";
import {ZoomInAndOut} from '../../common/commonFunctions';


import CommonHeader from "../../common/socketClient";

class SupplierHeader extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    let _this = this;
    this.props.actionLoaderShow();
    this.props
      .actionUserLogout()
      .then((result, error) => {
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  render() {
    return (
      <div className="mj-nav">
      <ToastContainer
        autoClose={3000}
        className="custom-toaster-main-cls"
        toastClassName="custom-toaster-bg"
        transition={ZoomInAndOut}
      />
        <Navbar inverse collapseOnSelect fixedTop fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="home">
                <img src={Images} alt="" />
              </Link>
              {/* <a >
                    <img src={Images} />
                  </a> */}
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.props.userInfo.userData.isAdmin ? (
                <NavItem eventKey={1} className="a-u-wrap">
                  <Link to="addUser">
                    <span className="add-user">
                      <span className="ico-nav">
                        <svg>
                          <use xlinkHref={`${Sprite}#addUserIco`} />
                        </svg>
                      </span>
                    </span>
                  </Link>
                </NavItem>
              ) : (
                ""
              )}
              {/* <NavItem eventKey={1} href="#">
                <span className="ico-nav">
                  <svg>
                    <use xlinkHref={`${Sprite}#calanderIco`} />
                  </svg>
                </span>
              </NavItem> */}
              <NavItem eventKey={1} href="#">
                <span className="ico-nav">
                  <svg>
                    <use xlinkHref={`${Sprite}#chatIco`} />
                  </svg>
                </span>
              </NavItem>
              {/* <NavItem eventKey={1} href="#">
                <span className="ico-nav">
                  <svg>
                    <use xlinkHref={`${Sprite}#settingIco`} />
                  </svg>
                </span>
              </NavItem> */}

              {/* <NavItem eventKey={1} href="#">
                <span className="noti-dot" />
                <span className="ico-nav">
                  <svg>
                    <use xlinkHref={`${Sprite}#bellIco`} />
                  </svg>
                </span>
              </NavItem> */}
              

              <CommonHeader {...this.props} />

              <NavItem eventKey={2} href="#" id="user-dd">
                <NavDropdown
                  eventKey={3}
                  title={
                    <div className="flex align-center">
                      <span className="userName">
                        {this.props.userInfo.userData.fullname}
                      </span>
                      <div className="avtar">
                        <img src={duserImage} alt="" />
                      </div>
                    </div>
                  }
                  id="basic-nav-dropdown"
                >
                  {/* <MenuItem
                    eventKey={3.0}
                    onClick={() => this.props.history.push("adduser")}
                  >
                    Add User
                  </MenuItem> */}
                  <li eventKey={3.1}>
                    <Link eventKey={3.5} to="userProfile">
                      Profile
                    </Link>
                  </li>
                  <li eventKey={3.1}>
                    {this.props.userInfo.userData.isAdmin ? (
                      <Link eventKey={3.5} to="editUser">
                        Edit Users
                      </Link>
                    ) : (
                      ""
                    )}
                  </li>
                  <MenuItem eventKey={3.2}>Privacy & Policy</MenuItem>
                  <MenuItem eventKey={3.3}>Terms & Condition</MenuItem>
                  <MenuItem eventKey={3.3} onClick={this.handleLogout}>
                    Logout
                  </MenuItem>
                </NavDropdown>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionLoaderShow,
      actionLoaderHide,
      actionUserLogout
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
)(SupplierHeader);
