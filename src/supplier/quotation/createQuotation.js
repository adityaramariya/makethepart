import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  Table,
  ControlLabel,
  Form,
  Modal
} from 'react-bootstrap';
import * as Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import * as moment from 'moment';
import ReactToPrint from 'react-to-print';
import socketIOClient from 'socket.io-client';

import Header from '../common/header';
import SideBar from '../common/sideBar';
import {
  actionLoaderHide,
  actionLoaderShow,
  actionSubmitQuotation,
  actionSearchQuotation,
  actionUpdateQuotation
} from '../../common/core/redux/actions';
import {
  topPosition,
  convertToTimeStamp,
  showErrorToast
} from '../../common/commonFunctions';
import Image1 from '../../img/image.png';
import Sprite from '../../img/sprite.svg';
import CONSTANTS from '../../common/core/config/appConfig';
let { customConstant } = CONSTANTS;
let socket;
class Quotation extends Component {
  constructor(props) {
    super(props);
    socket = socketIOClient.connect(
      customConstant.webNotificationURL.node_server_URL
    );
    this.toolTaxObject = {
      taxId: '',
      taxDescription: '',
      taxRate: '',
      taxCost: ''
    };
    this.costTaxObject = {
      taxId: '',
      taxDescription: '',
      taxRate: '',
      taxCost: ''
    };
    this.processTaxObject = {
      taxId: '',
      taxDescription: '',
      taxRate: '',
      taxCost: ''
    };
    this.processLabourObject = {
      labourCost: ''
    };

    this.state = {
      tabKey: 'quotation',
      reviewPartQuotationData:
        (this.props.location.state && this.props.location.state.data) || '',
      disableProtoCostButton: false,
      disableProtoToolButton: false,
      disableProdCostButton: false,
      disableProdToolButton: false,
      showCostTable: false,
      showToolTable: false,
      showProdCostHeading: false,
      showProtoCostHeading: false,
      showProdToolHeading: false,
      showProtoToolHeading: false,
      disableProductionButton: false,
      disableProtoButton: false,
      // listOfTaxDetails: [],
      toolRowObject: {
        description: '',
        sourceCountry: '',
        specificationNo: '',
        toolLifeQuantity: '',
        unitCost: '',
        quantity: '',
        totalCost: '',
        taxTotal: '',
        listOfTaxDetails: [this.toolTaxObject],
        total: ''
        // total: '',
        // production
      },
      costRowObject: {
        description: '',
        sourceCountry: '',
        specificationNo: '',
        units: '',
        grossQty: '',
        finishedQty: '',
        scrapQty: '',
        scrapRate: '',
        listOfTaxDetails: [this.costTaxObject],
        rawMaterialRate: '',
        finalRawMaterialRate: '',
        totalCost: ''
      },
      processRowObject: {
        descriptionOfTool: '',
        speed: '',
        feed: '',
        time: '',
        costByTime: '',
        weight: '',
        costByWeight: '',
        length: '',
        costByLength: '',
        width: '',
        costByWidth: '',
        depth: '',
        costByDepth: '',
        diameter: '',
        costByDiameter: '',
        settingUpTime: '',
        costBySettingUpTime: '',
        labourCost: [this.processLabourObject],
        costTotal: '',
        finalTotal: '',
        submitModal: false,
        costClicked: false,
        toolClicked: false
        // outerProcessTax: [{ ...this.processTaxObject }] || []
        // outerProcessTax: [this.processTaxObject]
      },
      outerProcessTax: [this.processTaxObject],
      showSaveButton: true,
      showUpdateButton: false,
      // targetDate:
      //   this.props.supplierData &&
      //   this.props.supplierData.partDataForQuotation.targetDate,
      showPreview: false,
      termArray: ['', '', ''],
      disableSave: false
      //listOfQuotationTool: [{ ...this.state.toolRowObject }]
    };
    this.activeTabKeyAction = this.activeTabKeyAction.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.addProtoCost = this.addProtoCost.bind(this);
    this.addProtoTool = this.addProtoTool.bind(this);
    this.addProdCost = this.addProdCost.bind(this);
    this.addProdTool = this.addProdTool.bind(this);
    this.addToolRow = this.addToolRow.bind(this);
    this.addToolTax = this.addToolTax.bind(this);
    this.handleToolChange = this.handleToolChange.bind(this);
    this.handleCostChange = this.handleCostChange.bind(this);
    this.handleToolTaxChange = this.handleToolTaxChange.bind(this);
    this.handleCostTaxChange = this.handleCostTaxChange.bind(this);
    this.submitQuotation = this.submitQuotation.bind(this);
    this.updateQuotation = this.updateQuotation.bind(this);
    this.addRawMaterialRow = this.addRawMaterialRow.bind(this);
    this.addCostTax = this.addCostTax.bind(this);
    this.addProcessRow = this.addProcessRow.bind(this);
    this.addProcessTax = this.addProcessTax.bind(this);
    this.addProcessLabour = this.addProcessLabour.bind(this);
    this.handleProcessChange = this.handleProcessChange.bind(this);
    this.handleProcessTaxChange = this.handleProcessTaxChange.bind(this);
    this.handleProcessLabourChange = this.handleProcessLabourChange.bind(this);
    this.handleToolTaxBlur = this.handleToolTaxBlur.bind(this);
    this.handleToolTotalBlur = this.handleToolTotalBlur.bind(this);
    this.handleCostTaxBlur = this.handleCostTaxBlur.bind(this);
    this.handleCostFinalRawMaterialBlur = this.handleCostFinalRawMaterialBlur.bind(
      this
    );
    this.handleProcessBlur = this.handleProcessBlur.bind(this);
    this.handleProcessTaxBlur = this.handleProcessTaxBlur.bind(this);
    this.handlePckLogChange = this.handlePckLogChange.bind(this);
    this.handlePckLogBlur = this.handlePckLogBlur.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.searchByPartNumber = this.searchByPartNumber.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handlePartDetailReview = this.handlePartDetailReview.bind(this);
    this.handleReviewClose = this.handleReviewClose.bind(this);
    this.addTerm = this.addTerm.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  componentWillMount() {
    let targetDate = this.state.reviewPartQuotationData.targetDate;   
    if (moment() > moment(targetDate)) {
      showErrorToast('Part target date expired');
      this.setState({ disableSave: true });
    }

    let _this = this;
    this.setState({
      listOfQuotationTool: [{ ...this.state.toolRowObject }],
      listOfQuotationCost: [{ ...this.state.costRowObject }],
      listOfQuotationProcess: [{ ...this.state.processRowObject }],
      targetDate: targetDate || '',
      buyerDetailResponse:
        this.state.reviewPartQuotationData &&
        this.state.reviewPartQuotationData.buyerDetailResponse
    });
    if (this.state.reviewPartQuotationData.production === 'proto') {
      this.setState({
        production: 'proto',
        disableProtoButton: false,
        disableProductionButton: true
      });
    } else {
      this.setState({
        production: 'production',
        disableProductionButton: false,
        disableProtoButton: true
      });
    }

    if (
      this.props.location.state &&
      this.props.location.state.checkKey === 'editQuotation'
    ) {
      let data = {
        partNumber:
          this.props.location.state &&
          this.props.location.state.data.partNumber,
        userId: this.props.userInfo.userData.id,
        roleId: this.props.userInfo.userData.userRole || ''
      };
      this.props.actionLoaderShow();
      this.props
        .actionSearchQuotation(data)
        .then((result, error) => {
          let searchData = result.payload.data.resourceData[0];          
          this.setState({
            showSaveButton: false,
            showUpdateButton: true,
            listOfQuotationTool: searchData.quotationTool.listOfQuotationTool,
            listOfQuotationCost: searchData.quotationCost.listOfQuotationCost,
            listOfQuotationProcess:
              searchData.quotationProcess.listOfQuotationProcess,
            grandTotal: searchData.grandTotal,
            logisticsCost: searchData.logisticsCost,
            packagingCost: searchData.packagingCost,
            outerProcessTax: searchData.quotationProcess.outerProcessTax,
            toolTotalCost: searchData.quotationTool.costTotal,
            finalToolTotal: searchData.quotationTool.finalTotal,
            finalRawMaterialRate: searchData.quotationCost.totalRawMaterialCost,
            finalCostTotal: searchData.quotationCost.total,
            subtotal: searchData.quotationProcess.subTotal,
            totalProcess: searchData.quotationProcess.totalProcessCost,
            outerToolTax: searchData.quotationTool.outerToolTax,
            outerCostTax: searchData.quotationCost.outerCostTax,
            quotationId: searchData.quotationId,
            typeOfQuotation: searchData.typeOfQuotation,
            quotationForQuantity: searchData.quotationForQuantity,
            currency: searchData.currency,
            targetDate: searchData.deliveryTargetDate,
            deliveryLeadTime: searchData.deliveryLeadTime,
            deliveryLeadTimeUnit: searchData.deliveryLeadTimeUnit,
            deliveryLeadTimeAfter: searchData.deliveryLeadTimeAfter,
            disableProtoButton: true,
            disableProductionButton: true,
            showCostTable: true,
            showToolTable: true,
            termArray: searchData.listOfTermsAndConditions

          });
          let taxArray = [],
            taxCostArray = [];
          let outerToolTax = this.state.outerToolTax;
          outerToolTax.forEach(function(elem, index) {
            taxArray[index] = elem.taxCost;
          });
          let outerCostTax = this.state.outerCostTax;
          outerCostTax.forEach(function(elem, index) {
            taxCostArray[index] = elem.taxCost;
          });

          if (this.state.typeOfQuotation === 'proto') {
            this.setState({
              showProtoToolHeading: true,
              showProtoCostHeading: true
            });
          } else {
            this.setState({
              showProdToolHeading: true,
              showProdCostHeading: true
            });
          }
          this.setState({
            taxArray: taxArray,
            taxCostArray: taxCostArray
          });
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }
    window.scrollTo(0, 0);
  }

  activeTabKeyAction(tabKey) {
    if (tabKey === 'first')
      this.props.history.push({
        pathname: 'home',
        state: { path: 'first' }
      });
    if (tabKey === 'second') this.props.history.push('home');
    if (tabKey === 'third')
      this.props.history.push({
        pathname: 'home',
        state: { path: 'third' }
      });
    this.setState({ tabKey: tabKey });
  }

  navigateTo(data) {
    this.props.actionTabClick(data);
  }

  searchChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  searchByPartNumber(e) {
    let _this = this;
    if (e.key === 'Enter') {
      let data = {
        partNumber: this.state.quotationSearch,
        userId: this.props.userInfo.userData.id,
        roleId: this.props.userInfo.userData.userRole || ''
      };
      this.props.actionLoaderShow();
      this.props
        .actionSearchQuotation(data)
        .then((result, error) => {
          let searchData = result.payload.data.resourceData[0];
          this.setState({
            showSaveButton: false,
            showUpdateButton: true,
            listOfQuotationTool: searchData.quotationTool.listOfQuotationTool,
            listOfQuotationCost: searchData.quotationCost.listOfQuotationCost,
            listOfQuotationProcess:
              searchData.quotationProcess.listOfQuotationProcess,
            grandTotal: searchData.grandTotal,
            logisticsCost: searchData.logisticsCost,
            packagingCost: searchData.packagingCost,
            outerProcessTax: searchData.quotationProcess.outerProcessTax,
            toolTotalCost: searchData.quotationTool.costTotal,
            finalToolTotal: searchData.quotationTool.finalTotal,
            finalRawMaterialRate: searchData.quotationCost.totalRawMaterialCost,
            finalCostTotal: searchData.quotationCost.total,
            subtotal: searchData.quotationProcess.subTotal,
            totalProcess: searchData.quotationProcess.totalProcessCost,
            outerToolTax: searchData.quotationTool.outerToolTax,
            outerCostTax: searchData.quotationCost.outerCostTax,
            quotationId: searchData.quotationId,
            typeOfQuotation: searchData.typeOfQuotation,
            quotationForQuantity: searchData.quotationForQuantity,
            currency: searchData.currency,
            targetDate: searchData.deliveryTargetDate,
            deliveryLeadTime: searchData.deliveryLeadTime,
            deliveryLeadTimeUnit: searchData.deliveryLeadTimeUnit,
            deliveryLeadTimeAfter: searchData.deliveryLeadTimeAfter,
            disableProtoButton: true,
            disableProductionButton: true,
            showCostTable: true,
            showToolTable: true
          });
          let taxArray = [],
            taxCostArray = [];
          let outerToolTax = this.state.outerToolTax;
          outerToolTax.forEach(function(elem, index) {
            taxArray[index] = elem.taxCost;
          });
          let outerCostTax = this.state.outerCostTax;
          outerCostTax.forEach(function(elem, index) {
            taxCostArray[index] = elem.taxCost;
          });

          if (this.state.typeOfQuotation === 'proto') {
            this.setState({
              showProtoToolHeading: true,
              showProtoCostHeading: true
            });
          } else {
            this.setState({
              showProdToolHeading: true,
              showProdCostHeading: true
            });
          }
          this.setState({
            taxArray: taxArray,
            taxCostArray: taxCostArray
          });
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  }

  handleOnChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleToolChange(event, index) {
    const { name, value } = event.target;
    // this.setState((prevState, props) => {
    //   prevState.listOfQuotationTool[index][name] = value;
    //   return { listOfQuotationTool: prevState.listOfQuotationTool };
    // });
    let listOfQuotationTool = this.state.listOfQuotationTool;
    listOfQuotationTool[index][name] = JSON.parse(JSON.stringify(value));
    this.setState({
      listOfQuotationTool: JSON.parse(JSON.stringify(listOfQuotationTool))
    });
  }
  handleCostChange(event, index) {
    const { name, value } = event.target;
    let listOfQuotationCost = this.state.listOfQuotationCost;
    listOfQuotationCost[index][name] = JSON.parse(JSON.stringify(value));
    this.setState({
      listOfQuotationCost: JSON.parse(JSON.stringify(listOfQuotationCost))
    });
  }
  handleProcessChange(event, index) {
    const { name, value } = event.target;
    let listOfQuotationProcess = this.state.listOfQuotationProcess;
    listOfQuotationProcess[index][name] = JSON.parse(JSON.stringify(value));
    this.setState({
      listOfQuotationProcess: JSON.parse(JSON.stringify(listOfQuotationProcess))
    });
  }

  handleToolTaxChange(event, taxIndex, rowIndex) {
    const { name, value } = event.target;

    let listOfQuotationTool = JSON.parse(
      JSON.stringify(this.state.listOfQuotationTool)
    );
    listOfQuotationTool[rowIndex].listOfTaxDetails[taxIndex][name] = JSON.parse(
      JSON.stringify(value)
    );
    this.setState({
      listOfQuotationTool: JSON.parse(JSON.stringify(listOfQuotationTool))
    });
  }

  handleCostTaxChange(event, taxIndex, rowIndex) {
    const { name, value } = event.target;
    let listOfQuotationCost = JSON.parse(
      JSON.stringify(this.state.listOfQuotationCost)
    );
    listOfQuotationCost[rowIndex].listOfTaxDetails[taxIndex][name] = JSON.parse(
      JSON.stringify(value)
    );
    this.setState({
      listOfQuotationCost: JSON.parse(JSON.stringify(listOfQuotationCost))
    });
  }
  handleProcessTaxChange(event, rowIndex) {
    const { name, value } = event.target;
    let outerProcessTax =
      JSON.parse(JSON.stringify(this.state.outerProcessTax)) || [];
    outerProcessTax[rowIndex][name] = JSON.parse(JSON.stringify(value));
    this.setState({
      outerProcessTax: JSON.parse(JSON.stringify(outerProcessTax))
    });
  }
  handleProcessLabourChange(event, labourIndex, rowIndex) {
    const { name, value } = event.target;
    let listOfQuotationProcess = JSON.parse(
      JSON.stringify(this.state.listOfQuotationProcess)
    );
    listOfQuotationProcess[rowIndex].labourCost[labourIndex][name] = JSON.parse(
      JSON.stringify(value)
    );
    this.setState({
      listOfQuotationProcess: JSON.parse(JSON.stringify(listOfQuotationProcess))
    });
  }

  addProtoCost() {
    this.setState({
      disableProtoCostButton: true,
      showCostTable: true,
      showProtoCostHeading: true,
      costClicked: true
    });
  }
  addProtoTool() {
    this.setState({
      disableProtoToolButton: true,
      showToolTable: true,
      showProtoToolHeading: true,
      toolClicked: true
    });
  }
  addProdCost() {
    this.setState({
      disableProdCostButton: true,
      showCostTable: true,
      showProdCostHeading: true,
      costClicked: true
    });
  }
  addProdTool() {
    this.setState({
      disableProdToolButton: true,
      showToolTable: true,
      showProdToolHeading: true,
      toolClicked: true
    });
  }
  addToolRow() {
    let listOfQuotationTool = this.state.listOfQuotationTool;
    listOfQuotationTool.push(this.state.toolRowObject);
    this.setState({ listOfQuotationTool: listOfQuotationTool });
  }
  addRawMaterialRow() {
    let listOfQuotationCost = this.state.listOfQuotationCost;
    listOfQuotationCost.push(this.state.costRowObject);
    this.setState({ listOfQuotationCost: listOfQuotationCost });
  }
  addProcessRow() {
    let listOfQuotationProcess = this.state.listOfQuotationProcess;
    listOfQuotationProcess.push(this.state.processRowObject);
    this.setState({ listOfQuotationProcess: listOfQuotationProcess });
  }
  addToolTax() {
    let _this = this;
    let toolTaxObject = this.toolTaxObject;
    let listOfQuotationTool = Object.assign(
      [],
      _this.state.listOfQuotationTool
    );

    let toolList = [];
    toolList = listOfQuotationTool.map(function(item, index) {
      let item1 = JSON.parse(JSON.stringify(item));
      let listOfTaxDetails = item1.listOfTaxDetails;
      listOfTaxDetails.push(_this.toolTaxObject);
      item1.listOfTaxDetails = listOfTaxDetails;
      return item1;
    });

    this.setState({ listOfQuotationTool: toolList });
    let toolRowObject = this.state.toolRowObject;
    toolRowObject.listOfTaxDetails.push(this.toolTaxObject);
    this.setState({ toolRowObject: toolRowObject });
  }

  addCostTax() {
    let _this = this;
    let costTaxObject = this.costTaxObject;
    let listOfQuotationCost = Object.assign(
      [],
      _this.state.listOfQuotationCost
    );
    let costList = [];
    costList = listOfQuotationCost.map(function(item, index) {
      let item1 = JSON.parse(JSON.stringify(item));
      let listOfTaxDetails = item1.listOfTaxDetails;
      listOfTaxDetails.push(_this.costTaxObject);
      item1.listOfTaxDetails = listOfTaxDetails;
      return item1;
    });
    this.setState({ listOfQuotationCost: costList });
    let costRowObject = this.state.costRowObject;
    costRowObject.listOfTaxDetails.push(this.costTaxObject); // = taxArray;
    this.setState({ costRowObject: costRowObject });
  }
  addProcessTax() {
    let outerProcessTax = this.state.outerProcessTax || [];
    outerProcessTax.push(this.processTaxObject);
    this.setState({ outerProcessTax: outerProcessTax });
  }
  addProcessLabour() {
    let _this = this;
    let processLabourObject = this.processLabourObject;
    let listOfQuotationProcess = Object.assign(
      [],
      _this.state.listOfQuotationProcess
    );
    let processList = [];
    processList = listOfQuotationProcess.map(function(item, index) {
      let item1 = JSON.parse(JSON.stringify(item));
      let labourCost = item1.labourCost;
      labourCost.push(_this.processLabourObject);
      item1.labourCost = labourCost;
      return item1;
    });
    this.setState({ listOfQuotationProcess: processList });
    let processRowObject = this.state.processRowObject;
    processRowObject.labourCost.push(this.processLabourObject);
    this.setState({ processRowObject: processRowObject });
  }

  handleToolTaxBlur(event, tabIndex, rowIndex) {
    let listOfQuotationTool = this.state.listOfQuotationTool;
    let totalCost = [];
    listOfQuotationTool.forEach(function(element, rowIndex) {
      //ex st
      let totalTax = [];
      element.listOfTaxDetails.forEach(function(item, index) {
        totalTax[index] = 0;
      });
      //ex end
      totalCost[rowIndex] = element.totalCost
        ? parseFloat(element.totalCost)
        : 0;
      element.listOfTaxDetails.forEach(function(item, index) {
        let taxRate = item.taxRate ? item.taxRate : 0;
        item.taxCost =
          (parseFloat(taxRate) * parseFloat(totalCost[rowIndex])) / 100;
        //ex st
        totalTax[index] = parseFloat(totalTax[index]) + item.taxCost;
        //ex end
      });
      let total = 0;
      for (let i = 0; i < totalTax.length; i++) {
        total =
          (total ? parseFloat(total) : 0) +
          (totalTax[i] ? parseFloat(totalTax[i]) : 0);
      }
      element.total =
        (element.totalCost ? parseFloat(element.totalCost) : 0) +
        (total ? parseFloat(total) : 0);
    });
    this.setState({
      listOfQuotationTool: listOfQuotationTool
    });
    //code for final total
    let finalTotalToolCostArray = [];
    listOfQuotationTool &&
      listOfQuotationTool.map((item, index) => {
        finalTotalToolCostArray[index] = 0;
      });
    listOfQuotationTool &&
      listOfQuotationTool.map((item, index) => {
        finalTotalToolCostArray[index] =
          finalTotalToolCostArray[index] +
          (item.total ? parseFloat(item.total) : 0);
      });
    let total = 0;
    for (let i = 0; i < finalTotalToolCostArray.length; i++) {
      total =
        (total ? parseFloat(total) : 0) +
        (finalTotalToolCostArray[i]
          ? parseFloat(finalTotalToolCostArray[i])
          : 0);
    }
    this.setState({
      finalToolTotal: total
    });
    //code for final total

    //code for calculatng total column tax
    let x = 0;
    let taxArray = [];
    listOfQuotationTool[0].listOfTaxDetails.forEach(function(item, index) {
      x++;
      taxArray[index] = 0;
    });
    for (let i = 0; i < x; i++) {
      let taxAmt = 0;
      listOfQuotationTool.forEach(function(item, rowIndex) {
        // item.listOfTaxDetails.forEach(function(elem, taxIndex) {
        //   if (i === taxIndex) {
        //     taxAmt = taxAmt + elem.taxCost;
        //     break;
        //   }
        // });
        var BreakException = {};

        try {
          item.listOfTaxDetails.forEach(function(elem, taxIndex) {
            if (taxIndex === i) {
              taxAmt =
                parseFloat(taxAmt) +
                (elem.taxCost ? parseFloat(elem.taxCost) : 0);
              throw BreakException;
            }
          });
        } catch (e) {
          if (e !== BreakException) throw e;
        }
      });
      taxArray[i] = taxAmt;
      taxAmt = 0;
    }
    this.setState({ taxArray: taxArray });
    //code for calculatng total column tax
  }

  handleCostTaxBlur() {
    let listOfQuotationCost = this.state.listOfQuotationCost;
    let finalRawMaterialRate = [];
    listOfQuotationCost.forEach(function(element, rowIndex) {
      //ex st
      let totalTax = [];
      element.listOfTaxDetails.forEach(function(item, index) {
        totalTax[index] = 0;
      });
      //ex end
      finalRawMaterialRate[rowIndex] = element.finalRawMaterialRate
        ? element.finalRawMaterialRate
        : 0;
      element.listOfTaxDetails.forEach(function(item, index) {
        let taxRate = item.taxRate ? item.taxRate : 0;
        item.taxCost =
          (parseFloat(taxRate) * parseFloat(finalRawMaterialRate[rowIndex])) /
          100;
        //ex st
        totalTax[index] = parseFloat(totalTax[index]) + item.taxCost;
        //ex end
      });
      let total = 0;
      for (let i = 0; i < totalTax.length; i++) {
        total =
          (total ? parseFloat(total) : 0) +
          (totalTax[i] ? parseFloat(totalTax[i]) : 0);
      }
      element.totalCost =
        (element.finalRawMaterialRate
          ? parseFloat(element.finalRawMaterialRate)
          : 0) + (total ? parseFloat(total) : 0);
    });
    this.setState({
      listOfQuotationCost: listOfQuotationCost
    });

    //code for final total
    let finalCostTotalArray = [];
    listOfQuotationCost &&
      listOfQuotationCost.map((item, index) => {
        finalCostTotalArray[index] = 0;
      });
    listOfQuotationCost &&
      listOfQuotationCost.map((item, index) => {
        finalCostTotalArray[index] =
          finalCostTotalArray[index] +
          (item.totalCost ? parseFloat(item.totalCost) : 0);
      });
    let total = 0;
    for (let i = 0; i < finalCostTotalArray.length; i++) {
      total =
        (total ? parseFloat(total) : 0) +
        (finalCostTotalArray ? parseFloat(finalCostTotalArray[i]) : 0);
    }
    this.setState(
      {
        finalCostTotal: total
      },
      () => {
        this.handleProcessTaxBlur();
      }
    );
    //code for final total
    //code for calculatng total column tax
    let x = 0;
    let taxCostArray = [];
    listOfQuotationCost[0].listOfTaxDetails.forEach(function(item, index) {
      x++;
      taxCostArray[index] = 0;
    });
    let j = 0;
    for (j = 0; j < x; j++) {
      let taxAmt = 0;
      listOfQuotationCost.forEach(function(item, rowIndex) {
        var BreakException = {};
        try {
          item.listOfTaxDetails.forEach(function(elem, taxIndex) {
            if (taxIndex === j) {
              taxAmt =
                parseFloat(taxAmt) +
                (elem.taxCost ? parseFloat(elem.taxCost) : 0);
              throw BreakException;
            }
          });
        } catch (e) {
          if (e !== BreakException) throw e;
        }
      });
      taxCostArray[j] = taxAmt;
      taxAmt = 0;
    }
    this.setState({ taxCostArray: taxCostArray });
    //code for calculating total column tax
    // this.handleProcessTaxBlur();
  }

  handleToolTotalBlur(event, rowIndex) {
    let listOfQuotationTool = this.state.listOfQuotationTool;
    let totalToolCostArray = [];
    listOfQuotationTool &&
      listOfQuotationTool.map((item, index) => {
        totalToolCostArray[index] = 0;
      });
    listOfQuotationTool &&
      listOfQuotationTool.map((item, index) => {
        totalToolCostArray[index] = totalToolCostArray[index] + item.totalCost;
      });
    let total = 0;
    for (let i = 0; i < totalToolCostArray.length; i++) {
      total = parseFloat(total) + parseFloat(totalToolCostArray[i]);
    }
    this.setState({
      toolTotalCost: total
    });
    this.handleToolTaxBlur();
  }

  handleCostFinalRawMaterialBlur(event, rowIndex) {
    let listOfQuotationCost = this.state.listOfQuotationCost;
    let totalFinalRawMaterialArray = [];
    listOfQuotationCost &&
      listOfQuotationCost.map((item, index) => {
        totalFinalRawMaterialArray[index] = 0;
      });
    listOfQuotationCost &&
      listOfQuotationCost.map((item, index) => {
        totalFinalRawMaterialArray[index] =
          totalFinalRawMaterialArray[index] + item.finalRawMaterialRate;
      });
    let total = 0;
    for (let i = 0; i < totalFinalRawMaterialArray.length; i++) {
      total = parseFloat(total) + parseFloat(totalFinalRawMaterialArray[i]);
    }
    this.setState({
      finalRawMaterialRate: total
    });
    this.handleCostTaxBlur();
    //this.handleProcessTaxBlur();
  }

  handleProcessBlur() {
    let _this = this;
    let listOfQuotationProcess = this.state.listOfQuotationProcess;
    let allCostTotal = [];
    let labourArray = [];
    listOfQuotationProcess[0].labourCost.forEach(function(elem, rowIndex) {
      labourArray[rowIndex] = 0;
    });
    let subtotal = 0;
    listOfQuotationProcess.forEach(function(elem, rowIndex) {
      allCostTotal[rowIndex] =
        (elem.costByDepth ? parseFloat(elem.costByDepth) : 0) +
        (elem.costByDiameter ? parseFloat(elem.costByDiameter) : 0) +
        (elem.costByLength ? parseFloat(elem.costByLength) : 0) +
        (elem.costBySettingUpTime ? parseFloat(elem.costBySettingUpTime) : 0) +
        (elem.costByTime ? parseFloat(elem.costByTime) : 0) +
        (elem.costByVolume ? parseFloat(elem.costByVolume) : 0) +
        (elem.costByWeight ? parseFloat(elem.costByWeight) : 0) +
        (elem.costByWidth ? parseFloat(elem.costByWidth) : 0);

      let labour = 0;
      elem.labourCost.forEach(function(element, labourIndex) {
        labour =
          (labour ? parseFloat(labour) : 0) +
          (element.labourCost ? parseFloat(element.labourCost) : 0);
      });
      labourArray[rowIndex] = parseFloat(labour);
      let total = 0;

      elem.total =
        parseFloat(labourArray[rowIndex]) + parseFloat(allCostTotal[rowIndex]);
      subtotal = subtotal + elem.total;
      _this.setState({ subtotal: subtotal }, () => {
        _this.handleProcessTaxBlur();
      });
    });
    this.setState({ listOfQuotationProcess: listOfQuotationProcess });
  }

  handleProcessTaxBlur() {
    let outerProcessTax = this.state.outerProcessTax;
    let costTaxTotal = 0;
    let subtotal = this.state.subtotal ? this.state.subtotal : 0;
    outerProcessTax.forEach(function(elem, taxIndex) {
      elem.taxCost =
        (subtotal * (elem.taxRate ? parseFloat(elem.taxRate) : 0)) / 100;
      costTaxTotal = costTaxTotal + parseFloat(elem.taxCost);
    });
    this.setState({ outerProcessTax: outerProcessTax });
    let finalCostTotal = this.state.finalCostTotal
      ? this.state.finalCostTotal
      : 0;
    let totalProcess =
      parseFloat(subtotal) +
      parseFloat(finalCostTotal) +
      parseFloat(costTaxTotal);
    this.setState({ totalProcess: totalProcess }, () => {
      this.handlePckLogBlur();
    });
  }

  handlePckLogChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handlePckLogBlur() {
    let totalProcess = this.state.totalProcess ? this.state.totalProcess : 0;
    let packagingCost = this.state.packagingCost ? this.state.packagingCost : 0;
    let logisticsCost = this.state.logisticsCost ? this.state.logisticsCost : 0;
    let grandTotal =
      parseFloat(totalProcess) +
      parseFloat(packagingCost) +
      parseFloat(logisticsCost);
    this.setState({ grandTotal: grandTotal });
  }

  closeModal() {
    this.setState({ submitModal: false });
  }

  submitQuotation() {
    if (
      (!this.state.disableProtoButton ||
        !this.state.disableProdToolButton ||
        !this.state.disableProdCostButton) &&
      (!this.state.disableProductionButton ||
        !this.state.disableProtoToolButton ||
        !this.state.disableProtoCostButton)
    ) {
      this.setState({
        submitModal: true
      });
    } else {
      let _this = this;
      const covertToTimeStamp = momentObject => {
        return moment(momentObject).format('X');
      };
      let data = {};      
      data = {
        quotationForPart: this.state.reviewPartQuotationData.id,
        typeOfQuotation: this.state.reviewPartQuotationData.production,
        creatorSupplierUserDetails: this.props.userInfo.userData.id,
        roleId: this.props.userInfo.userData.userRole,
        quotationForQuantity: this.state.quotationForQuantity,
        deliveryLeadTime: this.state.deliveryLeadTime,
        deliveryLeadTimeUnit: parseInt(this.state.deliveryLeadTimeUnit) || 1,
        deliveryLeadTimeAfter: parseInt(this.state.deliveryLeadTimeAfter) || 1,
        //deliveryTargetDate: covertToTimeStamp(this.state.targetDate), /** Dileep Singh 31-12-2018 */
        deliveryTargetDate: this.state.targetDate,
        currency: this.state.currency || 'INR',
        quotationTool: {
          listOfQuotationTool: this.state.listOfQuotationTool
        },
        quotationCost: {
          listOfQuotationCost: this.state.listOfQuotationCost
        },
        quotationProcess: {
          listOfQuotationProcess: this.state.listOfQuotationProcess,
          costTotal: '',
          finalTotal: '',
          outerProcessTax: this.state.outerProcessTax
        },
        packagingCost: this.state.packagingCost,
        logisticsCost: this.state.logisticsCost,
        listOfTermsAndConditions: this.state.termArray
      };

      this.props
        .actionSubmitQuotation(data)
        .then((result, error) => {
          if (result.payload.data.status === 200) {    
            let socketData = { 
              notificationId: result.payload.data.resourceData
            };            
            socket.emit('new-message', socketData);
            this.props.history.push('/supplier/home');
          }
          _this.props.actionLoaderHide();
        })
        .catch(e => _this.props.actionLoaderHide());
    }
  }
  updateQuotation() {
    let _this = this;
    const covertToTimeStamp = momentObject => {
      return moment(momentObject).format('X');
    };
    let data = {};
    data = {
      quotationId: this.state.quotationId,
      quotationForPart: this.state.reviewPartQuotationData.id,
      typeOfQuotation: this.state.reviewPartQuotationData.production,
      creatorSupplierUserDetails: this.props.userInfo.userData.id,
      roleId: this.props.userInfo.userData.userRole,
      quotationForQuantity: this.state.quotationForQuantity,
      deliveryLeadTime: this.state.deliveryLeadTime,
      deliveryLeadTimeUnit: parseInt(this.state.deliveryLeadTimeUnit) || 1,
      deliveryLeadTimeAfter: parseInt(this.state.deliveryLeadTimeAfter) || 1,     
      //deliveryTargetDate: covertToTimeStamp(this.state.targetDate), /** Dileep Singh 31-12-2018 */
      deliveryTargetDate: this.state.targetDate,
      currency: this.state.currency || 'INR',
      quotationTool: {
        listOfQuotationTool: this.state.listOfQuotationTool
      },
      quotationCost: {
        listOfQuotationCost: this.state.listOfQuotationCost
      },
      quotationProcess: {
        listOfQuotationProcess: this.state.listOfQuotationProcess,
        costTotal: '',
        finalTotal: '',
        outerProcessTax: this.state.outerProcessTax
      },
      packagingCost: this.state.packagingCost,
      logisticsCost: this.state.logisticsCost,
      listOfTermsAndConditions: this.state.termArray
    };
    this.props
      .actionUpdateQuotation(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  handlePartDetailReview() {
    // let listOfQuotationTool = this.state.listOfQuotationTool;
    this.setState({
      showPreview: true
      // listOfQuotationTool: listOfQuotationTool
      //reviewData: result.payload.data.resourceData
    });
  }
  handleReviewClose() {
    this.setState({ showPreview: false });
  }

  addTerm() {
    let termArray = this.state.termArray;
    termArray.push('');
    this.setState({
      termArray: termArray
    });
  }
  handleTermChange(index, event) {
    let termArray = [];
    if (event) {
      const name = event.target.name;
      const value = event.target.value;
      termArray = Object.assign([], this.state.termArray);
      termArray[index] = value;
    } else {
      termArray = [{}];
    }
    this.setState({
      termArray: termArray
    });
  }

  render() {  
    return (
      <div>
        <Header {...this.props} />
        <SideBar activeTabKeyAction={this.activeTabKeyAction} />
        {this.state.tabKey === 'quotation' ? (
          <div className="content-body flex">
            <div className="content">
              <div className="container-fluid">
                <div className="flex align-center justify-space-between b-bottom border-light m-b-20">
                  <h4 className="hero-title">
                    {this.props.location.state &&
                    this.props.location.state.checkKey === 'editQuotation'
                      ? 'Edit Quotation'
                      : 'Create Quotation'}
                  </h4>
                  <div className="filter-in w-300">
                    <div className="top-search">
                      <FormGroup>
                        <FormControl
                          type="search"
                          placeholder="Search..."
                          name="quotationSearch"
                          value={this.state.quotationSearch}
                          onKeyUp={this.searchByPartNumber}
                          onChange={event => {
                            this.searchChange(event);
                          }}
                          className="m-l-auto"
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </div>
                  </div>
                </div>
                <div className="m-b-50">
                  <Row className="show-grid">
                    <Col md={2}> </Col>
                    <Col md={4}>
                      {this.props.userInfo &&
                      this.props.userInfo.userData.companyLogo ? (
                        <div className="brand">
                          <img
                            src={
                              this.props.userInfo &&
                              this.props.userInfo.userData.companyLogo
                            }
                            className="obj-cover"
                          />
                        </div>
                      ) : (
                        <div className="brand">
                          <img src={Image1} className="obj-cover" />
                        </div>
                      )}

                      <div className="company-info">
                        <Table className="">
                          <tbody>
                            <tr>
                              <td>Supplier:</td>
                              <td>
                                {' '}
                                {this.props.userInfo &&
                                  this.props.userInfo.userData.companyName}
                              </td>
                            </tr>
                            <tr>
                              <td>Contact:</td>
                              <td>
                                {this.props.userInfo &&
                                this.props.userInfo.userData.fullname
                                  ? this.props.userInfo.userData.fullname.trim()
                                  : ''}
                                ,&nbsp;
                                {this.props.userInfo &&
                                this.props.userInfo.userData.contactNo
                                  ? this.props.userInfo.userData.contactNo.trim()
                                  : ''}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                    <Col md={4}>
                      {this.state.reviewPartQuotationData.buyerResponse &&
                      this.state.reviewPartQuotationData.buyerResponse
                        .companyLogo ? (
                        <div className="brand">
                          <img
                            src={
                              this.state.reviewPartQuotationData
                                .buyerResponse &&
                              this.state.reviewPartQuotationData.buyerResponse
                                .companyLogo
                            }
                            className="obj-cover"
                          />
                        </div>
                      ) : (
                        <div className="brand">
                          <img src={Image1} className="obj-cover" />
                        </div>
                      )}

                      <div className="company-info">
                        <Table className="">
                          <tbody>
                            <tr>
                              <td>Buyer:</td>
                              <td>
                                {' '}
                                {this.state.reviewPartQuotationData
                                  .buyerResponse &&
                                  this.state.reviewPartQuotationData
                                    .buyerResponse.companyName}
                              </td>
                            </tr>
                            <tr>
                              <td>Contact:</td>
                              <td>
                                {this.state.buyerDetailResponse &&
                                  this.state.buyerDetailResponse.firstName}{' '}
                                {this.state.buyerDetailResponse &&
                                  this.state.buyerDetailResponse.lastName}
                                ,{' '}
                                {this.state.buyerDetailResponse &&
                                  this.state.buyerDetailResponse.mobile}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </div>
                <hr className="bg-divider" />

                <div>
                  <div className="flex justify-space-between">
                    <h4 className="" />
                    <div>
                      <button
                        className={
                          this.state.disableProtoButton ||
                          this.state.disableProtoToolButton
                            ? 'btn btn-default sm-btn text-uppercase p-e-none disabled'
                            : 'btn btn-default sm-btn text-uppercase'
                        }
                        onClick={this.addProtoTool}
                      >
                        add proto Tool
                      </button>
                      <button
                        className={
                          this.state.disableProtoButton ||
                          this.state.disableProtoCostButton
                            ? 'btn btn-default sm-btn text-uppercase p-e-none disabled'
                            : 'btn btn-default sm-btn text-uppercase'
                        }
                        onClick={this.addProtoCost}
                      >
                        add proto cost
                      </button>
                      <button
                        className={
                          this.state.disableProdToolButton ||
                          this.state.disableProductionButton
                            ? 'btn btn-default sm-btn text-uppercase  p-e-none disabled'
                            : 'btn btn-default sm-btn text-uppercase'
                        }
                        onClick={this.addProdTool}
                      >
                        add production tool
                      </button>
                      <button
                        className={
                          this.state.disableProdCostButton ||
                          this.state.disableProductionButton
                            ? 'btn btn-default sm-btn text-uppercase  p-e-none disabled'
                            : 'btn btn-default sm-btn text-uppercase'
                        }
                        onClick={this.addProdCost}
                      >
                        add production cost
                      </button>
                    </div>
                  </div>
                  {/* className={` ${this.state.showToolTable ? '' : 'hide'}`} */}
                  <div>
                    <div className="flex justify-space-between">
                      {this.state.showProtoToolHeading ? (
                        <h4 className="">Proto Tool</h4>
                      ) : this.state.showProdToolHeading ? (
                        <h4 className="">Production Tool</h4>
                      ) : null}

                      <div />
                    </div>
                    <Row
                      className={`show-grid ${
                        this.state.showToolTable ? '' : 'hide'
                      }`}
                    >
                      <Col md={1} className="p-r-0">
                        <div className="btn-col">
                          <button
                            className="btn  btn-primary text-capitalize"
                            onClick={this.addToolRow}
                          >
                            Add Tool
                          </button>

                          <button
                            className="btn  btn-primary text-capitalize"
                            onClick={this.addToolTax}
                          >
                            Add taxes
                          </button>
                        </div>
                      </Col>
                      <Col md={11}>
                        <div className="tbmbt10">
                          <Table
                            bordered
                            responsive
                            className="custom-table cell-input"
                          >
                            <thead>
                              <tr>
                                <th>Description<i className="text-danger">*</i></th>
                                <th>Source (Country)<i className="text-danger">*</i></th>
                                <th>Specification<i className="text-danger">*</i></th>
                                <th>Tool Life (qty)<i className="text-danger">*</i></th>
                                <th>Unit Cost<i className="text-danger">*</i></th>
                                <th>Quantity<i className="text-danger">*</i></th>
                                <th>Total Cost<i className="text-danger">*</i></th>
                                {this.state.listOfQuotationTool[0].listOfTaxDetails.map(
                                  (item, index) => {
                                    return [
                                      <th>
                                        Tax
                                        {index + 1} Description<i className="text-danger">*</i>
                                      </th>,
                                      <th>
                                        Tax
                                        {index + 1} Rate<i className="text-danger">*</i>
                                      </th>,
                                      <th>
                                        Tax
                                        {index + 1}{' '}
                                      </th>
                                    ];
                                  }
                                )}
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.listOfQuotationTool &&
                                this.state.listOfQuotationTool.map(
                                  (toolData, rowIndex) => {
                                    return [
                                      <tr>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="description"
                                              value={toolData.description}
                                              onChange={event => {
                                                this.handleToolChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="sourceCountry"
                                              value={toolData.sourceCountry}
                                              onChange={event => {
                                                this.handleToolChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="specificationNo"
                                              value={toolData.specificationNo}
                                              onChange={event => {
                                                this.handleToolChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="toolLifeQuantity"
                                              value={toolData.toolLifeQuantity}
                                              onChange={event => {
                                                this.handleToolChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="unitCost"
                                              value={toolData.unitCost}
                                              onChange={event => {
                                                this.handleToolChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="quantity"
                                              value={toolData.quantity}
                                              onChange={event => {
                                                this.handleToolChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="totalCost"
                                              value={toolData.totalCost}
                                              onChange={event => {
                                                this.handleToolChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                              onBlur={event => {
                                                this.handleToolTotalBlur(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        {toolData.listOfTaxDetails.map(
                                          (taxData, taxIndex) => {
                                            return [
                                              <td>
                                                <FormGroup>
                                                  <FormControl
                                                    className="br-0"
                                                    type="text"
                                                    // name={
                                                    //   'taxDescription' +
                                                    //   taxIndex
                                                    // }
                                                    name="taxDescription"
                                                    value={
                                                      taxData.taxDescription
                                                    }
                                                    onChange={event => {
                                                      this.handleToolTaxChange(
                                                        event,
                                                        taxIndex,
                                                        rowIndex
                                                      );
                                                    }}
                                                  />
                                                  <FormControl.Feedback />
                                                </FormGroup>
                                              </td>,
                                              <td>
                                                <FormGroup>
                                                  <FormControl
                                                    className="br-0"
                                                    type="text"
                                                    // name={'taxRate' + taxIndex}
                                                    name="taxRate"
                                                    value={taxData.taxRate}
                                                    onChange={event => {
                                                      this.handleToolTaxChange(
                                                        event,
                                                        taxIndex,
                                                        rowIndex
                                                      );
                                                    }}
                                                    onBlur={event => {
                                                      this.handleToolTaxBlur(
                                                        event,
                                                        taxIndex,
                                                        rowIndex
                                                      );
                                                    }}
                                                  />
                                                  <FormControl.Feedback />
                                                </FormGroup>
                                              </td>,
                                              <td>
                                                <FormGroup>
                                                  <FormControl
                                                    className="br-0"
                                                    type="text"
                                                    readOnly
                                                    value={
                                                      taxData.taxCost &&
                                                      taxData.taxCost.toFixed(2)
                                                    }
                                                  />
                                                  <FormControl.Feedback />
                                                </FormGroup>
                                              </td>
                                            ];
                                          }
                                        )}
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              readOnly
                                              value={
                                                toolData.total &&
                                                toolData.total.toFixed(2)
                                              }
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                      </tr>
                                    ];
                                  }
                                )}

                              <tr>
                                <td>Total</td>
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td>
                                  <FormGroup>
                                    <FormControl
                                      className="br-0"
                                      type="text"
                                      readOnly
                                      value={
                                        this.state.toolTotalCost &&
                                        this.state.toolTotalCost.toFixed(2)
                                      }
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                {this.state.listOfQuotationTool[0].listOfTaxDetails.map(
                                  (item, index) => {
                                    return [
                                      <td> </td>,
                                      <td> </td>,
                                      <td>
                                        <FormGroup>
                                          <FormControl
                                            className="br-0"
                                            type="text"
                                            readOnly
                                            value={
                                              this.state.taxArray &&
                                              this.state.taxArray[index] &&
                                              this.state.taxArray[
                                                index
                                              ].toFixed(2)
                                            }
                                          />
                                          <FormControl.Feedback />
                                        </FormGroup>
                                      </td>
                                    ];
                                  }
                                )}
                                <td>
                                  <FormGroup>
                                    <FormControl
                                      className="br-0"
                                      type="text"
                                      readOnly
                                      value={
                                        this.state.finalToolTotal &&
                                        this.state.finalToolTotal.toFixed(2)
                                      }
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  {/* className={` ${this.state.showCostTable ? '' : 'hide'}`} */}
                  <div>
                    <div className="flex justify-space-between">
                      {this.state.showProtoCostHeading ? (
                        <h4 className="">Proto Part</h4>
                      ) : this.state.showProdCostHeading ? (
                        <h4 className="">Production Part</h4>
                      ) : null}
                      <div />
                    </div>
                    {this.state.showProtoCostHeading ? (
                      <h5 className="">Raw Material</h5>
                    ) : this.state.showProdCostHeading ? (
                      <h5 className="">Raw Material</h5>
                    ) : null}

                    <Row
                      className={`show-grid ${
                        this.state.showCostTable ? '' : 'hide'
                      }`}
                    >
                      <Col md={1} className="p-r-0">
                        <div className="btn-col">
                          <button
                            className="btn  btn-primary text-capitalize"
                            onClick={this.addRawMaterialRow}
                          >
                            Add Raw Material
                          </button>

                          <button
                            className="btn  btn-primary text-capitalize"
                            onClick={this.addCostTax}
                          >
                            Add taxes
                          </button>
                        </div>
                      </Col>
                      <Col md={11}>
                        <div>
                          <Table
                            bordered
                            responsive
                            className="custom-table cell-input"
                          >
                            <thead>
                              <tr>
                                <th>Description<i className="text-danger">*</i></th>
                                <th>Source (Country)<i className="text-danger">*</i></th>
                                <th>Specification<i className="text-danger">*</i></th>
                                <th>Units<i className="text-danger">*</i></th>
                                <th>Gross Qty<i className="text-danger">*</i></th>
                                <th>Finished Qty<i className="text-danger">*</i></th>
                                <th>Raw Material Rate<i className="text-danger">*</i></th>
                                <th>Scrap Qty<i className="text-danger">*</i></th>
                                <th>Scrap Rate<i className="text-danger">*</i></th>
                                <th>Scrap Recovery<i className="text-danger">*</i></th>
                                <th>Final Raw Material Rate<i className="text-danger">*</i></th>
                                {this.state.listOfQuotationCost[0].listOfTaxDetails.map(
                                  (item, index) => {
                                    return [
                                      <th>
                                        Tax
                                        {index + 1} Description<i className="text-danger">*</i>
                                      </th>,
                                      <th>
                                        Tax
                                        {index + 1} Rate<i className="text-danger">*</i>
                                      </th>,
                                      <th>
                                        Tax
                                        {index + 1}{' '}
                                      </th>
                                    ];
                                  }
                                )}
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.listOfQuotationCost &&
                                this.state.listOfQuotationCost.map(
                                  (costData, rowIndex) => {
                                    return [
                                      <tr>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="description"
                                              value={costData.description}
                                              onChange={event => {
                                                this.handleCostChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="sourceCountry"
                                              value={costData.sourceCountry}
                                              onChange={event => {
                                                this.handleCostChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="specificationNo"
                                              value={costData.specificationNo}
                                              onChange={event => {
                                                this.handleCostChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="units"
                                              value={costData.units}
                                              onChange={event => {
                                                this.handleCostChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="grossQty"
                                              value={costData.grossQty}
                                              onChange={event => {
                                                this.handleCostChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="finishedQty"
                                              value={costData.finishedQty}
                                              onChange={event => {
                                                this.handleCostChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="rawMaterialRate"
                                              value={costData.rawMaterialRate}
                                              onChange={event => {
                                                this.handleCostChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="scrapQty"
                                              value={costData.scrapQty}
                                              onChange={event => {
                                                this.handleCostChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="scrapRate"
                                              value={costData.scrapRate}
                                              onChange={event => {
                                                this.handleCostChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="scrapRecovery"
                                              value={costData.scrapRecovery}
                                              onChange={event => {
                                                this.handleCostChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="finalRawMaterialRate"
                                              value={
                                                costData.finalRawMaterialRate
                                              }
                                              onChange={event => {
                                                this.handleCostChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                              onBlur={event => {
                                                this.handleCostFinalRawMaterialBlur(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        {costData.listOfTaxDetails.map(
                                          (taxData, taxIndex) => {
                                            return [
                                              <td>
                                                <FormGroup>
                                                  <FormControl
                                                    className="br-0"
                                                    type="text"
                                                    name="taxDescription"
                                                    value={
                                                      taxData.taxDescription
                                                    }
                                                    onChange={event => {
                                                      this.handleCostTaxChange(
                                                        event,
                                                        taxIndex,
                                                        rowIndex
                                                      );
                                                    }}
                                                  />
                                                  <FormControl.Feedback />
                                                </FormGroup>
                                              </td>,
                                              <td>
                                                <FormGroup>
                                                  <FormControl
                                                    className="br-0"
                                                    type="text"
                                                    name="taxRate"
                                                    value={taxData.taxRate}
                                                    onChange={event => {
                                                      this.handleCostTaxChange(
                                                        event,
                                                        taxIndex,
                                                        rowIndex
                                                      );
                                                    }}
                                                    onBlur={event => {
                                                      this.handleCostTaxBlur(
                                                        event,
                                                        taxIndex,
                                                        rowIndex
                                                      );
                                                    }}
                                                  />
                                                  <FormControl.Feedback />
                                                </FormGroup>
                                              </td>,
                                              <td>
                                                <FormGroup>
                                                  <FormControl
                                                    className="br-0"
                                                    type="text"
                                                    name="taxCost"
                                                    value={
                                                      taxData.taxCost &&
                                                      taxData.taxCost.toFixed(2)
                                                    }
                                                    readOnly
                                                  />
                                                  <FormControl.Feedback />
                                                </FormGroup>
                                              </td>
                                            ];
                                          }
                                        )}
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              value={
                                                costData.totalCost &&
                                                costData.totalCost.toFixed(2)
                                              }
                                              readOnly
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                      </tr>
                                    ];
                                  }
                                )}

                              <tr>
                                <td>Total</td>
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td>
                                  <FormGroup>
                                    <FormControl
                                      className="br-0"
                                      type="text"
                                      readOnly
                                      value={
                                        this.state.finalRawMaterialRate &&
                                        this.state.finalRawMaterialRate.toFixed(
                                          2
                                        )
                                      }
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                                {this.state.listOfQuotationCost[0].listOfTaxDetails.map(
                                  (item, index) => {
                                    return [
                                      <td> </td>,
                                      <td> </td>,
                                      <td>
                                        <FormGroup>
                                          <FormControl
                                            className="br-0"
                                            type="text"
                                            readOnly
                                            value={
                                              this.state.taxCostArray &&
                                              this.state.taxCostArray[index] &&
                                              this.state.taxCostArray[
                                                index
                                              ].toFixed(2)
                                            }
                                          />
                                          <FormControl.Feedback />
                                        </FormGroup>
                                      </td>
                                    ];
                                  }
                                )}
                                <td>
                                  <FormGroup>
                                    <FormControl
                                      className="br-0"
                                      type="text"
                                      value={
                                        this.state.finalCostTotal &&
                                        this.state.finalCostTotal.toFixed(2)
                                      }
                                      readOnly
                                    />
                                    <FormControl.Feedback />
                                  </FormGroup>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className={` ${this.state.showCostTable ? '' : 'hide'}`}>
                    <div className="flex justify-space-between">
                      <h5 className="">Process / Operation</h5>
                      <div />
                    </div>
                    <Row className="show-grid">
                      <Col md={1} className="p-r-0">
                        <div className="btn-col">
                          <button
                            className="btn  btn-primary text-capitalize"
                            onClick={this.addProcessRow}
                          >
                            Add Process
                          </button>
                          <button
                            className="btn  btn-primary text-capitalize"
                            onClick={this.addProcessTax}
                          >
                            Add taxes
                          </button>
                          <button
                            className="btn  btn-primary text-capitalize"
                            onClick={this.addProcessLabour}
                          >
                            Add Labour
                          </button>
                        </div>
                      </Col>
                      <Col md={11}>
                        <div>
                          <Table
                            bordered
                            responsive
                            className="custom-table cell-input"
                          >
                            <thead>
                              <tr>
                                <th>Machine/Tool/Equipment<i className="text-danger">*</i></th>
                                <th>Speed<i className="text-danger">*</i></th>
                                <th>Feed<i className="text-danger">*</i></th>
                                <th>Time<i className="text-danger">*</i></th>
                                <th>Cost/Time<i className="text-danger">*</i></th>
                                <th>Weight<i className="text-danger">*</i></th>
                                <th>Cost/Weight<i className="text-danger">*</i></th>
                                <th>Diameter<i className="text-danger">*</i></th>
                                <th>Cost/Diameter<i className="text-danger">*</i></th>
                                <th>Length<i className="text-danger">*</i></th>
                                <th>Cost/Length<i className="text-danger">*</i></th>
                                <th>Width<i className="text-danger">*</i></th>
                                <th>Cost/Width<i className="text-danger">*</i></th>
                                <th>Depth<i className="text-danger">*</i></th>
                                <th>Cost/Depth<i className="text-danger">*</i></th>
                                <th>Volume<i className="text-danger">*</i></th>
                                <th>Cost/Volume<i className="text-danger">*</i></th>
                                <th>Setting up Time<i className="text-danger">*</i></th>
                                <th>Cost/Setting up Time<i className="text-danger">*</i></th>
                                {this.state.listOfQuotationProcess[0].labourCost.map(
                                  (item, index) => {
                                    return (
                                      <th>
                                        Labour
                                        {index + 1}<i className="text-danger">*</i>
                                      </th>
                                    );
                                  }
                                )}
                                {/* <th>Labour</th> */}
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.listOfQuotationProcess &&
                                this.state.listOfQuotationProcess.map(
                                  (processData, rowIndex) => {
                                    return [
                                      <tr>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="descriptionOfTool"
                                              value={
                                                processData.descriptionOfTool
                                              }
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="speed"
                                              value={processData.speed}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>

                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="feed"
                                              value={processData.feed}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="time"
                                              value={processData.time}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="costByTime"
                                              value={processData.costByTime}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                              onBlur={event => {
                                                this.handleProcessBlur();
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="weight"
                                              value={processData.weight}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="costByWeight"
                                              value={processData.costByWeight}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                              onBlur={event => {
                                                this.handleProcessBlur();
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="diameter"
                                              value={processData.diameter}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="costByDiameter"
                                              value={processData.costByDiameter}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                              onBlur={event => {
                                                this.handleProcessBlur();
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="length"
                                              value={processData.length}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="costByLength"
                                              value={processData.costByLength}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                              onBlur={event => {
                                                this.handleProcessBlur();
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="width"
                                              value={processData.width}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="costByWidth"
                                              value={processData.costByWidth}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                              onBlur={event => {
                                                this.handleProcessBlur();
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="depth"
                                              value={processData.depth}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="costByDepth"
                                              value={processData.costByDepth}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                              onBlur={event => {
                                                this.handleProcessBlur();
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="volume"
                                              value={processData.volume}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="costByVolume"
                                              value={processData.costByVolume}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                              onBlur={event => {
                                                this.handleProcessBlur();
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="settingUpTime"
                                              value={processData.settingUpTime}
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              name="costBySettingUpTime"
                                              value={
                                                processData.costBySettingUpTime
                                              }
                                              onChange={event => {
                                                this.handleProcessChange(
                                                  event,
                                                  rowIndex
                                                );
                                              }}
                                              onBlur={event => {
                                                this.handleProcessBlur();
                                              }}
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                        {processData.labourCost &&
                                          processData.labourCost.map(
                                            (labourData, labourIndex) => {
                                              return (
                                                <td>
                                                  <FormGroup>
                                                    <FormControl
                                                      className="br-0"
                                                      type="text"
                                                      name="labourCost"
                                                      value={
                                                        labourData.labourCost
                                                      }
                                                      onChange={event => {
                                                        this.handleProcessLabourChange(
                                                          event,
                                                          labourIndex,
                                                          rowIndex
                                                        );
                                                      }}
                                                      onBlur={event => {
                                                        this.handleProcessBlur();
                                                      }}
                                                    />
                                                    <FormControl.Feedback />
                                                  </FormGroup>
                                                </td>
                                              );
                                            }
                                          )}
                                        <td>
                                          <FormGroup>
                                            <FormControl
                                              className="br-0"
                                              type="text"
                                              readOnly
                                              value={
                                                processData.total &&
                                                processData.total.toFixed(2)
                                              }
                                            />
                                            <FormControl.Feedback />
                                          </FormGroup>
                                        </td>
                                      </tr>,
                                      <tr className="h-10"> </tr>
                                    ];
                                  }
                                )}
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div
                  className={`w100 ${this.state.showCostTable ? '' : 'hide'}`}
                  style={{ marginLeft: 'auto' }}
                >
                  <FormGroup>
                    <ControlLabel className="fw-normal color-light mt10">
                      Subtotal
                    </ControlLabel>
                    <FormControl
                      className="br-0"
                      type="text"
                      readOnly
                      value={
                        this.state.subtotal && this.state.subtotal.toFixed(2)
                      }
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </div>
                <Row className={`${this.state.showCostTable ? '' : 'hide'}`}>
                  <Col sm={6} />
                  <Col sm={6}>
                    <div className="tax-info-wrap">
                      <Table className="m-b-0">
                        <thead>
                          <tr>
                            <th />
                            <th className="color-light">Description<i className="text-danger">*</i></th>
                            <th className="color-light">Rate<i className="text-danger">*</i></th>
                            <th className="color-light">Tax</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.outerProcessTax &&
                            this.state.outerProcessTax.map(
                              (processTaxData, rowIndex) => {
                                return (
                                  <tr>
                                    <td className="fw-600">
                                      Tax
                                      {rowIndex + 1}
                                    </td>
                                    <td>
                                      <FormGroup className="mb-0">
                                        <FormControl
                                          className="br-0"
                                          type="text"
                                          name="taxDescription"
                                          value={processTaxData.taxDescription}
                                          onChange={event => {
                                            this.handleProcessTaxChange(
                                              event,
                                              rowIndex
                                            );
                                          }}
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                    </td>
                                    <td>
                                      <FormGroup className="mb-0">
                                        <FormControl
                                          className="br-0"
                                          type="text"
                                          name="taxRate"
                                          value={processTaxData.taxRate}
                                          onChange={event => {
                                            this.handleProcessTaxChange(
                                              event,
                                              rowIndex
                                            );
                                          }}
                                          onBlur={event => {
                                            this.handleProcessTaxBlur(
                                              event,
                                              rowIndex
                                            );
                                          }}
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                    </td>
                                    <td>
                                      <FormGroup className="mb-0">
                                        <FormControl
                                          className="br-0"
                                          type="text"
                                          readOnly
                                          value={
                                            processTaxData.taxCost &&
                                            processTaxData.taxCost.toFixed(2)
                                          }
                                        />
                                        <FormControl.Feedback />
                                      </FormGroup>
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form horizontal>
                      <FormGroup controlId="formHorizontalEmail">
                        <Col
                          componentClass={ControlLabel}
                          sm={4}
                          className="color-light fw-normal text-left"
                        >
                          Currency<i className="text-danger">*</i>:
                        </Col>
                        <Col sm={6}>
                          <FormControl
                            componentClass="select"
                            placeholder="select"
                            className="br-0 s-arrow"
                            value={this.state.currency}
                            name="currency"
                            onChange={this.handleOnChange}
                          >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                          </FormControl>
                        </Col>
                      </FormGroup>
                      <FormGroup controlId="formHorizontalEmail">
                        <Col
                          componentClass={ControlLabel}
                          sm={4}
                          className="color-light fw-normal text-left"
                        >
                          Quotation for Quantity<i className="text-danger">*</i>:
                        </Col>
                        <Col sm={6}>
                          <FormControl
                            className="br-0"
                            type="text"
                            name="quotationForQuantity"
                            value={this.state.quotationForQuantity}
                            onChange={this.handleOnChange}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup controlId="formHorizontalPassword">
                        <Col
                          componentClass={ControlLabel}
                          sm={4}
                          className="color-light fw-normal text-left"
                        >
                          Delivery Lead Time<i className="text-danger">*</i>:
                        </Col>
                        <Col sm={6}>
                          <div className="flex">
                            <FormControl
                              type="text"
                              className="br-0 fw-normal"
                              placeholder=""
                              name="deliveryLeadTime"
                              value={this.state.deliveryLeadTime}
                              onChange={this.handleOnChange}
                            />

                            <FormControl
                              componentClass="select"
                              placeholder="select"
                              className="br-0 s-arrow"
                              name="deliveryLeadTimeUnit"
                              value={this.state.deliveryLeadTimeUnit}
                              onChange={this.handleOnChange}
                              style={{ borderLeft: '0', flex: '1 1 160px' }}
                            >
                              <option value="1">hours</option>
                              <option value="2">days</option>
                              <option value="3">week</option>
                              <option value="4">month</option>
                              <option value="5">year</option>
                            </FormControl>
                            <FormControl
                              componentClass="select"
                              placeholder="select"
                              className="br-0 s-arrow"
                              name="deliveryLeadTimeAfter"
                              value={this.state.deliveryLeadTimeAfter}
                              onChange={this.handleOnChange}
                              style={{ borderLeft: '0', flex: '1 1 410px' }}
                            >
                              <option value="1">After PO Release</option>
                              <option value="2">After Payment</option>
                            </FormControl>
                          </div>
                        </Col>
                      </FormGroup>
                      <FormGroup controlId="formHorizontalPassword">
                        <Col
                          componentClass={ControlLabel}
                          sm={4}
                          className="color-light fw-normal text-left"
                        >
                          Target Date<i className="text-danger">*</i>:
                        </Col>
                        <Col sm={6}>
                          <div className="div-in-box">
                            {moment(this.state.targetDate).format('YYYY/MM/DD')}
                          </div>
                        </Col>
                      </FormGroup>
                      <p className="color-light">Terms and Condition</p>
                      {this.state.termArray &&
                        this.state.termArray.map((item, index) => {
                          return (
                            <p
                              className="terms-pt flex align-center"
                              key={index}
                            >
                              <span>{index + 1}.</span>{' '}
                              <FormControl
                                type="text"
                                name="term"
                                value={item}
                                onChange={e => {
                                  this.handleTermChange(index, e);
                                }}
                              />
                            </p>
                          );
                        })}
                      <div className=" mb-30 mt-15">
                        <span className="cursor-pointer" onClick={this.addTerm}>
                          <span className="ico-add">
                            <svg>
                              <use xlinkHref={`${Sprite}#plus-OIco`} />
                            </svg>
                          </span>
                          &nbsp;Add more Terms
                        </span>
                      </div>
                    </Form>
                  </Col>
                  <Col
                    sm={6}
                    className={`${this.state.showCostTable ? '' : 'hide'}`}
                  >
                    {' '}
                    <div className="text-right m-b-20">
                      <div className="total-box">
                        <Table responsive className="m-b-0">
                          <tbody>
                            <tr>
                              <td>Total Process:</td>
                              <td className="w-125">
                                <FormGroup>
                                  <FormControl
                                    className="br-0"
                                    type="text"
                                    readOnly
                                    value={
                                      this.state.totalProcess &&
                                      this.state.totalProcess.toFixed(2)
                                    }
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                            </tr>
                            <tr>
                              <td>Packaging<i className="text-danger">*</i>:</td>
                              <td>
                                <FormGroup>
                                  <FormControl
                                    className="br-0"
                                    type="text"
                                    name="packagingCost"
                                    onChange={event =>
                                      this.handlePckLogChange(event)
                                    }
                                    onBlur={this.handlePckLogBlur}
                                    value={this.state.packagingCost}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                            </tr>
                            <tr>
                              <td>Logistics<i className="text-danger">*</i>:</td>
                              <td>
                                <FormGroup>
                                  <FormControl
                                    className="br-0"
                                    type="text"
                                    name="logisticsCost"
                                    onChange={event =>
                                      this.handlePckLogChange(event)
                                    }
                                    onBlur={this.handlePckLogBlur}
                                    value={this.state.logisticsCost}
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                            </tr>
                            <tr>
                              <td>Grand Total:</td>
                              <td>
                                <FormGroup>
                                  <FormControl
                                    className="br-0"
                                    type="text"
                                    readOnly
                                    value={
                                      this.state.grandTotal &&
                                      this.state.grandTotal.toFixed(2)
                                    }
                                  />
                                  <FormControl.Feedback />
                                </FormGroup>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="text-center p-30">
                  <span className="text-uppercase cursor-pointer">
                    <span className="ico-eye">
                      <svg>
                        <use xlinkHref={`${Sprite}#eyeIco`} />
                      </svg>
                    </span>
                    <spab
                      onClick={() => {
                        const list = this.submitQuotation;
                        this.handlePartDetailReview(list);
                      }}
                    >
                      &nbsp; Preview quotation
                    </spab>
                  </span>
                </div>
                <div className="text-center m-b-20">
                  <Link to="home" className="btn btn-default text-uppercase">
                    cancel
                  </Link>
                  {/* <button
                    className={`btn btn-success text-uppercase ${
                      this.state.showSaveButton ? '' : 'hide'
                    }`}
                    onClick={this.submitQuotation}
                  >
                    save
                  </button>
                  <button
                    className={`btn btn-success text-uppercase ${
                      this.state.showUpdateButton ? '' : 'hide'
                    }`}
                    onClick={this.updateQuotation}
                  >
                    Update
                  </button> */}
                  <button
                    className={`btn btn-success text-uppercase ${
                      this.state.showUpdateButton ? '' : 'hide'
                    }`}
                    onClick={this.updateQuotation}
                    //to="/supplier/home"
                  >
                    Update
                  </button>
                  {!this.state.toolClicked || !this.state.costClicked ? (
                    <button
                      className={`btn btn-success text-uppercase ${
                        this.state.showSaveButton ? '' : 'hide'
                      }`}
                      disabled={this.state.disableSave}
                      onClick={this.submitQuotation}
                    >
                      save
                    </button>
                  ) : (
                    <button
                      className={`btn btn-success text-uppercase ${
                        this.state.showSaveButton ? '' : 'hide'
                      }`}
                      disabled={this.state.disableSave}
                      onClick={this.submitQuotation}
                     // to="/supplier/home"
                    >
                      save
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <Modal
                show={this.state.submitModal}
                onHide={this.closeModal}
                className="custom-popUp"
                bsSize="small"
              >
                {/* <Modal.Header closeButton>
                  <Modal.Title />
                </Modal.Header> */}
                <Modal.Body>
                  <center>
                    <h5>
                      Please fill tool and cost detail by clicking on add
                      button.
                    </h5>
                    <button
                      className="btn btn-default "
                      onClick={() => {
                        this.closeModal();
                      }}
                    >
                     Close
                    </button>
                  </center>
                </Modal.Body>
              </Modal>
            </div>
            <div>
              <Modal
                show={this.state.showPreview}
                onHide={this.handleReviewClose}
                className="custom-popUp modal-xl"
                bsSize="large"
              >
                <Modal.Header>
                  <div className="flex justify-space-between">
                    <h4>Quotation Preview</h4>
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
                      </span>
                      <button
                        onClick={this.handleReviewClose}
                        className="btn btn-link text-uppercase color-light"
                      >
                        close
                      </button>
                    </div>
                  </div>
                </Modal.Header>
                <Modal.Body>
                  <div ref={el => (this.componentRef = el)}>
                    <div className="container-fluid">
                      <div className="flex align-center justify-space-between b-bottom border-light m-b-20">
                        <h4 className="hero-title">Create Quotation</h4>
                      </div>
                      <div className="m-b-30">
                        <Table className="no-border-table">
                          <tbody>
                            <tr>
                              <td>
                                {' '}
                                {this.props.userInfo &&
                                this.props.userInfo.userData.companyLogo ? (
                                  <div className="brand">
                                    <img
                                      src={
                                        this.props.userInfo &&
                                        this.props.userInfo.userData.companyLogo
                                      }
                                      className="obj-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="brand">
                                    <img src={Image1} className="obj-cover" />
                                  </div>
                                )}
                                <div className="company-info">
                                  <Table className="">
                                    <tbody>
                                      <tr>
                                        <td>Supplier:</td>
                                        <td>
                                          {' '}
                                          {this.props.userInfo &&
                                            this.props.userInfo.userData
                                              .companyName}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Contact:</td>
                                        <td>
                                          {this.props.userInfo &&
                                          this.props.userInfo.userData.fullname
                                            ? this.props.userInfo.userData.fullname.trim()
                                            : ''}
                                          ,&nbsp;
                                          {this.props.userInfo &&
                                          this.props.userInfo.userData.contactNo
                                            ? this.props.userInfo.userData.contactNo.trim()
                                            : ''}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </div>
                              </td>
                              <td>
                                {' '}
                                {this.state.reviewPartQuotationData
                                  .buyerResponse &&
                                this.state.reviewPartQuotationData.buyerResponse
                                  .companyLogo ? (
                                  <div className="brand">
                                    <img
                                      src={
                                        this.state.reviewPartQuotationData
                                          .buyerResponse &&
                                        this.state.reviewPartQuotationData
                                          .buyerResponse.companyLogo
                                      }
                                      className="obj-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="brand">
                                    <img src={Image1} className="obj-cover" />
                                  </div>
                                )}
                                <div className="company-info">
                                  <Table className="">
                                    <tbody>
                                      <tr>
                                        <td>Buyer:</td>
                                        <td>
                                          {' '}
                                          {this.state.reviewPartQuotationData
                                            .buyerResponse &&
                                            this.state.reviewPartQuotationData
                                              .buyerResponse.companyName}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Contact:</td>
                                        <td>
                                          {this.state.buyerDetailResponse &&
                                            this.state.buyerDetailResponse
                                              .firstName}{' '}
                                          {this.state.buyerDetailResponse &&
                                            this.state.buyerDetailResponse
                                              .lastName}
                                          ,{' '}
                                          {this.state.buyerDetailResponse &&
                                            this.state.buyerDetailResponse
                                              .mobile}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>

                      <div>
                        {/* className={` ${this.state.showToolTable ? '' : 'hide'}`} */}
                        <div>
                          <div className="flex justify-space-between">
                            {this.state.showProtoToolHeading ? (
                              <h4 className="">Proto Tool</h4>
                            ) : this.state.showProdToolHeading ? (
                              <h4 className="">Production Tool</h4>
                            ) : null}

                            <div />
                          </div>
                          <Row
                            className={`show-grid ${
                              this.state.showToolTable ? '' : 'hide'
                            }`}
                          >
                            <Col md={12}>
                              <div>
                                <Table
                                  bordered
                                  responsive
                                  className="custom-table print-table"
                                >
                                  <thead>
                                    <tr>
                                      <th>Description</th>
                                      <th>Source (Country)</th>
                                      <th>Specification</th>
                                      <th>Tool Life (qty)</th>
                                      <th>Unit Cost</th>
                                      <th>Quantity</th>
                                      <th>Total Cost</th>
                                      {this.state.listOfQuotationTool[0].listOfTaxDetails.map(
                                        (item, index) => {
                                          return [
                                            <th>
                                              Tax
                                              {index + 1} Description
                                            </th>,
                                            <th>
                                              Tax
                                              {index + 1} Rate
                                            </th>,
                                            <th>
                                              Tax
                                              {index + 1}{' '}
                                            </th>
                                          ];
                                        }
                                      )}
                                      <th>Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.listOfQuotationTool &&
                                      this.state.listOfQuotationTool.map(
                                        (toolData, rowIndex) => {
                                          return [
                                            <tr key={rowIndex}>
                                              <td>{toolData.description}</td>
                                              <td>{toolData.sourceCountry}</td>
                                              <td>
                                                {toolData.specificationNo}
                                              </td>
                                              <td>
                                                {toolData.toolLifeQuantity}
                                              </td>
                                              <td>{toolData.unitCost}</td>
                                              <td>{toolData.quantity}</td>
                                              <td>{toolData.totalCost}</td>
                                              {toolData.listOfTaxDetails.map(
                                                (taxData, taxIndex) => {
                                                  return [
                                                    <td>
                                                      {taxData.taxDescription}
                                                    </td>,
                                                    <td>{taxData.taxRate}</td>,
                                                    <td>
                                                      {taxData.taxCost &&
                                                        taxData.taxCost.toFixed(
                                                          2
                                                        )}
                                                    </td>
                                                  ];
                                                }
                                              )}
                                              <td>
                                                {toolData.total &&
                                                  toolData.total.toFixed(2)}
                                              </td>
                                            </tr>
                                          ];
                                        }
                                      )}

                                    <tr>
                                      <td>Total</td>
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td>
                                        {this.state.toolTotalCost &&
                                          this.state.toolTotalCost.toFixed(2)}
                                      </td>
                                      {this.state.listOfQuotationTool[0].listOfTaxDetails.map(
                                        (item, index) => {
                                          return [
                                            <td> </td>,
                                            <td> </td>,
                                            <td>
                                              {this.state.taxArray &&
                                                this.state.taxArray[index] &&
                                                this.state.taxArray[
                                                  index
                                                ].toFixed(2)}
                                            </td>
                                          ];
                                        }
                                      )}
                                      <td>
                                        {this.state.finalToolTotal &&
                                          this.state.finalToolTotal.toFixed(2)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </div>
                            </Col>
                          </Row>
                        </div>
                        <div>
                          <div className="flex justify-space-between">
                            {this.state.showProtoCostHeading ? (
                              <h4 className="">Proto Part</h4>
                            ) : this.state.showProdCostHeading ? (
                              <h4 className="">Production Part</h4>
                            ) : null}
                            <div />
                          </div>
                          {this.state.showProtoCostHeading ? (
                            <h5 className="">Raw Material</h5>
                          ) : this.state.showProdCostHeading ? (
                            <h5 className="">Raw Material</h5>
                          ) : null}

                          <Row
                            className={`show-grid ${
                              this.state.showCostTable ? '' : 'hide'
                            }`}
                          >
                            <Col md={12}>
                              <div>
                                <Table
                                  bordered
                                  responsive
                                  className="custom-table print-table"
                                >
                                  <thead>
                                    <tr>
                                      <th>Description</th>
                                      <th>Source (Country)</th>
                                      <th>Specification</th>
                                      <th>Units</th>
                                      <th>Gross Qty</th>
                                      <th>Finished Qty</th>
                                      <th>Raw Material Rate</th>
                                      <th>Scrap Qty</th>
                                      <th>Scrap Rate</th>
                                      <th>Scrap Recovery</th>
                                      <th>Final Raw Material Rate</th>
                                      {this.state.listOfQuotationCost[0].listOfTaxDetails.map(
                                        (item, index) => {
                                          return [
                                            <th>
                                              Tax
                                              {index + 1} Description
                                            </th>,
                                            <th>
                                              Tax
                                              {index + 1} Rate
                                            </th>,
                                            <th>
                                              Tax
                                              {index + 1}{' '}
                                            </th>
                                          ];
                                        }
                                      )}
                                      <th>Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.listOfQuotationCost &&
                                      this.state.listOfQuotationCost.map(
                                        (costData, rowIndex) => {
                                          return [
                                            <tr key={rowIndex}>
                                              <td>{costData.description}</td>
                                              <td>{costData.sourceCountry}</td>
                                              <td>
                                                {costData.specificationNo}
                                              </td>
                                              <td>{costData.units}</td>
                                              <td>{costData.grossQty}</td>
                                              <td>{costData.finishedQty}</td>
                                              <td>
                                                {costData.rawMaterialRate}
                                              </td>
                                              <td>
                                                <FormGroup>
                                                  {costData.scrapQty}

                                                  <FormControl.Feedback />
                                                </FormGroup>
                                              </td>
                                              <td>{costData.scrapRate}</td>
                                              <td>{costData.scrapRecovery}</td>
                                              <td>
                                                {costData.finalRawMaterialRate}
                                              </td>
                                              {costData.listOfTaxDetails.map(
                                                (taxData, taxIndex) => {
                                                  return [
                                                    <td>
                                                      {taxData.taxDescription}
                                                    </td>,
                                                    <td>{taxData.taxRate}</td>,
                                                    <td>
                                                      {taxData.taxCost &&
                                                        taxData.taxCost.toFixed(
                                                          2
                                                        )}
                                                    </td>
                                                  ];
                                                }
                                              )}
                                              <td>
                                                {costData.totalCost &&
                                                  costData.totalCost.toFixed(2)}
                                              </td>
                                            </tr>
                                          ];
                                        }
                                      )}

                                    <tr>
                                      <td>Total</td>
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td>
                                        {this.state.finalRawMaterialRate &&
                                          this.state.finalRawMaterialRate.toFixed(
                                            2
                                          )}
                                      </td>
                                      {this.state.listOfQuotationCost[0].listOfTaxDetails.map(
                                        (item, index) => {
                                          return [
                                            <td> </td>,
                                            <td> </td>,
                                            <td>
                                              {this.state.taxCostArray &&
                                                this.state.taxCostArray[
                                                  index
                                                ] &&
                                                this.state.taxCostArray[
                                                  index
                                                ].toFixed(2)}
                                            </td>
                                          ];
                                        }
                                      )}
                                      <td>
                                        {this.state.finalCostTotal &&
                                          this.state.finalCostTotal.toFixed(2)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        <div
                          className={` ${
                            this.state.showCostTable ? '' : 'hide'
                          }`}
                        >
                          <div className="flex justify-space-between">
                            <h5 className="">Process / Operation</h5>
                            <div />
                          </div>
                          <Row className="show-grid">
                            <Col md={12}>
                              <div>
                                <Table
                                  bordered
                                  responsive
                                  className="custom-table print-table"
                                >
                                  <thead>
                                    <tr>
                                      <th>Machine/Tool/Equipment</th>
                                      <th>Speed</th>
                                      <th>Feed</th>
                                      <th>Time</th>
                                      <th>Cost/Time</th>
                                      <th>Weight</th>
                                      <th>Cost/Weight</th>
                                      <th>Diameter</th>
                                      <th>Cost/Diameter</th>
                                      <th>Length</th>
                                      <th>Cost/Length</th>
                                      <th>Width</th>
                                      <th>Cost/Width</th>
                                      <th>Depth</th>
                                      <th>Cost/Depth</th>
                                      <th>Volume</th>
                                      <th>Cost/Volume</th>
                                      <th>Setting up Time</th>
                                      <th>Cost/Setting up Time</th>
                                      {this.state.listOfQuotationProcess[0].labourCost.map(
                                        (item, index) => {
                                          return (
                                            <th key={index}>
                                              Labour
                                              {index + 1}
                                            </th>
                                          );
                                        }
                                      )}

                                      <th>Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.listOfQuotationProcess &&
                                      this.state.listOfQuotationProcess.map(
                                        (processData, rowIndex) => {
                                          return [
                                            <tr key={rowIndex}>
                                              <td>
                                                {processData.descriptionOfTool}
                                              </td>
                                              <td>{processData.speed}</td>

                                              <td>{processData.feed}</td>
                                              <td>{processData.time}</td>
                                              <td>{processData.costByTime}</td>
                                              <td>{processData.weight}</td>
                                              <td>
                                                {processData.costByWeight}
                                              </td>
                                              <td>{processData.diameter}</td>
                                              <td>
                                                {processData.costByDiameter}
                                              </td>
                                              <td>{processData.length}</td>
                                              <td>
                                                {processData.costByLength}
                                              </td>
                                              <td>{processData.width}</td>
                                              <td>{processData.costByWidth}</td>
                                              <td>{processData.depth}</td>
                                              <td>{processData.costByDepth}</td>
                                              <td>{processData.volume}</td>
                                              <td>
                                                {processData.costByVolume}
                                              </td>
                                              <td>
                                                {processData.settingUpTime}
                                              </td>
                                              <td>
                                                {
                                                  processData.costBySettingUpTime
                                                }
                                              </td>
                                              {processData.labourCost &&
                                                processData.labourCost.map(
                                                  (labourData, labourIndex) => {
                                                    return (
                                                      <td key={labourIndex}>
                                                        {labourData.labourCost}
                                                      </td>
                                                    );
                                                  }
                                                )}
                                              <td>
                                                {processData.total &&
                                                  processData.total.toFixed(2)}
                                              </td>
                                            </tr>
                                          ];
                                        }
                                      )}
                                  </tbody>
                                </Table>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                      <div
                        className={`w100 ${
                          this.state.showCostTable ? '' : 'hide'
                        }`}
                        style={{ marginLeft: 'auto' }}
                      >
                        <FormGroup>
                          <ControlLabel className="fw-normal color-light">
                            Subtotal
                          </ControlLabel>
                          {this.state.subtotal &&
                            this.state.subtotal.toFixed(2)}
                        </FormGroup>
                      </div>

                      <Table
                        className={`${this.state.showCostTable ? '' : 'hide'}`}
                      >
                        <tbody>
                          <tr>
                            <td style={{ width: '50%' }}> </td>
                            <td>
                              {' '}
                              <div className="tax-info-wrap">
                                <Table className="m-b-0">
                                  <thead>
                                    <tr>
                                      <th />
                                      <th className="color-light">
                                        Description
                                      </th>
                                      <th className="color-light">Rate</th>
                                      <th className="color-light">Tax</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.outerProcessTax &&
                                      this.state.outerProcessTax.map(
                                        (processTaxData, rowIndex) => {
                                          return (
                                            <tr key={rowIndex}>
                                              <td className="fw-600">
                                                Tax
                                                {rowIndex + 1}
                                              </td>
                                              <td>
                                                {processTaxData.taxDescription}
                                              </td>
                                              <td>{processTaxData.taxRate}</td>
                                              <td>
                                                {processTaxData.taxCost &&
                                                  processTaxData.taxCost.toFixed(
                                                    2
                                                  )}
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )}
                                  </tbody>
                                </Table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </Table>

                      {/* <Row
                        className={`${this.state.showCostTable ? "" : "hide"}`}
                      >
                        <Col sm={6} />
                        <Col sm={6}>
                          <div className="tax-info-wrap">
                            <Table className="m-b-0">
                              <thead>
                                <tr>
                                  <th />
                                  <th className="color-light">Description</th>
                                  <th className="color-light">Rate</th>
                                  <th className="color-light">Tax</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.outerProcessTax &&
                                  this.state.outerProcessTax.map(
                                    (processTaxData, rowIndex) => {
                                      return (
                                        <tr>
                                          <td className="fw-600">
                                            Tax
                                            {rowIndex + 1}
                                          </td>
                                          <td>
                                            {processTaxData.taxDescription}
                                          </td>
                                          <td>{processTaxData.taxRate}</td>
                                          <td>
                                            {processTaxData.taxCost &&
                                              processTaxData.taxCost.toFixed(2)}
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                      </Row> */}

                      <Table>
                        <tbody>
                          <tr>
                            <td style={{ width: '50%' }}>
                              <Table className="no-border-table">
                                <tbody>
                                  <tr>
                                    <td className="color-light">Currency:</td>
                                    <td>{this.state.currency || 'INR'}</td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">
                                      Quotation for Quantity:
                                    </td>
                                    <td> {this.state.quotationForQuantity}</td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">
                                      Delivery Lead Time:
                                    </td>
                                    <td>
                                      <div className="flex">
                                        <FormControl
                                          type="text"
                                          className="br-0 fw-normal"
                                          placeholder=""
                                          name="deliveryLeadTime"
                                          value={this.state.deliveryLeadTime}
                                          onChange={this.handleOnChange}
                                          disabled
                                        />

                                        <FormControl
                                          componentClass="select"
                                          placeholder="select"
                                          className="br-0 s-arrow"
                                          name="deliveryLeadTimeUnit"
                                          value={
                                            this.state.deliveryLeadTimeUnit
                                          }
                                          onChange={this.handleOnChange}
                                          style={{
                                            borderLeft: '0',
                                            flex: '1 1 160px'
                                          }}
                                          disabled
                                        >
                                          <option value="1">hours</option>
                                          <option value="2">days</option>
                                          <option value="3">week</option>
                                          <option value="4">month</option>
                                          <option value="5">year</option>
                                        </FormControl>
                                        <FormControl
                                          componentClass="select"
                                          placeholder="select"
                                          className="br-0 s-arrow"
                                          name="deliveryLeadTimeAfter"
                                          value={
                                            this.state.deliveryLeadTimeAfter
                                          }
                                          onChange={this.handleOnChange}
                                          style={{
                                            borderLeft: '0',
                                            flex: '1 1 410px'
                                          }}
                                          disabled
                                        >
                                          <option value="1">
                                            After PO Release
                                          </option>
                                          <option value="2">
                                            After Payment
                                          </option>
                                        </FormControl>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="color-light">
                                      Target Date:
                                    </td>
                                    <td>
                                      {' '}
                                      <div className="">
                                        {moment(this.state.targetDate).format(
                                          'YYYY/MM/DD'
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </td>

                            <td style={{ width: '50%' }}>
                              <div
                                className={`text-right m-b-20 ${
                                  this.state.showCostTable ? '' : 'hide'
                                }`}
                              >
                                <div className="total-box">
                                  <Table className="m-b-0">
                                    <tbody>
                                      <tr>
                                        <td>Total Process:</td>
                                        <td className="w-125">
                                          {this.state.totalProcess &&
                                            this.state.totalProcess.toFixed(2)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Packaging:</td>
                                        <td>{this.state.packagingCost}</td>
                                      </tr>
                                      <tr>
                                        <td>Logistics:</td>
                                        <td>{this.state.logisticsCost}</td>
                                      </tr>
                                      <tr>
                                        <td>Grand Total111:</td>
                                        <td>
                                          {this.state.grandTotal &&
                                            this.state.grandTotal.toFixed(2)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <h4>Terms and Condition</h4>
                      <table>
                        <tbody>
                          {this.state.termArray &&
                            this.state.termArray.map((item, index) => {
                              return (
                                <tr>
                                  <td>
                                    <span>{index + 1}.</span>
                                  </td>
                                  <td>{item}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
            <footer>
              <button
                className="btn btn-block br-0 btn-toTop text-uppercase"
                onClick={topPosition}
              >
                back to top
              </button>
              <div className="bg-Dgray">
                <div className="footer-container">
                  <div className="p-tags-wrapper flex justify-space-between">
                    <ul className="p-tags">
                      <li>
                        <Link
                          to="home"
                          onClick={() => this.navigateTo('second')}
                        >
                          Review Part for Quotation
                        </Link>
                      </li>

                      <li>
                        <a className="disabled">Quality certification</a>
                      </li>
                      <li>
                        <a className="disabled">Major Account Details</a>
                      </li>
                      <li>
                        <Link to="businessDetails">Business Details</Link>
                      </li>
                    </ul>

                    <ul className="p-tags">
                      <li>
                        <Link className="" to="vendor">
                          Vendor Registration with the Buyer
                        </Link>
                      </li>
                      <li>
                        <a className="disabled">Buyer Criteria</a>
                      </li>
                      <li>
                        <Link
                          to={{
                            pathname: 'home',
                            state: { path: 'third' }
                          }}
                        >
                          Approve Quotation
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={{
                            pathname: 'home',
                            state: { path: 'first' }
                          }}
                        >
                          Dashboard
                        </Link>
                      </li>
                    </ul>

                    <ul className="p-tags">
                      <li>
                        <Link to="addUser">Add Users</Link>
                      </li>
                      <li>
                        <Link to="updatePartStatus">Update Parts Status</Link>
                      </li>
                      <li>
                        <a className="disabled">Download Parts Summary</a>
                      </li>
                      <li>
                        <Link to="infrastructureAudit">
                          Infrastructure Audit
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
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
      actionSubmitQuotation,
      actionSearchQuotation,
      actionUpdateQuotation
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User,
    supplierParts: state.supplierParts,
    supplierData: state.supplierData
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Quotation);
