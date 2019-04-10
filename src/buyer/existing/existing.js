import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import Sprite from "../../img/sprite.svg";
import {
  Row,
  Col,
  FormControl,
  FormGroup,
  ControlLabel,
  Table
} from "react-bootstrap";
import Slider from "react-slick";
import Image1 from "../../img/image.png";

import {
  actionLoaderHide,
  actionLoaderShow,
  actionApproveRejectNonDiscloser
} from "../../common/core/redux/actions";

import Header from "../common/header";
import SideBar from "../common/sideBar";
import Footer from "../common/footer";
import CONSTANTS from "../../common/core/config/appConfig";
import { handlePermission } from "../../common/permissions";
let { permissionConstant } = CONSTANTS;
class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "reviewSupplier",
      nav1: null,
      nav2: null,
      reviewData: this.props.location.state && this.props.location.state.data,
      faciliyPictures: [],
      documentsList: [],
      otherDocList: []
    };
    console.log("rreview datra..........", this.state.reviewData);
    // get srcSet() {
    //   return images.map(image => {
    //     return `${Image1}${image.name} ${image.vw}`;
    //   }).join(', ')
    // }

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.openDocument = this.openDocument.bind(this);
    this.approveSupplierRegis = this.approveSupplierRegis.bind(this);
  }

  componentWillMount() {
    let faciliyPictures = this.state.faciliyPictures || [];
    let documentsList = this.state.documentsList || [];
    let reviewData = this.state.reviewData || [];
    reviewData &&
      reviewData.registrationResponse &&
      reviewData.registrationResponse.listOfDocumentsUpload &&
      reviewData.registrationResponse.listOfDocumentsUpload.forEach(function(
        item,
        index
      ) {
        if (item.documentType === "Facility pictures") {
          faciliyPictures.push(item);
        } else {
          documentsList.push(item);
        }
      });
    this.setState({
      faciliyPictures: faciliyPictures,
      documentsList: documentsList,
      otherDocList:
        reviewData &&
        reviewData.registrationResponse &&
        reviewData.registrationResponse.listOfDocumentsUpload &&
        reviewData.registrationResponse.listOfOtherDocumentsUpload
    });
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

  openDocument(event, data) {
    window.open(data);
  }

  approveSupplierRegis() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id || "",
      roleId: this.props.userInfo.userData.userRole || "",
      approvalId: this.state.reviewData && this.state.reviewData.id,
      comments: "comments",
      status: "approved",
      supplierUserId:
        this.state.reviewData &&
        this.state.reviewData.supplierUserDetailResponse &&
        this.state.reviewData.supplierUserDetailResponse.id
    };

    this.props.actionLoaderShow();
    this.props
      .actionApproveRejectNonDiscloser(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === "reviewSupplier" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <h4 className="hero-title text-uppercase">
                  Supplier Existing Business details
                </h4>

                <Table responsive bordered className="custom-table">
                  <thead>
                    <tr>
                      <th rowspan="2" className="b-right">
                        BUYER ORGANIZATION
                      </th>
                      <th rowspan="2" className="b-right">
                        DELIVERY ADDRESS
                      </th>
                      <th colspan="6" scope="colgroup" className="b-right">
                        NO. OF PARTS
                      </th>
                      <th colspan="6" scope="colgroup">
                        APPROXIMATE REVENUE
                      </th>
                      <th rowspan="2" className="b-left">
                        TESTMONIAL
                      </th>
                    </tr>
                    <tr>
                      <th scope="col" className="b-right">
                        YEAR 0
                      </th>
                      <th scope="col" className="b-right">
                        YEAR 1
                      </th>
                      <th scope="col" className="b-right">
                        YEAR 2
                      </th>
                      <th scope="col" className="b-right">
                        YEAR 3
                      </th>
                      <th scope="col" className="b-right">
                        YEAR 4
                      </th>
                      <th scope="col" className="b-right">
                        YEAR 5{" "}
                      </th>
                      <th scope="col" className="b-right">
                        YEAR 0
                      </th>
                      <th scope="col" className="b-right">
                        YEAR 1
                      </th>
                      <th scope="col" className="b-right">
                        YEAR 2
                      </th>
                      <th scope="col" className="b-right">
                        YEAR 3
                      </th>
                      <th scope="col" className="b-right">
                        YEAR 4
                      </th>
                      <th scope="col">YEAR 5 </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="b-right">Teddy Bears</td>
                      <td className="b-right">50,000</td>
                      <td className="b-right">30,000</td>
                      <td className="b-right">100,000</td>
                      <td className="b-right">50,000</td>
                      <td className="b-right">30,000</td>
                      <td className="b-right">100,000</td>
                      <td className="b-right">80,000</td>
                      <td className="b-right">50,000</td>
                      <td className="b-right">30,000</td>
                      <td className="b-right">100,000</td>
                      <td className="b-right">50,000</td>
                      <td className="b-right">30,000</td>
                      <td className="b-right">100,000</td>
                      <td>
                        {" "}
                        <button className="btn-hollow text-info fill-brown">
                          <span className="ico-right cursor-pointer">
                            <svg>
                              <use xlinkHref={`${Sprite}#upload3Ico`} />
                            </svg>
                          </span>
                          Upload
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-right">Teddy Bears</td>
                      <td className="b-right">50,000</td>
                      <td className="b-right">30,000</td>
                      <td className="b-right">100,000</td>
                      <td className="b-right">50,000</td>
                      <td className="b-right">30,000</td>
                      <td className="b-right">100,000</td>
                      <td className="b-right">80,000</td>
                      <td className="b-right">50,000</td>
                      <td className="b-right">30,000</td>
                      <td className="b-right">100,000</td>
                      <td className="b-right">50,000</td>
                      <td className="b-right">30,000</td>
                      <td className="b-right">100,000</td>
                      <td>
                        {" "}
                        <button className="btn-hollow text-info fill-brown">
                          <span className="ico-right cursor-pointer">
                            <svg>
                              <use xlinkHref={`${Sprite}#upload3Ico`} />
                            </svg>
                          </span>
                          Upload
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
            <Footer pageTitle={permissionConstant.footer_title.existing} />
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
      actionApproveRejectNonDiscloser
    },
    dispatch
  );
};

const mapStateToProps = state => {
  console.log(state);
  return {
    userInfo: state.User,
    supplierParts: state.supplierParts
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary);
