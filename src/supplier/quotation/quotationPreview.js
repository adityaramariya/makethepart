import React from 'react';
import ReactToPrint from 'react-to-print';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  Table,
  ControlLabel,
  Form,
  Button
} from 'react-bootstrap';
import {
  actionLoaderShow,
  actionLoaderHide,
  actionUserLogout
} from '../../common/core/redux/actions';
class QuotationPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('partDetailArray :', this.props.partDetailArray);
    return (
      <div>
        <Table bordered responsive className="custom-table gray-row cell-input">
          <thead>
            <tr>
              <th>Operations</th>
              <th>Decription</th>
              <th>Source (Country)</th>
              <th>Specification</th>
              <th>Tool Life (qty)</th>
              <th>Time</th>
              <th>Length</th>
              <th>Weight</th>
              <th>Rate</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {this.props.partDetailArray &&
              this.props.partDetailArray.map((item, index) => {
                return [
                  <tr>
                    <td>{item.operations}</td>
                    <td>
                      {this.props.partDetailArray[index]
                        ? this.props.partDetailArray[index].description
                        : ''}
                    </td>
                    <td>
                      {this.props.partDetailArray[index]
                        ? this.props.partDetailArray[index].sourceCountry
                        : ''}
                    </td>
                    <td>
                      {this.props.partDetailArray[index]
                        ? this.props.partDetailArray[index].specification
                        : ''}
                    </td>
                    <td>
                      {this.props.partDetailArray[index]
                        ? this.props.partDetailArray[index].toolLife
                        : ''}
                    </td>
                    <td>
                      {this.props.partDetailArray[index]
                        ? this.props.partDetailArray[index].time
                        : ''}
                    </td>
                    <td>
                      {this.props.partDetailArray[index]
                        ? this.props.partDetailArray[index].length
                        : ''}
                    </td>
                    <td>
                      {this.props.partDetailArray[index]
                        ? this.props.partDetailArray[index].weight
                        : ''}
                    </td>
                    <td>
                      {this.props.partDetailArray[index]
                        ? this.props.partDetailArray[index].rate
                        : ''}
                    </td>
                    <td>
                      {this.props.partDetailArray[index]
                        ? this.props.partDetailArray[index].quantity
                        : ''}
                    </td>
                    <td>
                      {this.props.partDetailArray[index]
                        ? this.props.partDetailArray[index].price
                        : ''}
                    </td>
                    <td>
                      {this.props.partDetailArray[index]
                        ? this.props.partDetailArray[index].comments
                        : ''}
                    </td>
                  </tr>,
                  <tr />
                ];
              })}
            <tr>
              <td>Tool Cost</td>
              <td colSpan="2">{this.props.toolCost}</td>
            </tr>
            <tr>
              <td>Subtotal</td>
              <td colSpan="2">{this.props.subtotal}</td>
            </tr>

            {this.props.packagingArray &&
              this.props.packagingArray.map((item, index) => {
                return [
                  <tr>
                    <td>{item.operations}</td>
                    <td colSpan="2">
                      {this.props.packagingArray[index]
                        ? this.props.packagingArray[index].detail
                        : ''}
                    </td>
                  </tr>,
                  <tr />
                ];
              })}
            <tr>
              <td className="fw-800">Total</td>
              <td colSpan="2">{this.props.totalPrice}</td>
            </tr>
          </tbody>
        </Table>
      </div>
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

const mappropsToProps = props => {
  return {
    userInfo: props.User
  };
};

export default connect(
  mappropsToProps,
  mapDispatchToProps
)(QuotationPreview);
