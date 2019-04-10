import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Table,
  Modal,
  Row,
  Col,
  Tab,
  Nav,
  NavItem,
  DropdownButton,
  Panel
} from 'react-bootstrap';
import Sprite from '../../img/sprite.svg';

import {
  actionLoaderHide,
  actionLoaderShow
} from '../../common/core/redux/actions';
import { showSuccessToast } from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Footer from "../common/footer";
import * as Datetime from "react-datetime";
import CONSTANTS from "../../common/core/config/appConfig";
import { handlePermission } from "../../common/permissions";
let { permissionConstant } = CONSTANTS;
class budget12 extends Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAddShow = this.handleAddShow.bind(this);
    this.handleAddClose = this.handleAddClose.bind(this);
    this.handleRemoveShow = this.handleRemoveShow.bind(this);
    this.handleRemoveClose = this.handleRemoveClose.bind(this);
    this.handleReplaceClose = this.handleReplaceClose.bind(this);
    this.handleReplaceShow = this.handleReplaceShow.bind(this);
    // this.handleTreeClick = this.handleTreeClick.bind(this);
    this.handleGrp1 = this.handleGrp1.bind(this);
    this.handleGrp2 = this.handleGrp2.bind(this);
    this.handleGrp3 = this.handleGrp3.bind(this);
    this.handleSubGrp = this.handleSubGrp.bind(this);
    this.handleSubSubGrp = this.handleSubSubGrp.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);

    this.state = {
      tabKey: 'ninth',
      show: false,
      addShow: false,
      removeShow: false,
      replaceShow: false,
      rowArray: [{}, {}, {}]
    };
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === 'first') this.props.history.push('home');
    if (tabKey === 'third')
      this.props.history.push({
        pathname: 'home',
        state: { path: 'third' }
      });
    this.setState({ tabKey: tabKey });
  }

  handleGrp1(event) {
    let rowArray = this.state.rowArray;
    if (event.target.checked) {
      rowArray.push({}, {}, {});
      this.setState({ grp1: true });
    } else {
      for (let i = 0; i < 3; i++) {
        rowArray.pop();
      }
      this.setState({ grp1: false });
    }
    this.setState({ rowArray: rowArray });
  }
  handleGrp2(event) {
    let rowArray = this.state.rowArray;
    if (event.target.checked) {
      rowArray.push({}, {}, {});
      this.setState({ grp2: true });
    } else {
      for (let i = 0; i < 3; i++) {
        rowArray.pop();
      }
      this.setState({ grp2: false });
    }
    this.setState({ rowArray: rowArray });
  }
  handleGrp3(event) {
    let rowArray = this.state.rowArray;
    if (event.target.checked) {
      rowArray.push({}, {}, {});
      this.setState({ grp3: true });
    } else {
      for (let i = 0; i < 3; i++) {
        rowArray.pop();
      }
      this.setState({ grp3: false });
    }
    this.setState({ rowArray: rowArray });
  }
  handleSubGrp(event) {
    let rowArray = this.state.rowArray;
    if (event.target.checked) {
      rowArray.push({}, {}, {});
      this.setState({ subgrp: true });
    } else {
      for (let i = 0; i < 3; i++) {
        rowArray.pop();
      }
      this.setState({ subgrp: false });
    }
    this.setState({ rowArray: rowArray });
  }
  handleSubSubGrp(event) {
    let rowArray = this.state.rowArray;
    if (event.target.checked) {
      rowArray.push({}, {}, {});
      this.setState({ subSubgrp: true });
    } else {
      for (let i = 0; i < 3; i++) {
        rowArray.pop();
      }
      this.setState({ subSubgrp: false });
    }
    this.setState({ rowArray: rowArray });
  }
  // handleTreeClick(event) {
  //   let rowArray = this.state.rowArray;
  //   if (event.target.checked) {
  //     rowArray.push({}, {}, {});
  //   } else {
  //     for (let i = 0; i < 3; i++) {
  //       rowArray.pop();
  //     }
  //   }
  //   this.setState({ rowArray: rowArray });
  // }

  handleCommentClose() {
    this.setState({ showCommentModal: false });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleAddClose() {
    this.setState({ addShow: false });
  }

  handleAddShow() {
    this.setState({ addShow: true });
  }

  handleRemoveClose() {
    this.setState({ removeShow: false });
  }

  handleRemoveShow() {
    this.setState({ removeShow: true });
  }

  handleReplaceClose() {
    this.setState({ replaceShow: false });
  }

  handleReplaceShow() {
    this.setState({ replaceShow: true });
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === 'ninth' ? 'ninth' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === 'ninth' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                 <div className="flex justify-space-between align-center">
                   <h4 className="hero-title">Online Purchase Contract Template</h4>
                    <button className="btn btn-default">Auto generate Contract no</button>
                 </div> 
                 
                 <p>This agreement made between the "Supplier"</p>
                <div className="border-around border-light p-20 eco-form m-b-30 m-t-20">
                  <Row>
                    <Col md={4}>
                      <FormGroup className=" ">
             
                        <FormControl
                          type="text"
                          className="br-0"
                          name="shipmentQty" placeholder="Add text here to be inserted"
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup className=" ">
                     
                        <FormControl
                          type="text"
                          className="br-0"
                          name="shipmentQty" placeholder="Supplier Code"
                        />
                        <FormControl.Feedback />
                        <p className="commentred">leave it blank for the template, will search when creating the contract </p>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup className=" ">
                    
                        <FormControl
                          type="text"
                          className="br-0"
                          name="shipmentQty" placeholder="Supplier Name"
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <FormGroup className=" ">
        
                        <FormControl
                          type="text"
                          className="br-0"
                          name="shipmentQty" placeholder="Registered Address"
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup className=" ">
                
                        <FormControl
                          type="text"
                          className="br-0"
                          name="shipmentQty" placeholder="Add text here to be inserted"
                        />
                        <FormControl.Feedback />
                        <p className="commentred">leave it blank for the template, will search when creating the contract </p>
                      </FormGroup>
                    </Col>
                   
                  </Row>
                
                </div>
                  <p>This agreement made between the "Buyer"</p>
                <div className="border-around border-light p-20 eco-form m-b-30 m-t-20">
             
                  <Row>
                  
                    <Col md={4}>
                      <FormGroup className=" ">
                
                        <FormControl
                          type="text"
                          className="br-0"
                          name="shipmentQty" placeholder="Buyer Name"
                        />
                        <FormControl.Feedback />
                        <p className="commentred">leave it blank for the template, will search when creating the contract </p>
                      </FormGroup>
                    </Col>
                     <Col md={4}>
                      <FormGroup className=" ">
        
                        <FormControl
                          type="text"
                          className="br-0"
                          name="shipmentQty" placeholder="Registered Address"
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </Col>
                     <Col md={4}>
                       <FormGroup className=" ">
                        <FormControl
                          type="text"
                          className="br-0"
                          name="shipmentQty" placeholder="Date"
                        />
                        <FormControl.Feedback />
                         <p className="commentred">leave it blank for the template</p>
                      </FormGroup>
                    </Col>
                  </Row>
                

                  <Row>
                    <Col md={12}>
                       <FormGroup controlId="formControlsTextarea">
                          <FormControl className="br-0"componentClass="textarea" placeholder="Add text here" />
                          <p className="commentred">sample text to be edited by the buyer as needed</p>
                        </FormGroup>
                    </Col>
                  </Row>
                

                </div>
                <div className="text-center m-b-20">
                  <button className="btn btn-default">Add</button>
                </div>
             

                     <div className="m-b-15">
                  <Table
                    responsive
                    bordered
                    condensed
                    className="custom-table cell-input out-calander budgetTbWrapper thpt15"
                  >
                    <thead>
                      <tr>
                        <th>Contract ID</th>
                        <th>Part Code</th>
                        <th>Part description</th>
                        <th>Service Request</th>
                        <th>Purchase Requisition</th>
                        <th>Requestion Date</th>
                        <th>Period</th>
                        <th>Value</th>
                        <th>Specific Terms</th>
                      </tr>
                    </thead>
                    <tbody>

                           <tr>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                 
                                    name="purchaseRequestNumber"
                                    placeholder="Contract ID"
                        
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Part Code"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              

                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Part Description"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                           
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Service Request"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Purchase Requisition"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>


                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Requestion Date"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                               <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Period"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              
                             <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Value"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                             <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Specific Terms"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                            </tr>
               
                      
                           <tr>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                 
                                    name="purchaseRequestNumber"
                                    placeholder="Contract ID"
                        
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Part Code"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              

                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Part Description"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                           
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Service Request"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Purchase Requisition"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>


                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Requestion Date"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                               <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Period"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              
                             <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Value"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                             <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Specific Terms"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                            </tr>
               

                           <tr>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                 
                                    name="purchaseRequestNumber"
                                    placeholder="Contract ID"
                        
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Part Code"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              

                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Part Description"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                           
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Service Request"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Purchase Requisition"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>


                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Requestion Date"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                               <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Period"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              
                             <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Value"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                             <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Specific Terms"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>

                            </tr>
               
                       

                    </tbody>
                  </Table>
                </div>


           <div className="text-center m-b-20">
                  <button className="btn btn-default">Add Clause</button>
                </div>
                <Row>
                      <Col md={12}>
                       <FormGroup controlId="formControlsTextarea">
                          <FormControl className="br-0"componentClass="textarea" placeholder="Add Clauses" />
                          <p className="commentred">Clauses to be inserted in the template</p>
                        </FormGroup>
                    </Col>
                 
                  </Row>
                <div className="eco-form m-b-30 m-t-20">
             
                  
                  <Row>
                      <Col md={4}>
                      <p class="font600">Signed Buyer</p>
                   <div className="upload-btn w-350 cursor-pointer sm-upload once-upload btn-block">
                       <div className="upload-btn flex align-center sm-upload text-center cursor-pointer text-uppercase ven-up">
                                <FormControl
                                  id="formControlsFile"
                                  type="file"
                                  label="File"
                                 
                                />
                                <span className="ico-upload">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#upload1Ico`} />
                                  </svg>
                                </span>

                                <span>User 1</span>
                          </div>
                         </div>  
                          <div className="upload-btn w-350 cursor-pointer sm-upload once-upload btn-block">
                               <div className="upload-btn flex align-center sm-upload text-center cursor-pointer text-uppercase ven-up">
                                <FormControl
                                  id="formControlsFile"
                                  type="file"
                                  label="File"
                                 
                                />
                                <span className="ico-upload">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#upload1Ico`} />
                                  </svg>
                                </span>

                                <span>User 2</span>
                          </div>
                          </div>   
                        </Col>
                    <Col md={4}>
                       <p class="font600">Signed Supplier</p>
                     <div className="upload-btn w-350 cursor-pointer sm-upload once-upload btn-block">
                       <div className="upload-btn flex align-center sm-upload text-center cursor-pointer text-uppercase ven-up">
                                <FormControl
                                  id="formControlsFile"
                                  type="file"
                                  label="File"
                                 
                                />
                                <span className="ico-upload">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#upload1Ico`} />
                                  </svg>
                                </span>

                                <span>User 1</span>
                          </div>
                         </div>  
                          <div className="upload-btn w-350 cursor-pointer sm-upload once-upload btn-block">
                               <div className="upload-btn flex align-center sm-upload text-center cursor-pointer text-uppercase ven-up">
                                <FormControl
                                  id="formControlsFile"
                                  type="file"
                                  label="File"
                                 
                                />
                                <span className="ico-upload">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#upload1Ico`} />
                                  </svg>
                                </span>

                                <span>User 2</span>
                          </div>
                          </div>  
                        </Col>
                  </Row>

                

                </div>     
            
              </div>
            </div>
            <Footer
              pageTitle={permissionConstant.footer_title.create_eco}
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
      actionLoaderShow
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
)(budget12);
