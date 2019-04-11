import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Header from "../common/header";
import SideBar from "../common/sideBar";
import Footer from "../common/footer";
import CONSTANTS from "../../common/core/config/appConfig";

import UserRoleData from './userRole-data';

let { permissionConstant } = CONSTANTS;

let tableHeader = [
    {
        key: '1',
        tableHeading:  'Admin'
    },

    {
        key: '2',
        tableHeading:  'Desinger'
    },

    {
        key: '3',
        tableHeading:  'Designer Approver'
    },

    {
        key: '4',
        tableHeading:  'Engineering Manager'
    }
];


let tableBody = [
    {
        key: '1',
        tableBody:  'Admin'
    },
    {
        key: '2',
        tableBody:  'Admin'
    },
    {
        key: '3',
        tableBody:  'Admin'
    },
    {
        key: '4',
        tableBody:  'Admin'
    }
];




class UserRole extends Component {
    render(){
        return(
            <div>
                <Header {...this.props} />
                <SideBar />
                <div className="content-body flex">
                    <div className="content">
                        <div className="container-fluid">
                            <div className="m-t-20 flex justify-space-between align-center">
                                <h4 className="hero-title">User Roles and Actions</h4>
                                <Button>Add Roles</Button>
                            </div>
                            <UserRoleData tableHeader={tableHeader} tableBody={tableBody} />
                            <div className="text-center m-b-20 m-t-20">
                                <Button className="btn-success">Cancel</Button>
                                <Button>Save</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer
                    pageTitle={permissionConstant.footer_title.build_plan_eco}
                />
            </div>
        )
    }

}

export default UserRole;