import React, { Component } from "react";
import {
  Row,
  Col,
  Tab,
  Nav,
  NavItem,
  FormGroup,
  FormControl,
  ControlLabel,
  Navbar,
  MenuItem,
  NavDropdown,
  Form,
  Modal,
  Button,
  Table
} from "react-bootstrap";
const AddUserItem = props => {
  return (
    <div className="gray-card noIco-form padding-set m-b-50">
      <Row className="show-grid">
        <Col md={4}>
          <FormGroup className="group">
            <FormControl type="text" name="companyName" required autoFocus />

            <FormControl.Feedback />
            <span className="highlight" />
            <span className="bar" />
            <ControlLabel>First Name</ControlLabel>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup className="group">
            <FormControl type="text" name="companyName" required autoFocus />

            <FormControl.Feedback />
            <span className="highlight" />
            <span className="bar" />
            <ControlLabel>Last Name</ControlLabel>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup className="group">
            <FormControl type="text" name="companyName" required autoFocus />

            <FormControl.Feedback />
            <span className="highlight" />
            <span className="bar" />
            <ControlLabel>Email Address</ControlLabel>
          </FormGroup>
        </Col>
      </Row>
      <Row className="show-grid">
        <Col md={4}>
          <FormGroup className="group mb-0">
            <FormControl type="text" name="companyName" required autoFocus />

            <FormControl.Feedback />
            <span className="highlight" />
            <span className="bar" />
            <ControlLabel>Mobile Number</ControlLabel>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup className="group mb-0">
            <FormControl type="text" name="companyName" required autoFocus />

            <FormControl.Feedback />
            <span className="highlight" />
            <span className="bar" />
            <ControlLabel>Designation</ControlLabel>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup className="group mb-0">
            <FormControl type="text" name="companyName" required autoFocus />

            <FormControl.Feedback />
            <span className="highlight" />
            <span className="bar" />
            <ControlLabel>User Type</ControlLabel>
          </FormGroup>
        </Col>
      </Row>
      <div className="text-right">
        <button
          className="btn btn-primary right-set text-uppercase"
          onClick={this.props.handleShow}
        >
          Add Approval
        </button>
      </div>
    </div>
  );
};

export default AddUserItem;
