import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import validation from "react-validation-mixin";
import strategy from "react-validatorjs-strategy";
import classnames from "classnames";
import {
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Table,
  Modal,
  Row,
  Col,
  Tab,
  Nav,
  NavItem,
  DropdownButton,
  Panel,InputGroup, Glyphicon
} from "react-bootstrap";
import Sprite from "../../img/sprite.svg";
import _ from "lodash";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionCreateECO,
  actionECODropDownData,
  actionECOPartDropDownData,
  actionGetAllProjectData,
  actionBOMVariantData,
  actionBOMSubVariantData,
  actionSearchPartByKeyword,
  actionGetBOMCalculationData,
  actionUpdateBOMData,
  actionGetBOMFilterData,
  actuionGetSuggessionFilterData,
  actuionGetWhereUsedData,
  actuionGetFindAllBOMData,
  actionUploadImage
} from "../../common/core/redux/actions";
import {
  renderMessage,
  showErrorToast,
  showSuccessToast
} from "../../common/commonFunctions";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import Footer from "../common/footer";
import CONSTANTS from "../../common/core/config/appConfig";
import SliderModal from '../slider/partImageSliderModal';

import { handlePermission } from "../../common/permissions";
import { isArray } from "util";
let { permissionConstant, validationMessages,customConstant } = CONSTANTS;

const otherApproversStyle = {
  height: "34px",
  fontSize: "14px",
  fontWeight: "normal",
  textTransform: "lowercase",
  lineHeight: "0.428571",
  paddingLeft: "14px",
  color: "#555",
  bordreRadius: "4px"
};
const pointerCursor = {
  cursor: 'pointer'
};

class CreateECO extends Component {
 
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAddShow = this.handleAddShow.bind(this);
    this.handleAddClose = this.handleAddClose.bind(this);
    this.handleRemoveShow = this.handleRemoveShow.bind(this);
    this.handleRemoveClose = this.handleRemoveClose.bind(this);
    this.handleReplaceClose = this.handleReplaceClose.bind(this);
    this.handleReplaceShow = this.handleReplaceShow.bind(this);
    // this.handleTreeClick = this.handleTreeClick.bind(this);  
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.submitECO = this.submitECO.bind(this);
    this.validateData = this.validateData.bind(this);
    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.activateValidation = this.activateValidation.bind(this);
    this.getPartByKeyword = this.getPartByKeyword.bind(this);
    this.getSuggessionFilterData = this.getSuggessionFilterData.bind(this);
    this.handleSpecalMFGClose = this.handleSpecalMFGClose.bind(this);
    this.handleSpecalPackClose = this.handleSpecalPackClose.bind(this);
    this.hideCropImgModal = this.hideCropImgModal.bind(this);

