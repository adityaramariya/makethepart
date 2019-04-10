import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { bindActionCreators } from "redux";
import FileSaver from "file-saver";
import { connect } from "react-redux";
import SliderImage from "./sliderUpload";
import _ from "lodash";
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
  actionLoaderHide,
  actionLoaderShow,
  actionUploadPicture
} from "../../common/core/redux/actions";
import Sprite from "../../img/sprite.svg";
import customConstant from "../../common/core/constants/customConstant";
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
      partMediaResponses: []
    };
    this.handleUploadPicture = this.handleUploadPicture.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
    this.handleShow();
  }

  componentDidMount() {
    this.setState({ partMediaResponses: this.props.partMediaResponses });
  }

  // componentWillReceiveProps(receive) {
  //   this.setState({
  //     partMediaResponses: this.props.supplierData.uploadedPictureList
  //   });
  // }

  handleClose() {
    this.props.handleCloseModal();
    this.props.handleCheckData(
      this.state.partMediaResponses,
      this.props.partIndex,
      this.props.uploadType
    );
  }

  handleShow() {
    let show = this.props.show;
    this.setState({ show: show });
  }

  handleDownload() {
    let listOfPath = this.state.partMediaResponses.map(function(data) {
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

  handleUploadPicture(event, index) {
    let filesLength = event.target.files.length;
    let _this = this;
    let reqArray = [];

    for (let j = 0; j < filesLength; j++) {
      let fileObject = event.target.files[j];
      if (fileObject) {
        let uploadPicturesResponse = {};
        let uploadPerfomaInvoiceResponse = {};
        let uploadFinalInvoiceResponse = {};
        let uploadMiscellaneousDocumentsResponse = {};
        let uploadMaterialInwardResponse = {};
        const formData = new FormData();
        formData.set("mFile", fileObject);
        formData.append("thumbnailHeight", 100);
        formData.append("thumbnailWidth", 100);
        formData.append("isCreateThumbnail", true);
        formData.append("fileKey", fileObject.name);
        formData.append("filePath", fileObject.name);
        this.props.actionLoaderShow();
        this.props
          .actionUploadPicture(formData)
          .then((result, error) => {
            let mediaExtension = result.payload.data.filePath
              .split(".")
              .pop(-1);

            if (this.props.uploadType === "uploadPicturesResponse") {
              uploadPicturesResponse.imageURL =
                customConstant.amazonURL + result.payload.data.s3FilePath;
              uploadPicturesResponse.mediaURL =
                customConstant.amazonURL + result.payload.data.s3FilePath;
              uploadPicturesResponse.mediaThumbnailUrl =
                customConstant.amazonURL +
                result.payload.data.s3ThumbnailFilePath;
              uploadPicturesResponse.mediaName = result.payload.data.filePath;
              uploadPicturesResponse.mediaSize = result.payload.data.fileSize;
              uploadPicturesResponse.mediaExtension = mediaExtension;
              uploadPicturesResponse.mediaType =
                result.payload.data.contentType;
              uploadPicturesResponse.contentType =
                result.payload.data.contentType;

              _this.state.partMediaResponses.push(uploadPicturesResponse);
            } else if (
              this.props.uploadType === "uploadPerfomaInvoiceResponse"
            ) {
              uploadPerfomaInvoiceResponse.imageURL =
                customConstant.amazonURL + result.payload.data.s3FilePath;
              uploadPerfomaInvoiceResponse.mediaURL =
                customConstant.amazonURL + result.payload.data.s3FilePath;
              uploadPerfomaInvoiceResponse.mediaName =
                result.payload.data.filePath;
              uploadPerfomaInvoiceResponse.mediaSize =
                result.payload.data.fileSize;
              uploadPerfomaInvoiceResponse.mediaExtension = mediaExtension;
              uploadPerfomaInvoiceResponse.mediaType =
                result.payload.data.contentType;
              uploadPerfomaInvoiceResponse.mediaThumbnailUrl =
                customConstant.amazonURL +
                result.payload.data.s3ThumbnailFilePath;
              uploadPerfomaInvoiceResponse.contentType =
                result.payload.data.contentType;

              _this.state.partMediaResponses.push(uploadPerfomaInvoiceResponse);
            } else if (this.props.uploadType === "uploadFinalInvoiceResponse") {
              uploadFinalInvoiceResponse.imageURL =
                customConstant.amazonURL + result.payload.data.s3FilePath;
              uploadFinalInvoiceResponse.mediaURL =
                customConstant.amazonURL + result.payload.data.s3FilePath;
              uploadFinalInvoiceResponse.mediaName =
                result.payload.data.filePath;
              uploadFinalInvoiceResponse.mediaSize =
                result.payload.data.fileSize;
              uploadFinalInvoiceResponse.mediaExtension = mediaExtension;
              uploadFinalInvoiceResponse.mediaType =
                result.payload.data.contentType;
              uploadFinalInvoiceResponse.mediaThumbnailUrl =
                customConstant.amazonURL +
                result.payload.data.s3ThumbnailFilePath;
              uploadFinalInvoiceResponse.contentType =
                result.payload.data.contentType;

              _this.state.partMediaResponses.push(uploadFinalInvoiceResponse);
            } else if (
              this.props.uploadType === "uploadMiscellaneousDocumentsResponse"
            ) {
              uploadMiscellaneousDocumentsResponse.imageURL =
                customConstant.amazonURL + result.payload.data.s3FilePath;
              uploadMiscellaneousDocumentsResponse.mediaURL =
                customConstant.amazonURL + result.payload.data.s3FilePath;
              uploadMiscellaneousDocumentsResponse.mediaName =
                result.payload.data.filePath;
              uploadMiscellaneousDocumentsResponse.mediaSize =
                result.payload.data.fileSize;
              uploadMiscellaneousDocumentsResponse.mediaExtension = mediaExtension;
              uploadMiscellaneousDocumentsResponse.mediaType =
                result.payload.data.contentType;
              uploadMiscellaneousDocumentsResponse.mediaThumbnailUrl =
                customConstant.amazonURL +
                result.payload.data.s3ThumbnailFilePath;
              uploadMiscellaneousDocumentsResponse.contentType =
                result.payload.data.contentType;

              _this.state.partMediaResponses.push(
                uploadMiscellaneousDocumentsResponse
              );
            } else if (
              this.props.uploadType === "uploadMaterialInwardResponse"
            ) {
              uploadMaterialInwardResponse.imageURL =
                customConstant.amazonURL + result.payload.data.s3FilePath;
              uploadMaterialInwardResponse.mediaURL =
                customConstant.amazonURL + result.payload.data.s3FilePath;
              uploadMaterialInwardResponse.mediaName =
                result.payload.data.filePath;
              uploadMaterialInwardResponse.mediaSize =
                result.payload.data.fileSize;
              uploadMaterialInwardResponse.mediaExtension = mediaExtension;
              uploadMaterialInwardResponse.mediaType =
                result.payload.data.contentType;
              uploadMaterialInwardResponse.mediaThumbnailUrl =
                customConstant.amazonURL +
                result.payload.data.s3ThumbnailFilePath;
              uploadMaterialInwardResponse.contentType =
                result.payload.data.contentType;

              _this.state.partMediaResponses.push(uploadMaterialInwardResponse);
            }

            _this.setState({
              partMediaResponses: this.state.partMediaResponses
            });
            _this.props.actionLoaderHide();
          })
          .catch(e => {
            _this.props.actionLoaderHide();
          });
      }
    }
  }
  handleSingleDownload() {
    let listOfPath = this.state.partMediaResponses.map(function(data) {
      return data.mediaURL.split("/").pop(-1);
    });
    let filePath = this.state.partMediaResponses[
      parseInt(this.state.Index, 10)
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
  handleDeleteImage() {
    let listOfPath = this.props.partMediaResponses.map(function(data) {
      return data.mediaURL.split("/").pop(-1);
    });

    console.log("handleDeleteImage", listOfPath);

    let filePath =
      this.props.partMediaResponses &&
      this.props.partMediaResponses[
        parseInt(this.state.singleDownloadIndex, 10)
      ] &&
      this.props.partMediaResponses[
        parseInt(this.state.singleDownloadIndex, 10)
      ].mediaURL
        .split("/")
        .pop(-1);

    if (
      this.state.partMediaResponses &&
      this.state.partMediaResponses.length > 0
    ) {
      let remngArr = _.remove(this.state.partMediaResponses, function(e) {
        return e.mediaURL.split("/").pop(-1) === filePath;
      });
      let partMediaResponses = this.state.partMediaResponses;
      this.setState({ partMediaResponses: partMediaResponses });
    }

    // axios({
    //   url: "/api/v1/cloud/aws/download?filePath=" + filePath,
    //   method: "GET",
    //   responseType: "blob" // important
    // }).then(response => {
    //   var url = window.URL.createObjectURL(new Blob([response.data]));

    //   // remove all dead enemies

    //   var link = document.createElement("a");
    //   console.log("url", link);
    //   link.href = url;
    //   link.setAttribute("download", filePath);
    //   document.body.appendChild(link);
    //   link.click();
    // });
  }
  render() {
    let _this = this;
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
              <div className="upload-btn cursor-pointer sm-upload">
                <span className="ico-upload">
                  <svg>
                    <use xlinkHref={`${Sprite}#uploadIco`} />
                  </svg>
                </span>
                <FormControl
                  id="formControlsFile"
                  type="file"
                  label="File"
                  multiple
                  accept={
                    this.props.fileFlag
                      ? ".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
                      : "image/jpeg, image/png, image/gif, video/mp4, video/webm"
                  }
                  onChange={e =>
                    this.handleUploadPicture(e, this.props.partIndex)
                  }
                />
              </div>
              <div className="flex">
                {this.state.partMediaResponses &&
                this.state.partMediaResponses.length > 1 ? (
                  <button
                    className="btn btn-text text-uppercase text-orange"
                    onClick={this.handleDownload}
                  >
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
              partMediaResponses={this.state.partMediaResponses}
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
              <button
                className="btn btn-text text-uppercase text-orange"
                onClick={this.handleDeleteImage}
              >
                <span className="ico-action ">
                  <svg>
                    <use xlinkHref={`${Sprite}#deleteIco`} />
                  </svg>
                </span>
                <span className="ico-txt">DELETE</span>
              </button>
              {this.state.partMediaResponses &&
              this.state.partMediaResponses.length > 1
                ? ""
                : ""}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionLoaderShow,
      actionLoaderHide,
      actionUploadPicture
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User,
    supplierUsers: state.supplierUsers,
    supplierData: state.supplierData
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SliderModal);
