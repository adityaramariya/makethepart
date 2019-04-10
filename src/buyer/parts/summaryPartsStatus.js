import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import noRecord from '../../img/no_record.png';
import { Table } from 'react-bootstrap';
import * as moment from 'moment';
import SliderModal from '../slider/sliderModal';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionSummaryPartStatus,
  actionTabData
} from '../../common/core/redux/actions';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import { topPosition } from '../../common/commonFunctions';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import { handlePermission } from '../../common/permissions';
let { permissionConstant } = CONSTANTS;
class SummaryPartsStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summaryPartStatus: '',
      tabKey: 'seventh'
    };

    // this.handleUploadImage = this.handleUploadImage.bind(this);
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      sortByTotalAmount: true
    };
    this.props.actionLoaderShow();
    this.props
      .actionSummaryPartStatus(data)
      .then((result, error) => {
        _this.setState({
          summaryPartStatus: result.payload.data.resourceData
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  navigateToRFQ(data) {
    this.props.actionTabData(data);
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === 'first') this.props.history.push('home');
    if (tabKey === 'third')
      this.props.history.push({ pathname: 'home', state: { path: 'third' } });
    this.setState({ tabKey: tabKey });
  }

  imageShow = (partId, partMediaResponse, partNumber, partIndex) => {
    this.setState({
      show: true,
      partIdforMedia: partId,
      partNumberforMedia: partNumber,
      partMediaResponses: partMediaResponse
    });
  };
  handleCloseModal() {
    this.setState({ show: !this.state.show });
  }
  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === 'seventh' ? 'seventh' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === 'seventh' ? (
          <div className="content-body flex">
            <div className="content">
              <div className className="container-fluid">
                <div className="db-filter flex align-center justify-space-between">
                  <h4 className="hero-title">Summary Part Status</h4>
                  {/* <div className="filter-in w-300">
                    <Form inline>
                      <div className="multi-search">
                        <FormGroup>
                          <InputGroup>
                            <FormControl type="text" />
                            <button className="btn sm-search">
                              <img src={Search} width="20px" />
                            </button>
                            <DropdownButton
                              componentClass={InputGroup.Button}
                              id="input-dropdown-addon"
                              title="Action"
                            >
                              <MenuItem key="1">
                                <FormGroup controlId="formInlineName">
                                  <ControlLabel>Part:</ControlLabel>
                                  <FormControl
                                    type="text"
                                    placeholder="Search any part"
                                  />
                                </FormGroup>
                              </MenuItem>
                              <MenuItem key="2">
                                <FormGroup controlId="formInlineName">
                                  <ControlLabel>Program:</ControlLabel>
                                  <FormControl
                                    type="text"
                                    placeholder="Search any Program"
                                  />
                                </FormGroup>
                              </MenuItem>
                              <MenuItem key="3">
                                <FormGroup controlId="formInlineName">
                                  <ControlLabel>Supplier:</ControlLabel>
                                  <FormControl
                                    type="text"
                                    placeholder="Search any Supplier"
                                  />
                                </FormGroup>
                              </MenuItem>
                            </DropdownButton>
                          </InputGroup>
                        </FormGroup>
                      </div>
                    </Form>
                  </div> */}
                </div>

                <div>
                  {this.state.summaryPartStatus ? (
                    <Table bordered responsive hover className="custom-table">
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Part Number</th>
                          <th>Quotation (Date)</th>
                          <th>Purchase Order (Date) </th>
                          <th>Delivery Target (Date)</th>
                          <th>Completion (Approx.Estimate)</th>
                          <th>Quality Audit/ PPAP (Date)</th>
                          <th>Dispatch (Date)</th>
                          <th>Parts Receipt(Date)</th>
                          <th>PPAP/QUALITY INSPECTION REPORT</th>
                          <th>Proforma Invoice</th>
                          <th>Material Inward (Gate Stamp)</th>
                          <th>Final Invoice</th>
                          <th>Miscellaneous Documents</th>
                          <th>Pictures</th>
                          <th>Comments</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.summaryPartStatus &&
                          this.state.summaryPartStatus.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  {
                                    item.partResponse.projectResponse
                                      .projectCode
                                  }
                                </td>
                                <td>{item.partResponse.partNumber}</td>
                                <td>
                                  {moment(
                                    item.quotationResponse.createdTimestamp
                                  ).format('DD/MM/YYYY')}
                                </td>
                                <td>
                                  {moment(item.createdTimestamp).format(
                                    'DD/MM/YYYY'
                                  )}
                                </td>
                                <td>
                                  {moment(item.projectDeliveryDate).format(
                                    'DD/MM/YYYY'
                                  )}
                                </td>
                                <td>{item.percentCompletion}</td>
                                <td>
                                  {moment(item.qualityInspectionDate).format(
                                    'DD/MM/YYYY'
                                  )}
                                </td>
                                <td>
                                  {moment(item.dispatchDate).format(
                                    'DD/MM/YYYY'
                                  )}
                                </td>
                                <td>
                                  {moment(item.partsReceiptDate).format(
                                    'DD/MM/YYYY'
                                  )}
                                </td>
                                <td>
                                  <Link
                                    to={{
                                      pathname: 'ppap',
                                      state: {
                                        partNumber:
                                          item.partResponse.partNumber,
                                        buyerUserId: item.buyerResponse.id,
                                        partId: item.partResponse.id
                                      }
                                    }}
                                  >
                                    {item.ppapScore}
                                  </Link>
                                </td>
                                <td>
                                  <div
                                    className="upload-btn cursor-pointer sm-upload"
                                    onClick={this.imageShow.bind(
                                      this,
                                      item.partResponse.id,
                                      item.uploadPerfomaInvoiceResponse,
                                      item.partResponse.partNumber
                                    )}
                                  >
                                    {(item.uploadPerfomaInvoiceResponse &&
                                      item.uploadPerfomaInvoiceResponse[0] &&
                                      item.uploadPerfomaInvoiceResponse[0]
                                        .mediaType ===
                                        'application/octet-stream') ||
                                    (item.uploadPerfomaInvoiceResponse &&
                                      item.uploadPerfomaInvoiceResponse[0] &&
                                      item.uploadPerfomaInvoiceResponse[0]
                                        .mediaType ===
                                        'application/vnd.ms-excel') ? (
                                      <img src={xlsImage} width="45" />
                                    ) : item.uploadPerfomaInvoiceResponse &&
                                      item.uploadPerfomaInvoiceResponse[0] &&
                                      item.uploadPerfomaInvoiceResponse[0]
                                        .mediaType === 'application/pdf' ? (
                                      <img src={pdfImage} width="45" />
                                    ) : item.uploadPerfomaInvoiceResponse &&
                                      item.uploadPerfomaInvoiceResponse
                                        .mediaType ===
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                      <img src={docImage} width="45" />
                                    ) : item.uploadPerfomaInvoiceResponse &&
                                      item.uploadPerfomaInvoiceResponse
                                        .mediaType === 'application/msword' ? (
                                      <img src={docImage} width="45" />
                                    ) : item.uploadPerfomaInvoiceResponse &&
                                      item.uploadPerfomaInvoiceResponse[0] &&
                                      item.uploadPerfomaInvoiceResponse[0]
                                        .mediaType === 'text/plain' ? (
                                      <img src={docImage} width="45" />
                                    ) : (
                                      <span />
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className="upload-btn cursor-pointer sm-upload"
                                    onClick={this.imageShow.bind(
                                      this,
                                      item.partResponse.id,
                                      item.uploadMaterialInwardResponse,
                                      item.partResponse.partNumber
                                    )}
                                  >
                                    {(item.uploadMaterialInwardResponse &&
                                      item.uploadMaterialInwardResponse[0] &&
                                      item.uploadMaterialInwardResponse[0]
                                        .mediaType ===
                                        'application/octet-stream') ||
                                    (item.uploadMaterialInwardResponse &&
                                      item.uploadMaterialInwardResponse[0] &&
                                      item.uploadMaterialInwardResponse[0]
                                        .mediaType ===
                                        'application/vnd.ms-excel') ? (
                                      <img src={xlsImage} width="45" />
                                    ) : item.uploadMaterialInwardResponse &&
                                      item.uploadMaterialInwardResponse[0] &&
                                      item.uploadMaterialInwardResponse[0]
                                        .mediaType === 'application/pdf' ? (
                                      <img src={pdfImage} width="45" />
                                    ) : (item.uploadMaterialInwardResponse &&
                                        item.uploadMaterialInwardResponse[0] &&
                                        item.uploadMaterialInwardResponse[0]
                                          .mediaType ===
                                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                                      (item.uploadMaterialInwardResponse &&
                                        item.uploadMaterialInwardResponse[0] &&
                                        item.uploadMaterialInwardResponse[0]
                                          .mediaType === 'text/plain') ? (
                                      <img src={docImage} width="45" />
                                    ) : (
                                      <span />
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className="upload-btn cursor-pointer sm-upload"
                                    onClick={this.imageShow.bind(
                                      this,
                                      item.partResponse.id,
                                      item.uploadFinalInvoiceResponse,
                                      item.partResponse.partNumber
                                    )}
                                  >
                                    {(item.uploadFinalInvoiceResponse &&
                                      item.uploadFinalInvoiceResponse[0] &&
                                      item.uploadFinalInvoiceResponse[0]
                                        .mediaType ===
                                        'application/octet-stream') ||
                                    (item.uploadFinalInvoiceResponse &&
                                      item.uploadFinalInvoiceResponse[0] &&
                                      item.uploadFinalInvoiceResponse[0]
                                        .mediaType ===
                                        'application/vnd.ms-excel') ? (
                                      <img src={xlsImage} width="45" />
                                    ) : item.uploadFinalInvoiceResponse &&
                                      item.uploadFinalInvoiceResponse[0] &&
                                      item.uploadFinalInvoiceResponse[0]
                                        .mediaType === 'application/pdf' ? (
                                      <img src={pdfImage} width="45" />
                                    ) : (item.uploadFinalInvoiceResponse &&
                                        item.uploadFinalInvoiceResponse[0] &&
                                        item.uploadFinalInvoiceResponse[0]
                                          .mediaType ===
                                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                                      (item.uploadFinalInvoiceResponse &&
                                        item.uploadFinalInvoiceResponse[0] &&
                                        item.uploadFinalInvoiceResponse[0]
                                          .mediaType === 'text/plain') ? (
                                      <img src={docImage} width="45" />
                                    ) : (
                                      <span />
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className="upload-btn cursor-pointer sm-upload"
                                    onClick={this.imageShow.bind(
                                      this,
                                      item.partResponse.id,
                                      item.uploadMiscellaneousDocumentsResponse,
                                      item.partResponse.partNumber
                                    )}
                                  >
                                    {(item.uploadMiscellaneousDocumentsResponse &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0] &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0]
                                        .mediaType ===
                                        'application/octet-stream') ||
                                    (item.uploadMiscellaneousDocumentsResponse &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0] &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0]
                                        .mediaType ===
                                        'application/vnd.ms-excel') ? (
                                      <img src={xlsImage} width="45" />
                                    ) : item.uploadMiscellaneousDocumentsResponse &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0] &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0]
                                        .mediaType === 'application/pdf' ? (
                                      <img src={pdfImage} width="45" />
                                    ) : item.uploadMiscellaneousDocumentsResponse &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0] &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0]
                                        .mediaType ===
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                      <img src={docImage} width="45" />
                                    ) : item.uploadMiscellaneousDocumentsResponse &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0] &&
                                      item
                                        .uploadMiscellaneousDocumentsResponse[0]
                                        .mediaType === 'text/plain' ? (
                                      <img src={docImage} width="45" />
                                    ) : (
                                      <span />
                                    )}
                                  </div>
                                </td>
                                <td>
                                  {item.uploadPicturesResponse &&
                                  item.uploadPicturesResponse[0] &&
                                  item.uploadPicturesResponse[0].mediaURL ? (
                                    <img
                                      onClick={this.imageShow.bind(
                                        this,
                                        item.id,
                                        item.uploadPicturesResponse,
                                        item.partResponse.partNumber
                                      )}
                                      alt=""
                                      width="45"
                                      src={
                                        item.uploadPicturesResponse &&
                                        item.uploadPicturesResponse[0] &&
                                        item.uploadPicturesResponse[0].mediaURL
                                      }
                                    />
                                  ) : (
                                    ''
                                  )}
                                </td>
                                <td>{item.comments}</td>
                                <td>
                                  <Link
                                    className="btn btn-default sm-btn br-0"
                                    to={{
                                      pathname: 'reviewPOApproval',
                                      state: {
                                        partId:
                                          item.partResponse &&
                                          item.partResponse.id,
                                        projectId:
                                          item.partResponse &&
                                          item.partResponse.projectResponse &&
                                          item.partResponse.projectResponse.id
                                      }
                                    }}
                                  >
                                    Review Details
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="noRecord">
                      {' '}
                      <img src={noRecord} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Footer
              pageTitle={permissionConstant.footer_title.summary_part_status}
            />
          </div>
        ) : null}
        {this.state.show ? (
          <SliderModal
            show={this.state.show}
            partId={this.state.partIdforMedia}
            partNumber={this.state.partNumberforMedia}
            partMediaResponses={this.state.partMediaResponses}
            specificationResponses={this.state.specificationResponses}
            handleCloseModal={this.handleCloseModal}
          />
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
      actionSummaryPartStatus,
      actionTabData
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User,
    supplierUsers: state.supplierUsers
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryPartsStatus);
