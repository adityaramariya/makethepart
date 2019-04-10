import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  Alert
} from "react-bootstrap";
import Geosuggest from "react-geosuggest";
import PhoneInput from "react-phone-number-input";
import validation from "react-validation-mixin";
import strategy, { validator } from "react-validatorjs-strategy";
import classnames from "classnames";

import "react-phone-number-input/rrui.css";
import "react-phone-number-input/style.css";
import Sprite from "../../img/sprite.svg";
import Logo from "../../img/logo.png";
import CONSTANTS from "../core/config/appConfig";
import { renderMessage, showErrorToast } from "../commonFunctions";

let { validationMessages } = CONSTANTS;
let { regExpressions } = CONSTANTS;

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.contactPersonObject = {
      fullName: "",
      firstName: "",
      lastName: "",
      password: "",
      userProfile: "",
      mobile: "",
      email: "",
      accessToken: "",
      isEnabled: false,
      profileImageURL: "",
      isPrimaryUser: false,
      emailOTP: 0,
      mobileOTP: 0,
      creatorUserId: "",
      roleId: 0,
      createdTimestamp: 0,
      lastUpdatedTimestamp: 0,
      userType: "",
      listOfBuyerApproval: [""]
    };

    this.addressObject = {
      address: "",
      phone: "",
      latitude: 0,
      longitude: 0,
      city: "",
      country: "",
      state: "",
      zipcode: "",
      flag: 0,
      createdTimestamp: 0,
      lastUpdatedTimestamp: 0,
      locationId: ""
    };

    this.state = {
      companyName: "",
      name: "",
      address: "",
      address1: "",
      address2: "",
      address3: "",
      address4: "",
      address5: "",
      address6: "",
      address7: "",
      primaryName: "",
      primaryContact: "",
      primaryDesignation: "",
      primaryEmail: "",
      error: "",
      creatAccountBtnDisabled: true,
      acceptTermsCondition: false,
      contactPersonArray: [{ ...this.contactPersonObject }],
      addressArray: [{ ...this.addressObject }],
      countryCode: "IN",
      maxContactPerson: 5
    };

    this.acceptTermsCondition = this.acceptTermsCondition.bind(this);
    this.addNewContactPerson = this.addNewContactPerson.bind(this);
    this.removeContactPerson = this.removeContactPerson.bind(this);
    this.applyValidation = this.applyValidation.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.handleAddressSelect = this.handleAddressSelect.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOfContant = this.handleChangeOfContant.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.validateData = this.validateData.bind(this);

    this.applyValidation();
  }
  componentDidMount() {
    for (let index = 0; index < this.state.maxContactPerson; index++) {
      this.setState({
        ["mobile" + index]: "",
        ["fullName" + index]: "",
        ["email" + index]: "",
        ["userProfile" + index]: ""
      });
    }
  }

  acceptTermsCondition() {
    this.setState(
      (prevState, props) => ({
        acceptTermsCondition: !prevState.acceptTermsCondition
      }),
      () => {
        this.props.validate("acceptTermsCondition");
      }
    );
  }
  removeContactPerson() {
    let addMoreContactList = this.state.contactPersonArray;
    if (addMoreContactList.length > 1) {
      addMoreContactList.pop();
      this.setState({ contactPersonArray: addMoreContactList });
    }
  }

  addNewContactPerson() {
    let addMoreContactList = this.state.contactPersonArray;
    let lengthArr = addMoreContactList.length - 1;
    if (
      addMoreContactList[lengthArr]["fullName"] === undefined ||
      addMoreContactList[lengthArr]["fullName"] === "" ||
      addMoreContactList[lengthArr]["mobile"] === undefined ||
      addMoreContactList[lengthArr]["mobile"] === "" ||
      addMoreContactList[lengthArr]["userProfile"] === undefined ||
      addMoreContactList[lengthArr]["userProfile"] === "" ||
      addMoreContactList[lengthArr]["email"] === undefined ||
      addMoreContactList[lengthArr]["email"] === "" ||
      addMoreContactList[lengthArr]["userType"] === undefined
    ) {
      showErrorToast("Please enter all primary contact detail first");
      return false;
    }
    if (this.state.contactPersonArray.length < this.state.maxContactPerson) {
      this.setState(
        (prevState, props) => ({
          contactPersonArray: [
            ...prevState.contactPersonArray,
            JSON.parse(JSON.stringify(this.contactPersonObject))
          ]
        }),
        () => this.applyValidation()
      );
    }
  }

  applyValidation(addressCount) {
    let _this = this;
    let contactPersonCount = this.state.contactPersonArray.length;
    let fieldObject = {
      companyName: ["required", "regex:" + regExpressions.alphaOnly],
      acceptTermsCondition: "termsCondition",
      address1: "required",
      address2: "addressOptional",
      address3: "addressOptional",
      address4: "addressOptional",
      address5: "addressOptional",
      address6: "addressOptional",
      address7: "addressOptional"
    };

    let errorMessage = {
      "required.companyName": validationMessages.companyName.required,
      "regex.companyName": validationMessages.companyName.alphaOnly,
      "required.address1": validationMessages.address.required,
      "regex.address1": validationMessages.address.alphaOnly,
      "required.fullName": validationMessages.fullName.required,
      "regex.fullName": validationMessages.fullName.alphaOnly
    };

    for (let index = 0; index < contactPersonCount; index++) {
      fieldObject["mobile" + index] = "required|min:10|max:14";
      fieldObject["fullName" + index] = "required";
      fieldObject["email" + index] = "required|email";
      fieldObject["userProfile" + index] = "required";

      errorMessage["required.email" + index] =
        validationMessages.email.required;
      errorMessage["email.email" + index] = validationMessages.email.invalid;
      errorMessage["required.userProfile" + index] =
        validationMessages.userProfile.required;
      errorMessage["required.fullName" + index] =
        validationMessages.fullName.required;
      errorMessage["required.mobile" + index] =
        validationMessages.mobile.required;

      errorMessage["min.mobile" + index] = validationMessages.mobile.min;
      errorMessage["max.mobile" + index] = validationMessages.mobile.max;
    }

    this.validatorTypes = strategy.createInactiveSchema(
      fieldObject,
      errorMessage,
      function(validator) {
        let Validator = validator.constructor;
        Validator.registerAsync("termsCondition", function(
          acceptTermsCondition,
          attribute,
          req,
          passes
        ) {
          if (acceptTermsCondition == false)
            passes(false, validationMessages.acceptTermsCondition.required);
          else passes();
        });
        Validator.registerAsync("addressOptional", function(
          address2,
          attribute,
          req,
          passes
        ) {
          let index = parseInt(req.replace("address", "")) - 1;
          let finalAddress = 0;
          try {
            finalAddress = _this.state.addressArray[index].address.trim()
              .length;
          } catch (error) {}

          let length = address2.trim().length;
          if (length == 0) {
            _this.setState((prevState, props) => {
              let _addressArray = [...prevState.addressArray];
              _addressArray.splice(1, 1);
              _addressArray.splice(1, 0, { ..._this.addressObject });
              return { addressArray: _addressArray };
            });
            passes();
          }
          // else if (length > 0 && finalAddress == 0)
          else if (length !== finalAddress)
            passes(false, "Please select address");
          else passes();
        });
        Validator.registerAsync("contactPerson", function(
          address2,
          attribute,
          req,
          passes
        ) {
          passes();
          // let index = parseInt(req.replace('address', '')) - 1;
          // let finalAddress = 0;
          // try {
          //   finalAddress = _this.state.addressArray[index].address.trim()
          //     .length;
          // } catch (error) { }

          // let length = address2.trim().length;
          // if (length == 0) {
          //   _this.setState((prevState, props) => {
          //     let _addressArray = [...prevState.addressArray];
          //     _addressArray.splice(1, 1);
          //     _addressArray.splice(1, 0, { ..._this.addressObject });
          //     return { addressArray: _addressArray };
          //   });
          //   passes();
          // }
          // // else if (length > 0 && finalAddress == 0)
          // else if (length !== finalAddress)
          //   passes(false, 'Please select address');
          // else passes();
        });
      }
    );
  }

  getClasses = field => {
    return classnames({
      error: !this.props.isValid(field)
    });
  };

  getGeoValueByKey(keyName, mapObject) {
    if (mapObject[keyName]) return mapObject[keyName];
    if (mapObject.location && mapObject.location[keyName])
      return mapObject.location[keyName];
    if (mapObject.gmaps && mapObject.gmaps.address_components) {
      for (
        let index = 0;
        index < mapObject.gmaps.address_components.length;
        index++
      ) {
        const element = mapObject.gmaps.address_components[index];
        if (element.types && element.types.indexOf(keyName) !== -1)
          return element.long_name;
      }
    }
    return "";
  }

  getValidatorData = () => {
    return this.state;
  };

  getValidationState(stateName) {
    if (
      this.props.getValidationMessages(stateName) == "" &&
      this.state[stateName] == ""
    )
      return null;
    else if (
      this.props.getValidationMessages(stateName) == "" &&
      this.state[stateName] !== ""
    )
      return "success";
    else if (
      this.props.getValidationMessages(stateName) !== "" &&
      this.state[stateName] !== ""
    )
      return "error";
    else if (
      this.props.getValidationMessages(stateName) !== "" &&
      this.state[stateName] == ""
    )
      return "error";
  }

  handleAddressSelect(elementIndex, suggest) {
    if (!suggest) return;
    try {
      this.setState((prevState, props) => {
        let _addressArray = [...prevState.addressArray];
        if (!(_addressArray.length >= elementIndex))
          _addressArray.push({ ...this.addressObject });
        _addressArray[elementIndex - 1].address = this.getGeoValueByKey(
          "description",
          suggest
        );
        _addressArray[elementIndex - 1].latitude = this.getGeoValueByKey(
          "lat",
          suggest
        );
        _addressArray[elementIndex - 1].longitude = this.getGeoValueByKey(
          "lng",
          suggest
        );
        _addressArray[elementIndex - 1].city = this.getGeoValueByKey(
          "locality",
          suggest
        );
        _addressArray[elementIndex - 1].country = this.getGeoValueByKey(
          "country",
          suggest
        );
        _addressArray[elementIndex - 1].state = this.getGeoValueByKey(
          "administrative_area_level_1",
          suggest
        );
        _addressArray[elementIndex - 1].zipcode = this.getGeoValueByKey(
          "postal_code",
          suggest
        );

        return { addressArray: _addressArray };
      });

      let stateName = "address" + elementIndex;
      this.setState(
        {
          [stateName]: this.getGeoValueByKey("description", suggest)
        },
        () => {
          this.props.handleValidation(stateName);
        }
      );
    } catch (error) {}
  }
  handleAddressChange(elementIndex, value) {
    try {
      let stateName = "address" + elementIndex;
      this.setState(
        {
          [stateName]: value
        },
        () => {
          this.props.handleValidation(stateName);
        }
      );
    } catch (error) {}
  }

  handleBackButton() {
    let path = this.props.location.pathname;
    try {
      switch (path) {
        case "/buyer/signup":
          this.props.history.push("/buyer/signin");
          break;
        case "/supplier/signup":
          this.props.history.push("/supplier/signin");
          break;
        default:
          // this.props.history.push('signin');
          break;
      }
    } catch (error) {}
  }

  handleChange(e) {
    const { name } = e.target;
    const { value } = e.target;

    // const value = String(e.target.value).trim();
    this.setState({ [name]: value });

    // this.validateFields(name, value);
  }

  handleChangeOfContant(index, e, name1) {
    const name = name1 ? name1 : e.target.name;
    const { value } = e.target;

    this.setState({
      [name + index]: value
    });

    this.setState((prevState, props) => {
      const roleId = this.props.userInfo.userType == "buyer" ? 1 : 2;
      if (name == "fullName") {
        let nameArray = value.split(" ");
        prevState.contactPersonArray[index]["firstName"] = nameArray[0] || "";
        prevState.contactPersonArray[index]["lastName"] =
          value.replace(nameArray[0] + " ", "") || "";
        prevState.contactPersonArray[index]["fullName"] = value || "";
      } else {
        prevState.contactPersonArray[index][name] = value || ""; //.trim();
      }
      prevState.contactPersonArray[index]["roleId"] = roleId;
      return {
        contactPersonArray: prevState.contactPersonArray
      };
    });
  }

  handleRegister() {
    let _this = this;
    const roleId = this.props.userInfo.userType == "buyer" ? 1 : 2;
    let data = {
      companyName: this.state.companyName,
      roleId,
      addressRequests: this.state.addressArray,
      companyLogoURL: "",
      listOfUserUserIds: [""],
      createdTimestamp: 0,
      lastUpdatedTimestamp: 0,
      userDetailRequests: this.state.contactPersonArray
    };
    this.props.actionLoaderShow();
    console.log("data", data);
    this.props
      .actionUserRegister(data)
      .then((result, error) => {
        _this.props.actionLoaderHide();
        if (error) return;
        if (result.payload.data.status == 200) {
          _this.props.history.push("signupsuccess");
        }
      })
      .catch(e => _this.props.actionLoaderHide());
  }

  validateData = e => {
    e.preventDefault();
    let _this = this;
    //this.applyValidation();
    this.props.validate(function(error) {
      if (!error) {
        // _this.setState({ isLoading: true });
        _this.handleRegister(e);
      }
    });
  };

  handleLocationId = i => e => {
    const addressArray = [...this.state.addressArray];
    if (!addressArray[i] || !addressArray[i].address) {
      return false;
    }
    if (addressArray[i]) {
      addressArray[i].locationId = e.target.value;
    }
    this.setState({ addressArray });
  };

  render() {
    console.log("this.state", this.state);
    let { userType } = this.props.userInfo;
    userType = userType.toUpperCase();
    return (
      <div className="regContainer in-space-set">
        <div className="logo-area text-center clear-fix">
          <span
            className="ico-return pull-left cursor-pointer"
            onClick={this.handleBackButton}
            title="Go Back to login"
          >
            <svg>
              <use xlinkHref={`${Sprite}#backArrowIco`} />
            </svg>
          </span>
          <img src={Logo} alt="" />
        </div>
        <h5 className="head-main m-40">{userType} REGISTRATION</h5>
        <Row className="show-grid">
          <Col md={6} className="pr-10">
            <FormGroup
              className="group"
              // validationState={this.getValidationState("companyName")}
            >
              <span className="ico-in">
                <svg>
                  <use xlinkHref={`${Sprite}#userIco`} />
                </svg>
              </span>
              <FormControl
                type="text"
                value={this.state.companyName}
                onChange={this.handleChange}
                onBlur={this.props.handleValidation("companyName")}
                name="companyName"
                required
                placeholder="Name of Legal Entity"
              />

              <FormControl.Feedback />
              <span className="highlight" />
              <span className="bar" />

              {/* <ControlLabel>Name of Legal Entity</ControlLabel> */}
              {renderMessage(this.props.getValidationMessages("companyName"))}
            </FormGroup>
          </Col>
          <Col md={6} className="pl-10">
            <FormGroup
              // validationState={this.getValidationState("address1")}
              className="group address-input"
            >
              <span className="ico-in">
                <svg>
                  <use xlinkHref={`${Sprite}#addressIco`} />
                </svg>
              </span>

              <Geosuggest
                ref={el => (this._geoSuggest = el)}
                placeholder="Address"
                onBlur={() => {
                  this.props.handleValidation("address1");
                }}
                onChange={e => {
                  this.handleAddressChange(1, e);
                }}
                inputClassName="form-control"
                name="address1"
                onSuggestSelect={suggest => {
                  this.handleAddressSelect(1, { ...suggest });
                }}
              />
              <FormControl.Feedback />
              <span className="highlight" />
              <span className="bar" />
              {renderMessage(this.props.getValidationMessages("address1"))}
              {/* <ControlLabel>Name of Legal Entity</ControlLabel> */}

              <FormControl
                type="text"
                placeholder="Location Id"
                className="addressId"
                name="locationId0"
                onChange={this.handleLocationId(0)}
                value={
                  this.state.addressArray && this.state.addressArray[0]
                    ? this.state.addressArray[0].locationId
                    : ""
                }
              />

              <FormControl.Feedback />
            </FormGroup>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col md={6} className="pr-10">
            <FormGroup
              validationState={this.getValidationState("address2")}
              className="group address-input"
            >
              <span className="ico-in">
                <svg>
                  <use xlinkHref={`${Sprite}#addressIco`} />
                </svg>
              </span>

              <Geosuggest
                ref={el => (this._geoSuggest = el)}
                placeholder="Alternate Address 1"
                inputClassName="form-control"
                onSuggestSelect={suggest =>
                  this.handleAddressSelect(2, { ...suggest })
                }
                disabled={!(this.state.addressArray.length >= 1)}
                onBlur={() => {
                  this.props.handleValidation("address2");
                }}
                onChange={e => {
                  this.handleAddressChange(2, e);
                }}
                name="address2"
              />
              <FormControl.Feedback />
              <span className="highlight" />
              <span className="bar" />
              {renderMessage(this.props.getValidationMessages("address2"))}
              <FormControl
                type="text"
                placeholder="Location Id"
                className="addressId"
                name="locationId1"
                onChange={this.handleLocationId(1)}
                value={
                  this.state.addressArray && this.state.addressArray[1]
                    ? this.state.addressArray[1].locationId
                    : ""
                }
              />
              <FormControl.Feedback />
            </FormGroup>
          </Col>
          <Col md={6} className="pl-10">
            <FormGroup
              validationState={this.getValidationState("address3")}
              className="group address-input"
            >
              <span className="ico-in">
                <svg>
                  <use xlinkHref={`${Sprite}#addressIco`} />
                </svg>
              </span>

              <Geosuggest
                ref={el => (this._geoSuggest = el)}
                placeholder="Alternate Address 2"
                inputClassName="form-control"
                onSuggestSelect={suggest =>
                  this.handleAddressSelect(3, suggest)
                }
                disabled={!(this.state.addressArray.length >= 2)}
                onBlur={() => {
                  this.props.handleValidation("address3");
                }}
                onChange={e => {
                  this.handleAddressChange(3, e);
                }}
                name="address3"
              />
              <FormControl.Feedback />
              <span className="highlight" />
              <span className="bar" />
              {renderMessage(this.props.getValidationMessages("address3"))}

              <FormControl
                type="text"
                placeholder="Location Id"
                className="addressId"
                name="locationId2"
                onChange={this.handleLocationId(2)}
                value={
                  this.state.addressArray && this.state.addressArray[2]
                    ? this.state.addressArray[2].locationId
                    : ""
                }
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col md={6} className="pr-10">
            <FormGroup
              validationState={this.getValidationState("address4")}
              className="group address-input"
            >
              <span className="ico-in">
                <svg>
                  <use xlinkHref={`${Sprite}#addressIco`} />
                </svg>
              </span>
              <Geosuggest
                ref={el => (this._geoSuggest = el)}
                placeholder="Alternate Address 3"
                inputClassName="form-control"
                name="address"
                onSuggestSelect={suggest =>
                  this.handleAddressSelect(4, suggest)
                }
                disabled={!(this.state.addressArray.length >= 3)}
                onBlur={() => {
                  this.props.handleValidation("address4");
                }}
                onChange={e => {
                  this.handleAddressChange(4, e);
                }}
                name="address4"
              />
              <FormControl.Feedback />
              <span className="highlight" />
              <span className="bar" />
              {renderMessage(this.props.getValidationMessages("address4"))}

              <FormControl
                type="text"
                placeholder="Location Id"
                className="addressId"
                name="locationId3"
                onChange={this.handleLocationId(3)}
                value={
                  this.state.addressArray && this.state.addressArray[3]
                    ? this.state.addressArray[3].locationId
                    : ""
                }
              />
            </FormGroup>
          </Col>
          <Col md={6} className="pl-10">
            <FormGroup
              validationState={this.getValidationState("address5")}
              className="group address-input"
            >
              <span className="ico-in">
                <svg>
                  <use xlinkHref={`${Sprite}#addressIco`} />
                </svg>
              </span>
              <Geosuggest
                ref={el => (this._geoSuggest = el)}
                placeholder="Alternate Address 4"
                inputClassName="form-control"
                name="address"
                onSuggestSelect={suggest =>
                  this.handleAddressSelect(5, suggest)
                }
                disabled={!(this.state.addressArray.length >= 4)}
                onBlur={() => {
                  this.props.handleValidation("address5");
                }}
                onChange={e => {
                  this.handleAddressChange(5, e);
                }}
                name="address5"
              />
              <FormControl.Feedback />
              <span className="highlight" />
              <span className="bar" />
              {renderMessage(this.props.getValidationMessages("address5"))}
              <FormControl
                type="text"
                placeholder="Location Id"
                className="addressId"
                name="locationId4"
                onChange={this.handleLocationId(4)}
                value={
                  this.state.addressArray && this.state.addressArray[4]
                    ? this.state.addressArray[4].locationId
                    : ""
                }
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col md={6} className="pr-10">
            <FormGroup
              validationState={this.getValidationState("address6")}
              className="group address-input"
            >
              <span className="ico-in">
                <svg>
                  <use xlinkHref={`${Sprite}#addressIco`} />
                </svg>
              </span>
              <Geosuggest
                ref={el => (this._geoSuggest = el)}
                placeholder="Alternate Address 5"
                inputClassName="form-control"
                onSuggestSelect={suggest =>
                  this.handleAddressSelect(6, suggest)
                }
                disabled={!(this.state.addressArray.length >= 5)}
                onBlur={() => {
                  this.props.handleValidation("address6");
                }}
                onChange={e => {
                  this.handleAddressChange(6, e);
                }}
                name="address6"
              />
              <FormControl.Feedback />
              <span className="highlight" />
              <span className="bar" />
              {renderMessage(this.props.getValidationMessages("address6"))}
              <FormControl
                type="text"
                placeholder="Location Id"
                className="addressId"
                name="locationId5"
                onChange={this.handleLocationId(5)}
                value={
                  this.state.addressArray && this.state.addressArray[5]
                    ? this.state.addressArray[5].locationId
                    : ""
                }
              />
            </FormGroup>
          </Col>
          <Col md={6} className="pl-10">
            <FormGroup
              validationState={this.getValidationState("address7")}
              className="group address-input"
            >
              <span className="ico-in">
                <svg>
                  <use xlinkHref={`${Sprite}#addressIco`} />
                </svg>
              </span>

              <Geosuggest
                ref={el => (this._geoSuggest = el)}
                placeholder="Alternate Address 6"
                inputClassName="form-control"
                onSuggestSelect={suggest =>
                  this.handleAddressSelect(7, suggest)
                }
                disabled={!(this.state.addressArray.length >= 6)}
                onBlur={() => {
                  this.props.handleValidation("address7");
                }}
                onChange={e => {
                  this.handleAddressChange(7, e);
                }}
                name="address7"
              />
              <FormControl.Feedback />
              <span className="highlight" />
              <span className="bar" />
              {renderMessage(this.props.getValidationMessages("address7"))}
              <FormControl
                type="text"
                placeholder="Location Id"
                className="addressId"
                name="locationId6"
                onChange={this.handleLocationId(6)}
                value={
                  this.state.addressArray && this.state.addressArray[6]
                    ? this.state.addressArray[6].locationId
                    : ""
                }
              />
            </FormGroup>
          </Col>
        </Row>
        <h5 className="head-main m-40">PRIMARY CONTACT PERSON</h5>
        {this.state.contactPersonArray.map((item, index) => {
          const display = index == 0 ? "none" : "block";
          return [
            <h5
              className="head-main m-40"
              style={{ display }}
              key={"h5" + index}
            >
              {" "}
              CONTACT PERSON
            </h5>,
            <Row className="show-grid" key={"cn" + index}>
              <Col md={6} className="pr-10">
                <FormGroup
                  // validationState={this.getValidationState()}
                  className="group"
                >
                  <span className="ico-in">
                    <svg>
                      <use xlinkHref={`${Sprite}#userIco`} />
                    </svg>
                  </span>
                  <FormControl
                    type="text"
                    value={this.state.contactPersonArray[index].fullName}
                    name={`fullName` + index}
                    onChange={e =>
                      this.handleChangeOfContant(index, e, "fullName")
                    }
                    required
                    placeholder="Name"
                  />
                  <FormControl.Feedback />
                  <span className="highlight" />
                  <span className="bar" />
                  {renderMessage(
                    this.props.getValidationMessages("fullName" + index)
                  )}
                  {/* <ControlLabel>Name</ControlLabel> */}
                </FormGroup>
              </Col>
              <Col md={6} className="pl-10">
                <FormGroup
                  // validationState={this.getValidationState()}
                  className="group mobile-input"
                >
                  <span className="ico-in">
                    <svg>
                      <use xlinkHref={`${Sprite}#mobileIco`} />
                    </svg>
                  </span>
                  <PhoneInput
                    placeholder="Mobile number"
                    value={this.state.contactPersonArray[index].mobile}
                    onChange={value =>
                      this.handleChangeOfContant(index, {
                        target: { name: "mobile", value }
                      })
                    }
                    name={`mobile` + index}
                    country={this.state.countryCode}
                  />
                  {renderMessage(
                    this.props.getValidationMessages("mobile" + index)
                  )}
                </FormGroup>
              </Col>
            </Row>,
            <Row className="show-grid" key={"cd" + index}>
              <Col md={6} className="pr-10">
                <FormGroup
                  // validationState={this.getValidationState()}
                  className="group"
                >
                  <span className="ico-in">
                    <svg>
                      <use xlinkHref={`${Sprite}#bagIco`} />
                    </svg>
                  </span>
                  <FormControl
                    type="text"
                    value={this.state.contactPersonArray[index].userProfile}
                    name={`userProfile` + index}
                    onChange={e =>
                      this.handleChangeOfContant(index, e, "userProfile")
                    }
                    required
                    placeholder="User Profile"
                  />

                  <FormControl.Feedback />
                  <span className="highlight" />
                  <span className="bar" />
                  {renderMessage(
                    this.props.getValidationMessages("userProfile" + index)
                  )}
                  {/* <ControlLabel>Designation</ControlLabel> */}
                </FormGroup>
              </Col>
              <Col md={6} className="pl-10">
                <FormGroup
                  // validationState={this.getValidationState()}
                  className="group "
                >
                  <span className="ico-in">
                    <svg>
                      <use xlinkHref={`${Sprite}#envelopIco`} />
                    </svg>
                  </span>
                  <FormControl
                    type="text"
                    value={this.state.contactPersonArray[index].email}
                    onChange={e =>
                      this.handleChangeOfContant(index, e, "email")
                    }
                    ref={element => (this.primaryEmail = element)}
                    name={`email` + index}
                    required
                    placeholder="Email"
                  />

                  <FormControl.Feedback />
                  <span className="highlight" />
                  <span className="bar" />
                  {/* <ControlLabel>Email</ControlLabel> */}
                  {renderMessage(
                    this.props.getValidationMessages("email" + index)
                  )}
                </FormGroup>
              </Col>
            </Row>
          ];
        })}
        <div className="text-right mb-30 mt-15">
          {this.state.contactPersonArray.length === 5 ? null : (
            <span onClick={this.addNewContactPerson} className="cursor-pointer">
              Add more contact&nbsp;
              <span className="ico-add">
                <svg>
                  <use xlinkHref={`${Sprite}#plus-OIco`} />
                </svg>
              </span>
            </span>
          )}
          {this.state.contactPersonArray.length > 1 ? (
            <span onClick={this.removeContactPerson} className="cursor-pointer">
              &nbsp;&nbsp;Remove contact&nbsp;{" "}
              <span className="ico-minusgly"> </span>
            </span>
          ) : null}
        </div>
        <p className="text-center terms color-light mb-30 ">
          <span
            className={`ico-right cursor-pointer ${
              this.state.acceptTermsCondition == true ? "active" : ""
            }`}
            onClick={() => this.acceptTermsCondition()}
          >
            <svg>
              <use xlinkHref={`${Sprite}#rightIco`} />
            </svg>
          </span>
          <span
            onClick={() => this.acceptTermsCondition()}
            className="cursor-pointer"
          >
            Agree to Terms & Conditions
          </span>
          <br />
          {renderMessage(
            this.props.getValidationMessages("acceptTermsCondition")
          )}
        </p>

        <div className="text-center m-40">
          <button
            className="btn btn-primary mw-300 btn-md"
            onClick={this.validateData}
            // disabled={this.state.creatAccountBtnDisabled}
          >
            CREATE ACCOUNT
          </button>
        </div>
      </div>
    );
  }
}
SignUp = validation(strategy)(SignUp);
export default SignUp;
