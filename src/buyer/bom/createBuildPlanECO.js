import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Popover,
  Tab,
  Nav,
  NavItem,
  Panel,
  Glyphicon, FormControl,
  FormGroup,
  Modal,
  Table
} from "react-bootstrap";
import Sprite from "../../img/sprite.svg";
import userImage from '../../img/profile.svg';

import {
  actionLoaderHide,
  actionLoaderShow,
  actionGetDiscloserData,
  actionApproveRejectNonDiscloser,
  actionGetBuildPlanData,
  actionCreateBuildPlanData,
  actionBOMBuildPlanDropDownData,
  actionUpdateBuildPlanData,
  actionGetApproverData,
  actionAddApproverUser,
  actionAddCommentRevision,
  actionGetAllProjectData,
  actuionGetSuggessionFilterUserList
} from "../../common/core/redux/actions";
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from "../../common/commonFunctions";
import Header from "../common/header";
import SideBar from "../common/sideBar";
import Slider from "react-slick";
import Footer from "../common/footer";
import * as moment from 'moment';
import _ from 'lodash';
import CONSTANTS from "../../common/core/config/appConfig";
import { handlePermission } from "../../common/permissions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
let { permissionConstant } = CONSTANTS;
let { validationMessages } = CONSTANTS;
const popoverBottom = (
  <Popover id="popover-positioned-bottom">
    <button className="btn btn-info sm-btn">Replace</button>
    <button className="btn btn-info sm-btn">Remove</button>
    <button className="btn btn-info sm-btn">Add</button>
  </Popover>
);
class CreateBuildPlanECO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "tenth",
      buildPhaseCounter: 1,
      countRevision: 1,
      currentSlide: 1,
      projectCount: 1,
      projectIndex: 'project0',
      projectKey: 0,
      getSlide: 1,
      listOfBuildPlanResponse: [],
      show: false,
      approverId: '',
      listOfApproversIds: [],
      isRevisionDisable: false,
      isCopySelected: false,
      allProjectList: [],
      isRefrenceVariant: true,

      projectName: '',
      listOfBuildPlanRevision: [
        {
          revisionNumber: 1,
          listOfBuildPhase: [
            {
              buildPhase: 'buildphase1',
              listOfVariantBuildPlan: [
                {
                  bomOrVariant: '',
                  refrenceVariant: '',
                  variantDescription: '',
                  eco: '',
                  buildLocations: [
                    {
                      buildLocation: {},
                      noOfUnitsInTheBuild: '',
                      bufferParts: '',
                      buildInCharge: '',
                      materialAvailabilityTartgetDate: '',
                      buildFinishTargetDate: '',
                      productShipTargetDate: ''
                    }
                  ],
                }
              ]
            }
          ]
        }
      ],
      revisionArray: ['Revision 1'],
      projectArray: [{ pcount: "New Project"}],
      buildInchargeList: [],
      buildPlanLocationList: [],
      variantBOMResponse: [],
      ECOResponse: [],
      searchFilterKey: '', filterDDAutoList: false, addUserSearch: true,
    }


    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.createBuildPlanData = this.createBuildPlanData.bind(this);
    this.updateBuildPlanData = this.updateBuildPlanData.bind(this);
    //this.handleHideApprovalModal = this.handleHideApprovalModal.bind(this);
    this.handleCloseModel = this.handleCloseModel.bind(this);
    // this.handleCommentClose = this.handleCommentClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOnChangeLocation = this.handleOnChangeLocation.bind(this);
    this.getSuggessionFilterUserList = this.getSuggessionFilterUserList.bind(this);
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

  /* Get bom Dropdowns */
  getbomDropDownData(id) {
    let _this = this;
    let data = {
      projectId: id
    };
    //this.props.actionLoaderShow();
    this.props
      .actionBOMBuildPlanDropDownData(data)
      .then((result, error) => {
        if (result.payload.data.status === 200) {
          let bomDropDownData = result.payload.data.resourceData;
          _this.setState({
            buildInchargeList: bomDropDownData.buildInchargeList,
            buildPlanLocationList: bomDropDownData.buildPlanLocationList,
            variantBOMResponse: bomDropDownData.variantBomListResponse,
            ECOResponse: bomDropDownData.ecoListResponse,
          });
        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
    window.addEventListener("scroll", this.handleScroll);
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

  componentDidMount() {
    this.getBuildPlanData(0);
    this.getAllProject();
  }

  getBuildPlanData(tabIndex) {
    let tabIndexing = tabIndex;
    let _this = this;
    let projectArrayItems = [];
    let revisionArrayItems = [];
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id
    };
    _this.props.actionLoaderShow();
    this.props
      .actionGetBuildPlanData(data)
      .then((result, error) => {
        if (result.payload.data.status === 200 && result.payload.data.resourceData.length > 0) {
          let listOfBuildPlanResponse = result.payload.data.resourceData;
          let listOfBuildPlanResponseIndex = listOfBuildPlanResponse[tabIndexing];
          let listOfbuildPlanECO = listOfBuildPlanResponseIndex.listOfBuildPlanRevision;

          if (listOfBuildPlanResponseIndex.project && listOfBuildPlanResponseIndex.project.id) {
            this.getbomDropDownData(listOfBuildPlanResponseIndex.project.id)
          } else {
            this.setState({ variantBOMResponse: [] });
          }

          _this.props.actionLoaderShow();
          let projectLength = listOfBuildPlanResponse ? listOfBuildPlanResponse.length : 1;
          for (var i = 1; i <= projectLength; i++) {
            let projectName = listOfBuildPlanResponse && listOfBuildPlanResponse[i - 1].project.id ? listOfBuildPlanResponse[i - 1].project.projectCode : '';
            projectArrayItems.push({ pcount: "New Project", pname: projectName });
          }

          let listOfBuildPlanRevisionLength = listOfBuildPlanResponse && listOfbuildPlanECO ? listOfbuildPlanECO.length : 1;
          for (var i = 1; i <= listOfBuildPlanRevisionLength; i++) {
            revisionArrayItems.push('Revision' + i);
          }
          this.setState({
            listOfBuildPlanResponse: listOfBuildPlanResponse,
            listOfBuildPlanResponseIndex: listOfBuildPlanResponseIndex,
            listOfbuildPlanECO: listOfbuildPlanECO,
            projectArray: projectArrayItems,
            projectLength: projectLength,
            revisionArray: revisionArrayItems,
            revisionArrayItemsLen: revisionArrayItems.length,
          });

        } else {
          _this.props.actionLoaderShow();
          let listOfBuildPlanRevision = this.state.listOfBuildPlanRevision;
          let projectArray = this.state.projectArray;
          this.setState({
            listOfbuildPlanECO: listOfBuildPlanRevision,
            listOfBuildPlanResponse: [],
            revisionArrayItemsLen: 1,
            projectArray: projectArray
          });
          _this.props.actionLoaderShow();

        }
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  addBuilPhasedDataRow(revisionNo) {
    let listOfbuildPlanECO = this.state.listOfbuildPlanECO;

    /* For Validation **/
    let isRevisionTrue = true;
    listOfbuildPlanECO && listOfbuildPlanECO.map(function (revisionData, revisionIdx) {
      revisionData.listOfBuildPhase.map(function (bPhase, variantIdx) {
        let lengthArr = bPhase.listOfVariantBuildPlan.length - 1;
        if (bPhase.listOfVariantBuildPlan[lengthArr]['bomOrVariant'] === undefined ||
          bPhase.listOfVariantBuildPlan[lengthArr]['bomOrVariant'] === '') {
          isRevisionTrue = false;
        }
      })
    })

    if (isRevisionTrue === true) {
      let revisionIndexWithPhase = revisionNo - 1;
      let listOfbuildPlanECOIndex = listOfbuildPlanECO[revisionIndexWithPhase];
      let buildPhaseCounter = this.state.buildPhaseCounter;
      let buildPhaseCounterIncrease = buildPhaseCounter + 1;
      if (listOfbuildPlanECOIndex.listOfBuildPhase.length > 1) {
        buildPhaseCounterIncrease = listOfbuildPlanECOIndex.listOfBuildPhase.length + 1;
      }
      this.setState({ buildPhaseCounter: buildPhaseCounterIncrease });
      let listOfBuildPhase = {
        buildPhase: 'buildphase' + buildPhaseCounterIncrease,
        listOfVariantBuildPlan: [
          {
            bomOrVariant: '',
            refrenceVariant: '',
            variantDescription: '',
            eco: '',
            buildLocations: [
              {
                buildLocation: {},
                noOfUnitsInTheBuild: '',
                bufferParts: '',
                buildInCharge: '',
                materialAvailabilityTartgetDate: '',
                buildFinishTargetDate: '',
                productShipTargetDate: ''
              }
            ],
          }
        ]
      }

      let length = this.state.listOfBuildPlanRevision
        ? this.state.listOfBuildPlanRevision.length
        : 0;

      if (length == 1) {
        if (this.state.listOfbuildPlanECO) {
          let listOfBuildPhaseArray = listOfbuildPlanECOIndex.listOfBuildPhase;
          listOfBuildPhaseArray.push(listOfBuildPhase);
          listOfbuildPlanECOIndex.listOfBuildPhase = listOfBuildPhaseArray;
          listOfbuildPlanECO[revisionIndexWithPhase] = listOfbuildPlanECOIndex;

          this.setState({
            listOfbuildPlanECO: listOfbuildPlanECO
          });
        }
      }
    } else {
      showErrorToast(validationMessages.buildPlanECO.variantError);
      return false;
    }
  }

  addVariantBuildDataRow(revisionIndex, phaseIndex) {
    let listOfbuildPlanECOList = this.state.listOfbuildPlanECO;
    let getVariantData = listOfbuildPlanECOList[revisionIndex].listOfBuildPhase[phaseIndex].listOfVariantBuildPlan;
    let lengthArr = getVariantData.length - 1;
    if (
      getVariantData[lengthArr]['bomOrVariant'] === undefined ||
      getVariantData[lengthArr]['bomOrVariant'] === ''
      // getVariantData[lengthArr]['refrenceVariant'] === undefined ||
      // getVariantData[lengthArr]['refrenceVariant'] === '' ||
      // getVariantData[lengthArr]['eco'] === undefined ||
      // getVariantData[lengthArr]['eco'] === '' ||
      // getVariantData[lengthArr]['noOfUnitsInTheBuild'] === undefined ||
      // getVariantData[lengthArr]['noOfUnitsInTheBuild'] === '' ||
      // getVariantData[lengthArr]['variantDescription'] === undefined ||
      // getVariantData[lengthArr]['variantDescription'] === '' ||
      // getVariantData[lengthArr]['materialAvailabilityTartgetDate'] === '' ||
      // getVariantData[lengthArr]['buildFinishTargetDate'] === '' ||
      // getVariantData[lengthArr]['productShipTargetDate'] === ''
    ) {
      this.setState({ isRevisionDisable: true });
      showErrorToast(validationMessages.buildPlanECO.variantError);
      return false;
    }


    let listOfVariantBuildPlan = {
      bomOrVariant: '',
      refrenceVariant: '',
      variantDescription: '',
      eco: '',
      buildLocations: [
        {
          buildLocation: {},
          noOfUnitsInTheBuild: '',
          bufferParts: '',
          buildInCharge: '',
          materialAvailabilityTartgetDate: '',
          buildFinishTargetDate: '',
          productShipTargetDate: ''
        }
      ],
    }
    if (this.state.listOfbuildPlanECO) {
      let listOfbuildPlanECO = this.state.listOfbuildPlanECO;
      listOfbuildPlanECO[revisionIndex].listOfBuildPhase[phaseIndex].listOfVariantBuildPlan.push(listOfVariantBuildPlan);
      this.setState({
        listOfbuildPlanECO: listOfbuildPlanECO
      });
    }
  }

  handleRemoveVariant(revisionIndex, phaseIndex) {
    let listOfbuildPlanECO = this.state.listOfbuildPlanECO;
    let variantArr = listOfbuildPlanECO[revisionIndex].listOfBuildPhase[phaseIndex].listOfVariantBuildPlan;
    let lengthArr = variantArr.length - 1;
    if (variantArr[lengthArr]['id'] === undefined || variantArr[lengthArr]['id'] === '') {
      variantArr.pop()
      listOfbuildPlanECO[revisionIndex].listOfBuildPhase[phaseIndex].listOfVariantBuildPlan = variantArr;
      this.setState({
        listOfbuildPlanECO: listOfbuildPlanECO
      });
    } else {
      showErrorToast(validationMessages.buildPlanECO.moreVariantError);
    }
  }


  addBuildLocations(revisionIndex, phaseIndex, variantIndex) {
    let listOfbuildPlanECOList = this.state.listOfbuildPlanECO;
    let getVariantData = listOfbuildPlanECOList[revisionIndex].listOfBuildPhase[phaseIndex].listOfVariantBuildPlan;
    let getBuildLocation = getVariantData[variantIndex].buildLocations;
    let lengthArr = getBuildLocation.length - 1;
    let locationAddress = getBuildLocation[lengthArr].buildLocation.address;
    if (locationAddress === undefined || locationAddress === '') {
      this.setState({ isRevisionDisable: true });
      showErrorToast(validationMessages.buildPlanECO.locationError);
      return false;
    }

    let buildLocations = {
      buildLocation: {},
      noOfUnitsInTheBuild: '',
      bufferParts: '',
      buildInCharge: '',
      materialAvailabilityTartgetDate: '',
      buildFinishTargetDate: '',
      productShipTargetDate: ''
    }

    if (this.state.listOfbuildPlanECO) {
      let listOfbuildPlanECO = this.state.listOfbuildPlanECO;
      listOfbuildPlanECO[revisionIndex].listOfBuildPhase[phaseIndex].listOfVariantBuildPlan[variantIndex].buildLocations.push(buildLocations);
      this.setState({
        listOfbuildPlanECO: listOfbuildPlanECO
      });
    }
  }

  removeBuildLocations(revisionIndex, phaseIndex, variantIndex) {
    let listOfbuildPlanECO = this.state.listOfbuildPlanECO;
    let getVariantData = listOfbuildPlanECO[revisionIndex].listOfBuildPhase[phaseIndex].listOfVariantBuildPlan;
    let getBuildLocation = getVariantData[variantIndex].buildLocations;
    let lengthArr = getBuildLocation.length - 1;
    let locationExist = getBuildLocation[lengthArr].buildLocation.exist;
    if (locationExist === undefined || locationExist === '') {
      getBuildLocation.pop()
      listOfbuildPlanECO[revisionIndex].listOfBuildPhase[phaseIndex].listOfVariantBuildPlan[variantIndex].buildLocations = getBuildLocation;
      this.setState({
        listOfbuildPlanECO: listOfbuildPlanECO
      });
    } else {
      showErrorToast(validationMessages.buildPlanECO.moreLocationError);
    }
  }

  handleRemovePhase() {
    let isRemovephase = false;
    let listOfbuildPlanECO = this.state.listOfbuildPlanECO;
    listOfbuildPlanECO && listOfbuildPlanECO.map(function (revisionData, revisionIdx) {
      revisionData.listOfBuildPhase.map(function (bPhase, phaseIdx) {
        let lengthArr = bPhase.listOfVariantBuildPlan.length - 1;
        if (bPhase.listOfVariantBuildPlan[lengthArr]['id'] === undefined ||
          bPhase.listOfVariantBuildPlan[lengthArr]['id'] === '') {
          listOfbuildPlanECO[revisionIdx].listOfBuildPhase.pop();
        } else {
          isRemovephase = true;
        }
      })
    })
    if (isRemovephase === true) {
      // showErrorToast('Please add more phase detail first');
    }

    this.setState({
      listOfbuildPlanECO: listOfbuildPlanECO
    });
  }


  handleOnChange = (revisionIndex, phaseIndex, variantIndex) => (event) => {
    let listOfbuildPlanECO = this.state.listOfbuildPlanECO;   
    const { name, value } = event.target;
    if (name === 'bomOrVariant') {
      this.setState({ isRefrenceVariant: false });
    }
    listOfbuildPlanECO[revisionIndex].listOfBuildPhase[phaseIndex].listOfVariantBuildPlan[variantIndex][name] = value;  

    //listOfbuildPlanECO[revisionIndex].listOfBuildPhase[phaseIndex].listOfVariantBuildPlan[variantIndex][name] = value
    // listOfbuildPlanECO[revisionIndex].listOfBuildPhase[phaseIndex].
    // listOfVariantBuildPlan[variantIndex][type === 'date' ? key : name] = (type === 'date') ? getDate : value;

    this.setState({
      listOfbuildPlanECO: listOfbuildPlanECO
    });
  }

  handleOnChangeLocation = (revisionIndex, phaseIndex, variantIndex, locIdx, key, type) => (event) =>{
    let listOfbuildPlanECO = this.state.listOfbuildPlanECO; 

    let getDate = (new Date(event)).getTime();
    if (getDate === undefined || getDate === '') {
      getDate = new Date().getTime();
    }

    if (type == 'date') {
      listOfbuildPlanECO[revisionIndex].listOfBuildPhase[phaseIndex].
        listOfVariantBuildPlan[variantIndex].buildLocations[locIdx][key] = getDate;
    }else{
      const { name, value } = event.target; 
      if(name=='buildLocation'){ 

        let buildPlanLocationList = _.filter(this.state.buildPlanLocationList, function(data) {
          return data.locationId === value;
        });       
          
        listOfbuildPlanECO[revisionIndex].listOfBuildPhase[phaseIndex].listOfVariantBuildPlan[variantIndex].buildLocations[locIdx][name] = buildPlanLocationList[0];

        this.setState({
          listOfbuildPlanECO: listOfbuildPlanECO     
        });

      }else{
        listOfbuildPlanECO[revisionIndex].listOfBuildPhase[phaseIndex].listOfVariantBuildPlan[variantIndex].buildLocations[locIdx][name] = value;
      }
    }

    this.setState({
      listOfbuildPlanECO: listOfbuildPlanECO
    });
  
  }

  handleOnChangeProjectName(e) {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
    this.getbomDropDownData(value);
  }

  afterChangeHandler(currentSlide) {
    this.setState({ buildPhaseCounter: 1 })
    let increaseCurrentSlide = currentSlide + 1;
    this.setState({ currentSlide: increaseCurrentSlide, getSlide: 2 })
  }

  addRevision() {
    let isRevisionTrue = true;
    this.state.listOfbuildPlanECO && this.state.listOfbuildPlanECO.map(function (revisionData, revisionIdx) {
      revisionData.listOfBuildPhase.map(function (bPhase, variantIdx) {
        let lengthArr = bPhase.listOfVariantBuildPlan.length - 1;
        if (bPhase.listOfVariantBuildPlan[lengthArr]['bomOrVariant'] === undefined ||
          bPhase.listOfVariantBuildPlan[lengthArr]['bomOrVariant'] === '') {
          isRevisionTrue = false;
        }
      })
    })

    if (isRevisionTrue === true) {
      let revisionArray = this.state.revisionArray;
      let revisionArrayLen = revisionArray.length;
      if (revisionArray.length > 0) {
        let revisionIncrease = revisionArrayLen + 1;
        revisionArray.push('Revision ' + revisionIncrease)
        this.setState({ revisionArray: revisionArray, countRevision: revisionIncrease });

        let listOfBuildPlanRevision = {
          revisionNumber: revisionIncrease,
          listOfBuildPhase: [
            {
              buildPhase: 'buildphase1',
              listOfVariantBuildPlan: [
                {
                  bomOrVariant: '',
                  refrenceVariant: '',
                  variantDescription: '',
                  eco: '',
                  buildLocations: [
                    {
                      buildLocation: {},
                      noOfUnitsInTheBuild: '',
                      bufferParts: '',
                      buildInCharge: '',
                      materialAvailabilityTartgetDate: '',
                      buildFinishTargetDate: '',
                      productShipTargetDate: ''
                    }
                  ],
                }
              ]
            }
          ]
        }

        let length = this.state.listOfBuildPlanRevision
          ? this.state.listOfBuildPlanRevision.length
          : 0;

        if (length == 1) {
          if (this.state.listOfbuildPlanECO)
            this.setState({
              listOfbuildPlanECO: [
                ...this.state.listOfbuildPlanECO,
                listOfBuildPlanRevision
              ]
            });
        }
        showSuccessToast(validationMessages.buildPlanECO.revisionAddSuccess);
      }
    } else {
      showErrorToast(validationMessages.buildPlanECO.variantError);
      return false;
    }
  }
  
  removeProject(){
    let listOfbuildPlanECO = this.state.listOfBuildPlanResponse;
    let projectArray = this.state.projectArray;
    projectArray.pop();
    listOfbuildPlanECO.pop();
    this.getBuildPlanData(0);
  }

  addProject() {
    let projectArray = this.state.projectArray;
    let projectLength = projectArray.length;
    if (projectLength > 0) {
      let projectIncrease = projectLength + 1;
      projectArray.push({ pcount: "New Project" })  

      this.setState({ projectArray: projectArray });
      let NewProject = {
        listOfBuildPlanRevision: [
          {
            revisionNumber: 1,
            listOfBuildPhase: [
              {
                buildPhase: 'buildphase1',
                listOfVariantBuildPlan: [
                  {
                    bomOrVariant: '',
                    refrenceVariant: '',
                    variantDescription: '',
                    eco: '',
                    buildLocations: [
                      {
                        buildLocation: {},
                        noOfUnitsInTheBuild: '',
                        bufferParts: '',
                        buildInCharge: '',
                        materialAvailabilityTartgetDate: '',
                        buildFinishTargetDate: '',
                        productShipTargetDate: ''
                      }
                    ],
                  }
                ]
              }
            ]
          }
        ]
      }

      let length = this.state.listOfBuildPlanRevision
        ? this.state.listOfBuildPlanRevision.length
        : 0;
      let listOfBuildPlanResponse = this.state.listOfbuildPlanECO;

      if (length == 1) {
        let listOfBuildPlanResponse = this.state.listOfBuildPlanResponse;
        listOfBuildPlanResponse.push(NewProject);

        this.setState({
          listOfBuildPlanResponse: listOfBuildPlanResponse
        });
      }
      showSuccessToast(validationMessages.buildPlanECO.projectAddSuccess);
    }
  }

  getProjectKey(projectKey, projectIndex) {
    let buildPhaseCounterIncrease = '';
    // this.setState({ buildPhaseCounter: 1, currentSlide: 1 });
    this.setState({ buildPhaseCounter: 1 });
    let revisionArrayItems = [];
    let projectArray = this.state.projectArray;
    let projectLength = projectArray.length;
    let listOfBuildPlanResponse = this.state.listOfBuildPlanResponse;
    let listOfBuildPlanResponseIndex = listOfBuildPlanResponse[projectKey];
    let listOfbuildPlanECO = listOfBuildPlanResponseIndex.listOfBuildPlanRevision;

    if (listOfBuildPlanResponseIndex.project && listOfBuildPlanResponseIndex.project.id) {
      this.getbomDropDownData(listOfBuildPlanResponseIndex.project.id)
    } else {
      this.setState({ variantBOMResponse: [] });
    }

    //Add Revision    
    let listOfBuildPlanRevisionLength = listOfBuildPlanResponse && listOfbuildPlanECO ? listOfbuildPlanECO.length : 1;
    for (var i = 1; i <= listOfBuildPlanRevisionLength; i++) {
      revisionArrayItems.push('Revision' + i);
    }
    this.setState({
      projectIndex: projectIndex,
      projectKey: projectKey,
      listOfbuildPlanECO: listOfbuildPlanECO,
      listOfBuildPlanResponseIndex: listOfBuildPlanResponseIndex,
      revisionArray: revisionArrayItems,
      revisionArrayItemsLen: revisionArrayItems.length,
    })
  }

  createBuildPlanData() {
    let _this = this;
    let isCreateBuildPlanFlag = true;
    let finalData = this.state.listOfbuildPlanECO;
    let projectName = this.state.projectName;
    finalData && finalData.map(function (revisionData, revisionIdx) {
      revisionData.listOfBuildPhase.map(function (bPhase, variantIdx) {
        let lengthArr = bPhase.listOfVariantBuildPlan.length - 1;
        if (bPhase.listOfVariantBuildPlan[lengthArr]['bomOrVariant'] === undefined ||
          bPhase.listOfVariantBuildPlan[lengthArr]['bomOrVariant'] === '') {
          isCreateBuildPlanFlag = false;
        }
      })
    })

    if (projectName === '' || projectName === undefined || projectName === null) {
      isCreateBuildPlanFlag = false;
      showErrorToast(validationMessages.buildPlanECO.projctError);
      return false;
    }

    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      project: projectName,
      listOfBuildPlanRevision: finalData
    };

    if (isCreateBuildPlanFlag) {
      this.props
        .actionCreateBuildPlanData(data)
        .then((result, error) => {
          let listOfBuildPlandata = result.payload.data.resourceData;
          this.setState({
            listOfBuildPlandata: listOfBuildPlandata
          });
          this.getBuildPlanData(this.state.projectKey);

          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      showErrorToast(validationMessages.buildPlanECO.variantError);
      return false;
    }
  }

  updateBuildPlanData() {
    /* For Validation **/
    let listOfbuildPlanECO = this.state.listOfbuildPlanECO;
    let isRevisionTrue = true;
    listOfbuildPlanECO && listOfbuildPlanECO.map(function (revisionData, revisionIdx) {
      revisionData.listOfBuildPhase.map(function (bPhase, variantIdx) {
        let lengthArr = bPhase.listOfVariantBuildPlan.length - 1;
        if (bPhase.listOfVariantBuildPlan[lengthArr]['bomOrVariant'] === undefined ||
          bPhase.listOfVariantBuildPlan[lengthArr]['bomOrVariant'] === '') {
          isRevisionTrue = false;
        }
      })
    })

    if (isRevisionTrue) {
      let _this = this;
      let finalData = this.state.listOfbuildPlanECO;
      let listOfBuildPlanResponseIndex = this.state.listOfBuildPlanResponseIndex;
      let data = {
        roleId: this.props.userInfo.userData.userRole,
        userId: this.props.userInfo.userData.id,
        id: listOfBuildPlanResponseIndex.id,
        listOfBuildPlanRevision: finalData,
        project: listOfBuildPlanResponseIndex.project.id
      };

      this.props
        .actionUpdateBuildPlanData(data)
        .then((result, error) => {
          _this.props.actionLoaderHide();
          this.getBuildPlanData(this.state.projectKey);
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      showErrorToast(validationMessages.buildPlanECO.variantError);
      return false;
    }

  }

  // handleShowApprovalModal(event, index, data) {
  //   let revisionNoWithIndex = this.state.listOfbuildPlanECO[index];
  //   if (revisionNoWithIndex && revisionNoWithIndex.id && revisionNoWithIndex.id !== undefined) {
  //     this.setState({ revisionNoWithIndex: revisionNoWithIndex });
  //     let listOfApproversIds = [];
  //     listOfApproversIds = data && data.map(function (obj, index) {
  //       return obj.approver.id;
  //     });

  //     const userId = this.props.userInfo.userData.id;
  //     const roleId = this.props.userInfo.userData.userRole;
  //     this.props.actionGetApproverData({ userId, roleId })
  //       .then((result, error) => {
  //         if (result.payload.data.resourceData.length > 0) {
  //           let getApproverData = result.payload.data.resourceData;

  //           this.setState({
  //             show: true,
  //             approverList: getApproverData,
  //             listOfApproversIds: listOfApproversIds
  //           });
  //         }
  //         this.props.actionLoaderHide();
  //       })
  //       .catch(e => this.props.actionLoaderHide());
  //   } else {
  //     showErrorToast(validationMessages.buildPlanECO.revisionError);
  //     return false;
  //   }
  // }

  handleOnChangeKeyword(e) {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  }

  onChangeFilterAutoList(e, data) { 
    console.log("data", data);
    this.setState({
      searchFilterKey: data.fullName,
      approverId: data.id,
      filterDDAutoList: false,        
    });
  
  }

  getSuggessionFilterUserList(){
    let _this = this;     
    if (this.state.searchFilterKey.length > 2) {
      this.props.actionLoaderShow();
     let data = {
        userId: this.props.userInfo.userData.id,
        roleId: this.props.userInfo.userData.userRole,
        keyword: this.state.searchFilterKey
      }
    
      this.props
        .actuionGetSuggessionFilterUserList({userId: this.props.userInfo.userData.id,roleId: this.props.userInfo.userData.userRole,keyword: this.state.searchFilterKey})
        .then((result, error) => {
          if (result.payload.data.status === 200) {        
            let filterDataList = result.payload.data.resourceData;
            console.log("filterDataList", filterDataList);
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


  // onChangeAutoList(e, data) {   
  //   this.setState({
  //     searchKeword: data.partNumber,
  //     searchAutoList: false,
  //     dataOfSearchPart: data
  //   });
  // }

  searchApproverUser(event, index, data){
    let revisionNum;
    let revisionNoWithIndex = this.state.listOfbuildPlanECO[index];
    if (revisionNoWithIndex && revisionNoWithIndex.id !== undefined  && revisionNoWithIndex.id) {
         revisionNum = revisionNoWithIndex;
    } 
    this.setState({
      addUserSearch: false,
      revisionNoWithIndex: revisionNum
    })
  }

  // handleHideApprovalModal() {
  //   this.setState({
  //     show: false
  //   });
  // }

  addApproverConfirmation() {
    this.setState({
      showApproveModal: true 
    });
  }

  handleCloseModel() {
    this.setState({
      addUserSearch: true,
      showApproveModal: false
    });
  }

  handleApproverUser(event) {
    let _this = this;
    let revisionNo = this.state.revisionNoWithIndex;
    let approverIds = [this.state.approverId];
    let data = {
      roleId: this.props.userInfo.userData.userRole,
      userId: this.props.userInfo.userData.id,
      buildPlanRevisionId: revisionNo.id,
      approverIds: approverIds
    };

    this.props
      .actionAddApproverUser(data)
      .then((result, error) => {
        this.setState({ showApproveModal: false, addUserSearch: true, })
        this.getBuildPlanData(this.state.projectKey);
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handleCopyApprover(event) {
    let _this = this;
    const { name } = event.target;
    const { value } = event.target;
    this.setState({ [name]: value });

    let listOfApproversIds = [];
    let checked = event.target.checked;
    if (checked) {
      let listOfbuildPlanECO = this.state.listOfbuildPlanECO;
      let secondLastLen = listOfbuildPlanECO.length - 2;
      let lastLen = listOfbuildPlanECO.length - 1;
      this.setState({ revisionLength: lastLen, isCopySelected: true })

      if (listOfbuildPlanECO.length > 1) {
        listOfbuildPlanECO[secondLastLen].listOfApprovers && listOfbuildPlanECO[secondLastLen].listOfApprovers.map(function (item, idx) {
          listOfApproversIds.push(item.approver.id)
        })

        let approverIds = listOfApproversIds;
        if (approverIds.length >= 1) {
          let revisionId = listOfbuildPlanECO[lastLen].id;
          let data = {
            roleId: this.props.userInfo.userData.userRole,
            userId: this.props.userInfo.userData.id,
            buildPlanRevisionId: revisionId,
            approverIds: approverIds
          };

          this.props
            .actionAddApproverUser(data)
            .then((result, error) => {
              this.setState({ showApproveModal: false, show: false, isCopySelected: false })
              this.getBuildPlanData(this.state.projectKey);
              _this.props.actionLoaderHide();
            })
            .catch(e => _this.props.actionLoaderHide());
        } else {
          this.setState({ isCopySelected: false });
          showErrorToast(validationMessages.buildPlanECO.approverError);
          return false;
        }
      } else {
        this.setState({ isCopySelected: false });
        showErrorToast(validationMessages.buildPlanECO.revisionError);
        return false;
      }

    }
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  revisionApprove(keyword, commentRevisionId) {
    let _this = this; let status = '';
    if (_this.state.comment) {
      let data = {
        userId: this.props.userInfo.userData.id,
        roleId: this.props.userInfo.userData.userRole,
        approvalStatus: keyword,
        buildPlanRevision: commentRevisionId,
        comment: _this.state.comment
      }

      this.props
        .actionAddCommentRevision(data)
        .then((result, error) => {
          this.setState({ comment: '' });
          this.getBuildPlanData(this.state.projectKey);
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    } else {
      showErrorToast(validationMessages.buildPlanECO.commentError);
      return false;
    }
  }

  render() {
    let self = this;
    let revisionNo = this.state.currentSlide;
    let projectIndex = this.state.projectIndex;
    let listOfbuildPlanECO = this.state.listOfbuildPlanECO;
    let buildPhaseLength = listOfbuildPlanECO && listOfbuildPlanECO[revisionNo - 1] && listOfbuildPlanECO[revisionNo - 1].listOfBuildPhase && listOfbuildPlanECO[revisionNo - 1].listOfBuildPhase.length;
    let isCopyDisabled = listOfbuildPlanECO && listOfbuildPlanECO.length > 1 ? false : true;
    let buildPlanResponse = this.state.listOfBuildPlanResponse;
    let projectLength = this.state.projectLength;
    let addProjectDisable = ((!buildPlanResponse.length > 0) || (buildPlanResponse.length === projectLength + 1));

    let revisionArray = this.state.revisionArray;
    let revisionArrayItemsLen = this.state.revisionArrayItemsLen;

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <div>
        <Header {...this.props} />
        <SideBar
          activeTabKey={this.state.tabKey === "tenth" ? "tenth" : "none"}
          activeTabKeyAction={this.activeTabKeyAction}
        />
        {this.state.tabKey === "tenth" ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <div className="m-t-20 flex justify-space-between align-center">
                  <h4 className="hero-title">Create Build Plan</h4>
                  <div className="btn-col">
                    {addProjectDisable== true && projectLength !== undefined ? 
                      <button
                        className="btn btn-primary text-uppercase"                     
                        onClick={() => {
                          this.removeProject();
                        }}
                      >Remove New Project
                      </button> : 
                      <button
                      className="btn btn-primary text-uppercase"
                      disabled={projectLength == undefined}
                      onClick={() => {
                        this.addProject();
                      }}
                      >Add Project
                      </button> 
                    }
                  </div>
                </div>

                <div className="style2-tab bg-tab m-b-20">
                  <Tab.Container
                    id="tabs-with-dropdown"
                    defaultActiveKey={projectIndex}
                  >
                    <Row className="clearfix">
                      <Col sm={12}>
                        <Nav bsStyle="tabs">
                          {this.state.projectArray && this.state.projectArray.map((data, index) => {
                            return (
                              <NavItem key={index} className="text-capitalize"
                                disabled={buildPlanResponse.length < 1}
                                eventKey={'project' + index} onClick={() => {
                                  this.getProjectKey(index, 'project' + index);
                                }} >{data && data.pname ? data.pname : data.pcount}</NavItem>
                            )
                          })}
                        </Nav>
                      </Col>
                      <Col sm={12}>
                        <Tab.Content animation>
                          <Tab.Pane eventKey={projectIndex}>
                            <div className="container-fluid">
                              <div className="flex justify-space-between align-center">
                                {this.state.listOfbuildPlanECO &&
                                  this.state.listOfbuildPlanECO.map((data, revisionIndex) => {
                                    if (data.revisionNumber === revisionNo) {          
                                      return (
                                        <div className="m-t-20">
                                          <p>Status: <span className="text-success text-capitalize">{data.revisionBuildPlanStatus ? data.revisionBuildPlanStatus.replace(/_/g, " ") : 'NA'}</span></p>             
                                        </div>
                                      )
                                    }
                                  })
                                }                            
                                <div>
                                  {this.state.listOfbuildPlanECO && this.state.listOfBuildPlanResponseIndex &&
                                    this.state.listOfBuildPlanResponseIndex.project ?
                                    (<h4 className="text-center">Project {this.state.listOfBuildPlanResponseIndex.project.projectCode} Build Plan</h4>) :
                                    (<h4 className="text-center flex align-center justify-center">
                                      Project
                                      <div className="projselect">
                                        <FormGroup controlId="formControlsSelect">
                                          <FormControl
                                            componentClass="select"
                                            placeholder="select"
                                            className="s-arrow br-0"
                                            autoComplete="off"
                                            value={this.state.projectName}
                                            name="projectName"
                                            onChange={event => {
                                              this.handleOnChangeProjectName(event);
                                            }}
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
                                        </FormGroup>
                                      </div>

                                      Build Plan
                                    </h4>)
                                  }                                 

                                  <div className="w100 sliderDash m-auto">
                                    <Slider {...settings}
                                      afterChange={(currentSlide) => {
                                        this.afterChangeHandler(currentSlide);
                                      }}
                                    >
                                      {this.state.revisionArray && this.state.revisionArray.map((data, index) => {
                                        return (
                                          <div key={index}>
                                            <h3 className="text-center">
                                              {data}
                                            </h3>
                                            {/* {this.state. === 1 ? (
                                              <h3 className="text-center">
                                                {this.state.revisionArray[0]}
                                              </h3>
                                            ) : (
                                                <h3 className="text-center">
                                                  {data}
                                                </h3>
                                              )
                                            } */}
                                          </div>
                                        )
                                      }
                                      )}
                                    </Slider>
                                  </div>
                                </div>
                                <div>

                                  {this.state.listOfbuildPlanECO &&
                                    this.state.listOfbuildPlanECO.map((data, revisionIndex) => {
                                      if (data.revisionNumber === revisionNo) { 
                                        return (                                          
                                          <p>
                                            {data.revisionBuildPlanStatus=='approved' ? 
                                              <button className="btn btn-primary text-uppercase sm-btn"
                                                onClick={() => {
                                                  this.addRevision();
                                                }}
                                              >Add Revision
                                              </button> : 
                                                <button className="btn btn-primary text-uppercase sm-btn"
                                                  disabled={true}                      
                                                >Add Revision
                                                </button>
                                            }
                                          </p> 
                                        )
                                      }
                                    })
                                  }                                
                                </div>
                              </div>
                              <Row>
                                <div className="b-p-warpper bluidplanSec">
                                  <div className="flex-table">
                                    <div className="flex-head">
                                      <div className="flex-row">
                                        <div className="th-item text-uppercase">
                                          Build Phase
                                        </div>
                                        <div className="th-item text-uppercase">
                                          variant/Bom
                                        </div>
                                        <div className="th-item text-uppercase">
                                          variant description
                                        </div>
                                        <div className="th-item text-uppercase">
                                          Refrence variant
                                        </div>
                                        <div className="th-item text-uppercase">
                                          ECO
                                        </div>
                                        <div className="th-item text-uppercase">
                                          Build Location
                                        </div>
                                        {/* <div className="th-item text-uppercase">
                                          no. of units in the build
                                        </div> */}
                                        <div className="th-item text-uppercase">
                                          Build Incharge
                                        </div>
                                        <div className="th-item text-uppercase">
                                          Material availability target
                                        </div>
                                        <div className="th-item text-uppercase">
                                          build finish target
                                        </div>
                                        <div className="th-item text-uppercase">
                                          product ship target
                                        </div>
                                        <div className="th-item text-uppercase">
                                          no. of units in the build
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex-body">
                                      {this.state.listOfbuildPlanECO &&
                                        this.state.listOfbuildPlanECO.map((data, revisionIndex) => {
                                          if (data.revisionNumber === revisionNo) {
                                            return (
                                              data.listOfBuildPhase &&
                                              data.listOfBuildPhase.map((elem, phaseIndex) => {
                                                return (
                                                  <div className="flexbd" key={phaseIndex}>
                                                    {
                                                      elem.listOfVariantBuildPlan && elem.listOfVariantBuildPlan.map((item, variantIndex) => {
                                                        let parentToChildRelation = variantIndex == 0 ? 1 : 0;
                                                        return (
                                                          <div className="flex-row buildhalfborder" key={variantIndex}>
                                                            {
                                                              variantIndex == 0 ?
                                                                <div className="td-item ptitem text-capitalize">{elem.buildPhase}</div> :
                                                                <div className="td-item"></div>
                                                            }
                                                            <div className="td-item">
                                                              <span className={parentToChildRelation ? "l-root1" : ""}>
                                                                <FormGroup controlId="formControlsSelect">
                                                                  <FormControl
                                                                    componentClass="select"
                                                                    placeholder="select"
                                                                    className="s-arrow br-0"
                                                                    autoComplete="off"
                                                                    value={item.bomOrVariant ? item.bomOrVariant : ''}
                                                                    name="bomOrVariant"
                                                                    onChange={this.handleOnChange(revisionIndex, phaseIndex, variantIndex)}
                                                                  >
                                                                    <option value="select">select</option>
                                                                    {this.state.variantBOMResponse &&
                                                                      this.state.variantBOMResponse.map((vData, index) => {
                                                                        if (item.refrenceVariant !== vData.id || item.refrenceVariant === '') {
                                                                          return (
                                                                            <option
                                                                              value={vData.id}
                                                                              key={index}
                                                                            >
                                                                              {vData.bomDescription} {vData.part && vData.part.partNumber ? "|"+ vData.part.partNumber : ''}
                                                                            </option>
                                                                          );
                                                                        }
                                                                      })}
                                                                  </FormControl>
                                                                </FormGroup>

                                                              </span>
                                                            </div>
                                                            <div className="td-item">
                                                              <FormControl
                                                                type="text"
                                                                className="br-0"
                                                                autoComplete="off"
                                                                name="variantDescription"
                                                                placeholder="Variant Description"
                                                                value={item.variantDescription}
                                                                onChange={this.handleOnChange(revisionIndex, phaseIndex, variantIndex)}
                                                              />
                                                            </div>
                                                            <div className="td-item">
                                                              <FormGroup controlId="formControlsSelect">
                                                                <FormControl
                                                                  componentClass="select"
                                                                  placeholder="select"
                                                                  autoComplete="off"
                                                                  className="s-arrow br-0"
                                                                  disabled={this.state.isRefrenceVariant}
                                                                  value={item.refrenceVariant ? item.refrenceVariant : ''}
                                                                  name="refrenceVariant"
                                                                  onChange={this.handleOnChange(revisionIndex, phaseIndex, variantIndex)}
                                                                >
                                                                  <option value="select">select</option>
                                                                  {this.state.variantBOMResponse &&
                                                                    this.state.variantBOMResponse.map((rData, index) => {
                                                                      if (item.bomOrVariant !== rData.id) {
                                                                        return (
                                                                          <option
                                                                            value={rData.id}
                                                                            key={index}
                                                                          >
                                                                            {rData.bomDescription} {rData.part && rData.part.partNumber ? "|"+ rData.part.partNumber : ''}
                                                                          </option>
                                                                        );
                                                                      }
                                                                    })}

                                                                </FormControl>
                                                              </FormGroup>
                                                            </div>
                                                            <div className="td-item">
                                                              <FormGroup controlId="formControlsSelect">
                                                                <FormControl
                                                                  componentClass="select"
                                                                  autoComplete="off"
                                                                  placeholder="select"
                                                                  className="s-arrow br-0"
                                                                  value={item.eco ? item.eco : ''}
                                                                  name="eco"
                                                                  onChange={this.handleOnChange(revisionIndex, phaseIndex, variantIndex)}
                                                                >
                                                                  <option value="select">select</option>
                                                                  {this.state.ECOResponse &&
                                                                    this.state.ECOResponse.map((item, index) => {
                                                                      return (
                                                                        <option
                                                                          value={item.id}
                                                                          key={index}
                                                                        >
                                                                          {item.ecoCategory} | {item.ecoNumber}
                                                                        </option>
                                                                      );
                                                                    })}

                                                                </FormControl>
                                                              </FormGroup>
                                                            </div>
                                                            <div>
                                                              {item && item.buildLocations && item.buildLocations.map((bData, locIndex) => {
                                                                return (
                                                                  <div key={locIndex} class="flex-row inflexwrap">
                                                                    <div className="intd-item">
                                                                      <FormGroup controlId="formControlsSelect">
                                                                        <FormControl
                                                                          componentClass="select"
                                                                          placeholder="select"
                                                                          autoComplete="off"
                                                                          className="s-arrow br-0"
                                                                          value={bData.buildLocation && bData.buildLocation.locationId ? bData.buildLocation.locationId: ''}
                                                                          name="buildLocation"
                                                                          onChange={this.handleOnChangeLocation(revisionIndex, phaseIndex, variantIndex, locIndex)}
                                                                        >
                                                                          <option value="select">select</option>
                                                                          {this.state.buildPlanLocationList &&
                                                                            this.state.buildPlanLocationList.map((lData, index) => {
                                                                              return (
                                                                                <option
                                                                                  value={lData.id}
                                                                                  key={index}
                                                                                >
                                                                                 {lData.locationId}
                                                                                </option>
                                                                              );
                                                                            })}

                                                                        </FormControl>
                                                                      </FormGroup>
                                                                    </div>
                                                                    {/* <div className="intd-item posnone">
                                                                      <FormControl
                                                                        type="number"
                                                                        className="br-0"
                                                                        inputMode="numeric"
                                                                        pattern="[0-9]"
                                                                        min={0}
                                                                        name="noOfUnitsInTheBuild"
                                                                        placeholder="No Of Units InTheBuild"
                                                                        value={bData.noOfUnitsInTheBuild}
                                                                        onChange={this.handleOnChangeLocation(revisionIndex, phaseIndex, variantIndex, locIndex)}
                                                                      />
                                                                    </div> */}
                                                                    <div className="intd-item posnone">
                                                                      <FormGroup controlId="formControlsSelect">
                                                                        <FormControl
                                                                          componentClass="select"
                                                                          placeholder="select"
                                                                          autoComplete="off"
                                                                          className="s-arrow br-0"
                                                                          value={bData.buildInCharge ? bData.buildInCharge: ''}
                                                                          name="buildInCharge"
                                                                          onChange={this.handleOnChangeLocation(revisionIndex, phaseIndex, variantIndex, locIndex)}
                                                                        >
                                                                          <option value="select">select</option>
                                                                          {this.state.buildInchargeList &&
                                                                            this.state.buildInchargeList.map((biData, index) => {
                                                                              return (
                                                                                <option
                                                                                  value={biData.id}
                                                                                  key={index}
                                                                                >
                                                                                  {biData.fullName} | {biData.userProfile}
                                                                                </option>
                                                                              );
                                                                            })}

                                                                        </FormControl>
                                                                      </FormGroup>
                                                                    </div>
                                                                    <div className="intd-item posnone">
                                                                      <DatePicker
                                                                        className="w100"
                                                                        selected={bData.materialAvailabilityTartgetDate}
                                                                        name="materialAvailabilityTartgetDate"
                                                                        autoComplete="nope"
                                                                        value={bData.materialAvailabilityTartgetDate}
                                                                        onChange={this.handleOnChangeLocation(revisionIndex, phaseIndex, variantIndex, locIndex, 'materialAvailabilityTartgetDate', 'date')}
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
                                                                    </div>
                                                                    <div className="intd-item posnone">
                                                                      <DatePicker
                                                                        className="w100"
                                                                        selected={bData.buildFinishTargetDate}
                                                                        name="buildFinishTargetDate"
                                                                        autoComplete="nope"
                                                                        value={bData.buildFinishTargetDate}
                                                                        onChange={this.handleOnChangeLocation(revisionIndex, phaseIndex, variantIndex, locIndex, 'buildFinishTargetDate', 'date')}
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
                                                                    </div>
                                                                    <div className="intd-item posnone">
                                                                      <DatePicker 
                                                                        className="w100"
                                                                        selected={bData.productShipTargetDate}
                                                                        name="productShipTargetDate"
                                                                        autoComplete="nope"
                                                                        value={bData.productShipTargetDate}
                                                                        onChange={this.handleOnChangeLocation(revisionIndex, phaseIndex, variantIndex, locIndex, 'productShipTargetDate', 'date')}
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
                                                                    </div>
                                                                    <div className="intd-item posnone">
                                                                      <FormControl
                                                                        type="number"
                                                                        className="br-0"
                                                                        inputMode="numeric"
                                                                        pattern="[0-9]"
                                                                        min={0}
                                                                        name="noOfUnitsInTheBuild"
                                                                        placeholder="No Of Units InTheBuild"
                                                                        value={bData.noOfUnitsInTheBuild}
                                                                        onChange={this.handleOnChangeLocation(revisionIndex, phaseIndex, variantIndex, locIndex)}
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                );
                                                              })}
                                                         
                                                                <div className="addmoreloctaion">
                                                                  <span className="w200">
                                                                    <span className="cursor-pointer blueclr"
                                                                      onClick={() => {
                                                                        variantIndex
                                                                        this.addBuildLocations(revisionIndex, phaseIndex, variantIndex);
                                                                      }}
                                                                    >
                                                                      <span className="ico-add addblue">
                                                                        <svg>
                                                                          <use xlinkHref={`${Sprite}#plus-OIco`} />
                                                                        </svg>
                                                                      </span>

                                                                    </span>
                                                                    {item.buildLocations.length > 1 ? (
                                                                      <span
                                                                        onClick={e => this.removeBuildLocations(revisionIndex, phaseIndex, variantIndex)}
                                                                        className="cursor-pointer"
                                                                      >
                                                                        <span className="ico-minusgly bg-minus blueclr"></span>
                                                                      </span>
                                                                    ) : (
                                                                      ''
                                                                    )} 
                                                                  </span>
                                                                </div>
                                                              </div>
                                                            </div>                                                      
                                                        )
                                                      })
                                                    }

                                                    <div className="flex-row">
                                                      <div className="td-item"> </div>
                                                      <div className="td-item txtadd">
                                                        <span className="w100">
                                                          <span className="cursor-pointer blueclr"
                                                            onClick={() => {
                                                              this.addVariantBuildDataRow(revisionIndex, phaseIndex);
                                                            }}
                                                          >
                                                            <span className="ico-add addblue">
                                                              <svg>
                                                                <use xlinkHref={`${Sprite}#plus-OIco`} />
                                                              </svg>
                                                            </span>

                                                          </span>
                                                          {elem.listOfVariantBuildPlan.length > 1 ? (
                                                            <span
                                                              onClick={e => this.handleRemoveVariant(revisionIndex, phaseIndex)}
                                                              className="cursor-pointer"
                                                            >
                                                              <span className="ico-minusgly bg-minus blueclr"></span>
                                                            </span>
                                                          ) : (
                                                              ''
                                                            )}                                                          
                                                        </span>
                                                      </div>
                                                      <div className="td-item"> </div>
                                                      <div className="td-item"> </div>
                                                      <div className="td-item"> </div>
                                                      <div className="td-item"> </div>
                                                      <div className="td-item"> </div>
                                                      <div className="td-item"> </div>
                                                      <div className="td-item"> </div>
                                                    </div>
                                                  </div>
                                                );
                                              })
                                            );
                                          }
                                        })
                                      }
                                    </div>
                                  </div>
                                </div>
                              </Row>
                            </div>
                          </Tab.Pane>                     
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </div>
                <div className="m-b-20">
                  <span className="cursor-pointer blueclr"
                    onClick={() => {
                      this.addBuilPhasedDataRow(revisionNo);
                    }}
                  >
                    <span className="ico-add addblue">
                      <svg>
                        <use xlinkHref={`${Sprite}#plus-OIco`} />
                      </svg>
                    </span>
                    &nbsp;Add Phase
                  </span>
                  {buildPhaseLength > 1 ? (
                    <span className="cursor-pointer blueclr"
                      onClick={() => {
                        this.handleRemovePhase();
                      }}
                    >
                      <span className="ico-minusgly bg-minus blueclr"> Remove Phase</span>
                    </span>) : ('')
                  }

                </div>
                <div className="text-center m-b-20">
                  {this.state.listOfbuildPlanECO && this.state.listOfBuildPlanResponseIndex &&
                    this.state.listOfBuildPlanResponseIndex.project ? (
                      <button
                        className="btn btn-success text-uppercase"
                        onClick={this.updateBuildPlanData}
                      >
                        Update Build Data
                    </button>) : (
                      <button
                        className="btn btn-success text-uppercase"
                        onClick={this.createBuildPlanData}
                      >
                        Create Build Data
                    </button>)
                  }
                </div>
                <p className="once-title ">
                  <span>Agreed:</span>{" "}
                  <label className="label--checkbox">
                    <input
                      type="checkbox"
                      className="checkbox"
                      name="copyApprovals"
                      onChange={event =>
                        this.handleCopyApprover(event)
                      }
                      checked={
                        this.state.isCopySelected ? true : false
                      }
                      disabled={isCopyDisabled}
                    />
                    Copy approvers from previous revision
                  </label>
                </p>
                <div className="revision-area">
                  <div className="r-drop-panel">
                    {/* {this.state.revisionArray && this.state.revisionArray.map((data, index) => { */}
                    {this.state.listOfbuildPlanECO && this.state.listOfbuildPlanECO.map((data, revisionIndex) => {
                      let expand = data.revisionNumber == 1 ? true : false;
                      return (
                        <Panel id="collapsible-panel-example-2" defaultExpanded={expand} >
                          <Panel.Heading>
                            <Panel.Title toggle>
                              Revision {data.revisionNumber}  <Glyphicon glyph="chevron-down" />
                              <h5 className="datesm">
                                {data.createdTimestamp
                                  ? moment(
                                    data.createdTimestamp
                                  ).format('DD MMM YYYY')
                                  : ''}
                              </h5>

                            </Panel.Title>
                          </Panel.Heading>
                          <Panel.Collapse>
                            <Panel.Body>
                              <div className="flex">
                                {data && data.listOfApprovers && data.listOfApprovers.map((elem, index) => {
                                  return (
                                    <div className="top-col r-breif contentleft" key={index}>
                                      <h5 className="m-b-0">{elem.approver.fullName}</h5>
                                      <small className="color-light"> {elem.approver.userProfile.replace(/_/g, " ")}</small>
                                      <h5 class="datesm">
                                        {elem.lastModifiedTimestamp
                                          ? moment(
                                            elem.lastModifiedTimestamp
                                          ).format('DD MMM YYYY hh:mm a')
                                          : ''}
                                      </h5>
                                      {elem && elem.comments && elem.comments !== undefined && elem.comments[0] ? (
                                        <p>Comments: <span className="m-l-5">{elem.comments[0].comment}</span></p>
                                      ) : (<p>Comments: <span className="m-l-5">NA</span></p>)
                                      }
                                      {this.props.userInfo.userData.id == elem.approver.id && elem.comments === undefined ? (
                                        <div>
                                          <p>
                                            <FormGroup controlId="formControlsTextarea">
                                              <FormControl className="resizenone"
                                                componentClass="textarea"
                                                placeholder="Comment"
                                                value={this.state.comment}
                                                onChange={this.handleChange}
                                                name="comment"
                                                required
                                              />
                                            </FormGroup>
                                          </p>
                                          <div className="flex iconflex">
                                            <span
                                              className="ico-action-sm fill-green"
                                              onClick={() => {
                                                this.revisionApprove('approved', data.id);
                                              }}>
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#rightCircleIco`}
                                                />
                                              </svg>
                                            </span>
                                            <span
                                              className="ico-action-sm fill-red m-l-5"
                                              onClick={() => {
                                                this.revisionApprove('reject', data.id);
                                              }}
                                            >
                                              <svg>
                                                <use
                                                  xlinkHref={`${Sprite}#rejectIco`}
                                                />
                                              </svg>
                                            </span>
                                          </div>
                                        </div>
                                      ) : ('')
                                      }
                                    </div>
                                  );
                                })
                                }


                                <div className="top-col">
                                  {this.state.addUserSearch ? (
                                    <span className="user-add cursor-pointer"
                                      onClick={e =>
                                        this.searchApproverUser(e, revisionIndex, data.listOfApprovers)
                                        //this.handleShowApprovalModal(e, revisionIndex, data.listOfApprovers)
                                      }
                                    >
                                      <span className="ico-add">
                                        <svg>
                                          <use xlinkHref={`${Sprite}#plus-OIco`} />
                                        </svg>
                                      </span>
                                      &nbsp;Add User
                                    </span>
                                    ) : (
                                    <span className="user-add cursor-pointer">
                                      <FormGroup className="w-200" controlId="formControlsSelect">      
                                    <div className="searchForm">
                                      <div className="formbdr">
                                      <FormControl                                                                                                     
                                            autoComplete="off"
                                            name="searchFilterKey"
                                            placeholder="Search User"
                                            type="text"
                                            class="orange form-control"
                                            value={this.state.searchFilterKey}
                                            onChange={event => {
                                              this.handleOnChangeKeyword(event);
                                            }} 
                                            onKeyUp={this.getSuggessionFilterUserList}
                                          />
                                    
                                      <span className="ico-search">
                                           <button onClick={event =>this.addApproverConfirmation()}> Add </button>
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
                                                    }}>{data.fullName}</span>
                                                </li>
                                              )
                                            })}
                                          </ul>
                                        </div>) : ''
                                      }
                                    </div> 
                                  </FormGroup>
                                    </span>
                                    )
                                  }


                                </div>

                              </div>
                            </Panel.Body>
                          </Panel.Collapse>
                        </Panel>

                      )
                    }
                    )}
                  </div>

                </div>
              </div>
            </div>

            {/* <Modal
              className="custom-popUp modal-xl"
              show={this.state.show}
              onHide={this.handleClose}
              onEntered={this.handleModalShown}
            >
              <Modal.Header>
                <div className="flex justify-space-between align-center">
                  <h4>Approver List</h4>
                  <div className="">
                    <button
                      onClick={this.handleHideApprovalModal}
                      className="btn btn-link text-uppercase color-light sm-btn"
                    >
                      close
                      </button>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <Table bordered responsive className="custom-table">
                  <thead>
                    <tr>
                      <th>#</th><th />
                      <th>First Name</th>
                      <th>last Name</th>
                      <th>Email</th>
                      <th>User Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.approverList && this.state.approverList.map((approver, index) => {
                      let listOfApproversIds = this.state.listOfApproversIds;
                      // if(this.state.approverList && listOfApproversIds && listOfApproversIds.length > 0){
                      const firstName = approver.firstName || '';
                      let isDisabled = false;
                      const lastName = approver.lastName || '';
                      const userProfile = approver.userProfile || '';
                      const email = approver.email || '';
                      const id = approver.id || '';
                      if (this.state.approverList && listOfApproversIds && listOfApproversIds.length > 0) {
                        isDisabled = listOfApproversIds.includes(approver.id);
                      }
                      //let lastIndex = this.state.contactArray;
                      //let lengthArr = lastIndex.length - 1;
                      return (
                        <tr>
                          <td>
                            <label className="label--radio">
                              <input
                                disabled={isDisabled}
                                type="radio"
                                className="radio"
                                name="m-radio"
                                onChange={event =>
                                  this.addApproverConfirmation(id)
                                }
                              />
                            </label>

                          </td>
                          <td>
                            <div className="sm-avtar">
                              <img src={userImage} />
                            </div>
                          </td>
                          <td className="text-capitalize">{firstName} </td>
                          <td className="text-capitalize">{lastName}</td>
                          <td>{email}</td>
                          <td className="text-capitalize">
                            {userProfile.replace(/_/g, ' ')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Modal.Body>
            </Modal> */}

            <Modal
              show={this.state.showApproveModal}
              onHide={this.handleClose}
              className="custom-popUp confirmation-box"
              bsSize="small"
            >

              <Modal.Body>
                <div className="">
                  <h5 className="text-center">
                    Are you sure you want to add this user as approver?
                    </h5>
                  <div className="text-center">
                    <button
                      className="btn btn-default text-uppercase sm-btn"
                      onClick={event =>
                        this.handleApproverUser(event)
                      }
                    >
                      Continue
                      </button>
                    <button
                      className="btn btn-success text-uppercase sm-btn"
                      onClick={this.handleCloseModel}
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
      actionGetDiscloserData,
      actionApproveRejectNonDiscloser,
      actionGetBuildPlanData,
      actionCreateBuildPlanData,
      actionBOMBuildPlanDropDownData,
      actionUpdateBuildPlanData,
      actionGetApproverData,
      actionAddApproverUser,
      actionAddCommentRevision,
      actionGetAllProjectData,
      actuionGetSuggessionFilterUserList
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
)(CreateBuildPlanECO);
