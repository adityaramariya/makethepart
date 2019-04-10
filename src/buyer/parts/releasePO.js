import React, { Component } from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import _ from "lodash";
import ReactToPrint from "react-to-print";
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Table,
  Form,
  DropdownButton,
  MenuItem,
  InputGroup,
  Row,
  Modal,
  Col
} from "react-bootstrap";
import validation from "react-validation-mixin";
import strategy, { validator } from "react-validatorjs-strategy";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import CONSTANTS from "../../common/core/config/appConfig";
import {
  actionLoaderHide,
  actionLoaderShow,
  actionTabData,
  actionReleasePOList,
  actionUploadImage,
  actionSubmitReleasePOList,
  actionDeleteRevisionImage
} from "../../common/core/redux/actions";
import Sprite from "../../img/sprite.svg";
import Search from "../../img/search.png";
import { showErrorToast, topPosition } from "../../common/commonFunctions";
import Footer from "../common/footer";
import { handlePermission } from "../../common/permissions";
let { regExpressions, permissionConstant } = CONSTANTS;

class ReleasePO extends Component {
  constructor(props) {
    super(props);

    this.state = {
      partNumber:
        this.props.location.state && this.props.location.state.partNumber,
      partId: this.props.location.state && this.props.location.state.partId,
      proNumber:
        this.props.location.state && this.props.location.state.projectCode,
      uploadStatus: [],
      purchaseOrderNo: "",
      poGeneratedWith: "",
      releaseDisable: true,
      projectArray: [],
      tabKey: "releasePO",
      searchByPart: "",
      // searchFlag: false,
      listOfPOReleaseRequest: [],
      termArray: ["", "", ""],
      attach: false,
      generate: false,
      generateFlag: false,
      grandTotal: 0,
      submitConfirm: false,
      show: false
    };

    this.handleCheck = this.handleCheck.bind(this);
    this.submitReleasePO = this.submitReleasePO.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.deleteAttachment = this.deleteAttachment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTaxChange = this.handleTaxChange.bind(this);
    // this.handleDesChange = this.handleDesChange.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.searchByPartNumber = this.searchByPartNumber.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.addTerm = this.addTerm.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleTaxBlur = this.handleTaxBlur.bind(this);
    this.submitConfirmModal = this.submitConfirmModal.bind(this);
    this.handleSubmitClose = this.handleSubmitClose.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
    // this.handleDeliveryChange = this.handleDeliveryChange.bind(this);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const partId =
      this.props.location.state && this.props.location.state.partId;
    const buyerUserId = this.props.userInfo.userData.id;
    this.setState({
      partId: partId,
      buyerUserId: buyerUserId
    });
  }

  navigateToRFQ(data) {
    this.props.actionTabData(data);
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === "first") this.props.history.push("home");
    if (tabKey === "third")
      this.props.history.push({ pathname: "home", state: { path: "third" } });

    this.setState({ tabKey: tabKey });
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  // added after server side code change.
  handleProjectChange(event, index) {
    const selected = event.target.checked;
    let projectArray = this.state.projectArray;
    let projectArrayWithIndex = projectArray[index];
    if (selected) {
      projectArrayWithIndex.selected = true;
    } else {
      projectArrayWithIndex.selected = false;
    }
    projectArray[index] = projectArrayWithIndex;
    var projectIds = [];
    for (var i = 0, l = projectArray.length; i < l; i++) {
      if (projectArray[i].selected) {
        let record = {
          projectId: projectArray[i].id,
          selected: true
        };
        projectIds.push(record);
      } else {
        let record = {
          projectId: projectArray[i].id,
          selected: false
        };
        projectIds.push(record);
      }
    }
    this.setState({
      projectId: projectIds
    });
  }

  // handleDeliveryChange(e) {
  //   const value = e.target.value;
  // }

  handleTaxChange(event, index, listIndex, data) {
    let listOfPOReleaseRequest = this.state.listOfPOReleaseRequest;
    for (
      let i = listOfPOReleaseRequest && listOfPOReleaseRequest.length;
      i < index + 1;
      i++
    ) {
      listOfPOReleaseRequest.push({
        partId: data.id,
        quotationId:
          data.listOfQuotationDetails[0] &&
          data.listOfQuotationDetails[0].quotationId,
        purchaseOrderNo:
          this.state.releasePOList[0] &&
          this.state.releasePOList[0].purchaseOrderNo,
        poGeneratedWith: this.state.poGeneratedWith,
        listOfTaxIds: [],
        grandTotal: data.subtotal || 0,
        flag: false
      });
    }

    let listOfTaxIds =
      listOfPOReleaseRequest && listOfPOReleaseRequest[index].listOfTaxIds;

    for (let i = listOfTaxIds && listOfTaxIds.length; i < listIndex + 1; i++)
      listOfTaxIds.push({
        taxId: "",
        taxDescription: ""
      });

    listOfTaxIds[listIndex].taxId = event.target.value;

    if (listOfPOReleaseRequest)
      listOfPOReleaseRequest[index].listOfTaxIds = listOfTaxIds;

    // listOfTaxIds.forEach(function(data1, ind) {
    //   if (listIndex == ind) {
    //     listOfPOReleaseRequest[index].grandTotal =
    //       listOfPOReleaseRequest[index].grandTotal + event.target.value
    //         ? parseFloat(event.target.value, 10)
    //         : 0;
    //   } else {
    //     listOfPOReleaseRequest[index].grandTotal =
    //       listOfPOReleaseRequest[index].grandTotal + data1.taxId
    //         ? parseFloat(data1.taxId, 10)
    //         : 0;
    //   }
    // });
    this.setState({
      listOfPOReleaseRequest: listOfPOReleaseRequest
    });
  }

