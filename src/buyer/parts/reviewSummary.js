import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  Form,
  Tab,
  Nav,
  NavItem,
  Table
} from "react-bootstrap";
import * as Datetime from "react-datetime";
import Image1 from "../../img/image.png";
import Image3 from "../../img/part.jpg";
import Sprite from "../../img/sprite.svg";
import {
  actionLoaderHide,
  actionLoaderShow,
  actionSummaryReviewData,
  actionSummaryDataByTab,
  actionTabData
} from "../../common/core/redux/actions";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import ReviewTabSummary from "./reviewTabSummary";
import { topPosition } from "../../common/commonFunctions";
import Footer from "../common/footer";
import CONSTANTS from "../../common/core/config/appConfig";
import { handlePermission } from "../../common/permissions";
let { permissionConstant } = CONSTANTS;

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      resData: "",
      tabKey: "reviewSumm",
      // partId: this.props.supplierParts.partDataById.partId,
      // partNumber: this.props.supplierParts.partDataById.partNumber
      partNumber: this.props.location.state.partNumber,
      partId: this.props.location.state.partId
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);

    console.log("partNumber : ", this.props.location.state.partNumber);
    console.log("partId :", this.props.location.state.partId);
  }

  componentDidMount() {
    let _this = this;
    let data = {
      partId: this.props.location.state.partId,
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      sortByDeliveryDate: false,
      sortByTotalAmount: true
    };
    this.props.actionLoaderShow();
    this.props
      .actionSummaryReviewData(data)
      .then((result, error) => {
        this.setState({ resData: result.payload.data.resourceData });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
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

  handleSelect(key, data) {
    console.log("key..  data....", key, data);
    this.setState({ key });
    if (data === "first") {
      this.props.actionSummaryDataByTab(
        this.props.supplierParts.summaryReviewData[0]
      );
      return;
    } else if (data === "second") {
      this.props.actionSummaryDataByTab(
        this.props.supplierParts.summaryReviewData[1]
      );
      return;
    } else if (data === "third") {
      this.props.actionSummaryDataByTab(
        this.props.supplierParts.summaryReviewData[2]
      );
      return;
    } else if (data === "fourth") {
      this.props.actionSummaryDataByTab(
        this.props.supplierParts.summaryReviewData[3]
      );
      return;
    } else {
      this.props.actionSummaryDataByTab(
        this.props.supplierParts.summaryReviewData[4]
      );
      return;
    }
  }

  render() {
    console.log(
      "supplierPart.summaryReviewData.............",
      this.props.supplierParts.summaryReviewData
    );
    return (
      <div>
        <Header {...this.props} />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === "reviewSumm" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <h4 className="hero-title">
                  Review Quotation Part (Part No.{" "}
                  {this.state.resData &&
                    this.state.resData[0].partResponse.partNumber}
                  )
                </h4>
                <div className="custom-tab">
                  <Tab.Container
                    id="tabs-with-dropdown"
                    defaultActiveKey="first"
                  >
                    <Row className="clearfix">
                      <Col sm={12}>
                        <Nav bsStyle="tabs">
                          <NavItem
                            eventKey="first"
                            onClick={event => this.handleSelect(event, "first")}
                          >
                            Quotation 1
                          </NavItem>
                          {this.props.supplierParts.summaryReviewData.length ===
                          2 ? (
                            <NavItem
                              eventKey="second"
                              onClick={event =>
                                this.handleSelect(event, "second")
                              }
                            >
                              Quotation 2
                            </NavItem>
                          ) : (
                            ""
                          )}
                          {this.props.supplierParts.summaryReviewData.length ===
                          3 ? (
                            <NavItem
                              eventKey="third"
                              onClick={event =>
                                this.handleSelect(event, "third")
                              }
                            >
                              Quotation 3
                            </NavItem>
                          ) : (
                            ""
                          )}
                          {this.props.supplierParts.summaryReviewData.length ===
                          4 ? (
                            <NavItem
                              eventKey="fourth"
                              onClick={event =>
                                this.handleSelect(event, "fourth")
                              }
                            >
                              Quotation 4
                            </NavItem>
                          ) : (
                            ""
                          )}
                          {this.props.supplierParts.summaryReviewData.length ===
                          5 ? (
                            <NavItem
                              eventKey="fifth"
                              onClick={event =>
                                this.handleSelect(event, "fifth")
                              }
                            >
                              Quotation 5
                            </NavItem>
                          ) : (
                            ""
                          )}
                        </Nav>
                      </Col>
                      <Col sm={12}>
                        <Tab.Content animation>
                          <Tab.Pane eventKey="first">
                            <ReviewTabSummary />
                          </Tab.Pane>
                          <Tab.Pane eventKey="second">
                            {" "}
                            <ReviewTabSummary />
                          </Tab.Pane>
                          <Tab.Pane eventKey="third">
                            {" "}
                            <ReviewTabSummary />
                          </Tab.Pane>
                          <Tab.Pane eventKey="fourth">
                            {" "}
                            <ReviewTabSummary />
                          </Tab.Pane>
                          <Tab.Pane eventKey="fivth">
                            {" "}
                            <ReviewTabSummary />
                          </Tab.Pane>
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </div>
              </div>
            </div>
            <Footer
              pageTitle={permissionConstant.footer_title.review_summary}
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
      actionSummaryReviewData,
      actionSummaryDataByTab,
      actionTabData
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
)(Summary);
