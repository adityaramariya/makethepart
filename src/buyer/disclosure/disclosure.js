import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Table,
  Modal,
  Pagination
} from "react-bootstrap";
import Sprite from "../../img/sprite.svg";

import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetDiscloserData,
  actionApproveRejectNonDiscloser
} from "../../common/core/redux/actions";
import { showSuccessToast } from "../../common/commonFunctions";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import Footer from "../common/footer";
import CONSTANTS from "../../common/core/config/appConfig";
import { handlePermission } from "../../common/permissions";
let { permissionConstant } = CONSTANTS;
class Disclosure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "eighth",
      comment: "",
      showApprovedText: false,
      showRejectedText: false
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.approveRejectNonDiscloser = this.approveRejectNonDiscloser.bind(this);
    this.commentModal = this.commentModal.bind(this);
    this.handleCommentClose = this.handleCommentClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id || "",
      roleId: this.props.userInfo.userData.userRole || ""
    };
    this.props.actionLoaderShow();
    this.props
      .actionGetDiscloserData(data)
      .then((result, error) => {
        this.setState({ discloserData: result.payload.data.resourceData });
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

  commentModal(data, item) {
    if (item) {
      this.setState({
        showCommentModal: true,
        approvalId: item.id,
        supplierId:
          item.supplierUserDetailResponse && item.supplierUserDetailResponse.id
      });
    }
    // if (item.currentStatus === 'approved') {
    //   this.setState({ showApprovedText: true, showRejectedText: false });
    // } else if (item.currentStatus === 'declined') {
    //   this.setState({ showApprovedText: false, showRejectedText: true });
    // } else {
    if (data === "approved") {
      this.setState({
        showResendButton: false,
        showApproveButton: true,
        showApproveModal: false,
        showCommentModal: true
      });
    } else {
      this.setState({
        showResendButton: true,
        showApproveButton: false,
        showApproveModal: false,
        showCommentModal: true
      });
      // }
    }
  }

  approveRejectNonDiscloser(item) {
    let _this = this;
    let status = "";
    let data = "";
    if (item === "approved") {
      status = "approved";
    } else {
      status = "declined";
    }
    this.setState({ showCommentModal: false });
    data = {
      userId: this.props.userInfo.userData.id || "",
      roleId: this.props.userInfo.userData.userRole || "",
      approvalId: this.state.approvalId,
      comments: this.state.comments,
      status: status,
      supplierUserId: this.state.supplierId
    };

    this.props.actionLoaderShow();
    this.props
      .actionApproveRejectNonDiscloser(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleCommentClose() {
    this.setState({ showCommentModal: false });
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
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKeyAction={this.activeTabKeyAction}
          activeTabKey={this.state.tabKey === "eighth" ? "eighth" : "none"}
        />
        {this.state.tabKey === "eighth" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <h4 className="hero-title text-uppercase">
                  APPROVE NON-DISCLOSURE AGREEMENT FOR NEW SUPPLIER
                </h4>

                <div>
                  <Table bordered responsive className="custom-table">
                    <thead>
                      <tr>
                        {/* <th>Part ID</th>
                        <th>Part Number</th> */}
                        {/* <th>Supplier code</th> */}
                        <th>Supplier Name</th>
                        <th>Manufacturing Location</th>
                        <th>Star Rating</th>
                        <th>Review NDA</th>
                        <th>Review Supplier</th>
                        <th>Approve NDA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.discloserData &&
                        this.state.discloserData.map((item, index) => {
                          return (
                            <tr>
                              {/* <td>ffff</td>
                          <td> bbb</td> */}
                              {/* <td>ffff</td> */}
                              <td> {item.supplierResponse.companyName}</td>
                              <td>
                                {item.supplierResponse &&
                                  item.supplierResponse.addresseResponse &&
                                  item.supplierResponse.addresseResponse[0] &&
                                  item.supplierResponse.addresseResponse[0]
                                    .address}
                                ,{" "}
                                {item.supplierResponse &&
                                  item.supplierResponse.addresseResponse &&
                                  item.supplierResponse.addresseResponse[0] &&
                                  item.supplierResponse.addresseResponse[0]
                                    .state}
                                ,{" "}
                                {item.supplierResponse &&
                                  item.supplierResponse.addresseResponse &&
                                  item.supplierResponse.addresseResponse[0] &&
                                  item.supplierResponse.addresseResponse[0]
                                    .country}
                              </td>
                              <td>*****</td>
                              <td>
                                <button className="btn btn-primary text-uppercase">
                                  Review NDA
                                </button>
                              </td>
                              <td>
                                {" "}
                                <Link
                                  to={{
                                    pathname: "/buyer/reviewSupplier",
                                    state: { data: item }
                                  }}
                                  className="btn btn-info text-uppercase"
                                >
                                  Review supplier
                                </Link>
                              </td>
                              <td>
                                {item.currentStatus === "approved" ? (
                                  <button className="btn-hollow text-success fill-green p-e-none">
                                    <span className="ico-right cursor-pointer">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#rightIco`} />
                                      </svg>
                                    </span>
                                    Approved
                                  </button>
                                ) : item.currentStatus === "declined" ? null : (
                                  <button
                                    className="btn-hollow text-success fill-green"
                                    onClick={() => {
                                      this.commentModal("approved", item);
                                    }}
                                  >
                                    <span className="ico-right cursor-pointer">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#rightIco`} />
                                      </svg>
                                    </span>
                                    Approve
                                  </button>
                                )}
                                {item.currentStatus === "declined" ? (
                                  <button className="btn-hollow text-danger">
                                    <span className="cross">&#10005;</span>{" "}
                                    Declined
                                  </button>
                                ) : item.currentStatus === "approved" ? null : (
                                  <button
                                    className="btn-hollow text-danger p-e-none"
                                    onClick={() => {
                                      this.commentModal("declined", item);
                                    }}
                                  >
                                    <span className="cross">&#10005;</span>{" "}
                                    Decline
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>

                {/* <div className="text-center">
                  <Pagination className="paginationWrapper">
                    <Pagination.First />
                    <Pagination.Prev />
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Ellipsis />

                    <Pagination.Item>{10}</Pagination.Item>
                    <Pagination.Item>{11}</Pagination.Item>
                    <Pagination.Item active>{12}</Pagination.Item>
                    <Pagination.Item>{13}</Pagination.Item>
                    <Pagination.Item disabled>{14}</Pagination.Item>

                    <Pagination.Ellipsis />
                    <Pagination.Item>{20}</Pagination.Item>
                    <Pagination.Next />
                    <Pagination.Last />
                  </Pagination>
                </div> */}
              </div>
            </div>
            <div>
              <Modal
                show={this.state.showCommentModal}
                onHide={this.handleCommentClose}
                className="custom-popUp"
                bsSize="small"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <FormGroup controlId="formControlsTextarea">
                    <ControlLabel>Comment</ControlLabel>
                    <FormControl
                      componentClass="textarea"
                      placeholder="Comment"
                      value={this.state.comments}
                      onChange={this.handleChange}
                      name="comments"
                      required
                    />
                  </FormGroup>

                  <center>
                    <button
                      className={`btn btn-default ${
                        this.state.showApproveButton ? "" : "hide"
                      }`}
                      onClick={() => {
                        this.approveRejectNonDiscloser("approved");
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className={`btn btn-default ${
                        this.state.showResendButton ? "" : "hide"
                      }`}
                      onClick={() => {
                        this.approveRejectNonDiscloser("declined");
                      }}
                    >
                      Decline
                    </button>
                  </center>
                </Modal.Body>
              </Modal>
            </div>
            <Footer
              pageTitle={permissionConstant.footer_title.non_disclosure}
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
      actionGetDiscloserData,
      actionApproveRejectNonDiscloser
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User,
    supplierParts: state.supplierParts
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Disclosure);
