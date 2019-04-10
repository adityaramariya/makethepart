import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import validation from "react-validation-mixin";
import strategy from "react-validatorjs-strategy";
import classnames from "classnames";
import Slider from 'react-slick';
import {
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Table,
  Modal,
  Row,
  Col,
  Tab,
  Nav,
  NavItem,
  DropdownButton,
  Panel,InputGroup, Glyphicon
} from "react-bootstrap";
import Sprite from "../../img/sprite.svg";
import _ from "lodash";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionUploadImage
} from "../../common/core/redux/actions";
import {
  renderMessage,
  showErrorToast,
  showSuccessToast
} from "../../common/commonFunctions";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import Footer from "../common/footer";
import CONSTANTS from "../../common/core/config/appConfig";
import ImageCropper from '../common/imageCropper';

import { handlePermission } from "../../common/permissions";
import { isArray } from "util";
let { permissionConstant, validationMessages,customConstant } = CONSTANTS;



class SliderModal extends Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    let imagesArray =  this.props.imagesArray;
    // this.handleDownload = this.handleDownload.bind(this);
    // this.handleSingleDownload = this.handleSingleDownload.bind(this);
    // this.singleDownLoad = this.singleDownLoad.bind(this);
    this.state = {
      show: false,
      singleDownloadIndex: 0,
      combineddMedia: this.props.imagesArray,
      nav1: null,
      nav2: null,
     // setMainArrayImage: this.props.mainImage,
      setMainArrayImage: this.props.imagesArray && this.props.imagesArray[0] && 
      this.props.imagesArray[0].mediaURL,
      mediaName: this.props.imagesArray && this.props.imagesArray[0] && 
      this.props.imagesArray[0].mediaName,
      mediaType: this.props.imagesArray && this.props.imagesArray[0] && 
      this.props.imagesArray[0].mediaType,
      currentImage:{}
    };
    this.handleShow();
  }

  
  componentDidMount() { 
    console.log("this.props.imagesArray", this.props.imagesArray);
  //   let media = this.props.specificationResponses
  //     ? this.state.combineddMedia.concat(this.props.specificationResponses)
  //     : this.state.combineddMedia;
  //  // this.setState({ combineddMedia: media });
       this.setState({ 
       combineddMedia: this.props.imagesArray, 
       nav1: this.slider1,
       nav2: this.slider2,
       pageType: this.props.pageType
      });
  }

  setCropImage(event, data){
    this.setState({
      setMainArrayImage: data.mediaURL,
      mediaName: data.mediaName,
      mediaType: data.mediaType,
      currentImage: data  
    })    
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    let show = this.props.show;
    this.setState({ show: show });
  }  

  cropImage(e) {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    let cropResult = this.cropper.getCroppedCanvas().toDataURL()
    this.setState({
      cropResult: this.cropper.getCroppedCanvas().toDataURL(), 
    });
   
    console.log("this.cropper.getCroppedCanvas().toDataURL()", this.cropper.getCroppedCanvas().toDataURL());

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

    // console.log(cropResult, "this.refs.cropper", this.refs.cropper);
    // let cropResult = this.refs.cropper
    //   .getCroppedCanvas({
    //     fillColor: '#fff',
    //     imageSmoothingEnabled: false,
    //     imageSmoothingQuality: 'high'
    //   })
    //   .toDataURL(this.state.imageType);

    //   console.log(cropResult, "this.refs.cropper", this.refs.cropper);

    if (cropResult !== '') {
      let croppedImage = this.dataURLtoFile(
        cropResult,
        this.state.mediaName
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
    let BOMCalculation = this.props.BOMCalculation;   
    let listOfEcoRequest = this.props.listOfEcoRequest;  
    let pIndx = this.props.parentIndexPartImg;
    let cIndx = this.props.childIndexPartImg;
    let _this = this;
    let fileObject = event;
  
    if (fileObject) {
      const formData = new FormData();
      formData.set('mFile', fileObject);
      formData.append('thumbnailHeight', 100);
      formData.append('thumbnailWidth', 100);
      formData.append('isCreateThumbnail', true);
      formData.append('fileKey', this.state.mediaName);
      formData.append('filePath', this.state.mediaName);
      this.props.actionLoaderShow();
      this.props
        .actionUploadImage(formData)
        .then((result, error) => {
          let reportArray = result.payload.data;      
          var reqObject = {};
          let mediaExtension = reportArray.filePath.split('.').pop(-1);
          reqObject['mediaName'] = reportArray.filePath;
          reqObject['mediaURL'] =  reportArray.s3FilePath;
          reqObject['mediaFullURL'] = customConstant.amazonURL + reportArray.s3FilePath;
          reqObject['mediaSize'] = reportArray.fileSize;
          reqObject['mediaExtension'] = mediaExtension;
          reqObject['mediaType'] = reportArray.contentType;
          reqObject['isDeleted'] = false;

          BOMCalculation[pIndx].bomList[cIndx].newImage =  reqObject;   
          BOMCalculation[pIndx].bomList[cIndx].currentImage =  this.state.currentImage;      

          // //const emailOTP = this.state.OTPField.join("");
          // let roleId = this.props.userInfo.userData.userRole;
          // let userId = this.props.userInfo.userData.id;

        
          //   let profileImageURL = reportArray.s3FilePath;
          //   let data = {
          //     userId,
          //     roleId,
          //     profileImageURL
          //   };
          //   this.handleSubmit(data);
         

          if (result.payload.data.status === 400) {
            //showErrorToast(result.payload.data.responseMessage);
          }
          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });

        listOfEcoRequest[pIndx]['ecoBomXDataRequests'] = BOMCalculation[pIndx].bomList;
        console.log("BOMCalculation3333", BOMCalculation);

        this.setState({
          BOMCalculation: BOMCalculation,
          listOfEcoRequest: listOfEcoRequest
        })

        
    }
  }

  handleSubmit(data) {
    let _this = this;
    this.props
      .actionUpdateUserProfile(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();

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
    let _this = this; 
    return (
      <div>
        <Modal
          show={this.props.show}
          onHide={this.props.handleCloseModal}
          className="slider-modal"
        >
          <Modal.Header>
            <div className="flex justify-space-between">
              <h4>
                Crop Image 
              </h4>
              <div className="flex"> 
                <button
                  class="btn btn-link text-uppercase color-light"
                  onClick={this.props.handleCloseModal}
                >
                  close
                </button>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>

            {/* <SliderImage
              partMediaResponses={ this.state.combineddMedia}
             // singleDownLoad={this.singleDownLoad}
            /> */}

      <div>
        <Slider
          asNavFor={this.state.nav1}
          ref={slider => (this.slider2 = slider)}
          //slidesToShow={this.state.combineddMedia.length}
          slidesToShow={
            this.state.combineddMedia &&
            this.state.combineddMedia.length < 6
              ? this.state.combineddMedia.length
              : 6
          }
          swipeToSlide={true}
          focusOnSelect={true}
          className="slider-thumb"
        >
          {this.state.combineddMedia &&
            this.state.combineddMedia.map(function(data) {
              return (
                <div>
                  <img onClick={e => _this.setCropImage(e, data)}  src={data.mediaThumbnailUrl} />
                  <span className="img-thumb-title" title={data.mediaName}>
                    {data.mediaName}
                  </span>
                </div>
              );
            })}
        </Slider>
        <div>
        <ImageCropper
            style={{ height: 400, width: '100%' }}
            aspectRatio={16 / 9}
            preview=".img-preview"
          // guides={false}
            src={this.state.setMainArrayImage}
            ref={cropper => { this.cropper = cropper; }}
          />
        </div>      
      </div>

              <div className="text-center">
                <button onClick={this.cropImage.bind(this)} className="btn btn-default text-uppercase">
                  Upload
                  </button>
              </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

//export default SliderModal;

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionLoaderHide,
      actionLoaderShow,
      actionUploadImage
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

SliderModal = validation(strategy)(SliderModal);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SliderModal);
