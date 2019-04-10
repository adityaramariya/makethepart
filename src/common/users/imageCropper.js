import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Button, Modal } from 'react-bootstrap';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionUploadImage,
  actionUpdateUserProfile,
  actionChangeUserProfileLogo,
  actionChangeUserCompanyLogo
} from '../../common/core/redux/actions';
import CONSTANTS from '../../common/core/config/appConfig';
import { showErrorToast } from '../../common/commonFunctions';
let { customConstant } = CONSTANTS;
class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cropModal: true,
      cropBoxWidth: '',
      cropBoxHeight: '',
      imageSource: '',
      imageName: '',
      imageType: '',
      modalSize: 'medium',
      aspectRatio: ''
    };
  }

  closeCropModal = () => {
    this.setState({ cropModal: false, imageSource: '' });
    this.props.handleCheckData(this.props.imageSource);
  };

  componentDidMount() {
    let imageSource = this.props.imageSource;
    let cropBoxWidth = this.props.cropBoxWidth;
    let cropBoxHeight = this.props.cropBoxHeight;
    let imageType = this.props.imageType;
    let imageName = this.props.imageName;
    let modalSize = this.props.modalSize;
    let aspectRatio = this.props.aspectRatio;
    let fieldType = this.props.action;

    if (imageSource !== '') {
      this.setState({
        imageSource,
        imageName,
        imageType,
        cropBoxWidth,
        cropBoxHeight,
        modalSize,
        aspectRatio,
        fieldType,
        profileImageThumbnailUrl: '',
        companyLogoThumbnailURL: ''
      });
    }
  }

  handleImageChange = event => {
    const file = event.target.files[0];
    const fileName = file.name;
    const fileType = file.type;
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = event => {
        this.setState({
          imageSource: event.target.result,
          imageName: fileName,
          imageType: fileType
        });
      };
    }
  };

  cropImage(action) {
    if (
      this.state.imageType === 'image/jpeg' ||
      'image/jpg' ||
      'image/png' ||
      'image/gif' ||
      'video/mp4' ||
      'video/webm'
    ) {
    } else {
      showErrorToast('Please enter correct image format');
      return false;
    }

    let cropImageResult = this.refs.cropper
      .getCroppedCanvas({
        fillColor: '#fff',
        imageSmoothingEnabled: false,
        imageSmoothingQuality: 'high'
      })
      .toDataURL(this.state.imageType);

    if (cropImageResult !== '') {
      let croppedImage = this.dataURLtoFile(
        cropImageResult,
        this.state.imageName
      );

      this.handleUploadDesign(croppedImage);
      //this.props.uploadImageToAzure(croppedImage);
      this.setState({
        cropModal: false
      });
    } else {
      this.props.uploadImageToAzure('');
    }
  }

  handleUploadDesign(event) {
    // debugger;
    let _this = this;
    let fileObject = event;
    if (fileObject) {
      const formData = new FormData();
      formData.set('mFile', fileObject);
      formData.append('thumbnailHeight', 100);
      formData.append('thumbnailWidth', 100);
      formData.append('isCreateThumbnail', true);
      formData.append('fileKey', fileObject.name);
      formData.append('filePath', fileObject.name);
      this.props.actionLoaderShow();
      this.props
        .actionUploadImage(formData)
        .then((result, error) => {
          let reportArray = result.payload.data;
          var reqObject = {};
          let mediaExtension = reportArray.filePath.split('.').pop(-1);
          reqObject['mediaName'] = reportArray.filePath;
          reqObject['mediaURL'] = reportArray.s3FilePath;
          reqObject['mediaSize'] = reportArray.fileSize;
          reqObject['mediaExtension'] = mediaExtension;
          reqObject['mediaType'] = reportArray.contentType;
          reqObject['isDeleted'] = false;

          //const emailOTP = this.state.OTPField.join("");
          let roleId = this.props.userInfo.userData.userRole;
          let userId = this.props.userInfo.userData.id;

          if (this.state.fieldType === 1) {
            let profileImageURL = reportArray.s3FilePath;
            let data = {
              userId,
              roleId,
              profileImageURL
            };
            this.handleSubmit(data, this.state.fieldType);
          } else if (this.state.fieldType === 2) {
            let companyLogoUrl = reportArray.s3FilePath;
            let data = {
              userId,
              roleId,
              companyLogoUrl
            };
            this.handleSubmit(data, this.state.fieldType);
          }

          if (result.payload.data.status === 400) {
            //showErrorToast(result.payload.data.responseMessage);
          }
          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }

  handleSubmit(data, action) {
    let _this = this;
    this.props
      .actionUpdateUserProfile(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();

        if (action === 1) {
          this.setState({
            profileImageThumbnailUrl:
              result.payload.data.resourceData.profileImageThumbnailUrl
          });
          this.props.handleCheckData(this.state.profileImageThumbnailUrl, 1);
          let dataProfile = {
            profilePhotoURL:
              result.payload.data.resourceData.profileImageThumbnailUrl
          };

          // this.props.actionChangeUserProfileLogo(dataProfile);
          if (data && data.profileImageURL)
            this.props
              .actionChangeUserProfileLogo(data && data.profileImageURL)
              .then((result, error) => {})
              .catch(e => _this.props.actionLoaderHide());

          //this.history.push.
        } else if (action === 2) {
          this.setState({
            companyLogoThumbnailURL:
              result.payload.data.resourceData.companyLogoThumbnailURL
          });
          this.props.handleCheckData(this.state.companyLogoThumbnailURL, 2);
          let dataCompany = {
            companyProfileURL:
              result.payload.data.resourceData.profileImageThumbnailUrl
          };
          this.props
            .actionChangeUserCompanyLogo(dataCompany)
            .then((result, error) => {})
            .catch(e => _this.props.actionLoaderHide());
        }
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = arr && atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  render() {
    return (
      <Modal
        bsSize={this.state.modalSize}
        show={this.state.cropModal}
        onHide={this.closeCropModal}
      >
        <Modal.Header closeButton>
          <Modal.Title className="subtitle text-center">Crop Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Cropper
            ref="cropper"
            src={this.state.imageSource}
            style={{ height: 400, width: '100%' }}
            // Cropper.js options
            aspectRatio={16 / 9}
            // guides={false}
            // Cropper.js options
            // aspectRatio={16 / 9}
            // guides={false}
            // background={false}
            // zoomable={true}
            // cropBoxMovable={false}
            // cropBoxResizable={false}
            // highlight={false}
            // strict={false}

            guides={true}
            // viewMode={1}
            // background={false}
            zoomable={true}
            cropBoxMovable={false}
            cropBoxResizable={false}
            highlight={false}
            dragMode="move"
            movable={true}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-content-between align-center">
            <div className="left">
              {/* <Button bsStyle="danger" className="no-bold no-round">
                Remove Photo
              </Button> */}
            </div>
            <div className="right flex align-center">
              <div className="custom-upload mr-1">
                <input
                  type="file"
                  accept="image/*"
                  value=""
                  onChange={this.handleImageChange.bind(this)}
                />
                {/* <Button bstyle="default" className="no-round">
                  Change Photo
                </Button> */}
              </div>
              <Button
                bsStyle="primary"
                className="no-bold no-round"
                onClick={this.cropImage.bind(this)}
              >
                Apply
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionLoaderHide,
      actionLoaderShow,
      actionUploadImage,
      actionUpdateUserProfile,
      actionChangeUserProfileLogo,
      actionChangeUserCompanyLogo
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
)(ImageCropper);
