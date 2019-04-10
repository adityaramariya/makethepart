import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Sprite from "../../img/sprite.svg";
import { Table, FormControl } from "react-bootstrap";
import "react-datetime/css/react-datetime.css";
import * as moment from "moment";
import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetBusinessDetails,
  actionUploadDoc,
  actionUploadTestimonal
} from "../../common/core/redux/actions";
import { topPosition } from "../../common/commonFunctions";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import CONSTANTS from "../../common/core/config/appConfig";
let { customConstant } = CONSTANTS;

class BusinessDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "businessDetail",
      uploadArray: [],
      currentYear: moment().format("YYYY")
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.handleDocUpload = this.handleDocUpload.bind(this);
  }

  componentDidMount() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id || "",
      roleId: this.props.userInfo.userData.userRole || ""
    };
    this.props.actionLoaderShow();
    this.props
      .actionGetBusinessDetails(data)
      .then((result, error) => {
        let response = result.payload.data.resourceData;
        let uploadArray = _this.state.uploadArray;
        response.forEach(function(data) {
          if (data.testimonialDocResponse) {
            uploadArray.push({ status: "uploaded" });
          } else {
            uploadArray.push({ status: "" });
          }
        });

        this.setState({
          businessDetail: response,
          uploadArray: uploadArray
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === "first")
      this.props.history.push({
        pathname: "home",
        state: { path: "first" }
      });
    if (tabKey === "second") this.props.history.push("home");
    if (tabKey === "third")
      this.props.history.push({
        pathname: "home",
        state: { path: "third" }
      });
    this.setState({ tabKey: tabKey });
  }

  handleDocUpload(event, index) {
    let _this = this;
    let fileObject = event.target.files[0];
    if (fileObject) {
      const formData = new FormData();
      formData.set("mFile", fileObject);
      formData.append("thumbnailHeight", 100);
      formData.append("thumbnailWidth", 100);
      formData.append("isCreateThumbnail", true);
      formData.append("fileKey", fileObject.name);
      formData.append("filePath", fileObject.name);
      this.props.actionLoaderShow();
      this.props
        .actionUploadDoc(formData)
        .then((result, error) => {
          let response = result.payload.data;
          let mediaExtension = response.filePath.split(".").pop(-1);
          let uploadArray = _this.state.uploadArray;
          uploadArray[index].status = "uploaded";
          _this.setState({
            uploadArray: uploadArray
          });

          let data = {
            buyerId:
              this.state.businessDetail &&
              this.state.businessDetail[index].buyerResponse.id,
            userId: this.props.userInfo.userData.id,
            roleId: this.props.userInfo.userData.userRole,
            testmonialDocReq: {
              mediaName: response.filePath,
              mediaURL: response.s3FilePath,
              mediaType: response.contentType,
              mediaSize: response.fileSize,
              mediaExtension: mediaExtension
            }
          };
          _this.props.actionUploadTestimonal(data).then((result, error) => {
            let responseURL =
              result.payload.data.resourceData &&
              result.payload.data.resourceData.mediaURL;
            let businessDetail = _this.state.businessDetail;

            businessDetail[index].testimonialDocResponse = responseURL;
            _this.setState({
              businessDetail: businessDetail,
              responseURL: responseURL
            });
            console.log("responseURL...", responseURL);
          });

          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === "businessDetail" ? (
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
                      <th colspan="5" scope="colgroup" className="b-right">
                        NO. OF PARTS
                      </th>
                      <th colspan="5" scope="colgroup">
                        APPROXIMATE REVENUE
                      </th>
                      <th rowspan="2" className="b-left">
                        TESTMONIAL
                      </th>
                    </tr>
                    <tr>
                      <th scope="col" className="b-right">
                        {this.state.currentYear}
                      </th>
                      <th scope="col" className="b-right">
                        {this.state.currentYear - 1}
                      </th>
                      <th scope="col" className="b-right">
                        {this.state.currentYear - 2}
                      </th>
                      <th scope="col" className="b-right">
                        {this.state.currentYear - 3}
                      </th>
                      <th scope="col" className="b-right">
                        {this.state.currentYear - 4}
                      </th>

                      <th scope="col" className="b-right">
                        {this.state.currentYear}
                      </th>
                      <th scope="col" className="b-right">
                        {this.state.currentYear - 1}
                      </th>
                      <th scope="col" className="b-right">
                        {this.state.currentYear - 2}
                      </th>
                      <th scope="col" className="b-right">
                        {this.state.currentYear - 3}
                      </th>
                      <th scope="col" className="b-right">
                        {this.state.currentYear - 4}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.businessDetail &&
                      this.state.businessDetail.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="b-right">
                              {item.buyerResponse.companyName}
                            </td>
                            <td className="b-right"> Hardcoded address</td>

                            {item &&
                              item.yearwisePartsResponse.map((data, i) => {
                                return (
                                  <td className="b-right" key={i}>
                                    {data.numberOfParts}
                                  </td>
                                );
                              })}
                            {item &&
                              item.yearwiseRevenueResponse.map((data, i) => {
                                return (
                                  <td className="b-right" key={i}>
                                    {data.revenue}
                                  </td>
                                );
                              })}

                            <td>
                              {this.state.uploadArray &&
                              this.state.uploadArray[index] &&
                              this.state.uploadArray[index].status ===
                                "uploaded" ? (
                                // <button className="btn-hollow text-info fill-brown">
                                <div>
                                  {item &&
                                  item.testimonialDocResponse &&
                                  item.testimonialDocResponse.mediaURL ? (
                                    <a
                                      href={
                                        item &&
                                        item.testimonialDocResponse &&
                                        item.testimonialDocResponse.mediaURL
                                      }
                                      download
                                    >
                                      <button className="btn btn-primary text-uppercase">
                                        download{" "}
                                      </button>
                                    </a>
                                  ) : (
                                    <a href={this.state.responseURL} dowload>
                                      <button className="btn btn-primary text-uppercase">
                                        downloading{" "}
                                      </button>
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <div className="upload-btn text-info fill-brown">
                                  <FormControl
                                    id="formControlsFile"
                                    type="file"
                                    label="File"
                                    accept={
                                      customConstant.acceptedFormat
                                        .documentAcceptFormat
                                    }
                                    onChange={event => {
                                      this.handleDocUpload(event, index);
                                    }}
                                  />
                                  <span className="ico-right cursor-pointer">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#upload3Ico`} />
                                    </svg>
                                  </span>
                                  Upload
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
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
                        <Link
                          to="home"
                          onClick={() => this.navigateTo("second")}
                        >
                          Review Part for Quotation
                        </Link>
                      </li>
                      <li>
                        <a className="disabled">Quality certification</a>
                      </li>
                      <li>
                        <a className="disabled">Major Account Details</a>
                      </li>
                      <li>
                        <a className="disabled">Business Details</a>
                      </li>
                    </ul>

                    <ul className="p-tags">
                      <li>
                        <Link to="vendor">
                          Vendor Registration with the Buyer
                        </Link>
                      </li>
                      <li>
                        <a className="disabled">Buyer Criteria</a>
                      </li>
                      <li>
                        <Link
                          to={{
                            pathname: "home",
                            state: { path: "third" }
                          }}
                        >
                          Approve Quotation
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={{
                            pathname: "home",
                            state: { path: "first" }
                          }}
                        >
                          Dashboard
                        </Link>
                      </li>
                    </ul>

                    <ul className="p-tags">
                      {this.props.userInfo.userData.isAdmin ? (
                        <li>
                          <Link to="addUser">Add Users</Link>
                        </li>
                      ) : (
                        ""
                      )}
                      <li>
                        <Link to="updatePartStatus">Update Part Status</Link>
                      </li>
                      <li>
                        <a className="disabled">Download Parts Summary</a>
                      </li>
                      <li>
                        <Link to="infrastructureAudit">
                          Infrastructure Audit
                        </Link>
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
      actionGetBusinessDetails,
      actionUploadDoc,
      actionUploadTestimonal
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessDetails);
