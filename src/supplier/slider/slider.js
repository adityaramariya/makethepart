import React, { Component } from 'react';

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
} from 'react-bootstrap';
import Slider from 'react-slick';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import Sprite from '../../img/sprite.svg';
import Iframe from 'react-iframe';
class SliderImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  render() {
    let _this = this;
    var settings = {
      asNavFor: this.state.nav2,
      ref: slider => (this.slider1 = slider),
      className: 'slider-full',
      afterChange: function(currentSlide) {
        _this.props.singleDownLoad(currentSlide);
      }
    };
    return (
      <div>
        <Slider
          asNavFor={this.state.nav1}
          ref={slider => (this.slider2 = slider)}
          slidesToShow={
            this.props.partMediaResponses &&
            this.props.partMediaResponses.length < 6
              ? this.props.partMediaResponses.length
              : 6
          }
          swipeToSlide={true}
          focusOnSelect={true}
          className="slider-thumb"
        >
          {this.props.partMediaResponses &&
            this.props.partMediaResponses.map(function(data) {
              return (
                <div>
                  {(data.mediaThumbnailUrl &&
                    data.mediaType === 'application/octet-stream') ||
                  (data.mediaThumbnailUrl &&
                    data.mediaType === 'application/vnd.ms-excel') ? (
                    <img src={xlsImage} width="45" />
                  ) : data.mediaThumbnailUrl &&
                    data.mediaType === 'application/pdf' ? (
                    <img src={pdfImage} width="45" />
                  ) : data.mediaThumbnailUrl &&
                    data.mediaType ===
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
                    <img src={xlsImage} width="45" />
                  ) : (data.mediaThumbnailUrl &&
                      data.mediaType ===
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                    (data.mediaThumbnailUrl &&
                      data.mediaType === 'text/plain') ? (
                    <img src={docImage} width="45" />
                  ) : data.mediaThumbnailUrl &&
                    data.mediaType === 'application/msword' ? (
                    <img src={docImage} />
                  ) : (
                    <img src={data.mediaThumbnailUrl} />
                  )}
                  <span className="img-thumb-title" title={data.mediaName}>
                    {data.mediaName}
                  </span>
                </div>
              );
            })}
        </Slider>
        <Slider {...settings}>
          {this.props.partMediaResponses &&
            this.props.partMediaResponses.map(function(data) {
              return (
                <div>
                  {(data.mediaThumbnailUrl &&
                    data.mediaType === 'application/octet-stream') ||
                  (data.mediaThumbnailUrl &&
                    data.mediaType === 'application/vnd.ms-excel') ? (
                    <img src={xlsImage} />
                  ) : data.mediaThumbnailUrl &&
                    data.mediaType ===
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
                    <img src={xlsImage} />
                  ) : (data.mediaThumbnailUrl &&
                      data.mediaType === 'application/pdf') ||
                    (data.mediaThumbnailUrl &&
                      data.mediaType === 'text/plain') ? (
                    <Iframe
                      url={data.mediaURL}
                      display="initial"
                      position="relative"
                      width="100%"
                    /> // <img src={pdfImage} />
                  ) : data.mediaThumbnailUrl &&
                    data.mediaType ===
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                    <img src={docImage} />
                  ) : // <img src={docImage} />
                  // <Iframe
                  //   url={data.mediaURL}
                  //   display="initial"
                  //   position="relative"
                  //   width="100%"
                  // />
                  data.mediaThumbnailUrl &&
                    data.mediaType === 'application/msword' ? (
                    <img src={docImage} />
                  ) : (
                    <img src={data.mediaURL} />
                  )}
                </div>
              );
            })}
        </Slider>
      </div>
    );
  }
}

export default SliderImage;
