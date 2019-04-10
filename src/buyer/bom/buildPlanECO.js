import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Popover,
  Tab,
  Nav,
  NavItem,
  Panel,
  Glyphicon
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
import Slider from "react-slick";
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
class BuildPlanECO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "tenth"
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
    let self = this;
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
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
                <h4 className="hero-title">Project XXXX Build Plan</h4>
                <div className="style2-tab bg-tab m-b-30">
                  <Tab.Container
                    id="tabs-with-dropdown"
                    defaultActiveKey="first"
                  >
                    <Row className="clearfix">
                      <Col sm={12}>
                        <Nav bsStyle="tabs">
                          <NavItem eventKey="first">Project 1</NavItem>
                          <NavItem eventKey="second">Project 2</NavItem>
                        </Nav>
                      </Col>
                      <Col sm={12}>
                        <Tab.Content animation>
                          <Tab.Pane eventKey="first">
                            <div className="container-fluid">
                              <div className="m-t-20 ">
                                {" "}
                                <div className="w100 sliderDash m-auto">
                                  <Slider {...settings}>
                                    <div>
                                      <h3 className="text-center">
                                        Revision 1
                                      </h3>
                                    </div>
                                    <div>
                                      <h3 className="text-center">
                                        Revision 2
                                      </h3>
                                    </div>
                                    <div>
                                      <h3 className="text-center">
                                        Revision 2
                                      </h3>
                                    </div>
                                  </Slider>
                                </div>
                              </div>
                              <Row>
                                <Col md={1} className="p-r-0">
                                  <div className="btn-col text-center">
                                    <button className="btn btn-primary text-uppercase">
                                      Add phase
                                    </button>
                                    <button className="btn btn-primary text-uppercase">
                                      Add variant
                                    </button>
                                  </div>
                                </Col>
                                <Col md={11}>
                                  <div className="b-p-warpper">
                                    <div className="flex-table">
                                      <div className="flex-head">
                                        <div className="flex-row">
                                          <div className="th-item text-uppercase">
                                            Build Phase
                                          </div>
                                          <div className="th-item text-uppercase">
                                            variant/Bom
                                          </div>
                                          <div className="th-item text-uppercase">
                                            variant discription
                                          </div>
                                          <div className="th-item text-uppercase">
                                            Refrence variant
                                          </div>
                                          <div className="th-item text-uppercase">
                                            no. of units in the build
                                          </div>
                                          <div className="th-item text-uppercase">
                                            Eoc
                                          </div>
                                          <div className="th-item text-uppercase">
                                            Material availability target
                                          </div>
                                          <div className="th-item text-uppercase">
                                            build finish target
                                          </div>
                                          <div className="th-item text-uppercase">
                                            product ship target
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex-body">
                                        <div className="flex-row">
                                          <div className="td-item">XX</div>
                                          <div className="td-item">
                                            <span className="l-root">
                                              XXXXX
                                            </span>
                                          </div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">
                                            <span className="sm-tip text-left">
                                              YYYY
                                            </span>
                                            XXXXX
                                            <span className="sm-tip color-light text-right">
                                              YYYY
                                            </span>
                                          </div>
                                          <div className="td-item">
                                            <span className="sm-tip text-left">
                                              YYYY
                                            </span>
                                            XXXXX
                                            <span className="sm-tip color-light text-right">
                                              YYYY
                                            </span>
                                          </div>
                                          <div className="td-item">
                                            <span className="sm-tip text-left">
                                              YYYY
                                            </span>
                                            XXXXX
                                            <span className="sm-tip color-light text-right">
                                              YYYY
                                            </span>
                                          </div>
                                          <div className="td-item">
                                            <span className="sm-tip text-left">
                                              YYYY
                                            </span>
                                            XXXXX
                                            <span className="sm-tip color-light text-right">
                                              YYYY
                                            </span>
                                          </div>
                                          <div className="td-item">
                                            <span className="sm-tip text-left">
                                              YYYY
                                            </span>
                                            XXXXX
                                            <span className="sm-tip color-light text-right">
                                              YYYY
                                            </span>
                                          </div>
                                          <div className="td-item">
                                            <span className="sm-tip text-left">
                                              YYYY
                                            </span>
                                            XXXXX
                                            <span className="sm-tip color-light text-right">
                                              YYYY
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex-row">
                                          <div className="td-item"> </div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                        </div>
                                        <div className="flex-row">
                                          <div className="td-item">YY</div>
                                          <div className="td-item">
                                            <span className="l-root">
                                              XXXXX
                                            </span>
                                          </div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">
                                            {" "}
                                            <span className="sm-tip text-left">
                                              YYYY
                                            </span>
                                            XXXXX
                                            <span className="sm-tip color-light text-right">
                                              YYYY
                                            </span>
                                          </div>
                                          <div className="td-item">
                                            {" "}
                                            <span className="sm-tip text-left">
                                              YYYY
                                            </span>
                                            XXXXX
                                            <span className="sm-tip color-light text-right">
                                              YYYY
                                            </span>
                                          </div>
                                          <div className="td-item">
                                            {" "}
                                            <span className="sm-tip text-left">
                                              YYYY
                                            </span>
                                            XXXXX
                                            <span className="sm-tip color-light text-right">
                                              YYYY
                                            </span>
                                          </div>
                                          <div className="td-item">
                                            {" "}
                                            <span className="sm-tip text-left">
                                              YYYY
                                            </span>
                                            XXXXX
                                            <span className="sm-tip color-light text-right">
                                              YYYY
                                            </span>
                                          </div>
                                          <div className="td-item">
                                            {" "}
                                            <span className="sm-tip text-left">
                                              YYYY
                                            </span>
                                            XXXXX
                                            <span className="sm-tip color-light text-right">
                                              YYYY
                                            </span>
                                          </div>
                                          <div className="td-item">
                                            {" "}
                                            <span className="sm-tip text-left">
                                              YYYY
                                            </span>
                                            XXXXX
                                            <span className="sm-tip color-light text-right">
                                              YYYY
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex-row">
                                          <div className="td-item"> </div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                          <div className="td-item">XXXXX</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                              <div className="text-center m-b-20">
                                <button className="btn btn-default">
                                  Submit
                                </button>
                                <button className="btn btn-success">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </Tab.Pane>
                          <Tab.Pane eventKey="second">Tab 2 content</Tab.Pane>
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </div>
                <p className="once-title ">
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

                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
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

                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
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

                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
                            </div>
                            <div className="top-col r-breif">
                              <h5>User 1 Date Stamp</h5>
                              <p>Comments:</p>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                              </span>
                              <p>
                                <Glyphicon
                                  glyph="edit"
                                  className="cursor-pointer"
                                />
                              </p>
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
)(BuildPlanECO);
