import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  FormControl,
  FormGroup,
  Popover,
  Overlay,
  Panel,
  Glyphicon,
  Form,
  ControlLabel
} from "react-bootstrap";
import Sprite from "../../img/sprite.svg";

import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetDiscloserData,
  actionApproveRejectNonDiscloser
} from "../../common/core/redux/actions";
import { showSuccessToast } from "../../common/commonFunctions";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import Footer from "../common/footer";
import CONSTANTS from "../../common/core/config/appConfig";
import { handlePermission } from "../../common/permissions";
let { permissionConstant } = CONSTANTS;
const popoverBottom = (
  <Popover id="popover-positioned-bottom">
    <button className="btn btn-info sm-btn">Replace</button>
    <button className="btn btn-info sm-btn">Remove</button>
    <button className="btn btn-info sm-btn">Add</button>
  </Popover>
);
class ProductPlanning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "eighth"
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
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

  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === "eighth" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <div className="flex align-center">
                  <h4 className="hero-title">Production Planning</h4>
                </div>

                <div className="month-panel">
                  <Panel id="collapsible-panel-example-2" defaultExpanded>
                    <Panel.Heading>
                      <Panel.Title toggle>
                        Previous Month <Glyphicon glyph="chevron-down" />{" "}
                      </Panel.Title>
                      <div className="flex justify-space-between flex-1 align-center act-control">
                        {/* <button className="btn btn-primary sm-btn text-uppercase">
                          Add variant
                        </button> */}
                        {/* <div className="flex align-center">
                          <label className="label--checkbox">
                            <input type="checkbox" className="checkbox" />
                            Copy variants and number from
                          </label>

                          <FormGroup controlId="formControlsSelect">
                            <FormControl
                              componentClass="select"
                              placeholder="MM"
                              className="s-arrow gray-card br-0 b-0"
                            >
                              <option value="select">Jan</option>
                              <option value="other">Feb</option>
                            </FormControl>
                          </FormGroup>
                          <FormGroup controlId="formControlsSelect">
                            <FormControl
                              componentClass="select"
                              placeholder="YYYY"
                              className="s-arrow gray-card br-0 b-0"
                            >
                              <option value="select">2018</option>
                              <option value="other">2017</option>
                            </FormControl>
                          </FormGroup>
                        </div> */}
                      </div>
                    </Panel.Heading>
                    <Panel.Collapse>
                      <Panel.Body>
                        <div className="flex-table">
                          <div className="flex-head">
                            <div className="flex-row">
                              <div className="th-item text-uppercase">
                                Variant
                              </div>
                              <div className="th-item">
                                <p className="date">1</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">2</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item today">
                                <p className="date">3</p>
                                <span className="day">Wed</span>
                              </div>
                              <div className="th-item">
                                <p className="date">4</p>
                                <span className="day">Thu</span>
                              </div>
                              <div className="th-item">
                                <p className="date">5</p>
                                <span className="day">Fri</span>
                              </div>
                              <div className="th-item">
                                <p className="date">6</p>
                                <span className="day">Sat</span>
                              </div>
                              <div className="th-item">
                                <p className="date">7</p>
                                <span className="day">Sun</span>
                              </div>
                              <div className="th-item">
                                <p className="date">8</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">9</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item">
                                <p className="date">10</p>
                                <span className="day">Wed</span>
                              </div>
                              <div className="th-item">
                                <p className="date">11</p>
                                <span className="day">Thu</span>
                              </div>
                              <div className="th-item">
                                <p className="date">12</p>
                                <span className="day">Fri</span>
                              </div>
                              <div className="th-item">
                                <p className="date">13</p>
                                <span className="day">Sat</span>
                              </div>
                              <div className="th-item">
                                <p className="date">14</p>
                                <span className="day">Sun</span>
                              </div>
                              <div className="th-item">
                                <p className="date">15</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">16</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item">
                                <p className="date">17</p>
                                <span className="day">Wed</span>
                              </div>
                              <div className="th-item">
                                <p className="date">18</p>
                                <span className="day">Thu</span>
                              </div>
                              <div className="th-item">
                                <p className="date">19</p>
                                <span className="day">Fri</span>
                              </div>
                              <div className="th-item">
                                <p className="date">20</p>
                                <span className="day">Sat</span>
                              </div>
                              <div className="th-item">
                                <p className="date">21</p>
                                <span className="day">Sun</span>
                              </div>
                              <div className="th-item">
                                <p className="date">22</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">23</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item">
                                <p className="date">24</p>
                                <span className="day">Wed</span>
                              </div>
                              <div className="th-item">
                                <p className="date">25</p>
                                <span className="day">Thu</span>
                              </div>
                              <div className="th-item">
                                <p className="date">26</p>
                                <span className="day">Fri</span>
                              </div>
                              <div className="th-item">
                                <p className="date">27</p>
                                <span className="day">Sat</span>
                              </div>
                              <div className="th-item">
                                <p className="date">28</p>
                                <span className="day">Sun</span>
                              </div>
                              <div className="th-item">
                                <p className="date">29</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">30</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item">
                                <p className="date">31</p>
                                <span className="day">Wed</span>
                              </div>
                            </div>
                          </div>

                          {/************t body start ************/}

                          <div className="flex-body">
                            <div className="flex-row">
                              <div className="td-item text-uppercase">
                                Variant 1
                              </div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">23</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                            </div>
                            <div className="flex-row">
                              <div className="td-item text-uppercase">
                                Variant 2
                              </div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">23</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                            </div>
                            <div className="flex-row">
                              <div className="td-item text-uppercase">
                                Variant 3
                              </div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">23</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                            </div>
                            <div className="flex-row">
                              <div className="td-item text-uppercase">
                                Variant 4
                              </div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">23</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                            </div>
                          </div>
                        </div>
                      </Panel.Body>
                    </Panel.Collapse>
                  </Panel>
                </div>
                <div className="m-b-15">
                  <Form inline>
                    <FormGroup controlId="formInlineName">
                      <ControlLabel>Select Revision</ControlLabel>{" "}
                      <FormControl
                        componentClass="select"
                        placeholder="Select"
                        className="br-0"
                      >
                        <option value="select">select</option>
                        <option value="other">Revision 1</option>
                      </FormControl>
                    </FormGroup>{" "}
                  </Form>
                </div>
                {/******Next panel********/}
                <div className="month-panel">
                  <Panel id="collapsible-panel-example-2" defaultExpanded>
                    <Panel.Heading>
                      <Panel.Title toggle>
                        This Month <Glyphicon glyph="chevron-down" />
                        <span className="sub-on">
                          ( Revision{" "}
                          <small>
                            Submitted on <i>20:45</i> - <i>01 Nov 2018</i>
                          </small>{" "}
                          )
                        </span>
                      </Panel.Title>
                      <div className="flex justify-space-between flex-1 align-center act-control">
                        {/* <button className="btn btn-primary sm-btn text-uppercase">
                          Add variant
                        </button> */}
                        {/* <div className="flex align-center">
                          <label className="label--checkbox">
                            <input type="checkbox" className="checkbox" />
                            Copy variants and number from
                          </label>

                          <FormGroup controlId="formControlsSelect">
                            <FormControl
                              componentClass="select"
                              placeholder="MM"
                              className="s-arrow gray-card br-0 b-0"
                            >
                              <option value="select">Jan</option>
                              <option value="other">Feb</option>
                            </FormControl>
                          </FormGroup>
                          <FormGroup controlId="formControlsSelect">
                            <FormControl
                              componentClass="select"
                              placeholder="YYYY"
                              className="s-arrow gray-card br-0 b-0"
                            >
                              <option value="select">2018</option>
                              <option value="other">2017</option>
                            </FormControl>
                          </FormGroup>
                        </div> */}
                      </div>
                    </Panel.Heading>
                    <Panel.Collapse>
                      <Panel.Body>
                        <div className="flex-table">
                          <div className="flex-head">
                            <div className="flex-row">
                              <div className="th-item text-uppercase">
                                Variant
                              </div>
                              <div className="th-item">
                                <p className="date">1</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">2</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item today">
                                <p className="date">3</p>
                                <span className="day">Wed</span>
                              </div>
                              <div className="th-item">
                                <p className="date">4</p>
                                <span className="day">Thu</span>
                              </div>
                              <div className="th-item">
                                <p className="date">5</p>
                                <span className="day">Fri</span>
                              </div>
                              <div className="th-item">
                                <p className="date">6</p>
                                <span className="day">Sat</span>
                              </div>
                              <div className="th-item">
                                <p className="date">7</p>
                                <span className="day">Sun</span>
                              </div>
                              <div className="th-item">
                                <p className="date">8</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">9</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item">
                                <p className="date">10</p>
                                <span className="day">Wed</span>
                              </div>
                              <div className="th-item">
                                <p className="date">11</p>
                                <span className="day">Thu</span>
                              </div>
                              <div className="th-item">
                                <p className="date">12</p>
                                <span className="day">Fri</span>
                              </div>
                              <div className="th-item">
                                <p className="date">13</p>
                                <span className="day">Sat</span>
                              </div>
                              <div className="th-item">
                                <p className="date">14</p>
                                <span className="day">Sun</span>
                              </div>
                              <div className="th-item">
                                <p className="date">15</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">16</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item">
                                <p className="date">17</p>
                                <span className="day">Wed</span>
                              </div>
                              <div className="th-item">
                                <p className="date">18</p>
                                <span className="day">Thu</span>
                              </div>
                              <div className="th-item">
                                <p className="date">19</p>
                                <span className="day">Fri</span>
                              </div>
                              <div className="th-item">
                                <p className="date">20</p>
                                <span className="day">Sat</span>
                              </div>
                              <div className="th-item">
                                <p className="date">21</p>
                                <span className="day">Sun</span>
                              </div>
                              <div className="th-item">
                                <p className="date">22</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">23</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item">
                                <p className="date">24</p>
                                <span className="day">Wed</span>
                              </div>
                              <div className="th-item">
                                <p className="date">25</p>
                                <span className="day">Thu</span>
                              </div>
                              <div className="th-item">
                                <p className="date">26</p>
                                <span className="day">Fri</span>
                              </div>
                              <div className="th-item">
                                <p className="date">27</p>
                                <span className="day">Sat</span>
                              </div>
                              <div className="th-item">
                                <p className="date">28</p>
                                <span className="day">Sun</span>
                              </div>
                              <div className="th-item">
                                <p className="date">29</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">30</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item">
                                <p className="date">31</p>
                                <span className="day">Wed</span>
                              </div>
                            </div>
                          </div>

                          {/************t body start ************/}

                          <div className="flex-body">
                            <div className="flex-row">
                              <div className="td-item text-uppercase">
                                Variant 1
                              </div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">23</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                            </div>
                            <div className="flex-row">
                              <div className="td-item text-uppercase">
                                Variant 2
                              </div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">23</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                            </div>
                            <div className="flex-row">
                              <div className="td-item text-uppercase">
                                Variant 3
                              </div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">23</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                            </div>
                            <div className="flex-row">
                              <div className="td-item text-uppercase">
                                Variant 4
                              </div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">23</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                            </div>
                          </div>
                        </div>
                      </Panel.Body>
                    </Panel.Collapse>
                  </Panel>
                </div>

                <div className="month-panel">
                  <Panel id="collapsible-panel-example-2" defaultExpanded>
                    <Panel.Heading>
                      <Panel.Title toggle>
                        Next Month <Glyphicon glyph="chevron-down" />{" "}
                      </Panel.Title>
                      <div className="flex justify-space-between flex-1 align-center act-control">
                        {/* <button className="btn btn-primary sm-btn text-uppercase">
                          Add variant
                        </button> */}
                        {/* <div className="flex align-center">
                          <label className="label--checkbox">
                            <input type="checkbox" className="checkbox" />
                            Copy variants and number from
                          </label>

                          <FormGroup controlId="formControlsSelect">
                            <FormControl
                              componentClass="select"
                              placeholder="MM"
                              className="s-arrow gray-card br-0 b-0"
                            >
                              <option value="select">Jan</option>
                              <option value="other">Feb</option>
                            </FormControl>
                          </FormGroup>
                          <FormGroup controlId="formControlsSelect">
                            <FormControl
                              componentClass="select"
                              placeholder="YYYY"
                              className="s-arrow gray-card br-0 b-0"
                            >
                              <option value="select">2018</option>
                              <option value="other">2017</option>
                            </FormControl>
                          </FormGroup>
                        </div> */}
                      </div>
                    </Panel.Heading>
                    <Panel.Collapse>
                      <Panel.Body>
                        <div className="flex-table">
                          <div className="flex-head">
                            <div className="flex-row">
                              <div className="th-item text-uppercase">
                                Variant
                              </div>
                              <div className="th-item">
                                <p className="date">1</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">2</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item today">
                                <p className="date">3</p>
                                <span className="day">Wed</span>
                              </div>
                              <div className="th-item">
                                <p className="date">4</p>
                                <span className="day">Thu</span>
                              </div>
                              <div className="th-item">
                                <p className="date">5</p>
                                <span className="day">Fri</span>
                              </div>
                              <div className="th-item">
                                <p className="date">6</p>
                                <span className="day">Sat</span>
                              </div>
                              <div className="th-item">
                                <p className="date">7</p>
                                <span className="day">Sun</span>
                              </div>
                              <div className="th-item">
                                <p className="date">8</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">9</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item">
                                <p className="date">10</p>
                                <span className="day">Wed</span>
                              </div>
                              <div className="th-item">
                                <p className="date">11</p>
                                <span className="day">Thu</span>
                              </div>
                              <div className="th-item">
                                <p className="date">12</p>
                                <span className="day">Fri</span>
                              </div>
                              <div className="th-item">
                                <p className="date">13</p>
                                <span className="day">Sat</span>
                              </div>
                              <div className="th-item">
                                <p className="date">14</p>
                                <span className="day">Sun</span>
                              </div>
                              <div className="th-item">
                                <p className="date">15</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">16</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item">
                                <p className="date">17</p>
                                <span className="day">Wed</span>
                              </div>
                              <div className="th-item">
                                <p className="date">18</p>
                                <span className="day">Thu</span>
                              </div>
                              <div className="th-item">
                                <p className="date">19</p>
                                <span className="day">Fri</span>
                              </div>
                              <div className="th-item">
                                <p className="date">20</p>
                                <span className="day">Sat</span>
                              </div>
                              <div className="th-item">
                                <p className="date">21</p>
                                <span className="day">Sun</span>
                              </div>
                              <div className="th-item">
                                <p className="date">22</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">23</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item">
                                <p className="date">24</p>
                                <span className="day">Wed</span>
                              </div>
                              <div className="th-item">
                                <p className="date">25</p>
                                <span className="day">Thu</span>
                              </div>
                              <div className="th-item">
                                <p className="date">26</p>
                                <span className="day">Fri</span>
                              </div>
                              <div className="th-item">
                                <p className="date">27</p>
                                <span className="day">Sat</span>
                              </div>
                              <div className="th-item">
                                <p className="date">28</p>
                                <span className="day">Sun</span>
                              </div>
                              <div className="th-item">
                                <p className="date">29</p>
                                <span className="day">Mon</span>
                              </div>
                              <div className="th-item">
                                <p className="date">30</p>
                                <span className="day">Tue</span>
                              </div>
                              <div className="th-item">
                                <p className="date">31</p>
                                <span className="day">Wed</span>
                              </div>
                            </div>
                          </div>

                          {/************t body start ************/}

                          <div className="flex-body">
                            <div className="flex-row">
                              <div className="td-item text-uppercase">
                                Variant 1
                              </div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">23</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                            </div>
                            <div className="flex-row">
                              <div className="td-item text-uppercase">
                                Variant 2
                              </div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">23</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                            </div>
                            <div className="flex-row">
                              <div className="td-item text-uppercase">
                                Variant 3
                              </div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">23</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                            </div>
                            <div className="flex-row">
                              <div className="td-item text-uppercase">
                                Variant 4
                              </div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">22</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">23</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                              <div className="td-item">{""}</div>
                            </div>
                          </div>
                        </div>
                      </Panel.Body>
                    </Panel.Collapse>
                  </Panel>
                </div>

                <p className="once-title">
                  <span>Agreed:</span>{" "}
                  <label className="label--checkbox">
                    <input type="checkbox" className="checkbox" />
                    Copy variants and number from
                  </label>
                </p>

                <div className="revision-area">
                  <div className="flex">
                    <div className="top-col"> </div>
                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 1
                      </span>
                    </div>

                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 2
                      </span>
                    </div>
                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 3
                      </span>
                    </div>
                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 4
                      </span>
                    </div>
                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 5
                      </span>
                    </div>
                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 6
                      </span>
                    </div>
                    <div className="top-col">
                      <span className="user-add">
                        <span className="ico-add">
                          <svg>
                            <use xlinkHref={`${Sprite}#plus-OIco`} />
                          </svg>
                        </span>
                        &nbsp;Add User 7
                      </span>
                    </div>
                  </div>

                  <div className="r-drop-panel">
                    <Panel id="collapsible-panel-example-2" defaultExpanded>
                      <Panel.Heading>
                        <Panel.Title toggle>
                          Revision 3 <Glyphicon glyph="chevron-down" />
                        </Panel.Title>
                      </Panel.Heading>
                      <Panel.Collapse>
                        <Panel.Body>
                          <div className="flex">
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                          </div>
                        </Panel.Body>
                      </Panel.Collapse>
                    </Panel>
                  </div>
                  <div className="r-drop-panel">
                    <Panel id="collapsible-panel-example-2">
                      <Panel.Heading>
                        <Panel.Title toggle>
                          Revision 2 <Glyphicon glyph="chevron-down" />
                        </Panel.Title>
                      </Panel.Heading>
                      <Panel.Collapse>
                        <Panel.Body>
                          <div className="flex">
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                          </div>
                        </Panel.Body>
                      </Panel.Collapse>
                    </Panel>
                  </div>
                  <div className="r-drop-panel">
                    <Panel id="collapsible-panel-example-2">
                      <Panel.Heading>
                        <Panel.Title toggle>
                          Revision 1 <Glyphicon glyph="chevron-down" />
                        </Panel.Title>
                      </Panel.Heading>
                      <Panel.Collapse>
                        <Panel.Body>
                          <div className="flex">
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                            </div>
                          </div>
                        </Panel.Body>
                      </Panel.Collapse>
                    </Panel>
                  </div>
                </div>
              </div>
            </div>
            <Footer
              pageTitle={permissionConstant.footer_title.product_planning}
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
      actionGetDiscloserData,
      actionApproveRejectNonDiscloser
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
)(ProductPlanning);
