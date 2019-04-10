import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import validation from 'react-validation-mixin';
import strategy, { validator } from 'react-validatorjs-strategy';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import 'react-phone-number-input/rrui.css';
import 'react-phone-number-input/style.css';
import Sprite from '../../img/sprite.svg';
import userImage from '../../img/profile.svg';
import SideBarBuyer from '../../buyer/common/sideBar';
import SideBarSupplier from '../../supplier/common/sideBar';
import HeaderBuyer from '../../buyer/common/header';
import HeaderSupplier from '../../supplier/common/header';
import FooterBuyer from '../../buyer/common/footer';
import FooterSupplier from '../../supplier/common/footer';
import {
  actionUserLogout,
  actionUpdateUserProfile,
  actionLoaderHide,
  actionLoaderShow,
  actionTabClick,
  actionGetUserDetails,
  actionSendOtpForUPdate,
  actionUploadDoc,
  actionDeleteDoc
} from '../../common/core/redux/actions';
import CONSTANTS from '../../common/core/config/appConfig';
import { renderMessage } from '../../common/commonFunctions';
import ImageCropper from './imageCropper';
import customConstant from '../../common/core/constants/customConstant';
let { validationMessages, permissionConstant } = CONSTANTS;
// let { showErrorToast } = CONSTANTS;

class userProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      userDetails: [],
      tabKey: 'userProfile',
      email: '',
      firstName: '',
      lastName: '',
      mobile: '',
      userProfile: '',
      emailOtpSend: false,
      mobileOtpSend: false,
      mobileVerified: true,
      emailVerified: true,
      mobileOTP: '',
      emailOTP: '',
      updatedMobile: '',
      profileImageThumbnailUrl: '',
      companyLogoThumbnailURL: '',
      purchaseRequestNumber:
        'INP' + '#' + ((Math.random() * 0xffffff) << 0).toString(16)
    };

    this.applyValidation = this.applyValidation.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVerifyOtp = this.handleVerifyOtp.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleGetData = this.handleGetData.bind(this);
    this.handleNdaDocUpload = this.handleNdaDocUpload.bind(this);
    this.handleDeleteNdaDoc = this.handleDeleteNdaDoc.bind(this);
    //this.applyValidation();
  }

  applyValidation() {
    let _this = this;
    let fieldObject = {};
    let errorMessage = {};

    fieldObject['firstName'] = 'required';
    fieldObject['lastName'] = 'required';
    fieldObject['email'] = 'required|email';
    fieldObject['mobile'] = 'required';
    fieldObject['emailOTP'] = 'max:6';
    fieldObject['mobileOTP'] = 'max:6';
    //fieldObject["userProfile"] = "required";

    errorMessage['required.firstName'] = validationMessages.firstName.required;
    errorMessage['required.lastName'] = validationMessages.lastName.required;
    errorMessage['required.email'] = validationMessages.email.required;
    errorMessage['email.email'] = validationMessages.email.invalid;
    errorMessage['required.mobile'] = validationMessages.mobile.required;
    errorMessage['max.emailOTP'] = 'Please enter correct otp';
    errorMessage['max.mobileOTP'] = 'Please enter correct otp';
    //errorMessage["required.userProfile"] = validationMessages.userProfile.required;

    this.validatorTypes = strategy.createInactiveSchema(
      fieldObject,
      errorMessage
    );
  }

  componentWillMount() {
    console.log('userInfo-----');
    let _this = this;
    let data = {
      userId: _this.props.userInfo.userData.id,
      roleId: _this.props.userInfo.userData.userRole
    };
    this.props
      .actionGetUserDetails(data)
      .then((result, error) => {
        console.log('result.payload.data.resourceData--------', result);

        this.setState({
          userDetails: result.payload.data.resourceData,
          firstName: result.payload.data.resourceData.firstName,
          lastName: result.payload.data.resourceData.lastName,
          email: result.payload.data.resourceData.email,
          mobile: result.payload.data.resourceData.mobile,
          updatedMobile: result.payload.data.resourceData.mobile,
          globalPurchasingCode:
            result.payload.data.resourceData.globalPurchasingCode,
          mobileVerified: result.payload.data.resourceData.mobileVerified,
          emailVerified: result.payload.data.resourceData.emailVerified,
          profileImageURL: result.payload.data.resourceData.profileImageURL,
          companyLogoUrl: result.payload.data.resourceData.companyLogoUrl,
          profileImageThumbnailUrl:
            result.payload.data.resourceData.profileImageThumbnailUrl,
          companyLogoThumbnailURL:
            result.payload.data.resourceData.companyLogoThumbnailURL
        });
      })
      .catch(e => _this.props.actionLoaderHide());

    console.log('globalPurchasingCode-----');
  }

  componentWillReceiveProps(nextProps) {
    //console.log('nextProps', nextProps.userInfo.userData.profilePhotoURL);

    this.setState({
      profilePhotoURL: nextProps.userInfo.userData.profilePhotoURL
    });
  }

  getClasses = field => {
    return classnames({
      error: !this.props.isValid(field)
    });
  };

  getValidatorData = () => {
    return this.state;
  };

  getValidationState(stateName) {
    if (
      this.props.getValidationMessages(stateName) === '' &&
      this.state[stateName] == ''
    )
      return null;
    else if (
      this.props.getValidationMessages(stateName) === '' &&
      this.state[stateName] !== ''
    )
      return 'success';
    else if (
      this.props.getValidationMessages(stateName) !== '' &&
      this.state[stateName] !== ''
    )
      return 'error';
    else if (
      this.props.getValidationMessages(stateName) !== '' &&
      this.state[stateName] === ''
    )
      return 'error';
  }

  navigateTo(data) {
    this.props.actionTabClick(data);
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === 'first')
      this.context.router.history.push({
        pathname: 'home',
        state: { path: 'first' }
      });
    if (
      this.context.router.location &&
      this.context.router.location.pathname === '/buyer/userProfile'
    ) {
      if (tabKey === 'second') this.context.router.history.push('home');
    }
    if (tabKey === 'third')
      this.context.router.history.push({
        pathname: 'home',
        state: { path: 'third' }
      });
    this.setState({ tabKey: tabKey });
  }

  static contextTypes = {
    router: PropTypes.object
  };

  handleClose() {
    this.setState({ show: false });
  }

  handleLogout() {
    try {
      const roleId = this.props.userInfo.userData.userRole;
      const userId = this.props.userInfo.userData.id;
      this.props.actionUserLogout({ roleId, userId });
    } catch (error) {}
  }
  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  handleVerifyOtp(e, key) {
    let roleId = this.props.userInfo.userData.userRole;
    let userId = this.props.userInfo.userData.id;
    let _this = this;
    let data = {
      userId,
      roleId,
      key
    };

    _this.props.actionLoaderShow();
    this.props
      .actionSendOtpForUPdate(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
        if (key === 'email')
          _this.setState({
            emailOtpSend: true
          });
        if (key === 'mobile') {
          this.setState({
            mobileOtpSend: true
          });
        }
      })
      .catch(e => _this.props.actionLoaderHide());
    //}
  }

  validateData = e => {
    this.applyValidation();
    let _this = this;
    e.preventDefault();
    this.props.validate(function(error) {
      if (!error) {
        _this.handleSubmit(e);
      }
    });
  };

  handleSubmit(e) {
    //const emailOTP = this.state.OTPField.join("");
    let roleId = this.props.userInfo.userData.userRole;
    let userId = this.props.userInfo.userData.id;
    let _this = this;
    let mediaURL = this.state.profileImageURL;
    if (this.state.profileImageURL) {
      mediaURL = this.state.profileImageURL.split('/').pop(-1);
    }
    let companyURL = this.state.companyLogo;
    if (this.state.companyLogo) {
      companyURL = this.state.companyLogo.split('/').pop(-1);
    }
    let globalPurchasingCode = this.state.globalPurchasingCode;
    if (this.state.globalPurchasingCode === '') {
      globalPurchasingCode = this.state.purchaseRequestNumber;
    }

    let data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      mobile: this.state.mobile,
      mobileOTP: this.state.mobileOTP,
      emailOTP: this.state.emailOTP,
      userId,
      roleId,
      email: this.state.email,
      globalPurchasingCode: globalPurchasingCode,
      nonDisclosureAgreement: this.state.ndaDocument || {}
      //profileImageURL: mediaURL,
      //companyLogo: companyURL
    };

    this.props
      .actionUpdateUserProfile(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
        this.setState({
          userDetails: result.payload.data.resourceData,
          firstName: result.payload.data.resourceData.firstName,
          lastName: result.payload.data.resourceData.lastName,
          email: result.payload.data.resourceData.email,
          mobile: result.payload.data.resourceData.mobile,
          updatedMobile: result.payload.data.resourceData.mobile,
          //userProfile: result.payload.data.resourceData.userProfile,
          mobileVerified: result.payload.data.resourceData.mobileVerified,
          emailVerified: result.payload.data.resourceData.emailVerified,
          profileImageThumbnailUrl:
            result.payload.data.resourceData.profileImageThumbnailUrl,
          companyLogoThumbnailURL:
            result.payload.data.resourceData.companyLogoThumbnailURL,
          emailOTP: '',
          emailOTP: '',
          globalPurchasingCode:
            result.payload.data.resourceData.globalPurchasingCode
        });
      })
      .catch(e => _this.props.actionLoaderHide());

    // this.state.contactArray;
  }

  handleImageChange = (action, event) => {
    this.setState({ imageSource: '' });
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileType = file.type;
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = event => {
        this.setState({
          imageSource: event.target.result,
          imageName: fileName,
          imageType: fileType,
          action: action
        });
      };
    }
  };

  uploadImageToAzure(file) {
    let userId = this.state.userId;
    let type = this.state.action;
    let sasToken = this.state.sasToken;

    if (file !== '') {
      type === 1
        ? this.setState({ loader1: true, profileImage: '' })
        : this.setState({ loader2: true, coverImage: '' });
      // uploadToAzure(
      //   type,
      //   userId,
      //   file,
      //   sasToken,
      //   (error, result, uploadPath) => {
      //     if (error) {
      //       return;
      //     }
      //     if (result) {
      //       if (type === 1) {
      //         let profileImage = `${CONSTANTS.azureBlobURI}/${
      //           CONSTANTS.azureContainer
      //         }/${uploadPath}`;
      //         this.setState({ profileImage: profileImage, loader1: false });
      //       }

      //       if (type === 2) {
      //         let coverImage = `${CONSTANTS.azureBlobURI}/${
      //           CONSTANTS.azureContainer
      //         }/${uploadPath}`;
      //         console.log(coverImage);
      //         this.setState({ coverImage: coverImage, loader2: false });
      //       }
      //       this.updateUserData(type, uploadPath, userId);
      //       console.log("upload is successful", uploadPath);
      //     }
      //   }
      // );
    }
  }
  _crop() {
    // image in dataUrl
  }

  handleGetData(imageSource, type) {
    if (type === 1 && imageSource != '') {
      this.setState({
        profileImageThumbnailUrl: imageSource
      });
    } else if (type === 2 && imageSource != '') {
      this.setState({
        companyLogoThumbnailURL: imageSource
      });
    }
  }

  handleNdaDocUpload(event) {
    let _this = this;
    let fileObject = event.target.files[0];
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
        .actionUploadDoc(formData)
        .then((result, error) => {
          let response = result.payload.data;

          var reqObject = {};
          let mediaExtension = response.filePath.split('.').pop(-1);
          reqObject['mediaName'] = response.filePath;
          reqObject['mediaURL'] = response.s3FilePath;
          reqObject['mediaSize'] = response.fileSize;
          reqObject['mediaExtension'] = mediaExtension;
          reqObject['mediaType'] = response.contentType;
          _this.setState({ ndaDocument: reqObject });
          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }
  handleDeleteNdaDoc() {
    let _this = this;
    let s3FilePath = '';
    s3FilePath = this.state.ndaDocument.mediaURL;
    _this.props
      .actionDeleteDoc(s3FilePath)
      .then((result, error) => {
        _this.props.actionLoaderShow();
        this.setState({ ndaDocument: '' });
        _this.props.actionLoaderHide();
      })
      .catch(e => {
        _this.props.actionLoaderHide();
      });
  }

  render() {
    return (
      <div>
        {this.state.imageSource ? (
          <ImageCropper
            imageSource={this.state.imageSource}
            imageName={this.state.imageName}
            imageType={this.state.imageType}
            aspectRatio={this.state.action === 1 ? 16 / 9 : 16 / 9}
            modalSize={this.state.action === 1 ? 'large' : 'large'}
            cropBoxWidth={this.state.action === 1 ? '900' : '900'}
            cropBoxHeight={this.state.action === 1 ? '900' : '900'}
            action={this.state.action}
            handleCheckData={this.handleGetData}
            //uploadImageToAzure={this.uploadImageToAzure}
          />
        ) : null}

        {this.props.userInfo.userData.userRole === 1 ? (
          <div>
            <HeaderBuyer activeTabKeyAction={this.activeTabKeyAction} />
            <SideBarBuyer activeTabKeyAction={this.activeTabKeyAction} />
          </div>
        ) : (
          <div>
            <HeaderSupplier activeTabKeyAction={this.activeTabKeyAction} />
            <SideBarSupplier activeTabKeyAction={this.activeTabKeyAction} />
          </div>
        )}
        {this.state.tabKey === 'userProfile' ? (
          <div>
            <div className="content-body flex">
              <div className="content">
                <div className="userMain">
                  <div className="container">
                    <div className="userWrapper flex align-center justify-space-between">
                      <h4>
                        Welcome {this.state.firstName} {this.state.lastName} to
                        your profile
                      </h4>
                      <div>
                        <div className="upload-btn cursor-pointer sm-upload">
                          <FormControl
                            id="formControlsFile"
                            type="file"
                            label="File"
                            onChange={this.handleImageChange.bind(this, 1)}
                            accept={
                              customConstant.acceptedFormat.imageAcceptFormat
                            }
                          />
                          <div className="uAvtar">
                            <img
                              src={
                                this.state.profileImageThumbnailUrl
                                  ? this.state.profileImageThumbnailUrl
                                  : userImage
                              }
                            />
                          </div>
                          <p className="m-b-0">Edit Picture</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <section className="uInfoContainer">
                  {!this.props.userInfo.userData.isAdmin ? (
                    <h4 className="text-info m-b-30">
                      Please contact admin to update profile.
                    </h4>
                  ) : null}

                  <Row className="show-grid">
                    <Col md={6} className="">
                      <FormGroup className="group">
                        <span className="ico-in">
                          <svg>
                            <use xlinkHref={`${Sprite}#userIco`} />
                          </svg>
                        </span>
                        <FormControl
                          type="text"
                          name="firstName"
                          required
                          value={this.state.firstName}
                          onChange={this.handleChange}
                          disabled={!this.props.userInfo.userData.isAdmin}
                        />
                        <FormControl.Feedback />
                        <span className="highlight" />
                        <span className="bar" />
                        <ControlLabel>First Name</ControlLabel>
                        {renderMessage(
                          this.props.getValidationMessages('firstName')
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6} className="">
                      <FormGroup className="group">
                        <span className="ico-in">
                          <svg>
                            <use xlinkHref={`${Sprite}#mobileIco`} />
                          </svg>
                        </span>
                        <FormControl
                          type="text"
                          name="lastName"
                          required
                          value={this.state.lastName}
                          onChange={this.handleChange}
                          disabled={!this.props.userInfo.userData.isAdmin}
                        />
                        <FormControl.Feedback />
                        <span className="highlight" />
                        <span className="bar" />
                        <ControlLabel>Last Name</ControlLabel>
                        {renderMessage(
                          this.props.getValidationMessages('lastName')
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="show-grid">
                    <Col md={6} className="">
                      <FormGroup className="group">
                        <span className="ico-in">
                          <svg>
                            <use xlinkHref={`${Sprite}#mobileIco`} />
                          </svg>
                        </span>
                        <FormControl
                          type="text"
                          name="mobile"
                          required
                          value={this.state.mobile}
                          onChange={this.handleChange}
                          disabled={!this.props.userInfo.userData.isAdmin}
                        />
                        <FormControl.Feedback />
                        <span className="highlight" />
                        <span className="bar" />
                        <ControlLabel>Mobil Numbere</ControlLabel>
                        {this.state.mobileVerified ? (
                          ''
                        ) : (
                          <p
                            className="verify cursor-pointer"
                            onClick={e => this.handleVerifyOtp(e, 'mobile')}
                          >
                            Verify
                          </p>
                        )}
                        {!this.state.mobileVerified &&
                        this.state.mobileOtpSend ? (
                          <input
                            type="text"
                            className="e-otp"
                            placeholder="Enter OTP"
                            max="6"
                            name="mobileOTP"
                            onChange={this.handleChange}
                            value={this.state.mobileOTP}
                          />
                        ) : (
                          ''
                        )}
                        {renderMessage(
                          this.props.getValidationMessages('mobile')
                        )}
                        {renderMessage(
                          this.props.getValidationMessages('mobileOTP')
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6} className="">
                      <FormGroup className="group">
                        <span className="ico-in">
                          <svg>
                            <use xlinkHref={`${Sprite}#envelopIco`} />
                          </svg>
                        </span>
                        <FormControl
                          type="text"
                          name="email"
                          required
                          value={this.state.email}
                          onChange={this.handleChange}
                          disabled={!this.props.userInfo.userData.isAdmin}
                        />
                        <FormControl.Feedback />
                        <span className="highlight" />
                        <span className="bar" />
                        <ControlLabel>Email</ControlLabel>
                        {this.state.emailVerified ? (
                          ''
                        ) : (
                          <p
                            className="verify cursor-pointer"
                            onClick={e => this.handleVerifyOtp(e, 'email')}
                          >
                            Verify
                          </p>
                        )}
                        {!this.state.emailVerified &&
                        this.state.emailOtpSend ? (
                          <input
                            type="text"
                            className="e-otp"
                            placeholder="Enter OTP"
                            name="emailOTP"
                            value={this.state.emailOTP}
                            onChange={this.handleChange}
                            max="6"
                          />
                        ) : (
                          ''
                        )}
                        {renderMessage(
                          this.props.getValidationMessages('email')
                        )}
                        {renderMessage(
                          this.props.getValidationMessages('emailOTP')
                        )}
                      </FormGroup>
                    </Col>
                    {/* <Col md={6} className="">
                      <FormGroup className="group">
                        <span className="ico-in">
                          <svg>
                            <use xlinkHref={`${Sprite}#bagIco`} />
                          </svg>
                        </span>
                        <FormControl
                          type="text"
                          name="userProfile"
                          required
                          value={this.state.userProfile}
                          onChange={this.handleChange}
                        />

                        <FormControl.Feedback />
                        <span className="highlight" />
                        <span className="bar" />

                        <ControlLabel>Designation</ControlLabel>
                      </FormGroup>
                      
                    </Col> */}
                  </Row>
                  {/* <Row className="show-grid">
                    <Col md={6} className="">
                      <FormGroup className="group">
                        <span className="ico-in">
                          <svg>
                            <use xlinkHref={`${Sprite}#envelopIco`} />
                          </svg>
                        </span>
                        <FormControl
                          type="text"
                          name="email"
                          required
                          value={this.state.email}
                          onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        <span className="highlight" />
                        <span className="bar" />
                        <ControlLabel>Email</ControlLabel>
                        {this.state.emailVerified ? (
                          ""
                        ) : (
                          <p
                            className="verify cursor-pointer"
                            onClick={e => this.handleVerifyOtp(e, "email")}
                          >
                            Verify
                          </p>
                        )}
                        {!this.state.emailVerified &&
                        this.state.emailOtpSend ? (
                          <input
                            type="text"
                            className="e-otp"
                            placeholder="Enter OTP"
                            name="emailOTP"
                            value={this.state.emailOTP}
                            onChange={this.handleChange}
                            max="6"
                          />
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </Col>
                  </Row> */}

                  <Row>
                    <Col md={6}>
                      <FormGroup className="group">
                        <span className="ico-in">
                          <svg>
                            <use xlinkHref={`${Sprite}#userIco`} />
                          </svg>
                        </span>
                        <FormControl
                          type="text"
                          name="globalPurchasingCode"
                          value={
                            this.state.globalPurchasingCode
                              ? this.state.globalPurchasingCode
                              : this.state.purchaseRequestNumber
                          }
                          onChange={this.handleChange}
                          disabled={!this.props.userInfo.userData.isAdmin}
                          required
                        />
                        <FormControl.Feedback />
                        <span className="highlight" />
                        <span className="bar" />
                        <ControlLabel>Global Purchasing code</ControlLabel>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <div>
                        <div className="upload-btn cursor-pointer sm-upload once-upload btn-block">
                          {this.state.ndaDocument ? (
                            <ul className="upload-list b-btm">
                              <li className="flex justify-space-between align-center">
                                <span>{this.state.ndaDocument.mediaName}</span>
                                <span
                                  className="ico-delete cursor-pointer"
                                  onClick={event =>
                                    this.handleDeleteNdaDoc(event)
                                  }
                                >
                                  <svg>
                                    <use xlinkHref={`${Sprite}#deleteIco`} />
                                  </svg>
                                </span>
                              </li>
                            </ul>
                          ) : (
                            <FormGroup className="mb-0">
                              <div className="upload-btn sm-upload text-center cursor-pointer text-uppercase ven-up">
                                <FormControl
                                  id="formControlsFile"
                                  type="file"
                                  label="File"
                                  accept={
                                    customConstant.acceptedFormat
                                      .documentAcceptFormat
                                  }
                                  disabled={
                                    !this.props.userInfo.userData.isAdmin
                                  }
                                  onChange={event => {
                                    this.handleNdaDocUpload(event);
                                  }}
                                />
                                <span className="ico-upload">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#upload1Ico`} />
                                  </svg>
                                </span>

                                <span>Upload NDA</span>
                              </div>
                              {this.state.ndaError ? (
                                <span className="error">
                                  {validationMessages.vendor.nda.required}
                                </span>
                              ) : null}
                            </FormGroup>
                          )}
                        </div>
                      </div>
                    </Col>
                    {/* <Col md={6}>
                      <div className="gray-card dash-border up-padd p-10">
                        <ul className="upload-list b-btm">
                          <li className="flex justify-space-between align-center">
                            <span>dfggggggdg</span>

                            <Glyphicon
                              className="cursor-pointer"
                              glyph="trash"
                            />
                          </li>
                        </ul>

                        <div className="text-center">
                          <div className="upload-btn cursor-pointer text-uppercase">
                            <span className="ico-upload w-full">
                              <svg>
                                <use xlinkHref={`${Sprite}#upload1Ico`} />
                              </svg>
                            </span>
                            upload Designs
                            <FormControl multiple type="file" />
                          </div>
                        </div>
                      </div>
                    </Col> */}
                    <Col md={7} mdOffset={2}>
                      {' '}
                      {this.props.userInfo.userData.isAdmin ? (
                        <div className="editLogo m-b-30 text-center">
                          {/* <span className="color-light">Company Logo</span> */}
                          <div className="gray-card editLogoBox text-center">
                            <div className="upload-btn cursor-pointer sm-upload">
                              <FormControl
                                id="formControlsFile"
                                type="file"
                                label="File"
                                onChange={this.handleImageChange.bind(this, 2)}
                              />
                              <div className="logoImg">
                                {this.state.companyLogoThumbnailURL ? (
                                  <img
                                    src={
                                      this.state.companyLogoThumbnailURL
                                        ? this.state.companyLogoThumbnailURL
                                        : userImage
                                    }
                                  />
                                ) : (
                                  <span className="pic-Icon">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#editPicIco`} />
                                    </svg>
                                  </span>
                                )}
                              </div>
                              <p className="m-b-0">Company Logo</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </Col>
                  </Row>

                  <div className="text-center m-t-20 m-b-50">
                    <button
                      className="btn btn-default text-uppercase"
                      onClick={e => this.validateData(e)}
                      disabled={!this.props.userInfo.userData.isAdmin}
                    >
                      Update
                    </button>
                    {/* <button className="btn btn-success text-uppercase">
                      cancel
                    </button> */}
                  </div>
                </section>
              </div>
              {this.props.userInfo.userData.userRole === 1 ? (
                <FooterBuyer
                  pageTitle={permissionConstant.footer_title.user_profile}
                />
              ) : (
                <FooterSupplier
                  pageTitle={permissionConstant.footer_title.user_profile}
                />
              )}
            </div>
            {/* ) : null} */}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionUserLogout,
      actionUpdateUserProfile,
      actionLoaderHide,
      actionLoaderShow,
      actionTabClick,
      actionGetUserDetails,
      actionSendOtpForUPdate,
      actionUploadDoc,
      actionDeleteDoc
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User
  };
};

userProfile = validation(strategy)(userProfile);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(userProfile);
