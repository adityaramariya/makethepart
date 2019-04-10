import React, { Component } from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import validation from "react-validation-mixin";
import strategy, { validator } from "react-validatorjs-strategy";
import CONSTANTS from "../../common/core/config/appConfig";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetBuyerDetails,
  actionUploadDoc,
  actionDeleteDoc,
  actionSubmitVendor
} from "../../common/core/redux/actions";
import Sprite from "../../img/sprite.svg";
import { topPosition, showErrorToast } from "../../common/commonFunctions";
let { customConstant } = CONSTANTS;
let { validationMessages } = CONSTANTS;

class Vendor extends Component {
  constructor(props) {
    super(props);

    this.documentList = [
      { value: "Incorporation Certificate", name: "Incorporation Certificate" },
      { value: "ISO9001 copy", name: "ISO9001 copy" },
      {
        value: "Previous 3 years Tax Return",
        name: "Previous 3 years Tax Return"
      },
      {
        value: "Certified copy of the Balance Sheet for last 3 years",
        name: "Certified copy of the Balance Sheet for last 3 years"
      },
      {
        value: "Corporate Presentation",
        name: "Corporate Presentation"
      },
      { value: "Registration", name: "Registration" },
      {
        value: "Buyer Approved Non-Disclosure Agreement",
        name: "Buyer Approved Non-Disclosure Agreement"
      },
      { value: "Code of Conduct", name: "Code of Conduct" },
      { value: "Facility pictures", name: "Facility pictures" },
      { value: "Others", name: "Others" }
    ];

    this.state = {
      tabKey: "vendor",
      partId: this.props.location.state && this.props.location.state.data.id,
      buyerResponse:
        this.props.location.state &&
        this.props.location.state.data.buyerResponse,
      documentList: this.documentList,
      documentRow: [{}, {}, {}],
      options: [],
      rowArray: [],
      indexOfRow: "",
      buyerId: "",
      buyerError: false,
      ndaError: false
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.submitVendor = this.submitVendor.bind(this);
    this.addMoreDoc = this.addMoreDoc.bind(this);
    this.handleDocUpload = this.handleDocUpload.bind(this);
    this.handleDeleteDoc = this.handleDeleteDoc.bind(this);
    this.handleBuyerChange = this.handleBuyerChange.bind(this);
    this.handleNdaDocUpload = this.handleNdaDocUpload.bind(this);
    this.handleDeleteNdaDoc = this.handleDeleteNdaDoc.bind(this);
  }

  componentWillMount() {
    let rowArray = this.state.rowArray || [];
    this.state.documentList &&
      this.state.documentList.forEach(function(elem, index) {
        rowArray[index] = {};
      });
    this.setState({ rowArray: rowArray });
  }

  componentDidMount() {
    let _this = this;
    let data = {
      partId: this.state.partId || "",
      buyerId: (this.state.buyerResponse && this.state.buyerResponse.id) || "",
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole
    };
    this.props.actionLoaderShow();
    this.props
      .actionGetBuyerDetails(data)
      .then((result, error) => {
        let response = result.payload.data.resourceData;
        this.setState({
          globalPurchasingCode: response.supplierResponse.globalPurchasingCode,
          vendorName: response.supplierResponse.companyName,
          vendorAddress: response.supplierResponse.addresseResponse[0],
          buyerDetail: response.listOfBuyerResponse
        });
        let options = [];
        let buyerDetail = this.state.buyerDetail;
        buyerDetail &&
          buyerDetail.forEach(function(elem, index) {
            options.push({ id: elem.id, name: elem.companyName });
          });
        _this.setState({
          options: options
        });
        if (_this.state.buyerDetail.length === 1) {
          _this.setState({
            buyerId:
              this.state.buyerDetail &&
              this.state.buyerDetail[0] &&
              this.state.buyerDetail[0].id
          });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  navigateTo(data) {
    this.props.actionTabClick(data);
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

  handleOnChange(event) {
    let { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleBuyerChange(data) {
    this.setState({
      buyerId: data && data[0] && data[0].id
    });
  }

  handleDropdownChange(event, item, rowIndex) {
    let _this = this;
    let { name, value } = event.target;
    let rowArray = this.state.rowArray;
    rowArray[rowIndex][name] = value;
    this.setState({ rowArray: rowArray });
    let documentList = this.state.documentList;
    if (value === "Facility pictures") {
      this.setState({ indexOfRow: rowIndex });
    } else {
      this.setState({ indexOfRow: "" });
    }
    for (let i = 0; i < documentList.length; i++) {
      documentList[i].isDisabled = false;
    }
    for (let i = 0; i < rowArray.length; i++) {
      let docIndex = documentList.findIndex(
        todo => todo.name === rowArray[i].documentType
      );
      if (docIndex !== -1) documentList[docIndex].isDisabled = true;
    }
    this.setState({ documentList: documentList });
  }

  submitVendor() {
    let _this = this;
    if (!this.state.buyerId) {
      topPosition();
      this.setState({ buyerError: true });
    } else if (!this.state.ndaDocument) {
      topPosition();
      this.setState({ ndaError: true });
    } else {
      let callSubmit = true;
      let listOfDocumentsOfSuppliers = [];
      this.setState({ buyerError: false });
      let rowArray = this.state.rowArray;
      for (let i = 0; i < rowArray.length - 1; i++) {
        if (
          rowArray &&
          rowArray[i].imageData &&
          rowArray[i].documentType !== "Others"
        ) {
          callSubmit = true;
        } else {
          callSubmit = false;
          showErrorToast(validationMessages.vendor.document_mes);
          break;
        }
      }
      if (callSubmit) {
        rowArray &&
          rowArray &&
          rowArray.forEach(function(element, index) {
            let documentType = element.documentType;
            element.imageData &&
              element.imageData.forEach(function(elem, elemIndex) {
                listOfDocumentsOfSuppliers.push({
                  documentNo: elemIndex + 1,
                  documentType: documentType,
                  mediaName: elem.mediaName,
                  mediaURL: elem.mediaURL,
                  mediaType: elem.mediaType,
                  mediaSize: elem.mediaSize,
                  mediaExtension: elem.mediaExtension
                });
              });
          });
        let data = {
          userId: this.props.userInfo.userData.id,
          buyerId:
            (this.state.buyerResponse && this.state.buyerResponse.id) ||
            this.state.buyerId,
          partId: this.state.partId || "",
          roleId: this.props.userInfo.userData.userRole,
          globalPurchasingCode: this.state.globalPurchasingCode,
          ndaDocument: this.state.ndaDocument,
          listOfDocumentsOfSuppliers: JSON.parse(
            JSON.stringify(listOfDocumentsOfSuppliers)
          )
        };
        this.props.actionLoaderShow();
        this.props
          .actionSubmitVendor(data)
          .then((result, error) => {
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      }
    }
  }

  addMoreDoc() {
    let documentRow = this.state.documentRow;
    if (documentRow.length < 10) {
      documentRow.push({});
    }
    this.setState({ documentRow: documentRow });
  }

  handleDocUpload(event, rowIndex) {
    let _this = this;
    let reqArray = [];
    let filesLength = event.target.files.length;
    for (let i = 0; i < filesLength; i++) {
      let fileObject = event.target.files[i];
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
            reqArray.push(reqObject);
            let rowArray = _this.state.rowArray || [];
            rowArray[rowIndex].imageData = reqArray;
            this.setState({
              rowArray: rowArray
            });
            _this.props.actionLoaderHide();
          })
          .catch(e => {
            _this.props.actionLoaderHide();
          });
      }
    }
  }

  handleNdaDocUpload(event) {
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
          _this.setState({ ndaDocument: reqObject });
          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }

  handleDeleteNdaDoc() {
    let _this = this;
    let s3FilePath = "";
    s3FilePath = this.state.ndaDocument.mediaURL;
    _this.props
      .actionDeleteDoc(s3FilePath)
      .then((result, error) => {
        _this.props.actionLoaderShow();
        this.setState({ ndaDocument: "" });
        _this.props.actionLoaderHide();
      })
      .catch(e => {
        _this.props.actionLoaderHide();
      });
  }

  handleDeleteDoc(event, rowIndex) {
    let _this = this;
    let s3FilePath = "";
    let rowArray = this.state.rowArray;
    rowArray[rowIndex] &&
      rowArray[rowIndex].imageData.forEach(function(elem, index) {
        s3FilePath = elem.mediaURL;
        _this.props
          .actionDeleteDoc(s3FilePath)
          .then((result, error) => {
            _this.props.actionLoaderShow();
            let rowArray = _this.state.rowArray;
            rowArray[rowIndex].imageData = "";
            _this.setState({ rowArray: rowArray });
            _this.props.actionLoaderHide();
          })
          .catch(e => {
            _this.props.actionLoaderHide();
          });
      });
  }

  render() {
    return (
      <div>
        <Header />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === "vendor" ? (
          <div>
            <div>
              <section className="">
                <Header {...this.props} />
                <div className="container">
                  <h4 className="hero-title-2">
                    Vendor Registration With The Buyer Organization
                  </h4>
                  <p className="m-b-30">
                    <small className="color-light ">
                      (Addtion of a vendor by the buyer are the subject to the
                      business/Quality/IP and other specific requirment;
                      including evalution of the vendor financial strength).
                    </small>
                  </p>

                  <Row className="show-grid">
                    <Col md={6}>
                      <div className="gray-card  p-30">
                        <FormGroup controlId="formControlsSelect">
                          <ControlLabel> Company Name: </ControlLabel>{" "}
                          {this.state.vendorName}
                        </FormGroup>
                        <FormGroup controlId="formControlsSelect">
                          <ControlLabel> Address: </ControlLabel>{" "}
                          {this.state.vendorAddress &&
                            this.state.vendorAddress.address}
                          ,{" "}
                          {this.state.vendorAddress &&
                            this.state.vendorAddress.state}
                          ,{""}
                          {this.state.vendorAddress &&
                            this.state.vendorAddress.country}
                        </FormGroup>
                        <FormGroup controlId="formControlsSelect">
                          <ControlLabel>
                            Global Purchase code of Buyer:
                          </ControlLabel>{" "}
                          {this.state.globalPurchasingCode}
                        </FormGroup>
                      </div>

                      <div className="buyer">
                        <p className="color-light">Buyer</p>
                        {this.state.buyerDetail &&
                        this.state.buyerDetail.length === 1 ? (
                          <h4>
                            {this.state.buyerDetail &&
                              this.state.buyerDetail[0] &&
                              this.state.buyerDetail[0].companyName}
                            ,{" "}
                            {this.state.buyerDetail &&
                              this.state.buyerDetail[0] &&
                              this.state.buyerDetail[0].addresses &&
                              this.state.buyerDetail[0].addresses[0].address}
                            ,{" "}
                            {this.state.buyerDetail &&
                              this.state.buyerDetail[0] &&
                              this.state.buyerDetail[0].addresses &&
                              this.state.buyerDetail[0].addresses[0].state}
                            ,{" "}
                            {this.state.buyerDetail &&
                              this.state.buyerDetail[0] &&
                              this.state.buyerDetail[0].addresses &&
                              this.state.buyerDetail[0].addresses[0].country}
                          </h4>
                        ) : (
                          <FormGroup className="mb-0">
                            <Typeahead
                              labelKey="name"
                              options={this.state && this.state.options}
                              placeholder="Select a buyer..."
                              minLength={2}
                              name="buyerName"
                              value={this.state.buyerName}
                              onChange={this.handleBuyerChange}
                            />
                            {this.state.buyerError ? (
                              <span className="error">
                                {validationMessages.vendor.buyerName.required}
                              </span>
                            ) : null}
                          </FormGroup>
                        )}
                      </div>

                      <div className="d-nda">
                        <a
                          href={customConstant.urlForDownload.NDA_document_url}
                          download
                        >
                          <button className="btn btn-primary text-uppercase">
                            download{" "}
                          </button>
                        </a>

                        <p className="">
                          <small className="color-light ">
                            Click here to download the copy of the NDA for the
                            buyer and the Buyers Code of conduct for vendors
                          </small>
                        </p>

                        {this.state.ndaDocument ? (
                          <ul className="upload-list b-btm">
                            <li className="flex justify-space-between align-center">
                              <span>{this.state.ndaDocument.mediaName}</span>
                              <span
                                className="ico-delete cursor-pointer"
                                onClick={event =>
                                  this.handleDeleteNdaDoc(event)
                                }
                              >
                                <svg>
                                  <use xlinkHref={`${Sprite}#deleteIco`} />
                                </svg>
                              </span>
                            </li>
                          </ul>
                        ) : (
                          <FormGroup className="mb-0">
                            <div className="upload-btn sm-upload text-center cursor-pointer text-uppercase ven-up">
                              <FormControl
                                id="formControlsFile"
                                type="file"
                                label="File"
                                multiple
                                accept={
                                  customConstant.acceptedFormat
                                    .documentAcceptFormat
                                }
                                onChange={event => {
                                  this.handleNdaDocUpload(event);
                                }}
                              />
                              <svg className="ico-upload">
                                <use xlinkHref={`${Sprite}#upload1Ico`} />
                              </svg>
                              <span>Upload</span>
                            </div>
                            {this.state.ndaError ? (
                              <span className="error">
                                {validationMessages.vendor.nda.required}
                              </span>
                            ) : null}
                          </FormGroup>
                        )}
                      </div>

                      <div className="doc-box">
                        <p className="">
                          <small className="color-light ">
                            Click on the 'Upload' button below to submit all
                            completed documents for vendors Registration
                          </small>
                        </p>
                        <div className="doc-box">
                          <p className="">
                            <small className="color-light ">
                              Click on the 'Upload' button below to submit all
                              completed documents for vendors Registration
                            </small>
                          </p>
                          <div className="gray-card p-20">
                            <div className="flex align-center">
                              <ul className="v-doc-list">
                                {this.state.documentRow &&
                                  this.state.documentRow.map(
                                    (item, rowIndex) => {
                                      return (
                                        <li
                                          className="flex justify-space-between"
                                          key={rowIndex}
                                        >
                                          <FormGroup className="m-b-0 flex-1">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="br-0 s-arrow"
                                              name="documentType"
                                              onChange={event => {
                                                this.handleDropdownChange(
                                                  event,
                                                  item,
                                                  rowIndex
                                                );
                                              }}
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              {this.state.documentList &&
                                                this.state.documentList.map(
                                                  (elem, listIndex) => {
                                                    return (
                                                      <option
                                                        value={elem.value}
                                                        key={listIndex}
                                                        disabled={
                                                          elem.isDisabled
                                                        }
                                                      >
                                                        {elem.name}
                                                      </option>
                                                    );
                                                  }
                                                )}
                                            </FormControl>
                                          </FormGroup>
                                          {this.state.rowArray &&
                                          this.state.rowArray[rowIndex] &&
                                          this.state.rowArray[rowIndex]
                                            .imageData ? (
                                            <div className="flex justify-space-between v-doc-group">
                                              <span>
                                                {this.state.rowArray &&
                                                  this.state.rowArray[
                                                    rowIndex
                                                  ] &&
                                                  this.state.rowArray[rowIndex]
                                                    .imageData &&
                                                  this.state.rowArray[rowIndex]
                                                    .imageData[0].mediaName}
                                              </span>
                                              <span
                                                className="ico-delete cursor-pointer"
                                                onClick={event =>
                                                  this.handleDeleteDoc(
                                                    event,
                                                    rowIndex
                                                  )
                                                }
                                              >
                                                <svg>
                                                  <use
                                                    xlinkHref={`${Sprite}#deleteIco`}
                                                  />
                                                </svg>
                                              </span>
                                              {this.state.rowArray &&
                                              this.state.rowArray[rowIndex] &&
                                              this.state.rowArray[rowIndex]
                                                .imageData.length > 1 ? (
                                                <ul className="v-doc-name">
                                                  {this.state.rowArray &&
                                                    this.state.rowArray[
                                                      rowIndex
                                                    ] &&
                                                    this.state.rowArray[
                                                      rowIndex
                                                    ].imageData &&
                                                    this.state.rowArray[
                                                      rowIndex
                                                    ].imageData.map(
                                                      (item, index) => {
                                                        return (
                                                          <li key={index}>
                                                            {item.mediaName}
                                                          </li>
                                                        );
                                                      }
                                                    )}
                                                </ul>
                                              ) : null}
                                            </div>
                                          ) : this.state.indexOfRow ===
                                            rowIndex ? (
                                            <div
                                              className={
                                                this.state.rowArray &&
                                                this.state.rowArray[rowIndex]
                                                  .documentType
                                                  ? "upload-btn sm-upload text-center cursor-pointer text-uppercase flex-1"
                                                  : "upload-btn sm-upload text-center cursor-pointer text-uppercase p-e-none flex-1"
                                              }
                                            >
                                              <FormControl
                                                id="formControlsFile"
                                                type="file"
                                                label="File"
                                                multiple
                                                accept={
                                                  customConstant.acceptedFormat
                                                    .imageAcceptFormat
                                                }
                                                onChange={event => {
                                                  this.handleDocUpload(
                                                    event,
                                                    rowIndex
                                                  );
                                                }}
                                              />
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#upload1Ico`}
                                                />
                                              </svg>
                                            </div>
                                          ) : (
                                            <div
                                              className={
                                                this.state.rowArray &&
                                                this.state.rowArray[rowIndex]
                                                  .documentType
                                                  ? "upload-btn sm-upload text-center cursor-pointer text-uppercase flex-1"
                                                  : "upload-btn sm-upload text-center cursor-pointer text-uppercase p-e-none flex-1"
                                              }
                                            >
                                              <FormControl
                                                id="formControlsFile"
                                                type="file"
                                                label="File"
                                                multiple
                                                accept={
                                                  customConstant.acceptedFormat
                                                    .documentAcceptFormat
                                                }
                                                onChange={event => {
                                                  this.handleDocUpload(
                                                    event,
                                                    rowIndex
                                                  );
                                                }}
                                              />
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#upload1Ico`}
                                                />
                                              </svg>
                                            </div>
                                          )}
                                        </li>
                                      );
                                    }
                                  )}
                              </ul>
                            </div>
                            {this.state.documentRow.length === 10 ? null : (
                              <div className="">
                                <span
                                  className="cursor-pointer"
                                  onClick={this.addMoreDoc}
                                >
                                  <span className="ico-add">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#plus-OIco`} />
                                    </svg>
                                  </span>
                                  &nbsp;Add more Documents
                                </span>
                              </div>
                            )}

                            {/* <div className="upload-btn text-center cursor-pointer text-uppercase">
                      upload
                      <FormControl
                        id="formControlsFile"
                        type="file"
                        label="File"
                      />
                    </div> */}
                          </div>
                          <p className="">
                            <small className="color-light ">
                              Please note the buyer may take upto 4 weeks to
                              approve vendor registration request after
                              completing the due difference process.
                            </small>
                          </p>
                        </div>
                        <p className="">
                          <small className="color-light ">
                            Please note the buyer may take upto 4 weeks to
                            approve vendor registration request after completing
                            the due difference process.
                          </small>
                        </p>
                      </div>

                      <button
                        className="btn btn-default text-uppercase m-b-50"
                        onClick={this.submitVendor}
                      >
                        submit
                      </button>
                    </Col>
                    <Col md={6}>
                      <div className="req-files p-20">
                        <label>Buyer Requirment for Vendor Registration</label>

                        <ul>
                          {this.state.documentList.map((item, index) => {
                            return (
                              <div>
                                <li>
                                  {item.name}
                                  {this.state.rowArray &&
                                    this.state.rowArray.map((elem, i) => {
                                      return elem.documentType === item.name &&
                                        elem.imageData ? (
                                        <span
                                          className="ico-add fill-orange"
                                          style={{ marginLeft: "10px" }}
                                        >
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#rightIco`}
                                            />
                                          </svg>
                                        </span>
                                      ) : null;
                                    })}
                                </li>
                              </div>
                            );
                          })}
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </div>
              </section>
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
                        <a className="disabled">
                          Vendor Registration with the Buyer
                        </a>
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
                        <Link to="infrastructureAudit">
                          Infrastructure Audit
                        </Link>
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
      actionGetBuyerDetails,
      actionUploadDoc,
      actionDeleteDoc,

      actionSubmitVendor
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

Vendor = validation(strategy)(Vendor);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vendor);
