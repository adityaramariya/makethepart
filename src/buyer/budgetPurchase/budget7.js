import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Popover, Table, FormControl, FormGroup, Modal } from "react-bootstrap";
import xlsImage from "../../img/xls.png";
import pdfImage from "../../img/pdf.png";
import docImage from "../../img/doc.png";
import Sprite from "../../img/sprite.svg";
import ReactToPrint from "react-to-print";
import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetDiscloserData,
  actionApproveRejectNonDiscloser,
  actionGetPurchaseCategoryData,
  actionGetProjectListForIndirectPurchase,
  actionGetPartListForIndirectPurchase,
  actionUploadSpecificationForIndirect,
  actionUploadStatementOfWorkForIndirect,
  actionSubmitIndirectPurchase,
  actionGetListOfIndirectPurchase,
  actionDeleteOfIndirectPurchase
} from "../../common/core/redux/actions";
import { showSuccessToast, showErrorToast } from "../../common/commonFunctions";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import Slider from "react-slick";
import Footer from "../common/footer";
import CONSTANTS from "../../common/core/config/appConfig";
import { handlePermission } from "../../common/permissions";
import * as Datetime from "react-datetime";
import * as moment from "moment";
import _ from "lodash";

let { permissionConstant } = CONSTANTS;
let { validationMessages } = CONSTANTS;

