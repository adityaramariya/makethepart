import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactImageMagnify from 'react-image-magnify';
import { Row, Col, FormControl } from 'react-bootstrap';
import Slider from 'react-slick';
import Image1 from '../../img/image.png';
import ImagePart from '../../img/part.jpg';
import Sprite from '../../img/sprite.svg';

import {
  actionLoaderHide,
  actionLoaderShow,
  actionApproveRejectNonDiscloser
} from '../../common/core/redux/actions';

import Header from '../common/header';
import SideBar from '../common/sideBar';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import Iframe from 'react-iframe';
import { handlePermission } from '../../common/permissions';
let { permissionConstant } = CONSTANTS;
class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'reviewSupplier',
      nav1: null,
      nav2: null,
      reviewData: this.props.location.state && this.props.location.state.data,
      faciliyPictures: [],
      documentsList: [],
      otherDocList: [],
      sliderSelectedImage: ImagePart
    };
    console.log('rreview datra..........', this.state.reviewData);
    // get srcSet() {
    //   return images.map(image => {
    //     return `${Image1}${image.name} ${image.vw}`;
    //   }).join(', ')
    // }

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.openDocument = this.openDocument.bind(this);
    this.approveSupplierRegis = this.approveSupplierRegis.bind(this);
    this.setPreviewImagePath = this.setPreviewImagePath.bind(this);
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
        if (item.documentType === 'Facility pictures') {
          faciliyPictures.push(item);
        } else {
          documentsList.push(item);
        }
      });
    this.setState(
      {
        faciliyPictures: faciliyPictures,
        documentsList: documentsList,
        otherDocList:
          reviewData &&
          reviewData.registrationResponse &&
          reviewData.registrationResponse.listOfDocumentsUpload &&
          reviewData.registrationResponse.listOfOtherDocumentsUpload
      },
      () => {
        //Callback to set slider default image selected
        if (this.state.faciliyPictures.length > 0)
          this.setState((prevState, props) => {
            return {
              sliderSelectedImage: prevState.faciliyPictures[0]['mediaURL'],
              sliderSelectedImageMediaType:
                prevState.faciliyPictures[0]['mediaType']
            };
          });
      }
    );
  }

  componentDidMount() {
    let _this = this;
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === 'first') this.props.history.push('home');
    if (tabKey === 'third')
      this.props.history.push({
        pathname: 'home',
        state: { path: 'third' }
      });
    this.setState({ tabKey: tabKey });
  }

  openDocument(event, data) {
    window.open(data);
  }

  approveSupplierRegis() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id || '',
      roleId: this.props.userInfo.userData.userRole || '',
      approvalId: this.state.reviewData && this.state.reviewData.id,
      comments: 'comments',
      status: 'approved',
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

  setPreviewImagePath(imageURL) {
    console.log('set previe image path ', imageURL);
    this.setState(
      {
        sliderSelectedImage: imageURL
      },
      () => {
        console.log(
          'image preview path set to ',
          this.state.sliderSelectedImage
        );
      }
    );
  }

  render() {
    let _this = this;
    let mediaType = this.state.sliderSelectedImageMediaType;
    var settings = {
      asNavFor: this.state.nav2,
      ref: slider => (this.slider1 = slider),
      className: 'slider-full',
      afterChange: function(currentSlide) {
        // _this.props.singleDownLoad(currentSlide);
        console.log('after change', currentSlide);
      }
    };
    return (
      <div>
        <Header {...this.props} />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === 'reviewSupplier' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <Row>
                  <Col md={9}>
                    <h4 className="hero-title text-center">Review Supplier</h4>
                    <div className="review-slider">
                      <div style={{ display: 'block' }}>
                        {(mediaType &&
                          mediaType === 'application/octet-stream') ||
                        (mediaType &&
                          mediaType === 'application/vnd.ms-excel') ? (
                          <img src={xlsImage} width="350" height="350" />
                        ) : mediaType &&
                          mediaType ===
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
                          <img src={xlsImage} width="350" height="350" />
                        ) : mediaType && mediaType === 'application/pdf' ? (
                          <img src={pdfImage} width="350" height="350" />
                        ) : (mediaType &&
                            mediaType ===
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                          (mediaType && mediaType === 'text/plain') ||
                          (mediaType && mediaType === 'application/msword') ? (
                          <img src={docImage} width="350" height="350" />
                        ) : (
                          <ReactImageMagnify
                            {...{
                              smallImage: {
                                alt: 'Wristwatch by Ted Baker London',
                                width: 350,
                                height: 350,
                                src:
                                  this.state.sliderSelectedImage || ImagePart,
                                srcSet:
                                  this.state.sliderSelectedImage || ImagePart,
                                sizes:
                                  '(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px'
                              },
                              largeImage: {
                                alt: '',
                                src:
                                  this.state.sliderSelectedImage || ImagePart,
                                width: 1426,
                                height: 2000
                              },
                              isHintEnabled: true,
                              enlargedImageStyle: {},
                              lensStyle: { backgroundColor: 'rgba(0,0,0,.6)' },
                              enlargedImageContainerDimensions: {
                                width: '200%',
                                height: '100%'
                              }
                            }}
                            {...{ enlargedImagePosition: 'over' }}
                          />
                        )}
                      </div>
                      {console.log(
                        'this.state.faciliyPictures--------',
                        this.state.faciliyPictures
                      )}
                      <Slider
                        className="slider-thumb"
                        {...{
                          dots: true,
                          infinite: true,
                          speed: 500,
                          slidesToShow: 2,
                          slidesToScroll: 1
                        }}
                        asNavFor={this.state.nav1}
                        ref={slider => (this.slider2 = slider)}
                      >
                        {this.state.faciliyPictures &&
                          this.state.faciliyPictures.map(function(data, index) {
                            return (
                              <div
                                onClick={e =>
                                  _this.setPreviewImagePath(data.mediaURL)
                                }
                              >
                                {(data.mediaThumbnailUrl &&
                                  data.mediaType ===
                                    'application/octet-stream') ||
                                (data.mediaThumbnailUrl &&
                                  data.mediaType ===
                                    'application/vnd.ms-excel') ? (
                                  <img src={xlsImage} width="45" />
                                ) : data.mediaThumbnailUrl &&
                                  data.mediaType ===
                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
                                  <img src={xlsImage} width="45" />
                                ) : data.mediaThumbnailUrl &&
                                  data.mediaType === 'application/pdf' ? (
                                  <img src={pdfImage} width="45" />
                                ) : (data.mediaThumbnailUrl &&
                                    data.mediaType ===
                                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                                  (data.mediaThumbnailUrl &&
                                    data.mediaType === 'text/plain') ||
                                  (data.mediaThumbnailUrl &&
                                    data.mediaType === 'application/msword') ? (
                                  <img src={docImage} width="45" />
                                ) : (
                                  <img src={data.mediaThumbnailUrl} />
                                )}

                                {/* <img src={data.mediaThumbnailUrl} /> */}

                                <span
                                  className="img-thumb-title"
                                  title={data.mediaName}
                                >
                                  {data.mediaName}
                                </span>
                              </div>
                            );
                          })}
                      </Slider>
                    </div>
                    {/* <ReactImageMagnify
                      {...{
                        smallImage: {
                          alt: 'Wristwatch by Ted Baker London',
                          isFluidWidth: true,
                          src: Image1,
                          srcSet: this.srcSet,
                          sizes:
                            '(min-width: 800px) 33.5vw, (min-width: 415px) 50vw, 100vw'
                        },
                        largeImage: {
                          alt: '',
                          src: Image1,
                          width: 1200,
                          height: 1800
                        },
                        isHintEnabled: true
                      }}
                    /> */}
                    <hr className="divider" />
                    {/* <ul className="quick-tags m-t-40 m-b-30">
                      {this.state.documentsList &&
                        this.state.documentsList.map((item, index) => {
                          return (
                            <li>
                              <button
                                className="btn btn-default text-uppercase"
                                key={index}
                                onClick={event => {
                                  this.openDocument(event, item.mediaURL);
                                }}
                              >
                                {item.documentType}
                              </button>
                            </li>
                          );
                        })}
                    </ul> */}

                    <div className="quick-tags m-auto m-b-30">
                      <h4 className="hero-title">Upload Files</h4>
                      <ul className="gray-card">
                        <li className="flex align-center">
                          <div className="flex flex-1 justify-space-between">
                            <span className="file-name">
                              FileName goes here
                            </span>

                            <div className="upload-btn sm-upload text-center cursor-pointer text-uppercase ven-up">
                              <FormControl
                                id="formControlsFile"
                                type="file"
                                label="File"
                              />
                              <span className="ico-upload">
                                <svg>
                                  <use xlinkHref={`${Sprite}#uploadIco`} />
                                </svg>
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-1 flie-del justify-space-between">
                            <span className="file-name">kjhkl</span>

                            <span className="ico-delete cursor-pointer">
                              <svg>
                                <use xlinkHref={`${Sprite}#deleteIco`} />
                              </svg>
                            </span>
                          </div>
                        </li>
                        <li className="flex align-center">
                          <div className="flex flex-1 justify-space-between">
                            <span className="file-name">
                              FileName goes here
                            </span>

                            <div className="upload-btn sm-upload text-center cursor-pointer text-uppercase ven-up">
                              <FormControl
                                id="formControlsFile"
                                type="file"
                                label="File"
                              />
                              <span className="ico-upload">
                                <svg>
                                  <use xlinkHref={`${Sprite}#uploadIco`} />
                                </svg>
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-1 flie-del justify-space-between">
                            <span className="file-name">kjhkl</span>

                            <span className="ico-delete cursor-pointer">
                              <svg>
                                <use xlinkHref={`${Sprite}#deleteIco`} />
                              </svg>
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <hr />
                    <div className="text-center m-t-40 m-b-50">
                      <button className="btn btn-primary text-uppercase btn-md sp-btn">
                        Approve NDA
                      </button>
                      <button
                        // className=" btn btn-primary text-uppercase btn-md sp-btn"
                        className={
                          this.state.reviewData.currentStatus
                            ? 'btn btn-primary text-uppercase btn-md sp-btn p-e-none'
                            : 'btn btn-primary text-uppercase btn-md sp-btn'
                        }
                        onClick={this.approveSupplierRegis}
                      >
                        Approve Supplier registration
                      </button>
                    </div>
                  </Col>
                  <Col md={3}>
                    <h4 className="st-title fw-600">Standards</h4>
                    <div className="gray-card stan-r-box">
                      <ul className="iso-stan">
                        {this.state.otherDocList &&
                          this.state.otherDocList.map((item, index) => {
                            return (
                              <li className="flex align-center" key={index}>
                                <span
                                  className="iso-img"
                                  onClick={event => {
                                    this.openDocument(event, item.mediaURL);
                                  }}
                                >
                                  <img
                                    src={Image1}
                                    className="img-responsive obj-cover"
                                  />
                                </span>
                                <span>{item.documentType}</span>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <Footer
              pageTitle={permissionConstant.footer_title.review_supplier}
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
