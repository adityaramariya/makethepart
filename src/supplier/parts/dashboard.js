import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import * as moment from 'moment';
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import {
  actionLoaderHide,
  actionLoaderShow
} from "../../common/core/redux/actions";
import { topPosition } from "../../common/commonFunctions";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.tabCheckThird = this.tabCheckThird.bind(this);
    this.tabCheckSecond = this.tabCheckSecond.bind(this);
  }

  //   componentDidMount() {
  //     let _this = this;
  //     const userId = this.props.userInfo.userData.id;
  //     const roleId = this.props.userInfo.userData.userRole;
  //     this.props.actionLoaderShow();
  //     this.props
  //       .actionPendingApprovalPartList({ userId, roleId })
  //       .then((result, error) => {
  //         _this.props.actionLoaderHide();
  //       })
  //       .catch(e => _this.props.actionLoaderHide());
  //   }

  tabCheckThird() {
    this.props.tabCheckThird("third");
  }

  tabCheckSecond() {
    this.props.tabCheckSecond("second");
  }

  render() {
    return (
      <div className="">
        <div className="content-body flex">
          <div className="content">
            <div className="container-fluid">
              <div className="flex align-center justify-space-between">
                <h4 className="hero-title">My Dashboard</h4>
                {/* <div className="filter-in">
                  <Form inline>
                    <FormGroup controlId="formInlineName">
                      <ControlLabel>Search:</ControlLabel>
                      <FormControl type="text" placeholder="Search any part" />
                      <span className="ico-search">
                        <svg>
                          <use xlinkHref={`${Sprite}#searchIco`} />
                        </svg>
                      </span>
                    </FormGroup>
                  </Form>
                </div> */}
              </div>

              <div className="m-b-30">
                <Table bordered responsive hover className="custom-table">
                  <thead>
                    <tr>
                      <th>Buyer Company Name</th>
                      <th>Program Code</th>
                      <th>Parts Submitted</th>
                      <th>Parts Deleted</th>
                      <th>Parts Quoted</th>
                      <th>Parts Ordered</th>
                      <th>Parts Delivered</th>
                      <th>Parts in Transit</th>
                      <th>Parts Rejected</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="r-caret red" />
                        ABC
                      </td>
                      <td>RR5485</td>
                      <td>78</td>
                      <td>8</td>
                      <td>78</td>
                      <td>12</td>
                      <td>6</td>
                      <td>5</td>
                      <td>3</td>
                    </tr>
                    <tr />
                    <tr>
                      <td>
                        <span className="r-caret green" />
                        ABC
                      </td>
                      <td>RR5485</td>
                      <td>78</td>
                      <td>8</td>
                      <td>78</td>
                      <td>12</td>
                      <td>6</td>
                      <td>5</td>
                      <td>3</td>
                    </tr>
                    <tr />
                    <tr>
                      <td>
                        <span className="r-caret blue" />
                        ABC
                      </td>
                      <td>RR5485</td>
                      <td>78</td>
                      <td>8</td>
                      <td>78</td>
                      <td>12</td>
                      <td>6</td>
                      <td>5</td>
                      <td>3</td>
                    </tr>
                    <tr />
                    <tr>
                      <td>
                        <span className="r-caret yellow" />
                        ABC
                      </td>
                      <td>RR5485</td>
                      <td>78</td>
                      <td>8</td>
                      <td>78</td>
                      <td>12</td>
                      <td>6</td>
                      <td>5</td>
                      <td>3</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
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
                      <a onClick={this.tabCheckSecond}>
                        Review part for Quotation
                      </a>
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
                      <a onClick={this.tabCheckThird}>Approve Quotation</a>
                    </li>
                    <li>
                      <a className="disabled">My Dashboard</a>
                    </li>
                  </ul>

                  <ul className="p-tags">
                    {this.props.userInfo.userData.isAdmin ? (
                      <li>
                        <Link to="addUser">Add Users</Link>
                      </li>
                    ) : null}

                    <li>
                      <Link to="updatePartStatus">Update Parts Status</Link>
                    </li>
                    <li>
                      <a className="disabled">Download Parts Summary</a>
                    </li>
                    <li>
                      <Link to="infrastructureAudit">Infrastructure Audit</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionLoaderHide,
      actionLoaderShow
    },
    dispatch
  );
};

const mapStateToProps = state => {
  console.log(state);
  return {
    userInfo: state.User,
    supplierData: state.supplierData
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
