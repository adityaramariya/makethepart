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
      listOfMajorCategory: [
        {
          name: '',
          listOfCategory: [
            {
              name: '',
              listOfSubCategory: [
                {
                  name: '',
                  listOfSubSubCategory: [
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
          resourceData.length > 0
            ? resourceData
            : this.state.listOfMajorCategory;

        console.log('resourceDataList------------', resourceDataList);

        // resourceData.forEach(function(item, index) {
        //   if (item.listOfCategory.length > 0) {

        //     item.listOfSubCategory.forEach(function(subitem, subIndex) {
        //       if (subitem.listOfSubSubCategory.length > 0) {
        //       } else {
        //         resourceData[index].listOfCategory[
        //           subIndex
        //         ].listOfSubCategory.push({
        //           name: ''
        //         });
        //       }
        //     });
        //   } else {
        //     resourceData[index].listOfCategory.push({
        //       name: '',
        //       listOfSubCategory: [
        //         {
        //           name: '',
        //           listOfSubSubCategory: [
        //             {
        //               name: ''
        //             }
        //           ]
        //         }
        //       ]
        //     });
        //   }
        // });

        resourceData.forEach(function(item, index) {
          if (item.listOfCategory && item.listOfCategory.length > 0) {
            console.log('if cat', item);

            item.listOfCategory.forEach(function(subitem, catIndex) {
              if (subitem.listOfSubCategory.length > 0) {
                console.log('if sub', subitem);

                subitem.listOfSubCategory.forEach(function(
                  subsubitem,
                  subIndex
                ) {
                  console.log('loop11111', subsubitem);
                  if (
                    subsubitem.listOfSubSubCategory &&
                    subsubitem.listOfSubSubCategory.length > 0
                  ) {
                    console.log('if sub sub');
                  } else {
                    console.log('else else else');
                    resourceData[index].listOfCategory[
                      catIndex
                    ].listOfSubCategory[subIndex].listOfSubSubCategory = [];
                    resourceData[index].listOfCategory[
                      catIndex
                    ].listOfSubCategory[subIndex].listOfSubSubCategory.push({
                      name: ''
                    });
                    console.log('resourceData', resourceData);
                  }
                });
              } else {
                console.log('else else');
                resourceData[index].listOfCategory[
                  catIndex
                ].listOfSubCategory = [];
                resourceData[index].listOfCategory[
                  catIndex
                ].listOfSubCategory.push({
                  name: '',
                  listOfSubSubCategory: [
                    {
                      name: ''
                    }
                  ]
                });
              }
            });
          } else {
            console.log('else');
            resourceData[index].listOfCategory = [];
            resourceData[index].listOfCategory.push({
              name: '',
              listOfSubCategory: [
                {
                  name: '',
                  listOfSubSubCategory: [
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
          listOfMajorCategory: resourceDataList
        });

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

    let listOfMajorCategoryData = this.state.listOfMajorCategory;
    let geographicaListJson = listOfMajorCategoryData[index];
    if (value) value = value.replace(/[&\/\\#^`!@+()$~%=.'":*?<>{}]/g, '');
    else value = value;

    if (type === 'majorCategory') {
      geographicaListJson[name] = value;
    } else if (type === 'category') {
      geographicaListJson['listOfCategory'][catIndex][name] = value;
    } else if (type === 'subcategory') {
      geographicaListJson['listOfCategory'][catIndex]['listOfSubCategory'][
        subIndex
      ][name] = value;
    } else if (type === 'subsubcategory') {
      geographicaListJson['listOfCategory'][catIndex]['listOfSubCategory'][
        subIndex
      ]['listOfSubSubCategory'][subsubIndex][name] = value;
    }

    listOfMajorCategoryData[index] = geographicaListJson;
    this.setState({ listOfMajorCategory: listOfMajorCategoryData });
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
    let listOfMajorCategoryDataArray = [];
    let listOfMajorCategoryData = this.state.listOfMajorCategory;

    listOfMajorCategoryData.forEach(function(item, index) {
      if (item.name === '') {
        errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
        flag = false;
      }

      // let listOfRequest = [];
      // item.listOfCategory.forEach(function(categoryItem, subIndex) {
      //   if (categoryItem.name === '') {
      //     errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
      //     flag = false;
      //   }
      //   categoryItem.listOfSubCategory.forEach(function(
      //     subcategoryItem,
      //     subIndex
      //   ) {
      //     if (subcategoryItem.name === '') {
      //       errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
      //       flag = false;
      //     }
      //     subcategoryItem.listOfSubSubCategory.forEach(function(
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
        listOfMajorCategory: listOfMajorCategoryData
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
      listOfMajorCategory: this.state.listOfMajorCategory.concat([
        {
          name: '',
          listOfCategory: [
            {
              name: '',
              listOfSubCategory: [
                {
                  name: '',
                  listOfSubSubCategory: [
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
    let listOfMajorCategory = this.state.listOfMajorCategory;

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
      listOfMajorCategory.splice(index, 1);
    } else if (type === 'CATEGORY') {
      listOfMajorCategory[index].listOfCategory.splice(categoryIndex, 1);
    } else if (type === 'SUB_CATEGORY') {
      listOfMajorCategory[index].listOfCategory[
        categoryIndex
      ].listOfSubCategory.splice(subCategoryIndex, 1);
    } else if (type === 'SUB_SUB_CATEGORY') {
      listOfMajorCategory[index].listOfCategory[
        categoryIndex
      ].listOfSubCategory[subCategoryIndex].listOfSubSubCategory.splice(
        subSubCategoryIndex,
        1
      );
    }

    this.setState({
      listOfMajorCategory: listOfMajorCategory
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
    return this.Line1.clientHeight;
  }
  handleAddTree = (e, index, type, catIndex, subIndex, subsubIndex) => {
    let totalHeight = this.calcHeight();
    var listOfMajorCategory = this.state.listOfMajorCategory;
    if (type === 'majorCategory') {
      this.setState({
        totalHeight: 46
      });
      listOfMajorCategory[index] &&
        listOfMajorCategory[index].listOfCategory.push({
          name: '',
          listOfSubCategory: [
            {
              name: '',
              listOfSubSubCategory: [
                {
                  name: ''
                }
              ]
            }
          ]
        });
    } else if (type === 'category') {
      this.setState({
        totalHeight: 46
      });
      listOfMajorCategory[index] &&
        listOfMajorCategory[index].listOfCategory.push({
          name: '',
          listOfSubCategory: [
            {
              name: '',
              listOfSubSubCategory: [
                {
                  name: ''
                }
              ]
            }
          ]
        });
    } else if (type === 'subcategory') {
      this.setState({
        totalHeight: 46
      });
      listOfMajorCategory[index] &&
        listOfMajorCategory[index].listOfCategory[
          catIndex
        ].listOfSubCategory.push({
          name: '',
          listOfSubSubCategory: [
            {
              name: ''
            }
          ]
        });
    } else if (type === 'subsubcategory') {
      listOfMajorCategory[index] &&
        listOfMajorCategory[index].listOfCategory[catIndex].listOfSubCategory[
          subIndex
        ].listOfSubSubCategory.push({
          name: ''
        });

      let len =
        listOfMajorCategory[index].listOfCategory[catIndex].listOfSubCategory
          .length - 1;
      if (
        subIndex === 0 &&
        listOfMajorCategory[index].listOfCategory[catIndex].listOfSubCategory
          .length === 1
      ) {
        this.setState({
          totalHeight: totalHeight - 25
        });
      } else if (len == subIndex) {
        console.log('else if 11');
        this.setState({
          totalHeight: totalHeight - 25
        });
      } else if (
        listOfMajorCategory[index].listOfCategory[catIndex].listOfSubCategory[
          subIndex
        ].listOfSubSubCategory.length === 1
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
      listOfMajorCategory: listOfMajorCategory
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
                  <h4 className="hero-title">Spending Categories</h4>
                </div>

                <div className="f-table spendingCatwrapper">
                  <div className="f-row">
                    <div className="th-f">Major Category</div>
                    <div className="th-f">Category</div>
                    <div className="th-f">Sub Category</div>
                    <div className="th-f">Sub Sub Category</div>
                    <div className="th-f">{''}</div>
                  </div>
                  <div className="f-tbody">
                    <div className="fullwidth">
                      {this.state.listOfMajorCategory &&
                        this.state.listOfMajorCategory.map((elem, index) => {
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
                                      value={elem.name}
                                      onChange={this.handleChange(
                                        index,
                                        'majorCategory'
                                      )}
                                    />
                                  </FormGroup>

                                  <ul className="categoryWrapper">
                                    {elem.listOfCategory &&
                                      elem.listOfCategory.map(
                                        (elemCategory, elemCategoryIndex) => {
                                          return [
                                            <li className="categoryblock">
                                              <FormGroup
                                                controlId="formBasicText"
                                                className="mb-0"
                                              >
                                                <FormControl
                                                  type="text"
                                                  placeholder="Category"
                                                  className="br-0 w125"
                                                  name="name"
                                                  value={elemCategory.name}
                                                  onChange={this.handleChange(
                                                    index,
                                                    'category',
                                                    elemCategoryIndex
                                                  )}
                                                />
                                                {/* {elem.listOfCategory.length >
                                                1 ? (
                                                  <span
                                                    style={{
                                                      marginLeft: '-261px'
                                                    }}
                                                    onClick={e => {
                                                      this.deleteConfirmation(
                                                        e,
                                                        index,
                                                        elemCategory.id,
                                                        'CATEGORY',
                                                        elemCategoryIndex
                                                      );
                                                    }}
                                                    className="	glyphicon glyphicon-minus-sign"
                                                  />
                                                ) : (
                                                  ''
                                                )} */}
                                                {elem.listOfCategory.length >
                                                1 ? (
                                                  <span
                                                    className="crossup"
                                                    onClick={e => {
                                                      this.deleteConfirmation(
                                                        e,
                                                        index,
                                                        elemCategory.id,
                                                        'CATEGORY',
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

                                              <ul className="categorysubblock">
                                                {elemCategory.listOfSubCategory &&
                                                  elemCategory.listOfSubCategory.map(
                                                    (
                                                      elemSubCategory,
                                                      elemSubCategoryIndex
                                                    ) => {
                                                      let subCatLen =
                                                        elemCategory
                                                          .listOfSubCategory
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
                                                              controlId="formBasicText"
                                                              className="mb-0"
                                                            >
                                                              <FormControl
                                                                type="text"
                                                                placeholder="Sub Category"
                                                                className="br-0 w125"
                                                                name="name"
                                                                value={
                                                                  elemSubCategory.name
                                                                }
                                                                onChange={this.handleChange(
                                                                  index,
                                                                  'subcategory',
                                                                  elemCategoryIndex,
                                                                  elemSubCategoryIndex
                                                                )}
                                                              />
                                                              {/* {elemCategory
                                                                .listOfSubCategory
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
                                                                      'SUB_CATEGORY',
                                                                      elemCategoryIndex,
                                                                      elemSubCategoryIndex
                                                                    );
                                                                  }}
                                                                  className="	glyphicon glyphicon-minus-sign"
                                                                />
                                                              ) : (
                                                                ''
                                                              )} */}
                                                              {elemCategory
                                                                .listOfSubCategory
                                                                .length > 1 ? (
                                                                <span
                                                                  className="crossup1"
                                                                  onClick={e => {
                                                                    this.deleteConfirmation(
                                                                      e,
                                                                      index,
                                                                      elemSubCategory.id,
                                                                      'SUB_CATEGORY',
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
                                                          </span>
                                                          <ul className="subsubcat">
                                                            {elemSubCategory.listOfSubSubCategory &&
                                                              elemSubCategory.listOfSubSubCategory.map(
                                                                (
                                                                  elemSubSubCategory,
                                                                  elemSubSubCategoryIndex
                                                                ) => {
                                                                  return [
                                                                    <li>
                                                                      <span>
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
                                                                              elemSubSubCategory.name
                                                                            }
                                                                            onChange={this.handleChange(
                                                                              index,
                                                                              'subsubcategory',
                                                                              elemCategoryIndex,
                                                                              elemSubCategoryIndex,
                                                                              elemSubSubCategoryIndex
                                                                            )}
                                                                          />

                                                                          {/* {elemSubCategory
                                                                            .listOfSubSubCategory
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
                                                                          {elemSubCategory
                                                                            .listOfSubSubCategory
                                                                            .length >
                                                                          1 ? (
                                                                            <span
                                                                              className="crossup2"
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
                                                                    'subsubcategory',
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
                                                        'subcategory',
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
                                          'category'
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
                                      'MAJOR_CATEGORY'
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
                      this.state.listOfMajorCategory &&
                      this.state.listOfMajorCategory.length > 0
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
