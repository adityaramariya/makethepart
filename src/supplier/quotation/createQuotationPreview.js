import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
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
} from 'react-bootstrap';
import * as Datetime from 'react-datetime';
import Constant from '../../common/core/config/appConfig';
import 'react-datetime/css/react-datetime.css';
import * as moment from 'moment';

import Image1 from '../../img/image.png';
import Image2 from '../../img/excel.png';
import Sprite from '../../img/sprite.svg';
import Search from '../../img/search.png';
import Header from '../common/header';
import SideBar from '../common/sideBar';
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
} from '../../common/core/redux/actions';
import { topPosition } from '../../common/commonFunctions';
import Modal from 'react-bootstrap/es/Modal';
import ReactToPrint from 'react-to-print';
import QuotationPriview from './quotationPreview';

class Quotation extends Component {
  constructor(props) {
    super(props);

    this.partDetailObject = {
      operations: '',
      description: '',
      sourceCountry: '',
      specification: '',
      toolLife: '',
      length: '',
      weight: '',
      rate: '',
      quantity: '',
      price: '',
      commments: '',
      time: ''
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
      partDetailArrayIndex: '',
      priceArray: [],
      totalArray: [],
      finalPrice: '',
      priceArrayToolCost: [],
      targetDate:
        this.props.supplierData &&
        this.props.supplierData.partDataForQuotation.targetDate,
      tabKey: 'quotation',
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
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    this.setState({
      partDetailArray: [
        {
          operations: 'Raw Material 1',
          description: '',
          sourceCountry: '',
          specification: '',
          toolLife: '',
          length: '',
          weight: '',
          rate: '',
          quantity: '',
          price: '',
          comments: '',
          time: ''
        },
        {
          operations: 'Raw Material 2 ',
          description: '',
          sourceCountry: '',
          specification: ' ',
          toolLife: '',
          length: '',
          weight: '',
          rate: '',
          quantity: '',
          price: '',
          comments: '',
          time: ''
        },
        {
          operations: 'Machine 1',
          description: ' ',
          sourceCountry: '',
          specification: ' ',
          toolLife: '',
          length: '',
          weight: '',
          rate: '',
          quantity: '',
          price: '',
          comments: '',
          time: ''
        },
        {
          operations: 'Machine 2',
          description: ' ',
          sourceCountry: '',
          specification: '',
          toolLife: '',
          length: '',
          weight: '',
          rate: '',
          quantity: '',
          price: '',
          comments: '  ',
          time: ' '
        },
        {
          operations: 'Tools 1',
          description: ' ',
          sourceCountry: '',
          specification: ' ',
          toolLife: '',
          length: '',
          weight: '',
          rate: '',
          quantity: '',
          price: '',
          comments: '  ',
          time: ' '
        },
        {
          operations: 'Tools 2',
          description: '',
          sourceCountry: '',
          specification: ' ',
          toolLife: '',
          length: '',
          weight: '',
          rate: '',
          quantity: '',
          price: '',
          comments: '',
          time: ''
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
    if (tabKey === 'first')
      this.props.history.push({
        pathname: 'home',
        state: { path: 'first' }
      });
    if (tabKey === 'second') this.props.history.push('home');
    if (tabKey === 'third')
      this.props.history.push({
        pathname: 'home',
        state: { path: 'third' }
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
      if (operation.includes('Tools')) {
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
          if (parseInt(this.state.partDetailArray[index]['price'])) {
            let price = parseInt(this.state.partDetailArray[index]['price']);
            let priceTwo = parseInt(addTotal);
            addTotal = price + priceTwo;
          }
        }
      }
      let packagingArrayLength = this.state.packagingArray.length;
      if (packagingArrayLength) {
        for (let indexj = 0; indexj < packagingArrayLength; indexj++) {
          if (parseInt(this.state.packagingArray[indexj]['detail'])) {
            let detail = parseInt(this.state.packagingArray[indexj]['detail']);
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
      return moment(momentObject).format('X');
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
          operations: 'string',
          description: 'string',
          sourceCountry: 'string',
          specification: 'string',
          toolLife: 'string',
          length: 'string',
          weight: 'string',
          rate: 0,
          quantity: 0,
          price: 'string',
          comments: 'string',
          time: 0
        }
      ],
      creatorSupplierUserDetails: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      subtotal: this.state.subtotal,
      currency: this.state.currency || 'INR',
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
      operations: 'Raw Material ' + rawMaterialCount,
      description: '',
      sourceCountry: '',
      specification: '',
      toolLife: '',
      length: '',
      weight: '',
      rate: '',
      quantity: '',
      price: '',
      commments: '',
      time: ''
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
      operations: 'Tools ' + toolCount,
      description: '',
      sourceCountry: '',
      specification: '',
      toolLife: '',
      length: '',
      weight: '',
      rate: '',
      quantity: '',
      price: '',
      commments: '',
      time: ''
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
      operations: 'operation ' + operationCount,
      description: '',
      sourceCountry: '',
      specification: '',
      toolLife: '',
      length: '',
      weight: '',
      rate: '',
      quantity: '',
      price: '',
      commments: '',
      time: ''
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
      operations: 'Logistic ' + logisticsCount,
      detail: ''
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
      operations: 'Packaging ' + packagingCount,
      detail: ''
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
      operations: 'Tax ' + taxCount,
      description: '',
      sourceCountry: '',
      specification: '',
      toolLife: '',
      length: '',
      weight: '',
      rate: '',
      quantity: '',
      price: '',
      commments: '',
      time: ''
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
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  printScreen() {}

  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === 'quotation' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <Button
                  bsStyle="primary"
                  bsSize="large"
                  onClick={this.handleShow}
                >
                  Launch demo modal
                </Button>

                <Modal
                  show={this.state.show}
                  onHide={this.handleClose}
                  className="custom-popUp modal-xl "
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Create Quotation Preview</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <h4 className="">Proto Tool</h4>
                    <div>
                      <Table
                        bordered
                        responsive
                        className="custom-table cell-input"
                      >
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Source (Country)</th>
                            <th>Specification</th>
                            <th>Tool Life (qty)</th>
                            <th>Unit Cost</th>
                            <th>Quantity</th>
                            <th>Total Cost</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>nfg</td>
                            <td>fghnhg</td>
                            <td>fghn</td>
                            <td>gnjhg</td>
                            <td>fgn</td>
                            <td>ghjn</td>
                            <td>ghjn</td>
                            <td>ghjn</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <h4>Proto Part</h4>
                    <div>
                      <Table
                        bordered
                        responsive
                        className="custom-table cell-input"
                      >
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Source (Country)</th>
                            <th>Specification</th>
                            <th>Units</th>
                            <th>Gross Qty</th>
                            <th>Finished Qty</th>
                            <th>Raw Material Rate</th>
                            <th>Scrap Qty</th>
                            <th>Scrap Rate</th>
                            <th>Scrap Recovery</th>
                            <th>Final Raw Material Rate</th>
                            <th>Tax 1 Description</th>
                            <th>Tax Rate</th>
                            <th>Tax</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>jjj</td>
                            <td>jjj</td>
                            <td>jj</td>
                            <td>jj</td>
                            <td>jj</td>
                            <td>jj</td>
                            <td>jjj</td>
                            <td>jj</td>
                            <td>jj</td>
                            <td>jjj</td>
                            <td>jj</td>
                            <td>jj</td>
                            <td>jj</td>
                            <td>jj</td>
                            <td>jj</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>

                    <h4>Process/Operation</h4>
                    <div>
                      <Table
                        bordered
                        responsive
                        className="custom-table cell-input"
                      >
                        <thead>
                          <tr>
                            <th>Machine/Tool/Equipment</th>
                            <th>Speed</th>
                            <th>Feed</th>
                            <th>Time</th>
                            <th>Cost/Time</th>
                            <th>Weight</th>
                            <th>Cost/Weight</th>
                            <th>Diameter</th>
                            <th>Cost/Diameter</th>
                            <th>Length</th>
                            <th>Cost/Length</th>
                            <th>Width</th>
                            <th>Cost/Width</th>
                            <th>Depth</th>
                            <th>Cost/Depth</th>
                            <th>Volume</th>
                            <th>Cost/Volume</th>
                            <th>Setting up Time</th>
                            <th>Cost/Setting up Time</th>
                            <th>Labour</th>
                            <th>Total</th>
                          </tr>
                          <tr className="h-10"> </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>hhh</td>
                            <td>hhh</td>
                            <td>hh</td>
                            <td>hh</td>
                            <td>jj</td>
                            <td>hhh</td>
                            <td>hhh</td>
                            <td>hhh</td>
                            <td>hh</td>
                            <td>ggg</td>
                            <td>ggg</td>
                            <td>ggg</td>
                            <td>hhh</td>
                            <td>hhh</td>
                            <td>hh</td>
                            <td>hh</td>
                            <td>jj</td>
                            <td>hhh</td>
                            <td>hhh</td>
                            <td>hhh</td>
                            <td>hh</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <Row>
                      <Col md={12}>
                        <div className="text-right">
                          <ControlLabel className="fw-normal color-light">
                            Subtotal
                          </ControlLabel>

                          <p>lk;lk</p>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form horizontal>
                          <FormGroup controlId="formHorizontalEmail">
                            <Col
                              componentClass={ControlLabel}
                              sm={4}
                              className="color-light fw-normal text-left"
                            >
                              Quotation for Quantity:
                            </Col>
                            <Col sm={6}>hhh</Col>
                          </FormGroup>
                          <FormGroup controlId="formHorizontalPassword">
                            <Col
                              componentClass={ControlLabel}
                              sm={4}
                              className="color-light fw-normal text-left"
                            >
                              Delivery Lead Time:
                            </Col>
                            <Col sm={6}>hh</Col>
                          </FormGroup>
                          <FormGroup controlId="formHorizontalPassword">
                            <Col
                              componentClass={ControlLabel}
                              sm={4}
                              className="color-light fw-normal text-left"
                            >
                              Target Date:
                            </Col>
                            <Col sm={6}>hhh</Col>
                          </FormGroup>
                        </Form>
                      </Col>

                      <Col md={6}>
                        <div className="tax-info-wrap">
                          <Table className="m-b-0">
                            <thead>
                              <tr>
                                <th />
                                <th className="color-light">Description</th>
                                <th className="color-light">Rate</th>
                                <th className="color-light">Tax</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="fw-600">Tax 1</td>
                                <td>fff</td>
                                <td>fff</td>
                                <td>ff</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                        <div className="text-right m-b-20">
                          <div className="total-box">
                            <Table responsive className="m-b-0">
                              <tbody>
                                <tr>
                                  <td>Total Process:</td>
                                  <td className="w-125">fff</td>
                                </tr>
                                <tr>
                                  <td>Packaging:</td>
                                  <td>fff</td>
                                </tr>
                                <tr>
                                  <td>Logistics:</td>
                                  <td>fff</td>
                                </tr>
                                <tr>
                                  <td>Grand Total:</td>
                                  <td>fff</td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Modal.Body>
                  {/* <Modal.Footer>
                    <Button onClick={this.handleClose}>Close</Button>
                  </Modal.Footer> */}
                </Modal>

                <div className="tax-info-wrap">
                  <Table className="m-b-0">
                    <thead>
                      <tr>
                        <th />
                        <th className="color-light">Description</th>
                        <th className="color-light">Rate</th>
                        <th className="color-light">Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fw-600">Tax 1</td>
                        <td>
                          <FormGroup className="mb-0">
                            <FormControl className="br-0" type="text" />
                            <FormControl.Feedback />
                          </FormGroup>
                        </td>
                        <td>
                          <FormGroup className="mb-0">
                            <FormControl className="br-0" type="text" />
                            <FormControl.Feedback />
                          </FormGroup>
                        </td>
                        <td>
                          <FormGroup className="mb-0">
                            <FormControl className="br-0" type="text" />
                            <FormControl.Feedback />
                          </FormGroup>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-600">Tax 1</td>
                        <td>
                          <FormGroup>
                            <FormControl className="br-0" type="text" />
                            <FormControl.Feedback />
                          </FormGroup>
                        </td>
                        <td>
                          <FormGroup>
                            <FormControl className="br-0" type="text" />
                            <FormControl.Feedback />
                          </FormGroup>
                        </td>
                        <td>
                          <FormGroup>
                            <FormControl className="br-0" type="text" />
                            <FormControl.Feedback />
                          </FormGroup>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                <div className="text-right m-b-20">
                  <div className="total-box">
                    <Table responsive className="m-b-0">
                      <tbody>
                        <tr>
                          <td>Total Tool + Process:</td>
                          <td>$56765</td>
                        </tr>
                        <tr>
                          <td>Packageing:</td>
                          <td>$56765</td>
                        </tr>
                        <tr>
                          <td>Logistics:</td>
                          <td>$56765</td>
                        </tr>
                        <tr>
                          <td>Grand Total:</td>
                          <td>$56765</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>

                {/* <div className="text-center m-b-20">
                  <button className="btn btn-default text-uppercase">
                    save
                  </button>
                  <button className="btn btn-success text-uppercase">
                    cancle
                  </button>
                </div> */}
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
                            pathname: 'home',
                            state: { path: 'third' }
                          }}
                        >
                          Approve Quotation
                        </Link>
                      </li>
                      <li>
                        <Link
                          // to="home"
                          to={{
                            pathname: 'home',
                            state: { path: 'first' }
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
                      className="btn btn-link text-uppercase color-light sm-btn"
                      trigger={() => (
                        <a href="#">
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
                                  : ''}
                                ,&nbsp;
                                {this.props.userInfo &&
                                this.props.userInfo.userData.contactNo
                                  ? this.props.userInfo.userData.contactNo.trim()
                                  : ''}
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
                                    'HH MM'
                                  )}
                              </td>
                              <td />
                            </tr>
                            <tr>
                              <td className="color-light"> Target Date:</td>
                              <td>
                                {this.state.targetDate &&
                                  moment(this.state.targetDate).format(
                                    'YYYY/MM/DD'
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
                                : ''}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index]
                                    .sourceCountry
                                : ''}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index]
                                    .specification
                                : ''}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].toolLife
                                : ''}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].time
                                : ''}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].length
                                : ''}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].weight
                                : ''}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].rate
                                : ''}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].quantity
                                : ''}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].price
                                : ''}
                            </td>
                            <td>
                              {this.state.partDetailArray[index]
                                ? this.state.partDetailArray[index].comments
                                : ''}
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
                                : ''}
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
