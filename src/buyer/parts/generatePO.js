import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Image1 from '../../img/image.png';
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
  Col,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import validation from 'react-validation-mixin';
import strategy, { validator } from 'react-validatorjs-strategy';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionTabData,
  actionReleasePOList,
  actionSubmitReleasePOList
} from '../../common/core/redux/actions';
import Search from '../../img/search.png';
import Sprite from '../../img/sprite.svg';

class AddUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      releasePOList:
        (this.props.location.state &&
          this.props.location.state.releasePOList) ||
        '',
      partId:
        (this.props.location.state && this.props.location.state.partId) || '',
      buyerUserId:
        (this.props.location.state && this.props.location.state.buyerUserId) ||
        '',
      poGeneratedWith:
        (this.props.location.state && this.props.location.state.buyerUserId) ||
        '',
      purchaseOrderNo: '',
      poGeneratedWith: '',
      termArray: [{}],
      tabKey: 'generatePO'
    };

    this.submitReleasePO = this.submitReleasePO.bind(this);
    this.addTerm = this.addTerm.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
  }

  componentWillMount() {
    let _this = this;
    if (!this.state.releasePOList) {
      let data = {
        // partId: partId,
        partId: 'parbb4a5632f56e',
        buyerUserId: this.state.buyerUserId
      };
      this.props.actionLoaderShow();
      this.props
        .actionReleasePOList(data)
        .then((result, error) => {
          console.log(result);
          this.setState({
            releasePOList: result.payload.data.resourceData[0]
          });
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  }

  navigateToRFQ(data) {
    this.props.actionTabData(data);
  }

  activeTabKeyAction(tabKey) {
    this.setState({ tabKey: tabKey });
  }

  addTerm() {
    let termArray = this.state.termArray;
    termArray.push({});
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

  submitReleasePO() {
    let _this = this;
    let listOfPOReleaseRequest = [];
    let listOfTaxIds = [];
    this.state.releasePOList.poreleasePartsRes.map(function(item) {
      listOfPOReleaseRequest.push({
        partId: item.id,
        quotationId: item.listOfQuotationDetails[0].quotationId,
        purchaseOrderNo: _this.state.releasePOList.purchaseOrderNo,
        poGeneratedWith: 2,
        currentStatus: 'wait',

        listOfTaxIds: listOfTaxIds,

        // currentStatus:"wait",
        // percentCompletion: 10,
        // qualityInspectionDate: 1534256060347,
        // dispatchDate: 1534256070347,
        // partsReceiptDate:1534256070347 ,
        // comments:"This is Test for PO submit",
        // poGeneratedWith:2,
        // listOfTaxIds:["12","13"],
        listOfTermsAndConditions: _this.state.termArray
      });
    });
    let data = {
      buyerUserId: this.state.buyerUserId,
      listOfPOReleaseRequest: listOfPOReleaseRequest
    };
    this.props
      .actionSubmitReleasePOList(data)
      .then((result, error) => {
        console.log('result...............', result);
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  render() {
    return (
      <div>
        <Header />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === 'generatePO' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <div className="db-filter flex align-center justify-space-between b-bottom border-light">
                  <div>{""}</div>
                  {/* <button className="btn sm-btn btn-default">Approve</button> */}

                  <div className="flex align-center">
                    <span>Search:</span>
                    <div className="filter-in w-300">
                      <Form inline>
                        <div className="multi-search">
                          <FormGroup>
                            <InputGroup>
                              <FormControl type="text" />
                              <button className="btn sm-search">
                                <img src={Search} width="20px" />
                              </button>
                              <DropdownButton
                                componentClass={InputGroup.Button}
                                id="input-dropdown-addon"
                                title="Action"
                              >
                                <MenuItem key="1">
                                  <FormGroup controlId="formInlineName">
                                    <ControlLabel>Part:</ControlLabel>
                                    <FormControl
                                      type="text"
                                      placeholder="Search any part"
                                    />
                                  </FormGroup>
                                </MenuItem>
                                <MenuItem key="2">
                                  <FormGroup controlId="formInlineName">
                                    <ControlLabel>Program:</ControlLabel>
                                    <FormControl
                                      type="text"
                                      placeholder="Search any Program"
                                    />
                                  </FormGroup>
                                </MenuItem>
                                <MenuItem key="3">
                                  <FormGroup controlId="formInlineName">
                                    <ControlLabel>Supplier:</ControlLabel>
                                    <FormControl
                                      type="text"
                                      placeholder="Search any Supplier"
                                    />
                                  </FormGroup>
                                </MenuItem>
                              </DropdownButton>
                            </InputGroup>
                          </FormGroup>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
                <div className="m-t-20 m-b-30">
                  <Row className="show-grid">
                    <Col md={6}>
                      <div className="company-info">
                        <Table className="">
                          <tbody>
                            <tr>
                              <td>
                                <label className="label--checkbox">
                                  <input type="checkbox" className="checkbox" />
                                  Attach a PO
                                </label>
                              </td>
                              <td>Buyer:</td>
                              <td>
                                {this.state.releasePOList.poreleasePartsRes &&
                                  this.state.releasePOList.poreleasePartsRes[0]
                                    .buyerResponse &&
                                  this.state.releasePOList.poreleasePartsRes[0]
                                    .buyerResponse.companyName}
                              </td>
                            </tr>
                            <tr>
                              <td>Vendor:</td>
                              <td>
                                {this.state.releasePOList &&
                                  this.state.releasePOList.poreleasePartsRes &&
                                  this.state.releasePOList
                                    .poreleasePartsRes[0] &&
                                  this.state.releasePOList.poreleasePartsRes[0]
                                    .supplierResponse &&
                                  this.state.releasePOList.poreleasePartsRes[0]
                                    .supplierResponse.companyName}
                              </td>
                            </tr>
                            <tr>
                              <td>Contact:</td>
                              <td>
                                Contact Person
                                {/* {this.state.releasePOList &&
                                  this.state.releasePOList.poreleasePartsRes[0]
                                    .deliveryAddressResponse &&
                                  this.state.releasePOList.poreleasePartsRes[0]
                                    .deliveryAddressResponse.address} */}
                              </td>
                            </tr>
                            <tr>
                              <td>Puruchase Order No:</td>
                              <td>
                                {this.state.releasePOList.purchaseOrderNo}
                              </td>
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
                        <FormGroup controlId="formInlineName">
                          <ControlLabel className="color-light">
                            Delevery at
                          </ControlLabel>{' '}
                          <FormControl type="text" className="br-0" />
                        </FormGroup>
                      </Form>
                    </Col>
                    <Col md={3}>
                      <Form inline>
                        <FormGroup controlId="formInlineName">
                          <ControlLabel className="color-light">
                            Tax ID No. 1
                          </ControlLabel>{' '}
                          <FormControl type="text" className="br-0" />
                        </FormGroup>
                      </Form>
                    </Col>
                    <Col md={3}>
                      <Form inline>
                        <FormGroup controlId="formInlineName">
                          <ControlLabel className="color-light">
                            Tax ID No. 2
                          </ControlLabel>{' '}
                          <FormControl type="text" className="br-0" />
                        </FormGroup>
                      </Form>
                    </Col>
                    <Col md={3}>
                      <Form inline>
                        <FormGroup controlId="formInlineName">
                          <ControlLabel className="color-light">
                            Tax ID No. 3
                          </ControlLabel>{' '}
                          <FormControl type="text" className="br-0" />
                        </FormGroup>
                      </Form>
                    </Col>
                  </Row>
                </div>

                <div>
                  <Table bordered responsive hover className="custom-table">
                    <thead>
                      <tr>
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
                      {this.state.releasePOList.poreleasePartsRes &&
                        this.state.releasePOList.poreleasePartsRes.map(
                          (item, index) => {
                            return (
                              <tr>
                                <td>
                                  <span
                                    className={
                                      index % 4 === 0
                                        ? 'r-caret red'
                                        : index % 4 === 1
                                          ? 'r-caret green'
                                          : index % 4 === 2
                                            ? 'r-caret blue'
                                            : 'r-caret yellow'
                                    }
                                  />
                                  {index + 1}
                                </td>
                                <td>{item.partNumber}</td>
                                <td>{item.partDescription}</td>
                                <td />
                                <td>{item.units}</td>
                                <td>{item.quantity}</td>
                                <td>
                                  {item.listOfQuotationDetails &&
                                    item.listOfQuotationDetails[0].subtotal}
                                </td>
                                <td>jkhjk</td>

                                <td>jkhjk</td>
                                <td>jkhjk</td>
                                <td>jkhjk</td>
                              </tr>
                            );
                          }
                        )}
                    </tbody>
                  </Table>
                </div>

                <Row>
                  <Col md={6}>
                    <h4>Terms</h4>
                    {this.state.termArray.map((item, index) => {
                      return (
                        <p className="terms-pt flex align-center">
                          <span>{index + 1}.</span>{' '}
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

                    {/* <p className="terms-pt flex align-center">
                      <span>2.</span> <FormControl type="text" />
                    </p>
                    <p className="terms-pt flex align-center">
                      <span>3.</span> <FormControl type="text" />
                    </p> */}

                    <div className=" mb-30 mt-15">
                      <span className="cursor-pointer" onClick={this.addTerm}>
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
                  <button className="btn btn-default ">Preview</button>
                  <button
                    className="btn btn-success "
                    onClick={this.submitReleasePO}
                  >
                    Release
                  </button>
                </div>
              </div>
            </div>

            <footer>
              <button className="btn btn-block br-0 btn-toTop text-uppercase">
                back to top
              </button>
              <div className="bg-Dgray">
                <div className="container">
                  <div className="p-tags-wrapper flex justify-space-between">
                    <ul className="p-tags flex-1">
                      <li>
                        <Link to="releasePO">Release PO</Link>
                      </li>
                      <li>
                        <Link to="addPart">Request for Quotation</Link>
                      </li>

                      <li>
                        <Link to="summary">Quotation Summary</Link>
                      </li>
                    </ul>

                    <ul className="p-tags flex-1">
                      <li>
                        <a className="disabled">Supplier Criteria Setting</a>
                      </li>
                      <li>
                        <Link to="home">My Dashboard</Link>
                      </li>
                      <li>
                        <a className="disabled">Purchacing Summary</a>
                      </li>
                    </ul>
                    <ul className="p-tags flex-1">
                      <li>
                        <Link to="/buyer/approvalPO">Approve PO</Link>
                      </li>

                      <li>
                        <Link
                          to="home"
                          onClick={() => this.navigateToRFQ('third')}
                        >
                          Approve RFQ
                        </Link>
                      </li>

                      <li>
                        <a onClick={() => this.props.history.push('adduser')}>
                          Add Users
                        </a>
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
      actionTabData,
      actionReleasePOList,
      actionSubmitReleasePOList
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
