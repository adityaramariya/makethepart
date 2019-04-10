import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormControl, FormGroup, Modal, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sprite from '../../img/sprite.svg';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionSaveFunctionalArea,
  actionGetFunctionalArea,
  actionDeleteFunctionalArea
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
      listOfDept: [
        {
          name: '',
          listOfSubDept: [
            {
              name: '',
              listOfTeam: [
                {
                  name: ''
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
      .actionGetFunctionalArea(data)
      .then((result, error) => {
        let resourceData = result.payload.data.resourceData;

        let resourceDataList =
          resourceData.length > 0 ? resourceData : this.state.listOfDept;

        console.log('resourceDataList------------', resourceDataList);

        resourceData.forEach(function(item, index) {
          if (item.listOfSubDept && item.listOfSubDept.length > 0) {
            console.log('if cat', item);

            item.listOfSubDept.forEach(function(subitem, catIndex) {
              if (subitem.listOfTeam.length > 0) {
                console.log('if sub', subitem);
              } else {
                console.log('else else');
                resourceData[index].listOfSubDept[catIndex].listOfTeam = [];
                resourceData[index].listOfSubDept[catIndex].listOfTeam.push({
                  name: ''
                });
              }
            });
          } else {
            console.log('else');
            resourceData[index].listOfSubDept = [];
            resourceData[index].listOfSubDept.push({
              name: '',
              listOfTeam: [
                {
                  name: ''
                }
              ]
            });
          }
        });

        this.setState({
          listOfDept: resourceDataList
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

    let listOfDeptData = this.state.listOfDept;
    let geographicaListJson = listOfDeptData[index];
    if (value) value = value.replace(/[&\/\\#^`!@+()$~%=.'":*?<>{}]/g, '');
    else value = value;

    if (type === 'DEPARTMENT') {
      geographicaListJson[name] = value;
    } else if (type === 'SUBDEPARTMENT') {
      geographicaListJson['listOfSubDept'][catIndex][name] = value;
    } else if (type === 'TEAM') {
      geographicaListJson['listOfSubDept'][catIndex]['listOfTeam'][subIndex][
        name
      ] = value;
    }

    listOfDeptData[index] = geographicaListJson;
    this.setState({ listOfDept: listOfDeptData });
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
    let listOfDeptDataArray = [];
    let listOfDeptData = this.state.listOfDept;

    listOfDeptData.forEach(function(item, index) {
      if (item.name === '') {
        errorMsg.push(
          validationMessages.costCenterClassification.commonErrorMsg
        );
        flag = false;
      }
      let listOfRequest = [];
      item.listOfSubDept.forEach(function(categoryItem, subIndex) {
        if (categoryItem.name === '') {
          errorMsg.push(
            validationMessages.costCenterClassification.commonErrorMsg
          );
          flag = false;
        }
        categoryItem.listOfTeam.forEach(function(subcategoryItem, subIndex) {
          if (subcategoryItem.name === '') {
            errorMsg.push(
              validationMessages.costCenterClassification.commonErrorMsg
            );
            flag = false;
          }
        });
      });
    });

    if (flag) {
      let data = {
        roleId: _this.props.userInfo.userData.userRole,
        userId: _this.props.userInfo.userData.id,
        listOfDept: listOfDeptData
      };

      this.props
        .actionSaveFunctionalArea(data)
        .then((result, error) => {
          let resourceData = result.payload.data.resourceData;
          this.setState({
            listOfDept:
              resourceData.length > 0 ? resourceData : this.state.listOfDept
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

  handleAddRow = () => {
    this.setState({
      listOfDept: this.state.listOfDept.concat([
        {
          name: '',
          listOfSubDept: [
            {
              name: '',
              listOfTeam: [
                {
                  name: ''
                }
              ]
            }
          ]
        }
      ])
    });
  };

  handleRemove(e, index, id, type, categoryIndex, subCategoryIndex) {
    let _this = this;
    let listOfDept = this.state.listOfDept;

    if (type === 'DEPARTMENT') {
      listOfDept.splice(index, 1);
    } else if (type === 'SUBDEPARTMENT') {
      listOfDept[index].listOfSubDept.splice(categoryIndex, 1);
    } else if (type === 'TEAM') {
      listOfDept[index].listOfSubDept[categoryIndex].listOfTeam.splice(
        subCategoryIndex,
        1
      );
    }

    this.setState({
      listOfDept: listOfDept
    });

    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      id: id,
      classificationType: type
    };

    this.props
      .actionDeleteFunctionalArea(data)
      .then((result, error) => {
        this.setState({
          deleteConformationModal: false
        });

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  deleteConfirmation(event, index, id, type, categoryIndex, subCategoryIndex) {
    this.setState({
      deleteConformationModal: true,
      currentDeletedId: id,
      currentDeletedIndex: index,
      type: type,
      categoryIndex: categoryIndex,
      subCategoryIndex: subCategoryIndex
    });
  }

  handleCloseConformation(event) {
    this.setState({
      deleteConformationModal: false
    });
  }

  handleAddTree = (e, index, type, catIndex, subIndex, subsubIndex) => {
    let totalHeight = this.calcHeight();
    var listOfDept = this.state.listOfDept;
    if (type === 'DEPARTMENT') {
      this.setState({
        totalHeight: -29
      });
      listOfDept[index] &&
        listOfDept[index].listOfSubDept.push({
          name: '',
          listOfTeam: [
            {
              name: ''
            }
          ]
        });
    } else if (type === 'SUBDEPARTMENT') {
      this.setState({
        totalHeight: -29
      });
      listOfDept[index] &&
        listOfDept[index].listOfSubDept.push({
          name: '',
          listOfTeam: [
            {
              name: ''
            }
          ]
        });
    } else if (type === 'TEAM') {
      listOfDept[index] &&
        listOfDept[index].listOfSubDept[catIndex].listOfTeam.push({
          name: ''
        });

      let len = listOfDept[index].listOfSubDept.length - 1;
      if (subIndex === 0 && len === 1) {
        this.setState({
          totalHeight: totalHeight - 25
        });
      } else if (len == subIndex) {
        console.log('else if 11');
        this.setState({
          totalHeight: totalHeight - 25
        });
      } else if (
        listOfDept[index].listOfSubDept[catIndex].listOfTeam.length === 1
      ) {
        console.log('else if 22');
        this.setState({
          totalHeight: totalHeight - 25
        });
      } else {
        console.log('else');
        this.setState({
          totalHeight: -29
        });
      }
    }
    this.setState({
      listOfDept: listOfDept
    });
  };
  calcHeight() {
    return this.Line1.clientHeight;
  }
  render() {
    let totalHeight = this.state.totalHeight ? this.state.totalHeight : -29;
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
                        Functional Area Cost Center Classification
                      </Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                ) : (
                  ''
                )}

                <div className="text-center m-b-15">
                  <h4 className="hero-title">
                    Functional Area Cost Center Classification
                  </h4>
                </div>

                <div className="f-table spendingCatwrapper functionCatwrapper">
                  <div className="f-row">
                    <div className="th-f">Department</div>
                    <div className="th-f">Sub Department Division</div>
                    <div className="th-f">Team</div>
                    <div className="th-f">{''}</div>
                  </div>
                  <div className="f-tbody">
                    <div className="fullwidth">
                      {this.state.listOfDept &&
                        this.state.listOfDept.map((elem, index) => {
                          return [
                            <div className="structree brandtree flex">
                              <ul>
                                <li class="strucroot">
                                  <FormGroup
                                    controlId="formBasicText"
                                    className="mb-0"
                                  >
                                    <FormControl
                                      type="text"
                                      placeholder="Department"
                                      className="br-0 w125"
                                      name="name"
                                      value={elem.name}
                                      onChange={this.handleChange(
                                        index,
                                        'DEPARTMENT'
                                      )}
                                    />
                                  </FormGroup>

                                  <ul className="categoryWrapper">
                                    {elem.listOfSubDept &&
                                      elem.listOfSubDept.map(
                                        (elemSecond, elemSecondIndex) => {
                                          let subCatLen1 =
                                            elem.listOfSubDept.length;
                                          return [
                                            <li
                                              className="categoryblock"
                                              // className={
                                              //   subCatLen1 ===
                                              //   elemSecondIndex + 1
                                              //     ? 'linehidden'
                                              //     : ''
                                              // }
                                              ref={
                                                subCatLen1 ===
                                                elemSecondIndex + 1
                                                  ? elem => (this.Line1 = elem)
                                                  : ''
                                              }
                                            >
                                              <FormGroup
                                                controlId="formBasicText"
                                                className="mb-0"
                                              >
                                                <FormControl
                                                  type="text"
                                                  placeholder="Sub Department Division"
                                                  className="br-0 w125"
                                                  name="name"
                                                  value={elemSecond.name}
                                                  onChange={this.handleChange(
                                                    index,
                                                    'SUBDEPARTMENT',
                                                    elemSecondIndex
                                                  )}
                                                />
                                                {elem.listOfSubDept.length >
                                                1 ? (
                                                  <span
                                                    className="crossup1"
                                                    onClick={e => {
                                                      this.deleteConfirmation(
                                                        e,
                                                        index,
                                                        elemSecond.id,
                                                        'SUBDEPARTMENT',
                                                        elemSecondIndex
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
                                                  // <span
                                                  //   style={{
                                                  //     marginLeft: '-261px'
                                                  //   }}
                                                  //   onClick={e => {
                                                  //     this.deleteConfirmation(
                                                  //       e,
                                                  //       index,
                                                  //       elemSecond.id,
                                                  //       'SUBDEPARTMENT',
                                                  //       elemSecondIndex
                                                  //     );
                                                  //   }}
                                                  //   className="	glyphicon glyphicon-minus-sign"
                                                  // />
                                                  ''
                                                )}
                                              </FormGroup>

                                              <ul className="categorysubblock">
                                                {elemSecond.listOfTeam &&
                                                  elemSecond.listOfTeam.map(
                                                    (
                                                      elemThrid,
                                                      elemThridIndex
                                                    ) => {
                                                      let subCatLen =
                                                        elemSecond.listOfTeam
                                                          .length;
                                                      return [
                                                        <li
                                                          className={
                                                            subCatLen ===
                                                            elemThridIndex + 1
                                                              ? 'linehidden'
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
                                                                placeholder="Team"
                                                                className="br-0 w125"
                                                                name="name"
                                                                value={
                                                                  elemThrid.name
                                                                }
                                                                onChange={this.handleChange(
                                                                  index,
                                                                  'TEAM',
                                                                  elemSecondIndex,
                                                                  elemThridIndex
                                                                )}
                                                              />
                                                              {elemSecond
                                                                .listOfTeam
                                                                .length > 1 ? (
                                                                <span
                                                                  className="crossup2"
                                                                  onClick={e => {
                                                                    this.deleteConfirmation(
                                                                      e,
                                                                      index,
                                                                      elemThrid.id,
                                                                      'TEAM',
                                                                      elemSecondIndex,
                                                                      elemThridIndex
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
                                                                // <span
                                                                //   style={{
                                                                //     marginLeft:
                                                                //       '-163px'
                                                                //   }}
                                                                //   onClick={e => {
                                                                //     this.deleteConfirmation(
                                                                //       e,
                                                                //       index,
                                                                //       elemThrid.id,
                                                                //       'TEAM',
                                                                //       elemSecondIndex,
                                                                //       elemThridIndex
                                                                //     );
                                                                //   }}
                                                                //   className="	glyphicon glyphicon-minus-sign"
                                                                // />
                                                                ''
                                                              )}
                                                            </FormGroup>
                                                          </span>
                                                        </li>
                                                      ];
                                                    }
                                                  )}
                                                <li
                                                  className="addMore addlast"
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
                                                        'TEAM',
                                                        elemSecondIndex
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
                                          'SUBDEPARTMENT'
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
                                      'DEPARTMENT'
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

                <div className="functionCatwrapper">
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
                      this.state.listOfDept && this.state.listOfDept.length > 0
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
                          this.state.subCategoryIndex
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
      actionSaveFunctionalArea,
      actionGetFunctionalArea,
      actionDeleteFunctionalArea
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
