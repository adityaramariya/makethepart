import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  Table,
  ControlLabel,
  Form,
  InputGroup,
  MenuItem,
  DropdownButton,
  Button
} from "react-bootstrap";
import * as Datetime from "react-datetime";
import Constant from "../../common/core/config/appConfig";
import "react-datetime/css/react-datetime.css";
import * as moment from "moment";

import Image1 from "../../img/image.png";
import Image2 from "../../img/excel.png";
import Sprite from "../../img/sprite.svg";
import Search from "../../img/search.png";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import userImage from "../../img/user.jpg";

import {
  actionUserLogout,
  actionLoaderHide,
  actionLoaderShow,
  actionGetProjectList,
  actionAddProject,
  actionUploadImage,
  actionUploadSpecification,
  actionAddParts,
  actionCreatePartWithMedia,
  actionClearAddPartData,
  actionSubmitQuotation,
  actionTabClick
} from "../../common/core/redux/actions";
import { topPosition } from "../../common/commonFunctions";
import Modal from "react-bootstrap/es/Modal";
import ReactToPrint from "react-to-print";
import QuotationPriview from "./quotationPreview";

class Quotation extends Component {
  constructor(props) {
    super(props);

    this.partDetailObject = {
      operations: "",
      description: "",
      sourceCountry: "",
      specification: "",
      toolLife: "",
      length: "",
      weight: "",
      rate: "",
      quantity: "",
      price: "",
      commments: "",
      time: ""
    };

    this.state = {
      rawMaterialCount: 2,
      toolCount: 2,
      operationCount: 1,
      logisticsCount: 0,
      packagingCount: 0,
      taxCount: 0,
      partDetailArray: [
        { ...this.partDetailObject },
        { ...this.partDetailObject }
      ],
      packagingArray: [],
      partDetailArrayIndex: "",
      priceArray: [],
      totalArray: [],
      finalPrice: "",
      priceArrayToolCost: [],
      targetDate:
        this.props.supplierData &&
        this.props.supplierData.partDataForQuotation.targetDate,
      tabKey: "quotation",
      showReview: false
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.addRawMaterial = this.addRawMaterial.bind(this);
    this.addTool = this.addTool.bind(this);
    this.addOperation = this.addOperation.bind(this);
    this.addLogistics = this.addLogistics.bind(this);
    this.addPackaging = this.addPackaging.bind(this);
    this.addTax = this.addTax.bind(this);
    this.handlePartDetailFieldChange = this.handlePartDetailFieldChange.bind(
      this
    );
    this.handlePackageDetailFieldChange = this.handlePackageDetailFieldChange.bind(
      this
    );
    this.handlePartDetailFieldBlur = this.handlePartDetailFieldBlur.bind(this);
    this.handlePackageDetailFieldBlur = this.handlePackageDetailFieldBlur.bind(
      this
    );
    this.submitQuotation = this.submitQuotation.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnChangeDate = this.handleOnChangeDate.bind(this);
    this.handleFinalTotalChange = this.handleFinalTotalChange.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.handlePartDetailReview = this.handlePartDetailReview.bind(this);
    this.handleCloseReview = this.handleCloseReview.bind(this);
  }

  componentWillMount() {
    this.setState({
      partDetailArray: [
        {
          operations: "Raw Material 1",
          description: "",
          sourceCountry: "",
          specification: "",
          toolLife: "",
          length: "",
          weight: "",
          rate: "",
          quantity: "",
          price: "",
          comments: "",
          time: ""
        },
        {
          operations: "Raw Material 2 ",
          description: "",
          sourceCountry: "",
          specification: " ",
          toolLife: "",
          length: "",
          weight: "",
          rate: "",
          quantity: "",
          price: "",
          comments: "",
          time: ""
        },
        {
          operations: "Machine 1",
          description: " ",
          sourceCountry: "",
          specification: " ",
          toolLife: "",
          length: "",
          weight: "",
          rate: "",
          quantity: "",
          price: "",
          comments: "",
          time: ""
        },
        {
          operations: "Machine 2",
          description: " ",
          sourceCountry: "",
          specification: "",
          toolLife: "",
          length: "",
          weight: "",
          rate: "",
          quantity: "",
          price: "",
          comments: "  ",
          time: " "
        },
        {
          operations: "Tools 1",
          description: " ",
          sourceCountry: "",
          specification: " ",
          toolLife: "",
          length: "",
          weight: "",
          rate: "",
          quantity: "",
          price: "",
          comments: "  ",
          time: " "
        },
        {
          operations: "Tools 2",
          description: "",
          sourceCountry: "",
          specification: " ",
          toolLife: "",
          length: "",
          weight: "",
          rate: "",
          quantity: "",
          price: "",
          comments: "",
          time: ""
        }
      ]
    });
  }

  navigateTo(data) {
    this.props.actionTabClick(data);
  }

  activeTabKeyAction(tabKey) {
    // if (tabKey === 'first') this.props.history.push('home');
    // if (tabKey === 'second') this.props.history.push('home');
    // if (tabKey === 'third') this.props.history.push('home');
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

  handlePartDetailReview(data) {
    this.setState(
      {
        reviewData: data
      },
      () => {
        this.setState({
          showReview: true
        });
      }
    );
  }

  handleCloseReview() {
    this.setState({ showReview: false });
  }

  handleLogout() {
    try {
      const roleId = this.props.userInfo.userData.userRole;
      const userId = this.props.userInfo.userData.id;
      this.props.actionUserLogout({ roleId, userId });
    } catch (error) {}
  }

  handlePartDetailFieldChange(event, index, stateName) {
    const { value } = event.target;
    this.setState((prevState, props) => {
      prevState.partDetailArray[index][stateName] = value;
      return {
        partDetailArray: prevState.partDetailArray,
        [stateName + index]: value
      };
    });
    // partDetailArray = this.state.partDetailArray;
    // partDetailArray[index][stateName] = value;
    // this.setState({
    //   partDetailArray: partDetailArray
    // });
  }
  handlePartDetailFieldBlur(event, index, operation) {
    const sum = (first, second) => parseInt(first) + parseInt(second);
    const { value } = event.target;
    let subtotal;
    let toolCost;
    let priceArray = [];
    let priceArrayToolCost = [];
    priceArrayToolCost = this.state.priceArrayToolCost;
    priceArray = this.state.priceArray;
    if (value) {
      if (operation.includes("Tools")) {
        priceArrayToolCost[index] = value;
        this.setState({
          priceArrayToolCost: priceArrayToolCost
        });
        toolCost = priceArrayToolCost.reduce(sum);
      }
      priceArray[index] = value;

      this.setState({
        priceArray: priceArray
      });
      subtotal = priceArray.reduce(sum);
      let partDetailArrayLength = this.state.partDetailArray.length;
      let addTotal = 0;
      let addTotal1 = 0;
      let addTotal2 = 0;
      if (partDetailArrayLength) {
        for (let index = 0; index < partDetailArrayLength; index++) {
          if (parseInt(this.state.partDetailArray[index]["price"])) {
            let price = parseInt(this.state.partDetailArray[index]["price"]);
            let priceTwo = parseInt(addTotal);
            addTotal = price + priceTwo;
          }
        }
      }
      let packagingArrayLength = this.state.packagingArray.length;
      if (packagingArrayLength) {
        for (let indexj = 0; indexj < packagingArrayLength; indexj++) {
          if (parseInt(this.state.packagingArray[indexj]["detail"])) {
            let detail = parseInt(this.state.packagingArray[indexj]["detail"]);
            let priceThree = parseInt(addTotal);
            addTotal = detail + priceThree;
          }
        }
      }
      if (addTotal) {
        let totalPrice = addTotal; //parseInt(value) + parseInt(this.state.totalPrice);
        this.setState({
          subtotal: subtotal,
          totalPrice: totalPrice,
          finalPrice: totalPrice,
          toolCost: toolCost
        });
      } else {
        this.setState({
          subtotal: subtotal,
          totalPrice: subtotal,
          finalPrice: subtotal,
          toolCost: toolCost
        });
      }
    }
  }
  handlePackageDetailFieldBlur(event, index) {
    const sum = (first, second) => parseInt(first) + parseInt(second);
    const { value } = event.target;
    let totalPrice;
    let totalArray = [];
    totalArray = this.state.totalArray;
    if (value) {
      totalArray[index] = value;

      this.setState({
        totalArray: totalArray
      });
      totalPrice = totalArray.reduce(sum);
      if (this.state.subtotal) {
        totalPrice = parseInt(totalPrice) + parseInt(this.state.subtotal);
      } else {
        totalPrice = parseInt(totalPrice);
      }

      this.setState({
        totalPrice: totalPrice,
        finalPrice: totalPrice
      });
    }
  }

  handlePackageDetailFieldChange(event, index, stateName) {
    const { value } = event.target;
    this.setState((prevState, props) => {
      prevState.packagingArray[index][stateName] = value;
      return {
        packagingArray: prevState.packagingArray,
        [stateName + index]: value
      };
    });
  }
  handleFinalTotalChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  submitQuotation() {
    let _this = this;
    const covertToTimeStamp = momentObject => {
      return moment(momentObject).format("X");
    };
    let data = {
      quotationForPart: this.props.supplierData.partDataForQuotation.id,
      quotationForQuantity: this.state.quotationQty,
      deliveryLeadTime: this.state.deliveryTime,
      deliveryLeadTimeUnit: parseInt(this.state.deliveryLeadTimeUnit) || 1,
      // deliveryCommitment: this.state.deliveryCommitment,
      deliveryTargetDate: covertToTimeStamp(this.state.deliveryDate),
      totalPrice: this.state.totalPrice,
      listOfQuotationDetails: [
        {
          operations: "string",
          description: "string",
          sourceCountry: "string",
          specification: "string",
          toolLife: "string",
          length: "string",
          weight: "string",
          rate: 0,
          quantity: 0,
          price: "string",
          comments: "string",
          time: 0
        }
      ],
      creatorSupplierUserDetails: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      subtotal: this.state.subtotal,
      currency: this.state.currency || "INR",
      toolingCost: this.state.toolCost
      // packaging: 0,
      // logistics: 0
    };
    data.listOfQuotationDetails = [
      ...this.state.partDetailArray,
      ...this.state.packagingArray
    ];

    this.props
      .actionSubmitQuotation(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  addRawMaterial() {
    // this.setState((prevState, props) => ({
    //   contactArray: [...prevState.partDetailArray, [...this.partDetailObject]]
    // }));
    let rawMaterialCount = this.state.rawMaterialCount;
    rawMaterialCount++;
    let data = {
      operations: "Raw Material " + rawMaterialCount,
      description: "",
      sourceCountry: "",
      specification: "",
      toolLife: "",
      length: "",
      weight: "",
      rate: "",
      quantity: "",
      price: "",
      commments: "",
      time: ""
    };
    let partDetailArray = this.state.partDetailArray;
    partDetailArray.push(data);
    this.setState({
      partDetailArray: partDetailArray,
      rawMaterialCount: rawMaterialCount
    });
  }

  addTool() {
    let toolCount = this.state.toolCount;
    toolCount++;
    let data = {
      operations: "Tools " + toolCount,
      description: "",
      sourceCountry: "",
      specification: "",
      toolLife: "",
      length: "",
      weight: "",
      rate: "",
      quantity: "",
      price: "",
      commments: "",
      time: ""
    };
    let partDetailArray = this.state.partDetailArray;
    partDetailArray.push(data);
    this.setState({
      partDetailArray: partDetailArray,
      toolCount: toolCount
    });
  }

  addOperation() {
    let operationCount = this.state.operationCount;
    operationCount++;
    let data = {
      operations: "operation " + operationCount,
      description: "",
      sourceCountry: "",
      specification: "",
      toolLife: "",
      length: "",
      weight: "",
      rate: "",
      quantity: "",
      price: "",
      commments: "",
      time: ""
    };
    let partDetailArray = this.state.partDetailArray;
    partDetailArray.push(data);
    this.setState({
      partDetailArray: partDetailArray,
      operationCount: operationCount
    });
  }

  addLogistics() {
    let logisticsCount = this.state.logisticsCount;
    logisticsCount++;
    let data = {
      operations: "Logistic " + logisticsCount,
      detail: ""
    };
    let packagingArray = this.state.packagingArray;
    packagingArray.push(data);
    this.setState({
      packagingArray: packagingArray,
      logisticsCount: logisticsCount
    });
  }

  addPackaging() {
    let packagingCount = this.state.packagingCount;
    packagingCount++;
    let data = {
      operations: "Packaging " + packagingCount,
      detail: ""
    };
    let packagingArray = this.state.packagingArray;
    packagingArray.push(data);
    this.setState({
      packagingArray: packagingArray,
      packagingCount: packagingCount
    });
  }

  addTax() {
    let taxCount = this.state.taxCount;
    taxCount++;
    let data = {
      operations: "Tax " + taxCount,
      description: "",
      sourceCountry: "",
      specification: "",
      toolLife: "",
      length: "",
      weight: "",
      rate: "",
      quantity: "",
      price: "",
      commments: "",
      time: ""
    };
    let partDetailArray = this.state.partDetailArray;
    partDetailArray.push(data);
    this.setState({
      partDetailArray: partDetailArray,
      taxCount: taxCount
    });
  }

  handleOnChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleOnChangeDate(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  printpage() {
    window.print();
  }

  printScreen() {}

  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === "quotation" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="userMain">
                <div className="container">
                  <div className="userWrapper flex align-center justify-space-between">
                    <h4>Welcome Justin to your profile</h4>
                    <div>
                      <div className="uAvtar">
                        <img src={userImage} />
                      </div>
                      <div className="upload-btn cursor-pointer sm-upload">
                        <FormControl
                          id="formControlsFile"
                          type="file"
                          label="File"
                        />
                        Edit Picture
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <section className="uInfoContainer">
                <Row className="show-grid">
                  <Col md={6} className="">
                    <FormGroup className="group">
                      <span className="ico-in">
                        <svg>
                          <use xlinkHref={`${Sprite}#userIco`} />
                        </svg>
                      </span>
                      <FormControl type="text" name="companyName" required />

                      <FormControl.Feedback />
                      <span className="highlight" />
                      <span className="bar" />

                      <ControlLabel>Name</ControlLabel>
                    </FormGroup>
                  </Col>
                  <Col md={6} className="">
                    <FormGroup className="group">
                      <span className="ico-in">
                        <svg>
                          <use xlinkHref={`${Sprite}#mobileIco`} />
                        </svg>
                      </span>
                      <FormControl type="text" name="companyName" required />

                      <FormControl.Feedback />
                      <span className="highlight" />
                      <span className="bar" />

                      <ControlLabel>Mobil Numbere</ControlLabel>
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col md={6} className="">
                    <FormGroup className="group">
                      <span className="ico-in">
                        <svg>
                          <use xlinkHref={`${Sprite}#bagIco`} />
                        </svg>
                      </span>
                      <FormControl type="text" name="companyName" required />

                      <FormControl.Feedback />
                      <span className="highlight" />
                      <span className="bar" />

                      <ControlLabel>Designation</ControlLabel>
                    </FormGroup>
                  </Col>
                  <Col md={6} className="">
                    <FormGroup className="group">
                      <span className="ico-in">
                        <svg>
                          <use xlinkHref={`${Sprite}#envelopIco`} />
                        </svg>
                      </span>
                      <FormControl type="text" name="companyName" required />

                      <FormControl.Feedback />
                      <span className="highlight" />
                      <span className="bar" />

                      <ControlLabel>Email</ControlLabel>
                    </FormGroup>
                  </Col>
                </Row>

                <div className="editLogo m-b-30 text-center">
                  <span className="color-light">Company Logo</span>

                  <div className="gray-card editLogoBox text-center p-20">
                    <div className="logoImg">
                      <img src={userImage} />
                    </div>
                    <div className="upload-btn cursor-pointer sm-upload">
                      <FormControl
                        id="formControlsFile"
                        type="file"
                        label="File"
                      />
                      <span className="pic-Icon">
                        <svg>
                          <use xlinkHref={`${Sprite}#editPicIco`} />
                        </svg>
                      </span>
                      Edit Picture
                    </div>
                  </div>
                </div>

                <div className="text-center m-t-20 m-b-50">
                  <button className="btn btn-default text-uppercase">
                    save
                  </button>
                  <button className="btn btn-success text-uppercase">
                    cancel
                  </button>
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
                        <a className="disabled">
                          Update financial & legal testimonials
                        </a>
                      </li>

                      <li>
                        <a className="disabled">Quality certification</a>
                      </li>
                      <li>
                        <a className="disabled">Major Account Details</a>
                      </li>
                      <li>
                        <a className="disabled">Facility pictures</a>
                      </li>
                    </ul>

                    <ul className="p-tags">
                      <li>
                        <Link
                          to="home"
                          // onClick={() => this.navigateTo('second')}
                        >
                          Review Part for Quotation
                        </Link>
                      </li>
                      <li>
                        <a className="disabled">Buyer Criteria</a>
                      </li>

                      <li>
                        <Link
                          // to="home"
                          // onClick={() => this.navigateTo('third')}
                          to={{
                            pathname: "home",
                            state: { path: "third" }
                          }}
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
                      <li>
                        <Link to="addUser">Add Users</Link>
                      </li>
                      <li>
                        <Link to="updatePartStatus">Update Parts Status</Link>
                      </li>
                      <li>
                        <a className="disabled">Download Parts Summary</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        ) : null}

        <div>
          <Modal
            show={this.state.showReview}
            onHide={this.handleCloseReview}
            className="custom-popUp modal-xl"
          >
            <Modal.Header>
              <Modal.Title>
                <div className="flex justify-space-between">
                  <h4 className="fw-600 m-b-0">Quotation Summary</h4>
                  <button
                    onClick={this.handleCloseReview}
                    className="btn btn-link text-uppercase color-light sm-btn"
                  >
                    close
                  </button>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div className="flex justify-space-between">
                  <h4 className="printHeading">Quotation Summary</h4>
                  <span className="print-btn">
                    <ReactToPrint
                      trigger={() => (
                        <a href="#">
                          {" "}
                          <span className="ico-print">
                            <svg>
                              <use xlinkHref={`${Sprite}#printIco`} />
                            </svg>
                          </span>{" "}
                          Print Preview
                        </a>
                      )}
                      content={() => this.componentRef}
                      onClick={() => {
                        this.printScreen();
                      }}
                    />
                  </span>
                  {/* <button
                    onClick={()=>{this.printpage()}}
                    className="btn btn-link text-uppercase color-light sm-btn"
                  >
                    print page
                  </button> */}
                </div>

                <div
                  className="printableTable"
                  ref={el => (this.componentRef = el)}
                >
                  <Row className="show-grid">
                    <Col md={6}>
                      <div>
                        <Table
                          responsive
                          className="no-border-table custom-table t-pad-set"
                        >
                          <tbody>
                            <tr>
                              <td className="color-light">Supplier:</td>
                              <td>
                                {this.props.userInfo &&
                                  this.props.userInfo.userData.companyName}
                              </td>
                            </tr>
                            <tr>
                              <td className="color-light">Contact:</td>
                              <td>
                                {this.props.userInfo &&
                                this.props.userInfo.userData.fullname
                                  ? this.props.userInfo.userData.fullname.trim()
                                  : ""}
                                ,&nbsp;
                                {this.props.userInfo &&
                                this.props.userInfo.userData.contactNo
                                  ? this.props.userInfo.userData.contactNo.trim()
                                  : ""}
                              </td>
                            </tr>
                            <tr>
                              <td className="color-light">Part Code:</td>
                              <td>
                                {this.props.supplierData &&
                                  this.props.supplierData.partDataForQuotation
                                    .partNumber}
                              </td>
                            </tr>
                            <tr>
                              <td className="color-light">Provided Through:</td>
                              <td>makethepart.com</td>
                            </tr>
                            <tr>
                              <td className="color-light">Currency:</td>
                              <td>{this.state.currency}</td>
                              <td />
                            </tr>
                            <tr>
                              <td className="color-light">
                                Quotation for Quantity:
                              </td>
                              <td>{this.state.quotationQty}</td>
                              <td />
                            </tr>
                            <tr>
                              <td className="color-light">
                                Delivery Lead Time:
                              </td>
                              <td>
                                {this.state.deliveryTime &&
                                  moment(this.state.deliveryTime).format(
                                    "HH MM"
                                  )}
                              </td>
                              <td />
                            </tr>
                            <tr>
                              <td className="color-light"> Target Date:</td>
                              <td>
                                {this.state.targetDate &&
                                  moment(this.state.targetDate).format(
                                    "YYYY/MM/DD"
                                  )}
                              </td>
                              <td />
                            </tr>
                            <tr>
                              <td className="color-light">
                                Delivery Commitment:
                              </td>
                              <td>{this.state.deliveryDate}</td>
                              <td />
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                  <Table
                    bordered
                    responsive
                    className="table-bordered custom-table col-border"
                  >
                    <thead>
                      <tr>
                        <th>Operations</th>
                        <th>Decription</th>
                        <th>Source (Country)</th>
                        <th>Specification</th>
                        <th>Tool Life(qty)</th>
                        <th>Time</th>
                        <th>Length</th>
                        <th>Weight</th>
                        <th>Rate</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.partDetailArray.map((item, index) => {
                        return [
                          <tr>
                            <td>{item.operations}</td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].description
                                : ""}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index]
                                    .sourceCountry
                                : ""}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index]
                                    .specification
                                : ""}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].toolLife
                                : ""}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].time
                                : ""}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].length
                                : ""}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].weight
                                : ""}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].rate
                                : ""}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].quantity
                                : ""}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].price
                                : ""}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].comments
                                : ""}
                            </td>
                          </tr>
                        ];
                      })}
                      <tr>
                        <td>Tool Cost</td>
                        <td colSpan="2">{this.state.toolCost}</td>
                      </tr>
                      <tr>
                        <td>Subtotal</td>
                        <td colSpan="2">{this.state.subtotal}</td>
                      </tr>

                      {this.state.packagingArray.map((item, index) => {
                        return [
                          <tr>
                            <td>{item.operations}</td>
                            <td colSpan="2">
                              {this.state.packagingArray[index]
                                ? this.state.packagingArray[index].detail
                                : ""}
                            </td>
                          </tr>,
                          <tr />
                        ];
                      })}
                      <tr>
                        <td className="fw-800">Total</td>
                        <td colSpan="2">{this.state.totalPrice}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionUserLogout,
      actionLoaderHide,
      actionLoaderShow,
      actionGetProjectList,
      actionAddProject,
      actionUploadImage,
      actionUploadSpecification,
      actionAddParts,
      actionCreatePartWithMedia,
      actionClearAddPartData,
      actionSubmitQuotation,
      actionTabClick
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User,
    supplierParts: state.supplierParts,
    supplierData: state.supplierData
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Quotation);