    this.state = {
      tabKey: "ninth",
      show: false,
      addShow: false,
      removeShow: false,
      replaceShow: false,
      rowArray: [{}, {}, {}],

      ecoNumber: "ECO" + "#" + ((Math.random() * 0xffffff) << 0).toString(16),
      ecoDescription: "",
      priorityLevel: "",
      projectId: "",
      projectDescription: "",
      ecoCategory: "",
      ecoChangeDescription: "",
      otherSpecialDescription: "",
      designerId: "",
      designerApproverId: "",
      otherApproversIds: [],
      shippingPlantAddress: {},
      receivingPlantAddress: {},
      designLocation: {},
      otherApprResId: [],
      newShippingPlantResponse: {},
      shippingPlantResponse1: {},
      receivingPlantResponse1: {},
      designLocationResponse1: {},
      isShowDesignerApprover: true,
      partResponse: [],
      partArrays: true,
      allProjectList: [],
      projectVariantId: '',
      projectVariant: [],
      BOMId: '',
      BOMCalculation: [],
      BOMCalculationData:[],
      ChkBoxVariant: false,
      BOMSubVariantData: [],
      showBOMData: false,
      searchKeword: '',
      searchAutoList: false,
      filterDDAutoList: false,
      partSearchingList: [],
      dataOfSearchPart: {},
      buildMaterialId: '',
      action:'',
      BOMVariantData: [],
      listOfModelFamilies: [],
      listOfParts: [],
      listOfModels: [],
      listOfTechnicalTypes:[],
      listOfVariants: [],
      pid: '', modelFamilyId: '', modelId: '', variantId:'', technnicalTypeId:'',
      searchedData: [], usedBomIds: [], allBomData: [], allBomList: [],searchPartNo:[], aa:[],
      showUserDefinedBomIds: true, showUserDefinedMFGIds: true, expandDataIndex:[], firstTreeHide:true,
      cropPartImage:'', specalMFGData:[''], specalPackData:[''], listOfEcoRequest:[], ecoBomXDataRequests:[],
      ECOArray:[], searchEnable: true, showCropImg: false, childIndexPartImg:'', parentIndexPartImg:'',sliderShow:false,
    };
    /* For Validation */
    this.validatorTypes = strategy.createInactiveSchema(
      {
       // ecoNumber: "required",
       // projectId: "required",
        ecoCategory: "required"
      },
      {
        //"required.ecoNumber": validationMessages.ecoNumber.required,
       // "required.projectId": validationMessages.projectId.required,
        "required.ecoCategory": validationMessages.ecoCategory.required
      }
    );
  }

  /* Get All Dropdowns */
  getECODropDownData() {
    let _this = this;
    let data = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole
    };
    this.props.actionLoaderShow();
    this.props
      .actionECODropDownData(data)
      .then((result, error) => {
        if (result.payload.data.status === 200) {
          let designerApproverRes = [];
          let designerIndex;
          let ecoDropDownData = result.payload.data.resourceData;

          _this.setState({
            designerResponse: ecoDropDownData.designerResponse,
            otherApproversResponse: ecoDropDownData.otherApproversResponse,
            designLocationResponse: ecoDropDownData.designLocationResponse,
            receivingPlantResponse: ecoDropDownData.receivingPlantResponse,
            shippingPlantResponse: ecoDropDownData.shippingPlantResponse
          });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
    window.addEventListener("scroll", this.handleScroll);
  }

  componentDidMount() {
    this.getECODropDownData();
    this.getBOMFilterData();
    this.getAllProject();
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

  // handleTreeClick(event) {
  //   let rowArray = this.state.rowArray;
  //   if (event.target.checked) {
  //     rowArray.push({}, {}, {});
  //   } else {
  //     for (let i = 0; i < 3; i++) {
  //       rowArray.pop();
  //     }
  //   }
  //   this.setState({ rowArray: rowArray });
  // }

  handleCommentClose() {
    this.setState({ showCommentModal: false });
  }
  handleClose() {
    this.setState({ show: false });
  }
  handleShow() {
    this.setState({ show: true });
  }
  handleAddClose() {
    this.setState({ addShow: false });
  }
  handleAddShow() {
    this.setState({ addShow: true });
  }
  handleRemoveClose() {
    this.setState({ removeShow: false });
  }
  handleRemoveShow(bomId, action) {
    this.setState({
      removeShow: true,
      removeBOMId: bomId
    });
  }
  handleReplaceClose() {
    this.setState({
      replaceShow: false,
      searchKeword: '',
    });
  }
  handleReplaceShow(bomId, action) {
    this.setState({
      replaceShow: true,
      buildMaterialId: bomId,
      action: action,
    });
  }

  /* For Validation */
  getValidatorData = () => {
    return this.state;
  };
  getClasses = field => {
    return classnames({
      error: !this.props.isValid(field)
    });
  };

  activateValidation = e => {
    strategy.activateRule(this.validatorTypes, e.target.name);
    this.props.handleValidation(e.target.name)(e);
  };

  stateSetting(){
    let MFId = this.state.modelFamilyId;   
    this.setState({
      modelFamilyId:MFId
    })
  }

  handleOnChange(e) {
    const { name } = e.target;
    const { value } = e.target;
    if (name === 'designerId') {
      const selectedIndex = e.target.options.selectedIndex;
      const designerIndex = e.target.options[selectedIndex].getAttribute(
        "data-key"
      );
      if (selectedIndex && selectedIndex) {
        let value1 = designerIndex;
        this.setState({
          [name]: value,
          designerIndex: value1,
          isShowDesignerApprover: false,
        });
      } else {
        this.setState({
          [name]: value,
          isShowDesignerApprover: true,
          designerApproverId: ''
        })
      }
    } else if (name === 'shippingPlantAddress') {
      let shippingPlantData;
      let shippingPlantAddress = _.filter(
        this.state.shippingPlantResponse,
        function (data) {
          return data.address === value;
        }
      );
      this.setState({ shippingPlantResponse1: shippingPlantAddress });
      this.setState({ [name]: value });
    } else if (name === "receivingPlantAddress") {
      let receivingPlantAddress = _.filter(
        this.state.receivingPlantResponse,
        function (data) {
          return data.address === value;
        }
      );
      this.setState({ receivingPlantResponse1: receivingPlantAddress });
      this.setState({ [name]: value });
    } else if (name === "designLocation") {
      let designLocation = _.filter(this.state.designLocationResponse, function (
        data
      ) {
        return data.address === value;
      });
      this.setState({ designLocationResponse1: designLocation });
      this.setState({ [name]: value });
    } else if (name === "projectId") {
        if (value === 'select') {
          this.setState({ 
            partResponse: [], 
            projectPart: '', 
            partArrays: true, 
            pid: '', modelFamilyId: '', modelId: '', variantId:'', technnicalTypeId:''
          },
          () => {
            this.getBOMFilterData(this.state.pid, this.state.modelFamilyId, this.state.modelId, this.state.variantId, this.state.technnicalTypeId); 
            this.setState({ [name]: value });
          });
        } else {            
          this.setState({ partArrays: false});
          this.getPart(value);
          let val = value=='select' ? '' : value;
          this.getBOMFilterData(val, '', '', '', ''); 
          this.setState({ [name]: value, pid: val});
        }

    } else if (name === "modelFamilyId") {
        if (value === 'select') {
          this.setState(
            { modelFamilyId: '', modelId: '', variantId:'', technnicalTypeId:'' },
            () => {
              this.getBOMFilterData(this.state.pid, this.state.modelFamilyId, this.state.modelId, this.state.variantId, this.state.technnicalTypeId); 
              this.setState({ [name]: value });             
            } 
          );        
        }else{
          let val = value=='select' ? '' : value;
          this.getBOMFilterData('', val, '', '', ''); 
          this.setState({ [name]: value });
        }       

    } else if (name === "modelId") {
        if (value === 'select') {
          this.setState(
            {modelId: '', variantId:'', technnicalTypeId:'' },
            () => {
              this.getBOMFilterData(this.state.pid, this.state.modelFamilyId, this.state.modelId, this.state.variantId, this.state.technnicalTypeId); 
              this.setState({ [name]: value });
            } 
          );        
        }else{
          let val = value=='select' ? '' : value;
          this.getBOMFilterData('', '', val, '', ''); 
          this.setState({ [name]: value });
        }
    } else if (name === "variantId") {
      if (value === 'select') {
        this.setState(
          {variantId:'', technnicalTypeId:'' },
          () => {
            this.getBOMFilterData(this.state.pid, this.state.modelFamilyId, this.state.modelId, this.state.variantId, this.state.technnicalTypeId); 
            this.setState({ [name]: value });
          } 
        );        
      }else{
        let val = value=='select' ? '' : value;
        this.getBOMFilterData('', '', '', val, ''); 
        this.setState({ [name]: value });
      }
    } else if (name === "technnicalTypeId") {
      if (value === 'select') {
        this.setState(
          {technnicalTypeId:'' },
          () => {
            this.getBOMFilterData(this.state.pid, this.state.modelFamilyId, this.state.modelId, this.state.variantId, this.state.technnicalTypeId); 
            this.setState({ [name]: value });
          } 
        );        
      }else{
        let val = value=='select' ? '' : value;
        this.getBOMFilterData('', '', '', '', val); 
        this.setState({ [name]: value });
      }
    } else {
      this.setState({ [name]: value });
    }

      // let ECOArray = this.state.ECOArray
      // ECOArray[0][name] = value

  }

  getPart(pid) {
    let _this = this;   
    this.props
      .actionECOPartDropDownData({ projectId: pid })
      .then((result, error) => {
        if (result.payload.data.status === 200) {
          let partDropDownData = result.payload.data.resourceData;
          _this.setState({
            partResponse: partDropDownData,
            partArrays: false
          });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
    //window.addEventListener("scroll", this.handleScroll);
  }

  /* Remove */
  getBOMVariantData() {
    let _this = this;
    let projectVariantId = this.state.projectVariantId;
    if (projectVariantId) {
      this.props.actionLoaderShow();
      this.props
        .actionBOMVariantData({ projectId: projectVariantId })
        .then((result, error) => {
          if (result.payload.data.status === 200) {
            let BOMVariantData = result.payload.data.resourceData;
            var BOMCalculation = [...BOMVariantData];            
            _this.setState({
              BOMVariantData: BOMVariantData,
              BOMCalculation: BOMCalculation,             
            });
          }
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
      window.addEventListener("scroll", this.handleScroll);
    }
  }

  /* Get BOM SUB Variant Data */
  getBOMSubVariantData(bomId, event, index, level, parentIndex, partContainingBomId, uniqueId) {  
    let _this = this;
    let BOMVariantData = JSON.parse(JSON.stringify(this.state.allBomList));

    console.log("BOMVariantData44", BOMVariantData);
    _this.props.actionLoaderShow();

    if(bomId && event.target.checked){
      this.getBOMCalculation(bomId, event, index, level, parentIndex, partContainingBomId, uniqueId)
      this.props
      .actionBOMSubVariantData({ bomId: bomId, index: index, partContaingBomId: partContainingBomId })
      .then((result, error) => {
        if (result.payload.data.status === 200) {
          let BOMSubVariantDatas = result.payload.data.resourceData;     
          console.log("BOMSubVariantDatas", BOMSubVariantDatas);     
          BOMVariantData[parentIndex].bomList[index] = JSON.parse(JSON.stringify({...BOMVariantData[parentIndex].bomList[index], childBOM: result.payload.data.resourceData}));        

       _this.setState({
            allBomList: BOMVariantData,
            //firstTreeHide: BOMSubVariantDatas[0].firstTreeHide           
          });
        }
        _this.props.actionLoaderHide();
      }).catch(e => _this.props.actionLoaderHide());
      window.addEventListener("scroll", this.handleScroll);
    } else{  
      this.getBOMCalculation(bomId, event, index, level, parentIndex, partContainingBomId, uniqueId);
      if(level > 1){
        BOMVariantData[parentIndex].bomList[index] = JSON.parse(JSON.stringify({...BOMVariantData[parentIndex].bomList[index], childBOM: null}));
       }else{
        BOMVariantData[parentIndex].bomList[index] = JSON.parse(JSON.stringify({...BOMVariantData[parentIndex].bomList[index], childBOM: null}));
       } 

      this.setState({      
        allBomList: BOMVariantData
      }); 
      _this.props.actionLoaderHide();  
    }
  }

  getBOMCalculation(bomId, event, index, level, parentIndex, partContainingBomId, uniqueId) {   
    console.log();
    let _this = this;
    //let BOMCalculation = JSON.parse(JSON.stringify([...this.state.BOMCalculation]));  
    let BOMCalculation = [...this.state.BOMCalculation];   
    console.log("BOMCalculation", BOMCalculation); 
    _this.props.actionLoaderShow();
    if(bomId && event.target.checked){
      this.props
      .actionGetBOMCalculationData({ bomId: partContainingBomId, index:index })
      .then((result, error) => {
        if (result.payload.data.status === 200) {         
          let BOMCalculationData = result.payload.data.resourceData; 
          console.log("BOMCalculationDataBOMCalculationData",BOMCalculationData );

          let BOMCalList = BOMCalculation[parentIndex].bomList;
          let BOMCalculationDataIndex = BOMCalculationData.length-1; 
          let BOMIndex = BOMCalList.findIndex((obj => (obj.id === bomId && obj.uniqueId === uniqueId)));
          console.log(bomId, "bIndexxx", BOMIndex,"ddddd", BOMCalList );
          for (var i = 0; i < BOMCalculationData.length; i++) {
            BOMCalculation[parentIndex].bomList.splice(BOMIndex + 1, 0, BOMCalculationData[BOMCalculationDataIndex-i]); 
          }   
          
          console.log("ffffffffffff", BOMCalculation);

          _this.setState({        
            BOMCalculation: BOMCalculation,
            BOMCalculationData: BOMCalculationData
          });         

        }
        _this.props.actionLoaderHide();
      }).catch(e => _this.props.actionLoaderHide());
      window.addEventListener("scroll", this.handleScroll);
    } else{
        //const BOMCalculationData = [...this.state.BOMCalculationData];
        let BOMCalculation = JSON.parse(JSON.stringify(this.state.BOMCalculation));
        let BOMCalList = BOMCalculation[parentIndex].bomList;           
        let BOMIndex = BOMCalList.findIndex((obj => (obj.id === bomId && obj.uniqueId === uniqueId)));
                    
   
        let childBOMLength = BOMCalculation[parentIndex].bomList[BOMIndex].childBOMLength;
        BOMCalculation[parentIndex].bomList.splice(BOMIndex + 1, childBOMLength);

        this.setState({
          BOMCalculation: BOMCalculation        
        });     
        _this.props.actionLoaderHide(); 
    }
  }

  handleOnChangeKeyword(e) {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  }

  onChangeAutoList(e, data) {   
    this.setState({
      searchKeword: data.partNumber,
      searchAutoList: false,
      dataOfSearchPart: data
    });
  }

  replacePart(e) {   
    let updatePartData = this.state.dataOfSearchPart;
    let BOMCalculation = this.state.BOMCalculation;
    let parentBomIds = updatePartData.parentBomIds;
   
    if(this.state.searchKeword) {
      let objBOMIndex = BOMCalculation.findIndex((obj => obj.id === updatePartData.bomId));
      let bomNewCost = BOMCalculation[objBOMIndex].newCost;
      let grandCost = updatePartData.finalQuotationSelectedByBuyer.grandTotal;  
      BOMCalculation[objBOMIndex].newCost = grandCost;
      BOMCalculation[objBOMIndex].oldCost = bomNewCost;

      if (parentBomIds !== undefined && parentBomIds.length > 0) {
        for (var i = 0; i < parentBomIds.length; i++) {
          let parentBOMIndex = BOMCalculation.findIndex((obj => obj.id === parentBomIds[i]));
          let parentNewCost = BOMCalculation[parentBOMIndex].newCost;
          let costCal = grandCost - bomNewCost;
          let parentNewCostCalculate = costCal + parentNewCost;
          //BOMCalculation[parentBOMIndex].newCost = parentNewCostCalculate.toFixed(2);
          BOMCalculation[parentBOMIndex].newCost = Math.round(parentNewCostCalculate);
          BOMCalculation[parentBOMIndex].oldCost = parentNewCost;
          //  this.handleReplaceClose();

        }
      } else {
        BOMCalculation[objBOMIndex].newCost = grandCost;
        BOMCalculation[objBOMIndex].oldCost = bomNewCost;
        // this.handleReplaceClose();
      }
      
      this.handleReplaceClose();
      this.setState({ BOMCalculation: BOMCalculation });

    }else{
      showErrorToast("Part is required field");
      return false;
    }
 
  }

  removePart(e) {
    //let updatePartData = this.state.dataOfSearchPart;
    let BOMCalculation = this.state.BOMCalculation;    
    let removeBOMId = this.state.removeBOMId; 
   
      let objBOMIndex = BOMCalculation.findIndex((obj => obj.id === removeBOMId));
      let bomNewCost = BOMCalculation[objBOMIndex].newCost;
     // let grandCost = updatePartData.finalQuotationSelectedByBuyer.grandTotal;  
      BOMCalculation[objBOMIndex].newCost = 0;
      BOMCalculation[objBOMIndex].oldCost = bomNewCost;
      let parentBomIds = BOMCalculation[objBOMIndex].parentBomIds;   

      if (parentBomIds !== undefined && parentBomIds.length > 0) {
        for (var i = 0; i < parentBomIds.length; i++) {
          let parentBOMIndex = BOMCalculation.findIndex((obj => obj.id === parentBomIds[i]));
          let parentNewCost = BOMCalculation[parentBOMIndex].newCost;
          let costCal = 0 - bomNewCost;
          let parentNewCostCalculate = costCal + parentNewCost;
          //BOMCalculation[parentBOMIndex].newCost = parentNewCostCalculate.toFixed(2);
          BOMCalculation[parentBOMIndex].newCost = Math.round(parentNewCostCalculate);
          BOMCalculation[parentBOMIndex].oldCost = parentNewCost;
          //  this.handleReplaceClose();

        }
      } else {
        BOMCalculation[objBOMIndex].newCost = 0;
        BOMCalculation[objBOMIndex].oldCost = bomNewCost;
        // this.handleReplaceClose();
      }
      
      this.handleRemoveClose();
      this.setState({ BOMCalculation: BOMCalculation }); 
  }

  updateBOMData() {
    let _this = this;
    let finalData = this.state.BOMCalculation;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,       
      billOfMaterialRequests: finalData 
    };

    this.props
      .actionUpdateBOMData(data)
      .then((result, error) => {
       this.getBOMVariantData();
        _this.props.actionLoaderHide();         ;
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  getPartByKeyword() {
    let _this = this;
    let projectVariantId = this.state.projectVariantId;
    let serchKeyword = this.state.searchKeword;
    let bomId = this.state.buildMaterialId;
    if (serchKeyword.length > 0 && projectVariantId) {
      this.props.actionLoaderShow();
      this.props
        .actionSearchPartByKeyword({ keyword: serchKeyword, projectId: projectVariantId, bomId: bomId })
        .then((result, error) => {
          if (result.payload.data.status === 200) {        
            let partSearchingList = result.payload.data.resourceData;

            _this.setState({
              searchAutoList: true,
              partSearchingList: partSearchingList
            });
          }
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
      window.addEventListener("scroll", this.handleScroll);
    } else {
      this.setState({ searchAutoList: false })
    }

  }

  submitECO() {
    let _this = this;
    let isSubmitECO = true;
    let listOfEcoRequestData = [];
    
    // if (this.state.ecoCategory == '' || this.state.ecoCategory == 'select') {
    //   isSubmitECO = false;
    // } else if (this.state.projectId == '' || this.state.projectId == 'select') {
    //   isSubmitECO = false;
    // }
    if (isSubmitECO){
     let listOfEcoRequestData1 = this.state.listOfEcoRequest;
     console.log("aaaaaa", this.state.listOfEcoRequest);
    //listOfEcoRequestData1.length = 1


    console.log("listOfEcoRequestData1============", listOfEcoRequestData1);



    listOfEcoRequestData1.forEach(function(dataList, pIdx) { 
      let ecoBomXDataRequests = []
      console.log("dataList.ecoBomXDataRequests", dataList.ecoBomXDataRequests)

      dataList.ecoBomXDataRequests && dataList.ecoBomXDataRequests.forEach(function(item, cIdx) {
          console.log("ddddddddddd", item)
          ecoBomXDataRequests.push({
            id: item.id,
            partToBeChanged: "dfdsbhfgdsgf",
            oldCost: item.oldCost,
            newEstimatedCost: item.newEstimatedCost,
            actualNewCost: item.actualNewCost,
            estimatedManufactureCostImpact: item.estimatedManufactureCostImpact,
            actualManufactureCostImpact: item.actualManufactureCostImpact,
            estimatedManufactureInvestment: item.actualManufactureCostImpact,
            actualManufactureInvestment: item.actualManufactureInvestment,
            estimatedServiceCostImpact: item.estimatedServiceCostImpact,
            actualServiceCostImpact: item.actualServiceCostImpact,
            estimatedVendorTooling: item.estimatedVendorTooling,
            actualVendorTooling: item.actualVendorTooling,
            targetImplementationDate: item.targetImplementationDate,
            actualImplementationDate: item.actualImplementationDate,
            otherMandatoryEnggChangeForImplementationId: item.otherMandatoryEnggChangeForImplementationId,
            serialNumberBreakMandatory: item.serialNumberBreakMandatory,
            serialNumberBreak: item.serialNumberBreak,
            stockOnHand: item.stockOnHand,
            stockOnOrder: item.stockOnOrder,
            stockInServiceParts: item.stockInServiceParts,
            totalEstimatedScrap: item.totalEstimatedScrap,
            totalActualScrap: item.totalActualScrap,
            paint: item.paint,
            specialManufacturingInstructions: item.specialManufacturingInstructions,
            specialPackagingInstructions: item.specialPackagingInstructions,
            partsInterchangeableInService: item.partsInterchangeableInService,
            scrapPartsInService: item.scrapPartsInService,
            specialServiceInstructions: item.specialServiceInstructions,
            apqpDesignReviewRecord: item.apqpDesignReviewRecord,
            apqpManufacturingReviewRecord: item.apqpManufacturingReviewRecord,
            apqpManufacturingReviewRecord: item.apqpManufacturingReviewRecord,
            apqpValidationTestingRecord: item.apqpValidationTestingRecord,
            apqpDesignerId: item.apqpDesignerId,
            apqpImplementedById: item.apqpImplementedById,
            apqpQualityApprovalById: item.apqpQualityApprovalById,
            oldSupplier: item.oldSupplier,
            oldSupplierPartNumber: item.oldSupplierPartNumber,
            newSupplier: item.newSupplier,
            newSupplierPartNumber: item.newSupplierPartNumber,
            currentImage: item.currentImage,
            newImage: item.newImage
          })
        })
        console.log("ecoBomXDataRequests----------", ecoBomXDataRequests)

        listOfEcoRequestData.push({
          ecoNumber: dataList.ecoNumber,
          project: dataList.project,
          modelFamilyOfPart: dataList.modelFamilyOfPart,
          modelOfPart: dataList.modelOfPart,
          technicalTypeOfPart: dataList.technicalTypeOfPart,
          variantOfPart: dataList.variantOfPart,
          ecoBomXDataRequests: ecoBomXDataRequests
        })
      })

      let data = {
        roleId: _this.props.userInfo.userData.userRole,
        userId: _this.props.userInfo.userData.id,     
        ecoDescription: this.state.ecoDescription,
        priorityLevel: this.state.priorityLevel,
        ecoCategory: this.state.ecoCategory,
        ecoChangeDescription: this.state.ecoChangeDescription,
        otherSpecialDescription: this.state.otherSpecialDescription,
        designer: this.state.designerId,     
        shippingPlantAddress: this.state.shippingPlantResponse1[0],
        receivingPlantAddress: this.state.receivingPlantResponse1[0],
        designLocation: this.state.designLocationResponse1[0],          
        listOfEcoRequest: listOfEcoRequestData      
      };

      console.log("SubMItECO---------", data);

      _this.props
        .actionCreateECO(data)
        .then((result, error) => {
          _this.props.actionLoaderHide();
          if (result.payload.data.status === 200) {
            let response = result.payload.data.resourceData;
            let projectVariantId = response.id;
            this.setState({
              //ecoNumber:
              //  "ECO" + "#" + ((Math.random() * 0xffffff) << 0).toString(16),
              ecoDescription: "",
              priorityLevel: "",
              projectId: "",
              projectDescription: "",
              ecoCategory: "",
              ecoChangeDescription: "",
              otherSpecialDescription: "",
              designerId: "",
              designerApproverId: "",
              otherApproversIds: [],
              shippingPlantAddress: "",
              receivingPlantAddress: "",
              designLocation: "",                           
              projectVariantId: projectVariantId,
              projectVariant: response              
            });
            document.getElementById("createECOForm").reset();
          }
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      showErrorToast('Please enter required field first');
      return false;
    }
  }

  validateData = () => {
    let self = this;
    this.submitECO();
    // this.props.validate(function (error) {
    //   if (!error) {
    //     self.submitECO();
    //   }
    // });
  };
  
  /* Get BOM SUB Variant Data */
  getBOMSubVariantData1(bomId, index, parentIndex, initialIndex, parentIndexArray, childBOMIndex) { 
    console.log("zzzzz", bomId, index, parentIndex)  
    let _this = this;
    let BOMVariantData = this.state.allBomList;
    _this.props.actionLoaderShow();

    if(bomId){ 
      this.props
      .actionBOMSubVariantData({ bomId: bomId, index: index })
      .then((result, error) => {
        if (result.payload.data.status === 200) {
         
          console.log(BOMVariantData);

     //     BOMVariantData[parentIndex].bomList[index] = {...BOMVariantData[parentIndex].bomList[index], childBOM: result.payload.data.resourceData}        
           

      //     console.log(BOMVariantData[parentIndex].bomList[index]);    
      
      console.log("initialIndex --- ",initialIndex);
       
      var checkA=BOMVariantData[parentIndex].bomList[initialIndex];
      var newArray=[parentIndexArray.length];   
    
      for(var jmb=0;jmb<parentIndexArray.length;jmb++){
        checkA= checkA['childBOM'] && checkA['childBOM'][parentIndexArray[jmb]] ? checkA['childBOM'][parentIndexArray[jmb]] : [];
        newArray[jmb]=checkA;
      }
      
      if(  newArray[parentIndexArray.length-1] && !newArray[parentIndexArray.length-1]['childBOM'])
      newArray[parentIndexArray.length-1]['childBOM']=result.payload.data.resourceData;

      if(BOMVariantData[parentIndex].bomList[initialIndex] && BOMVariantData[parentIndex].bomList[initialIndex]['childBOM'] && BOMVariantData[parentIndex].bomList[initialIndex]['childBOM'][childBOMIndex])
      BOMVariantData[parentIndex].bomList[initialIndex]['childBOM'][childBOMIndex]= newArray[0];

         console.log('undefined check --- ',BOMVariantData);  
 

          _this.setState({
            allBomList: BOMVariantData           
          });
        }
        _this.props.actionLoaderHide();
      }).catch(e => _this.props.actionLoaderHide());
    } 
  }

  getBOMCalculation2(bomId, event, index, level, parentIndex, partContainingBomId, uniqueId) { 
    let _this = this;
    //let BOMCalculation = JSON.parse(JSON.stringify([...this.state.BOMCalculation]));  
    let BOMCalculation = [...this.state.BOMCalculation];   
    console.log("BOMCalculation", BOMCalculation); 
    _this.props.actionLoaderShow();
   
      this.props
      .actionGetBOMCalculationData({ bomId: partContainingBomId, index:index })
      .then((result, error) => {
        if (result.payload.data.status === 200) {         
          let BOMCalculationData = result.payload.data.resourceData;        

          let BOMCalList = BOMCalculation[parentIndex].bomList;
          let BOMCalculationDataIndex = BOMCalculationData.length-1; 
          let BOMIndex = BOMCalList.findIndex((obj => (obj.id === bomId && obj.uniqueId === uniqueId)));
         
          for (var i = 0; i < BOMCalculationData.length; i++) {
            BOMCalculation[parentIndex].bomList.splice(BOMIndex + 1, 0, BOMCalculationData[BOMCalculationDataIndex-i]); 
          } 
        
          _this.setState({        
            BOMCalculation: BOMCalculation,
            BOMCalculationData: BOMCalculationData
          });         

        }
        _this.props.actionLoaderHide();
      }).catch(e => _this.props.actionLoaderHide());
      window.addEventListener("scroll", this.handleScroll);
    
  }

  getBOMSubVariantData2(bomId, event, index, level, parentIndex, partContainingBomId, uniqueId) {  
    let _this = this;
    let BOMVariantData = JSON.parse(JSON.stringify(this.state.allBomList));

    console.log("BOMVariantData44", BOMVariantData);
    _this.props.actionLoaderShow();

    
      this.getBOMCalculation2(bomId, event, index, level, parentIndex, partContainingBomId, uniqueId)
      this.props
      .actionBOMSubVariantData({ bomId: bomId, index: index, partContaingBomId: partContainingBomId })
      .then((result, error) => {
        if (result.payload.data.status === 200) {
          let BOMSubVariantDatas = result.payload.data.resourceData;     
          console.log("BOMSubVariantDatas", BOMSubVariantDatas);     
          BOMVariantData[parentIndex].bomList[index] = JSON.parse(JSON.stringify({...BOMVariantData[parentIndex].bomList[index], childBOM: result.payload.data.resourceData}));        

       _this.setState({
            allBomList: BOMVariantData,
            //firstTreeHide: BOMSubVariantDatas[0].firstTreeHide           
          });
        }
        _this.props.actionLoaderHide();
      }).catch(e => _this.props.actionLoaderHide());
      window.addEventListener("scroll", this.handleScroll);
    

      this.setState({      
        allBomList: BOMVariantData
      }); 
      _this.props.actionLoaderHide();  
    
  }


  remove(event, parentIndexArray, level1Idx,parentIndex, superParentIdx, bomId,partContainingBomId, level,uniqueId) {
    let BOMVariantData = JSON.parse(JSON.stringify(this.state.allBomList));   
   
    //To find the index of Branch for AllBomList Tree
    let BOMIndex = BOMVariantData[superParentIdx].bomList.findIndex((obj => obj.uniqueId == uniqueId));  

    let checkA= BOMVariantData[superParentIdx].bomList[BOMIndex];

    parentIndexArray.push(level1Idx);    
   
    console.log('event.target.checked ',event.target.checked );

    if(!event.target.checked){     
      // To branch the tree again or add branch again when checked is false
      this.getBOMSubVariantData2(checkA.id,event,BOMIndex,level, superParentIdx,partContainingBomId,uniqueId);  
    }else{
      var newArray=[parentIndexArray.length];   
      newArray[0]=checkA;
      for(var jmb=0;jmb<parentIndexArray.length;jmb++){

        checkA= checkA && checkA['childBOM'] && checkA['childBOM'][parentIndexArray[jmb]] ? checkA['childBOM'][parentIndexArray[jmb]] : [];
        newArray[jmb+1]=checkA;      
      }
            
       if(  newArray[parentIndexArray.length-1] && newArray[parentIndexArray.length-1]['childBOM'])
          newArray[parentIndexArray.length-1]['childBOM']=null;
       else
          newArray[parentIndexArray.length-1]['part']=null;

       
      if(BOMVariantData[superParentIdx] && BOMVariantData[superParentIdx].bomList[BOMIndex])   
               BOMVariantData[superParentIdx].bomList[BOMIndex]= newArray[0];   
    }
    
   this.setState({allBomList:BOMVariantData});
  }

  renderData = (data, parentIndexIdx, oldParentArray, superParentIdx,partContainingBomId,level, uniqueId) => {
    if(!data) return false; 
   
    let elementValue =  <ul>
      {data && data.map((level1, level1Idx) => {
        
        let isChild = level1.containsChildBom ? 'tree_label' : 'tree_label1';
        let variantChkBox = "variantChkBox" + parentIndexIdx; 
        let createActionpop = level1.part || level1.partNumber ? 'createActionpop' : '';
        
        return (
            <li>
              <label class={isChild +' '+ createActionpop}>
                <input                                      
                type="checkbox"
                name={variantChkBox}                                                  
                id="c6" 
               // disabled={!level1.containsChildBom || level1.containsChildBom}     
                disabled={!level1.containsChildBom && level1.containsChildBom == undefined }   
                onClick={e => this.remove(e, level1.parentIndex, level1Idx,parentIndexIdx,superParentIdx,level1.id,partContainingBomId,level, uniqueId)}    
                />
                {level1.partNumber  ? level1.partNumber : level1.bomCode}         

                {level1.part || level1.partNumber ? 
                  <div className="more-dd popCreate action-dd">
                    <DropdownButton
                    title={
                    <i class="glyphicon glyphicon-option-horizontal" />
                    }
                    >

                    <div className="btnWrap"> 
                    <p onClick={e => this.handleReplaceShow(level1.id, "add")}> Add</p>
                    <p onClick={e => this.handleReplaceShow(level1.id, "replace")}> Replace</p>
                    <p onClick={e => this.handleRemoveShow(level1.id, "remove")}> Remove</p>

                    </div>
                    </DropdownButton>
                    </div>
                : ''}
              </label>

              {level1.part && level1.part.length > 0 ? (             
                // !level1.containsChildBom && 
                // this.renderData(level1.part, level1Idx, data.parentIndex, superParentIdx)               
                this.renderData(level1.part, level1Idx, data.parentIndex, superParentIdx,partContainingBomId,level, uniqueId)
              ):(
                level1.containsChildBom && 
                this.renderData(level1.childBOM, level1Idx, data.parentIndex, superParentIdx,partContainingBomId,level, uniqueId)
              )}

          </li>
        )
      })}
    </ul>
    return elementValue;
  } 


  handleOtherApprovers(event, index) {
    const selected = event.target.checked;
    let selectedId = event.target.value;
    let otherApproversResponse = this.state.otherApproversResponse;
    let otherApproversResponseWithIndex = otherApproversResponse[index];
    if (selected) {
      otherApproversResponseWithIndex.selected = true;
    } else {
      otherApproversResponseWithIndex.selected = false;
    }
    otherApproversResponse[index] = otherApproversResponseWithIndex;
    var approversIds = [];
    for (var i = 0, l = otherApproversResponse.length; i < l; i++) {
      if (otherApproversResponse[i].selected) {
        approversIds.push(otherApproversResponse[i].id);
      }
    }
    this.setState({
      otherApprResId: approversIds
    });
  }

  getAllProject() {
    let _this = this;
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };
    this.props
      .actionGetAllProjectData(data)
      .then((result, error) => {
        if (result.payload.data.status === 200) {
          let allProjectList = result.payload.data.resourceData;
          _this.setState({
            allProjectList: allProjectList
          });
        }
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  getBOMFilterData(pid, modelFamilyId, modelId, variantId, technnicalTypeId) {   
    let _this = this;
    let ecoFilterData = [];   
    let pid1 = pid ? pid : this.state.pid;
    let modelFamilyId1 = modelFamilyId ? modelFamilyId : this.state.modelFamilyId;
    let modelId1 = modelId ? modelId : this.state.modelId;
    let variantId1 = variantId ? variantId : this.state.variantId;
    let technnicalTypeId1 = technnicalTypeId ? technnicalTypeId : this.state.technnicalTypeId;  


    let data = {
      userId: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      projectId: pid1,    
      modelFamilyId: modelFamilyId1,
      modelId: modelId1,
      variantId: variantId1,
      technnicalTypeId: technnicalTypeId1,
    };
    
    this.props.actionLoaderShow();
    this.props
      .actionGetBOMFilterData(data)
      .then((result, error) => {
        if (result.payload.data.status === 200) {

          let searchListObject = {
            ecoNumber: 1,
            project: pid1,
            modelFamilyOfPart: modelFamilyId1,
            modelOfPart: modelId1,
            technicalTypeOfPart: technnicalTypeId1,
            variantOfPart: variantId1, 
          }

          ecoFilterData = result.payload.data.resourceData;   

          _this.setState({
            listOfModelFamilies: ecoFilterData.listOfModelFamilies,
            listOfVariants: ecoFilterData.listOfVariants,
            listOfTechnicalTypes: ecoFilterData.listOfTechnicalTypes,
            listOfModels: ecoFilterData.listOfModels,
            listOfParts: ecoFilterData.listOfParts,
            searchListObject: searchListObject
          });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
    window.addEventListener("scroll", this.handleScroll);
  }

  onChangeFilterAutoList(e, data) { 
    this.setState({
      searchFilterKey: data.partNumber,
      filterDDAutoList: false,        
    });
    this.getWhereUsedData(data.id);
  }

  getFindAllBOMData(superParentIndex, ecoNum){
    let _this = this;
    let allBomList = this.state.allBomList;
    let BOMCalculation = this.state.BOMCalculation;
    let bomIdArray = [];
    let searchedData = this.state.searchedData;
    let headingBomId = [];
    let headingMFGId = [];
    let listOfEcoRequest = this.state.listOfEcoRequest;
    let ecoBomXDataRequests = this.state.ecoBomXDataRequests;

    searchedData[superParentIndex].searchItem.filter(function(data, idx){      
      if(data.checked !== undefined && data.checked == true){
        bomIdArray.push({'bomId':data.bomId, 'partContainingBomId':data.partContainingBomId});       
        return bomIdArray
      }
    });
    console.log("bomIdArray", bomIdArray);
  
    if (searchedData.length > 0) {

      let searchList =  this.state.searchListObject;
      searchedData[superParentIndex].searchListObject = searchList;
      searchedData[superParentIndex].searchListObject['ecoNumber'] = ecoNum;
      listOfEcoRequest.push(searchedData[superParentIndex].searchListObject);
      console.log(listOfEcoRequest, "searchedData");

      this.props.actionLoaderShow();

      let data = {
        listOfBomIds: bomIdArray
      }

      console.log("data ==", data);

      this.props
        .actuionGetFindAllBOMData(data)
        .then((result, error) => {
          if (result.payload.data.status === 200) {     
           let allBomData = result.payload.data.resourceData;         
            
            for (var i = 1; i <= allBomData.bomIdsMaxLength; i++) {
              headingBomId.push('BOM-ID'+i);
            } 
            for (var i = 1; i <= allBomData.mfgIdsMaxLength; i++) {
              headingMFGId.push('MFG-ID'+i);
            } 
            let headingData = [headingBomId, headingMFGId];   

            allBomList.splice(superParentIndex, 1, {"bomList": result.payload.data.resourceData.list}); 
           // var BOMCalculation = [...allBomList];

            BOMCalculation.splice(superParentIndex,1, {"bomList": result.payload.data.resourceData.list});

            console.log(BOMCalculation, "uuuuuuuuuu", allBomList);
        

            // listOfEcoRequest[superParentIndex]['ecoBomXDataRequests'] = BOMCalculation[superParentIndex].bomList;

            // console.log("listOfEcoRequest123", listOfEcoRequest);

            _this.setState({
              allBomData: headingData,
              allBomList: allBomList,      
              //usedBomIds: [], /** open then working */  
              BOMCalculation: BOMCalculation, 
              //firstTreeHide: allBomData.firstTreeHide,
              modelFamilyId:'', modelId:'', variantId:'', technnicalTypeId:'', projectId: '',
              searchEnable : true       
            });
          }

          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      this.setState({ searchFilterKey: '' })
    }
  }


  getWhereUsedIds(event, item, index, superParentIndex){
    //let usedBomIds = this.state.usedBomIds;
    let searchPartNo = this.state.searchPartNo;
    let searchedData = this.state.searchedData;
  
    if(event.target.checked){
        //usedBomIds.splice(index, 1, {'bomId':item.bomId, 'partContainingBomId':item.partContainingBomId});  
        searchedData[superParentIndex].searchItem[index].checked = true; 
    }else{       
      //usedBomIds.splice(index, 1, '');      
      searchedData[superParentIndex].searchItem[index].checked = false;   
    } 

    this.setState({
      //usedBomIds: usedBomIds,
      searchedData:searchedData
    })
  }
 
  getWhereUsedData(pid){    
    let _this = this;
    let searchedData = this.state.searchedData;
    if (pid) {
      this.props.actionLoaderShow();
      this.props
        .actuionGetWhereUsedData({partId:pid})
        .then((result, error) => {
          if (result.payload.data.status === 200) { 
            searchedData.push({"searchItem": result.payload.data.resourceData});            
            console.log("searchedData", searchedData); 
            _this.setState({      
              searchedData: searchedData,
              searchFilterKey: '',
              searchEnable: false  
            });
          }
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      this.setState({ searchFilterKey: '' })
    }
  }

  getSuggessionFilterData(){
    let _this = this; 
    // && this.state.searchEnable  
    if (this.state.searchFilterKey.length > 0) {
      this.props.actionLoaderShow();
     let data = {
        userId: this.props.userInfo.userData.id,
        roleId: this.props.userInfo.userData.userRole,
        projectId: this.state.pid,
        modelFamilyId: this.state.modelFamilyId,
        modelId: this.state.modelId,
        technnicalTypeId: this.state.technnicalTypeId,
        variantId: this.state.variantId,
        searchKeyword: this.state.searchFilterKey
      }
    
      this.props
        .actuionGetSuggessionFilterData(data)
        .then((result, error) => {
          if (result.payload.data.status === 200) {        
            let filterDataList = result.payload.data.resourceData;

            _this.setState({ 
              filterDataList: filterDataList,
              filterDDAutoList: true  
            });
          }
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
      window.addEventListener("scroll", this.handleScroll);
    } else {     
      this.setState({ filterDDAutoList: false })
    }

  }

  openRevisionShowHideCollapsePrev(e, action, mainParentIndex){
    let searchedData = this.state.searchedData;
    if(action=== true){
      searchedData[mainParentIndex].isOpenRevShowHideCollapsePrev = true;
      searchedData[mainParentIndex].expandRevBlockPrev = true;
    }else{ 
      searchedData[mainParentIndex].isOpenRevShowHideCollapsePrev = false;
      searchedData[mainParentIndex].expandRevBlockPrev = false;
    }
    this.setState({     
      searchedData : searchedData,
    });
    // let expandDataIndex = this.state.expandDataIndex;
    // if(action=== true){
    //   this.setState({
    //     showUserDefinedMFGIds:false,
    //     expandRevBlock : true,
    //   });
    // }else{
    //   this.setState({
    //     showUserDefinedMFGIds:true,
    //     expandRevBlock : false,      
    //   });
    // }
  }

  openRevisionShowHideCollapseNext(e, action, mainParentIndex){
    let searchedData = this.state.searchedData;
    if(action=== true){
      searchedData[mainParentIndex].isOpenRevShowHideCollapse = true;
      searchedData[mainParentIndex].expandRevBlock = true;
    }else{ 
      searchedData[mainParentIndex].isOpenRevShowHideCollapse = false;
      searchedData[mainParentIndex].expandRevBlock = false;
    }

    this.setState({     
      searchedData : searchedData,
    });
  } 
  
  isOpenCostShowHideCollapse(e, action, mainParentIndex){
    let searchedData = this.state.searchedData;
    if(action=== true){
      searchedData[mainParentIndex].isOpenCostShowHideCollapse = true;
      searchedData[mainParentIndex].isOpenCostCollapse = 11;
      searchedData[mainParentIndex].expandCostBlock = true;
    }else{ 
      searchedData[mainParentIndex].isOpenCostShowHideCollapse = false;
      searchedData[mainParentIndex].isOpenCostCollapse = 1;
      searchedData[mainParentIndex].expandCostBlock = false;
    }
    this.setState({     
      searchedData : searchedData,
    });
  } 

  isOpenServiceShowHideCollapse(e, action, mainParentIndex){
    let searchedData = this.state.searchedData;
    if(action=== true){
      searchedData[mainParentIndex].isOpenServiceShowHideCollapse = true;
      searchedData[mainParentIndex].isOpenServiceCollapse = 3;
      searchedData[mainParentIndex].expandServiceBlock = true;
    }else{ 
      searchedData[mainParentIndex].isOpenServiceShowHideCollapse = false;
      searchedData[mainParentIndex].isOpenServiceCollapse = 1;
      searchedData[mainParentIndex].expandServiceBlock = false;
    }
    this.setState({     
      searchedData : searchedData,
    });
  }

  isOpenPlanningShowHideCollapse(e, action, mainParentIndex){
    let searchedData = this.state.searchedData;
    if(action=== true){
      searchedData[mainParentIndex].isOpenPlanningShowHideCollapse = true;
      searchedData[mainParentIndex].isOpenPlanningCollapse = 10;
      searchedData[mainParentIndex].expandPlanningBlock = true;
    }else{ 
      searchedData[mainParentIndex].isOpenPlanningShowHideCollapse = false;
      searchedData[mainParentIndex].isOpenPlanningCollapse = 1;
      searchedData[mainParentIndex].expandPlanningBlock = false;
    }
    console.log("searchedData====", searchedData);
    this.setState({     
      searchedData : searchedData,
    });
  }
  
  isOpenAPQPShowHideCollapse(e, action, mainParentIndex){
    let searchedData = this.state.searchedData;
    if(action=== true){
      searchedData[mainParentIndex].isOpenAPQPShowHideCollapse = true;
      searchedData[mainParentIndex].isOpenAPQPCollapse = 6;
      searchedData[mainParentIndex].expandAPQPBlock = true;
    }else{ 
      searchedData[mainParentIndex].isOpenAPQPShowHideCollapse = false;
      searchedData[mainParentIndex].isOpenAPQPCollapse = 1;
      searchedData[mainParentIndex].expandAPQPBlock = false;
    }
    console.log("searchedData====", searchedData);
    this.setState({     
      searchedData : searchedData,
    });
  }

  isOpenOEPartsShowHideCollapse(e, action, mainParentIndex){
    let searchedData = this.state.searchedData;
    if(action=== true){
      searchedData[mainParentIndex].isOpenOEPartsShowHideCollapse = true;
      searchedData[mainParentIndex].isOpenOEPartsCollapse = 4;
      searchedData[mainParentIndex].expandOEPartsBlock = true;
    }else{ 
      searchedData[mainParentIndex].isOpenOEPartsShowHideCollapse = false;
      searchedData[mainParentIndex].isOpenOEPartsCollapse = 1;
      searchedData[mainParentIndex].expandOEPartsBlock = false;
    }
    console.log("searchedData====", searchedData);
    this.setState({     
      searchedData : searchedData,
    });
  }

  isPartsInterchangeableInService(e, action, childIndex, mainParentIndex){    
    let BOMCalculation = this.state.BOMCalculation;
    let listOfEcoRequest = this.state.listOfEcoRequest;
    if(action==='yes'){
      BOMCalculation[mainParentIndex].bomList[childIndex].isPartsInterchangeableInService = false;
      BOMCalculation[mainParentIndex].bomList[childIndex].partsInterchangeableInService = 'No'; 
    }else{   
      BOMCalculation[mainParentIndex].bomList[childIndex].isPartsInterchangeableInService = true;
      BOMCalculation[mainParentIndex].bomList[childIndex].partsInterchangeableInService = 'Yes'; 
    }
    
    listOfEcoRequest[mainParentIndex]['ecoBomXDataRequests'] = BOMCalculation[mainParentIndex].bomList;
    this.setState({
      BOMCalculation: BOMCalculation,
      listOfEcoRequest: listOfEcoRequest
    })
  }
  isScrapPartsInService(e, action, childIndex, mainParentIndex){
    let BOMCalculation = this.state.BOMCalculation;
    let listOfEcoRequest = this.state.listOfEcoRequest;
    if(action==='yes'){
      BOMCalculation[mainParentIndex].bomList[childIndex].isScrapPartsInService = false;
      BOMCalculation[mainParentIndex].bomList[childIndex].scrapPartsInService = 'No'; 
    }else{   
      BOMCalculation[mainParentIndex].bomList[childIndex].isScrapPartsInService = true;
      BOMCalculation[mainParentIndex].bomList[childIndex].scrapPartsInService = 'Yes'; 
    }

    listOfEcoRequest[mainParentIndex]['ecoBomXDataRequests'] = BOMCalculation[mainParentIndex].bomList;
    this.setState({
      BOMCalculation: BOMCalculation,
      listOfEcoRequest: listOfEcoRequest
    }) 
  }

  isSerialNumberBreakMandatory(e, action, childIndex, mainParentIndex){    
    let BOMCalculation = this.state.BOMCalculation;
    let listOfEcoRequest = this.state.listOfEcoRequest;
    if(action==='yes'){
      BOMCalculation[mainParentIndex].bomList[childIndex].isSerialNumberBreakMandatory = false;
      BOMCalculation[mainParentIndex].bomList[childIndex].serialNumberBreakMandatory = 'No'; 
    }else{   
      BOMCalculation[mainParentIndex].bomList[childIndex].isSerialNumberBreakMandatory = true;
      BOMCalculation[mainParentIndex].bomList[childIndex].serialNumberBreakMandatory = 'Yes'; 
    }

    listOfEcoRequest[mainParentIndex]['ecoBomXDataRequests'] = BOMCalculation[mainParentIndex].bomList;
    this.setState({
      BOMCalculation: BOMCalculation,
      listOfEcoRequest: listOfEcoRequest
    }) 
  }
  isSerialNumberBreak(e, action, childIndex, mainParentIndex){
    let BOMCalculation = this.state.BOMCalculation;
    let listOfEcoRequest = this.state.listOfEcoRequest;
    if(action==='yes'){
      BOMCalculation[mainParentIndex].bomList[childIndex].isSerialNumberBreak = false;
      BOMCalculation[mainParentIndex].bomList[childIndex].serialNumberBreak = 'No'; 
    }else{   
      BOMCalculation[mainParentIndex].bomList[childIndex].isSerialNumberBreak = true;
      BOMCalculation[mainParentIndex].bomList[childIndex].serialNumberBreak = 'Yes'; 
    }

    listOfEcoRequest[mainParentIndex]['ecoBomXDataRequests'] = BOMCalculation[mainParentIndex].bomList;

    this.setState({
      BOMCalculation: BOMCalculation,
      listOfEcoRequest: listOfEcoRequest
    })
  }

  handleSpecalMFGClose(action) {
    this.setState({
      specalMFG: false,
      specalMFGData:['']
    });
  }
  handleSpecalMFGShow(e, childIndex, parentIndex) {
    this.setState({
      specalMFG: true,
      childIndexMFG :childIndex,
      parentIndexMFG: parentIndex
    });
  }
  handleSpecalPackClose(action) {
    this.setState({
      specalPack: false,
      specalPackData:['']
    });
  }
  handleSpecalPackShow(e, childIndex, parentIndex) {
    this.setState({
      specalPack: true,
      childIndexPack :childIndex,
      parentIndexPack: parentIndex
    });
  }
  setSpecalMFGData(event){  
    if ((event.which >= 13 || event.keyCode >= 13) && (event.which < 14 || event.keyCode < 14)) {
      let specalMFGData = this.state.specalMFGData;      
      specalMFGData.push(event.target.value);
      console.log("aaaa", specalMFGData);

      this.setState({
        specalMFGData: specalMFGData
      })
    }  
  }
  setSpecalPackData(event){
    let specalPackData = this.state.specalPackData;  
    if ((event.which >= 13 || event.keyCode >= 13) && (event.which < 14 || event.keyCode < 14)) {
      let specalPackData = this.state.specalPackData;      
      specalPackData.push(event.target.value);

      this.setState({
        specalPackData: specalPackData
      })
    }  
  }

  handleOnBOMCalculationData(e, childIndex, parentIndex, key, type){  
    let BOMCalculation = this.state.BOMCalculation;
    let specalPackData = this.state.specalPackData;
    let specalMFGData = this.state.specalMFGData;
    let listOfEcoRequest = this.state.listOfEcoRequest;

    let getDate = (new Date(e)).getTime();
    if(getDate===undefined || getDate===''){
      getDate = new Date().getTime();
    }

    if(type=='date'){
      BOMCalculation[parentIndex].bomList[childIndex][key] = getDate;
    }else if(type=='specialManufacturing'){   
      specalMFGData.splice(0, 1);
      BOMCalculation[parentIndex].bomList[childIndex]['specialManufacturingInstructions'] = specalMFGData; 
      this.handleSpecalMFGClose();
    }else if(type=='specialPackaging'){
      specalPackData.splice(0, 1);
      BOMCalculation[parentIndex].bomList[childIndex]['specialPackagingInstructions'] = specalPackData;  
      this.handleSpecalPackClose();   
    }
    else{ 
      const { name } = e.target;
      const { value } = e.target;     
      if(BOMCalculation[parentIndex] && BOMCalculation[parentIndex].bomList){
        BOMCalculation[parentIndex].bomList[childIndex][name] = value; 
      }
    }
    listOfEcoRequest[parentIndex]['ecoBomXDataRequests']=[];

    listOfEcoRequest[parentIndex]['ecoBomXDataRequests'].push(BOMCalculation[parentIndex].bomList);     

    console.log(listOfEcoRequest, "BOMCalculation+++", BOMCalculation); 

    this.setState({
      BOMCalculation: BOMCalculation,
      listOfEcoRequest: listOfEcoRequest
    })
  }

  hideCropImgModal(){
    this.setState({
      showCropImg: false,
      mainImage: '',
    })
  }
  showCropImageModal(event, imagesArray, childIndex, parentIndex, ){
    this.setState({
     sliderShow: true,
     showCropImg: true,
     imagesArray: imagesArray,
     childIndexPartImg: childIndex,
     parentIndexPartImg: parentIndex
    })
  }
  

  // cropImage() {
  //   if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
  //     return;
  //   }
  //   let cropResult = this.cropper.getCroppedCanvas().toDataURL()
  //   this.setState({
  //     cropResult: this.cropper.getCroppedCanvas().toDataURL(),
  //     imageName: "aa.png",
  //     imageType: "image/png"
  //   });

  //   console.log("this.cropper.getCroppedCanvas().toDataURL()", this.cropper.getCroppedCanvas().toDataURL());

  //   if (
  //     this.state.imageType === 'image/jpeg' ||
  //     'image/jpg' ||
  //     'image/png' ||
  //     'image/gif' ||
  //     'video/mp4' ||
  //     'video/webm'
  //   ) {
  //   } else {
  //     showErrorToast('Please enter correct image format');
  //     return false;
  //   }

  //   // console.log(cropResult, "this.refs.cropper", this.refs.cropper);
  //   // let cropResult = this.refs.cropper
  //   //   .getCroppedCanvas({
  //   //     fillColor: '#fff',
  //   //     imageSmoothingEnabled: false,
  //   //     imageSmoothingQuality: 'high'
  //   //   })
  //   //   .toDataURL(this.state.imageType);

  //   //   console.log(cropResult, "this.refs.cropper", this.refs.cropper);

  //   if (cropResult !== '') {
  //     let croppedImage = this.dataURLtoFile(
  //       cropResult,
  //       this.state.imageName
  //     );

  //     this.handleUploadDesign(croppedImage);
  //     //this.props.uploadImageToAzure(croppedImage);
  //     this.setState({
  //       cropModal: false
  //     });
  //   } else {
  //     this.props.uploadImageToAzure('');
  //   }
  // }

  // handleUploadDesign(event) {
  //   // debugger;
  //   let BOMCalculation = this.state.BOMCalculation;    
  //   let pIndx = this.state.parentIndexPartImg;
  //   let cIndx = this.state.childIndexPartImg;
  //   let _this = this;
  //   let fileObject = event;
  
  //   if (fileObject) {
  //     const formData = new FormData();
  //     formData.set('mFile', fileObject);
  //     formData.append('thumbnailHeight', 100);
  //     formData.append('thumbnailWidth', 100);
  //     formData.append('isCreateThumbnail', true);
  //     formData.append('fileKey', "aa.png");
  //     formData.append('filePath', "aa.png");
  //     this.props.actionLoaderShow();
  //     this.props
  //       .actionUploadImage(formData)
  //       .then((result, error) => {
  //         let reportArray = result.payload.data;
  //         var reqObject = {};
  //         let mediaExtension = reportArray.filePath.split('.').pop(-1);
  //         reqObject['mediaName'] = reportArray.filePath;
  //         reqObject['mediaURL'] =  reportArray.s3FilePath;
  //         reqObject['mediaFullURL'] = customConstant.amazonURL + reportArray.s3FilePath;
  //         reqObject['mediaSize'] = reportArray.fileSize;
  //         reqObject['mediaExtension'] = mediaExtension;
  //         reqObject['mediaType'] = reportArray.contentType;
  //         reqObject['isDeleted'] = false;

  //         BOMCalculation[pIndx].bomList[cIndx].cropPartImage =  reqObject.mediaFullURL;        

  //         // //const emailOTP = this.state.OTPField.join("");
  //         // let roleId = this.props.userInfo.userData.userRole;
  //         // let userId = this.props.userInfo.userData.id;

        
  //         //   let profileImageURL = reportArray.s3FilePath;
  //         //   let data = {
  //         //     userId,
  //         //     roleId,
  //         //     profileImageURL
  //         //   };
  //         //   this.handleSubmit(data);
         

  //         if (result.payload.data.status === 400) {
  //           //showErrorToast(result.payload.data.responseMessage);
  //         }
  //         _this.props.actionLoaderHide();
  //       })
  //       .catch(e => {
  //         _this.props.actionLoaderHide();
  //       });


  //       console.log("BOMCalculation3333", BOMCalculation);

  //       this.setState({
  //         BOMCalculation: BOMCalculation
  //       })
  //   }
  // }

  // handleSubmit(data) {
  //   let _this = this;
  //   this.props
  //     .actionUpdateUserProfile(data)
  //     .then((result, error) => {
  //       _this.props.actionLoaderHide();

  //         this.setState({
  //           profileImageThumbnailUrl:
  //             result.payload.data.resourceData.profileImageThumbnailUrl
  //         });
  //         this.props.handleCheckData(this.state.profileImageThumbnailUrl, 1);
  //         let dataProfile = {
  //           profilePhotoURL:
  //             result.payload.data.resourceData.profileImageThumbnailUrl
  //         };

  //         // this.props.actionChangeUserProfileLogo(dataProfile);
  //         if (data && data.profileImageURL)
  //           this.props
  //             .actionChangeUserProfileLogo(data && data.profileImageURL)
  //             .then((result, error) => {})
  //             .catch(e => _this.props.actionLoaderHide());

  //     })
  //     .catch(e => _this.props.actionLoaderHide());
  // }

  // dataURLtoFile(dataurl, filename) {
  //   var arr = dataurl.split(','),
  //     mime = arr[0].match(/:(.*?);/)[1],
  //     bstr = arr && atob(arr[1]),
  //     n = bstr.length,
  //     u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new File([u8arr], filename, { type: mime });
  // }


  render() {
    console.log("8888------",this.state.mainImage);
    let designerIndex = this.state.designerIndex;
    let projectVariant = this.state.projectVariant;
    let projectName = projectVariant.projectCode;
    let BOMCalculation = this.state.BOMCalculation;
    let BOMVariantData = this.state.BOMVariantData;
    let BOMSubVariantData = this.state.BOMSubVariantData;
    let allBomDatas = this.state.allBomData;
    let allBomList = this.state.allBomList;
    let bomListLength = this.state.bomListLength;
    let searchedData = this.state.searchedData
    let _this = this;
    let cropPartImage = this.state.cropResult;
    let childIndexMFG = this.state.childIndexMFG;
    let parentIndexMFG = this.state.parentIndexMFG;  
    let childIndexPack = this.state.childIndexPack;
    let parentIndexPack = this.state.parentIndexPack; 
    return (
      <div>        
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === "ninth" ? "ninth" : "none"}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === "ninth" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <h4 className="hero-title">Create ECO</h4>

                <div className="border-around border-light p-20 eco-form m-b-30 m-t-20">
                  <form id="createECOForm">
                    <Row>
                      <Col md={4}>
                        <FormGroup className=" ">
                          <ControlLabel>ECO Description<i className="text-danger">*</i></ControlLabel>
                          <FormControl
                            type="text"
                            className="br-0"
                            name="ecoDescription"
                            value={this.state.ecoDescription}
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className=" " controlId="formControlsSelect">
                          <ControlLabel>Priority Level<i className="text-danger">*</i></ControlLabel>
                          <FormControl className="br-0 s-arrow"
                            componentClass="select"
                            value={this.state.priorityLevel}
                            name="priorityLevel"
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          >
                            <option value="select">select</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </FormControl>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className=" " controlId="formControlsSelect">
                          <ControlLabel>
                            ECO Category<i className="text-danger">*</i>
                          </ControlLabel>
                          <FormControl
                            componentClass="select"
                            className="br-0 s-arrow"
                            value={this.state.ecoCategory}
                            name="ecoCategory"
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                            onBlur={this.activateValidation}
                          >
                            <option value="select">select</option>
                            <option value="newProductDevelopment">
                              New Product Development
                            </option>
                            <option value="production">Production</option>
                          </FormControl>
                          {renderMessage(
                            this.props.getValidationMessages("ecoCategory")
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row> 
                      <Col md={4}>
                        <FormGroup className=" ">
                          <ControlLabel>Project Description<i className="text-danger">*</i></ControlLabel>
                          <FormControl
                            type="text"
                            className="br-0"
                            name="projectDescription"
                            value={this.state.projectDescription}
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className=" ">
                          <ControlLabel>Change Description<i className="text-danger">*</i></ControlLabel>
                          <FormControl
                            type="text"
                            className="br-0"
                            name="ecoChangeDescription"
                            value={this.state.ecoChangeDescription}
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className=" ">
                          <ControlLabel>Other Special Description<i className="text-danger">*</i></ControlLabel>
                          <FormControl
                            type="text"
                            className="br-0"
                            name="otherSpecialDescription"
                            value={this.state.otherSpecialDescription}
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          />
                          <FormControl.Feedback />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>            
                      <Col md={4}>
                        <FormGroup className=" " controlId="formControlsSelect">
                          <ControlLabel>Designer<i className="text-danger">*</i></ControlLabel>
                          <FormControl
                            className="br-0 s-arrow"
                            componentClass="select"
                            value={this.state.designerId}
                            name="designerId"
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          >
                            <option value="select">select</option>
                            {this.state.designerResponse &&
                              this.state.designerResponse.map((item, index) => {
                                return (
                                  <option
                                    value={item.id}
                                    key={index}
                                    data-key={index}
                                  >
                                    {item.fullName}
                                  </option>
                                );
                              })}
                          </FormControl>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className=" " controlId="formControlsSelect">
                          <ControlLabel>Receiving Plant<i className="text-danger">*</i></ControlLabel>
                          <FormControl
                            className="br-0 s-arrow"
                            componentClass="select"
                            value={this.state.receivingPlantAddress}
                            name="receivingPlantAddress"
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          >
                            <option value="select">select</option>
                            {this.state.receivingPlantResponse &&
                              this.state.receivingPlantResponse.map(
                                (item, index) => {
                                  return (
                                    <option value={item.address} key={index}>
                                      {item.address + " | " + item.locationId}
                                    </option>
                                  );
                                }
                              )}
                          </FormControl>
                        </FormGroup>
                      </Col>
                      
                      <Col md={4}>
                        <FormGroup className=" " controlId="formControlsSelect">
                          <ControlLabel>Shipping Plant<i className="text-danger">*</i></ControlLabel>
                          <FormControl
                            className="br-0 s-arrow"
                            componentClass="select"
                            value={this.state.shippingPlantAddress}
                            name="shippingPlantAddress"
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          >
                            <option value="select">select</option>
                            {this.state.shippingPlantResponse &&
                              this.state.shippingPlantResponse.map(
                                (item, index) => {
                                  return (
                                    <option value={item.address} key={index}>
                                      {item.address + " | " + item.locationId}
                                    </option>
                                  );
                                }
                              )}
                          </FormControl>
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <Row>                    
                     <Col md={4}>
                        <FormGroup className=" " controlId="formControlsSelect">
                          <ControlLabel>Design Location<i className="text-danger">*</i></ControlLabel>
                          <FormControl
                            className="br-0 s-arrow"
                            componentClass="select"
                            value={this.state.designLocation}
                            name="designLocation"
                            onChange={event => {
                              this.handleOnChange(event);
                            }}
                          >
                            <option value="select">select</option>
                            {this.state.designLocationResponse &&
                              this.state.designLocationResponse.map(
                                (item, index) => {
                                  return (
                                    <option value={item.address} key={index}>
                                      {item.address + " | " + item.locationId}
                                    </option>
                                  );
                                }
                              )}
                          </FormControl>
                        </FormGroup>
                      </Col>                     
                    </Row> 
                  </form>
                </div>

                <div className="partSearchwrapper m-b-10">              
                    <h4>Part Search Criteria</h4>


                  <div className="flex justify-space-between">
                    <FormGroup className="w-200" controlId="formControlsSelect">
                    <ControlLabel>
                      Project {/* <i className="text-danger">*</i>  */}
                    </ControlLabel>
                    <FormControl
                      componentClass="select"
                      className="br-0 s-arrow"
                      value={this.state.projectId}
                      name="projectId"
                      onChange={event => {
                        this.handleOnChange(event)
                        // this.getPart(this.state.projectId)
                      }}
                     // onBlur={this.activateValidation}
                    >
                      <option value="select">select</option>
                      {this.state.allProjectList &&
                        this.state.allProjectList.map((data, index) => {
                          return (
                            <option
                              value={data.id}
                              key={index}
                            >
                              {data.projectCode}
                            </option>
                          );
                        })}
                    </FormControl>
                    {/* {renderMessage(
                      this.props.getValidationMessages("projectId")
                    )} */}
                  </FormGroup>

                    <FormGroup className="w-200" controlId="formControlsSelect">
                      <ControlLabel>Model Family</ControlLabel>
                        <FormControl
                          componentClass="select"
                          className="br-0 s-arrow"
                          value={this.state.modelFamilyId}
                          name="modelFamilyId"
                          onChange={event => {
                            this.handleOnChange(event)                            
                          }}                           
                        >
                          <option value="select">select</option>
                          {this.state.listOfModelFamilies &&
                            this.state.listOfModelFamilies.map((data, index) => {
                              return (
                                <option
                                  value={data.id}
                                  key={index}
                                >
                                  {data.modelFamilyCode}
                                </option>
                              );
                            })}
                        </FormControl>
                    </FormGroup>

                    <FormGroup className="w-200" controlId="formControlsSelect">
                        <ControlLabel>Model</ControlLabel>
                        <FormControl
                            componentClass="select"
                            className="br-0 s-arrow"
                            value={this.state.modelId}
                            name="modelId"
                            onChange={event => {
                              this.handleOnChange(event)                            
                            }}                           
                          >
                            <option value="select">select</option>
                            {this.state.listOfModels &&
                              this.state.listOfModels.map((data, index) => {
                                return (
                                  <option
                                    value={data.id}
                                    key={index}
                                  >
                                    {data.modelCode}
                                  </option>
                                );
                              })}
                          </FormControl>
                      </FormGroup>

                    <FormGroup className="w-200" controlId="formControlsSelect">
                        <ControlLabel>Technical Type</ControlLabel>
                        <FormControl
                            componentClass="select"
                            className="br-0 s-arrow"
                            value={this.state.technnicalTypeId}
                            name="technnicalTypeId"
                            onChange={event => {
                              this.handleOnChange(event)                            
                            }}                           
                          >
                            <option value="select">select</option>
                            {this.state.listOfTechnicalTypes &&
                              this.state.listOfTechnicalTypes.map((data, index) => {
                                return (
                                  <option
                                    value={data.id}
                                    key={index}
                                  >
                                    {data.technicalTypeCode}
                                  </option>
                                );
                              })}
                          </FormControl>
                        </FormGroup> 

                    <FormGroup className="w-200" controlId="formControlsSelect">
                        <ControlLabel>Variant</ControlLabel>
                        <FormControl
                            componentClass="select"
                            className="br-0 s-arrow"
                            value={this.state.variantId}
                            name="variantId"
                            onChange={event => {
                              this.handleOnChange(event)                            
                            }}                           
                          >
                            <option value="select">select</option>
                            {this.state.listOfVariants &&
                              this.state.listOfVariants.map((data, index) => {
                                return (
                                  <option
                                    value={data.id}
                                    key={index}
                                  >
                                    {data.variantCode}
                                  </option>
                                );
                              })}
                          </FormControl>
                      </FormGroup>
                 

                      <FormGroup className="w-200" controlId="formControlsSelect">
                          <ControlLabel className="mr-10">Search</ControlLabel>
                          <div className="searchForm">
                            <div className="formbdr">
                            <FormControl                                                                                                     
                                  autoComplete="off"
                                  name="searchFilterKey"
                                  placeholder="Search Any Part"
                                  type="text"
                                  class="orange form-control"
                                  value={this.state.searchFilterKey}
                                  onChange={event => {
                                    this.handleOnChangeKeyword(event);
                                  }} 
                                  onKeyUp={this.getSuggessionFilterData}
                                />
                          
                            <span className="ico-search">
                              <svg>
                                <use xlinkHref={`${Sprite}#searchIco`} />
                              </svg>
                            </span>
                          
                            </div>
                            {this.state.filterDDAutoList ? (
                              <div className="searchautolist">
                                <ul>
                                  {this.state.filterDataList && this.state.filterDataList.map((data, sIdx) => {                                
                                    return (
                                      <li key={sIdx}>
                                        <span
                                          onClick={event => {
                                            this.onChangeFilterAutoList(event, data);
                                          }}>{data.partNumber}</span>
                                      </li>
                                    )
                                  })}
                                </ul>
                              </div>) : ''
                            }
                          </div> 
                        </FormGroup>
                 </div> 
                </div> 

                <div className="">
                  {this.state.searchedData && this.state.searchedData.map((data, index) => {
                    let mainParentIndex = index;                 
                    let randomECONo = this.state.ecoNumber;
                    let mainParentIndexPlus = mainParentIndex+1;
                    let ecoNum = randomECONo+'-'+mainParentIndexPlus;
                    return (  
                      <div className="border-bottom m-t-20">  
                        <div className="searchingWrapper">                          
                          <div className="flex justify-space-between align-center">
                            <p className="ecotext"> ECO Number:{ecoNum}</p>
                          </div>

                          <div className="flex justify-space-between align-center">
                            <h4 className="hero-title">Used In Description</h4>
                          </div>
                
                          <div className="modelhierarchyWrap">      
                            {data && data.searchItem.map((item, idx) =>{
                              return (          
                                <div className="modelhierarchy">
                                  <div className="fs-12">
                                    <ul className="list-style-none flex align-center m-b-0">
                                      <label className="label--checkbox">
                                        <input
                                          type="checkbox"
                                          className="checkbox"
                                          checked = {item.checked}
                                          onClick={e => this.getWhereUsedIds(e, item, idx, mainParentIndex)}
                                        />
                                      </label>
                                        {item && item.listOfData.map((itemArray, arrayIdx) =>{                                         
                                          return (
                                            <li>
                                              {arrayIdx > 0 ?  <i className="ico--right"> </i> : ''}
                                              {itemArray}
                                            </li> 
                                          ) 
                                        })}
                                    </ul> 
                                  </div>
                                </div> 
                              )
                            })} 
                            <div class="text-center m-b-20 m-t-20">
                              <button class="btn btn-default" onClick={e => this.getFindAllBOMData(mainParentIndex, ecoNum)}>Select</button>
                            </div>
                          </div>     
                        </div> 

                        { allBomList[mainParentIndex] && allBomList[mainParentIndex].bomList && allBomList[mainParentIndex].bomList.length > 0 ?(
                          <div>
                            <Row className="tableCreationWithCheckboxes tableScroll">

                              <div  className="createTree flex flex-column mr-10">                
                                <div className="flex createFl gray-card m-l-10">
                                <div className="tree o-dot">
                                <h5 class="text-uppercase ex-titel">existing (as-in)</h5>
                                  <ul>                                   
                                    {/* <li className="root" style={pointerCursor} onClick={e => this.getBOMVariantData()}>{projectName}</li> */}
                                    {allBomList.length > 0 && allBomList[index] && allBomList[index].bomList && allBomList[index].bomList.map((variantData, vIdx) => {
                                        let variantChkBox = "variantChkBox" + vIdx; 
                                        let isChild = variantData.containsChildBom ? 'tree_label' : 'tree_label1';                           
                                        return (
                                          // <li className={"treeinn "+ (variantData.firstTreeHide !== undefined && !variantData.firstTreeHide ? 'firsttreeShow ' : 'firsttreeHide')}>  
                                          <li className="treeinn"> 
                                            <label className={isChild} >
                                              <input               
                                                type="checkbox"
                                                name={variantChkBox}                
                                                id="c6"                                                
                                                disabled={!variantData.containsChildBom}                                                                                                                                   
                                              />
                                              {variantData.bomCode}

                                            </label>
                                              {
                                                variantData.containsChildBom && 
                                                this.renderData(variantData.childBOM, vIdx)
                                              } 
                                          </li>
                                        )
                                      })
                                    }
                                  </ul>
                                </div>
                              
                                </div>
                              </div>     

                              <div className="tableWrapper mr-10 createMainTb">
                                <Table
                                  bordered
                                  condensed                                  
                                  className="custom-table out-calander createsmTb tbcreateWrap"
                                >                        

                                  <thead>
                                    <tr>
                                      <th>Rev</th>
                                      <th className="w50">QTY 
                                       
                                      </th>
                                            
                                      {searchedData[mainParentIndex].expandRevBlockPrev ? <th>LEVEL</th> : ''}
                                      {searchedData[mainParentIndex].expandRevBlockPrev ?  <th>PHANTOM</th> : ''}
                                       
                                        { 
                                          searchedData[mainParentIndex].expandRevBlockPrev ?                          
                                            allBomDatas[0] && allBomDatas[0].map((bomIds, bomIdx) =>{
                                              return (
                                                <th> {bomIds}</th>
                                              )
                                            }) : ''                                    
                                        }
                                        { 
                                          searchedData[mainParentIndex].expandRevBlockPrev ?                           
                                            allBomDatas[1] && allBomDatas[1].map((MFG, mfgIdx) =>{
                                              return (
                                                <th>
                                                  <p className="txtview">{MFG} </p>
                                                </th>
                                              )
                                          }) :''                                    
                                        }
                                        {searchedData[mainParentIndex].expandRevBlockPrev ?  <th>QUALITY SIGNIFIANCE</th> : ''}
                                        {searchedData[mainParentIndex].expandRevBlockPrev ?   <th>LEVEL</th> : ''}
                                        {searchedData[mainParentIndex].expandRevBlockPrev ?   <th>PART WEIGHT</th> : ''} 
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {BOMCalculation[index] && BOMCalculation[index].bomList &&
                                      BOMCalculation[index].bomList.map((item, index) => {                                            
                                        return (
                                          <tr key={index}>
                                            <td><p className="txtview">{item.revision && item.revision !== undefined ? item.revision: "-"}</p></td>
                                            <td><p className="txtview">{item.quantity && item.quantity !== undefined ? item.quantity : "-"}</p></td>
                                            {searchedData[mainParentIndex].expandRevBlockPrev ? <td><p className="txtview">{item.bomLevel}</p></td>:''}
                                            {searchedData[mainParentIndex].expandRevBlockPrev ? <td><p className="txtview">{item.phantom}</p></td>:'' }                                          
                                            {searchedData[mainParentIndex].expandRevBlockPrev && item.userDefinedBomIds && item.userDefinedBomIds.map((bomIds, bomIdx) =>{
                                                return (
                                                  <td><p className="txtview">{bomIds}</p></td>
                                                )
                                              })
                                            }                                           
                                            {searchedData[mainParentIndex].expandRevBlockPrev && item.userDefinedMfgIds && item.userDefinedMfgIds.map((MFG, mfgIdx) =>{
                                                return (
                                                  <td><p className="txtview">{MFG}</p></td>
                                                )
                                              })
                                            }
                                            {searchedData[mainParentIndex].expandRevBlockPrev ? <td><p className="txtview">{item.qualitySignificanceLevel}</p></td>:''}
                                            {searchedData[mainParentIndex].expandRevBlockPrev ? <td><p className="txtview">{item.qualitySignificanceLevel}</p></td>:''}
                                            {searchedData[mainParentIndex].expandRevBlockPrev ? <td><p className="txtview">{item.partWeight}</p></td>:''}
                                          </tr>         
                                      );
                                    })} 
                                  </tbody>
                                
                                </Table>
                                  <div className="sidearrow">
                                    {searchedData[mainParentIndex].isOpenRevShowHideCollapsePrev ? (
                                      <span
                                        className="ico-add blIconlft" 
                                        onClick={event => {
                                          this.openRevisionShowHideCollapsePrev(event, false, mainParentIndex);
                                        }}
                                      >
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#arrowpreviousIco`}
                                          />
                                        </svg>
                                      </span>
                                      ) : (                                       
                                        <span
                                        className="ico-add blIconlft"
                                        onClick={event => {
                                          this.openRevisionShowHideCollapsePrev(event, true, mainParentIndex);
                                        }}
                                      >
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#arrownextIco`}
                                          />
                                        </svg>
                                      </span>
                                    )}
                                  </div>
                              </div>


                              <div className="createTree flex flex-column mr-10">
                                <div className="flex createFl gray-card">                              
                                  <div className="tree o-dot">
                                  <h5 className="text-uppercase ex-titel">
                                      New (to-be)
                                  </h5> 
                                  <ul>                                  
                                    {allBomList.length > 0 && allBomList[index] && allBomList[index].bomList && allBomList[index].bomList.map((variantData, vIdx) => {
                                        let variantChkBox = "variantChkBox" + vIdx;  
                                        let isChild = variantData.containsChildBom ? 'tree_label' : 'tree_label1';                                  
                                        let createActionpop = variantData.part || variantData.partNumber ? 'createActionpop' : '';
                                        return (
                                          // <li className={"treeinn "+ (variantData.firstTreeHide !== undefined && !variantData.firstTreeHide ? 'firsttreeShow ' : 'firsttreeHide')}>  
                                          <li className="treeinn">
                                            <label class={isChild+' '+createActionpop} >
                                              <input               
                                                type="checkbox"
                                                name={variantChkBox}                
                                                id="c6"
                                                onClick={e => this.getBOMSubVariantData(variantData.id, e, vIdx, variantData.bomLevel, index, variantData.partContainingBomId, variantData.uniqueId)}
                                                disabled={!variantData.containsChildBom}
                                                //checked={!variantData.containsChildBom}
                                              />
                                              {variantData.partNumber  ? variantData.partNumber : variantData.bomCode}         

                                              {variantData.part || variantData.partNumber ? 
                                              <div className="more-dd popCreate action-dd">
                                              <DropdownButton
                                              title={
                                              <i class="glyphicon glyphicon-option-horizontal" />
                                              }
                                              >
                                              
                                              <div className="btnWrap"> 
                                              <p onClick={e => this.handleReplaceShow(variantData.id, "add")}> Add</p>
                                              <p onClick={e => this.handleReplaceShow(variantData.id, "replace")}> Replace</p>
                                              <p onClick={e => this.handleRemoveShow(variantData.id, "remove")}> Remove</p>
                                              
                                              </div>
                                              </DropdownButton>
                                              </div>
                                      
                                              : ''}
                                            </label>
                                              {
                                                variantData.containsChildBom && 
                                                this.renderData(variantData.childBOM, vIdx, [vIdx], index,variantData.partContainingBomId,variantData.bomLevel,variantData.uniqueId)
                                              }

                                          </li>
                                        )
                                      })
                                    }

                                  </ul>
                                  </div>
                                
                                </div> 
                              </div>
                                

                              <div className="tableWrapper mr-10 createMainTb">
                                <Table
                                  bordered
                                  condensed                                  
                                  className="custom-table out-calander createsmTb tbcreateWrap"
                                >                        

                                <thead>
                                    <tr>
                                      <th>Rev</th>
                                      <th className="w50">QTY 
                                       
                                      </th>
                                            
                                      {searchedData[mainParentIndex].expandRevBlock ? <th>LEVEL</th> : ''}
                                      {searchedData[mainParentIndex].expandRevBlock ?  <th>PHANTOM</th> : ''}
                                       
                                        { 
                                          searchedData[mainParentIndex].expandRevBlock ?                          
                                            allBomDatas[0] && allBomDatas[0].map((bomIds, bomIdx) =>{
                                              return (
                                                <th> {bomIds}</th>
                                              )
                                            }) : ''                                    
                                        }
                                        { 
                                          searchedData[mainParentIndex].expandRevBlock ?                           
                                            allBomDatas[1] && allBomDatas[1].map((MFG, mfgIdx) =>{
                                              return (
                                                <th>
                                                  <p className="txtview">{MFG} </p>
                                                </th>
                                              )
                                          }) :''                                    
                                        }
                                        {searchedData[mainParentIndex].expandRevBlock ?  <th>QUALITY SIGNIFIANCE</th> : ''}
                                        {searchedData[mainParentIndex].expandRevBlock ?   <th>LEVEL</th> : ''}
                                        {searchedData[mainParentIndex].expandRevBlock ?   <th>PART WEIGHT</th> : ''} 
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {BOMCalculation[index] && BOMCalculation[index].bomList &&
                                      BOMCalculation[index].bomList.map((item, index) => {                                            
                                        return (
                                          <tr key={index}>
                                            <td><p className="txtview">{item.revision && item.revision !== undefined ? item.revision: "-"}</p></td>
                                            <td><p className="txtview">{item.quantity && item.quantity !== undefined ? item.quantity : "-"}</p></td>
                                            {searchedData[mainParentIndex].expandRevBlock ? <td><p className="txtview">{item.bomLevel}</p></td>:''}
                                            {searchedData[mainParentIndex].expandRevBlock ? <td><p className="txtview">{item.phantom}</p></td>:'' }                                          
                                            {searchedData[mainParentIndex].expandRevBlock && item.userDefinedBomIds && item.userDefinedBomIds.map((bomIds, bomIdx) =>{
                                                return (
                                                  <td><p className="txtview">{bomIds}</p></td>
                                                )
                                              })
                                            }                                           
                                            {searchedData[mainParentIndex].expandRevBlock && item.userDefinedMfgIds && item.userDefinedMfgIds.map((MFG, mfgIdx) =>{
                                                return (
                                                  <td><p className="txtview">{MFG}</p></td>
                                                )
                                              })
                                            }
                                            {searchedData[mainParentIndex].expandRevBlock ? <td><p className="txtview">{item.qualitySignificanceLevel}</p></td>:''}
                                            {searchedData[mainParentIndex].expandRevBlock ? <td><p className="txtview">{item.qualitySignificanceLevel}</p></td>:''}
                                            {searchedData[mainParentIndex].expandRevBlock ? <td><p className="txtview">{item.partWeight}</p></td>:''}
                                          </tr>         
                                      );
                                    })} 
                                  </tbody>
                                
                                </Table>
                                      
                                  <div className="sidearrow">
                                    {searchedData[mainParentIndex].isOpenRevShowHideCollapse ? (
                                      <span
                                        className="ico-add blIconlft" 
                                        onClick={event => {
                                          this.openRevisionShowHideCollapseNext(event, false, mainParentIndex);
                                        }}
                                      >
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#arrowpreviousIco`}
                                          />
                                        </svg>
                                      </span>
                                      ) : (                                       
                                        <span
                                        className="ico-add blIconlft"
                                        onClick={event => {
                                          this.openRevisionShowHideCollapseNext(event, true, mainParentIndex);
                                        }}
                                      >
                                        <svg>
                                          <use
                                            xlinkHref={`${Sprite}#arrownextIco`}
                                          />
                                        </svg>
                                      </span>
                                    )}
                                  </div>
                               </div>

                              <div className="tableWrapper mr-10">
                                <Table
                                  bordered
                                  condensed
                                  className="custom-table out-calander createlgTb tbcreateWrap"
                                >
                                  <thead>
                                    <tr className="pdth">
                                      <th rowspan="2" className="b-right">UOM {searchedData && searchedData[mainParentIndex].isOpenCostCollapse}</th>
                                      <th colspan={searchedData && searchedData[mainParentIndex].isOpenCostCollapse} scope="colgroup" className="b-right">                                       
                                      <div className="flex align-center justify-center p-l-r-5">COST
                                        {searchedData && searchedData[mainParentIndex].isOpenCostShowHideCollapse ? (                                           
                                            <span className="ico-add clrblue cursor-pointer arrowNext"
                                                onClick={event => {
                                                this.isOpenCostShowHideCollapse(event, false, mainParentIndex);
                                              }}
                                            >
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#arrowpreviousIco`}
                                                />
                                              </svg>
                                          </span> 
                                        ) : (
                                          <span
                                            className="ico-add clrblue cursor-pointer arrowNext"
                                            onClick={event => {
                                              this.isOpenCostShowHideCollapse(event, true, mainParentIndex);
                                            }}
                                          >
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#arrownextIco`}
                                              />
                                            </svg>
                                          </span>
                                        )} 
                                      </div>
                                      </th>
                                      <th colspan={searchedData && searchedData[mainParentIndex].isOpenPlanningCollapse} scope="colgroup" className="b-right">
                                        <div className="flex align-center justify-center p-l-r-5">Planning
                                          {searchedData[mainParentIndex].isOpenPlanningShowHideCollapse ? (
                                              <span
                                                className="ico-add clrblue cursor-pointer arrowNext"
                                                onClick={event => {
                                                  this.isOpenPlanningShowHideCollapse(event, false, mainParentIndex);
                                                }}
                                              >
                                                <svg>
                                                  <use
                                                    xlinkHref={`${Sprite}#arrowpreviousIco`}
                                                  />
                                                </svg>
                                              </span>
                                            ) : (
                                              <span className="ico-add clrblue cursor-pointer arrowNext"
                                                  onClick={event => {
                                                  this.isOpenPlanningShowHideCollapse(event, true, mainParentIndex);
                                                }}
                                              >
                                                <svg>
                                                  <use
                                                    xlinkHref={`${Sprite}#arrownextIco`}
                                                  />
                                                </svg>
                                            </span> 
                                          )} 
                                        </div>
                                      </th>
                                      <th rowspan="2" className="b-right">Paint</th>
                                      <th rowspan="2" className="b-right">Special Mfg Instruction</th>
                                      <th rowspan="2" className="b-right">Special Packaging Instruction</th>
                                      <th colspan={searchedData && searchedData[mainParentIndex].isOpenServiceCollapse} scope="colgroup" className="b-right">
                                        <div className="flex align-center justify-center p-l-r-5">Service
                                          {searchedData[mainParentIndex].isOpenServiceShowHideCollapse ? (
                                              <span
                                                className="ico-add clrblue cursor-pointer arrowNext"
                                                onClick={event => {
                                                  this.isOpenServiceShowHideCollapse(event, false, mainParentIndex);
                                                }}
                                              >
                                                <svg>
                                                  <use
                                                    xlinkHref={`${Sprite}#arrowpreviousIco`}
                                                  />
                                                </svg>
                                              </span>
                                            ) : (
                                              <span className="ico-add clrblue cursor-pointer arrowNext"
                                                  onClick={event => {
                                                  this.isOpenServiceShowHideCollapse(event, true, mainParentIndex);
                                                }}
                                              >
                                                <svg>
                                                  <use
                                                    xlinkHref={`${Sprite}#arrownextIco`}
                                                  />
                                                </svg>
                                            </span> 
                                          )} 
                                        </div>
                                      </th>
                                      <th colspan={searchedData && searchedData[mainParentIndex].isOpenAPQPCollapse} scope="colgroup" className="b-right">
                                        <div className="flex align-center justify-center p-l-r-5">APQP
                                          {searchedData[mainParentIndex].isOpenAPQPShowHideCollapse ? (
                                                <span
                                                  className="ico-add clrblue cursor-pointer arrowNext"
                                                  onClick={event => {
                                                    this.isOpenAPQPShowHideCollapse(event, false, mainParentIndex);
                                                  }}
                                                >
                                                  <svg>
                                                    <use
                                                      xlinkHref={`${Sprite}#arrowpreviousIco`}
                                                    />
                                                  </svg>
                                                </span>
                                              ) : (
                                                <span className="ico-add clrblue cursor-pointer arrowNext"
                                                    onClick={event => {
                                                    this.isOpenAPQPShowHideCollapse(event, true, mainParentIndex);
                                                  }}
                                                >
                                                  <svg>
                                                    <use
                                                      xlinkHref={`${Sprite}#arrownextIco`}
                                                    />
                                                  </svg>
                                              </span> 
                                            )} 
                                          </div>                                      
                                      </th>
                                      <th colspan={searchedData && searchedData[mainParentIndex].isOpenOEPartsCollapse} scope="colgroup" className="b-right">
                                        <div className="flex align-center justify-center p-l-r-5">OE Parts
                                          {searchedData[mainParentIndex].isOpenOEPartsShowHideCollapse ? (
                                                <span
                                                  className="ico-add clrblue cursor-pointer arrowNext"
                                                  onClick={event => {
                                                    this.isOpenOEPartsShowHideCollapse(event, false, mainParentIndex);
                                                  }}
                                                >
                                                  <svg>
                                                    <use
                                                      xlinkHref={`${Sprite}#arrowpreviousIco`}
                                                    />
                                                  </svg>
                                                </span>
                                              ) : (
                                                <span className="ico-add clrblue cursor-pointer arrowNext"
                                                    onClick={event => {
                                                    this.isOpenOEPartsShowHideCollapse(event, true, mainParentIndex);
                                                  }}
                                                >
                                                  <svg>
                                                    <use
                                                      xlinkHref={`${Sprite}#arrownextIco`}
                                                    />
                                                  </svg>
                                              </span> 
                                            )} 
                                          </div>
                                      </th>
                                      <th rowspan="2" className="b-right">Current</th>
                                      <th rowspan="2" className="b-right">New </th>
                                  </tr>
                                  <tr> 
                                      <th scope="col" className="b-right">Old Cost</th>
                                      {searchedData[mainParentIndex].expandCostBlock ? <th scope="col" className="b-right">New Estimated Cost</th> : '' }
                                      {searchedData[mainParentIndex].expandCostBlock ? <th scope="col" className="b-right">Estimated Mfg Cost Impact</th> : '' }
                                      {searchedData[mainParentIndex].expandCostBlock ? <th scope="col" className="b-right">Estimated Service Cost Impact</th> : '' }
                                      {searchedData[mainParentIndex].expandCostBlock ? <th scope="col" className="b-right">Actual New Cost </th> : '' }
                                      {searchedData[mainParentIndex].expandCostBlock ? <th scope="col" className="b-right">Actual Mfg Cost Impact</th> : '' }
                                      {searchedData[mainParentIndex].expandCostBlock ? <th scope="col" className="b-right">Actual Service Cost Impact</th> : '' }
                                      {searchedData[mainParentIndex].expandCostBlock ? <th scope="col" className="b-right">Estimated Mfg Investment</th> : '' }
                                      {searchedData[mainParentIndex].expandCostBlock ? <th scope="col" className="b-right">Actual Mfg Investment</th> : '' }
                                      {searchedData[mainParentIndex].expandCostBlock ? <th scope="col" className="b-right">Estimated Vendor Tooling</th> : '' }
                                      {searchedData[mainParentIndex].expandCostBlock ? <th scope="col" className="b-right">Actual Vendor Tooling</th> : '' }
                                    
                                      <th scope="col" className="b-right">Target Implementation date</th>
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <th scope="col" className="b-right">Actual Implementation date</th> : '' }
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <th scope="col" className="b-right">Other Mandatory Engg. changes</th> : '' }
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <th scope="col" className="b-right">Serial Number Break Mandatory</th> : '' }
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <th scope="col" className="b-right">Serial Number Break</th> : '' }
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <th scope="col" className="b-right">Stock (Qty) on hand</th> : '' }
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <th scope="col" className="b-right">Stock (Qty) on order</th> : '' }
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <th scope="col" className="b-right">Stock (Qty) in Service Parts</th> : '' }
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <th scope="col" className="b-right">Total Estimated Scrap</th> : '' }
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <th scope="col" className="b-right">Total Actual Scrap</th> : '' }
                                      
                                      <th scope="col" className="b-right">Part Interchangeable in Service</th>
                                      {searchedData[mainParentIndex].expandServiceBlock ? <th scope="col" className="b-right">Scrap parts in Service.</th> : '' }
                                      {searchedData[mainParentIndex].expandServiceBlock ? <th scope="col" className="b-right">Special Service Instruction</th> : '' }

                                      <th scope="col" className="b-right">Design Review  Record</th>
                                      {searchedData[mainParentIndex].expandAPQPBlock ?<th scope="col" className="b-right">Mfg Review Record</th>: '' }
                                      {searchedData[mainParentIndex].expandAPQPBlock ?<th scope="col" className="b-right">Validation (Testing) Record</th>: '' }
                                      {searchedData[mainParentIndex].expandAPQPBlock ?<th scope="col" className="b-right">Designer</th>: '' }
                                      {searchedData[mainParentIndex].expandAPQPBlock ?<th scope="col" className="b-right">Implemented By</th>: '' }
                                      {searchedData[mainParentIndex].expandAPQPBlock ?<th scope="col" className="b-right">Quality Approved By</th>: '' }
                                      
                                      <th scope="col" className="b-right">Old Supplier</th>
                                      {searchedData[mainParentIndex].expandOEPartsBlock ?<th scope="col" className="b-right">Old Supplier Part No</th>: '' }
                                      {searchedData[mainParentIndex].expandOEPartsBlock ?<th scope="col" className="b-right">New Supplier</th>: '' }
                                      {searchedData[mainParentIndex].expandOEPartsBlock ?<th scope="col" className="b-right">New Supplier Part No.</th>: '' }
                                    
                                    </tr>  
                                  </thead>
                              
                                <tbody>
                                {BOMCalculation[index] && BOMCalculation[index].bomList && BOMCalculation[index].bomList &&
                                      BOMCalculation[index].bomList.map((item, childIndex) => {                                                                      
                                  return (
                                    <tr key={childIndex}>
                                      <td><p className="txtview">{item.uom && item.uom !== undefined ? item.uom : "-"}</p></td>
                                      <td><p className="txtview">{item.oldCost==undefined || item.oldCost=='' ? "-" : item.oldCost }</p></td>
                                      
                                      {searchedData[mainParentIndex].expandCostBlock ? <td className="w100"> 
                                        <FormGroup className="formtc">
                                            <FormControl
                                              type="number"
                                              name='newEstimatedCost'
                                              value={item.newEstimatedCost}
                                              className="br-0"
                                              min = "0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td>: '' }
                                      {searchedData[mainParentIndex].expandCostBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='estimatedManufactureCostImpact'
                                              value={item.estimatedManufactureCostImpact}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td> : '' }
                                      {searchedData[mainParentIndex].expandCostBlock ?<td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='estimatedServiceCostImpact'
                                              value={item.estimatedServiceCostImpact}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td>: ''   }
                                      {searchedData[mainParentIndex].expandCostBlock ?<td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='actualNewCost'
                                              value={item.actualNewCost}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td> : ''   }
                                      {searchedData[mainParentIndex].expandCostBlock ?<td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='actualManufactureCostImpact'
                                              value={item.actualManufactureCostImpact}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td>: ''   }
                                      {searchedData[mainParentIndex].expandCostBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='actualServiceCostImpact'
                                              value={item.actualServiceCostImpact}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td> : ''}
                                      {searchedData[mainParentIndex].expandCostBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='estimatedManufactureInvestment'
                                              value={item.estimatedManufactureInvestment}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td>: ''   }
                                      {searchedData[mainParentIndex].expandCostBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='actualManufactureInvestment'
                                              value={item.actualManufactureInvestment}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td> : ''   }
                                      {searchedData[mainParentIndex].expandCostBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='estimatedVendorTooling'
                                              value={item.estimatedVendorTooling}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td> : ''  }
                                      {searchedData[mainParentIndex].expandCostBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='actualVendorTooling'
                                              value={item.actualVendorTooling}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td> : ''   }
                                      
                                      <td>
                                        <div>
                                          <FormGroup className="m-b-0">
                                          <DatePicker
                                            selected={item.targetImplementationDate}
                                            name="targetImplementationDate"                                                            
                                            autoComplete="nope"
                                            value={item.targetImplementationDate}
                                            onChange={event => {
                                              this.handleOnBOMCalculationData(event, childIndex, mainParentIndex, 'targetImplementationDate', 'date');
                                            }}
                                            placeholderText="DD/MM/YYYY"
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            dateFormat="dd/MM/yyyy"
                                            minDate={
                                              new Date()
                                            }
                                          />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </div>
                                      </td>  

                                      {searchedData[mainParentIndex].expandPlanningBlock ? <td>
                                        <div>
                                          <FormGroup className="m-b-0">
                                            <DatePicker
                                              selected={item.actualImplementationDate}
                                              name="actualImplementationDate"                                                            
                                              autoComplete="nope"
                                              value={item.actualImplementationDate}
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex, 'actualImplementationDate', 'date');
                                              }}
                                              placeholderText="DD/MM/YYYY"
                                              peekNextMonth
                                              showMonthDropdown
                                              showYearDropdown
                                              dropdownMode="select"
                                              dateFormat="dd/MM/yyyy"
                                              minDate={
                                                new Date()
                                              }
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </div>
                                      </td> : ''   }
          
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <td  className="w100">
                                      <FormGroup>
                                        <FormControl
                                            componentClass="select"
                                            autocomplete="off"
                                            placeholder="select"
                                            className="br-0 s-arrow"
                                            value={item.otherMandatoryEnggChangeForImplementationId ? item.otherMandatoryEnggChangeForImplementationId : ''}
                                            name="otherMandatoryEnggChangeForImplementationId"
                                            onChange={event => {
                                              this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                            }}
                                          >
                                            <option value="select">select</option>
                                            {item.otherMandatoryEnggChangeForImplementation &&
                                              item.otherMandatoryEnggChangeForImplementation.map((item, index) => {
                                                return (
                                                  <option
                                                    value={item.id}
                                                    key={index}
                                                  >
                                                    {item.ecoNumber}
                                                  </option>
                                                );
                                              })}
                                        </FormControl>
                                      </FormGroup>
                                    </td>: '' }
                                    {searchedData[mainParentIndex].expandPlanningBlock ? <td>
                                        {item && item.isSerialNumberBreakMandatory &&  item.isSerialNumberBreakMandatory !==undefined ? (
                                          <span className="s-circle yes cursor-pointer" onClick={event => {
                                            this.isSerialNumberBreakMandatory(event, 'yes', childIndex, mainParentIndex);                                          
                                          }}>Y</span>
                                        ) : (
                                          <span className="s-circle redclr cursor-pointer" onClick={event => {
                                            this.isSerialNumberBreakMandatory(event, 'no', childIndex, mainParentIndex);                                            
                                          }}>N</span>
                                        )}
                                    </td>: '' }  
                                    {searchedData[mainParentIndex].expandPlanningBlock ? <td>
                                        {item && item.isSerialNumberBreak && item.isSerialNumberBreak !== undefined ? (
                                          <span className="s-circle yes cursor-pointer" onClick={event => {
                                            this.isSerialNumberBreak(event, 'yes', childIndex, mainParentIndex);                                            
                                          }}>Y</span>
                                        ) : (
                                          <span className="s-circle redclr cursor-pointer" onClick={event => {
                                            this.isSerialNumberBreak(event, 'no', childIndex, mainParentIndex);                                           
                                          }}>N</span>
                                        )}
                                    </td> : '' }
                                    {searchedData[mainParentIndex].expandPlanningBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='stockOnHand'
                                              value={item.stockOnHand}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td> : ''  }
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='stockOnOrder'
                                              value={item.stockOnOrder}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td> : ''   }
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='stockInServiceParts'
                                              value={item.stockInServiceParts}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td> : ''  }
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='totalEstimatedScrap'
                                              value={item.totalEstimatedScrap}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td> : ''   }
                                      {searchedData[mainParentIndex].expandPlanningBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='totalActualScrap'
                                              value={item.totalActualScrap}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td> : ''    }
                                      
                                      <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='paint'
                                              value={item.paint}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td>  

                                      <td className="w100"> 
                                        <div className="flex viewEdit align-center justify-center">
                                          <p className="txtview">Edit</p>
                                          <span className="ico-action"  onClick={e => this.handleSpecalMFGShow(e, childIndex, mainParentIndex)}>
                                            <svg>
                                              <use xlinkHref={`${Sprite}#editIco`} />
                                            </svg>
                                          </span>
                                        </div>
                                      </td> 

                                      <td className="w100"> 
                                        <div className="flex viewEdit align-center justify-center">
                                          <p className="txtview">Edit</p>
                                          <span className="ico-action"  onClick={e => this.handleSpecalPackShow(e, childIndex, mainParentIndex)}>
                                            <svg>
                                              <use xlinkHref={`${Sprite}#editIco`} />
                                            </svg>
                                          </span>
                                        </div>
                                      </td> 

                                    <td>
                                        {item.isPartsInterchangeableInService ? (
                                          <span className="s-circle yes cursor-pointer" onClick={event => {
                                            this.isPartsInterchangeableInService(event, 'yes', childIndex, mainParentIndex);                                          
                                          }}>Y</span>
                                        ) : (
                                          <span className="s-circle redclr cursor-pointer" onClick={event => {
                                            this.isPartsInterchangeableInService(event, 'no', childIndex, mainParentIndex);                                            
                                          }}>N</span>
                                        )}
                                      </td>
                                      
                                      {searchedData[mainParentIndex].expandServiceBlock ? <td>
                                        {item.isScrapPartsInService ? (
                                          <span className="s-circle yes cursor-pointer" onClick={event => {
                                            this.isScrapPartsInService(event, 'yes', childIndex, mainParentIndex);                                            
                                          }}>Y</span>
                                        ) : (
                                          <span className="s-circle redclr cursor-pointer" onClick={event => {
                                            this.isScrapPartsInService(event, 'no', childIndex, mainParentIndex);                                           
                                          }}>N</span>
                                        )}
                                      </td> : '' }

                                      {searchedData[mainParentIndex].expandServiceBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='specialServiceInstructions'
                                              value={item.specialServiceInstructions}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td> : '' }


                                      <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='apqpDesignReviewRecord'
                                              value={item.apqpDesignReviewRecord}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td>  
                                      
                                      {searchedData[mainParentIndex].expandAPQPBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='apqpManufacturingReviewRecord'
                                              value={item.apqpManufacturingReviewRecord}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td>  : '' }  
                                      {searchedData[mainParentIndex].expandAPQPBlock ? <td className="w100"> 
                                          <FormGroup className="formtc">
                                            <FormControl
                                              type="text"
                                              name='apqpValidationTestingRecord'
                                              value={item.apqpValidationTestingRecord}
                                              className="br-0"
                                              autoComplete="nope"
                                              onChange={event => {
                                                this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                              }}
                                            placeholder="Type here"/>
                                          </FormGroup>
                                      </td>  : '' }  
                                      {searchedData[mainParentIndex].expandAPQPBlock ? <td  className="w100">
                                      <FormGroup>
                                        <FormControl
                                            componentClass="select"
                                            autocomplete="off"
                                            placeholder="select"
                                            className="br-0 s-arrow"
                                            value={item.apqpDesignerId ? item.apqpDesignerId : ''}
                                            name="apqpDesignerId"
                                            onChange={event => {
                                              this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                            }}
                                          >
                                            <option value="select">select</option>
                                            {item.apqpDesigner !== undefined && item.apqpDesigner  &&
                                              item.apqpDesigner.map((item, index) => {
                                                return (
                                                  <option
                                                    value={item.id}
                                                    key={index}
                                                  >
                                                    {item.fullName}
                                                  </option>
                                                );
                                              })}
                                        </FormControl>
                                      </FormGroup>
                                    </td> : '' }
                                    {searchedData[mainParentIndex].expandAPQPBlock ? <td  className="w100">
                                      <FormGroup>
                                        <FormControl
                                            componentClass="select"
                                            autocomplete="off"
                                            placeholder="select"
                                            className="br-0 s-arrow"
                                            value={item.apqpImplementedById ? item.apqpImplementedById : ''}
                                            name="apqpImplementedById"
                                            onChange={event => {
                                              this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                            }}
                                          >
                                            <option value="select">select</option>
                                            {item.apqpImplementedBy &&
                                              item.apqpImplementedBy.map((item, index) => {
                                                return (
                                                  <option
                                                    value={item.id}
                                                    key={index}
                                                  >
                                                    {item.fullName}
                                                  </option>
                                                );
                                              })}
                                        </FormControl>
                                      </FormGroup>
                                    </td> : '' }
                                    {searchedData[mainParentIndex].expandAPQPBlock ? <td  className="w100">
                                      <FormGroup>
                                        <FormControl
                                            componentClass="select"
                                            autocomplete="off"
                                            placeholder="select"
                                            className="br-0 s-arrow"
                                            value={item.apqpQualityApprovalById ? item.apqpQualityApprovalById : ''}
                                            name="apqpQualityApprovalById"
                                            onChange={event => {
                                              this.handleOnBOMCalculationData(event, childIndex, mainParentIndex);
                                            }}
                                          >
                                            <option value="select">select</option>
                                            {item.apqpQualityApprovalBy &&
                                              item.apqpQualityApprovalBy.map((item, index) => {
                                                return (
                                                  <option
                                                    value={item.id}
                                                    key={index}
                                                  >
                                                    {item.fullName}
                                                  </option>
                                                );
                                              })}
                                        </FormControl>
                                      </FormGroup>
                                    </td> : '' }

                                  <td><p className="txtview">{item.oldSupplier==undefined || item.oldSupplier=='' ? "-" : item.oldSupplier }</p></td>
                                  
                                  {searchedData[mainParentIndex].expandOEPartsBlock ? <td><p className="txtview">{item.oldSupplierPartNumber==undefined || item.oldSupplierPartNumber=='' ? "-" : item.oldSupplierPartNumber }</p></td>: '' }
                                  {searchedData[mainParentIndex].expandOEPartsBlock ? <td><p className="txtview">{item.newSupplier==undefined || item.newSupplier=='' ? "-" : item.newSupplier }</p></td>: '' }
                                  {searchedData[mainParentIndex].expandOEPartsBlock ? <td><p className="txtview">{item.oeNewSupplierPartNumber==undefined || item.oeNewSupplierPartNumber=='' ? "-" : item.oeNewSupplierPartNumber }</p></td>: '' }
                                  {/* <td className="p-0 cursor-pointer w100">
                                      <img src="https://s3.ap-south-1.amazonaws.com/dev-makethepart/BookShelf_1546848863429.jpeg"
                                        width="45"
                                        className="sm-p-img"
                                      />
                                    </td>
                                      <td className="p-0 cursor-pointer w100">
                                        <img src="https://s3.ap-south-1.amazonaws.com/dev-makethepart/BookShelf_1546848863429.jpeg"
                                          width="45"
                                          className="sm-p-img"
                                        />
                                      </td> */}
                                      <td className="p-0 cursor-pointer w100">
                                        <div className="upload-btn cursor-pointer sm-upload">                               
                                          <p className="m-b-0">
                                            {item.partMediaThumbnail !== undefined && item.partMediaThumbnail ?  
                                              <img
                                                src={item.partMediaThumbnail}
                                                width="45"
                                                onClick={ event => {this.showCropImageModal(event, item.partMediaResponses, childIndex, mainParentIndex )}}
                                                className="sm-p-img"
                                              /> : '-'
                                            }                                            
                                          </p>
                                        </div>
                                      </td>

                                      <td className="p-0 cursor-pointer w100">
                                        <p className="m-b-0"> 
                                        {item.newImage !== undefined && item.newImage.mediaFullURL ?   
                                            <img
                                              src={item.newImage.mediaFullURL}
                                              width="45"
                                              className="sm-p-img"
                                            /> : '-'
                                          } 
                                        </p> 
                                      </td>
                                    </tr>         
                                    );
                                  })} 
                                </tbody>
                                </Table>
                              </div>
                            </Row>
                          </div> 
                        ): ''} 

                      </div>
                     
                    )
                  })}
                  {allBomList && allBomList.length > 0 ? 
                    <div className="text-center m-b-20 m-t-20">
                        <button
                          className="btn btn-default"
                          onClick={event => this.validateData(event)}
                        >
                          Submit
                        </button>                
                    </div>
                  :''   }
                </div>

                <Modal
                  show={this.state.show}
                  onHide={this.handleClose}
                  className="custom-popUp modal-400"
                >
                  <Modal.Body>
                    <div className="flex justify-space-between">
                      <h4 className="flex-1 text-center">
                        Search any part or group
                        </h4>
                      <button
                        onClick={this.handleClose}
                        className=" btn btn-link sm-btn"
                      >
                        Close
                        </button>
                    </div>
                    <div className="mh-250">
                      <FormGroup className="">
                        <FormControl className="br-0 gray-card search-bg" />
                      </FormGroup>
                    </div>
                    <div className="text-center">
                      <button className="btn btn-default text-uppercase">
                        change
                        </button>
                    </div>
                  </Modal.Body>
                </Modal>
              
                <Modal
                  show={this.state.addShow}
                  onHide={this.handleAddClose}
                  className="custom-popUp modal-400"
                >
                  <Modal.Body>
                    <div className="flex justify-space-between m-b-20">
                      <h4 className="flex-1 text-center">
                        Search any part or group
                        </h4>
                      <button
                        onClick={this.handleAddClose}
                        className=" btn btn-link sm-btn"
                      >
                        Close
                        </button>
                    </div>

                    <div className="mh-250">
                      <FormGroup className="">
                        <FormControl className="br-0 gray-card search-bg" />
                      </FormGroup>
                    </div>
                    <div className="text-center">
                      <button className="btn btn-default text-uppercase">
                        Add
                        </button>
                    </div>
                  </Modal.Body>
                </Modal>
              
                <Modal
                  show={this.state.removeShow}
                  onHide={this.handleRemoveClose}
                  className="custom-popUp confirmation-box"
                  bsSize="small"
                >
                  <Modal.Body>
                    <h4 className="text-center">Are you sure want to delete</h4>
                    <div className="text-center">
                      <button
                        className="btn btn-success text-uppercase"
                        onClick={this.handleRemoveClose}
                      >
                      Cancel
                      </button>
                      <button className="btn btn-default text-uppercase"
                          onClick={event => {
                            this.removePart(event);
                          }}>
                          Confirm
                      </button>
                    </div>
                  </Modal.Body>
                </Modal>
              
                <Modal
                  show={this.state.replaceShow}
                  onHide={this.handleReplaceClose}
                  className="custom-popUp modal-400"
                >
                  <Modal.Body>
                    <div className="flex justify-space-between m-b-20">
                      <h4 className="flex-1 text-center">
                        Search any part or group
                        </h4>
                    </div>
                    {this.state.action === 'replace' ? (<p>Old Part : <span>Old part 1</span> </p>) : ''}                    
                    <p>New Part</p>
                    <div className="mh-250 searchautowrap">
                      <FormGroup>
                        <FormControl
                          className="br-0 gray-card search-bg"
                          type="text"
                          autoComplete="off"
                          name="searchKeword"
                          placeholder="Search for..."
                          value={this.state.searchKeword}
                          onChange={event => {
                            this.handleOnChangeKeyword(event);
                          }}
                          onKeyUp={this.getPartByKeyword}
                        />
                        {this.state.searchAutoList ? (
                          <div className="searchautolist">
                            <ul>
                              {this.state.partSearchingList && this.state.partSearchingList.map((data, sIdx) => {                                
                                return (
                                  <li key={sIdx}>
                                    <span
                                      onClick={event => {
                                        this.onChangeAutoList(event, data);
                                      }}>{data.partNumber}</span>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>) : ''
                        }

                      </FormGroup>
                    </div>
                    <div className="text-center">
                      <button
                        className="btn btn-success text-uppercase"
                        onClick={this.handleReplaceClose}
                      >
                        Cancel
                      </button>
                      {this.state.action === 'replace' ? (
                        <button className="btn btn-default text-uppercase"
                          onClick={event => {
                            this.replacePart(event);
                          }}>
                          Replace
                        </button>
                      ): (
                        <button className="btn btn-default text-uppercase"
                          onClick={event => {
                            this.replacePart(event);
                          }}>
                          Add
                        </button>
                      )}  
                    </div>
                  </Modal.Body>
                </Modal>


                <Modal
                  show={this.state.specalMFG}
                  onHide={this.handleSpecalMFGClose}
                  //className="custom-popUp modal-400"
                  className="custom-popUp confirmation-box"
                  bsSize="small"
                >
                  <Modal.Header>
                    <div className="flex justify-space-between align-center">
                      <h5>Specal MFG Instruction</h5>
                      <div className="">
                        <button
                          onClick={this.handleSpecalMFGClose}
                          className="btn btn-link text-uppercase color-light sm-btn"
                        >
                          close
                        </button>
                      </div>
                    </div>
                  </Modal.Header>
                  <Modal.Body>

                    <ul>
                      {this.state.specalMFGData && this.state.specalMFGData.map((data, sIdx)=>{
                        return (
                          <li><input className="border-none" name="specialManufacturingInstructions" autoFocus type="text" 
                          onKeyUp={event => {
                          this.setSpecalMFGData(event);
                          }}></input></li>
                        )
                      })}         
                    </ul> 

                    <div className="text-center m-t-40">    
                      <button className="btn btn-default text-uppercase"
                         onClick={event => {
                          this.handleOnBOMCalculationData(event, childIndexMFG, parentIndexMFG, 'specialManufacturingInstructions', 'specialManufacturing');
                          }} 
                          >
                          Add
                      </button> 
                    </div>
                  </Modal.Body>
                </Modal>

                <Modal
                  show={this.state.specalPack}
                  onHide={this.handleSpecalPackClose}
                  //className="custom-popUp modal-400"
                  className="custom-popUp confirmation-box"
                  bsSize="small"
                >
                  <Modal.Header>
                    <div className="flex justify-space-between align-center">
                      <h5>Specal Packaging Instruction</h5>
                      <div className="">
                        <button
                          onClick={this.handleSpecalPackClose}
                          className="btn btn-link text-uppercase color-light sm-btn"
                        >
                          close
                        </button>
                      </div>
                    </div>
                  </Modal.Header>
                  <Modal.Body>
                    
                      <ul>
                        {this.state.specalPackData && this.state.specalPackData.map((data, sIdx)=>{
                          return (
                            <li><input className="border-none" name="specialPackagingInstructions" autoFocus  type="text" 
                            onKeyUp={event => {
                            this.setSpecalPackData(event);
                            }}></input></li>
                          )
                        })}         
                      </ul> 

                    <div className="text-center m-t-40">
                      <button className="btn btn-default text-uppercase"
                          onClick={event => {
                            this.handleOnBOMCalculationData(event, childIndexPack, parentIndexPack, 'specialPackagingInstructions', 'specialPackaging');
                          }}                         
                          >
                          Add
                      </button> 
                    </div>
                  </Modal.Body>
                </Modal>
              
                {/* <Modal
                  show={this.state.showCropImg}
                  onHide={this.hideCropImgModal}
                  className="custom-popUp modal-400"
                >
                  <Modal.Header>
                    <div className="flex justify-space-between align-center">
                      <h5>Crop Image</h5>
                      <div className="">
                        <button
                          onClick={this.hideCropImgModal}
                          className="btn btn-link text-uppercase color-light sm-btn"
                        >
                          close
                        </button>
                      </div>
                    </div>
                  </Modal.Header>
                  <Modal.Body>
                  <div style={{ width: '100%' }}> 
                    <ImageCropper
                      style={{ height: 400, width: '100%' }}
                      aspectRatio={16 / 9}
                      preview=".img-preview"
                    // guides={false}
                      src={this.state.mainImage}
                      ref={cropper => { this.cropper = cropper; }}
                    />
                  </div>    

                    <div className="text-center">
                      <button onClick={this.cropImage.bind(this)} className="btn btn-default text-uppercase">
                        Upload
                        </button>
                    </div>

                 </Modal.Body>
                </Modal> */}

              </div>
            </div>
            <Footer pageTitle={permissionConstant.footer_title.create_eco} />
          </div>
        ) : null}

        
        {this.state.sliderShow ? (
          <SliderModal
            show={this.state.showCropImg}
            parentIndexPartImg={this.state.parentIndexPartImg}
            childIndexPartImg={this.state.childIndexPartImg}
            imagesArray={this.state.imagesArray}
            mainImage={this.state.mainImage}
            handleCloseModal={this.hideCropImgModal}
            BOMCalculation = {this.state.BOMCalculation}
            listOfEcoRequest = {this.state.listOfEcoRequest}     
          />
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
      actionCreateECO,
      actionECODropDownData,
      actionECOPartDropDownData,
      actionGetAllProjectData,
      actionBOMVariantData,
      actionBOMSubVariantData,
      actionSearchPartByKeyword,
      actionGetBOMCalculationData,
      actionUpdateBOMData,
      actionGetBOMFilterData,
      actuionGetSuggessionFilterData,
      actuionGetWhereUsedData,
      actuionGetFindAllBOMData,
      actionUploadImage
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

CreateECO = validation(strategy)(CreateECO);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateECO);
