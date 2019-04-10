import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  Modal,
  Button,
  Table,
  DropdownButton,
  MenuItem,
  ButtonToolbar
} from 'react-bootstrap';
import validation from 'react-validation-mixin';
import strategy, { validator } from 'react-validatorjs-strategy';
import Header from '../common/header';
import {
  actionGetApproverList,
  actionUserLogout,
  actionGenerateOTPToAddUser,
  actionSupplierAddUser,
  actionLoaderHide,
  actionLoaderShow
} from '../../common/core/redux/actions';
import AddUserCommon from '../../common/users/addUser';

class AddUser extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    try {
      const roleId = this.props.userInfo.userData.userRole;
      const userId = this.props.userInfo.userData.id;
      this.props.actionUserLogout({ roleId, userId });
    } catch (error) {}
  }

  render() {
    return (
      <div>
        <section className="">
          <Header {...this.props} />

          <AddUserCommon />
        </section>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionGetApproverList,
      actionUserLogout,
      actionGenerateOTPToAddUser,
      actionSupplierAddUser,
      actionLoaderHide,
      actionLoaderShow
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User,
    supplierUsers: state.supplierUsers
  };
};

AddUser = validation(strategy)(AddUser);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUser);
