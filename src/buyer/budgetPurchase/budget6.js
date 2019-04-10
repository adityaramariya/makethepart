import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as moment from "moment";
import {
  Popover,
  Panel,
  Glyphicon,
  Table,
  FormControl,
  FormGroup, DropdownButton, Radio,ControlLabel, MenuItem
} from "react-bootstrap";
import Sprite from "../../img/sprite.svg";

import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetPurchaseCategoryData
} from "../../common/core/redux/actions";
import { showSuccessToast } from "../../common/commonFunctions";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import Slider from "react-slick";
import Footer from "../common/footer";
import CONSTANTS from "../../common/core/config/appConfig";
import { handlePermission } from "../../common/permissions";
let { permissionConstant } = CONSTANTS;
class budget6 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "tenth",
      noOfTable: [[]],
      noOfCategory: [{}],
      tableNo: 0,
      showHeading: [],
      monthly:'hideData',
      quarterly:'hideData'
    };
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.addTable = this.addTable.bind(this);
    this.removeTable = this.removeTable.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.removeCategory = this.removeCategory.bind(this);
    this.headingChange = this.headingChange.bind(this);
    this.saveHeading = this.saveHeading.bind(this);
    this.dropdownChange = this.dropdownChange.bind(this);
     this.openQuarterlyShowHideCollapse = this.openQuarterlyShowHideCollapse.bind(this);
    this.openMonthlyShowHideCollapse = this.openMonthlyShowHideCollapse.bind(this);
  }

  componentWillMount() {
    console.log("Componenet Will Mount....");
    console.log("moment()...", moment());
    console.log("moment().toString...", moment().toString());
    console.log("moment().format(YYYYMMDD)...", moment().format("MMYYYYDD"));
    console.log("moment().format()...", moment().format());
    console.log("moment().format(hh)...", moment().format("mmhhss"));
    let noOfCategory = this.state.noOfCategory;
    let noOfTable = this.state.noOfTable;
    for (let i = 0; i < noOfTable.length; i++) {
      noOfTable[i].heading = "Clone Budget from";
      noOfTable[i].push([]);
    }
    // noOfCategory &&
    //   noOfCategory.forEach(function(elem, index) {
    //     elem[index] = [];
    //   });
    for (let i = 0; i < noOfCategory.length; i++) {
      noOfCategory[i] = [{}];
    }
    this.setState({ noOfCategory: noOfCategory });
  }
  componentDidMount() {
    let _this = this;
    console.log("Componenet Did Mount....");
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };
    this.props
      .actionGetPurchaseCategoryData(data)
      .then((result, error) => {
        console.log("result.....", result.payload.data.resourceData[0]);
        let purchaseResponse = result.payload.data.resourceData[0];
        this.setState({
          listOfDepartment: purchaseResponse.listOfDepartment,
          // listOfFunctionalArea: purchaseResponse.listOfFunctionalArea,
          listOfMainCategory: purchaseResponse.listOfMainCategory,
          listOfSpentCategory: purchaseResponse.listOfSpentCategory,
          listOfSubCatgeory: purchaseResponse.listOfSubCatgeory,
          listOfAddress: purchaseResponse.listOfAddress
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
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

  addTable() {
    let tableNo = this.state.tableNo;
    let noOfTable = this.state.noOfTable;
    let noOfCategory = this.state.noOfCategory;
    tableNo += 1;
    noOfCategory[tableNo] = [{}];
    noOfTable.push({});
    this.setState({ noOfTable: noOfTable, tableNo: tableNo });
  }
  removeTable() {
    let noOfTable = this.state.noOfTable;
    if (noOfTable.length !== 1) {
      noOfTable.pop();
    }
    this.setState({ noOfTable: noOfTable });
  }
  addCategory(event, index) {
    let noOfCategory = this.state.noOfCategory;
    noOfCategory[index].push({});
    this.setState({ noOfCategory: noOfCategory });
  }
  removeCategory(event, index) {
    let noOfCategory = this.state.noOfCategory;
    if (noOfCategory[index].length !== 1) {
      noOfCategory[index].pop();
    }
    this.setState({ noOfCategory: noOfCategory });
  }

  headingChange(event, tableIndex) {
    const { name, value } = event.target;
    let noOfTable = this.state.noOfTable;
    noOfTable[tableIndex][name] = value;
    this.setState({ noOfTable: noOfTable });
  }

  saveHeading(index) {
    let showHeading = this.state.showHeading;
    showHeading[index] = true;
    this.setState({ showHeading: showHeading });
  }

  dropdownChange(event, catIndex, tableIndex) {
    console.log("catIndex..", catIndex, "tableIndex", tableIndex);
    const { name, value } = event.target;
    let noOfTable = this.state.noOfTable;
    noOfTable[tableIndex][catIndex][name] = value;
    this.setState({ noOfTable: noOfTable });
  }

  openQuarterlyShowHideCollapse(event){  
    if(this.state.quarterly === 'showData'){
      this.setState({ quarterly : 'hideData', monthly : 'hideData'});
    }
    else{
      this.setState({ quarterly : 'showData', monthly : 'hideData'});
    }
    
  }

  openMonthlyShowHideCollapse(event){
    if(this.state.monthly === 'showData'){
      this.setState({ monthly : 'hideData', quarterly :'hideData' }); 
    }
    else{
      this.setState({ monthly : 'showData', quarterly :'hideData' }); 
    }
    
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === "tenth" ? "tenth" : "none"}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === "tenth" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
              <h4 class="hero-title">Review Budget</h4>
              <div className="bugetHeadWrap"> 

              <div className="budgetHeadleft flex align-center">               
                  <div className="commitWrap">
                        <label className="label--radio">
                          <input
                            type="radio"
                            className="radio" name="m-radio" value="aa"/> <span>Commit</span>
                        </label>
           
                      <label className="label--radio">
                          <input
                            type="radio"
                            className="radio" name="m-radio" value="saa"/> <span className="label--radio">Pay
                     </span>
                     </label>  
                       <label className="label--radio">
                          <input
                            type="radio"
                            className="radio" name="m-radio" value="saa"/> <span className="label--radio">Commit & Pay
                     </span>
                     </label>  
                   </div>
    
               </div>


                <div className="budgetHeadrgt">    
              
                 <FormGroup controlId="formControlsSelect">
                  <FormControl
                    componentClass="select"
                    placeholder="Revision X"
                    className="s-arrow br-0"
                    // value={this.state.selectedProjectId}
                    name="department"
                  
                  >
                    <option value="select">
                    Revision X
                    </option>
                    <option >
                          Sales
                    </option>
                  </FormControl>
                </FormGroup>

               <FormGroup controlId="formControlsSelect">
                  <FormControl
                    componentClass="select"
                    placeholder="select"
                    className="s-arrow br-0"
                    // value={this.state.selectedProjectId}
                    name="department"
                  
                  >
                    <option value="select">
                      Forecast Y
                    </option>
                    <option >
                          Sales
                    </option>

                
                  </FormControl>
                </FormGroup>

                <FormGroup controlId="formControlsSelect">
                  <FormControl
                    componentClass="select"
                    placeholder="select"
                    className="s-arrow br-0"
                    // value={this.state.selectedProjectId}
                    name="department"
                  
                  >
                    <option value="select">
                     FY2018-19
                    </option>
                    <option >
                          Sales
                    </option>
                  </FormControl>
                </FormGroup>
                 </div>

                        
                         
                           
                  
                  <div class="groupRadio">
                    <span>Group By</span>
                         <label className="label--radio">
                                <input
                                  type="radio"
                                  className="radio" name="m-radio" value="aa"/>  Year
                         
                           </label>
                                  <label className="label--radio">
                                <input
                                  type="radio"
                                  className="radio" name="m-radio" value="aa"/> Quater
                         
                           </label> 
                       </div>


               </div> 
         
             {this.state.noOfTable &&
                  this.state.noOfTable.map((item, tableIndex) => {
                    return (
                      <div key={tableIndex}>
            
                        <div className="table-responsive m-b-20">
                          <Table bordered condensed className="custom-table budgetTbWrapper inputform90">
                            <thead>
                              <tr>
                             
                                <th>Account <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span></th>
                               
                                <th>Department <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span></th>
                                <th>Program <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span></th>
                                <th>Spend Category <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span></th>
                                <th>Sub Category <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span></th>
                                <th>Area <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span></th>
                                <th>Location/Plant <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span></th>
                                <th>Currency <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span></th> 
                                <th>Description</th>
                                <th>Year 2018-19  <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span> <p className="m-b-0">
                                    {this.state.quarterly === 'hideData' ? <span className="ico-add plusIcon" onClick = {this.openQuarterlyShowHideCollapse}>
                                      <svg>
                                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                                      </svg>
                                    </span> : <span class="ico-minusgly minIcon" onClick = {this.openQuarterlyShowHideCollapse}> </span>} 
                                    Quarterly </p><p className="m-b-0">

                                    {this.state.monthly === 'hideData' ? <span className="ico-add plusIcon" onClick = {this.openMonthlyShowHideCollapse}>
                                      <svg>
                                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                                      </svg>
                                    </span> : <span class="ico-minusgly minIcon" onClick = {this.openMonthlyShowHideCollapse}> </span>} 

                                     Month</p></th>
                                  <th className={this.state.quarterly}>Mon 1-Mon 3</th>
                                  <th className={this.state.quarterly}>Mon 4-Mon 6</th>
                                  <th className={this.state.quarterly}>Mon 7-Mon 9</th>
                                  <th className={this.state.quarterly}>Mon 10-Mon 12</th>
                                  <th className={this.state.monthly}>Mon 1</th>
                                  <th className={this.state.monthly}>Mon 2</th>
                                  <th className={this.state.monthly}>Mon 3</th>
                                  <th className={this.state.monthly}>Mon 4</th>
                                  <th className={this.state.monthly}>Mon 5</th>
                                  <th className={this.state.monthly}>Mon 6</th>
                                  <th className={this.state.monthly}>Mon 7</th>
                                  <th className={this.state.monthly}>Mon 8</th>
                                  <th className={this.state.monthly}>Mon 9</th>
                                  <th className={this.state.monthly}>Mon 10</th>
                                  <th className={this.state.monthly}>Mon 11</th>
                                  <th className={this.state.monthly}>Mon 12</th>
                                    <th>Year 2019-20 <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span> <p className="m-b-0">
                                 <span className="ico-add plusIcon">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                                      </svg>
                                    </span>  
                                    Quarterly </p><p className="m-b-0">

                                    <span className="ico-add plusIcon">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                                      </svg>
                                    </span> 

                                     Month</p></th>
                                <th>Year 2020-21 <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span> <p className="m-b-0">
                                    <span className="ico-add plusIcon">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                                      </svg>
                                    </span> 
                                    Quarterly </p><p className="m-b-0">

                                   <span className="ico-add plusIcon">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                                      </svg>
                                    </span>   

                                     Month</p></th>
                                  <th>Year 2021-22 <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span> <p className="m-b-0">
                                    <span className="ico-add plusIcon">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                                      </svg>
                                    </span> 
                                    Quarterly </p><p className="m-b-0">

                                   <span className="ico-add plusIcon">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                                      </svg>
                                    </span>   

                                     Month</p></th>
                                    <th>Year 2022-23 <span><i class="glyphicon glyphicon-triangle-bottom"></i> </span><p className="m-b-0">
                                    <span className="ico-add plusIcon">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                                      </svg>
                                    </span> 
                                    Quarterly </p><p className="m-b-0">

                                   <span className="ico-add plusIcon">
                                      <svg>
                                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                                      </svg>
                                    </span>   

                                     Month</p></th>
                                  <th>Input by <p>Intial Approval by </p> </th>
                                <th> </th>
                                <th> </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.noOfCategory &&
                                this.state.noOfCategory[tableIndex] &&
                                this.state.noOfCategory[tableIndex].map(
                                  (elem, catIndex) => {
                                    return (
                               <tr>
                                   
                                          
                                       <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
            
                                            </FormControl>
                                          </FormGroup>
                               
                                        </td>
                             
                                        
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                              // value={this.state.selectedProjectId}
                                              name="department"
                                           
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option >
                                                   Sales
                                              </option>

                                         
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                        <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
            
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                       
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
            
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                         <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
            
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                         <FormGroup className="m-b-0">
                                          <FormControl
                                            type="text"
                                            className="br-0"
                                          />
                                          <FormControl.Feedback />
                                        </FormGroup>
                                        </td>


                                  <td className="b-p-warpper revisionBudget budinput revtr">
                                         <div className="td-item w100">
                                             <div className="flex justify-space-between align-center">
                                             <span className="font600">Budget</span>
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                                             </div>
                                             <div className="flex justify-space-between align-center">
                                                <span className="redclr font600">Paid</span>
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                             </div>
                                              
                                              <div className="flex justify-space-between align-center">
                                              <span className="blueclr font600">Commited</span>
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                              </div>  
                                              
                                             <div className="flex justify-space-between align-center">
                                              <span className="text-success font600">Available</span>
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                              </div>  
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revisionBudget revtr budinput ${this.state.quarterly}`}>
                                            <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                        <td className={`b-p-warpper revisionBudget revtr budinput ${this.state.quarterly}`}>
                                          <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revisionBudget revtr budinput ${this.state.quarterly}`}>
                                        <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                        <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.quarterly}`}>
                                          <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>


                                        <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                            <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                          <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                        <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                            <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                        <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                      <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                        <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                      </td>
                                      <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                     <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                      <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                         <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                      <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                       <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                          <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                          <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                        <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                           <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                       
                                        <td className="b-p-warpper budinput revtr revisionBudget">
                                          <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                        <td className="b-p-warpper budinput revtr revisionBudget">
                                           <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                          <td className="b-p-warpper budinput revtr revisionBudget">
                                             <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                          <td className="b-p-warpper revtr budinput revisionBudget">
                                             <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>

                                     <td className="inputapprove">
                                           <FormGroup className="flex m-b-3">
                                              <FormControl
                                                type="text"
                                                className="br-0 inputh28"
                                                name="partDescription"
                                                placeholder="Thomas Thomas"
                                              />
                                              <FormControl.Feedback />
                                            </FormGroup>
                                          <FormGroup className="m-b-0 flex">
                                              <FormControl
                                                type="text"
                                                className="br-0 inputh28"
                                                name="partDescription"
                                                placeholder="John John"
                                              />
                                              <FormControl.Feedback />
                                            </FormGroup>
                                   
                                        </td>
                                  
                                 <td>  <span className="ico-action-sm">
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#upload1Ico`}
                                            />
                                          </svg>
                                        </span>
                                   </td>

                                        <td>      <span className="ico-action-sm">
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#chat1Ico`}
                                            />
                                          </svg>
                                        </span>
                                   </td>
                                   
                                      </tr>
                                    );
                                  }
                                )}
                                    <tr>
                                    
                                          
                                       <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
            
                                            </FormControl>
                                          </FormGroup>
                               
                                        </td>
                                      
                                        
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                              // value={this.state.selectedProjectId}
                                              name="department"
                                           
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option >
                                                   Sales
                                              </option>

                                         
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                        <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
            
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                       
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
            
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                         <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
            
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                         <FormGroup className="m-b-0">
                                          <FormControl
                                            type="text"
                                            className="br-0"
                                          />
                                          <FormControl.Feedback />
                                        </FormGroup>
                                        </td>
         <td className="b-p-warpper revisionBudget budinput revtr">
                                         <div className="td-item w100">
                                             <div className="flex justify-space-between align-center">
                                             <span className="font600">Budget</span>
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                                             </div>
                                             <div className="flex justify-space-between align-center">
                                                <span className="redclr font600">Paid</span>
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                             </div>
                                              
                                              <div className="flex justify-space-between align-center">
                                              <span className="blueclr font600">Commited</span>
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                              </div>  
                                              
                                             <div className="flex justify-space-between align-center">
                                              <span className="text-success font600">Available</span>
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                              </div>  
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revisionBudget revtr budinput ${this.state.quarterly}`}>
                                            <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                        <td className={`b-p-warpper revisionBudget revtr budinput ${this.state.quarterly}`}>
                                          <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revisionBudget revtr budinput ${this.state.quarterly}`}>
                                        <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                        <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.quarterly}`}>
                                          <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>


                                        <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                            <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                          <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                        <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                            <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                        <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                      <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                        <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                      </td>
                                      <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                     <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                      <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                         <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                      <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                       <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                          <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                          <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                        <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                           <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                       
                                        <td className="b-p-warpper budinput revtr revisionBudget">
                                          <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                        <td className="b-p-warpper budinput revtr revisionBudget">
                                           <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                          <td className="b-p-warpper budinput revtr revisionBudget">
                                             <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                          <td className="b-p-warpper revtr budinput revisionBudget">
                                             <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>



                                          <td className="inputapprove">
                                           <FormGroup className="flex m-b-3">
                                              <FormControl
                                                type="text"
                                                className="br-0 inputh28"
                                                name="partDescription"
                                                placeholder="Thomas Thomas"
                                              />
                                              <FormControl.Feedback />
                                            </FormGroup>
                                          <FormGroup className="m-b-0 flex">
                                              <FormControl
                                                type="text"
                                                className="br-0 inputh28"
                                                name="partDescription"
                                                placeholder="John John"
                                              />
                                              <FormControl.Feedback />
                                            </FormGroup>
                                   
                                        </td>
                                  
                                 <td>  <span className="ico-action-sm">
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#upload1Ico`}
                                            />
                                          </svg>
                                        </span>
                                   </td>

                                        <td>      <span className="ico-action-sm">
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#chat1Ico`}
                                            />
                                          </svg>
                                        </span>
                                   </td>
                                   
                                      </tr>


                                    <tr>
                                  
                                          
                                     
                                        <td>
                                         <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
            
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                              // value={this.state.selectedProjectId}
                                              name="department"
                                           
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option >
                                                   Sales
                                              </option>

                                         
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                        <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
            
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                       
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
            
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                         <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
            
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup controlId="formControlsSelect">
                                            <FormControl
                                              componentClass="select"
                                              placeholder="select"
                                              className="s-arrow br-0"
                                            >
                                              <option value="select">
                                                select
                                              </option>
                                              <option value="select">
                                              Direct Material
                                              </option>
                                            </FormControl>
                                          </FormGroup>
                                        </td>
                                        <td>
                                         <FormGroup className="m-b-0">
                                          <FormControl
                                            type="text"
                                            className="br-0"
                                          />
                                          <FormControl.Feedback />
                                        </FormGroup>
                                        </td>


                               <td className="b-p-warpper revisionBudget budinput revtr">
                                         <div className="td-item w100">
                                             <div className="flex justify-space-between align-center">
                                             <span className="font600">Budget</span>
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                                             </div>
                                             <div className="flex justify-space-between align-center">
                                                <span className="redclr font600">Paid</span>
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                             </div>
                                              
                                              <div className="flex justify-space-between align-center">
                                              <span className="blueclr font600">Commited</span>
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                              </div>  
                                              
                                             <div className="flex justify-space-between align-center">
                                              <span className="text-success font600">Available</span>
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                              </div>  
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revisionBudget revtr budinput ${this.state.quarterly}`}>
                                            <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                        <td className={`b-p-warpper revisionBudget revtr budinput ${this.state.quarterly}`}>
                                          <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revisionBudget revtr budinput ${this.state.quarterly}`}>
                                        <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                        <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.quarterly}`}>
                                          <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>


                                        <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                            <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                          <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                        <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                            <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                        <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                      <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                        <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                      </td>
                                      <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                     <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                      <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                         <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                      <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                       <div className="td-item w100">
                                            
                                           
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                           
                                          
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                          <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                          <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                        <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                       <td className={`b-p-warpper revtr revisionBudget budinput ${this.state.monthly}`}>
                                           <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                       
                                        <td className="b-p-warpper budinput revtr revisionBudget">
                                          <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                        <td className="b-p-warpper budinput revtr revisionBudget">
                                           <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                          <td className="b-p-warpper budinput revtr revisionBudget">
                                             <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>
                                          <td className="b-p-warpper revtr budinput revisionBudget">
                                             <div className="td-item w100">
                                                   
                                               <FormControl
                                                  type="text"
                                                  className="br-0 inputx blkright"
                                                  name="partDescription"
                                                  placeholder="XXXXX"
                                                />
                                                <FormControl.Feedback />

                         
                                             
                                                <span className="sm-tip color-light">
                                                  YYYY
                                                </span>
                                        
                                                <span className="sm-tip blueright">
                                                  YYYY
                                                </span>
                                            
                                        
                                             
                                             <span className="sm-tip availablergt text-success">
                                                TTTT
                                              </span>
                                  
                                          </div>
                                        </td>

                                           <td className="inputapprove">
                                           <FormGroup className="flex m-b-3">
                                              <FormControl
                                                type="text"
                                                className="br-0 inputh28"
                                                name="partDescription"
                                                placeholder="Thomas Thomas"
                                              />
                                              <FormControl.Feedback />
                                            </FormGroup>
                                          <FormGroup className="m-b-0 flex">
                                              <FormControl
                                                type="text"
                                                className="br-0 inputh28"
                                                name="partDescription"
                                                placeholder="John John"
                                              />
                                              <FormControl.Feedback />
                                            </FormGroup>
                                   
                                        </td>
                                 <td>  <span className="ico-action-sm">
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#upload1Ico`}
                                            />
                                          </svg>
                                        </span>
                                   </td>

                                        <td>      <span className="ico-action-sm">
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#chat1Ico`}
                                            />
                                          </svg>
                                        </span>
                                   </td>
                                   
                                      </tr>
                            </tbody>
                          </Table>
                        </div>
                        {/* <div className=" m-b-20">
                          <div className=" mb-30 mt-15">
                            <span
                              className="cursor-pointer "
                              onClick={event => {
                                this.addCategory(event, tableIndex);
                              }}
                            >
                              <span className="ico-add">
                                <svg>
                                  <use xlinkHref={`${Sprite}#plus-OIco`} />
                                </svg>
                              </span>
                              &nbsp;Add Category
                            </span>{" "}
                            &nbsp; &nbsp; &nbsp; &nbsp;
                            <span
                              className="cursor-pointer"
                              onClick={event => {
                                this.removeCategory(event, tableIndex);
                              }}
                            >
                              <span className="ico-minusgly"> </span>
                              &nbsp;Remove Category
                            </span>
                          </div>
                        </div> */}
                      </div>
                    );
                  })}

 
     

              </div>
            </div>

            <Footer
              pageTitle={permissionConstant.footer_title.build_plan_eco}
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
      actionGetPurchaseCategoryData
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
)(budget6);
