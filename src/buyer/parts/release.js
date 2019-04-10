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
  Pagination,
  Row,
  Col,
  Popover,
  OverlayTrigger,
  Tab,
  Nav,
  NavItem,
  Button,
  DropdownButton,
  Panel,
  MenuItem
} from "react-bootstrap";
import Sprite from "../../img/sprite.svg";
import Slider from "react-slick";
import partImage from "../../img/part.jpg";
import boltImage from "../../img/newnut.jpeg";
import boltImage1 from "../../img/newnut.jpg";
import User from "../../img/user.jpg";
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
      tabKey: "fifth",
      comment: "",
      showApprovedText: false,
      showRejectedText: false,
      nav1: null,
      nav2: null,
      show: false,
      show1: false
    };
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === "first") this.props.history.push("home");
    if (tabKey === "third")
      this.props.history.push({ pathname: "home", state: { path: "third" } });

    this.setState({ tabKey: tabKey });
  }
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleClose() {
    this.setState({ show1: false });
  }

  handleShow() {
    this.setState({ show1: true });
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === "fifth" ? "fifth" : "none"}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === "fifth" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <h4 className="hero-title">Release PO</h4>
                <Row>
                  <Col md={8}>
                    <div className="p-20 border-around border-light m-b-20">
                      <Table className="custom-table no-border-table">
                        <tbody>
                          <tr>
                            <td className="color-light w-175">Part Name :</td>
                            <td>newnut</td>
                          </tr>
                          <tr>
                            <td className="color-light w-175">
                              Part Discription :
                            </td>
                            <td>nut used in bus</td>
                          </tr>
                          <tr>
                            <td className="color-light w-175">
                              Project code :
                            </td>
                            <td>Nut</td>
                          </tr>
                        </tbody>
                      </Table>
                      <hr />
                      <h4 className="hero-title">
                        Part Sent for RFQ and Quotation Record
                      </h4>
                      <Table className="custom-table no-border-table">
                        <tbody>
                          <tr>
                            <td className="color-light w-175">Part Name :</td>
                            <td>newnut</td>
                          </tr>
                          <tr>
                            <td className="color-light w-175">
                              Part Discription :
                            </td>
                            <td>nut used in bus</td>
                          </tr>
                          <tr>
                            <td className="color-light w-175">Revision :</td>
                            <td />
                          </tr>
                        </tbody>
                      </Table>

                      <Button
                        bsStyle="primary"
                        bsSize="large"
                        onClick={this.handleShow}
                        className="text-uppercase"
                      >
                        release po on this release
                      </Button>

                      {/* <Link
                        to="ReleasePO"
                        className="btn btn-primary text-uppercase"
                      >
                        release po on this release
                      </Link> */}
                      <hr />
                      <h4 className="hero-title">Latest Release</h4>
                      <Table className="custom-table no-border-table">
                        <tbody>
                          <tr>
                            <td className="color-light w-175">Part Name :</td>
                            <td>newnut</td>
                          </tr>
                          <tr>
                            <td className="color-light w-175">Revision :</td>
                            <td>REVISION 4</td>
                          </tr>
                          <tr>
                            <td className="color-light w-175">ECO Number :</td>
                            <td>XXXXXXX</td>
                          </tr>
                        </tbody>
                      </Table>

                      <Link
                        to="ReleasePO"
                        className="btn btn-primary text-uppercase"
                      >
                        release po on this release
                      </Link>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="release-preview-part border-around border-light m-b-15 p-t-15">
                      <div className="pr-view cursor-pointer">
                        <span className="ico-action ">
                          <svg>
                            <use xlinkHref={`${Sprite}#review1Ico`} />
                          </svg>
                        </span>
                        Preview
                      </div>
                      <div className="flex ">
                        <Slider
                          asNavFor={this.state.nav2}
                          ref={slider => (this.slider1 = slider)}
                          className="slider-full"
                        >
                          <div>
                            <img src={boltImage1} />
                          </div>
                          <div>
                            <img src={boltImage} />
                          </div>{" "}
                          <div>
                            <img src={boltImage1} />
                          </div>{" "}
                          <div>
                            <img src={boltImage} />
                          </div>{" "}
                          <div>
                            <img src={partImage} />
                          </div>
                        </Slider>

                        <Slider
                          asNavFor={this.state.nav1}
                          ref={slider => (this.slider2 = slider)}
                          slidesToShow={5}
                          swipeToSlide={true}
                          focusOnSelect={true}
                          className="slider-thumb"
                        >
                          <div>
                            <img src={boltImage1} />
                          </div>{" "}
                          <div>
                            <img src={boltImage} />
                          </div>{" "}
                          <div>
                            <img src={boltImage1} />
                          </div>{" "}
                          <div>
                            <img src={boltImage} />
                          </div>{" "}
                          <div>
                            <img src={partImage} />
                          </div>
                        </Slider>
                      </div>
                    </div>

                    <div className="style2-tab">
                      <Tab.Container
                        id="tabs-with-dropdown"
                        defaultActiveKey="first"
                      >
                        <Row className="clearfix">
                          <Col sm={12}>
                            <Nav bsStyle="tabs">
                              <NavItem eventKey="first">Part History</NavItem>
                              <NavItem eventKey="second">Where Used</NavItem>
                              <NavItem eventKey="third">Delevery</NavItem>
                              {/* <NavItem eventKey="fourth">Chat</NavItem> */}
                            </Nav>
                          </Col>
                          <Col sm={12}>
                            <Tab.Content animation>
                              <Tab.Pane eventKey="first">
                                {" "}
                                <div className="style1-panel">
                                  <Panel
                                    id="collapsible-panel-example-3"
                                    defaultExpanded
                                  >
                                    <Panel.Heading>
                                      <Panel.Toggle componentClass="a">
                                        {" "}
                                        <span className="arrow-right mr-10">
                                          {""}{" "}
                                        </span>
                                        <div className="flex flex-1">
                                          <span className="date flex-1">
                                            April, 10 2018
                                          </span>
                                          <span className="revision flex-1">
                                            Revision A
                                          </span>
                                        </div>
                                      </Panel.Toggle>
                                    </Panel.Heading>
                                    <Panel.Collapse>
                                      <Panel.Body>
                                        <div className="summ-time-line">
                                          <ul className="timeline">
                                            <li className="flex justify-space-between active">
                                              <div className="flex-1 date">
                                                April, 10 2018
                                              </div>
                                              <div className="flex-1 content flex justify-space-between">
                                                <div>
                                                  <p>Part Creator</p>
                                                  <span className="color-light fs-12">
                                                    Lara Croft
                                                  </span>
                                                </div>
                                                <div
                                                  className="cursor-pointer"
                                                  onClick={this.handleShow}
                                                >
                                                  <span className="ico-message">
                                                    <svg>
                                                      <use
                                                        xlinkHref={`${Sprite}#messageIco`}
                                                      />
                                                    </svg>
                                                  </span>
                                                  <span className="text-info fw-600 fs-12">
                                                    {""} 45
                                                  </span>
                                                </div>
                                              </div>
                                            </li>
                                            <li className="flex justify-space-between active">
                                              <div className="flex-1 date">
                                                April, 10 2018
                                              </div>
                                              <div className="flex-1 content">
                                                <p>Part Creator</p>
                                                <span className="color-light fs-12">
                                                  Ethan Hunt
                                                </span>
                                              </div>
                                            </li>
                                          </ul>
                                        </div>
                                      </Panel.Body>
                                    </Panel.Collapse>
                                  </Panel>
                                </div>
                              </Tab.Pane>
                              <Tab.Pane eventKey="second">
                                Tab 2 content
                              </Tab.Pane>
                              <Tab.Pane eventKey="third">
                                Tab 3 content
                              </Tab.Pane>
                              {/* <Tab.Pane eventKey="fourth">
                                <div className="chat-wrapper p-20">
                                  <ul className="chat-list">
                                    <li className="flex">
                                      <div className="avatar">
                                        <img src={User} />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex justify-space-between align-center">
                                          <span className="u-name fs-12">
                                            <b>Name goes here,</b>
                                            <span className="color-light">
                                              Project Manages
                                            </span>
                                          </span>
                                          <span className="chat-date fs-12 color-light">
                                            <span>
                                              April 13, 2018 | 04:00 PM
                                            </span>

                                            <span className="ico-reply">
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#replyIco`}
                                                />
                                              </svg>
                                            </span>
                                          </span>
                                        </div>

                                        <div className="chat-hero-text">
                                          Lorem Ipsum is simply dummy text of
                                          the printing and typesetting industry.
                                          Lorem Ipsum has been the industry's
                                          standard dummy text ever since the
                                          1500s,
                                        </div>
                                      </div>
                                    </li>
                                    <li className="flex">
                                      <div className="avatar">
                                        <img src={User} />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex justify-space-between align-center">
                                          <span className="u-name fs-12">
                                            <b>Name goes here,</b>
                                            {""}
                                            <span className="color-light">
                                              {""}
                                              Project Manages
                                            </span>
                                          </span>
                                          <span className="chat-date fs-12 color-light">
                                            <span>
                                              April 13, 2018 | 04:00 PM {""}
                                            </span>

                                            <span className="ico-reply cursor-pointer">
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#replyIco`}
                                                />
                                              </svg>
                                            </span>
                                          </span>
                                        </div>

                                        <div className="chat-hero-text">
                                          Lorem Ipsum is simply dummy text of
                                          the printing and typesetting industry.
                                          Lorem Ipsum has been the industry's
                                          standard dummy text ever since the
                                          1500s,
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                  <div className="compose-messang flex align-center b-top border-light">
                                    <FormGroup
                                      controlId="formControlsTextarea"
                                      className="flex-1"
                                    >
                                      <FormControl
                                        componentClass="textarea"
                                        placeholder="Add comment"
                                      />
                                    </FormGroup>
                                    <span className="ico-post cursor-pointer">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#postIco`} />
                                      </svg>
                                    </span>
                                  </div>
                                </div>
                              </Tab.Pane> */}
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <Footer pageTitle={permissionConstant.footer_title.release} />

            <Modal
              className="custom-popUp modal-400 popUp-15"
              show={this.state.show}
              onHide={this.handleClose}
            >
              {/* <Modal.Header closeButton>
                          <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header> */}
              <Modal.Body>
                <h4>Comment here</h4>
                <FormGroup controlId="formControlsTextarea">
                  <FormControl
                    componentClass="textarea"
                    placeholder="Enter Here"
                    className="br-0 gray-card"
                    rows="4"
                  />
                </FormGroup>

                <div className="text-center">
                  <Link
                    to="ReleasePO"
                    className="btn btn-default text-uppercase"
                  >
                    Continue
                  </Link>

                  <button
                    onClick={this.handleClose}
                    className="btn btn-success"
                  >
                    Close
                  </button>
                </div>
              </Modal.Body>
              {/* <Modal.Footer>
                          <Button onClick={this.handleClose}>Close</Button>
                        </Modal.Footer> */}
            </Modal>

            {/*chat modal */}

            {/* <Modal
              show={this.state.show1}
              onHide={this.handleClose}
              className="custom-popUp"
            >
              <Modal.Header>
                <div className="flex justify-space-between">
                  <h4>
                    Part No :<b>RJ123345</b>
                  </h4>
                  <div className="">
                    <button
                      onClick={this.handleClose}
                      className="btn btn-link text-uppercase color-light"
                    >
                      close
                    </button>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <div className="chat-wrapper">
                  <ul className="chat-list">
                    <li className="flex">
                      <div className="avatar">
                        <img src={User} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-space-between align-center">
                          <span className="u-name fs-12">
                            <b>Name goes here,</b>
                            <span className="color-light">Project Manages</span>
                          </span>
                          <span className="chat-date fs-12 color-light">
                            <span>April 13, 2018 | 04:00 PM</span>

                            <span className="ico-reply">
                              <svg>
                                <use xlinkHref={`${Sprite}#replyIco`} />
                              </svg>
                            </span>
                          </span>
                        </div>

                        <div className="chat-hero-text">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s,
                        </div>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="avatar">
                        <img src={User} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-space-between align-center">
                          <span className="u-name fs-12">
                            <b>Name goes here,</b>
                            {""}
                            <span className="color-light">
                              {""}
                              Project Manages
                            </span>
                          </span>
                          <span className="chat-date fs-12 color-light">
                            <span>April 13, 2018 | 04:00 PM {""}</span>

                            <span className="ico-reply cursor-pointer">
                              <svg>
                                <use xlinkHref={`${Sprite}#replyIco`} />
                              </svg>
                            </span>
                          </span>
                        </div>

                        <div className="chat-hero-text">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s,
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div className="compose-messang flex align-center b-top border-light">
                    <FormGroup
                      controlId="formControlsTextarea"
                      className="flex-1"
                    >
                      <FormControl
                        componentClass="textarea"
                        placeholder="Add comment"
                      />
                    </FormGroup>
                    <span className="ico-post cursor-pointer">
                      <svg>
                        <use xlinkHref={`${Sprite}#postIco`} />
                      </svg>
                    </span>
                  </div>
                </div>
              </Modal.Body>
               <Modal.Footer>
                <Button onClick={this.handleClose}>Close</Button>
              </Modal.Footer> 
            </Modal> */}
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