  handleTaxBlur(event, index, listIndex, data) {
    const { name, value } = event.target;
    const regExp = new RegExp(regExpressions.taxOnly);
    if (!regExp.test(value) && value) {
      event.target.value = "";
      return;
    }
    let listOfPOReleaseRequest = this.state.listOfPOReleaseRequest;
    let total = 0;
    let grandTotal = this.state.grandTotal
      ? parseFloat(this.state.grandTotal)
      : 0;
    listOfPOReleaseRequest[index] &&
      listOfPOReleaseRequest[index].listOfTaxIds &&
      listOfPOReleaseRequest[index].listOfTaxIds.forEach(function(item, index) {
        total =
          (total ? parseFloat(total) : 0) +
          (item.taxId ? parseFloat(item.taxId) : 0);
      });
    if (
      data.listOfQuotationDetails[0] &&
      data.listOfQuotationDetails[0].subtotal
    ) {
      total =
        (total ? parseFloat(total) : 0) +
        (data.listOfQuotationDetails[0].subtotal
          ? parseFloat(data.listOfQuotationDetails[0].subtotal)
          : 0);
    } else {
      total = total ? parseFloat(total) : 0;
    }
    grandTotal = total;
    if (listOfPOReleaseRequest) {
      if (listOfPOReleaseRequest[index])
        listOfPOReleaseRequest[index].grandTotal = grandTotal;
    }
    this.setState({
      listOfPOReleaseRequest: listOfPOReleaseRequest,
      grandTotal: grandTotal
    });
  }

  handleDesChange(index, event) {
    let desArray = [];
    if (event) {
      const name = event.target.name;
      const value = event.target.value;
      desArray = Object.assign([], this.state.desArray);
      desArray[index] = value;
    } else {
      desArray = [{}];
    }
    this.setState({
      desArray: desArray
    });
  }

  handleCheckboxChange(event, data, index) {
    let _this = this;
    let listOfPOReleaseRequest = this.state.listOfPOReleaseRequest;

    for (
      let i = listOfPOReleaseRequest && listOfPOReleaseRequest.length;
      i < index + 1;
      i++
    ) {
      listOfPOReleaseRequest.push({
        partId: data.id,
        quotationId:
          data.listOfQuotationDetails[0] &&
          data.listOfQuotationDetails[0].quotationId,
        purchaseOrderNo:
          _this.state.releasePOList[0] &&
          _this.state.releasePOList[0].purchaseOrderNo,
        poGeneratedWith: _this.state.poGeneratedWith,
        listOfTaxIds: [],
        flag: false
      });
    }

    listOfPOReleaseRequest[index].flag = !listOfPOReleaseRequest[index].flag;
    this.setState({
      generateFlag: true,
      listOfPOReleaseRequest: listOfPOReleaseRequest
    });
  }

