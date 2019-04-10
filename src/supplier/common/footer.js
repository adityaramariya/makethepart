import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Nav, NavItem, Navbar, MenuItem, NavDropdown } from 'react-bootstrap';

import Images from '../../img/logo.png';
import userImage from '../../img/user.jpg';
import Sprite from '../../img/sprite.svg';
import {
  actionLoaderShow,
  actionLoaderHide,
  actionUserLogout
} from '../../common/core/redux/actions';
import { topPosition } from "../../common/commonFunctions";
class SupplierFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlParam: window.location.pathname ? window.location.pathname.split('/').pop():''
    };
    this.handleLogout = this.handleLogout.bind(this);

  }

  componentWillMount(){

  }

  handleLogout() {
    let _this = this;
    this.props.actionLoaderShow();
    this.props
      .actionUserLogout()
      .then((result, error) => {
        _this.props.actionLoaderHide();
      })
      .catch(e => _this.props.actionLoaderHide());



  }

  render() {
    return (
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
                      <a className="disabled">Dashboard</a>
                    </li>

                    <li>
                      <a className="disabled">Quality certification</a>
                    </li>
                    <li>
                      <a className="disabled">Major Account Details</a>
                    </li>
                  </ul>

                  <ul className="p-tags">
                    <li>
                      <a onClick={this.tabCheckSecond}>
                        Review part for Quotation
                      </a>
                    </li>
                    <li>
                      <a onClick={this.tabCheckThird}>Approve Quotation</a>
                    </li>
                    <li>
                      <a className="disabled">Buyer Criteria</a>
                    </li>
                  </ul>

                  <ul className="p-tags">
                  <li>
                      <Link to="ppap">PPAP {this.state.urlParam}</Link>
                    </li>
                    <li>
                      <Link to="addUser">Add Users</Link>
                    </li>
                    <li>
                      <Link to="updatePartStatus">Update Parts Status</Link>
                    </li>
                    <li>
                      <a className="disabled">Download Parts Summary</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionLoaderShow,
      actionLoaderHide,
      actionUserLogout
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.User
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SupplierFooter);
