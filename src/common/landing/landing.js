import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Tabs,
  Tab,
  TabContainer,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  FormGroup,
  FormControl,
  ControlLabel,
  Navbar,
  MenuItem,
  NavDropdown,
  Form,
  Button,
  Table
} from "react-bootstrap";
import Images from "../../img/logo.png";
import userImage from "../../img/user.jpg";
import Sprite from "../../img/sprite.svg";

class Landing extends Component {
  render() {
    return (
      <div>
        <section className="db-section">
          <div className="mj-nav">
            <Navbar inverse collapseOnSelect>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="#brand">
                    {" "}
                    <img src={Images} />
                  </a>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                {/* <Nav>
                  <NavItem eventKey={1} href="#">
                    Link
                  </NavItem>
                  <NavItem eventKey={2} href="#">
                    Link
                  </NavItem>
                  <NavDropdown
                    eventKey={3}
                    title="Dropdown"
                    id="basic-nav-dropdown"
                  >
                    <MenuItem eventKey={3.1}>Action</MenuItem>
                    <MenuItem eventKey={3.2}>Another action</MenuItem>
                    <MenuItem eventKey={3.3}>Something else here</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={3.3}>Separated link</MenuItem>
                  </NavDropdown>
                </Nav> */}
                <Nav pullRight>
                  <NavItem eventKey={1} href="#">
                    <span className="ico-nav">
                      <svg>
                        <use xlinkHref={`${Sprite}#calanderIco`} />
                      </svg>
                    </span>
                  </NavItem>
                  <NavItem eventKey={1} href="#">
                    <span className="ico-nav">
                      <svg>
                        <use xlinkHref={`${Sprite}#chatIco`} />
                      </svg>
                    </span>
                  </NavItem>
                  <NavItem eventKey={1} href="#">
                    <span className="ico-nav">
                      <svg>
                        <use xlinkHref={`${Sprite}#settingIco`} />
                      </svg>
                    </span>
                  </NavItem>
                  <NavItem eventKey={1} href="#">
                    <span className="ico-nav">
                      <svg>
                        <use xlinkHref={`${Sprite}#bellIco`} />
                      </svg>
                    </span>
                  </NavItem>

                  <NavItem eventKey={2} href="#" id="user-dd">
                    {/* <img src={Images} /> */}
                    <NavDropdown
                      eventKey={3}
                      title={<img src={userImage} />}
                      id="basic-nav-dropdown"
                    >
                      <MenuItem eventKey={3.1}>Action</MenuItem>
                      <MenuItem eventKey={3.2}>Another action</MenuItem>
                      <MenuItem eventKey={3.3}>Something else here</MenuItem>
                      <MenuItem divider />
                      <MenuItem eventKey={3.3}>Separated link</MenuItem>
                    </NavDropdown>
                  </NavItem>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </div>
          <div>
            <div className="container">
              <div className="dashboardWrapper">
                <div className="db-tab">
                  <Tab.Container
                    id="tabs-with-dropdown"
                    defaultActiveKey="first"
                  >
                    <Row className="clearfix">
                      <Col sm={12}>
                        <Nav bsStyle="tabs">
                          <NavItem eventKey="first">
                            <span className="ico-db">
                              <svg>
                                <use xlinkHref={`${Sprite}#poIco`} />
                              </svg>
                            </span>
                            PO Approvals
                          </NavItem>
                          <NavItem eventKey="second">
                            <span className="ico-db">
                              <svg>
                                <use xlinkHref={`${Sprite}#sMsgIco`} />
                              </svg>
                            </span>
                            Supplier Messages
                          </NavItem>
                          <NavItem eventKey="third">
                            <span className="ico-db">
                              <svg>
                                <use xlinkHref={`${Sprite}#quotIco`} />
                              </svg>
                            </span>
                            Quotations
                          </NavItem>
                          <NavItem eventKey="fourth">
                            <span className="ico-db">
                              <svg>
                                <use xlinkHref={`${Sprite}#supplierIco`} />
                              </svg>
                            </span>
                            Supplier Approvals
                          </NavItem>
                          <NavItem eventKey="fifth">
                            <span className="ico-db">
                              <svg>
                                <use xlinkHref={`${Sprite}#ndasIco`} />
                              </svg>
                            </span>
                            New NDAs
                          </NavItem>
                        </Nav>
                      </Col>
                      <Col sm={12}>
                        <Tab.Content animation>
                          <Tab.Pane eventKey="first">
                            <div className="db-filter m-flex m-align-center m-justify-space-between">
                              <h4>Supplier Approval</h4>
                              <div className="filter-in">
                                <Form inline>
                                  <FormGroup controlId="formInlineName">
                                    <ControlLabel>Search:</ControlLabel>
                                    <FormControl
                                      type="text"
                                      placeholder="Search any part"
                                    />
                                    <span className="ico-search">
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#searchIco`}
                                        />
                                      </svg>
                                    </span>
                                  </FormGroup>
                                  <FormGroup controlId="formInlineSelect">
                                    <ControlLabel>Sort By:</ControlLabel>
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                    >
                                      <option value="select">select</option>
                                      <option value="other">
                                        dfgfhhhhhhfhdshdshdsh
                                      </option>
                                    </FormControl>
                                  </FormGroup>
                                </Form>
                              </div>
                            </div>

                            <div className="custom-responsive">
                              <div className="table-row">
                                <div className="table-col">Program code</div>

                                <div className="table-col">Parts Submitted</div>

                                <div className="table-col">Parts Deleted</div>

                                <div className="table-col">Parts Quoted</div>

                                <div className="table-col">Parts Ordrer</div>

                                <div className="table-col">
                                  Parts in Deleiverd
                                </div>

                                <div className="table-col">Parts Transit</div>

                                <div className="table-col">Parts Rejected</div>
                              </div>

                              <div className="table-row">
                                <div className="table-col">Jack sparrow</div>

                                <div className="table-col">Male</div>

                                <div className="table-col">New york</div>

                                <div className="table-col">United states</div>

                                <div className="table-col">0000-00-00</div>

                                <div className="table-col">jack@gmail.com</div>

                                <div className="table-col">
                                  22 baker st. NYC USA
                                </div>

                                <div className="table-col">Parts Rejected</div>
                              </div>

                              <div className="table-row">
                                <div className="table-col">Jack sparrow</div>

                                <div className="table-col">Male</div>

                                <div className="table-col">New york</div>

                                <div className="table-col">United states</div>

                                <div className="table-col">0000-00-00</div>

                                <div className="table-col">jack@gmail.com</div>

                                <div className="table-col">
                                  22 baker st. NYC USA
                                </div>

                                <div className="table-col">Parts Rejected</div>
                              </div>

                              <div className="table-row">
                                <div className="table-col">Jack sparrow</div>

                                <div className="table-col">Male</div>

                                <div className="table-col">New york</div>

                                <div className="table-col">United states</div>

                                <div className="table-col">0000-00-00</div>

                                <div className="table-col">jack@gmail.com</div>

                                <div className="table-col">
                                  22 baker st. NYC USA
                                </div>

                                <div className="table-col">Parts Rejected</div>
                              </div>

                              <div className="table-row">
                                <div className="table-col">Jack sparrow</div>

                                <div className="table-col">Male</div>

                                <div className="table-col">New york</div>

                                <div className="table-col">United states</div>

                                <div className="table-col">0000-00-00</div>

                                <div className="table-col">jack@gmail.com</div>

                                <div className="table-col">
                                  22 baker st. NYC USA
                                </div>

                                <div className="table-col">Parts Rejected</div>
                              </div>
                            </div>
                          </Tab.Pane>
                          <Tab.Pane eventKey="second">Tab 2 content</Tab.Pane>
                          <Tab.Pane eventKey="third">Tab 2 content</Tab.Pane>
                          <Tab.Pane eventKey="fourth">Tab 2 content</Tab.Pane>
                          <Tab.Pane eventKey="fifth">Tab 2 content</Tab.Pane>
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Landing;
