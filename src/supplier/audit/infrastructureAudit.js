import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Sprite from "../../img/sprite.svg";
import {
  Row,
  Col,
  FormControl,
  FormGroup,
  ControlLabel
} from "react-bootstrap";
import Image1 from "../../img/image.png";

import {
  actionLoaderHide,
  actionLoaderShow,
  actionSaveAuditData,
  actionUploadDoc,
  actionDeleteDoc
} from "../../common/core/redux/actions";
import { topPosition } from "../../common/commonFunctions";

import Header from "../common/header";
import SideBar from "../common/sideBar";
import CONSTANTS from "../../common/core/config/appConfig";
let { customConstant } = CONSTANTS;

class InfrastructureAudit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "audit",
      resStandardArray: [],
      resOtherDocArray: []
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleDocUpload = this.handleDocUpload.bind(this);
    this.handleOtherDocUpload = this.handleOtherDocUpload.bind(this);
    this.handleDocDelete = this.handleDocDelete.bind(this);
    this.handleOtherDocDelete = this.handleOtherDocDelete.bind(this);
    this.saveAudit = this.saveAudit.bind(this);
  }

  componentWillMount() {
    let standardArray = [
      {
        name: "ISO 9001",
        status: "deleted"
      },
      {
        name: "ISO 9004",
        status: "deleted"
      },
      {
        name: "TS16949",
        status: "deleted"
      },
      {
        name: "ISO12207",
        status: "deleted"
      },
      {
        name: "ISO15288",
        status: "deleted"
      },
      {
        name: "ISO15504",
        status: "deleted"
      },
      {
        name: "ISO 19011",
        status: "deleted"
      },
      {
        name: "QS-9000",
        status: "deleted"
      },
      {
        name: "CMMI",
        status: "deleted"
      },
      {
        name: "ISO22000",
        status: "deleted"
      },
      {
        name: "VDA",
        status: "deleted"
      },
      {
        name: "Malcolm",
        status: "deleted"
      },
      {
        name: "DEMING",
        status: "deleted"
      },
      {
        name: "AVSQ",
        status: "deleted"
      },
      {
        name: "EAQF",
        status: "deleted"
      },
      {
        name: "WCM",
        status: "deleted"
      }
    ];

    let otherDocArray = [
      {
        name: "Registration/ Incorporation Certificates",
        status: "deleted"
      },
      {
        name: "Bank Certificates",
        status: "deleted"
      },
      {
        name: "Quality Certification",
        status: "deleted"
      },
      {
        name: "Major Account Details",
        status: "deleted"
      },
      {
        name: "Latest Year Tax Return",
        status: "deleted"
      },
      {
        name: "Tax Return for Year-1",
        status: "deleted"
      },
      {
        name: "Tax Return for Year-2",
        status: "deleted"
      },
      {
        name: "Ownership/ Lease for the site",
        status: "deleted"
      },
      {
        name: "Non-Disclosure",
        status: "deleted"
      },
      {
        name: "Code of Conduct",
        status: "deleted"
      }
    ];
    this.setState({
      otherDocArray: otherDocArray,
      standardArray: standardArray
    });
  }

  componentDidMount() {
    console.log("audti page...");
  }

  handleOnChange(event) {
    let { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === "first")
      this.props.history.push({
        pathname: "home",
        state: { path: "first" }
      });
    if (tabKey === "second") this.props.history.push("home");
    if (tabKey === "third")
      this.props.history.push({
        pathname: "home",
        state: { path: "third" }
      });
    this.setState({ tabKey: tabKey });
  }

  handleDocUpload(event, index) {
    let _this = this;
    let fileObject = event.target.files[0];
    if (fileObject) {
      const formData = new FormData();
      formData.set("mFile", fileObject);
      formData.append("thumbnailHeight", 100);
      formData.append("thumbnailWidth", 100);
      formData.append("isCreateThumbnail", true);
      formData.append("fileKey", fileObject.name);
      formData.append("filePath", fileObject.name);
      this.props.actionLoaderShow();
      this.props
        .actionUploadDoc(formData)
        .then((result, error) => {
          let response = result.payload.data;

          var reqObject = {};
          let mediaExtension = response.filePath.split(".").pop(-1);
          reqObject["mediaName"] = response.filePath;
          reqObject["mediaURL"] = response.s3FilePath;
          reqObject["mediaSize"] = response.fileSize;
          reqObject["mediaExtension"] = mediaExtension;
          reqObject["mediaType"] = response.contentType;
          reqObject["isDeleted"] = false;
          let resStandardArray = _this.state.resStandardArray;
          let standardArray = _this.state.standardArray;
          resStandardArray[index] = reqObject;
          standardArray[index].status = "uploded";
          this.setState({
            resStandardArray: resStandardArray,
            standardArray: standardArray
          });
          console.log("resStandardArray....", resStandardArray);
          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }
  handleDocDelete(event, index) {
    let _this = this;
    let s3FilePath = "";
    s3FilePath = this.state.resStandardArray[index].mediaURL;
    _this.props
      .actionDeleteDoc(s3FilePath)
      .then((result, error) => {
        _this.props.actionLoaderShow();
        let resStandardArray = _this.state.resStandardArray;
        let standardArray = _this.state.standardArray;
        resStandardArray[index] = "";
        standardArray[index].status = "deleted";
        _this.setState({
          resStandardArray: resStandardArray,
          standardArray: standardArray
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => {
        _this.props.actionLoaderHide();
      });
  }

  handleOtherDocUpload(event, index) {
    let _this = this;
    let fileObject = event.target.files[0];
    if (fileObject) {
      const formData = new FormData();
      formData.set("mFile", fileObject);
      formData.append("thumbnailHeight", 100);
      formData.append("thumbnailWidth", 100);
      formData.append("isCreateThumbnail", true);
      formData.append("fileKey", fileObject.name);
      formData.append("filePath", fileObject.name);
      this.props.actionLoaderShow();
      this.props
        .actionUploadDoc(formData)
        .then((result, error) => {
          let response = result.payload.data;

          var reqObject = {};
          let mediaExtension = response.filePath.split(".").pop(-1);
          reqObject["mediaName"] = response.filePath;
          reqObject["mediaURL"] = response.s3FilePath;
          reqObject["mediaSize"] = response.fileSize;
          reqObject["mediaExtension"] = mediaExtension;
          reqObject["mediaType"] = response.contentType;
          reqObject["isDeleted"] = false;
          let resOtherDocArray = _this.state.resOtherDocArray;
          let otherDocArray = _this.state.otherDocArray;
          resOtherDocArray[index] = reqObject;
          otherDocArray[index].status = "uploded";
          this.setState({
            resOtherDocArray: resOtherDocArray,
            otherDocArray: otherDocArray
          });
          console.log("resStandardArray....", resOtherDocArray);
          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }

  handleOtherDocDelete(event, index) {
    let _this = this;
    let s3FilePath = "";
    s3FilePath = this.state.resOtherDocArray[index].mediaURL;
    _this.props
      .actionDeleteDoc(s3FilePath)
      .then((result, error) => {
        _this.props.actionLoaderShow();
        let resOtherDocArray = _this.state.resOtherDocArray;
        let otherDocArray = _this.state.otherDocArray;
        resOtherDocArray[index] = "";
        otherDocArray[index].status = "deleted";
        _this.setState({
          resOtherDocArray: resOtherDocArray,
          otherDocArray: otherDocArray
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => {
        _this.props.actionLoaderHide();
      });
  }

  saveAudit() {
    console.log("other doc array...", this.state.otherDocArray);
    console.log("other  res doc array...", this.state.resOtherDocArray);
    let resOtherDocArray = this.state.resOtherDocArray;
    let resStandardArray = this.state.resStandardArray;
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id || "",
      roleId: this.props.userInfo.userData.userRole || "",
      researchAndDevRequest: {
        noOfEngineers: this.state.noOfEngineersRND,
        noOfPatents: this.state.noOfPatents,
        noOfApprovedPatents: this.state.noOfApprovedPatents,
        rAndDSoftwareUsed: this.state.rAndDSoftwareUsed,
        plmSystemUsed: this.state.plmSystemUsed,
        rAndDCapexInLast3Years: this.state.rAndDCapexInLast3Years
      },
      qualityRequest: {
        noOfEngineers: this.state.noOfEngineersQualityReq,
        qualityCircles: this.state.qualityCircles,
        sixSigma: this.state.sixSigma,
        insppectionCapabilities: this.state.insppectionCapabilities,
        qualityCapexInLast3Years: this.state.qualityCapexInLast3Years
      },
      manufacturingRequest: {
        noOfEngineers: this.state.noOfEngineersManufacturingReq,
        noOfAssociates: this.state.noOfAssociates,
        totalArea: this.state.totalArea,
        capabilities: this.state.capabilities,
        manufacturingCapexInLast3Years: this.state
          .manufacturingCapexInLast3Years
      },
      environmentalAndCSRRequest: {
        certifications: this.state.certifications,
        csrInitiatives: this.state.csrInitiatives
      },
      auditDocumentRequest: {
        registrationIncorporationCertificate: resOtherDocArray[0],
        bankCertificates: resOtherDocArray[1],
        qualityCertification: resOtherDocArray[2],
        majorAccountDetails: resOtherDocArray[3],
        latestYeaTaxReturns: resOtherDocArray[4],
        taxReturnForYear1: resOtherDocArray[5],
        taxReturnForYear2: resOtherDocArray[6],
        leaseForTheSite: resOtherDocArray[7],
        voluntaryNonDisclosure: resOtherDocArray[8],
        codeOfConduct: resOtherDocArray[9]
      },
      isOandOtherCertificateRequest: {
        iso9001: resStandardArray[0],
        iso9004: resStandardArray[1],
        ts16949: resStandardArray[2],
        iso12207: resStandardArray[3],
        iso15288: resStandardArray[4],
        iso15504: resStandardArray[5],
        iso19011: resStandardArray[6],
        qs9000: resStandardArray[7],
        cmmi: resStandardArray[8],
        iso22000: resStandardArray[9],
        vda: resStandardArray[10],
        malcolm: resStandardArray[11],
        deming: resStandardArray[12],
        avsq: resStandardArray[13],
        eaqf: resStandardArray[14],
        wcm: resStandardArray[15]
      }
    };
    console.log("data......", data);
    this.props.actionLoaderShow();
    this.props
      .actionSaveAuditData(data)
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
        {this.state.tabKey === "audit" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <Row>
                  <Col md={9}>
                    <h3 className="text-center m-t-20 m-b-30">
                      Supplier Infrastructure Audit
                    </h3>
                    <Row>
                      <Col md={3}>
                        <div className="gray-card p-20">
                          <h6 className="text-center fw-600">R & D</h6>
                          <hr />

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              No. of Engineers in R&D:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="noOfEngineersRND"
                              value={this.state.noOfEngineersRND}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              No. of Patents Field:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="noOfPatents"
                              value={this.state.noOfPatents}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              No. of Approved Patents:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="noOfApprovedPatents"
                              value={this.state.noOfApprovedPatents}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              R&D Software Used:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="rAndDSoftwareUsed"
                              value={this.state.rAndDSoftwareUsed}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              PLM System Used:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="plmSystemUsed"
                              value={this.state.plmSystemUsed}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              R&D CAPEX in last 3 years:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="rAndDCapexInLast3Years"
                              value={this.state.rAndDCapexInLast3Years}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="gray-card p-20">
                          <h6 className="text-center text-uppercase fw-600">
                            Quality
                          </h6>
                          <hr />

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              No. of Engineers:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="noOfEngineersQualityReq"
                              value={this.state.noOfEngineersQualityReq}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              Quality Circles:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="qualityCircles"
                              value={this.state.qualityCircles}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              6-Sigma:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="sixSigma"
                              value={this.state.sixSigma}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              Inspection Capabilities:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="insppectionCapabilities"
                              value={this.state.insppectionCapabilities}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              Quality CAPEX in last 3 years:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="qualityCapexInLast3Years"
                              value={this.state.qualityCapexInLast3Years}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="gray-card p-20">
                          <h6 className="text-center text-uppercase fw-600">
                            Manufacturing
                          </h6>
                          <hr />

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              No. of Engineers:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="noOfEngineersManufacturingReq"
                              value={this.state.noOfEngineersManufacturingReq}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              Number of Associates:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="noOfAssociates"
                              value={this.state.noOfAssociates}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              Total Area:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="totalArea"
                              value={this.state.totalArea}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              Capabilities:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="capabilities"
                              value={this.state.capabilities}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              Manufacturing CAPEX in last 3 years:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="manufacturingCapexInLast3Years"
                              value={this.state.manufacturingCapexInLast3Years}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>
                        </div>
                      </Col>

                      <Col md={3}>
                        <div className="gray-card p-20">
                          <h6 className="text-center text-uppercase fw-600">
                            Environmental & CSR
                          </h6>
                          <hr />

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              Certifications:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="certifications"
                              value={this.state.certifications}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel className="fs-12 color-light fw-normal">
                              CSR Initiatives:
                            </ControlLabel>
                            <FormControl
                              type="text"
                              className="br-0"
                              name="csrInitiatives"
                              value={this.state.csrInitiatives}
                              onChange={event => {
                                this.handleOnChange(event);
                              }}
                            />
                            <FormControl.Feedback />
                          </FormGroup>
                        </div>
                      </Col>
                    </Row>
                    <hr className="divider" />
                    <ul className="quick-tags m-t-40 m-b-30">
                      {this.state.otherDocArray.map((data, i) => {
                        return (
                          <li key={i}>
                            <div className="upload-btn btn btn-default text-uppercase up-doc-action">
                              {data.name}
                              <div className="overLay">
                                {this.state.otherDocArray[i].status ===
                                "deleted" ? (
                                  <div className="upload-btn">
                                    <span className="ico-doc-up cursor-pointer">
                                      <FormControl
                                        id="formControlsFile"
                                        type="file"
                                        label="File"
                                        accept={
                                          customConstant.acceptedFormat
                                            .documentAcceptFormat
                                        }
                                        onChange={event => {
                                          this.handleOtherDocUpload(event, i);
                                        }}
                                      />
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#upload1Ico`}
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                ) : (
                                  <span
                                    className="ico-doc-up cursor-pointer"
                                    onClick={event =>
                                      this.handleOtherDocDelete(event, i)
                                    }
                                  >
                                    <svg>
                                      <use xlinkHref={`${Sprite}#delete1Ico`} />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <hr />

                    <div className="text-center m-b-20 m-t-40">
                      <button className="btn btn-success text-uppercase">
                        cancel
                      </button>
                      <button
                        className="btn btn-default text-uppercase"
                        onClick={this.saveAudit}
                      >
                        save
                      </button>
                    </div>
                  </Col>
                  <Col md={3}>
                    <h4 className="st-title fw-600">Standards</h4>
                    <div className="gray-card stan-r-box">
                      <ul className="iso-stan">
                        {this.state.standardArray.map((item, index) => {
                          return (
                            <li
                              className="flex justify-space-between"
                              key={index}
                            >
                              <div className="flex align-center">
                                <span className="iso-img">
                                  <img
                                    src={Image1}
                                    className="img-responsive obj-cover"
                                  />
                                </span>
                                <span>{item.name}</span>
                              </div>
                              <div className="flex align-center">
                                {this.state.standardArray[index].status ===
                                "deleted" ? (
                                  <div className="upload-btn cursor-pointer sm-upload">
                                    <FormControl
                                      id="formControlsFile"
                                      type="file"
                                      label="File"
                                      accept={
                                        customConstant.acceptedFormat
                                          .documentAcceptFormat
                                      }
                                      onChange={event => {
                                        this.handleDocUpload(event, index);
                                      }}
                                    />
                                    <span className="ico-doc-up">
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#upload1Ico`}
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                ) : (
                                  <span
                                    className="ico-doc-up cursor-pointer"
                                    onClick={event =>
                                      this.handleDocDelete(event, index)
                                    }
                                  >
                                    <svg>
                                      <use xlinkHref={`${Sprite}#delete1Ico`} />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <footer>
              <button
                className="btn btn-block br-0 btn-toTop text-uppercase"
                onClick={topPosition}
              >
                back to top
              </button>
              <div className="bg-Dgray">
                <div className="footer-container">
                  <div className="p-tags-wrapper flex justify-space-between">
                    <ul className="p-tags">
                      <li>
                        <Link
                          to="home"
                          onClick={() => this.navigateTo("second")}
                        >
                          Review Part for Quotation
                        </Link>
                      </li>
                      <li>
                        <a className="disabled">Quality certification</a>
                      </li>
                      <li>
                        <a className="disabled">Major Account Details</a>
                      </li>
                      <li>
                        <Link to="businessDetails">Business Details</Link>
                      </li>
                    </ul>

                    <ul className="p-tags">
                      <li>
                        <Link to="vendor">
                          Vendor Registration with the Buyer
                        </Link>
                      </li>
                      <li>
                        <a className="disabled">Buyer Criteria</a>
                      </li>
                      <li>
                        <Link
                          to={{
                            pathname: "home",
                            state: { path: "third" }
                          }}
                          // to="home"
                          // onClick={() => this.navigateTo('third')}
                        >
                          Approve Quotation
                        </Link>
                      </li>
                      <li>
                        <Link
                          // to="home"
                          to={{
                            pathname: "home",
                            state: { path: "first" }
                          }}
                        >
                          Dashboard
                        </Link>
                      </li>
                    </ul>

                    <ul className="p-tags">
                      {this.props.userInfo.userData.isAdmin ? (
                        <li>
                          <Link to="addUser">Add Users</Link>
                        </li>
                      ) : (
                        ""
                      )}

                      <li>
                        <Link to="updatePartStatus">Update Part Status</Link>
                      </li>
                      <li>
                        <a className="disabled">Download Parts Summary</a>
                      </li>
                      <li>
                        <a className="disabled">Infrastructure Audit</a>
                      </li>
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
      actionSaveAuditData,
      actionUploadDoc,
      actionDeleteDoc
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
)(InfrastructureAudit);
