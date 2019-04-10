import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormControl, FormGroup, Modal, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sprite from '../../img/sprite.svg';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionSaveSpendingCategory,
  actionGetSpendingCategory,
  actionDeleteSpendingCategory
} from '../../common/core/redux/actions';
import { showErrorToast } from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import _ from 'lodash';
let { validationMessages } = CONSTANTS;
let { permissionConstant } = CONSTANTS;

class spendingCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'tweleve',
      showHeading: [],
      classification: {},
      editableMode: 0,
      addClassification: true,
      listOfRegionOne: [
        {
          name: '',
          listOfRegionTwo: [
            {
              name: '',
              listOfRegionThree: [
                {
                  name: '',
                  listOfRegionFour: [
                    {
                      name: '',
                      listOfRegionFive: [
                        {
                          name: '',
                          listOfRegionSix: [
                            {
                              name: '',
                              listOfRegionSeven: [
                                {
                                  name: '',
                                  listOfRegionEight: [
                                    {
                                      name: ''
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      catPopover: false
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.deleteConfirmation = this.deleteConfirmation.bind(this);
    this.handleCloseConformation = this.handleCloseConformation.bind(this);
    this.fhandleRemove = this.handleRemove.bind(this);
    this.handleAddTree = this.handleAddTree.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.calcHeight = this.calcHeight.bind(this);
  }

  componentDidMount() {
    let _this = this;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };

    this.props
      .actionGetSpendingCategory(data)
      .then((result, error) => {
        let resourceData = result.payload.data.resourceData.list;

        let resourceDataList =
          resourceData.length > 0 ? resourceData : this.state.listOfRegionOne;
        resourceData.forEach(function(item, index) {
          if (item.listOfRegionTwo && item.listOfRegionTwo.length > 0) {
            item.listOfRegionTwo.forEach(function(subitem, catIndex) {
              if (subitem.listOfRegionThree.length > 0) {
                subitem.listOfRegionThree.forEach(function(
                  subsubitem,
                  subIndex
                ) {
                  if (
                    subsubitem.listOfRegionFour &&
                    subsubitem.listOfRegionFour.length > 0
                  ) {
                  } else {
                    resourceData[index].listOfRegionTwo[
                      catIndex
                    ].listOfRegionThree[subIndex].listOfRegionFour = [];
                    resourceData[index].listOfRegionTwo[
                      catIndex
                    ].listOfRegionThree[subIndex].listOfRegionFour.push({
                      name: ''
                    });
                  }
                });
              } else {
                resourceData[index].listOfRegionTwo[
                  catIndex
                ].listOfRegionThree = [];
                resourceData[index].listOfRegionTwo[
                  catIndex
                ].listOfRegionThree.push({
                  name: '',
                  listOfRegionFour: [
                    {
                      name: ''
                    }
                  ]
                });
              }
            });
          } else {
            resourceData[index].listOfRegionTwo = [];
            resourceData[index].listOfRegionTwo.push({
              name: '',
              listOfRegionThree: [
                {
                  name: '',
                  listOfRegionFour: [
                    {
                      name: ''
                    }
                  ]
                }
              ]
            });
          }
        });

        this.setState({
          //listOfRegionOne: resourceDataList
        });

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleChange = (
    index,
    type,
    regionTwo,
    regionThree,
    regionFour,
    regionFive,
    regionSix,
    regionSeven,
    regionEight
  ) => event => {
    let value = event.target.value;
    const { name } = event.target;
    const { options, selectedIndex } = event.target;
    const selected = event.target.checked;
    const textValue =
      options && options[selectedIndex].getAttribute('data-text');
    const keyIndex = options && options[selectedIndex].getAttribute('data-key');

    let listOfRegionOneData = this.state.listOfRegionOne;
    let geographicaListJson = listOfRegionOneData[index];
    if (value) value = value.replace(/[&\/\\#^`!@+()$~%=.'":*?<>{}]/g, '');
    else value = value;

    if (type === 'regionOne') {
      geographicaListJson[name] = value;
    } else if (type === 'regionTwo') {
      geographicaListJson['listOfRegionTwo'][regionTwo][name] = value;
    } else if (type === 'regionThree') {
      geographicaListJson['listOfRegionTwo'][regionTwo]['listOfRegionThree'][
        regionThree
      ][name] = value;
    } else if (type === 'regionFour') {
      geographicaListJson['listOfRegionTwo'][regionTwo]['listOfRegionThree'][
        regionThree
      ]['listOfRegionFour'][regionFour][name] = value;
    } else if (type === 'regionFive') {
      geographicaListJson['listOfRegionTwo'][regionTwo]['listOfRegionThree'][
        regionThree
      ]['listOfRegionFour'][regionFour]['listOfRegionFive'][regionFive][
        name
      ] = value;
    } else if (type === 'regionSix') {
      geographicaListJson['listOfRegionTwo'][regionTwo]['listOfRegionThree'][
        regionThree
      ]['listOfRegionFour'][regionFour]['listOfRegionFive'][regionFive][
        'listOfRegionSix'
      ][regionSix][name] = value;
    } else if (type === 'regionSeven') {
      geographicaListJson['listOfRegionTwo'][regionTwo]['listOfRegionThree'][
        regionThree
      ]['listOfRegionFour'][regionFour]['listOfRegionFive'][regionFive][
        'listOfRegionSix'
      ][regionSix]['listOfRegionSeven'][regionSeven][name] = value;
    } else if (type === 'regionEight') {
      geographicaListJson['listOfRegionTwo'][regionTwo]['listOfRegionThree'][
        regionThree
      ]['listOfRegionFour'][regionFour]['listOfRegionFive'][regionFive][
        'listOfRegionSix'
      ][regionSix]['listOfRegionSeven'][regionSeven]['listOfRegionEight'][
        regionEight
      ][name] = value;
    }

    listOfRegionOneData[index] = geographicaListJson;
    this.setState({ listOfRegionOne: listOfRegionOneData });
  };

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
    let listOfRegionOneDataArray = [];
    let listOfRegionOneData = this.state.listOfRegionOne;

    listOfRegionOneData.forEach(function(item, index) {
      if (item.name === '') {
        errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
        flag = false;
      }

      // let listOfRequest = [];
      // item.listOfRegionTwo.forEach(function(categoryItem, subIndex) {
      //   if (categoryItem.name === '') {
      //     errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
      //     flag = false;
      //   }
      //   categoryItem.listOfRegionThree.forEach(function(
      //     subcategoryItem,
      //     subIndex
      //   ) {
      //     if (subcategoryItem.name === '') {
      //       errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
      //       flag = false;
      //     }
      //     subcategoryItem.listOfRegionFour.forEach(function(
      //       subsubcategoryItem,
      //       subIndex
      //     ) {
      //       if (subsubcategoryItem.name === '') {
      //         errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
      //         flag = false;
      //       }
      //     });
      //   });
      // });
    });

    if (flag) {
      let data = {
        roleId: _this.props.userInfo.userData.userRole,
        userId: _this.props.userInfo.userData.id,
        listOfRegionOne: listOfRegionOneData
      };

      this.props
        .actionSaveSpendingCategory(data)
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
    this.setState({
      listOfRegionOne: this.state.listOfRegionOne.concat([
        {
          name: '',
          listOfRegionTwo: [
            {
              name: '',
              listOfRegionThree: [
                {
                  name: '',
                  listOfRegionFour: [
                    {
                      name: '',
                      listOfRegionFive: [
                        {
                          name: '',
                          listOfRegionSix: [
                            {
                              name: '',
                              listOfRegionSeven: [
                                {
                                  name: '',
                                  listOfRegionEight: [
                                    {
                                      name: ''
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ])
    });
  };

  handleRemove(
    e,
    index,
    id,
    type,
    categoryIndex,
    subCategoryIndex,
    subSubCategoryIndex
  ) {
    let _this = this;
    let listOfRegionOne = this.state.listOfRegionOne;

    console.log(
      'handleRemove----',
      index,
      id,
      type,
      categoryIndex,
      subCategoryIndex,
      subSubCategoryIndex
    );

    if (type === 'MAJOR_CATEGORY') {
      listOfRegionOne.splice(index, 1);
    } else if (type === 'regionTwo') {
      listOfRegionOne[index].listOfRegionTwo.splice(categoryIndex, 1);
    } else if (type === 'SUB_CATEGORY') {
      listOfRegionOne[index].listOfRegionTwo[
        categoryIndex
      ].listOfRegionThree.splice(subCategoryIndex, 1);
    } else if (type === 'SUB_SUB_CATEGORY') {
      listOfRegionOne[index].listOfRegionTwo[categoryIndex].listOfRegionThree[
        subCategoryIndex
      ].listOfRegionFour.splice(subSubCategoryIndex, 1);
    }

    this.setState({
      listOfRegionOne: listOfRegionOne
    });

    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      listOfIds: [id],
      classificationType: type
    };

    this.props
      .actionDeleteSpendingCategory(data)
      .then((result, error) => {
        this.setState({
          deleteConformationModal: false
        });

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  deleteConfirmation(
    event,
    index,
    id,
    type,
    categoryIndex,
    subCategoryIndex,
    subSubCategoryIndex
  ) {
    this.setState({
      deleteConformationModal: true,
      currentDeletedId: id,
      currentDeletedIndex: index,
      type: type,
      categoryIndex: categoryIndex,
      subCategoryIndex: subCategoryIndex,
      subSubCategoryIndex: subSubCategoryIndex
    });
  }

  handleCloseConformation(event) {
    this.setState({
      deleteConformationModal: false
    });
  }
  calcHeight() {
    if (this.Line1 && this.Line1.clientHeight) return this.Line1.clientHeight;
  }
  handleAddTree = (
    e,
    index,
    type,
    regionTwo,
    regionThree,
    regionFour,
    regionFive,
    regionSix,
    regionSeven
  ) => {
    let totalHeight = this.calcHeight();

    console.log('totalHeight-------------', totalHeight);

    var listOfRegionOne = this.state.listOfRegionOne;
    if (type === 'regionOne') {
      this.setState({
        totalHeight: 46
      });
      listOfRegionOne[index] &&
        listOfRegionOne[index].listOfRegionTwo.push({
          name: '',
          listOfRegionTwo: [
            {
              name: '',
              listOfRegionThree: [
                {
                  name: '',
                  listOfRegionFour: [
                    {
                      name: '',
                      listOfRegionFive: [
                        {
                          name: '',
                          listOfRegionSix: [
                            {
                              name: '',
                              listOfRegionSeven: [
                                {
                                  name: '',
                                  listOfRegionEight: [
                                    {
                                      name: ''
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        });
    } else if (type === 'regionTwo') {
      this.setState({
        totalHeight: 46
      });
      listOfRegionOne[index] &&
        listOfRegionOne[index].listOfRegionTwo.push({
          name: '',
          listOfRegionThree: [
            {
              name: '',
              listOfRegionFour: [
                {
                  name: '',
                  listOfRegionFive: [
                    {
                      name: '',
                      listOfRegionSix: [
                        {
                          name: '',
                          listOfRegionSeven: [
                            {
                              name: '',
                              listOfRegionEight: [
                                {
                                  name: ''
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        });
    } else if (type === 'regionThree') {
      this.setState({
        totalHeight: 46
      });
      listOfRegionOne[index] &&
        listOfRegionOne[index].listOfRegionTwo[
          regionTwo
        ].listOfRegionThree.push({
          name: '',
          listOfRegionFour: [
            {
              name: '',
              listOfRegionFive: [
                {
                  name: '',
                  listOfRegionSix: [
                    {
                      name: '',
                      listOfRegionSeven: [
                        {
                          name: '',
                          listOfRegionEight: [
                            {
                              name: ''
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        });
    } else if (type === 'regionFour') {
      this.setState({
        totalHeight: 46
      });
      listOfRegionOne[index] &&
        listOfRegionOne[index].listOfRegionTwo[regionTwo].listOfRegionThree[
          regionThree
        ].listOfRegionFour.push({
          name: '',
          listOfRegionFive: [
            {
              name: '',
              listOfRegionSix: [
                {
                  name: '',
                  listOfRegionSeven: [
                    {
                      name: '',
                      listOfRegionEight: [
                        {
                          name: ''
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        });
    } else if (type === 'regionFive') {
      this.setState({
        totalHeight: 46
      });
      listOfRegionOne[index] &&
        listOfRegionOne[index].listOfRegionTwo[regionTwo].listOfRegionThree[
          regionThree
        ].listOfRegionFour[regionFour].listOfRegionFive.push({
          name: '',
          listOfRegionSix: [
            {
              name: '',
              listOfRegionSeven: [
                {
                  name: '',
                  listOfRegionEight: [
                    {
                      name: ''
                    }
                  ]
                }
              ]
            }
          ]
        });
    } else if (type === 'regionSix') {
      this.setState({
        totalHeight: 46
      });
      listOfRegionOne[index] &&
        listOfRegionOne[index].listOfRegionTwo[regionTwo].listOfRegionThree[
          regionThree
        ].listOfRegionFour[regionFour].listOfRegionFive[
          regionFive
        ].listOfRegionSix.push({
          name: '',
          listOfRegionSeven: [
            {
              name: '',
              listOfRegionEight: [
                {
                  name: ''
                }
              ]
            }
          ]
        });
    } else if (type === 'regionSeven') {
      this.setState({
        totalHeight: 46
      });
      listOfRegionOne[index] &&
        listOfRegionOne[index].listOfRegionTwo[regionTwo].listOfRegionThree[
          regionThree
        ].listOfRegionFour[regionFour].listOfRegionFive[
          regionFive
        ].listOfRegionSix[regionSix].listOfRegionSeven.push({
          name: '',
          listOfRegionEight: [
            {
              name: ''
            }
          ]
        });
    } else if (type === 'regionEight') {
      listOfRegionOne[index] &&
        listOfRegionOne[index].listOfRegionTwo[regionTwo].listOfRegionThree[
          regionThree
        ].listOfRegionFour[regionFour].listOfRegionFive[
          regionFive
        ].listOfRegionSix[regionSix].listOfRegionSeven[
          regionSeven
        ].listOfRegionEight.push({
          name: ''
        });

      let len =
        listOfRegionOne[index].listOfRegionTwo[regionTwo].listOfRegionThree
          .length - 1;
      if (
        regionThree === 0 &&
        listOfRegionOne[index].listOfRegionTwo[regionTwo].listOfRegionThree
          .length === 1
      ) {
        this.setState({
          totalHeight: totalHeight - 25
        });
      } else if (len == regionThree) {
        console.log('else if 11');
        this.setState({
          totalHeight: totalHeight - 25
        });
      } else if (
        listOfRegionOne[index].listOfRegionTwo[regionTwo].listOfRegionThree[
          regionThree
        ].listOfRegionFour.length === 1
      ) {
        console.log('else if 22');
        this.setState({
          totalHeight: totalHeight - 25
        });
      } else {
        console.log('else');
        this.setState({
          totalHeight: 46
        });
      }
    }
    this.setState({
      listOfRegionOne: listOfRegionOne
    });
  };

  render() {
    let totalHeight = this.state.totalHeight ? this.state.totalHeight : 46;
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
                        Spending Categories
                      </Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                ) : (
                  ''
                )}

                <div className="text-center m-b-15">
                  <h4 className="hero-title">Geographical</h4>
                </div>

                <div className="f-table geographicalwrapper">
                  <div className="f-row">
                    <div className="th-f">global regions</div>
                    <div className="th-f">global sub regions</div>
                    <div className="th-f">countries</div>
                    <div className="th-f">zone/plant</div>
                    <div className="th-f">Business units/local regions</div>
                    <div className="th-f">Districts</div>
                    <div className="th-f">circle</div>
                    <div className="th-f">area</div>
                    <div className="th-f">{''}</div>
                  </div>
                  <div className="f-tbody">
                    <div className="fullwidth">
                      {this.state.listOfRegionOne &&
                        this.state.listOfRegionOne.map(
                          (elemRegionOne, index) => {
                            return [
                              <div className="structree flex">
                                <ul>
                                  <li class="strucroot">
                                    <FormGroup
                                      controlId="formBasicText"
                                      className="mb-0"
                                    >
                                      <FormControl
                                        type="text"
                                        placeholder="Major Category"
                                        className="br-0 w125"
                                        name="name"
                                        value={elemRegionOne.name}
                                        onChange={this.handleChange(
                                          index,
                                          'regionOne'
                                        )}
                                      />
                                    </FormGroup>

                                    <ul className="categoryWrapper">
                                      {elemRegionOne.listOfRegionTwo &&
                                        elemRegionOne.listOfRegionTwo.map(
                                          (
                                            elemRegionTwo,
                                            elemRegionTwoIndex
                                          ) => {
                                            let regionOneLen =
                                              elemRegionOne.listOfRegionTwo
                                                .length;
                                            return [
                                              <li
                                                className={
                                                  regionOneLen ===
                                                  elemRegionTwoIndex + 1
                                                    ? 'linehidden categoryblock'
                                                    : 'categoryblock'
                                                }
                                                ref={
                                                  regionOneLen ===
                                                  elemRegionTwoIndex + 1
                                                    ? elem =>
                                                        (this.Line1 = elem)
                                                    : ''
                                                }
                                              >
                                            <div className="inputCrossIcon">
                                                <FormGroup
                                                  controlId="formBasicText"
                                                  className="mb-0 catin"
                                                >
                                                  <FormControl
                                                    type="text"
                                                    placeholder="Category"
                                                    className="br-0 w125"
                                                    name="name"
                                                    value={elemRegionTwo.name}
                                                    onChange={this.handleChange(
                                                      index,
                                                      'regionTwo',
                                                      elemRegionTwoIndex
                                                    )}
                                                  />


                                                  {elemRegionOne.listOfRegionTwo
                                                    .length >
                                                  1 ? (
                                                    <span
                                                      className="crossupBtn"
                                                      onClick={e => {
                                                        this.deleteConfirmation(
                                                          e,
                                                          index,
                                                          elemRegionTwo.id,
                                                          'regionTwo',
                                                          elemRegionTwoIndex
                                                        );
                                                      }}
                                                    >
                                                      <span className="ico-add">
                                                        <svg>
                                                          <use
                                                            xlinkHref={`${Sprite}#crossIco`}
                                                          />
                                                        </svg>
                                                      </span>
                                                    </span>
                                                  ) : (
                                                    ''
                                                  )}
                                                </FormGroup>
                                               </div>  
                                                <ul className="categorysubblock">
                                                  {elemRegionTwo.listOfRegionThree &&
                                                    elemRegionTwo.listOfRegionThree.map(
                                                      (
                                                        elemRegionThree,
                                                        elemRegionThreeIndex
                                                      ) => {
                                                        let regionThreeLen =
                                                          elemRegionTwo
                                                            .listOfRegionThree
                                                            .length;
                                                        return [
                                                          <li
                                                            className={
                                                              regionThreeLen ===
                                                              elemRegionThreeIndex +
                                                                1
                                                                ? 'linehidden'
                                                                : ''
                                                            }
                                                            ref={
                                                              regionThreeLen ===
                                                              elemRegionThreeIndex +
                                                                1
                                                                ? elem =>
                                                                    (this.Line1 = elem)
                                                                : ''
                                                            }
                                                          >
                                                         <div className="inputCrossIcon">
                                                              <FormGroup
                                                                controlId="formBasicText"
                                                                className="mb-0"
                                                              >
                                                                <FormControl
                                                                  type="text"
                                                                  placeholder="Sub Category"
                                                                  className="br-0 w125"
                                                                  name="name"
                                                                  value={
                                                                    elemRegionThree.name
                                                                  }
                                                                  onChange={this.handleChange(
                                                                    index,
                                                                    'regionThree',
                                                                    elemRegionTwoIndex,
                                                                    elemRegionThreeIndex
                                                                  )}
                                                                />

                                                                {elemRegionTwo
                                                                  .listOfRegionThree
                                                                  .length >
                                                                1 ? (
                                                                  <span
                                                                    className="crossupBtn"
                                                                    onClick={e => {
                                                                      this.deleteConfirmation(
                                                                        e,
                                                                        index,
                                                                        elemRegionThree.id,
                                                                        'SUB_CATEGORY',
                                                                        elemRegionTwoIndex,
                                                                        elemRegionThreeIndex
                                                                      );
                                                                    }}
                                                                  >
                                                                    <span className="ico-add">
                                                                      <svg>
                                                                        <use
                                                                          xlinkHref={`${Sprite}#crossIco`}
                                                                        />
                                                                      </svg>
                                                                    </span>
                                                                  </span>
                                                                ) : (
                                                                  ''
                                                                )}
                                                              </FormGroup>
                                                            </div>
                                                            <ul className="categorysubblock">
                                                              {elemRegionThree.listOfRegionFour &&
                                                                elemRegionThree.listOfRegionFour.map(
                                                                  (
                                                                    elemRegionFour,
                                                                    elemRegionFourIndex
                                                                  ) => {
                                                                    let regionFourLen =
                                                                      elemRegionThree
                                                                        .listOfRegionFour
                                                                        .length;
                                                                    return [
                                                                      <li
                                                                        className={
                                                                          regionFourLen ===
                                                                          elemRegionFourIndex +
                                                                            1
                                                                            ? 'linehidden'
                                                                            : ''
                                                                        }
                                                                        ref={
                                                                          regionFourLen ===
                                                                          elemRegionFourIndex +
                                                                            1
                                                                            ? elem =>
                                                                                (this.Line1 = elem)
                                                                            : ''
                                                                        }
                                                                      >
                                                                        <div className="inputCrossIcon">
                                                                          <FormGroup
                                                                            controlId="formBasicText"
                                                                            className="mb-0"
                                                                          >
                                                                            <FormControl
                                                                              type="text"
                                                                              placeholder="Sub Sub Category"
                                                                              className="br-0 w125"
                                                                              name="name"
                                                                              value={
                                                                                elemRegionFour.name
                                                                              }
                                                                              onChange={this.handleChange(
                                                                                index,
                                                                                'regionFour',
                                                                                elemRegionTwoIndex,
                                                                                elemRegionThreeIndex,
                                                                                elemRegionFourIndex
                                                                              )}
                                                                            />
                                                                            {elemRegionThree
                                                                              .listOfRegionFour
                                                                              .length >
                                                                            1 ? (
                                                                              <span
                                                                                className="crossupBtn"
                                                                                onClick={e => {
                                                                                  this.deleteConfirmation(
                                                                                    e,
                                                                                    index,
                                                                                    elemRegionFour.id,
                                                                                    'regionFive',
                                                                                    elemRegionTwoIndex,
                                                                                    elemRegionThreeIndex,
                                                                                    elemRegionFourIndex
                                                                                  );
                                                                                }}
                                                                              >
                                                                                <span className="ico-add">
                                                                                  <svg>
                                                                                    <use
                                                                                      xlinkHref={`${Sprite}#crossIco`}
                                                                                    />
                                                                                  </svg>
                                                                                </span>
                                                                              </span>
                                                                            ) : (
                                                                              ''
                                                                            )}
                                                                          </FormGroup>
                                                                        </div>
                                                                        <ul class="categorysubblock">
                                                                          {elemRegionFour.listOfRegionFive &&
                                                                            elemRegionFour.listOfRegionFive.map(
                                                                              (
                                                                                elemRegionFive,
                                                                                elemRegionFiveIndex
                                                                              ) => {
                                                                                let regionFiveLen =
                                                                                  elemRegionFour
                                                                                    .listOfRegionFive
                                                                                    .length;
                                                                                return [
                                                                                  <li
                                                                                    className={
                                                                                      regionFiveLen ===
                                                                                      elemRegionFiveIndex +
                                                                                        1
                                                                                        ? 'linehidden'
                                                                                        : ''
                                                                                    }
                                                                                    ref={
                                                                                      regionFiveLen ===
                                                                                      elemRegionFiveIndex +
                                                                                        1
                                                                                        ? elem =>
                                                                                            (this.Line1 = elem)
                                                                                        : ''
                                                                                    }
                                                                                  >
                                                                                    <div className="inputCrossIcon">
                                                                                        <FormGroup
                                                                                          controlId="formBasicText"
                                                                                          className="mb-0"
                                                                                        >
                                                                                          <FormControl
                                                                                            type="text"
                                                                                            placeholder="Sub Sub Category"
                                                                                            className="br-0 w125"
                                                                                            name="name"
                                                                                            value={
                                                                                              elemRegionFour.name
                                                                                            }
                                                                                            onChange={this.handleChange(
                                                                                              index,
                                                                                              'regionFour',
                                                                                              elemRegionTwoIndex,
                                                                                              elemRegionThreeIndex,
                                                                                              elemRegionFourIndex,
                                                                                              elemRegionFiveIndex
                                                                                            )}
                                                                                          />

                                                                                          {/* {elemSubCategory
                                                                                            .listOfRegionFour
                                                                                            .length >
                                                                                          1 ? (
                                                                                            <span
                                                                                              style={{
                                                                                                marginLeft:
                                                                                                  '-46px'
                                                                                              }}
                                                                                              onClick={e => {
                                                                                                this.deleteConfirmation(
                                                                                                  e,
                                                                                                  index,
                                                                                                  elemSubSubCategory.id,
                                                                                                  'SUB_SUB_CATEGORY',
                                                                                                  elemCategoryIndex,
                                                                                                  elemSubCategoryIndex,
                                                                                                  elemSubSubCategoryIndex
                                                                                                );
                                                                                              }}
                                                                                              className="	glyphicon glyphicon-minus-sign"
                                                                                            />
                                                                                          ) : (
                                                                                            ''
                                                                                          )} */}
                                                                                          {elemRegionFive
                                                                                            .listOfRegionSix
                                                                                            .length >
                                                                                          1 ? (
                                                                                            <span
                                                                                              className="crossupBtn"
                                                                                              onClick={e => {
                                                                                                this.deleteConfirmation(
                                                                                                  e,
                                                                                                  index,
                                                                                                  elemRegionFive.id,
                                                                                                  'regionFive',
                                                                                                  elemRegionTwoIndex,
                                                                                                  elemRegionThreeIndex,
                                                                                                  elemRegionFourIndex,
                                                                                                  elemRegionFiveIndex
                                                                                                );
                                                                                              }}
                                                                                            >
                                                                                              <span className="ico-add">
                                                                                                <svg>
                                                                                                  <use
                                                                                                    xlinkHref={`${Sprite}#crossIco`}
                                                                                                  />
                                                                                                </svg>
                                                                                              </span>
                                                                                            </span>
                                                                                          ) : (
                                                                                            ''
                                                                                          )}
                                                                                        </FormGroup>
                                                                                      </div>
                                                                                 
                                                                                    <ul class="categorysubblock">
                                                                                      {elemRegionFive.listOfRegionSix &&
                                                                                        elemRegionFive.listOfRegionSix.map(
                                                                                          (
                                                                                            elemRegionSix,
                                                                                            elemRegionSixIndex
                                                                                          ) => {
                                                                                            let regionSixLen =
                                                                                              elemRegionFive
                                                                                                .listOfRegionSix
                                                                                                .length;
                                                                                            return [
                                                                                              <li
                                                                                                className={
                                                                                                  regionSixLen ===
                                                                                                  elemRegionSixIndex +
                                                                                                    1
                                                                                                    ? 'linehidden'
                                                                                                    : ''
                                                                                                }
                                                                                                ref={
                                                                                                  regionSixLen ===
                                                                                                  elemRegionSixIndex +
                                                                                                    1
                                                                                                    ? elem =>
                                                                                                        (this.Line1 = elem)
                                                                                                    : ''
                                                                                                }
                                                                                              >
                                                                                                <div className="inputCrossIcon">
                                                                                                    <FormGroup
                                                                                                      controlId="formBasicText"
                                                                                                      className="mb-0"
                                                                                                    >
                                                                                                      <FormControl
                                                                                                        type="text"
                                                                                                        placeholder="Sub Sub Category"
                                                                                                        className="br-0 w125"
                                                                                                        name="name"
                                                                                                        value={
                                                                                                          elemRegionSix.name
                                                                                                        }
                                                                                                        onChange={this.handleChange(
                                                                                                          index,
                                                                                                          'regionFour',
                                                                                                          elemRegionTwoIndex,
                                                                                                          elemRegionThreeIndex,
                                                                                                          elemRegionFourIndex,
                                                                                                          elemRegionFiveIndex,
                                                                                                          elemRegionSixIndex
                                                                                                        )}
                                                                                                      />
                                                                                                      {elemRegionFive
                                                                                                        .listOfRegionSix
                                                                                                        .length >
                                                                                                      1 ? (
                                                                                                        <span
                                                                                                          className="crossupBtn"
                                                                                                          onClick={e => {
                                                                                                            this.deleteConfirmation(
                                                                                                              e,
                                                                                                              index,
                                                                                                              elemRegionSix.id,
                                                                                                              'regionFive',
                                                                                                              elemRegionTwoIndex,
                                                                                                              elemRegionThreeIndex,
                                                                                                              elemRegionFourIndex,
                                                                                                              elemRegionFiveIndex,
                                                                                                              elemRegionSixIndex
                                                                                                            );
                                                                                                          }}
                                                                                                        >
                                                                                                          <span className="ico-add">
                                                                                                            <svg>
                                                                                                              <use
                                                                                                                xlinkHref={`${Sprite}#crossIco`}
                                                                                                              />
                                                                                                            </svg>
                                                                                                          </span>
                                                                                                        </span>
                                                                                                      ) : (
                                                                                                        ''
                                                                                                      )}
                                                                                                    </FormGroup>
                                                                                                  </div>
                                                                                   
                                                                                                <ul class="categorysubblock">
                                                                                                  {elemRegionSix.listOfRegionSeven &&
                                                                                                    elemRegionSix.listOfRegionSeven.map(
                                                                                                      (
                                                                                                        elemRegionSeven,
                                                                                                        elemRegionSevenIndex
                                                                                                      ) => {
                                                                                                        let regionSevenLen =
                                                                                                        elemRegionSix
                                                                                                          .listOfRegionSeven
                                                                                                          .length;
                                                                                                      return [
                                                                                                        <li
                                                                                                          className={
                                                                                                            regionSevenLen ===
                                                                                                            elemRegionSevenIndex +
                                                                                                              1
                                                                                                              ? 'linehidden'
                                                                                                              : ''
                                                                                                          }
                                                                                                          ref={
                                                                                                            regionSevenLen ===
                                                                                                            elemRegionSevenIndex +
                                                                                                              1
                                                                                                              ? elem =>
                                                                                                                  (this.Line1 = elem)
                                                                                                              : ''
                                                                                                          }
                                                                                                        >
                                                                                                           
                                                                                                           <div className="inputCrossIcon">
                                                                                                                <FormGroup
                                                                                                                  controlId="formBasicText"
                                                                                                                  className="mb-0"
                                                                                                                >
                                                                                                                  <FormControl
                                                                                                                    type="text"
                                                                                                                    placeholder="Sub Sub Category"
                                                                                                                    className="br-0 w125"
                                                                                                                    name="name"
                                                                                                                    value={
                                                                                                                      elemRegionSeven.name
                                                                                                                    }
                                                                                                                    onChange={this.handleChange(
                                                                                                                      index,
                                                                                                                      'regionSix',
                                                                                                                      elemRegionTwoIndex,
                                                                                                                      elemRegionThreeIndex,
                                                                                                                      elemRegionFourIndex,
                                                                                                                      elemRegionFiveIndex,
                                                                                                                      elemRegionSixIndex,
                                                                                                                      elemRegionSevenIndex
                                                                                                                    )}
                                                                                                                  />
                                                                                                                  {elemRegionSeven
                                                                                                                    .listOfRegionEight
                                                                                                                    .length >
                                                                                                                  1 ? (
                                                                                                                    <span
                                                                                                                      className="crossupBtn"
                                                                                                                      onClick={e => {
                                                                                                                        this.deleteConfirmation(
                                                                                                                          e,
                                                                                                                          index,
                                                                                                                          elemRegionSix.id,
                                                                                                                          'regionSeven',
                                                                                                                          elemRegionTwoIndex,
                                                                                                                          elemRegionThreeIndex,
                                                                                                                          elemRegionFourIndex,
                                                                                                                          elemRegionFiveIndex,
                                                                                                                          elemRegionSixIndex,
                                                                                                                          elemRegionSevenIndex
                                                                                                                        );
                                                                                                                      }}
                                                                                                                    >
                                                                                                                      <span className="ico-add">
                                                                                                                        <svg>
                                                                                                                          <use
                                                                                                                            xlinkHref={`${Sprite}#crossIco`}
                                                                                                                          />
                                                                                                                        </svg>
                                                                                                                      </span>
                                                                                                                    </span>
                                                                                                                  ) : (
                                                                                                                    ''
                                                                                                                  )}
                                                                                                                </FormGroup>
                                                                                                              </div>
                                                                                                      
                                                                                                            <ul class="subsubcat">
                                                                                                              {elemRegionSeven.listOfRegionEight &&
                                                                                                                elemRegionSeven.listOfRegionEight.map(
                                                                                                                  (
                                                                                                                    elemRegionEight,
                                                                                                                    elemRegionEightIndex
                                                                                                                  ) => {
                                                                                                                   
                                                                                                                  return [
                                                                                                                    <li>
                                                                                                                      <div className="inputCrossIcon">
                                                                                                                            <FormGroup
                                                                                                                              controlId="formBasicText"
                                                                                                                              className="mb-0"
                                                                                                                            >
                                                                                                                              <FormControl
                                                                                                                                type="text"
                                                                                                                                placeholder="Sub Sub Category"
                                                                                                                                className="br-0 w125"
                                                                                                                                name="name"
                                                                                                                                value={
                                                                                                                                  elemRegionEight.name
                                                                                                                                }
                                                                                                                                onChange={this.handleChange(
                                                                                                                                  index,
                                                                                                                                  'regionEight',
                                                                                                                                  elemRegionTwoIndex,
                                                                                                                                  elemRegionThreeIndex,
                                                                                                                                  elemRegionFourIndex,
                                                                                                                                  elemRegionFiveIndex,
                                                                                                                                  elemRegionSixIndex,
                                                                                                                                  elemRegionSevenIndex,
                                                                                                                                  elemRegionEightIndex
                                                                                                                                )}
                                                                                                                              />
                                                                                                                            </FormGroup>
                                                                                                                            {elemRegionSeven.listOfRegionEight
                                                                                                                       .length >
                                                                                                                  1 ? (
                                                                                                                    <span
                                                                                                                      className="crossupBtn"
                                                                                                                      onClick={e => {
                                                                                                                        this.deleteConfirmation(
                                                                                                                          e,
                                                                                                                          index,
                                                                                                                          elemRegionSix.id,
                                                                                                                          'regionEight',
                                                                                                                          elemRegionTwoIndex,
                                                                                                                          elemRegionThreeIndex,
                                                                                                                          elemRegionFourIndex,
                                                                                                                          elemRegionFiveIndex,
                                                                                                                          elemRegionSixIndex,
                                                                                                                          elemRegionSevenIndex
                                                                                                                        );
                                                                                                                      }}
                                                                                                                    >
                                                                                                                      <span className="ico-add">
                                                                                                                        <svg>
                                                                                                                          <use
                                                                                                                            xlinkHref={`${Sprite}#crossIco`}
                                                                                                                          />
                                                                                                                        </svg>
                                                                                                                      </span>
                                                                                                                    </span>
                                                                                                                  ) : (
                                                                                                                    ''
                                                                                                                  )}


                                                                                                                          </div>
                                                                                                                
                                                                                                                      </li>
                                                                                                                    ];
                                                                                                                  }
                                                                                                                )}
                                                                                                              <li className="addMore addlast">
                                                                                                                <span
                                                                                                                  className="blue-add flex"
                                                                                                                  onClick={event => {
                                                                                                                    this.handleAddTree(
                                                                                                                      event,
                                                                                                                      index,
                                                                                                                      'regionEight',
                                                                                                                      elemRegionTwoIndex,
                                                                                                                      elemRegionThreeIndex,
                                                                                                                      elemRegionFourIndex,
                                                                                                                      elemRegionFiveIndex,
                                                                                                                      elemRegionSixIndex,
                                                                                                                      elemRegionSevenIndex
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
                                                                                                                  <span className="b-t-t cursor-pointer">
                                                                                                                    Add More
                                                                                                                  </span>
                                                                                                                </span>
                                                                                                              </li>
                                                                                                            </ul>
                                                                                                          </li>
                                                                                                        ];
                                                                                                      }
                                                                                                    )}
                                                                                                  <li className="addMore addmoretop">
                                                                                                    <span
                                                                                                      className="blue-add flex"
                                                                                                      onClick={event => {
                                                                                                        this.handleAddTree(
                                                                                                          event,
                                                                                                          index,
                                                                                                          'regionSeven',
                                                                                                          elemRegionTwoIndex,
                                                                                                          elemRegionThreeIndex,
                                                                                                          elemRegionFourIndex,
                                                                                                          elemRegionFiveIndex,
                                                                                                          elemRegionSixIndex
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
                                                                                                      <span className="b-t-t cursor-pointer">
                                                                                                        Add More
                                                                                                      </span>
                                                                                                    </span>
                                                                                                  </li>
                                                                                                </ul>
                                                                                              </li>
                                                                                            ];
                                                                                          }
                                                                                        )}
                                                                                      <li className="addMore addmoretop">
                                                                                        <span
                                                                                          className="blue-add flex"
                                                                                          onClick={event => {
                                                                                            this.handleAddTree(
                                                                                              event,
                                                                                              index,
                                                                                              'regionSix',
                                                                                              elemRegionTwoIndex,
                                                                                              elemRegionThreeIndex,
                                                                                              elemRegionFourIndex,
                                                                                              elemRegionFiveIndex
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
                                                                                          <span className="b-t-t cursor-pointer">
                                                                                            Add More
                                                                                          </span>
                                                                                        </span>
                                                                                      </li>
                                                                                    </ul>
                                                                                  </li>
                                                                                ];
                                                                              }
                                                                            )}
                                                                          <li className="addMore addmoretop">
                                                                            <span
                                                                              className="blue-add flex"
                                                                              onClick={event => {
                                                                                this.handleAddTree(
                                                                                  event,
                                                                                  index,
                                                                                  'regionFive',
                                                                                  elemRegionTwoIndex,
                                                                                  elemRegionThreeIndex,
                                                                                  elemRegionFourIndex
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
                                                                              <span className="b-t-t cursor-pointer">
                                                                              Add More
                                                                              </span>
                                                                            </span>
                                                                          </li>
                                                                        </ul>
                                                                      </li>
                                                                    ];
                                                                  }
                                                                )}
                                                              <li className="addMore addmoretop">
                                                                <span
                                                                  className="blue-add flex"
                                                                  onClick={event => {
                                                                    this.handleAddTree(
                                                                      event,
                                                                      index,
                                                                      'regionFour',
                                                                      elemRegionTwoIndex,
                                                                      elemRegionThreeIndex
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
                                                                  <span className="b-t-t cursor-pointer">
                                                                  Add More
                                                                  </span>
                                                                </span>
                                                              </li>
                                                            </ul>
                                                          </li>
                                                        ];
                                                      }
                                                    )}
                                                  <li
                                                    className="addMore addmoretop"
                                                    style={{
                                                      bottom: totalHeight
                                                    }}
                                                  >
                                                    <span
                                                      className="blue-add flex"
                                                      onClick={event => {
                                                        this.handleAddTree(
                                                          event,
                                                          index,
                                                          'regionThree',
                                                          elemRegionTwoIndex
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
                                                      <span className="b-t-t cursor-pointer">
                                                        Add More
                                                      </span>
                                                    </span>
                                                  </li>
                                                </ul>
                                              </li>
                                            ];
                                          }
                                        )}
                                      <li
                                        className="addMore addmoretop"
                                        onClick={event => {
                                          this.handleAddTree(
                                            event,
                                            index,
                                            'regionTwo'
                                          );
                                        }}
                                      >
                                        <span className="blue-add flex">
                                          <span className="ico-add">
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#plus-OIco`}
                                              />
                                            </svg>
                                          </span>
                                          <span className="b-t-t cursor-pointer">
                                            Add More
                                          </span>
                                        </span>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                                <div>
                                  <button
                                    className="btn btn-task"
                                    onClick={e => {
                                      this.deleteConfirmation(
                                        e,
                                        index,
                                        elemRegionOne.id,
                                        'MAJOR_CATEGORY'
                                      );
                                    }}
                                  >
                                    <span className="ico-action ">
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#deleteIco`}
                                        />
                                      </svg>
                                    </span>
                                    <span className="ico-txt">Delete</span>
                                  </button>
                                </div>
                              </div>
                            ];
                          }
                        )}
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

                <div className="">
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
                    disabled={
                      this.state.listOfRegionOne &&
                      this.state.listOfRegionOne.length > 0
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
                        this.handleRemove(
                          event,
                          this.state.currentDeletedIndex,
                          this.state.currentDeletedId,
                          this.state.type,
                          this.state.categoryIndex,
                          this.state.subCategoryIndex,
                          this.state.subSubCategoryIndex
                        )
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
      actionSaveSpendingCategory,
      actionGetSpendingCategory,
      actionDeleteSpendingCategory
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
)(spendingCategory);
