import {Table} from "react-bootstrap";
import React, {Component} from "react";

import Checkbox from '../../common/components/checkbox/checkbox'
class UserRoleData extends Component{
    render()
    {
        let headerComponents;
        let bodyComponents;
        headerComponents = this.generateTableHeaders();
        bodyComponents = this.generateTableBody();
        return(
            <Table bordered responsive hover className="custom-table borderbox">
                <thead>
                    <tr>
                        <th><strong>Functions</strong></th>
                        {headerComponents}
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>Admin</td>
                        {bodyComponents}
                    </tr>

                </tbody>
            </Table>
        )
    }

    generateTableHeaders() {
        let tableHeader = this.props.tableHeader;
        return tableHeader.map(function(colData) {
            return <th key={colData.key}> {colData.tableHeading} </th>;
        });
    }

    generateTableBody() {
        let tableBody = this.props.tableBody;
        return tableBody.map(function(colData) {
            return <td key={colData.key}> <Checkbox /> </td>;
        });
    }






}

export default UserRoleData