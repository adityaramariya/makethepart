import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DropdownButton, Table, FormControl, FormGroup, Modal } from 'react-bootstrap';
import xlsImage from '../../img/xls.png';
import pdfImage from '../../img/pdf.png';
import docImage from '../../img/doc.png';
import Sprite from '../../img/sprite.svg';
import ReactToPrint from 'react-to-print';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetDiscloserData,
  actionApproveRejectNonDiscloser,
  actionGetClassifications,
  actionGetProjectListForIndirectPurchase,
  actionGetPartListForIndirectPurchase,
  actionUploadSpecificationForIndirect,
  actionUploadStatementOfWorkForIndirect,
  actionSubmitIndirectPurchase,
  actionGetListOfIndirectPurchase,
  actionDeleteOfIndirectPurchase
} from '../../common/core/redux/actions';
import {
  showSuccessToast,
  showErrorToast,
  convertToDate,
  convertToTimeStamp
} from '../../common/commonFunctions';
import Header from '../common/header';
import SideBar from '../common/sideBar';
import Slider from 'react-slick';
import Footer from '../common/footer';
import CONSTANTS from '../../common/core/config/appConfig';
import { handlePermission } from '../../common/permissions';
// import * as Datetime from 'react-datetime';
import * as moment from 'moment';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

let { permissionConstant } = CONSTANTS;
let { validationMessages } = CONSTANTS;

