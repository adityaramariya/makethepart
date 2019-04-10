import React, { Component } from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
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
import validation from "react-validation-mixin";
import strategy, { validator } from "react-validatorjs-strategy";
import Header from "../common/header";
import {
  actionGetApproverList,
  actionUserLogout,
  actionGenerateOTPToAddUser,
  actionSupplierAddUser,
  actionLoaderHide,
  actionLoaderShow
} from "../../common/core/redux/actions";
import AddUserCommon from "../../common/users/addUser";
import partImage from "../../img/part.jpg";
import Sprite from "../../img/sprite.svg";
import sideBar from "../common/sideBar";
import SideBar from "../common/sideBar";
import xlsImage from "../../img/xls.png";
import pdfImage from "../../img/pdf.png";
import docImage from "../../img/doc.png";
import customConstant from "../../common/core/constants/customConstant";
class AddUser extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleLogout() {
    try {
      const roleId = this.props.userInfo.userData.userRole;
      const userId = this.props.userInfo.userData.id;
      this.props.actionUserLogout({ roleId, userId });
    } catch (error) {}
  }

  render() {
    return (
      <div>
        <section className="">
          <Header {...this.props} />
          <SideBar />
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <h4 className="hero-title">Edit Profile</h4>

                <div>
                  <Table bordered responsive className="custom-table">
                    <thead>
                      <tr>
                        <th className="text-uppercase">Name</th>
                        <th className="text-uppercase">Email</th>
                        <th className="text-uppercase">User profile</th>
                        <th className="text-uppercase">mobile number</th>
                        <th className="text-uppercase">user type</th>
                        <th className="text-uppercase">Selected approver</th>
                        <th> </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>sdfgfd</td>
                        <td>sdfgfd</td>
                        <td>sdfgfd</td>
                        <td>sdfgfd</td>
                        <td>sdfgfd</td>
                        <td>sdfgfd</td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-task btn btn-task"
                            onClick={this.handleShow}
                          >
                            <span className="ico-action ">
                              <svg>
                                <use xlinkHref={`${Sprite}#editIco`} />
                              </svg>
                            </span>
                            <span className="ico-txt">EDIT</span>
                          </button>
                          <button className="btn btn-task btn btn-task">
                            <span className="ico-action ">
                              <svg>
                                <use xlinkHref={`${Sprite}#deleteIco`} />
                              </svg>
                            </span>
                            <span className="ico-txt">DELETE</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          className="custom-popUp modal-xl"
        >
          <Modal.Body>
            <h4 className="hero-title m-b-30">Edit Part</h4>

            <Row className="show-grid m-t-40">
              <Col md={5} mdOffset={3}>
                <div className="edit-pro">
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Edit Project</ControlLabel>
                  </FormGroup>
                </div>
              </Col>
            </Row>

            <h4 className="hero-title">Edit Files </h4>
            <Row className="show-grid center-gap">
              <Col md={6}>
                {/* <h4 className="hero-title">Upload Designs </h4> */}
                <div className="gray-card dash-border up-padd">
                  <ul className="upload-list b-btm">
                    {this.state.uploadedDesignList &&
                      this.state.uploadedDesignList.map((designItem, index) => {
                        return (
                          <li className="flex justify-space-between align-center">
                            <span>
                              <img
                                src={
                                  customConstant.amazonURL + designItem.mediaURL
                                }
                              />
                              {designItem.mediaName}
                            </span>

                            <span
                              className="ico-delete cursor-pointer"
                              onClick={e =>
                                this.deleteDesign(
                                  e,
                                  index,
                                  designItem.mediaName
                                )
                              }
                            >
                              <svg>
                                <use xlinkHref={`${Sprite}#deleteIco`} />
                              </svg>
                            </span>
                          </li>
                        );
                      })}
                  </ul>

                  <div className="text-center">
                    <div className="upload-btn cursor-pointer text-uppercase">
                      <span className="ico-upload w-full">
                        <svg>
                          <use xlinkHref={`${Sprite}#upload1Ico`} />
                        </svg>
                      </span>
                      upload Designs
                      <FormControl
                        id="formControlsFile"
                        multiple
                        type="file"
                        label="File"
                        accept="image/jpeg, image/png, image/gif, video/mp4, video/webm"
                        onChange={this.handleUploadDesign}
                        disabled={this.state.selectedProjectId == ""}
                        // help="Example block-level help text here."
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center m-t-20">
                  <button
                    className="btn btn-success text-uppercase sm-btn"
                    onClick={() => {
                      this.addPartConfirmation("designs");
                    }}
                    disabled={this.state.selectedProjectId == ""}
                  >
                    add Designs
                  </button>
                </div>
              </Col>
              <Col md={6}>
                {/* <h4 className="hero-title">Upload Specifications</h4> */}
                <div className="gray-card up-padd dash-border">
                  <ul className="upload-list b-btm">
                    {this.state.uploadedSpecificationList &&
                      this.state.uploadedSpecificationList.map(
                        (designItem, index) => {
                          return (
                            <li className="flex justify-space-between align-center">
                              <span>
                                {designItem.mediaType ===
                                  "application/octet-stream" ||
                                designItem.mediaType ===
                                  "application/vnd.ms-excel" ? (
                                  <img src={xlsImage} />
                                ) : designItem.mediaType ===
                                "application/pdf" ? (
                                  <img src={pdfImage} />
                                ) : (
                                  <img src={docImage} />
                                )}
                                {designItem.mediaName}
                              </span>

                              <span
                                className="ico-delete cursor-pointer"
                                onClick={e =>
                                  this.deleteSpecification(
                                    e,
                                    index,
                                    designItem.mediaName
                                  )
                                }
                              >
                                <svg>
                                  <use xlinkHref={`${Sprite}#deleteIco`} />
                                </svg>
                              </span>
                            </li>
                          );
                        }
                      )}
                  </ul>

                  <div className="text-center">
                    <div className="upload-btn cursor-pointer text-uppercase">
                      <span className="ico-upload w-full">
                        <svg>
                          <use xlinkHref={`${Sprite}#upload1Ico`} />
                        </svg>
                      </span>
                      upload Specifications
                      <FormControl
                        id="formControlsFile"
                        multiple
                        type="file"
                        label="File"
                        accept=".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
                        onChange={this.handleUploadSpecification}
                        disabled={this.state.selectedDesigns == ""}
                        // help="Example block-level help text here."
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center m-t-20 m-b-20">
                  <button
                    className="btn btn-success text-uppercase sm-btn"
                    onClick={() => {
                      this.addPartConfirmation("specification");
                    }}
                    disabled={this.state.selectedDesigns == ""}
                  >
                    add specification
                  </button>
                </div>
              </Col>
            </Row>
            <h4 className="hero-title">Edit Part Details </h4>
            <div className="style-form m-t-40">
              <Row className="show-grid">
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Part Description</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Specification</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Part Revision Number</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Approver</ControlLabel>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="show-grid">
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Supplier</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Quantity</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Units</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Usage</ControlLabel>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="show-grid">
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Commodity</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Delivery Address</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Delivery State</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Delivery Country</ControlLabel>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="show-grid">
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Packing/Delivery Condition</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Target Date</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Proto/Production</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Shipment 1 Qty</ControlLabel>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="show-grid">
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Shipment 1 Target Date</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Shipment 2 Qty</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Shipment 2 Target Date</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Shipment 3 Qty</ControlLabel>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="show-grid">
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Shipment 3 Target Date</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Shipment 4 Qty</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Shipment 4 Target Date</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="group ">
                    <FormControl type="text" name="userName" required />
                    <FormControl.Feedback />

                    <ControlLabel>Shipment 4 Target Date</ControlLabel>
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <div className="text-center m-b-20">
              <button className="btn btn-default text-uppercase">Save</button>
              <button
                className="btn btn-success text-uppercase"
                onClick={this.handleClose}
              >
                Cancel
              </button>
            </div>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer> */}
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionGetApproverList,
      actionUserLogout,
      actionGenerateOTPToAddUser,
      actionSupplierAddUser,
      actionLoaderHide,
      actionLoaderShow
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User,
    supplierUsers: state.supplierUsers
  };
};

AddUser = validation(strategy)(AddUser);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUser);