  handleCheck(event, dataPO) {
    let _this = this;
    let sel;
    let disabledProjectNumber = event.target.checked ? true : false;
    this.setState({ disabledProjectNumber: disabledProjectNumber });

    if (this.state.projectId && this.state.projectId.length > 0) {
      sel = this.state.projectId.findIndex(x => x.selected === true);
    }

    if (dataPO === "attachPO") {
      if (event.target.checked) {
        this.setState({
          attach: true,
          generate: false
        });
        let data = {
          partId: this.state.partId,
          buyerUserId: this.state.buyerUserId,
          projectId: this.state.projectId,
          partNumber: this.state.partNumber
        };

        if (sel == -1) {
          data.projectId = [];
        }

        this.props.actionLoaderShow();
        this.props
          .actionReleasePOList(data)
          .then((result, error) => {
            this.setState({
              releasePOList: result.payload.data.resourceData,
              poGeneratedWith: 2,
              purchaseOrderNo:
                result.payload.data.resourceData[0].purchaseOrderNo
            });

            let projectArray = [];
            this.state.releasePOList.forEach(function(item, index) {
              projectArray.push(item.projectResponse);
              // projectArray.push(item.projectResponse.projectCode);
            });
            this.setState({
              projectArray: projectArray
            });

            let finalData = [];
            this.state.releasePOList.forEach(function(data, index) {
              data.poreleasePartsRes.forEach(function(item) {
                finalData.push(item);
                _this.setState({
                  finalData: finalData
                });
              });
            });

            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      } else {
        this.setState({
          purchaseOrderNo: this.state.purchaseOrderNo,
          poGeneratedWith: 1,
          attach: false,
          generate: false
        });
      }
    } else if (dataPO === "generatePO") {
      if (event.target.checked) {
        this.setState({
          attach: false,
          generate: true,
          loopIndex: 0
        });
        let data1 = {
          partId: this.state.partId,
          buyerUserId: this.state.buyerUserId,
          projectId: this.state.projectId,
          partNumber: this.state.partNumber
        };
        if (sel == -1) {
          data1.projectId = [];
        }
        this.props.actionLoaderShow();
        this.props
          .actionReleasePOList(data1)
          .then((result, error) => {
            _this.setState({
              releasePOList: result.payload.data.resourceData,
              poGeneratedWith: 2,
              purchaseOrderNo:
                result.payload.data.resourceData[0].purchaseOrderNo
            });

            let projectArray = [];
            _this.state.releasePOList.forEach(function(item, index) {
              projectArray.push(item.projectResponse);
              //projectArray.push(item.projectResponse.projectCode);
            });

            _this.setState({
              projectArray: projectArray
            });
            let finalData = [];
            _this.state.releasePOList.forEach(function(data, index) {
              data.poreleasePartsRes.forEach(function(item) {
                finalData.push(item);
                _this.setState({
                  finalData: finalData
                });
              });
            });

            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      } else {
        this.setState({
          attach: false,
          generate: false
        });
      }
    }
  }

  handleUploadImage(event, data, index) {
    const fileObject = event.target.files[0];
    let _this = this;
    let uploadStatus = [];
    let listOfPOReleaseRequest = [];
    let listOfTaxIds = [];
    const formData = new FormData();
    formData.set("mFile", fileObject);
    formData.append("thumbnailHeight", 100);
    formData.append("thumbnailWidth", 100);
    formData.append("isCreateThumbnail", true);
    formData.append("fileKey", fileObject.name);
    formData.append("filePath", fileObject.name);
    this.props.actionLoaderShow();
    this.props
      .actionUploadImage(formData)
      .then((result, error) => {
        listOfPOReleaseRequest = _this.state.listOfPOReleaseRequest || [];
        uploadStatus = this.state.uploadStatus;
        uploadStatus[index] = result.payload.data.uploadStatus;
        this.setState({
          uploadStatus: uploadStatus
        });
        _this.state.uploadStatus.forEach(function(item, index) {
          if (item === "") {
            _this.setState({
              releaseDisable: true
            });
          } else {
            _this.setState({
              releaseDisable: false
            });
          }
        });
        listOfPOReleaseRequest.push({
          partId: data.id,
          quotationId:
            data.listOfQuotationDetails[0] &&
            data.listOfQuotationDetails[0].quotationId,
          purchaseOrderNo:
            _this.state.releasePOList[0] &&
            _this.state.releasePOList[0].purchaseOrderNo,
          poGeneratedWith: _this.state.poGeneratedWith,
          listOfTaxIds: listOfTaxIds,
          listOfTermsAndConditions: _this.state.termArray
        });
        this.setState({
          listOfPOReleaseRequest: listOfPOReleaseRequest
        });

        _this.props.actionLoaderHide();
      })
      .catch(e => {
        _this.props.actionLoaderHide();
      });
  }

  deleteAttachment(event, index, path) {
    let _this = this;
    let uploadStatus = [];
    this.props
      .actionDeleteRevisionImage(path)
      .then((result, error) => {
        uploadStatus = this.state.uploadStatus;
        uploadStatus[index] = "";
        this.setState({
          uploadStatus: uploadStatus
        });
        _this.state.uploadStatus.forEach(function(item, index) {
          if (item === "") {
            _this.setState({
              releaseDisable: true
            });
          } else {
            _this.setState({
              releaseDisable: false
            });
          }
        });
      })
      .catch();
  }

  submitConfirmModal() {
    this.setState({ submitConfirm: true });
  }
  handleSubmitClose() {
    this.setState({ submitConfirm: false });
  }

  submitReleasePO() {
    let _this = this;
    let data = "";
    let listOfTaxIds = [];
    let listOfTermsAndConditions = [];
    let listOfPOReleaseRequest = [];
    this.setState({ submitConfirm: false });
    if (this.state.attach) {
      this.state.releasePOList.map(function(item) {
        if (item.selected) {
          listOfPOReleaseRequest.push({
            partId: item.poreleasePartsRes[0].id,
            quotationId:
              item.poreleasePartsRes[0] &&
              item.poreleasePartsRes[0].listOfQuotationDetails[0] &&
              item.poreleasePartsRes[0].listOfQuotationDetails[0].quotationId,
            purchaseOrderNo:
              _this.state.releasePOList[0] &&
              _this.state.releasePOList[0].purchaseOrderNo,
            poGeneratedWith: _this.state.poGeneratedWith,
            listOfTaxIds: listOfTaxIds,
            listOfTermsAndConditions: _this.state.termArray
          });
        }
      });
      data = {
        buyerUserId: this.state.buyerUserId,
        listOfPOReleaseRequest: listOfPOReleaseRequest
      };
    } else {
      let listOfPOReleaseRequest = this.state.listOfPOReleaseRequest;
      let newlistOfPOReleaseRequest = [];
      listOfPOReleaseRequest.forEach(function(data) {
        if (data.flag == true) newlistOfPOReleaseRequest.push(data);
      });

      data = {
        buyerUserId: this.state.buyerUserId,
        projectDeliveryAt: { adderss: this.state.projectDeliveryAt },
        listOfPOReleaseRequest: newlistOfPOReleaseRequest,
        listOfTermsAndConditions: _this.state.termArray
      };
    }

    this.props
      .actionSubmitReleasePOList(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();       
        _this.props.history.push('/buyer/summary');
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  searchByPartNumber(e) {
    if (e.key === "Enter") {
      this.setState({projectId:[]})
      let _this = this;
      let data = {
        partId: this.state.partId ? this.state.partId : "",
        buyerUserId: this.state.buyerUserId,
        partNumber: this.state.searchByPart,
        projectId: []
      };
      // this.setState({ searchFlag: true });
      this.props.actionLoaderShow();
      this.props
        .actionReleasePOList(data)
        .then((result, error) => {
          _this.setState({
            releasePOList:
              result.payload.data && result.payload.data.resourceData,
            poGeneratedWith: 2,
            deliveryAddress:
              result.payload.data.resourceData[0].listOfDeliveryAddress,
            // proNumber:
            //   result.payload.data &&
            //   result.payload.data.resourceData[0].projectCode
            purchaseOrderNo: result.payload.data.resourceData[0].purchaseOrderNo
          });
          // let filteredPartId = _.filter(_this.state.releasePOList, function(
          //   userData
          // ) {
          //   return (
          //     userData.poreleasePartsRes[0].partNumber ===
          //     _this.state.searchByPart
          //   );
          // });
          let filteredPartId;
          let projectArray = [];
          _this.state.releasePOList.forEach(function(item, index) {
            projectArray.push(item.projectResponse);
            //projectArray.push(item.projectResponse.projectCode);
            filteredPartId = _.filter(item.poreleasePartsRes, function(
              userData
            ) {
              return userData.partNumber === _this.state.searchByPart;
            });
          });
          _this.setState({
            partId: filteredPartId[0] && filteredPartId[0].id,
            partNumber: _this.state.searchByPart,
            // projectId: filteredPartId[0].projectResponse.id,
            projectArray: projectArray
          });
          let finalData = [];
          this.state.releasePOList.forEach(function(data, index) {
            data.poreleasePartsRes.forEach(function(item) {
              finalData.push(item);
              _this.setState({
                finalData: finalData
              });
            });
          });
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  }
  addTerm() {
    let termArray = this.state.termArray;
    termArray.push("");
    this.setState({
      termArray: termArray
    });
  }
  handleTermChange(index, event) {
    let termArray = [];
    if (event) {
      const name = event.target.name;
      const value = event.target.value;
      termArray = Object.assign([], this.state.termArray);
      termArray[index] = value;
    } else {
      termArray = [{}];
    }
    this.setState({
      termArray: termArray
    });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    let fullData = this.state.finalData;
    return (
      <div>
        <Header />
        <SideBar
          activeTabKey={
            this.state.tabKey === "releasePO" ? "releasePO" : "none"
          }
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === "releasePO" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <h4 className="hero-title">Release PO</h4>
                <Row className="show-grid">
                  <Col md={4} />
                  <Col md={4}>
                    <h4 className="text-center fw-600 m-t-40">
                      Search Part Number
                    </h4>
                    <div className="search--box m-b-30">
                      <FormControl
                        className="br-0  m-b-20"
                        type="text"
                        placeholder="Search"
                        name="searchByPart"
                        value={this.state.searchByPart}
                        onKeyUp={this.searchByPartNumber}
                        onChange={e => this.handleChange(e)}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <h4 className="text-center fw-600">Project Number</h4>
                        <div className="custom-dd dropRf pro-num">
                          <DropdownButton
                            title=" Select"
                            name="prjectName"
                            value={this.state.projectArray}
                            className="btn-block"
                          >
                            {this.state.projectArray &&
                              this.state.projectArray.map((item, i) => {
                                return (
                                  <li className="xxx">
                                    <input
                                      type="checkbox"
                                      value={item.id}
                                      disabled={
                                        this.state.disabledProjectNumber
                                      }
                                      checked={item.selected ? true : false}
                                      //onClick={this.dontClose}
                                      onChange={event => {
                                        this.handleProjectChange(event, i);
                                      }}
                                    />
                                    <label>{item.projectCode} </label>
                                  </li>
                                );
                              })}
                          </DropdownButton>
                        </div>

                        {/* <FormGroup
                          controlId="formControlsSelect"
                          className="m-b-0"
                        >
                          <FormControl
                            componentClass="select"
                            multiple
                            placeholder="select"
                            className="bg--select"
                            onChange={e => this.handleProjectChange(e)}
                          >
                            <option value="select" disabled>select</option>
                            {this.state.projectArray.map((item, index) => {
                              return (
                                <option value={item.id} key={index}>
                                  {item.projectCode}
                                </option>
                              );
                            })} */}
                        {/* // ) : (
                            //   <option value={this.state.proNumber} selected>
                            //     {this.state.proNumber}
                            //   </option>
                            // )} */}
                        {/* </FormControl>
                        </FormGroup> */}
                      </div>
                      <div className="col-md-6">
                        <h4 className="text-center fw-600">PO Number</h4>
                        <h3 className="part-no text-center">
                          {this.state.purchaseOrderNo}
                        </h3>
                      </div>
                    </div>

                    <div className="flex align-center justify-center two-checkbox">
                      <label className="label--checkbox">
                        <input
                          type="checkbox"
                          className="checkbox"
                          onClick={event => this.handleCheck(event, "attachPO")}
                          checked={this.state.attach ? true : false}
                          disabled={!this.state.purchaseOrderNo}
                        />
                        Attach a PO
                      </label>

                      <span>
                        <label className="label--checkbox">
                          <input
                            type="checkbox"
                            className="checkbox"
                            onClick={event =>
                              this.handleCheck(event, "generatePO")
                            }
                            checked={this.state.generate ? true : false}
                            disabled={!this.state.purchaseOrderNo}
                          />
                        </label>
                        Generate PO Online
                      </span>
                    </div>
                  </Col>
                </Row>
                {this.state.generate && this.state.releasePOList ? (
                  <div className="content">
                    <div className="container-fluid">
                      <div className="m-t-20 m-b-30">
                        <Row className="show-grid">
                          <Col md={6}>
                            <div className="company-info">
                              <Table className="">
                                <tbody>
                                  <tr>
                                    <td>Buyer:</td>
                                    <td>
                                      {this.props.userInfo.userData.companyName}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Vendor:</td>
                                    <td>
                                      {this.state.releasePOList[0]
                                        .poreleasePartsRes[0] &&
                                      this.state.releasePOList[0]
                                        .poreleasePartsRes[0].supplierResponse
                                        .companyName
                                        ? this.state.releasePOList[0]
                                            .poreleasePartsRes[0] &&
                                          this.state.releasePOList[0]
                                            .poreleasePartsRes[0]
                                            .supplierResponse.companyName
                                        : ""}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Contact:</td>
                                    <td>
                                      {this.props.userInfo.userData.fullname},{" "}
                                      {this.props.userInfo.userData.userProfile}
                                      ,{this.props.userInfo.userData.contactNo}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Puruchase Order No:</td>
                                    <td>{this.state.purchaseOrderNo}</td>
                                  </tr>
                                  <tr>
                                    <td>Issued Through:</td>
                                    <td>makethepart.com</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className=" m-b-30">
                        <Row className="show-grid">
                          <Col md={3}>
                            <Form inline>
                              <FormGroup
                                controlId="formControlsSelect"
                                className="m-b-0"
                              >
                                <ControlLabel className="color-light">
                                  Delivery at
                                </ControlLabel>
                                <FormControl
                                  componentClass="select"
                                  placeholder="select"
                                  className="br-0 w-220"
                                  name="projectDeliveryAt"
                                  onChange={e => this.handleChange(e)}
                                >
                                  <option value="select">select</option>

                                  {this.state.deliveryAddress &&
                                    this.state.deliveryAddress.map(
                                      (item, index) => {
                                        return (
                                          <option
                                            value={item.address}
                                            key={index}
                                          >
                                            {item.address}
                                          </option>
                                        );
                                      }
                                    )}
                                </FormControl>
                              </FormGroup>
                            </Form>
                          </Col>
                          <Col md={3}>
                            <Form inline>
                              <FormGroup controlId="formInlineName">
                                <ControlLabel className="color-light">
                                  Tax ID No. 1
                                </ControlLabel>{" "}
                                <FormControl type="text" className="br-0" />
                              </FormGroup>
                            </Form>
                          </Col>
                          <Col md={3}>
                            <Form inline>
                              <FormGroup controlId="formInlineName">
                                <ControlLabel className="color-light">
                                  Tax ID No. 2
                                </ControlLabel>{" "}
                                <FormControl type="text" className="br-0" />
                              </FormGroup>
                            </Form>
                          </Col>
                          <Col md={3}>
                            <Form inline>
                              <FormGroup controlId="formInlineName">
                                <ControlLabel className="color-light">
                                  Tax ID No. 3
                                </ControlLabel>{" "}
                                <FormControl type="text" className="br-0" />
                              </FormGroup>
                            </Form>
                          </Col>
                        </Row>
                      </div>

                      <div>
                        <Table
                          bordered
                          responsive
                          hover
                          className="custom-table gray-row"
                        >
                          <thead>
                            <tr>
                              <th style={{ minWidth: "65px" }}> </th>
                              <th>S. No.</th>
                              <th>Part Number</th>
                              <th>Description</th>
                              <th>Unit Rate</th>
                              <th>Unit </th>
                              <th>Quantity</th>
                              <th>Sub Total</th>
                              <th>Tax 1</th>
                              <th>Tax 2</th>
                              <th>Tax 3</th>
                              <th>Grand Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.finalData &&
                              this.state.finalData.map((item, index) => {
                                return this.state.finalData[index].selected ||
                                  this.state.finalData[index].selected ==
                                    undefined ? (
                                  <tr>
                                    <td>
                                      <span
                                        className={
                                          index % 4 === 0
                                            ? "r-caret red"
                                            : index % 4 === 1
                                            ? "r-caret green"
                                            : index % 4 === 2
                                            ? "r-caret blue"
                                            : "r-caret yellow"
                                        }
                                      />
                                      <label className="label--checkbox">
                                        <input
                                          type="checkbox"
                                          className="checkbox"
                                          onClick={event =>
                                            this.handleCheckboxChange(
                                              event,
                                              item,
                                              index
                                            )
                                          }
                                        />
                                      </label>
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{item.partNumber}</td>
                                    <td>{item.partDescription}</td>
                                    <td />
                                    <td>{item.units}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                      {item.listOfQuotationDetails &&
                                        item.listOfQuotationDetails[0].subtotal}
                                    </td>
                                    <td>
                                      <FormGroup className="m-b-0  w-150">
                                        <FormControl
                                          type="text"
                                          className="b-0 br-0 "
                                          name="taxId"
                                          value={item.tax1}
                                          onChange={event =>
                                            this.handleTaxChange(
                                              event,
                                              index,
                                              0,
                                              item
                                            )
                                          }
                                          onBlur={event =>
                                            this.handleTaxBlur(
                                              event,
                                              index,
                                              0,
                                              item
                                            )
                                          }
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                    </td>

                                    <td>
                                      <FormGroup className="m-b-0 w-150">
                                        <FormControl
                                          type="text"
                                          className="b-0 br-0 "
                                          name="taxId"
                                          value={item.tax2}
                                          onChange={event =>
                                            this.handleTaxChange(
                                              event,
                                              index,
                                              1,
                                              item
                                            )
                                          }
                                          onBlur={event =>
                                            this.handleTaxBlur(
                                              event,
                                              index,
                                              1,
                                              item
                                            )
                                          }
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                    </td>

                                    <td>
                                      <FormGroup className="m-b-0  w-150">
                                        <FormControl
                                          type="text"
                                          className="b-0 br-0 "
                                          name="taxId"
                                          value={item.tax3}
                                          onChange={event =>
                                            this.handleTaxChange(
                                              event,
                                              index,
                                              2,
                                              item
                                            )
                                          }
                                          onBlur={event =>
                                            this.handleTaxBlur(
                                              event,
                                              index,
                                              2,
                                              item
                                            )
                                          }
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                    </td>

                                    <td>
                                      <td>
                                        {this.state.listOfPOReleaseRequest[
                                          index
                                        ] &&
                                          this.state.listOfPOReleaseRequest[
                                            index
                                          ].grandTotal &&
                                          this.state.listOfPOReleaseRequest[
                                            index
                                          ].grandTotal.toFixed(2)}
                                      </td>
                                    </td>
                                  </tr>
                                ) : (
                                  ""
                                );
                              })}
                            {/* ; })} */}
                          </tbody>
                        </Table>
                      </div>

                      <Row>
                        <Col md={6}>
                          <h4>Terms</h4>
                          {this.state.termArray &&
                            this.state.termArray.map((item, index) => {
                              return (
                                <p className="terms-pt flex align-center">
                                  <span>{index + 1}.</span>{" "}
                                  <FormControl
                                    type="text"
                                    name="term"
                                    value={item.term}
                                    onChange={e => {
                                      this.handleTermChange(index, e);
                                    }}
                                  />
                                </p>
                              );
                            })}

                          <div className=" mb-30 mt-15">
                            <span
                              className="cursor-pointer"
                              onClick={this.addTerm}
                            >
                              <span className="ico-add">
                                <svg>
                                  <use xlinkHref={`${Sprite}#plus-OIco`} />
                                </svg>
                              </span>
                              &nbsp;Add more Terms
                            </span>
                          </div>
                        </Col>
                      </Row>
                      <div className="text-center m-t-20 m-b-30">
                        <button
                          className="btn btn-default "
                          onClick={this.handleShow}
                        >
                          Preview
                        </button>
                        <button
                          className="btn btn-success "
                          onClick={this.submitConfirmModal}
                        >
                          Release
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {this.state.attach ? (
                      <Row>
                        <Col md={4}> </Col>
                        <Col md={4}>
                          <div className="gray-card p-30 m-b-20">
                            <ol className="upload-list">
                              {this.state.finalData &&
                                this.state.finalData.map((item, index) => {
                                  return this.state.finalData[index].selected ||
                                    this.state.finalData[index].selected ==
                                      undefined ? (
                                    <li
                                      className="flex justify-space-between align-center"
                                      key={index}
                                    >
                                      <span>{item.partNumber}</span>

                                      <div className="flex">
                                        {this.state.uploadStatus[index] ===
                                        "Completed" ? (
                                          <div>
                                            <span className="text-uppercase upl-text">
                                              uploaded
                                            </span>
                                            <span
                                              className="ico-delete cursor-pointer"
                                              onClick={e =>
                                                this.deleteAttachment(
                                                  e,
                                                  index,
                                                  item.partMediaResponses[0]
                                                    .mediaName
                                                )
                                              }
                                            >
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#deleteIco`}
                                                />
                                              </svg>
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="upload-btn sm-upl cursor-pointer text-uppercase">
                                            <span className="ico-upload">
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#uploadIco`}
                                                />
                                              </svg>
                                            </span>
                                            <FormControl
                                              id="formControlsFile"
                                              type="file"
                                              label="File"
                                              onChange={e =>
                                                this.handleUploadImage(
                                                  e,
                                                  item,
                                                  index
                                                )
                                              }
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </li>
                                  ) : (
                                    ""
                                  );
                                })}
                            </ol>

                            <hr />

                            <div className="text-center ">
                              <button
                                className={
                                  this.state.releaseDisable
                                    ? "btn btn-link text-uppercase p-e-none"
                                    : "btn btn-link text-uppercase "
                                }
                                // className="btn btn-link text-uppercase disabled"
                                onClick={this.submitConfirmModal}
                              >
                                release po
                              </button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    ) : null}
                  </div>
                )}
                {/* </Col>
                </Row> */}
              </div>
            </div>

            <Footer pageTitle={permissionConstant.footer_title.release_po} />
          </div>
        ) : null}
        <Modal
          show={this.state.submitConfirm}
          onHide={this.handleSubmitClose}
          className="custom-popUp confirmation-box"
          bsSize="small"
        >
          <Modal.Body>
            <div className="">
              <h5 className="text-center">
                Are you sure you want to release PO?
              </h5>
              <div className="text-center">
                <button
                  className="btn btn-default text-uppercase sm-btn"
                  onClick={this.submitReleasePO}
                >
                  Continue
                </button>
                <button
                  className="btn btn-success text-uppercase sm-btn"
                  onClick={this.handleCloseModel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/*Preview modal*/}

        <Modal
          className="custom-popUp modal-xxl"
          show={this.state.show}
          onHide={this.handleClose}
        >
          <Modal.Header>
            <div className="flex justify-space-between">
              <h4>PO Review</h4>
              <div className="">
                <span className="print-btn">
                  <ReactToPrint
                    trigger={() => (
                      <a href="#">
                        {" "}
                        <span className="ico-print">
                          <svg>
                            <use xlinkHref={`${Sprite}#printIco`} />
                          </svg>
                        </span>
                      </a>
                    )}
                    content={() => this.componentRef}
                    onClick={() => {
                      this.printScreen();
                    }}
                  />
                </span>
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
            <table className="m-b-15">
              <tr>
                <td>
                  <div className="company-info">
                    <Table className="print-table">
                      <tbody>
                        <tr>
                          <td>Buyer:</td>
                          <td>{this.props.userInfo.userData.companyName}</td>
                        </tr>
                        <tr>
                          <td>Vendor:</td>
                          <td>
                            {this.state.releasePOList &&
                            this.state.releasePOList[0].poreleasePartsRes[0] &&
                            this.state.releasePOList[0].poreleasePartsRes[0]
                              .supplierResponse.companyName
                              ? this.state.releasePOList &&
                                this.state.releasePOList[0]
                                  .poreleasePartsRes[0] &&
                                this.state.releasePOList[0].poreleasePartsRes[0]
                                  .supplierResponse.companyName
                              : ""}
                          </td>
                        </tr>
                        <tr>
                          <td>Contact:</td>
                          <td>
                            {" "}
                            {this.props.userInfo.userData.fullname},{" "}
                            {this.props.userInfo.userData.userProfile},
                            {this.props.userInfo.userData.contactNo}
                          </td>
                        </tr>
                        <tr>
                          <td>Puruchase Order No:</td>
                          <td>{this.state.purchaseOrderNo}</td>
                        </tr>
                        <tr>
                          <td>Issued Through:</td>
                          <td>makethepart.com</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </td>
                <td> </td>
              </tr>
            </table>

            <Table bordered className="custom-table print-table">
              <thead>
                <tr>
                  <th>Delivery at</th>
                  <th>Tax ID No. 1</th>
                  <th>Tax ID No. 2</th>
                  <th>Tax ID No. 3 </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.projectDeliveryAt}</td>
                  <td />
                  <td />
                  <td />
                </tr>
              </tbody>
            </Table>

            <Table bordered responsive hover className="custom-table gray-row">
              <thead>
                <tr>
                  <th style={{ minWidth: "65px" }}> </th>
                  <th>S. No.</th>
                  <th>Part Number</th>
                  <th>Description</th>
                  <th>Unit Rate</th>
                  <th>Unit </th>
                  <th>Quantity</th>
                  <th>Sub Total</th>
                  <th>Tax 1</th>
                  <th>Tax 2</th>
                  <th>Tax 3</th>
                  <th>Grand Total</th>
                </tr>
              </thead>
              <tbody>
                {this.state.finalData &&
                  this.state.finalData.map((item, index) => {
                    return (
                      <tr>
                        <td>
                          <span
                            className={
                              index % 4 === 0
                                ? "r-caret red"
                                : index % 4 === 1
                                ? "r-caret green"
                                : index % 4 === 2
                                ? "r-caret blue"
                                : "r-caret yellow"
                            }
                          />
                          <label className="label--checkbox">
                            <input
                              type="checkbox"
                              className="checkbox"
                              checked={
                                this.state.listOfPOReleaseRequest &&
                                this.state.listOfPOReleaseRequest[index] &&
                                this.state.listOfPOReleaseRequest[index].flag
                              }
                              disabled
                            />
                          </label>
                        </td>
                        <td>{index + 1}</td>
                        <td>{item.partNumber}</td>
                        <td>{item.partDescription}</td>
                        <td />
                        <td>{item.units}</td>
                        <td>{item.quantity}</td>
                        <td>
                          {item.listOfQuotationDetails &&
                            item.listOfQuotationDetails[0].subtotal}
                        </td>
                        <td>
                          <FormGroup className="m-b-0  w-150">
                            <FormControl
                              type="text"
                              className="b-0 br-0 "
                              name="taxId"
                              value={
                                this.state.listOfPOReleaseRequest &&
                                this.state.listOfPOReleaseRequest[index] &&
                                this.state.listOfPOReleaseRequest[index]
                                  .listOfTaxIds &&
                                this.state.listOfPOReleaseRequest[index]
                                  .listOfTaxIds[0] &&
                                this.state.listOfPOReleaseRequest[index]
                                  .listOfTaxIds[0].taxId
                              }
                              disabled
                            />
                            <FormControl.Feedback />
                          </FormGroup>
                        </td>

                        <td>
                          <FormGroup className="m-b-0 w-150">
                            <FormControl
                              type="text"
                              className="b-0 br-0 "
                              name="taxId"
                              value={
                                this.state.listOfPOReleaseRequest &&
                                this.state.listOfPOReleaseRequest[index] &&
                                this.state.listOfPOReleaseRequest[index]
                                  .listOfTaxIds &&
                                this.state.listOfPOReleaseRequest[index]
                                  .listOfTaxIds[1] &&
                                this.state.listOfPOReleaseRequest[index]
                                  .listOfTaxIds[1].taxId
                              }
                              disabled
                            />
                            <FormControl.Feedback />
                          </FormGroup>
                        </td>

                        <td>
                          <FormGroup className="m-b-0  w-150">
                            <FormControl
                              type="text"
                              className="b-0 br-0 "
                              name="taxId"
                              value={
                                this.state.listOfPOReleaseRequest &&
                                this.state.listOfPOReleaseRequest[index] &&
                                this.state.listOfPOReleaseRequest[index]
                                  .listOfTaxIds &&
                                this.state.listOfPOReleaseRequest[index]
                                  .listOfTaxIds[2] &&
                                this.state.listOfPOReleaseRequest[index]
                                  .listOfTaxIds[2].taxId
                              }
                              disabled
                            />
                            <FormControl.Feedback />
                          </FormGroup>
                        </td>

                        <td>
                          <td>
                            {this.state.listOfPOReleaseRequest[index] &&
                              this.state.listOfPOReleaseRequest[index]
                                .grandTotal &&
                              this.state.listOfPOReleaseRequest[
                                index
                              ].grandTotal.toFixed(2)}
                          </td>
                        </td>
                      </tr>
                    );
                  })}
                {/* ; })} */}
              </tbody>
            </Table>

            <table>
              <tr>
                <td>
                  <Table bordered className="custom-table print-table">
                    <thead>
                      <tr>
                        <th>{""}</th>
                        <th className="text-left">Terms</th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.termArray &&
                        this.state.termArray.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-left">{item}</td>
                            </tr>
                          );
                        })}

                      {/* <tr>
                        <td>1.</td>
                        <td className="text-left">Terms goes here</td>
                      </tr>
                      <tr>
                        <td>2.</td>
                        <td className="text-left">
                          Terms goes here Terms goes here Terms goes here
                        </td>
                      </tr> */}
                    </tbody>
                  </Table>
                </td>
                <td> </td>
              </tr>
            </table>
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
      actionLoaderHide,
      actionLoaderShow,
      actionTabData,
      actionReleasePOList,
      actionUploadImage,
      actionSubmitReleasePOList,
      actionDeleteRevisionImage
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

ReleasePO = validation(strategy)(ReleasePO);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReleasePO);
