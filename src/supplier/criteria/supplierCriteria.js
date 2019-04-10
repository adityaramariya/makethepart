import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import Sprite from "../../img/sprite.svg";
import docImage from "../../img/doc.png";
import {
  Row,
  Col,
  FormControl,
  FormGroup,
  ControlLabel,
  Table,
  Tab,
  Nav,
  NavItem
} from "react-bootstrap";
import Slider from "react-slick";
import Image1 from "../../img/image.png";

import {
  actionLoaderHide,
  actionLoaderShow,
  actionApproveRejectNonDiscloser
} from "../../common/core/redux/actions";

import Header from "../common/header";
import SideBar from "../common/sideBar";

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "reviewSupplier",
      nav1: null,
      nav2: null,
      reviewData: this.props.location.state && this.props.location.state.data,
      faciliyPictures: [],
      documentsList: [],
      otherDocList: []
    };
    console.log("rreview datra..........", this.state.reviewData);
    // get srcSet() {
    //   return images.map(image => {
    //     return `${Image1}${image.name} ${image.vw}`;
    //   }).join(', ')
    // }

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.openDocument = this.openDocument.bind(this);
    this.approveSupplierRegis = this.approveSupplierRegis.bind(this);
  }

  componentWillMount() {
    let faciliyPictures = this.state.faciliyPictures || [];
    let documentsList = this.state.documentsList || [];
    let reviewData = this.state.reviewData || [];
    reviewData &&
      reviewData.registrationResponse &&
      reviewData.registrationResponse.listOfDocumentsUpload &&
      reviewData.registrationResponse.listOfDocumentsUpload.forEach(function(
        item,
        index
      ) {
        if (item.documentType === "Facility pictures") {
          faciliyPictures.push(item);
        } else {
          documentsList.push(item);
        }
      });
    this.setState({
      faciliyPictures: faciliyPictures,
      documentsList: documentsList,
      otherDocList:
        reviewData &&
        reviewData.registrationResponse &&
        reviewData.registrationResponse.listOfDocumentsUpload &&
        reviewData.registrationResponse.listOfOtherDocumentsUpload
    });
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

  openDocument(event, data) {
    window.open(data);
  }

  approveSupplierRegis() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id || "",
      roleId: this.props.userInfo.userData.userRole || "",
      approvalId: this.state.reviewData && this.state.reviewData.id,
      comments: "comments",
      status: "approved",
      supplierUserId:
        this.state.reviewData &&
        this.state.reviewData.supplierUserDetailResponse &&
        this.state.reviewData.supplierUserDetailResponse.id
    };

    this.props.actionLoaderShow();
    this.props
      .actionApproveRejectNonDiscloser(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === "reviewSupplier" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <h4 className="text-center m-b-50 m-t-40 fw-600">
                  Supplier Criteria
                </h4>

                <Tab.Container id="tabs-with-dropdown" defaultActiveKey="first">
                  <Row className="clearfix">
                    <Col sm={12}>
                      <div className="flex align-center style3-tab m-b-15">
                        <span>Set Supplier Criteria :</span>
                        <Nav bsStyle="tabs">
                          <NavItem eventKey="first">Global</NavItem>
                          <NavItem eventKey="second">By Part Number</NavItem>
                          <NavItem eventKey="third">By Project</NavItem>
                          <NavItem eventKey="fourth">By Usage Location</NavItem>
                        </Nav>
                      </div>
                    </Col>
                    <Col sm={12}>
                      <Tab.Content animation>
                        <Tab.Pane eventKey="first">
                          <div className="border-around border-light p-20 m-b-50">
                            <Row>
                              <Col md={4}>
                                <FormGroup controlId="formBasicText">
                                  <ControlLabel className="fs-12">
                                    Supplier R & D
                                  </ControlLabel>
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                  >
                                    <option value="select">select</option>
                                    <option value="other">...</option>
                                  </FormControl>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup controlId="formBasicText">
                                  <ControlLabel className="fs-12">
                                    Distance
                                  </ControlLabel>
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                  >
                                    <option value="select">select</option>
                                    <option value="other">...</option>
                                  </FormControl>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup controlId="formBasicText">
                                  <ControlLabel className="fs-12">
                                    Industry Size
                                  </ControlLabel>
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                  >
                                    <option value="select">select</option>
                                    <option value="other">...</option>
                                  </FormControl>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={4}>
                                <FormGroup controlId="formBasicText">
                                  <ControlLabel className="fs-12">
                                    Supplier Quality
                                  </ControlLabel>
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                  >
                                    <option value="select">select</option>
                                    <option value="other">...</option>
                                  </FormControl>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup controlId="formBasicText">
                                  <ControlLabel className="fs-12">
                                    Responce Time
                                  </ControlLabel>
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                  >
                                    <option value="select">select</option>
                                    <option value="other">...</option>
                                  </FormControl>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup controlId="formBasicText">
                                  <ControlLabel className="fs-12">
                                    Supplier CAPEX Level
                                  </ControlLabel>
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                  >
                                    <option value="select">select</option>
                                    <option value="other">...</option>
                                  </FormControl>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={4}>
                                <FormGroup controlId="formBasicText">
                                  <ControlLabel className="fs-12">
                                    Supplier Financial Strength
                                  </ControlLabel>
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="br-0 s-arrow"
                                  >
                                    <option value="select">select</option>
                                    <option value="other">...</option>
                                  </FormControl>
                                </FormGroup>
                              </Col>
                              <Col md={4}>dfgd</Col>
                              <Col md={4}>dfgd</Col>
                            </Row>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">Tab 2 content</Tab.Pane>
                        <Tab.Pane eventKey="third">Tab 3 content</Tab.Pane>
                        <Tab.Pane eventKey="fourth">Tab 4 content</Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </div>
            </div>
            <footer>
              <button className="btn btn-block br-0 btn-toTop text-uppercase">
                back to top
              </button>
              <div className="bg-Dgray">
                <div className="footer-container">
                  <div className="p-tags-wrapper flex justify-space-between">
                    <ul className="p-tags flex-1">
                      <li>
                        <Link className="" to="/buyer/createECO">
                          Create ECO
                        </Link>
                      </li>

                      <li>
                        <Link className="" to="/buyer/createBuildPlanECO">
                          Build Plan ECO
                        </Link>
                      </li>

                      <li>
                        <Link to="/buyer/historyECO">History ECO</Link>
                      </li>
                      <li>
                        <Link to="/buyer/productPlanning">
                          Product Plannning
                        </Link>
                      </li>
                    </ul>
                    <ul className="p-tags flex-1">
                      {this.props.userInfo.userData.isAdmin ? null : this.props
                          .userInfo.userData.userProfile === "designer" ? (
                        <li>
                          <Link to="addPart">Request for Purchase</Link>
                        </li>
                      ) : null}
                      <li>
                        <a className="disabled">Purchacing Summary</a>
                      </li>
                      <li>
                        <a className="disabled">Quotation Summary</a>
                      </li>
                    </ul>

                    <ul className="p-tags flex-1">
                      {this.props.userInfo.userData.userProfile === "buyer" ||
                      this.props.userInfo.userData.userProfile ===
                        "purchase_manager" ? (
                        <li>
                          <Link to="releasePO">Release PO</Link>
                        </li>
                      ) : null}

                      <li>
                        <a className="disabled">Supplier Criteria Setting</a>
                      </li>
                      <li>
                        <Link to="home">My Dashboard</Link>
                      </li>
                      {this.props.userInfo.userData.isAdmin ? null : (
                        <li>
                          <Link to="summaryPartsStatus">
                            Summary Part Status
                          </Link>
                        </li>
                      )}
                    </ul>
                    <ul className="p-tags flex-1">
                      {this.props.userInfo.userData.userProfile === "buyer" ||
                      this.props.userInfo.userData.userProfile ===
                        "purchase_manager" ? (
                        <li>
                          <Link to="/buyer/approvalPO">Approve PO</Link>
                        </li>
                      ) : null}
                      {this.props.userInfo.userData.isAdmin ? null : (
                        <li>
                          <Link
                            to={{
                              pathname: "home",
                              state: { path: "third" }
                            }}
                          >
                            Approve RFQ
                          </Link>
                        </li>
                      )}
                      {this.props.userInfo.userData.isAdmin ? (
                        <li>
                          <a onClick={() => this.props.history.push("adduser")}>
                            Add Users
                          </a>
                        </li>
                      ) : null}
                      {this.props.userInfo.userData.isAdmin ||
                      this.props.userInfo.userData.userProfile === "buyer" ||
                      this.props.userInfo.userData.userProfile ===
                        "designer" ? (
                        <li>
                          <Link to="/buyer/partDetail">Part Detail</Link>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
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
      actionApproveRejectNonDiscloser
    },
    dispatch
  );
};

const mapStateToProps = state => {
  console.log(state);
  return {
    userInfo: state.User,
    supplierParts: state.supplierParts
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary);
