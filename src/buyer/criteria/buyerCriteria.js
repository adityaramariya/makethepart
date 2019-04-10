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
  Table
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
import Footer from "../common/footer";
import CONSTANTS from "../../common/core/config/appConfig";
import { handlePermission } from "../../common/permissions";
let { permissionConstant } = CONSTANTS;
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
                  Buyer Criteria
                </h4>
                <div className="border-around border-light p-20 m-b-50">
                  <Row>
                    <Col md={4}>
                      <FormGroup controlId="formBasicText">
                        <ControlLabel className="fs-12">
                          Buyer Payment terms
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
                        <ControlLabel className="fs-12">Distance</ControlLabel>
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
                          Global Presence
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
                          Base Country
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
                          Minimum Business Value
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
                          Minimum Order Quality
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
                    <Col
                      md={4}
                      className="flex align-center justify-space-between"
                    >
                      <FormGroup controlId="formBasicText" className="flex-1">
                        <ControlLabel className="fs-12">
                          Select Country
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
                      <div className="flex-1 text-right">
                        <button className="btn btn-primary sm-btn text-uppercase">
                          add country
                        </button>
                      </div>
                    </Col>
                    <Col md={4}>gfhfg</Col>
                    <Col md={4}>gfgf</Col>
                  </Row>
                  <Row>
                    <Col
                      md={4}
                      className="flex align-center justify-space-between"
                    >
                      <div className="gray-card up-padd">
                        <ul className="upload-list b-btm">
                          <li className="flex justify-space-between align-center">
                            <span>
                              <img src={docImage} />
                              jkhkjlhkih
                            </span>

                            <span className="ico-delete cursor-pointer">
                              <svg>
                                <use xlinkHref={`${Sprite}#deleteIco`} />
                              </svg>
                            </span>
                          </li>
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
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <Footer
              pageTitle={permissionConstant.footer_title.buyer_criteria}
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
