import React, { Component } from 'react';
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

import duserImage from '../img/profile.svg';
import Sprite from '../img/sprite.svg';
import * as moment from 'moment';

import {
  actionLoaderShow,
  actionLoaderHide,
  actionPartNotification,
  sendNotification,
  actionDeleteNotification,
  actionReadNotification
} from '../common/core/redux/actions';
import CONSTANTS from '../common/core/config/appConfig';
import socketIOClient from 'socket.io-client';
import InfiniteScroll from 'react-infinite-scroll-component';

let { customConstant, permissionConstant } = CONSTANTS;
let socket;
const perPageSize = 5;
class CommonHeader extends Component {
  constructor(props) {
    super(props);
    socket = socketIOClient.connect('103.76.253.133:5000/');
    window.socket = socket;
    this.state = {
      searchByPart: '',
      notificationData: [],
      // notificationData: Array.from({ length: 3 }),
      hasMore: true,
      pageCount: 1,
      isPageCount: false,
      openDropDown: false
    };

    this.getPartNotification = this.getPartNotification.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDeleteNotification = this.handleDeleteNotification.bind(this);
    this.readNotification = this.readNotification.bind(this);
  }

  componentDidMount() {
    console.log('aaaaaaa');
    socket.on('new-message', data => {
      console.log('bbbbbbbb');
      if (data && data.notificationId && data.notificationId.length > 0) {
        this.getPartNotification();
        let existsNotiId = data.notificationId.indexOf(
          this.props.userInfo.userData.id
        );
        if (existsNotiId == -1) {
          this.props.sendNotification(data.notificationCount);
          this.setState({
            notificationDataLength: 0
          });
        } else {
          this.props.sendNotification(data.notificationCount);
          this.setState({
            notificationDataLength: data.notificationCount
          });
        }
      }
    });
  }

  componentWillMount() {
    this.getPartNotification();
  }

