import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormControl, FormGroup, Modal, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sprite from '../../img/sprite.svg';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionSaveBrandCost,
  actionGetBrandCost,
  actionDeleteBrandCost
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
      listOfBrands: [
        {
          name: '',
          listOfSubBrands: [
            {
              name: ''
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
      .actionGetBrandCost(data)
      .then((result, error) => {
        let resourceData = result.payload.data.resourceData;
        this.setState({
          listOfBrands:
            resourceData.length > 0 ? resourceData : this.state.listOfBrands
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

    let listOfBrandsData = this.state.listOfBrands;
    let geographicaListJson = listOfBrandsData[index];
    if (value) value = value.replace(/[&\/\\#^`!@+()$~%=.'":*?<>{}]/g, '');
    else value = value;

    if (type === 'BRAND') {
      geographicaListJson[name] = value;
    } else if (type === 'SUBBRAND') {
      geographicaListJson['listOfSubBrands'][catIndex][name] = value;
    }

    listOfBrandsData[index] = geographicaListJson;
    this.setState({ listOfBrands: listOfBrandsData });
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
    let listOfBrandsDataArray = [];
    let listOfBrandsData = this.state.listOfBrands;

    listOfBrandsData.forEach(function(item, index) {
      if (item.name === '') {
        errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
        flag = false;
      }
      let listOfRequest = [];
      // item.listOfSubBrands.forEach(function(categoryItem, subIndex) {
      //   if (categoryItem.name === '') {
      //     errorMsg.push(validationMessages.spendingCategory.commonErrorMsg);
      //     flag = false;
      //   }
      // });
    });

    if (flag) {
      let data = {
        roleId: _this.props.userInfo.userData.userRole,
        userId: _this.props.userInfo.userData.id,
        listOfBrands: listOfBrandsData
      };

      this.props
        .actionSaveBrandCost(data)
        .then((result, error) => {
          console.log('listOfBrandsData----------', result);
          let resourceData = result.payload.data.resourceData;
          this.setState({
            listOfBrands:
              resourceData.length > 0 ? resourceData : this.state.listOfBrands
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
      listOfBrands: this.state.listOfBrands.concat({
        name: '',
        listOfSubBrands: [
          {
            name: ''
          }
        ]
      })
    });
  };

  handleRemove(e, index, id, type, brandIndex) {
    console.log('data--------', index, id, type, brandIndex);

    let _this = this;
    let listOfBrands = this.state.listOfBrands;

    if (type === 'BRAND') {
      listOfBrands.splice(index, 1);
    } else if (type === 'SUBBRAND') {
      listOfBrands[index].listOfSubBrands.splice(brandIndex, 1);
    }
    this.setState({
      listOfBrands: listOfBrands
    });

    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      id: id,
      classificationType: type
    };

    console.log('data--------', data);

    this.props
      .actionDeleteBrandCost(data)
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

  handleAddTree = (e, index, type, catIndex, subIndex, subsubIndex) => {
    var listOfBrands = this.state.listOfBrands;
    //let totalHeight = this.calcHeight();
    if (type === 'SUBBRAND') {
      listOfBrands[index] &&
        listOfBrands[index].listOfSubBrands.push({
          name: ''
        });
    }
    this.setState({
      listOfBrands: listOfBrands
    });
  };
  calcHeight() {
    return this.Line1.clientHeight;
  }
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
                        Brand Cost Centers Classification
                      </Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                ) : (
                  ''
                )}
                <div className=" m-b-15 text-center">
                  <h4 className="hero-title">
                    Brand Cost Centers Classification
                  </h4>
                </div>
                <div className="f-table spendingCatwrapper brandCatwrapper">
                  <div className="f-row">
                    <div className="th-f">Brand</div>
                    <div className="th-f">Sub Brand</div>
                    <div className="th-f">{''}</div>
                  </div>
                  <div className="f-tbody">
                    <div className="">
                      {this.state.listOfBrands &&
                        this.state.listOfBrands.map((elem, index) => {
                          return [
                            <div className="structree flex brandtree">
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
                                        'BRAND'
                                      )}
                                    />
                                  </FormGroup>
                                  <ul className="categoryWrapper">
                                    {elem.listOfSubBrands &&
                                      elem.listOfSubBrands.map(
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
                                                    'SUBBRAND',
                                                    elemCategoryIndex
                                                  )}
                                                />

                                                {elem.listOfSubBrands.length >
                                                1 ? (
                                                  <span
                                                    className="crossup2"
                                                    onClick={e => {
                                                      this.deleteConfirmation(
                                                        e,
                                                        index,
                                                        elemCategory.id,
                                                        'SUBBRAND',
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

                                                {/* {elem.listOfSubBrands.length >
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
                                                        'SUBBRAND',
                                                        elemCategoryIndex
                                                      );
                                                    }}
                                                    className="	glyphicon glyphicon-minus-sign"
                                                  />
                                                ) : (
                                                  ''
                                                )} */}
                                              </FormGroup>
                                            </li>
                                          ];
                                        }
                                      )}
                                    <li
                                      className="addMore addlast"
                                      onClick={event => {
                                        this.handleAddTree(
                                          event,
                                          index,
                                          'SUBBRAND'
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
                                        <span className="b-t-t">Add More</span>
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
                                      'BRAND'
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

                <div className="spendaddnew brandCatwrapper">
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
                      this.state.listOfBrands &&
                      this.state.listOfBrands.length > 0
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
      actionSaveBrandCost,
      actionGetBrandCost,
      actionDeleteBrandCost
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
