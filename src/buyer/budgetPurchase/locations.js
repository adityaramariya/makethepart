import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  FormControl,
  FormGroup,
  Modal,
  Breadcrumb,
  Table,
  Col
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sprite from '../../img/sprite.svg';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionSaveLocation,
  actionGetLocation
} from '../../common/core/redux/actions';
import { showErrorToast } from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import _ from 'lodash';
import Geosuggest from 'react-geosuggest';
let { validationMessages, renderMessage } = CONSTANTS;
let { permissionConstant } = CONSTANTS;

class location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'tweleve',
      showHeading: [],
      classification: {},
      editableMode: 0,
      addClassification: true,
      listOfLocations: []
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.deleteConfirmation = this.deleteConfirmation.bind(this);
    this.handleCloseConformation = this.handleCloseConformation.bind(this);
    this.fhandleRemove = this.handleRemove.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  componentDidMount() {
    let _this = this;

    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };

    this.props
      .actionGetLocation(data)
      .then((result, error) => {
        let resourceData = result.payload.data.resourceData;
        this.setState({
          listOfLocations: resourceData.list
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
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

  handleOnSubmit(event) {
    let _this = this;
    let flag = true;
    let showError = '';
    let errorMsg = [];
    let listOfLocationsDataArray = [];
    let listOfLocationsData = this.state.listOfLocations;

    listOfLocationsData.forEach(function(item, index) {
      console.log('(item.changeKey-----', item.changeKey);
      if (item.changeKey == 1) {
        errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
        flag = false;
      }
    });

    if (flag) {
      let data = {
        roleId: _this.props.userInfo.userData.userRole,
        userId: _this.props.userInfo.userData.id,
        addressRequests: listOfLocationsData
      };
      console.log('data----------', data);
      this.props
        .actionSaveLocation(data)
        .then((result, error) => {
          console.log('listOfLocationsData----------', result);
          let resourceData = result.payload.data.resourceData;
          this.setState({
            listOfLocations:
              resourceData.length > 0
                ? resourceData.list
                : this.state.listOfLocations
          });
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      if (errorMsg) {
        let uniqErrorMsg = _.uniqBy(errorMsg, function(e) {
          return e;
        });
        showError = uniqErrorMsg.join(',\r\n');
        showErrorToast(showError);
      }
    }
  }

  handleRemove(e, index, id, type, brandIndex) {
    let _this = this;
    let listOfLocations = this.state.listOfLocations;

    listOfLocations.splice(index, 1);

    this.setState({
      listOfLocations: listOfLocations
    });

    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      addressRequests: listOfLocations
    };

    this.props
      .actionSaveLocation(data)
      .then((result, error) => {
        this.setState({
          deleteConformationModal: false
        });

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  deleteConfirmation(event, index) {
    this.setState({
      deleteConformationModal: true,
      currentDeletedIndex: index
    });
  }

  handleCloseConformation(event) {
    this.setState({
      deleteConformationModal: false
    });
  }

  handleAddressChange(elementIndex, value) {
    console.log('value-------', value);
    try {
      let listOfLocations = this.state.listOfLocations;
      listOfLocations[elementIndex].changeKey = 1;
      this.setState({
        listOfLocations: listOfLocations
      });
    } catch (error) {}
  }
  handleLocationId = i => e => {
    const listOfLocations = [...this.state.listOfLocations];
    if (!listOfLocations[i] || !listOfLocations[i].address) {
      return false;
    }
    if (listOfLocations[i]) {
      listOfLocations[i].locationId = e.target.value;
    }
    this.setState({ listOfLocations });
  };
  handleAddressSelect(elementIndex, suggest) {
    this.setState({
      suggest: suggest
    });
    console.log('elementIndex-----', this.state.suggest);
    if (!suggest) return;
    try {
      let listOfLocations = this.state.listOfLocations;
      listOfLocations[elementIndex].changeKey = 0;
      this.setState({
        listOfLocations: listOfLocations
      });
      this.setState((prevState, props) => {
        let _listOfLocations = [...prevState.listOfLocations];
        if (!(_listOfLocations.length >= elementIndex))
          _listOfLocations.push({ ...this.addressObject });

        _listOfLocations[elementIndex].address = this.getGeoValueByKey(
          'description',
          suggest
        );
        _listOfLocations[elementIndex].latitude = this.getGeoValueByKey(
          'lat',
          suggest
        );
        _listOfLocations[elementIndex].longitude = this.getGeoValueByKey(
          'lng',
          suggest
        );
        _listOfLocations[elementIndex].city = this.getGeoValueByKey(
          'locality',
          suggest
        );
        _listOfLocations[elementIndex].country = this.getGeoValueByKey(
          'country',
          suggest
        );
        _listOfLocations[elementIndex].state = this.getGeoValueByKey(
          'administrative_area_level_1',
          suggest
        );
        _listOfLocations[elementIndex].zipcode = this.getGeoValueByKey(
          'postal_code',
          suggest
        );
        return { listOfLocations: _listOfLocations };
      });

      // let listOfLocations = this.state.listOfLocations;
      // listOfLocations[elementIndex] = this.getGeoValueByKey(
      //   'description',
      //   suggest
      // );
      // this.setState({
      //   listOfLocations: listOfLocations
      // });

      console.log('descriptiondescription', this.state.listOfLocations);
    } catch (error) {}
  }
  getGeoValueByKey(keyName, mapObject) {
    if (mapObject[keyName]) return mapObject[keyName];
    if (mapObject.location && mapObject.location[keyName])
      return mapObject.location[keyName];
    if (mapObject.gmaps && mapObject.gmaps.address_components) {
      for (
        let index = 0;
        index < mapObject.gmaps.address_components.length;
        index++
      ) {
        const element = mapObject.gmaps.address_components[index];
        if (element.types && element.types.indexOf(keyName) !== -1)
          return element.long_name;
      }
    }
    return '';
  }
  render() {
    let totalHeight = this.state.totalHeight ? this.state.totalHeight : 46;
    let _this = this;
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === 'tweleve' ? 'tweleve' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === 'tweleve' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <div className="flex  justify-space-between m-b-15">
                  <h4 className="hero-title">Location</h4>
                </div>

                <Table bordered responsive className="custom-table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Address</th>
                      <th>Location Id</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.listOfLocations &&
                      this.state.listOfLocations.map((elem, index) => {
                        return [
                          <tr>
                            <td className="w-76">{index + 1}.</td>
                            <td className="w-175">
                              <FormGroup
                                // validationState={this.getValidationState(
                                //   'address4'
                                // )}
                                className=" group address-input brdr"
                              >
                                <span className="ico-in">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#addressIco`} />
                                  </svg>
                                </span>
                                <Geosuggest
                                  ref={el => (this._geoSuggest = el)}
                                  placeholder="Alternate Address"
                                  inputClassName="form-control"
                                  name="address"
                                  initialValue={elem.address}
                                  onSuggestSelect={suggest =>
                                    this.handleAddressSelect(index, suggest)
                                  }
                                  // disabled={
                                  //   !(this.state.listOfLocations.length >= 3)
                                  // }
                                  onChange={e => {
                                    this.handleAddressChange(index, e);
                                  }}
                                  name="address4"
                                />
                              </FormGroup>
                            </td>

                            <td className="w-175">
                              <FormGroup>
                                <FormControl
                                  type="text"
                                  value={this.state.companyName}
                                  onChange={this.handleLocationId(index)}
                                  //onBlur={this.props.handleValidation("companyName")}
                                  name="locationId"
                                  value={elem.locationId}
                                  required
                                  placeholder="Name of Legal Entity"
                                />

                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                            <td className="w-175">
                              <button
                                className="btn btn-task btn btn-task"
                                onClick={e => {
                                  this.deleteConfirmation(e, index);
                                }}
                              >
                                <span className="ico-action ">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#deleteIco`} />
                                  </svg>
                                </span>
                                <span className="ico-txt">DELETE</span>
                              </button>
                            </td>
                          </tr>
                        ];
                      })}
                  </tbody>
                </Table>
                <div className="text-center m-b-20">
                  <button
                    className="btn btn-default text-uppercase"
                    disabled={
                      this.state.listOfLocations &&
                      this.state.listOfLocations.length > 0
                        ? false
                        : true
                    }
                    onClick={e => {
                      this.handleOnSubmit(e);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            <Footer
              pageTitle={permissionConstant.footer_title.build_plan_eco}
            />

            <Modal
              show={this.state.deleteConformationModal}
              onHide={this.handleCloseConformation}
              className="custom-popUp confirmation-box"
              bsSize="small"
            >
              <Modal.Body>
                <div className="">
                  <h5 className="text-center">
                    Are you sure you want to delete this?
                  </h5>
                  <div className="text-center">
                    <button
                      className="btn btn-default text-uppercase sm-btn"
                      onClick={event =>
                        this.handleRemove(event, this.state.currentDeletedIndex)
                      }
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-success text-uppercase"
                      onClick={this.handleCloseConformation}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
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
      actionSaveLocation,
      actionGetLocation
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(location);
