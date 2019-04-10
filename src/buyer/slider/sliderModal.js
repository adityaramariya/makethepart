import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { bindActionCreators } from "redux";
import FileSaver from "file-saver";
import { connect } from "react-redux";
import SliderImage from "./slider";
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  Modal,
  Button,
  Table,
  DropdownButton,
  MenuItem,
  ButtonToolbar
} from "react-bootstrap";
import {
  actionGetApproverList,
  actionUserLogout,
  actionGenerateOTPToAddUser,
  actionSupplierAddUser,
  actionLoaderHide,
  actionLoaderShow
} from "../../common/core/redux/actions";
import Sprite from "../../img/sprite.svg";

class SliderModal extends Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleSingleDownload = this.handleSingleDownload.bind(this);
    this.singleDownLoad = this.singleDownLoad.bind(this);
    this.state = {
      show: false,
      singleDownloadIndex: 0,
      combineddMedia: this.props.partMediaResponses
    };
    this.handleShow();
  }

  componentDidMount() {
    let media = this.props.specificationResponses
      ? this.props.partMediaResponses.concat(this.props.specificationResponses)
      : this.props.partMediaResponses;
    this.setState({ combineddMedia: media });
  }

  handleClose() {
    this.props.handleCloseModal();
  }

  handleShow() {
    let show = this.props.show;
    this.setState({ show: show });
  }

  handleDownload() {
    let listOfPath = this.state.combineddMedia.map(function(data) {
      return data.mediaURL.split("/").pop(-1);
    });
    let data = {
      partCode: this.props.partId,
      listOfFilePath: listOfPath
    };
    axios({
      url: "/api/v1/cloud/aws/download",
      method: "POST",
      data: data,
      responseType: "blob"
    }).then(response => {
      // Log somewhat to show that the browser actually exposes the custom HTTP header
      //     let fileNameHeader = "x-suggested-filename";
      // let suggestedFileName = response.headers[fileNameHeader];
      // let effectiveFileName = (suggestedFileName === undefined
      //             ? "data..zip"
      //             : suggestedFileName);

      // console.log("Received header [" + fileNameHeader + "]: " + suggestedFileName
      //             + ", effective fileName: " + effectiveFileName);

      // // Let the user save the file.
      // FileSaver.saveAs(response.data, effectiveFileName);
      var url = window.URL.createObjectURL(new Blob([response.data]));
      var link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data.partCode + "." + "zip");
      document.body.appendChild(link);
      link.click();
    });
  }

  singleDownLoad(index) {
    this.setState({ singleDownloadIndex: index });
  }

  handleSingleDownload() {
    let listOfPath = this.state.combineddMedia.map(function(data) {
      return data.mediaURL.split("/").pop(-1);
    });
    let filePath = this.state.combineddMedia[
      parseInt(this.state.singleDownloadIndex, 10)
    ].mediaURL
      .split("/")
      .pop(-1);
    axios({
      url: "/api/v1/cloud/aws/download?filePath=" + filePath,
      method: "GET",
      responseType: "blob" // important
    }).then(response => {
      var url = window.URL.createObjectURL(new Blob([response.data]));
      var link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filePath);
      document.body.appendChild(link);
      link.click();
    });
  }

  render() {
    return (
      <div>
        <Modal
          show={this.props.show}
          onHide={this.handleClose}
          className="slider-modal"
        >
          <Modal.Header>
            <div className="flex justify-space-between">
              <h4>
                Part No.: <b>{this.props.partNumber}</b>
              </h4>
              <div className="flex">
                {this.state.combineddMedia &&
                this.state.combineddMedia.length > 1 ? (
                  <button
                    className="btn btn-text text-uppercase text-orange"
                    onClick={this.handleDownload}
                  >
                    {/* <a  href={this.state.imageUrl} download> */}

                    <span className="ico-download1">
                      <svg>
                        <use xlinkHref={`${Sprite}#downloadLIco`} />
                      </svg>
                    </span>
                  </button>
                ) : (
                  ""
                )}
                <button
                  class="btn btn-link text-uppercase color-light"
                  onClick={this.handleClose}
                >
                  close
                </button>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <SliderImage
              partMediaResponses={this.state.combineddMedia}
              singleDownLoad={this.singleDownLoad}
            />

            <div className="text-center">
              <button
                className="btn btn-text text-uppercase text-orange"
                onClick={this.handleSingleDownload}
              >
                <span className="ico-download1">
                  <svg>
                    <use xlinkHref={`${Sprite}#downloadLIco`} />
                  </svg>
                </span>
                download attachment
              </button>
            </div>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer> */}
        </Modal>
      </div>
    );
  }
}

export default SliderModal;