class budget7 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "eleven",
      indirectPurchaseRowObject: {
        index: 1,
        isSelected: false,
        purchaseRequestNumber:
          "INP" + "#" + ((Math.random() * 0xffffff) << 0).toString(16),
        itemDescription: "",
        projectId: "",
        region: "",
        referencePartId: "",
        department: "",
        mainCategory: "",
        spendCategory: "",
        subCategory: "",
        plant: "",
        spendingAccount: "",
        accountDescription: "",
        currency: "",
        totalBudget: "",
        amountAvailable: "",
        UOM: "",
        quantity: "",
        specification: {
          documentType: "",
          mediaName: "",
          mediaURL: "",
          mediaType: "",
          mediaSize: "",
          mediaExtension: "",
          isSelected: false
        },
        statementOfWork: {
          documentType: "",
          mediaName: "",
          mediaURL: "",
          mediaType: "",
          mediaSize: "",
          mediaExtension: "",
          isSelected: false
        },
        targetDeliveryDate: "",
        targetCompletionDate: "",
        deliveryAddress: "",
        projectLocation: "",
        specificQualityRequirement: "",
        listOfMilestoneRequest: [
          {
            id: "",
            milestoneNumber: 0,
            milestoneName: "",
            targetDate: "",
            deliveryCriteria: "",
            paymentValue: "",
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
      deleteIndirectPurchaseArray: [],
      listOfMilestone: [],
      milestoneObject: {
        milestoneNumber: "",
        milestoneName: "",
        targetDate: "",
        deliveryCriteria: "",
        paymentValue: "",
        paymentPercentage: ""
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
      milestoneObject.index = i;
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
      .actionGetPurchaseCategoryData(data)
      .then((result, error) => {
        console.log("result.....", result);
        let purchaseResponse = result.payload.data.resourceData[0];
        this.setState({
          listOfDepartment: purchaseResponse.listOfDepartment,
          listOfFunctionalArea: purchaseResponse.listOfFunctionalArea,
          listOfMainCategory: purchaseResponse.listOfMainCategory,
          listOfSpentCategories: purchaseResponse.listOfSpendCategory,
          listOfSubCatgeory: purchaseResponse.listOfSubCatgeory,
          listOfAddress: purchaseResponse.listOfAddress
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());

    this.props
      .actionGetProjectListForIndirectPurchase(data)
      .then((result, error) => {
        console.log("actionGetProjectList--", result);
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
        console.log("actionGetListOfIndirectPurchase.....", result);
        let purchaseResponse = result.payload.data.resourceData;
        this.setState({ listOfIndirectPurchase: purchaseResponse });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === "first") this.props.history.push("home");
    if (tabKey === "third")
      this.props.history.push({
        pathname: "home",
        state: { path: "third" }
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
      index: this.state.counter,
      purchaseRequestNumber:
        "INP" + "#" + ((Math.random() * 0xffffff) << 0).toString(16),
      itemDescription: "",
      projectId: "",
      region: "",
      referencePartId: "",
      department: "",
      mainCategory: "",
      spendCategory: "",
      subCategory: "",
      plant: "",
      spendingAccount: "",
      accountDescription: "",
      currency: "",
      totalBudget: "",
      amountAvailable: "",
      UOM: "",
      quantity: "",
      specification: {
        documentType: "",
        mediaName: "",
        mediaURL: "",
        mediaType: "",
        mediaSize: "",
        mediaExtension: "",
        isSelected: false
      },
      statementOfWork: {
        documentType: "",
        mediaName: "",
        mediaURL: "",
        mediaType: "",
        mediaSize: "",
        mediaExtension: "",
        isSelected: false
      },
      targetDeliveryDate: "",
      targetCompletionDate: "",
      deliveryAddress: "",
      projectLocation: "",
      specificQualityRequirement: "",
      listOfMilestoneRequest: [],
      listOfParts: []
    };

    console.log("indirectPurchaseRowObject Added", indirectPurchaseRowObject);

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
  }
  removeIndirectPurchaseDataRow(e) {
    if (this.state.deleteIndirectPurchaseArray.length > 0) {
      let _this = this;
      let deleteId = "";
      let listOfIndirectPurchase = this.state.listOfIndirectPurchase;
      let deleteIndirectPurchaseArray = this.state.deleteIndirectPurchaseArray
        ? this.state.deleteIndirectPurchaseArray
        : [];

      this.state.deleteIndirectPurchaseArray.forEach(function(item, index) {
        deleteId =
          listOfIndirectPurchase &&
          listOfIndirectPurchase[index] &&
          listOfIndirectPurchase[index].purchaseRequestNumber;
        _.remove(listOfIndirectPurchase, currentObject => {
          return currentObject.purchaseRequestNumber === deleteId;
        });
      });
      console.log(
        "this.state.listOfIndirectPurchase----",
        listOfIndirectPurchase
      );

      this.setState({ listOfIndirectPurchase: listOfIndirectPurchase });
      this.setState({ deleteConformationModal: false });
      console.log(
        "this.state.deleteIndirectPurchaseArray----",
        this.state.deleteIndirectPurchaseArray
      );

      console.log(
        "this.state.listOfIndirectPurchase----",
        this.state.listOfIndirectPurchase
      );

      // let idsList = _.find(this.state.deleteIndirectPurchaseArray, "id");

      let data = {
        listOfIds: deleteIndirectPurchaseArray,
        roleId: this.props.userInfo.userData.userRole,
        userId: this.props.userInfo.userData.id
      };
      this.props
        .actionDeleteOfIndirectPurchase(data)
        .then((result, error) => {
          console.log("actionDeleteOfIndirectPurchase---", result);

          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      showErrorToast(validationMessages.Indirect.deleteError);
    }
  }
  addMilestone(type) {
      this.setState({
        show: true
      });
   
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

  handlePartByProject(projectId, index) {
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
        listOfIndirectPurchase[index]["listOfParts"] = listOfParts;

        this.setState({
          listOfIndirectPurchase: listOfIndirectPurchase
        });
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleOnChange(event, index) {
    const { name, value } = event.target;
    let listOfIndirectPurchaseData = this.state.listOfIndirectPurchase;
    let documentTypeListJson = listOfIndirectPurchaseData[index];
    documentTypeListJson[name] = value;
    listOfIndirectPurchaseData[index] = documentTypeListJson;
    this.setState({ listOfIndirectPurchase: listOfIndirectPurchaseData });

    if (name === "projectId") {
      this.handlePartByProject(value, index);
    }
  }
  handleOnChangeMilestone(event, index) {
    const { name, value } = event.target;
    let listOfMilestoneData = JSON.parse(
      JSON.stringify(this.state.listOfMilestone)
    );
    //make changes to ingredients
    console.log("name ----", name);
    if (name == "paymentPercentage")
      listOfMilestoneData[index][name] = parseFloat(value)
        ? parseFloat(value)
        : "";
    else listOfMilestoneData[index][name] = value;

    this.setState({
      listOfMilestone: listOfMilestoneData
    });
  }

  handleAction(event, index, id) {
    const { name, value } = event.target;
    const selected = event.target.checked;

    let milestoneArray = this.state.milestoneArray;
    milestoneArray.push(value);

    let deleteIndirectPurchaseArray = this.state.deleteIndirectPurchaseArray;
    deleteIndirectPurchaseArray.push(id);
    // deleteIndirectPurchaseArray;

    this.setState({
      milestoneArray: milestoneArray,
      deleteIndirectPurchaseArray: deleteIndirectPurchaseArray
    });

    let listOfIndirectPurchaseData = this.state.listOfIndirectPurchase;
    let listOfIndirectPurchaseDataJson = listOfIndirectPurchaseData[index];
    if (selected) {
      listOfIndirectPurchaseDataJson.isSelected = true;
    } else {
      listOfIndirectPurchaseDataJson.isSelected = false;
    }
    listOfIndirectPurchaseData[index] = listOfIndirectPurchaseDataJson;
    this.setState({ listOfIndirectPurchase: listOfIndirectPurchaseData });

    console.log(
      "selected listOfIndirectPurchaseDataJson----",
      this.state.listOfIndirectPurchase
    );
  }

  handleOnSubmitMilestone(event, index) {
    let _this = this;
    let listOfMileStone = [];
    const covertToTimeStamp = momentObject => {
      return moment(momentObject).format("x");
    };
    let listOfMilestone = this.state.listOfMilestone;
    this.state.listOfMilestone.forEach(function(item, index) {
      let listOfMilestoneIndexData = listOfMilestone[index];

      listOfMileStone.push({
        //id: listOfMilestoneIndexData.id ? listOfMilestoneIndexData.id : 0,
        milestoneName: listOfMilestoneIndexData.milestoneName,
        milestoneNumber: listOfMilestoneIndexData.milestoneNumber,
        paymentPercentage: listOfMilestoneIndexData.paymentPercentage,
        paymentValue: listOfMilestoneIndexData.paymentValue,
        targetDate: listOfMilestoneIndexData.targetDate
          ? covertToTimeStamp(listOfMilestoneIndexData.targetDate)
          : ""
      });
    });

    let milestoneArray = this.state.milestoneArray;
    let indirectPurchaseData = this.state.listOfIndirectPurchase;
    this.state.milestoneArray.forEach(function(item, index) {
      let milestoneArrayIndexData = milestoneArray[index];
      indirectPurchaseData[milestoneArrayIndexData][
        "listOfMilestoneRequest"
      ] = listOfMileStone;
    });
    this.setState({
      listOfIndirectPurchase: indirectPurchaseData,
      show: false
    });
  }

  handleOnSubmit(event, index) {
    let _this = this;
    let listOfIndirectPurchase = [];
    let flag = true;
    let showError = "";
    let errorMsg = [];
    const covertToTimeStamp = momentObject => {
      return moment(momentObject).format("x");
    };
    let indirectPurchaseData = this.state.listOfIndirectPurchase;
    this.state.listOfIndirectPurchase.forEach(function(item, index) {
      let indirectPurchaseIndexData = indirectPurchaseData[index];

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
              .split("/")
              .pop(-1);
            indirectPurchaseIndexData.specification[
              i
            ].mediaThumbnailUrl = indirectPurchaseIndexData.specification[
              i
            ].mediaThumbnailUrl
              .split("/")
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
              .split("/")
              .pop(-1);
            indirectPurchaseIndexData.statementOfWork[
              i
            ].mediaThumbnailUrl = indirectPurchaseIndexData.statementOfWork[
              i
            ].mediaThumbnailUrl
              .split("/")
              .pop(-1);
          }
        }
      }

      if (indirectPurchaseIndexData.purchaseRequestNumber === "") {
        errorMsg.push("Please enter Purchase request number");
        flag = false;
      } else if (indirectPurchaseIndexData.projectId === "") {
        errorMsg.push("Please select Project");
        flag = false;
      }

      console.log("indirectPurchaseIndexData", indirectPurchaseIndexData);
      if (!indirectPurchaseIndexData.id) {
        listOfIndirectPurchase.push({
          //id: indirectPurchaseIndexData.id ? indirectPurchaseIndexData.id : 0,
          purchaseRequestNumber:
            indirectPurchaseIndexData.purchaseRequestNumber,
          itemDescription: indirectPurchaseIndexData.itemDescription,
          projectId: indirectPurchaseIndexData.projectId,
          region: indirectPurchaseIndexData.region,
          referencePartId: indirectPurchaseIndexData.referencePartId,
          department: indirectPurchaseIndexData.department,
          mainCategory: indirectPurchaseIndexData.mainCategory,
          spendCategory: indirectPurchaseIndexData.spendCategory,
          subCategory: indirectPurchaseIndexData.subCategory,
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
            ? covertToTimeStamp(indirectPurchaseIndexData.targetDeliveryDate)
            : "",
          targetCompletionDate: indirectPurchaseIndexData.targetCompletionDate
            ? covertToTimeStamp(indirectPurchaseIndexData.targetCompletionDate)
            : "",
          statementOfWork: indirectPurchaseIndexData.statementOfWork
            ? indirectPurchaseIndexData.statementOfWork
            : [],
          specification: indirectPurchaseIndexData.specification
            ? indirectPurchaseIndexData.specification
            : [],
          listOfMilestoneRequest: indirectPurchaseIndexData.listOfMilestoneRequest
            ? indirectPurchaseIndexData.listOfMilestoneRequest
            : []
        });
      }
    });

    if (flag) {
      let data = {
        roleId: _this.props.userInfo.userData.userRole,
        userId: _this.props.userInfo.userData.id,
        indirectPurchaseRequestList: listOfIndirectPurchase
      };
      console.log("indirectPurchaseRowObject--", data);
      this.props
        .actionSubmitIndirectPurchase(data)
        .then((result, error) => {
          _this.props.actionLoaderHide();
          console.log("result----", result);
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      if (errorMsg) {
        showError = errorMsg.join(",\r\n");
        showErrorToast(showError);
      }
    }
  }

  handleUploadSpecification(event, index) {
    const fileObject = event.target.files[0];
    if (fileObject) {
      let _this = this;
      let specification = {};
      const formData = new FormData();
      formData.set("mFile", fileObject);
      formData.append("thumbnailHeight", 100);
      formData.append("thumbnailWidth", 100);
      formData.append("isCreateThumbnail", true);
      formData.append("fileKey", fileObject.name);
      formData.append("filePath", fileObject.name);

      this.props.actionLoaderShow();
      this.props
        .actionUploadSpecificationForIndirect(formData)
        .then((result, error) => {
          let mediaExtension = result.payload.data.filePath.split(".").pop(-1);
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
          let partListUpdateJson = partListUpdate[index];

          partListUpdateJson.specification = reqArray;

          partListUpdate[index] = partListUpdateJson;

          this.setState({ listOfIndirectPurchase: partListUpdate });

          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }

  handleUploadStatementOfWork(event, index) {
    const fileObject = event.target.files[0];
    if (fileObject) {
      let _this = this;
      let statementOfWork = {};
      let reqArray = [];
      const formData = new FormData();
      formData.set("mFile", fileObject);
      formData.append("thumbnailHeight", 100);
      formData.append("thumbnailWidth", 100);
      formData.append("isCreateThumbnail", true);
      formData.append("fileKey", fileObject.name);
      formData.append("filePath", fileObject.name);

      this.props.actionLoaderShow();
      this.props
        .actionUploadStatementOfWorkForIndirect(formData)
        .then((result, error) => {
          let mediaExtension = result.payload.data.filePath.split(".").pop(-1);
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
          let partListUpdateJson = partListUpdate[index];

          partListUpdateJson.statementOfWork = reqArray;

          partListUpdate[index] = partListUpdateJson;

          this.setState({ listOfIndirectPurchase: partListUpdate });

          _this.props.actionLoaderHide();
        })
        .catch(e => {
          _this.props.actionLoaderHide();
        });
    }
  }

  // handleIndirectPurchaseView(event, index) {}

  handleIndirectPurchasePreview(event, data, type) {
    console.log("handleIndirectPurchasePreview---", data);
    console.log("handleIndirectPurchasePreview---", [data]);
    if (type == "milestone") {
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
    console.log("handleIndirectPurchasePreview---", data);
    console.log("handleIndirectPurchasePreview---", [data]);
    this.setState({
      showMilestonePreview: true,
      elementMilestone: data
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
    console.log("value--", value);
    value = value.replace(/[^\0-9]/gi, "");
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
  handleOnChangeNumber(event, index) {
    const { name, value } = event.target;
    let listOfIndirectPurchaseData = this.state.listOfIndirectPurchase;
    let documentTypeListJson = listOfIndirectPurchaseData[index];
    documentTypeListJson[name] = parseFloat(value) ? parseFloat(value) : "";
    listOfIndirectPurchaseData[index] = documentTypeListJson;
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
    let cssContainer = document.getElementById("dateTimeCss");
    console.log("find coordinate clicked");
    console.log(cssContainer.innerHTML);
    if (cssContainer && cssContainer.innerHTML == "")
      cssContainer.innerHTML =
        ".rdtPicker { left: " + targetElement["x"] + "px }";
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === "eleven" ? "eleven" : "none"}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === "eleven" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <div className="flex justify-space-between align-center">
                  <h4 className="hero-title">Indirect Purchase request</h4>

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
                    className="custom-table cell-input out-calander budgetTbWrapper"
                  >
                    <thead>
                      <tr>
         
                        <th>Purchase request number</th>
                        <th>Item Description</th>
                        <th>Regions</th>
                        <th>Functional Area/Department</th>
                        <th>Spend Category</th>
                        <th>Plant/Office</th>
                        <th>Spending Account</th>
                        <th>Account Description</th>
                        <th>Total Budget(this Year)</th>
                        <th>Amount Available</th>
                        <th>UOM</th>
                        <th>quantity</th>
                        <th>Specification</th>
                        <th>Statement of work</th>
                        <th>Target Delivery Date/ Start of Project</th>
                        <th>Target completion of Project</th>
                        <th>Program/Project</th>
                        <th>Delivery address</th>
                        <th>Project Location</th>
                        <th>Specific Quality requirement</th>
                        <th>Milestone</th>
                      </tr>
                    </thead>
                    <tbody>

                           <tr>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                 
                                    name="purchaseRequestNumber"
                                    placeholder="DFR423412.1"
                        
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Item Description"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0"
                                    name="region"
                                   
                                  >
                                    <option value="select">select</option>
                                    <option value="region1">region1</option>
                                    <option value="region2">region2</option>
                                    <option value="region3">region3</option>
                                  
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
                                  
                                  >
                                    <option value="select">select</option>
                                   
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
                                  
                                  >
                                    <option value="select">select</option>
                                   
                                  </FormControl>
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0"
                                    name="plant"
                                
                                 
                                  >
                                    <option value="select">select</option>
                            
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="spendingAccount"
                                    placeholder="Spending Account"
                                
                                
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="accountDescription"
                                    placeholder="Account Description"
                                   
                          
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
                                  
                                    maxlength="20"
                               
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
                                  
                                    maxlength="20"
                                
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="UOM"
                                    placeholder="UOM"
                             
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                             
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Quantity"
                                    name="quantity"
                                   
                                    maxlength="20"
                                   
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                              
                                     <img alt="" src={docImage} width="45" />
                               
                              </td>
                              <td>
                        
                                <img alt="" src={pdfImage} width="45" />
                              
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                    <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                  
                                
                                  
                                    />

                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                    <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                    
                                     
                                    />

                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    className="s-arrow br-0"
                                    componentClass="select"
                                    placeholder="select"
                                 
                                  >
                                    <option value="">Select</option>
                                  
                                          <option>
                                         aaaa
                                          </option>
                                   
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Delivery Address"
                                   
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
                                   
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Specific Quality Requirement"
                                    name="specificQualityRequirement"
                              
                                 
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                             <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Milestone"
                                    name="specificQualityRequirement"
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                            </tr>
               

                            <tr>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                             
                                    name="purchaseRequestNumber"
                                    placeholder="DFR423412.2"
                        
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Item Description"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0"
                                    name="region"
                                   
                                  >
                                    <option value="select">select</option>
                                    <option value="region1">region1</option>
                                    <option value="region2">region2</option>
                                    <option value="region3">region3</option>
                                  
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
                                  
                                  >
                                    <option value="select">select</option>
                                   
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
                                  
                                  >
                                    <option value="select">select</option>
                                   
                                  </FormControl>
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0"
                                    name="plant"
                                
                                 
                                  >
                                    <option value="select">select</option>
                            
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="spendingAccount"
                                    placeholder="Spending Account"
                                
                                
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="accountDescription"
                                    placeholder="Account Description"
                                   
                          
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
                                  
                                    maxlength="20"
                               
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
                                  
                                    maxlength="20"
                                
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="UOM"
                                    placeholder="UOM"
                             
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                             
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Quantity"
                                    name="quantity"
                                   
                                    maxlength="20"
                                   
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                              
                               <img alt="" src={docImage} width="45" />
                               
                              </td>
                              <td>
                        
                                <img alt="" src={pdfImage} width="45" />
                              
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                    <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                  
                                
                                  
                                    />

                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                    <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                    
                                     
                                    />

                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    className="s-arrow br-0"
                                    componentClass="select"
                                    placeholder="select"
                                 
                                  >
                                    <option value="">Select</option>
                                  
                                          <option>
                                         aaaa
                                          </option>
                                   
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Delivery Address"
                                   
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
                                   
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Specific Quality Requirement"
                                    name="specificQualityRequirement"
                              
                                 
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                             <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Milestone"
                                    name="specificQualityRequirement"
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                            </tr>
                            
                           <tr>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                 
                                    name="purchaseRequestNumber"
                                    placeholder="DFR423412.3"
                        
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Item Description"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0"
                                    name="region"
                                   
                                  >
                                    <option value="select">select</option>
                                    <option value="region1">region1</option>
                                    <option value="region2">region2</option>
                                    <option value="region3">region3</option>
                                  
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
                                  
                                  >
                                    <option value="select">select</option>
                                   
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
                                  
                                  >
                                    <option value="select">select</option>
                                   
                                  </FormControl>
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0"
                                    name="plant"
                                
                                 
                                  >
                                    <option value="select">select</option>
                            
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="spendingAccount"
                                    placeholder="Spending Account"
                                
                                
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="accountDescription"
                                    placeholder="Account Description"
                                   
                          
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
                                  
                                    maxlength="20"
                               
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
                                  
                                    maxlength="20"
                                
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="UOM"
                                    placeholder="UOM"
                             
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                             
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Quantity"
                                    name="quantity"
                                   
                                    maxlength="20"
                                   
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                              
                                     <img alt="" src={docImage} width="45" />
                               
                              </td>
                              <td>
                        
                                <img alt="" src={pdfImage} width="45" />
                              
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                    <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                  
                                
                                  
                                    />

                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                    <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                    
                                     
                                    />

                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    className="s-arrow br-0"
                                    componentClass="select"
                                    placeholder="select"
                                 
                                  >
                                    <option value="">Select</option>
                                  
                                          <option>
                                         aaaa
                                          </option>
                                   
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Delivery Address"
                                   
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
                                   
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Specific Quality Requirement"
                                    name="specificQualityRequirement"
                              
                                 
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                             <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Milestone"
                                    name="specificQualityRequirement"
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                            </tr>

                           <tr>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                 
                                    name="purchaseRequestNumber"
                                    placeholder="DFR423412.4"
                        
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Item Description"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0"
                                    name="region"
                                   
                                  >
                                    <option value="select">select</option>
                                    <option value="region1">region1</option>
                                    <option value="region2">region2</option>
                                    <option value="region3">region3</option>
                                  
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
                                  
                                  >
                                    <option value="select">select</option>
                                   
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
                                  
                                  >
                                    <option value="select">select</option>
                                   
                                  </FormControl>
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0"
                                    name="plant"
                                
                                 
                                  >
                                    <option value="select">select</option>
                            
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="spendingAccount"
                                    placeholder="Spending Account"
                                
                                
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="accountDescription"
                                    placeholder="Account Description"
                                   
                          
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
                                  
                                    maxlength="20"
                               
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
                                  
                                    maxlength="20"
                                
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="UOM"
                                    placeholder="UOM"
                             
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                             
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Quantity"
                                    name="quantity"
                                   
                                    maxlength="20"
                                   
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                              
                                     <img alt="" src={docImage} width="45" />
                               
                              </td>
                              <td>
                        
                                <img alt="" src={pdfImage} width="45" />
                              
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                    <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                  
                                
                                  
                                    />

                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                    <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                    
                                     
                                    />

                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    className="s-arrow br-0"
                                    componentClass="select"
                                    placeholder="select"
                                 
                                  >
                                    <option value="">Select</option>
                                  
                                          <option>
                                         aaaa
                                          </option>
                                   
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Delivery Address"
                                   
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
                                   
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Specific Quality Requirement"
                                    name="specificQualityRequirement"
                              
                                 
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                             <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Milestone"
                                    name="specificQualityRequirement"
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                 
                                    name="purchaseRequestNumber"
                                    placeholder="DFR423412.5"
                        
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Item Description"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0"
                                    name="region"
                                   
                                  >
                                    <option value="select">select</option>
                                    <option value="region1">region1</option>
                                    <option value="region2">region2</option>
                                    <option value="region3">region3</option>
                                  
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
                                  
                                  >
                                    <option value="select">select</option>
                                   
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
                                  
                                  >
                                    <option value="select">select</option>
                                   
                                  </FormControl>
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0"
                                    name="plant"
                                
                                 
                                  >
                                    <option value="select">select</option>
                            
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="spendingAccount"
                                    placeholder="Spending Account"
                                
                                
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="accountDescription"
                                    placeholder="Account Description"
                                   
                          
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
                                  
                                    maxlength="20"
                               
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
                                  
                                    maxlength="20"
                                
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="UOM"
                                    placeholder="UOM"
                             
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                             
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Quantity"
                                    name="quantity"
                                   
                                    maxlength="20"
                                   
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                              
                                     <img alt="" src={docImage} width="45" />
                               
                              </td>
                              <td>
                        
                                <img alt="" src={pdfImage} width="45" />
                              
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                    <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                  
                                
                                  
                                    />

                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                    <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                    
                                     
                                    />

                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    className="s-arrow br-0"
                                    componentClass="select"
                                    placeholder="select"
                                 
                                  >
                                    <option value="">Select</option>
                                  
                                          <option>
                                         aaaa
                                          </option>
                                   
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Delivery Address"
                                   
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
                                   
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Specific Quality Requirement"
                                    name="specificQualityRequirement"
                              
                                 
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                             <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Milestone"
                                    name="specificQualityRequirement"
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                            </tr>

                           <tr>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                 
                                    name="purchaseRequestNumber"
                                    placeholder="DFR423412.6"
                        
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="itemDescription"
                                    placeholder="Item Description"
                               
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0"
                                    name="region"
                                   
                                  >
                                    <option value="select">select</option>
                                    <option value="region1">region1</option>
                                    <option value="region2">region2</option>
                                    <option value="region3">region3</option>
                                  
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
                                  
                                  >
                                    <option value="select">select</option>
                                   
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
                                  
                                  >
                                    <option value="select">select</option>
                                   
                                  </FormControl>
                                </FormGroup>
                              </td>
                        
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    className="s-arrow br-0"
                                    name="plant"
                                
                                 
                                  >
                                    <option value="select">select</option>
                            
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="spendingAccount"
                                    placeholder="Spending Account"
                                
                                
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="accountDescription"
                                    placeholder="Account Description"
                                   
                          
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
                                  
                                    maxlength="20"
                               
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
                                  
                                    maxlength="20"
                                
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  {" "}
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    name="UOM"
                                    placeholder="UOM"
                             
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                             
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Quantity"
                                    name="quantity"
                                   
                                    maxlength="20"
                                   
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                              
                                     <img alt="" src={docImage} width="45" />
                               
                              </td>
                              <td>
                        
                                <img alt="" src={pdfImage} width="45" />
                              
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                    <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                  
                                
                                  
                                    />

                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              <td ref="elem">
                                <div onClick={this.findCoordinate.bind(this)}>
                                  <FormGroup className="m-b-0">
                                    <Datetime
                                      className="db-0"
                                      closeOnSelect="true"
                                      dateFormat="DD/MM/YYYY"
                                    
                                     
                                    />

                                    <FormControl.Feedback />
                                  </FormGroup>
                                </div>
                              </td>
                              <td>
                                <FormGroup controlId="formControlsSelect">
                                  <FormControl
                                    className="s-arrow br-0"
                                    componentClass="select"
                                    placeholder="select"
                                 
                                  >
                                    <option value="">Select</option>
                                  
                                          <option>
                                         aaaa
                                          </option>
                                   
                                  </FormControl>
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Delivery Address"
                                   
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
                                   
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                                <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Specific Quality Requirement"
                                    name="specificQualityRequirement"
                              
                                 
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                              <td>
                             <FormGroup className="m-b-0">
                                  <FormControl
                                    type="text"
                                    className="br-0 "
                                    placeholder="Milestone"
                                    name="specificQualityRequirement"
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                            </tr>
                    </tbody>
                  </Table>
                </div>

                {/* <button
                      className="btn btn-danger"
                     
                    >
                      Remove Item
                    </button>
                    <button
                      className="btn btn-default"
                    
                    >
                      Add Item
                    </button> */}

                <div>
                  <span
                    onClick={() => {
                      this.addIndirectPurchaseDataRow("approve");
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
                    &nbsp;&nbsp;Remove Items&nbsp;{" "}
                    <span className="ico-minusgly"> </span>
                  </span>
                </div>
                <div className="text-center m-b-15">
                  <button
                    className="btn btn-default text-uppercase">
                    Save
                  </button> 
                  <button
                    className="btn btn-default text-uppercase">
                    Submit
                  </button>
                  <button
                    className="btn btn-primary text-uppercase">
                    Print Preview
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
                        {" "}
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
                      <th>Target Date</th>
                      <th>Delivery Criteria</th>
                      <th>Payment Value</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                   
                          <tr>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="number"
                                  className="br-0 "
                                  name="milestoneNumber"
                                  min="1"
                                  max="99999"
                               
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                           
                            <td>
                              <FormGroup className="m-b-0">
                                <Datetime
                                  className="db-0"
                                  closeOnSelect="true"
                                  dateFormat="DD/MM/YYYY"
                                 
                                />

                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="text"
                                  className="br-0 "
                                  name="deliveryCriteria"
                                 
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
                                    maxlength="20"
                                 
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                          </tr>
                         
                              <tr>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="number"
                                  className="br-0 "
                                  name="milestoneNumber"
                                  min="1"
                                  max="99999"
                               
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                           
                            <td>
                              <FormGroup className="m-b-0">
                                <Datetime
                                  className="db-0"
                                  closeOnSelect="true"
                                  dateFormat="DD/MM/YYYY"
                                 
                                />

                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="text"
                                  className="br-0 "
                                  name="deliveryCriteria"
                                 
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
                                    maxlength="20"
                                 
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                          </tr>

                               <tr>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="number"
                                  className="br-0 "
                                  name="milestoneNumber"
                                  min="1"
                                  max="99999"
                               
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                           
                            <td>
                              <FormGroup className="m-b-0">
                                <Datetime
                                  className="db-0"
                                  closeOnSelect="true"
                                  dateFormat="DD/MM/YYYY"
                                 
                                />

                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="text"
                                  className="br-0 "
                                  name="deliveryCriteria"
                                 
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
                                    maxlength="20"
                                 
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                          </tr>
                               <tr>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="number"
                                  className="br-0 "
                                  name="milestoneNumber"
                                  min="1"
                                  max="99999"
                               
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                           
                            <td>
                              <FormGroup className="m-b-0">
                                <Datetime
                                  className="db-0"
                                  closeOnSelect="true"
                                  dateFormat="DD/MM/YYYY"
                                 
                                />

                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="text"
                                  className="br-0 "
                                  name="deliveryCriteria"
                                 
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
                                    maxlength="20"
                                 
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                          </tr>
                               <tr>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="number"
                                  className="br-0 "
                                  name="milestoneNumber"
                                  min="1"
                                  max="99999"
                               
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                           
                            <td>
                              <FormGroup className="m-b-0">
                                <Datetime
                                  className="db-0"
                                  closeOnSelect="true"
                                  dateFormat="DD/MM/YYYY"
                                 
                                />

                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="text"
                                  className="br-0 "
                                  name="deliveryCriteria"
                                 
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
                                    maxlength="20"
                                 
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                          </tr>
                               <tr>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="number"
                                  className="br-0 "
                                  name="milestoneNumber"
                                  min="1"
                                  max="99999"
                               
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                           
                            <td>
                              <FormGroup className="m-b-0">
                                <Datetime
                                  className="db-0"
                                  closeOnSelect="true"
                                  dateFormat="DD/MM/YYYY"
                                 
                                />

                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                            <td>
                              <FormGroup className="m-b-0">
                                <FormControl
                                  type="text"
                                  className="br-0 "
                                  name="deliveryCriteria"
                                 
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
                                    maxlength="20"
                                 
                                />
                                <FormControl.Feedback />
                              </FormGroup>
                            </td>
                          </tr>
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
                        this.state.listOfPreviewData.map((item, index) => {
                          console.log("listOfPreviewData----", item);
                          return [
                            <tr>
                              <td>
                                <span
                                  className={
                                    index % 4 === 0
                                      ? "r-caret red"
                                      : index % 4 === 1
                                      ? "r-caret green"
                                      : index % 4 === 2
                                      ? "r-caret blue"
                                      : "r-caret yellow"
                                  }
                                >
                                  {" "}
                                </span>
                                {item.purchaseRequestNumber}
                              </td>
                              <td>
                                {item.project && item.project.projectCode}
                              </td>
                              <td>{item.referencePartId}</td>
                              <td>{item.itemDescription}</td>
                              <td>{item.region}</td>
                              <td>
                                {item.department && item.department.department}
                              </td>
                              <td>
                                {item.mainCategory &&
                                  item.mainCategory.mainCatgeory}
                              </td>
                              <td>
                                {item.spendCategory &&
                                  item.spendCategory.spendCategory}
                              </td>
                              <td>
                                {item.subCategory &&
                                  item.subCategory.subCategory}
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
                                  moment(item.targetDeliveryDate).format(
                                    "DD/MM/YYYY"
                                  )}
                              </td>
                              <td>
                                {item.targetCompletionDate &&
                                  moment(item.targetCompletionDate).format(
                                    "DD/MM/YYYY"
                                  )}
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
                    ""
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
                    {this.state.elementMilestone &&
                      this.state.elementMilestone.map((item, index) => {
                        return (
                          <tr>
                            <td>{item.milestoneNumber}</td>
                            <td>{item.milestoneName}</td>
                            <td>
                              {item.targetDate &&
                                moment(item.targetDate).format("DD/MM/YYYY")}
                            </td>
                            <td>{item.deliveryCriteria}</td>
                            <td>{item.paymentValue}</td>
                            <td>{item.paymentPercentage}</td>
                          </tr>
                        );
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
      actionGetPurchaseCategoryData,
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
    supplierParts: state.supplierParts
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(budget7);