class BuildPlanECO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'eleven',
      indirectPurchaseRowObject: {
        catIndex: 1,
        isSelected: false,
        purchaseRequestNumber:
          'INP' + '#' + ((Math.random() * 0xffffff) << 0).toString(16),
        itemDescription: '',
        projectId: '',
        region: '',
        referencePartId: '',
        department: '',
        mainCategory: '',
        spendCategory: '',
        subCategory: '',
        plant: '',
        spendingAccount: '',
        accountDescription: '',
        currency: '',
        totalBudget: '',
        amountAvailable: '',
        UOM: '',
        quantity: '',
        specification: {
          documentType: '',
          mediaName: '',
          mediaURL: '',
          mediaType: '',
          mediaSize: '',
          mediaExtension: '',
          isSelected: false
        },
        statementOfWork: {
          documentType: '',
          mediaName: '',
          mediaURL: '',
          mediaType: '',
          mediaSize: '',
          mediaExtension: '',
          isSelected: false
        },
        targetDeliveryDate: '',
        targetCompletionDate: '',
        deliveryAddress: '',
        projectLocation: '',
        specificQualityRequirement: '',
        milestones: [
          {
            id: '',
            milestoneNumber: 0,
            milestoneName: '',
            targetDate: '',
            deliveryCriteria: '',
            paymentValue: '',
            paymentPercentage: 0
          }
        ],
        listOfParts: []
      },
      show: false,
      showPreview: false,
      listOfPreviewData: [],
      listOfProject: [],
      counter: 0,
      milestoneArray: [],
      milestoneValue: [],
      deleteIndirectPurchaseArray: [],
      listOfMilestone: [],
      milestoneObject: {
        milestoneNumber: '',
        milestoneName: '',
        targetDate: '',
        deliveryCriteria: '',
        paymentValue: '',
        paymentPercentage: ''
      },
      elementMilestone: [],
      deleteConformationModal: false
    };

    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.handleMileStone = this.handleMileStone.bind(this);
    this.handleCloseModel = this.handleCloseModel.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleUploadSpecification = this.handleUploadSpecification.bind(this);
    this.handleUploadStatementOfWork = this.handleUploadStatementOfWork.bind(
      this
    );
    this.handleOnChangeMilestone = this.handleOnChangeMilestone.bind(this);
    this.handleAction = this.handleAction.bind(this);
    // this.handleIndirectPurchaseView = this.handleIndirectPurchaseView.bind(
    //   this
    // );
    this.handleIndirectPurchasePreview = this.handleIndirectPurchasePreview.bind(
      this
    );
    this.handleHidePreview = this.handleHidePreview.bind(this);
    this.handleMilestonePreview = this.handleMilestonePreview.bind(this);
    this.handleHideMilestone = this.handleHideMilestone.bind(this);
    this.removeIndirectPurchaseDataRow = this.removeIndirectPurchaseDataRow.bind(
      this
    );
    this.handleNumericFilter = this.handleNumericFilter.bind(this);
    this.deleteConfirmation = this.deleteConfirmation.bind(this);
    this.handleCloseConformation = this.handleCloseConformation.bind(this);
  }

  componentDidMount() {
    let _this = this;
    this.setState({
      listOfIndirectPurchase: []
    });

    //Manage Milestone Array
    let listOfMilestone = this.state.listOfMilestone;
    for (let i = 0; i < 5; i++) {
      let milestoneObject = this.state.milestoneObject;
      milestoneObject.catIndex = i;
      listOfMilestone.push(milestoneObject);
    }

    this.setState({
      listOfMilestone: listOfMilestone
    });

    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };

    this.props
      .actionGetClassifications(data)
      .then((result, error) => {
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
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    this.props
      .actionGetProjectListForIndirectPurchase(data)
      .then((result, error) => {
        let projectList = result.payload.data.resourceData;
        this.setState({
          listOfProject: projectList
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    this.props
      .actionGetListOfIndirectPurchase(data)
      .then((result, error) => {
        let purchaseResponse = result.payload.data.resourceData;
        this.setState({ listOfIndirectPurchase: purchaseResponse });

        this.state.listOfIndirectPurchase &&
          this.state.listOfIndirectPurchase.forEach(function(
            element,
            catIndex
          ) {
            if (element.project && element.project.id) {
              _this.handlePartByProject(element.project.id, catIndex);
            }
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
  addIndirectPurchaseDataRow(e) {
    // let listOfIndirectPurchase = this.state.listOfIndirectPurchase;
    // listOfIndirectPurchase.push(this.state.indirectPurchaseRowObject);
    // this.setState({ listOfIndirectPurchase: listOfIndirectPurchase });
    let counter = this.state.counter;
    this.setState({ counter: counter + 1 });
    let indirectPurchaseRowObject = {
      catIndex: this.state.counter,
      purchaseRequestNumber:
        'INP' + '#' + ((Math.random() * 0xffffff) << 0).toString(16),
      itemDescription: '',
      projectId: '',
      region: '',
      referencePartId: '',
      department: '',
      mainCategory: '',
      spendCategory: '',
      subCategory: '',
      plant: '',
      spendingAccount: '',
      accountDescription: '',
      currency: '',
      totalBudget: '',
      amountAvailable: '',
      UOM: '',
      quantity: '',
      specification: {
        documentType: '',
        mediaName: '',
        mediaURL: '',
        mediaType: '',
        mediaSize: '',
        mediaExtension: '',
        isSelected: false
      },
      statementOfWork: {
        documentType: '',
        mediaName: '',
        mediaURL: '',
        mediaType: '',
        mediaSize: '',
        mediaExtension: '',
        isSelected: false
      },
      targetDeliveryDate: '',
      targetCompletionDate: '',
      deliveryAddress: '',
      projectLocation: '',
      specificQualityRequirement: '',
      milestones: [],
      listOfParts: []
    };
    let length = this.state.listOfIndirectPurchase
      ? this.state.listOfIndirectPurchase.length
      : 0;

    if (length == 0) {
      if (this.state.listOfIndirectPurchase)
        this.setState({
          listOfIndirectPurchase: [
            ...this.state.listOfIndirectPurchase,
            indirectPurchaseRowObject
          ]
        });
      else
        this.setState({
          listOfIndirectPurchase: [indirectPurchaseRowObject]
        });
    } else if (length != 0) {
      let arratElement = length - 1;
      if (this.state.listOfIndirectPurchase[arratElement].projectId != '') {
        if (this.state.listOfIndirectPurchase)
          this.setState({
            listOfIndirectPurchase: [
              ...this.state.listOfIndirectPurchase,
              indirectPurchaseRowObject
            ]
          });
        else
          this.setState({
            listOfIndirectPurchase: [indirectPurchaseRowObject]
          });
      } else {
        showErrorToast(validationMessages.Indirect.projectError);
      }
    }
  }
  removeIndirectPurchaseDataRow(e) {
    if (this.state.deleteIndirectPurchaseArray.length > 0) {
      let _this = this;
      let deleteId = '';
      let listOfIndirectPurchase = this.state.listOfIndirectPurchase;
      let listOfIds = [];
      let deleteIndirectPurchaseArray = this.state.deleteIndirectPurchaseArray
        ? this.state.deleteIndirectPurchaseArray
        : [];
      this.state.deleteIndirectPurchaseArray.forEach(function(item, catIndex) {
        deleteId = item;

        let idsList1 = _.result(
          _.find(listOfIndirectPurchase, function(description) {
            return description.purchaseRequestNumber === item;
          }),
          'id'
        );
        idsList1 ? listOfIds.push(idsList1) : [];
        _.remove(listOfIndirectPurchase, currentObject => {
          return currentObject.purchaseRequestNumber === deleteId;
        });
      });
      this.setState({ listOfIndirectPurchase: listOfIndirectPurchase });
      this.setState({ deleteConformationModal: false });
      if (listOfIds && listOfIds.length > 0) {
        let data = {
          listOfIds: listOfIds,
          roleId: this.props.userInfo.userData.userRole,
          userId: this.props.userInfo.userData.id
        };
        this.props
          .actionDeleteOfIndirectPurchase(data)
          .then((result, error) => {
            _this.props.actionLoaderHide();
          })
          .catch(e => _this.props.actionLoaderHide());
      } else {
        showSuccessToast('Indirect Purchase Request deleted successfully');
      }
      this.state.deleteIndirectPurchaseArray.pop(deleteId);
      this.setState({
        deleteIndirectPurchaseArray: deleteIndirectPurchaseArray
      });
    } else {
      showErrorToast(validationMessages.Indirect.deleteError);
    }
  }

  addMilestone(type) {
    if (this.state.milestoneArray.length > 0) {
      this.setState({
        show: true
      });
    } else {
      showErrorToast(validationMessages.Indirect.milestoneError);
    }
  }

  handleCloseModel() {
    this.setState({
      show: false
    });
  }

  handleMileStone() {
    this.setState({
      show: false
    });
  }

  handlePartByProject(projectId, catIndex) {
    let _this = this;
    let listOfIndirectPurchase = this.state.listOfIndirectPurchase;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      projectId: projectId
    };

    this.props
      .actionGetPartListForIndirectPurchase(data)
      .then((result, error) => {
        let listOfParts = result.payload.data.resourceData;
        listOfIndirectPurchase[catIndex]['listOfParts'] = listOfParts;

        this.setState({
          listOfIndirectPurchase: listOfIndirectPurchase
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleOnChange(event, catIndex) {
    const { name, value } = event.target;
    const { options, selectedIndex } = event.target;
    const projectCode =
      event.target.options &&
      event.target.options[selectedIndex].getAttribute('data-project-code');

    let listOfIndirectPurchaseData = this.state.listOfIndirectPurchase;
    let documentTypeListJson = listOfIndirectPurchaseData[catIndex];
    documentTypeListJson[name] = value;

    if (name === 'department') {
      documentTypeListJson.departmentRes = {};
      documentTypeListJson.departmentRes.department =
        options[selectedIndex].innerHTML;
      documentTypeListJson.departmentRes.id = value;
    } else if (name === 'mainCategory') {
      documentTypeListJson.mainCategoryRes = {};
      documentTypeListJson.mainCategoryRes.mainCatgeory =
        options[selectedIndex].innerHTML;
      documentTypeListJson.mainCategoryRes.id = value;
    } else if (name === 'spendCategory') {
      documentTypeListJson.spendCategoryRes = {};
      documentTypeListJson.spendCategoryRes.spendCategory =
        options[selectedIndex].innerHTML;
      documentTypeListJson.spendCategoryRes.id = value;
    } else if (name === 'subCategory') {
      documentTypeListJson.subCategoryRes = {};
      documentTypeListJson.subCategoryRes.subCategory =
        options[selectedIndex].innerHTML;
      documentTypeListJson.subCategoryRes.id = value;
    } else if (name === 'referencePartId') {
      documentTypeListJson.referencePart = {};
      documentTypeListJson.referencePart.partNumber =
        options[selectedIndex].innerHTML;
      documentTypeListJson.referencePart.id = value;
    } else if (name === 'projectId') {
      documentTypeListJson.project = {};
      documentTypeListJson.project.projectCode = projectCode;
      documentTypeListJson.project.id = value;
    }

    // department: indirectPurchaseIndexData.department,
    // mainCategory: indirectPurchaseIndexData.mainCategory,
    // spendCategory: indirectPurchaseIndexData.spendCategory,
    // subCategory: indirectPurchaseIndexData.subCategory,
    // plant: indirectPurchaseIndexData.plant,
    // spendingAccount: indirectPurchaseIndexData.spendingAccount,

    listOfIndirectPurchaseData[catIndex] = documentTypeListJson;
    this.setState({ listOfIndirectPurchase: listOfIndirectPurchaseData });

    if (name === 'projectId') {
      this.handlePartByProject(value, catIndex);
    }
  }
  handleOnChangeMilestone(event, catIndex) {
    const { name, value } = event.target;
    console.log('name, value---', name, value);
    let listOfMilestone = JSON.parse(
      JSON.stringify(this.state.listOfMilestone)
    );
    //make changes to ingredients
    if (name == 'paymentPercentage')
      listOfMilestone[catIndex][name] = parseFloat(value)
        ? parseFloat(value)
        : '';
    else if (name == 'milestoneNumber')
      listOfMilestone[catIndex][name] = parseFloat(value)
        ? parseFloat(value)
        : '';
    // else if (name == 'targetDate') {
    //   listOfMilestone[catIndex][name] = value ? value : '';
    // }
    else listOfMilestone[catIndex][name] = value;

    // this.setState((prevState, props) => {
    //   prevState.listOfMilestone;
    //   return { listOfMilestone: prevState.listOfMilestone };
    // })

    this.setState({
      listOfMilestone: JSON.parse(JSON.stringify(listOfMilestone)),
      milestoneValue: listOfMilestone
    });

    console.log(
      this.state.listOfMilestone,
      '--------------',
      this.state.milestoneValue
    );
  }

  handleAction(event, catIndex, id, purchaseRequestNumber) {
    const { name, value } = event.target;
    const selected = event.target.checked;
    let milestoneArray = this.state.milestoneArray;
    let deleteIndirectPurchaseArray = this.state.deleteIndirectPurchaseArray;

    let listOfIndirectPurchaseData = this.state.listOfIndirectPurchase;
    let listOfIndirectPurchaseDataJson = listOfIndirectPurchaseData[catIndex];
    if (selected) {
      milestoneArray.push(value);

      deleteIndirectPurchaseArray.push(purchaseRequestNumber);
      // deleteIndirectPurchaseArray;

      this.setState({
        milestoneArray: milestoneArray,
        deleteIndirectPurchaseArray: deleteIndirectPurchaseArray
      });

      listOfIndirectPurchaseDataJson.isSelected = true;
    } else {
      milestoneArray.pop(value);

      deleteIndirectPurchaseArray.pop(purchaseRequestNumber);
      // deleteIndirectPurchaseArray;

      this.setState({
        milestoneArray: milestoneArray,
        deleteIndirectPurchaseArray: deleteIndirectPurchaseArray
      });

      listOfIndirectPurchaseDataJson.isSelected = false;
    }
    listOfIndirectPurchaseData[catIndex] = listOfIndirectPurchaseDataJson;
    this.setState({ listOfIndirectPurchase: listOfIndirectPurchaseData });
  }

  handleOnSubmitMilestone(event, catIndex) {
    let _this = this;
    let listOfMileStone = [];
    // const covertToTimeStamp = momentObject => {
    //   return moment(momentObject).format('x');
    // };
    let listOfMilestone = this.state.listOfMilestone;
    this.state.listOfMilestone.forEach(function(item, catIndex) {
      let listOfMilestoneIndexData = listOfMilestone[catIndex];

      listOfMileStone.push({
        //id: listOfMilestoneIndexData.id ? listOfMilestoneIndexData.id : 0,
        milestoneName: listOfMilestoneIndexData.milestoneName,
        milestoneNumber: listOfMilestoneIndexData.milestoneNumber,
        paymentPercentage: listOfMilestoneIndexData.paymentPercentage,
        paymentValue: listOfMilestoneIndexData.paymentValue,
        targetDate: listOfMilestoneIndexData.targetDate
          ? listOfMilestoneIndexData.targetDate
          : '',
        deliveryCriteria: listOfMilestoneIndexData.deliveryCriteria
      });
    });

    let milestoneArray = this.state.milestoneArray;
    let indirectPurchaseData = this.state.listOfIndirectPurchase;
    this.state.milestoneArray.forEach(function(item, catIndex) {
      let milestoneArrayIndexData = milestoneArray[catIndex];
      if (indirectPurchaseData && indirectPurchaseData[milestoneArrayIndexData])
        indirectPurchaseData[milestoneArrayIndexData][
          'milestones'
        ] = listOfMileStone;
    });
    this.setState({
      listOfIndirectPurchase: indirectPurchaseData,
      show: false
    });
  }

  handleOnSubmit(event, catIndex) {
    let _this = this;
    let listOfIndirectPurchase = [];
    let flag = true;
    let showError = '';
    let errorMsg = [];
    // const covertToTimeStamp = momentObject => {
    //   return moment(momentObject).format('x');
    // };
    let indirectPurchaseData = this.state.listOfIndirectPurchase;




    this.state.listOfIndirectPurchase.forEach(function(item, catIndex) {
      let indirectPurchaseIndexData = indirectPurchaseData[catIndex];
      console.log("handleOnSubmit----",indirectPurchaseIndexData,'@@@', indirectPurchaseIndexData.brandId);
      if (
        indirectPurchaseIndexData.specification &&
        indirectPurchaseIndexData.specification.length
      ) {
        for (
          let i = 0;
          i < indirectPurchaseIndexData.specification.length;
          i++
        ) {
          if (indirectPurchaseIndexData.specification[i].mediaURL) {
            indirectPurchaseIndexData.specification[
              i
            ].mediaURL = indirectPurchaseIndexData.specification[i].mediaURL
              .split('/')
              .pop(-1);
            indirectPurchaseIndexData.specification[
              i
            ].mediaThumbnailUrl = indirectPurchaseIndexData.specification[
              i
            ].mediaThumbnailUrl
              .split('/')
              .pop(-1);
          }
        }
      }

      if (
        indirectPurchaseIndexData.statementOfWork &&
        indirectPurchaseIndexData.statementOfWork.length
      ) {
        for (
          let i = 0;
          i < indirectPurchaseIndexData.statementOfWork.length;
          i++
        ) {
          if (indirectPurchaseIndexData.statementOfWork[i].mediaURL) {
            indirectPurchaseIndexData.statementOfWork[
              i
            ].mediaURL = indirectPurchaseIndexData.statementOfWork[i].mediaURL
              .split('/')
              .pop(-1);
            indirectPurchaseIndexData.statementOfWork[
              i
            ].mediaThumbnailUrl = indirectPurchaseIndexData.statementOfWork[
              i
            ].mediaThumbnailUrl
              .split('/')
              .pop(-1);
          }
        }
      }

      if (indirectPurchaseIndexData.purchaseRequestNumber === '') {
        errorMsg.push('Please enter Purchase request number');
        flag = false;
      } else if (indirectPurchaseIndexData.projectId === '') {
        errorMsg.push('Please select Project');
        flag = false;
      }

      if (!indirectPurchaseIndexData.id) {
        let elementMilestones = indirectPurchaseIndexData.milestones;
        if (indirectPurchaseIndexData.milestones) {
          for (
            let catIndexShipment = 0;
            catIndexShipment < indirectPurchaseIndexData.milestones.length;
            catIndexShipment++
          ) {
            const elementMilestones =
              indirectPurchaseIndexData.milestones[catIndexShipment];
            if (elementMilestones.targetDate) {
              elementMilestones.targetDate = convertToTimeStamp(
                elementMilestones.targetDate
              );
            }
          }
        }

        listOfIndirectPurchase.push({
          //id: indirectPurchaseIndexData.id ? indirectPurchaseIndexData.id : 0,
          purchaseRequestNumber:
            indirectPurchaseIndexData.purchaseRequestNumber,
          itemDescription: indirectPurchaseIndexData.itemDescription,
          projectId: indirectPurchaseIndexData.projectId,
        //  region: indirectPurchaseIndexData.region,
          referencePartId: indirectPurchaseIndexData.referencePartId,
        //  departmentRequest: indirectPurchaseIndexData.department,
        //  mainCategoryRequest: indirectPurchaseIndexData.mainCategory,
        //  spendCategoryRequest: indirectPurchaseIndexData.spendCategory,
        //  subCategoryRequest: indirectPurchaseIndexData.subCategory,
          plant: indirectPurchaseIndexData.plant,
          spendingAccount: indirectPurchaseIndexData.spendingAccount,
          accountDescription: indirectPurchaseIndexData.accountDescription,
          currency: indirectPurchaseIndexData.currency,
          totalBudget: indirectPurchaseIndexData.totalBudget,
          amountAvailable: indirectPurchaseIndexData.amountAvailable,
          uom: indirectPurchaseIndexData.UOM,
          quantity: indirectPurchaseIndexData.quantity,
          //targetDeliveryDate: indirectPurchaseIndexData.targetDeliveryDate,
          //targetCompletionDate: indirectPurchaseIndexData.targetCompletionDate,
          deliveryAddress: indirectPurchaseIndexData.deliveryAddress,
          projectLocation: indirectPurchaseIndexData.projectLocation,
          specificQualityRequirement:
            indirectPurchaseIndexData.specificQualityRequirement,
          targetDeliveryDate: indirectPurchaseIndexData.targetDeliveryDate
            ? convertToTimeStamp(indirectPurchaseIndexData.targetDeliveryDate)
            : '',
          targetCompletionDate: indirectPurchaseIndexData.targetCompletionDate
            ? convertToTimeStamp(indirectPurchaseIndexData.targetCompletionDate)
            : '',
          statementOfWork: indirectPurchaseIndexData.statementOfWork
            ? indirectPurchaseIndexData.statementOfWork
            : [],
          specification: indirectPurchaseIndexData.specification
            ? indirectPurchaseIndexData.specification
            : [],
          listOfMilestoneRequest: elementMilestones ? elementMilestones : [],

          brandId: indirectPurchaseIndexData.brandId,
          subBrandId: indirectPurchaseIndexData.subBrandId,

          departmentId: indirectPurchaseIndexData.departmentId,
          subDepartmentId: indirectPurchaseIndexData.subDepartmentId,
          teamId: indirectPurchaseIndexData.teamId,

          majorCategoryId: indirectPurchaseIndexData.majorCategoryId,
          categoryId: indirectPurchaseIndexData.categoryId,
          subCategoryId: indirectPurchaseIndexData.subCategoryId,
          subSubCategoryId: indirectPurchaseIndexData.subSubCategoryId,

          sectorId: indirectPurchaseIndexData.sectorId,
          productLineId: indirectPurchaseIndexData.productLineId,
          modelFamilyId: indirectPurchaseIndexData.modelFamilyId,
          programId: indirectPurchaseIndexData.programId,

          geogrophyId: indirectPurchaseIndexData.geogrophyId,
          globalRegionId: indirectPurchaseIndexData.globalRegionId,
          globalSubRegionId: indirectPurchaseIndexData.globalSubRegionId,
          countryId: indirectPurchaseIndexData.countryId,
          zone: indirectPurchaseIndexData.zone,
          localBussinessRegion: indirectPurchaseIndexData.localBussinessRegion,
          district: indirectPurchaseIndexData.district,
          circle: indirectPurchaseIndexData.circle,
          area: indirectPurchaseIndexData.area,
          geogrophyId:indirectPurchaseIndexData.geogrophyId


        });
      }
    });

    console.log('listOfIndirectPurchase------', listOfIndirectPurchase);

    if (flag) {
      let data = {
        roleId: _this.props.userInfo.userData.userRole,
        userId: _this.props.userInfo.userData.id,
        indirectPurchaseRequestList: listOfIndirectPurchase
      };

      this.props
        .actionSubmitIndirectPurchase(data)
        .then((result, error) => {
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      if (errorMsg) {
        showError = errorMsg.join(',\r\n');
        showErrorToast(showError);
      }
    }
  }

  handleUploadSpecification(event, catIndex) {
    const fileObject = event.target.files[0];
    if (fileObject) {
      let _this = this;
      let specification = {};
      const formData = new FormData();
      formData.set('mFile', fileObject);
      formData.append('thumbnailHeight', 100);
      formData.append('thumbnailWidth', 100);
      formData.append('isCreateThumbnail', true);
      formData.append('fileKey', fileObject.name);
      formData.append('filePath', fileObject.name);

      this.props.actionLoaderShow();
      this.props
        .actionUploadSpecificationForIndirect(formData)
        .then((result, error) => {
          let mediaExtension = result.payload.data.filePath.split('.').pop(-1);
          specification.imageURL = result.payload.data.s3FilePath;
          specification.mediaName = result.payload.data.filePath;
          specification.mediaSize = result.payload.data.fileSize;
          specification.mediaExtension = mediaExtension;
          specification.mediaType = result.payload.data.contentType;
          specification.mediaThumbnailUrl =
            result.payload.data.s3ThumbnailFilePath;
          specification.mediaURL = result.payload.data.s3FilePath;
          let reqArray = specification;

          let partListUpdate = this.state.listOfIndirectPurchase;
          let partListUpdateJson = partListUpdate[catIndex];

          partListUpdateJson.specification = reqArray;

          partListUpdate[catIndex] = partListUpdateJson;

          this.setState({ listOfIndirectPurchase: partListUpdate });

          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }

  handleUploadStatementOfWork(event, catIndex) {
    const fileObject = event.target.files[0];
    if (fileObject) {
      let _this = this;
      let statementOfWork = {};
      let reqArray = [];
      const formData = new FormData();
      formData.set('mFile', fileObject);
      formData.append('thumbnailHeight', 100);
      formData.append('thumbnailWidth', 100);
      formData.append('isCreateThumbnail', true);
      formData.append('fileKey', fileObject.name);
      formData.append('filePath', fileObject.name);

      this.props.actionLoaderShow();
      this.props
        .actionUploadStatementOfWorkForIndirect(formData)
        .then((result, error) => {
          let mediaExtension = result.payload.data.filePath.split('.').pop(-1);
          statementOfWork.imageURL = result.payload.data.s3FilePath;
          statementOfWork.mediaName = result.payload.data.filePath;
          statementOfWork.mediaSize = result.payload.data.fileSize;
          statementOfWork.mediaExtension = mediaExtension;
          statementOfWork.mediaType = result.payload.data.contentType;
          statementOfWork.mediaThumbnailUrl =
            result.payload.data.s3ThumbnailFilePath;
          statementOfWork.mediaURL = result.payload.data.s3FilePath;
          let reqArray = statementOfWork;

          let partListUpdate = this.state.listOfIndirectPurchase;
          let partListUpdateJson = partListUpdate[catIndex];

          partListUpdateJson.statementOfWork = reqArray;

          partListUpdate[catIndex] = partListUpdateJson;

          this.setState({ listOfIndirectPurchase: partListUpdate });

          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }

  // handleIndirectPurchaseView(event, catIndex) {}

  handleIndirectPurchasePreview(event, data, type) {
    if (type == 'milestone') {
      this.setState({
        showPreview: true,
        listOfPreviewData: [data]
      });
    } else {
      this.setState({
        showPreview: true,
        listOfPreviewData: data
      });
    }
  }

  handleHidePreview() {
    this.setState({
      showPreview: false,
      listOfPreviewData: []
    });
  }

  handleMilestonePreview(event, data, type) {
    this.setState({
      showMilestonePreview: true,
      elementMilestone: data,
      milestoneValue: data
    });
  }
  handleHideMilestone() {
    this.setState({
      showMilestonePreview: false,
      elementMilestone: []
    });
  }

  handleNumericFilter(event) {
    let { name, value } = event.target;
    value = value.replace(/[^\0-9]/gi, '');
  }

  deleteConfirmation(event) {
    if (this.state.milestoneArray.length > 0) {
      this.setState({
        deleteConformationModal: true
      });
    } else {
      showErrorToast(validationMessages.Indirect.deleteProject);
    }
  }
  handleCloseConformation(event) {
    this.setState({
      deleteConformationModal: false
      //deleteIndirectPurchaseArray:[],
      //milestoneArray:[]
    });
  }
  handleOnChangeNumber(event, catIndex) {
    const { name, value } = event.target;
    let listOfIndirectPurchaseData = this.state.listOfIndirectPurchase;
    let documentTypeListJson = listOfIndirectPurchaseData[catIndex];
    documentTypeListJson[name] = parseFloat(value) ? parseFloat(value) : '';
    listOfIndirectPurchaseData[catIndex] = documentTypeListJson;
    this.setState({ listOfIndirectPurchase: listOfIndirectPurchaseData });

    //this.setState({[e.target.id]: parseInt(e.target.value) ? parseInt(e.target.value) : ''})
  }

  saveHeading(tableIndex) {
    let showHeading = this.state.showHeading;
    showHeading[tableIndex] = true;
    let noOfTable = this.state.noOfTable;
    let listOfFunctionalArea = this.state.listOfFunctionalArea;
    for (let i = 0; i <= listOfFunctionalArea.length; i++) {
      if (listOfFunctionalArea[i] === noOfTable[tableIndex].heading) {
        listOfFunctionalArea.splice(i, 1);
      }
    }
    this.setState({ showHeading: showHeading });
  }

  findCoordinate(e) {
    const targetElement = e.target.getBoundingClientRect();
    let cssContainer = document.getElementById('dateTimeCss');
    if (cssContainer && cssContainer.innerHTML == '')
      cssContainer.innerHTML =
        '.rdtPicker { left: ' + targetElement['x'] + 'px }';
  }
  handleChangeSelect(
    event,
    name,
    value,
    nameText,
    text,
    catIndex,
    parentId,
    parentIdTwo,
    parentIdThree
  ) {
    event.stopPropagation();
    event.preventDefault();
    let listOfIndirectPurchase= this.state.listOfIndirectPurchase;
    let _this = this;

    listOfIndirectPurchase[catIndex][name] = value;
    listOfIndirectPurchase[catIndex][nameText] = text;

    if (name == 'brandId') {
      listOfIndirectPurchase[catIndex].subBrandId = '';
    } else if (name == 'subBrandId') {
      listOfIndirectPurchase[catIndex]['brandId'] = parentId;
    }

    if (name == 'majorCategoryId') {
      listOfIndirectPurchase[catIndex].categoryId = '';
      listOfIndirectPurchase[catIndex].subCategoryId = '';
      listOfIndirectPurchase[catIndex].subSubCategoryId = '';
    } else if (name == 'categoryId') {
      listOfIndirectPurchase[catIndex].subCategoryId = '';
      listOfIndirectPurchase[catIndex].subSubCategoryId = '';
      listOfIndirectPurchase[catIndex].majorCategoryId = parentId;
    } else if (name == 'subCategoryId') {
      listOfIndirectPurchase[catIndex].subSubCategoryId = '';
      listOfIndirectPurchase[catIndex].majorCategoryId = parentId;
      listOfIndirectPurchase[catIndex].categoryId = parentIdTwo;
    } else if (name == 'subSubCategoryId') {
      listOfIndirectPurchase[catIndex].majorCategoryId = parentId;
      listOfIndirectPurchase[catIndex].categoryId = parentIdTwo;
      listOfIndirectPurchase[
        catIndex
      ].subCategoryId = parentIdThree;
    }

    if (name == 'departmentId') {
      listOfIndirectPurchase[catIndex].subDepartmentId = '';
      listOfIndirectPurchase[catIndex].teamId = '';
    } else if (name == 'subDepartmentId') {
      listOfIndirectPurchase[catIndex].teamId = '';
      listOfIndirectPurchase[catIndex].departmentId = parentId;
    } else if (name == 'teamId') {
      listOfIndirectPurchase[catIndex].departmentId = parentId;
      listOfIndirectPurchase[
        catIndex
      ].subDepartmentId = parentIdTwo;
    }

    if (name == 'sectorId') {
      listOfIndirectPurchase[catIndex].productLineId = '';
      listOfIndirectPurchase[catIndex].modelFamilyId = '';
      listOfIndirectPurchase[catIndex].programId = '';
    } else if (name == 'productLineId') {
      listOfIndirectPurchase[catIndex].modelFamilyId = '';
      listOfIndirectPurchase[catIndex].programId = '';
      listOfIndirectPurchase[catIndex].sectorId = parentId;
    } else if (name == 'modelFamilyId') {
      listOfIndirectPurchase[catIndex].programId = '';
      listOfIndirectPurchase[catIndex].sectorId = parentId;
      listOfIndirectPurchase[catIndex].productLineId = parentIdTwo;
    } else if (name == 'programId') {
      listOfIndirectPurchase[catIndex].sectorId = parentId;
      listOfIndirectPurchase[catIndex].productLineId = parentIdTwo;
      listOfIndirectPurchase[
        catIndex
      ].modelFamilyId = parentIdThree;
    }

    let listOfIndirectPurchaseElem = listOfIndirectPurchase[catIndex];
    if (!listOfIndirectPurchaseElem.accountNo) {
      let createdAccountNo =
        'acc' + moment().format('MMYYYYDD') + moment().format('sshhmm');
      if (
        listOfIndirectPurchaseElem.brandId &&
        listOfIndirectPurchaseElem.departmentId &&
        listOfIndirectPurchaseElem.majorCategoryId &&
        listOfIndirectPurchaseElem.sectorId &&
        listOfIndirectPurchaseElem.globalRegionId 
      ) {


        listOfIndirectPurchase[
          catIndex
        ].accountNo = createdAccountNo;
        listOfIndirectPurchase[catIndex].showAccountText = true;
      }
    }
    this.setState({ listOfIndirectPurchase: listOfIndirectPurchase });
  }

  handleChangeRegion(
    event,
    error,
    catIndex,
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
  let listOfIndirectPurchase= this.state.listOfIndirectPurchase;
  listOfIndirectPurchase[catIndex]['geogrophyId'] = id;
  listOfIndirectPurchase[catIndex]['globalRegionId'] = parentId;
  listOfIndirectPurchase[catIndex]['globalSubRegionId'] = parentIdTwo;
  listOfIndirectPurchase[catIndex]['countryId'] = parentIdThree;
  listOfIndirectPurchase[catIndex]['zone'] = parentIdFour;
  listOfIndirectPurchase[catIndex]['localBussinessRegion'] = parentIdFive;
  listOfIndirectPurchase[catIndex]['district'] = parentIdSix;
  listOfIndirectPurchase[catIndex]['circle'] = parentIdSeven;
  listOfIndirectPurchase[catIndex]['area'] = parentIdEight;

  let listOfIndirectPurchaseElem = listOfIndirectPurchase[catIndex];
  if (!listOfIndirectPurchaseElem.accountNo) {
    let createdAccountNo =
      'acc' + moment().format('MMYYYYDD') + moment().format('sshhmm');
    if (
      listOfIndirectPurchaseElem.brandId &&
      listOfIndirectPurchaseElem.departmentId &&
      listOfIndirectPurchaseElem.majorCategoryId &&
      listOfIndirectPurchaseElem.sectorId &&
      listOfIndirectPurchaseElem.globalRegionId 
    ) {
      listOfIndirectPurchaseElem[
        catIndex
      ].accountNo = createdAccountNo;
      listOfIndirectPurchaseElem[catIndex].showAccountText = true;
    }
  }
  this.setState({ listOfIndirectPurchase: listOfIndirectPurchase });
}
  }
  
  handleChange(event, catIndex, classificationType) {
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
    //     'acc' + moment().format('MMYYYYDD') + moment().format('sshhmm');
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
    let listOfIndirectPurchase= this.state.listOfIndirectPurchase;
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
          listOfIndirectPurchase: listOfIndirectPurchase
        });

        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }
  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === 'eleven' ? 'eleven' : 'none'}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === 'eleven' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <div className="flex justify-space-between align-center">
                  <h4 className="hero-title">Indirect Purchase Request</h4>

                  <div>
                    <button
                      className="btn btn-default"
                      onClick={() => {
                        this.addMilestone();
                      }}
                    >
                      Add milestone
                    </button>
                  </div>
                </div>
                <div className="m-b-15">
                  <Table
                    responsive
                    bordered
                    condensed
                    className="custom-table cell-input out-calander"
                  >
                    <thead>
                      <tr>
                        <th />
                        <th>Purchase request number</th>
                        <th>Program/Project</th>
                        <th>Reference part #</th>
                        <th>Item Description</th>

                        <th>Regions</th>
                        <th>Functional Area/Department</th>
                        <th>Main Category</th>
                        <th>Spend Category</th>
                        <th>Sub Category</th>

                        <th>Plant/Office</th>
                        <th>Spending Account</th>
                        <th>Account Description</th>
                        <th>Currency</th>
                        <th>Total Budget(this Year)</th>
                        <th>Amount Available</th>
                        <th>UOM</th>
                        <th>quantity</th>
                        <th>Specification</th>
                        <th>Statement of work</th>
                        <th>Target Delivery Date/ Start of Project</th>
                        <th>Target completion of Project</th>
                        <th>Delivery address</th>
                        <th>Project Location</th>
                        <th>Specific Quality requirement</th>
                        <th>Milestone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.listOfIndirectPurchase &&
                        this.state.listOfIndirectPurchase.map(
                          (elem, catIndex) => {
                            return (
                              <tr>
                                <td>
                                  <label className="label--checkbox">
                                    <input
                                      type="checkbox"
                                      className="checkbox"
                                      value={catIndex}
                                      checked={elem.isSelected ? true : false}
                                      name="isSelected"
                                      //disabled={elem.id ? true : false}
                                      onChange={event => {
                                        this.handleAction(
                                          event,
                                          catIndex,
                                          elem.id,
                                          elem.purchaseRequestNumber
                                        );
                                      }}
                                    />
                                  </label>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0">
                                    <FormControl
                                      type="text"
                                      className="br-0 "
                                      disabled={true}
                                      name="purchaseRequestNumber"
                                      placeholder="Purchase request number"
                                      value={elem.purchaseRequestNumber}
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      className="s-arrow br-0"
                                      componentClass="select"
                                      placeholder="select"
                                      value={elem.project && elem.project.id}
                                      name="projectId"
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    >
                                      <option value="">Select</option>
                                      {this.state.listOfProject.map(
                                        (item, catIndex) => {
                                          return (
                                            <option
                                              value={item.id}
                                              key={item.id}
                                              data-project-code={
                                                item.projectCode
                                              }
                                            >
                                              {item.projectCode} &nbsp; | &nbsp;{' '}
                                              {item.projectTitle} &nbsp; |
                                              &nbsp; {item.totalPartsPlanned}
                                            </option>
                                          );
                                        }
                                      )}
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      className="s-arrow br-0"
                                      componentClass="select"
                                      placeholder="select"
                                      value={
                                        elem.referencePart &&
                                        elem.referencePart.id
                                      }
                                      name="referencePartId"
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    >
                                      <option value="">Select</option>
                                      {elem.listOfParts &&
                                        elem.listOfParts.map(
                                          (item, catIndex) => {
                                            return (
                                              <option
                                                value={item.id}
                                                key={item.id}
                                              >
                                                {item.partNumber}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0">
                                    <FormControl
                                      type="text"
                                      className="br-0 "
                                      name="itemDescription"
                                      placeholder="Item Description"
                                      value={elem.itemDescription}
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>





<td className="custom-dd dropRf customdropdown">
                                        <DropdownButton
                                          title="select"
                                          name="Select specification"
                                          className="dropbgwhite w100"
                                        >
                                          <ul className="multi-level">
                                            {this.state.listOfGlobalRegions &&
                                              this.state.listOfGlobalRegions.map(
                                                (item, index) => [
                                                  <li
                                                  className={item.globalRegionId ==
                                                    elem.globalRegionId
                                                      ? 'dropactive submenus'
                                                      : 'submenus'}
                                                  >
                                                    {item.globalRegions}
                                                    {item.globalSubRegions &&
                                                    item.globalSubRegions
                                                      .length > 0 ? (
                                                      <ul class="innermenu">
                                                        {item.globalSubRegions.map(
                                                          (
                                                            subitem,
                                                            subindex
                                                          ) => [
                                                            <li
                                                              className={subitem.id ==
                                                                elem.globalSubRegionId
                                                                  ? 'dropactive submenus'
                                                                  : 'submenus'}

                                                              onClick={event =>
                                                                this.handleChangeRegion(
                                                                  event,
                                                                  'error'
                                                                )
                                                              }  
                                                            >
                                                              {subitem.name}
                                                              {subitem.countries &&
                                                              subitem.countries
                                                                .length > 0 ? (
                                                                <ul class="innermenu">
                                                                  {subitem.countries.map(
                                                                    (
                                                                      countryItem,
                                                                      countryIndex
                                                                    ) => [
                                                                      <li
                                                                        className={countryItem.id ==
                                                                          elem.countryId
                                                                            ? 'dropactive submenus'
                                                                            : 'submenus'}
                                                                        onClick={event =>
                                                                          this.handleChangeRegion(
                                                                            event,
                                                                            'error'
                                                                          )
                                                                        }
                                                                      >
                                                                        {
                                                                          countryItem.name
                                                                        }

                                                                        {countryItem.zones &&
                                                                        countryItem
                                                                          .zones
                                                                          .length >
                                                                          0 ? (
                                                                          <ul class="innermenu">
                                                                            {countryItem.zones.map(
                                                                              (
                                                                                zoneItem,
                                                                                zoneIndex
                                                                              ) => [
                                                                                <li
                                                                                className={zoneItem.name ==
                                                                                  elem.zone
                                                                                    ? 'dropactive submenus'
                                                                                    : 'submenus'}
                                                                                  onClick={event =>
                                                                                    this.handleChangeRegion(
                                                                                      event,
                                                                                      'error'
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {
                                                                                    zoneItem.name
                                                                                  }
                                                                                  {zoneItem.localBussinessRegion &&
                                                                                  zoneItem
                                                                                    .localBussinessRegion
                                                                                    .length >
                                                                                    0 ? (
                                                                                    <ul class="innermenu">
                                                                                      {zoneItem.localBussinessRegion.map(
                                                                                        (
                                                                                          localItem,
                                                                                          zoneIndex
                                                                                        ) => [
                                                                                          <li
                                                                                          className={localItem.name ==
                                                                                            elem.localBussinessRegion
                                                                                              ? 'dropactive submenus'
                                                                                              : 'submenus'}
                                                                                            onClick={event =>
                                                                                              this.handleChangeRegion(
                                                                                                event,
                                                                                                'error'
                                                                                              )
                                                                                            }
                                                                                          >
                                                                                            {
                                                                                              localItem.name
                                                                                            }
                                                                                   {localItem.districts &&
                                                                                  localItem
                                                                                    .districts
                                                                                    .length >
                                                                                    0 ? (
                                                                                    <ul class="innermenu">
                                                                                      {localItem.districts.map(
                                                                                        (
                                                                                          districtsItem,
                                                                                          zoneIndex
                                                                                        ) => [
                                                                                          <li
                                                                                          className={districtsItem.name ==
                                                                                            elem.district
                                                                                              ? 'dropactive submenus'
                                                                                              : 'submenus'}
                                                                                            onClick={event =>
                                                                                              this.handleChangeRegion(
                                                                                                event,
                                                                                                'error'
                                                                                              )
                                                                                            }
                                                                                          >
                                                                                            {
                                                                                              districtsItem.name
                                                                                            }
                                                                                      {districtsItem.circles &&
                                                                                  districtsItem
                                                                                    .circles
                                                                                    .length >
                                                                                    0 ? (
                                                                                    <ul class="innermenu">
                                                                                      {districtsItem.circles.map(
                                                                                        (
                                                                                          circlesItem,
                                                                                          zoneIndex
                                                                                        ) => [
                                                                                          <li     className={circlesItem.name ==
                                                                                            elem.circle
                                                                                              ? 'dropactive submenus'
                                                                                              : 'submenus'}
                                                                                          >
                                                                                            {
                                                                                              circlesItem.name
                                                                                            }




                                                                     {circlesItem.area &&
                                                                                  circlesItem
                                                                                    .area
                                                                                    .length >
                                                                                    0 ? (
                                                                                    <ul class="innermenu">
                                                                                      {circlesItem.area.map(
                                                                                        (
                                                                                          areaItem,
                                                                                          zoneIndex
                                                                                        ) => [
                                                                                          <li
                                                                                          className={areaItem.name ==
                                                                                            elem.area
                                                                                              ? 'dropactive '
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
                                                                                              )
                                                                                            }
                                                                                          >
                                                                                            {
                                                                                              areaItem.name
                                                                                            }
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
                                       
                                      </td>
                                     

                                      <td className="custom-dd dropRf customdropdown">
                                        <DropdownButton
                                          title="select"
                                          name="Select specification"
                                          className="dropbgwhite w100"
                                        >
                                          <ul className="multi-level">
                                            {this.state.listOfBrands &&
                                              this.state.listOfBrands.map(
                                                (item, index) => {
                                                  let brlen =
                                                    item.listOfSubBrands &&
                                                    item.listOfSubBrands
                                                      .length > 0
                                                      ? 'submenus'
                                                      : '';
                                                  let brActive =
                                                    elem.brandId === item.id
                                                      ? 'dropactive'
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
                                                          'brandName',
                                                          item.name,
                                                          catIndex
                                                        )
                                                      }

                                                    
                                                    >
                                                      {item.name}
                                                      {item.listOfSubBrands &&
                                                      item.listOfSubBrands
                                                        .length > 0 ? (
                                                        <ul class="innermenu">
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
                                                                      ? 'dropactive'
                                                                      : ''
                                                                  }
                                                                  onClick={event =>
                                                                    this.handleChangeSelect(
                                                                      event,
                                                                      'subBrandId',
                                                                      subitem.id,
                                                                      'subBrandName',
                                                                      subitem.name,
                                                                      catIndex,
                                                                      item.id
                                                                    )
                                                                  }

                                                                 
                                                                >
                                                                  {subitem.name}
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
                                       
                                      </td>
                                      <td className="custom-dd dropRf customdropdown">
                                        <DropdownButton
                                          title="select"
                                          name="Select specification"
                                          className="dropbgwhite w100"
                                        >
                                          <ul className="multi-level">
                                            {this.state.listOfDepartment &&
                                              this.state.listOfDepartment.map(
                                                (item, index) => {
                                                  let depLen =
                                                    item.listOfSubDept &&
                                                    item.listOfSubDept.length >
                                                      0
                                                      ? 'submenus'
                                                      : '';
                                                  let depActive =
                                                    item.id == elem.departmentId
                                                      ? 'dropactive'
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
                                                          'departmentName',
                                                          item.name,
                                                          catIndex
                                                        );
                                                      }}
                                                    >
                                                      {item.name}
                                                      {item.listOfSubDept &&
                                                      item.listOfSubDept
                                                        .length > 0 ? (
                                                        <ul class="innermenu">
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
                                                                  ? 'submenus'
                                                                  : '';
                                                              let subdepActive =
                                                                subitem.id ==
                                                                elem.subDepartmentId
                                                                  ? 'dropactive'
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
                                                                      'subDepartmentName',
                                                                      subitem.name,
                                                                      catIndex,
                                                                      item.id
                                                                    );
                                                                  }}
                                                                >
                                                                  {subitem.name}{' '}
                                                                  oooo
                                                                  {subitem.listOfTeam &&
                                                                  subitem
                                                                    .listOfTeam
                                                                    .length >
                                                                    0 ? (
                                                                    <ul class="innermenu">
                                                                      {subitem.listOfTeam.map(
                                                                        (
                                                                          subSubItem,
                                                                          subindex
                                                                        ) => [
                                                                          <li
                                                                            className={
                                                                              subSubItem.id ==
                                                                              elem.teamId
                                                                                ? 'dropactive'
                                                                                : ''
                                                                            }
                                                                            onClick={event => {
                                                                              this.handleChangeSelect(
                                                                                event,
                                                                                'teamId',
                                                                                subSubItem.id,
                                                                                'teamName',
                                                                                subSubItem.name,
                                                                                catIndex,
                                                                                item.id,
                                                                                subitem.id
                                                                              );
                                                                            }}
                                                                          >
                                                                            {
                                                                              subSubItem.name
                                                                            }
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
                                      </td>

                                      <td className="custom-dd dropRf customdropdown">
                                        <DropdownButton
                                          title="select"
                                          name="Select specification"
                                          className="dropbgwhite w100"
                                        >
                                          <ul className="multi-level">
                                            {this.state.listOfMajorCategory &&
                                              this.state.listOfMajorCategory.map(
                                                (item, index) => {
                                                  let subdepLen =
                                                    item.listOfCategory &&
                                                    item.listOfCategory.length >
                                                      0
                                                      ? 'submenus'
                                                      : '';
                                                  let subdepActive =
                                                    item.id ==
                                                    elem.majorCategoryId
                                                      ? 'dropactive'
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
                                                          'CATEGORY'
                                                        );
                                                      }}
                                                      onClick={event => {
                                                        this.handleChangeSelect(
                                                          event,
                                                          'majorCategoryId',
                                                          item.id,
                                                          'majorCategoryName',
                                                          item.name,
                                                          catIndex
                                                        );
                                                      }}
                                                    >
                                                      {item.name}
                                                      {item.listOfCategory &&
                                                      item.listOfCategory
                                                        .length > 0 ? (
                                                        <ul class="innermenu">
                                                          {item.listOfCategory.map(
                                                            (
                                                              subitem,
                                                              subindex
                                                            ) => {
                                                              let subdepLen =
                                                                subitem.listOfSubCategory &&
                                                                subitem
                                                                  .listOfSubCategory
                                                                  .length > 0
                                                                  ? 'submenus'
                                                                  : '';
                                                              let subdepActive =
                                                                subitem.id ==
                                                                elem.categoryId
                                                                  ? 'dropactive'
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
                                                                      'SUB_CATEGORY',
                                                                      subindex
                                                                    );
                                                                  }}
                                                                  onClick={event => {
                                                                    this.handleChangeSelect(
                                                                      event,
                                                                      'categoryId',
                                                                      subitem.id,
                                                                      'categoryName',
                                                                      subitem.name,
                                                                      catIndex,
                                                                      item.id
                                                                    );
                                                                  }}
                                                                >
                                                                  {subitem.name}
                                                                  {subitem.listOfSubCategory &&
                                                                  subitem
                                                                    .listOfSubCategory
                                                                    .length >
                                                                    0 ? (
                                                                    <ul class="innermenu">
                                                                      {subitem.listOfSubCategory.map(
                                                                        (
                                                                          subSubItem,
                                                                          sunsubindex
                                                                        ) => {
                                                                          let subdepLen =
                                                                            subSubItem.listOfSubSubCategory &&
                                                                            subSubItem
                                                                              .listOfSubSubCategory
                                                                              .length >
                                                                              0
                                                                              ? 'submenus'
                                                                              : '';
                                                                          let subdepActive =
                                                                            subSubItem.id ==
                                                                            elem.subCategoryId
                                                                              ? 'dropactive'
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
                                                                                  'SUB_SUB_CATEGORY',
                                                                                  subindex,
                                                                                  sunsubindex
                                                                                );
                                                                              }}
                                                                              onClick={event => {
                                                                                this.handleChangeSelect(
                                                                                  event,
                                                                                  'subCategoryId',
                                                                                  subSubItem.id,
                                                                                  'subCategoryName',
                                                                                  subSubItem.name,
                                                                                  catIndex,
                                                                                  item.id,
                                                                                  subitem.id
                                                                                );
                                                                              }}
                                                                            >
                                                                              {
                                                                                subSubItem.name
                                                                              }
                                                                              {subSubItem.listOfSubSubCategory &&
                                                                              subSubItem
                                                                                .listOfSubSubCategory
                                                                                .length >
                                                                                0 ? (
                                                                                <ul class="innermenu">
                                                                                  {subSubItem.listOfSubSubCategory.map(
                                                                                    (
                                                                                      childitem,
                                                                                      subindex
                                                                                    ) => {
                                                                                      let subdepActive =
                                                                                        childitem.id ==
                                                                                        elem.subSubCategoryId
                                                                                          ? 'dropactive'
                                                                                          : '';
                                                                                      return [
                                                                                        <li
                                                                                          className={
                                                                                            subdepActive
                                                                                          }
                                                                                          onClick={event => {
                                                                                            this.handleChangeSelect(
                                                                                              event,
                                                                                              'subSubCategoryId',
                                                                                              childitem.id,
                                                                                              'subSubCategoryName',
                                                                                              childitem.name,
                                                                                              catIndex,
                                                                                              item.id,
                                                                                              subitem.id,
                                                                                              subSubItem.id
                                                                                            );
                                                                                          }}
                                                                                        >
                                                                                          {
                                                                                            childitem.name
                                                                                          }
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
                                      </td>

                                      <td className="custom-dd dropRf customdropdown">
                                        <DropdownButton
                                          title="select"
                                          name="Select specification"
                                          className="dropbgwhite w100"
                                        >
                                          <ul className="multi-level">
                                            {this.state.listOfSectorCategory &&
                                              this.state.listOfSectorCategory.map(
                                                (item, index) => {
                                                  let subdepLen =
                                                    item.listOfProductLineCategory &&
                                                    item
                                                      .listOfProductLineCategory
                                                      .length > 0
                                                      ? 'submenus'
                                                      : '';
                                                  let subdepActive =
                                                    item.id == elem.sectorId
                                                      ? 'dropactive'
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
                                                          'sectorName',
                                                          item.name,
                                                          catIndex
                                                        );
                                                      }}
                                                    >
                                                      {item.name} 
                                                      {item.listOfProductLineCategory &&
                                                      item
                                                        .listOfProductLineCategory
                                                        .length > 0 ? (
                                                        <ul class="innermenu">
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
                                                                  ? 'submenus'
                                                                  : '';
                                                              let subdepActive =
                                                                subitem.id ==
                                                                elem.productLineId
                                                                  ? 'dropactive'
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
                                                                      'productLineName',
                                                                      subitem.name,
                                                                      catIndex,
                                                                      item.id
                                                                    );
                                                                  }}
                                                                >
                                                                  {subitem.name}
                                                                  {subitem.listOfModelFamilyCategory &&
                                                                  subitem
                                                                    .listOfModelFamilyCategory
                                                                    .length >
                                                                    0 ? (
                                                                    <ul class="innermenu">
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
                                                                              ? 'submenus'
                                                                              : '';
                                                                          let subdepActive =
                                                                            subSubItem.id ==
                                                                            elem.modelFamilyId
                                                                              ? 'dropactive'
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
                                                                                  'modelFamilyName',
                                                                                  subSubItem.name,
                                                                                  catIndex,
                                                                                  item.id,
                                                                                  subitem.id
                                                                                );
                                                                              }}
                                                                            >
                                                                              {
                                                                                subSubItem.name
                                                                              }
                                                                              {subSubItem.listOfProgramCategory &&
                                                                              subSubItem
                                                                                .listOfProgramCategory
                                                                                .length >
                                                                                0 ? (
                                                                                <ul class="innermenu">
                                                                                  {subSubItem.listOfProgramCategory.map(
                                                                                    (
                                                                                      childitem,
                                                                                      subindex
                                                                                    ) => {
                                                                                      let subdepActive =
                                                                                        childitem.id ==
                                                                                        elem.programId
                                                                                          ? 'dropactive'
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
                                                                                              'programName',
                                                                                              childitem.name,
                                                                                              catIndex,
                                                                                              item.id,
                                                                                              subitem.id,
                                                                                              subSubItem.id
                                                                                            );
                                                                                          }}
                                                                                        >
                                                                                          {
                                                                                            childitem.name
                                                                                          }
          
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
                                      </td>




                                {/* <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="region"
                                      value={elem.region}
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    >
                                      <option value="select">select</option>
                                      <option value="region1">region1</option>
                                      <option value="region2">region2</option>
                                      <option value="region3">region3</option>
                                      {this.state.listOfRegions &&
                                        this.state.listOfRegions.map(
                                          (item, catIndex) => {
                                            return (
                                              <option
                                                value="other"
                                                key={catIndex}
                                              >
                                                {item.department}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="department"
                                      value={
                                        elem.departmentRes &&
                                        elem.departmentRes.id
                                      }
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    >
                                      <option value="select">select</option>
                                      {this.state.listOfDepartment &&
                                        this.state.listOfDepartment.map(
                                          (item, catIndex) => {
                                            return (
                                              <option
                                                value={item.id}
                                                key={catIndex}
                                              >
                                                {item.department}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="mainCategory"
                                      value={
                                        elem.mainCategoryRes &&
                                        elem.mainCategoryRes.id
                                      }
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    >
                                      <option value="select">select</option>
                                      {this.state.listOfMainCategory &&
                                        this.state.listOfMainCategory.map(
                                          (item, catIndex) => {
                                            return (
                                              <option
                                                value={item.id}
                                                key={catIndex}
                                              >
                                                {item.mainCatgeory}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="spendCategory"
                                      value={
                                        elem.spendCategoryRes &&
                                        elem.spendCategoryRes.id
                                      }
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    >
                                      <option value="select">select</option>
                                      {this.state.listOfSpentCategories &&
                                        this.state.listOfSpentCategories.map(
                                          (item, catIndex) => {
                                            return (
                                              <option
                                                value={item.id}
                                                key={catIndex}
                                              >
                                                {item.spendCategory}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="subCategory"
                                      value={
                                        elem.subCategoryRes &&
                                        elem.subCategoryRes.id
                                      }
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    >
                                      <option value="select">select</option>
                                      {this.state.listOfSubCatgeory &&
                                        this.state.listOfSubCatgeory.map(
                                          (item, catIndex) => {
                                            return (
                                              <option
                                                value={item.id}
                                                key={catIndex}
                                              >
                                                {item.subCategory}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td> */}
                                <td>
                                  <FormGroup controlId="formControlsSelect">
                                    <FormControl
                                      componentClass="select"
                                      placeholder="select"
                                      className="s-arrow br-0"
                                      name="plant"
                                      value={elem.plant}
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    >
                                      <option value="select">select</option>
                                      {this.state.listOfAddress &&
                                        this.state.listOfAddress.map(
                                          (item, catIndex) => {
                                            return (
                                              <option
                                                value="other"
                                                key={catIndex}
                                              >
                                                {item.address}
                                              </option>
                                            );
                                          }
                                        )}
                                    </FormControl>
                                  </FormGroup>
                                </td>{' '}
                                <td>
                                  <FormGroup className="m-b-0 w-125">
                                    {' '}
                                    <FormControl
                                      type="text"
                                      className="br-0 "
                                      name="spendingAccount"
                                      placeholder="Spending Account"
                                      value={elem.spendingAccount}
                                      onChange={event => {
                                        this.handleOnChangeNumber(
                                          event,
                                          catIndex
                                        );
                                      }}
                                    />{' '}
                                    <FormControl.Feedback />{' '}
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0 w-150">
                                    {' '}
                                    <FormControl
                                      type="text"
                                      className="br-0 "
                                      name="accountDescription"
                                      placeholder="Account Description"
                                      value={elem.accountDescription}
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    />{' '}
                                    <FormControl.Feedback />{' '}
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0">
                                    {' '}
                                    <FormControl
                                      type="text"
                                      className="br-0 "
                                      name="currency"
                                      placeholder="Currency"
                                      value={elem.currency}
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0">
                                    <FormControl
                                      type="text"
                                      className="br-0 "
                                      name="totalBudget"
                                      placeholder="Total Budget"
                                      value={elem.totalBudget}
                                      maxlength="20"
                                      onChange={event => {
                                        this.handleOnChangeNumber(
                                          event,
                                          catIndex
                                        );
                                      }}
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0">
                                    <FormControl
                                      type="text"
                                      className="br-0 "
                                      name="amountAvailable"
                                      placeholder="Amount Available"
                                      value={elem.amountAvailable}
                                      maxlength="20"
                                      onChange={event => {
                                        this.handleOnChangeNumber(
                                          event,
                                          catIndex
                                        );
                                      }}
                                    />{' '}
                                    <FormControl.Feedback />{' '}
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0">
                                    {' '}
                                    <FormControl
                                      type="text"
                                      className="br-0 "
                                      name="UOM"
                                      placeholder="UOM"
                                      value={elem.uom}
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    />{' '}
                                    <FormControl.Feedback />{' '}
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0">
                                    {' '}
                                    <FormControl
                                      type="text"
                                      className="br-0 "
                                      placeholder="Quantity"
                                      name="quantity"
                                      value={elem.quantity}
                                      maxlength="20"
                                      onChange={event => {
                                        this.handleOnChangeNumber(
                                          event,
                                          catIndex
                                        );
                                      }}
                                    />{' '}
                                    <FormControl.Feedback />{' '}
                                  </FormGroup>
                                </td>
                                <td>
                                  {(elem.specification &&
                                    elem.specification.mediaType ===
                                      'application/octet-stream') ||
                                  (elem.specification &&
                                    elem.specification.mediaType ===
                                      'application/vnd.ms-excel') ? (
                                    <img alt="" src={xlsImage} width="45" />
                                  ) : elem.specification &&
                                    elem.specification.mediaType ===
                                      'application/pdf' ? (
                                    <img alt="" src={pdfImage} width="45" />
                                  ) : (elem.specification &&
                                      elem.specification.mediaType ===
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                                    (elem.specification &&
                                      elem.specification.mediaType ===
                                        'text/plain') ? (
                                    <img alt="" src={docImage} width="45" />
                                  ) : (
                                    <div className="upload-btn cursor-pointer sm-upload">
                                      <span className="ico-upload">
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#uploadIco`}
                                          />
                                        </svg>
                                      </span>
                                      <FormControl
                                        id="formControlsFile"
                                        type="file"
                                        label="File"
                                        accept=".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
                                        onChange={e =>
                                          this.handleUploadSpecification(
                                            e,
                                            catIndex
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                                </td>
                                <td>
                                  {(elem.statementOfWork &&
                                    elem.statementOfWork.mediaType ===
                                      'application/octet-stream') ||
                                  (elem.statementOfWork &&
                                    elem.statementOfWork.mediaType ===
                                      'application/vnd.ms-excel') ? (
                                    <img alt="" src={xlsImage} width="45" />
                                  ) : elem.statementOfWork &&
                                    elem.statementOfWork.mediaType ===
                                      'application/pdf' ? (
                                    <img alt="" src={pdfImage} width="45" />
                                  ) : (elem.statementOfWork &&
                                      elem.statementOfWork.mediaType ===
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                                    (elem.statementOfWork &&
                                      elem.statementOfWork.mediaType ===
                                        'text/plain') ? (
                                    <img alt="" src={docImage} width="45" />
                                  ) : (
                                    <div className="upload-btn cursor-pointer sm-upload">
                                      <span className="ico-upload">
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#uploadIco`}
                                          />
                                        </svg>
                                      </span>
                                      <FormControl
                                        id="formControlsFile"
                                        type="file"
                                        label="File"
                                        accept=".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
                                        onChange={e =>
                                          this.handleUploadStatementOfWork(
                                            e,
                                            catIndex
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                                </td>
                                <td ref="elem">
                                  <div onClick={this.findCoordinate.bind(this)}>
                                    <FormGroup className="m-b-0">
                                      <DatePicker
                                        selected={elem.targetDeliveryDate}
                                        onChange={e => {
                                          const value = e;
                                          this.handleOnChange(
                                            {
                                              target: {
                                                name: 'targetDeliveryDate',
                                                value
                                              }
                                            },
                                            catIndex
                                          );
                                        }}
                                        placeholderText="DD/MM/YYYY"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()}
                                      />

                                      {/* <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                      timeFormat={false}
                                      min={moment().format('DD/MM/YYYY')}
                                      value={elem.targetDeliveryDate}
                                      inputProps={{
                                        placeholder: 'DD/MM/YYYY',
                                        readOnly: true
                                      }}
                                      onChange={e => {
                                        const value = e;
                                        this.handleOnChange(
                                          {
                                            target: {
                                              name: 'targetDeliveryDate',
                                              value
                                            }
                                          },
                                          catIndex
                                        );
                                      }}
                                    /> */}

                                      <FormControl.Feedback />
                                    </FormGroup>
                                  </div>
                                </td>
                                <td ref="elem">
                                  <div onClick={this.findCoordinate.bind(this)}>
                                    <FormGroup className="m-b-0">
                                      <DatePicker
                                        selected={elem.targetCompletionDate}
                                        onChange={e => {
                                          const value = e;
                                          this.handleOnChange(
                                            {
                                              target: {
                                                name: 'targetCompletionDate',
                                                value
                                              }
                                            },
                                            catIndex
                                          );
                                        }}
                                        placeholderText="DD/MM/YYYY"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()}
                                      />

                                      {/* <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                      timeFormat={false}
                                      min={moment().format('DD/MM/YYYY')}
                                      value={elem.targetCompletionDate}
                                      inputProps={{
                                        placeholder: 'DD/MM/YYYY',
                                        readOnly: true
                                      }}
                                      onChange={e => {
                                        const value = e;
                                        this.handleOnChange(
                                          {
                                            target: {
                                              name: 'targetCompletionDate',
                                              value
                                            }
                                          },
                                          catIndex
                                        );
                                      }}
                                    /> */}

                                      <FormControl.Feedback />
                                    </FormGroup>
                                  </div>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0">
                                    <FormControl
                                      type="text"
                                      className="br-0 "
                                      placeholder="Delivery Address"
                                      name="deliveryAddress"
                                      value={elem.deliveryAddress}
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0">
                                    <FormControl
                                      type="text"
                                      className="br-0 "
                                      placeholder="Project Location"
                                      name="projectLocation"
                                      value={elem.projectLocation}
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    />{' '}
                                    <FormControl.Feedback />{' '}
                                  </FormGroup>
                                </td>
                                <td>
                                  <FormGroup className="m-b-0 w-200">
                                    <FormControl
                                      type="text"
                                      className="br-0 "
                                      placeholder="Specific Quality Requirement"
                                      name="specificQualityRequirement"
                                      value={elem.specificQualityRequirement}
                                      onChange={event => {
                                        this.handleOnChange(event, catIndex);
                                      }}
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                <td>
                                  {elem.milestones &&
                                  elem.milestones.length > 0 ? (
                                    <button
                                      className="btn btn-task"
                                      onClick={e => {
                                        this.handleMilestonePreview(
                                          e,
                                          elem.milestones,
                                          'milestone'
                                        );
                                      }}
                                    >
                                      <span className="ico-action ">
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#review1Ico`}
                                          />
                                        </svg>
                                      </span>
                                      <span className="ico-txt">Review</span>
                                    </button>
                                  ) : (
                                    ''
                                  )}
                                </td>
                              </tr>
                            );
                          }
                        )}
                    </tbody>
                  </Table>
                </div>

                {/* <button
                      className="btn btn-danger"
                      onClick={e => {
                        this.removeIndirectPurchaseDataRow(e);
                      }}
                    >
                      Remove Item
                    </button>
                    <button
                      className="btn btn-default"
                      onClick={() => {
                        this.addIndirectPurchaseDataRow("approve");
                      }}
                    >
                      Add Item
                    </button> */}

                <div>
                  <span
                    onClick={() => {
                      this.addIndirectPurchaseDataRow('approve');
                    }}
                    className="cursor-pointer"
                  >
                    Add Item&nbsp;
                    <span className="ico-add">
                      <svg>
                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                      </svg>
                    </span>
                  </span>

                  <span
                    onClick={e => {
                      this.deleteConfirmation(e);
                    }}
                    className="cursor-pointer"
                  >
                    &nbsp;&nbsp;Remove Items&nbsp;{' '}
                    <span className="ico-minusgly"> </span>
                  </span>
                </div>
                <div className="text-center m-b-15">
                  {/* <button
                    className="btn btn-default text-uppercase sm-btn"
                    onClick={event => this.handleMileStone(event)}
                    // onClick={this.handleCreatePartWithMedia(this.state.type)}
                  >
                    Save
                  </button> */}
                  <button
                    className="btn btn-default text-uppercase"
                    onClick={() => {
                      this.handleOnSubmit();
                    }}
                    // onClick={this.handleCreatePartWithMedia(this.state.type)}
                  >
                    Submit
                  </button>
                  <button
                    className="btn btn-primary text-uppercase"
                    onClick={e => {
                      this.handleIndirectPurchasePreview(
                        e,
                        this.state.listOfIndirectPurchase
                      );
                    }}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
            <Footer
              pageTitle={permissionConstant.footer_title.build_plan_eco}
            />
          </div>
        ) : null}
        <Modal
          show={this.state.show}
          onHide={this.handleCloseModel}
          className="custom-popUp modal-xl"
          bsSize="large"
        >
          <Modal.Header>
            <div className="flex justify-space-between">
              <h4>Add Milestone</h4>
              <div className="">
                <span className="print-btn">
                  <ReactToPrint
                    className="btn btn-link text-uppercase color-light sm-btn"
                    trigger={() => (
                      <a href="#">
                        {' '}
                        <span className="ico-print">
                          <svg>
                            <use xlinkHref={`${Sprite}#printIco`} />
                          </svg>
                        </span>
                      </a>
                    )}
                    content={() => this.componentRef}
                    onClick={() => {
                      this.printScreen();
                    }}
                  />
                  <button
                    onClick={this.handleCloseModel}
                    className="btn btn-link text-uppercase color-light"
                  >
                    close
                  </button>
                </span>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="p-lr-20" ref={el => (this.componentRef = el)}>
              <div className="text-center">
                <Table bordered responsive className="custom-table print-table">
                  <thead>
                    <tr>
                      <th>Milestone</th>
                      <th>Milestone Name</th>
                      <th>Target Date</th>
                      <th>Delivery Criteria</th>
                      <th>Payment Value</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.listOfMilestone &&
                      this.state.listOfMilestone.map((elem, catIndex) => {
                        return (
                          <tr>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="text"
                                  className="br-0 "
                                  name="milestoneNumber"
                                  min="1"
                                  max="99999"
                                  value={elem && elem.milestoneNumber}
                                  onChange={event => {
                                    this.handleOnChangeMilestone(
                                      event,
                                      catIndex
                                    );
                                  }}
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="text"
                                  className="br-0 "
                                  name="milestoneName"
                                  value={elem && elem.milestoneName}
                                  onChange={event => {
                                    this.handleOnChangeMilestone(
                                      event,
                                      catIndex
                                    );
                                  }}
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                            <td>
                              <DatePicker
                                selected={elem && elem.targetDate}
                                onChange={e => {
                                  const value = e;
                                  this.handleOnChangeMilestone(
                                    {
                                      target: {
                                        name: 'targetDate',
                                        value
                                      }
                                    },
                                    catIndex
                                  );
                                }}
                                placeholderText="DD/MM/YYYY"
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                              />

                              {/* <Datetime
                                  className="db-0"
                                  closeOnSelect="true"
                                  dateFormat="DD/MM/YYYY"
                                  timeFormat={false}
                                  min={moment().format('DD/MM/YYYY')}
                                  inputProps={{
                                    placeholder: 'DD/MM/YYYY',
                                    readOnly: true
                                  }}
                                  value={elem && elem.targetDate}
                                  onChange={e => {
                                    const value = e;
                                    this.handleOnChangeMilestone(
                                      {
                                        target: {
                                          name: 'targetDate',
                                          value
                                        }
                                      },
                                      catIndex
                                    );
                                  }}
                                /> */}
                            </td>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="text"
                                  className="br-0 "
                                  name="deliveryCriteria"
                                  value={elem && elem.deliveryCriteria}
                                  onChange={event => {
                                    this.handleOnChangeMilestone(
                                      event,
                                      catIndex
                                    );
                                  }}
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="text"
                                  className="br-0"
                                  name="paymentValue"
                                  value={elem && elem.paymentValue}
                                  onChange={event => {
                                    this.handleOnChangeMilestone(
                                      event,
                                      catIndex
                                    );
                                  }}
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="text"
                                  className="br-0 "
                                  name="paymentPercentage"
                                  value={elem && elem.paymentPercentage}
                                  maxlength="20"
                                  onChange={event => {
                                    this.handleOnChangeMilestone(
                                      event,
                                      catIndex
                                    );
                                  }}
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <div className="text-center">
                  <button
                    className="btn btn-default text-uppercase sm-btn"
                    onClick={event => this.handleOnSubmitMilestone(event)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-success text-uppercase sm-btn"
                    onClick={this.handleCloseModel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showPreview}
          onHide={this.handleHidePreview}
          container={this}
          aria-labelledby="contained-modal-title"
          className="custom-popUp modal-xl"
        >
          <Modal.Header>
            <div className="flex justify-space-between">
              <h4> </h4>
              <div className="">
                <span className="print-btn">
                  <ReactToPrint
                    className="btn btn-link text-uppercase color-light sm-btn"
                    trigger={() => (
                      <a href="#">
                        <span className="ico-print">
                          <svg>
                            <use xlinkHref={`${Sprite}#printIco`} />
                          </svg>
                        </span>
                      </a>
                    )}
                    content={() => this.componentRef}
                    onClick={() => {
                      this.printScreen();
                    }}
                  />
                </span>
                <button
                  onClick={this.handleHidePreview}
                  className="btn btn-link text-uppercase color-light"
                >
                  close
                </button>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div ref={el => (this.componentRef = el)}>
              <div className="m-b-50 p-lr-20">
                <h4>Indirect Purchase</h4>
                <Table bordered responsive className="custom-table">
                  <thead>
                    <tr>
                      <th>Purchase request number</th>
                      <th>Program/Project</th>
                      <th>Reference part #</th>
                      <th>Item Description</th>
                      <th>Regions</th>
                      <th>Functional Area/Department</th>
                      <th>Main Category</th>
                      <th>Spend Category</th>
                      <th>Sub Category</th>
                      <th>Plant/Office</th>
                      <th>Spending Account</th>
                      <th>Account Description</th>
                      <th>Currency</th>
                      <th>Total Budget(this Year)</th>
                      <th>Amount Available</th>
                      <th>UOM</th>
                      <th>quantity</th>
                      <th>Target Delivery Date/ Start of Project</th>
                      <th>Target completion of Project</th>
                      <th>Delivery address</th>
                      <th>Project Location</th>
                      <th>Specific Quality requirement</th>
                    </tr>
                  </thead>
                  {this.state.listOfPreviewData &&
                  this.state.listOfPreviewData.length > 0 ? (
                    <tbody>
                      {this.state.listOfPreviewData &&
                        this.state.listOfPreviewData.map((item, catIndex) => {
                          return [
                            <tr>
                              <td>
                                <span
                                  className={
                                    catIndex % 4 === 0
                                      ? 'r-caret red'
                                      : catIndex % 4 === 1
                                      ? 'r-caret green'
                                      : catIndex % 4 === 2
                                      ? 'r-caret blue'
                                      : 'r-caret yellow'
                                  }
                                >
                                  {' '}
                                </span>
                                {item.purchaseRequestNumber}
                              </td>
                              <td>
                                {item.project && item.project.projectCode}
                              </td>
                              <td>
                                {item.referencePart &&
                                  item.referencePart.partNumber}
                              </td>
                              <td>{item.itemDescription}</td>
                              <td>{item.region}</td>
                              <td>
                                {item.departmentRes &&
                                  item.departmentRes.department}
                              </td>
                              <td>
                                {item.mainCategoryRes &&
                                  item.mainCategoryRes.mainCatgeory}
                              </td>
                              <td>
                                {item.spendCategoryRes &&
                                  item.spendCategoryRes.spendCategory}
                              </td>
                              <td>
                                {item.subCategoryRes &&
                                  item.subCategoryRes.subCategory}
                              </td>
                              <td>{item.plant}</td>
                              <td>{item.spendingAccount}</td>
                              <td>{item.accountDescription}</td>

                              <td>{item.currency}</td>
                              <td>{item.totalBudget}</td>
                              <td>{item.amountAvailable}</td>
                              <td>{item.uom}</td>
                              <td>{item.quantity}</td>
                              <td>
                                {item.targetDeliveryDate &&
                                  convertToDate(item.targetDeliveryDate)}
                              </td>
                              <td>
                                {item.targetCompletionDate &&
                                  convertToDate(item.targetCompletionDate)}
                              </td>
                              <td>{item.deliveryAddress}</td>
                              <td>{item.projectLocation}</td>
                              <td>{item.specificQualityRequirement}</td>
                            </tr>,
                            <tr />
                          ];
                        })}
                    </tbody>
                  ) : (
                    ''
                  )}
                </Table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex justify-space-between text-center" />
        </Modal>

        <Modal
          show={this.state.showMilestonePreview}
          onHide={this.handleHideMilestone}
          container={this}
          aria-labelledby="contained-modal-title"
          className="custom-popUp modal-xl"
        >
          <Modal.Header>
            <div className="flex justify-space-between">
              <div className="">
                <span className="print-btn">
                  <ReactToPrint
                    className="btn btn-link text-uppercase color-light sm-btn"
                    trigger={() => (
                      <a href="#">
                        <span className="ico-print">
                          <svg>
                            <use xlinkHref={`${Sprite}#printIco`} />
                          </svg>
                        </span>
                      </a>
                    )}
                    content={() => this.componentRef}
                    onClick={() => {
                      this.printScreen();
                    }}
                  />
                </span>
                <button
                  onClick={this.handleHideMilestone}
                  className="btn btn-link text-uppercase color-light"
                >
                  close
                </button>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div ref={el => (this.componentRef = el)}>
              <div className="m-b-50 p-lr-20">
                <h4>Milestone</h4>
                <Table bordered responsive className="custom-table">
                  <thead>
                    <tr>
                      <th>Milestone</th>
                      <th>Milestone Name</th>
                      <th>Target Date</th>
                      <th>Delivery Criteria</th>
                      <th>Payment Value</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.milestoneValue &&
                      this.state.milestoneValue.map((item, catIndex) => {
                        if (
                          item.milestoneNumber != null ||
                          item.milestoneNumber != null
                        ) {
                          return (
                            <tr>
                              <td>{item.milestoneNumber}</td>
                              <td>{item.milestoneName}</td>
                              <td>
                                {item.targetDate &&
                                  convertToDate(item.targetDate)}
                              </td>
                              <td>{item.deliveryCriteria}</td>
                              <td>{item.paymentValue}</td>
                              <td>{item.paymentPercentage}</td>
                            </tr>
                          );
                        } else {
                          return '';
                        }
                      })}
                  </tbody>
                </Table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex justify-space-between text-center" />
        </Modal>

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
                  onClick={event => this.removeIndirectPurchaseDataRow(event)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-success text-uppercase sm-btn"
                  onClick={this.handleCloseConformation}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionLoaderHide,
      actionLoaderShow,
      actionGetDiscloserData,
      actionApproveRejectNonDiscloser,
      actionGetClassifications,
      actionGetProjectListForIndirectPurchase,
      actionGetPartListForIndirectPurchase,
      actionUploadSpecificationForIndirect,
      actionUploadStatementOfWorkForIndirect,
      actionSubmitIndirectPurchase,
      actionGetListOfIndirectPurchase,
      actionDeleteOfIndirectPurchase
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
)(BuildPlanECO);
