import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Nav,
  NavItem,
  Navbar,
  MenuItem,
  NavDropdown,
  FormGroup,
  FormControl,
  Modal
} from 'react-bootstrap';

import { topPosition, showErrorToast } from '../../common/commonFunctions';

import Images from '../../img/logo.png';
import duserImage from '../../img/profile.svg';
import Sprite from '../../img/sprite.svg';
import * as moment from 'moment';

import {
  actionLoaderShow,
  actionLoaderHide,
  actionUserLogout,
  actionGetPartDetailsByPartNumber
} from '../../common/core/redux/actions';
import { handlePermission } from '../../common/permissions';
import CONSTANTS from '../../common/core/config/appConfig';
import CommonHeader from '../../common/socketClient';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ToastContainer } from 'react-toastify';
import { ZoomInAndOut } from '../../common/commonFunctions';

let { customConstant, permissionConstant } = CONSTANTS;
const perPageSize = 5;
class SupplierHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchByPart: '',
      profilePhotoURL: ''
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleSerchPart = this.handleSerchPart.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (
      this.props.userInfo &&
      this.props.userInfo.userData &&
      this.props.userInfo.userData.profilePhotoURL
    ) {
      let profilePhotoURL = this.props.userInfo.userData.profilePhotoURL;
      this.setState({
        profilePhotoURL: profilePhotoURL
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let profilePhotoURL = this.props.userInfo.userData.profilePhotoURL;
    this.setState({
      profilePhotoURL: profilePhotoURL
    });
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

  handleSerchPart(event) {
    let _this = this;
    if (event.key === 'Enter') {
      let data = {
        userId: this.props.userInfo.userData.id || '',
        roleId: this.props.userInfo.userData.userRole || '',
        partNumber: event.target.value
      };

      this.props
        .actionGetPartDetailsByPartNumber(data)
        .then((result, error) => {
          if (result.payload.data.resourceData) {
            if (result.payload.data.resourceData.id) {
              _this.props.history.push({
                pathname: '/buyer/reviewPOApproval',
                state: {
                  partId: result.payload.data.resourceData.id,
                  projectId: result.payload.data.resourceData.projectResponse.id
                }
              });
            }
          }
          //_this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  }
  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
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
                <img src={Images} />
              </Link>
              {/* <a >
                    <img src={Images} />
                  </a> */}
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <li>
                <div className="top-search">
                  <FormGroup>
                    <FormControl
                      type="text"
                      name="searchByPart"
                      className="orange"
                      value={this.state.searchByPart}
                      placeholder="Search..."
                      onKeyUp={this.handleSerchPart}
                      onChange={e => this.handleChange(e)}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </div>
              </li>
            </Nav>
            <Nav pullRight>
              {handlePermission(
                this.props.userInfo.userData.permissions,
                permissionConstant.pages.add_user
              ) ? (
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
              ) : null}
              {/* <NavItem eventKey={1} href="#">
                <span className="ico-nav">
                  <svg>
                    <use xlinkHref={`${Sprite}#calanderIco`} />
                  </svg>
                </span>
              </NavItem> */}
              <NavItem eventKey={1}>
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
              {/* <NavItem eventKey={1}>
                <span className="noti-dot" />
                <span className="ico-nav">
                  <svg>
                    <use xlinkHref={`${Sprite}#bellIco`} />
                  </svg>
                </span>
              </NavItem> */}
              <CommonHeader {...this.props} />


          
  
        <NavItem eventKey={2} id="user-dd" className="dropcustomscroll"> 
                <NavDropdown
                  eventKey={3}
                  title={
                    <div className="flex align-center">
                      <span className="userName">
                 
                      </span>
                      <div className="avtar2">
                   <span className="ico-nav">
                          <svg>
                            <use xlinkHref={`${Sprite}#utiliesIco`} />
                          </svg>
                        </span>
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
                  {/* <MenuItem eventKey={3.1}>Profile</MenuItem> */}
                   <MenuItem>Taxi Booking</MenuItem>
                   <MenuItem>Conference Room Booking</MenuItem>
                    <MenuItem>Office Supplies</MenuItem>
                    <MenuItem>Travel/Tour Request</MenuItem>
                   <MenuItem>Travel Expense</MenuItem>
                    <MenuItem>Stationary Request</MenuItem>
                   <MenuItem>IT Helpdesk</MenuItem>
                   <MenuItem>Software Access</MenuItem>
                   <MenuItem>Uniform/Branded Mechandise</MenuItem>
                    <MenuItem>Visitor Entry</MenuItem>
                   <MenuItem>Material Movement</MenuItem>
                   <MenuItem>Office Phone</MenuItem>
              
                </NavDropdown>
              </NavItem>


              <NavItem className="prwrap" eventKey={2} id="user-dd" className="dropcustomscroll">
                <NavDropdown
                  eventKey={3}
                  title={
                    <div className="flex align-center">
                      <span className="userName">
                        {this.props.userInfo.userData.fullname}
                      </span>
                      <div className="avtar">
                        <img
                          src={
                            this.props.userInfo.userData &&
                            this.props.userInfo.userData.profilePhotoURL
                              ? customConstant.amazonURL +
                                this.state.profilePhotoURL
                              : duserImage
                          }
                          alt="Image"
                        />
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
                  {/* <MenuItem eventKey={3.1}>Profile</MenuItem> */}
                  <li eventKey={3.1}>
                    <Link eventKey={3.5} to="userProfile">
                      Profile
                    </Link>
                  </li>
                  {handlePermission(
                    this.props.userInfo.userData.permissions,
                    permissionConstant.pages.edit_user
                  ) ? (
                    <li eventKey={3.1}>
                      <Link eventKey={3.5} to="editUser">
                        Edit Users
                      </Link>
                    </li>
                  ) : null}
                 
                   <MenuItem>Residental Address</MenuItem>
                   <MenuItem>Family Details</MenuItem>
                    <MenuItem>Attendance</MenuItem>
                    <MenuItem>Payslip</MenuItem>
                   <MenuItem>Company Residental</MenuItem>
                    <MenuItem>Tax Documentation</MenuItem>
                   <MenuItem>Leave Application</MenuItem>
                   <MenuItem>Lunch Coupons</MenuItem>


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
      actionUserLogout,
      actionGetPartDetailsByPartNumber
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
