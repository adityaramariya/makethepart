import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormControl, FormGroup, Modal, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sprite from '../../img/sprite.svg';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionSaveGeographical,
  actionGetGeographical,
  actionDeleteGetGeographical,
  actionGetRegionDetails,
  actionSaveClassification
} from '../../common/core/redux/actions';
import { showErrorToast } from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import _ from 'lodash';
let { validationMessages } = CONSTANTS;
let { permissionConstant } = CONSTANTS;

class brandCost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'tweleve',
      showHeading: [],
      classification: {},
      editableMode: 0,
      addClassification: true,
      listOfGeographical: [
        {
          globalRegionId: '',
          name: '',
          globalSubRegions: [
            {
              globalSubRegionId: '',
              name: '',
              countries: [
                {
                  name: '',
                  countryPosition: 0
                }
              ],
              zones: [
                {
                  name: '',
                  countryPosition: 0,
                  zonePosition: 0
                }
              ],
              localBussinessRegion: [
                {
                  name: '',
                  countryPosition: 0,
                  zonePosition: 0,
                  lbrPosition: 0
                }
              ],
              districts: [
                {
                  name: '',
                  countryPosition: 0,
                  zonePosition: 0,
                  lbrPosition: 0,
                  districtPosition: 0
                }
              ],
              circles: [
                {
                  name: '',
                  countryPosition: 0,
                  zonePosition: 0,
                  lbrPosition: 0,
                  districtPosition: 0,
                  circlePosition: 0
                }
              ],
              area: [
                {
                  name: '',
                  countryPosition: 0,
                  zonePosition: 0,
                  lbrPosition: 0,
                  districtPosition: 0,
                  circlePosition: 0,
                  areaPosition: 0
                }
              ]
            }
          ]
        }
      ]
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.deleteConfirmation = this.deleteConfirmation.bind(this);
    this.handleCloseConformation = this.handleCloseConformation.bind(this);
    this.fhandleRemoveRegion = this.handleRemoveRegion.bind(this);
    this.handleClassification = this.handleClassification.bind(this);
    this.handleAddSubElement = this.handleAddSubElement.bind(this);
    this.handleCountryDetails = this.handleCountryDetails.bind(this);
    this.handleSubRegionDetails = this.handleSubRegionDetails.bind(this);
    this.handleSubRegionList = this.handleSubRegionList.bind(this);
  }

  componentDidMount() {
    let _this = this;
    let dataRegion = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      classificationFor: 'GLOBAL_REGION'
    };
    this.props
      .actionGetRegionDetails(dataRegion)
      .then((result, error) => {
        let listOfRegion = result.payload.data.resourceData;

        this.setState({
          listOfRegion: listOfRegion.list
        });

        this.setState({ listOfRegion: listOfRegion.list });

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };
    this.props
      .actionGetGeographical(data)
      .then((result, error) => {
        let purchaseResponse = result.payload.data.resourceData;
        this.setState(
          {
            listOfGeographical: []
          },
          () => this.checkAlreadySelectedRegion()
        );
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  checkAlreadySelectedRegion() {
    let listOfRegionArr = this.state.listOfRegion;
    let listOfGeographical = this.state.listOfGeographical;
    console.log(
      'listOfRegion-- before----',
      this.state.listOfRegion,
      listOfRegionArr && listOfRegionArr.length
    );

    for (let j = 0; j < listOfGeographical.length; j++) {
      for (let i = 0; i < listOfRegionArr.length; i++) {
        console.log('isDisabled', i);
        if (listOfGeographical[j].globalRegionId === listOfRegionArr[i].id) {
          listOfRegionArr[i].isDisabled = true;
        } else {
          listOfRegionArr[i].isDisabled = false;
        }
      }
    }
    this.setState({ listOfRegion: listOfRegionArr });

    console.log('listOfRegion-- callback----', this.state.listOfRegion);
  }

  handleSubRegionAndCountryDetails(
    regionIndex,
    subregionIndex,
    index,
    subIndex
  ) {
    let _this = this;
    let listOfGeographicalData = this.state.listOfGeographical;
    let geographicaListJson = listOfGeographicalData[index];
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      region: regionIndex,
      regionTwo: subregionIndex,
      classificationFor: 'GLOBAL_SUB_REGION_AND_COUNTRIES'
    };
    this.props
      .actionGetRegionDetails(data)
      .then((result, error) => {
        let listOfCountry = result.payload.data.resourceData;

        let geographicaListJsonSubIndex =
          geographicaListJson['globalSubRegions'][subIndex];
        geographicaListJson['listOfSubRegion'] = listOfCountry.list;
        geographicaListJsonSubIndex['listOfCountry'] = listOfCountry.secondList;
        geographicaListJson['globalSubRegions'][
          subIndex
        ] = geographicaListJsonSubIndex;
        listOfGeographicalData[index] = geographicaListJson;
        this.setState({ listOfGeographical: listOfGeographicalData });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleCountryDetails(regionIndex, index, subIndex) {
    let _this = this;
    let listOfGeographicalData = this.state.listOfGeographical;
    let geographicaListJson = listOfGeographicalData[index];
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      region: regionIndex,
      classificationFor: 'COUNTRIES'
    };
    this.props
      .actionGetRegionDetails(data)
      .then((result, error) => {
        let listOfCountry = result.payload.data.resourceData;
        let geographicaListJsonSubIndex =
          geographicaListJson['globalSubRegions'][subIndex];
        geographicaListJsonSubIndex['listOfCountry'] = listOfCountry.list;
        geographicaListJson['globalSubRegions'][
          subIndex
        ] = geographicaListJsonSubIndex;
        listOfGeographicalData[index] = geographicaListJson;
        this.setState({ listOfGeographical: listOfGeographicalData });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleSubRegionDetails(regionIndex, index) {
    let _this = this;

    let listOfGeographicalData = this.state.listOfGeographical;
    let geographicaListJson = listOfGeographicalData[index];

    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      region: regionIndex,
      classificationFor: 'GLOBAL_SUB_REGION'
    };
    this.props
      .actionGetRegionDetails(data)
      .then((result, error) => {
        let listOfSubRegion = result.payload.data.resourceData;

        geographicaListJson['listOfSubRegion'] = listOfSubRegion.list;
        geographicaListJson['listOfCountry'] = [];
        listOfGeographicalData[index] = geographicaListJson;
        this.setState({ listOfGeographical: listOfGeographicalData });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleRegionList(value, keyIndex, previouseValue) {
    let _this = this;
    let listOfRegionArr = this.state.listOfRegion;
    if (previouseValue) {
      listOfRegionArr &&
        listOfRegionArr.forEach(function(obj, elemIndex) {
          obj.id === previouseValue
            ? (listOfRegionArr[elemIndex].isDisabled = false)
            : '';
        });
    }
    if (listOfRegionArr[keyIndex]) {
      if (value) listOfRegionArr[keyIndex].isDisabled = true;
      else listOfRegionArr[keyIndex].isDisabled = false;
    }
    this.setState({ listOfRegion: listOfRegionArr });
  }

  handleSubRegionList(value, index, keyIndex, previouseValue) {
    let _this = this;
    let listOfRegionArr = this.state.listOfRegion;
    if (listOfRegionArr[keyIndex]) {
      if (value) listOfRegionArr[keyIndex].isDisabled = true;
      else listOfRegionArr[keyIndex].isDisabled = false;
    } else {
      listOfRegionArr &&
        listOfRegionArr.forEach(function(obj, elemIndex) {
          obj.id === previouseValue
            ? (listOfRegionArr[elemIndex].isDisabled = false)
            : '';
        });
    }
    this.setState({ listOfRegion: listOfRegionArr });
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

  handleChange = (index, type, subIndex, typeIndex) => event => {
    const { name, value } = event.target;
    const { options, selectedIndex } = event.target;
    const selected = event.target.checked;
    const textValue =
      options && options[selectedIndex].getAttribute('data-text');
    const keyIndex = options && options[selectedIndex].getAttribute('data-key');
    let listOfGeographicalData = this.state.listOfGeographical;
    let geographicaListJson = listOfGeographicalData[index];
    if (type === 'region') {
      this.handleRegionList(value, keyIndex, geographicaListJson[name]);
      geographicaListJson[name] = value;
      geographicaListJson['name'] = textValue;
      this.handleSubRegionDetails(value, index);
    } else if (type === 'subRegion') {
      //this.handleSubRegionList(value,index, keyIndex, geographicaListJson[name]);
      geographicaListJson['globalSubRegions'][subIndex][name] = value;
      geographicaListJson['globalSubRegions'][subIndex]['name'] = textValue;
      this.handleCountryDetails(value, index, subIndex);
    } else if (type === 'country') {
      geographicaListJson['globalSubRegions'][subIndex]['countries'][typeIndex][
        name
      ] = value;
      geographicaListJson['globalSubRegions'][subIndex]['countries'][typeIndex][
        'name'
      ] = textValue;
    } else if (type === 'zone') {
      geographicaListJson['globalSubRegions'][subIndex]['zones'][typeIndex][
        name
      ] = value;
    } else if (type === 'local') {
      geographicaListJson['globalSubRegions'][subIndex]['localBussinessRegion'][
        typeIndex
      ][name] = value;
    } else if (type === 'district') {
      geographicaListJson['globalSubRegions'][subIndex]['districts'][typeIndex][
        name
      ] = value;
    } else if (type === 'circles') {
      geographicaListJson['globalSubRegions'][subIndex]['circles'][typeIndex][
        name
      ] = value;
    } else if (type === 'area') {
      geographicaListJson['globalSubRegions'][subIndex]['area'][typeIndex][
        name
      ] = value;
    }
    listOfGeographicalData[index] = geographicaListJson;
    this.setState({ listOfGeographical: listOfGeographicalData });
  };

  selectCountry(index, value, name) {
    let listOfGeographicalData = this.state.listOfGeographical;
    let geographicaListJson = listOfGeographicalData[index];
    geographicaListJson[name] = value;
    listOfGeographicalData[index] = geographicaListJson;
    this.setState({ listOfGeographical: listOfGeographicalData });
  }

  handleOnSubmit(event) {
    let _this = this;
    let flag = true;
    let showError = '';
    let errorMsg = [];
    let listOfGeographicalDataArray = [];
    let listOfGeographicalData = this.state.listOfGeographical;

    listOfGeographicalData.forEach(function(item, index) {
      if (item.globalRegionId === '') {
        errorMsg.push(validationMessages.geographical.commonErrorMsg);
        flag = false;
      }

      let listOfRequest = [];

      item.globalSubRegions.forEach(function(subItem, subIndex) {
        let countries = _.filter(subItem.countries, function(o) {
          if (o.name == '') return o;
        });
        console.log(subItem.countries);
        let zones = _.filter(subItem.zones, function(o) {
          if (o.name == '') return o;
        });
        console.log(countries);
        let localBussinessRegion = _.filter(
          subItem.localBussinessRegion,
          function(o) {
            if (o.name == '') return o;
          }
        );

        let districts = _.filter(subItem.districts, function(o) {
          if (o.name == '') return o;
        });

        let circles = _.filter(subItem.circles, function(o) {
          if (o.name == '') return o;
        });

        let area = _.filter(subItem.area, function(o) {
          if (o.name == '') return o;
        });

        if (subItem.globalSubRegionId === '') {
          errorMsg.push(validationMessages.geographical.commonErrorMsg);
          flag = false;
        } else if (
          countries[0] &&
          (countries[0].name === 'undefined' || countries[0].name === '')
        ) {
          errorMsg.push(validationMessages.geographical.commonErrorMsg);
          flag = false;
        } else if (
          zones[0] &&
          (zones[0].name === '' || zones[0].name === 'undefined')
        ) {
          errorMsg.push(validationMessages.geographical.commonErrorMsg);
          flag = false;
        } else if (
          localBussinessRegion[0] &&
          (localBussinessRegion[0].name === 'undefined' ||
            localBussinessRegion[0].name === '')
        ) {
          errorMsg.push(validationMessages.geographical.commonErrorMsg);
          flag = false;
        } else if (
          districts[0] &&
          (districts[0].name === 'undefined' || districts[0].name === '')
        ) {
          errorMsg.push(validationMessages.geographical.commonErrorMsg);
          flag = false;
        } else if (
          circles[0] &&
          (circles[0].name === 'undefined' || circles[0].name === '')
        ) {
          errorMsg.push(validationMessages.geographical.commonErrorMsg);
          flag = false;
        } else if (
          area[0] &&
          (area[0].name === 'undefined' || area[0].name === '')
        ) {
          errorMsg.push(validationMessages.geographical.commonErrorMsg);
          flag = false;
        }

        // else if (
        //   subItem.zones &&
        //   subItem.zones[0] &&
        //   subItem.zones[0].name === ''
        // ) {
        //   errorMsg.push(validationMessages.geographical.commonErrorMsg);
        //   flag = false;
        // } else if (
        //   subItem.localBussinessRegion &&
        //   subItem.localBussinessRegion[0] &&
        //   subItem.localBussinessRegion[0].name === ''
        // ) {
        //   errorMsg.push(validationMessages.geographical.commonErrorMsg);
        //   flag = false;
        // } else if (
        //   subItem.districts &&
        //   subItem.districts[0] &&
        //   subItem.districts[0].name === ''
        // ) {
        //   errorMsg.push(validationMessages.geographical.commonErrorMsg);
        //   flag = false;
        // } else if (
        //   subItem.circles &&
        //   subItem.circles[0] &&
        //   subItem.circles[0].name === ''
        // ) {
        //   errorMsg.push(validationMessages.geographical.commonErrorMsg);
        //   flag = false;
        // } else if (
        //   subItem.area &&
        //   subItem.area[0] &&
        //   subItem.area[0].name === ''
        // ) {
        //   errorMsg.push(validationMessages.geographical.commonErrorMsg);
        //   flag = false;
        // }

        listOfRequest.push({
          name: subItem.name,
          countries: subItem.countries,
          zones: subItem.zones,
          localBussinessRegion: subItem.localBussinessRegion,
          districts: subItem.districts,
          circles: subItem.circles,
          area: subItem.area,
          globalSubRegionId: subItem.globalSubRegionId
          // listOfCountry: subItem.listOfCountry
        });
      });
      if (item.id) {
        listOfGeographicalDataArray.push({
          id: item.id,
          name: item.name,
          globalRegionId: item.globalRegionId,
          //  listOfSubRegion: item.listOfSubRegion,
          globalSubRegions: listOfRequest,
          isCreated: true,
          isSelectedForClassification: false
        });
      } else {
        listOfGeographicalDataArray.push({
          name: item.name,
          globalRegionId: item.globalRegionId,
          globalSubRegions: listOfRequest,
          isCreated: true,
          isSelectedForClassification: false
        });
      }
    });

    if (flag) {
      let data = {
        roleId: _this.props.userInfo.userData.userRole,
        userId: _this.props.userInfo.userData.id,
        geoCostCenterRequests: listOfGeographicalDataArray
      };

      this.props
        .actionSaveGeographical(data)
        .then((result, error) => {
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

  handleAddRow = () => {
    if (
      this.state.listOfRegion &&
      this.state.listOfGeographical &&
      this.state.listOfRegion.length > this.state.listOfGeographical.length
    ) {
      this.setState({
        listOfGeographical: this.state.listOfGeographical.concat([
          {
            globalRegionId: '',
            name: '',
            globalSubRegions: [
              {
                globalSubRegionId: '',
                name: '',
                countries: [
                  {
                    name: '',
                    countryPosition: 0
                  }
                ],
                zones: [
                  {
                    name: '',
                    countryPosition: 0,
                    zonePosition: 0
                  }
                ],
                localBussinessRegion: [
                  {
                    name: '',
                    countryPosition: 0,
                    zonePosition: 0,
                    lbrPosition: 0
                  }
                ],
                districts: [
                  {
                    name: '',
                    countryPosition: 0,
                    zonePosition: 0,
                    lbrPosition: 0,
                    districtPosition: 0
                  }
                ],
                circles: [
                  {
                    name: '',
                    countryPosition: 0,
                    zonePosition: 0,
                    lbrPosition: 0,
                    districtPosition: 0,
                    circlePosition: 0
                  }
                ],
                area: [
                  {
                    name: '',
                    countryPosition: 0,
                    zonePosition: 0,
                    lbrPosition: 0,
                    districtPosition: 0,
                    circlePosition: 0,
                    areaPosition: 0
                  }
                ]
              }
            ]
          }
        ])
      });
    } else {
      showErrorToast(validationMessages.geographical.addItem);
    }
  };

  handleRemoveRegion(e, index, id) {
    let _this = this;
    let listOfGeographical = this.state.listOfGeographical;
    listOfGeographical.splice(index, 1);
    this.setState({
      listOfGeographical: listOfGeographical
    });

    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      id: id
    };

    this.props
      .actionDeleteGetGeographical(data)
      .then((result, error) => {
        this.setState({
          deleteConformationModal: false
        });

        let listOfRegion = this.state.listOfRegion;
        let arrayLength =
          listOfRegion && listOfRegion.length ? listOfRegion.length : 0;

        for (let i = 0; i < arrayLength; i++) {
          if (id === listOfRegion[i].id) {
            listOfRegion[i].isDisabled = false;
          }
        }
        this.setState({ listOfRegion: listOfRegion });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  deleteConfirmation(event, index, id, type) {
    this.setState({
      deleteConformationModal: true,
      currentDeletedId: id,
      currentDeletedIndex: index,
      type: type
    });
  }

  handleCloseConformation(event) {
    this.setState({
      deleteConformationModal: false
    });
  }

  handleClassification = (index, type, subIndex, typeIndex) => event => {
    const { name, value } = event.target;
    let listOfGeographicalData = this.state.listOfGeographical;
    let classification = this.state.classification;

    let geographicaListJson = listOfGeographicalData[index];
    if (type === 'region') {
      geographicaListJson[name] = value;
      classification['globalRegionId'] = geographicaListJson['globalRegionId'];
    } else if (type === 'subRegion') {
      geographicaListJson['globalSubRegions'][subIndex][name] = value;
      classification['globalSubRegionId'] =
        geographicaListJson['globalSubRegions'][subIndex]['globalSubRegionId'];
    } else if (type === 'country') {
      geographicaListJson['globalSubRegions'][subIndex]['countries'][typeIndex][
        name
      ] = value;
      classification['countryId'] =
        geographicaListJson['globalSubRegions'][subIndex]['countries'][
          typeIndex
        ]['id'];
    } else if (type === 'zone') {
      geographicaListJson['globalSubRegions'][subIndex]['zones'][typeIndex][
        name
      ] = value;
      classification['zoneName'] =
        geographicaListJson['globalSubRegions'][subIndex]['zones'][typeIndex][
          'name'
        ];
    } else if (type === 'local') {
      geographicaListJson['globalSubRegions'][subIndex]['localBussinessRegion'][
        typeIndex
      ][name] = value;

      classification['localRegionName'] =
        geographicaListJson['globalSubRegions'][subIndex][
          'localBussinessRegion'
        ][typeIndex]['name'];
    } else if (type === 'district') {
      geographicaListJson['globalSubRegions'][subIndex]['districts'][typeIndex][
        name
      ] = value;

      classification['districtName'] =
        geographicaListJson['globalSubRegions'][subIndex]['districts'][
          typeIndex
        ]['name'];
    } else if (type === 'circles') {
      geographicaListJson['globalSubRegions'][subIndex]['circles'][typeIndex][
        name
      ] = value;

      classification['circleName'] =
        geographicaListJson['globalSubRegions'][subIndex]['circles'][typeIndex][
          'name'
        ];
    } else if (type === 'area') {
      geographicaListJson['globalSubRegions'][subIndex]['area'][typeIndex][
        name
      ] = value;

      classification['areaName'] =
        geographicaListJson['globalSubRegions'][subIndex]['area'][typeIndex][
          'name'
        ];
    }
    listOfGeographicalData[index] = geographicaListJson;
    this.setState({
      listOfGeographical: listOfGeographicalData,
      classification: classification
    });
  };

  handleAddSubElement = (e, index, elemSubregionIndex) => {
    var listOfGeographical = this.state.listOfGeographical;
    listOfGeographical[index] &&
      listOfGeographical[index].globalSubRegions.push({
        globalSubRegionId: '',
        name: '',
        countries: [
          {
            name: '',
            countryPosition: 0
          }
        ],
        zones: [
          {
            name: '',
            countryPosition: 0,
            zonePosition: 0
          }
        ],
        localBussinessRegion: [
          {
            name: '',
            countryPosition: 0,
            zonePosition: 0,
            lbrPosition: 0
          }
        ],
        districts: [
          {
            name: '',
            countryPosition: 0,
            zonePosition: 0,
            lbrPosition: 0,
            districtPosition: 0
          }
        ],
        circles: [
          {
            name: '',
            countryPosition: 0,
            zonePosition: 0,
            lbrPosition: 0,
            districtPosition: 0,
            circlePosition: 0
          }
        ],
        area: [
          {
            name: '',
            countryPosition: 0,
            zonePosition: 0,
            lbrPosition: 0,
            districtPosition: 0,
            circlePosition: 0,
            areaPosition: 0
          }
        ]
      });
    this.setState({
      listOfGeographical: listOfGeographical
    });
  };

  handleExtraElement = (event, index, elemSubregionIndex, type) => {
    let listOfGeographical = this.state.listOfGeographical;
    let lastCountry = listOfGeographical[index].globalSubRegions[
      elemSubregionIndex
    ].countries.slice(-1)[0];

    let lastZone = listOfGeographical[index].globalSubRegions[
      elemSubregionIndex
    ].zones.slice(-1)[0];

    let lastLocal = listOfGeographical[index].globalSubRegions[
      elemSubregionIndex
    ].localBussinessRegion.slice(-1)[0];

    let lastDistrict = listOfGeographical[index].globalSubRegions[
      elemSubregionIndex
    ].districts.slice(-1)[0];

    let lastCircle = listOfGeographical[index].globalSubRegions[
      elemSubregionIndex
    ].circles.slice(-1)[0];

    let lastArea = listOfGeographical[index].globalSubRegions[
      elemSubregionIndex
    ].area.slice(-1)[0];
    if (type === 'countries') {
      lastCountry = lastCountry.countryPosition + 1;
      lastZone = 0;
      lastLocal = 0;
      lastDistrict = 0;
      lastCircle = 0;
      lastArea = 0;
    } else if (type === 'zones') {
      lastZone = lastZone.zonePosition + 1;
      lastCountry = lastCountry.countryPosition;
      lastLocal = 0;
      lastDistrict = 0;
      lastCircle = 0;
      lastArea = 0;
    } else if (type === 'localBussinessRegion') {
      lastLocal = lastLocal.lbrPosition + 1;
      lastCountry = lastCountry.countryPosition;
      lastZone = lastZone.zonePosition;
      lastDistrict = 0;
      lastCircle = 0;
      lastArea = 0;
    } else if (type === 'districts') {
      lastDistrict = lastDistrict.districtPosition + 1;
      lastCountry = lastCountry.countryPosition;
      lastZone = lastZone.zonePosition;
      lastLocal = lastLocal.lbrPosition;

      lastCircle = 0;
      lastArea = 0;
    } else if (type === 'circles') {
      lastCircle = lastCircle.circlePosition + 1;
      lastCountry = lastCountry.countryPosition;
      lastZone = lastZone.zonePosition;
      lastLocal = lastLocal.lbrPosition;
      lastDistrict = lastDistrict.districtPosition;
      lastArea = 0;
    } else if (type === 'area') {
      lastArea = lastArea.areaPosition + 1;
      lastCountry = lastCountry.countryPosition;
      lastZone = lastZone.zonePosition;
      lastLocal = lastLocal.lbrPosition;
      lastDistrict = lastDistrict.districtPosition;
      lastCircle = lastCircle.circlePosition;
    }

    if (
      listOfGeographical[index] &&
      listOfGeographical[index].globalSubRegions[elemSubregionIndex]
    ) {
      if (type === 'countries') {
        listOfGeographical[index].globalSubRegions[
          elemSubregionIndex
        ].countries.push({
          name: '',
          countryPosition: lastCountry
        });
      }

      if (type === 'zones' || type === 'countries') {
        listOfGeographical[index].globalSubRegions[
          elemSubregionIndex
        ].zones.push({
          name: '',
          countryPosition: lastCountry,
          zonePosition: lastZone
        });
      }

      if (
        type === 'countries' ||
        type === 'zones' ||
        type === 'localBussinessRegion'
      ) {
        listOfGeographical[index].globalSubRegions[
          elemSubregionIndex
        ].localBussinessRegion.push({
          name: '',
          countryPosition: lastCountry,
          zonePosition: lastZone,
          lbrPosition: lastLocal
        });
      }

      if (
        type === 'countries' ||
        type === 'zones' ||
        type === 'localBussinessRegion' ||
        type === 'districts'
      ) {
        listOfGeographical[index].globalSubRegions[
          elemSubregionIndex
        ].districts.push({
          name: '',
          countryPosition: lastCountry,
          zonePosition: lastZone,
          lbrPosition: lastLocal,
          districtPosition: lastDistrict
        });
      }

      if (
        type === 'countries' ||
        type === 'zones' ||
        type === 'localBussinessRegion' ||
        type === 'districts' ||
        type === 'circles'
      ) {
        listOfGeographical[index].globalSubRegions[
          elemSubregionIndex
        ].circles.push({
          name: '',
          countryPosition: lastCountry,
          zonePosition: lastZone,
          lbrPosition: lastLocal,
          districtPosition: lastDistrict,
          circlePosition: lastCircle
        });
      }

      if (
        type === 'countries' ||
        type === 'zones' ||
        type === 'localBussinessRegion' ||
        type === 'districts' ||
        type === 'circles' ||
        type === 'area'
      ) {
        listOfGeographical[index].globalSubRegions[
          elemSubregionIndex
        ].area.push({
          name: '',
          countryPosition: lastCountry,
          zonePosition: lastZone,
          lbrPosition: lastLocal,
          districtPosition: lastDistrict,
          circlePosition: lastCircle,
          areaPosition: lastArea
        });
      }
    }

    this.setState({
      listOfGeographical: listOfGeographical
    });
  };

  render() {
    let enabledMode = this.state.editableMode;
    let clfData = this.state.classification;
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
                {this.props.userInfo.userData.userProfile === 'admin' ? (
                  <div className="">
                    <Breadcrumb className="style-breadcrumb">
                      <Breadcrumb.Item>
                        <Link to="administrator">Dashboard</Link>
                      </Breadcrumb.Item>

                      <Breadcrumb.Item active>
                        Brand Cost Centers Classification
                      </Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                ) : (
                  ''
                )}

                <div className="flex  justify-space-between m-b-15">
                  <h4 className="hero-title">
                    Brand Cost Centers Classification
                  </h4>
                </div>

                {/* code started by aditya */}

                <div className="f-table">
                  <div className="f-row">
                    <div className="th-f">Brand</div>
                    <div className="th-f">Sub Brand</div>
                    <div className="th-f">{''}</div>
                  </div>
                  <div className="f-tbody">
                    <div className="geographical--tree">
                      {this.state.listOfGeographical &&
                        this.state.listOfGeographical.map((elem, index) => {
                          return [
                            <div className="root">
                              <div className="globalRegion">
                                <FormGroup
                                  controlId="formControlsSelect"
                                  className="m-b-0 w-full"
                                >
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0 line-set"
                                    name="globalRegionId"
                                    value={elem.globalRegionId}
                                    onChange={this.handleChange(
                                      index,
                                      'region'
                                    )}
                                  >
                                    <option value="">select</option>
                                    {this.state.listOfRegion &&
                                      this.state.listOfRegion.map(
                                        (item, index) => {
                                          return (
                                            <option
                                              value={item.id}
                                              key={index}
                                              data-key={index}
                                              data-text={item.globalRegion}
                                              disabled={item.isDisabled}
                                            >
                                              {item.globalRegion}
                                            </option>
                                          );
                                        }
                                      )}
                                  </FormControl>
                                </FormGroup>

                                {/* <FormGroup
                                  controlId="formBasicText"
                                  className="mb-0"
                                >
                                  <FormControl
                                    type="text"
                                    placeholder="Global Region"
                                    className="br-0"
                                    name="name"
                                    onChange={this.handleChange(
                                      index,
                                      'region'
                                    )}
                                    value={elem.name}
                                  />
                                </FormGroup> */}
                              </div>

                              <div className="pull-left">
                                {elem.globalSubRegions &&
                                  elem.globalSubRegions.map(
                                    (elemSubResion, elemSubregionIndex) => {
                                      return [
                                        <div className="subRegion sub-tree">
                                          <div className="pull-left">
                                            <ul className="geo-tree for-region geo-tree--list">
                                              <li className="m-t-0">
                                                <div className="flex align-center">
                                                  <FormGroup
                                                    controlId="formControlsSelect"
                                                    className="m-b-0 w-full"
                                                  >
                                                    <FormControl
                                                      componentClass="select"
                                                      placeholder="select"
                                                      className="s-arrow br-0"
                                                      name="globalSubRegionId"
                                                      value={
                                                        elemSubResion.globalSubRegionId
                                                      }
                                                      onChange={this.handleChange(
                                                        index,
                                                        'subRegion',
                                                        elemSubregionIndex
                                                      )}
                                                    >
                                                      <option value="">
                                                        select
                                                      </option>
                                                      {elem.listOfSubRegion &&
                                                        elem.listOfSubRegion.map(
                                                          (item, index) => {
                                                            return (
                                                              <option
                                                                value={item.id}
                                                                key={index}
                                                                data-key={index}
                                                                data-text={
                                                                  item.subRegion
                                                                }
                                                                disabled={
                                                                  item.isDisabled
                                                                }
                                                              >
                                                                {item.subRegion}
                                                              </option>
                                                            );
                                                          }
                                                        )}
                                                    </FormControl>
                                                  </FormGroup>
                                                </div>
                                              </li>
                                            </ul>
                                            {elemSubregionIndex === 0 ? (
                                              <div className="addMore">
                                                <span
                                                  className="blue-add flex"
                                                  onClick={event => {
                                                    this.handleAddSubElement(
                                                      event,
                                                      index,
                                                      elemSubregionIndex
                                                    );
                                                  }}
                                                >
                                                  <span className="ico-add">
                                                    <svg>
                                                      <use
                                                        xlinkHref={`${Sprite}#plus-OIco`}
                                                      />
                                                    </svg>
                                                  </span>
                                                  <span className="b-t-t">
                                                    Add more
                                                  </span>
                                                </span>
                                              </div>
                                            ) : (
                                              ''
                                            )}
                                          </div>
                                        </div>
                                      ];
                                    }
                                  )}
                              </div>

                              <div className="td-f text-right">
                                {/* <button className="btn btn-task">
                                  <span className="ico-action ">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#editIco`} />
                                    </svg>
                                  </span>
                                  <span className="ico-txt">Edit</span>
                                </button> */}

                                <button
                                  className="btn btn-task"
                                  onClick={e => {
                                    this.deleteConfirmation(
                                      e,
                                      index,
                                      elem.globalRegionId,
                                      'region'
                                    );
                                  }}
                                >
                                  <span className="ico-action ">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#deleteIco`} />
                                    </svg>
                                  </span>
                                  <span className="ico-txt">Delete</span>
                                </button>
                              </div>
                            </div>
                          ];
                        })}
                    </div>
                  </div>
                </div>

                {/* code ended  by aditya */}

                {/* <button
                  type="button"
                  onClick={this.handleAddRow}
                  className="small"
                >
                  Add Shareholder
                </button> */}

                <div>
                  <span className="cursor-pointer" onClick={this.handleAddRow}>
                    <span className="ico-add">
                      <svg>
                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                      </svg>
                    </span>
                    &nbsp;Add new Row
                  </span>
                </div>

                <div className="text-center m-b-20">
                  <button
                    className="btn btn-default text-uppercase"
                    // onClick={e => {
                    //   this.handleOnSubmit(e);
                    // }}
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
                    {this.state.type === 'classification' ? (
                      <button
                        className="btn btn-default text-uppercase sm-btn"
                        onClick={event =>
                          this.handleRemoveClassification(
                            event,
                            this.state.currentDeletedIndex,
                            this.state.currentDeletedId
                          )
                        }
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        className="btn btn-default text-uppercase sm-btn"
                        onClick={event =>
                          this.handleRemoveRegion(
                            event,
                            this.state.currentDeletedIndex,
                            this.state.currentDeletedId
                          )
                        }
                      >
                        Delete
                      </button>
                    )}

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
      actionSaveGeographical,
      actionGetGeographical,
      actionDeleteGetGeographical,
      actionGetRegionDetails,
      actionSaveClassification
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
)(brandCost);
