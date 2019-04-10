import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormControl, FormGroup, Modal, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sprite from '../../img/sprite.svg';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionSaveProductCost,
  actionGetProductCost,
  actionDeleteProductCost,
  actionGetProjectListForIndirectPurchase,
  actionGetModelFamily,
  actionGetProductData
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
      listOfSectorCategory: [
        {
          name: '',
          listOfProductLineCategory: [
            {
              name: '',
              id: '',
              listOfModelFamilyCategory: [
                {
                  name: '',
                  id: '',
                  listOfProgramCategory: [{ id: '', name: '' }]
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
      .actionGetProductCost(data)
      .then((result, error) => {
        let resourceData = result.payload.data.resourceData;

        let resourceDataList =
          resourceData.length > 0
            ? resourceData
            : this.state.listOfSectorCategory;

        resourceData.forEach(function(item, index) {
          if (
            item.listOfProductLineCategory &&
            item.listOfProductLineCategory.length > 0
          ) {
            item.listOfProductLineCategory.forEach(function(subitem, catIndex) {
              if (
                subitem.listOfModelFamilyCategory &&
                subitem.listOfModelFamilyCategory.length > 0
              ) {
                subitem.listOfModelFamilyCategory.forEach(function(
                  subsubitem,
                  subIndex
                ) {
                  if (
                    subsubitem.listOfProgramCategory &&
                    subsubitem.listOfProgramCategory.length > 0
                  ) {
                  } else {
                    resourceData[index].listOfProductLineCategory[
                      catIndex
                    ].listOfModelFamilyCategory[
                      subIndex
                    ].listOfProgramCategory = [];
                    resourceData[index].listOfProductLineCategory[
                      catIndex
                    ].listOfModelFamilyCategory[
                      subIndex
                    ].listOfProgramCategory.push({
                      name: ''
                    });
                  }
                });
              } else {
                resourceData[index].listOfProductLineCategory[
                  catIndex
                ].listOfModelFamilyCategory = [];
                resourceData[index].listOfProductLineCategory[
                  catIndex
                ].listOfModelFamilyCategory.push({
                  name: '',
                  listOfProgramCategory: [
                    {
                      name: ''
                    }
                  ]
                });
              }
            });
          } else {
            resourceData[index].listOfProductLineCategory = [];
            resourceData[index].listOfProductLineCategory.push({
              name: '',
              listOfModelFamilyCategory: [
                {
                  name: '',
                  listOfProgramCategory: [
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
          listOfSectorCategory: resourceDataList
        });

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    this.props
      .actionGetProductData(data)
      .then((result, error) => {
        console.log('result----', result);
        let listOfProductLine = result.payload.data.resourceData;

        this.setState({
          listOfProductLine: listOfProductLine
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    this.props.actionLoaderShow();
    this.props
      .actionGetProjectListForIndirectPurchase(data)
      .then((result, error) => {
        console.log('result----', result);
        let listOfProduct = result.payload.data.resourceData;
        this.setState({
          listOfProduct: listOfProduct
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleGetModelFamily(productLineId, index, catIndex) {
    let _this = this;
    let dataRegion = {
      productLineId: productLineId
    };

    this.props
      .actionGetModelFamily(dataRegion)
      .then((result, error) => {
        let listOfModelFamily = result.payload.data.resourceData;

        let listOfSectorCategoryData = this.state.listOfSectorCategory;
        let geographicaListJson = listOfSectorCategoryData[index];
        geographicaListJson['listOfProductLineCategory'][catIndex][
          'listOfModelFamily'
        ] = listOfModelFamily;

        listOfSectorCategoryData[index] = geographicaListJson;
        this.setState({ listOfSectorCategory: listOfSectorCategoryData });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleChange = (index, type, catIndex, subIndex, subsubIndex) => event => {
    let value = event.target.value;
    const { name } = event.target;
    const { options, selectedIndex } = event.target;
    const selected = event.target.checked;
    const textValue =
      options && options[selectedIndex].getAttribute('data-text');
    const keyIndex = options && options[selectedIndex].getAttribute('data-key');

    let listOfSectorCategoryData = this.state.listOfSectorCategory;
    let geographicaListJson = listOfSectorCategoryData[index];

    if (type === 'SECTOR_CATEGORY') {
      if (value) value = value.replace(/[&\/\\#^`!@+()$~%=.'":*?<>{}]/g, '');
      else value = value;
      geographicaListJson[name] = value;
    } else if (type === 'PRODUCT_LINE_CATEGORY') {
      //  geographicaListJson['listOfProductLineCategory'][catIndex]['id'] = '';
      geographicaListJson['listOfProductLineCategory'][catIndex][name] = value;
      this.handleGetModelFamily(value, index, catIndex);
    } else if (type === 'MODEL_FAMILY_CATEGORY') {
      geographicaListJson['listOfProductLineCategory'][catIndex][
        'listOfModelFamilyCategory'
      ][subIndex][name] = value;

      geographicaListJson['listOfProductLineCategory'][catIndex][
        'listOfModelFamilyCategory'
      ][subIndex]['disabled'] = 1;
    } else if (type === 'PROGRAM_CATEGORY') {
      geographicaListJson['listOfProductLineCategory'][catIndex][
        'listOfModelFamilyCategory'
      ][subIndex]['listOfProgramCategory'][subsubIndex][name] = value;
    }

    listOfSectorCategoryData[index] = geographicaListJson;
    this.setState({ listOfSectorCategory: listOfSectorCategoryData });
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
    let listOfSectorCategoryDataArray = [];
    let listOfSectorCategoryData = this.state.listOfSectorCategory;

    listOfSectorCategoryData.forEach(function(item, index) {
      if (item.name === '') {
        errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
        flag = false;
      }
      let listOfRequest = [];
      item.listOfProductLineCategory.forEach(function(categoryItem, subIndex) {
        if (categoryItem.productLineId === '') {
          errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
          flag = false;
        }
        categoryItem.listOfModelFamilyCategory.forEach(function(
          subcategoryItem,
          subIndex
        ) {
          if (subcategoryItem.modelFamilyId === '') {
            errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
            flag = false;
          }
          subcategoryItem.listOfProgramCategory.forEach(function(
            subsubcategoryItem,
            subIndex
          ) {
            if (subsubcategoryItem.programId === '') {
              errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
              flag = false;
            }
          });
        });
      });
    });

    if (flag) {
      let data = {
        roleId: _this.props.userInfo.userData.userRole,
        userId: _this.props.userInfo.userData.id,
        listOfSectorCategory: listOfSectorCategoryData
      };

      this.props
        .actionSaveProductCost(data)
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
      listOfSectorCategory: this.state.listOfSectorCategory.concat([
        {
          name: '',
          listOfProductLineCategory: [
            {
              name: '',
              listOfModelFamilyCategory: [
                {
                  name: '',
                  listOfProgramCategory: [
                    {
                      name: ''
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
    let listOfSectorCategory = this.state.listOfSectorCategory;

    if (type === 'SECTOR_CATEGORY') {
      listOfSectorCategory.splice(index, 1);
    } else if (type === 'PRODUCT_LINE_CATEGORY') {
      listOfSectorCategory[index].listOfProductLineCategory.splice(
        categoryIndex,
        1
      );
    } else if (type === 'MODEL_FAMILY_CATEGORY') {
      listOfSectorCategory[index].listOfProductLineCategory[
        categoryIndex
      ].listOfModelFamilyCategory.splice(subCategoryIndex, 1);
    } else if (type === 'PROGRAM_CATEGORY') {
      listOfSectorCategory[index].listOfProductLineCategory[
        categoryIndex
      ].listOfModelFamilyCategory[
        subCategoryIndex
      ].listOfProgramCategory.splice(subSubCategoryIndex, 1);
    }

    this.setState({
      listOfSectorCategory: listOfSectorCategory
    });

    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      id: id,
      classificationType: type
    };

    this.props
      .actionDeleteProductCost(data)
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
    return this.Line1.clientHeight;
  }
  handleAddTree = (e, index, type, catIndex, subIndex, subsubIndex) => {
    var listOfSectorCategory = this.state.listOfSectorCategory;
    let totalHeight = this.calcHeight();
    if (type === 'SECTOR_CATEGORY') {
      this.setState({
        totalHeight: 46
      });
      listOfSectorCategory[index] &&
        listOfSectorCategory[index].listOfProductLineCategory.push({
          name: '',
          listOfModelFamilyCategory: [
            {
              name: '',
              listOfProgramCategory: [
                {
                  name: ''
                }
              ]
            }
          ]
        });
    } else if (type === 'PRODUCT_LINE_CATEGORY') {
      this.setState({
        totalHeight: 46
      });
      listOfSectorCategory[index] &&
        listOfSectorCategory[index].listOfProductLineCategory.push({
          name: '',
          listOfModelFamilyCategory: [
            {
              name: '',
              listOfProgramCategory: [
                {
                  name: ''
                }
              ]
            }
          ]
        });
    } else if (type === 'MODEL_FAMILY_CATEGORY') {
      this.setState({
        totalHeight: 46
      });
      listOfSectorCategory[index] &&
        listOfSectorCategory[index].listOfProductLineCategory[
          catIndex
        ].listOfModelFamilyCategory.push({
          name: '',
          listOfProgramCategory: [
            {
              name: ''
            }
          ]
        });
    } else if (type === 'PROGRAM_CATEGORY') {
      listOfSectorCategory[index] &&
        listOfSectorCategory[index].listOfProductLineCategory[
          catIndex
        ].listOfModelFamilyCategory[subIndex].listOfProgramCategory.push({
          name: ''
        });

      let len =
        listOfSectorCategory[index].listOfProductLineCategory[catIndex]
          .listOfModelFamilyCategory.length - 1;

      if (
        subIndex === 0 &&
        listOfSectorCategory[index].listOfProductLineCategory[catIndex]
          .listOfModelFamilyCategory.length === 1
      ) {
        console.log(' if ');
        this.setState({
          totalHeight: totalHeight - 25
        });
      } else if (len == subIndex) {
        console.log('else if 11');
        this.setState({
          totalHeight: totalHeight - 25
        });
      } else if (
        listOfSectorCategory[index].listOfProductLineCategory[catIndex]
          .listOfModelFamilyCategory[subIndex].listOfProgramCategory.length ===
        1
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
      listOfSectorCategory: listOfSectorCategory
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
                        Product Cost Line Center Classifications
                      </Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                ) : (
                  ''
                )}

                <div className="flex  justify-space-between m-b-15">
                  <h4 className="hero-title">
                    Product Cost Line Center Classifications
                  </h4>
                </div>

                <div className="f-table spendingCatwrapper">
                  <div className="f-row">
                    <div className="th-f">Sector</div>
                    <div className="th-f">Product Line</div>
                    <div className="th-f">Model Family</div>
                    <div className="th-f">Program</div>
                    <div className="th-f">{''}</div>
                  </div>
                  <div className="f-tbody">
                    <div className="fullwidth">
                      {this.state.listOfSectorCategory &&
                        this.state.listOfSectorCategory.map((elem, index) => {
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
                                      placeholder="Sector"
                                      className="br-0 w125"
                                      name="name"
                                      value={elem.name}
                                      onChange={this.handleChange(
                                        index,
                                        'SECTOR_CATEGORY'
                                      )}
                                    />
                                  </FormGroup>

                                  <ul className="categoryWrapper">
                                    {elem.listOfProductLineCategory &&
                                      elem.listOfProductLineCategory.map(
                                        (elemCategory, elemCategoryIndex) => {
                                          return [
                                            <li className="categoryblock">
                                              <FormGroup
                                                controlId="formControlsSelect"
                                                className="m-b-0 w-full"
                                              >
                                                <FormControl
                                                  componentClass="select"
                                                  placeholder="select"
                                                  className="s-arrow br-0 w125"
                                                  name="productLineId"
                                                  value={
                                                    elemCategory.productLineId
                                                  }
                                                  onChange={this.handleChange(
                                                    index,
                                                    'PRODUCT_LINE_CATEGORY',
                                                    elemCategoryIndex
                                                  )}
                                                >
                                                  <option value="">
                                                    select
                                                  </option>
                                                  {this.state
                                                    .listOfProductLine &&
                                                    this.state.listOfProductLine.map(
                                                      (item, indexLine) => {
                                                        return (
                                                          <option
                                                            value={item.id}
                                                            key={indexLine}
                                                            data-key={indexLine}
                                                            data-text={
                                                              item.productLineCode
                                                            }
                                                          >
                                                            {
                                                              item.productLineName
                                                            }
                                                          </option>
                                                        );
                                                      }
                                                    )}
                                                </FormControl>
                                                {elem.listOfProductLineCategory
                                                  .length > 1 ? (
                                                  <span
                                                    className="crossup"
                                                    onClick={e => {
                                                      this.deleteConfirmation(
                                                        e,
                                                        index,
                                                        elemCategory.id,
                                                        'PRODUCT_LINE_CATEGORY',
                                                        elemCategoryIndex
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

                                              {/* <FormGroup
                                                controlId="formBasicText"
                                                className="mb-0"
                                              >
                                                <FormControl
                                                  type="text"
                                                  placeholder="Product Line"
                                                  className="br-0 w125"
                                                  name="name"
                                                  value={elemCategory.name}
                                                  onChange={this.handleChange(
                                                    index,
                                                    'PRODUCT_LINE_CATEGORY',
                                                    elemCategoryIndex
                                                  )}
                                                />

                                                <span className="crossup">
                                                  <span className="ico-add">
                                                    <svg>
                                                      <use
                                                        xlinkHref={`${Sprite}#crossIco`}
                                                      />
                                                    </svg>
                                                  </span>
                                                </span>
                                              </FormGroup> */}

                                              <ul className="categorysubblock">
                                                {elemCategory.listOfModelFamilyCategory &&
                                                  elemCategory.listOfModelFamilyCategory.map(
                                                    (
                                                      elemSubCategory,
                                                      elemSubCategoryIndex
                                                    ) => {
                                                      let subCatLen =
                                                        elemCategory
                                                          .listOfModelFamilyCategory
                                                          .length;
                                                      return [
                                                        <li
                                                          className={
                                                            subCatLen ===
                                                            elemSubCategoryIndex +
                                                              1
                                                              ? 'linehidden'
                                                              : ''
                                                          }
                                                          ref={
                                                            subCatLen ===
                                                            elemSubCategoryIndex +
                                                              1
                                                              ? elem =>
                                                                  (this.Line1 = elem)
                                                              : ''
                                                          }
                                                        >
                                                          <span className="subadd">
                                                            <FormGroup
                                                              controlId="formControlsSelect"
                                                              className="m-b-0 w-full"
                                                            >
                                                              <FormControl
                                                                componentClass="select"
                                                                placeholder="select"
                                                                className="s-arrow br-0 w125"
                                                                name="modelFamilyId"
                                                                value={
                                                                  elemSubCategory.modelFamilyId
                                                                }
                                                                onChange={this.handleChange(
                                                                  index,
                                                                  'MODEL_FAMILY_CATEGORY',
                                                                  elemCategoryIndex,
                                                                  elemSubCategoryIndex
                                                                )}
                                                              >
                                                                <option value="">
                                                                  select
                                                                </option>
                                                                {elemCategory.listOfModelFamily &&
                                                                  elemCategory.listOfModelFamily.map(
                                                                    (
                                                                      item,
                                                                      indexPro
                                                                    ) => {
                                                                      return (
                                                                        <option
                                                                          value={
                                                                            item.id
                                                                          }
                                                                          key={
                                                                            indexPro
                                                                          }
                                                                          data-key={
                                                                            indexPro
                                                                          }
                                                                          data-text={
                                                                            item.modelFamilyCode
                                                                          }
                                                                        >
                                                                          {
                                                                            item.modelFamilyName
                                                                          }
                                                                        </option>
                                                                      );
                                                                    }
                                                                  )}
                                                              </FormControl>
                                                              {elemCategory
                                                                .listOfModelFamilyCategory
                                                                .length > 1 ? (
                                                                <span
                                                                  className="crossup1"
                                                                  onClick={e => {
                                                                    this.deleteConfirmation(
                                                                      e,
                                                                      index,
                                                                      elemSubCategory.id,
                                                                      'MODEL_FAMILY_CATEGORY',
                                                                      elemCategoryIndex,
                                                                      elemSubCategoryIndex
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

                                                            {/* <FormGroup
                                                              controlId="formBasicText"
                                                              className="mb-0"
                                                            >
                                                              <FormControl
                                                                type="text"
                                                                placeholder="Model Family"
                                                                className="br-0 w125"
                                                                name="name"
                                                                value={
                                                                  elemSubCategory.name
                                                                }
                                                                onChange={this.handleChange(
                                                                  index,
                                                                  'MODEL_FAMILY_CATEGORY',
                                                                  elemCategoryIndex,
                                                                  elemSubCategoryIndex
                                                                )}
                                                              />
                                                             {elemCategory
                                                                .listOfModelFamilyCategory
                                                                .length > 1 ? (
                                                                <span
                                                                  style={{
                                                                    marginLeft:
                                                                      '-163px'
                                                                  }}
                                                                  onClick={e => {
                                                                    this.deleteConfirmation(
                                                                      e,
                                                                      index,
                                                                      elemSubCategory.id,
                                                                      'MODEL_FAMILY_CATEGORY',
                                                                      elemCategoryIndex,
                                                                      elemSubCategoryIndex
                                                                    );
                                                                  }}
                                                                  className="	glyphicon glyphicon-minus-sign"
                                                                />
                                                              ) : (
                                                                ''
                                                              )} 
                                                              <span className="crossup1">
                                                                <span className="ico-add">
                                                                  <svg>
                                                                    <use
                                                                      xlinkHref={`${Sprite}#crossIco`}
                                                                    />
                                                                  </svg>
                                                                </span>
                                                              </span>
                                                            </FormGroup> */}
                                                          </span>
                                                          <ul className="subsubcat">
                                                            {elemSubCategory.listOfProgramCategory &&
                                                              elemSubCategory.listOfProgramCategory.map(
                                                                (
                                                                  elemSubSubCategory,
                                                                  elemSubSubCategoryIndex
                                                                ) => {
                                                                  return [
                                                                    <li>
                                                                      <span>
                                                                        <FormGroup
                                                                          controlId="formControlsSelect"
                                                                          className="m-b-0 w-full"
                                                                        >
                                                                          <FormControl
                                                                            componentClass="select"
                                                                            placeholder="select"
                                                                            className="s-arrow br-0 w125"
                                                                            name="programId"
                                                                            disabled={
                                                                              elemSubCategory.modelFamilyId
                                                                                ? false
                                                                                : true
                                                                            }
                                                                            value={
                                                                              elemSubSubCategory.programId
                                                                            }
                                                                            onChange={this.handleChange(
                                                                              index,
                                                                              'PROGRAM_CATEGORY',
                                                                              elemCategoryIndex,
                                                                              elemSubCategoryIndex,
                                                                              elemSubSubCategoryIndex
                                                                            )}
                                                                          >
                                                                            <option value="">
                                                                              select
                                                                            </option>
                                                                            {this
                                                                              .state
                                                                              .listOfProduct &&
                                                                              this.state.listOfProduct.map(
                                                                                (
                                                                                  item,
                                                                                  indexPro
                                                                                ) => {
                                                                                  return (
                                                                                    <option
                                                                                      value={
                                                                                        item.id
                                                                                      }
                                                                                      key={
                                                                                        indexPro
                                                                                      }
                                                                                      data-key={
                                                                                        indexPro
                                                                                      }
                                                                                      data-text={
                                                                                        item.projectCode
                                                                                      }
                                                                                    >
                                                                                      {
                                                                                        item.projectTitle
                                                                                      }
                                                                                    </option>
                                                                                  );
                                                                                }
                                                                              )}
                                                                          </FormControl>
                                                                          {elemSubCategory
                                                                            .listOfProgramCategory
                                                                            .length >
                                                                          1 ? (
                                                                            <span
                                                                              className="crossup2"
                                                                              onClick={e => {
                                                                                this.deleteConfirmation(
                                                                                  e,
                                                                                  index,
                                                                                  elemSubSubCategory.id,
                                                                                  'PROGRAM_CATEGORY',
                                                                                  elemCategoryIndex,
                                                                                  elemSubCategoryIndex,
                                                                                  elemSubSubCategoryIndex
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
                                                                        {/* <FormGroup
                                                                          controlId="formBasicText"
                                                                          className="mb-0"
                                                                        >
                                                                          <FormControl
                                                                            type="text"
                                                                            placeholder="Program"
                                                                            className="br-0 w125"
                                                                            name="name"
                                                                            value={
                                                                              elemSubSubCategory.name
                                                                            }
                                                                            onChange={this.handleChange(
                                                                              index,
                                                                              'PROGRAM_CATEGORY',
                                                                              elemCategoryIndex,
                                                                              elemSubCategoryIndex,
                                                                              elemSubSubCategoryIndex
                                                                            )}
                                                                          />
                                                                          <span className="crossup2">
                                                                            <span className="ico-add">
                                                                              <svg>
                                                                                <use
                                                                                  xlinkHref={`${Sprite}#crossIco`}
                                                                                />
                                                                              </svg>
                                                                            </span>
                                                                          </span>
                                                                        </FormGroup> */}
                                                                      </span>
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
                                                                    'PROGRAM_CATEGORY',
                                                                    elemCategoryIndex,
                                                                    elemSubCategoryIndex
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
                                                  className="addMore submidadd1"
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
                                                        'MODEL_FAMILY_CATEGORY',
                                                        elemCategoryIndex
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
                                          'PRODUCT_LINE_CATEGORY'
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
                                        <span className="b-t-t cursor-pointer">Add More</span>
                                      </span>
                                    </li>
                                  </ul>
                                </li>
                              </ul>
                              <div className="flex110">
                                <button
                                  className="btn btn-task"
                                  onClick={e => {
                                    this.deleteConfirmation(
                                      e,
                                      index,
                                      elem.id,
                                      'SECTOR_CATEGORY'
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

                <div className="spendaddnew">
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
                      this.state.listOfSectorCategory &&
                      this.state.listOfSectorCategory.length > 0
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
      actionSaveProductCost,
      actionGetProductCost,
      actionDeleteProductCost,
      actionGetProjectListForIndirectPurchase,
      actionGetModelFamily,
      actionGetProductData
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