  /** Get Notification  */
  getPartNotification(e) {
    // window.scrollTo(0, 0);aa
    let _this = this;
    let pageCount = 1;
    this.setState({
      pageCount: pageCount,
      notificationData: [],
      isPageCount: false
    });
    let data = {
      userId: this.props.userInfo.userData.id || '',
      roleId: this.props.userInfo.userData.userRole || '',
      pageNumber: 1,
      pageSize: perPageSize
    };
    this.props
      .actionPartNotification(data)
      .then((result, error) => {
        if (result.payload.data.resourceData.listOfNotification.length > 0) {
          let notificationResponse =
            result.payload.data.resourceData.notificationCount;
          _this.props.sendNotification(notificationResponse);
          let dataList = result.payload.data.resourceData.listOfNotification;
          if (_this.state.pageCount == 1) {
            _this.setState({
              notificationData: dataList,
              notificationDataLength:
                result.payload.data.resourceData.notificationCount,
              isPageCount: true
            });
          }
          _this.props.actionLoaderHide();
        } else {
          _this.setState({
            notificationDataLength: 0
          });
        }
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  clearAllNotification() {
    this.setState({
      clearNotificationModal: true
    });
  }

  handleClose() {
    this.setState({
      clearNotificationModal: false
    });
  }

  handleDeleteNotification(event, item, index) {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id || '',
      roleId: this.props.userInfo.userData.userRole || ''
    };
    this.props.actionLoaderShow();
    this.props
      .actionDeleteNotification(data)
      .then((result, error) => {
        if (result.payload.data.status === 200) {
          this.setState({
            notificationDataLength: 0
          });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
    this.setState({ clearNotificationModal: false });
  }

  readNotification(nid) {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id || '',
      roleId: this.props.userInfo.userData.userRole || '',
      listOfNotificationIds: [nid]
    };
    this.props.actionLoaderShow();
    this.props
      .actionReadNotification(data)
      .then((result, error) => {
        if (result.payload.data.status === 200) {
          if (this.props.userInfo.userData.userRole == 1) {
            _this.props.history.push('/buyer/pendinApproval');
          } else {
            _this.props.history.push('/supplier/home', { state: 'third' });
          }

          _this.setState({
            notificationDataLength:
              result.payload.data.resourceData.notificationCount
          });
          //this.getPartNotification();
          this.setState({ openDropDown: false });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  fetchMoreData = () => {
    let _this = this;
    if (
      this.state.notificationData.length >= this.state.notificationDataLength
    ) {
      this.setState({ hasMore: false });
      return;
    }

    if (this.state.isPageCount == true) {
      let pageCount = this.state.pageCount;
      let IncreasePageCount = pageCount + 1;
      this.setState({ pageCount: IncreasePageCount });

      let data = {
        userId: this.props.userInfo.userData.id || '',
        roleId: this.props.userInfo.userData.userRole || '',
        pageNumber: this.state.pageCount,
        pageSize: perPageSize
      };

      _this.props
        .actionPartNotification(data)
        .then((result, error) => {
          if (result.payload.data.resourceData.listOfNotification.length > 0) {
            let notificationResponse =
              result.payload.data.resourceData.notificationCount;
            _this.props.sendNotification(notificationResponse);
            let dataList = result.payload.data.resourceData.listOfNotification;
            if (_this.state.pageCount > 1) {
              let notificationData = _this.state.notificationData;
              let concatData = notificationData.concat(dataList);
              setTimeout(() => {
                _this.setState({
                  notificationData: concatData,
                  notificationDataLength:
                    result.payload.data.resourceData.notificationCount
                });
              }, 1000);
            }
            _this.props.actionLoaderHide();
          }
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  };

  toggleDropD = () => {
    this.setState({ openDropDown: !this.state.openDropDown });
  };

  render() {
    let dropDownToggle = this.state.openDropDown;
    return (
      <NavDropdown
        id="soketClient"
        open={this.state.openDropDown}
        onToggle={this.toggleDropD}
        disabled={this.state.notificationDataLength == 0}
        eventKey={1}
        className="noti-dd"
        title={
          <div
            onClick={e => {
              this.getPartNotification(e);
              this.setState({ openDropDown: !dropDownToggle });
            }}
          >
            <span
              className={
                this.state.notificationDataLength == 0
                  ? 'noti-dot'
                  : 'noti-dot active'
              }
            >
              {this.state.notificationDataLength}
            </span>
            <span className="ico-nav">
              <svg>
                <use xlinkHref={`${Sprite}#bellIco`} />
              </svg>
            </span>
          </div>
        }
      >
        <div className="notification-list" style={{ overflow: 'hidden' }}>
          <li className="flex justify-space-between cursor-pointer">
            <span className="nt-h">Notification</span>{' '}
            <span
              className="clr-btn"
              onClick={event => this.clearAllNotification(event)}
            >
              Clear All
            </span>
          </li>
          <MenuItem>
            <InfiniteScroll
              dataLength={this.state.notificationData.length}
              next={this.fetchMoreData}
              hasMore={this.state.hasMore}
              loader={<h4>Loading...</h4>}
              height={250}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              {this.state.notificationData &&
                this.state.notificationData.map((item, index) => {
                  return (
                    //<Link to="pendinApproval">
                    <div
                      className="notification-wrapper flex"
                      onClick={() => {
                        this.readNotification(item.id);
                      }}
                    >
                      <div className="nt-img">
                        <img
                          src={
                            item.fromUserRes &&
                            item.fromUserRes.profileImageThumbnailUrl
                              ? item.fromUserRes.profileImageThumbnailUrl
                              : duserImage
                          }
                          alt="Image"
                        />
                      </div>
                      <div className="user-info flex-1">
                        <h5 className="m-0 fs-12 fw-600 text-ellipsis w-220">
                          {item.fromUserRes.fullName}
                        </h5>
                        <small className="color-light text-ellipsis w-220 d-inline">
                          {item &&
                            item.createdTimestamp &&
                            moment(item.lastUpdatedTimestamp).format(
                              'DD/MM/YYYY'
                            )}
                        </small>
                        <p className="nt-message ">{item && item.content}</p>
                      </div>
                    </div>
                    //</Link>
                  );
                })}
            </InfiniteScroll>
          </MenuItem>

          <Modal
            show={this.state.clearNotificationModal}
            onHide={this.handleClose}
            className="custom-popUp confirmation-box"
            bsSize="small"
          >
            <Modal.Body>
              <div className="">
                <h5 className="text-center">
                  Are you sure you want to delete this notification?
                </h5>
                <div className="text-center">
                  <button
                    className="btn btn-default text-uppercase sm-btn"
                    onClick={event => this.handleDeleteNotification(event)}
                  >
                    Continue
                  </button>
                  <button
                    className="btn btn-success text-uppercase sm-btn"
                    onClick={this.handleClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </NavDropdown>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionLoaderShow,
      actionLoaderHide,
      actionPartNotification,
      sendNotification,
      actionDeleteNotification,
      actionReadNotification
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
)(CommonHeader);
