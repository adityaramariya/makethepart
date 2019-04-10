import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import * as moment from 'moment';
import {
  Table,
  DropdownButton,
  FormControl,
  Modal,
  FormGroup
} from 'react-bootstrap';
import Sprite from '../../img/sprite.svg';

import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetPurchaseCategoryData,
  actionCheckAccountNo,
  actionSavePurchaseData,
  actionGetClassifications,
  actionGetDiscription,
  actionDeletePurchaseData,
  actionSuggessionData,
  actionSearchPartByKeyword
} from '../../common/core/redux/actions';
import {showErrorToast } from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
let { permissionConstant } = CONSTANTS;
class Purchasing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'tweleve',
      noOfCategory: [{
        listOfApprover:[{name:''}]
      }],
      tableNo: 0,
      showHeading: [],
      showSaveRedirect: false,
      listOfDepartment: [],
      listOfMainCategory: [],
      listOfMajorCategory: [],
      listOfAddress: [],
      listOfSubBrands: [],
      listOfSubDept: [],
      listOfTeam: [],
      listOfCategory: [],
      listOfSubCategory: [],
      listOfSubSubCategory: [],
      listOfGlobalRegions: [],
      globalSubRegions: [],
      countries: [],
      zones: [],
      listOfLocalBussinessRegion: [],
      listOfDistricts: [],
      listOfCircles: [],
      listOfArea: [],
      searchAutoList: false,
      searchingListHOD: [],
      approverElement:['localHODUserId','regionalHODUserId','globalHODUserId',
      'localFPUserId','regionalFPUserId','regionalCFOUserId','globalCFOUserId','costCenterManagerId'],
      
    };
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.addTable = this.addTable.bind(this);
    this.removeTable = this.removeTable.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.removeCategory = this.removeCategory.bind(this);
    this.headingChange = this.headingChange.bind(this);
    this.saveHeading = this.saveHeading.bind(this);
    this.savePurchaseCategory = this.savePurchaseCategory.bind(this);
    this.getClassifications = this.getClassifications.bind(this);  
    this.handleChangeRegion = this.handleChangeRegion.bind(this);  
    this.deleteConfirmation = this.deleteConfirmation.bind(this);
    this.handleCloseConformation = this.handleCloseConformation.bind(this);  
    this.getPartByKeyword = this.getPartByKeyword.bind(this);
  }

  componentWillMount() {
    let noOfCategory = this.state.noOfCategory;
    for (let i = 0; i < noOfCategory.length; i++) {
      noOfCategory[i] = [{ department: '' }];
    }
    for (let i = 0; i < noOfCategory.length; i++) {
      noOfCategory[i] = [{}];
    }
    this.setState({ noOfCategory: noOfCategory });
  }
  componentDidMount() {
    let _this = this;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };

    this.props
      .actionGetClassifications(data)
      .then((result, error) => {
    
          if(result.payload.data.status==200){
              let purchaseResponse = result.payload.data.resourceData;
              this.setState({
                listOfDepartment: purchaseResponse.listOfDepartment,
                listOfBrands: purchaseResponse.listOfBrands,
                listOfMajorCategory: purchaseResponse.listOfCategory,
                listOfAddress: purchaseResponse.listOfAddress,
                listOfGlobalRegions: purchaseResponse.listOfGlobalRegions,
                listOfSectorCategory: purchaseResponse.listOfProductLine,
                listOfFunctionalArea: purchaseResponse.listOfDepartment
              });
          }else{
            showErrorToast(result.payload.data.responseMessage);
          }



        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    this.props
      .actionGetPurchaseCategoryData(data)
      .then((result, error) => {
       let purchaseResponse = result.payload.data.resourceData;

console.log("purchaseResponse------------",purchaseResponse);

       if(purchaseResponse){
        for (let i = 0; i < purchaseResponse.length; i++) {
          purchaseResponse[i].listOfApprover = [{name:''}]
        }
        this.setState({
          noOfCategory:purchaseResponse,
          });
       }


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

  addTable() {
    let tableNo = this.state.tableNo;
    if (this.state.listOfFunctionalArea && this.state.listOfFunctionalArea.length - 1 !== tableNo) {
      let noOfCategory= this.state.noOfCategory;
      tableNo += 1;
      noOfCategory[tableNo] = [{}];
      noOfCategory.push([{}]);
      if (noOfCategory[tableNo])
        noOfCategory[tableNo].noOfCategory = noOfCategory[tableNo].noOfCategory
          ? []
          : '';
      if (noOfCategory[tableNo])
        noOfCategory[tableNo].noOfCategory = [{ department: '' }];

      this.setState({ noOfCategory: noOfCategory, tableNo: tableNo });
    }
  }
  removeTable() {
    let noOfCategory= this.state.noOfCategory;
    let tableNo = this.state.tableNo;
    if (noOfCategory.length !== 1) {
      tableNo -= 1;
      noOfCategory.pop();
    }
    this.setState({ noOfCategory: noOfCategory, tableNo: tableNo });
  }


  addCategory(event, index) {
    let noOfCategory= this.state.noOfCategory;
    let length =
      noOfCategory &&
      noOfCategory.length > 0
        ? noOfCategory.length
        : 0;

    if (
      length != 0 &&
      noOfCategory &&
      noOfCategory[length - 1] &&
      noOfCategory[length - 1].accountNo == undefined
    ) {
      showErrorToast('Please enter all detail first');
    } else {
      noOfCategory.push([{}]);
      this.setState({ noOfCategory: noOfCategory });
    }
  }
  removeCategory(event, index) {
    let noOfCategory= this.state.noOfCategory;
    if (noOfCategory.length !== 1) {
      noOfCategory.pop();
    }

    this.setState({ noOfCategory: noOfCategory });
  }

  headingChange(event, tableIndex) {
    const { name, value } = event.target;
    let noOfCategory= this.state.noOfCategory;
    noOfCategory[tableIndex][name] = value;

    this.setState({
      noOfCategory: noOfCategory
    });
  }

  saveHeading(tableIndex) {
    let showHeading = this.state.showHeading;
    let noOfCategory= this.state.noOfCategory;
    if (noOfCategory[tableIndex].heading) {
      showHeading[tableIndex] = true;
      let listOfFunctionalArea = this.state.listOfFunctionalArea;
      for (let i = 0; i <= listOfFunctionalArea.length; i++) {
        if (listOfFunctionalArea[i] === noOfCategory[tableIndex].heading) {
          listOfFunctionalArea.splice(i, 1);
        }
      }
      this.setState({ showHeading: showHeading });
    } else {
      showErrorToast('Please select Heading first');
    }
  }

  handleChangeSelect(
    event,
    name,
    value,
    nameText,
    text,
    catIndex,
    tableIndex,
    parentId,
    parentIdTwo,
    parentIdThree
  ) {
    event.stopPropagation();
    event.preventDefault();
    let noOfCategory= this.state.noOfCategory;
    let _this = this;

    noOfCategory[catIndex][name] = value;
    noOfCategory[catIndex][nameText] = text;

    if (name == 'brandId') {
      noOfCategory[catIndex].subBrandId = '';
    } else if (name == 'subBrandId') {
      noOfCategory[catIndex]['brandId'] = parentId;
    }

    if (name == 'majorCategoryId') {
      noOfCategory[catIndex].categoryId = '';
      noOfCategory[catIndex].subCategoryId = '';
      noOfCategory[catIndex].subSubCategoryId = '';
    } else if (name == 'categoryId') {
      noOfCategory[catIndex].subCategoryId = '';
      noOfCategory[catIndex].subSubCategoryId = '';
      noOfCategory[catIndex].majorCategoryId = parentId;
    } else if (name == 'subCategoryId') {
      noOfCategory[catIndex].subSubCategoryId = '';
      noOfCategory[catIndex].majorCategoryId = parentId;
      noOfCategory[catIndex].categoryId = parentIdTwo;
    } else if (name == 'subSubCategoryId') {
      noOfCategory[catIndex].majorCategoryId = parentId;
      noOfCategory[catIndex].categoryId = parentIdTwo;
      noOfCategory[
        catIndex
      ].subCategoryId = parentIdThree;
    }

    if (name == 'departmentId') {
      noOfCategory[catIndex].subDepartmentId = '';
      noOfCategory[catIndex].teamId = '';
    } else if (name == 'subDepartmentId') {
      noOfCategory[catIndex].teamId = '';
      noOfCategory[catIndex].departmentId = parentId;
    } else if (name == 'teamId') {
      noOfCategory[catIndex].departmentId = parentId;
      noOfCategory[
        catIndex
      ].subDepartmentId = parentIdTwo;
    }

    if (name == 'sectorId') {
      noOfCategory[catIndex].productLineId = '';
      noOfCategory[catIndex].modelFamilyId = '';
      noOfCategory[catIndex].programId = '';
    } else if (name == 'productLineId') {
      noOfCategory[catIndex].modelFamilyId = '';
      noOfCategory[catIndex].programId = '';
      noOfCategory[catIndex].sectorId = parentId;
    } else if (name == 'modelFamilyId') {
      noOfCategory[catIndex].programId = '';
      noOfCategory[catIndex].sectorId = parentId;
      noOfCategory[catIndex].productLineId = parentIdTwo;
    } else if (name == 'programId') {
      noOfCategory[catIndex].sectorId = parentId;
      noOfCategory[catIndex].productLineId = parentIdTwo;
      noOfCategory[
        catIndex
      ].modelFamilyId = parentIdThree;
    }

    let noOfCategoryElem = noOfCategory[catIndex];
    if (!noOfCategoryElem.accountNo) {
      let createdAccountNo =
        'acc' +  moment().format('sshhmm');
      if (
        noOfCategoryElem.brandId &&
        noOfCategoryElem.departmentId &&
        noOfCategoryElem.majorCategoryId &&
        noOfCategoryElem.sectorId &&
        noOfCategoryElem.globalRegionId 
      ) {


        noOfCategory[
          catIndex
        ].accountNo = createdAccountNo;
        noOfCategory[catIndex].showAccountText = true;
        noOfCategory[catIndex].description = '';

        let data = {
          roleId: _this.props.userInfo.userData.userRole,
          userId: _this.props.userInfo.userData.id,
          brandId: noOfCategoryElem.brandId,
          subBrandId: noOfCategoryElem.subBrandId,
          departmentId: noOfCategoryElem.departmentId,
          subDepartmentId: noOfCategoryElem.subDepartmentId,
          teamId: noOfCategoryElem.teamId,
          majorCategoryId: noOfCategoryElem.majorCategoryId,
          categoryId: noOfCategoryElem.categoryId,
          subCategoryId: noOfCategoryElem.subCategoryId,
          subSubCategoryId: noOfCategoryElem.subSubCategoryId,
          sectorId: noOfCategoryElem.sectorId,
          productLineId: noOfCategoryElem.productLineId,
          modelFamilyId: noOfCategoryElem.modelFamilyId,
          programId: noOfCategoryElem.programId,
          geogrophyId: noOfCategoryElem.geogrophyId,
          globalRegionId: noOfCategoryElem.globalRegionId,
          globalSubRegionId: noOfCategoryElem.globalSubRegionId,
          countryId: noOfCategoryElem.countryId,
          zone: noOfCategoryElem.zone,
          localBussinessRegion: noOfCategoryElem.localBussinessRegion,
          district: noOfCategoryElem.district,
          circle: noOfCategoryElem.circle,
          area: noOfCategoryElem.area 
        };
        _this.props
          .actionGetDiscription(data)
          .then((result, error) => {
            _this.props.actionLoaderHide();
            noOfCategory[catIndex].description = result.payload.data.resourceData;
            this.setState({ noOfCategory: noOfCategory });
          })
          .catch(e => _this.props.actionLoaderHide());
      }
    }
    this.setState({ noOfCategory: noOfCategory });
  }

  handleChangeRegion(
    event,
    error,
    catIndex,
    tableIndex,
    id,
    parentId,
    parentIdTwo,
    parentIdThree,
    parentIdFour,
    parentIdFive,
    parentIdSix,
    parentIdSeven,
    parentIdEight,
  ) {
    event.stopPropagation();
    event.preventDefault();
let _this = this;

if(error === 'error'){
  showErrorToast("Please select last label item")
}else{
  let noOfCategory= this.state.noOfCategory;
  noOfCategory[catIndex]['geogrophyId'] = id;
  noOfCategory[catIndex]['globalRegionId'] = parentId;
  noOfCategory[catIndex]['globalSubRegionId'] = parentIdTwo;
  noOfCategory[catIndex]['countryId'] = parentIdThree;
  noOfCategory[catIndex]['zone'] = parentIdFour;
  noOfCategory[catIndex]['localBussinessRegion'] = parentIdFive;
  noOfCategory[catIndex]['district'] = parentIdSix;
  noOfCategory[catIndex]['circle'] = parentIdSeven;
  noOfCategory[catIndex]['area'] = parentIdEight;

  let noOfCategoryElem = noOfCategory[catIndex];
  if (!noOfCategoryElem.accountNo) {
    let createdAccountNo =
      'acc' +  moment().format('sshhmm');
    if (
      noOfCategoryElem.brandId &&
      noOfCategoryElem.departmentId &&
      noOfCategoryElem.majorCategoryId &&
      noOfCategoryElem.sectorId &&
      noOfCategoryElem.globalRegionId 
    ) {
      noOfCategoryElem[
        catIndex
      ].accountNo = createdAccountNo;
      noOfCategoryElem[catIndex].showAccountText = true;
      noOfCategoryElem[catIndex].description = '';

      let data = {
        roleId: _this.props.userInfo.userData.userRole,
        userId: _this.props.userInfo.userData.id,
        brandId: noOfCategoryElem.brandId,
        subBrandId: noOfCategoryElem.subBrandId,
        departmentId: noOfCategoryElem.departmentId,
        subDepartmentId: noOfCategoryElem.subDepartmentId,
        teamId: noOfCategoryElem.teamId,
        majorCategoryId: noOfCategoryElem.majorCategoryId,
        categoryId: noOfCategoryElem.categoryId,
        subCategoryId: noOfCategoryElem.subCategoryId,
        subSubCategoryId: noOfCategoryElem.subSubCategoryId,
        sectorId: noOfCategoryElem.sectorId,
        productLineId: noOfCategoryElem.productLineId,
        modelFamilyId: noOfCategoryElem.modelFamilyId,
        programId: noOfCategoryElem.programId,
        geogrophyId: noOfCategoryElem.geogrophyId,
        globalRegionId: noOfCategoryElem.globalRegionId,
        globalSubRegionId: noOfCategoryElem.globalSubRegionId,
        countryId: noOfCategoryElem.countryId,
        zone: noOfCategoryElem.zone,
        localBussinessRegion: noOfCategoryElem.localBussinessRegion,
        district: noOfCategoryElem.district,
        circle: noOfCategoryElem.circle,
        area: noOfCategoryElem.area,
      };
      _this.props
        .actionGetDiscription(data)
        .then((result, error) => {

          _this.props.actionLoaderHide();
          noOfCategory[catIndex].description = result.payload.data.resourceData;
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  }
  this.setState({ noOfCategory: noOfCategory });
}
  }
  
  handleChange(event, catIndex, tableIndex, classificationType) {
    const { name, value, checked } = event.target;
    let noOfCategory= this.state.noOfCategory;
    let listOfAddress = this.state.listOfAddress;
    noOfCategory[catIndex][name] = value;

    if (name === 'address') {
      let addressObj = _.filter(listOfAddress, function(data) {
        return data.address === value;
      });

      noOfCategory[catIndex].area =
        addressObj && addressObj[0] && addressObj[0].locationId
          ? addressObj[0].locationId
          : '';

      noOfCategory[catIndex][name] = addressObj[0];
    } else if (name === 'rAndD') {
      if (checked) {
        noOfCategory[catIndex][name] = true;
      } else {
        noOfCategory[catIndex][name] = false;
      }
    }
    // let noOfCategory = noOfCategory[catIndex];
    // if (!noOfCategory.accountNo) {
    //   let createdAccountNo =
    //     'acc' + moment().format('sshhmm');
    //   if (
    //     noOfCategory.mainCategory &&
    //     noOfCategory.spendCategory &&
    //     noOfCategory.subCategory
    //   ) {
    //     noOfCategory[
    //       catIndex
    //     ].accountNo = createdAccountNo;
    //     noOfCategory[catIndex].showAccountText = true;
    //   }
    // }

    this.setState({ noOfCategory: noOfCategory });
  }

  handleChangeMouseOver(
    event,
    value,
    catIndex,
    classificationType,
    subcatIndex,
    subsubcatIndex
  ) {
    let listOfBrands = this.state.listOfBrands;
    let listOfDepartment = this.state.listOfDepartment;
    let listOfMajorCategory = this.state.listOfMajorCategory;
    let listOfSectorCategory = this.state.listOfSectorCategory;
    let flag = '';

    if (classificationType === 'BRAND') {
      flag =
        listOfBrands[catIndex] &&
        listOfBrands[catIndex]['listOfSubBrands'] &&
        listOfBrands[catIndex]['listOfSubBrands'].length > 0
          ? false
          : true;
    } else if (classificationType === 'DEPARTMENT_SUB_DIVISION') {
      flag =
        listOfDepartment[catIndex] &&
        listOfDepartment[catIndex]['listOfSubDept'] &&
        listOfDepartment[catIndex]['listOfSubDept'].length > 0
          ? false
          : true;
    } else if (classificationType === 'TEAM') {
      flag =
        listOfDepartment[catIndex] &&
        listOfDepartment[catIndex]['listOfSubDept'] &&
        listOfDepartment[catIndex]['listOfSubDept'][subcatIndex] &&
        listOfDepartment[catIndex]['listOfSubDept'][subcatIndex][
          'listOfTeam'
        ] &&
        listOfDepartment[catIndex]['listOfSubDept'][subcatIndex]['listOfTeam']
          .length > 0
          ? false
          : true;
    } else if (classificationType === 'CATEGORY') {
      flag =
        listOfMajorCategory[catIndex] &&
        listOfMajorCategory[catIndex]['listOfCategory'] &&
        listOfMajorCategory[catIndex]['listOfCategory'].length > 0
          ? false
          : true;
    } else if (classificationType === 'SUB_CATEGORY') {
      flag =
        listOfMajorCategory[catIndex] &&
        listOfMajorCategory[catIndex]['listOfCategory'] &&
        listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex] &&
        listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
          'listOfSubCategory'
        ] &&
        listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
          'listOfSubCategory'
        ].length > 0
          ? false
          : true;
    } else if (classificationType === 'SUB_SUB_CATEGORY') {
      flag =
        listOfMajorCategory[catIndex] &&
        listOfMajorCategory[catIndex]['listOfCategory'] &&
        listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex] &&
        listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
          'listOfSubCategory'
        ] &&
        listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
          'listOfSubCategory'
        ][subsubcatIndex] &&
        listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
          'listOfSubCategory'
        ][subsubcatIndex]['listOfSubSubCategory'] &&
        listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
          'listOfSubCategory'
        ][subsubcatIndex]['listOfSubSubCategory'].length > 0
          ? false
          : true;
    } else if (classificationType === 'PRODUCT_LINE') {
      flag =
        listOfSectorCategory[catIndex] &&
        listOfSectorCategory[catIndex]['listOfProductLineCategory'] &&
        listOfSectorCategory[catIndex]['listOfProductLineCategory'].length > 0
          ? false
          : true;
    } else if (classificationType === 'MODEL_FAMILY') {
      flag =
        listOfSectorCategory[catIndex] &&
        listOfSectorCategory[catIndex]['listOfProductLineCategory'] &&
        listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
        ] &&
        listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
        ]['listOfModelFamilyCategory'] &&
        listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
        ]['listOfModelFamilyCategory'].length > 0
          ? false
          : true;
    } else if (classificationType === 'PROGRAM') {
      flag =
        listOfSectorCategory[catIndex] &&
        listOfSectorCategory[catIndex]['listOfProductLineCategory'] &&
        listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
        ] &&
        listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
        ]['listOfModelFamilyCategory'] &&
        listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
        ]['listOfModelFamilyCategory'][subsubcatIndex] &&
        listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
        ]['listOfModelFamilyCategory'][subsubcatIndex][
          'listOfProgramCategory'
        ] &&
        listOfSectorCategory[catIndex]['listOfProductLineCategory'][
          subcatIndex
        ]['listOfModelFamilyCategory'][subsubcatIndex]['listOfProgramCategory']
          .length > 0
          ? false
          : true;
    }

    if (flag) {
      this.getClassifications(
        catIndex,
        value,
        classificationType,
        subcatIndex,
        subsubcatIndex
      );
    }
  }

  getClassifications(
    catIndex,
    id,
    classificationType,
    subcatIndex,
    subsubcatIndex
  ) {
    let _this = this;
    let noOfCategory= this.state.noOfCategory;
    let listOfBrands = this.state.listOfBrands;
    let listOfDepartment = this.state.listOfDepartment;
    let listOfMajorCategory = this.state.listOfMajorCategory;
    let listOfSectorCategory = this.state.listOfSectorCategory;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      classificationType: classificationType,
      id: id
    };
    this.props
      .actionGetClassifications(data)
      .then((result, error) => {
        let resourceData = result.payload.data.resourceData;
        if (classificationType === 'BRAND') {
          listOfBrands[catIndex]['listOfSubBrands'] = resourceData.listOfBrands;
          this.setState({
            listOfBrands: listOfBrands
          });
        } else if (classificationType === 'DEPARTMENT_SUB_DIVISION') {
          listOfDepartment[catIndex]['listOfSubDept'] =
            resourceData.listOfDepartment;
          this.setState({
            listOfDepartment: listOfDepartment
          });
        } else if (classificationType === 'TEAM') {
          listOfDepartment[catIndex]['listOfSubDept'][subcatIndex][
            'listOfTeam'
          ] = resourceData.listOfDepartment;
          this.setState({
            listOfDepartment: listOfDepartment
          });
        } else if (classificationType === 'CATEGORY') {
          listOfMajorCategory[catIndex]['listOfCategory'] =
            resourceData.listOfCategory;
          this.setState({
            listOfMajorCategory: listOfMajorCategory
          });
        } else if (classificationType === 'SUB_CATEGORY') {
          listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
            'listOfSubCategory'
          ] = resourceData.listOfCategory;
          this.setState({
            listOfMajorCategory: listOfMajorCategory
          });
        } else if (classificationType === 'SUB_SUB_CATEGORY') {
          listOfMajorCategory[catIndex]['listOfCategory'][subcatIndex][
            'listOfSubCategory'
          ][subsubcatIndex]['listOfSubSubCategory'] =
            resourceData.listOfCategory;
          this.setState({
            listOfMajorCategory: listOfMajorCategory
          });
        } else if (classificationType === 'PRODUCT_LINE') {
          listOfSectorCategory[catIndex]['listOfProductLineCategory'] =
            resourceData.listOfProductLine;
          this.setState({
            listOfSectorCategory: listOfSectorCategory
          });
        } else if (classificationType === 'MODEL_FAMILY') {
          listOfSectorCategory[catIndex]['listOfProductLineCategory'][
            subcatIndex
          ]['listOfModelFamilyCategory'] = resourceData.listOfProductLine;
          this.setState({
            listOfSectorCategory: listOfSectorCategory
          });
        } else if (classificationType === 'PROGRAM') {
          listOfSectorCategory[catIndex]['listOfProductLineCategory'][
            subcatIndex
          ]['listOfModelFamilyCategory'][subsubcatIndex][
            'listOfProgramCategory'
          ] = resourceData.listOfProductLine;
          this.setState({
            listOfSectorCategory: listOfSectorCategory
          });
        }

        this.setState({
          noOfCategory: noOfCategory
        });

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  editAccount(catIndex, tableIndex) {
    let noOfCategory= this.state.noOfCategory;
    noOfCategory[catIndex].showAccountText = true;
    this.setState({ noOfCategory: noOfCategory });
  }

  handleAccountBlur(event, catIndex, tableIndex) {
    const value = event.target.value || '';
    let _this = this;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      accountNo: value
    };
    this.props
      .actionCheckAccountNo(data)
      .then((result, error) => {
        let accountCheck = result.payload.data.resourceId;
        let noOfCategory = _this.state.noOfCategory;
        if (accountCheck === 'true') {
          showErrorToast(
            "'" + value + "'" + ' ' + ' Account number already exists.'
          );
          noOfCategory[catIndex].accountNo = '';
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }
  savePurchaseCategory() {
    let _this = this;
   // let accError = 0;
    let flag = true;
    let showError = '';
    let errorMsg = [];
    let noOfCategory= this.state.noOfCategory;
    let listOfPurchaseCategories = [];
    noOfCategory &&
          noOfCategory.forEach(function(catData, catIndex) {
            // else if (catData.regionalHODUserId === undefined) {
            //   errorMsg.push('Please enter regional HOD');
            //   flag = false;
            // }else if (catData.globalHODUserId === undefined) {
            //   errorMsg.push('Please enter global HOD ');
            //   flag = false;
            // }else  if (catData.localFPUserId === undefined) {
            //   errorMsg.push('Please enter local FP');
            //   flag = false;
            // } else if (catData.regionalFPUserId === undefined) {
            //   errorMsg.push('Please enter regional FP');
            //   flag = false;
            // }else if (catData.regionalCFOUserId === undefined) {
            //   errorMsg.push('Please enter regional CFO');
            //   flag = false;
            // }else if (catData.globalCFOUserId === undefined) {
            //   errorMsg.push('Please enter global CFO');
            //   flag = false;
            // }else if (catData.costCenterManagerId === undefined) {
            //   errorMsg.push('Please enter cost center manager');
            //   flag = false;
            // }
            if (catData.accountNo) {

              if (catData.localHODUserId === undefined && catData.regionalHODUserId === undefined &&
                catData.globalHODUserId === undefined && catData.localFPUserId === undefined &&
                catData.regionalFPUserId === undefined && catData.regionalCFOUserId === undefined &&
                catData.globalCFOUserId === undefined && catData.costCenterManagerId === undefined 
              ) {
                errorMsg.push('Please enter local HOD');
                flag = false;
              } 
              listOfPurchaseCategories.push({
                id: catData.id? catData.id:'',
                accountNo: catData.accountNo,
                description: catData.description,
                rAndD: catData.rAndD,
                //head: tableData.heading,
                address: catData.address,

                brandId: catData.brandId,
                subBrandId: catData.subBrandId,

                departmentId: catData.departmentId,
                subDepartmentId: catData.subDepartmentId,
                teamId: catData.teamId,

                majorCategoryId: catData.majorCategoryId,
                categoryId: catData.categoryId,
                subCategoryId: catData.subCategoryId,
                subSubCategoryId: catData.subSubCategoryId,

                sectorId: catData.sectorId,
                productLineId: catData.productLineId,
                modelFamilyId: catData.modelFamilyId,
                programId: catData.programId,

                geogrophyId: catData.geogrophyId,
                globalRegionId: catData.globalRegionId,
                globalSubRegionId: catData.globalSubRegionId,
                countryId: catData.countryId,
                zone: catData.zone,
                localBussinessRegion: catData.localBussinessRegion,
                district: catData.district,
                circle: catData.circle,
                area: catData.area,

                localHODUserId: catData.localHODUserId,
                regionalHODUserId: catData.regionalHODUserId,
                globalHODUserId: catData.globalHODUserId,
                localFPUserId: catData.localFPUserId,
                regionalFPUserId: catData.regionalFPUserId,
                regionalCFOUserId: catData.regionalCFOUserId,
                globalCFOUserId:catData.globalCFOUserId,
                costCenterManagerId: catData.costCenterManagerId,

              });
            } else {
              //this.setState({ accError: true });
              flag = false;
             // showErrorToast('Please fill account number first');
              errorMsg.push('Please fill account number first');
            }
      
      });

    if (flag ) {
      let data = {
        roleId: _this.props.userInfo.userData.userRole,
        userId: _this.props.userInfo.userData.id,
        listOfPurchaseCategories: listOfPurchaseCategories
      };
      _this.props
        .actionSavePurchaseData(data)
        .then((result, error) => {
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }else {
      if (errorMsg) {
        showError = errorMsg.join(',\r\n');
        showErrorToast(showError);
      }
    }

  }

  deleteCategory(e, catIndex, id) {

    let noOfCategory= this.state.noOfCategory;
    let _this = this;
    this.setState(prevState => {
      // you shouldn't mutate, this is just an example.
      delete prevState.noOfCategory[catIndex];
      return prevState;
    });

    if (
      noOfCategory.length === 0 &&
      noOfCategory.length !== 0
    ) {
      noOfCategory.splice(catIndex, 1);
    }

    let data = {
      roleId: _this.props.userInfo.userData.userRole,
      userId: _this.props.userInfo.userData.id,
      id: id
    };

    this.props
    .actionDeletePurchaseData(data)
    .then((result, error) => {
      _this.props.actionLoaderHide();
      _this.setState({ noOfCategory: noOfCategory,deleteConformationModal: false });
    })
    .catch(e => _this.props.actionLoaderHide())
    
  }

  deleteConfirmation(
    id,
    categoryIndex,
  ) {

    this.setState({
      deleteConformationModal: true,
      categoryIndex: categoryIndex,
      id: id,
    });
  }
  handleCloseConformation(event) {
    this.setState({
      deleteConformationModal: false
    });
  }
  handleOnChangeKeyword(e,catIndex,searchKeword) {
    const { value } = e.target;
    let noOfCategory= this.state.noOfCategory;
    noOfCategory[catIndex][searchKeword] = value

    if(value == ''){
      let phrase = searchKeword;
      let stripped = phrase.split('Name').join('Id');
      noOfCategory[catIndex][stripped] = value;
    }
    this.setState({ noOfCategory: noOfCategory });
  }

  handleOnChangeKeyword1(e,catIndex,searchKeword) {
    const { value } = e.target;
    let noOfCategory= this.state.noOfCategory;
    noOfCategory[catIndex][searchKeword] = value
    if(value == ''){
      let phrase = searchKeword;
      let stripped = phrase.split('Name').join('Id');
      noOfCategory[catIndex][stripped] = value;
    }
    this.setState({ noOfCategory: noOfCategory });
  }
  
  onChangeAutoList(e, data,catIndex,searchKeword,id,searchAutoList) {    
    let noOfCategory= this.state.noOfCategory;
    noOfCategory[catIndex][searchKeword] = data.firstName +' '+ data.lastName
    noOfCategory[catIndex][id] = data.id
    noOfCategory[catIndex][searchAutoList] = false;
    this.setState({
      noOfCategory: noOfCategory,
      [searchAutoList]: false,
      dataOfSearchPart: data
    });
  }
  getPartByKeyword(event, catIndex,searchKeword,searchingList,searchAutoList) {
    let _this = this;
    // let projectVariantId = this.state.projectVariantId;
  //   let serchKeyword = this.state.searchKeword;
     let noOfCategory= this.state.noOfCategory;
     let  serchKeyword = noOfCategory[catIndex][searchKeword]
     
    // let bomId = this.state.buildMaterialId;
     if (serchKeyword && serchKeyword.length > 2) {
      let data = {
        roleId: this.props.userInfo.userData.userRole,
        userId: this.props.userInfo.userData.id,
        firstName: serchKeyword,
        isBudgetPlanner: true
      };
  
      this.props
        .actionSuggessionData(data)
        .then((result, error) => {
          this.props.actionLoaderShow();
          let purchaseResponse = result.payload.data.resourceData;
          noOfCategory[catIndex][searchAutoList] = true;

        this.state.approverElement &&
        this.state.approverElement.forEach(function(catData, index) {
         // let approverElement = noOfCategory[catIndex][catData];
         _.remove(purchaseResponse, {id: noOfCategory[catIndex][catData]});
        })

          _this.setState({
            [searchAutoList]: true,
            [searchingList]: purchaseResponse,
            noOfCategory:noOfCategory
          });

          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide())
      window.addEventListener("scroll", this.handleScroll);
    } else {
      noOfCategory[catIndex][searchAutoList] = false;
      this.setState({ [searchAutoList]: false,noOfCategory:noOfCategory })
    }
  }
  render() { let tableIndex = 0;
    console.log("this.state.noOfCategory----------",this.state.noOfCategory);
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
               


           <div className="flex justify-space-between align-center m-t-20 m-b-20">
              <h4 className="hero-title">Assign Budget Approvals By Cost Center</h4>
                <div className="text-center">
                    <button
                      to="home"
                      className="btn btn-primary text-uppercase"
                      onClick={event => {
                        this.addCategory(event);
                      }}
                    >
                      Add Row
                    </button>
                    <button
                      to="home"
                      className="btn btn-primary text-uppercase"
                      onClick={event => {
                        this.deleteConfirmation(event);
                      }}
                      disabled={this.state.ListOfBudget && this.state.ListOfBudget.length>0?false:true}
                    >
                      Delete Row
                    </button>
                    <button
                      to="home"
                      className="btn btn-primary text-uppercase"
                      onClick={event => {
                        this.addToolYear(event);
                      }}
                      disabled={this.state.ListOfBudget && this.state.ListOfBudget.length>0?false:true}
                    >
                      Add Approver
                    </button>
                  </div>
                </div>

                      <div key={tableIndex}>
                        <div className="table-responsive">
                          <Table bordered condensed className="custom-table borderbox inputbdNone createBugetwrap">
                            <thead>
                              <tr>
                                <th>Account number</th>
                                <th>R&D</th>
                                <th>Description</th>
                                <th>Spend Category</th>
                                <th >Cost Center</th>

                                {/* <th>Plant(location)</th>
                                <th>Area</th> */}
                                {this.state.noOfCategory && this.state.noOfCategory[0] && 
                                 this.state.noOfCategory[0].listOfApprover &&
                                 this.state.noOfCategory[0].listOfApprover.map(
                                  (childitem,index) => {
                                    return [
                                      <th>Dummy</th>
                                    ];
                                  }
                                 )}
                                <th>Approver 1</th>
                                <th>Global CFO</th>
                        
                               
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.noOfCategory &&
                                this.state.noOfCategory.map((elem, catIndex) => {    
                                  return (
                                    <tr>
                                      <td className="w100"> 
                                        {/* {elem.showAccountText ? ( */}
                                          <div>
                                            <FormControl
                                              className="w-150"
                                              type="text" placeholder="Account Number"
                                              name="accountNo"
                                              value={elem.accountNo}
                                              onChange={event => {
                                                this.handleChange(
                                                  event,
                                                  catIndex,
                                                  tableIndex
                                                );
                                              }}
                                              onBlur={event => {
                                                this.handleAccountBlur(
                                                  event,
                                                  catIndex,
                                                  tableIndex
                                                );
                                              }}
                                            />
                                          </div>
                                        {/* ) : (
                                          <div className="border-around  border-light flex justify-space-between align-center p-accNo">
                                            <span className=" d-inline text-ellipsis text-left" > {elem.accountNo}</span>
                                            <span
                                              className="ico-action-sm"
                                              onClick={event => {
                                                this.editAccount(
                                                  catIndex,
                                                  tableIndex
                                                );
                                              }}
                                            >
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#edit1Ico`}
                                                />
                                              </svg>
                                            </span>
                                          </div>
                                        )} */}
                                      </td>
                                      <td>
                                        {' '}
                                        <label className="label--checkbox">
                                          <input
                                            type="checkbox"
                                            className="checkbox"
                                            name="rAndD"
                                            checked={elem.rAndD ? true : false}
                                            onChange={event => {
                                              this.handleChange(
                                                event,
                                                catIndex,
                                                tableIndex
                                              );
                                            }}
                                          />
                                         
                                        </label>
                                      </td>
                                      <td>
                                        <FormControl
                                          type="text"
                                          name="description" placeholder="Description"
                                          value={elem.description}
                                          onChange={event => {
                                            this.handleChange(
                                              event,
                                              catIndex,
                                              tableIndex
                                            );
                                          }}
                                        />
                                      </td>
                                      <td className="custom-dd dropRf customdropdown w-150">
                                <FormGroup
                                  controlId="formControlsSelect"
                                  className="w-full"
                                >
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0 line-set"
                                    name="majorCategoryId"
                                    value={elem.majorCategoryId}
                                    // onChange={this.handleChange(
                                    //   'region',
                                    //    catIndex
                                    // )}

                                    onChange = {event => {
                                      this.handleChangeMajorCategory(
                                        event,
                                        catIndex,
                                        'CATEGORY',
                                      );
                                    }}
                                  >
                                    <option value="">Major Category</option>
                                    {this.state.listOfMajorCategory &&
                                      this.state.listOfMajorCategory.map(
                                        (item, index) => {
                                          return (
                                            <option
                                              value={item.id}
                                              key={index}
                                              data-key={index}
                                            >
                                              {item.name}
                                            </option>
                                          );
                                        }
                                      )}
                                  </FormControl>
                                </FormGroup>
                                <FormGroup
                                  controlId="formControlsSelect"
                                  className="w-full"
                                >
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0 line-set"
                                    name="categoryId"
                                    value={elem.categoryId}
                                    // onChange={this.handleChange(
                                    //   'region',
                                    //    catIndex
                                    // )}
                                    onChange={event => {
                                      this.handleChangeMajorCategory(
                                        event,
                                        catIndex,
                                        'SUB_CATEGORY',
                                      );
                                    }}
                                  >
                                    <option value="">Category</option>
                                    {elem.listOfCategory &&
                                      elem.listOfCategory.map(
                                        (subitem,subindex) => {
                                          return (
                                            <option
                                              value={subitem.id}
                                              key={subindex}
                                              data-key={subindex}
                                            >
                                              {subitem.name}
                                            </option>
                                          );
                                        }
                                      )}
                                  </FormControl>
                                </FormGroup>
                                <FormGroup
                                  controlId="formControlsSelect"
                                  className="w-full"
                                >
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0 line-set"
                                    name="subCategoryId"
                                    value={elem.subCategoryId}
                                    onChange={event => {
                                      this.handleChangeMajorCategory(
                                        event,
                                        catIndex,
                                        'SUB_SUB_CATEGORY',
                                      );
                                    }}
                                  >
                                    <option value="">Sub Category</option>
                                    {elem.listOfSubCategory &&
                                      elem.listOfSubCategory.map(
                                        (subSubItem,subsubindex)=> {
                                          return (
                                            <option
                                              value={subSubItem.id}
                                              key={subsubindex}
                                              data-key={subsubindex}
                                            >
                                              {subSubItem.name}
                                            </option>
                                          );
                                        }
                                      )}
                                  </FormControl>
                                </FormGroup>
                                <FormGroup
                                  controlId="formControlsSelect"
                                  className="w-full"
                                >
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0 line-set"
                                    name="subSubCategoryId"
                                    value={elem.subSubCategoryId}
                                    onChange={event => {
                                      this.handleChangeMajorCategory(
                                        event,
                                        catIndex,
                                        'CHILD',
                                      );
                                    }}
                                  >
                                    <option value="">Sub Sub Category</option>
                                    {elem.listOfSubSubCategory &&
                                      elem.listOfSubSubCategory.map(
                                        (subSubSubItem,subsubsubindex) => {
                                          return (
                                            <option
                                              value={subSubSubItem.id}
                                              key={subsubsubindex}
                                              data-key={subsubsubindex}
                                            >
                                              {subSubSubItem.name}
                                            </option>
                                          );
                                        }
                                      )}
                                  </FormControl>
                                </FormGroup>

                              </td>
                              <td className="custom-dd dropRf customdropdown">
                               <div className="createDrop tooltipCustom">
                                 {elem.regionTitle?(<span class="tooltiptext">{elem.regionTitle}</span>):''}
                                 <DropdownButton
                                    title={elem.regionTitle?(<span className='dropdownEllipsis'>{elem.regionTitle}</span>):'Geographical Classification'}
                                    name="Select specification"
                                    className="dropbgwhite w-200 word-break"
                                  >
                                    <ul>
                                      {this.state.listOfGlobalRegions &&
                                        this.state.listOfGlobalRegions.map(
                                          (item, index) => [
                                            <li
                                              className={item.globalRegionId ==
                                                elem.globalRegionId
                                                ? 'dropactiveTitle'
                                                : ''}
                                            >
                                             <span className="costTitle"> {item.globalRegions}</span>
                                              {item.globalSubRegions &&
                                                item.globalSubRegions
                                                  .length > 0 ? (
                                                  <ul>
                                                    {item.globalSubRegions.map(
                                                      (
                                                        subitem,
                                                        subindex
                                                      ) => [
                                                          <li
                                                            className={subitem.id ==
                                                              elem.globalSubRegionId
                                                              ? 'dropactiveTitle'
                                                              : ''}

                                                            onClick={event =>
                                                              this.handleChangeRegion(
                                                                event,
                                                                'error'
                                                              )
                                                            }
                                                          >
                                                           <span className="costTitle"> {subitem.name} </span>
                                                            {subitem.countries &&
                                                              subitem.countries
                                                                .length > 0 ? (
                                                                <ul>
                                                                  {subitem.countries.map(
                                                                    (
                                                                      countryItem,
                                                                      countryIndex
                                                                    ) => [
                                                                        <li
                                                                          className={countryItem.id ==
                                                                            elem.countryId
                                                                            ? 'dropactiveTitle'
                                                                            : ''}
                                                                          onClick={event =>
                                                                            this.handleChangeRegion(
                                                                              event,
                                                                              'error'
                                                                            )
                                                                          }
                                                                        >
                                                                          <span className="costTitle">{
                                                                            countryItem.name
                                                                          }</span>

                                                                          {countryItem.zones &&
                                                                            countryItem
                                                                              .zones
                                                                              .length >
                                                                            0 ? (
                                                                              <ul>
                                                                                {countryItem.zones.map(
                                                                                  (
                                                                                    zoneItem,
                                                                                    zoneIndex
                                                                                  ) => [
                                                                                      <li
                                                                                        className={zoneItem.name ==
                                                                                          elem.zone
                                                                                          ? 'dropactiveTitle'
                                                                                          : ''}
                                                                                        onClick={event =>
                                                                                          this.handleChangeRegion(
                                                                                            event,
                                                                                            'error'
                                                                                          )
                                                                                        }
                                                                                      >
                                                                                       <span className="costTitle"> {
                                                                                          zoneItem.name
                                                                                        }</span>
                                                                                        {zoneItem.localBussinessRegion &&
                                                                                          zoneItem
                                                                                            .localBussinessRegion
                                                                                            .length >
                                                                                          0 ? (
                                                                                            <ul>
                                                                                              {zoneItem.localBussinessRegion.map(
                                                                                                (
                                                                                                  localItem,
                                                                                                  zoneIndex
                                                                                                ) => [
                                                                                                    <li
                                                                                                      className={localItem.name ==
                                                                                                        elem.localBussinessRegion
                                                                                                        ? 'dropactiveTitle'
                                                                                                        : ''}
                                                                                                      onClick={event =>
                                                                                                        this.handleChangeRegion(
                                                                                                          event,
                                                                                                          'error'
                                                                                                        )
                                                                                                      }
                                                                                                    >
                                                                                                     <span className="costTitle"> {
                                                                                                        localItem.name
                                                                                                      }</span>
                                                                                                      {localItem.districts &&
                                                                                                        localItem
                                                                                                          .districts
                                                                                                          .length >
                                                                                                        0 ? (
                                                                                                          <ul>
                                                                                                            {localItem.districts.map(
                                                                                                              (
                                                                                                                districtsItem,
                                                                                                                zoneIndex
                                                                                                              ) => [
                                                                                                                  <li
                                                                                                                    className={districtsItem.name ==
                                                                                                                      elem.district
                                                                                                                      ? 'dropactiveTitle'
                                                                                                                      : ''}
                                                                                                                    onClick={event =>
                                                                                                                      this.handleChangeRegion(
                                                                                                                        event,
                                                                                                                        'error'
                                                                                                                      )
                                                                                                                    }
                                                                                                                  >
                                                                                                                 <span className="costTitle">   {
                                                                                                                      districtsItem.name
                                                                                                                    }</span>
                                                                                                                    {districtsItem.circles &&
                                                                                                                      districtsItem
                                                                                                                        .circles
                                                                                                                        .length >
                                                                                                                      0 ? (
                                                                                                                        <ul>
                                                                                                                          {districtsItem.circles.map(
                                                                                                                            (
                                                                                                                              circlesItem,
                                                                                                                              zoneIndex
                                                                                                                            ) => [
                                                                                                                                <li className={circlesItem.name ==
                                                                                                                                  elem.circle
                                                                                                                                  ? 'dropactiveTitle'
                                                                                                                                  : ''}
                                                                                                                                >
                                                                                                                                  <span className="costTitle">{
                                                                                                                                    circlesItem.name
                                                                                                                                  }</span>




                                                                                                                                  {circlesItem.area &&
                                                                                                                                    circlesItem
                                                                                                                                      .area
                                                                                                                                      .length >
                                                                                                                                    0 ? (
                                                                                                                                      <ul>
                                                                                                                                        {circlesItem.area.map(
                                                                                                                                          (
                                                                                                                                            areaItem,
                                                                                                                                            zoneIndex
                                                                                                                                          ) => [
                                                                                                                                              <li
                                                                                                                                                className={areaItem.name ==
                                                                                                                                                  elem.area
                                                                                                                                                  ? 'dropactiveTitle '
                                                                                                                                                  : ''}
                                                                                                                                                onClick={event =>
                                                                                                                                                  this.handleChangeRegion(
                                                                                                                                                    event,
                                                                                                                                                    '',
                                                                                                                                                    catIndex,
                                                                                                                                                    item.id,
                                                                                                                                                    item.globalRegionId,
                                                                                                                                                    subitem.id,
                                                                                                                                                    countryItem.id,
                                                                                                                                                    zoneItem.name,
                                                                                                                                                    localItem.name,
                                                                                                                                                    districtsItem.name,
                                                                                                                                                    circlesItem.name,
                                                                                                                                                    areaItem.name,
                                                                                                                                                    item.globalRegions,
                                                                                                                                                    subitem.name,
                                                                                                                                                    countryItem.name
                                                                                                                                                  )
                                                                                                                                                }
                                                                                                                                              >
                                                                                                                                               <span className="costTitle"> {
                                                                                                                                                  areaItem.name
                                                                                                                                                }</span>
                                                                                                                                              </li>
                                                                                                                                            ]
                                                                                                                                        )}
                                                                                                                                      </ul>
                                                                                                                                    ) : (
                                                                                                                                      ''
                                                                                                                                    )}






                                                                                                                                </li>
                                                                                                                              ]
                                                                                                                          )}
                                                                                                                        </ul>
                                                                                                                      ) : (
                                                                                                                        ''
                                                                                                                      )}
                                                                                                                  </li>
                                                                                                                ]
                                                                                                            )}
                                                                                                          </ul>
                                                                                                        ) : (
                                                                                                          ''
                                                                                                        )}
                                                                                                    </li>
                                                                                                  ]
                                                                                              )}
                                                                                            </ul>
                                                                                          ) : (
                                                                                            ''
                                                                                          )}
                                                                                      </li>
                                                                                    ]
                                                                                )}
                                                                              </ul>
                                                                            ) : (
                                                                              ''
                                                                            )}
                                                                        </li>
                                                                      ]
                                                                  )}
                                                                </ul>
                                                              ) : (
                                                                ''
                                                              )}
                                                          </li>
                                                        ]
                                                    )}
                                                  </ul>
                                                ) : (
                                                  ''
                                                )}
                                            </li>
                                          ]
                                        )}
                                    </ul>     
                                  </DropdownButton>
                                </div>  
                               <div className="createDrop tooltipCustom">  
                               {/* <span class="tooltiptext">hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</span>  */}
                               {elem.sectorTitle?(<span class="tooltiptext">{elem.sectorTitle}</span>):''}
                                  <DropdownButton
                                    title= {elem.sectorTitle?(<span className='dropdownEllipsis'>{elem.sectorTitle}</span>):'Product Line Classification'}
                                    name="Select specification"
                                    className="dropbgwhite w-200 word-break"
                                  >
                                    <ul>
                                      {this.state.listOfSectorCategory &&
                                        this.state.listOfSectorCategory.map(
                                          (item, index) => {
                                            let subdepLen =
                                              item.listOfProductLineCategory &&
                                                item
                                                  .listOfProductLineCategory
                                                  .length > 0
                                                ? ''
                                                : '';
                                            let subdepActive =
                                              item.id == elem.sectorId
                                                ? 'dropactiveTitle'
                                                : '';
                                            return [
                                              <li
                                                className={
                                                  subdepLen +
                                                  ' ' +
                                                  subdepActive
                                                }
                                                onMouseOver={event => {
                                                  this.handleChangeMouseOver(
                                                    event,
                                                    item.id,
                                                    index,
                                                    'PRODUCT_LINE'
                                                  );
                                                }}
                                                onClick={event => {
                                                  this.handleChangeSelect(
                                                    event,
                                                    'sectorId',
                                                    item.id,
                                                    catIndex,'','','',item.name
                                                  );
                                                }}
                                              >
                                                <span className="costTitle">{item.name}</span>
                                                {item.listOfProductLineCategory &&
                                                  item
                                                    .listOfProductLineCategory
                                                    .length > 0 ? (
                                                    <ul>
                                                      {item.listOfProductLineCategory.map(
                                                        (
                                                          subitem,
                                                          subindex
                                                        ) => {
                                                          let subdepLen =
                                                            subitem.listOfModelFamilyCategory &&
                                                              subitem
                                                                .listOfModelFamilyCategory
                                                                .length > 0
                                                              ? ''
                                                              : '';
                                                          let subdepActive =
                                                            subitem.id ==
                                                              elem.productLineId
                                                              ? 'dropactiveTitle'
                                                              : '';
                                                          return [
                                                            <li
                                                              className={
                                                                subdepLen +
                                                                ' ' +
                                                                subdepActive
                                                              }
                                                              onMouseOver={event => {
                                                                this.handleChangeMouseOver(
                                                                  event,
                                                                  subitem.id,
                                                                  index,
                                                                  'MODEL_FAMILY',
                                                                  subindex
                                                                );
                                                              }}
                                                              onClick={event => {
                                                                this.handleChangeSelect(
                                                                  event,
                                                                  'productLineId',
                                                                  subitem.id,
                                                                  catIndex,
                                                                  item.id,'','',item.name,subitem.name
                                                                );
                                                              }}
                                                            >
                                                              <span className="costTitle">{subitem.name}</span>
                                                              {subitem.listOfModelFamilyCategory &&
                                                                subitem
                                                                  .listOfModelFamilyCategory
                                                                  .length >
                                                                0 ? (
                                                                  <ul>
                                                                    {subitem.listOfModelFamilyCategory.map(
                                                                      (
                                                                        subSubItem,
                                                                        sunsubindex
                                                                      ) => {
                                                                        let subdepLen =
                                                                          subSubItem.listOfProgramCategory &&
                                                                            subSubItem
                                                                              .listOfProgramCategory
                                                                              .length >
                                                                            0
                                                                            ? ''
                                                                            : '';
                                                                        let subdepActive =
                                                                          subSubItem.id ==
                                                                            elem.modelFamilyId
                                                                            ? 'dropactiveTitle'
                                                                            : '';
                                                                        return [
                                                                          <li
                                                                            className={
                                                                              subdepLen +
                                                                              ' ' +
                                                                              subdepActive
                                                                            }
                                                                            onMouseOver={event => {
                                                                              this.handleChangeMouseOver(
                                                                                event,
                                                                                subSubItem.id,
                                                                                index,
                                                                                'PROGRAM',
                                                                                subindex,
                                                                                sunsubindex
                                                                              );
                                                                            }}
                                                                            onClick={event => {
                                                                              this.handleChangeSelect(
                                                                                event,
                                                                                'modelFamilyId',
                                                                                subSubItem.id,
                                                                                catIndex,
                                                                                item.id,
                                                                                subitem.id,'',item.name,
                                                                                subitem.name,subSubItem.name
                                                                              );
                                                                            }}
                                                                          > <span className="costTitle">
                                                                            {
                                                                              subSubItem.name
                                                                            }</span>
                                                                            {subSubItem.listOfProgramCategory &&
                                                                              subSubItem
                                                                                .listOfProgramCategory
                                                                                .length >
                                                                              0 ? (
                                                                                <ul>
                                                                                  {subSubItem.listOfProgramCategory.map(
                                                                                    (
                                                                                      childitem,
                                                                                      subindex
                                                                                    ) => {
                                                                                      let subdepActive =
                                                                                        childitem.id ==
                                                                                          elem.programId
                                                                                          ? 'dropactiveTitle'
                                                                                          : '';
                                                                                      return [
                                                                                        <li
                                                                                          className={
                                                                                            subdepActive
                                                                                          }
                                                                                          onClick={event => {
                                                                                            this.handleChangeSelect(
                                                                                              event,
                                                                                              'programId',
                                                                                              childitem.id,
                                                                                              catIndex,
                                                                                              item.id,
                                                                                              subitem.id,
                                                                                              subSubItem.id
                                                                                              ,item.name,
                                                                                              subitem.name,subSubItem.name,
                                                                                              childitem.name
                                                                                            );
                                                                                          }}
                                                                                        >
                                                                                          <span className="costTitle">{
                                                                                            childitem.name
                                                                                          }</span> 

                                                                                        </li>
                                                                                      ];
                                                                                    }
                                                                                  )}
                                                                                </ul>
                                                                              ) : (
                                                                                ''
                                                                              )}
                                                                          </li>
                                                                        ];
                                                                      }
                                                                    )}
                                                                  </ul>
                                                                ) : (
                                                                  ''
                                                                )}
                                                            </li>
                                                          ];
                                                        }
                                                      )}
                                                    </ul>
                                                  ) : (
                                                    ''
                                                  )}
                                              </li>
                                            ];
                                          }
                                        )}
                                    </ul>
                                  </DropdownButton>
                               </div>
                              <div className="createDrop tooltipCustom">  
                               {elem.brandTitle?(<span class="tooltiptext">{elem.brandTitle}</span>):''}
                                  <DropdownButton
                                    title= {elem.brandTitle?(<span className='dropdownEllipsis'>{elem.brandTitle}</span>):'Brand Cost Center'}
                                    name="Select specification"
                                    className="dropbgwhite w-200 word-break"
                                  >
                                    <ul>
                                      {this.state.listOfBrands &&
                                        this.state.listOfBrands.map(
                                          (item, index) => {
                                            let brlen =
                                              item.listOfSubBrands &&
                                                item.listOfSubBrands
                                                  .length > 0
                                                ? ''
                                                : '';
                                            let brActive =
                                              elem.brandId === item.id
                                                ? 'dropactiveTitle'
                                                : '';
                                            return [
                                              <li
                                                className={
                                                  brlen + ' ' + brActive
                                                }
                                                onMouseOver={event => {
                                                  this.handleChangeMouseOver(
                                                    event,
                                                    item.id,
                                                    index,
                                                    'BRAND'
                                                  );
                                                }}
                                                onClick={event =>
                                                  this.handleChangeSelect(
                                                    event,
                                                    'brandId',
                                                    item.id,
                                                    catIndex,
                                                    '','','',item.name
                                                  )
                                                }


                                              >
                                               <span className="costTitle"> {item.name}</span>
                                                {item.listOfSubBrands &&
                                                  item.listOfSubBrands
                                                    .length > 0 ? (
                                                    <ul>
                                                      {item.listOfSubBrands.map(
                                                        (
                                                          subitem,
                                                          subindex
                                                        ) => {
                                                          return [
                                                            <li
                                                              className={
                                                                elem.subBrandId ===
                                                                  subitem.id
                                                                  ? 'dropactiveTitle'
                                                                  : ''
                                                              }
                                                              onClick={event =>
                                                                this.handleChangeSelect(
                                                                  event,
                                                                  'subBrandId',
                                                                  subitem.id,
                                                                  catIndex,
                                                                  item.id,
                                                                  '','',item.name,subitem.name
                                                                )
                                                              }


                                                            >
                                                             <span className="costTitle"> {subitem.name}</span>
                                                            </li>
                                                          ];
                                                        }
                                                      )}
                                                    </ul>
                                                  ) : (
                                                    ''
                                                  )}
                                              </li>
                                            ];
                                          }
                                        )}
                                    </ul>
                                  </DropdownButton>
                                </div>
                                <div className="createDrop tooltipCustom">  
                                {elem.departmentTitle?(<span class="tooltiptext">{elem.departmentTitle}</span>):''}
                                  <DropdownButton
                                   title= {elem.departmentTitle?(<span className='dropdownEllipsis'>{elem.departmentTitle}</span>):'Functional Classification'}
                                    name="Select specification"
                                    className="dropbgwhite w-200 word-break"
                                  >
                                    <ul>
                                      {this.state.listOfDepartment &&
                                        this.state.listOfDepartment.map(
                                          (item, index) => {
                                            let depLen =
                                              item.listOfSubDept &&
                                                item.listOfSubDept.length >
                                                0
                                                ? ''
                                                : '';
                                            let depActive =
                                              item.id == elem.departmentId
                                                ? 'dropactiveTitle'
                                                : '';
                                            return [
                                              <li
                                                className={
                                                  depLen + ' ' + depActive
                                                }
                                                onMouseOver={event => {
                                                  this.handleChangeMouseOver(
                                                    event,
                                                    item.id,
                                                    index,
                                                    'DEPARTMENT_SUB_DIVISION'
                                                  );
                                                }}
                                                onClick={event => {
                                                  this.handleChangeSelect(
                                                    event,
                                                    'departmentId',
                                                    item.id,
                                                    catIndex
                                                    ,'','','',item.name
                                                  );
                                                }}
                                              >
                                              <span className="costTitle">  {item.name}</span>
                                                {item.listOfSubDept &&
                                                  item.listOfSubDept
                                                    .length > 0 ? (
                                                    <ul>
                                                      {item.listOfSubDept.map(
                                                        (
                                                          subitem,
                                                          subindex
                                                        ) => {
                                                          let subdepLen =
                                                            subitem.listOfTeam &&
                                                              subitem
                                                                .listOfTeam
                                                                .length > 0
                                                              ? ''
                                                              : '';
                                                          let subdepActive =
                                                            subitem.id ==
                                                              elem.subDepartmentId
                                                              ? 'dropactiveTitle'
                                                              : '';
                                                          return [
                                                            <li
                                                              className={
                                                                subdepLen +
                                                                ' ' +
                                                                subdepActive
                                                              }
                                                              onMouseOver={event => {
                                                                this.handleChangeMouseOver(
                                                                  event,
                                                                  subitem.id,
                                                                  index,
                                                                  'TEAM',
                                                                  subindex
                                                                );
                                                              }}
                                                              onClick={event => {
                                                                this.handleChangeSelect(
                                                                  event,
                                                                  'subDepartmentId',
                                                                  subitem.id,
                                                                  catIndex,
                                                                  item.id
                                                                  ,'','',item.name,subitem.name
                                                                );
                                                              }}
                                                            >
                                                             <span className="costTitle"> {subitem.name}</span>
                                                                  {subitem.listOfTeam &&
                                                                subitem
                                                                  .listOfTeam
                                                                  .length >
                                                                0 ? (
                                                                  <ul>
                                                                    {subitem.listOfTeam.map(
                                                                      (
                                                                        subSubItem,
                                                                        subindex
                                                                      ) => [
                                                                          <li
                                                                            className={
                                                                              subSubItem.id ==
                                                                                elem.teamId
                                                                                ? 'dropactiveTitle'
                                                                                : ''
                                                                            }
                                                                            onClick={event => {
                                                                              this.handleChangeSelect(
                                                                                event,
                                                                                'teamId',
                                                                                subSubItem.id,
                                                                                catIndex,
                                                                                item.id,
                                                                                subitem.id
                                                                                ,'',item.name,subitem.name,subSubItem.name
                                                                              );
                                                                            }}
                                                                          >
                                                                           <span className="costTitle"> {
                                                                              subSubItem.name
                                                                            }</span>
                                                                          </li>
                                                                        ]
                                                                    )}
                                                                  </ul>
                                                                ) : (
                                                                  ''
                                                                )}
                                                            </li>
                                                          ];
                                                        }
                                                      )}
                                                    </ul>
                                                  ) : (
                                                    ''
                                                  )}
                                              </li>
                                            ];
                                          }
                                        )}
                                    </ul>
                                  </DropdownButton>
                                  </div>
                                  </td>
                                     
                    
                                  


                              <td className="autosuggestionWrap purchasingSuggest">
                                 <div className="flex align-center"> 
                                  <label className="label--radio m-l-5">
                                    <input
                                    type="radio"
                                    className="radio"
                                    name="inputAmountBy"/>
                                    </label>
                                  <FormControl
                                    type="text"
                                    name="costCenterManagerName"
                                    placeholder='Local HOD'
                                    autoComplete="off"
                                  //  value={elem.localhod}
                                    autoComplete="off"
                                    name="searchKeword1"
                                    placeholder="Search for..."
                                    value={elem.costCenterManagerName}
                                    onChange={event => {
                                      this.handleOnChangeKeyword(event,catIndex,'costCenterManagerName');
                                    }}
                                    onKeyUp={event => {this.getPartByKeyword(event,catIndex,'costCenterManagerName','costCenterManagerSearching','searchAutoListCostCenterManager')}}
                                  />
                                  {elem.searchAutoListCostCenterManager ? (
                                    <div className="searchautolist">
                                      <ul>
                                        {this.state.costCenterManagerSearching && this.state.costCenterManagerSearching.map((data, sIdx) => {                                
                                          return (
                                            <li key={sIdx}>
                                              <span
                                                onClick={event => {
                                                  this.onChangeAutoList(event, data,catIndex,'costCenterManagerName','costCenterManagerId','searchAutoListCostCenterManager');
                                                }}>{data.firstName +' '+ data.lastName}</span>
                                            </li>
                                          )
                                        })}
                                      </ul>
                                    </div>) : ''
                                  }
                                  </div>
                                  </td>
                                 
                                {/* <td>
                                  <FormControl
                                          type="text"
                                          name="localHODUserName"
                                          placeholder='Local HOD'
                                        //  value={elem.localhod}
                                          autoComplete="off"
                                          name="searchKeword"
                                          placeholder="Search for..."
                                          value={elem.localHODUserName}
                                          onChange={event => {
                                            this.handleOnChangeKeyword(event,catIndex,'localHODUserName');
                                          }}
                                          onKeyUp={event => {this.getPartByKeyword(event,catIndex,'localHODUserName','localSearchingHOD','searchAutoListLocalHOD')}}
                                        />
                                        {elem.searchAutoListLocalHOD ? (
                                          <div className="searchautolist">
                                            <ul>
                                              {this.state.localSearchingHOD && this.state.localSearchingHOD.map((data, sIdx) => {                                
                                                return (
                                                  <li key={sIdx}>
                                                    <span
                                                      onClick={event => {
                                                        this.onChangeAutoList(event, data,catIndex,'localHODUserName','localHODUserId','searchAutoListLocalHOD');
                                                      }}>{data.firstName +' '+ data.lastName}</span>
                                                  </li>
                                                )
                                              })}
                                            </ul>
                                          </div>) : ''
                                        }
                                        </td> */}
                                      {/* <td>
                                        <FormControl
                                          type="text"
                                          name="regionalHODUserName"
                                          autoComplete="off"
                                          //value={elem.regionalhod}
                                          placeholder='Regional HOD'
                                          value={elem.regionalHODUserName}
                                          onChange={event => {
                                            this.handleOnChangeKeyword(event,catIndex,'regionalHODUserName');
                                          }}
                                          onKeyUp={event => {this.getPartByKeyword(event,catIndex,'regionalHODUserName','regionalSearchingHOD','searchAutoListRegionalHOD')}}
                                        />
                                        
                                        {elem.searchAutoListRegionalHOD ? (
                                          <div className="searchautolist">
                                            <ul>
                                              {this.state.regionalSearchingHOD && this.state.regionalSearchingHOD.map((data, sIdx) => {                                
                                                return (
                                                  <li key={sIdx}>
                                                    <span
                                                      onClick={event => {
                                                        this.onChangeAutoList(event, data,catIndex,'regionalHODUserName','regionalHODUserId','searchAutoListRegionalHOD');
                                                      }}>{data.firstName +' '+ data.lastName}</span>
                                                  </li>
                                                )
                                              })}
                                            </ul>
                                          </div>) : ''
                                        }
                                        
                                        </td> */}
                                      {/* <td><FormControl
                                      type="text"
                                      name="globalhod"
                                      autoComplete="off"
                                     // value={elem.globalhod}
                                      placeholder='Global HOD'
                                      value={elem.globalHODUserName}
                                      onChange={event => {
                                        this.handleOnChangeKeyword(event,catIndex,'globalHODUserName');
                                      }}
                                      onKeyUp={event => {this.getPartByKeyword(event,catIndex,'globalHODUserName','globalSearchingHOD','searchAutoListGlobalHOD')}}
                                    />
                                    
                                    {elem.searchAutoListGlobalHOD ? (
                                      <div className="searchautolist">
                                        <ul>
                                          {this.state.globalSearchingHOD && this.state.globalSearchingHOD.map((data, sIdx) => {                                
                                            return (
                                              <li key={sIdx}>
                                                <span
                                                  onClick={event => {
                                                    this.onChangeAutoList(event, data,catIndex,'globalHODUserName','globalHODUserId','searchAutoListGlobalHOD');
                                                  }}>{data.firstName +' '+ data.lastName}</span>
                                              </li>
                                            )
                                          })}
                                        </ul>
                                      </div>) : ''
                                    }
                                    </td> */}
                                      {/* <td><FormControl
                                          type="text"
                                          name="localFPUserName"
                                          autoComplete="off"
                                         // value={elem.localFPandA}
                                          placeholder='Local FP&A'
                                          value={elem.localFPUserName}
                                          onChange={event => {
                                            this.handleOnChangeKeyword(event,catIndex,'localFPUserName');
                                          }}
                                          onKeyUp={event => {this.getPartByKeyword(event,catIndex,'localFPUserName','localSearchingFP','searchAutoListLocalFP')}}
                                        />
                                        
                                        {elem.searchAutoListLocalFP ? (
                                          <div className="searchautolist">
                                            <ul>
                                              {this.state.localSearchingFP && this.state.localSearchingFP.map((data, sIdx) => {                                
                                                return (
                                                  <li key={sIdx}>
                                                    <span
                                                      onClick={event => {
                                                        this.onChangeAutoList(event, data,catIndex,'localFPUserName','localFPUserId','searchAutoListLocalFP');
                                                      }}>{data.firstName +' '+ data.lastName}</span>
                                                  </li>
                                                )
                                              })}
                                            </ul>
                                          </div>) : ''
                                        }
                                        
                                        </td> */}
                                   {/* <td>
                                    <FormControl
                                      type="text"
                                      name="regionalFPUserName"
                                      //value={elem.regionalFPandA}
                                      autoComplete="off"
                                      placeholder='Regional FP&A'
                                      value={elem.regionalFPUserName}
                                      onChange={event => {
                                        this.handleOnChangeKeyword(event,catIndex,'regionalFPUserName');
                                      }}
                                      onKeyUp={event => {this.getPartByKeyword(event,catIndex,'regionalFPUserName','regionalSearchingFP','searchAutoListRegionalFP')}}
                                    />
                                    
                                    {elem.searchAutoListRegionalFP ? (
                                      <div className="searchautolist">
                                        <ul>
                                          {this.state.regionalSearchingFP && this.state.regionalSearchingFP.map((data, sIdx) => {                                
                                            return (
                                              <li key={sIdx}>
                                                <span
                                                  onClick={event => {
                                                    this.onChangeAutoList(event, data,catIndex,'regionalFPUserName','regionalFPUserId','searchAutoListRegionalFP');
                                                  }}>{data.firstName +' '+ data.lastName}</span>
                                              </li>
                                            )
                                          })}
                                        </ul>
                                      </div>) : ''
                                    }
                                        
                                        </td> */}
                                    {/* <td>
                                       <FormControl
                                          type="text"
                                          name="regionalCFOUserName"
                                         // value={elem.regionalcfo}
                                          placeholder='Regional CFO'
                                          autoComplete="off"
                                          value={elem.regionalCFOUserName}
                                          onChange={event => {
                                            this.handleOnChangeKeyword(event,catIndex,'regionalCFOUserName');
                                          }}
                                          onKeyUp={event => {this.getPartByKeyword(event,catIndex,'regionalCFOUserName','regionalSearchingCFO','searchAutoListRegionalCFO')}}
                                        />
                                        
                                        {elem.searchAutoListRegionalCFO ? (
                                          <div className="searchautolist">
                                            <ul>
                                              {this.state.regionalSearchingCFO && this.state.regionalSearchingCFO.map((data, sIdx) => {                                
                                                return (
                                                  <li key={sIdx}>
                                                    <span
                                                      onClick={event => {
                                                        this.onChangeAutoList(event, data,catIndex,'regionalCFOUserName','regionalCFOUserId','searchAutoListRegionalCFO');
                                                      }}>{data.firstName +' '+ data.lastName}</span>
                                                  </li>
                                                )
                                              })}
                                            </ul>
                                          </div>) : ''
                                        }
                                        
                                        </td> */}
                                     <td>
                                      <FormControl
                                          type="text"
                                          name="globalCFOUserName"
                                          //value={elem.globalcfo}
                                          autoComplete="off"
                                          placeholder='Global CFO'
                                          value={elem.globalCFOUserName}
                                          onChange={event => {
                                            this.handleOnChangeKeyword(event,catIndex,'globalCFOUserName');
                                          }}
                                          onKeyUp={event => {this.getPartByKeyword(event,catIndex,'globalCFOUserName','globalSearchingCFO','searchAutoListGlobalCFO')}}
                                        />
                                        {elem.searchAutoListGlobalCFO ? (
                                          <div className="searchautolist">
                                            <ul>
                                              {this.state.globalSearchingCFO && this.state.globalSearchingCFO.map((data, sIdx) => {                                
                                                return (
                                                  <li key={sIdx}>
                                                    <span
                                                      onClick={event => {
                                                        this.onChangeAutoList(event, data,catIndex,'globalCFOUserName','globalCFOUserId','searchAutoListGlobalCFO');
                                                      }}>{data.firstName +' '+ data.lastName}</span>
                                                  </li>
                                                )
                                              })}
                                            </ul>
                                          </div>) : ''
                                        }
                                        </td>
                        
                                      {/* <td>
                                          <div
                                            className="flex align-center"
                                            onClick={() => {
                                              this.deleteConfirmation(
                                                elem.id,
                                                catIndex
                                              );
                                            }}
                                          >
                                            <span className="ico-action-sm">
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#deleteIco`}
                                                />
                                              </svg>
                                            </span>
                                          </div>
                                      </td> */}
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </Table>
                        </div>
                        {/* <div className=" m-b-20">
                          <div className=" mb-30 mt-15">
                            <span
                              className="cursor-pointer "
                              onClick={event => {
                                this.addCategory(event);
                              }}
                            >
                              <span className="ico-add">
                                <svg>
                                  <use xlinkHref={`${Sprite}#plus-OIco`} />
                                </svg>
                              </span>
                              &nbsp;Add Category
                            </span>{' '}
                         
                          </div>
                        </div> */}
                      </div>
   {/* &nbsp; &nbsp; &nbsp; &nbsp;
                            <span
                              className="cursor-pointer"
                              onClick={event => {
                                this.removeCategory(event, tableIndex);
                              }}
                            >
                              <span className="ico-minusgly"> </span>
                              &nbsp;Remove Category
                            </span> */}

                {/* <div className="text-center m-b-20">
                  <button
                    className="btn btn-primary text-uppercase sm-btn"
                    onClick={this.addTable}
                  >
                    Add Functional Area
                  </button>{' '}
                  <button
                    className="btn btn-primary text-uppercase sm-btn"
                    onClick={this.removeTable}
                  >
                    Remove Functional Area
                  </button>
                </div> */}
                <div className="text-center m-b-20">
                  {/* <button to="home" className="btn btn-default text-uppercase">
                    Cancel
                  </button> */}
                  {this.state.showSaveRedirect ? (
                    <Link
                      to="home"
                      className="btn btn-success text-uppercase"
                      onClick={this.savePurchaseCategory}
                    >
                      Save link
                    </Link>
                  ) : (
                    <button
                      className="btn btn-success text-uppercase"
                      onClick={this.savePurchaseCategory}
                    >
                      Save
                    </button>
                  )}
                </div>

              </div>
            </div>
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
                        this.deleteCategory(
                          event,
                          this.state.categoryIndex,
                          this.state.id,
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
            <Footer
              pageTitle={permissionConstant.footer_title.build_plan_eco}
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
      actionGetPurchaseCategoryData,
      actionCheckAccountNo,
      actionSavePurchaseData,
      actionGetClassifications,
      actionGetDiscription,
      actionDeletePurchaseData,
      actionSuggessionData,
      actionSearchPartByKeyword
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User,
    buyerData: state.BuyerData,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Purchasing);
