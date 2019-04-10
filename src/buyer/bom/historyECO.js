import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Table,
  Modal,
  Pagination,
  Row,
  Col,
  Popover,
  OverlayTrigger,
  Tab,
  Nav,
  NavItem,
  Button,
  DropdownButton,
  Panel,
  MenuItem
} from "react-bootstrap";
import Sprite from "../../img/sprite.svg";

import {
  actionLoaderHide,
  actionLoaderShow
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
class HistoryECO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "eighth",
      comment: "",
      showApprovedText: false,
      showRejectedText: false
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
                <div className="flex justify-space-between m-t-20">
                  <h4>Product Change Timeline</h4>
                  <span className="list-f-dd">
                    <DropdownButton
                      className="btn btn-info sm-btn text-uppercase"
                      title="Filter"
                    >
                      <li>uuuu</li>
                      <li>ljlj</li>
                      <li>ljlj</li>
                      <li>ljlj</li>
                    </DropdownButton>
                  </span>
                </div>

                <div className="style2-tab bg-tab">
                  <Tab.Container
                    id="tabs-with-dropdown"
                    defaultActiveKey="first"
                  >
                    <Row className="clearfix">
                      <Col sm={12}>
                        <Nav bsStyle="tabs">
                          <NavItem eventKey="first">Variant 1</NavItem>
                          <NavItem eventKey="second">Variant 2</NavItem>
                          <NavItem eventKey="third">Variant 3</NavItem>
                          <NavItem eventKey="fourth">Variant 4</NavItem>
                        </Nav>
                      </Col>
                      <Col sm={12}>
                        <Tab.Content animation>
                          <Tab.Pane eventKey="first">
                            <Row>
                              <Col md={6}>
                                <div className="p-20">
                                  <div className="w-300 m-auto text-center text-uppercase gray-card fw-600 p-20">
                                    engineering change order
                                  </div>

                                  <div className="summ-time-line change-timeline">
                                    <ul className="timeline">
                                      <li className="flex justify-center">
                                        <div className="order-tag flex">
                                          <div className="o-lg-col">
                                            <h5 className="fw-600">
                                              ECO 2 Released
                                            </h5>

                                            <p>xx Removed</p>
                                            <p>xx Deleted</p>
                                            <p>xx Added</p>
                                            <p>xx Created</p>
                                          </div>
                                          <div className="o-sm-col flex align-center justify-center">
                                            <h4 className="bg-curr">+ $40</h4>
                                            <p>$5 Scrap</p>
                                            <div className="tl-date fw-600">
                                              10 Nov 2018
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                      <li className="flex justify-center">
                                        <div className="order-tag flex">
                                          <div className="o-lg-col">
                                            <h5 className="fw-600">
                                              ECO 2 Released
                                            </h5>

                                            <p>xx Removed</p>
                                            <p>xx Deleted</p>
                                            <p>xx Added</p>
                                            <p>xx Created</p>
                                          </div>
                                          <div className="o-sm-col flex align-center justify-center">
                                            <h4 className="bg-curr">+ $40</h4>
                                            <p>$5 Scrap</p>
                                            <div className="tl-date fw-600">
                                              10 Nov 2018
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="p-20">
                                  <div className="w-300 m-auto text-center text-uppercase gray-card fw-600 p-20">
                                    change Implemention
                                  </div>

                                  <div className="summ-time-line change-timeline tl-l-align">
                                    <ul className="timeline top-sp">
                                      <li className="flex justify-center">
                                        <div className="order-tag flex">
                                          <span className="text-uppercase c-date">
                                            15 nov 2018
                                          </span>
                                          <div className="o-lg-col">
                                            <span className="left-chev" />
                                            <h5 className="fw-600 text-center">
                                              ECO 1 Implemented
                                            </h5>

                                            <table className="eco-data">
                                              <tr>
                                                <td>Product SI. No. :</td>
                                                <td>123456</td>
                                              </tr>
                                              <tr>
                                                <td>Total Cost :</td>
                                                <td>
                                                  <span>+$41;</span> $31 Scrap
                                                </td>
                                              </tr>
                                            </table>
                                          </div>
                                        </div>
                                      </li>
                                      <li className="flex justify-center ">
                                        <div className="order-tag flex">
                                          <div className="o-lg-col sub-tag">
                                            <span className="left-chev" />
                                            <h5 className="fw-600 text-center">
                                              ECO 1 Implemented
                                            </h5>

                                            <table className="eco-data">
                                              <tr>
                                                <td>Product SI. No. :</td>
                                                <td>123456</td>
                                              </tr>
                                              <tr>
                                                <td>Total Cost :</td>
                                                <td>
                                                  <span>+$41;</span> $31 Scrap
                                                </td>
                                              </tr>
                                            </table>
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Tab.Pane>
                          <Tab.Pane eventKey="second">Tab 2 content</Tab.Pane>
                          <Tab.Pane eventKey="third">Tab 3 content</Tab.Pane>
                          <Tab.Pane eventKey="fourth">Tab 4 content</Tab.Pane>
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </div>
              </div>
            </div>
            <Footer pageTitle={permissionConstant.footer_title.history_eco} />
          </div>
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionLoaderHide,
    actionLoaderShow,
    dispatch
  });
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
)(HistoryECO);
